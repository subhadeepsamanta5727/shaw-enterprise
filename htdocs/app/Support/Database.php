<?php
/**
 * PDO Database Connection Helper for Shaw Enterprise
 */

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $config = require dirname(__DIR__, 2) . '/config/database.php';
            $db = $config['db'];

            $dsn = "mysql:host={$db['host']};port={$db['port']};dbname={$db['dbname']};charset={$db['charset']}";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO($dsn, $db['user'], $db['password'], $options);
            } catch (PDOException $e) {
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'MySQL Database Connection Error: ' . $e->getMessage()
                ]);
                exit;
            }
        }

        return self::$instance;
    }
}
