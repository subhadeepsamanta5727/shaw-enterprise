<?php

class UploadController {
    private string $uploadDir;
    private string $baseUrl;

    public function __construct() {
        $config = require dirname(__DIR__) . '/config/database.php';
        $this->uploadDir = $config['app']['uploads_dir'];
        $this->baseUrl = rtrim($config['app']['base_url'], '/');

        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
    }

    /**
     * POST /api/upload
     * Store image in local uploads folder
     */
    public function upload(): void {
        header('Content-Type: application/json');

        $file = $_FILES['image'] ?? $_FILES['file'] ?? null;

        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'No valid image file was uploaded or an upload error occurred.'
            ]);
            return;
        }

        // Validate MIME type & extension
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if (!in_array($ext, $allowedExtensions)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid file format. Only JPG, PNG, WEBP, GIF, and SVG images are permitted.'
            ]);
            return;
        }

        // Generate clean unique filename
        $rawName = pathinfo($file['name'], PATHINFO_FILENAME);
        $cleanName = preg_replace('/[^a-zA-Z0-9_-]/', '-', strtolower($rawName));
        $uniqueName = $cleanName . '-' . time() . '-' . rand(1000, 9999) . '.' . $ext;
        $destination = $this->uploadDir . DIRECTORY_SEPARATOR . $uniqueName;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $relativeUrl = '/uploads/' . $uniqueName;
            $fullUrl = $this->baseUrl . $relativeUrl;

            http_response_code(201);
            echo json_encode([
                'success'   => true,
                'message'   => 'Image stored successfully in local uploads folder.',
                'filename'  => $uniqueName,
                'url'       => $relativeUrl,
                'fullUrl'   => $fullUrl,
                'size'      => $file['size'],
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to save uploaded file to local server directory.'
            ]);
        }
    }

    /**
     * POST /api/upload/catalog
     * Store the downloadable product catalog PDF in the local uploads folder
     */
    public function uploadCatalog(): void {
        header('Content-Type: application/json');

        $file = $_FILES['file'] ?? null;
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Select a PDF catalog to upload or check the upload error.'
            ]);
            return;
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $fileInfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $fileInfo->file($file['tmp_name']);
        $signature = file_get_contents($file['tmp_name'], false, null, 0, 5);

        if ($ext !== 'pdf' || $mimeType !== 'application/pdf' || $signature !== '%PDF-') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Only valid PDF files are allowed.'
            ]);
            return;
        }

        if ($file['size'] > 25 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'The catalog PDF must be 25MB or smaller.'
            ]);
            return;
        }

        $rawName = pathinfo($file['name'], PATHINFO_FILENAME);
        $cleanName = preg_replace('/[^a-zA-Z0-9_-]/', '-', strtolower($rawName));
        $uniqueName = $cleanName . '-' . time() . '-' . rand(1000, 9999) . '.pdf';
        $destination = $this->uploadDir . DIRECTORY_SEPARATOR . $uniqueName;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to save the catalog PDF to the local uploads folder.'
            ]);
            return;
        }

        $relativeUrl = '/uploads/' . $uniqueName;
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Catalog PDF uploaded successfully.',
            'filename' => $uniqueName,
            'url' => $relativeUrl,
            'fullUrl' => $this->baseUrl . $relativeUrl,
            'size' => $file['size'],
        ]);
    }

    /**
     * GET /api/upload/list
     * List all images currently saved in the local uploads directory
     */
    public function listFiles(): void {
        header('Content-Type: application/json');

        if (!is_dir($this->uploadDir)) {
            echo json_encode(['success' => true, 'count' => 0, 'files' => []]);
            return;
        }

        $files = scandir($this->uploadDir);
        $result = [];

        foreach ($files as $f) {
            if ($f === '.' || $f === '..') continue;
            $filePath = $this->uploadDir . DIRECTORY_SEPARATOR . $f;
            if (is_file($filePath)) {
                $result[] = [
                    'filename' => $f,
                    'url'      => '/uploads/' . $f,
                    'fullUrl'  => $this->baseUrl . '/uploads/' . $f,
                    'size'     => filesize($filePath),
                    'time'     => filemtime($filePath),
                ];
            }
        }

        echo json_encode([
            'success' => true,
            'count'   => count($result),
            'files'   => $result
        ]);
    }
}
