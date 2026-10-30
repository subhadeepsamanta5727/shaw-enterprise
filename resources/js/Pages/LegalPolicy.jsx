import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useStore } from '../store';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import CartDrawer from '../Components/CartDrawer';
import BulkQuoteModal from '../Components/BulkQuoteModal';
import CustomSizeModal from '../Components/CustomSizeModal';
import BrochureModal from '../Components/BrochureModal';
import WhatsAppFloatingButton from '../Components/WhatsAppFloatingButton';

export default function LegalPolicy({ initialTab = 'privacy-policy' }) {
  const [store] = useStore();
  const settings = store.settings || {};

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const switchTab = (tabKey) => {
    setActiveTab(tabKey);
    const path = `/${tabKey}`;
    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    { key: 'privacy-policy', label: 'Privacy Policy', icon: '🔒' },
    { key: 'terms-conditions', label: 'Terms & Conditions', icon: '📜' },
    { key: 'disclaimer', label: 'Disclaimer', icon: '⚠️' },
    { key: 'payment-policy', label: 'Payment Policy', icon: '💳' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">
      <Head
        title={`${
          tabs.find((t) => t.key === activeTab)?.label || 'Legal Information'
        } | ${settings.site_name || 'Shaw Enterprise'}`}
      />

      {/* Standard Header */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenEnquiry={() => setIsQuoteModalOpen(true)}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">
            Shaw Enterprise • College Street, Kolkata
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            Legal Information & Compliance
          </h1>
          <p className="mt-3 text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Transparent manufacturing terms, data protection principles, payment guidelines, and statutory disclosures for our valued clients, schools, and enterprise partners.
          </p>

          {/* Tab Navigation */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => switchTab(tab.key)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-lg scale-105'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-10 space-y-8">
          
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy-policy' && (
            <article className="space-y-6 text-slate-700 leading-relaxed text-sm">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-blue-900 font-bold text-xs uppercase tracking-wider block">
                  Data Protection & Privacy
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Privacy Policy
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Last Updated: October 2026 • Valid for all transactions with Shaw Enterprise
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">1.</span> Information We Collect
                </h3>
                <p>
                  At <strong>Shaw Enterprise</strong> (operating from College Street, Kolkata and manufacturing at Balagarh Industrial works), we respect your privacy. When you visit our website, request a custom size quote, place an order, or contact us via WhatsApp or phone, we may collect:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li><strong>Personal & Business Identifiers:</strong> Name, institution/company name, delivery address, phone number, and official email address.</li>
                  <li><strong>Tax & Invoicing Information:</strong> GSTIN number, billing address, and state code for generating legally compliant GST invoices.</li>
                  <li><strong>Order & Technical Specifications:</strong> Board measurements (height, width), surface preferences (ceramic, melamine, magnetic, acrylic), stand specifications, and customized branding requirements.</li>
                  <li><strong>Device & Browsing Data:</strong> Standard server logs, browser type, and cookie identifiers for shopping cart persistence.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">2.</span> How We Use Your Information
                </h3>
                <p>We process your data exclusively for legitimate commercial purposes:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li>Fulfilling orders, precision manufacturing of writing/display boards, and arranging doorstep delivery or transport cargo.</li>
                  <li>Issuing official GST tax invoices and delivery challans.</li>
                  <li>Responding to quotations, bulk tender RFQs, and custom dimension inquiries via phone, email, or WhatsApp.</li>
                  <li>Notifying you about dispatch status, consignment tracking numbers, or service warranty updates.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">3.</span> Payment Data Security
                </h3>
                <p>
                  Shaw Enterprise <strong>never</strong> collects, records, or stores credit card numbers, debit card PINs, CVV codes, or net banking passwords on our local servers. All digital payments are handled directly through Reserve Bank of India (RBI) authorized payment gateways (Razorpay) and UPI switches (Google Pay, PhonePe, Paytm, BHIM).
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">4.</span> Non-Disclosure to Third Parties
                </h3>
                <p>
                  We do not sell, rent, trade, or monetize your personal or institutional data under any circumstance. Your information is shared only with verified logistical delivery partners (local Kolkata delivery boys or licensed freight carriers) solely for the purpose of completing product delivery.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">5.</span> Privacy Inquiries & Data Rights
                </h3>
                <p>
                  If you wish to review, update, or remove your contact information from our communications register, please reach out to our desk:
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-700">
                  <p><strong>Shaw Enterprise (Customer Care & Compliance)</strong></p>
                  <p>Registered Office: 44/1B, Beniatola Lane (College Street), Kolkata – 700009, West Bengal</p>
                  <p>Email: <a href="mailto:shaw.entt.edu@gmail.com" className="text-blue-900 font-bold underline">shaw.entt.edu@gmail.com</a></p>
                  <p>Direct Hotline: +91 9933944007 / +91 7003779114</p>
                </div>
              </section>
            </article>
          )}

          {/* TAB 2: TERMS & CONDITIONS */}
          {activeTab === 'terms-conditions' && (
            <article className="space-y-6 text-slate-700 leading-relaxed text-sm">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-blue-900 font-bold text-xs uppercase tracking-wider block">
                  Contractual Terms & Manufacturing Guidelines
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Terms & Conditions
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Governing all retail, wholesale, and institutional contracts with Shaw Enterprise
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">1.</span> Corporate & Manufacturing Identity
                </h3>
                <p>
                  These Terms & Conditions constitute a legally binding agreement between the customer (Buyer) and <strong>Shaw Enterprise</strong> (Seller), having its Registered Office at 44/1B, Beniatola Lane (College Street), Kolkata – 700009, and its industrial works at Balagarh Industrial, Suryapur, Navarand, Kolkata – 700121, West Bengal, India.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">2.</span> Quotations, Pricing & Validity
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li>Prices displayed on the website or provided in formal written quotations are in Indian Rupees (INR) and are subject to applicable Goods and Services Tax (GST).</li>
                  <li>Institutional quotations and bulk tender rates are valid for <strong>30 calendar days</strong> from the date of issue unless specified otherwise.</li>
                  <li>Shaw Enterprise reserves the right to adjust catalog pricing in response to significant market fluctuations in raw materials (aluminum extrusion ingots, high-grade CRCA sheet metal, acrylic sheets, or MDF cores).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">3.</span> Custom Size & Made-to-Order Products
                </h3>
                <p>
                  Products tailored to non-standard dimensions (such as continuous 8x4 ft, 10x4 ft, or 12x4 ft whiteboards, custom grooved lobby stands, customized acrylic nameplates, or specialized classroom furniture) enter precision fabrication upon receipt of an advance payment or official Institutional Purchase Order. Once aluminum cutting and substrate pressing have commenced, customized orders <strong>cannot</strong> be cancelled or returned.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">4.</span> Delivery, Transit & Inspection
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li><strong>Local Kolkata Deliveries:</strong> Standard catalog products are dispatched within 24–48 hours across Kolkata, Howrah, Hooghly, North and South 24 Parganas. Free local delivery applies to qualifying orders above ₹1,999.</li>
                  <li><strong>Outstation Dispatches:</strong> Goods are secured with multi-layer wooden batten framing and thermocol edge protectors, consigned through recognized surface logistics.</li>
                  <li><strong>Inspection upon Receipt:</strong> The Buyer must inspect the external packaging at the time of delivery. Any damage incurred during transit must be endorsed on the delivery challan or consignment note and reported with photos to +91 9933944007 within 24 hours for prompt replacement.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">5.</span> Surface Warranty & Usage Guidelines
                </h3>
                <p>
                  Our ceramic steel magnetic surfaces carry up to a 25-year manufacturer surface integrity warranty against delamination, ghosting, and fading under normal educational usage. The warranty does not cover:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>Use of permanent or alcohol-based abrasive industrial markers on whiteboard surfaces.</li>
                  <li>Physical scratches caused by metallic knives, cutter blades, or abrasive scourers.</li>
                  <li>Exposure of non-waterproof notice boards to open outdoor rain or continuous water seepage.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">6.</span> Governing Law & Jurisdiction
                </h3>
                <p>
                  All contracts, orders, and disputes arising out of or related to Shaw Enterprise products and transactions shall be exclusively governed by the laws of the Republic of India and subject to the jurisdiction of competent courts in <strong>Kolkata, West Bengal</strong>.
                </p>
              </section>
            </article>
          )}

          {/* TAB 3: DISCLAIMER */}
          {activeTab === 'disclaimer' && (
            <article className="space-y-6 text-slate-700 leading-relaxed text-sm">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-blue-900 font-bold text-xs uppercase tracking-wider block">
                  Product & Website Disclosures
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Disclaimer
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Important legal & technical notices regarding our specifications and online representations
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">1.</span> Product Visuals & Color Variations
                </h3>
                <p>
                  While Shaw Enterprise strives to display product colors, aluminum frame finishes, and fabric shades (for pin-up notice boards) with maximum fidelity, the exact shade rendered on your screen may vary slightly depending on monitor calibration, display brightness, and lighting conditions.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">2.</span> Manufacturing Dimensional Tolerances
                </h3>
                <p>
                  Due to industrial extrusion cutting, edge bevelling, and wooden core fabrication at our Balagarh works, actual finished dimensions may carry an industry-standard tolerance of <strong>±2mm to ±5mm</strong>. This tolerance in no way compromises structural integrity or mounting capability.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">3.</span> Wall Mounting & Installation Safety
                </h3>
                <p>
                  Shaw Enterprise supplies high-tensile wall-mounting brackets, screws, and corner caps with our boards. However, the Buyer is responsible for ensuring the structural soundness of their wall (e.g. solid brickwork, concrete, or reinforced dry-wall) before securing large-format boards (e.g., 6x4 ft or larger). Shaw Enterprise cannot be held liable for damages resulting from improper wall drilling or inadequate structural anchors.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">4.</span> Third-Party Links & Courier Tracking
                </h3>
                <p>
                  Any external links on our website (including courier tracking portals, payment gateway pages, and Google Maps location routes) are provided for convenience. Shaw Enterprise exercises no operational control over external websites and is not responsible for their availability or content.
                </p>
              </section>
            </article>
          )}

          {/* TAB 4: PAYMENT POLICY */}
          {activeTab === 'payment-policy' && (
            <article className="space-y-6 text-slate-700 leading-relaxed text-sm">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-blue-900 font-bold text-xs uppercase tracking-wider block">
                  Commercial Billing & Transactions
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Payment Policy
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Secure checkout methods, tax invoices, and refund/replacement protocols
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">1.</span> Authorized Payment Methods
                </h3>
                <p>
                  Shaw Enterprise facilitates diverse, 100% secure payment channels for retail shoppers, corporate clients, and educational bodies:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <strong className="block text-slate-900 font-bold">⚡ Instant UPI Scan & Pay</strong>
                    <p className="text-slate-600">Google Pay, PhonePe, Paytm, BHIM, and any verified banking UPI app for zero-fee real-time settlement.</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <strong className="block text-slate-900 font-bold">🏛️ NEFT / RTGS / IMPS Bank Transfer</strong>
                    <p className="text-slate-600">Direct account transfer to Shaw Enterprise current account for institutional purchase orders and government schools.</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <strong className="block text-slate-900 font-bold">💳 Credit & Debit Cards / NetBanking</strong>
                    <p className="text-slate-600">Processed securely via PCI-DSS certified Razorpay gateway with 128-bit encryption.</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <strong className="block text-slate-900 font-bold">💵 Cash on Delivery (COD)</strong>
                    <p className="text-slate-600">Available across select Kolkata pin codes for orders up to ₹5,000 upon address verification.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">2.</span> Advance Payment Terms for Large & Custom Orders
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li><strong>Standard Orders &lt; ₹10,000:</strong> 100% payment upon online checkout, UPI scan, or COD where applicable.</li>
                  <li><strong>Bulk & Custom Orders &gt; ₹10,000:</strong> 50% mobilization advance upon purchase order confirmation, with the remaining 50% payable prior to factory dispatch or upon doorstep delivery in Kolkata.</li>
                  <li><strong>Institutional & Government Tenders:</strong> Credit terms (15–30 days) are available exclusively against approved official purchase orders and sanction letters.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">3.</span> Official GST Invoicing
                </h3>
                <p>
                  Every commercial shipment from Shaw Enterprise is accompanied by an authentic <strong>GST Tax Invoice</strong> clearly itemizing:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>GSTIN: <strong>{settings.gst_number || '19AAIFS4821N1ZM'}</strong></li>
                  <li>HSN/SAC Codes corresponding to writing boards (HSN 9610) and display furniture (HSN 9403).</li>
                  <li>Buyer GSTIN and billing address for availing Input Tax Credit (ITC).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">4.</span> Replacement & Damage Claims
                </h3>
                <p>
                  Because writing boards and glass products are fragile items, we inspect each unit prior to packing at our Balagarh facility. If an item arrives with transit damage:
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1.5">
                  <p className="font-bold">✓ 24-Hour Damage Reporting Window</p>
                  <p>Send unboxing photos/videos of the package and damaged board to our WhatsApp helpline (+91 9933944007) within 24 hours of receipt.</p>
                  <p className="font-bold">✓ 100% Free Replacement</p>
                  <p>Our workshop will dispatch a replacement board immediately or arrange for an onsite technician visit within Greater Kolkata at no additional charge.</p>
                </div>
              </section>
            </article>
          )}

          {/* Quick Contact CTA Footer inside Policy */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-5 rounded-xl">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Have questions about our terms or policies?</span>
              <span className="text-xs text-slate-500">Call our College Street showroom desk directly.</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${(settings.whatsapp || '9933944007').replace(/[^0-9]/g, '')}?text=Hello%20Shaw%20Enterprise,%20I%20have%20a%20question%20regarding%20your%20terms.`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <span>💬 WhatsApp Us</span>
              </a>
              <Link
                href="/contact"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Standard Market-Standard Footer */}
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

