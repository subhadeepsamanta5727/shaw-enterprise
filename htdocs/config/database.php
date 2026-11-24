<?php

require_once __DIR__ . '/environment.php';

$databasePassword = shawEnv('DB_PASSWORD');
if ($databasePassword === null) {
    throw new RuntimeException('DB_PASSWORD must be set in config/.env or the environment.');
}

$databaseHost = shawEnv('DB_HOST') ?: 'localhost';

return [
    'db' => [
        'host'     => $databaseHost,
        'port'     => shawEnv('DB_PORT') ?: '3306',
        'dbname'   => shawEnv('DB_NAME') ?: 'shawentte_shaw',
        'user'     => shawEnv('DB_USER') ?: 'shawentte_shaw',
        'password' => $databasePassword,
        'ssl_ca'   => shawEnv('DB_SSL_CA') ?: null,
        'charset'  => 'utf8mb4',
    ],
    'app' => [
        'base_url'    => shawEnv('APP_URL') ?: (shawEnv('RENDER_EXTERNAL_URL') ?: 'https://shawenterprise.in'),
        'uploads_dir' => shawEnv('UPLOADS_DIR') ?: dirname(__DIR__) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'uploads',
        'cors_origin' => '*',
    ],
];
