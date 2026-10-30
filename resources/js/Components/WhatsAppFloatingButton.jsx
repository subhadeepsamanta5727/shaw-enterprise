import React, { useState } from 'react';
import { useStore } from '../store';

export default function WhatsAppFloatingButton() {
  const [store] = useStore();
  const settings = store.settings || {};
  const [isOpen, setIsOpen] = useState(false);

  const phoneNum = (settings.whatsapp || settings.phone || '9933944007').replace(/[^0-9]/g, '');

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {/* Quick message popup bubble */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-fade-in text-xs text-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow">
                SE
              </div>
              <div>
                <strong className="block text-slate-900 font-bold">{settings.site_name || 'Shaw Enterprise'}</strong>
                <span className="text-[10px] text-emerald-600 font-semibold">● Online • College Street Works</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 font-bold text-sm"
            >
              ✕
            </button>
          </div>

          <p className="my-3 text-slate-600 leading-relaxed text-[11px]">
            Hello! Looking for magnetic whiteboards, chalkboards, or display stands? Chat with Mr. Indrajit Shaw directly on WhatsApp!
          </p>

          <a
            href={`https://wa.me/${phoneNum}?text=Hello%20Shaw%20Enterprise,%20I%20am%20interested%20in%20writing%20boards%20and%20stands.`}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-2 shadow transition"
          >
            <span>💬 Start WhatsApp Chat</span>
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl transition hover:scale-105 group relative"
        title="Chat with Shaw Enterprise on WhatsApp"
        aria-label="WhatsApp Chat"
      >
        <span>💬</span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
      </button>
    </div>
  );
}

