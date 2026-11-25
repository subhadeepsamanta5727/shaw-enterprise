<?php
/**
 * Safe Image Storage Cleanup Script for Shaw Enterprise
 *
 * Removes duplicate .png / .jpg files in storage/uploads when a .webp equivalent exists.
 * Does NOT delete any .webp files.
 *
 * Usage:
 * - Preview mode: https://shawenterprise.in/cleanup_old_images.php?key=shaw2026
 * - Execute delete: https://shawenterprise.in/cleanup_old_images.php?key=shaw2026&action=delete
 */

$key = $_GET['key'] ?? '';
if ($key !== 'shaw2026') {
    http_response_code(403);
    die('<h1>403 Forbidden</h1><p>Missing or invalid secret key. Pass ?key=shaw2026</p>');
}

$uploadsDir = __DIR__ . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'uploads';
if (!is_dir($uploadsDir)) {
    die("Uploads directory not found at: {$uploadsDir}");
}

$action = $_GET['action'] ?? 'preview';

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($uploadsDir, FilesystemIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

$toDelete = [];
$totalBytes = 0;
$webpCount = 0;

foreach ($iterator as $item) {
    if ($item->isDir()) continue;

    $ext = strtolower($item->getExtension());
    if ($ext === 'webp') {
        $webpCount++;
        continue;
    }

    if (in_array($ext, ['png', 'jpg', 'jpeg'], true)) {
        $path = $item->getPathname();
        $webpCounterpart = preg_replace('/\.(png|jpe?g)$/i', '.webp', $path);

        // Safe condition: Only delete if a .webp counterpart exists
        if (file_exists($webpCounterpart)) {
            $size = $item->getSize();
            $toDelete[] = [
                'path' => $path,
                'name' => $item->getFilename(),
                'size' => $size,
            ];
            $totalBytes += $size;
        }
    }
}

$deletedCount = 0;
$deletedBytes = 0;

if ($action === 'delete') {
    foreach ($toDelete as $file) {
        if (@unlink($file['path'])) {
            $deletedCount++;
            $deletedBytes += $file['size'];
        }
    }
}

$totalMb = round($totalBytes / (1024 * 1024), 2);
$deletedMb = round($deletedBytes / (1024 * 1024), 2);

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Storage Cleanup Tool - Shaw Enterprise</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; background: #0f172a; color: #f8fafc; }
        .card { max-width: 800px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
        h1 { margin-top: 0; color: #38bdf8; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-weight: bold; }
        .badge-green { background: #059669; color: #fff; }
        .badge-yellow { background: #d97706; color: #fff; }
        .btn { display: inline-block; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px; cursor: pointer; }
        .btn-danger { background: #e11d48; color: #fff; }
        .btn-primary { background: #2563eb; color: #fff; }
        ul { max-height: 250px; overflow-y: auto; background: #0f172a; padding: 12px 24px; border-radius: 8px; font-family: monospace; font-size: 13px; }
        li { margin-bottom: 4px; color: #cbd5e1; }
    </style>
</head>
<body>
<div class="card">
    <h1>Shaw Enterprise Storage Optimizer</h1>
    <p>Target folder: <code>public_html/storage/uploads/</code></p>
    <p>Active <strong>.webp</strong> images protected: <strong><?= $webpCount ?> files</strong> (Safe, will NOT be touched)</p>

    <?php if ($action === 'delete'): ?>
        <div style="background: #064e3b; border-left: 4px solid #10b981; padding: 16px; border-radius: 8px;">
            <h3> Cleanup Complete!</h3>
            <p>Deleted <strong><?= $deletedCount ?></strong> legacy PNG/JPG files.</p>
            <p>Recovered <strong><?= $deletedMb ?> MB</strong> of server storage space!</p>
        </div>
        <p style="margin-top: 20px;">
            <a href="cleanup_old_images.php?key=shaw2026" class="btn btn-primary">Scan Again</a>
            <span style="margin-left: 10px; color: #94a3b8;">Remember to delete this <code>cleanup_old_images.php</code> file once finished.</span>
        </p>
    <?php else: ?>
        <p>Found <strong><?= count($toDelete) ?></strong> duplicate legacy PNG/JPG files with valid WebP counterparts.</p>
        <p>Potential storage to recover: <span class="badge badge-yellow"><?= $totalMb ?> MB</span></p>

        <?php if (!empty($toDelete)): ?>
            <p>Sample duplicates to be cleaned up:</p>
            <ul>
                <?php foreach (array_slice($toDelete, 0, 15) as $f): ?>
                    <li><?= htmlspecialchars($f['name']) ?> (<?= round($f['size'] / 1024, 1) ?> KB)</li>
                <?php endforeach; ?>
                <?php if (count($toDelete) > 15): ?>
                    <li>... and <?= count($toDelete) - 15 ?> more files</li>
                <?php endIf; ?>
            </ul>

            <form method="GET" action="cleanup_old_images.php" onsubmit="return confirm('Are you sure you want to delete these duplicate PNG/JPG files? Active WebP images will remain safe.');">
                <input type="hidden" name="key" value="shaw2026">
                <input type="hidden" name="action" value="delete">
                <button type="submit" class="btn btn-danger">Permanently Delete <?= count($toDelete) ?> Duplicates (Save <?= $totalMb ?> MB)</button>
            </form>
        <?php else: ?>
            <div style="background: #064e3b; padding: 12px 16px; border-radius: 8px;">
                <span class="badge badge-green">Clean!</span> No duplicate legacy files found. Storage is already optimized!
            </div>
        <?php endif; ?>
    <?php endif; ?>
</div>
</body>
</html>
