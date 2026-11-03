<?php
require_once dirname(__DIR__) . '/Support/Database.php';

class ClientController {
    private PDO $db;

    public const CATEGORY_LABELS = [
        'university_colleges' => 'University & Colleges',
        'schools'             => 'Schools',
        'corporate_banks'     => 'Corporate Office / Bank',
        'others'              => 'Others',
    ];

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * GET /api/clients
     * Optional query params:
     *  - category: 'all' | 'university_colleges' | 'schools' | 'corporate_banks' | 'others'
     *  - search: keyword search in name or location
     */
    public function index(): void {
        header('Content-Type: application/json');

        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;

        $adminQuery = ($_GET['admin'] ?? '') === '1';
        $columns = $adminQuery
            ? '*'
            : 'id, name, category, category_label, location';
        $sql = "SELECT {$columns} FROM clients WHERE 1=1";
        $params = [];

        if ($category && $category !== 'all') {
            $sql .= " AND category = :category";
            $params[':category'] = $category;
        }

        if ($search) {
            $sql .= " AND (name LIKE :s1 OR location LIKE :s2)";
            $term = "%{$search}%";
            $params[':s1'] = $term;
            $params[':s2'] = $term;
        }

        $sql .= " ORDER BY display_order ASC, id ASC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $clients = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'count'   => count($clients),
            'data'    => $clients
        ]);
    }

    /**
     * GET /api/clients/:id
     */
    public function show(int $id): void {
        header('Content-Type: application/json');

        $columns = ($_GET['admin'] ?? '') === '1'
            ? '*'
            : 'id, name, category, category_label, location';
        $stmt = $this->db->prepare("SELECT {$columns} FROM clients WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $client = $stmt->fetch();

        if (!$client) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Client institution not found.']);
            return;
        }

        echo json_encode(['success' => true, 'data' => $client]);
    }

    /**
     * POST /api/clients
     * Add client from admin side (No image needed)
     */
    public function store(): void {
        header('Content-Type: application/json');

        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $name = trim($input['name'] ?? '');
        $category = trim($input['category'] ?? 'others');
        $location = trim($input['location'] ?? '');
        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Client institution name is required.']);
            return;
        }

        $category_label = self::CATEGORY_LABELS[$category] ?? 'Others';

        $stmt = $this->db->prepare("
            INSERT INTO clients
                (name, category, category_label, location, project_details, established, is_featured, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $name,
            $category,
            $category_label,
            $location,
            $input['project_details'] ?? '',
            $input['established'] ?? '',
            (int)!empty($input['is_featured']),
            (int)($input['display_order'] ?? 0),
        ]);

        $newId = (int)$this->db->lastInsertId();

        $stmtFetch = $this->db->prepare("SELECT * FROM clients WHERE id = ?");
        $stmtFetch->execute([$newId]);
        $newClient = $stmtFetch->fetch();

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Client successfully added to MySQL database.',
            'data'    => $newClient
        ]);
    }

    /**
     * PUT /api/clients/:id
     * Update client
     */
    public function update(int $id): void {
        header('Content-Type: application/json');

        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $stmtCheck = $this->db->prepare("SELECT * FROM clients WHERE id = ?");
        $stmtCheck->execute([$id]);
        $current = $stmtCheck->fetch();

        if (!$current) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Client not found.']);
            return;
        }

        $name = $input['name'] ?? $current['name'];
        $category = $input['category'] ?? $current['category'];
        $category_label = self::CATEGORY_LABELS[$category] ?? $current['category_label'];
        $location = $input['location'] ?? $current['location'];
        $projectDetails = $input['project_details'] ?? $current['project_details'];
        $established = $input['established'] ?? $current['established'];
        $isFeatured = array_key_exists('is_featured', $input)
            ? (int)(bool)$input['is_featured']
            : (int)$current['is_featured'];
        $displayOrder = isset($input['display_order'])
            ? (int)$input['display_order']
            : (int)$current['display_order'];
        $stmt = $this->db->prepare("
            UPDATE clients
            SET name = ?, category = ?, category_label = ?, location = ?,
                project_details = ?, established = ?, is_featured = ?, display_order = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $name,
            $category,
            $category_label,
            $location,
            $projectDetails,
            $established,
            $isFeatured,
            $displayOrder,
            $id
        ]);

        $stmtFetch = $this->db->prepare("SELECT * FROM clients WHERE id = ?");
        $stmtFetch->execute([$id]);
        $updated = $stmtFetch->fetch();

        echo json_encode([
            'success' => true,
            'message' => 'Client updated successfully.',
            'data'    => $updated
        ]);
    }

    /**
     * DELETE /api/clients/:id
     */
    public function destroy(int $id): void {
        header('Content-Type: application/json');

        $stmt = $this->db->prepare("DELETE FROM clients WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode([
            'success' => true,
            'message' => 'Client deleted successfully from MySQL.'
        ]);
    }
}
