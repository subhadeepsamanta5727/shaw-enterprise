import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useStore } from '../../store';
import { resolveImageUrl } from '../../services/api';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import BulkQuoteModal from '../../Components/BulkQuoteModal';
import CustomSizeModal from '../../Components/CustomSizeModal';
import BrochureModal from '../../Components/BrochureModal';
import WhatsAppFloatingButton from '../../Components/WhatsAppFloatingButton';

const resolveImg = (src, fallback) => resolveImageUrl(src, fallback);

export default function ProductIndex({ filters = {} }) {
  const [store] = useStore();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');

  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const activeCategory = urlParams.get('category') || filters?.category || '';

  const settings = store.settings || {};
  const categories = store.categories || [];
  const products = store.products || [];

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      !activeCategory ||
      p.category?.slug === activeCategory ||
      p.category_id === Number(activeCategory);
    const matchesSearch =
      !searchTerm ||
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">
      <Head title={`All Products & Catalogs | ${settings.site_name || 'Shaw Enterprise'} Kolkata`} />

      {/* Standard E-Commerce Navbar */}
      <Navbar
        onOpenEnquiry={() => {
          setSelectedProductForQuote(products[0]);
          setIsQuoteModalOpen(true);
        }}
      />

      {/* Hero Catalog Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">
                Direct College Street Factory Catalog
              </span>
              <h1 className="text-2xl sm:text-4xl font-black">
                Writing Boards, Stands & Educational Furniture
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                Non-magnetic & ceramic magnetic whiteboards, green chalkboards, pin-up notice boards, and heavy-duty stands available for instant online retail order & bulk institutional delivery.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCustomSizeOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow transition flex items-center gap-2"
              >
                <span>📐</span> Custom Size Calculator
              </button>
              <button
                onClick={() => setIsBrochureOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2"
              >
                <span>📄</span> Digital Catalog
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Mobile / Tablet Category Quick-Scroll Bar */}
        <div className="lg:hidden mb-6 overflow-x-auto pb-2 scrollbar-none flex items-center gap-2">
          <Link
            href="/products"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 flex-shrink-0 shadow-sm ${
              !activeCategory ? 'bg-blue-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>All Catalog</span>
            <span className="text-[10px] opacity-75">({products.length})</span>
          </Link>
          {categories.map((c, idx) => {
            const count = products.filter(
              (p) => p.category?.slug === c.slug || p.category_id === c.id
            ).length;
            const isActive = activeCategory === c.slug || activeCategory === String(c.id);
            return (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 flex-shrink-0 shadow-sm ${
                  isActive ? 'bg-blue-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{idx + 1}. {c.name}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Category Sidebar (Visible on Desktop) */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                Filter by Category
              </h3>
              <div className="flex flex-col gap-1.5">
                <Link
                  href="/products"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    !activeCategory
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>All Writing & Display Boards</span>
                  <span className="text-[10px] opacity-75">{products.length}</span>
                </Link>

                {categories.map((c, idx) => {
                  const count = products.filter(
                    (p) => p.category?.slug === c.slug || p.category_id === c.id
                  ).length;
                  const isActive = activeCategory === c.slug || activeCategory === String(c.id);
                  return (
                    <Link
                      key={c.id}
                      href={`/products?category=${c.slug}`}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                        isActive
                          ? 'bg-blue-900 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{idx + 1}. {c.name}</span>
                      <span className="text-[10px] opacity-75 ml-2">({count})</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Need Custom Size Banner */}
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-wider block text-slate-900/80">
                Custom Workshop Service
              </span>
              <h4 className="text-sm font-black mt-1">Need Non-Standard Dimensions?</h4>
              <p className="text-xs text-slate-900 mt-1 leading-relaxed">
                We manufacture bespoke sizes up to 12×4 ft with custom partition grids or combo green/white layouts.
              </p>
              <button
                onClick={() => setIsCustomSizeOpen(true)}
                className="mt-4 w-full bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold py-2 rounded-xl transition"
              >
                Instant Price Calculator →
              </button>
            </div>
          </aside>

          {/* Right Product Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Results Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search whiteboards, chalkboards, stands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="text-xs font-bold text-slate-500 self-end sm:self-auto">
                Showing <span className="text-slate-900 font-black">{filteredProducts.length}</span> of {products.length} products
              </div>
            </div>

            {/* Products List */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <span className="text-4xl block mb-3">🔍</span>
                <h3 className="text-base font-bold text-slate-900">No products matched your search</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try clearing your search or browsing another category.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    window.location.href = '/products';
                  }}
                  className="mt-4 bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col justify-between group"
                  >
                    <div>
                      <Link href={`/products/${prod.slug}`} className="block aspect-square bg-slate-50 overflow-hidden relative">
                        <img
                          src={resolveImg(prod.main_image)}
                          alt={prod.title}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80';
                          }}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
                        />
                        {prod.discount_percent > 0 && (
                          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                            {prod.discount_percent}% OFF
                          </span>
                        )}
                        {prod.badge && (
                          <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                            {prod.badge}
                          </span>
                        )}
                      </Link>

                      <div className="p-4">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <span>{prod.category?.name}</span>
                          <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-black text-[9px]">
                            SKU: {prod.sku}
                          </span>
                        </div>
                        <Link href={`/products/${prod.slug}`}>
                          <h3 className="text-sm font-bold text-slate-900 mt-1.5 group-hover:text-blue-900 transition line-clamp-2">
                            {prod.title}
                          </h3>
                        </Link>

                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="text-base font-black text-slate-900">
                            ₹{Number(prod.base_price).toLocaleString('en-IN')}
                          </span>
                          {prod.mrp && prod.mrp > prod.base_price && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{Number(prod.mrp).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => {
                          setSelectedProductForQuote(prod);
                          setIsQuoteModalOpen(true);
                        }}
                        className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold py-1.5 rounded-lg transition"
                      >
                        Bulk Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Comprehensive Market-Standard Footer */}
      <Footer
        onOpenCustomSize={() => setIsCustomSizeOpen(true)}
        onOpenBrochure={() => setIsBrochureOpen(true)}
        onOpenEnquiry={() => {
          setSelectedProductForQuote(products[0]);
          setIsQuoteModalOpen(true);
        }}
      />

      {/* Custom Size Modal */}
      <CustomSizeModal isOpen={isCustomSizeOpen} onClose={() => setIsCustomSizeOpen(false)} />

      {/* Digital Catalog Modal */}
      <BrochureModal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)} />

      {/* Bulk Quote Modal */}
      <BulkQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        product={selectedProductForQuote || products[0]}
      />

      {/* WhatsApp Floating Button */}
      <WhatsAppFloatingButton />
    </div>
  );
}
