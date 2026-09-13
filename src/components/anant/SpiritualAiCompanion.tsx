import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  Youtube,
  Play,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Flame,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { ScriptureCitation, VideoCard, OnlineBookRef } from '../../server/spiritualCompanionService.ts';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  scriptures?: ScriptureCitation[];
  videos?: VideoCard[];
  books?: OnlineBookRef[];
  followUps?: string[];
  timestamp: string;
}

interface SpiritualAiCompanionProps {
  language?: 'EN' | 'HI' | 'MR';
  onOpenJaapMala?: () => void;
  className?: string;
}

const QUICK_PROMPT_SHORTCUTS = [
  {
    labelEn: 'How to overcome anxiety with Gita?',
    labelHi: 'गीता अनुसार चिंता कैसे दूर करें?',
    labelMr: 'गीतेनुसार चिंता कशी दूर करावी?',
    query: 'How can I overcome anxiety and restless mind using the wisdom of Bhagavad Gita?',
  },
  {
    labelEn: 'Why 108 beads in Jaap Mala?',
    labelHi: 'जपमाला में १०८ मणी क्यों होते हैं?',
    labelMr: 'नामजप माळेत १०८ मणी का असतात?',
    query: 'What is the sacred cosmic and spiritual significance of the 108 beads in a Jaap Mala?',
  },
  {
    labelEn: 'Gayatri Mantra meaning & power',
    labelHi: 'गायत्री मंत्र का अर्थ व शक्ति',
    labelMr: 'गायत्री मंत्राचा अर्थ व सामर्थ्य',
    query: 'What is the complete meaning, swara chanting, and intellect benefits of Gayatri Mantra?',
  },
  {
    labelEn: 'Courage from Hanuman Chalisa',
    labelHi: 'हनुमान चालीसा से भय मुक्ति',
    labelMr: 'हनुमान चालीसा व निर्भयता',
    query: 'How does chanting Hanuman Chalisa remove fear, negativity, and diseases?',
  },
];

export const SpiritualAiCompanion: React.FC<SpiritualAiCompanionProps> = ({
  language = 'EN',
  onOpenJaapMala,
  className = '',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_msg',
      sender: 'assistant',
      text:
        language === 'HI'
          ? 'हरि ॐ! मैं आपका अनंत आध्यात्मिक साथी हूँ। भगवद्गीता, उपनिषद, वेद एवं पुराणों के प्रामाणिक संदर्भों से आपके प्रश्नों का समाधान प्राप्त करें।'
          : language === 'MR'
          ? 'हरि ॐ! मी आपला अनंत आध्यात्मिक मार्गदर्शक आहे. भगवद्गीता, उपनिषदे, वेद व संतांच्या वचनांवर आधारित मार्गदर्शन येथे मिळवा.'
          : 'Hari Om! I am your Anant AI Spiritual Companion. Ask any spiritual, sadhana, scripture, or philosophical question grounded in the authentic sacred texts of Sanatan Dharma.',
      scriptures: [
        {
          book: 'Bhagavad Gita',
          chapterVerse: 'Chapter 2, Verse 47',
          sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
          transliteration: 'karmaṇy-evādhikāras te mā phaleṣu kadāchana | mā karma-phala-hetur bhūr mā te saṅgo ’stvakarmaṇi',
          meaning: 'You have a right only to perform your prescribed duty, but never to the fruits of action. Dedicate every deed to the Divine with total tranquility.',
        },
      ],
      videos: [
        {
          title: 'The Art of Karmayoga & Inner Freedom',
          channel: 'Chinmaya Mission',
          youtubeId: 'b7bHsqWpQ70',
          duration: '14:20',
          category: 'Discourse',
          description: 'Timeless guidance on living with peaceful purpose and zero anxiety.',
        },
      ],
      books: [
        {
          title: 'The Holy Geeta',
          author: 'Swami Chinmayananda',
          topic: 'Living Without Anxiety',
          excerpt: 'When the ego surrenders its anxious anticipation of rewards, the mind blossoms with divine clarity.',
        },
      ],
      followUps: [
        'Why 108 beads in Jaap Mala?',
        'How to overcome anxiety with Gita?',
        'Gayatri Mantra meaning & power',
      ],
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<VideoCard | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/spiritual-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend.trim(),
          language,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const assistantMsg: Message = {
          id: `msg_a_${Date.now()}`,
          sender: 'assistant',
          text: data.data.answer,
          scriptures: data.data.scriptures,
          videos: data.data.videos,
          books: data.data.books,
          followUps: data.data.followUps,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('API failed');
      }
    } catch {
      const fallbackMsg: Message = {
        id: `msg_f_${Date.now()}`,
        sender: 'assistant',
        text:
          'Shanti. The mind attains tranquility when anchored in constant japa of the holy name. "Om Namah Shivaya" and "Hare Krishna Mahamantra" pacify all afflictions.',
        scriptures: [
          {
            book: 'Shiva Purana',
            chapterVerse: 'Chapter 25, Verse 84',
            sanskrit: 'रुद्राक्षकङ्कणं धार्यं जपकाले विशेषतः। अष्टोत्तरशतं चैव सर्वकामप्रदायकम्॥',
            transliteration: 'rudrākṣa-kaṅkaṇaṁ dhāryaṁ japa-kāle viśeṣataḥ | aṣṭottara-śataṁ caiva sarva-kāma-pradāyakam',
            meaning: 'Turning the 108 sacred beads dissolves all mental unrest and bestows supreme auspicious peace.',
          },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className={`flex flex-col bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden ${className}`}
      style={{ minHeight: '620px', maxHeight: '820px' }}
    >
      {/* Panel Top Header */}
      <div className="px-4 py-3.5 bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border-b border-amber-500/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-slate-100 tracking-wide">
                AI Spiritual Companion
              </h3>
              <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full">
                RAG Grounded
              </span>
            </div>
            <p className="text-[10px] text-amber-300/80 font-medium">
              Gita • Vedas • Upanishads • YouTube Discourses
            </p>
          </div>
        </div>

        {onOpenJaapMala && (
          <button
            onClick={onOpenJaapMala}
            title="Switch to 108 Jaap Mala"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold cursor-pointer transition-colors"
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Jaap Mala</span>
          </button>
        )}
      </div>

      {/* Quick Prompt Shortcuts Bar */}
      <div className="p-2.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] text-slate-400 font-semibold px-1 shrink-0">
          Topics:
        </span>
        {QUICK_PROMPT_SHORTCUTS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuery(item.query)}
            className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 font-medium transition-all cursor-pointer shadow-xs"
          >
            {language === 'HI' ? item.labelHi : language === 'MR' ? item.labelMr : item.labelEn}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender Badge */}
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
              {msg.sender === 'assistant' ? (
                <>
                  <span className="text-amber-400 font-bold">ॐ Anant Companion</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              ) : (
                <>
                  <span>You</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`rounded-2xl p-3.5 max-w-[92%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs shadow-md'
                  : 'bg-slate-950/80 border border-slate-800/90 text-slate-200 rounded-tl-xs shadow-xl space-y-3'
              }`}
            >
              {/* Main Text with Markdown-like structure */}
              <div className="whitespace-pre-wrap space-y-2">
                {msg.text.split('\n\n').map((para, pIdx) => {
                  if (para.startsWith('### ') || para.startsWith('#### ')) {
                    return (
                      <h4 key={pIdx} className="font-bold text-amber-300 text-xs mt-2 first:mt-0">
                        {para.replace(/### |#### /g, '')}
                      </h4>
                    );
                  }
                  if (para.startsWith('> ')) {
                    return (
                      <blockquote
                        key={pIdx}
                        className="pl-3 border-l-2 border-amber-500/60 italic text-amber-200/90 bg-amber-950/20 py-1 rounded-r-lg text-[11px]"
                      >
                        {para.replace(/> /g, '')}
                      </blockquote>
                    );
                  }
                  return (
                    <p key={pIdx} className="text-slate-200">
                      {para}
                    </p>
                  );
                })}
              </div>

              {/* Verified Scripture Citation Cards */}
              {msg.scriptures && msg.scriptures.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-amber-400" /> Sacred Scripture Citation
                  </span>
                  {msg.scriptures.map((sc, scIdx) => (
                    <div
                      key={scIdx}
                      className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-300">
                          {sc.book} • {sc.chapterVerse}
                        </span>
                        <button
                          onClick={() => speakText(sc.sanskrit)}
                          title="Listen to Sanskrit Chanting"
                          className="text-amber-400 hover:text-amber-300 p-1 rounded-lg hover:bg-slate-900 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-serif text-xs font-bold text-amber-100 tracking-wide">
                        {sc.sanskrit}
                      </p>
                      <p className="text-[10px] text-amber-200/70 italic">
                        {sc.transliteration}
                      </p>
                      <p className="text-[11px] text-slate-300">
                        <strong>Meaning:</strong> {sc.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Embedded YouTube Discourse / Chanting Cards */}
              {msg.videos && msg.videos.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                    <Youtube className="w-3.5 h-3.5 text-rose-500" /> Authentic Video Discourses
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {msg.videos.map((vid, vIdx) => (
                      <div
                        key={vIdx}
                        onClick={() => setActiveVideoModal(vid)}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-100 line-clamp-1 group-hover:text-amber-300 transition-colors">
                              {vid.title}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {vid.channel} • {vid.duration}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                          {vid.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Online Books & Excerpts */}
              {msg.books && msg.books.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-400" /> Recommended Spiritual Books
                  </span>
                  {msg.books.map((b, bIdx) => (
                    <div
                      key={bIdx}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] space-y-1"
                    >
                      <div className="flex items-center justify-between text-amber-300 font-bold">
                        <span>{b.title}</span>
                        <span className="text-slate-400 font-normal">by {b.author}</span>
                      </div>
                      <p className="text-slate-300 italic">&quot;{b.excerpt}&quot;</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions: Copy & Thumbs */}
              {msg.sender === 'assistant' && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Wisdom
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      title="Helpful guidance"
                      className="hover:text-amber-400 cursor-pointer p-0.5"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      title="Needs improvement"
                      className="hover:text-amber-400 cursor-pointer p-0.5"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs text-amber-300 shadow-md">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Contemplating sacred scriptures...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Prompt Box */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="spiritual-ai-input"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              language === 'HI'
                ? 'गीता, ध्यान, जप या वेद संबंधी प्रश्न पूछें...'
                : language === 'MR'
                ? 'गीता, नामजप, ध्यान किंवा साधना प्रश्न विचारा...'
                : 'Ask about Gita, mantras, 108 beads, or meditation...'
            }
            className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="w-10 h-10 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md shadow-amber-950/40 shrink-0"
            title="Send query"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-rose-500" />
                <h4 className="text-sm font-bold text-slate-100 line-clamp-1">
                  {activeVideoModal.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.youtubeId}?autoplay=1`}
                title={activeVideoModal.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-slate-950 text-xs space-y-1">
              <p className="font-bold text-amber-400">{activeVideoModal.channel}</p>
              <p className="text-slate-300">{activeVideoModal.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiritualAiCompanion;
