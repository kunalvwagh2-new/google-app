/**
 * src/server/contentModeration.ts
 * Strict Content Moderation API Filters for 'Anant' (Dedicated Spiritual & Hindu Religious Platform)
 * 
 * Enforces:
 *  - Sacred Sanctum Decorum (सात्विक वातावरण)
 *  - Elimination of profanity, abuse, and vulgarity
 *  - Elimination of anti-religious hatred and communal hostility
 *  - Elimination of commercial crypto/gambling/adult spam
 *  - Preservation of genuine Bhakti, Darshan discussions, Vedic philosophy, and Temple rituals
 */

export interface ModerationResult {
  isApproved: boolean;
  classification: 'SATVIK' | 'NEEDS_REVIEW' | 'REJECTED';
  confidence: number;
  flaggedKeywords: string[];
  reason?: string;
  suggestedAction?: 'PUBLISH' | 'HOLD_FOR_MODERATOR' | 'BLOCK';
}

// Blocked profane, abusive, or commercial spam keywords (multi-lingual: English, Marathi, Hindi)
const BLOCKED_SPAM_PATTERNS = [
  // Commercial spam & gambling
  /\b(casino|betting|teen patti cash|satta|matka|crypto giveaway|forex trading bonus|earn 50000 daily|lottery prize)\b/i,
  // Vulgarity & explicit sexual content
  /\b(porn|xxx|nude|sex tape|escort service|call girl|adult chat)\b/i,
  // Hate speech & abusive slurs
  /\b(kill all|hate religion|terrorist|subhuman|scam religion|fake god|death to)\b/i,
  // Vulgar Marathi & Hindi abusive slurs (standard regex sanitizers)
  /\b(chutiya|bhosdike|harami|madarchod|behenchod|randi|gaand|lavde|bhadva|jhava|aighalya)\b/i,
];

// Keywords indicating genuine spiritual relevance and sanctum reverence
const SPIRITUAL_RELEVANCE_TOKENS = [
  'bhagwan', 'shree', 'mandir', 'temple', 'darshan', 'arti', 'pooja', 'abhishek',
  'ganesh', 'shiva', 'mahadev', 'vitthal', 'pandharpur', 'hanuman', 'ram', 'krishna',
  'bholenath', 'bappa', 'mantra', 'stotra', 'chalisa', 'chaturmas', 'namasmaran',
  'bhakti', 'dharma', 'karma', 'satvik', 'om', 'prasad', 'sanctum', 'pandit', 'trust',
  'आरती', 'पूजा', 'मंदिर', 'दर्शन', 'गणेश', 'शिव', 'महादेव', 'विठ्ठल', 'हनुमान', 'स्तोत्र', 'चातुर्मास'
];

export function moderateSpiritualContent(text: string): ModerationResult {
  if (!text || typeof text !== 'string') {
    return {
      isApproved: true,
      classification: 'SATVIK',
      confidence: 1.0,
      flaggedKeywords: [],
      suggestedAction: 'PUBLISH',
    };
  }

  const normalized = text.toLowerCase().trim();
  const flaggedKeywords: string[] = [];

  // 1. Check for hard-blocked patterns
  for (const pattern of BLOCKED_SPAM_PATTERNS) {
    const match = normalized.match(pattern);
    if (match) {
      flaggedKeywords.push(match[0]);
    }
  }

  if (flaggedKeywords.length > 0) {
    return {
      isApproved: false,
      classification: 'REJECTED',
      confidence: 0.98,
      flaggedKeywords,
      reason: `Content violates sacred sanctum decorum. Detected prohibited patterns: [${flaggedKeywords.join(', ')}]`,
      suggestedAction: 'BLOCK',
    };
  }

  // 2. Check for general tone and non-spiritual commercial volume
  const hasSpiritualContext = SPIRITUAL_RELEVANCE_TOKENS.some((token) =>
    normalized.includes(token)
  );

  // If text is excessively long or completely devoid of any spiritual or community context
  if (normalized.length > 300 && !hasSpiritualContext && /\b(buy now|discount|sale|click link)\b/i.test(normalized)) {
    return {
      isApproved: false,
      classification: 'NEEDS_REVIEW',
      confidence: 0.85,
      flaggedKeywords: ['commercial_solicitation'],
      reason: 'Post appears to be commercial solicitation unrelated to Hindu spiritual seva or temple events.',
      suggestedAction: 'HOLD_FOR_MODERATOR',
    };
  }

  return {
    isApproved: true,
    classification: 'SATVIK',
    confidence: 0.99,
    flaggedKeywords: [],
    suggestedAction: 'PUBLISH',
  };
}
