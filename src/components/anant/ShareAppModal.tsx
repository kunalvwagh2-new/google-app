import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  MessageCircle,
  QrCode,
  Send,
  Heart,
  Sparkles,
  Users,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { SupportedLanguage } from '../../types/anant.ts';

export interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export function ShareAppModal({ isOpen, onClose, language }: ShareAppModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const appShareUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://anant-spiritual.app';

  const shareTitle =
    language === 'MR'
      ? 'अनंत - आध्यात्मिक दर्शन, जप व मंदिर मंच'
      : language === 'HI'
      ? 'अनंत - आध्यात्मिक दर्शन, मन्त्र जप एवं मन्दिर संगम'
      : 'Anant - Spiritual Sanctuary, Daily Darshan & Jaap Mala';

  const shareText =
    language === 'MR'
      ? `🙏 सप्रेम नमस्कार! मी 'अनंत' (Anant) हे दिव्य आध्यात्मिक ॲप वापरत आहे. येथे विविध मंदिरांचे थेट दैनंदिन दर्शन, अखंड १०८ जप माळा, भावपूर्ण आरत्या आणि आध्यात्मिक ब्लॉग्स मिळतात. आपणही खालील लिंकवरून त्वरित जोडा:\n${appShareUrl}`
      : language === 'HI'
      ? `🙏 सादर प्रणाम! मैं 'अनंत' (Anant) आध्यात्मिक मंच का उपयोग कर रहा हूँ। यहाँ प्रसिद्ध मंदिरों का नित्य दर्शन, १०८ जप माला, भक्ति संगीत एवं आध्यात्मिक ज्ञान मिलता है। आप भी जुड़ें:\n${appShareUrl}`
      : `🙏 Greetings! Join me on Anant - the sacred spiritual sanctuary for daily temple darshan, continuous 108 jaap mala, devotional chants, and inspiring spiritual blogs.\nOpen the app here:\n${appShareUrl}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(appShareUrl);
      } else {
        const input = document.createElement('input');
        input.value = appShareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: appShareUrl,
        });
      } catch {
        // Ignored if cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  const handleTelegramShare = () => {
    const encodedUrl = encodeURIComponent(appShareUrl);
    const encodedText = encodeURIComponent(shareTitle);
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-3xl shadow-2xl max-w-lg w-full p-6 text-slate-800 dark:text-slate-100 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration banner */}
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Icon */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0 shadow-sm">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              {language === 'MR'
                ? 'मित्र व परिवारास ॲप शेअर करा'
                : language === 'HI'
                ? 'मित्रों एवं परिवार के साथ साझा करें'
                : 'Share App with Friends & Family'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'MR'
                ? 'पवित्र नामजप, दर्शन व ज्ञानाचा प्रकाश सर्वांपर्यंत पोहोचवा'
                : language === 'HI'
                ? 'दैनिक दर्शन, जप एवं आध्यात्मिक ज्ञान अपने प्रियजनों तक पहुँचाएँ'
                : 'Invite your loved ones to join the spiritual journey'}
            </p>
          </div>
        </div>

        {/* Share preview quote box */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200/70 dark:border-amber-900/40 mb-5 text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-serif relative">
          <Sparkles className="w-4 h-4 text-amber-500 absolute -top-2 -right-1" />
          <p className="font-semibold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5 font-sans">
            <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            {language === 'MR' ? 'सप्रेम आध्यात्मिक निमंत्रण' : 'Spiritual Invitation Message'}
          </p>
          <p className="italic">
            "{shareText.slice(0, 150)}..."
          </p>
        </div>

        {/* Copy Link Input & Button */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            {language === 'MR' ? 'ॲप / वेबसाइट लिंक' : 'App & Website Link'}
          </label>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl p-1.5 pl-3">
            <input
              type="text"
              readOnly
              value={appShareUrl}
              className="bg-transparent border-none text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none flex-1 truncate"
            />
            <button
              id="copy-share-link-btn"
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  {language === 'MR' ? 'कॉपी झाले!' : 'Copied!'}
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  {language === 'MR' ? 'लिंक कॉपी करा' : 'Copy Link'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* 1-Click Social Sharing Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsAppShare}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 mb-1 fill-current" />
            <span className="text-[11px] font-bold">WhatsApp</span>
          </button>

          {/* Telegram */}
          <button
            onClick={handleTelegramShare}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 text-sky-700 dark:text-sky-400 hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <Send className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-bold">Telegram</span>
          </button>

          {/* Native Mobile Share */}
          <button
            onClick={handleNativeShare}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <Smartphone className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-bold">Device Share</span>
          </button>

          {/* QR Code Toggle */}
          <button
            onClick={() => setShowQr(!showQr)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
              showQr
                ? 'bg-slate-900 text-amber-400 border-amber-500'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:scale-[1.02]'
            }`}
          >
            <QrCode className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-bold">QR Code</span>
          </button>
        </div>

        {/* QR Code Card View */}
        {showQr && (
          <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center mb-4 animate-in fade-in">
            <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl shadow-inner flex items-center justify-center border-2 border-dashed border-amber-400">
              {/* Responsive SVG QR code representation */}
              <div className="w-full h-full bg-slate-900 p-2 rounded-xl flex flex-col items-center justify-center text-white">
                <QrCode className="w-20 h-20 text-amber-400 animate-pulse" />
                <span className="text-[9px] font-mono tracking-tighter text-slate-300 mt-1">Scan with Camera</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Friends can point their mobile camera to scan and immediately open the app.
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            Recipients can view & login without extra steps
          </span>
          <button
            onClick={onClose}
            className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
