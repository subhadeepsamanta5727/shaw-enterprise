<?php
declare(strict_types=1);

$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$requestPath = '/' . trim($requestPath, '/');
if ($requestPath === '//') {
    $requestPath = '/';
}

if ($requestPath === '/sitemap.xml') {
    require __DIR__ . '/sitemap.php';
    exit;
}

if (preg_match('#^/(api|uploads|storage)(/|$)#', $requestPath)) {
    require __DIR__ . '/app/Http/api.php';
    exit;
}

$route = trim($requestPath, '/');
$segments = $route === '' ? [] : explode('/', $route);
$page = $segments[0] ?? 'home';
$slug = $segments[1] ?? '';

$routes = [
    'about' => 'About Shaw Enterprise',
    'about-us' => 'About Shaw Enterprise',
    'products' => $slug !== '' ? 'Product Details' : 'Our Products',
    'blogs' => $slug !== '' ? 'Article' : 'Insights & Guides',
    'clients' => 'Our Clients',
    'our-clients' => 'Our Clients',
    'contact' => 'Contact Us',
    'images' => 'Product Gallery',
    'gallery' => 'Product Gallery',
    'privacy-policy' => 'Privacy Policy',
    'terms' => 'Terms & Conditions',
    'terms-conditions' => 'Terms & Conditions',
    'terms-and-conditions' => 'Terms & Conditions',
    'payment-policy' => 'Payment Policy',
    'disclaimer' => 'Disclaimer',
    'admin' => 'Admin Dashboard',
    'testimonials' => 'Customer Testimonials',
];

$pageType = match ($page) {
    'about', 'about-us' => 'about',
    'products' => $slug !== '' ? 'product' : 'products',
    'blogs' => $slug !== '' ? 'blog' : 'blogs',
    'clients', 'our-clients' => 'clients',
    'contact' => 'contact',
    'images', 'gallery' => 'images',
    'privacy-policy', 'terms', 'terms-conditions', 'terms-and-conditions', 'payment-policy', 'disclaimer' => 'legal',
    'admin' => 'admin',
    'testimonials' => 'home',
    default => ($route === '' ? 'home' : 'not-found'),
};

if ($pageType === 'admin' && $slug === 'login') {
    $pageType = 'admin-login';
}

if ($pageType === 'not-found') {
    http_response_code(404);
}

$cssPath = '/assets/css/app.css';
$jsPath = '/assets/js/app.js';

$footerSiteName = 'Shaw Enterprise';
$footerTagline = 'Manufacturer, Wholesaler & Retailer of Writing Boards, Display Systems & Educational Accessories';
$footerAddress = '44/1B, Beniatola Lane (College Street), Kolkata – 700009, W.B';
$footerProprietor = 'Mr. Indrajit Shaw';
$footerPhone = '+91 9933944007';
$footerPhoneSecondary = '+91 7003779114';
$footerEmail = 'shaw.entt.edu@gmail.com';
$footerWhatsapp = '+91 9933944007';
$siteLogoUrl = '';
$canonicalDomain = '';
$googleSiteVerification = '';
$googleAnalyticsId = '';
$establishedYear = '2014';
$matchedProduct = null;
$matchedBlog = null;

try {
    require_once __DIR__ . '/app/Support/Database.php';
    $db = Database::getConnection();
    $stmt = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'general' LIMIT 1");
    $rawSettings = $stmt ? $stmt->fetchColumn() : null;
    if ($rawSettings) {
        $settingsData = json_decode((string)$rawSettings, true);
        if (is_array($settingsData)) {
            if (!empty($settingsData['site_name'])) $footerSiteName = trim((string)$settingsData['site_name']);
            if (!empty($settingsData['tagline'])) $footerTagline = trim((string)$settingsData['tagline']);
            $addr = $settingsData['registered_office_address'] ?? $settingsData['address'] ?? '';
            if (!empty($addr)) $footerAddress = trim((string)$addr);
            if (isset($settingsData['proprietor'])) $footerProprietor = trim((string)$settingsData['proprietor']);
            if (!empty($settingsData['phone'])) $footerPhone = trim((string)$settingsData['phone']);
            if (isset($settingsData['phone_secondary'])) $footerPhoneSecondary = trim((string)$settingsData['phone_secondary']);
            if (!empty($settingsData['email'])) $footerEmail = trim((string)$settingsData['email']);
            if (!empty($settingsData['whatsapp'])) $footerWhatsapp = trim((string)$settingsData['whatsapp']);
            elseif (!empty($footerPhone)) $footerWhatsapp = $footerPhone;
            if (!empty($settingsData['canonical_domain'])) $canonicalDomain = trim((string)$settingsData['canonical_domain']);
            if (!empty($settingsData['google_site_verification'])) $googleSiteVerification = trim((string)$settingsData['google_site_verification']);
            if (!empty($settingsData['google_analytics_id'])) $googleAnalyticsId = trim((string)$settingsData['google_analytics_id']);
            if (!empty($settingsData['established_year'])) $establishedYear = trim((string)$settingsData['established_year']);

            $rawLogo = $settingsData['logo_url'] ?? $settingsData['site_logo'] ?? $settingsData['logo'] ?? '';
            if (!empty($rawLogo)) {
                $siteLogoUrl = trim((string)$rawLogo);
                if (!str_starts_with($siteLogoUrl, 'http://') && !str_starts_with($siteLogoUrl, 'https://') && !str_starts_with($siteLogoUrl, '/')) {
                    $siteLogoUrl = '/uploads/' . ltrim($siteLogoUrl, '/');
                }
            }
        }
    }

    if ($pageType === 'product' && !empty($slug)) {
        $stmtP = $db->prepare("SELECT id, title, slug, short_description, main_image, base_price, is_active FROM products WHERE (slug = :slug OR id = :id) AND is_active = 1 LIMIT 1");
        $stmtP->execute([':slug' => $slug, ':id' => is_numeric($slug) ? (int)$slug : 0]);
        $matchedProduct = $stmtP->fetch(\PDO::FETCH_ASSOC) ?: null;
    }

    if ($pageType === 'blog' && !empty($slug)) {
        $stmtB = $db->prepare("SELECT id, title, slug, thumbnail_image, content, is_active FROM blogs WHERE (slug = :slug OR id = :id) AND is_active = 1 LIMIT 1");
        $stmtB->execute([':slug' => $slug, ':id' => is_numeric($slug) ? (int)$slug : 0]);
        $matchedBlog = $stmtB->fetch(\PDO::FETCH_ASSOC) ?: null;
    }
} catch (\Throwable $e) {
    // Graceful fallback to default values
}

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443) ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'shaw-enterprise-does.onrender.com';
$baseDomain = !empty($canonicalDomain) ? rtrim($canonicalDomain, '/') : ($protocol . '://' . $host);
$canonicalUrl = $baseDomain . ($requestPath === '/' ? '' : $requestPath);

$footerPhoneHref = preg_replace('/[^\d+]/', '', $footerPhone);
$footerPhoneSecondaryHref = preg_replace('/[^\d+]/', '', $footerPhoneSecondary);
$footerWhatsappDigits = preg_replace('/\D/', '', $footerWhatsapp);

// Page Title, Meta Description, OG Image logic
$ogType = 'website';
$ogImage = $siteLogoUrl;

if ($pageType === 'product' && $matchedProduct) {
    $pageTitle = $matchedProduct['title'] . ' | Shaw Enterprise Kolkata';
    $metaDescription = !empty($matchedProduct['short_description']) 
        ? trim(strip_tags((string)$matchedProduct['short_description'])) 
        : 'Buy ' . $matchedProduct['title'] . ' at direct factory prices from Shaw Enterprise, College Street Kolkata. Available in custom dimensions and wholesale quantities.';
    if (!empty($matchedProduct['main_image'])) $ogImage = $matchedProduct['main_image'];
    $ogType = 'product';
} elseif ($pageType === 'blog' && $matchedBlog) {
    $pageTitle = $matchedBlog['title'] . ' | Shaw Enterprise Blog';
    $metaDescription = !empty($matchedBlog['content']) 
        ? trim(preg_replace('/\s+/', ' ', substr(strip_tags((string)$matchedBlog['content']), 0, 155))) . '...'
        : 'Helpful advice and guides from the manufacturing specialists at Shaw Enterprise.';
    if (!empty($matchedBlog['thumbnail_image'])) $ogImage = $matchedBlog['thumbnail_image'];
    $ogType = 'article';
} else {
    $metaDescriptions = [
        'home' => 'Shaw Enterprise (Est. ' . $establishedYear . ') is Kolkata\'s premier manufacturer of ceramic green boards, magnetic whiteboards, display stands, notice boards & school TLM products.',
        'about' => 'Founded in ' . $establishedYear . ' by Mr. Indrajit Shaw, Shaw Enterprise manufactures and supplies writing boards, bulletin display systems & educational furniture across Eastern India.',
        'products' => 'Browse Kolkata\'s widest range of ceramic chalkboards, magnetic whiteboards, pin-up notice boards, exhibition stands, and school TLM products at factory rates.',
        'clients' => 'Trusted supplier to Presidency University, Calcutta University, St. Xavier\'s College, South Point, and 500+ schools, colleges, and corporate offices.',
        'blogs' => 'Read guides, buying tips, and maintenance advice for writing boards, classroom furniture, and institutional display systems from Shaw Enterprise.',
        'contact' => 'Get factory price quotes for writing boards, display systems, and custom furniture. Call +91 9933944007 or visit 44/1B Beniatola Lane, College Street, Kolkata.',
        'images' => 'View photos of Shaw Enterprise writing boards, mobile revolving stands, acrylic display systems, and institutional furniture installations.',
        'legal' => 'Official terms, policies, and quality standards of Shaw Enterprise, manufacturer of educational and office display systems in Kolkata.',
        'not-found' => 'The requested page could not be found. Browse Shaw Enterprise products or contact our team for assistance.',
    ];

    $pageTitles = [
        'home' => 'Shaw Enterprise | Manufacturer of Writing Boards & Office Furniture Kolkata',
        'about' => 'About Shaw Enterprise | Writing Board Manufacturer Since ' . $establishedYear,
        'products' => 'Products Catalogue | Writing & Display Boards | Shaw Enterprise',
        'clients' => 'Our Institutional Clients | Universities & Schools | Shaw Enterprise',
        'blogs' => 'Insights & Guides | Shaw Enterprise Blog',
        'contact' => 'Contact Us | College Street Office & Balagarh Workshop | Shaw Enterprise',
        'images' => 'Product Photo Gallery | Shaw Enterprise Kolkata',
        'admin' => 'Admin Dashboard | Shaw Enterprise',
        'admin-login' => 'Admin Login | Shaw Enterprise',
        'not-found' => 'Page Not Found | Shaw Enterprise',
    ];

    $pageTitle = $pageTitles[$pageType] ?? ($footerSiteName . ' | Kolkata');
    $metaDescription = $metaDescriptions[$pageType] ?? ($footerSiteName . ' — manufacturer and wholesaler of writing boards in Kolkata.');
}

if (!empty($ogImage)) {
    if (!str_starts_with($ogImage, 'http://') && !str_starts_with($ogImage, 'https://')) {
        $ogImage = $baseDomain . '/' . ltrim($ogImage, '/');
    }
}

$title = htmlspecialchars($pageTitle, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$encodedSlug = htmlspecialchars($slug, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

require __DIR__ . '/app/Views/storefront.php';
