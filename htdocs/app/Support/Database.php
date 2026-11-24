<?php
/**
 * PDO Database Connection Helper for Shaw Enterprise
 */

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(bool $exitOnError = true): ?PDO {
        if (self::$instance === null) {
            $config = require dirname(__DIR__, 2) . '/config/database.php';
            $db = $config['db'];

            $dsn = "mysql:host={$db['host']};port={$db['port']};dbname={$db['dbname']};charset={$db['charset']}";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            if ($db['ssl_ca'] !== null) {
                if (!defined('PDO::MYSQL_ATTR_SSL_CA') || !defined('PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT')) {
                    throw new RuntimeException('PDO MySQL SSL support is required when DB_SSL_CA is configured.');
                }
                if (!is_file($db['ssl_ca']) || !is_readable($db['ssl_ca'])) {
                    throw new RuntimeException('DB_SSL_CA must point to a readable CA certificate bundle.');
                }

                $options[PDO::MYSQL_ATTR_SSL_CA] = $db['ssl_ca'];
                $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = true;
            }

            try {
                self::$instance = new PDO($dsn, $db['user'], $db['password'], $options);
            } catch (PDOException $e) {
                error_log('MySQL Connection Error: ' . $e->getMessage());
                if ($exitOnError) {
                    http_response_code(500);
                    header('Content-Type: application/json');
                    echo json_encode([
                        'success' => false,
                        'message' => 'Database connection failed. Please ensure the MySQL database is running and credentials are valid.'
                    ]);
                    exit;
                }
                throw $e;
            }
        }

        return self::$instance;
    }
}
