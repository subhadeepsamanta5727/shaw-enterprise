import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useStore } from '../../store';
import { resolveImageUrl } from '../../services/api';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import CartDrawer from '../../Components/CartDrawer';
import BulkQuoteModal from '../../Components/BulkQuoteModal';
import CustomSizeModal from '../../Components/CustomSizeModal';
import BrochureModal from '../../Components/BrochureModal';
import WhatsAppFloatingButton from '../../Components/WhatsAppFloatingButton';

const resolveImg = (src, fallback) => resolveImageUrl(src, fallback);

export default function BlogIndex({ blogs: propBlogs, filters }) {
  const [store] = useStore();
  const settings = store.settings || {};
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  const rawBlogs = propBlogs?.data || propBlogs || store.blogs || [];
  const filteredBlogs = rawBlogs.filter((b) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return b.title?.toLowerCase().includes(term) || b.meta_description?.toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">
      <Head title={`Vlogs & Writing Board Care Guides | ${settings.site_name || 'Shaw Enterprise'} Kolkata`} />

      {/* Standard E-Commerce Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenEnquiry={() => setIsQuoteModalOpen(true)}
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Factory Insights & Technical Guides
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-2">
            Shaw Enterprise Vlogs & Buying Guides
          </h1>
          <p className="mt-3 text-slate-300 text-sm leading-relaxed">
            Direct tips on whiteboard surface care, ceramic vs non-magnetic comparisons, classroom mounting tutorials, and factory workshop videos.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-xl mx-auto flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guides, whiteboard maintenance, or vlogs..."
              className="flex-1 px-4 py-3 rounded-xl text-slate-900 text-xs sm:text-sm bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="bg-slate-800 text-white px-4 rounded-xl text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Articles & Vlogs Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((item) => (
              <Link
                key={item.id}
                href={`/blogs/${item.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={resolveImg(item.thumbnail_image)}
                    alt={item.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.video_url && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                      <span>▶</span> VLOG VIDEO
                    </span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 font-bold mb-2 uppercase tracking-wider">
                      {new Date(item.published_at || item.created_at || Date.now()).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} • {item.reading_time || 4} min read
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                      {item.meta_description || 'Technical deep dive from the production team at Shaw Enterprise, Kolkata.'}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-900">
                    <span>Read Guide / Watch Video</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto">
            <span className="text-4xl block mb-2">📹</span>
            <p className="text-slate-700 font-bold text-sm">No articles matched your search query.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-3 inline-block text-xs font-bold text-blue-900 underline"
            >
              Clear Search & View All
            </button>
          </div>
        )}
      </main>

      {/* Comprehensive Market-Standard Footer */}
      <Footer
        onOpenCustomSize={() => setIsCustomSizeOpen(true)}
        onOpenBrochure={() => setIsBrochureOpen(true)}
        onOpenEnquiry={() => setIsQuoteModalOpen(true)}
      />

      {/* Modals & Drawers */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <BulkQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        product={store.products?.[0]}
      />
      <CustomSizeModal isOpen={isCustomSizeOpen} onClose={() => setIsCustomSizeOpen(false)} />
      <BrochureModal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)} />
      <WhatsAppFloatingButton />
    </div>
  );
}
