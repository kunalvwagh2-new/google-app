import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Send,
  CheckCircle2,
  Bell,
  Smartphone,
  ShieldCheck,
  Calendar,
  Share2,
  Sparkles,
  ExternalLink,
  Clock,
  Radio,
  Copy,
} from 'lucide-react';
import { WhatsAppNotificationTemplate, WhatsAppMessageType } from '../../types/anant.ts';
import { mockWhatsAppTemplates } from '../../data/anantData.ts';

interface WhatsAppNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplateType?: WhatsAppMessageType;
}

export function WhatsAppNotificationModal({
  isOpen,
  onClose,
  initialTemplateType = 'SUPRABHATAM',
}: WhatsAppNotificationModalProps) {
  const [templates, setTemplates] = useState<WhatsAppNotificationTemplate[]>(mockWhatsAppTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppNotificationTemplate>(
    mockWhatsAppTemplates.find((t) => t.type === initialTemplateType) || mockWhatsAppTemplates[0]
  );

  // Devotee Preferences state
  const [optSuprabhatam, setOptSuprabhatam] = useState(true);
  const [optEventAlerts, setOptEventAlerts] = useState(true);
  const [optDarshanPasses, setOptDarshanPasses] = useState(true);
  const [optDonationReceipts, setOptDonationReceipts] = useState(true);

  // Send test state
  const [recipientMobile, setRecipientMobile] = useState('+91 98220 11223');
  const [apiGateway, setApiGateway] = useState<'INTERAKT' | 'TWILIO'>('INTERAKT');
  const [sendStatus, setSendStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');
  const [activeTab, setActiveTab] = useState<'TEMPLATES_PREVIEW' | 'DEVOTEE_OPTIN' | 'ADMIN_BROADCAST'>('TEMPLATES_PREVIEW');

  if (!isOpen) return null;

  const handleSendTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSendStatus('SENDING');
    setTimeout(() => {
      setSendStatus('SENT');
      setTimeout(() => setSendStatus('IDLE'), 3500);
    }, 1000);
  };

  const handleDirectWhatsAppWeb = () => {
    const text = selectedTemplate.previewMessage;
    const cleanNumber = recipientMobile.replace(/[^0-9]/g, '');
    const url = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-tight">
                  WhatsApp Notification Integration
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Twilio & Interakt API
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated Suprabhatam messages, festival alerts, darshan passes & 80G receipts
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-950/80 border-b border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('TEMPLATES_PREVIEW')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'TEMPLATES_PREVIEW'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Interactive Chat Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('DEVOTEE_OPTIN')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'DEVOTEE_OPTIN'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Devotee Opt-In Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('ADMIN_BROADCAST')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'ADMIN_BROADCAST'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Temple Admin Broadcast Dispatcher</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* ================================================================= */}
          {/* TAB 1: INTERACTIVE CHAT PREVIEW */}
          {/* ================================================================= */}
          {activeTab === 'TEMPLATES_PREVIEW' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Template List */}
              <div className="lg:col-span-5 space-y-2.5">
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Choose Notification Template
                </label>
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      selectedTemplate.id === tpl.id
                        ? 'bg-emerald-950/40 border-emerald-500/70 shadow-lg shadow-emerald-950/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100">{tpl.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-emerald-400 border border-slate-800">
                        {tpl.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {tpl.description}
                    </p>
                    <span className="text-[10px] text-amber-400/90 font-mono mt-2 block">
                      Trigger: {tpl.triggerEvent}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right Column: Realistic WhatsApp Phone Mockup */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <div className="w-full max-w-sm bg-slate-950 border-4 border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                  {/* WhatsApp Top Bar */}
                  <div className="bg-[#075E54] text-white p-3 flex items-center justify-between shadow">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-bold text-xs">
                        ॐ
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-bold leading-tight">Anant Mandir Trust</p>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 flex items-center justify-center text-[7px] text-slate-900 font-black">
                            ✓
                          </span>
                        </div>
                        <p className="text-[9px] text-emerald-200">Official Verified Business Account</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Canvas (Dotted pattern background) */}
                  <div className="p-3.5 bg-[#0b141a] space-y-3 min-h-[300px] flex flex-col justify-end">
                    {/* Timestamp Bubble */}
                    <div className="text-center">
                      <span className="text-[9px] bg-slate-900/80 text-slate-400 px-2.5 py-0.5 rounded-full shadow font-mono">
                        TODAY
                      </span>
                    </div>

                    {/* Received Message Bubble */}
                    <div className="bg-[#202c33] text-slate-100 rounded-2xl rounded-tl-sm p-3.5 shadow-md border border-slate-800/80 space-y-2 max-w-[92%]">
                      <div className="text-xs whitespace-pre-wrap font-sans leading-relaxed text-slate-200">
                        {selectedTemplate.previewMessage}
                      </div>

                      <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 font-mono">
                        <span>06:00 AM</span>
                        <span className="text-sky-400">✓✓</span>
                      </div>

                      {/* Interactive Button */}
                      <div className="pt-2 border-t border-slate-700/60">
                        <button
                          onClick={handleDirectWhatsAppWeb}
                          className="w-full py-1.5 rounded-lg bg-[#00a884] hover:bg-[#008f6f] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{selectedTemplate.ctaButtonText}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Phone Bottom Bar */}
                  <div className="p-2.5 bg-[#1f2c34] border-t border-slate-800 flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      placeholder="Type a message (Automated reply)..."
                      className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-[11px] text-slate-300 placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      onClick={handleDirectWhatsAppWeb}
                      className="w-7 h-7 rounded-full bg-[#00a884] flex items-center justify-center text-slate-950 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDirectWhatsAppWeb}
                  className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Open directly in WhatsApp Web / App</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: DEVOTEE OPT-IN SETTINGS */}
          {/* ================================================================= */}
          {activeTab === 'DEVOTEE_OPTIN' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-100">
                  Devotee WhatsApp Subscription Preferences
                </h3>
                <p className="text-xs text-slate-400">
                  Select which automated alerts you wish to receive on your WhatsApp number
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Daily Suprabhatam & Panchang</h4>
                    <p className="text-[11px] text-slate-400">
                      Delivered every morning at 06:00 AM with Tithi, Muhurat & daily Aarti audio link
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={optSuprabhatam}
                    onChange={(e) => setOptSuprabhatam(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Temple Events & Live Darshans</h4>
                    <p className="text-[11px] text-slate-400">
                      Alerts for Mahashivratri, Ganesh Chaturthi, Ekadashi, and special sanctum broadcasts
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={optEventAlerts}
                    onChange={(e) => setOptEventAlerts(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Virtual Queue Darshan Passes</h4>
                    <p className="text-[11px] text-slate-400">
                      Receive your digital QR code passes and reporting countdowns directly in chat
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={optDarshanPasses}
                    onChange={(e) => setOptDarshanPasses(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">80G Tax-Deductible Donation Receipts</h4>
                    <p className="text-[11px] text-slate-400">
                      Instant PDF e-receipts and trust acknowledgment for every UPI/Hundi donation
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={optDonationReceipts}
                    onChange={(e) => setOptDonationReceipts(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>

                <button
                  onClick={() => alert('✅ Devotee WhatsApp notification preferences successfully saved!')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all mt-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Notification Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: TEMPLE ADMIN BROADCAST DISPATCHER */}
          {/* ================================================================= */}
          {activeTab === 'ADMIN_BROADCAST' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> WhatsApp Cloud Business API
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Integrated with Meta Verified Business API (Twilio / Interakt)
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">API Online</span>
                </div>
              </div>

              <form onSubmit={handleSendTestMessage} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Select Gateway Provider
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setApiGateway('INTERAKT')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        apiGateway === 'INTERAKT'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      Interakt (Official WhatsApp Cloud)
                    </button>
                    <button
                      type="button"
                      onClick={() => setApiGateway('TWILIO')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        apiGateway === 'TWILIO'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      Twilio Messaging API
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Target Template
                  </label>
                  <select
                    value={selectedTemplate.id}
                    onChange={(e) => {
                      const t = templates.find((tpl) => tpl.id === e.target.value);
                      if (t) setSelectedTemplate(t);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    {templates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.title} ({tpl.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Devotee WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientMobile}
                    onChange={(e) => setRecipientMobile(e.target.value)}
                    placeholder="+91 98220 12345"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sendStatus === 'SENDING'}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-40"
                  >
                    {sendStatus === 'SENDING' ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Dispatching via {apiGateway} Webhook...</span>
                      </>
                    ) : sendStatus === 'SENT' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Dispatched to {recipientMobile}! Status 200 OK</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Dispatch WhatsApp Notification via {apiGateway}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
