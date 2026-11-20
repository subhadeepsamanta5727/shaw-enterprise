<?php
declare(strict_types=1);

$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$requestPath = '/' . trim($requestPath, '/');
if ($requestPath === '//') {
    $requestPath = '/';
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
$title = $routes[$page] ?? 'Shaw Enterprise';
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
    default => 'home',
};
if ($pageType === 'admin' && $slug === 'login') {
    $pageType = 'admin-login';
    $title = 'Administrator Login';
}
if ($page !== 'products' && $page !== 'blogs' && !isset($routes[$page]) && $route !== '') {
    http_response_code(404);
    $pageType = 'not-found';
    $title = 'Page Not Found';
}
$title = htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$encodedSlug = htmlspecialchars($slug, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
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

try {
    require_once __DIR__ . '/app/Support/Database.php';
    $db = Database::getConnection();
    $stmt = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'general' LIMIT 1");
    $rawSettings = $stmt ? $stmt->fetchColumn() : null;
    if ($rawSettings) {
        $settingsData = json_decode((string)$rawSettings, true);
        if (is_array($settingsData)) {
            if (!empty($settingsData['site_name'])) {
                $footerSiteName = trim((string)$settingsData['site_name']);
            }
            if (!empty($settingsData['tagline'])) {
                $footerTagline = trim((string)$settingsData['tagline']);
            }
            $addr = $settingsData['registered_office_address'] ?? $settingsData['address'] ?? '';
            if (!empty($addr)) {
                $footerAddress = trim((string)$addr);
            }
            if (isset($settingsData['proprietor'])) {
                $footerProprietor = trim((string)$settingsData['proprietor']);
            }
            if (!empty($settingsData['phone'])) {
                $footerPhone = trim((string)$settingsData['phone']);
            }
            if (isset($settingsData['phone_secondary'])) {
                $footerPhoneSecondary = trim((string)$settingsData['phone_secondary']);
            }
            if (!empty($settingsData['email'])) {
                $footerEmail = trim((string)$settingsData['email']);
            }
            if (!empty($settingsData['whatsapp'])) {
                $footerWhatsapp = trim((string)$settingsData['whatsapp']);
            } elseif (!empty($footerPhone)) {
                $footerWhatsapp = $footerPhone;
            }
            $rawLogo = $settingsData['logo_url'] ?? $settingsData['site_logo'] ?? $settingsData['logo'] ?? '';
            if (!empty($rawLogo)) {
                $siteLogoUrl = trim((string)$rawLogo);
                if (!str_starts_with($siteLogoUrl, 'http://') && !str_starts_with($siteLogoUrl, 'https://') && !str_starts_with($siteLogoUrl, '/')) {
                    $siteLogoUrl = '/uploads/' . ltrim($siteLogoUrl, '/');
                }
            }
        }
    }
} catch (\Throwable $e) {
    // Graceful fallback to default values if database is temporarily unavailable
}

$footerPhoneHref = preg_replace('/[^\d+]/', '', $footerPhone);
$footerPhoneSecondaryHref = preg_replace('/[^\d+]/', '', $footerPhoneSecondary);
$footerWhatsappDigits = preg_replace('/\D/', '', $footerWhatsapp);

require __DIR__ . '/app/Views/storefront.php';
