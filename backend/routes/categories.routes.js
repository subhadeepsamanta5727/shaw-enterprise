import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

/**
 * GET /api/categories
 * List all active categories ordered by display_order
 */
router.get('/', async (req, res) => {
  try {
    const [categories] = await pool.query(
      `SELECT id, name, slug, description, image, display_order, is_active, created_at
       FROM categories
       WHERE is_active = 1
       ORDER BY display_order ASC, id ASC`
    );
    return res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/categories/:idOrSlug
 * Get a single category by id or slug with its products
 */
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const isId = /^\d+$/.test(idOrSlug);

    const [rows] = await pool.query(
      `SELECT * FROM categories WHERE ${isId ? 'id = ?' : 'slug = ?'} LIMIT 1`,
      [idOrSlug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const category = rows[0];

    // Fetch products belonging to this category
    const [products] = await pool.query(
      `SELECT id, title, slug, sku, short_description, main_image, base_price, mrp, is_featured
       FROM products
       WHERE category_id = ? AND is_active = 1
       ORDER BY is_featured DESC, id ASC`,
      [category.id]
    );

    return res.json({
      success: true,
      data: {
        ...category,
        products,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching category:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/categories
 * Create a new category
 */
router.post('/', async (req, res) => {
  try {
    const { name, slug, description, image, display_order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const [result] = await pool.query(
      `INSERT INTO categories (name, slug, description, image, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [name, cleanSlug, description || '', image || '', display_order || 0]
    );

    return res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: {
        id: result.insertId,
        name,
        slug: cleanSlug,
        description,
        image,
        display_order: display_order || 0,
        is_active: 1,
      },
    });
  } catch (error) {
    console.error('❌ Error creating category:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/categories/:id
 * Update an existing category
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, display_order, is_active } = req.body;

    await pool.query(
      `UPDATE categories
       SET name = COALESCE(?, name),
           slug = COALESCE(?, slug),
           description = COALESCE(?, description),
           image = COALESCE(?, image),
           display_order = COALESCE(?, display_order),
           is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [name, slug, description, image, display_order, is_active, id]
    );

    return res.json({ success: true, message: 'Category updated successfully.' });
  } catch (error) {
    console.error('❌ Error updating category:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/categories/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

