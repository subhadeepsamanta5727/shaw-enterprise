<?php
declare(strict_types=1);

$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$publicRoot = realpath(__DIR__);

// Normalize path separators
$normalizedPath = str_replace('\\', '/', $requestPath);

// Deny direct access to sensitive internal files and folders
if (
    preg_match('#(^|/)\.#', $normalizedPath) ||
    preg_match('#^/(app|config|database)(/|$)#i', $normalizedPath) ||
    preg_match('#\.(env|sql|json|lock|md|log|sh|bat)$#i', $normalizedPath)
) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo '403 Forbidden: Access to sensitive system resource is restricted.';
    exit;
}

$requestedFile = realpath(__DIR__ . DIRECTORY_SEPARATOR . ltrim(str_replace('/', DIRECTORY_SEPARATOR, $requestPath), DIRECTORY_SEPARATOR));

// Serve static assets only from allowed safe extensions
if (
    $requestedFile !== false
    && $publicRoot !== false
    && strpos($requestedFile, $publicRoot . DIRECTORY_SEPARATOR) === 0
    && is_file($requestedFile)
) {
    $extension = strtolower(pathinfo($requestedFile, PATHINFO_EXTENSION));
    $allowedStaticExtensions = [
        'css', 'js', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico',
        'pdf', 'woff', 'woff2', 'ttf', 'eot', 'otf', 'txt', 'xml', 'map'
    ];

    if (in_array($extension, $allowedStaticExtensions, true)) {
        return false;
    }
}

require __DIR__ . '/index.php';
