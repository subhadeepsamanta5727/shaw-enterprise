<?php
declare(strict_types=1);

$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$publicRoot = realpath(__DIR__);
$requestedFile = realpath(__DIR__ . DIRECTORY_SEPARATOR . ltrim(str_replace('/', DIRECTORY_SEPARATOR, $requestPath), DIRECTORY_SEPARATOR));

if (
    $requestedFile !== false
    && $publicRoot !== false
    && strpos($requestedFile, $publicRoot . DIRECTORY_SEPARATOR) === 0
    && is_file($requestedFile)
) {
    return false;
}

require __DIR__ . '/index.php';
