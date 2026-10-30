<?php

// Auto-load .env file from backend root if present
$envFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0 || strpos($line, '=') === false) continue;
        list($key, $val) = explode('=', $line, 2);
        $key = trim($key);
        $val = trim($val, " \t\n\r\0\x0B\"'");
        putenv("{$key}={$val}");
        $_ENV[$key] = $val;
        $_SERVER[$key] = $val;
    }
}

$databasePassword = getenv('DB_PASSWORD');
if ($databasePassword === false || $databasePassword === '') {
    throw new RuntimeException('DB_PASSWORD must be set in backend/.env or the environment.');
}

return [
    'db' => [
        'host'     => getenv('DB_HOST') ?: '127.0.0.1',
        'port'     => getenv('DB_PORT') ?: '3306',
        'dbname'   => getenv('DB_NAME') ?: 'shaw_enterprise',
        'user'     => getenv('DB_USER') ?: 'root',
        'password' => $databasePassword,
        'charset'  => 'utf8mb4',
    ],
    'app' => [
        'base_url'    => getenv('APP_URL') ?: 'http://localhost:8000',
        'uploads_dir' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'uploads',
        'cors_origin' => '*',
    ],
];
