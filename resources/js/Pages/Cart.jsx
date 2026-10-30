import React from 'react';
import { Head } from '@inertiajs/react';
import { useStore } from '../store';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import CartDrawer from '../Components/CartDrawer';
import WhatsAppFloatingButton from '../Components/WhatsAppFloatingButton';

export default function CartPage() {
  const [store] = useStore();
  const settings = store.settings || {};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Head title={`Shopping Cart | ${settings.site_name || 'Shaw Enterprise'}`} />
      <Navbar onOpenEnquiry={() => window.__navigate('/contact')} />
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <CartDrawer
          isOpen
          isPage
          onClose={() => window.__navigate('/products')}
        />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
