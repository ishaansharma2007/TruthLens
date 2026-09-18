import React from 'react';
import { Claim } from '../types/claim';
import { Radio, AlertOctagon, CheckCircle, AlertTriangle } from 'lucide-react';

interface LiveStreamMarqueeProps {
  claims: Claim[];
  onSelectClaim: (claim: Claim) => void;
}

export const LiveStreamMarquee: React.FC<LiveStreamMarqueeProps> = ({
  claims,
  onSelectClaim,
}) => {
  const verifiedClaims = claims.filter((c) => c.status !== 'UNVERIFIED');
  // Duplicate list to create seamless infinite loop marquee
  const tickerItems = [...verifiedClaims, ...verifiedClaims];

  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800 py-1.5 px-4 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Fixed Left Badge */}
        <div className="flex items-center gap-1.5 bg-red-600 text-white font-mono font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded uppercase tracking-wider shrink-0 z-10 shadow-md">
          <Radio className="w-3 h-3 animate-pulse text-white" />
          <span>Live Verdicts</span>
        </div>

        {/* Marquee Content */}
        <div className="overflow-hidden whitespace-nowrap w-full ml-3 flex">
          <div className="animate-marquee flex items-center gap-8 py-0.5">
            {tickerItems.map((claim, idx) => {
              const getIcon = () => {
                if (claim.status === 'AUTHENTIC') {
                  return <CheckCircle className="w-3 h-3 text-emerald-400 inline mr-1" />;
                }
                if (claim.status === 'MISLEADING') {
                  return <AlertTriangle className="w-3 h-3 text-amber-400 inline mr-1" />;
                }
                return <AlertOctagon className="w-3 h-3 text-rose-400 inline mr-1" />;
              };

              const getBadgeColor = () => {
                if (claim.status === 'AUTHENTIC') return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/50';
                if (claim.status === 'MISLEADING') return 'text-amber-400 border-amber-500/40 bg-amber-950/50';
                return 'text-rose-400 border-rose-500/40 bg-rose-950/50';
              };

              return (
                <button
                  key={`${claim.id}-${idx}`}
                  onClick={() => onSelectClaim(claim)}
                  className="inline-flex items-center gap-2 text-xs hover:text-amber-300 transition-colors cursor-pointer group"
                >
                  <span className={`px-1.5 py-0.2 rounded border font-mono text-[10px] font-bold uppercase tracking-wider ${getBadgeColor()}`}>
                    {getIcon()}
                    {claim.status}
                  </span>
                  <span className="text-slate-200 group-hover:underline max-w-sm truncate">
                    {claim.title}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    ({claim.sourcePlatform})
                  </span>
                  <span className="text-slate-600 mx-2">•</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
