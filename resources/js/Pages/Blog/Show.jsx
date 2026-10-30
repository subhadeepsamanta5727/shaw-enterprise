import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useStore } from '../../store';
import { resolveImageUrl } from '../../services/api';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import CartDrawer from '../../Components/CartDrawer';
import BulkQuoteModal from '../../Components/BulkQuoteModal';
import CustomSizeModal from '../../Components/CustomSizeModal';
import BrochureModal from '../../Components/BrochureModal';
import WhatsAppFloatingButton from '../../Components/WhatsAppFloatingButton';

const resolveImg = (src, fallback) => resolveImageUrl(src, fallback);

function VideoEmbedPlayer({ videoUrl, youtubeEmbedId, title }) {
  if (youtubeEmbedId) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 mb-10">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeEmbedId}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  if (videoUrl && videoUrl.includes('vimeo.com')) {
    const vimeoId = videoUrl.split('/').filter(Boolean).pop();
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 mb-10">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return null;
}

export default function BlogShow({ blog, relatedBlogs = [] }) {
  const [store] = useStore();
  const settings = store.settings || {};
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  const formattedDate = new Date(blog.published_at || blog.created_at || Date.now()).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const displayRelated = relatedBlogs.length > 0 ? relatedBlogs : (store.blogs || []).filter(b => b.id !== blog.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">
      <Head>
        <title>{blog.meta_title || `${blog.title} | ${settings.site_name || 'Shaw Enterprise'}`}</title>
        <meta name="description" content={blog.meta_description || blog.title} />
      </Head>

      {/* Standard E-Commerce Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenEnquiry={() => setIsQuoteModalOpen(true)}
      />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 text-xs py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-slate-500">
          <Link href="/" className="hover:text-blue-900">Home</Link>
          <span>/</span>
          <Link href="/blogs" className="hover:text-blue-900">Vlogs & Guides</Link>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate">{blog.title}</span>
        </div>
      </div>

      {/* Article Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article>
          {/* Header */}
          <header className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold mb-4">
              <span>🏭 Shaw Enterprise Kolkata</span>
              <span>•</span>
              <span>{blog.reading_time || 4} min read</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              {blog.title}
            </h1>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500 font-semibold">
              <span>Published on {formattedDate}</span>
              <span>•</span>
              <span className="text-slate-700">By Shaw Enterprise Editorial Team</span>
            </div>
          </header>

          {/* Video Embed Player */}
          {(blog.video_url || blog.youtube_embed_id) && (
            <VideoEmbedPlayer
              videoUrl={blog.video_url}
              youtubeEmbedId={blog.youtube_embed_id}
              title={blog.title}
            />
          )}

          {/* Main Hero Image (if no video or as header) */}
          {!blog.video_url && !blog.youtube_embed_id && blog.thumbnail_image && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 mb-10 bg-slate-900">
              <img
                src={resolveImg(blog.thumbnail_image)}
                alt={blog.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div
            className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Author / Factory Card */}
          <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center gap-5 shadow-sm">
            <div className="w-14 h-14 bg-blue-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
              SE
            </div>
            <div>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-widest block">
                Direct College Street Workshop
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Shaw Enterprise Kolkata</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                We manufacture and wholesale writing boards, stands, and classroom furniture across West Bengal and India. Direct wholesale inquiries welcome at <strong>{settings.phone || '+91 9933944007'}</strong>.
              </p>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {displayRelated.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <h3 className="text-xl font-black text-slate-900 mb-6">Related Guides & Vlogs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayRelated.map((item) => (
                <Link
                  key={item.id}
                  href={`/blogs/${item.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={resolveImg(item.thumbnail_image)}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {item.video_url && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        VLOG
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition line-clamp-2">
                      {item.title}
                    </h4>
                    <span className="mt-3 text-[11px] font-bold text-blue-900">
                      Read Guide →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Comprehensive Market-Standard Footer */}
      <Footer
        onOpenCustomSize={() => setIsCustomSizeOpen(true)}
        onOpenBrochure={() => setIsBrochureOpen(true)}
        onOpenEnquiry={() => setIsQuoteModalOpen(true)}
      />

      {/* Modals & Drawers */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <BulkQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        product={store.products?.[0]}
      />
      <CustomSizeModal isOpen={isCustomSizeOpen} onClose={() => setIsCustomSizeOpen(false)} />
      <BrochureModal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)} />
      <WhatsAppFloatingButton />
    </div>
  );
}
