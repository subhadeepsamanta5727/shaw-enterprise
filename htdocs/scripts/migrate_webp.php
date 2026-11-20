<?php
/**
 * Shaw Enterprise - Batch WebP Image Conversion & Database Migration Script
 *
 * 1. Scans htdocs/storage/uploads recursively for all .jpg, .jpeg, and .png files.
 * 2. Converts each image to .webp with quality 85 and alpha transparency preservation.
 * 3. Keeps original files as backup/fallbacks.
 * 4. Updates database references across products, product_images, categories, blogs, and settings.
 * 5. Can be executed safely via CLI or Docker entrypoint idempotently.
 */

declare(strict_types=1);

$baseDir = dirname(__DIR__);
require_once $baseDir . '/config/environment.php';
require_once $baseDir . '/app/Support/Database.php';

$uploadsDir = shawEnv('UPLOADS_DIR') ?: ($baseDir . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'uploads');

echo "========================================================\n";
echo "SHAW ENTERPRISE: BATCH WEBP CONVERSION & DB MIGRATION\n";
echo "========================================================\n";
echo "Uploads directory: {$uploadsDir}\n\n";

if (!is_dir($uploadsDir)) {
    echo "Directory {$uploadsDir} does not exist. Creating it...\n";
    mkdir($uploadsDir, 0755, true);
}

// 1. CONVERT IMAGES ON DISK
$totalFound = 0;
$convertedCount = 0;
$skippedCount = 0;
$errorCount = 0;
$bytesOriginal = 0;
$bytesWebp = 0;

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($uploadsDir, FilesystemIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

foreach ($iterator as $item) {
    if (!$item->isFile()) {
        continue;
    }

    $ext = strtolower($item->getExtension());
    if (!in_array($ext, ['png', 'jpg', 'jpeg'], true)) {
        continue;
    }

    $totalFound++;
    $sourcePath = $item->getRealPath();
    $targetPath = preg_replace('/\.(png|jpe?g)$/i', '.webp', $sourcePath);

    $origSize = filesize($sourcePath);
    $bytesOriginal += $origSize;

    if (file_exists($targetPath) && filesize($targetPath) > 0) {
        $skippedCount++;
        $bytesWebp += filesize($targetPath);
        continue;
    }

    $fileContent = @file_get_contents($sourcePath);
    $img = $fileContent ? @imagecreatefromstring($fileContent) : null;

    if (!$img) {
        $img = match ($ext) {
            'jpg', 'jpeg' => @imagecreatefromjpeg($sourcePath),
            'png'         => @imagecreatefrompng($sourcePath),
            default       => null,
        };
    }

    if (!$img) {
        echo " [ERROR] Failed to load image: {$sourcePath}\n";
        $errorCount++;
        continue;
    }

    // Always ensure alpha/truecolor support for transparency
    imagepalettetotruecolor($img);
    imagealphablending($img, true);
    imagesavealpha($img, true);

    $success = @imagewebp($img, $targetPath, 85);
    imagedestroy($img);

    if ($success && file_exists($targetPath)) {
        $convertedCount++;
        $newSize = filesize($targetPath);
        $bytesWebp += $newSize;
        $savedPct = round((1 - ($newSize / max(1, $origSize))) * 100, 1);
        echo " [OK] Converted: " . basename($sourcePath) . " -> " . basename($targetPath) . " (saved {$savedPct}%)\n";
    } else {
        echo " [ERROR] imagewebp failed on: {$sourcePath}\n";
        $errorCount++;
    }
}

echo "\n--- Conversion Summary ---\n";
echo "Total image files scanned: {$totalFound}\n";
echo "Newly converted to WebP:   {$convertedCount}\n";
echo "Already converted (kept):  {$skippedCount}\n";
echo "Errors:                    {$errorCount}\n";
if ($bytesOriginal > 0) {
    echo "Original size: " . round($bytesOriginal / (1024 * 1024), 2) . " MB\n";
    echo "WebP size:     " . round($bytesWebp / (1024 * 1024), 2) . " MB\n";
    $totalSaved = round((1 - ($bytesWebp / max(1, $bytesOriginal))) * 100, 1);
    echo "Total Storage Saved: {$totalSaved}%\n";
}

// 2. MIGRATE DATABASE REFERENCES
echo "\n--- Updating Database References ---\n";

try {
    $pdo = Database::getConnection();

    // 2a. Categories
    $stmt = $pdo->query("SELECT id, image FROM categories WHERE image IS NOT NULL AND image != ''");
    $catUpdated = 0;
    $upCat = $pdo->prepare("UPDATE categories SET image = ? WHERE id = ?");
    while ($row = $stmt->fetch()) {
        $old = $row['image'];
        $new = preg_replace('/\.(png|jpe?g)$/i', '.webp', $old);
        if ($old !== $new) {
            $upCat->execute([$new, $row['id']]);
            $catUpdated++;
        }
    }
    echo "Categories updated: {$catUpdated}\n";

    // 2b. Product Images (gallery)
    $stmt = $pdo->query("SELECT id, image_url FROM product_images WHERE image_url IS NOT NULL AND image_url != ''");
    $prodImgUpdated = 0;
    $upProdImg = $pdo->prepare("UPDATE product_images SET image_url = ? WHERE id = ?");
    while ($row = $stmt->fetch()) {
        $old = $row['image_url'];
        $new = preg_replace('/\.(png|jpe?g)$/i', '.webp', $old);
        if ($old !== $new) {
            $upProdImg->execute([$new, $row['id']]);
            $prodImgUpdated++;
        }
    }
    echo "Product Images (gallery) updated: {$prodImgUpdated}\n";

    // 2c. Products main_image
    $stmt = $pdo->query("SELECT id, main_image FROM products");
    $prodMainUpdated = 0;
    $upProd = $pdo->prepare("UPDATE products SET main_image = ? WHERE id = ?");
    while ($row = $stmt->fetch()) {
        $old = $row['main_image'];
        if (!empty($old)) {
            $new = preg_replace('/\.(png|jpe?g)$/i', '.webp', $old);
            if ($old !== $new) {
                $upProd->execute([$new, $row['id']]);
                $prodMainUpdated++;
            }
        } else {
            // Populate missing main_image from first product_images entry if available
            $firstImgStmt = $pdo->prepare("SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order ASC, id ASC LIMIT 1");
            $firstImgStmt->execute([$row['id']]);
            $firstImg = $firstImgStmt->fetchColumn();
            if ($firstImg) {
                $upProd->execute([$firstImg, $row['id']]);
                $prodMainUpdated++;
            }
        }
    }
    echo "Products main_image updated: {$prodMainUpdated}\n";

    // 2d. Blogs
    $stmt = $pdo->query("SELECT id, thumbnail_image FROM blogs WHERE thumbnail_image IS NOT NULL AND thumbnail_image != ''");
    $blogsUpdated = 0;
    $upBlog = $pdo->prepare("UPDATE blogs SET thumbnail_image = ? WHERE id = ?");
    while ($row = $stmt->fetch()) {
        $old = $row['thumbnail_image'];
        $new = preg_replace('/\.(png|jpe?g)$/i', '.webp', $old);
        if ($old !== $new) {
            $upBlog->execute([$new, $row['id']]);
            $blogsUpdated++;
        }
    }
    echo "Blogs thumbnail_image updated: {$blogsUpdated}\n";

    // 2e. Settings
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings WHERE setting_key = 'general'");
    $setting = $stmt->fetch();
    if ($setting) {
        $raw = $setting['setting_value'];
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            // Update logo fields
            if (!empty($decoded['logo'])) {
                $decoded['logo'] = preg_replace('/\.(png|jpe?g)$/i', '.webp', $decoded['logo']);
            }
            if (!empty($decoded['logo_url'])) {
                $decoded['logo_url'] = preg_replace('/\.(png|jpe?g)$/i', '.webp', $decoded['logo_url']);
            }
            if (!empty($decoded['site_logo'])) {
                $decoded['site_logo'] = preg_replace('/\.(png|jpe?g)$/i', '.webp', $decoded['site_logo']);
            }
            // Keep favicon as-is for maximum legacy browser compatibility, or convert if needed
            $newVal = json_encode($decoded, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            if ($newVal !== $raw) {
                $upSet = $pdo->prepare("UPDATE settings SET setting_value = ? WHERE setting_key = 'general'");
                $upSet->execute([$newVal]);
                echo "Settings (general) updated with WebP logo references.\n";
            } else {
                echo "Settings (general) already up to date.\n";
            }
        }
    }

    echo "\n[SUCCESS] WebP Database migration complete!\n";
} catch (\Throwable $e) {
    echo "\n[ERROR] Database migration error: " . $e->getMessage() . "\n";
}
