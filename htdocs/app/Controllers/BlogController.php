<?php
require_once dirname(__DIR__) . '/Support/Database.php';

class BlogController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function index(): void {
        header('Content-Type: application/json');
        $adminQuery = ($_GET['admin'] ?? '') === '1';
        $stmt = $this->db->query("SELECT * FROM blogs "
            . ($adminQuery ? "" : "WHERE is_published = 1 ")
            . "ORDER BY id DESC");
        $blogs = $stmt->fetchAll();
        foreach ($blogs as &$blog) {
            $blog['is_published'] = (bool)$blog['is_published'];
        }
        echo json_encode(['success' => true, 'count' => count($blogs), 'data' => $blogs]);
    }

    public function show(string $idOrSlug): void {
        header('Content-Type: application/json');
        $isId = is_numeric($idOrSlug);
        $adminQuery = ($_GET['admin'] ?? '') === '1';
        $sql = "SELECT * FROM blogs WHERE " . ($isId ? "id = ?" : "slug = ?")
            . ($adminQuery ? "" : " AND is_published = 1") . " LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$idOrSlug]);
        $blog = $stmt->fetch();

        if (!$blog) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Article not found.']);
            return;
        }

        $blog['is_published'] = (bool)$blog['is_published'];
        echo json_encode(['success' => true, 'data' => $blog]);
    }

    public function store(): void {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $title = trim($input['title'] ?? '');
        if (!$title) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Title is required.']);
            return;
        }

        $slug = trim($input['slug'] ?? '');
        if (!$slug) {
            $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $title));
            $slug = trim($slug, '-');
        }

        // Ensure unique slug
        $chk = $this->db->prepare("SELECT id FROM blogs WHERE slug = ?");
        $chk->execute([$slug]);
        if ($chk->fetch()) {
            $slug .= '-' . time();
        }

        $thumbnail_image = trim($input['thumbnail_image'] ?? '');
        $video_url = trim($input['video_url'] ?? '');
        $author_name = trim($input['author_name'] ?? 'Shaw Enterprise Editorial Team');
        $content = $input['content'] ?? '';
        $meta_title = trim($input['meta_title'] ?? $title);
        $meta_description = trim($input['meta_description'] ?? '');
        $is_published = array_key_exists('is_published', $input) ? (int)(bool)$input['is_published'] : 1;

        $stmt = $this->db->prepare(
            "INSERT INTO blogs (title, slug, thumbnail_image, video_url, author_name, content, meta_title, meta_description, is_published)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $title,
            $slug,
            $thumbnail_image,
            $video_url,
            $author_name,
            $content,
            $meta_title,
            $meta_description,
            $is_published
        ]);

        $id = (int)$this->db->lastInsertId();
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Blog published successfully in MySQL',
            'id' => $id,
            'data' => [
                'id' => $id,
                'title' => $title,
                'slug' => $slug,
                'thumbnail_image' => $thumbnail_image,
                'video_url' => $video_url,
                'author_name' => $author_name,
                'content' => $content,
                'is_published' => (bool)$is_published,
            ]
        ]);
    }

    public function update(int $id): void {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $existingStmt = $this->db->prepare("SELECT * FROM blogs WHERE id = ? LIMIT 1");
        $existingStmt->execute([$id]);
        $existing = $existingStmt->fetch();
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Article not found.']);
            return;
        }

        $title = trim((string)($input['title'] ?? $existing['title']));
        if ($title === '') {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Title is required.']);
            return;
        }
        $slug = trim((string)($input['slug'] ?? $existing['slug']));
        if ($slug === '') {
            $slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9]+/', '-', $title), '-'));
        }
        $duplicateStmt = $this->db->prepare("SELECT id FROM blogs WHERE slug = ? AND id != ?");
        $duplicateStmt->execute([$slug, $id]);
        if ($duplicateStmt->fetch()) {
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Another article already uses that slug.']);
            return;
        }

        $stmt = $this->db->prepare(
            "UPDATE blogs SET title = ?, slug = ?, thumbnail_image = ?, video_url = ?,
                author_name = ?, content = ?, meta_title = ?, meta_description = ?,
                is_published = ? WHERE id = ?"
        );
        $stmt->execute([
            $title,
            $slug,
            $input['thumbnail_image'] ?? $existing['thumbnail_image'],
            $input['video_url'] ?? $existing['video_url'],
            $input['author_name'] ?? $existing['author_name'],
            $input['content'] ?? $existing['content'],
            $input['meta_title'] ?? $existing['meta_title'],
            $input['meta_description'] ?? $existing['meta_description'],
            array_key_exists('is_published', $input) ? (int)(bool)$input['is_published'] : (int)$existing['is_published'],
            $id,
        ]);

        echo json_encode(['success' => true, 'message' => 'Blog updated successfully in MySQL.']);
    }

    public function destroy(int $id): void {
        header('Content-Type: application/json');
        $stmt = $this->db->prepare("DELETE FROM blogs WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Blog removed from MySQL']);
    }
}
