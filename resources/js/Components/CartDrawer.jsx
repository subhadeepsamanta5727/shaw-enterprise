import React, { useState } from 'react';
import { useStore, updateCartQuantity, removeFromCart, placeOrder } from '../store';
import { resolveImageUrl } from '../services/api';

const resolveImg = (src, fallback = 'https://placehold.co/100x100') => resolveImageUrl(src, fallback);

export default function CartDrawer({ isOpen, onClose, isPage = false }) {
  const [store] = useStore();
  const cart = store.cart || [];
  const settings = store.settings || {};

  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'shipping' | 'payment' | 'success'
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Kolkata',
    pin_code: '700009',
    notes: '',
  });

  if (!isOpen) return null;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const grandTotal = subtotal;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const whatsappNumber = (settings.whatsapp || settings.phone || '919933944007').replace(/\D/g, '');
    const whatsappWindow = window.open('about:blank', '_blank');
    if (whatsappWindow) whatsappWindow.opener = null;
    setIsSubmittingOrder(true);
    setOrderError('');

    try {
      const order = await placeOrder({
        customer_name: customer.name,
        phone: customer.phone,
        email: customer.email,
        delivery_address: customer.address,
        city: customer.city,
        pin_code: customer.pin_code,
        total_amount: grandTotal,
        payment_method: 'WhatsApp',
        notes: customer.notes,
      });
      const orderItems = order.items.map((item) =>
        `- ${item.title} (${item.size_label || 'Standard'}) x ${item.quantity}: ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
      );
      const message = [
        'Hello Shaw Enterprise, I would like to place this order:',
        `Order ID: ${order.id}`,
        ...orderItems,
        `Order Total: ₹${grandTotal.toLocaleString('en-IN')}`,
        `Name: ${customer.name}`,
        `Phone: ${customer.phone}`,
        customer.email ? `Email: ${customer.email}` : null,
        `Delivery Address: ${customer.address}, ${customer.city} - ${customer.pin_code}`,
        customer.notes ? `Notes: ${customer.notes}` : null,
      ].filter(Boolean).join('\n');
      const orderWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      setWhatsappUrl(orderWhatsappUrl);
      if (whatsappWindow) {
        whatsappWindow.location.href = orderWhatsappUrl;
      }
      setPlacedOrderDetails(order);
      setCheckoutStep('success');
    } catch (error) {
      console.error('Could not save order:', error);
      if (whatsappWindow) whatsappWindow.close();
      setOrderError('We could not save your order. Please try again.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className={isPage ? 'w-full' : 'fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end'}>
      <div className={isPage
        ? 'w-full max-w-5xl mx-auto bg-white min-h-[65vh] shadow-xl border-x border-slate-200 flex flex-col justify-between overflow-y-auto font-sans'
        : 'w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left font-sans'}>
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🛒</span>
            <div>
              <h2 className="text-base font-black uppercase tracking-tight">Your Shopping Cart</h2>
              <span className="text-xs text-amber-400">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in cart
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* STEP 1: CART ITEMS VIEW */}
        {checkoutStep === 'cart' && (
          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-slate-500 space-y-3">
                <span className="text-5xl block">🛍️</span>
                <p className="text-sm font-bold text-slate-700">Your cart is currently empty</p>
                <p className="text-xs text-slate-400">Browse our whiteboards, chalkboards, and display stands.</p>
                <button
                  onClick={onClose}
                  className="mt-2 bg-blue-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.key}
                    className="flex gap-3.5 p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition"
                  >
                    <img
                      src={resolveImg(item.main_image)}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80';
                      }}
                      className="w-16 h-16 rounded-lg object-contain bg-white border border-slate-200 p-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                      <span className="text-[11px] text-blue-900 font-semibold block">{item.size_label}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black text-slate-900">₹{item.price.toLocaleString('en-IN')}</span>
                        {item.mrp > item.price && (
                          <span className="text-xs text-slate-400 line-through">₹{item.mrp.toLocaleString('en-IN')}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden text-xs">
                          <button
                            onClick={() => updateCartQuantity(item.key, item.quantity - 1)}
                            className="px-2.5 py-1 hover:bg-slate-100 text-slate-700 font-bold"
                          >
                            −
                          </button>
                          <span className="px-2.5 py-1 font-bold text-slate-900 min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.key, item.quantity + 1)}
                            className="px-2.5 py-1 hover:bg-slate-100 text-slate-700 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: SHIPPING & CHECKOUT FORM */}
        {checkoutStep === 'shipping' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 p-5 space-y-4 overflow-y-auto">
            <button
              type="button"
              onClick={() => setCheckoutStep('cart')}
              className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1 mb-2"
            >
              ← Back to Cart
            </button>

            <h3 className="text-sm font-extrabold uppercase text-slate-900 tracking-wider">
              Customer & Delivery Details
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="e.g. Subrata Ghosh"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="+91 98300 XXXXX"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="name@email.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Street Address / Landmark *</label>
                <textarea
                  required
                  rows={2}
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="Premises No., Street name, Landmark, Floor/Flat..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <input
                    required
                    type="text"
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PIN Code *</label>
                  <input
                    required
                    type="text"
                    value={customer.pin_code}
                    onChange={(e) => setCustomer({ ...customer, pin_code: e.target.value })}
                    placeholder="700009"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

            </div>

            {orderError && (
              <p role="alert" className="text-xs text-red-600 font-semibold">
                {orderError}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmittingOrder}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl transition shadow text-xs uppercase tracking-wider mt-4"
            >
              {isSubmittingOrder ? 'Saving Order...' : `Place Order Now (₹${grandTotal.toLocaleString('en-IN')}) →`}
            </button>
          </form>
        )}

        {/* STEP 3: ORDER SUCCESS CONFIRMATION */}
        {checkoutStep === 'success' && placedOrderDetails && (
          <div className="flex-1 p-6 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-black mx-auto">
              ✓
            </div>
            <h2 className="text-xl font-black text-slate-900">Order Placed Successfully!</h2>
            <p className="text-xs text-slate-500">
              Your order is saved in our admin hub. Send the prefilled WhatsApp message to confirm your order details.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Order Number:</span>
                <span className="font-bold text-blue-900 font-mono">{placedOrderDetails.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-800">{placedOrderDetails.customer_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Order Channel:</span>
                <span className="font-bold text-slate-800">{placedOrderDetails.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Order Total:</span>
                <span className="font-black text-slate-900 text-sm">₹{placedOrderDetails.total_amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
              >
                <span>💬 Send Order on WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  setCheckoutStep('cart');
                  onClose();
                }}
                className="bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* Drawer Footer with Cart Totals */}
        {checkoutStep === 'cart' && cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.length} items)</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount (incl. taxes)</span>
                <span className="text-blue-900">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setCheckoutStep('shipping')}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition shadow text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
