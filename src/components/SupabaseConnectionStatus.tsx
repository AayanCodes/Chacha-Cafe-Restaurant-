import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Server, Key } from 'lucide-react';
import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from '../lib/supabase';

export const SupabaseConnectionStatus: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Directly check import.meta.env values
  const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const hasUrl = Boolean(rawUrl && rawUrl.trim() && !rawUrl.includes('your-project-id'));
  const hasAnonKey = Boolean(rawAnonKey && rawAnonKey.trim() && !rawAnonKey.includes('your-actual-anon-key'));

  // Format masked display for diagnostics without leaking keys
  const getMaskedUrl = () => {
    if (!rawUrl) return 'Not Detected';
    try {
      const url = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
      return url.hostname;
    } catch {
      return `${rawUrl.slice(0, 12)}...`;
    }
  };

  const getMaskedKey = () => {
    if (!rawAnonKey) return 'Not Detected';
    if (rawAnonKey.length < 16) return 'Invalid / Too Short';
    return `${rawAnonKey.slice(0, 6)}••••••••${rawAnonKey.slice(-4)} (${rawAnonKey.length} chars)`;
  };

  return (
    <div className={`rounded-2xl border transition-all ${isSupabaseConfigured ? 'bg-[#18181B] border-emerald-500/30' : 'bg-red-950/40 border-red-500/40'} ${className}`}>
      {/* Main Status Header */}
      <div className="p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            {isSupabaseConfigured ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-mono font-bold text-[#F8F5EE] flex items-center gap-1.5 truncate">
              {isSupabaseConfigured ? 'Supabase Auth Online' : 'Supabase Not Configured'}
            </p>
            <p className="text-[10px] font-mono text-[#CBD5E1]/60 truncate">
              {isSupabaseConfigured ? 'Production environment credentials active' : 'Missing required Vite environment variables'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-mono text-[#CBD5E1] hover:text-white border border-white/10 flex items-center gap-1 transition-colors"
          aria-expanded={isExpanded}
        >
          <span>Diagnostics</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Diagnostic Panel */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-white/10 space-y-3 animate-fadeIn text-xs font-mono">
          <div className="space-y-2 pt-2">
            {/* VITE_SUPABASE_URL Status */}
            <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-black/40 border border-white/5">
              <div className="flex items-center gap-2 min-w-0">
                <Server className="w-3.5 h-3.5 text-[#CBD5E1]/60 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-[#F8F5EE]">VITE_SUPABASE_URL</div>
                  <div className="text-[10px] text-[#CBD5E1]/60 truncate font-mono">
                    {getMaskedUrl()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                {hasUrl ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Loaded
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-bold">
                    <XCircle className="w-3.5 h-3.5" /> Missing
                  </span>
                )}
              </div>
            </div>

            {/* VITE_SUPABASE_ANON_KEY Status */}
            <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-black/40 border border-white/5">
              <div className="flex items-center gap-2 min-w-0">
                <Key className="w-3.5 h-3.5 text-[#CBD5E1]/60 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-[#F8F5EE]">VITE_SUPABASE_ANON_KEY</div>
                  <div className="text-[10px] text-[#CBD5E1]/60 truncate font-mono">
                    {getMaskedKey()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                {hasAnonKey ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Loaded
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-bold">
                    <XCircle className="w-3.5 h-3.5" /> Missing
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isSupabaseConfigured && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/30 text-[11px] text-[#F8F5EE] space-y-1 font-sans">
              <div className="font-bold font-mono text-red-400 flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5" /> Vercel Setup Note
              </div>
              <p className="text-[#CBD5E1]/80 leading-relaxed text-[11px]">
                In your Vercel Project Settings &rarr; <strong>Environment Variables</strong>, verify that both <code className="text-red-300 font-mono text-[10px]">VITE_SUPABASE_URL</code> and <code className="text-red-300 font-mono text-[10px]">VITE_SUPABASE_ANON_KEY</code> are present in <strong>Production</strong>. When environment variables are added or changed in Vercel, a new <strong>Deployment</strong> (or Redeploy) is required to bake them into the client bundle.
              </p>
            </div>
          )}

          {isSupabaseConfigured && (
            <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-300/90 flex items-center gap-2 font-sans">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ready for admin authentication. All sessions securely verified via Supabase Auth.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

