import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles,
  UserPlus,
  Building2,
  User,
  Calendar,
  Clock,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { User as AppUser } from '../../types.ts';

interface MobileAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AppUser, token?: string) => void;
  onOpenTrustRegister?: () => void;
}

export function MobileAuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenTrustRegister,
}: MobileAuthModalProps) {
  const [authMode, setAuthMode] = useState<'OTP' | 'ONBOARD' | 'EMAIL'>('ONBOARD');
  const [step, setStep] = useState<'FORM' | 'ENTER_OTP'>('FORM');
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [simulatedIncomingSms, setSimulatedIncomingSms] = useState<string | null>(null);

  // Expanded Onboarding state
  const [tenantType, setTenantType] = useState<'DEVOTEE' | 'TEMPLE_TRUST'>('DEVOTEE');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'>('MALE');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  
  // Optional Vedic Kundali/Horoscope fields
  const [showVedicFields, setShowVedicFields] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');

  // Temple Trust specific fields
  const [trustName, setTrustName] = useState('');
  const [trustRegNo, setTrustRegNo] = useState('');
  const [trustDeity, setTrustDeity] = useState('');

  // Email login state
  const [password, setPassword] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    const rawMobile = mobileNumber.trim();
    if (!rawMobile || rawMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (authMode === 'ONBOARD') {
      // Validate mandatory fields
      if (!firstName.trim() || !lastName.trim()) {
        setErrorMessage('Mandatory: Please provide both First Name and Last Name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Mandatory: Please provide a valid Email Address.');
        return;
      }
      if (!location.trim()) {
        setErrorMessage('Mandatory: Please provide your current Location (City/State).');
        return;
      }
      if (tenantType === 'TEMPLE_TRUST' && !trustName.trim()) {
        setErrorMessage('Mandatory for Temple Trust: Please enter the official Temple/Trust Name.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const fullMobile = `${countryCode}${rawMobile.replace(/\D/g, '')}`;
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: fullMobile }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error?.message || 'Failed to send OTP.');
        if (data.cooldownSeconds) setCooldown(data.cooldownSeconds);
        return;
      }

      setInfoMessage(data.message || 'OTP sent successfully.');
      setCooldown(data.cooldownSeconds || 60);
      setStep('ENTER_OTP');
      setOtpDigits(['', '', '', '', '', '']);

      if (data.testOtp) {
        setSimulatedIncomingSms(data.testOtp);
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setOtpDigits(newDigits);
    const nextIdx = Math.min(pastedData.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    setErrorMessage('');
    const finalCode = codeToVerify || otpDigits.join('');
    if (finalCode.length < 6) {
      setErrorMessage('Please enter all 6 digits of the OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      const fullMobile = `${countryCode}${mobileNumber.replace(/\D/g, '')}`;
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: fullMobile,
          code: finalCode,
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          gender: gender || undefined,
          email: email.trim() || undefined,
          location: location.trim() || undefined,
          dateOfBirth: dateOfBirth || undefined,
          timeOfBirth: timeOfBirth || undefined,
          placeOfBirth: placeOfBirth || undefined,
          tenantType,
          trustName: trustName.trim() || undefined,
          trustRegistrationNumber: trustRegNo.trim() || undefined,
          trustDeityName: trustDeity.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error?.message || 'OTP verification failed.');
        return;
      }

      onLoginSuccess(data.data.user, data.data.accessToken);
      onClose();
    } catch {
      setErrorMessage('Network error during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error?.message || 'Invalid credentials.');
        return;
      }

      onLoginSuccess(data.data.user, data.data.accessToken);
      onClose();
    } catch {
      setErrorMessage('Failed to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillSampleDevotee = () => {
    setFirstName('Aarav');
    setLastName('Sharma');
    setGender('MALE');
    setEmail('aarav.sharma@anant.devotee');
    setMobileNumber('9876543210');
    setLocation('Varanasi, Uttar Pradesh');
    setDateOfBirth('1988-04-15');
    setTimeOfBirth('06:30');
    setPlaceOfBirth('Kashi (Varanasi)');
    setShowVedicFields(true);
    setTenantType('DEVOTEE');
  };

  const fillSampleTrust = () => {
    setFirstName('Ramesh');
    setLastName('Patil');
    setGender('MALE');
    setEmail('trustee@pandharpurmandir.org');
    setMobileNumber('9822109876');
    setLocation('Pandharpur, Maharashtra');
    setTenantType('TEMPLE_TRUST');
    setTrustName('Shree Vitthal Rukmini Mandir Samiti');
    setTrustRegNo('PTR-MAH-1885-SOLAPUR');
    setTrustDeity('Lord Vitthala & Rakhumai');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-950/40 overflow-hidden text-slate-100 my-4 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-800 bg-gradient-to-r from-amber-950/40 to-slate-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              ॐ
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                {authMode === 'ONBOARD' ? 'Devotee & Trust Onboarding' : 'Anant Devotee Sign In'}
              </h2>
              <p className="text-[10px] text-amber-400">Sanatan Dharma Spiritual Community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (Onboarding vs Quick OTP vs Email) */}
        <div className="grid grid-cols-3 p-1.5 mx-5 sm:mx-6 mt-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl shrink-0 gap-1 text-[11px]">
          <button
            onClick={() => {
              setAuthMode('ONBOARD');
              setStep('FORM');
              setErrorMessage('');
            }}
            className={`py-2 px-2 font-semibold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              authMode === 'ONBOARD'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="truncate">New Devotee</span>
          </button>
          <button
            onClick={() => {
              setAuthMode('OTP');
              setStep('FORM');
              setErrorMessage('');
            }}
            className={`py-2 px-2 font-semibold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              authMode === 'OTP'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="truncate">Quick OTP</span>
          </button>
          <button
            onClick={() => {
              setAuthMode('EMAIL');
              setStep('FORM');
              setErrorMessage('');
            }}
            className={`py-2 px-2 font-semibold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
              authMode === 'EMAIL'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">Email Sign In</span>
          </button>
        </div>

        {/* Simulated SMS Notification Banner */}
        {simulatedIncomingSms && step === 'ENTER_OTP' && (
          <div className="mx-5 sm:mx-6 mt-3 p-3 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-xs flex items-start gap-2.5 shadow-lg shrink-0">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-amber-300">Simulated SMS Delivery:</p>
              <p className="text-[11px] text-slate-300">
                &quot;Your Anant sacred OTP verification code is{' '}
                <span className="font-mono font-bold text-amber-400 tracking-wider text-xs">
                  {simulatedIncomingSms}
                </span>
                . Valid for 5 minutes.&quot;
              </p>
              <button
                onClick={() => {
                  const chars = simulatedIncomingSms.split('');
                  setOtpDigits(chars);
                  handleVerifyOtp(simulatedIncomingSms);
                }}
                className="mt-2 text-[10px] bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded-lg hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Auto-Fill &amp; Verify Code
              </button>
            </div>
          </div>
        )}

        {/* Error / Info messages */}
        {errorMessage && (
          <div className="mx-5 sm:mx-6 mt-3 p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {infoMessage && !errorMessage && (
          <div className="mx-5 sm:mx-6 mt-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* ========================================================================= */}
          {/* TAB 1: EXPANDED ONBOARDING FLOW */}
          {/* ========================================================================= */}
          {authMode === 'ONBOARD' && step === 'FORM' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Dev Pre-fill Helper Chips */}
              <div className="flex items-center justify-between gap-2 p-2 bg-slate-950 rounded-2xl border border-slate-800 text-[10px]">
                <span className="text-slate-400 font-medium">Quick Demo Autofill:</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={fillSampleDevotee}
                    className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 cursor-pointer font-bold"
                  >
                    Devotee
                  </button>
                  <button
                    type="button"
                    onClick={fillSampleTrust}
                    className="px-2 py-0.5 rounded-lg bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 cursor-pointer font-bold"
                  >
                    Temple Trust
                  </button>
                </div>
              </div>

              {/* Multi-Tenant Registration Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Registration Category (Multi-Tenant) <span className="text-amber-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTenantType('DEVOTEE')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      tenantType === 'DEVOTEE'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <User className="w-5 h-5 shrink-0 text-amber-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-100">Individual Devotee</p>
                      <p className="text-[10px] text-slate-400">साधक / आध्यात्मिक जिज्ञासू</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTenantType('TEMPLE_TRUST')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      tenantType === 'TEMPLE_TRUST'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Building2 className="w-5 h-5 shrink-0 text-orange-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-100">Temple Trust</p>
                      <p className="text-[10px] text-slate-400">मंदिर विश्वस्त संस्था (5 Seats)</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Mandatory Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    First Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Aarav"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Last Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Sharma"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gender <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="MALE">Male (पुरुष)</option>
                    <option value="FEMALE">Female (स्त्री)</option>
                    <option value="OTHER">Other (इतर)</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Location (City, State) <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Varanasi, UP"
                      className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="devotee@example.com"
                    className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Number (for SMS OTP verification) <span className="text-amber-400">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="98220 12345"
                    maxLength={10}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Temple Trust Specific Fields if chosen */}
              {tenantType === 'TEMPLE_TRUST' && (
                <div className="p-3.5 rounded-2xl bg-orange-950/30 border border-orange-800/60 space-y-3">
                  <span className="text-[11px] font-bold text-orange-300 uppercase tracking-wider block">
                    Temple Trust Verification Details
                  </span>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Temple / Trust Legal Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={trustName}
                      onChange={(e) => setTrustName(e.target.value)}
                      placeholder="e.g. Shree Somnath Trust"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        value={trustRegNo}
                        onChange={(e) => setTrustRegNo(e.target.value)}
                        placeholder="PTR / Trust No"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Presiding Deity
                      </label>
                      <input
                        type="text"
                        value={trustDeity}
                        onChange={(e) => setTrustDeity(e.target.value)}
                        placeholder="e.g. Lord Shiva"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Vedic Astrology Fields Accordion */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowVedicFields(!showVedicFields)}
                  className="w-full p-3 bg-slate-950 hover:bg-slate-850 flex items-center justify-between text-xs font-bold text-amber-400 cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Optional: Vedic Kundali &amp; Horoscope Details (DOB, TOB, POB)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {showVedicFields ? 'Hide ▲' : 'Expand ▼'}
                  </span>
                </button>

                {showVedicFields && (
                  <div className="p-3.5 bg-slate-950/60 border-t border-slate-800/80 space-y-3">
                    <p className="text-[10px] text-slate-400">
                      Used for personalized Daily Vedic Panchang, Tithi, Shubh Muhurat, and Rashi/Nakshatra alignment.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Date of Birth (DOB)
                        </label>
                        <input
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Time of Birth (TOB)
                        </label>
                        <input
                          type="time"
                          value={timeOfBirth}
                          onChange={(e) => setTimeOfBirth(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Place of Birth (POB)
                        </label>
                        <input
                          type="text"
                          value={placeOfBirth}
                          onChange={(e) => setPlaceOfBirth(e.target.value)}
                          placeholder="City / District"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !mobileNumber.trim() || !firstName.trim() || !lastName.trim() || !email.trim() || !location.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Proceed to Verify Mobile OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: QUICK OTP LOGIN FORM */}
          {/* ========================================================================= */}
          {authMode === 'OTP' && step === 'FORM' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Devotee Mobile Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-2.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="98220 12345"
                    maxLength={10}
                    className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    autoFocus
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Rate-limited: Max 3 OTP requests / 10 minutes with 60s cooldown
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !mobileNumber.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Get 6-Digit OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: ENTER 6-DIGIT OTP (Common to Onboarding and Quick OTP) */}
          {/* ========================================================================= */}
          {step === 'ENTER_OTP' && (
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-xs text-slate-300">
                  Enter the 6-digit code sent to{' '}
                  <span className="font-mono font-bold text-amber-400">
                    {countryCode} {mobileNumber}
                  </span>
                </p>
                <button
                  onClick={() => setStep('FORM')}
                  className="mt-1 text-[11px] text-slate-400 hover:text-amber-400 underline cursor-pointer"
                >
                  Edit mobile number
                </button>
              </div>

              {/* 6 Digit Boxes */}
              <div
                className="flex justify-center gap-2 sm:gap-3"
                onPaste={handleOtpPaste}
              >
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Didn&apos;t receive OTP?</span>
                {cooldown > 0 ? (
                  <span className="font-mono text-amber-400 font-semibold">
                    Resend in {cooldown}s
                  </span>
                ) : (
                  <button
                    onClick={() => handleSendOtp()}
                    disabled={isLoading}
                    className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={() => handleVerifyOtp()}
                disabled={isLoading || otpDigits.join('').length < 6}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Verify Code &amp; Complete Access</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: EMAIL & PASSWORD SIGN IN */}
          {/* ========================================================================= */}
          {authMode === 'EMAIL' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer transition-all active:scale-[0.98]"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
              </button>

              <div className="pt-2 text-[11px] text-slate-400 text-center">
                Quick test devotee account: <span className="text-amber-400 font-mono">alex@example.com / Password123!</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
