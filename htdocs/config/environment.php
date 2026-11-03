<?php

function shawEnv(string $key): ?string
{
    $value = $_ENV[$key] ?? $_SERVER[$key] ?? null;
    if (is_string($value)) {
        return $value;
    }

    if (function_exists('getenv')) {
        $value = getenv($key);
        if ($value !== false) {
            return $value;
        }
    }

    return null;
}

$envFile = __DIR__ . DIRECTORY_SEPARATOR . '.env';
if (is_file($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0 || strpos($line, '=') === false) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, " \t\n\r\0\x0B\"'");
        if ($key !== '') {
            if (function_exists('putenv')) {
                putenv("{$key}={$value}");
            }
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
}
