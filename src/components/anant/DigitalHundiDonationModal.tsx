import React, { useState } from 'react';
import {
  X,
  IndianRupee,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Download,
  Printer,
  Sparkles,
  Heart,
  Landmark,
  FileCheck,
  Building2,
  CreditCard,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { DonationRecord } from '../../types/anant.ts';
import { mockDonations, mockCompliance, mockTemples } from '../../data/anantData.ts';

interface DigitalHundiDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTempleName?: string;
}

export function DigitalHundiDonationModal({
  isOpen,
  onClose,
  initialTempleName = 'Shreemant Dagdusheth Halwai Ganpati Trust, Pune',
}: DigitalHundiDonationModalProps) {
  const [activeStep, setActiveStep] = useState<'DONATE' | 'UPI_QR' | 'RECEIPT'>('DONATE');

  // Donation form fields
  const [donorName, setDonorName] = useState('Kunal V. Wagh');
  const [donorMobile, setDonorMobile] = useState('+91 98220 11223');
  const [donorEmail, setDonorEmail] = useState('kunalvwagh2@gmail.com');
  const [donorPan, setDonorPan] = useState('ABCDE1234F');
  const [amount, setAmount] = useState<number>(2100);
  const [purpose, setPurpose] = useState<'Annadaan' | 'Temple Construction' | 'Special Pooja Archana' | 'General Seva'>('Annadaan');
  const [templeName, setTempleName] = useState(initialTempleName);

  // Generated Receipt
  const [generatedReceipt, setGeneratedReceipt] = useState<DonationRecord | null>(mockDonations[0] || null);
  const [receiptTxnId, setReceiptTxnId] = useState('UPI-ANANT-2026-981240');

  if (!isOpen) return null;

  const presetAmounts = [101, 251, 501, 1100, 2100, 5100, 11000];

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    setActiveStep('UPI_QR');
  };

  const handleSimulatePaymentSuccess = () => {
    const txn = `UPI-ANANT-${Date.now().toString().slice(-6)}`;
    const recNum = `REC-2026-80G-${Math.floor(10000 + Math.random() * 90000)}`;

    const newRec: DonationRecord = {
      id: `don_${Date.now()}`,
      donorName: donorName.trim(),
      donorEmail: donorEmail.trim(),
      donorMobile: donorMobile.trim(),
      amount: Number(amount),
      currency: 'INR',
      purpose,
      paymentStatus: 'SUCCESS',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      receiptNumber: recNum,
    };

    setReceiptTxnId(txn);
    setGeneratedReceipt(newRec);
    setActiveStep('RECEIPT');
  };

  const numberToWordsInr = (num: number): string => {
    // simplified INR words
    if (num === 101) return 'One Hundred One Rupees Only';
    if (num === 251) return 'Two Hundred Fifty One Rupees Only';
    if (num === 501) return 'Five Hundred One Rupees Only';
    if (num === 1100) return 'One Thousand One Hundred Rupees Only';
    if (num === 2100) return 'Two Thousand One Hundred Rupees Only';
    if (num === 5100) return 'Five Thousand One Hundred Rupees Only';
    if (num === 11000) return 'Eleven Thousand Rupees Only';
    return `${num.toLocaleString('en-IN')} Rupees Only`;
  };

  const shareReceiptOnWhatsApp = () => {
    if (!generatedReceipt) return;
    const text = `🙏 *श्री दगडूशेठ हलवाई गणपती ट्रस्ट - 80G कर सूट देणगी पावती* 🕉️\n\nप्रिय *${generatedReceipt.donorName}* जी,\nआपल्या पवित्र दानाबद्दल ट्रस्ट आपले मनःपूर्वक आभारी आहे.\n\n• पावती क्र: *${generatedReceipt.receiptNumber}*\n• देणगी रक्कम: *₹ ${generatedReceipt.amount.toLocaleString('en-IN')}/-* (${numberToWordsInr(generatedReceipt.amount)})\n• हेतू: *${generatedReceipt.purpose}*\n• दाता PAN: *${donorPan}*\n• ट्रस्ट 80G URN: *AAATD4910EF20202*\n• व्यवहार आयडी: *${receiptTxnId}*\n\n📄 80G अधिकृत कर सवलत प्रमाणपत्र डाउनलोड करा: https://anant.org/receipt/${generatedReceipt.receiptNumber}.pdf\n\n_हे दान प्राप्तिकर कायदा कलम 80G अंतर्गत 50% कर सवलतीस पात्र आहे._`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-tight">
                  Digital Hundi & 80G Tax-Deductible Receipts
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  80G Certified India
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct UPI / QR donation with instant WhatsApp-shareable 80G exemption e-receipt
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-around p-3 bg-slate-950 border-b border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveStep('DONATE')}
            className={`flex items-center gap-2 transition-colors cursor-pointer ${
              activeStep === 'DONATE' ? 'text-amber-400' : 'text-slate-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">1</span>
            <span>Donation & PAN</span>
          </button>
          <span className="text-slate-700">───</span>
          <button
            onClick={() => setActiveStep('UPI_QR')}
            className={`flex items-center gap-2 transition-colors cursor-pointer ${
              activeStep === 'UPI_QR' ? 'text-amber-400' : 'text-slate-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">2</span>
            <span>UPI QR Hundi</span>
          </button>
          <span className="text-slate-700">───</span>
          <button
            onClick={() => generatedReceipt && setActiveStep('RECEIPT')}
            className={`flex items-center gap-2 transition-colors cursor-pointer ${
              activeStep === 'RECEIPT' ? 'text-amber-400' : 'text-slate-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">3</span>
            <span>80G E-Receipt</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* ================================================================= */}
          {/* STEP 1: DONATION FORM & PAN ENTRY */}
          {/* ================================================================= */}
          {activeStep === 'DONATE' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4 max-w-xl mx-auto">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Temple Trust Recipient
                </label>
                <select
                  value={templeName}
                  onChange={(e) => setTempleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-semibold focus:border-amber-500 focus:outline-none"
                >
                  <option value="Shreemant Dagdusheth Halwai Ganpati Trust, Pune">
                    Shreemant Dagdusheth Halwai Ganpati Trust, Pune (80G Reg: AAATD4910EF20202)
                  </option>
                  <option value="Trimbakeshwar Jyotirlinga Mandir Sansthan, Nashik">
                    Trimbakeshwar Jyotirlinga Mandir Sansthan, Nashik (80G Reg: AABTT8821KF20183)
                  </option>
                  <option value="Shree Siddhivinayak Temple Trust, Mumbai">
                    Shree Siddhivinayak Temple Trust, Mumbai (80G Reg: AAATS9901JF20191)
                  </option>
                </select>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Select Sacred Donation Amount (देणगी रक्कम)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                        amount === preset
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-amber-500/40'
                      }`}
                    >
                      ₹{preset.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <div className="mt-2.5 relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-xs">
                    Custom ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Enter custom amount"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-18 pr-4 py-2.5 text-sm text-amber-400 font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Seva Purpose (हेतू)
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                >
                  <option value="Annadaan">Nitya Annadaan & Mahaprasad Seva (अन्नदान)</option>
                  <option value="Temple Construction">Temple Sanctum Renovation & Gold Kalash (जीर्णोद्धार)</option>
                  <option value="Special Pooja Archana">Special Abhishek & Akhand Diya Seva (अखंड दीप)</option>
                  <option value="General Seva">General Trust Corpus / Dharmik Charitable Fund</option>
                </select>
              </div>

              {/* Donor Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">
                    Donor Full Name (पावतीवरील नाव)
                  </label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">
                    Donor PAN Card No (For 80G Tax Exemption)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={donorPan}
                    onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono uppercase focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">
                    WhatsApp Mobile (For Instant E-Receipt)
                  </label>
                  <input
                    type="text"
                    required
                    value={donorMobile}
                    onChange={(e) => setDonorMobile(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* 80G Note */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-emerald-200">Income Tax Act Section 80G Exemption</strong>
                  <span>
                    Donations are eligible for 50% tax deduction under Indian IT Act. E-receipt with trust
                    URN and official seal is generated immediately upon UPI confirmation.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>Generate UPI QR Hundi (₹{amount.toLocaleString('en-IN')})</span>
              </button>
            </form>
          )}

          {/* ================================================================= */}
          {/* STEP 2: DYNAMIC UPI QR HUNDI */}
          {/* ================================================================= */}
          {activeStep === 'UPI_QR' && (
            <div className="max-w-md mx-auto text-center space-y-4">
              <div className="p-5 bg-slate-950 border border-amber-500/30 rounded-3xl space-y-3.5 shadow-2xl">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                    Dynamic Temple Trust Hundi
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-100">{templeName}</h3>
                  <p className="text-xs text-slate-400">Govt Reg: MAH-PUN-TRUST-49102-1982</p>
                </div>

                {/* Simulated UPI QR Code */}
                <div className="w-52 h-52 bg-white p-3 rounded-3xl mx-auto shadow-inner relative flex flex-col items-center justify-center border-4 border-amber-500/30">
                  <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" rx="3" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" />

                    <rect x="70" y="0" width="30" height="30" rx="3" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" />

                    <rect x="0" y="70" width="30" height="30" rx="3" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" />

                    <rect x="36" y="8" width="8" height="8" />
                    <rect x="52" y="12" width="6" height="6" />
                    <rect x="38" y="24" width="8" height="12" />
                    <rect x="10" y="40" width="8" height="6" />
                    <rect x="22" y="44" width="8" height="8" />
                    <rect x="38" y="44" width="16" height="8" />
                    <rect x="62" y="40" width="12" height="6" />
                    <rect x="82" y="44" width="8" height="10" />
                    <rect x="42" y="62" width="8" height="12" />
                    <rect x="60" y="60" width="12" height="8" />
                    <rect x="78" y="72" width="14" height="12" />
                    <rect x="40" y="82" width="8" height="10" />
                  </svg>
                  <div className="absolute inset-x-0 bottom-1 flex justify-center">
                    <span className="text-[9px] font-mono font-bold bg-slate-900 text-amber-300 px-2 py-0.5 rounded-full shadow">
                      UPI: trust@dagdusheth
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    ₹{amount.toLocaleString('en-IN')}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Scan using GPay, PhonePe, Paytm, BHIM, or any Banking App
                  </p>
                </div>

                {/* Multi-Vendor Split Payment Breakdown */}
                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-2xl text-[11px] text-amber-200 text-left space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-300">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Multi-Vendor Split Settlement (Razorpay Route / Stripe Connect)</span>
                  </div>
                  <p className="text-slate-300 text-[10px] leading-relaxed">
                    • 95% (₹{Math.round(amount * 0.95).toLocaleString('en-IN')}) is instantly routed directly to the verified Temple Trust bank account.<br/>
                    • 5% (₹{Math.round(amount * 0.05).toLocaleString('en-IN')}) is retained as platform convenience fee.
                  </p>
                </div>

                {/* One click mock completion */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <button
                    onClick={handleSimulatePaymentSuccess}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Successful UPI Payment</span>
                  </button>

                  <button
                    onClick={() => setActiveStep('DONATE')}
                    className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    ← Edit Amount or Donor Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 3: OFFICIAL 80G TAX EXEMPT E-RECEIPT VIEW */}
          {/* ================================================================= */}
          {activeStep === 'RECEIPT' && generatedReceipt && (
            <div className="space-y-4 max-w-2xl mx-auto">
              {/* Receipt Visual Sheet */}
              <div className="bg-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-5 relative overflow-hidden">
                {/* Subtle watermark */}
                <div className="absolute -right-8 -bottom-8 opacity-5 text-amber-500 font-serif text-[180px] select-none pointer-events-none">
                  ॐ
                </div>

                {/* Top Trust Header */}
                <div className="text-center border-b border-slate-800 pb-4 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                    Government of Maharashtra Charity Commissioner Registered
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-100">
                    {templeName}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Govt Reg No: <strong>MAH-PUN-TRUST-49102-1982</strong> • Section 80G URN: <strong className="text-amber-300 font-mono">AAATD4910EF20202</strong>
                  </p>
                  <p className="text-[10px] text-emerald-400 font-medium">
                    Eligible for 50% Tax Exemption under Section 80G(5)(vi) of Income Tax Act, 1961
                  </p>
                </div>

                {/* Meta details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Receipt No</span>
                    <strong className="font-mono text-amber-300">{generatedReceipt.receiptNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Date & Time</span>
                    <span className="font-mono">{generatedReceipt.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Transaction ID</span>
                    <span className="font-mono text-[11px] text-slate-300">{receiptTxnId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Status</span>
                    <span className="text-emerald-400 font-bold font-mono">PAID / SUCCESS</span>
                  </div>
                </div>

                {/* Donor & Amount Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800/80 py-1.5">
                    <span className="text-slate-400">Donor Name:</span>
                    <strong className="text-slate-100 font-medium">{generatedReceipt.donorName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 py-1.5">
                    <span className="text-slate-400">Donor PAN Card No:</span>
                    <strong className="text-amber-300 font-mono">{donorPan}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 py-1.5">
                    <span className="text-slate-400">Mobile / WhatsApp:</span>
                    <span className="font-mono">{generatedReceipt.donorMobile}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 py-1.5">
                    <span className="text-slate-400">Seva Purpose:</span>
                    <span className="text-slate-200">{generatedReceipt.purpose}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 py-2">
                    <span className="text-slate-300 font-bold">Donation Amount:</span>
                    <div className="text-right">
                      <span className="text-lg font-black text-amber-400 font-mono">
                        ₹{generatedReceipt.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        ({numberToWordsInr(generatedReceipt.amount)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Stamp & Signatures */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full border-2 border-amber-500/40 flex items-center justify-center text-[8px] text-center font-mono font-bold text-amber-400 rotate-[-12deg]">
                      TRUST<br/>SEAL
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-300">Digitally Verified Document</p>
                      <p className="text-[9px] text-slate-500">No physical signature required</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-serif italic text-amber-300 font-bold block">Mahesh Suryavanshi</span>
                    <span className="text-[10px] text-slate-400">Chief Treasurer / Trustee</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={shareReceiptOnWhatsApp}
                  className="w-full sm:flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share 80G Receipt on WhatsApp</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={() => alert(`📥 80G E-Receipt #${generatedReceipt.receiptNumber}.pdf saved to your downloads folder!`)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
