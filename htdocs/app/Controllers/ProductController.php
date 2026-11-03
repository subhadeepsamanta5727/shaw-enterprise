<?php
require_once dirname(__DIR__) . '/Support/Database.php';

class ProductController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * GET /api/products
     */
    public function index(): void {
        header('Content-Type: application/json');

        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;
        $featured = $_GET['featured'] ?? null;
        $sort = $_GET['sort'] ?? null;
        $adminQuery = ($_GET['admin'] ?? '') === '1';
        $page = max(1, (int)($_GET['page'] ?? 1));
        $limit = max(1, min(100, (int)($_GET['limit'] ?? 50)));

        $sql = "
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        ";
        if (!$adminQuery) {
            $sql .= " AND p.is_active = 1";
        }
        $params = [];

        if ($category) {
            if (is_numeric($category)) {
                $sql .= " AND p.category_id = :cat_id";
                $params[':cat_id'] = (int)$category;
            } else {
                $sql .= " AND c.slug = :cat_slug";
                $params[':cat_slug'] = $category;
            }
        }

        if ($search) {
            $sql .= " AND (p.title LIKE :s1 OR p.sku LIKE :s2 OR p.short_description LIKE :s3)";
            $term = "%{$search}%";
            $params[':s1'] = $term;
            $params[':s2'] = $term;
            $params[':s3'] = $term;
        }

        if ($featured === '1' || $featured === 'true') {
            $sql .= " AND p.is_featured = 1";
        }

        if ($adminQuery && $sort === 'price_asc') {
            $sql .= " ORDER BY p.base_price ASC";
        } elseif ($adminQuery && $sort === 'price_desc') {
            $sql .= " ORDER BY p.base_price DESC";
        } elseif ($sort === 'newest') {
            $sql .= " ORDER BY p.id DESC";
        } else {
            $sql .= " ORDER BY p.is_featured DESC, p.id ASC";
        }

        $offset = ($page - 1) * $limit;
        $sql .= " LIMIT {$limit} OFFSET {$offset}";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        if (!empty($products)) {
            $productIds = array_column($products, 'id');
            $placeholders = implode(',', array_fill(0, count($productIds), '?'));

            // Fetch variants
            $stmtV = $this->db->prepare("SELECT * FROM product_variants WHERE product_id IN ({$placeholders}) ORDER BY id ASC");
            $stmtV->execute($productIds);
            $allVariants = $stmtV->fetchAll();

            $variantMap = [];
            foreach ($allVariants as $v) {
                $variantMap[$v['product_id']][] = $v;
            }

            // Fetch specifications
            $stmtS = $this->db->prepare("SELECT * FROM product_specifications WHERE product_id IN ({$placeholders}) ORDER BY id ASC");
            $stmtS->execute($productIds);
            $allSpecs = $stmtS->fetchAll();

            $specMap = [];
            foreach ($allSpecs as $s) {
                $specMap[$s['product_id']][] = $s;
            }

            $stmtI = $this->db->prepare("SELECT * FROM product_images WHERE product_id IN ({$placeholders}) ORDER BY display_order ASC, id ASC");
            $stmtI->execute($productIds);
            $imageMap = [];
            foreach ($stmtI->fetchAll() as $image) {
                $imageMap[$image['product_id']][] = $image['image_url'];
            }

            foreach ($products as &$p) {
                $p['base_price'] = (float)$p['base_price'];
                $p['mrp'] = $p['mrp'] ? (float)$p['mrp'] : null;
                $p['is_featured'] = (bool)$p['is_featured'];
                $p['is_active'] = (bool)$p['is_active'];
                $p['show_price'] = (bool)$p['show_price'];
                $p['show_mrp'] = (bool)$p['show_mrp'];
                $p['variants'] = $variantMap[$p['id']] ?? [];
                $p['specifications'] = $specMap[$p['id']] ?? [];
                $p['images'] = array_values(array_unique(array_filter(array_merge(
                    [$p['main_image']],
                    $imageMap[$p['id']] ?? []
                ))));
                if (!$adminQuery) {
                    $this->applyPublicPriceVisibility($p);
                }
            }
            unset($p);
        }

        echo json_encode([
            'success' => true,
            'count'   => count($products),
            'data'    => $products
        ]);
    }

    /**
     * GET /api/products/:idOrSlug
     */
    public function show(string $idOrSlug): void {
        header('Content-Type: application/json');

        $isId = is_numeric($idOrSlug);
        $adminQuery = ($_GET['admin'] ?? '') === '1';
        $sql = "
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE " . ($isId ? "p.id = ?" : "p.slug = ?")
            . ($adminQuery ? "" : " AND p.is_active = 1") . "
            LIMIT 1
        ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$idOrSlug]);
        $product = $stmt->fetch();

        if (!$product) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Product not found.']);
            return;
        }

        $productId = (int)$product['id'];

        // Variants
        $stmtV = $this->db->prepare("SELECT * FROM product_variants WHERE product_id = ? ORDER BY id ASC");
        $stmtV->execute([$productId]);
        $product['variants'] = $stmtV->fetchAll();

        // Specifications
        $stmtS = $this->db->prepare("SELECT * FROM product_specifications WHERE product_id = ? ORDER BY id ASC");
        $stmtS->execute([$productId]);
        $product['specifications'] = $stmtS->fetchAll();

        $stmtI = $this->db->prepare("SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order ASC, id ASC");
        $stmtI->execute([$productId]);
        $product['images'] = array_values(array_unique(array_filter(array_merge(
            [$product['main_image']],
            array_column($stmtI->fetchAll(), 'image_url')
        ))));

        // Related Products
        $stmtRel = $this->db->prepare("
            SELECT id, title, slug, sku,
                   COALESCE(NULLIF(main_image, ''), (
                       SELECT image_url
                       FROM product_images
                       WHERE product_id = products.id
                       ORDER BY display_order ASC, id ASC
                       LIMIT 1
                   )) AS main_image,
                   base_price, mrp, show_price, show_mrp
            FROM products
            WHERE category_id = ? AND id != ? AND is_active = 1
            LIMIT 4
        ");
        $stmtRel->execute([(int)$product['category_id'], $productId]);
        $product['relatedProducts'] = $stmtRel->fetchAll();

        $product['base_price'] = (float)$product['base_price'];
        $product['mrp'] = $product['mrp'] ? (float)$product['mrp'] : null;
        $product['is_featured'] = (bool)$product['is_featured'];
        $product['is_active'] = (bool)$product['is_active'];
        $product['show_price'] = (bool)$product['show_price'];
        $product['show_mrp'] = (bool)$product['show_mrp'];
        if (!$adminQuery) {
            $this->applyPublicPriceVisibility($product);
            foreach ($product['relatedProducts'] as &$relatedProduct) {
                $relatedProduct['show_price'] = (bool)$relatedProduct['show_price'];
                $relatedProduct['show_mrp'] = (bool)$relatedProduct['show_mrp'];
                $this->applyPublicPriceVisibility($relatedProduct);
            }
            unset($relatedProduct);
        }

        echo json_encode(['success' => true, 'data' => $product]);
    }

    /**
     * POST /api/products
     */
    public function store(): void {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $title = trim($input['title'] ?? '');
        if (empty($title)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Product title is required.']);
            return;
        }

        $slug = $input['slug'] ?? strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        $categoryId = (int)($input['category_id'] ?? 1);
        $sku = $input['sku'] ?? ('SE-' . time());
        $shortDesc = $input['short_description'] ?? '';
        $fullDesc = $input['full_description'] ?? '';
        $mainImage = $input['main_image'] ?? '';
        $basePrice = (float)($input['base_price'] ?? 0);
        $mrp = !empty($input['mrp']) ? (float)$input['mrp'] : null;
        $isFeatured = !empty($input['is_featured']) ? 1 : 0;
        $isActive = isset($input['is_active']) ? (int)(bool)$input['is_active'] : 1;
        $showPrice = !empty($input['show_price']) ? 1 : 0;
        $showMrp = !empty($input['show_mrp']) ? 1 : 0;
        $metaTitle = $input['meta_title'] ?? $title;
        $metaDescription = $input['meta_description'] ?? '';

        $this->db->beginTransaction();

        try {
            $stmt = $this->db->prepare("
                INSERT INTO products (category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active, show_price, show_mrp, meta_title, meta_description)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $categoryId, $title, $slug, $sku, $shortDesc, $fullDesc, $mainImage, $basePrice, $mrp, $isFeatured, $isActive, $showPrice, $showMrp, $metaTitle, $metaDescription
            ]);
            $productId = (int)$this->db->lastInsertId();

            $this->saveRelations($productId, $input);

            $this->db->commit();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Product created successfully in MySQL.',
                'id'      => $productId
            ]);
        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    /**
     * PUT /api/products/:id
     */
    public function update(int $id): void {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare("
                UPDATE products
                SET title = COALESCE(:title, title),
                    slug = COALESCE(:slug, slug),
                    sku = COALESCE(:sku, sku),
                    base_price = COALESCE(:base_price, base_price),
                    mrp = COALESCE(:mrp, mrp),
                    short_description = COALESCE(:short_desc, short_description),
                    full_description = COALESCE(:full_desc, full_description),
                    main_image = COALESCE(:main_image, main_image),
                    is_featured = COALESCE(:is_featured, is_featured),
                    is_active = COALESCE(:is_active, is_active),
                    show_price = COALESCE(:show_price, show_price),
                    show_mrp = COALESCE(:show_mrp, show_mrp),
                    meta_title = COALESCE(:meta_title, meta_title),
                    meta_description = COALESCE(:meta_description, meta_description),
                    category_id = COALESCE(:cat_id, category_id)
                WHERE id = :id
            ");
            $stmt->execute([
                ':title'      => $input['title'] ?? null,
                ':slug'       => $input['slug'] ?? null,
                ':sku'        => $input['sku'] ?? null,
                ':base_price' => isset($input['base_price']) ? (float)$input['base_price'] : null,
                ':mrp'        => isset($input['mrp']) ? (float)$input['mrp'] : null,
                ':short_desc' => $input['short_description'] ?? null,
                ':full_desc'  => $input['full_description'] ?? $input['description'] ?? null,
                ':main_image' => $input['main_image'] ?? null,
                ':is_featured' => isset($input['is_featured']) ? (int)(bool)$input['is_featured'] : null,
                ':is_active' => isset($input['is_active']) ? (int)(bool)$input['is_active'] : null,
                ':show_price' => isset($input['show_price']) ? (int)(bool)$input['show_price'] : null,
                ':show_mrp' => isset($input['show_mrp']) ? (int)(bool)$input['show_mrp'] : null,
                ':meta_title' => $input['meta_title'] ?? null,
                ':meta_description' => $input['meta_description'] ?? null,
                ':cat_id'     => isset($input['category_id']) ? (int)$input['category_id'] : null,
                ':id'         => $id,
            ]);

            $this->saveRelations($id, $input);
            $this->db->commit();
            echo json_encode(['success' => true, 'message' => 'Product updated successfully.']);
        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update product: ' . $e->getMessage()]);
        }
    }

    private function applyPublicPriceVisibility(array &$product): void {
        if (empty($product['show_price'])) {
            unset($product['base_price']);
            if (isset($product['variants']) && is_array($product['variants'])) {
                foreach ($product['variants'] as &$variant) {
                    unset($variant['price']);
                }
                unset($variant);
            }
        }
        if (empty($product['show_mrp'])) {
            unset($product['mrp']);
            if (isset($product['variants']) && is_array($product['variants'])) {
                foreach ($product['variants'] as &$variant) {
                    unset($variant['mrp']);
                }
                unset($variant);
            }
        }
    }

    private function saveRelations(int $productId, array $input): void {
        if (isset($input['images']) && is_array($input['images'])) {
            $images = array_values(array_unique(array_filter(array_merge(
                [$input['main_image'] ?? ''],
                $input['images']
            ))));
            $this->db->prepare("DELETE FROM product_images WHERE product_id = ?")->execute([$productId]);
            $stmt = $this->db->prepare("INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)");
            foreach ($images as $order => $image) {
                $stmt->execute([$productId, $image, $order]);
            }
        }

        if (isset($input['variants']) && is_array($input['variants'])) {
            $this->db->prepare("DELETE FROM product_variants WHERE product_id = ?")->execute([$productId]);
            $stmt = $this->db->prepare("
                INSERT INTO product_variants (product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            foreach ($input['variants'] as $index => $variant) {
                $size = trim($variant['size_label'] ?? $variant['name'] ?? '');
                if ($size === '') continue;
                $stmt->execute([
                    $productId,
                    $size,
                    $variant['surface_type'] ?? '',
                    (float)($variant['price'] ?? 0),
                    !empty($variant['mrp']) ? (float)$variant['mrp'] : null,
                    (int)($variant['stock_quantity'] ?? 0),
                    !empty($variant['is_default']) || $index === 0 ? 1 : 0,
                    $variant['sku_extension'] ?? '',
                ]);
            }
        }

        if (isset($input['specifications']) && is_array($input['specifications'])) {
            $this->db->prepare("DELETE FROM product_specifications WHERE product_id = ?")->execute([$productId]);
            $stmt = $this->db->prepare("INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (?, ?, ?)");
            foreach ($input['specifications'] as $specification) {
                $key = trim($specification['spec_key'] ?? '');
                $value = trim($specification['spec_value'] ?? '');
                if ($key !== '' && $value !== '') {
                    $stmt->execute([$productId, $key, $value]);
                }
            }
        }
    }

    /**
     * DELETE /api/products/:id
     */
    public function destroy(int $id): void {
        header('Content-Type: application/json');
        $stmt = $this->db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Product deleted successfully.']);
    }
}
