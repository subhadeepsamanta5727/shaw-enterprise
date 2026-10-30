import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useStore, CLIENT_CATEGORIES } from '../store';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import CartDrawer from '../Components/CartDrawer';
import CustomSizeModal from '../Components/CustomSizeModal';
import BrochureModal from '../Components/BrochureModal';
import WhatsAppFloatingButton from '../Components/WhatsAppFloatingButton';

export default function ClientsPage() {
  const [store] = useStore();
  const settings = store.settings || {};
  const clients = store.clients || [];

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  // Filter clients by category toggle and search query
  const filteredClients = clients.filter((client) => {
    const matchesCategory = activeCategory === 'all' || client.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (catId) => {
    if (catId === 'all') return clients.length;
    return clients.filter((c) => c.category === catId).length;
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'university_colleges':
        return '🎓';
      case 'schools':
        return '🏫';
      case 'corporate_banks':
        return '🏢';
      default:
        return '🏥';
    }
  };

  const getCategoryBadgeColor = (cat) => {
    switch (cat) {
      case 'university_colleges':
        return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'schools':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'corporate_banks':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      default:
        return 'bg-purple-50 text-purple-900 border-purple-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">
      <Head title={`Our Clients | ${settings.site_name || 'Shaw Enterprise'} - Kolkata Writing Board Manufacturer`} />

      {/* Standard Header */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-14 sm:py-16 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">
            Institutional & Enterprise Footprint • Est. 2014
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Our Valued Clients
          </h1>
          <p className="mt-3 text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Trusted by premier universities, prestigious schools, corporate offices, public sector banks, and coaching academies across West Bengal and Eastern India.
          </p>

          {/* Toggle Category Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            {CLIENT_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-sm ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar inside banner */}
          <div className="mt-6 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search by client name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
            />
            <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Client List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <span className="text-4xl block mb-3">🔍</span>
            <h3 className="text-base font-bold text-slate-900">No clients found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No clients match the current filter or search query.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
            {filteredClients.map((client) => {
              const catIcon = getCategoryIcon(client.category);
              return (
                <div
                  key={client.id}
                  className="flex flex-col gap-4 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xl">
                      {catIcon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-black leading-snug text-slate-900">
                        {client.name}
                      </h3>
                      <span className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                        <span>📍</span>
                        <span>{client.location || 'Kolkata, West Bengal'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="pl-[3.75rem] sm:pl-0">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getCategoryBadgeColor(
                        client.category
                      )}`}
                    >
                      {client.category_label || 'Client'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Institutional & Bulk Procurement Banner */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">
              Wholesale & Institutional Tenders
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Planning Classrooms, Halls, or Corporate Floors?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              We offer direct manufacturer rates with official GST tax invoices, on-site dimensional inspection across Kolkata, and multi-layer wooden batten crating for zero transit damage.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">✓</span> ISO 9001:2015 Adherence
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">✓</span> Custom Dimensions to Spec
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">✓</span> Pan-India Surface Freight
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(true)}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg transition"
            >
              Request Institutional Quote
            </button>
            <button
              type="button"
              onClick={() => setIsBrochureOpen(true)}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl text-xs border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <span>📄</span>
              <span>Download Catalog</span>
            </button>
          </div>
        </div>
      </main>

      {/* Standard Footer */}
      <Footer
        onOpenCustomSize={() => setIsCustomSizeOpen(true)}
        onOpenBrochure={() => setIsBrochureOpen(true)}
      />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <CustomSizeModal isOpen={isCustomSizeOpen} onClose={() => setIsCustomSizeOpen(false)} />
      <BrochureModal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)} />
      <WhatsAppFloatingButton />
    </div>
  );
}
