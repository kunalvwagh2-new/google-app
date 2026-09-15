'use client';

import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  FileText,
  Smartphone,
  Globe,
  CheckCircle2,
  ArrowRight,
  Upload,
  Lock,
  Sparkles,
} from 'lucide-react';
import { registerTenantAction } from '../../app/actions/tenant-auth.ts';

interface TenantRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (dashboardUrl: string) => void;
}

export function TenantRegistrationForm({
  isOpen,
  onClose,
  onSuccess,
}: TenantRegistrationFormProps) {
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [govRegNumber, setGovRegNumber] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await registerTenantAction({
        name,
        subdomain,
        govRegNumber,
        adminName,
        adminEmail,
        adminPhone,
      });

      if (!res.success || !res.data) {
        setError(res.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      setSuccess(res.message);
      setTimeout(() => {
        onSuccess(res.data.dashboardUrl);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-amber-950/60 to-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/25 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-100">
                Temple Trust Organization Onboarding (Tier 2A)
              </h2>
              <p className="text-[11px] text-slate-400">
                Register your temple trust, secure a custom subdomain &amp; configure KYC
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

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Trust / Temple Legal Name (मंदिराचे कायदेशीर नाव)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shree Kalbhairav Nath Mandir Trust"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Desired Subdomain (आपला सबडोमेन)
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-amber-500">
                  <input
                    type="text"
                    required
                    value={subdomain}
                    onChange={handleSubdomainChange}
                    placeholder="kalbharavesus"
                    className="w-full bg-transparent px-3.5 py-2.5 text-xs text-amber-300 font-mono focus:outline-none"
                  />
                  <span className="bg-slate-900 px-3 py-2.5 text-[11px] text-slate-400 font-mono border-l border-slate-800">
                    .anant.com
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Government Registration / 80G Number (नोंदणी क्रमांक)
                </label>
                <input
                  type="text"
                  required
                  value={govRegNumber}
                  onChange={(e) => setGovRegNumber(e.target.value)}
                  placeholder="e.g. MAH-PUN-TRUST-4910/2020"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Primary Admin Full Name (मुख्य विश्वस्त / प्रशासक)
                </label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Pandit Rajesh Sharma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Primary Admin Email (ईमेल)
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="trust@kalbhairav.org"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  WhatsApp / Mobile Number (मोबाईल नंबर)
                </label>
                <input
                  type="tel"
                  required
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  placeholder="+91 98220 11223"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Compliance Upload Simulation */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Trust Deed &amp; 80G Certificate Upload (कायदेशीर कागदपत्रे)
              </label>
              <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 text-center bg-slate-950/60 cursor-pointer">
                <Upload className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-200">
                  {fileName ? fileName : 'Click to upload PDF registration certificate'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  PDF, JPG or PNG up to 25MB (Required for Tier 3 Verification)
                </p>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFileName(e.target.files[0].name);
                    }
                  }}
                  className="hidden"
                  id="compliance-file"
                />
                <label
                  htmlFor="compliance-file"
                  className="mt-2 inline-block px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 cursor-pointer"
                >
                  Browse Files
                </label>
              </div>
            </div>

            {/* Verification State Gating Notice */}
            <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-2xl text-[11px] text-amber-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Dynamic 2-Stage Verification &amp; Feature Gating:</strong> Upon registration, your organization enters <span className="font-mono bg-amber-950 px-1.5 py-0.5 rounded text-amber-300">pending_verification</span> state (single-seat admin access). Once verified by Anant moderators, your default 5-seat allocation and sub-user invites will be unlocked.
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !subdomain || !name}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              <span>{loading ? 'Provisioning Subdomain...' : 'Register Temple Organization & Provision Subdomain'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
