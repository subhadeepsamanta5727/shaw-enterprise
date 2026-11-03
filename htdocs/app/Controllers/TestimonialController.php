<?php
require_once dirname(__DIR__) . '/Support/Database.php';

class TestimonialController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function index(): void {
        header('Content-Type: application/json');
        $adminQuery = ($_GET['admin'] ?? '') === '1';
        $stmt = $this->db->query("SELECT * FROM testimonials "
            . ($adminQuery ? "" : "WHERE is_featured = 1 ")
            . "ORDER BY display_order ASC, id ASC");
        $items = $stmt->fetchAll();
        foreach ($items as &$item) {
            $item['is_featured'] = (bool)$item['is_featured'];
        }
        echo json_encode(['success' => true, 'count' => count($items), 'data' => $items]);
    }

    public function show(int $id): void {
        header('Content-Type: application/json');
        $stmt = $this->db->prepare("SELECT * FROM testimonials WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $testimonial = $stmt->fetch();
        if (!$testimonial) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Testimonial not found.']);
            return;
        }
        $testimonial['is_featured'] = (bool)$testimonial['is_featured'];
        echo json_encode(['success' => true, 'data' => $testimonial]);
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

        $rating = (int)($input['rating'] ?? 5);
        if ($rating < 1 || $rating > 5) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Rating must be between 1 and 5.']);
            return;
        }

        $stmt = $this->db->prepare("
            INSERT INTO testimonials
                (client_name, client_designation, organization_name, review_text, rating, is_featured, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $name,
            $input['client_designation'] ?? $input['role'] ?? '',
            $input['organization_name'] ?? '',
            $text,
            $rating,
            array_key_exists('is_featured', $input) ? (int)(bool)$input['is_featured'] : 1,
            (int)($input['display_order'] ?? 0),
        ]);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'id' => (int)$this->db->lastInsertId(),
            'message' => 'Testimonial added to MySQL.'
        ]);
    }

    public function update(int $id): void {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $currentStmt = $this->db->prepare("SELECT * FROM testimonials WHERE id = ? LIMIT 1");
        $currentStmt->execute([$id]);
        $current = $currentStmt->fetch();
        if (!$current) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Testimonial not found.']);
            return;
        }

        $name = trim((string)($input['client_name'] ?? $current['client_name']));
        $review = trim((string)($input['review_text'] ?? $input['content'] ?? $current['review_text']));
        if ($name === '' || $review === '') {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Client name and review are required.']);
            return;
        }
        $rating = isset($input['rating']) ? (int)$input['rating'] : (int)$current['rating'];
        if ($rating < 1 || $rating > 5) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Rating must be between 1 and 5.']);
            return;
        }

        $stmt = $this->db->prepare("
            UPDATE testimonials
            SET client_name = ?, client_designation = ?, organization_name = ?, review_text = ?,
                rating = ?, is_featured = ?, display_order = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $name,
            $input['client_designation'] ?? $current['client_designation'],
            $input['organization_name'] ?? $current['organization_name'],
            $review,
            $rating,
            array_key_exists('is_featured', $input)
                ? (int)(bool)$input['is_featured']
                : (int)$current['is_featured'],
            isset($input['display_order']) ? (int)$input['display_order'] : (int)$current['display_order'],
            $id,
        ]);
        echo json_encode(['success' => true, 'message' => 'Testimonial updated successfully.']);
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
