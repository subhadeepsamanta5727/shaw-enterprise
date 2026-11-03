<?php
require_once __DIR__ . '/environment.php';

function shawAdminSessionStart(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $isSecure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function shawAdminJson(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
}

function shawAdminRoute(string $resource, string $method, ?string $param): bool
{
    if ($resource !== 'admin') {
        return false;
    }

    shawAdminSessionStart();
    $action = $param ?? '';

    if ($action === 'session' && $method === 'GET') {
        shawAdminJson([
            'success' => true,
            'authenticated' => !empty($_SESSION['shaw_admin_authenticated']),
            'email' => $_SESSION['shaw_admin_email'] ?? null,
        ]);
    }

    if ($action === 'login' && $method === 'POST') {
        $expectedEmail = shawEnv('ADMIN_EMAIL');
        $expectedPassword = shawEnv('ADMIN_PASSWORD');
        if (!$expectedEmail || $expectedPassword === null || $expectedPassword === '') {
            shawAdminJson([
                'success' => false,
                'message' => 'Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in config/.env.',
            ], 503);
        }

        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $email = trim((string)($input['email'] ?? ''));
        $password = (string)($input['password'] ?? '');
        if (!hash_equals($expectedEmail, $email) || !hash_equals($expectedPassword, $password)) {
            shawAdminJson(['success' => false, 'message' => 'Invalid email or password.'], 401);
        }

        session_regenerate_id(true);
        $_SESSION['shaw_admin_authenticated'] = true;
        $_SESSION['shaw_admin_email'] = $email;
        shawAdminJson(['success' => true, 'email' => $email]);
    }

    if ($action === 'logout' && $method === 'POST') {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', [
                'expires' => time() - 42000,
                'path' => $params['path'],
                'domain' => $params['domain'],
                'secure' => $params['secure'],
                'httponly' => $params['httponly'],
                'samesite' => 'Lax',
            ]);
        }
        session_destroy();
        shawAdminJson(['success' => true]);
    }

    shawAdminJson(['success' => false, 'message' => 'Admin route not found.'], 404);
}

function shawAdminRequestAllowed(string $resource, string $method, ?string $param): bool
{
    $writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    $adminReadResources = ['orders', 'inquiries', 'bulk-inquiries', 'upload'];
    $adminQuery = ($_GET['admin'] ?? '') === '1';
    $adminOnlyRead = $method === 'GET'
        && $resource === 'testimonials'
        && $param !== null;
    $publicSubmission = $method === 'POST'
        && in_array($resource, ['inquiries', 'bulk-inquiries'], true);
    if ($publicSubmission) {
        return true;
    }

    if (!$adminQuery
        && !in_array($method, $writeMethods, true)
        && !in_array($resource, $adminReadResources, true)
        && !$adminOnlyRead) {
        return true;
    }

    shawAdminSessionStart();
    if (!empty($_SESSION['shaw_admin_authenticated'])) {
        return true;
    }

    shawAdminJson(['success' => false, 'message' => 'Administrator sign-in is required.'], 401);
}
