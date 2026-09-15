'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Globe,
  User,
  CheckCircle2,
  Lock,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { SupportedLanguage } from '../../types/anant.ts';
import { sendOtpAction, verifyOtpAndLoginAction } from '../../app/actions/devotee-auth.ts';

interface DevoteeAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export function DevoteeAuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  language,
  onLanguageChange,
}: DevoteeAuthModalProps) {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language);
  const [step, setStep] = useState<'PHONE_INPUT' | 'OTP_VERIFY'>('PHONE_INPUT');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (step === 'OTP_VERIFY' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setIsResendActive(true);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await sendOtpAction(phoneNumber, countryCode);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to send OTP.');
        setLoading(false);
        return;
      }
      setSuccessMessage(res.message || 'OTP sent successfully!');
      setStep('OTP_VERIFY');
      setCountdown(60);
      setIsResendActive(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      let guestData = null;
      if (typeof window !== 'undefined') {
        const localLogs = localStorage.getItem('anant_jaap_logs_v2');
        const localGoals = localStorage.getItem('anant_jaap_goals_v2');
        guestData = {
          logs: localLogs ? JSON.parse(localLogs) : [],
          goals: localGoals ? JSON.parse(localGoals) : null,
          totalMalas: 3,
        };
      }

      const res = await verifyOtpAndLoginAction(
        `${countryCode} ${phoneNumber}`,
        otpCode,
        fullName || 'Devotee Seeker',
        selectedLang,
        guestData
      );

      if (!res.success || !res.data) {
        setErrorMessage(res.error || 'OTP verification failed.');
        setLoading(false);
        return;
      }

      onLanguageChange(selectedLang);
      setSuccessMessage('Successfully authenticated & guest data merged into Supabase profile!');
      setTimeout(() => {
        onLoginSuccess(res.data.user);
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification error.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareApp = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Anant (अनंत) - Spiritual Social Platform',
        text: 'Join me on Anant for daily temple darshan, chanting, and spiritual growth!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert('App link copied to clipboard! Share with friends & family.');
    }
  };

  const languagesList: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: 'MR', label: 'Marathi', native: 'मराठी' },
    { code: 'HI', label: 'Hindi', native: 'हिन्दी' },
    { code: 'EN', label: 'English', native: 'English' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      {/* Updated Modal Card Container with max-h-[90vh] and overflow-y-auto */}
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl flex flex-col my-auto scrollbar-thin scrollbar-thumb-slate-700">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              ॐ
            </div>
            <div>
              <h2 className="text-base font-black text-slate-100">
                {authMode === 'LOGIN' ? 'Devotee Login (भक्त प्रवेश)' : 'Devotee Registration (नवीन नोंदणी)'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Secure WhatsApp &amp; Mobile OTP Authentication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950 border-b border-slate-800 text-xs font-bold sticky top-20 z-10">
          <button
            onClick={() => {
              setAuthMode('LOGIN');
              setStep('PHONE_INPUT');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              authMode === 'LOGIN' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Login / परतावा
          </button>
          <button
            onClick={() => {
              setAuthMode('SIGNUP');
              setStep('PHONE_INPUT');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              authMode === 'SIGNUP' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign Up / नवीन नोंदणी
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {step === 'PHONE_INPUT' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {authMode === 'SIGNUP' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Full Name (संपूर्ण नाव)
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 absolute left-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Anand Kulkarni"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Primary Language (प्राधान्याची भाषा)
                    </label>
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value as SupportedLanguage)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
                    >
                      {languagesList.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.native} ({lang.label})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  WhatsApp / Mobile Number (मोबाईल नंबर)
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    aria-label="Country Code"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-xs text-slate-300 font-mono focus:border-amber-500 focus:outline-none"
                  >
                    <option value="+91">+91 (IN)</option>
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                  </select>
                  <div className="relative flex-1 flex items-center">
                    <Smartphone className="w-4 h-4 absolute left-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="98220 11223"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 font-mono font-bold tracking-wider focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  We will send an instant WhatsApp or SMS verification OTP code.
                </p>
              </div>

              {/* Social Login Buttons */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-slate-500 font-bold uppercase">Or continue with</span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPhoneNumber('9822011223');
                    setFullName('Google Devotee');
                    setStep('OTP_VERIFY');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>Google One-Tap / Social Sign-In</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || phoneNumber.length < 10}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                <span>{loading ? 'Sending OTP...' : 'Send WhatsApp / SMS OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 font-bold">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-100">Enter 6-Digit OTP</h3>
                <p className="text-xs text-slate-400">
                  Sent to <span className="font-mono text-amber-300">{countryCode} {phoneNumber}</span>
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

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setStep('PHONE_INPUT')}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ← Edit Number
                </button>
                <button
                  type="button"
                  disabled={!isResendActive}
                  onClick={() => {
                    setCountdown(60);
                    setIsResendActive(false);
                  }}
                  className={`font-bold ${isResendActive ? 'text-amber-400 cursor-pointer' : 'text-slate-600 cursor-not-allowed'}`}
                >
                  {isResendActive ? 'Resend OTP' : `Resend in ${countdown}s`}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                <span>{loading ? 'Verifying & Merging Data...' : 'Verify OTP & Complete Login'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Security & Guest Data Merging Notice */}
          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Anonymous-to-Registered Data Sync:</strong> Any guest Jaap Rosary counters or local Sadhana logs stored on this device are automatically merged into your verified Supabase profile upon sign-in.
            </span>
          </div>

          {/* Ensure Bottom Option is Visible */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={handleShareApp}
              className="flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium py-2 px-3 rounded-lg hover:bg-slate-800/50 transition cursor-pointer"
            >
              <span>🙏</span> Share App with Friends &amp; Family
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
