<?php
require_once dirname(__DIR__) . '/config/db_connect.php';

class OrderController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * POST /api/orders
     * Direct retail e-commerce checkout
     */
    public function store(): void {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $name = trim($input['customer_name'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $email = trim($input['email'] ?? '');
        $address = trim($input['delivery_address'] ?? '');
        $city = trim($input['city'] ?? 'Kolkata');
        $pincode = trim($input['pincode'] ?? $input['pin_code'] ?? '');
        $items = $input['items'] ?? [];
        $totalAmount = (float)($input['total_amount'] ?? 0);
        $paymentMethod = $input['payment_method'] ?? 'WhatsApp';
        $transactionId = $input['transaction_id'] ?? null;
        $notes = $input['notes'] ?? '';

        if (empty($name) || empty($phone) || empty($address)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Customer name, phone, and delivery address are required.'
            ]);
            return;
        }

        $orderId = trim($input['id'] ?? '') ?: 'ORD-' . rand(7000, 9999);
        $paymentStatus = in_array($paymentMethod, ['UPI Scan & Pay', 'Razorpay Online']) ? 'Paid' : 'Pending';

        $stmt = $this->db->prepare("
            INSERT INTO orders (id, customer_name, phone, email, delivery_address, city, pincode, items, total_amount, payment_method, payment_status, order_status, transaction_id, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Processing', ?, ?)
        ");
        $stmt->execute([
            $orderId,
            $name,
            $phone,
            $email,
            $address,
            $city,
            $pincode,
            json_encode($items),
            $totalAmount,
            $paymentMethod,
            $paymentStatus,
            $transactionId,
            $notes
        ]);

        http_response_code(201);
        echo json_encode([
            'success'      => true,
            'message'      => 'Order confirmed and saved in MySQL.',
            'order_id'     => $orderId,
            'total_amount' => $totalAmount,
            'payment_status' => $paymentStatus,
        ]);
    }

    /**
     * GET /api/orders
     */
    public function index(): void {
        header('Content-Type: application/json');
        $stmt = $this->db->query("SELECT * FROM orders ORDER BY created_at DESC");
        $orders = $stmt->fetchAll();

        foreach ($orders as &$ord) {
            $ord['items'] = json_decode($ord['items'], true) ?: [];
            $ord['total_amount'] = (float)$ord['total_amount'];
        }

        echo json_encode([
            'success' => true,
            'count'   => count($orders),
            'data'    => $orders
        ]);
    }

    /**
     * GET /api/orders/:id
     */
    public function show(string $id): void {
        header('Content-Type: application/json');
        $stmt = $this->db->prepare("SELECT * FROM orders WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $order = $stmt->fetch();

        if (!$order) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Order not found.']);
            return;
        }

        $order['items'] = json_decode($order['items'], true) ?: [];
        $order['total_amount'] = (float)$order['total_amount'];

        echo json_encode(['success' => true, 'data' => $order]);
    }

    /**
     * PATCH /api/orders/:id/status
     */
    public function updateStatus(string $id): void {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $orderStatus = $input['order_status'] ?? null;
        $paymentStatus = $input['payment_status'] ?? null;

        $stmt = $this->db->prepare("
            UPDATE orders
            SET order_status = COALESCE(:o_status, order_status),
                payment_status = COALESCE(:p_status, payment_status)
            WHERE id = :id
        ");
        $stmt->execute([
            ':o_status' => $orderStatus,
            ':p_status' => $paymentStatus,
            ':id'       => $id,
        ]);

        echo json_encode(['success' => true, 'message' => 'Order updated successfully in MySQL.']);
    }

    /**
     * DELETE /api/orders/:id
     */
    public function destroy(string $id): void {
        header('Content-Type: application/json');
        $stmt = $this->db->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Order not found.']);
            return;
        }

        echo json_encode(['success' => true, 'message' => 'Order deleted successfully from MySQL.']);
    }
}
