import { useState, useEffect } from 'react';
import { api } from './services/api.js';

// Default UI structure while awaiting database response
export const defaultSettings = {
  site_name: 'Shaw Enterprise',
  logo_url: '',
  site_logo: '',
  logo: '',
  tagline: 'Manufacturer, Wholesaler & Retailer of Writing Boards, Display Systems & Educational Accessories',
  proprietor: 'Mr. Indrajit Shaw',
  phone: '+91 9933944007',
  phone_secondary: '+91 7003779114',
  whatsapp: '+91 9933944007',
  email: 'shaw.entt.edu@gmail.com',
  address: '44/1B, Beniatola Lane (College Street), Kolkata – 700009, W.B',
  registered_office_address: '44/1B, Beniatola Lane (College Street), Kolkata – 700009, W.B',
  workshop_address: 'Balagarh Industrial, Suryapur, Navarand, Kolkata – 700121',
  maps_embed_url: 'https://maps.google.com/maps?q=44/1B,%20Beniatola%20Lane,%20College%20Street,%20Kolkata%20700009&t=&z=16&ie=UTF8&iwloc=&output=embed',
  gst_number: '19AAIFS4821N1ZM',
  established_year: '2014',
  working_hours: 'Monday – Saturday: 10:00 AM – 8:00 PM (Sunday Closed)',
  announcement_text: '🚚 Free Delivery in Kolkata on orders above ₹1,999 • Direct Factory Pricing with GST Invoices • Fast Dispatch Across India',
  hero_banner_url: '/uploads/categories/writing-boards.jpg',
  catalog_pdf_url: '',
  catalog_pdf_filename: '',
  social_links: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    whatsapp: 'https://wa.me/919933944007',
    linkedin: '',
    twitter: '',
  },
  payment_settings: {
    enable_razorpay: true,
    razorpay_key_id: 'rzp_test_shaw_ent_kolkata_99339',
    razorpay_key_secret: 'sec_test_9933944007_college_st',
    enable_upi_qr: true,
    upi_id: '9933944007@upi',
    upi_qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=9933944007@upi&pn=Shaw%20Enterprise&cu=INR',
    enable_cod: true,
    enable_bank_transfer: true,
    bank_name: 'State Bank of India',
    bank_account_no: '389012345678',
    bank_ifsc: 'SBIN0000087',
    bank_branch: 'College Street Branch, Kolkata',
  },
  sections: {
    hero: {
      badge: '🏭 Regd. Office: 44/1B, Beniatola Lane, College Street • Works: Balagarh Industrial, Kolkata',
      title: "Kolkata's Premier Manufacturer of Writing Boards & Display Systems",
      description: 'Manufactured by Shaw Enterprise with 100% ghost-free surfaces and virgin 6063-T6 aluminium frames. Direct factory rates for retail, schools, coaching institutes & offices.',
      btn_primary_text: 'Shop Products Online →',
      btn_primary_link: '/products',
      btn_secondary_text: '📐 Custom Size Calculator',
      image: '/uploads/categories/writing-boards.jpg',
      badge_featured_title: 'Popular in Kolkata',
      badge_featured_sub: 'Shaw 3x2 Magnetic Whiteboard',
      badge_featured_price: '₹1,099',
    },
    features: [
      { id: 1, icon: '🏭', title: 'College Street Works', subtitle: 'Direct factory manufacture' },
      { id: 2, icon: '🚚', title: 'Safe Wooden Packaging', subtitle: 'Reinforced corner battens' },
      { id: 3, icon: '📱', title: 'UPI / Cards / COD', subtitle: 'Instant QR scan or Cash on Delivery' },
      { id: 4, icon: '📄', title: 'GST Tax Invoices', subtitle: 'Official GSTIN provided' },
    ],
    about_home: {
      badge: 'About Shaw Enterprise',
      title: '12+ Years of Manufacturing Excellence at College Street & Balagarh Works',
      p1: 'Founded in 2014 by proprietor Mr. Indrajit Shaw, Shaw Enterprise has established itself as one of West Bengal\'s leading manufacturers, wholesalers, and retailers of writing boards, display bulletin systems, mobile stands, and school accessories.',
      p2: 'Operating our registered office at 44/1B, Beniatola Lane, College Street, and manufacturing workshop at Balagarh Industrial (Suryapur, Navarand, Kolkata – 700121), we supply both individual students and renowned institutions including Presidency University, Calcutta University, St. Xavier\'s, and South Point with precision-engineered products.',
      image: '/uploads/categories/display-notice-boards.jpg',
      stats: [
        { id: 1, value: '2014', label: 'Year Established', sub: 'College Street, Kolkata' },
        { id: 2, value: '25-Yr', label: 'Surface Warranty', sub: 'On Ceramic Green Boards' },
        { id: 3, value: '50,000+', label: 'Boards Manufactured', sub: 'Delivered Pan-India' },
        { id: 4, value: '100%', label: 'Genuine Virgin Alloy', sub: 'Alloy 6063-T6 Frames' },
      ],
    },
    custom_size_banner: {
      badge: 'Need a Custom Non-Standard Size?',
      title: 'We Custom-Cut & Fabricate Any Board Dimension within 24 Hours',
      description: 'From compact 1.5x1 ft study pads to 12x4 ft continuous auditorium ceramic boards, our College Street facility fabricates to your exact specifications.',
      btn_text: 'Open Custom Size Calculator →',
    },
  },
};

export const CLIENT_CATEGORIES = [
  { id: 'all', label: 'All Clients', icon: '🏛️' },
  { id: 'university_colleges', label: 'University & Colleges', icon: '🎓' },
  { id: 'schools', label: 'Schools', icon: '🏫' },
  { id: 'corporate_banks', label: 'Corporate Office / Bank', icon: '🏢' },
  { id: 'others', label: 'Others', icon: '🏥' },
];

export function getClientCategoryLabel(catId) {
  const found = CLIENT_CATEGORIES.find((c) => c.id === catId);
  return found ? found.label : 'Others';
}

function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(`shaw_${key}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(`Failed to load ${key}:`, e);
  }
  return fallback;
}

function saveData(key, val) {
  try {
    localStorage.setItem(`shaw_${key}`, JSON.stringify(val));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
}

let globalStore = {
  settings: loadData('settings', defaultSettings),
  products: loadData('products', []),
  categories: loadData('categories', []),
  clients: loadData('clients', []),
  testimonials: loadData('testimonials', []),
  blogs: loadData('blogs', []),
  inquiries: loadData('inquiries', []),
  orders: loadData('orders', []),
  cart: loadData('cart', []),
  isAuthenticated: loadData('auth', false),
  currentUser: loadData('user', {
    name: 'Indrajit Shaw',
    email: 'admin@shawenterprise.com',
    role: 'Proprietor & Admin',
  }),
};

const listeners = new Set();

export function getStore() {
  return globalStore;
}

export function updateStore(patch) {
  globalStore = { ...globalStore, ...patch };
  Object.entries(patch).forEach(([key, val]) => {
    saveData(key, val);
  });
  listeners.forEach((listener) => listener(globalStore));
}

export function useStore() {
  const [store, setStoreState] = useState(globalStore);

  useEffect(() => {
    const listener = (newStore) => setStoreState(newStore);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  return [store, updateStore];
}

// Settings Actions
export function updateSettings(newSettings) {
  const logo = newSettings.logo_url || newSettings.site_logo || newSettings.logo || globalStore.settings?.logo_url || '';
  const updated = {
    ...globalStore.settings,
    ...newSettings,
    logo_url: logo,
    site_logo: logo,
    logo: logo,
  };
  updateStore({ settings: updated });
  api.updateSettings(updated).catch(() => {});
  return updated;
}

// Background sync with PHP MySQL backend
export async function syncWithBackend() {
  try {
    const [catsRes, prodsRes, clientsRes, settingsRes, ordersRes, inqRes, testiRes, blogsRes] = await Promise.allSettled([
      api.getCategories(),
      api.getProducts(),
      api.getClients(),
      api.getSettings(),
      api.getOrders(),
      api.getInquiries(),
      api.getTestimonials(),
      api.getBlogs(),
    ]);

    const patch = {};
    if (catsRes.status === 'fulfilled' && catsRes.value?.success && Array.isArray(catsRes.value.data)) {
      patch.categories = catsRes.value.data;
    }
    if (prodsRes.status === 'fulfilled' && prodsRes.value?.success && Array.isArray(prodsRes.value.data)) {
      patch.products = prodsRes.value.data;
    }
    if (clientsRes.status === 'fulfilled' && clientsRes.value?.success && Array.isArray(clientsRes.value.data)) {
      patch.clients = clientsRes.value.data.map(({ id, name, category, category_label, location }) => ({
        id,
        name,
        category,
        category_label,
        location,
      }));
    }
    if (settingsRes.status === 'fulfilled' && settingsRes.value?.success && settingsRes.value.data) {
      patch.settings = { ...globalStore.settings, ...settingsRes.value.data };
    }
    if (ordersRes.status === 'fulfilled' && ordersRes.value?.success && Array.isArray(ordersRes.value.data)) {
      patch.orders = ordersRes.value.data;
    }
    if (inqRes.status === 'fulfilled' && inqRes.value?.success && Array.isArray(inqRes.value.data)) {
      patch.inquiries = inqRes.value.data;
    }
    if (testiRes.status === 'fulfilled' && testiRes.value?.success && Array.isArray(testiRes.value.data)) {
      patch.testimonials = testiRes.value.data;
    }
    if (blogsRes.status === 'fulfilled' && blogsRes.value?.success && Array.isArray(blogsRes.value.data)) {
      patch.blogs = blogsRes.value.data;
    }

    if (Object.keys(patch).length > 0) {
      updateStore(patch);
      console.log('✅ [Shaw Enterprise] Synced with MySQL backend successfully.');
    }
  } catch (err) {
    console.warn('[Sync] Backend offline:', err.message);
  }
}

if (typeof window !== 'undefined') {
  setTimeout(() => {
    syncWithBackend();
  }, 400);
}

// Shopping Cart Actions
export function addToCart(product, selectedVariant, quantity = 1) {
  const variant = selectedVariant || product.variants?.[0] || {
    id: product.id * 100,
    size_label: 'Standard',
    price: product.base_price,
    mrp: product.mrp || product.base_price,
  };

  const cartItemKey = `${product.id}_${variant.id}`;
  const existingIndex = globalStore.cart.findIndex((item) => item.key === cartItemKey);

  let newCart;
  if (existingIndex > -1) {
    newCart = globalStore.cart.map((item, idx) =>
      idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
    );
  } else {
    const newItem = {
      key: cartItemKey,
      product_id: product.id,
      variant_id: variant.id,
      title: product.title,
      slug: product.slug,
      main_image: product.main_image,
      size_label: variant.size_label,
      price: Number(variant.price || product.base_price),
      mrp: Number(variant.mrp || product.mrp || product.base_price),
      quantity: quantity,
    };
    newCart = [newItem, ...globalStore.cart];
  }

  updateStore({ cart: newCart });
  return newCart;
}

export function updateCartQuantity(itemKey, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(itemKey);
    return;
  }
  const newCart = globalStore.cart.map((item) =>
    item.key === itemKey ? { ...item, quantity: newQuantity } : item
  );
  updateStore({ cart: newCart });
}

export function removeFromCart(itemKey) {
  const newCart = globalStore.cart.filter((item) => item.key !== itemKey);
  updateStore({ cart: newCart });
}

export function clearCart() {
  updateStore({ cart: [] });
}

// Orders Action
export async function placeOrder(orderData) {
  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customer_name: orderData.customer_name,
    phone: orderData.phone,
    email: orderData.email || '',
    delivery_address: orderData.delivery_address,
    city: orderData.city || 'Kolkata',
    pin_code: orderData.pin_code || '700001',
    items: globalStore.cart,
    total_amount: orderData.total_amount,
    payment_method: orderData.payment_method || 'WhatsApp',
    payment_status: orderData.payment_method === 'Cash on Delivery'
      ? 'Pending (COD)'
      : orderData.payment_method === 'WhatsApp'
        ? 'Pending'
        : 'Paid Online',
    order_status: 'Confirmed',
    notes: orderData.notes || '',
    created_at: new Date().toISOString(),
  };

  const response = await api.createOrder(newOrder);
  if (response?.success === false) {
    throw new Error(response.message || 'The server could not save this order.');
  }

  const savedOrder = {
    ...newOrder,
    id: response?.order_id || response?.id || newOrder.id,
  };
  updateStore({
    orders: [savedOrder, ...globalStore.orders],
    cart: [],
  });

  return savedOrder;
}

export function updateOrderStatus(orderId, newStatus) {
  const updatedOrders = globalStore.orders.map((ord) =>
    ord.id === orderId ? { ...ord, order_status: newStatus } : ord
  );
  updateStore({ orders: updatedOrders });
}

export async function deleteOrder(orderId) {
  try {
    await api.deleteOrder(orderId);
    updateStore({ orders: globalStore.orders.filter((order) => order.id !== orderId) });
  } catch (err) {
    console.error('Could not delete order from MySQL:', err.message);
    window.alert('Could not delete this order from the server. Please try again.');
  }
}

// Inquiries Action
export function addInquiry(inquiryData) {
  const newInquiry = {
    id: Date.now(),
    client_name: inquiryData.client_name || 'Customer',
    organization_name: inquiryData.organization_name || 'Individual / Business',
    email: inquiryData.email || '',
    phone: inquiryData.phone || '',
    product_title: inquiryData.product_title || 'General Product Inquiry',
    variant_details: inquiryData.variant_details || 'Standard',
    quantity: Number(inquiryData.quantity) || 1,
    delivery_city: inquiryData.delivery_city || 'Kolkata',
    message: inquiryData.message || '',
    status: 'Pending',
    created_at: new Date().toISOString(),
  };

  const updatedInquiries = [newInquiry, ...globalStore.inquiries];
  updateStore({ inquiries: updatedInquiries });

  api.submitInquiry(newInquiry).catch((err) => {
    console.warn('Could not sync inquiry to PHP MySQL backend:', err.message);
  });

  return newInquiry;
}

export function updateInquiryStatus(id, newStatus) {
  const updated = globalStore.inquiries.map((inq) =>
    inq.id === id ? { ...inq, status: newStatus } : inq
  );
  updateStore({ inquiries: updated });
}

export async function deleteInquiry(id) {
  try {
    await api.deleteInquiry(id);
    updateStore({ inquiries: globalStore.inquiries.filter((inq) => inq.id !== id) });
  } catch (err) {
    console.error('Could not delete inquiry from MySQL:', err.message);
    window.alert('Could not delete this bulk quote from the server. Please try again.');
  }
}

// Product CRUD
export function addProduct(prod) {
  const newProd = {
    ...prod,
    id: Date.now(),
    slug: prod.slug || prod.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    variants: prod.variants || [
      {
        id: Date.now() + 1,
        size_label: 'Standard Spec',
        price: prod.base_price,
        mrp: prod.mrp || prod.base_price * 1.3,
        stock_quantity: 100,
        is_default: true,
      },
    ],
    specifications: prod.specifications || [],
    is_active: true,
    rating: 5.0,
    review_count: 1,
  };
  const updated = [newProd, ...globalStore.products];
  updateStore({ products: updated });

  api.createProduct(prod).then((res) => {
    if (res?.id) {
      const withDbId = (globalStore.products || []).map((p) => p.id === newProd.id ? { ...p, id: res.id } : p);
      updateStore({ products: withDbId });
    }
  }).catch((err) => {
    console.warn('Could not sync product to MySQL:', err.message);
  });

  return newProd;
}

export function updateProduct(id, updatedFields) {
  const updated = globalStore.products.map((p) =>
    p.id === id ? { ...p, ...updatedFields } : p
  );
  updateStore({ products: updated });

  api.updateProduct(id, updatedFields).catch((err) => {
    console.warn('Could not update product in MySQL:', err.message);
  });
}

export function deleteProduct(id) {
  const updated = globalStore.products.filter((p) => p.id !== id);
  updateStore({ products: updated });

  api.deleteProduct(id).catch((err) => {
    console.warn('Could not delete product from MySQL:', err.message);
  });
}

// Category CRUD
export function addCategory(cat) {
  const newCat = {
    ...cat,
    id: Date.now(),
    slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    is_active: true,
  };
  const updated = [...(globalStore.categories || []), newCat];
  updateStore({ categories: updated });

  api.createCategory(cat).then((res) => {
    if (res?.id) {
      const withDbId = (globalStore.categories || []).map((c) =>
        c.id === newCat.id ? { ...c, id: res.id } : c
      );
      updateStore({ categories: withDbId });
    }
  }).catch((err) => {
    console.warn('Could not sync category to MySQL:', err.message);
  });

  return newCat;
}

export function updateCategory(id, updatedFields) {
  const updated = globalStore.categories.map((c) =>
    c.id === id ? { ...c, ...updatedFields } : c
  );
  updateStore({ categories: updated });

  api.updateCategory(id, updatedFields).catch((err) => {
    console.warn('Could not update category in MySQL:', err.message);
  });
}

export function deleteCategory(id) {
  updateStore({ categories: globalStore.categories.filter((c) => c.id !== id) });

  api.deleteCategory(id).catch((err) => {
    console.warn('Could not delete category from MySQL:', err.message);
  });
}

// Testimonials CRUD
export function addTestimonial(testi) {
  const newTesti = {
    ...testi,
    id: Date.now(),
    rating: Number(testi.rating) || 5,
    is_featured: true,
  };
  api.createTestimonial(newTesti).then((response) => {
    const savedTestimonial = response.data || { ...newTesti, id: response.id || newTesti.id };
    updateStore({ testimonials: [savedTestimonial, ...globalStore.testimonials] });
  }).catch((err) => {
    console.error('Could not save testimonial to MySQL:', err.message);
    window.alert('Could not save this review to the server. Please try again.');
  });
  return newTesti;
}

export async function deleteTestimonial(id) {
  try {
    await api.deleteTestimonial(id);
    updateStore({ testimonials: globalStore.testimonials.filter((testimonial) => testimonial.id !== id) });
  } catch (err) {
    console.error('Could not delete testimonial from MySQL:', err.message);
    window.alert('Could not delete this review from the server. Please try again.');
  }
}

// Blogs / Vlogs CRUD
export function addBlog(blog) {
  const newBlog = {
    ...blog,
    id: Date.now(),
    slug: blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    published_at: new Date().toISOString().split('T')[0],
    is_published: true,
  };
  const updated = [newBlog, ...globalStore.blogs];
  updateStore({ blogs: updated });

  api.createBlog(blog).then((res) => {
    if (res?.id || res?.data?.id) {
      const realId = res.id || res.data.id;
      const withDbId = (globalStore.blogs || []).map((b) =>
        b.id === newBlog.id ? { ...b, id: realId, slug: res.data?.slug || b.slug } : b
      );
      updateStore({ blogs: withDbId });
    }
  }).catch((err) => {
    console.warn('Could not sync blog to MySQL:', err.message);
  });

  return newBlog;
}

export function updateBlog(id, updatedFields) {
  const updated = globalStore.blogs.map((b) =>
    b.id === id ? { ...b, ...updatedFields } : b
  );
  updateStore({ blogs: updated });

  api.updateBlog(id, updatedFields).catch((err) => {
    console.warn('Could not update blog in MySQL:', err.message);
  });
}

export function deleteBlog(id) {
  const updated = globalStore.blogs.filter((b) => b.id !== id);
  updateStore({ blogs: updated });

  api.deleteBlog(id).catch((err) => {
    console.warn('Could not delete blog from MySQL:', err.message);
  });
}

// Client CRUD
export function addClient(client) {
  const newClient = {
    name: client.name.trim(),
    category: client.category,
    location: client.location.trim(),
    id: Date.now(),
    category_label: getClientCategoryLabel(client.category),
  };
  const updated = [newClient, ...(globalStore.clients || [])];
  updateStore({ clients: updated });

  api.createClient({
    name: newClient.name,
    category: newClient.category,
    location: newClient.location,
  }).then((res) => {
    if (res?.data?.id) {
      const withDbId = (globalStore.clients || []).map((c) =>
        c.id === newClient.id ? { ...c, id: res.data.id } : c
      );
      updateStore({ clients: withDbId });
    }
  }).catch((err) => {
    console.warn('Could not sync client to PHP MySQL backend:', err.message);
  });

  return newClient;
}

export function updateClient(id, updatedFields) {
  const clientFields = {
    name: updatedFields.name.trim(),
    category: updatedFields.category,
    location: updatedFields.location.trim(),
    category_label: getClientCategoryLabel(updatedFields.category),
  };
  const updated = (globalStore.clients || []).map((c) =>
    c.id === id
      ? { id: c.id, ...clientFields }
      : c
  );
  updateStore({ clients: updated });

  api.updateClient(id, {
    name: clientFields.name,
    category: clientFields.category,
    location: clientFields.location,
  }).catch((err) => {
    console.warn('Could not update client in PHP MySQL backend:', err.message);
  });
}

export function deleteClient(id) {
  const updated = (globalStore.clients || []).filter((c) => c.id !== id);
  updateStore({ clients: updated });

  api.deleteClient(id).catch((err) => {
    console.warn('Could not delete client from PHP MySQL backend:', err.message);
  });
}

// Auth Actions
export function adminLogin(email, password) {
  if (email && (password === 'admin123' || password === 'admin' || password.length >= 4)) {
    updateStore({
      isAuthenticated: true,
      currentUser: {
        name: 'Indrajit Shaw',
        email: email || 'admin@shawenterprise.com',
        role: 'Proprietor & Admin',
      },
    });
    return { success: true };
  }
  return { success: false, error: 'Invalid password. Enter admin123 for instant access.' };
}

export function adminLogout() {
  updateStore({ isAuthenticated: false });
}
