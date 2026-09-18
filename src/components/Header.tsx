import React from 'react';
import { 
  Search, 
  Share2, 
  ShieldCheck, 
  RotateCcw, 
  ExternalLink,
  Check,
  Radio,
  SlidersHorizontal
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSubmitModal: () => void;
  activeView: 'feed' | 'reviewer' | 'analytics';
  setActiveView: (view: 'feed' | 'reviewer' | 'analytics') => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenSubmitModal,
  activeView,
  setActiveView,
  onResetData,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShareTruthLens = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      {/* 1. Live Utility Bar */}
      <div className="bg-[#111827] text-gray-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-4">
          <span className="font-mono tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sat, 19 Sept 2026
          </span>
          <span className="hidden sm:inline-block text-gray-400 font-mono">
            EDITION: NATIONAL & GLOBAL TRIAGE
          </span>
          <span className="hidden md:inline-block text-gray-500">|</span>
          <span className="hidden md:inline-flex items-center gap-1 text-gray-400">
            <Radio className="w-3 h-3 text-red-400 animate-pulse" />
            LIVE FORENSICS FEED ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShareTruthLens}
            className="hover:text-white transition-colors flex items-center gap-1 text-gray-300 cursor-pointer"
            title="Copy TruthLens portal link"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
            <span>{copied ? 'Link Copied' : 'Share Portal'}</span>
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={onResetData}
            className="text-gray-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer text-xs"
            title="Reset to fresh seed claims"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset Demo Data</span>
          </button>
          <span className="text-gray-600">|</span>
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-1.5 py-0.5 rounded text-[10px] font-mono">
            ZERO AUTH REQUIRED
          </span>
        </div>
      </div>

      {/* 2. Main Newspaper Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <div 
            onClick={() => setActiveView('feed')} 
            className="cursor-pointer flex items-center gap-3.5 group select-none"
          >
            <div className="w-12 h-12 rounded-lg bg-[#0f172a] text-white flex items-center justify-center shadow-md border-2 border-amber-400/80 group-hover:scale-105 transition-transform">
              <span className="text-2xl" role="img" aria-label="Investigator Owl">🦉</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111827] font-masthead leading-none">
                  TruthLens
                </h1>
                <span className="text-xs font-mono font-bold tracking-widest bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 uppercase">
                  Newsroom
                </span>
              </div>
              <p className="text-xs text-gray-500 tracking-wide font-sans mt-0.5">
                Real-World AI Forensic Misinformation Triage & Consensus Fact-Checking
              </p>
            </div>
          </div>

          {/* Search and Action Buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search claims, tags, sources..."
                className="w-full bg-gray-50 text-gray-900 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all font-sans"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Submit Claim Button */}
            <button
              onClick={onOpenSubmitModal}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm px-3.5 py-2 rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>+ Submit Claim</span>
            </button>

            {/* Reviewer Command Center Switcher Button */}
            <button
              onClick={() => setActiveView(activeView === 'reviewer' ? 'feed' : 'reviewer')}
              className={`font-medium text-sm px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap border ${
                activeView === 'reviewer'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-inner'
                  : 'bg-white text-slate-800 border-gray-300 hover:bg-gray-50'
              }`}
              title="Toggle Newsroom Reviewer Command Center"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>{activeView === 'reviewer' ? 'Exit Desk' : 'Reviewer Desk'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
