import React, { useState } from 'react';
import {
  X,
  Building2,
  FileCheck2,
  UploadCloud,
  Users,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle,
  FileText,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { RegisteredTrustee } from '../../types/anant.ts';
import { mockDeities } from '../../data/anantData.ts';

interface TrustRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubmitted?: () => void;
  onSuccess?: () => void;
}

export function TrustRegistrationModal({
  isOpen,
  onClose,
  onSuccessSubmitted,
  onSuccess,
}: TrustRegistrationModalProps) {
  const [trustLegalName, setTrustLegalName] = useState('');
  const [templeName, setTempleName] = useState('');
  const [deityId, setDeityId] = useState(mockDeities[0]?.id || 'lord_ganesh');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [address, setAddress] = useState('');
  const [govRegNumber, setGovRegNumber] = useState('');
  const [charityCommissionerDistrict, setCharityCommissionerDistrict] = useState('Pune Region');
  const [expiryDate, setExpiryDate] = useState('2029-12-31');
  const [tax80GNumber, setTax80GNumber] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantMobile, setApplicantMobile] = useState('');

  // Upload state
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(
    'Govt_Charity_Certificate_Sample.pdf'
  );
  const [isDragOver, setIsDragOver] = useState(false);

  // Dynamic Trustee Roster (Strict 5-seat cap per trust)
  const [trustees, setTrustees] = useState<RegisteredTrustee[]>([
    {
      name: 'Shree Ravindra Deshmukh',
      designation: 'President / Trustee Chief',
      mobile: '+919822099887',
      panOrAadhaarRef: 'ABCD1234E',
    },
    {
      name: 'Pandit Anant Joshi',
      designation: 'Secretary',
      mobile: '+919822099888',
      panOrAadhaarRef: 'WXYZ9876Q',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successResult, setSuccessResult] = useState<{ id: string; trustLegalName: string } | null>(
    null
  );

  if (!isOpen) return null;

  const handleAddTrustee = () => {
    if (trustees.length >= 5) {
      setErrorMessage('A maximum of 5 trustees/team members can be allocated per Temple Trust as per system governance rules.');
      return;
    }
    setTrustees([
      ...trustees,
      {
        name: '',
        designation: 'Trustee Member',
        mobile: '',
        panOrAadhaarRef: '',
      },
    ]);
  };

  const handleRemoveTrustee = (index: number) => {
    if (trustees.length <= 1) {
      setErrorMessage('At least one primary trustee / president is mandatory for trust registration.');
      return;
    }
    setTrustees(trustees.filter((_, i) => i !== index));
  };

  const handleTrusteeChange = (index: number, field: keyof RegisteredTrustee, value: string) => {
    const updated = [...trustees];
    updated[index] = { ...updated[index], [field]: value };
    setTrustees(updated);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!trustLegalName || !templeName || !govRegNumber || !expiryDate) {
      setErrorMessage('Please fill in all mandatory legal fields.');
      return;
    }

    if (!uploadedFileName) {
      setErrorMessage('Please upload the official Government Charity Commissioner Certificate (PDF/Image).');
      return;
    }

    for (const t of trustees) {
      if (!t.name || !t.mobile) {
        setErrorMessage('All listed trustees must have a valid full name and contact number.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/trusts/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trustLegalName,
          templeName,
          deityId,
          city,
          state,
          address,
          govRegNumber,
          charityCommissionerDistrict,
          certificateFileName: uploadedFileName,
          certificateFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          expiryDate,
          tax80GNumber,
          trustees,
          applicantEmail,
          applicantMobile,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error?.message || 'Registration failed.');
        return;
      }

      setSuccessResult({
        id: data.data.id,
        trustLegalName: data.data.trustLegalName,
      });

      if (onSuccessSubmitted) {
        onSuccessSubmitted();
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setErrorMessage('Connection failed while submitting registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-950/50 overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-amber-950/60 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Temple Trust Onboarding (Tenant Registration)
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono">
                  Gov Verification
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official registration for Public Hindu Trusts with Charity Commissioner approval
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Modal Screen */}
        {successResult ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Application Submitted to Verification Queue</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Your Temple Trust registration for{' '}
              <span className="text-amber-400 font-semibold">{successResult.trustLegalName}</span> has
              been lodged with submission reference ID:{' '}
              <span className="font-mono text-amber-300 font-bold">{successResult.id}</span>.
            </p>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-left max-w-md mx-auto space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>What happens next?</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                1. Our Super Admin compliance team cross-references your Government Registration Number with the Charity Commissioner portal.
              </p>
              <p className="text-[11px] leading-relaxed">
                2. Upon approval, your verified Temple profile receives the Golden Sanctum Seal and enables Live Darshan streaming &amp; Seva donation receipt generation.
              </p>
            </div>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-colors cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Section 1: Trust Legal Credentials */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" />
                1. Legal Entity &amp; Government Credentials
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Official Trust Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={trustLegalName}
                    onChange={(e) => setTrustLegalName(e.target.value)}
                    placeholder="e.g. Shri Siddhivinayak Temple Trust"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Sanctum Temple Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={templeName}
                    onChange={(e) => setTempleName(e.target.value)}
                    placeholder="e.g. Siddhivinayak Ganapati Mandir"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Presiding Deity *
                  </label>
                  <select
                    value={deityId}
                    onChange={(e) => setDeityId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-amber-400 focus:outline-none focus:border-amber-500"
                  >
                    {mockDeities.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nameEn} ({d.nameMr})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Pune"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Government Trust Reg Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={govRegNumber}
                    onChange={(e) => setGovRegNumber(e.target.value)}
                    placeholder="e.g. MAH-PUN-TRUST-49102-1982"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Charity Commissioner District *
                  </label>
                  <input
                    type="text"
                    required
                    value={charityCommissionerDistrict}
                    onChange={(e) => setCharityCommissionerDistrict(e.target.value)}
                    placeholder="e.g. Pune Central Division"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Registration Expiry / Renewal Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    80G Income Tax Exemption Ref (Optional)
                  </label>
                  <input
                    type="text"
                    value={tax80GNumber}
                    onChange={(e) => setTax80GNumber(e.target.value)}
                    placeholder="AAATD4910EF20202"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Sanctum Address &amp; Land Registry Reference
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Landmark, Ward, Pin Code"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            {/* Section 2: Upload Government Certificate */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4" />
                2. Government Registration Certificate Upload
              </h3>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                  isDragOver
                    ? 'border-amber-500 bg-amber-950/20'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-950/40'
                }`}
              >
                <input
                  type="file"
                  id="certificate-upload"
                  onChange={handleFileSelect}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                />
                <label
                  htmlFor="certificate-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <UploadCloud className="w-8 h-8 text-amber-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-200">
                    Click to browse or drag and drop certified deed
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Official signed PDF or scanned copy from the Charity Commissioner Office (Max 15MB)
                  </p>
                </label>

                {uploadedFileName && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                    <FileText className="w-4 h-4" />
                    <span className="font-mono text-[11px]">{uploadedFileName}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">✓ Attached</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Dynamic Trustees Roster (Max 5 Seats) */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    3. Registered Trustees Roster ({trustees.length}/5 Seats Allocated)
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Strict 5-seat RBAC limit per trust enforced by database trigger
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddTrustee}
                  disabled={trustees.length >= 5}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-amber-400 border border-amber-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Trustee
                </button>
              </div>

              <div className="space-y-2.5">
                {trustees.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300">
                        Trustee #{idx + 1}
                      </span>
                      {trustees.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTrustee(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Trustee Full Name"
                        value={t.name}
                        onChange={(e) => handleTrusteeChange(idx, 'name', e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                      <select
                        value={t.designation}
                        onChange={(e) => handleTrusteeChange(idx, 'designation', e.target.value)}
                        className="px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-amber-400 focus:outline-none focus:border-amber-500"
                      >
                        <option value="President / Trustee Chief">President / Trustee Chief</option>
                        <option value="Secretary">Secretary</option>
                        <option value="Treasurer">Treasurer</option>
                        <option value="Trustee Member">Trustee Member</option>
                      </select>
                      <input
                        type="tel"
                        required
                        placeholder="Mobile (+91...)"
                        value={t.mobile}
                        onChange={(e) => handleTrusteeChange(idx, 'mobile', e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <input
                        type="text"
                        placeholder="PAN / Aadhaar Ref"
                        value={t.panOrAadhaarRef}
                        onChange={(e) =>
                          handleTrusteeChange(idx, 'panOrAadhaarRef', e.target.value)
                        }
                        className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Applicant Contact Details */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                4. Applicant Contact for Verification Dispatch
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  placeholder="Official Trust Contact Email"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="tel"
                  required
                  placeholder="Official Trust Phone"
                  value={applicantMobile}
                  onChange={(e) => setApplicantMobile(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Monthly compliance re-confirmation required after verification
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit for Verification</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
