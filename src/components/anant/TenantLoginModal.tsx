'use client';

import React, { useState } from 'react';
import {
  Lock,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Building2,
  Bell,
  Mail,
} from 'lucide-react';
import { initiateTenantLoginAction, verifyTenantOtpAndNotifyAction } from '../../app/actions/tenant-auth.ts';

interface TenantLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (redirectUrl: string) => void;
}

export function TenantLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: TenantLoginModalProps) {
  const [step, setStep] = useState<'CREDENTIALS' | 'OTP'>('CREDENTIALS');
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [subdomain, setSubdomain] = useState('kalbharavesus');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInitiateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await initiateTenantLoginAction(emailOrId, password);
      if (!res.success) {
        setError(res.error || 'Login failed.');
        setLoading(false);
        return;
      }
      setSuccess(res.message);
      setStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await verifyTenantOtpAndNotifyAction(emailOrId, otpCode, subdomain);
      if (!res.success || !res.data) {
        setError(res.error || 'OTP verification failed.');
        setLoading(false);
        return;
      }

      setSuccess('Authenticated successfully! Admin alert dispatched via WhatsApp/Email webhook.');
      setTimeout(() => {
        onLoginSuccess(res.data.redirectUrl);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/85 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-100">
                Temple Admin Secure Login (2-Step OTP)
              </h2>
              <p className="text-[11px] text-slate-400">
                Subdomain Tenant Authentication &amp; Admin Audit Alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {step === 'CREDENTIALS' ? (
            <form onSubmit={handleInitiateLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Temple Subdomain (सबडोमेन)
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <input
                    type="text"
                    required
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    placeholder="kalbharavesus"
                    className="w-full bg-transparent px-3 py-2.5 text-xs text-amber-300 font-mono focus:outline-none"
                  />
                  <span className="bg-slate-900 px-3 py-2.5 text-[11px] text-slate-400 font-mono border-l border-slate-800">
                    .anant.com
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Admin Email / User ID (विश्वस्त ईमेल किंवा आयडी)
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute left-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
                    placeholder="trust@kalbhairav.org"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Secure Password (पासवर्ड)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !emailOrId || !password}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                <span>{loading ? 'Validating Credentials...' : 'Proceed to Step 2: OTP Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 font-bold">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-100">Enter 6-Digit Admin OTP</h3>
                <p className="text-xs text-slate-400">
                  Dispatched to registered WhatsApp &amp; SMS device.
                </p>
                <p className="text-[10px] text-emerald-400 font-mono">(Demo Code: 123456)</p>
              </div>

              <div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full bg-slate-950 border-2 border-amber-500/50 rounded-2xl px-4 py-3 text-center text-xl text-amber-400 font-mono font-black tracking-widest focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Real-Time Admin Alert Notice */}
              <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-2xl text-[11px] text-amber-200 flex items-start gap-2">
                <Bell className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
                <span>
                  <strong>Real-Time Admin Alert:</strong> Upon valid OTP entry, a webhook notification is instantly sent to the Primary Temple Admin: <span className="italic">"Notification: User logged into [{subdomain}.anant.com]"</span>.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating & Notifying Admin...' : 'Verify OTP & Enter Subdomain Dashboard'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
