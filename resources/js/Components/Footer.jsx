import React from 'react';
import { Link } from '@inertiajs/react';
import { useStore } from '../store';
import { resolveImageUrl } from '../services/api';

const resolveImg = (src, fallback = '') => resolveImageUrl(src, fallback);

export default function Footer({ onOpenCustomSize }) {
  const [store] = useStore();
  const settings = store.settings || {};
  const logoSrc = settings.logo_url || settings.site_logo || settings.logo;
  const social = settings.social_links || {};
  const catalogUrl = resolveImg(settings.catalog_pdf_url, '');
  const twitterUrl = social.twitter || social.youtube;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand & Craftsmanship */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="inline-flex items-center">
              {logoSrc ? (
                <img src={resolveImg(logoSrc)} alt={settings.site_name} className="h-11 max-h-11 max-w-[200px] object-contain rounded py-0.5" />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-amber-400 rounded-lg flex items-center justify-center text-slate-950 font-black text-lg shadow-md">
                    SE
                  </div>
                  <div>
                    <span className="text-base font-black text-white uppercase block leading-none">
                      {settings.site_name || 'Shaw Enterprise'}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block mt-0.5">
                      Est. 2014 • Kolkata
                    </span>
                  </div>
                </div>
              )}
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed">
              Leading Kolkata manufacturer, wholesaler, and retailer of whiteboards, ceramic green chalkboards, display systems, mobile stands, and classroom furniture.
            </p>

            <div className="space-y-1.5 pt-2 text-[11px]">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-amber-400">🛡️</span>
                <span>ISO 9001:2015 Quality Adherence</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-amber-400">🏭</span>
                <span>Balagarh Industrial Manufacturing Works</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400 font-mono text-[10px]">
                <span>📄</span>
                <span>GSTIN: {settings.gst_number || '19AAIFS4821N1ZM'}</span>
              </div>
            </div>
          </div>

          {/* Col 2: E-Commerce Product Range */}
          <div className="space-y-2.5">
            <h4 className="text-white uppercase font-black text-xs tracking-wider border-b border-slate-800 pb-2">
              Our Products
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/products?category=writing-board" className="hover:text-amber-400 transition">
                  1. Writing Boards (White/Chalk/Glass)
                </Link>
              </li>
              <li>
                <Link href="/products?category=display-notice-board" className="hover:text-amber-400 transition">
                  2. Display & Notice Boards
                </Link>
              </li>
              <li>
                <Link href="/products?category=magnetic-writing-board" className="hover:text-amber-400 transition">
                  3. Magnetic Writing Boards
                </Link>
              </li>
              <li>
                <Link href="/products?category=graph-writing-board" className="hover:text-amber-400 transition">
                  4. Graph Writing Boards
                </Link>
              </li>
              <li>
                <Link href="/products?category=metal-stand" className="hover:text-amber-400 transition">
                  5. Metal & Revolving Stands
                </Link>
              </li>
              <li>
                <Link href="/products?category=wooden-product" className="hover:text-amber-400 transition">
                  6. Wooden Easels & Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=acrylic-product" className="hover:text-amber-400 transition">
                  7. Acrylic Desk & Display Stands
                </Link>
              </li>
              <li>
                <Link href="/products?category=box" className="hover:text-amber-400 transition">
                  8. Letter, First Aid & Key Boxes
                </Link>
              </li>
              <li>
                <Link href="/products?category=school-office-furniture" className="hover:text-amber-400 transition">
                  9. School & Office Furniture
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Useful Links */}
          <div className="space-y-2.5">
            <h4 className="text-white uppercase font-black text-xs tracking-wider border-b border-slate-800 pb-2">
              Useful Links
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="text-amber-400">🏠</span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="text-amber-400">🏢</span>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="text-rose-500">✍️</span>
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="text-amber-400">📞</span>
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="text-amber-400">⭐</span>
                  <span>testimony</span>
                </Link>
              </li>
              <li>
                <Link href="/clients" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="text-amber-400">🏛️</span>
                  <span>Our Clients</span>
                </Link>
              </li>
              <li className="pt-1.5 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={onOpenCustomSize}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-left text-slate-400"
                >
                  <span className="text-blue-400">📐</span>
                  <span>Custom Size Calculator</span>
                </button>
              </li>
              <li>
                {catalogUrl ? (
                  <a
                    href={catalogUrl}
                    download="Shaw-Enterprise-Catalog.pdf"
                    className="hover:text-amber-400 transition flex items-center gap-1.5 text-left text-slate-400"
                  >
                    <span className="text-emerald-400">📄</span>
                    <span>Download Catalog (PDF)</span>
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 text-left text-slate-500" aria-disabled="true">
                    <span className="text-slate-500">📄</span>
                    <span>Catalog PDF Coming Soon</span>
                  </span>
                )}
              </li>
            </ul>
          </div>

          {/* Col 4: Legal Information */}
          <div className="space-y-2.5">
            <h4 className="text-white uppercase font-black text-xs tracking-wider border-b border-slate-800 pb-2">
              Legal Information
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="text-amber-400">🔒</span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="text-amber-400">📜</span>
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="text-amber-400">⚠️</span>
                  <span>Disclaimer</span>
                </Link>
              </li>
              <li>
                <Link href="/payment-policy" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="text-amber-400">💳</span>
                  <span>Payment Policy</span>
                </Link>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>GST Tax Invoice with every order</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>24-Hour transit damage replacement</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Multi-layer wooden batten packing</span>
              </div>
            </div>
          </div>

          {/* Col 5: Registered Works & Contact Information */}
          <div className="space-y-3">
            <h4 className="text-white uppercase font-black text-xs tracking-wider border-b border-slate-800 pb-2">
              Works & Hotlines
            </h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <div>
                <strong className="block text-white font-bold">Registered Office Address:</strong>
                <span className="block text-slate-300 leading-relaxed">
                  {settings.registered_office_address || settings.address || '44/1B, Beniatola Lane (College Street), Kolkata – 700009, W.B'}
                </span>
              </div>

              <div>
                <strong className="block text-white font-bold">Workshop Address:</strong>
                <span className="block text-slate-300 leading-relaxed">
                  {settings.workshop_address || 'Balagarh Industrial, Suryapur, Navarand, Kolkata – 700121'}
                </span>
              </div>

              <div>
                <strong className="block text-white font-bold">Direct Phone Numbers:</strong>
                <span className="text-amber-400 font-bold block">{settings.phone || '+91 9933944007'}</span>
                <span className="block">{settings.phone_secondary || '+91 7003779114'}</span>
              </div>

              <div>
                <strong className="block text-white font-bold">Official Email:</strong>
                <span className="block">{settings.email || 'shaw.entt.edu@gmail.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Trust Badges Strip */}
        <div className="pt-8 pb-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mr-1">Follow Us:</span>
            {social.facebook && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition shadow-sm"
                title="Facebook"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            )}
            {social.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent transition shadow-sm"
                title="Instagram"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            )}
            {twitterUrl && (
              <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-100 hover:text-slate-950 hover:border-slate-100 transition shadow-sm"
                title="X / Twitter"
                aria-label="X / Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.901 2h3.68l-8.04 9.19L22.5 22h-7.27l-5.69-7.38L3.18 22H-.5l8.6-9.83L1.5 2h7.46l5.13 6.75L18.9 2Zm-1.29 18h2.03L7.15 3.9H5.05L17.61 20Z" />
                </svg>
              </a>
            )}
            {social.whatsapp && (
              <a
                href={social.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition shadow-sm"
                title="WhatsApp"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.23c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z" />
                </svg>
              </a>
            )}
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition shadow-sm"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Agency Attribution Bar */}
        <div className="pt-6 border-t border-slate-800 text-center text-slate-400 text-[11px] leading-relaxed">
          <span>
            © 2014 – 2026 <strong>Shaw Enterprise</strong>. All rights reserved. | Designed and Developed by{' '}
            <a
              href="https://preconetindia.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold transition hover:underline"
            >
              Preconet Global Solution Pvt Ltd
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
