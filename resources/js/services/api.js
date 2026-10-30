/**
 * =========================================================================
 * SHAW ENTERPRISE - REST API CLIENT SERVICE
 * =========================================================================
 * Connects to PHP MySQL Backend using API_BASE_URL from api.config.js
 */

import { API_BASE_URL, UPLOADS_BASE_URL } from '../config/api.config.js';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL.replace(/\/+$/, '');
  }

  /**
   * Helper for generic JSON fetch
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers = {
      Accept: 'application/json',
      ...options.headers,
    };

    if (options.body && !(options.body instanceof FormData) && typeof options.body === 'object') {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.warn(`[API] Request to ${url} failed:`, error.message);
      throw error;
    }
  }

  // -----------------------------------------------------------------------
  // IMAGE UPLOADS (Local Folder Storage)
  // -----------------------------------------------------------------------
  /**
   * Upload an image file to the local folder on the backend server.
   * @param {File} file
   * @returns {Promise<{ success: boolean, url: string, fullUrl: string, filename: string }>}
   */
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const url = `${this.baseUrl}/upload`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to upload image to local server.');
    }
    return data;
  }

  async uploadCatalogPdf(file) {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseUrl}/upload/catalog`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to upload the catalog PDF.');
    }
    return data;
  }

  async listUploadedImages() {
    return this.request('/upload/list');
  }

  // -----------------------------------------------------------------------
  // CATEGORIES
  // -----------------------------------------------------------------------
  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(idOrSlug) {
    return this.request(`/categories/${idOrSlug}`);
  }

  async createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: categoryData,
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: categoryData,
    });
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // -----------------------------------------------------------------------
  // PRODUCTS
  // -----------------------------------------------------------------------
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const qs = query.toString();
    return this.request(`/products${qs ? `?${qs}` : ''}`);
  }

  async getProduct(idOrSlug) {
    return this.request(`/products/${idOrSlug}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: productData,
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // -----------------------------------------------------------------------
  // CLIENTS (Institutional Portfolio)
  // -----------------------------------------------------------------------
  async getClients(category = null, search = null) {
    const query = new URLSearchParams();
    if (category && category !== 'all') query.append('category', category);
    if (search) query.append('search', search);
    const qs = query.toString();
    return this.request(`/clients${qs ? `?${qs}` : ''}`);
  }

  async getClient(id) {
    return this.request(`/clients/${id}`);
  }

  async createClient(clientData) {
    return this.request('/clients', {
      method: 'POST',
      body: clientData,
    });
  }

  async updateClient(id, clientData) {
    return this.request(`/clients/${id}`, {
      method: 'PUT',
      body: clientData,
    });
  }

  async deleteClient(id) {
    return this.request(`/clients/${id}`, {
      method: 'DELETE',
    });
  }

  // -----------------------------------------------------------------------
  // INSTITUTIONAL INQUIRIES / RFQ
  // -----------------------------------------------------------------------
  async submitInquiry(inquiryData) {
    return this.request('/inquiries', {
      method: 'POST',
      body: inquiryData,
    });
  }

  async getInquiries() {
    return this.request('/inquiries');
  }

  async deleteInquiry(id) {
    return this.request(`/inquiries/${id}`, {
      method: 'DELETE',
    });
  }

  async updateInquiryStatus(id, status) {
    return this.request(`/inquiries/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  }

  // -----------------------------------------------------------------------
  // ORDERS & CHECKOUT
  // -----------------------------------------------------------------------
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData,
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async deleteOrder(id) {
    return this.request(`/orders/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async updateOrderStatus(id, statusPayload) {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: statusPayload,
    });
  }

  // -----------------------------------------------------------------------
  // SETTINGS
  // -----------------------------------------------------------------------
  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(settingsData) {
    return this.request('/settings', {
      method: 'PUT',
      body: settingsData,
    });
  }

  // -----------------------------------------------------------------------
  // TESTIMONIALS & BLOGS
  // -----------------------------------------------------------------------
  async getTestimonials() {
    return this.request('/testimonials');
  }

  async createTestimonial(testimonialData) {
    return this.request('/testimonials', {
      method: 'POST',
      body: testimonialData,
    });
  }

  async deleteTestimonial(id) {
    return this.request(`/testimonials/${id}`, {
      method: 'DELETE',
    });
  }

  async getBlogs() {
    return this.request('/blogs');
  }

  async getBlog(idOrSlug) {
    return this.request(`/blogs/${idOrSlug}`);
  }

  async createBlog(blogData) {
    return this.request('/blogs', {
      method: 'POST',
      body: blogData,
    });
  }

  async updateBlog(id, blogData) {
    return this.request(`/blogs/${id}`, {
      method: 'PUT',
      body: blogData,
    });
  }

  async deleteBlog(id) {
    return this.request(`/blogs/${id}`, {
      method: 'DELETE',
    });
  }

  // -----------------------------------------------------------------------
  // HEALTH CHECK
  // -----------------------------------------------------------------------
  async checkHealth() {
    return this.request('/health');
  }
}

/**
 * Normalizes any image URL or local storage path into a reliable public URL.
 * Handles full external URLs, data URLs, blob URLs, and local uploads without duplicate path segments.
 *
 * @param {string} src - Raw image path (e.g. 'blogs/whiteboard-guide.jpg', '/uploads/xyz.png')
 * @param {string} fallback - Fallback URL if src is empty or invalid
 * @returns {string}
 */
export function resolveImageUrl(
  src,
  fallback = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'
) {
  if (!src || typeof src !== 'string') return fallback;

  const trimmed = src.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  let clean = trimmed;
  while (/^[/\\]*(storage|uploads)[/\\]*/i.test(clean)) {
    clean = clean.replace(/^[/\\]*(storage|uploads)[/\\]*/i, '');
  }
  clean = clean.replace(/^[/\\]+/, '');

  const uploadsBaseUrl = UPLOADS_BASE_URL.replace(/\/+$/, '');
  return clean ? `${uploadsBaseUrl}/${clean}` : fallback;
}

export const api = new ApiService();
export default api;
