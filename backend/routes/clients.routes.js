import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

const CATEGORY_LABELS = {
  university_colleges: 'University & Colleges',
  schools: 'Schools',
  corporate_banks: 'Corporate Office / Bank',
  others: 'Others',
};

/**
 * GET /api/clients
 * Filter by ?category=university_colleges / schools / corporate_banks / others
 */
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    let sql = `SELECT * FROM clients WHERE 1=1`;
    const params = [];

    if (category && category !== 'all') {
      sql += ` AND category = ?`;
      params.push(category);
    }

    if (search) {
      sql += ` AND (name LIKE ? OR location LIKE ? OR project_details LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY display_order ASC, id ASC`;

    const [clients] = await pool.query(sql, params);

    return res.json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    console.error('❌ Error fetching clients:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/clients/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM clients WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Client not found.' });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/clients
 * Create a new client record (No image needed)
 */
router.post('/', async (req, res) => {
  try {
    const { name, category, location, project_details, established, is_featured, display_order } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Client institution name is required.' });
    }

    const validCategory = category && CATEGORY_LABELS[category] ? category : 'others';
    const category_label = CATEGORY_LABELS[validCategory] || 'Others';

    const [result] = await pool.query(
      `INSERT INTO clients (name, category, category_label, location, project_details, established, is_featured, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        validCategory,
        category_label,
        location || '',
        project_details || '',
        established || '',
        is_featured ? 1 : 0,
        display_order || 0,
      ]
    );

    const [newClient] = await pool.query('SELECT * FROM clients WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: 'Client added successfully to MySQL.',
      data: newClient[0],
    });
  } catch (error) {
    console.error('❌ Error creating client:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/clients/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, location, project_details, established, is_featured, display_order } = req.body;

    const category_label = category && CATEGORY_LABELS[category] ? CATEGORY_LABELS[category] : undefined;

    await pool.query(
      `UPDATE clients
       SET name = COALESCE(?, name),
           category = COALESCE(?, category),
           category_label = COALESCE(?, category_label),
           location = COALESCE(?, location),
           project_details = COALESCE(?, project_details),
           established = COALESCE(?, established),
           is_featured = COALESCE(?, is_featured),
           display_order = COALESCE(?, display_order)
       WHERE id = ?`,
      [name, category, category_label, location, project_details, established, is_featured, display_order, id]
    );

    const [updated] = await pool.query('SELECT * FROM clients WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Client updated successfully.', data: updated[0] });
  } catch (error) {
    console.error('❌ Error updating client:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/clients/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM clients WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Client deleted successfully.' });
  } catch (error) {
    console.error('❌ Error deleting client:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

