import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';

import Home from './Pages/Home';
import About from './Pages/About';
import ProductIndex from './Pages/Products/Index';
import ProductShow from './Pages/Products/Show';
import BlogIndex from './Pages/Blog/Index';
import BlogShow from './Pages/Blog/Show';
import AdminLogin from './Pages/Admin/Login';
import AdminDashboard from './Pages/Admin/Dashboard';
import LegalPolicy from './Pages/LegalPolicy';
import ImagesPage from './Pages/Images';
import ClientsPage from './Pages/Clients';
import CartPage from './Pages/Cart';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import BulkQuoteModal from './Components/BulkQuoteModal';
import CustomSizeModal from './Components/CustomSizeModal';
import BrochureModal from './Components/BrochureModal';
import WhatsAppFloatingButton from './Components/WhatsAppFloatingButton';

import { useStore, addInquiry } from './store';

// Register global RFQ handler for BulkQuoteModal
window.__addInquiry = (inquiryData) => {
  return addInquiry(inquiryData);
};

function ContactPage() {
  const [store] = useStore();
  const settings = store.settings || {};
  const [submitted, setSubmitted] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  const [formData, setFormData] = useState({
    orgName: '',
    contactPerson: '',
    phone: '',
    email: '',
    reqType: 'General Inquiries & Retail Orders',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addInquiry({
      organization_name: formData.orgName || 'Retail Customer',
      client_name: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      product_title: formData.reqType,
      variant_details: 'Storefront Contact Form',
      message: formData.message,
      quantity: 1,
      delivery_city: 'Kolkata',
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Standard E-Commerce Navbar */}
      <Navbar
        onOpenEnquiry={() => setIsQuoteModalOpen(true)}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Location Card */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-8 shadow-xl space-y-6">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">
                Works & Showroom
              </span>
              <h2 className="text-2xl font-black mt-1">{settings.site_name || 'Shaw Enterprise'}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Manufacturer, Exporter & Wholesaler of Educational & Office Equipment since {settings.established_year || '2014'}.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-base">📍</span>
                <div>
                  <strong className="block text-white font-bold">Registered Office Address</strong>
                  <span className="text-slate-300 leading-relaxed block mt-0.5">
                    {settings.registered_office_address || settings.address || '44/1B, Beniatola Lane (College Street), Kolkata – 700009, W.B'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-base">🏭</span>
                <div>
                  <strong className="block text-white font-bold">Workshop Address</strong>
                  <span className="text-slate-300 leading-relaxed block mt-0.5">
                    {settings.workshop_address || 'Balagarh Industrial, Suryapur, Navarand, Kolkata – 700121'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-base">📞</span>
                <div>
                  <strong className="block text-white font-bold">Hotlines & WhatsApp</strong>
                  <span className="text-slate-300 block">{settings.phone}</span>
                  <span className="text-slate-400 block">{settings.phone_secondary}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-base">✉️</span>
                <div>
                  <strong className="block text-white font-bold">Official Email</strong>
                  <span className="text-slate-300 block">{settings.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <a
                href={`https://wa.me/${settings.whatsapp?.replace(/[^0-9]/g, '')}?text=Hello%20Shaw%20Enterprise,%20I%20have%20an%20inquiry%20regarding%20writing%20boards.`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
              >
                <span>💬 Chat on WhatsApp Directly</span>
              </a>
            </div>
          </div>

          {/* Contact & Inquiries Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Get in Touch
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1 mb-2">
              Send us a Message or Inquiry
            </h1>
            <p className="text-xs text-slate-500 mb-6">
              Ask about product sizes, custom board dimensions, bulk discounts, or home delivery in Kolkata.
            </p>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-4xl text-emerald-600 font-bold block mb-2">✓</span>
                <h3 className="text-lg font-bold text-emerald-900">Message Received!</h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Thank you for reaching out. Our College Street team will reply within 2 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="e.g. Subrata Paul"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98300 XXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@email.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">School / Company / Coaching (Optional)</label>
                    <input
                      type="text"
                      value={formData.orgName}
                      onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                      placeholder="e.g. Tutorial Academy"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message or Required Products *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Specify board sizes, stand requirements, delivery area in Kolkata, or any questions..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-black py-3 rounded-xl transition shadow text-xs uppercase tracking-wider"
                >
                  Send Message Now →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      {/* Comprehensive Market-Standard Footer */}
      <Footer
        onOpenCustomSize={() => setIsCustomSizeOpen(true)}
        onOpenBrochure={() => setIsBrochureOpen(true)}
        onOpenEnquiry={() => setIsQuoteModalOpen(true)}
      />

      {/* Bulk Quote Modal */}
      <BulkQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        product={store.products?.[0]}
      />

      {/* Custom Size Modal */}
      <CustomSizeModal isOpen={isCustomSizeOpen} onClose={() => setIsCustomSizeOpen(false)} />

      {/* Digital Catalog Modal */}
      <BrochureModal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)} />

      <WhatsAppFloatingButton />
    </div>
  );
}

function App() {
  const [store] = useStore();
  const [currentPath, setCurrentPath] = useState(window.location.pathname + window.location.search);

  useEffect(() => {
    const scrollToHash = (hashStr) => {
      if (!hashStr) return;
      const targetId = hashStr.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    };

    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
      if (window.location.hash) {
        scrollToHash(window.location.hash);
      } else {
        window.scrollTo(0, 0);
      }
    };

    window.__navigate = (path) => {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      if (path.includes('#')) {
        const hash = path.substring(path.indexOf('#'));
        scrollToHash(hash);
      } else {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('popstate', handlePopState);
    if (window.location.hash) {
      scrollToHash(window.location.hash);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const [pathnameRaw, search] = currentPath.split('?');
  const pathname = (pathnameRaw.split('#')[0] || '/').replace(/\/$/, '') || '/';
  const searchParams = new URLSearchParams(search || '');

  // ROUTE: Admin Login
  if (pathname === '/admin/login') {
    return <AdminLogin onLoginSuccess={() => window.__navigate('/admin/dashboard')} />;
  }

  // ROUTE: Admin Hub / Dashboard
  if (pathname === '/admin' || pathname === '/admin/dashboard' || pathname.startsWith('/admin/')) {
    if (!store.isAuthenticated) {
      return <AdminLogin onLoginSuccess={() => window.__navigate('/admin/dashboard')} />;
    }
    return <AdminDashboard />;
  }

  // ROUTE: Privacy Policy
  if (pathname === '/privacy-policy') {
    return <LegalPolicy initialTab="privacy-policy" />;
  }

  // ROUTE: Terms & Conditions
  if (pathname === '/terms-conditions' || pathname === '/terms' || pathname === '/terms-and-conditions') {
    return <LegalPolicy initialTab="terms-conditions" />;
  }

  // ROUTE: Disclaimer
  if (pathname === '/disclaimer') {
    return <LegalPolicy initialTab="disclaimer" />;
  }

  // ROUTE: Payment Policy
  if (pathname === '/payment-policy') {
    return <LegalPolicy initialTab="payment-policy" />;
  }

  // ROUTE: Our Clients
  if (pathname === '/clients' || pathname === '/our-clients') {
    return <ClientsPage />;
  }

  // ROUTE: Shopping Cart
  if (pathname === '/cart') {
    return <CartPage />;
  }

  // ROUTE: High-Resolution Product & Workshop Images
  if (pathname === '/images' || pathname === '/gallery') {
    return <ImagesPage />;
  }

  // ROUTE: Testimonials Shortcut
  if (pathname === '/testimonials') {
    setTimeout(() => {
      const el = document.getElementById('testimonials');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
    return <Home />;
  }

  // ROUTE 1: Home
  if (pathname === '/' || pathname === '') {
    return <Home />;
  }

  // ROUTE: About Us (/about)
  if (pathname === '/about' || pathname === '/about-us') {
    return <About />;
  }

  // ROUTE 2: Products List (/products)
  if (pathname === '/products') {
    return <ProductIndex filters={{ category: searchParams.get('category'), search: searchParams.get('search') }} />;
  }

  // ROUTE 3: Product Detail (/products/:slug)
  if (pathname.startsWith('/products/')) {
    const slug = pathname.replace('/products/', '').replace(/\/$/, '');
    const product = store.products.find((p) => p.slug === slug) || store.products[0];
    const relatedProducts = store.products.filter((p) => p.id !== product.id).slice(0, 4);

    return <ProductShow product={product} relatedProducts={relatedProducts} />;
  }

  // ROUTE 4: Blogs List (/blogs)
  if (pathname === '/blogs') {
    const searchFilter = (searchParams.get('search') || '').toLowerCase();
    let filtered = store.blogs;
    if (searchFilter) {
      filtered = filtered.filter(
        (b) =>
          b.title?.toLowerCase().includes(searchFilter) ||
          b.content?.toLowerCase().includes(searchFilter)
      );
    }

    return <BlogIndex blogs={{ data: filtered }} filters={{ search: searchFilter }} />;
  }

  // ROUTE 5: Blog Detail (/blogs/:slug)
  if (pathname.startsWith('/blogs/')) {
    const slug = pathname.replace('/blogs/', '').replace(/\/$/, '');
    const blog = store.blogs.find((b) => b.slug === slug) || store.blogs[0];
    const relatedBlogs = store.blogs.filter((b) => b.id !== blog.id).slice(0, 3);

    return <BlogShow blog={blog} relatedBlogs={relatedBlogs} />;
  }

  // ROUTE 6: Contact (/contact)
  if (pathname.startsWith('/contact')) {
    return <ContactPage />;
  }

  // Fallback -> Home
  return <Home />;
}

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
