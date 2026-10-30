<?php
require_once dirname(__DIR__) . '/config/db_connect.php';

class InquiryController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * POST /api/inquiries
     */
    public function store(): void {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $clientName = trim($input['client_name'] ?? '');
        $orgName = trim($input['organization_name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $productTitle = trim($input['product_title'] ?? 'Institutional Quotation');
        $variantDetails = trim($input['variant_details'] ?? '');
        $quantity = (int)($input['quantity'] ?? 1);
        $deliveryCity = trim($input['delivery_city'] ?? 'Kolkata');
        $message = trim($input['message'] ?? '');

        if (empty($clientName) || empty($email) || empty($phone)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Client name, email, and phone are mandatory for RFQ submission.'
            ]);
            return;
        }

        $stmt = $this->db->prepare("
            INSERT INTO bulk_inquiries (client_name, organization_name, email, phone, product_title, variant_details, quantity, delivery_city, message, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
        ");
        $stmt->execute([
            $clientName, $orgName, $email, $phone, $productTitle, $variantDetails, $quantity, $deliveryCity, $message
        ]);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Institutional quote request successfully registered in MySQL. Our Kolkata sales desk will reach out within 24 hours.',
            'id'      => (int)$this->db->lastInsertId()
        ]);
    }

    /**
     * GET /api/inquiries
     */
    public function index(): void {
        header('Content-Type: application/json');
        $stmt = $this->db->query("SELECT * FROM bulk_inquiries ORDER BY id DESC");
        $inquiries = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'count'   => count($inquiries),
            'data'    => $inquiries
        ]);
    }

    /**
     * PATCH /api/inquiries/:id/status
     */
    public function updateStatus(int $id): void {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $status = $input['status'] ?? 'Contacted';

        $stmt = $this->db->prepare("UPDATE bulk_inquiries SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        echo json_encode(['success' => true, 'message' => 'Inquiry status updated successfully.']);
    }

    /**
     * DELETE /api/inquiries/:id
     */
    public function destroy(int $id): void {
        header('Content-Type: application/json');
        $stmt = $this->db->prepare("DELETE FROM bulk_inquiries WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Inquiry deleted successfully.']);
    }
}

