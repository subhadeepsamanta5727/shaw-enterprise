import React, { useState } from 'react';
import { useStore, updateSettings, updateStore } from '../../store';
import ImageUploadInput from '../../Components/ImageUploadInput';
import { api, resolveImageUrl } from '../../services/api';

export default function SettingsView() {
  const [store] = useStore();
  const settings = store.settings || {};

  const [activeSubTab, setActiveSubTab] = useState('sections');
  const [savedToast, setSavedToast] = useState(false);
  const [isCatalogUploading, setIsCatalogUploading] = useState(false);
  const [catalogUploadError, setCatalogUploadError] = useState('');

  // Form State initialized from store.settings
  const [formData, setFormData] = useState({
    site_name: settings.site_name || 'Shaw Enterprise',
    logo_url: settings.logo_url || settings.site_logo || settings.logo || '',
    tagline: settings.tagline || 'Manufacturer, Wholesaler & Retailer of Writing Boards, Display Systems & Educational Accessories',
    proprietor: settings.proprietor || 'Mr. Indrajit Shaw',
    phone: settings.phone || '+91 9933944007',
    phone_secondary: settings.phone_secondary || '+91 7003779114',
    whatsapp: settings.whatsapp || '+91 9933944007',
    email: settings.email || 'shaw.entt.edu@gmail.com',
    address: settings.address || '44/1B, Beniatola Lane (College Street), Kolkata – 700009, W.B',
    registered_office_address: settings.registered_office_address || settings.address || '44/1B, Beniatola Lane (College Street), Kolkata – 700009, W.B',
    workshop_address: settings.workshop_address || 'Balagarh Industrial, Suryapur, Navarand, Kolkata – 700121',
    maps_embed_url: settings.maps_embed_url || '',
    gst_number: settings.gst_number || '19AAIFS4821N1ZM',
    established_year: settings.established_year || '2014',
    working_hours: settings.working_hours || 'Monday – Saturday: 10:00 AM – 8:00 PM (Sunday Closed)',
    announcement_text: settings.announcement_text || '🚚 Free Delivery in Kolkata on orders above ₹1,999 • Direct Factory Pricing with GST Invoices • Fast Dispatch Across India',
    hero_banner_url: settings.hero_banner_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
    catalog_pdf_url: settings.catalog_pdf_url || '',
    catalog_pdf_filename: settings.catalog_pdf_filename || '',
    social_links: {
      facebook: settings.social_links?.facebook || '',
      instagram: settings.social_links?.instagram || '',
      twitter: settings.social_links?.twitter || settings.social_links?.youtube || '',
      youtube: settings.social_links?.youtube || '',
      whatsapp: settings.social_links?.whatsapp || 'https://wa.me/919933944007',
      linkedin: settings.social_links?.linkedin || '',
    },
    payment_settings: {
      enable_razorpay: settings.payment_settings?.enable_razorpay ?? true,
      razorpay_key_id: settings.payment_settings?.razorpay_key_id || 'rzp_test_shaw_ent_kolkata_99339',
      razorpay_key_secret: settings.payment_settings?.razorpay_key_secret || 'sec_test_9933944007_college_st',
      enable_upi_qr: settings.payment_settings?.enable_upi_qr ?? true,
      upi_id: settings.payment_settings?.upi_id || '9933944007@upi',
      upi_qr_url: settings.payment_settings?.upi_qr_url || '',
      enable_cod: settings.payment_settings?.enable_cod ?? true,
      enable_bank_transfer: settings.payment_settings?.enable_bank_transfer ?? true,
      bank_name: settings.payment_settings?.bank_name || 'State Bank of India',
      bank_account_no: settings.payment_settings?.bank_account_no || '389012345678',
      bank_ifsc: settings.payment_settings?.bank_ifsc || 'SBIN0000087',
      bank_branch: settings.payment_settings?.bank_branch || 'College Street Branch, Kolkata',
    },
    sections: {
      hero: {
        badge: settings.sections?.hero?.badge || '📍 Regd. Office: 44/1B, Beniatola Lane, College Street • Works: Balagarh Industrial, Kolkata',
        title: settings.sections?.hero?.title || "Kolkata's Premier Manufacturer of Writing Boards & Display Systems",
        description: settings.sections?.hero?.description || 'Manufactured by Shaw Enterprise with 100% ghost-free surfaces and virgin 6063-T6 aluminium frames. Direct factory rates for retail, schools, coaching institutes & offices.',
        btn_primary_text: settings.sections?.hero?.btn_primary_text || 'Shop Products Online →',
        btn_secondary_text: settings.sections?.hero?.btn_secondary_text || '📐 Custom Size Calculator',
        image: settings.sections?.hero?.image || settings.hero_banner_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
        badge_featured_title: settings.sections?.hero?.badge_featured_title || 'Popular in Kolkata',
        badge_featured_sub: settings.sections?.hero?.badge_featured_sub || 'Shaw 3x2 Magnetic Whiteboard',
        badge_featured_price: settings.sections?.hero?.badge_featured_price || '₹1,099',
      },
      features: settings.sections?.features || [
        { id: 1, icon: '🏭', title: 'College Street Works', subtitle: 'Direct factory manufacture' },
        { id: 2, icon: '🚚', title: 'Safe Wooden Packaging', subtitle: 'Reinforced corner battens' },
        { id: 3, icon: '📱', title: 'UPI / Cards / COD', subtitle: 'Instant QR scan or Cash on Delivery' },
        { id: 4, icon: '📄', title: 'GST Tax Invoices', subtitle: 'Official GSTIN provided' },
      ],
      about_home: {
        badge: settings.sections?.about_home?.badge || 'About Shaw Enterprise',
        title: settings.sections?.about_home?.title || '10+ Years of Manufacturing Excellence at College Street',
        p1: settings.sections?.about_home?.p1 || "Founded in 2014 by proprietor Mr. Indrajit Shaw, Shaw Enterprise has established itself as one of West Bengal's leading manufacturers, wholesalers, and retailers of writing boards, display bulletin systems, mobile stands, and school accessories.",
        p2: settings.sections?.about_home?.p2 || "Operating our registered office at 44/1B, Beniatola Lane, College Street, and manufacturing workshop at Balagarh Industrial (Suryapur, Navarand, Kolkata – 700121), we supply both individual students and renowned institutions including Presidency University, Calcutta University, St. Xavier's, and South Point with precision-engineered products.",
        image: settings.sections?.about_home?.image || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
        stats: settings.sections?.about_home?.stats || [
          { id: 1, value: '2014', label: 'Year Established', sub: 'College Street, Kolkata' },
          { id: 2, value: '25-Yr', label: 'Surface Warranty', sub: 'On Ceramic Green Boards' },
          { id: 3, value: '50,000+', label: 'Boards Manufactured', sub: 'Delivered Pan-India' },
          { id: 4, value: '100%', label: 'Genuine Virgin Alloy', sub: 'Alloy 6063-T6 Frames' },
        ],
      },
      custom_size_banner: {
        badge: settings.sections?.custom_size_banner?.badge || 'Need a Custom Non-Standard Size?',
        title: settings.sections?.custom_size_banner?.title || 'We Custom-Cut & Fabricate Any Board Dimension within 24 Hours',
        description: settings.sections?.custom_size_banner?.description || 'From compact 1.5x1 ft study pads to 12x4 ft continuous auditorium ceramic boards, our College Street facility fabricates to your exact specifications.',
        btn_text: settings.sections?.custom_size_banner?.btn_text || 'Open Custom Size Calculator →',
      },
    },
  });

  const handleLogoUpload = (newImg) => {
    setFormData((prev) => ({
      ...prev,
      logo_url: newImg,
      site_logo: newImg,
      logo: newImg,
    }));
    updateSettings({
      logo_url: newImg,
      site_logo: newImg,
      logo: newImg,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 4000);
  };

  const handleHeroImageUpload = (newImg) => {
    const updatedSections = {
      ...formData.sections,
      hero: { ...formData.sections.hero, image: newImg },
    };
    setFormData((prev) => ({ ...prev, sections: updatedSections }));
    updateSettings({ sections: updatedSections, hero_banner_url: newImg });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 4000);
  };

  const handleWorkshopImageUpload = (newImg) => {
    const updatedSections = {
      ...formData.sections,
      about_home: { ...formData.sections.about_home, image: newImg },
    };
    setFormData((prev) => ({ ...prev, sections: updatedSections }));
    updateSettings({ sections: updatedSections });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 4000);
  };

  const handleUpiQrUpload = (newImg) => {
    const updatedPayment = {
      ...formData.payment_settings,
      upi_qr_url: newImg,
    };
    setFormData((prev) => ({ ...prev, payment_settings: updatedPayment }));
    updateSettings({ payment_settings: updatedPayment });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 4000);
  };

  const handleCatalogPdfUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    setCatalogUploadError('');
    if (!file) return;

    if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) {
      setCatalogUploadError('Please choose a PDF file.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setCatalogUploadError('The catalog PDF must be 25MB or smaller.');
      return;
    }

    setIsCatalogUploading(true);
    try {
      const uploadResult = await api.uploadCatalogPdf(file);
      if (!uploadResult?.success || !uploadResult.url) {
        throw new Error(uploadResult?.message || 'Catalog upload did not return a file URL.');
      }

      const catalogSettings = {
        catalog_pdf_url: uploadResult.url,
        catalog_pdf_filename: uploadResult.filename || file.name,
      };
      const settingsResult = await api.updateSettings({ ...store.settings, ...catalogSettings });
      if (!settingsResult?.success) {
        throw new Error(settingsResult?.message || 'Catalog uploaded, but its settings could not be saved.');
      }

      setFormData((previous) => ({ ...previous, ...catalogSettings }));
      updateStore({ settings: settingsResult.data || { ...store.settings, ...catalogSettings } });
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 4000);
    } catch (error) {
      setCatalogUploadError(error.message || 'Failed to upload the catalog PDF.');
    } finally {
      setIsCatalogUploading(false);
    }
  };

  const handleRemoveCatalogPdf = async () => {
    const catalogSettings = { catalog_pdf_url: '', catalog_pdf_filename: '' };
    setCatalogUploadError('');
    setIsCatalogUploading(true);
    try {
      const settingsResult = await api.updateSettings({ ...store.settings, ...catalogSettings });
      if (!settingsResult?.success) {
        throw new Error(settingsResult?.message || 'Failed to remove the catalog PDF setting.');
      }
      setFormData((previous) => ({ ...previous, ...catalogSettings }));
      updateStore({ settings: settingsResult.data || { ...store.settings, ...catalogSettings } });
    } catch (error) {
      setCatalogUploadError(error.message || 'Failed to remove the catalog PDF setting.');
    } finally {
      setIsCatalogUploading(false);
    }
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    updateSettings({
      ...formData,
      logo_url: formData.logo_url,
      site_logo: formData.logo_url,
      logo: formData.logo_url,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Store Content, Uploads & Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload images and catalog PDFs, manage branding, and customize website content.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>💾 Save All Changes</span>
        </button>
      </div>

      {savedToast && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-lg">
          <span>✓</span>
          <span>Store settings and uploaded images saved successfully! Live storefront updated immediately.</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: 'sections', label: '🖼️ Storefront Content & Uploads', icon: '🖼️' },
          { id: 'branding', label: '🎨 Logo & Branding', icon: '🎨' },
          { id: 'business', label: '📍 Business Details & Location', icon: '📍' },
          { id: 'catalog', label: '📄 PDF Catalog', icon: '📄' },
          { id: 'social', label: '🌐 Social Channels', icon: '🌐' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ========================================================
            TAB 1: STOREFRONT CONTENT & SECTION IMAGES (NEW!)
           ======================================================== */}
        {activeSubTab === 'sections' && (
          <div className="space-y-6">
            {/* 0. Brand Logo & Header Identity */}
            <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 space-y-4">
              <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <span>🏷️</span> Official Brand Logo (Header & Footer)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload your Shaw Enterprise brand logo. Immediately updates the top navigation bar, footer, and admin header.
                  </p>
                </div>
                <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-2.5 py-1 rounded-lg">
                  Instant Auto-Save
                </span>
              </div>

              <div className="max-w-xl">
                <ImageUploadInput
                  label="Upload Brand Logo File"
                  value={formData.logo_url}
                  onChange={handleLogoUpload}
                  helperText="Upload transparent PNG, SVG, or JPG logo file"
                />
              </div>
            </div>

            {/* 1. Hero Section Content & Image */}
            <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 space-y-4">
              <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                    1. Hero Banner Section
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Headline, description, call to action, and main hero image.</p>
                </div>
                <span className="text-xs bg-slate-900 text-slate-400 px-2.5 py-1 rounded-lg">Top of Homepage</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Hero Pill Badge</label>
                    <input
                      type="text"
                      value={formData.sections.hero.badge}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sections: {
                            ...formData.sections,
                            hero: { ...formData.sections.hero, badge: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Hero Main Headline</label>
                    <textarea
                      rows={2}
                      value={formData.sections.hero.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sections: {
                            ...formData.sections,
                            hero: { ...formData.sections.hero, title: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Hero Sub-description</label>
                    <textarea
                      rows={3}
                      value={formData.sections.hero.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sections: {
                            ...formData.sections,
                            hero: { ...formData.sections.hero, description: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Primary Button Text</label>
                      <input
                        type="text"
                        value={formData.sections.hero.btn_primary_text}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sections: {
                              ...formData.sections,
                              hero: { ...formData.sections.hero, btn_primary_text: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Secondary Button Text</label>
                      <input
                        type="text"
                        value={formData.sections.hero.btn_secondary_text}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sections: {
                              ...formData.sections,
                              hero: { ...formData.sections.hero, btn_secondary_text: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Hero Image */}
                <div>
                  <ImageUploadInput
                    label="Upload Hero Banner Image"
                    value={formData.sections.hero.image}
                    onChange={handleHeroImageUpload}
                    helperText="Upload wide high-resolution image for hero showcase (PNG, JPG, WEBP)"
                  />
                </div>
              </div>
            </div>

            {/* 2. Feature Highlights Bar */}
            <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 space-y-4">
              <div className="border-b border-slate-700 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                  2. Feature Highlights Strip
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Four key highlights under the hero section.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {formData.sections.features.map((feat, index) => (
                  <div key={feat.id || index} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat.icon}
                        onChange={(e) => {
                          const updated = [...formData.sections.features];
                          updated[index].icon = e.target.value;
                          setFormData({
                            ...formData,
                            sections: { ...formData.sections, features: updated },
                          });
                        }}
                        className="w-10 px-2 py-1 text-center bg-slate-900 border border-slate-700 rounded-lg text-lg text-white"
                      />
                      <span className="text-[11px] font-bold text-slate-400">Feature #{index + 1}</span>
                    </div>

                    <input
                      type="text"
                      value={feat.title}
                      placeholder="Title"
                      onChange={(e) => {
                        const updated = [...formData.sections.features];
                        updated[index].title = e.target.value;
                        setFormData({
                          ...formData,
                          sections: { ...formData.sections, features: updated },
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                    />

                    <input
                      type="text"
                      value={feat.subtitle}
                      placeholder="Subtitle"
                      onChange={(e) => {
                        const updated = [...formData.sections.features];
                        updated[index].subtitle = e.target.value;
                        setFormData({
                          ...formData,
                          sections: { ...formData.sections, features: updated },
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-[11px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. About Section on Homepage & Image */}
            <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 space-y-4">
              <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                    3. About Section & Factory Story
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Story, manufacturing credentials, and workshop image.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Section Headline</label>
                    <input
                      type="text"
                      value={formData.sections.about_home.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sections: {
                            ...formData.sections,
                            about_home: { ...formData.sections.about_home, title: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Story Paragraph 1</label>
                    <textarea
                      rows={3}
                      value={formData.sections.about_home.p1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sections: {
                            ...formData.sections,
                            about_home: { ...formData.sections.about_home, p1: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Story Paragraph 2</label>
                    <textarea
                      rows={3}
                      value={formData.sections.about_home.p2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sections: {
                            ...formData.sections,
                            about_home: { ...formData.sections.about_home, p2: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white leading-relaxed"
                    />
                  </div>
                </div>

                {/* Upload About Section Image */}
                <div>
                  <ImageUploadInput
                    label="Upload Workshop / Manufacturing Image"
                    value={formData.sections.about_home.image}
                    onChange={handleWorkshopImageUpload}
                    helperText="Upload photo of College Street facility, workers or products"
                  />
                </div>
              </div>
            </div>

            {/* 4. Custom Size Callout Banner */}
            <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 space-y-4 text-xs">
              <div className="border-b border-slate-700 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                  4. Custom Size Callout Banner
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Banner Headline</label>
                  <input
                    type="text"
                    value={formData.sections.custom_size_banner.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sections: {
                          ...formData.sections,
                          custom_size_banner: {
                            ...formData.sections.custom_size_banner,
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Banner Button Text</label>
                  <input
                    type="text"
                    value={formData.sections.custom_size_banner.btn_text}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sections: {
                          ...formData.sections,
                          custom_size_banner: {
                            ...formData.sections.custom_size_banner,
                            btn_text: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Banner Description</label>
                  <textarea
                    rows={2}
                    value={formData.sections.custom_size_banner.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sections: {
                          ...formData.sections,
                          custom_size_banner: {
                            ...formData.sections.custom_size_banner,
                            description: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: BRANDING & LOGO UPLOAD
           ======================================================== */}
        {activeSubTab === 'branding' && (
          <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Brand Identity & Logo Configuration
            </h3>

            <div className="space-y-5 text-xs max-w-2xl">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Website Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Top Announcement Marquee Bar</label>
                <input
                  type="text"
                  value={formData.announcement_text}
                  onChange={(e) => setFormData({ ...formData, announcement_text: e.target.value })}
                  placeholder="🚚 Free Delivery in Kolkata..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              {/* Upload Logo Option */}
              <div>
                <ImageUploadInput
                  label="Upload Brand Logo File"
                  value={formData.logo_url}
                  onChange={handleLogoUpload}
                  helperText="Upload transparent PNG, SVG, or JPG logo file (e.g. Shaw Enterprise crest)"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow transition flex items-center gap-1.5"
                >
                  <span>💾 Save Brand & Logo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: BUSINESS IDENTITY & LOCATION
           ======================================================== */}
        {activeSubTab === 'business' && (
          <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Official Business Identity & Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Company / Store Name</label>
                <input
                  type="text"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Proprietor / Managing Director</label>
                <input
                  type="text"
                  value={formData.proprietor}
                  onChange={(e) => setFormData({ ...formData, proprietor: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Primary Hotline (Phone / WhatsApp)</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Secondary Contact Number</label>
                <input
                  type="text"
                  value={formData.phone_secondary}
                  onChange={(e) => setFormData({ ...formData, phone_secondary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Official Support Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={formData.gst_number}
                  onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Year Established</label>
                <input
                  type="text"
                  value={formData.established_year}
                  onChange={(e) => setFormData({ ...formData, established_year: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={formData.working_hours}
                  onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1 text-xs">Registered Office Address</label>
                <textarea
                  rows={2}
                  value={formData.registered_office_address || formData.address}
                  onChange={(e) => setFormData({ ...formData, registered_office_address: e.target.value, address: e.target.value })}
                  placeholder="44/1B, Beniatola Lane (College Street), Kolkata – 700009, W.B"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 text-xs">Workshop / Factory Address</label>
                <textarea
                  rows={2}
                  value={formData.workshop_address}
                  onChange={(e) => setFormData({ ...formData, workshop_address: e.target.value })}
                  placeholder="Balagarh Industrial, Suryapur, Navarand, Kolkata – 700121"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: PAYMENT APIS & UPI QR UPLOAD
           ======================================================== */}
        {activeSubTab === 'payments' && (
          <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Online Payments, UPI QR & Gateway API Credentials
            </h3>

            {/* UPI QR Settings */}
            <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Direct UPI QR Code Scan & Pay</h4>
                  <p className="text-xs text-slate-400">Allows customers to pay with Google Pay, PhonePe, Paytm, and BHIM</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.payment_settings.enable_upi_qr}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      payment_settings: {
                        ...formData.payment_settings,
                        enable_upi_qr: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5 accent-amber-400"
                />
              </div>

              {formData.payment_settings.enable_upi_qr && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs pt-2">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Official UPI VPA / ID</label>
                    <input
                      type="text"
                      value={formData.payment_settings.upi_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_settings: {
                            ...formData.payment_settings,
                            upi_id: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. 9933944007@upi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Customers will see dynamic payment links directed to this ID.
                    </p>
                  </div>

                  {/* Upload UPI QR Code */}
                  <div>
                    <ImageUploadInput
                      label="Upload Merchant UPI QR Code Image"
                      value={formData.payment_settings.upi_qr_url}
                      onChange={handleUpiQrUpload}
                      helperText="Upload official Google Pay / PhonePe QR screenshot"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Razorpay API Settings */}
            <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Razorpay Payment Gateway API</h4>
                  <p className="text-xs text-slate-400">Accept Credit/Debit Cards, NetBanking, and Wallets</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.payment_settings.enable_razorpay}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      payment_settings: {
                        ...formData.payment_settings,
                        enable_razorpay: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5 accent-amber-400"
                />
              </div>

              {formData.payment_settings.enable_razorpay && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Razorpay Key ID</label>
                    <input
                      type="text"
                      value={formData.payment_settings.razorpay_key_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_settings: {
                            ...formData.payment_settings,
                            razorpay_key_id: e.target.value,
                          },
                        })
                      }
                      placeholder="rzp_live_..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Razorpay Key Secret</label>
                    <input
                      type="password"
                      value={formData.payment_settings.razorpay_key_secret}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_settings: {
                            ...formData.payment_settings,
                            razorpay_key_secret: e.target.value,
                          },
                        })
                      }
                      placeholder="••••••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bank NEFT Details */}
            <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
              <h4 className="text-sm font-bold text-white">Bank NEFT / IMPS Account Credentials</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={formData.payment_settings.bank_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_settings: { ...formData.payment_settings, bank_name: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={formData.payment_settings.bank_account_no}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_settings: { ...formData.payment_settings, bank_account_no: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={formData.payment_settings.bank_ifsc}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_settings: { ...formData.payment_settings, bank_ifsc: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={formData.payment_settings.bank_branch}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_settings: { ...formData.payment_settings, bank_branch: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'catalog' && (
          <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 space-y-5">
            <div className="border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                Downloadable Product Catalog
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Upload the PDF customers should receive when they click “Download Catalog (PDF)” in the site footer. Maximum file size: 25MB.
              </p>
            </div>

            <div className="max-w-2xl space-y-4">
              {formData.catalog_pdf_url ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-emerald-300">Catalog PDF is uploaded</p>
                    <a
                      href={resolveImageUrl(formData.catalog_pdf_url, '')}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block truncate text-[11px] text-slate-300 underline"
                    >
                      {formData.catalog_pdf_filename || formData.catalog_pdf_url}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCatalogPdf}
                    disabled={isCatalogUploading}
                    className="self-start sm:self-auto rounded-lg px-3 py-2 text-[11px] font-bold text-rose-300 hover:bg-rose-500/10"
                  >
                    Remove Catalog
                  </button>
                </div>
              ) : (
                <p className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 text-xs text-slate-400">
                  No catalog PDF is uploaded yet. The footer download link will become available after you upload one.
                </p>
              )}

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-xs font-black text-slate-950 transition hover:bg-amber-300">
                <span>{isCatalogUploading ? 'Uploading PDF…' : formData.catalog_pdf_url ? 'Replace Catalog PDF' : 'Upload Catalog PDF'}</span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleCatalogPdfUpload}
                  disabled={isCatalogUploading}
                  className="sr-only"
                />
              </label>

              {catalogUploadError && (
                <p role="alert" className="text-xs font-bold text-rose-400">
                  {catalogUploadError}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: SOCIAL CHANNELS
           ======================================================== */}
        {activeSubTab === 'social' && (
          <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Social Media Channels & Direct Messengers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Facebook Page URL</label>
                <input
                  type="url"
                  value={formData.social_links.facebook}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social_links: { ...formData.social_links, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Instagram Profile URL</label>
                <input
                  type="url"
                  value={formData.social_links.instagram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social_links: { ...formData.social_links, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">X / Twitter Profile URL</label>
                <input
                  type="url"
                  value={formData.social_links.twitter || formData.social_links.youtube || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social_links: {
                        ...formData.social_links,
                        twitter: e.target.value,
                        youtube: formData.social_links.youtube || '',
                      },
                    })
                  }
                  placeholder="https://x.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">WhatsApp Quick Chat Link</label>
                <input
                  type="text"
                  value={formData.social_links.whatsapp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social_links: { ...formData.social_links, whatsapp: e.target.value },
                    })
                  }
                  placeholder="https://wa.me/919933944007"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-8 py-3.5 rounded-xl shadow-xl transition uppercase tracking-wider"
          >
            Save All Settings & Uploads
          </button>
        </div>
      </form>
    </div>
  );
}
