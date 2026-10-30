import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useStore } from '../store';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import CartDrawer from '../Components/CartDrawer';
import BulkQuoteModal from '../Components/BulkQuoteModal';
import CustomSizeModal from '../Components/CustomSizeModal';
import BrochureModal from '../Components/BrochureModal';
import WhatsAppFloatingButton from '../Components/WhatsAppFloatingButton';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'High-Gloss White Writing Board',
    category: 'writing-board',
    categoryName: 'Writing Boards',
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1000&q=80',
    description: 'Anodized aluminum alloy frame with high-gloss non-magnetic dry-erase surface and ABS safety corners.',
    specs: 'Available: 2x3 ft to 12x4 ft • Dual wall hanging clips',
  },
  {
    id: 2,
    title: 'Ceramic Green Chalk Writing Board',
    category: 'writing-board',
    categoryName: 'Writing Boards',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    description: 'Ultra-smooth matte green chalkboard surface engineered for zero-dust dispersion and high contrast chalk visibility.',
    specs: 'Heavy-duty backing • 25-Year surface durability',
  },
  {
    id: 3,
    title: 'Magnetic Toughened Glass Whiteboard',
    category: 'writing-board',
    categoryName: 'Writing Boards',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80',
    description: '4mm toughened safety float glass with steel receptive backing and stainless steel architectural standoffs.',
    specs: 'Frameless contemporary look • Never ghosts or stains',
  },
  {
    id: 4,
    title: 'Fabric Pin-Up Display Notice Board',
    category: 'display-notice-board',
    categoryName: 'Display Boards',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1000&q=80',
    description: 'High-density self-healing foam core laminated with premium blazer fabric in Royal Blue, Maroon, and Forest Green.',
    specs: 'Includes push pins • Concealed corner fixing',
  },
  {
    id: 5,
    title: 'Covered Lockable Notice Board',
    category: 'display-notice-board',
    categoryName: 'Display Boards',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80',
    description: 'Shatter-resistant acrylic transparent hinged or sliding door with cylindrical key lock for institution corridors.',
    specs: 'Protects documents from dust & tampering • Dual keys',
  },
  {
    id: 6,
    title: 'Heavy-Duty 4-Leg Mobile Whiteboard Stand',
    category: 'metal-stand',
    categoryName: 'Metal Stands',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
    description: 'MS powder-coated tubular steel frame equipped with 360° lockable nylon castor wheels and adjustable board clamps.',
    specs: 'Supports boards from 3x2 ft to 8x4 ft • Epoxy black finish',
  },
  {
    id: 7,
    title: '360° Revolving Dual-Side Whiteboard Stand',
    category: 'metal-stand',
    categoryName: 'Metal Stands',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    description: 'Center-pivoting double-sided whiteboard allowing seamless 360-degree rotation with positive locking pin.',
    specs: 'Whiteboard on front / Chalkboard on rear • Locking castors',
  },
  {
    id: 8,
    title: '6ft Beechwood Artist Studio Easel',
    category: 'wooden-product',
    categoryName: 'Wooden Products',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
    description: 'Seasoned natural hardwood construction with adjustable mast and brass-plated hardware for fine art and display.',
    specs: 'Folds flat for transport • Supports up to 50-inch canvases',
  },
  {
    id: 9,
    title: 'Acrylic Desk Elevator / Document Stand',
    category: 'acrylic-product',
    categoryName: 'Acrylic Products',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
    description: 'Crystal-clear 4mm cast virgin acrylic ergonomic writing elevator for executive desks, exams, and architects.',
    specs: 'Anti-slip silicone grips • Flame-polished diamond edges',
  },
  {
    id: 10,
    title: 'Acrylic T-Shape Table Menu Holder',
    category: 'acrylic-product',
    categoryName: 'Acrylic Products',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=80',
    description: 'Double-sided transparent menu stand with heavy acrylic base. Ideal for cafes, school offices, and banquet tables.',
    specs: 'Sizes: 4x6, 5x8, 6x9, 8.5x12 Inch • UV resistant acrylic',
  },
  {
    id: 11,
    title: 'Balagarh Industrial Workshop & Machine Works',
    category: 'workshop',
    categoryName: 'Workshop & Factory',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
    description: 'High-precision hydraulic board pressing, aluminum profile extrusion cutting, and substrate bonding machinery.',
    specs: 'Location: Balagarh Industrial, Suryapur, Kolkata – 700121',
  },
  {
    id: 12,
    title: 'College Street Showroom & Dispatch Hub',
    category: 'workshop',
    categoryName: 'Workshop & Factory',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    description: 'Our historic College Street retail counter and direct dispatch department serving Kolkata educational institutions.',
    specs: 'Location: 44/1B Beniatola Lane, College Street, Kolkata – 700009',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All Photos' },
  { id: 'writing-board', name: 'Writing Boards' },
  { id: 'display-notice-board', name: 'Display Boards' },
  { id: 'metal-stand', name: 'Metal Stands' },
  { id: 'wooden-product', name: 'Wooden Products' },
  { id: 'acrylic-product', name: 'Acrylic Products' },
  { id: 'workshop', name: 'Factory & Showroom' },
];

export default function ImagesPage() {
  const [store] = useStore();
  const settings = store.settings || {};

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  const filteredItems = activeFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">
      <Head title={`Product & Workshop Images | ${settings.site_name || 'Shaw Enterprise'} - Kolkata`} />

      {/* Standard Header */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenEnquiry={() => setIsQuoteModalOpen(true)}
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">
            High-Resolution Product & Workshop Gallery
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            Our Manufacturing & Product Images
          </h1>
          <p className="mt-3 text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Take a visual tour of our precision writing boards, mobile stands, acrylic fixtures, and Balagarh industrial production facilities.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 overflow-hidden transition duration-300 flex flex-col group cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              {/* Image Container with Zoom Effect */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5">
                    <span>🔍</span> Click to view full image
                  </span>
                </div>
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-400/30">
                  {item.categoryName}
                </span>
              </div>

              {/* Text Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="font-medium text-slate-400">{item.specs}</span>
                  <span className="text-blue-900 font-bold group-hover:underline">Zoom →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-slate-950 text-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[60vh] bg-black flex items-center justify-center">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-h-[60vh] w-auto max-w-full object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-800 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg border border-slate-700"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    {selectedImage.categoryName}
                  </span>
                  <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${(settings.whatsapp || '9933944007').replace(/[^0-9]/g, '')}?text=Hello%20Shaw%20Enterprise,%20I%20am%20interested%20in%20${encodeURIComponent(selectedImage.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                  >
                    <span>💬 Enquire on WhatsApp</span>
                  </a>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setIsQuoteModalOpen(true);
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow"
                  >
                    Get Quote
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedImage.description}
              </p>
              <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                <span className="text-amber-400">ℹ️</span>
                <span>{selectedImage.specs}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standard Footer */}
      <Footer
        onOpenCustomSize={() => setIsCustomSizeOpen(true)}
        onOpenBrochure={() => setIsBrochureOpen(true)}
        onOpenEnquiry={() => setIsQuoteModalOpen(true)}
      />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <BulkQuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
      <CustomSizeModal isOpen={isCustomSizeOpen} onClose={() => setIsCustomSizeOpen(false)} />
      <BrochureModal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)} />
      <WhatsAppFloatingButton />
    </div>
  );
}

