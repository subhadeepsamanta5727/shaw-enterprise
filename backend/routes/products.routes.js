import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

/**
 * GET /api/products
 * Query parameters:
 *  - category: category id or slug
 *  - search: keyword search in title, sku, short_description
 *  - featured: '1' or 'true'
 *  - sort: 'price_asc', 'price_desc', 'newest'
 *  - page: page number (default 1)
 *  - limit: items per page (default 50)
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, sort, page = 1, limit = 50 } = req.query;

    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    const params = [];

    if (category) {
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

    if (sort === 'price_asc') {
      sql += ` ORDER BY p.base_price ASC`;
    } else if (sort === 'price_desc') {
      sql += ` ORDER BY p.base_price DESC`;
    } else if (sort === 'newest') {
      sql += ` ORDER BY p.id DESC`;
    } else {
      sql += ` ORDER BY p.is_featured DESC, p.id ASC`;
    }

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    sql += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), offset);

    const [products] = await pool.query(sql, params);

    // Attach variants and specifications for each product
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

      products.forEach((p) => {
        p.variants = variantMap[p.id] || [];
        p.specifications = specMap[p.id] || [];
      });
    }

    return res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/products/:idOrSlug
 * Single product detail with full specs, variants, and related products
 */
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
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
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = rows[0];

    const [variants] = await pool.query(
      `SELECT * FROM product_variants WHERE product_id = ? ORDER BY id ASC`,
      [product.id]
    );
    const [specifications] = await pool.query(
      `SELECT * FROM product_specifications WHERE product_id = ? ORDER BY id ASC`,
      [product.id]
    );
    const [images] = await pool.query(
      `SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC`,
      [product.id]
    );

    // Fetch related products in the same category
    const [relatedProducts] = await pool.query(
      `SELECT id, title, slug, sku, main_image, base_price, mrp
       FROM products
       WHERE category_id = ? AND id != ? AND is_active = 1
       LIMIT 4`,
      [product.category_id, product.id]
    );

    product.variants = variants;
    product.specifications = specifications;
    product.images = images;
    product.relatedProducts = relatedProducts;

    return res.json({ success: true, data: product });
  } catch (error) {
    console.error('❌ Error fetching product detail:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/products
 * Create a new product (Admin)
 */
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      category_id,
      title,
      slug,
      sku,
      short_description,
      full_description,
      main_image,
      base_price,
      mrp,
      is_featured,
      variants,
      specifications,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }

    const cleanSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const [resProd] = await connection.query(
      `INSERT INTO products (category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        category_id || 1,
        title,
        cleanSlug,
        sku || `SE-${Date.now()}`,
        short_description || '',
        full_description || '',
        main_image || '',
        base_price || 0,
        mrp || null,
        is_featured ? 1 : 0,
      ]
    );

    const productId = resProd.insertId;

    if (variants && Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        await connection.query(
          `INSERT INTO product_variants (product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            productId,
            v.size_label || 'Standard',
            v.surface_type || '',
            v.price || base_price,
            v.mrp || mrp,
            v.stock_quantity || 50,
            v.is_default ? 1 : 0,
            v.sku_extension || '',
          ]
        );
      }
    }

    if (specifications && Array.isArray(specifications) && specifications.length > 0) {
      for (const s of specifications) {
        await connection.query(
          `INSERT INTO product_specifications (product_id, spec_key, spec_value)
           VALUES (?, ?, ?)`,
          [productId, s.spec_key, s.spec_value]
        );
      }
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully in MySQL database.',
      id: productId,
    });
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error creating product:', error);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
});

/**
 * PUT /api/products/:id
 * Update product
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, base_price, mrp, short_description, full_description, main_image, is_featured, category_id } =
      req.body;

    await pool.query(
      `UPDATE products
       SET title = COALESCE(?, title),
           base_price = COALESCE(?, base_price),
           mrp = COALESCE(?, mrp),
           short_description = COALESCE(?, short_description),
           full_description = COALESCE(?, full_description),
           main_image = COALESCE(?, main_image),
           is_featured = COALESCE(?, is_featured),
           category_id = COALESCE(?, category_id)
       WHERE id = ?`,
      [title, base_price, mrp, short_description, full_description, main_image, is_featured, category_id, id]
    );

    return res.json({ success: true, message: 'Product updated successfully.' });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/products/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

