<?php
/**
 * =========================================================================
 * SHAW ENTERPRISE - REST API CENTRAL ROUTER (PHP)
 * =========================================================================
 * Connected to MySQL Database: shaw_enterprise
 * Handles all CORS, Static Local File Uploads & RESTful API Routing.
 */

// Global CORS Configuration
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Max-Age: 86400");

// Handle HTTP preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Autoload Controllers
require_once __DIR__ . '/config/db_connect.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/CategoryController.php';
require_once __DIR__ . '/controllers/ProductController.php';
require_once __DIR__ . '/controllers/ClientController.php';
require_once __DIR__ . '/controllers/InquiryController.php';
require_once __DIR__ . '/controllers/OrderController.php';
require_once __DIR__ . '/controllers/SettingController.php';
require_once __DIR__ . '/controllers/TestimonialController.php';
require_once __DIR__ . '/controllers/BlogController.php';

// Parse incoming request URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Handle static images from local uploads directory directly if routed here
if (strpos($uri, '/uploads/') === 0 || strpos($uri, '/storage/') === 0) {
    $subPath = preg_replace('#^/(storage|uploads)/#i', '', $uri);
    while (preg_match('#^(storage|uploads)/#i', $subPath)) {
        $subPath = preg_replace('#^(storage|uploads)/#i', '', $subPath);
    }
    // Prevent directory traversal
    $subPath = str_replace(['../', '..\\'], '', $subPath);
    $subPath = ltrim($subPath, '/\\');
    $filePath = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $subPath);

    if (file_exists($filePath) && is_file($filePath)) {
        $mime = mime_content_type($filePath) ?: 'application/octet-stream';
        header("Content-Type: {$mime}");
        if (strtolower(pathinfo($filePath, PATHINFO_EXTENSION)) === 'pdf') {
            header('Content-Disposition: attachment; filename="Shaw-Enterprise-Catalog.pdf"');
        }
        header("Content-Length: " . filesize($filePath));
        header("Cache-Control: public, max-age=31536000");
        readfile($filePath);
        exit;
    } else {
        // Fallback placeholder SVG so browser images never break or receive HTML
        header("Content-Type: image/svg+xml");
        header("Cache-Control: no-cache");
        echo '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" font-family="sans-serif" font-size="18" fill="#64748b" dominant-baseline="middle" text-anchor="middle">Shaw Enterprise Image</text></svg>';
        exit;
    }
}

// Clean API route path
// Normalize path by stripping subfolders if deployed in subdirectories (e.g. /backend/api -> /api)
$path = preg_replace('#^.*?/api#', '/api', $uri);
$segments = explode('/', trim($path, '/'));

// $segments[0] will be 'api', $segments[1] will be resource ('products', 'clients', etc.)
$resource = $segments[1] ?? '';
$param = $segments[2] ?? null;
$subAction = $segments[3] ?? null;

// Route: Health Check
if ($resource === 'health' || $resource === '') {
    header('Content-Type: application/json');
    try {
        $db = Database::getConnection();
        $db->query("SELECT 1");
        echo json_encode([
            'status'    => 'ok',
            'server'    => 'Shaw Enterprise PHP REST API',
            'database'  => 'MySQL 8.0 connected',
            'timestamp' => date('c'),
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status'  => 'error',
            'message' => 'Database connection failed: ' . $e->getMessage()
        ]);
    }
    exit;
}

// Route: Uploads (Local Folder Image Storage)
if ($resource === 'upload') {
    $ctrl = new UploadController();
    if ($method === 'POST') {
        $param === 'catalog' ? $ctrl->uploadCatalog() : $ctrl->upload();
    } elseif ($method === 'GET' && $param === 'list') {
        $ctrl->listFiles();
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed on upload route.']);
    }
    exit;
}

// Route: Categories
if ($resource === 'categories') {
    $ctrl = new CategoryController();
    if ($method === 'GET') {
        $param ? $ctrl->show($param) : $ctrl->index();
    } elseif ($method === 'POST') {
        $ctrl->store();
    } elseif ($method === 'PUT' && $param) {
        $ctrl->update((int)$param);
    } elseif ($method === 'DELETE' && $param) {
        $ctrl->destroy((int)$param);
    }
    exit;
}

// Route: Products
if ($resource === 'products') {
    $ctrl = new ProductController();
    if ($method === 'GET') {
        $param ? $ctrl->show($param) : $ctrl->index();
    } elseif ($method === 'POST') {
        $ctrl->store();
    } elseif ($method === 'PUT' && $param) {
        $ctrl->update((int)$param);
    } elseif ($method === 'DELETE' && $param) {
        $ctrl->destroy((int)$param);
    }
    exit;
}

// Route: Clients (Institutional Portfolio with Category Toggles)
if ($resource === 'clients') {
    $ctrl = new ClientController();
    if ($method === 'GET') {
        $param ? $ctrl->show((int)$param) : $ctrl->index();
    } elseif ($method === 'POST') {
        $ctrl->store();
    } elseif ($method === 'PUT' && $param) {
        $ctrl->update((int)$param);
    } elseif ($method === 'DELETE' && $param) {
        $ctrl->destroy((int)$param);
    }
    exit;
}

// Route: Institutional Inquiries / RFQ
if ($resource === 'inquiries' || $resource === 'bulk-inquiries') {
    $ctrl = new InquiryController();
    if ($method === 'POST') {
        $ctrl->store();
    } elseif ($method === 'GET') {
        $ctrl->index();
    } elseif ($method === 'PATCH' && $param && $subAction === 'status') {
        $ctrl->updateStatus((int)$param);
    } elseif ($method === 'DELETE' && $param) {
        $ctrl->destroy((int)$param);
    }
    exit;
}

// Route: Orders & Retail Checkout
if ($resource === 'orders') {
    $ctrl = new OrderController();
    if ($method === 'POST') {
        $ctrl->store();
    } elseif ($method === 'GET') {
        $param ? $ctrl->show($param) : $ctrl->index();
    } elseif ($method === 'PATCH' && $param && $subAction === 'status') {
        $ctrl->updateStatus($param);
    } elseif ($method === 'DELETE' && $param) {
        $ctrl->destroy($param);
    }
    exit;
}

// Route: Settings
if ($resource === 'settings') {
    $ctrl = new SettingController();
    if ($method === 'GET') {
        $ctrl->show();
    } elseif ($method === 'PUT') {
        $ctrl->update();
    }
    exit;
}

// Route: Testimonials
if ($resource === 'testimonials') {
    $ctrl = new TestimonialController();
    if ($method === 'GET') {
        $ctrl->index();
    } elseif ($method === 'POST') {
        $ctrl->store();
    } elseif ($method === 'DELETE' && $param) {
        $ctrl->destroy((int)$param);
    }
    exit;
}

// Route: Blogs
if ($resource === 'blogs') {
    $ctrl = new BlogController();
    if ($method === 'GET') {
        $param ? $ctrl->show($param) : $ctrl->index();
    } elseif ($method === 'POST') {
        $ctrl->store();
    } elseif ($method === 'PUT' && $param) {
        $ctrl->update((int)$param);
    } elseif ($method === 'DELETE' && $param) {
        $ctrl->destroy((int)$param);
    }
    exit;
}

// 404 Route Not Found
http_response_code(404);
header('Content-Type: application/json');
echo json_encode([
    'success' => false,
    'message' => 'API endpoint not found: ' . $uri
]);
