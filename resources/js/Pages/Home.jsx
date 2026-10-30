import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useStore } from '../store';
import { resolveImageUrl } from '../services/api';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import BulkQuoteModal from '../Components/BulkQuoteModal';
import CustomSizeModal from '../Components/CustomSizeModal';

export default function Home() {
  const [store] = useStore();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState(null);

  const settings = store.settings || {};
  const categories = store.categories || [];
  const products = store.products || [];
  const clients = store.clients || [];
  const testimonials = store.testimonials || [];
  const blogs = store.blogs || [];
  // Section contents & uploaded images configured by Admin
  const hero = settings.sections?.hero || {
    badge: `📍 Regd. Office: ${settings.registered_office_address?.split('(')[0]?.trim() || settings.address?.split(',')[0] || '44/1B, Beniatola Lane'}, College Street • Est. ${settings.established_year || '2014'}`,
    title: "Kolkata's Premier Manufacturer of Writing Boards & Display Systems",
    description: `Manufactured by ${settings.site_name || 'Shaw Enterprise'} with 100% ghost-free surfaces and virgin 6063-T6 aluminium frames. Direct factory rates for retail, schools, coaching institutes & offices.`,
    btn_primary_text: 'Shop Products Online →',
    btn_secondary_text: '📐 Custom Size Calculator',
    image: settings.hero_banner_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    badge_featured_title: 'Popular in Kolkata',
    badge_featured_sub: 'Shaw 3x2 Magnetic Whiteboard',
    badge_featured_price: '₹1,099',
  };

  const features = settings.sections?.features || [
    { id: 1, icon: '🏭', title: 'College Street Works', subtitle: 'Direct factory manufacture' },
    { id: 2, icon: '🚚', title: 'Safe Wooden Packaging', subtitle: 'Reinforced corner battens' },
    { id: 3, icon: '📱', title: 'UPI / Cards / COD', subtitle: 'Instant QR scan or Cash on Delivery' },
    { id: 4, icon: '📄', title: 'GST Tax Invoices', subtitle: `GSTIN: ${settings.gst_number || '19AAIFS4821N1ZM'}` },
  ];

  const aboutHome = settings.sections?.about_home || {
    badge: 'About Shaw Enterprise',
    title: '10+ Years of Manufacturing Excellence at College Street',
    p1: `Founded in 2014, ${settings.site_name || 'Shaw Enterprise'} has established itself as one of West Bengal's leading manufacturers, wholesalers, and retailers of writing boards, display bulletin systems, mobile stands, and school accessories.`,
    p2: `Operating our registered office at ${settings.registered_office_address || settings.address || '44/1B, Beniatola Lane, College Street, Kolkata – 700009'} with our manufacturing workshop at ${settings.workshop_address || 'Balagarh Industrial, Suryapur, Navarand, Kolkata – 700121'}, we supply both individual students and renowned institutions including Presidency University, Calcutta University, St. Xavier\'s, and South Point with precision-engineered products.`,
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    stats: [
      { id: 1, value: settings.established_year || '2014', label: 'Year Established', sub: 'College Street, Kolkata' },
      { id: 2, value: '25-Yr', label: 'Surface Warranty', sub: 'On Ceramic Green Boards' },
      { id: 3, value: '50,000+', label: 'Boards Manufactured', sub: 'Delivered Pan-India' },
      { id: 4, value: '100%', label: 'Genuine Virgin Alloy', sub: 'Alloy 6063-T6 Frames' },
    ],
  };

  const customSizeBanner = settings.sections?.custom_size_banner || {
    badge: 'Need a Custom Non-Standard Size?',
    title: 'We Custom-Cut & Fabricate Any Board Dimension within 24 Hours',
    description: 'From compact 1.5x1 ft study pads to 12x4 ft continuous auditorium ceramic boards, our College Street facility fabricates to your exact specifications.',
    btn_text: 'Open Custom Size Calculator →',
  };

  const resolveImg = (src, fallback) => resolveImageUrl(src, fallback);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">
      <Head title={`${settings.site_name || 'Shaw Enterprise'} | Writing Boards, Display Systems & Educational Accessories | Kolkata`} />

      {/* Standard E-Commerce Navbar */}
      <Navbar
        onOpenEnquiry={() => {
          setQuoteProduct(null);
          setIsQuoteModalOpen(true);
        }}
      />

      {/* Hero Banner Section (Configured & Uploaded by Admin) */}
      <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs font-bold">
                <span>{hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {hero.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {hero.description}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/products"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-xl transition uppercase tracking-wider text-center"
                >
                  {hero.btn_primary_text || 'Shop Products Online →'}
                </Link>

                <button
                  onClick={() => setIsCustomSizeOpen(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3.5 rounded-xl text-xs sm:text-sm border border-slate-700 transition flex items-center justify-center gap-2 text-center"
                >
                  <span>{hero.btn_secondary_text || '📐 Custom Size Calculator'}</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-white block">✓ 100% Ghost-Free</span>
                  <span className="text-slate-400 text-[11px]">Smooth dry erase</span>
                </div>
                <div>
                  <span className="font-bold text-white block">✓ Prompt Doorstep Dispatch</span>
                  <span className="text-slate-400 text-[11px]">Across Kolkata & Bengal</span>
                </div>
                <div>
                  <span className="font-bold text-white block">✓ Custom Sizes within 24h</span>
                  <span className="text-slate-400 text-[11px]">Cut to exact dimensions</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card (Admin Uploaded Image) */}
            <div className="lg:col-span-5 mt-4 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-white/20 shadow-2xl relative">
                <img
                  src={resolveImg(hero.image)}
                  alt={hero.title}
                  className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-700">
                  <div>
                    <span className="text-amber-400 text-[10px] sm:text-[11px] font-bold uppercase block">{hero.badge_featured_title || 'Popular in Kolkata'}</span>
                    <h4 className="text-white text-xs sm:text-sm font-bold">{hero.badge_featured_sub || 'Shaw 3x2 Magnetic Whiteboard'}</h4>
                    <span className="text-xs text-slate-300">{hero.badge_featured_price || '₹1,099'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Bar (Admin Editable) */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feat) => (
              <div key={feat.id} className="flex items-center justify-start sm:justify-center gap-3 p-2 bg-slate-50 sm:bg-transparent rounded-xl">
                <span className="text-2xl sm:text-3xl">{feat.icon}</span>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">{feat.title}</h4>
                  <p className="text-[11px] text-slate-500">{feat.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Shaw Enterprise Section (Admin Uploaded Image & Content) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                {aboutHome.badge || 'About Shaw Enterprise'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {aboutHome.title}
              </h2>
              <p>{aboutHome.p1}</p>
              <p>{aboutHome.p2}</p>
              <div className="pt-2 flex items-center gap-4">
                <Link
                  href="/about"
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
                >
                  Read Full Company Story →
                </Link>
                <button
                  onClick={() => setIsBrochureOpen(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 transition"
                >
                  Download Catalog
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              {/* Uploaded Workshop Image */}
              {aboutHome.image && (
                <div className="rounded-3xl overflow-hidden shadow-xl aspect-video border-2 border-slate-100 bg-slate-900">
                  <img
                    src={resolveImg(aboutHome.image)}
                    alt="Shaw Enterprise Workshop"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {(aboutHome.stats || []).map((st) => (
                  <div key={st.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-2xl sm:text-3xl font-black text-blue-900 block">{st.value}</span>
                    <span className="text-xs text-slate-700 font-bold mt-1 block">{st.label}</span>
                    <span className="text-[10px] text-slate-400 block">{st.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Grid */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Explore Our Product Lines
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Writing Boards, Display Systems & Accessories
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Browse our authentic categories matching the official Shaw Enterprise catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-900 shadow-sm hover:shadow-xl transition flex flex-col"
              >
                <div className="aspect-[16/10] bg-slate-200 overflow-hidden relative">
                  <img
                    src={resolveImg(cat.image)}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <h3 className="absolute bottom-3 left-4 text-base font-bold text-white group-hover:text-amber-400 transition">
                    {cat.name}
                  </h3>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 line-clamp-2">{cat.description}</p>
                  <span className="mt-3 text-xs font-bold text-blue-900 group-hover:text-blue-700 flex items-center gap-1">
                    Shop Products in Category →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Size Banner Callout (Admin Editable) */}
      <section className="py-12 bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              {customSizeBanner.badge}
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1">
              {customSizeBanner.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {customSizeBanner.description}
            </p>
          </div>
          <button
            onClick={() => setIsCustomSizeOpen(true)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider shadow-lg whitespace-nowrap transition"
          >
            {customSizeBanner.btn_text || 'Open Custom Size Calculator →'}
          </button>
        </div>
      </section>

      {/* Best-Selling Products Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Direct From Factory
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Featured Best-Sellers
              </h2>
            </div>
            <Link href="/products" className="text-xs font-bold text-blue-900 hover:text-blue-700">
              View All Catalog Items →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 9).map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <Link href={`/products/${prod.slug}`} className="block aspect-square bg-slate-50 overflow-hidden relative">
                    <img
                      src={resolveImg(prod.main_image)}
                      alt={prod.title}
                      className="w-full h-full object-contain p-4 hover:scale-105 transition duration-300"
                    />
                    {prod.discount_percent > 0 && (
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                        {prod.discount_percent}% OFF
                      </span>
                    )}
                  </Link>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>{prod.category?.name}</span>
                      <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-black text-[9px]">
                        SKU: {prod.sku}
                      </span>
                    </div>
                    <Link href={`/products/${prod.slug}`}>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5 hover:text-blue-900 transition line-clamp-2">
                        {prod.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1.5 mt-2 text-xs">
                      <span className="text-amber-500 font-bold">★ {prod.rating || 5.0}</span>
                      <span className="text-slate-400 text-[11px]">({prod.review_count || 15} reviews)</span>
                    </div>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-lg font-black text-slate-900">
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

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Clients & Patrons */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-6">
            Trusted by Prestigious Educational & Corporate Institutions Across Eastern India
          </span>
          <div className="client-marquee overflow-hidden">
            <div className="client-marquee-track flex w-max items-center gap-4 text-xs font-bold text-slate-700">
              {[...clients, ...clients].map((client, index) => (
                <div
                  key={`${client.id}-${index}`}
                  aria-hidden={index >= clients.length}
                  className="flex min-h-12 items-center justify-center whitespace-nowrap rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm"
                >
                  {client.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section id="testimonials" className="py-16 bg-slate-900 text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Client Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              What Kolkata Institutions & Buyers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="text-amber-400 text-sm mb-3">{'★'.repeat(t.rating || 5)}</div>
                  <blockquote className="text-xs text-slate-200 italic leading-relaxed">
                    "{t.review_text}"
                  </blockquote>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <strong className="block text-white text-xs">{t.client_name}</strong>
                  <span className="text-slate-400 text-[11px] block">{t.client_designation}</span>
                  <span className="text-amber-400 text-[11px] font-semibold block">{t.organization_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vlogs & Video Demonstrations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Videos & Demonstrations
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Product Vlogs & Maintenance Guides
              </h2>
            </div>
            <Link href="/blogs" className="text-xs font-bold text-blue-900 hover:text-blue-700">
              View All Guides →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <Link
                key={b.id}
                href={`/blogs/${b.slug}`}
                className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col sm:flex-row"
              >
                <div className="sm:w-48 aspect-video sm:aspect-auto bg-slate-200 overflow-hidden relative flex-shrink-0">
                  <img
                    src={resolveImageUrl(b.thumbnail_image)}
                    alt={b.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  {b.video_url && (
                    <span className="absolute bottom-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      ▶ Video
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {b.meta_description || 'Learn about writing board surfaces and cleaning hacks.'}
                    </p>
                  </div>
                  <span className="mt-3 text-xs font-bold text-blue-900">Read Guide / Watch Video →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Market-Standard Footer */}
      <Footer
        onOpenCustomSize={() => setIsCustomSizeOpen(true)}
      />

      {/* Custom Size Modal */}
      <CustomSizeModal isOpen={isCustomSizeOpen} onClose={() => setIsCustomSizeOpen(false)} />

      {/* Wholesale Quote Modal */}
      <BulkQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        product={quoteProduct || products[0]}
      />

    </div>
  );
}
