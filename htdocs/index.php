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
require __DIR__ . '/app/Views/storefront.php';
