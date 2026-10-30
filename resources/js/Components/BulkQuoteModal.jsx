import React from 'react';
import { useForm } from '@inertiajs/react';

export default function BulkQuoteModal({ isOpen, onClose, product, selectedVariant }) {
    if (!isOpen) return null;

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        product_id: product?.id || null,
        variant_details: selectedVariant ? `${selectedVariant.size_label} (${selectedVariant.surface_type || 'Standard'})` : 'Standard Catalog Spec',
        client_name: '',
        organization_name: '',
        email: '',
        phone: '',
        quantity: 25,
        delivery_city: 'Kolkata',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/bulk-inquiries', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setTimeout(() => {
                    onClose();
                }, 2000);
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="relative bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 max-h-[92dvh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center transition"
                >
                    ✕
                </button>

                {/* Modal Title */}
                <div className="mb-6">
                    <span className="inline-block px-2.5 py-1 rounded bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
                        Wholesale & Bulk Orders (Shaw Enterprise Kolkata)
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">
                        Request Bulk / School Quote
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Variant Selected: <strong className="text-slate-800">{data.variant_details}</strong>
                    </p>
                </div>

                {recentlySuccessful ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                        <div className="text-emerald-600 text-4xl mb-2">✓</div>
                        <h4 className="text-lg font-bold text-emerald-900">RFQ Received Successfully!</h4>
                        <p className="text-xs text-emerald-700 mt-1">
                            Our institutional sales desk in Kolkata will review your specifications and email you an official stamped quote with GST breakdown within 2-4 hours.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Your Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.client_name}
                                    onChange={(e) => setData('client_name', e.target.value)}
                                    placeholder="e.g. S. Sen"
                                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                                />
                                {errors.client_name && <p className="text-xs text-red-600 mt-1">{errors.client_name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Institution / Organization Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.organization_name}
                                    onChange={(e) => setData('organization_name', e.target.value)}
                                    placeholder="e.g. DPS Newtown / Tech Mahindra"
                                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                                />
                                {errors.organization_name && <p className="text-xs text-red-600 mt-1">{errors.organization_name}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Official Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="procurement@school.edu.in"
                                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                                />
                                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Phone / WhatsApp *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+91 98300 00000"
                                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                                />
                                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Estimated Quantity (Units) *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', parseInt(e.target.value) || 1)}
                                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                                />
                                {errors.quantity && <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                    Delivery City / Pin Code *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.delivery_city}
                                    onChange={(e) => setData('delivery_city', e.target.value)}
                                    placeholder="Kolkata 700091"
                                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                                />
                                {errors.delivery_city && <p className="text-xs text-red-600 mt-1">{errors.delivery_city}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                Special Installation Notes / Dimensions
                            </label>
                            <textarea
                                rows={2}
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                placeholder="State any custom frame requirements, floor fitting, or installation deadline..."
                                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                            />
                        </div>

                        <div className="pt-3 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow-md transition disabled:opacity-50"
                            >
                                {processing ? 'Submitting RFQ...' : 'Submit Institutional RFQ'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
