import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local directory for storing uploaded images
const uploadDirectory = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBaseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e5)}`;
    cb(null, `${cleanBaseName}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|gif|svg/;
  const isExtValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const isMimeValid = allowedExtensions.test(file.mimetype) || file.mimetype.startsWith('image/');

  if (isExtValid || isMimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter,
});

/**
 * POST /api/upload
 * Upload a single image file to the local uploads folder.
 */
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const relativeUrl = `/uploads/${req.file.filename}`;
    const fullUrl = `${protocol}://${host}${relativeUrl}`;

    return res.status(201).json({
      success: true,
      message: 'Image uploaded successfully to local folder.',
      filename: req.file.filename,
      url: relativeUrl,
      fullUrl,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/upload/multiple
 * Upload up to 10 images at once to the local uploads folder.
 */
router.post('/multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }

    const host = req.get('host');
    const protocol = req.protocol;

    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      fullUrl: `${protocol}://${host}/uploads/${file.filename}`,
      size: file.size,
    }));

    return res.status(201).json({
      success: true,
      message: `${req.files.length} images uploaded successfully.`,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('❌ Upload multiple error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/upload/list
 * List all uploaded files in the local folder.
 */
router.get('/list', (req, res) => {
  try {
    const files = fs.readdirSync(uploadDirectory);
    const host = req.get('host');
    const protocol = req.protocol;

    const list = files.map((filename) => {
      const stats = fs.statSync(path.join(uploadDirectory, filename));
      return {
        filename,
        url: `/uploads/${filename}`,
        fullUrl: `${protocol}://${host}/uploads/${filename}`,
        size: stats.size,
        createdAt: stats.birthtime,
      };
    });

    return res.json({ success: true, count: list.length, files: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

