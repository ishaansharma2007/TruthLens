import React from 'react';
import { Claim } from '../types/claim';
import { VerdictStamp } from './VerdictStamp';
import { 
  Flame, 
  Shield, 
  ExternalLink, 
  MessageSquare, 
  Users, 
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';

interface ClaimCardProps {
  claim: Claim;
  onSelectClaim: (claim: Claim) => void;
  onOpenReview?: (claim: Claim) => void;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({
  claim,
  onSelectClaim,
  onOpenReview,
}) => {
  const { forensics } = claim;

  // Credibility bar color
  const getCredibilityColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-600';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-rose-600';
  };

  return (
    <article
      onClick={() => onSelectClaim(claim)}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer border-t-2 hover:border-t-slate-900"
    >
      <div>
        {/* Visual Media Banner with Angled Stamped Seal Overlay */}
        <div className="relative h-48 w-full bg-gray-100 overflow-hidden border-b border-gray-200">
          <img
            src={claim.imageUrl}
            alt={claim.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            onError={(e) => {
              // Fallback image if unsplash link fails
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';
            }}
          />

          {/* Stamped Verdict Seal Angled Overlay */}
          <div className="absolute top-4 right-3 z-10 pointer-events-none drop-shadow-md">
            <VerdictStamp verdict={claim.status} size="sm" />
          </div>

          {/* Platform & Category Pill Overlay */}
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5 z-10">
            <span className="bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded font-medium shadow-xs">
              {claim.sourcePlatform}
            </span>
            <span className="bg-white/95 text-slate-800 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-semibold border border-gray-300 shadow-xs">
              {claim.category}
            </span>
          </div>

          {/* High Risk Overlay Indicator */}
          {forensics.isHighRisk && (
            <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm uppercase tracking-wider">
              <AlertTriangle className="w-3 h-3" />
              <span>HIGH RISK</span>
            </div>
          )}
        </div>

        {/* Card Content Area */}
        <div className="p-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {claim.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-gray-500 font-mono hover:text-slate-900 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Headline */}
          <h2 className="text-base font-bold text-gray-900 font-headline line-clamp-2 leading-snug group-hover:text-amber-900 transition-colors">
            {claim.title}
          </h2>

          {/* Claim excerpt */}
          <p className="mt-2 text-xs text-gray-600 line-clamp-3 leading-relaxed font-sans">
            "{claim.content}"
          </p>

          {/* Forensic Heuristic Flags Badges */}
          <div className="mt-3 flex flex-wrap gap-1 items-center">
            {forensics.riskFlags.length > 0 ? (
              forensics.riskFlags.map((flag) => {
                const label = `[${flag}]`;
                return (
                  <span
                    key={flag}
                    className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200"
                  >
                    {label}
                  </span>
                );
              })
            ) : (
              <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" />
                <span>[CLEAN_HEURISTICS]</span>
              </span>
            )}

            {forensics.deepfakeProbability >= 50 && (
              <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>DF: {forensics.deepfakeProbability}%</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Metrics Area */}
      <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex flex-col gap-2 text-xs">
        {/* Trust Score & Virality Indicators */}
        <div className="flex items-center justify-between font-mono text-[11px]">
          {/* Credibility Trust Score */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 text-[10px] uppercase">Trust:</span>
            <span className="font-bold text-gray-800">{forensics.credibilityScore}%</span>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getCredibilityColor(forensics.credibilityScore)}`}
                style={{ width: `${forensics.credibilityScore}%` }}
              />
            </div>
          </div>

          {/* Virality Velocity Score */}
          <div className="flex items-center gap-1 text-amber-700" title="Virality Velocity Score">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            <span className="font-semibold text-[11px]">{forensics.viralityScore}/100</span>
          </div>
        </div>

        {/* Investigator Consensus & Details Link */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-200/60 text-gray-500 text-[11px]">
          <div className="flex items-center gap-1 font-sans">
            <Users className="w-3 h-3 text-gray-400" />
            <span>
              {claim.peerVotes.length} {claim.peerVotes.length === 1 ? 'Peer Vote' : 'Peer Votes'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-800 font-medium group-hover:underline">
            <span>Inspect Dossier</span>
            <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-slate-800" />
          </div>
        </div>
      </div>
    </article>
  );
};
