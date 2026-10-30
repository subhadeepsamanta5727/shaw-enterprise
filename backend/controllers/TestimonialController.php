<?php
require_once dirname(__DIR__) . '/config/db_connect.php';

class TestimonialController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function index(): void {
        header('Content-Type: application/json');
        $stmt = $this->db->query("SELECT * FROM testimonials WHERE is_featured = 1 ORDER BY display_order ASC, id ASC");
        $items = $stmt->fetchAll();
        echo json_encode(['success' => true, 'count' => count($items), 'data' => $items]);
    }

    public function store(): void {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $name = trim($input['client_name'] ?? '');
        $text = trim($input['review_text'] ?? $input['content'] ?? '');
        if (empty($name) || empty($text)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Client name and feedback review are required.']);
            return;
        }

        $stmt = $this->db->prepare("
            INSERT INTO testimonials (client_name, client_designation, organization_name, review_text, rating, is_featured)
            VALUES (?, ?, ?, ?, ?, 1)
        ");
        $stmt->execute([
            $name,
            $input['client_designation'] ?? $input['role'] ?? '',
            $input['organization_name'] ?? '',
            $text,
            (int)($input['rating'] ?? 5)
        ]);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'id' => (int)$this->db->lastInsertId(),
            'message' => 'Testimonial added to MySQL.'
        ]);
    }

    public function destroy(int $id): void {
        header('Content-Type: application/json');
        $stmt = $this->db->prepare("DELETE FROM testimonials WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Testimonial not found.']);
            return;
        }

        echo json_encode(['success' => true, 'message' => 'Testimonial deleted successfully from MySQL.']);
    }
}
