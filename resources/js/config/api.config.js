/**
 * =========================================================================
 * SHAW ENTERPRISE - FRONTEND API & BACKEND CONNECTION CONFIGURATION
 * =========================================================================
 * This is the separate connection file for the frontend application.
 *
 * HOW TO CHANGE THE API ENDPOINT IN PRODUCTION:
 * -------------------------------------------------------------------------
 * 1. Directly edit `API_BASE_URL` below with your live production backend URL
 *    (e.g., 'https://api.shawenterprise.in/api' or 'https://shawenterprise.in/backend/api')
 *    OR
 * 2. Set `VITE_API_BASE_URL` in your `.env` file before running `npm run build`.
 *
 * All frontend components, image uploads, product queries, client lookups,
 * and order submissions route through this single file.
 */

const isDevelopment = typeof import.meta !== 'undefined' && import.meta.env?.DEV;

export const API_BASE_URL = isDevelopment
  ? '/api'
  : (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '/api';

export const UPLOADS_BASE_URL = isDevelopment
  ? '/uploads'
  : (typeof import.meta !== 'undefined' && import.meta.env?.VITE_UPLOADS_URL) || '/uploads';

export default {
  API_BASE_URL,
  UPLOADS_BASE_URL,
};
