<?php

require_once __DIR__ . '/environment.php';

$databasePassword = shawEnv('DB_PASSWORD');
if ($databasePassword === null) {
    throw new RuntimeException('DB_PASSWORD must be set in config/.env or the environment.');
}

$databaseHost = shawEnv('DB_HOST');
if ($databaseHost === null || $databaseHost === '') {
    throw new RuntimeException('DB_HOST must be set to the MySQL hostname from your hosting control panel.');
}

return [
    'db' => [
        'host'     => $databaseHost,
        'port'     => shawEnv('DB_PORT') ?: '3306',
        'dbname'   => shawEnv('DB_NAME') ?: 'shaw_enterprise',
        'user'     => shawEnv('DB_USER') ?: 'root',
        'password' => $databasePassword,
        'charset'  => 'utf8mb4',
    ],
    'app' => [
        'base_url'    => shawEnv('APP_URL') ?: (shawEnv('RENDER_EXTERNAL_URL') ?: 'http://localhost:8000'),
        'uploads_dir' => shawEnv('UPLOADS_DIR') ?: dirname(__DIR__) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'uploads',
        'cors_origin' => '*',
    ],
];
