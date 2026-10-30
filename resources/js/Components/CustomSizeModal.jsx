import React, { useState } from 'react';
import { useStore, addInquiry } from '../store';

export default function CustomSizeModal({ isOpen, onClose }) {
  const [store] = useStore();
  const settings = store.settings || {};

  const [boardType, setBoardType] = useState('Magnetic Whiteboard');
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(3.5);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Kolkata');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Rate per sq.ft calculation based on material
  const ratePerSqFt = {
    'Magnetic Whiteboard': 110,
    'Non-Magnetic Whiteboard': 85,
    'Black Chalk Writing Board': 80,
    'Ceramic Green Chalkboard': 160,
    'Glass White Writing Board': 220,
    'White / Green Graph Board': 130,
    'Felt Pin-Up Notice Board': 95,
    'Cork Notice Board': 120,
    'Grooved Board with Letters': 140,
    'Acrylic Sliding Glass Notice Board': 240,
  }[boardType] || 110;

  const sqFt = Math.round(width * height * 10) / 10;
  const estimatedPrice = Math.round(sqFt * ratePerSqFt);

  const handleSubmit = (e) => {
    e.preventDefault();
    addInquiry({
      client_name: name,
      phone: phone,
      product_title: `Custom ${boardType}`,
      variant_details: `Custom Size: ${width} ft x ${height} ft (${sqFt} Sq.Ft) - Est: ₹${estimatedPrice}`,
      delivery_city: city,
      quantity: 1,
      message: `Custom size order inquiry for ${boardType} measuring ${width}x${height} ft (${sqFt} sq.ft). Estimated rate ₹${estimatedPrice}.`,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-slate-200 max-h-[92dvh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>

        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
          Factory Custom Workshop • College Street, Kolkata
        </span>
        <h2 className="text-xl font-black text-slate-900 mt-2">
          Custom Size Board Calculator
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          We manufacture writing and display boards in any custom dimensions within 24–48 hours.
        </p>

        {submitted ? (
          <div className="my-6 p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
            <span className="text-3xl font-black text-emerald-600 block">✓</span>
            <h3 className="text-base font-bold text-emerald-900">Custom Order Request Received!</h3>
            <p className="text-xs text-emerald-700">
              Our College Street works desk will call you at <strong>{phone}</strong> to confirm mounting brackets and dispatch schedule.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <a
                href={`https://wa.me/${(settings.whatsapp || '9933944007').replace(/[^0-9]/g, '')}?text=Hello%20Shaw%20Enterprise,%20I%20requested%20a%20custom%20size%20${encodeURIComponent(boardType)}%20${width}x${height}ft.`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg"
              >
                Chat on WhatsApp Now
              </a>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Board Surface Type *</label>
              <select
                value={boardType}
                onChange={(e) => setBoardType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-semibold focus:ring-2 focus:ring-blue-900"
              >
                <option value="Magnetic Whiteboard">Magnetic Whiteboard (High Gloss Dry-Erase)</option>
                <option value="Non-Magnetic Whiteboard">Non-Magnetic Economy Whiteboard</option>
                <option value="Black Chalk Writing Board">Black Chalk Writing Board</option>
                <option value="Ceramic Green Chalkboard">Ceramic Green Chalkboard (25-Yr Durability)</option>
                <option value="Glass White Writing Board">Toughened Glass White Writing Board</option>
                <option value="White / Green Graph Board">White / Green Permanent Graph Board</option>
                <option value="Felt Pin-Up Notice Board">Felt Pin-Up Notice Board (Blue / Green / Maroon)</option>
                <option value="Cork Notice Board">Natural Cork Display Board</option>
                <option value="Grooved Board with Letters">Golden / Silver Grooved Welcome Board</option>
                <option value="Acrylic Sliding Glass Notice Board">Acrylic / Glass Covered Lockable Notice Board</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Width (in Feet) *</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="20"
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Height (in Feet) *</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="6"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            {/* Instant Calculation Preview */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">Total Surface Area</span>
                <span className="text-sm font-black text-slate-800">{sqFt} Sq. Feet ({width} ft × {height} ft)</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 font-bold block">Est. Factory Price</span>
                <span className="text-xl font-black text-emerald-700">₹{estimatedPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Swapan Roy"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98300 XXXXX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-black py-3 rounded-xl uppercase tracking-wider shadow"
            >
              Submit Custom Size Inquiry (₹{estimatedPrice.toLocaleString('en-IN')}) →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

