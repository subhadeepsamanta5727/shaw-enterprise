import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import { createMysqlDevMiddleware } from './backend/vite-mysql-middleware.js';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'local-mysql-and-images',
      configureServer(server) {
        // 1. MySQL Live REST API Middleware (Direct real-time MySQL database queries)
        server.middlewares.use(createMysqlDevMiddleware());

        // 2. Local Image Storage Server (Serves all images directly from backend/uploads on disk)
        const serveLocalImage = (req, res, next) => {
          try {
            const rawUrl = decodeURIComponent(req.url.split('?')[0]);
            // Strip any leading slashes or duplicate storage/uploads segments
            let clean = rawUrl;
            while (/^[/\\]*(storage|uploads)[/\\]*/i.test(clean)) {
              clean = clean.replace(/^[/\\]*(storage|uploads)[/\\]*/i, '');
            }
            clean = clean.replace(/^[/\\]+/, '');

            const localPath = path.resolve(__dirname, 'backend/uploads', clean);

            if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
              const ext = path.extname(localPath).toLowerCase();
              const mimeMap = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml',
                '.gif': 'image/gif',
                '.bmp': 'image/bmp',
                '.ico': 'image/x-icon',
                '.pdf': 'application/pdf',
              };
              res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
              if (ext === '.pdf') {
                res.setHeader('Content-Disposition', 'attachment; filename="Shaw-Enterprise-Catalog.pdf"');
              }
              res.setHeader('Cache-Control', 'public, max-age=86400');
              const stream = fs.createReadStream(localPath);
              return stream.pipe(res);
            }

            // If an image extension was requested but not found on disk, return a clean SVG placeholder
            const ext = path.extname(clean).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
              res.setHeader('Content-Type', 'image/svg+xml');
              res.setHeader('Cache-Control', 'no-cache');
              const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" font-family="sans-serif" font-size="18" fill="#64748b" dominant-baseline="middle" text-anchor="middle">Shaw Enterprise Image</text></svg>`;
              return res.end(svg);
            }
          } catch (err) {
            console.error('[Image Server Error]', err);
          }
          next();
        };

        server.middlewares.use('/storage', serveLocalImage);
        server.middlewares.use('/uploads', serveLocalImage);
      },
    },
  ],
  resolve: {
    alias: {
      '@inertiajs/react': path.resolve(__dirname, 'resources/js/inertia-adapter.jsx'),
      '@': path.resolve(__dirname, 'resources/js'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
