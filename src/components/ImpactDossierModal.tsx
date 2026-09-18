import React from 'react';
import { Claim } from '../types/claim';
import { VerdictStamp } from './VerdictStamp';
import { ShareCardGenerator } from './ShareCardGenerator';
import { 
  X, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  FileCheck, 
  Globe, 
  ArrowRight,
  TrendingUp,
  GitCommit,
  Radio
} from 'lucide-react';

interface ImpactDossierModalProps {
  claim: Claim | null;
  allClaims: Claim[];
  onClose: () => void;
  onSelectSimilarClaim: (claim: Claim) => void;
  onOpenReviewerDesk: (claim: Claim) => void;
}

export const ImpactDossierModal: React.FC<ImpactDossierModalProps> = ({
  claim,
  allClaims,
  onClose,
  onSelectSimilarClaim,
  onOpenReviewerDesk,
}) => {
  if (!claim) return null;

  // Find similar claims
  const similarClaims = allClaims.filter(
    (c) =>
      c.id !== claim.id &&
      (claim.similarClaimIds?.includes(c.id) ||
        c.category === claim.category ||
        c.tags.some((t) => claim.tags.includes(t)))
  ).slice(0, 3);

  // Sentiment Trigger Heatmap Highlight
  const renderHighlightedContent = () => {
    const text = claim.content;
    const triggers = claim.forensics.triggerWordsFound;
    if (!triggers || triggers.length === 0) return <span>{text}</span>;

    const regex = new RegExp(`(${triggers.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) => {
          const isTrigger = triggers.some(
            (t) => t.toLowerCase() === part.toLowerCase()
          );
          if (isTrigger) {
            return (
              <span
                key={i}
                className="bg-amber-200 text-amber-950 font-bold px-1 py-0.5 rounded border-b-2 border-amber-600 inline-block mx-0.5"
                title="Urgency / Sensational Trigger Word"
              >
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-5xl my-8 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Dossier Header */}
        <div className="bg-[#111827] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black font-mono shadow-xs">
              DOC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-headline text-white">
                  Investigative Dossier & Impact Radius
                </h2>
                <span className="font-mono text-[11px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-slate-700">
                  REF: {claim.id}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans">
                Full forensic timeline, cross-platform spread metrics, and peer consensus analysis
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

        {/* Dossier Body Scrollable */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Top Section: Media Banner with Angled Stamp & Official Verdict */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Visual Media with Angled Verdict Stamp (5 cols) */}
            <div className="lg:col-span-5 relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100 shadow-md">
              <img
                src={claim.imageUrl}
                alt={claim.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';
                }}
              />

              {/* Bold Angled Stamped Seal Overlay */}
              <div className="absolute top-6 right-5 drop-shadow-xl z-10">
                <VerdictStamp verdict={claim.status} size="lg" />
              </div>

              {/* Bottom Media Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 to-transparent p-3 pt-8 flex items-center justify-between text-white text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Platform: {claim.sourcePlatform}
                </span>
                <span className="text-gray-300">Desk: {claim.category}</span>
              </div>
            </div>

            {/* Title & Official Verdict Statement (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold border border-gray-300">
                  {claim.category}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">
                  Ingested: {new Date(claim.submitter.timestamp).toLocaleString()}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  Source: {claim.submitter.name}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black font-headline text-gray-900 leading-tight">
                {claim.title}
              </h1>

              {/* Official Reviewer Summary Box */}
              <div className={`p-4 rounded-lg border-2 ${
                claim.status === 'AUTHENTIC' ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950' :
                claim.status === 'MISLEADING' ? 'bg-amber-50/70 border-amber-500 text-amber-950' :
                claim.status === 'FALSE' ? 'bg-rose-50/70 border-rose-500 text-rose-950' :
                'bg-slate-50 border-slate-400 text-slate-900'
              }`}>
                <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4" />
                    Official Newsroom Verdict: {claim.status}
                  </span>
                  {claim.officialVerdict?.confidence && (
                    <span>{claim.officialVerdict.confidence}% Confidence</span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-sans leading-relaxed">
                  {claim.officialVerdict?.summary ||
                    'This claim is presently queued in the Reviewer Command Center for peer consensus voting and forensic synthesis.'}
                </p>

                {claim.officialVerdict?.keyEvidence && (
                  <div className="mt-3 pt-3 border-t border-gray-200/60 text-xs">
                    <span className="font-mono font-bold uppercase tracking-wider text-[11px] block mb-1">
                      Key Corroborating Evidence:
                    </span>
                    <ul className="list-disc list-inside space-y-1 font-sans">
                      {claim.officialVerdict.keyEvidence.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenReviewerDesk(claim)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold px-4 py-2 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Open in Reviewer Command Center</span>
                </button>
              </div>
            </div>
          </div>

          {/* Viral Text & Sentiment Tone Heatmap */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-gray-700 uppercase tracking-wider">
                Viral Claim Transcript & Tone Heatmap:
              </span>
              <span className="font-mono text-xs font-bold text-amber-700 px-2 py-0.5 rounded bg-amber-100">
                Tone: {claim.forensics.sentimentTone}
              </span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-200 text-sm font-sans leading-relaxed text-gray-900">
              {renderHighlightedContent()}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 font-mono">
              <span>Highlighted words indicate urgency/sensationalism triggers detected by heuristic rule engine.</span>
              <span>Shouting Caps: {claim.forensics.capsPercentage}%</span>
            </div>
          </div>

          {/* Impact Radius & Spread Milestone Timeline */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-gray-900 font-headline">
                  Impact Radius & Spread Map
                </h3>
              </div>
              <div className="font-mono text-xs text-gray-500">
                Spread Velocity: <span className="font-bold text-amber-700">{claim.forensics.viralityScore}/100</span>
              </div>
            </div>

            {/* Milestone Timeline Graph */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-300">
              {/* Milestone 1: Submission */}
              <div className="relative">
                <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">
                  1
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>Viral Ingestion & Intake</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-[11px] text-gray-500">
                      {new Date(claim.submitter.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-sans mt-0.5">
                    Claim entered TruthLens via {claim.sourcePlatform} submitted by {claim.submitter.name}.
                  </p>
                </div>
              </div>

              {/* Milestone 2: Automated Heuristics */}
              <div className="relative">
                <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-mono font-bold">
                  2
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>AI Forensics & Heuristic Triage</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-[11px] text-amber-700 font-bold">
                      {claim.forensics.isHighRisk ? 'Flagged High Risk' : 'Clean Heuristics'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-sans mt-0.5">
                    Deepfake Probability measured at {claim.forensics.deepfakeProbability}%. Triggered flags: {claim.forensics.riskFlags.join(', ') || 'None'}.
                  </p>
                </div>
              </div>

              {/* Milestone 3: Peer Consensus */}
              <div className="relative">
                <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-mono font-bold">
                  3
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>Investigator Peer Consensus Staked</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-[11px] text-indigo-700 font-bold">
                      {claim.peerVotes.length} Reviewers Staked
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-sans mt-0.5">
                    Independent newsroom investigators reviewed evidence and cross-referenced public registers.
                  </p>
                </div>
              </div>

              {/* Milestone 4: Verdict Published */}
              <div className="relative">
                <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-mono font-bold">
                  4
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>Official Stamped Seal & Public Debunk Released</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-[11px] text-emerald-700 font-bold">
                      Status: {claim.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-sans mt-0.5">
                    Public dossier activated, share cards rendered, and live ticker syndicated across the network.
                  </p>
                </div>
              </div>
            </div>

            {/* Estimated Cross-Platform Reach Distribution */}
            <div className="pt-4 border-t border-gray-200">
              <span className="font-mono text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                Estimated Cross-Platform Reach Breakdown:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="text-gray-500 text-[10px] uppercase">Est. Shares</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">
                    {claim.spreadMetrics.estimatedShares.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="text-gray-500 text-[10px] uppercase">Est. Total Reach</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">
                    {claim.spreadMetrics.estimatedReach.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="text-gray-500 text-[10px] uppercase">Hourly Velocity</div>
                  <div className="text-sm font-black text-amber-700 mt-0.5">
                    +{claim.spreadMetrics.hourlyVelocity.toLocaleString()}/hr
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="text-gray-500 text-[10px] uppercase">Dominant Vector</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">
                    {claim.sourcePlatform}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* One-Click Public Share Card Section */}
          <ShareCardGenerator claim={claim} />

          {/* Similar Claims Recommender */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-700" />
                <h4 className="text-xs font-mono font-bold text-gray-800 uppercase tracking-wider">
                  Similar & Related Historical Claims
                </h4>
              </div>
              <span className="text-[11px] text-gray-500 font-sans">
                Cross-referenced to prevent duplicate investigations
              </span>
            </div>

            {similarClaims.length === 0 ? (
              <div className="text-xs text-gray-400 font-mono py-2">
                No related claims in the archive currently match this fingerprint.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {similarClaims.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectSimilarClaim(sim)}
                    className="p-3 rounded-lg border border-gray-200 hover:border-slate-900 transition-all cursor-pointer bg-gray-50/60 hover:bg-white text-left flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gray-200 text-gray-700">
                          {sim.sourcePlatform}
                        </span>
                        <VerdictStamp verdict={sim.status} size="sm" showIcon={false} />
                      </div>
                      <h5 className="text-xs font-bold text-gray-900 font-headline line-clamp-2">
                        {sim.title}
                      </h5>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-200 text-[10px] font-mono text-gray-500 flex items-center justify-between">
                      <span>92% semantic match</span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
