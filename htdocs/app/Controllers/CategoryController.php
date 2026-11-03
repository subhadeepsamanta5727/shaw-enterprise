<?php
require_once dirname(__DIR__) . '/Support/Database.php';

class CategoryController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * GET /api/categories
     */
    public function index(): void {
        header('Content-Type: application/json');

        $adminQuery = ($_GET['admin'] ?? '') === '1';
        $stmt = $this->db->query("
            SELECT id, name, slug, description, image, display_order, is_active, created_at
            FROM categories
            " . ($adminQuery ? "" : "WHERE is_active = 1") . "
            ORDER BY display_order ASC, id ASC
        ");
        $categories = $stmt->fetchAll();

        foreach ($categories as &$c) {
            $c['is_active'] = (bool)$c['is_active'];
        }

        echo json_encode([
            'success' => true,
            'count'   => count($categories),
            'data'    => $categories
        ]);
    }

    /**
     * GET /api/categories/:idOrSlug
     */
    public function show(string $idOrSlug): void {
        header('Content-Type: application/json');

        $isId = is_numeric($idOrSlug);
        $sql = "SELECT * FROM categories WHERE " . ($isId ? "id = ?" : "slug = ?") . " LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$idOrSlug]);
        $category = $stmt->fetch();

        if (!$category) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Category not found.']);
            return;
        }

        // Fetch products in this category
        $stmtP = $this->db->prepare("
            SELECT id, title, slug, sku, short_description, main_image, base_price, mrp, show_price, show_mrp, is_featured
            FROM products
            WHERE category_id = ? AND is_active = 1
            ORDER BY is_featured DESC, id ASC
        ");
        $stmtP->execute([(int)$category['id']]);
        $category['products'] = $stmtP->fetchAll();
        foreach ($category['products'] as &$product) {
            $product['show_price'] = (bool)$product['show_price'];
            $product['show_mrp'] = (bool)$product['show_mrp'];
            if (!$product['show_price']) {
                unset($product['base_price']);
            }
            if (!$product['show_mrp']) {
                unset($product['mrp']);
            }
        }
        unset($product);

        echo json_encode(['success' => true, 'data' => $category]);
    }

    /**
     * POST /api/categories
     */
    public function store(): void {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $name = trim($input['name'] ?? '');
        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Category name is required.']);
            return;
        }

        $slug = $input['slug'] ?? strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
        $desc = $input['description'] ?? '';
        $image = $input['image'] ?? '';
        $order = (int)($input['display_order'] ?? 0);

        $isActive = isset($input['is_active']) ? (int)(bool)$input['is_active'] : 1;
        $stmt = $this->db->prepare("
            INSERT INTO categories (name, slug, description, image, display_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$name, $slug, $desc, $image, $order, $isActive]);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Category created successfully in MySQL.',
            'id'      => (int)$this->db->lastInsertId()
        ]);
    }

    /**
     * PUT /api/categories/:id
     */
    public function update(int $id): void {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $stmt = $this->db->prepare("
            UPDATE categories
            SET name = COALESCE(:name, name),
                slug = COALESCE(:slug, slug),
                description = COALESCE(:desc, description),
                image = COALESCE(:image, image),
                display_order = COALESCE(:order, display_order),
                is_active = COALESCE(:is_active, is_active)
            WHERE id = :id
        ");
        $stmt->execute([
            ':name'  => $input['name'] ?? null,
            ':slug'  => $input['slug'] ?? null,
            ':desc'  => $input['description'] ?? null,
            ':image' => $input['image'] ?? null,
            ':order' => isset($input['display_order']) ? (int)$input['display_order'] : null,
            ':is_active' => isset($input['is_active']) ? (int)(bool)$input['is_active'] : null,
            ':id'    => $id,
        ]);

        echo json_encode(['success' => true, 'message' => 'Category updated successfully.']);
    }

    /**
     * DELETE /api/categories/:id
     */
    public function destroy(int $id): void {
        header('Content-Type: application/json');
        $stmt = $this->db->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Category deleted successfully.']);
    }
}
