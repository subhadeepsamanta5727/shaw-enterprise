import React, { useState } from 'react';
import { useStore } from '../store';
import { resolveImageUrl } from '../services/api';

const resolveImg = (src, fallback = '') => resolveImageUrl(src, fallback);

export default function BrochureModal({ isOpen, onClose }) {
  const [store] = useStore();
  const settings = store.settings || {};
  const logoSrc = settings.logo_url || settings.site_logo || settings.logo;
  const categories = store.categories || [];
  const products = store.products || [];

  const [activeCatId, setActiveCatId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCatId === 'all' || p.category_id === Number(activeCatId) || p.category?.slug === activeCatId;
    const matchesSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            {logoSrc ? (
              <img src={resolveImg(logoSrc)} alt={settings.site_name} className="h-12 max-h-12 max-w-[220px] object-contain rounded" />
            ) : (
              <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow">
                SE
              </div>
            )}
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Official Product Catalog & Price Reference Sheet
              </h2>
              <p className="text-xs text-slate-500">
                Direct College Street Factory Specifications & Pricing • Serial-Number-Wise Listing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => window.print()}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <span>🖨️</span> Print / Save PDF
            </button>
            <a
              href={`https://wa.me/${(settings.whatsapp || '9933944007').replace(/[^0-9]/g, '')}?text=Hello%20Shaw%20Enterprise,%20please%20send%20me%20your%20complete%20PDF%20catalog%20and%20institutional%20quotation.`}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition"
            >
              <span>💬</span> WhatsApp
            </a>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="py-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => setActiveCatId('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                activeCatId === 'all'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories ({products.length})
            </button>
            {categories.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setActiveCatId(String(c.id))}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  activeCatId === String(c.id)
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}. {c.name}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Search by SKU, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
            />
            <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">🔍</span>
          </div>
        </div>

        {/* Products List (Serial Number Wise) */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No products found matching your filter criteria.
            </div>
          ) : (
            filteredProducts.map((p, idx) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-blue-900 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                      Sl #{idx + 1}
                    </span>
                    <span className="bg-amber-100 text-amber-900 font-mono text-[10px] font-black px-2 py-0.5 rounded-md">
                      SKU: {p.sku}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                      {p.category?.name}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {p.title}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed">
                    {p.short_description}
                  </p>

                  {/* Standard Sizes / Variants preview */}
                  {p.variants && p.variants.length > 0 && (
                    <div className="pt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Standard Sizes:</span>
                      {p.variants.slice(0, 5).map((v) => (
                        <span key={v.id} className="bg-white border border-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded">
                          {v.name.split('(')[0].trim()}
                        </span>
                      ))}
                      {p.variants.length > 5 && (
                        <span className="text-[10px] text-blue-900 font-bold">
                          +{p.variants.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-left md:text-right flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Factory Starting Price</span>
                  <div className="flex items-baseline gap-1.5 md:justify-end">
                    <span className="text-lg font-black text-blue-900">
                      ₹{Number(p.base_price).toLocaleString('en-IN')}
                    </span>
                    {p.mrp && p.mrp > p.base_price && (
                      <span className="text-[10px] text-slate-400 line-through">
                        ₹{Number(p.mrp).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                    ✓ Custom Size on Order
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Info & Contacts */}
        <div className="pt-4 border-t border-slate-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 bg-white">
          <div>
            <strong>Shaw Enterprise (Kolkata)</strong> • Regd: 44/1B, Beniatola Lane (College St) | Works: Balagarh Industrial
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Hotline: <a href={`tel:${settings.phone}`} className="font-bold text-blue-900 hover:underline">{settings.phone}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

