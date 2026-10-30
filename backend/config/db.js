import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const databasePassword = process.env.DB_PASSWORD;
if (!databasePassword) {
  throw new Error('DB_PASSWORD must be set in backend/.env or the environment.');
}

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: databasePassword,
  database: process.env.DB_NAME || 'shaw_enterprise',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

export const pool = mysql.createPool(dbConfig);

// Helper function for quick parameterized queries
export async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ [MySQL] Successfully connected to database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    return true;
  } catch (err) {
    console.error('❌ [MySQL] Connection failed:', err.message);
    return false;
  }
}

export default {
  pool,
  query,
  testConnection,
};
