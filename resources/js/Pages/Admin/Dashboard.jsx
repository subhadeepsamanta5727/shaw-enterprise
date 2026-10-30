import React, { useState } from 'react';
import {
  useStore,
  updateOrderStatus,
  deleteOrder,
  updateInquiryStatus,
  deleteInquiry,
  addProduct,
  updateProduct,
  deleteProduct,
  addCategory,
  updateCategory,
  deleteCategory,
  addTestimonial,
  deleteTestimonial,
  addBlog,
  updateBlog,
  deleteBlog,
  addClient,
  updateClient,
  deleteClient,
  CLIENT_CATEGORIES,
  adminLogout,
} from '../../store';
import SettingsView from './SettingsView';
import ImageUploadInput from '../../Components/ImageUploadInput';
import { resolveImageUrl } from '../../services/api';

const resolveImg = (src, fallback) => resolveImageUrl(src, fallback);

export default function AdminDashboard() {
  const [store] = useStore();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'products' | 'categories' | 'inquiries' | 'testimonials' | 'blogs' | 'settings'
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [orderFilter, setOrderFilter] = useState('All');
  const [inquiryFilter, setInquiryFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Modals State
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isNewTestimonialModalOpen, setIsNewTestimonialModalOpen] = useState(false);
  const [isNewBlogModalOpen, setIsNewBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientFilter, setClientFilter] = useState('all');

  // Forms State
  const [newProd, setNewProd] = useState({
    title: '',
    category_id: store.categories[0]?.id || 1,
    sku: '',
    base_price: 1299,
    mrp: 1699,
    main_image: 'products/main/whiteboard.jpg',
    short_description: '',
    size_label: '3x2 Feet (Standard)',
  });

  const [newCat, setNewCat] = useState({ name: '', description: '', image: 'categories/white-boards.jpg' });
  const [newTesti, setNewTesti] = useState({ client_name: '', client_designation: '', organization_name: '', review_text: '', rating: 5 });
  const [newBlog, setNewBlog] = useState({ title: '', author_name: 'Indrajit Shaw', video_url: '', content: '', thumbnail_image: 'blogs/whiteboard-guide.jpg' });
  const [newClient, setNewClient] = useState({
    name: '',
    category: 'university_colleges',
    location: 'Kolkata, West Bengal',
  });

  const orders = store.orders || [];
  const products = store.products || [];
  const categories = store.categories || [];
  const inquiries = store.inquiries || [];
  const testimonials = store.testimonials || [];
  const blogs = store.blogs || [];
  const clients = store.clients || [];
  const settings = store.settings || {};
  const logoSrc = settings.logo_url || settings.site_logo || settings.logo;

  // Metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.order_status === 'Processing' || o.order_status === 'Confirmed').length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total_amount || 0), 0);
  const pendingInquiries = inquiries.filter((i) => i.status === 'Pending').length;

  const handleCreateProduct = (e) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === Number(newProd.category_id)) || categories[0];
    addProduct({
      title: newProd.title,
      category_id: Number(newProd.category_id),
      category: { id: cat.id, name: cat.name, slug: cat.slug },
      sku: newProd.sku || `SE-PROD-${Math.floor(100 + Math.random() * 900)}`,
      base_price: Number(newProd.base_price),
      mrp: Number(newProd.mrp || newProd.base_price * 1.3),
      discount_percent: Math.round(((newProd.mrp - newProd.base_price) / newProd.mrp) * 100),
      short_description: newProd.short_description || 'High-gloss durable writing surface with heavy virgin aluminium frame.',
      full_description: `<p>${newProd.short_description}</p>`,
      main_image: newProd.main_image || 'products/main/whiteboard.jpg',
      images: [newProd.main_image || 'products/main/whiteboard.jpg'],
      variants: [
        {
          id: Date.now(),
          size_label: newProd.size_label,
          price: Number(newProd.base_price),
          mrp: Number(newProd.mrp),
          stock_quantity: 100,
          is_default: true,
        },
      ],
      is_featured: true,
    });
    setIsNewProductModalOpen(false);
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    addCategory(newCat);
    setIsNewCategoryModalOpen(false);
    setNewCat({ name: '', description: '', image: 'categories/white-boards.jpg' });
  };

  const handleCreateTestimonial = (e) => {
    e.preventDefault();
    addTestimonial(newTesti);
    setIsNewTestimonialModalOpen(false);
    setNewTesti({ client_name: '', client_designation: '', organization_name: '', review_text: '', rating: 5 });
  };

  const handleCreateBlog = (e) => {
    e.preventDefault();
    addBlog(newBlog);
    setIsNewBlogModalOpen(false);
    setNewBlog({ title: '', author_name: 'Indrajit Shaw', video_url: '', content: '', thumbnail_image: 'blogs/whiteboard-guide.jpg' });
  };

  const handleCreateClient = (e) => {
    e.preventDefault();
    addClient({
      name: newClient.name.trim(),
      category: newClient.category,
      location: newClient.location.trim(),
    });
    setIsNewClientModalOpen(false);
    setNewClient({
      name: '',
      category: 'university_colleges',
      location: 'Kolkata, West Bengal',
    });
  };

  const handleUpdateClient = (e) => {
    e.preventDefault();
    if (!editingClient) return;
    updateClient(editingClient.id, {
      name: editingClient.name.trim(),
      category: editingClient.category,
      location: editingClient.location.trim(),
    });
    setEditingClient(null);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const cat = categories.find((c) => c.id === Number(editingProduct.category_id)) || editingProduct.category;
    const variants = (editingProduct.variants || [])
      .filter((variant) => variant.size_label?.trim())
      .map((variant, index) => ({
        ...variant,
        size_label: variant.size_label.trim(),
        price: Number(variant.price) || 0,
        mrp: Number(variant.mrp) || null,
        stock_quantity: Number(variant.stock_quantity) || 0,
        is_default: index === 0,
      }));
    const images = [...new Set([editingProduct.main_image, ...(editingProduct.images || [])].filter(Boolean))];
    updateProduct(editingProduct.id, {
      ...editingProduct,
      category_id: Number(editingProduct.category_id),
      category: cat ? { id: cat.id, name: cat.name, slug: cat.slug } : editingProduct.category,
      base_price: variants.length ? variants[0].price : Number(editingProduct.base_price),
      mrp: variants.length ? variants[0].mrp : Number(editingProduct.mrp || editingProduct.base_price * 1.3),
      discount_percent: Math.round(((Number(editingProduct.mrp) - Number(editingProduct.base_price)) / Number(editingProduct.mrp)) * 100),
      full_description: editingProduct.full_description ?? editingProduct.description ?? '',
      description: editingProduct.full_description ?? editingProduct.description ?? '',
      variants,
      specifications: (editingProduct.specifications || []).filter((spec) => spec.spec_key?.trim() && spec.spec_value?.trim()),
      images,
      main_image: images[0] || '',
    });
    setEditingProduct(null);
  };

  const openProductEditor = (product) => {
    const images = [...new Set([product.main_image, ...(Array.isArray(product.images) ? product.images : [])].filter(Boolean))];
    const variants = product.variants?.length
      ? product.variants.map((variant) => ({
          ...variant,
          size_label: variant.size_label || variant.name || 'Standard',
          price: variant.price ?? product.base_price ?? '',
          mrp: variant.mrp ?? product.mrp ?? '',
        }))
      : [{
          size_label: 'Standard',
          price: product.base_price ?? '',
          mrp: product.mrp ?? '',
          stock_quantity: 50,
          is_default: true,
        }];
    setEditingProduct({
      ...product,
      images,
      variants,
      specifications: Array.isArray(product.specifications) ? product.specifications : [],
      full_description: product.full_description || product.description || '',
    });
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    updateCategory(editingCategory.id, editingCategory);
    setEditingCategory(null);
  };

  const handleUpdateBlog = (e) => {
    e.preventDefault();
    if (!editingBlog) return;
    updateBlog(editingBlog.id, editingBlog);
    setEditingBlog(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 h-16 flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <a href="/admin/dashboard" className="flex items-center gap-2.5">
            {logoSrc ? (
              <img
                src={resolveImg(logoSrc)}
                alt={settings.site_name || 'Shaw Enterprise'}
                className="h-10 max-h-10 max-w-[170px] object-contain rounded py-0.5"
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-amber-400 rounded-lg flex items-center justify-center text-slate-950 font-black text-lg shadow-md">
                  SE
                </div>
                <div>
                  <span className="text-base font-black tracking-tight text-white uppercase block leading-none">
                    {settings.site_name || 'Shaw Enterprise'}
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest leading-none">
                    Store Admin & E-Commerce Hub
                  </span>
                </div>
              </div>
            )}
          </a>

          <div className="hidden lg:flex items-center gap-2 pl-6 border-l border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-medium">College Street Works & Showroom Online</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-lg border border-slate-700 transition"
          >
            <span>Live Storefront ↗</span>
          </a>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block">{store.currentUser?.name}</span>
              <span className="text-[10px] text-amber-400 block">{store.currentUser?.role}</span>
            </div>
            <button
              onClick={() => {
                adminLogout();
                if (window.__navigate) window.__navigate('/admin/login');
              }}
              className="text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Horizontal Scrollable Nav Tabs */}
      <nav className="lg:hidden relative bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between sticky top-16 z-30">
        <span className="text-sm font-bold text-white">
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'orders', icon: '🛍️', label: `Orders (${pendingOrders})` },
            { id: 'products', icon: '🏷️', label: `Products (${products.length})` },
            { id: 'categories', icon: '📁', label: `Categories (${categories.length})` },
            { id: 'inquiries', icon: '📥', label: `RFQs (${pendingInquiries})` },
            { id: 'testimonials', icon: '⭐', label: `Reviews (${testimonials.length})` },
            { id: 'blogs', icon: '▶️', label: `Vlogs (${blogs.length})` },
            { id: 'clients', icon: '🏛️', label: `Clients (${clients.length})` },
            { id: 'settings', icon: '⚙️', label: 'Settings' },
          ].find((tab) => tab.id === activeTab)?.label}
        </span>
        <button
          type="button"
          onClick={() => setIsMobileNavOpen((isOpen) => !isOpen)}
          aria-label="Toggle admin navigation"
          aria-expanded={isMobileNavOpen}
          className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-2xl font-black flex items-center justify-center"
        >
          ⋮
        </button>
        {isMobileNavOpen && (
          <div className="absolute top-full right-3 mt-2 w-64 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-950 p-2 shadow-2xl">
            {[
          { id: 'overview', icon: '📊', label: 'Overview' },
          { id: 'orders', icon: '🛍️', label: `Orders (${pendingOrders})` },
          { id: 'products', icon: '🏷️', label: `Products (${products.length})` },
          { id: 'categories', icon: '📁', label: `Categories (${categories.length})` },
          { id: 'inquiries', icon: '📥', label: `RFQs (${pendingInquiries})` },
          { id: 'testimonials', icon: '⭐', label: `Reviews (${testimonials.length})` },
          { id: 'blogs', icon: '▶️', label: `Vlogs (${blogs.length})` },
          { id: 'clients', icon: '🏛️', label: `Clients (${clients.length})` },
          { id: 'settings', icon: '⚙️', label: 'Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setIsMobileNavOpen(false);
            }}
            aria-pressed={activeTab === tab.id}
            className={`w-full min-w-0 px-3 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
              activeTab === tab.id ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'bg-slate-900 text-slate-300'
            }`}
          >
            <span className="shrink-0">{tab.icon}</span>
            <span className="truncate text-left">{tab.label}</span>
          </button>
        ))}
          </div>
        )}
      </nav>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:flex lg:w-64 bg-slate-950/80 border-r border-slate-800 p-4 flex-col justify-between flex-shrink-0">
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'overview'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span>📊</span>
                <span>Dashboard Overview</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'orders'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span>🛍️</span>
                <span>Customer Orders</span>
              </span>
              {pendingOrders > 0 && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                  {pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'products'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span>🏷️</span>
                <span>Products & Inventory</span>
              </span>
              <span className="text-[10px] text-slate-400">{products.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'categories'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span>📁</span>
                <span>Categories</span>
              </span>
              <span className="text-[10px] text-slate-400">{categories.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'inquiries'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span>📥</span>
                <span>Bulk Quotes / RFQs</span>
              </span>
              {pendingInquiries > 0 && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500 text-white">
                  {pendingInquiries}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'testimonials'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span>⭐</span>
                <span>Customer Reviews</span>
              </span>
              <span className="text-[10px] text-slate-400">{testimonials.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'blogs'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span>▶️</span>
                <span>Vlogs & Product Guides</span>
              </span>
              <span className="text-[10px] text-slate-400">{blogs.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'clients'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span>🏛️</span>
                <span>Our Clients</span>
              </span>
              <span className="text-[10px] text-slate-400">{clients.length}</span>
            </button>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'settings'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/60 border border-amber-400/20'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span>⚙️</span>
                  <span>Store & API Settings</span>
                </span>
              </button>
            </div>
          </nav>

          <div className="mt-8 pt-4 border-t border-slate-800/60 text-[11px] text-slate-500 space-y-1">
            <span className="block font-bold text-slate-300">{settings.site_name}</span>
            <span>{settings.registered_office_address?.split('(')[0]?.trim() || '44/1B, Beniatola Lane'} (College St)</span>
            <span className="block text-[10px] text-amber-400/90 font-mono mt-1">GSTIN: {settings.gst_number}</span>
          </div>
        </aside>

        {/* Content Area */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 bg-slate-900 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Store Dashboard & Sales Summary
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage online consumer orders, catalog inventory, payment gateway settings, and retail sales.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                  >
                    <span>⚙️ Store Settings</span>
                  </button>
                  <button
                    onClick={() => setIsNewProductModalOpen(true)}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5"
                  >
                    <span>+ Add Product</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Online Sales</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-400">
                      ₹{totalRevenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">Across {totalOrders} customer orders</span>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Pending Orders</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-400">{pendingOrders}</span>
                    <span className="text-xs text-amber-400 font-bold">Ready for packing</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">Express dispatch Kolkata</span>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Catalog SKUs</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">{products.length}</span>
                    <span className="text-xs text-blue-400 font-bold">In Stock</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">Across {categories.length} active categories</span>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Bulk / Wholesale Quotes</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">{inquiries.length}</span>
                    <span className="text-xs text-rose-400 font-bold">{pendingInquiries} new</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">School & Coaching inquiries</span>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Recent Customer Orders</h3>
                    <p className="text-xs text-slate-400">Latest online checkout orders from Kolkata and all-India</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300"
                  >
                    View All Orders ({orders.length}) →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 uppercase text-[11px]">
                        <th className="pb-3">Order ID & Date</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Items Summary</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Order Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-700/30">
                          <td className="py-3 font-bold text-amber-400 font-mono">
                            {ord.id}
                            <span className="block text-[10px] text-slate-500 font-sans">
                              {new Date(ord.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="font-bold text-white block">{ord.customer_name}</span>
                            <span className="text-slate-400 text-[11px]">{ord.phone}</span>
                          </td>
                          <td className="py-3 max-w-xs">
                            <span className="text-slate-300 block truncate">
                              {ord.items?.map((it) => `${it.title} (${it.quantity})`).join(', ')}
                            </span>
                          </td>
                          <td className="py-3 font-black text-emerald-400">
                            ₹{ord.total_amount?.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 text-slate-300">
                            <span className="text-[11px] font-semibold">{ord.payment_method}</span>
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              {ord.order_status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-white tracking-tight">Customer Orders & Deliveries</h1>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[720px]">
                    <thead>
                      <tr className="bg-slate-950/60 border-b border-slate-700 text-slate-400 uppercase text-[11px]">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer & Contact</th>
                        <th className="py-3 px-4">Delivery Address</th>
                        <th className="py-3 px-4">Order Items</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-700/30">
                          <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{ord.id}</td>
                          <td className="py-3.5 px-4">
                            <strong className="block text-white">{ord.customer_name}</strong>
                            <span className="text-slate-400 text-[11px]">{ord.phone}</span>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs text-slate-300 truncate">
                            {ord.delivery_address}, {ord.city}
                          </td>
                          <td className="py-3.5 px-4 text-slate-200">
                            {ord.items?.length || 1} Products
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-400">
                            ₹{ord.total_amount?.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            <span className="block font-semibold">{ord.payment_method}</span>
                            <span className="text-[10px] text-emerald-400">{ord.payment_status}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={ord.order_status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                              className="bg-slate-900 border border-slate-700 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Permanently delete order "${ord.id}"?`)) {
                                  deleteOrder(ord.id);
                                }
                              }}
                              className="ml-2 text-xs font-bold text-rose-400 hover:text-rose-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS & INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Products & Inventory</h1>
                  <p className="text-xs text-slate-400 mt-1">Manage retail whiteboards, chalkboards, stands, and prices.</p>
                </div>
                <button
                  onClick={() => setIsNewProductModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition shadow"
                >
                  + Add New Product
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={resolveImg(prod.main_image)}
                            alt={prod.title}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/100x100/1e293b/ffffff?text=Product';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            {prod.category?.name || 'General Product'}
                          </span>
                          <span className="text-xs font-mono text-slate-400 font-bold block mt-1">{prod.sku}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white line-clamp-2">{prod.title}</h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{prod.short_description}</p>

                      <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase text-slate-500 font-bold block">Selling Price</span>
                          <span className="text-lg font-black text-emerald-400">₹{Number(prod.base_price).toLocaleString('en-IN')}</span>
                          {prod.mrp && <span className="text-xs text-slate-400 line-through ml-2">₹{Number(prod.mrp).toLocaleString('en-IN')}</span>}
                        </div>
                        <span className="text-xs text-slate-300">
                          {prod.variants?.length || 1} Size Variants
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 px-5 py-3 border-t border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openProductEditor(prod)}
                          className="text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/30 transition"
                        >
                          ✏️ Edit / Upload Photo
                        </button>
                        <a
                          href={`/products/${prod.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-blue-400 hover:text-blue-300"
                        >
                          Preview ↗
                        </a>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Delete product "${prod.title}"?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="text-xs font-bold text-rose-400 hover:text-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-white tracking-tight">Product Categories</h1>
                <button
                  onClick={() => setIsNewCategoryModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2 rounded-xl"
                >
                  + Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={resolveImg(cat.image)}
                            alt={cat.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/100x100/1e293b/ffffff?text=Category';
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">{cat.name}</h3>
                          <span className="text-[11px] text-amber-400 font-mono">/products?category={cat.slug}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{cat.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setEditingCategory({ ...cat })}
                        className="text-amber-400 hover:text-amber-300 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/30 transition"
                      >
                        ✏️ Edit / Upload Photo
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete category "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="text-rose-400 hover:text-rose-300 font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: INQUIRIES & BULK QUOTES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-white tracking-tight">Bulk Quotes & Wholesale RFQs</h1>
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead>
                      <tr className="bg-slate-950/60 border-b border-slate-700 text-slate-400 uppercase text-[11px]">
                        <th className="py-3 px-4">Client / Institution</th>
                        <th className="py-3 px-4">Item & Variant</th>
                        <th className="py-3 px-4">Qty</th>
                        <th className="py-3 px-4">City</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {inquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-slate-700/30">
                          <td className="py-3.5 px-4">
                            <strong className="block text-white">{inq.organization_name}</strong>
                            <span className="text-slate-400 text-[11px]">{inq.client_name} • {inq.phone}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-200">{inq.product_title}</td>
                          <td className="py-3.5 px-4 font-bold text-amber-400">{inq.quantity} units</td>
                          <td className="py-3.5 px-4 text-slate-300">{inq.delivery_city}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                              {inq.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <a
                              href={`https://wa.me/${inq.phone?.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.client_name)},%20regarding%20your%20quotation%20with%20Shaw%20Enterprise...`}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-xs font-bold"
                            >
                              WhatsApp
                            </a>
                            <button
                              onClick={() => deleteInquiry(inq.id)}
                              className="text-rose-400 hover:text-rose-300 font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CUSTOMER TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-white tracking-tight">Customer Testimonials & Reviews</h1>
                <button
                  onClick={() => setIsNewTestimonialModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2 rounded-xl"
                >
                  + Add Review
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((test) => (
                  <div key={test.id} className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="text-amber-400 text-sm mb-3">{'★'.repeat(test.rating || 5)}</div>
                      <blockquote className="text-xs text-slate-200 italic mb-4">"{test.review_text}"</blockquote>
                    </div>
                    <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <strong className="block text-white">{test.client_name}</strong>
                        <span className="text-slate-400 text-[11px]">{test.organization_name}</span>
                      </div>
                      <button
                        onClick={() => deleteTestimonial(test.id)}
                        className="text-rose-400 hover:text-rose-300 font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: VLOGS & VIDEO BLOGS */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-white tracking-tight">Vlogs & Product Guides</h1>
                <button
                  onClick={() => setIsNewBlogModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2 rounded-xl"
                >
                  + Add Vlog / Video
                </button>
              </div>

              <div className="space-y-4">
                {blogs.map((b) => (
                  <div key={b.id} className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {b.thumbnail_image && (
                        <div className="w-16 h-12 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex-shrink-0">
                          <img
                            src={resolveImg(b.thumbnail_image)}
                            alt={b.title}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-bold text-white">{b.title}</h3>
                        <span className="text-xs text-slate-400">By {b.author_name} • {b.published_at}</span>
                        {b.video_url && (
                          <span className="ml-3 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                            ▶ Video Attached
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingBlog({ ...b })}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 px-2.5 py-1.5 rounded-lg border border-amber-400/30 transition"
                      >
                        ✏️ Edit / Upload Thumbnail
                      </button>
                      <a
                        href={`/blogs/${b.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700"
                      >
                        View ↗
                      </a>
                      <button
                        onClick={() => deleteBlog(b.id)}
                        className="text-xs font-bold text-rose-400 hover:text-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: OUR CLIENTS MANAGEMENT */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Our Clients Directory</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage client names, categories, and locations for the storefront.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="/clients"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5"
                  >
                    <span>🌐</span> View Storefront Page ↗
                  </a>
                  <button
                    onClick={() => setIsNewClientModalOpen(true)}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2 rounded-xl shadow transition"
                  >
                    + Add New Client
                  </button>
                </div>
              </div>

              {/* Filter Tabs by Category */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800">
                {CLIENT_CATEGORIES.map((cat) => {
                  const isActive = clientFilter === cat.id;
                  const count = cat.id === 'all'
                    ? clients.length
                    : clients.filter((c) => c.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setClientFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 font-black shadow'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Client List Cards */}
              <div className="space-y-3">
                {clients
                  .filter((c) => clientFilter === 'all' || c.category === clientFilter)
                  .map((c) => (
                    <div
                      key={c.id}
                      className="bg-slate-800/80 border border-slate-700 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-600"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 border border-slate-700 flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                          {c.category === 'university_colleges' ? '🎓' : c.category === 'schools' ? '🏫' : c.category === 'corporate_banks' ? '🏢' : '🏥'}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-white">{c.name}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-amber-400">
                              {c.category_label || c.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <span>📍</span>
                            <span>{c.location || 'Kolkata'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => setEditingClient({ ...c })}
                          className="text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/30 transition flex items-center gap-1.5"
                        >
                          <span>✏️ Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete client "${c.name}"?`)) {
                              deleteClient(c.id);
                            }
                          }}
                          className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 8: STORE & BUSINESS SETTINGS */}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* MODAL: VIEW ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>

            <span className="text-xs font-bold text-amber-400 uppercase font-mono">Order {selectedOrder.id}</span>
            <h2 className="text-xl font-black text-white mt-1">{selectedOrder.customer_name}</h2>
            <p className="text-xs text-slate-400">{selectedOrder.phone} • {selectedOrder.delivery_address}, {selectedOrder.city}</p>

            <div className="my-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-slate-400 uppercase text-[10px] block">Items in this Order</span>
              {selectedOrder.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between border-b border-slate-800 pb-1.5 last:border-0 last:pb-0">
                  <div>
                    <span className="font-bold text-white block">{it.title}</span>
                    <span className="text-slate-400 text-[11px]">{it.size_label} x {it.quantity}</span>
                  </div>
                  <span className="font-bold text-emerald-400">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-800 flex justify-between font-black text-sm text-white">
                <span>Total Amount</span>
                <span className="text-emerald-400">₹{selectedOrder.total_amount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <a
                href={`https://wa.me/${selectedOrder.phone?.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedOrder.customer_name)},%20greetings%20from%20Shaw%20Enterprise.%20Your%20order%20${selectedOrder.id}%20is%20${selectedOrder.order_status}.`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                WhatsApp Customer
              </a>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-800 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsNewProductModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>

            <h2 className="text-xl font-black text-white">Add New Product to Store</h2>
            <form onSubmit={handleCreateProduct} className="space-y-4 mt-5 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Product Title *</label>
                <input
                  required
                  type="text"
                  value={newProd.title}
                  onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                  placeholder="e.g. Shaw Double-Sided Reversible Whiteboard"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Category *</label>
                  <select
                    value={newProd.category_id}
                    onChange={(e) => setNewProd({ ...newProd, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Size Specification</label>
                  <input
                    type="text"
                    value={newProd.size_label}
                    onChange={(e) => setNewProd({ ...newProd, size_label: e.target.value })}
                    placeholder="e.g. 4x3 Feet"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Selling Price (₹) *</label>
                  <input
                    required
                    type="number"
                    value={newProd.base_price}
                    onChange={(e) => setNewProd({ ...newProd, base_price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={newProd.mrp}
                    onChange={(e) => setNewProd({ ...newProd, mrp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* Upload Product Image File */}
              <div>
                <ImageUploadInput
                  label="Upload Product Image File *"
                  value={newProd.main_image}
                  onChange={(img) => setNewProd({ ...newProd, main_image: img })}
                  helperText="Upload whiteboard, stand, or accessory photo (PNG, JPG, WEBP)"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={newProd.short_description}
                  onChange={(e) => setNewProd({ ...newProd, short_description: e.target.value })}
                  placeholder="Durable writing board manufactured by Shaw Enterprise College Street..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 rounded-xl transition uppercase"
              >
                Save Product & Publish
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {isNewCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsNewCategoryModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h2 className="text-lg font-black text-white">Add New Category</h2>
            <form onSubmit={handleCreateCategory} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Category Name *</label>
                <input
                  required
                  type="text"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  placeholder="e.g. Acrylic Display Products"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div>
                <ImageUploadInput
                  label="Upload Category Cover Image *"
                  value={newCat.image}
                  onChange={(img) => setNewCat({ ...newCat, image: img })}
                  helperText="Upload category card banner / cover photo"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <button type="submit" className="w-full bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl uppercase">
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TESTIMONIAL */}
      {isNewTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsNewTestimonialModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h2 className="text-lg font-black text-white">Add Customer Review</h2>
            <form onSubmit={handleCreateTestimonial} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Customer Name *</label>
                <input
                  required
                  type="text"
                  value={newTesti.client_name}
                  onChange={(e) => setNewTesti({ ...newTesti, client_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Organization / City</label>
                <input
                  type="text"
                  value={newTesti.organization_name}
                  onChange={(e) => setNewTesti({ ...newTesti, organization_name: e.target.value })}
                  placeholder="e.g. Bowbazar Coaching, Kolkata"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Review Text *</label>
                <textarea
                  required
                  rows={3}
                  value={newTesti.review_text}
                  onChange={(e) => setNewTesti({ ...newTesti, review_text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <button type="submit" className="w-full bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl uppercase">
                Save Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD BLOG / VLOG */}
      {isNewBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsNewBlogModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h2 className="text-lg font-black text-white">Add Vlog / Guide</h2>
            <form onSubmit={handleCreateBlog} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Title *</label>
                <input
                  required
                  type="text"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div>
                <ImageUploadInput
                  label="Upload Guide Thumbnail Image"
                  value={newBlog.thumbnail_image}
                  onChange={(img) => setNewBlog({ ...newBlog, thumbnail_image: img })}
                  helperText="Upload thumbnail image for vlog or article"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">YouTube Video URL (optional)</label>
                <input
                  type="url"
                  value={newBlog.video_url}
                  onChange={(e) => setNewBlog({ ...newBlog, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Summary / Content</label>
                <textarea
                  rows={3}
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <button type="submit" className="w-full bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl uppercase">
                Save Vlog
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT & UPLOAD PHOTO */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>

            <span className="text-[11px] font-bold text-amber-400 uppercase font-mono tracking-wider">Product #{editingProduct.id}</span>
            <h2 className="text-xl font-black text-white mt-1">Edit Product</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-4 mt-5 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Product Title *</label>
                <input
                  required
                  type="text"
                  value={editingProduct.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Category *</label>
                  <select
                    value={editingProduct.category_id || categories[0]?.id}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">SKU / Model</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <section className="space-y-3 rounded-xl border border-slate-700 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black text-white">Sizes & Pricing</h3>
                  <button
                    type="button"
                    onClick={() => setEditingProduct({
                      ...editingProduct,
                      variants: [...(editingProduct.variants || []), {
                        size_label: 'Custom Size',
                        price: '',
                        mrp: '',
                        stock_quantity: 50,
                        is_default: false,
                      }],
                    })}
                    className="rounded-lg bg-amber-400/10 px-3 py-1.5 font-bold text-amber-300"
                  >
                    + Add size / custom price
                  </button>
                </div>
                {(editingProduct.variants || []).map((variant, index) => (
                  <div key={variant.id || index} className="grid grid-cols-1 gap-2 rounded-lg bg-slate-950/70 p-3 sm:grid-cols-[1.4fr_1fr_1fr_auto]">
                    <input
                      aria-label={`Size ${index + 1}`}
                      placeholder="Size (e.g. 3x2 Feet or Custom Size)"
                      value={variant.size_label || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        variants: editingProduct.variants.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, size_label: e.target.value } : item
                        ),
                      })}
                      className="min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                    />
                    <input
                      aria-label={`Selling price for size ${index + 1}`}
                      type="number"
                      min="0"
                      placeholder="Selling price ₹"
                      value={variant.price ?? ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        variants: editingProduct.variants.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, price: e.target.value } : item
                        ),
                      })}
                      className="min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                    />
                    <input
                      aria-label={`MRP for size ${index + 1}`}
                      type="number"
                      min="0"
                      placeholder="MRP ₹"
                      value={variant.mrp ?? ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        variants: editingProduct.variants.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, mrp: e.target.value } : item
                        ),
                      })}
                      className="min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                    />
                    <button
                      type="button"
                      aria-label={`Remove size ${index + 1}`}
                      onClick={() => setEditingProduct({
                        ...editingProduct,
                        variants: editingProduct.variants.filter((_, itemIndex) => itemIndex !== index),
                      })}
                      className="rounded-lg px-3 font-bold text-rose-400 hover:bg-rose-500/10"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <p className="text-[11px] text-slate-400">Add each standard size as a row. Use “Custom Size” to set the custom dimension selling price and MRP.</p>
              </section>

              <section className="space-y-3 rounded-xl border border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-white">Product Images</h3>
                  <button
                    type="button"
                    onClick={() => setEditingProduct({
                      ...editingProduct,
                      images: [...(editingProduct.images || []), ''],
                    })}
                    className="rounded-lg bg-amber-400/10 px-3 py-1.5 font-bold text-amber-300"
                  >
                    + Add image
                  </button>
                </div>
                {(editingProduct.images || []).map((image, index) => (
                  <div key={`product-image-${index}`} className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <ImageUploadInput
                        label={index === 0 ? 'Main product image' : `Product image ${index + 1}`}
                        value={image}
                        onChange={(value) => {
                          const images = editingProduct.images.map((item, itemIndex) => itemIndex === index ? value : item);
                          setEditingProduct({ ...editingProduct, images, main_image: images[0] || '' });
                        }}
                        helperText="Upload or paste an image link"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove product image ${index + 1}`}
                      onClick={() => {
                        const images = editingProduct.images.filter((_, itemIndex) => itemIndex !== index);
                        setEditingProduct({ ...editingProduct, images, main_image: images[0] || '' });
                      }}
                      className="mt-7 rounded-lg px-2 py-1 font-bold text-rose-400 hover:bg-rose-500/10"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </section>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.short_description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Full Product Description</label>
                <textarea
                  rows={5}
                  value={editingProduct.full_description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, full_description: e.target.value })}
                  placeholder="Product details, materials, usage, warranty..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <section className="space-y-3 rounded-xl border border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-white">Product Specifications</h3>
                  <button
                    type="button"
                    onClick={() => setEditingProduct({
                      ...editingProduct,
                      specifications: [...(editingProduct.specifications || []), { spec_key: '', spec_value: '' }],
                    })}
                    className="rounded-lg bg-amber-400/10 px-3 py-1.5 font-bold text-amber-300"
                  >
                    + Add specification
                  </button>
                </div>
                {(editingProduct.specifications || []).map((spec, index) => (
                  <div key={spec.id || index} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1.5fr_auto]">
                    <input
                      aria-label={`Specification name ${index + 1}`}
                      placeholder="Specification (e.g. Frame)"
                      value={spec.spec_key || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        specifications: editingProduct.specifications.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, spec_key: e.target.value } : item
                        ),
                      })}
                      className="min-w-0 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    />
                    <input
                      aria-label={`Specification value ${index + 1}`}
                      placeholder="Value (e.g. 6063-T6 Aluminium)"
                      value={spec.spec_value || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        specifications: editingProduct.specifications.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, spec_value: e.target.value } : item
                        ),
                      })}
                      className="min-w-0 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    />
                    <button
                      type="button"
                      aria-label={`Remove specification ${index + 1}`}
                      onClick={() => setEditingProduct({
                        ...editingProduct,
                        specifications: editingProduct.specifications.filter((_, itemIndex) => itemIndex !== index),
                      })}
                      className="rounded-lg px-3 font-bold text-rose-400 hover:bg-rose-500/10"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </section>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 rounded-xl transition uppercase tracking-wide"
              >
                Save Changes & Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CATEGORY & UPLOAD PHOTO */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingCategory(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <span className="text-[11px] font-bold text-amber-400 uppercase font-mono tracking-wider">Category #{editingCategory.id}</span>
            <h2 className="text-lg font-black text-white mt-1">Edit Category</h2>
            <form onSubmit={handleUpdateCategory} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Category Name *</label>
                <input
                  required
                  type="text"
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div>
                <ImageUploadInput
                  label="Upload / Change Category Image *"
                  value={editingCategory.image}
                  onChange={(img) => setEditingCategory({ ...editingCategory, image: img })}
                  helperText="Upload category card banner / cover photo"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <button type="submit" className="w-full bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl uppercase">
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT BLOG / VLOG & UPLOAD PHOTO */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingBlog(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <span className="text-[11px] font-bold text-amber-400 uppercase font-mono tracking-wider">Vlog / Guide #{editingBlog.id}</span>
            <h2 className="text-lg font-black text-white mt-1">Edit Vlog / Guide</h2>
            <form onSubmit={handleUpdateBlog} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Title *</label>
                <input
                  required
                  type="text"
                  value={editingBlog.title || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div>
                <ImageUploadInput
                  label="Upload / Change Guide Thumbnail Image"
                  value={editingBlog.thumbnail_image}
                  onChange={(img) => setEditingBlog({ ...editingBlog, thumbnail_image: img })}
                  helperText="Upload thumbnail image for vlog or article"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">YouTube Video URL (optional)</label>
                <input
                  type="url"
                  value={editingBlog.video_url || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Summary / Content</label>
                <textarea
                  rows={4}
                  value={editingBlog.content || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <button type="submit" className="w-full bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl uppercase">
                Save & Update Vlog
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW CLIENT */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsNewClientModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Storefront Directory
            </span>
            <h2 className="text-lg font-black text-white">Add New Client / Institution</h2>
            <form onSubmit={handleCreateClient} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Client / Institution Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Calcutta University, State Bank of India"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Toggle Category *</label>
                  <select
                    value={newClient.category}
                    onChange={(e) => setNewClient({ ...newClient, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="university_colleges">University & Colleges</option>
                    <option value="schools">Schools</option>
                    <option value="corporate_banks">Corporate Office / Bank</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Location *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. College Street, Kolkata"
                    value={newClient.location}
                    onChange={(e) => setNewClient({ ...newClient, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2.5 rounded-xl uppercase tracking-wider shadow transition"
              >
                + Add Client to Directory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CLIENT */}
      {editingClient && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingClient(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Edit Client #{editingClient.id}
            </span>
            <h2 className="text-lg font-black text-white">Edit Client Details</h2>
            <form onSubmit={handleUpdateClient} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Client / Institution Name *</label>
                <input
                  required
                  type="text"
                  value={editingClient.name || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Toggle Category *</label>
                  <select
                    value={editingClient.category || 'university_colleges'}
                    onChange={(e) => setEditingClient({ ...editingClient, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="university_colleges">University & Colleges</option>
                    <option value="schools">Schools</option>
                    <option value="corporate_banks">Corporate Office / Bank</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Location *</label>
                  <input
                    required
                    type="text"
                    value={editingClient.location || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2.5 rounded-xl uppercase tracking-wider shadow transition"
                >
                  Save & Update Client
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete client "${editingClient.name}"?`)) {
                      deleteClient(editingClient.id);
                      setEditingClient(null);
                    }
                  }}
                  className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold px-4 py-2.5 rounded-xl text-xs"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
