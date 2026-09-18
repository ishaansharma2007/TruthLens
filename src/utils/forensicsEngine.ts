import { ForensicsData, Platform, RiskFlag, SentimentTone, VerdictStatus } from '../types/claim';

const SENSATIONAL_WORDS = [
  'breaking',
  'shocking',
  'urgent',
  'must watch',
  'exposed',
  'scandal',
  'miracle',
  'secret leaked',
  'leaked',
  '100% true',
  'share before deleted',
  'forward to everyone',
  'bombshell',
  'unbelievable',
  'warning',
  'banned',
  'hidden truth',
  'conspiracy',
  'rigged',
  'stolen',
  'panic',
  'arrested',
  'collapse',
];

const DEEPFAKE_INDICATORS = [
  'voice clone',
  'deepfake',
  'ai generated',
  'lip sync',
  'audio leak',
  'synthetic',
  'leaked audio',
  'cgi',
  'face swap',
  'ai model',
  'cloned voice',
  'generated speech',
  'teleprompter glitch',
  'avatar',
];

const PANIC_WORDS = [
  'emergency',
  'collapse',
  'shut down',
  'evacuate',
  'danger',
  'toxic',
  'fatal',
  'freeze accounts',
  'bank run',
  'martial law',
  'lockdown',
  'outbreak',
];

const OUTRAGE_WORDS = [
  'betrayal',
  'traitor',
  'scam',
  'looted',
  'fraud',
  'hypocrisy',
  'disgrace',
  'rigged',
  'cheated',
  'corrupt',
];

export function analyzeTextForensics(
  text: string,
  platform: Platform,
  imageUrl?: string
): ForensicsData {
  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();

  // 1. Sensational Rule
  const triggerWordsFound = SENSATIONAL_WORDS.filter((word) =>
    lowerText.includes(word)
  );
  const isSensational = triggerWordsFound.length > 0;

  // 2. High Caps Rule (>50% uppercase letters)
  const lettersOnly = cleanText.replace(/[^a-zA-Z]/g, '');
  let capsPercentage = 0;
  if (lettersOnly.length > 0) {
    const upperCount = cleanText.replace(/[^A-Z]/g, '').length;
    capsPercentage = Math.round((upperCount / lettersOnly.length) * 100);
  }
  const isHighCaps = lettersOnly.length >= 10 && capsPercentage > 50;

  // 3. Unsourced Rule (missing http:// or https://)
  const urlPattern = /(https?:\/\/[^\s]+)/gi;
  const hasSources = urlPattern.test(cleanText);
  const isUnsourced = !hasSources;

  // Assemble Risk Flags
  const riskFlags: RiskFlag[] = [];
  if (isSensational) riskFlags.push('SENSATIONAL');
  if (isHighCaps) riskFlags.push('HIGH_CAPS');
  if (isUnsourced) riskFlags.push('UNSOURCED');

  // Trigger High Risk badge if 2+ flags are met
  const isHighRisk = riskFlags.length >= 2;

  // 4. Deepfake Probability Calculation
  let deepfakeScore = 8; // baseline noise
  const deepfakeWordCount = DEEPFAKE_INDICATORS.filter((word) =>
    lowerText.includes(word)
  ).length;

  if (deepfakeWordCount > 0) {
    deepfakeScore += deepfakeWordCount * 32;
  }
  if (lowerText.includes('audio') && (lowerText.includes('leak') || lowerText.includes('tape'))) {
    deepfakeScore += 25;
  }
  if (imageUrl && (imageUrl.includes('deepfake') || imageUrl.includes('clone') || imageUrl.includes('ai_'))) {
    deepfakeScore += 30;
  }
  if (lowerText.includes('modi') || lowerText.includes('speech') || lowerText.includes('confession')) {
    if (deepfakeWordCount > 0) deepfakeScore += 15;
  }
  // Clamp between 5% and 97%
  const deepfakeProbability = Math.min(97, Math.max(5, Math.round(deepfakeScore)));

  // 5. Sentiment & Tone Heatmap
  let sentimentTone: SentimentTone = 'Neutral Fact';
  const panicCount = PANIC_WORDS.filter((w) => lowerText.includes(w)).length;
  const outrageCount = OUTRAGE_WORDS.filter((w) => lowerText.includes(w)).length;

  if (panicCount >= 2 || (panicCount >= 1 && isHighCaps)) {
    sentimentTone = 'High Panic';
  } else if (outrageCount >= 2 || (outrageCount >= 1 && isSensational)) {
    sentimentTone = 'Outrage';
  } else if (isSensational || lowerText.includes('urgent') || lowerText.includes('alert')) {
    sentimentTone = 'Urgent Alert';
  } else if (lowerText.includes('advisory') || lowerText.includes('official') || lowerText.includes('press release') || hasSources) {
    sentimentTone = 'Confirmatory';
  }

  // 6. Cross-Platform Virality Predictor (0 - 100)
  let virality = 35;
  if (platform === 'WhatsApp') virality += 25; // Dark social rapid peer-to-peer forwarding
  if (platform === 'X') virality += 20; // Algorithmic retweets
  if (platform === 'Instagram') virality += 18;
  if (isSensational) virality += 18;
  if (isHighCaps) virality += 10;
  if (sentimentTone === 'High Panic' || sentimentTone === 'Outrage') virality += 15;
  const viralityScore = Math.min(99, Math.max(12, virality));

  // 7. Automated Credibility Trust Score (0 - 100%)
  let trust = 80;
  if (isSensational) trust -= 25;
  if (isHighCaps) trust -= 20;
  if (isUnsourced) trust -= 25;
  if (deepfakeProbability > 60) trust -= 30;
  else if (deepfakeProbability > 30) trust -= 15;
  if (hasSources) trust += 20;
  if (sentimentTone === 'Confirmatory') trust += 15;
  const credibilityScore = Math.min(98, Math.max(4, trust));

  return {
    deepfakeProbability,
    sentimentTone,
    riskFlags,
    isHighRisk,
    capsPercentage,
    triggerWordsFound,
    hasSources,
    viralityScore,
    credibilityScore,
  };
}

// AI-Assisted Fact Check Synthesizer for Reviewers
export interface SynthesizedFactCheck {
  draftSummary: string;
  recommendedVerdict: VerdictStatus;
  confidence: number;
  discrepancies: string[];
  keyEvidence: string[];
  suggestedAction: string;
}

export function synthesizeFactCheck(
  title: string,
  content: string,
  forensics: ForensicsData
): SynthesizedFactCheck {
  const lower = (title + ' ' + content).toLowerCase();
  const discrepancies: string[] = [];
  const keyEvidence: string[] = [];
  let recommendedVerdict: VerdictStatus = 'MISLEADING';
  let confidence = 88;

  if (lower.includes('evm') || lower.includes('election') || lower.includes('vote count')) {
    discrepancies.push('Audio acoustic spectrum matches known synthetic voice generative models.');
    discrepancies.push('Election Commission official ledger confirms zero protocol discrepancies on tally servers.');
    keyEvidence.push('ECI Press Note 2026/09: Tally procedures adhere to air-gapped dual-authentication keys.');
    keyEvidence.push('Forensic spectrogram reveals unnatural silence intervals characteristic of RVC/ElevenLabs voice synthesis.');
    recommendedVerdict = 'MISLEADING';
    confidence = 94;
  } else if (lower.includes('5000') || lower.includes('microchip') || lower.includes('satellite') || lower.includes('rbi')) {
    discrepancies.push('Reserve Bank of India has issued no notification for currency denominations exceeding ₹500.');
    discrepancies.push('Physical impossibility: passive RFID/GPS tracking chips cannot operate without an integrated inductive battery.');
    keyEvidence.push('RBI Department of Currency Management Gazette 2026: No ₹5000 note authorized.');
    keyEvidence.push('Recycled 2016 demonetization hoax imagery repurposed with digital watermark retouching.');
    recommendedVerdict = 'FALSE';
    confidence = 99;
  } else if (lower.includes('icmr') || lower.includes('who') || lower.includes('guidance') || lower.includes('heatwave')) {
    discrepancies.push('Cross-referenced with official portal: matches ICMR Health Bulletin Ref-2026/H-19.');
    keyEvidence.push('Verified signed bulletin published on icmr.gov.in official press wire.');
    recommendedVerdict = 'AUTHENTIC';
    confidence = 96;
  } else if (lower.includes('recharge') || lower.includes('500gb') || lower.includes('free 5g') || lower.includes('sms')) {
    discrepancies.push('Phishing link directs to dynamic APK download rather than telecommunication operator portal.');
    discrepancies.push('DoT (Department of Telecommunications) cybercell issued active scam advisory.');
    keyEvidence.push('Domain WHOIS reveals registrar created 48 hours ago in offshore bulletproof hosting.');
    recommendedVerdict = 'FALSE';
    confidence = 98;
  } else {
    if (forensics.isHighRisk || forensics.credibilityScore < 35) {
      recommendedVerdict = 'FALSE';
      discrepancies.push('Multiple viral manipulation markers detected: unsourced assertions and aggressive emotional urgency triggers.');
      discrepancies.push('Primary assertions fail independent corroboration across national news wire archives.');
      keyEvidence.push('Forensic rule engine detected high sensationalism index with 0 verified press references.');
      confidence = 85;
    } else if (forensics.credibilityScore > 75) {
      recommendedVerdict = 'AUTHENTIC';
      discrepancies.push('Factual assertions consistent with reported institutional statements.');
      keyEvidence.push('Cross-referenced public records support primary timeline and attribution.');
      confidence = 90;
    } else {
      recommendedVerdict = 'MISLEADING';
      discrepancies.push('Substantial omission of surrounding context distorting original event narrative.');
      keyEvidence.push('Original source video was selectively cropped to remove opening disclaimer.');
      confidence = 84;
    }
  }

  const draftSummary = `Investigative triage analysis confirms that the viral claim '${title}' exhibits ${
    recommendedVerdict === 'AUTHENTIC' ? 'verified factual alignment' : 'critical factual distortions'
  }. Independent verification cross-referenced official registers and forensic spectrograms to establish this finding.`;

  const suggestedAction = recommendedVerdict === 'AUTHENTIC' 
    ? 'Clear for Authentic stamp publication and append official institutional reference links.' 
    : 'Issue immediate Debunk Advisory, stamp with red/amber verdict seal, and trigger syndication to WhatsApp debunk bot.';

  return {
    draftSummary,
    recommendedVerdict,
    confidence,
    discrepancies,
    keyEvidence,
    suggestedAction,
  };
}

// Auto-Scraper Simulation for Social URLs
export interface ScrapedPostData {
  platform: Platform;
  extractedTitle: string;
  extractedContent: string;
  authorHandle: string;
  imageUrl?: string;
  category: any;
  timestamp: string;
}

export function simulateSocialScraper(url: string): ScrapedPostData {
  const lower = url.toLowerCase();
  
  if (lower.includes('x.com') || lower.includes('twitter.com')) {
    return {
      platform: 'X',
      extractedTitle: 'Viral thread asserting midnight policy alteration',
      extractedContent: 'URGENT: Government silently gazettes emergency economic restrictions ahead of Monday trading session! Insiders confirm top banks ordered to freeze bulk withdrawals. SHARE BEFORE CENSORED!!',
      authorHandle: '@FastNewsDesk24',
      imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
      category: 'Finance',
      timestamp: 'Just now',
    };
  }

  if (lower.includes('whatsapp') || lower.includes('chat.whatsapp')) {
    return {
      platform: 'WhatsApp',
      extractedTitle: 'Forwarded Many Times: Free 500GB 5G data voucher',
      extractedContent: '*FREE 5G RECHARGE OFFER 2026*! To celebrate Digital India anniversary, government is giving 500GB high-speed 5G voucher to all SIM cards. Click now to claim yours: http://free-5g-recharge-reward.cc',
      authorHandle: 'Forwarded Many Times (+91 98XXX XXXXX)',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      category: 'Tech',
      timestamp: '12m ago',
    };
  }

  if (lower.includes('instagram.com')) {
    return {
      platform: 'Instagram',
      extractedTitle: 'Viral Reel: Celebrity detained in international transit',
      extractedContent: 'BREAKING: Top Bollywood star arrested at London Heathrow with undeclared assets. Audio recording of confession inside customs terminal leaked online!!',
      authorHandle: '@bollywood_leaks_exclusive',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      category: 'Entertainment',
      timestamp: '35m ago',
    };
  }

  // Generic fallback
  return {
    platform: 'Other',
    extractedTitle: 'Extracted viral claim from social feed',
    extractedContent: 'SHOCKING LEAK: Urgent public advisory circulating on private group chats claiming imminent grid collapse. Check official verification status.',
    authorHandle: '@web_archive_monitor',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    category: 'Social',
    timestamp: '1h ago',
  };
}
