<?php

$GLOBALS['__SHAW_ENV'] = $GLOBALS['__SHAW_ENV'] ?? [];

function shawEnv(string $key): ?string
{
    if (isset($GLOBALS['__SHAW_ENV'][$key]) && is_string($GLOBALS['__SHAW_ENV'][$key])) {
        return $GLOBALS['__SHAW_ENV'][$key];
    }

    $value = $_ENV[$key] ?? $_SERVER[$key] ?? null;
    if (is_string($value)) {
        return $value;
    }

    if (function_exists('getenv')) {
        $value = getenv($key);
        if ($value !== false && is_string($value)) {
            return $value;
        }
    }

    return null;
}

$envCandidates = [
    __DIR__ . DIRECTORY_SEPARATOR . '.env',
    dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env',
    __DIR__ . DIRECTORY_SEPARATOR . '.env.example',
    dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env.example',
];

foreach ($envCandidates as $envFile) {
    if (is_file($envFile) && is_readable($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines !== false) {
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || strpos($line, '#') === 0 || strpos($line, '=') === false) {
                    continue;
                }
                [$key, $value] = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value, " \t\n\r\0\x0B\"'");
                if ($key !== '') {
                    $GLOBALS['__SHAW_ENV'][$key] = $value;
                    if (function_exists('putenv')) {
                        @putenv("{$key}={$value}");
                    }
                    $_ENV[$key] = $value;
                    $_SERVER[$key] = $value;
                }
            }
        }
        if (basename($envFile) === '.env' && !empty($GLOBALS['__SHAW_ENV']['DB_PASSWORD'])) {
            break;
        }
    }
}
