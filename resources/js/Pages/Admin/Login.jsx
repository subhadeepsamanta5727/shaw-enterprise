import React, { useState } from 'react';
import { adminLogin } from '../../store';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@shawenterprise.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const res = adminLogin(email, password);
      setIsLoading(false);
      if (res.success) {
        if (onLoginSuccess) {
          onLoginSuccess();
        } else if (window.__navigate) {
          window.__navigate('/admin/dashboard');
        }
      } else {
        setError(res.error || 'Invalid credentials');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Decorative gradient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <a href="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl">
            SE
          </div>
          <div className="text-left">
            <span className="text-2xl font-black tracking-tight text-white uppercase block">
              Shaw Enterprise
            </span>
            <span className="block text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              Institutional Operations & Works Portal
            </span>
          </div>
        </a>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Filament Administration Hub • Central Works Division</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
              <span className="text-rose-400 font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 tracking-wider mb-2">
                Official Staff Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shawenterprise.com"
                className="w-full text-sm px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-bold uppercase text-slate-300 tracking-wider mb-2">
                Access Key / Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm px-4 py-3 pr-12 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((isVisible) => !isVisible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-amber-400 transition"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.7 10.7 0 0112 5c5 0 8.3 4.5 9 7-.3 1.1-1.1 2.5-2.4 3.7M6.2 6.2C3.9 7.7 2.4 10 2 12c.7 2.5 4 7 10 7 1.3 0 2.5-.3 3.5-.7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Works Key...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Hub</span>
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <a
              href="/"
              className="text-xs font-bold text-slate-400 hover:text-amber-400 transition flex items-center justify-center gap-1.5"
            >
              <span>← Back to Public Website</span>
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-slate-500 text-xs">
          <span>Protected by 256-Bit TLS • Shaw Enterprise Works Kolkata • Strict Mode Compliant</span>
        </div>
      </div>
    </div>
  );
}
