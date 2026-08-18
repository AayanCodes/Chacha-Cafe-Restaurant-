import React, { useState } from 'react';
import { ChefHat, Lock, Mail, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, KeyRound, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SupabaseConnectionStatus } from '../../components/SupabaseConnectionStatus';

export const AdminLogin: React.FC = () => {
  const { signIn, isAdmin, adminCredentials } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to dashboard
  if (isAdmin) {
    window.location.href = '/admin/dashboard';
    return null;
  }

  const handleQuickFill = () => {
    setEmail(adminCredentials.email || 'aayanmalik3114@gmail.com');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email address and password.');
      return;
    }

    setLoading(true);
    const { error: err } = await signIn(email.trim(), password.trim());
    setLoading(false);

    if (err) {
      setError(err);
    } else {
      window.location.href = '/admin/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F8F5EE] font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#121215] border border-red-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-red-600 to-red-950 flex items-center justify-center mx-auto border border-red-500/40 shadow-xl shadow-red-600/30">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-black uppercase text-[#F8F5EE] tracking-tight">
            CHACHA CAFE
          </h1>
          <p className="text-xs font-mono font-bold text-red-500 tracking-widest uppercase">
            RESTAURANT OWNER CMS PORTAL
          </p>
        </div>

        {/* Supabase Connection Status Component */}
        <SupabaseConnectionStatus />

        {/* Login Info Toggle Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-[#CBD5E1]/70 px-1">
          <span>Owner Credentials</span>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="text-[11px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" /> {showHelp ? 'Hide Info' : 'Login Info'}
          </button>
        </div>

        {/* Optional Admin Credential Guidance Box */}
        {showHelp && (
          <div className="p-4 rounded-2xl bg-[#18181B] border border-red-500/30 text-xs font-mono space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between text-[#F8F5EE] font-bold border-b border-red-500/20 pb-2">
              <span className="flex items-center gap-1.5 text-red-400">
                <KeyRound className="w-4 h-4" /> Owner Account Info
              </span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-[10px] font-bold uppercase transition-all"
              >
                Auto-Fill Email
              </button>
            </div>
            <p className="text-[#CBD5E1]/80 leading-relaxed font-sans text-[11px]">
              Authentication uses your live Supabase project. Enter your registered administrator email and password configured in your Supabase Auth Users dashboard.
            </p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2 tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-red-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email address"
                className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-[#F8F5EE] placeholder-[#CBD5E1]/40 focus:outline-none focus:border-red-500 transition-colors font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#CBD5E1] mb-2 tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-red-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#18181B] border border-red-500/30 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-[#F8F5EE] placeholder-[#CBD5E1]/40 focus:outline-none focus:border-red-500 transition-colors font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#CBD5E1]/60 hover:text-red-400 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-widest shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
              </>
            ) : (
              <>
                Sign In to Admin Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <a
            href="/"
            className="text-xs font-mono text-[#CBD5E1]/70 hover:text-white transition-colors"
          >
            ← Back to Public Website
          </a>
        </div>
      </div>
    </div>
  );
};

