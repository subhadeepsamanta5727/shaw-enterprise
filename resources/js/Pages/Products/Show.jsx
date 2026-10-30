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

export default function ProductShow({ product, relatedProducts = [] }) {
  const [store] = useStore();
  const settings = store.settings || {};
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [inquiryDetails, setInquiryDetails] = useState({ name: '', address: '' });

  // Variant selector
  const defaultVar = product.variants?.find((v) => v.is_default) || product.variants?.[0] || null;
  const [selectedVariant, setSelectedVariant] = useState(defaultVar);
  const [activeImage, setActiveImage] = useState(product.main_image);

  const currentPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.base_price);
  const currentMrp = selectedVariant?.mrp || product.mrp || Math.round(currentPrice * 1.3);
  const discountPercent = Math.round(((currentMrp - currentPrice) / currentMrp) * 100);

  const handleInquirySubmit = (event) => {
    event.preventDefault();
    const whatsappNumber = (settings.whatsapp || '9933944007').replace(/\D/g, '');
    const message = [
      'Hello Shaw Enterprise, I am interested in this product:',
      `Product: ${product.title}`,
      selectedVariant ? `Size: ${selectedVariant.size_label || selectedVariant.name}` : null,
      `Name: ${inquiryDetails.name}`,
      `Address: ${inquiryDetails.address}`,
    ].filter(Boolean).join('\n');

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setIsInquiryModalOpen(false);
  };

  const allImages = [
    product.main_image,
    ...(product.images ? product.images : []),
  ].filter((image, index, images) => image && images.indexOf(image) === index);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">
      <Head>
        <title>{product.meta_title || `${product.title} | ${settings.site_name || 'Shaw Enterprise'}`}</title>
        <meta name="description" content={product.meta_description || product.short_description} />
      </Head>

      {/* Standard E-Commerce Navbar */}
      <Navbar
        onOpenEnquiry={() => setIsQuoteModalOpen(true)}
      />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 text-xs py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-slate-500">
          <Link href="/" className="hover:text-blue-900">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-900">Products</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-blue-900">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-slate-900 font-bold truncate">{product.title}</span>
        </div>
      </div>

      {/* Product Detail Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl aspect-square overflow-hidden relative shadow-sm flex items-center justify-center p-6">
              <img
                src={resolveImg(activeImage)}
                alt={product.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-contain"
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-emerald-600 text-white font-black text-xs px-2.5 py-1 rounded-lg uppercase shadow">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-white transition ${
                      activeImage === img ? 'border-blue-900 ring-2 ring-blue-900/20' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={resolveImg(img)}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees Box */}
            <div className="bg-slate-100 p-4 rounded-xl space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span>🛡️</span>
                <span>Direct College Street Manufacturer Warranty</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Fabricated with high-tensile 6063-T6 alloy extruded frames and high-density waterproof backing. Zero ghosting guarantee.
              </p>
            </div>
          </div>

          {/* Right Product Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
                <span>{product.category?.name || 'Writing Boards'}</span>
                <span>•</span>
                <span className="text-slate-500">SKU: {selectedVariant?.sku || product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {product.title}
              </h1>

              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  <span>★★★★★</span>
                  <span className="text-slate-600 text-xs font-bold ml-1">4.9 / 5 (Verified Reviews)</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-700 font-bold text-xs">In Stock (Kolkata Works)</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-950">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {currentMrp > currentPrice && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      ₹{currentMrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Save ₹{(currentMrp - currentPrice).toLocaleString('en-IN')} ({discountPercent}%)
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Inclusive of all taxes. GST Invoice provided for institutional input credit.
              </p>
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    Select Dimension / Size:
                  </label>
                  <button
                    onClick={() => setIsCustomSizeOpen(true)}
                    className="text-xs text-blue-900 font-bold hover:underline"
                  >
                    📐 Need Custom Dimensions?
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`p-3 rounded-xl border text-left transition ${
                          isSelected
                            ? 'border-blue-900 bg-blue-50/50 ring-2 ring-blue-900'
                            : 'border-slate-200 bg-white hover:border-slate-400'
                        }`}
                      >
                        <div className="font-bold text-xs text-slate-900">{v.size_label || v.name}</div>
                        <div className="text-xs font-black text-blue-900 mt-1">
                          ₹{Number(v.price).toLocaleString('en-IN')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="prose prose-sm text-slate-600 max-w-none">
              <p>{product.short_description}</p>
              {(product.full_description || product.description) && (
                <div
                  className="mt-4 text-xs leading-relaxed space-y-2"
                  dangerouslySetInnerHTML={{ __html: product.full_description || product.description }}
                />
              )}
            </div>

            {/* Bulk Quote */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="w-full bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5"
              >
                <span>Inquiry</span>
              </button>
            </div>

            {/* Specifications Table */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Product Specifications
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  {product.specifications.map((spec, i) => (
                    <div
                      key={i}
                      className={`grid grid-cols-3 p-3 ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                    >
                      <span className="font-bold text-slate-600">{spec.spec_key}</span>
                      <span className="col-span-2 text-slate-900 font-semibold">{spec.spec_value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

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
        product={product}
        selectedVariant={selectedVariant}
      />

      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-inquiry-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="product-inquiry-title" className="text-lg font-black text-slate-900">
                  Product Inquiry
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Share your details and continue to WhatsApp.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInquiryModalOpen(false)}
                className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close inquiry form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label htmlFor="inquiry-name" className="mb-1 block text-xs font-bold text-slate-700">
                  Name
                </label>
                <input
                  id="inquiry-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={inquiryDetails.name}
                  onChange={(event) => setInquiryDetails({ ...inquiryDetails, name: event.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>
              <div>
                <label htmlFor="inquiry-address" className="mb-1 block text-xs font-bold text-slate-700">
                  Address
                </label>
                <textarea
                  id="inquiry-address"
                  required
                  autoComplete="street-address"
                  rows={3}
                  value={inquiryDetails.address}
                  onChange={(event) => setInquiryDetails({ ...inquiryDetails, address: event.target.value })}
                  className="w-full resize-y rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsInquiryModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Send to WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Size Modal */}
      <CustomSizeModal isOpen={isCustomSizeOpen} onClose={() => setIsCustomSizeOpen(false)} />

      {/* Brochure / Catalog Modal */}
      <BrochureModal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)} />

      {/* WhatsApp Floating Button */}
      <WhatsAppFloatingButton />
    </div>
  );
}
