import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useStore } from '../store';
import { resolveImageUrl } from '../services/api';

const resolveImg = (src, fallback = '') => resolveImageUrl(src, fallback);

export default function Navbar({ onOpenEnquiry }) {
  const [store] = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const settings = store.settings || {};
  const logoSrc = settings.logo_url || settings.site_logo || settings.logo;

  const currentPath = window.location.pathname;

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-1.5 sm:py-2 border-b border-slate-800 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-1.5 sm:gap-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-amber-400">📍</span> Regd. Office: {settings.registered_office_address?.split('(')[0]?.trim() || '44/1B, Beniatola Lane'}, College Street
            </span>
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:flex items-center gap-1.5 font-medium">
              <span className="text-amber-400">🏭</span> Workshop: Balagarh Industrial, Kolkata
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1.5 font-medium">
              <span className="text-amber-400">📞</span> Call / WhatsApp: {settings.phone || '+91 9933944007'}
            </span>
          </div>

          <div className="flex items-center justify-center">
            <span className="text-amber-400 font-bold hidden sm:inline">
              {settings.announcement_text || '🚚 Free Delivery in Kolkata on orders > ₹1,999'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Corporate E-Commerce Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm font-sans">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center min-w-0">
            {logoSrc ? (
              <img
                src={resolveImg(logoSrc)}
                alt={settings.site_name || 'Shaw Enterprise'}
                className="h-10 sm:h-14 max-h-14 max-w-[180px] sm:max-w-[280px] object-contain py-0.5 sm:py-1"
              />
            ) : (
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-900 rounded-xl flex items-center justify-center text-white font-black text-xl sm:text-2xl tracking-tighter shadow-md flex-shrink-0">
                  SE
                </div>
                <div className="min-w-0">
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 uppercase block leading-none truncate">
                    {settings.site_name || 'Shaw Enterprise'}
                  </span>
                  <span className="block text-[9px] sm:text-[10px] font-bold text-blue-900 uppercase tracking-widest mt-0.5 sm:mt-1 truncate">
                    Writing Boards • Kolkata
                  </span>
                </div>
              </div>
            )}
          </Link>

          {/* Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-wider text-slate-700">
            <Link
              href="/"
              className={`transition py-1 ${
                currentPath === '/' ? 'text-blue-900 border-b-2 border-blue-900' : 'hover:text-blue-900'
              }`}
            >
              HOME
            </Link>

            <Link
              href="/about"
              className={`transition py-1 ${
                currentPath === '/about' ? 'text-blue-900 border-b-2 border-blue-900' : 'hover:text-blue-900'
              }`}
            >
              ABOUT US
            </Link>

            <Link
              href="/products"
              className={`transition py-1 ${
                currentPath === '/products' || currentPath.startsWith('/products/')
                  ? 'text-blue-900 border-b-2 border-blue-900'
                  : 'hover:text-blue-900'
              }`}
            >
              PRODUCTS
            </Link>

            <button
              type="button"
              onClick={onOpenEnquiry}
              className="hover:text-blue-900 transition py-1 text-slate-700 uppercase tracking-wider font-black"
            >
              ENQUIRY
            </button>

            <Link
              href="/contact"
              className={`transition py-1 ${
                currentPath === '/contact' ? 'text-blue-900 border-b-2 border-blue-900' : 'hover:text-blue-900'
              }`}
            >
              CONTACT US
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-slate-700 hover:text-blue-900 p-2 text-2xl font-bold flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-1 text-xs font-black uppercase tracking-wider shadow-2xl animate-fade-in max-h-[calc(100dvh-5rem)] overflow-y-auto">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition ${
                currentPath === '/' ? 'bg-blue-50 text-blue-900' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">🏠</span>
              <span>HOME</span>
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition ${
                currentPath === '/about' ? 'bg-blue-50 text-blue-900' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">🏭</span>
              <span>ABOUT US</span>
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition ${
                currentPath.startsWith('/products') ? 'bg-blue-50 text-blue-900' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">📋</span>
              <span>PRODUCTS</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenEnquiry) onOpenEnquiry();
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-800 hover:bg-slate-50 uppercase font-black text-left"
            >
              <span className="text-base">💬</span>
              <span>ENQUIRY</span>
            </button>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition ${
                currentPath === '/contact' ? 'bg-blue-50 text-blue-900' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">📍</span>
              <span>CONTACT US</span>
            </Link>

            {/* Quick Contact Hotlines in Mobile Menu */}
            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2 normal-case font-medium">
              <a
                href={`tel:${settings.phone || '+919933944007'}`}
                className="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                <span>📞 Call Works: {settings.phone || '+91 9933944007'}</span>
              </a>
              <a
                href={`https://wa.me/${(settings.whatsapp || '9933944007').replace(/[^0-9]/g, '')}?text=Hello%20Shaw%20Enterprise,%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                <span>💬 WhatsApp Factory Desk</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
