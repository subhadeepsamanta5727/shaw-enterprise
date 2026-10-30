import React, { useState, useRef } from 'react';
import { api, resolveImageUrl } from '../services/api.js';

/**
 * Modern Image Upload Component
 * Uploads images directly to the PHP MySQL backend's local uploads folder.
 * Falls back to high-res data URL if backend is temporarily offline.
 */
export default function ImageUploadInput({
  label = 'Upload Image',
  value = '',
  onChange,
  helperText = 'PNG, JPG, WEBP, or SVG (Saved to local server folder)',
  className = '',
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    setErrorMsg('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('File is larger than 15MB. Please choose a smaller image.');
      return;
    }

    setIsProcessing(true);

    // Try uploading to backend PHP server local uploads folder
    try {
      const uploadRes = await api.uploadImage(file);
      if (uploadRes && uploadRes.url) {
        setIsProcessing(false);
        if (onChange) {
          onChange(uploadRes.url);
        }
        return;
      }
    } catch (backendErr) {
      console.warn('Backend upload server not reached, using local fallback:', backendErr.message);
    }

    // SVGs do not need canvas rasterization
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setIsProcessing(false);
        if (onChange && e.target?.result) {
          onChange(e.target.result);
        }
      };
      reader.onerror = () => {
        setIsProcessing(false);
        setErrorMsg('Failed to read SVG file.');
      };
      reader.readAsDataURL(file);
      return;
    }

    // For all bitmap formats (PNG, JPG, WEBP), downscale via Canvas to avoid localStorage QuotaExceededError
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result;
      if (!rawDataUrl) {
        setIsProcessing(false);
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 1000;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // For PNGs maintain transparency, for others use jpeg compression
          const isPng = file.type === 'image/png';
          const mime = isPng ? 'image/png' : 'image/jpeg';
          const quality = isPng ? 0.9 : 0.85;
          const compressed = canvas.toDataURL(mime, quality);

          setIsProcessing(false);
          if (onChange) {
            onChange(compressed);
          }
        } catch (err) {
          console.warn('Canvas optimization fallback:', err);
          setIsProcessing(false);
          if (onChange) onChange(rawDataUrl);
        }
      };
      img.onerror = () => {
        setIsProcessing(false);
        if (onChange) onChange(rawDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMsg('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Resolve display source for preview (handles uploads, storage, data URLs, external HTTP links)
  const displaySrc = resolveImageUrl(value, 'https://placehold.co/150x150/1e293b/ffffff?text=Image');

  return (
    <div className={`space-y-2 text-xs font-sans ${className}`}>
      {label && <label className="block font-bold text-slate-300">{label}</label>}

      {/* Image Preview Card (if an image is selected) */}
      {value ? (
        <div className="relative p-3 bg-slate-950 border border-slate-700 rounded-2xl flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
            <img
              src={displaySrc}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/150x150/1e293b/ffffff?text=Image';
              }}
            />
          </div>

          <div className="flex-1 space-y-1 overflow-hidden">
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <span>✓</span> Image Attached
            </span>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              {value.startsWith('data:')
                ? `Uploaded File (Base64 ${Math.round(value.length / 1024)} KB)`
                : value}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-rose-400 hover:text-rose-300 font-bold px-2 py-1 text-[11px] transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Dropzone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-amber-400 bg-amber-400/10'
              : 'border-slate-700 bg-slate-950/60 hover:border-slate-500 hover:bg-slate-900/60'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-lg font-black shadow-inner">
            📷
          </div>
          <div>
            <span className="font-bold text-white block">
              Click to browse or drag & drop image here
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {helperText}
            </span>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {isProcessing && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 flex items-center gap-2 text-xs font-bold animate-pulse">
          <span className="animate-spin inline-block">⏳</span> Optimizing and preparing image...
        </div>
      )}

      {errorMsg && (
        <p className="text-[11px] font-bold text-rose-400 animate-fade-in">
          ⚠️ {errorMsg}
        </p>
      )}

      {/* Fallback URL toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-slate-400 hover:text-amber-400 underline font-semibold transition"
        >
          {showUrlInput ? 'Hide web URL option' : 'Or paste an image web link'}
        </button>

        {showUrlInput && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/... or /storage/..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        )}
      </div>
    </div>
  );
}
