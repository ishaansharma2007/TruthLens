import React, { useState, useEffect } from 'react';
import { Platform, Category, Claim } from '../types/claim';
import { 
  analyzeTextForensics, 
  simulateSocialScraper 
} from '../utils/forensicsEngine';
import { 
  X, 
  Sparkles, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  Activity,
  Bot,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubmitClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitClaim: (newClaim: Claim) => void;
}

const SAMPLE_IMAGE_PRESETS = [
  {
    label: 'Election & Voting',
    url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Currency & Banking',
    url: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Telecom & Recharge',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Deepfake & Media',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Official Advisory',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  },
];

export const SubmitClaimModal: React.FC<SubmitClaimModalProps> = ({
  isOpen,
  onClose,
  onSubmitClaim,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourcePlatform, setSourcePlatform] = useState<Platform>('WhatsApp');
  const [category, setCategory] = useState<Category>('Politics');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80'
  );
  const [pasteUrlInput, setPasteUrlInput] = useState('');
  const [submitterName, setSubmitterName] = useState('Citizen Observer');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Real-time forensic evaluation state
  const [forensics, setForensics] = useState(
    analyzeTextForensics('', 'WhatsApp', imageUrl)
  );

  // Trigger real-time heuristics whenever content, platform, or image changes
  useEffect(() => {
    const evaluated = analyzeTextForensics(content, sourcePlatform, imageUrl);
    setForensics(evaluated);
  }, [content, sourcePlatform, imageUrl]);

  if (!isOpen) return null;

  // Auto Scraper Handler
  const handleAutoScrape = () => {
    if (!pasteUrlInput.trim()) return;
    const scraped = simulateSocialScraper(pasteUrlInput);
    setTitle(scraped.extractedTitle);
    setContent(scraped.extractedContent);
    setSourcePlatform(scraped.platform);
    if (scraped.imageUrl) setImageUrl(scraped.imageUrl);
    if (scraped.category) setCategory(scraped.category);
  };

  const loadSampleUrl = (sampleType: 'x' | 'whatsapp' | 'insta') => {
    if (sampleType === 'x') {
      setPasteUrlInput('https://x.com/FastNewsDesk24/status/19827361928');
    } else if (sampleType === 'whatsapp') {
      setPasteUrlInput('https://chat.whatsapp.com/forward/recharge-offer-free-5g');
    } else {
      setPasteUrlInput('https://instagram.com/reel/923841-bollywood-exclusive');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newClaimId = `claim-2026-${Date.now().toString().slice(-4)}`;
    const nowIso = new Date().toISOString();

    const newClaim: Claim = {
      id: newClaimId,
      title: title.trim(),
      content: content.trim(),
      sourcePlatform,
      sourceUrl: pasteUrlInput.trim() || undefined,
      imageUrl: imageUrl.trim(),
      category,
      tags: [`#${category}`, `#${sourcePlatform}`, `#TriageQueue`],
      status: 'UNVERIFIED',
      submitter: {
        name: isAnonymous ? 'Anonymous Tipster' : submitterName.trim() || 'Citizen Tipster',
        isAnonymous,
        timestamp: nowIso,
      },
      forensics,
      peerVotes: [],
      auditTrail: [
        {
          id: `log-${Date.now()}`,
          timestamp: nowIso,
          author: isAnonymous ? 'Anonymous Tipster' : submitterName.trim(),
          action: 'CLAIM_SUBMITTED',
          details: `Claim ingested via public intake. Forensics pre-check completed: Credibility=${forensics.credibilityScore}%, Virality=${forensics.viralityScore}%.`,
        },
      ],
      spreadMetrics: {
        estimatedShares: 1200,
        hourlyVelocity: forensics.viralityScore * 35,
        estimatedReach: forensics.viralityScore * 350,
        platformBreakdown: {
          [sourcePlatform]: 85,
          Other: 15,
        },
      },
      similarClaimIds: [],
    };

    onSubmitClaim(newClaim);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // Ignore in environments without canvas
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl my-8 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#111827] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold font-mono">
              TL
            </div>
            <div>
              <h2 className="text-lg font-bold font-headline leading-tight text-white">
                Submit Claim & Run AI Forensics Pre-Check
              </h2>
              <p className="text-xs text-gray-400 font-sans">
                Direct public intake desk • Zero authentication required • Instant heuristic scoring
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Form + Live Pre-Check Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* Left Form: Intake Fields (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-gray-200 space-y-4">
            {/* Auto-Scraper URL Ingestion Section */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 uppercase font-mono mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-amber-600" />
                  Auto-Scraper / URL Ingestion:
                </span>
                <span className="text-[10px] text-gray-500 font-normal">Optional</span>
              </label>
              
              <div className="flex gap-2">
                <input
                  type="url"
                  value={pasteUrlInput}
                  onChange={(e) => setPasteUrlInput(e.target.value)}
                  placeholder="Paste X post, WhatsApp forward, Instagram link..."
                  className="flex-1 bg-white text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAutoScrape}
                  disabled={!pasteUrlInput.trim()}
                  className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs px-3 py-2 rounded font-medium transition-colors cursor-pointer shrink-0"
                >
                  Auto-Extract
                </button>
              </div>

              {/* Sample Preset Links for Quick Testing */}
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500">
                <span>Try sample:</span>
                <button
                  type="button"
                  onClick={() => {
                    loadSampleUrl('whatsapp');
                    setTimeout(() => {
                      const sc = simulateSocialScraper('chat.whatsapp.com/free-5g');
                      setTitle(sc.extractedTitle);
                      setContent(sc.extractedContent);
                      setSourcePlatform(sc.platform);
                      setImageUrl(sc.imageUrl || imageUrl);
                    }, 50);
                  }}
                  className="text-amber-700 hover:underline font-mono cursor-pointer"
                >
                  WhatsApp Scam
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    loadSampleUrl('x');
                    setTimeout(() => {
                      const sc = simulateSocialScraper('x.com/viral');
                      setTitle(sc.extractedTitle);
                      setContent(sc.extractedContent);
                      setSourcePlatform(sc.platform);
                      setImageUrl(sc.imageUrl || imageUrl);
                    }, 50);
                  }}
                  className="text-amber-700 hover:underline font-mono cursor-pointer"
                >
                  X Viral Rumor
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    loadSampleUrl('insta');
                    setTimeout(() => {
                      const sc = simulateSocialScraper('instagram.com/reel');
                      setTitle(sc.extractedTitle);
                      setContent(sc.extractedContent);
                      setSourcePlatform(sc.platform);
                      setImageUrl(sc.imageUrl || imageUrl);
                    }, 50);
                  }}
                  className="text-amber-700 hover:underline font-mono cursor-pointer"
                >
                  Deepfake Reel
                </button>
              </div>
            </div>

            {/* Headline / Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                Claim Headline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Viral audio asserts voting machines tampered in 2026 election..."
                className="w-full text-sm px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-hidden font-medium"
              />
            </div>

            {/* Viral Post Content Text Area */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1 flex items-center justify-between">
                <span>Viral Text Content <span className="text-red-500">*</span></span>
                <span className="text-[11px] font-mono text-gray-500">
                  Caps: {forensics.capsPercentage}% | Words: {content.split(/\s+/).filter(Boolean).length}
                </span>
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the full viral forward, tweet text, or rumor verbatim..."
                className="w-full text-xs font-sans px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-hidden leading-relaxed"
              />
            </div>

            {/* Platform & Category Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                  Source Platform
                </label>
                <select
                  value={sourcePlatform}
                  onChange={(e) => setSourcePlatform(e.target.value as Platform)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-hidden bg-white"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="X">X (Twitter)</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Other">Other / SMS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                  Primary Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-hidden bg-white"
                >
                  <option value="Politics">Politics</option>
                  <option value="Finance">Finance</option>
                  <option value="Health">Health</option>
                  <option value="Business">Business</option>
                  <option value="World">World</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Sports">Sports</option>
                  <option value="Social">Social</option>
                  <option value="Tech">Tech</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Image URL Input Field & Preset Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  Image URL / Media Banner <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] text-gray-500 font-sans">
                  Cleanly rendered across every card & preview
                </span>
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-hidden font-mono"
              />

              {/* Presets */}
              <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] font-mono text-gray-400">Presets:</span>
                {SAMPLE_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submitter Details */}
            <div className="pt-2 border-t border-gray-200 grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                  Investigator / Submitter Name
                </label>
                <input
                  type="text"
                  disabled={isAnonymous}
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder="Your Name or Org"
                  className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-hidden disabled:bg-gray-100"
                />
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-slate-900 focus:ring-slate-900 h-4 w-4"
                  />
                  <span>Submit Anonymously (Whistleblower tip)</span>
                </label>
              </div>
            </div>

            {/* Submission Actions */}
            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !content.trim()}
                className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-md shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Bot className="w-4 h-4" />
                <span>Submit to Triage Queue</span>
              </button>
            </div>
          </form>

          {/* Right Pane: Real-Time Forensics Pre-Check Preview (5 cols) */}
          <div className="lg:col-span-5 bg-gray-50/80 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Real-Time Forensics Pre-Check</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                  AI ACTIVE
                </span>
              </div>

              {/* Media Banner Live Preview */}
              <div className="mt-3 relative h-32 w-full rounded-md overflow-hidden border border-gray-300 bg-gray-200 shadow-2xs">
                <img
                  src={imageUrl}
                  alt="Claim preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="absolute top-2 right-2 bg-slate-950/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  Live Media Banner
                </div>
                {forensics.isHighRisk && (
                  <div className="absolute bottom-2 left-2 bg-rose-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                    <AlertTriangle className="w-3 h-3" />
                    <span>HIGH RISK DETECTED</span>
                  </div>
                )}
              </div>

              {/* Pre-Check Heuristic Badges */}
              <div className="mt-4 space-y-3">
                <div>
                  <div className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Automated Risk Flags:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {forensics.riskFlags.length > 0 ? (
                      forensics.riskFlags.map((flag) => (
                        <span
                          key={flag}
                          className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300"
                        >
                          [{flag}]
                        </span>
                      ))
                    ) : (
                      <span className="font-mono text-xs font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        [CLEAN_NO_FLAGS]
                      </span>
                    )}
                    {forensics.isHighRisk && (
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">
                        [TRIAGE: HIGH RISK]
                      </span>
                    )}
                  </div>
                </div>

                {/* Deepfake Probability Meter */}
                <div className="bg-white p-3 rounded-md border border-gray-200">
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="text-gray-600 font-semibold">Deepfake Probability:</span>
                    <span className={`font-bold ${forensics.deepfakeProbability > 50 ? 'text-purple-700' : 'text-slate-700'}`}>
                      {forensics.deepfakeProbability}% {forensics.deepfakeProbability > 60 ? '(High)' : '(Low)'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        forensics.deepfakeProbability > 60 ? 'bg-purple-600' : 'bg-slate-500'
                      }`}
                      style={{ width: `${forensics.deepfakeProbability}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 font-sans">
                    Computed via synthetic speech cues, AI artifact phrases, and media parameters.
                  </p>
                </div>

                {/* Sentiment Tone & Emotional Urgency Heatmap */}
                <div className="bg-white p-3 rounded-md border border-gray-200">
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="text-gray-600 font-semibold">Sentiment Tone:</span>
                    <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                      forensics.sentimentTone === 'High Panic' ? 'bg-red-100 text-red-800' :
                      forensics.sentimentTone === 'Outrage' ? 'bg-amber-100 text-amber-800' :
                      forensics.sentimentTone === 'Urgent Alert' ? 'bg-orange-100 text-orange-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {forensics.sentimentTone}
                    </span>
                  </div>
                  {forensics.triggerWordsFound.length > 0 && (
                    <div className="mt-1 text-[11px] text-gray-500 font-mono">
                      <span>Triggers: </span>
                      <span className="text-rose-600 font-semibold">
                        {forensics.triggerWordsFound.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Virality & Credibility Pre-Scores */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-white p-2.5 rounded border border-gray-200">
                    <div className="text-gray-500 text-[10px] uppercase">Virality Velocity</div>
                    <div className="text-base font-black text-amber-700 mt-0.5 flex items-center gap-1">
                      <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
                      <span>{forensics.viralityScore}/100</span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded border border-gray-200">
                    <div className="text-gray-500 text-[10px] uppercase">Credibility Score</div>
                    <div className="text-base font-black text-slate-800 mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{forensics.credibilityScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] text-gray-500 font-sans">
              <span className="font-bold text-gray-700">Triage Notice:</span> Claims with 2+ flags automatically escalate to priority queues in the Reviewer Command Center for consensus voting.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
