<?php
require_once dirname(__DIR__) . '/config/db_connect.php';

class BlogController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function index(): void {
        header('Content-Type: application/json');
        $stmt = $this->db->query("SELECT * FROM blogs WHERE is_published = 1 ORDER BY id DESC");
        $blogs = $stmt->fetchAll();
        foreach ($blogs as &$blog) {
            $blog['is_published'] = (bool)$blog['is_published'];
        }
        echo json_encode(['success' => true, 'count' => count($blogs), 'data' => $blogs]);
    }

    public function show(string $idOrSlug): void {
        header('Content-Type: application/json');
        $isId = is_numeric($idOrSlug);
        $sql = "SELECT * FROM blogs WHERE " . ($isId ? "id = ?" : "slug = ?") . " LIMIT 1";
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
        $is_published = isset($input['is_published']) ? (int)(bool)$input['is_published'] : 1;

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

        $title = trim($input['title'] ?? '');
        $thumbnail_image = trim($input['thumbnail_image'] ?? '');
        $video_url = trim($input['video_url'] ?? '');
        $author_name = trim($input['author_name'] ?? 'Shaw Enterprise Editorial Team');
        $content = $input['content'] ?? '';
        $meta_title = trim($input['meta_title'] ?? '');
        $meta_description = trim($input['meta_description'] ?? '');
        $is_published = isset($input['is_published']) ? (int)(bool)$input['is_published'] : 1;

        $stmt = $this->db->prepare(
            "UPDATE blogs SET
                title = COALESCE(NULLIF(?, ''), title),
                thumbnail_image = COALESCE(NULLIF(?, ''), thumbnail_image),
                video_url = ?,
                author_name = COALESCE(NULLIF(?, ''), author_name),
                content = COALESCE(NULLIF(?, ''), content),
                meta_title = ?,
                meta_description = ?,
                is_published = ?
             WHERE id = ?"
        );
        $stmt->execute([
            $title,
            $thumbnail_image,
            $video_url,
            $author_name,
            $content,
            $meta_title,
            $meta_description,
            $is_published,
            $id
        ]);

        echo json_encode(['success' => true, 'message' => 'Blog updated successfully in MySQL']);
    }

    public function destroy(int $id): void {
        header('Content-Type: application/json');
        $stmt = $this->db->prepare("DELETE FROM blogs WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Blog removed from MySQL']);
    }
}


