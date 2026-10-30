import React, { useState, useEffect, useRef } from 'react';

/**
 * Dynamic Testimonial Carousel Component for Shaw Enterprise
 * Renders client reviews, designations, and star ratings directly from the database.
 * Modeled after high institutional authority visual design.
 */
export default function TestimonialCarousel({ testimonials = [] }) {
    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const autoplayRef = useRef(null);

    // Auto-advance slides every 6 seconds when not paused by user hover
    useEffect(() => {
        if (!isHovered && testimonials.length > 1) {
            autoplayRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % testimonials.length);
            }, 6000);
        }

        return () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current);
            }
        };
    }, [isHovered, testimonials.length]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const activeItem = testimonials[currentIndex];

    return (
        <section 
            className="py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Architectural Grid Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20 mb-4">
                        Institutional Trust & Credibility
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Endorsed by Leading Schools, Universities & Corporates
                    </h2>
                    <p className="mt-4 text-slate-300 text-lg">
                        Over 25+ years delivering heavy-duty writing boards and academic furniture across Eastern India.
                    </p>
                </div>

                {/* Main Carousel Card Container */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Testimonial Card */}
                    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/60 p-8 sm:p-12 shadow-2xl transition-all duration-500 min-h-[340px] flex flex-col justify-between">
                        {/* Quote Icon & Rating */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="text-amber-400">
                                    {/* Star Rating Render */}
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-5 h-5 ${
                                                    i < activeItem.rating
                                                        ? 'text-amber-400 fill-amber-400'
                                                        : 'text-slate-600 fill-slate-600'
                                                }`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        <span className="ml-2 text-sm font-semibold text-slate-300">
                                            {activeItem.rating}.0 / 5.0
                                        </span>
                                    </div>
                                </div>
                                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded bg-blue-900/60 text-blue-200 border border-blue-700/50">
                                    Verified Institutional Buyer
                                </span>
                            </div>

                            {/* Review Text */}
                            <blockquote className="text-lg sm:text-xl text-slate-100 font-normal leading-relaxed italic relative">
                                <span className="text-4xl text-amber-400/40 font-serif leading-none absolute -left-4 -top-2">
                                    “
                                </span>
                                <p className="relative z-10 pl-2">
                                    {activeItem.review_text}
                                </p>
                            </blockquote>
                        </div>

                        {/* Author Profile */}
                        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-700/60">
                            <img
                                src={
                                    activeItem.client_avatar
                                        ? (activeItem.client_avatar.startsWith('data:') || activeItem.client_avatar.startsWith('http')
                                            ? activeItem.client_avatar
                                            : `/storage/${activeItem.client_avatar.replace(/^\//, '')}`)
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                              activeItem.client_name
                                          )}&background=1e293b&color=f8fafc&bold=true`
                                }
                                alt={activeItem.client_name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-amber-400/40 shadow-md"
                            />
                            <div>
                                <h4 className="text-lg font-bold text-white tracking-wide">
                                    {activeItem.client_name}
                                </h4>
                                <p className="text-sm text-slate-400">
                                    {activeItem.client_designation && `${activeItem.client_designation}, `}
                                    <span className="text-slate-300 font-medium">
                                        {activeItem.organization_name}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    {testimonials.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                aria-label="Previous testimonial"
                                className="absolute -left-5 sm:-left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-amber-400 hover:border-amber-400/50 hover:bg-slate-900 flex items-center justify-center shadow-lg transition-all focus:outline-none"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={handleNext}
                                aria-label="Next testimonial"
                                className="absolute -right-5 sm:-right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-amber-400 hover:border-amber-400/50 hover:bg-slate-900 flex items-center justify-center shadow-lg transition-all focus:outline-none"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Dot Pagination */}
                    {testimonials.length > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${
                                        idx === currentIndex
                                            ? 'w-8 bg-amber-400'
                                            : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                                    }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

