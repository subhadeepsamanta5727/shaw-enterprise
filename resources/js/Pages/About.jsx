import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useStore } from '../store';
import { resolveImageUrl } from '../services/api';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import CartDrawer from '../Components/CartDrawer';
import BulkQuoteModal from '../Components/BulkQuoteModal';
import CustomSizeModal from '../Components/CustomSizeModal';
import BrochureModal from '../Components/BrochureModal';
import WhatsAppFloatingButton from '../Components/WhatsAppFloatingButton';

const resolveImg = (src, fallback = 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80') =>
  resolveImageUrl(src, fallback);

export default function About() {
  const [store] = useStore();
  const settings = store.settings || {};
  const aboutHome = settings.sections?.about_home || {};
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">
      <Head title={`About Us | ${settings.site_name || 'Shaw Enterprise'} - Kolkata Writing Board Manufacturer`} />

      {/* Standard E-Commerce Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenEnquiry={() => setIsQuoteModalOpen(true)}
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Established 2014 • College Street, Kolkata
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-2">
            About Shaw Enterprise
          </h1>
          <p className="mt-3 text-slate-300 text-sm leading-relaxed">
            Leading Kolkata manufacturer, wholesaler, and retailer of whiteboards, ceramic green chalkboards, display systems, mobile stands, and educational accessories.
          </p>
        </div>
      </div>

      {/* Main Story & Credentials */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="inline-block bg-blue-100 text-blue-900 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              {aboutHome.badge || '12+ Years of Manufacturing Excellence'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {aboutHome.title || 'Transforming Classrooms, Offices & Coaching Institutes Since 2014'}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {aboutHome.p1 || 'Founded in 2014 by Mr. Indrajit Shaw, Shaw Enterprise started with a mission: to manufacture high-grade writing and display surfaces that eliminate marker ghosting, frame warping, and chalk glare.'}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              {aboutHome.p2 || 'Operating our registered office at 44/1B, Beniatola Lane, College Street, and our manufacturing workshop at Balagarh Industrial (Suryapur, Navarand, Kolkata – 700121), we serve thousands of schools, universities, competitive coaching centres, corporate offices, and home learners with direct factory rates.'}
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="border border-slate-200 bg-white p-4 rounded-xl text-center shadow-sm">
                <span className="text-2xl font-black text-blue-900 block">{aboutHome.stats?.[1]?.value || '50,000+'}</span>
                <span className="text-[11px] text-slate-500 font-medium">{aboutHome.stats?.[1]?.label || 'Boards Delivered'}</span>
              </div>
              <div className="border border-slate-200 bg-white p-4 rounded-xl text-center shadow-sm">
                <span className="text-2xl font-black text-blue-900 block">{aboutHome.stats?.[2]?.value || '1,200+'}</span>
                <span className="text-[11px] text-slate-500 font-medium">{aboutHome.stats?.[2]?.label || 'Institutions Served'}</span>
              </div>
              <div className="border border-slate-200 bg-white p-4 rounded-xl text-center shadow-sm">
                <span className="text-2xl font-black text-amber-500 block">{aboutHome.stats?.[3]?.value || '4.9 ★'}</span>
                <span className="text-[11px] text-slate-500 font-medium">{aboutHome.stats?.[3]?.label || 'Customer Rating'}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-video lg:aspect-square flex items-center justify-center">
              <img
                src={resolveImg(aboutHome.image)}
                alt="Shaw Enterprise Workshop Manufacturing"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>
            <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:-left-6 bg-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-xl max-w-xs border border-slate-800">
              <span className="text-amber-400 font-mono text-xs block mb-1">FOUNDED 2014</span>
              <strong className="text-base text-white block">Shaw Enterprise</strong>
              <p className="text-slate-400 text-xs mt-1">
                "Direct manufacturer quality without the middleman markups."
              </p>
            </div>
          </div>
        </div>

        {/* Manufacturing Highlights */}
        <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl space-y-8">
          <div className="max-w-2xl">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              Engineering & Build Quality
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">
              Why Institutional Buyers Rely On Shaw Enterprise
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Unlike cheap commercial boards that scratch within weeks or warp under humidity, our boards are engineered for decade-long heavy usage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60">
              <span className="text-2xl block mb-2">⚙️</span>
              <h3 className="text-sm font-bold text-white mb-2">Precision Manufacturing</h3>
              <p className="text-slate-300 leading-relaxed">
                We utilize virgin 6063-T6 alloy extrusion frames and high-density moisture-resistant core boards to ensure our writing boards remain 100% warp-free during humid Kolkata monsoons.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60">
              <span className="text-2xl block mb-2">🛡️</span>
              <h3 className="text-sm font-bold text-white mb-2">100% Quality Inspection</h3>
              <p className="text-slate-300 leading-relaxed">
                Every board is tested for marker erasability, scratch resistance, and magnetic adhesion before packaging. We guarantee zero marker ghosting and effortless dry wipe.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60">
              <span className="text-2xl block mb-2">📦</span>
              <h3 className="text-sm font-bold text-white mb-2">Heavy Batten Packaging</h3>
              <p className="text-slate-300 leading-relaxed">
                Orders are packed in multi-layer bubble wrap and reinforced with wooden corner battens, ensuring transit safety whether delivering in College Street or across India.
              </p>
            </div>
          </div>
        </div>

        {/* Corporate Address & Map Info */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-black text-blue-900 uppercase tracking-widest block mb-1">
                📍 Registered Office
              </span>
              <p className="text-slate-700 text-sm font-medium leading-relaxed">
                {settings.registered_office_address || settings.address || '44/1B, Beniatola Lane (College Street), Kolkata – 700009, W.B'}
              </p>
            </div>
            <div>
              <span className="text-xs font-black text-amber-600 uppercase tracking-widest block mb-1">
                🏭 Workshop / Factory
              </span>
              <p className="text-slate-700 text-sm font-medium leading-relaxed">
                {settings.workshop_address || 'Balagarh Industrial, Suryapur, Navarand, Kolkata – 700121'}
              </p>
            </div>
            <div className="pt-2 text-xs font-mono text-slate-500 space-y-1 border-t border-slate-100">
              <div>GSTIN: <span className="font-bold text-slate-900">{settings.gst_number || '19AAIFS4821N1ZM'}</span></div>
            </div>
          </div>

          <div>
            <span className="text-xs font-black text-blue-900 uppercase tracking-widest block mb-2">
              Direct Contact Hotlines
            </span>
            <h3 className="text-xl font-black text-slate-900 mb-2">Talk to the Factory</h3>
            <div className="space-y-2 text-sm text-slate-700">
              <div>📞 Primary: <a href={`tel:${settings.phone}`} className="font-bold text-blue-900 hover:underline">{settings.phone}</a></div>
              <div>📱 Secondary: <a href={`tel:${settings.phone_secondary}`} className="font-bold text-blue-900 hover:underline">{settings.phone_secondary}</a></div>
              <div>✉️ Email: <a href={`mailto:${settings.email}`} className="font-bold text-blue-900 hover:underline">{settings.email}</a></div>
              <div>💬 WhatsApp: <a href={`https://wa.me/${(settings.whatsapp || '9933944007').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="font-bold text-emerald-600 hover:underline">+91 9933944007</a></div>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-1">
                Custom Orders & Wholesale
              </span>
              <p className="text-slate-600 text-xs">
                Need customized dimensions, green chalkboard + whiteboard combinations, or bulk institutional delivery?
              </p>
            </div>
            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={() => setIsCustomSizeOpen(true)}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-xl shadow transition"
              >
                📐 Calculate Custom Board Price
              </button>
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow transition uppercase"
              >
                Request Institutional Quote
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Comprehensive Market-Standard Footer */}
      <Footer
        onOpenCustomSize={() => setIsCustomSizeOpen(true)}
        onOpenBrochure={() => setIsBrochureOpen(true)}
        onOpenEnquiry={() => setIsQuoteModalOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Custom Size Modal */}
      <CustomSizeModal isOpen={isCustomSizeOpen} onClose={() => setIsCustomSizeOpen(false)} />

      {/* Brochure / Catalog Modal */}
      <BrochureModal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)} />

      {/* Wholesale Quote Modal */}
      <BulkQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        product={store.products?.[0]}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton />
    </div>
  );
}
