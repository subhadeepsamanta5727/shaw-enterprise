import { pool } from './config/db.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const rawName = path.basename(file.originalname, ext);
    const cleanName = rawName.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const uniqueName = `${cleanName}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}${ext}`;
    cb(null, uniqueName);
  },
});

const uploadMiddleware = multer({
  storage: diskStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

async function saveProductRelations(connection, productId, product) {
  if (Array.isArray(product.images)) {
    const images = [...new Set([product.main_image, ...product.images].filter(Boolean))];
    await connection.query('DELETE FROM product_images WHERE product_id = ?', [productId]);
    for (const [index, imageUrl] of images.entries()) {
      await connection.query(
        'INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)',
        [productId, imageUrl, index]
      );
    }
  }

  if (Array.isArray(product.variants)) {
    await connection.query('DELETE FROM product_variants WHERE product_id = ?', [productId]);
    for (const [index, variant] of product.variants.entries()) {
      if (!variant.size_label?.trim()) continue;
      await connection.query(
        `INSERT INTO product_variants
          (product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productId,
          variant.size_label.trim(),
          variant.surface_type || '',
          Number(variant.price) || 0,
          variant.mrp !== null && variant.mrp !== '' ? Number(variant.mrp) : null,
          Number(variant.stock_quantity) || 0,
          variant.is_default || index === 0 ? 1 : 0,
          variant.sku_extension || '',
        ]
      );
    }
  }

  if (Array.isArray(product.specifications)) {
    await connection.query('DELETE FROM product_specifications WHERE product_id = ?', [productId]);
    for (const specification of product.specifications) {
      if (!specification.spec_key?.trim() || !specification.spec_value?.trim()) continue;
      await connection.query(
        'INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (?, ?, ?)',
        [productId, specification.spec_key.trim(), specification.spec_value.trim()]
      );
    }
  }
}

export function createMysqlDevMiddleware() {
  return async (req, res, next) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    // Only handle /api routes
    if (!pathname.startsWith('/api')) {
      return next();
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      return res.end();
    }

    // Helper to read JSON request body
    const getBody = () =>
      new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          try {
            resolve(body ? JSON.parse(body) : {});
          } catch {
            resolve({});
          }
        });
      });

    try {
      // Upload the downloadable product catalog PDF to the local uploads folder.
      if (pathname === '/api/upload/catalog' && req.method === 'POST') {
        return uploadMiddleware.single('file')(req, res, (err) => {
          if (err) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, message: err.message }));
          }

          if (!req.file) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, message: 'Select a PDF catalog to upload.' }));
          }

          let fileDescriptor;
          let signature;
          try {
            if (path.extname(req.file.originalname).toLowerCase() !== '.pdf' || req.file.mimetype !== 'application/pdf') {
              throw new Error('Only PDF files are allowed.');
            }

            fileDescriptor = fs.openSync(req.file.path, 'r');
            const header = Buffer.alloc(5);
            fs.readSync(fileDescriptor, header, 0, header.length, 0);
            signature = header.toString();
          } catch (validationError) {
            fs.rmSync(req.file.path, { force: true });
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, message: validationError.message || 'The uploaded file is not a valid PDF.' }));
          } finally {
            if (fileDescriptor !== undefined) fs.closeSync(fileDescriptor);
          }

          if (signature !== '%PDF-') {
            fs.rmSync(req.file.path, { force: true });
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, message: 'The uploaded file is not a valid PDF.' }));
          }

          const relativeUrl = `/uploads/${req.file.filename}`;
          res.statusCode = 201;
          return res.end(JSON.stringify({
            success: true,
            message: 'Catalog PDF uploaded successfully.',
            filename: req.file.filename,
            url: relativeUrl,
            size: req.file.size,
          }));
        });
      }

      // 0. POST /api/upload (Local file storage in backend/uploads)
      if (pathname === '/api/upload' && req.method === 'POST') {
        return uploadMiddleware.single('image')(req, res, (err) => {
          if (err) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, message: err.message }));
          }
          if (!req.file) {
            return uploadMiddleware.single('file')(req, res, (err2) => {
              if (err2 || !req.file) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ success: false, message: 'No valid image file uploaded.' }));
              }
              const relativeUrl = `/uploads/${req.file.filename}`;
              res.statusCode = 201;
              return res.end(
                JSON.stringify({
                  success: true,
                  message: 'Image stored successfully in local uploads folder.',
                  filename: req.file.filename,
                  url: relativeUrl,
                  fullUrl: `http://localhost:5173${relativeUrl}`,
                  size: req.file.size,
                })
              );
            });
          }

          const relativeUrl = `/uploads/${req.file.filename}`;
          res.statusCode = 201;
          return res.end(
            JSON.stringify({
              success: true,
              message: 'Image stored successfully in local uploads folder.',
              filename: req.file.filename,
              url: relativeUrl,
              fullUrl: `http://localhost:5173${relativeUrl}`,
              size: req.file.size,
            })
          );
        });
      }

      // 0b. GET /api/upload/list
      if (pathname === '/api/upload/list' && req.method === 'GET') {
        if (!fs.existsSync(uploadsDir)) {
          return res.end(JSON.stringify({ success: true, count: 0, files: [] }));
        }
        const files = fs.readdirSync(uploadsDir).filter((f) => {
          try {
            return fs.statSync(path.join(uploadsDir, f)).isFile();
          } catch {
            return false;
          }
        });
        const result = files.map((f) => {
          const stats = fs.statSync(path.join(uploadsDir, f));
          return {
            filename: f,
            url: `/uploads/${f}`,
            fullUrl: `http://localhost:5173/uploads/${f}`,
            size: stats.size,
            time: stats.mtimeMs,
          };
        });
        return res.end(JSON.stringify({ success: true, count: result.length, files: result }));
      }

      // 1. GET /api/categories
      if (pathname === '/api/categories' && req.method === 'GET') {
        const [rows] = await pool.query(
          'SELECT * FROM categories WHERE is_active = 1 ORDER BY display_order ASC, id ASC'
        );
        return res.end(JSON.stringify({ success: true, count: rows.length, data: rows }));
      }

      // 1b. POST /api/categories
      if (pathname === '/api/categories' && req.method === 'POST') {
        const body = await getBody();
        const { name, image, description, display_order } = body;
        const slug = body.slug || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `cat-${Date.now()}`);

        const [resC] = await pool.query(
          `INSERT INTO categories (name, slug, description, image, display_order, is_active)
           VALUES (?, ?, ?, ?, ?, 1)`,
          [
            name || 'Untitled Category',
            slug,
            description || '',
            image || '',
            display_order || 0,
          ]
        );
        res.statusCode = 201;
        return res.end(JSON.stringify({ success: true, message: 'Category created in MySQL', id: resC.insertId }));
      }

      // 1c. PUT /api/categories/:id
      if (pathname.startsWith('/api/categories/') && req.method === 'PUT') {
        const id = Number(pathname.replace('/api/categories/', ''));
        const body = await getBody();
        const { name, slug, image, description, display_order } = body;

        await pool.query(
          `UPDATE categories SET
            name = COALESCE(?, name),
            slug = COALESCE(?, slug),
            image = COALESCE(?, image),
            description = COALESCE(?, description),
            display_order = COALESCE(?, display_order)
           WHERE id = ?`,
          [
            name ?? null,
            slug ?? null,
            image ?? null,
            description ?? null,
            display_order !== undefined ? Number(display_order) : null,
            id,
          ]
        );
        return res.end(JSON.stringify({ success: true, message: 'Category updated in MySQL' }));
      }

      // 1d. DELETE /api/categories/:id
      if (pathname.startsWith('/api/categories/') && req.method === 'DELETE') {
        const id = Number(pathname.replace('/api/categories/', ''));
        await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        return res.end(JSON.stringify({ success: true, message: 'Category deleted from MySQL' }));
      }

      // 2. GET /api/categories/:idOrSlug
      if (pathname.startsWith('/api/categories/') && req.method === 'GET') {
        const idOrSlug = pathname.replace('/api/categories/', '');
        const isId = /^\d+$/.test(idOrSlug);
        const [cats] = await pool.query(
          `SELECT * FROM categories WHERE ${isId ? 'id = ?' : 'slug = ?'} LIMIT 1`,
          [idOrSlug]
        );
        if (cats.length === 0) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ success: false, message: 'Category not found' }));
        }
        const [prods] = await pool.query(
          'SELECT * FROM products WHERE category_id = ? AND is_active = 1 ORDER BY is_featured DESC, id ASC',
          [cats[0].id]
        );
        return res.end(JSON.stringify({ success: true, data: { ...cats[0], products: prods } }));
      }

      // 3. GET /api/products
      if (pathname === '/api/products' && req.method === 'GET') {
        const category = url.searchParams.get('category');
        const search = url.searchParams.get('search');
        const featured = url.searchParams.get('featured');

        let sql = `
          SELECT p.*, c.name as category_name, c.slug as category_slug
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE p.is_active = 1
        `;
        const params = [];

        if (category && category !== 'all') {
          if (/^\d+$/.test(category)) {
            sql += ` AND p.category_id = ?`;
            params.push(parseInt(category, 10));
          } else {
            sql += ` AND c.slug = ?`;
            params.push(category);
          }
        }

        if (search) {
          sql += ` AND (p.title LIKE ? OR p.sku LIKE ? OR p.short_description LIKE ?)`;
          const term = `%${search}%`;
          params.push(term, term, term);
        }

        if (featured === '1' || featured === 'true') {
          sql += ` AND p.is_featured = 1`;
        }

        sql += ` ORDER BY p.is_featured DESC, p.id ASC`;

        const [products] = await pool.query(sql, params);

        if (products.length > 0) {
          const productIds = products.map((p) => p.id);
          const [variants] = await pool.query(
            `SELECT * FROM product_variants WHERE product_id IN (?) ORDER BY id ASC`,
            [productIds]
          );
          const [specs] = await pool.query(
            `SELECT * FROM product_specifications WHERE product_id IN (?) ORDER BY id ASC`,
            [productIds]
          );
          const [images] = await pool.query(
            `SELECT * FROM product_images WHERE product_id IN (?) ORDER BY display_order ASC, id ASC`,
            [productIds]
          );

          const variantMap = {};
          variants.forEach((v) => {
            if (!variantMap[v.product_id]) variantMap[v.product_id] = [];
            variantMap[v.product_id].push(v);
          });

          const specMap = {};
          specs.forEach((s) => {
            if (!specMap[s.product_id]) specMap[s.product_id] = [];
            specMap[s.product_id].push(s);
          });

          const imageMap = {};
          images.forEach((image) => {
            if (!imageMap[image.product_id]) imageMap[image.product_id] = [];
            imageMap[image.product_id].push(image.image_url);
          });

          products.forEach((p) => {
            p.variants = variantMap[p.id] || [];
            p.specifications = specMap[p.id] || [];
            p.images = [...new Set([p.main_image, ...(imageMap[p.id] || [])].filter(Boolean))];
          });
        }

        return res.end(JSON.stringify({ success: true, count: products.length, data: products }));
      }

      // 4. GET /api/products/:idOrSlug
      if (pathname.startsWith('/api/products/') && req.method === 'GET') {
        const idOrSlug = pathname.replace('/api/products/', '');
        const isId = /^\d+$/.test(idOrSlug);
        const [rows] = await pool.query(
          `SELECT p.*, c.name as category_name, c.slug as category_slug
           FROM products p
           LEFT JOIN categories c ON p.category_id = c.id
           WHERE ${isId ? 'p.id = ?' : 'p.slug = ?'} AND p.is_active = 1
           LIMIT 1`,
          [idOrSlug]
        );

        if (rows.length === 0) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ success: false, message: 'Product not found' }));
        }

        const product = rows[0];
        const [variants] = await pool.query(
          'SELECT * FROM product_variants WHERE product_id = ? ORDER BY id ASC',
          [product.id]
        );
        const [specifications] = await pool.query(
          'SELECT * FROM product_specifications WHERE product_id = ? ORDER BY id ASC',
          [product.id]
        );
        const [images] = await pool.query(
          'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order ASC, id ASC',
          [product.id]
        );
        const [relatedProducts] = await pool.query(
          'SELECT id, title, slug, sku, main_image, base_price, mrp FROM products WHERE category_id = ? AND id != ? AND is_active = 1 LIMIT 4',
          [product.category_id, product.id]
        );

        product.variants = variants;
        product.specifications = specifications;
        product.images = [...new Set([product.main_image, ...images.map((image) => image.image_url)].filter(Boolean))];
        product.relatedProducts = relatedProducts;

        return res.end(JSON.stringify({ success: true, data: product }));
      }

      // 5. POST /api/products
      if (pathname === '/api/products' && req.method === 'POST') {
        const body = await getBody();
        const { title, category_id, base_price, mrp, short_description, full_description, main_image, sku, is_featured } = body;
        const slug = body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const connection = await pool.getConnection();
        let resP;
        try {
          await connection.beginTransaction();
          [resP] = await connection.query(
            `INSERT INTO products (category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
            [
              category_id || 1,
              title,
              slug,
              sku || `SE-${Date.now()}`,
              short_description || '',
              full_description || '',
              main_image || '',
              base_price || 0,
              mrp || null,
              is_featured ? 1 : 0,
            ]
          );
          await saveProductRelations(connection, resP.insertId, body);
          await connection.commit();
        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          connection.release();
        }
        res.statusCode = 201;
        return res.end(JSON.stringify({ success: true, message: 'Product created in MySQL', id: resP.insertId }));
      }

      // 5b. PUT /api/products/:id
      if (pathname.startsWith('/api/products/') && req.method === 'PUT') {
        const id = Number(pathname.replace('/api/products/', ''));
        const body = await getBody();
        const connection = await pool.getConnection();
        try {
          await connection.beginTransaction();
          await connection.query(
            `UPDATE products SET
              category_id = COALESCE(?, category_id),
              title = COALESCE(?, title),
              slug = COALESCE(?, slug),
              sku = COALESCE(?, sku),
              short_description = COALESCE(?, short_description),
              full_description = COALESCE(?, full_description),
              main_image = COALESCE(?, main_image),
              base_price = COALESCE(?, base_price),
              mrp = COALESCE(?, mrp),
              is_featured = COALESCE(?, is_featured),
              is_active = COALESCE(?, is_active)
             WHERE id = ?`,
            [
              body.category_id !== undefined ? Number(body.category_id) : null,
              body.title ?? null,
              body.slug ?? null,
              body.sku ?? null,
              body.short_description ?? null,
              body.full_description ?? body.description ?? null,
              body.main_image ?? null,
              body.base_price !== undefined ? Number(body.base_price) : null,
              body.mrp !== undefined ? Number(body.mrp) : null,
              body.is_featured !== undefined ? (body.is_featured ? 1 : 0) : null,
              body.is_active !== undefined ? (body.is_active ? 1 : 0) : null,
              id,
            ]
          );
          await saveProductRelations(connection, id, body);
          await connection.commit();
        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          connection.release();
        }
        return res.end(JSON.stringify({ success: true, message: 'Product updated in MySQL' }));
      }

      // 6. DELETE /api/products/:id
      if (pathname.startsWith('/api/products/') && req.method === 'DELETE') {
        const id = pathname.replace('/api/products/', '');
        await pool.query('DELETE FROM products WHERE id = ?', [id]);
        return res.end(JSON.stringify({ success: true, message: 'Product deleted from MySQL' }));
      }

      // 7. GET /api/clients
      if (pathname === '/api/clients' && req.method === 'GET') {
        const category = url.searchParams.get('category');
        const search = url.searchParams.get('search');

        let sql = 'SELECT id, name, category, category_label, location FROM clients WHERE 1=1';
        const params = [];

        if (category && category !== 'all') {
          sql += ' AND category = ?';
          params.push(category);
        }
        if (search) {
          sql += ' AND (name LIKE ? OR location LIKE ?)';
          const term = `%${search}%`;
          params.push(term, term);
        }
        sql += ' ORDER BY display_order ASC, id ASC';

        const [clients] = await pool.query(sql, params);
        return res.end(JSON.stringify({ success: true, count: clients.length, data: clients }));
      }

      // 8. POST /api/clients
      if (pathname === '/api/clients' && req.method === 'POST') {
        const body = await getBody();
        const { name, category, location } = body;

        const labels = {
          university_colleges: 'University & Colleges',
          schools: 'Schools',
          corporate_banks: 'Corporate Office / Bank',
          others: 'Others',
        };
        const category_label = labels[category] || 'Others';

        const [resC] = await pool.query(
          `INSERT INTO clients (name, category, category_label, location)
           VALUES (?, ?, ?, ?)`,
          [name, category || 'others', category_label, location || '']
        );

        const [created] = await pool.query(
          'SELECT id, name, category, category_label, location FROM clients WHERE id = ?',
          [resC.insertId]
        );
        res.statusCode = 201;
        return res.end(JSON.stringify({ success: true, data: created[0] }));
      }

      // 8b. PUT /api/clients/:id
      if (pathname.startsWith('/api/clients/') && req.method === 'PUT') {
        const id = Number(pathname.replace('/api/clients/', ''));
        const body = await getBody();
        const labels = {
          university_colleges: 'University & Colleges',
          schools: 'Schools',
          corporate_banks: 'Corporate Office / Bank',
          others: 'Others',
        };
        const categoryLabel = body.category ? labels[body.category] || 'Others' : null;

        await pool.query(
          `UPDATE clients SET
            name = COALESCE(?, name),
            category = COALESCE(?, category),
            category_label = COALESCE(?, category_label),
            location = COALESCE(?, location)
           WHERE id = ?`,
          [
            body.name ?? null,
            body.category ?? null,
            categoryLabel,
            body.location ?? null,
            id,
          ]
        );

        const [updated] = await pool.query(
          'SELECT id, name, category, category_label, location FROM clients WHERE id = ? LIMIT 1',
          [id]
        );
        if (updated.length === 0) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ success: false, message: 'Client not found' }));
        }
        return res.end(JSON.stringify({ success: true, data: updated[0] }));
      }

      // 9. DELETE /api/clients/:id
      if (pathname.startsWith('/api/clients/') && req.method === 'DELETE') {
        const id = pathname.replace('/api/clients/', '');
        await pool.query('DELETE FROM clients WHERE id = ?', [id]);
        return res.end(JSON.stringify({ success: true, message: 'Client deleted from MySQL' }));
      }

      // 10. GET /api/settings
      if (pathname === '/api/settings' && req.method === 'GET') {
        const [rows] = await pool.query("SELECT setting_value FROM settings WHERE setting_key = 'general' LIMIT 1");
        if (rows.length > 0) {
          return res.end(JSON.stringify({ success: true, data: rows[0].setting_value }));
        }
        return res.end(JSON.stringify({ success: false, message: 'Settings not found' }));
      }

      // 11. PUT /api/settings
      if (pathname === '/api/settings' && req.method === 'PUT') {
        const body = await getBody();
        const [rows] = await pool.query("SELECT setting_value FROM settings WHERE setting_key = 'general' LIMIT 1");
        const current = rows.length > 0 ? rows[0].setting_value : {};
        const merged = { ...current, ...body };

        await pool.query(
          `INSERT INTO settings (setting_key, setting_value) VALUES ('general', ?)
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
          [JSON.stringify(merged)]
        );
        return res.end(JSON.stringify({ success: true, message: 'Settings updated in MySQL', data: merged }));
      }

      // 12. GET /api/inquiries
      if (pathname === '/api/inquiries' && req.method === 'GET') {
        const [rows] = await pool.query('SELECT * FROM bulk_inquiries ORDER BY id DESC');
        return res.end(JSON.stringify({ success: true, count: rows.length, data: rows }));
      }

      // 12b. DELETE /api/inquiries/:id
      if (pathname.startsWith('/api/inquiries/') && req.method === 'DELETE') {
        const id = Number(pathname.replace('/api/inquiries/', ''));
        const [result] = await pool.query('DELETE FROM bulk_inquiries WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ success: false, message: 'Inquiry not found' }));
        }
        return res.end(JSON.stringify({ success: true, message: 'Inquiry deleted from MySQL' }));
      }

      // 13. POST /api/inquiries
      if ((pathname === '/api/inquiries' || pathname === '/api/bulk-inquiries') && req.method === 'POST') {
        const body = await getBody();
        const { client_name, organization_name, email, phone, product_title, variant_details, quantity, delivery_city, message } = body;

        const [resI] = await pool.query(
          `INSERT INTO bulk_inquiries (client_name, organization_name, email, phone, product_title, variant_details, quantity, delivery_city, message, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
          [client_name, organization_name || '', email, phone, product_title || '', variant_details || '', quantity || 1, delivery_city || 'Kolkata', message || '']
        );
        res.statusCode = 201;
        return res.end(JSON.stringify({ success: true, message: 'Inquiry registered in MySQL', id: resI.insertId }));
      }

      // 14. GET /api/orders
      if (pathname === '/api/orders' && req.method === 'GET') {
        const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        return res.end(JSON.stringify({ success: true, count: rows.length, data: rows }));
      }

      // 14b. DELETE /api/orders/:id
      if (pathname.startsWith('/api/orders/') && req.method === 'DELETE') {
        const id = decodeURIComponent(pathname.replace('/api/orders/', ''));
        const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ success: false, message: 'Order not found' }));
        }
        return res.end(JSON.stringify({ success: true, message: 'Order deleted from MySQL' }));
      }

      // 15. POST /api/orders
      if (pathname === '/api/orders' && req.method === 'POST') {
        const body = await getBody();
        const { customer_name, phone, email, delivery_address, city, items, total_amount, payment_method } = body;
        const pincode = body.pincode || body.pin_code || '';
        const orderId = body.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const paymentStatus = ['UPI Scan & Pay', 'Razorpay Online'].includes(payment_method)
          ? 'Paid'
          : 'Pending';

        await pool.query(
          `INSERT INTO orders (id, customer_name, phone, email, delivery_address, city, pincode, items, total_amount, payment_method, payment_status, order_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Processing')`,
          [
            orderId,
            customer_name,
            phone,
            email || '',
            delivery_address,
            city || 'Kolkata',
            pincode || '',
            JSON.stringify(items || []),
            total_amount || 0,
            payment_method || 'WhatsApp',
            paymentStatus,
          ]
        );
        res.statusCode = 201;
        return res.end(JSON.stringify({ success: true, message: 'Order created in MySQL', order_id: orderId }));
      }

      // 16. GET /api/testimonials
      if (pathname === '/api/testimonials' && req.method === 'GET') {
        const [rows] = await pool.query('SELECT * FROM testimonials WHERE is_featured = 1 ORDER BY display_order ASC, id ASC');
        return res.end(JSON.stringify({ success: true, count: rows.length, data: rows }));
      }

      // 16b. POST /api/testimonials
      if (pathname === '/api/testimonials' && req.method === 'POST') {
        const body = await getBody();
        const clientName = String(body.client_name || '').trim();
        const reviewText = String(body.review_text || body.content || '').trim();
        if (!clientName || !reviewText) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ success: false, message: 'Client name and review are required.' }));
        }

        const [result] = await pool.query(
          `INSERT INTO testimonials (client_name, client_designation, organization_name, review_text, rating, is_featured)
           VALUES (?, ?, ?, ?, ?, 1)`,
          [
            clientName,
            body.client_designation || body.role || '',
            body.organization_name || '',
            reviewText,
            Number(body.rating) || 5,
          ]
        );
        const [created] = await pool.query('SELECT * FROM testimonials WHERE id = ? LIMIT 1', [result.insertId]);
        res.statusCode = 201;
        return res.end(JSON.stringify({ success: true, id: result.insertId, data: created[0] }));
      }

      // 16c. DELETE /api/testimonials/:id
      if (pathname.startsWith('/api/testimonials/') && req.method === 'DELETE') {
        const id = Number(pathname.replace('/api/testimonials/', ''));
        const [result] = await pool.query('DELETE FROM testimonials WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ success: false, message: 'Testimonial not found' }));
        }
        return res.end(JSON.stringify({ success: true, message: 'Testimonial deleted from MySQL' }));
      }

      // 17. GET /api/blogs
      if (pathname === '/api/blogs' && req.method === 'GET') {
        const [rows] = await pool.query('SELECT * FROM blogs WHERE is_published = 1 ORDER BY id DESC');
        return res.end(JSON.stringify({ success: true, count: rows.length, data: rows }));
      }

      // 17b. GET /api/blogs/:idOrSlug
      if (pathname.startsWith('/api/blogs/') && req.method === 'GET') {
        const param = pathname.replace('/api/blogs/', '');
        const isNum = /^\d+$/.test(param);
        const [rows] = await pool.query(
          isNum ? 'SELECT * FROM blogs WHERE id = ? LIMIT 1' : 'SELECT * FROM blogs WHERE slug = ? LIMIT 1',
          [isNum ? Number(param) : param]
        );
        if (rows.length === 0) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ success: false, message: 'Article not found.' }));
        }
        return res.end(JSON.stringify({ success: true, data: rows[0] }));
      }

      // 17c. POST /api/blogs
      if (pathname === '/api/blogs' && req.method === 'POST') {
        const body = await getBody();
        const { title, thumbnail_image, video_url, author_name, content, meta_title, meta_description, is_published } = body;
        let slug = body.slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : `blog-${Date.now()}`);

        // Ensure unique slug
        const [existing] = await pool.query('SELECT id FROM blogs WHERE slug = ?', [slug]);
        if (existing.length > 0) {
          slug = `${slug}-${Date.now()}`;
        }

        const [resB] = await pool.query(
          `INSERT INTO blogs (title, slug, thumbnail_image, video_url, author_name, content, meta_title, meta_description, is_published)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            title || 'Untitled Blog',
            slug,
            thumbnail_image || '',
            video_url || '',
            author_name || 'Shaw Enterprise Editorial Team',
            content || '',
            meta_title || title || '',
            meta_description || '',
            is_published === false ? 0 : 1,
          ]
        );

        const newId = resB.insertId;
        const [inserted] = await pool.query('SELECT * FROM blogs WHERE id = ?', [newId]);
        res.statusCode = 201;
        return res.end(
          JSON.stringify({
            success: true,
            message: 'Blog created in MySQL',
            id: newId,
            data: inserted[0] || { id: newId, title, slug, thumbnail_image, video_url, author_name, content, is_published: true },
          })
        );
      }

      // 17d. PUT /api/blogs/:id
      if (pathname.startsWith('/api/blogs/') && req.method === 'PUT') {
        const id = Number(pathname.replace('/api/blogs/', ''));
        const body = await getBody();
        const { title, thumbnail_image, video_url, author_name, content, meta_title, meta_description, is_published } = body;

        await pool.query(
          `UPDATE blogs SET
            title = COALESCE(?, title),
            thumbnail_image = COALESCE(?, thumbnail_image),
            video_url = COALESCE(?, video_url),
            author_name = COALESCE(?, author_name),
            content = COALESCE(?, content),
            meta_title = COALESCE(?, meta_title),
            meta_description = COALESCE(?, meta_description),
            is_published = COALESCE(?, is_published)
           WHERE id = ?`,
          [
            title ?? null,
            thumbnail_image ?? null,
            video_url ?? null,
            author_name ?? null,
            content ?? null,
            meta_title ?? null,
            meta_description ?? null,
            is_published !== undefined ? (is_published ? 1 : 0) : null,
            id,
          ]
        );

        return res.end(JSON.stringify({ success: true, message: 'Blog updated in MySQL' }));
      }

      // 17e. DELETE /api/blogs/:id
      if (pathname.startsWith('/api/blogs/') && req.method === 'DELETE') {
        const id = Number(pathname.replace('/api/blogs/', ''));
        await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
        return res.end(JSON.stringify({ success: true, message: 'Blog deleted from MySQL' }));
      }

      // 18. Health Check
      if (pathname === '/api/health') {
        return res.end(
          JSON.stringify({
            status: 'ok',
            database: 'MySQL 8.0 Connected (Live shaw_enterprise)',
            timestamp: new Date().toISOString(),
          })
        );
      }

      // Default fallback for unmatched /api routes
      res.statusCode = 404;
      return res.end(JSON.stringify({ success: false, message: `Endpoint not found: ${pathname}` }));
    } catch (err) {
      console.error('❌ [API Middleware Error]:', err);
      res.statusCode = 500;
      return res.end(JSON.stringify({ success: false, message: err.message }));
    }
  };
}
