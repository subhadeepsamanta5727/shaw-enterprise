<?php
declare(strict_types=1);

header('Content-Type: application/xml; charset=utf-8');

require_once __DIR__ . '/app/Support/Database.php';

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower($_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https')
    || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);
$protocol = $isHttps ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'shawenterprise.in';
$baseUrl = $protocol . '://' . $host;

try {
    $db = Database::getConnection();
    $stmt = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'general' LIMIT 1");
    $rawSettings = $stmt ? $stmt->fetchColumn() : null;
    if ($rawSettings) {
        $settingsData = json_decode((string)$rawSettings, true);
        if (!empty($settingsData['canonical_domain'])) {
            $baseUrl = rtrim((string)$settingsData['canonical_domain'], '/');
        }
    }
} catch (\Throwable $e) {
    // Fall back to request host
}

$staticPages = [
    ['loc' => '/', 'priority' => '1.0', 'freq' => 'daily'],
    ['loc' => '/products', 'priority' => '0.9', 'freq' => 'daily'],
    ['loc' => '/about', 'priority' => '0.8', 'freq' => 'monthly'],
    ['loc' => '/clients', 'priority' => '0.8', 'freq' => 'weekly'],
    ['loc' => '/blogs', 'priority' => '0.8', 'freq' => 'weekly'],
    ['loc' => '/contact', 'priority' => '0.8', 'freq' => 'monthly'],
    ['loc' => '/images', 'priority' => '0.7', 'freq' => 'monthly'],
    ['loc' => '/privacy-policy', 'priority' => '0.4', 'freq' => 'yearly'],
    ['loc' => '/terms', 'priority' => '0.4', 'freq' => 'yearly'],
    ['loc' => '/payment-policy', 'priority' => '0.4', 'freq' => 'yearly'],
    ['loc' => '/disclaimer', 'priority' => '0.4', 'freq' => 'yearly'],
];

$products = [];
$blogs = [];

try {
    if (isset($db)) {
        $stmtP = $db->query("SELECT slug, id, updated_at FROM products WHERE is_active = 1 ORDER BY id DESC");
        if ($stmtP) {
            $products = $stmtP->fetchAll(\PDO::FETCH_ASSOC);
        }
        $stmtB = $db->query("SELECT slug, id, updated_at FROM blogs WHERE is_active = 1 ORDER BY id DESC");
        if ($stmtB) {
            $blogs = $stmtB->fetchAll(\PDO::FETCH_ASSOC);
        }
    }
} catch (\Throwable $e) {
    // Graceful degradation
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<?php foreach ($staticPages as $page): ?>
    <url>
        <loc><?= htmlspecialchars($baseUrl . $page['loc'], ENT_XML1, 'UTF-8') ?></loc>
        <changefreq><?= $page['freq'] ?></changefreq>
        <priority><?= $page['priority'] ?></priority>
    </url>
<?php endforeach; ?>
<?php foreach ($products as $prod): 
    $slugOrId = !empty($prod['slug']) ? $prod['slug'] : $prod['id'];
    $lastMod = !empty($prod['updated_at']) ? date('Y-m-d', strtotime($prod['updated_at'])) : date('Y-m-d');
?>
    <url>
        <loc><?= htmlspecialchars($baseUrl . '/products/' . rawurlencode((string)$slugOrId), ENT_XML1, 'UTF-8') ?></loc>
        <lastmod><?= $lastMod ?></lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
<?php endforeach; ?>
<?php foreach ($blogs as $blog): 
    $slugOrId = !empty($blog['slug']) ? $blog['slug'] : $blog['id'];
    $lastMod = !empty($blog['updated_at']) ? date('Y-m-d', strtotime($blog['updated_at'])) : date('Y-m-d');
?>
    <url>
        <loc><?= htmlspecialchars($baseUrl . '/blogs/' . rawurlencode((string)$slugOrId), ENT_XML1, 'UTF-8') ?></loc>
        <lastmod><?= $lastMod ?></lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
<?php endforeach; ?>
</urlset>
