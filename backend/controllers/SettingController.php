<?php
require_once dirname(__DIR__) . '/config/db_connect.php';

class SettingController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * GET /api/settings
     */
    public function show(): void {
        header('Content-Type: application/json');

        $stmt = $this->db->prepare("SELECT setting_value FROM settings WHERE setting_key = 'general' LIMIT 1");
        $stmt->execute();
        $row = $stmt->fetch();

        if ($row) {
            $data = json_decode($row['setting_value'], true);
            echo json_encode(['success' => true, 'data' => $data]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Settings not found in database.']);
        }
    }

    /**
     * PUT /api/settings
     */
    public function update(): void {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        if (empty($input)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No settings data payload provided.']);
            return;
        }

        // Fetch current settings to merge
        $stmt = $this->db->prepare("SELECT setting_value FROM settings WHERE setting_key = 'general' LIMIT 1");
        $stmt->execute();
        $current = $stmt->fetch();
        $currentSettings = $current ? json_decode($current['setting_value'], true) : [];

        $merged = array_merge($currentSettings, $input);

        $stmtSave = $this->db->prepare("
            INSERT INTO settings (setting_key, setting_value)
            VALUES ('general', :val)
            ON DUPLICATE KEY UPDATE setting_value = :val
        ");
        $stmtSave->execute([':val' => json_encode($merged)]);

        echo json_encode([
            'success' => true,
            'message' => 'Settings saved successfully in MySQL.',
            'data'    => $merged
        ]);
    }
}

