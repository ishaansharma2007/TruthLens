import React, { useState, useEffect, useMemo } from 'react';
import type { Claim, VerdictStatus, PeerVote } from './types/claim';
import { 
  getStoredClaims, 
  addClaimToStore, 
  castPeerVote, 
  publishOfficialVerdict, 
  resetDemoData 
} from './utils/storage';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { TrendingTicker } from './components/TrendingTicker';
import { LiveStreamMarquee } from './components/LiveStreamMarquee';
import { ClaimCard } from './components/ClaimCard';
import { SubmitClaimModal } from './components/SubmitClaimModal';
import { ReviewerCommandCenter } from './components/ReviewerCommandCenter';
import { ImpactDossierModal } from './components/ImpactDossierModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { 
  LayoutGrid, 
  List, 
  AlertTriangle, 
  Flame, 
  HelpCircle
} from 'lucide-react';

export function App() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedClaimForDossier, setSelectedClaimForDossier] = useState<Claim | null>(null);

  // Navigation & View States
  const [activeView, setActiveView] = useState<'feed' | 'reviewer' | 'analytics'>('feed');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedSpecialFilter, setSelectedSpecialFilter] = useState<string | null>(null);

  // Load claims on mount
  useEffect(() => {
    const loaded = getStoredClaims();
    setClaims(loaded);
  }, []);

  // Filtered claims memo
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = claim.title.toLowerCase().includes(q);
        const matchContent = claim.content.toLowerCase().includes(q);
        const matchTag = claim.tags.some((t) => t.toLowerCase().includes(q));
        const matchPlatform = claim.sourcePlatform.toLowerCase().includes(q);
        const matchCategory = claim.category.toLowerCase().includes(q);
        if (!matchTitle && !matchContent && !matchTag && !matchPlatform && !matchCategory) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'ALL' && claim.category !== selectedCategory) {
        return false;
      }

      // 3. Platform Filter
      if (selectedPlatform !== 'ALL' && claim.sourcePlatform !== selectedPlatform) {
        return false;
      }

      // 4. Status Filter
      if (selectedStatus !== 'ALL' && claim.status !== selectedStatus) {
        return false;
      }

      // 5. High Risk Only
      if (highRiskOnly && !claim.forensics.isHighRisk) {
        return false;
      }

      // 6. Tag filter
      if (selectedTag && !claim.tags.includes(selectedTag)) {
        return false;
      }

      // 7. Special Navbar Filters
      if (selectedSpecialFilter === 'Election Tracker') {
        if (claim.category !== 'Politics' && !claim.tags.some((t) => t.toLowerCase().includes('election'))) {
          return false;
        }
      } else if (selectedSpecialFilter === 'ScamCheck') {
        if (!claim.tags.some((t) => t.toLowerCase().includes('scam') || t.toLowerCase().includes('banking') || t.toLowerCase().includes('phishing'))) {
          return false;
        }
      } else if (selectedSpecialFilter === 'Explainers') {
        if (!claim.tags.some((t) => t.toLowerCase().includes('explainers') || t.toLowerCase().includes('guidance') || t.toLowerCase().includes('who') || t.toLowerCase().includes('health'))) {
          return false;
        }
      } else if (selectedSpecialFilter === 'Decode') {
        if (!claim.tags.some((t) => t.toLowerCase().includes('decode') || t.toLowerCase().includes('deepfake') || t.toLowerCase().includes('ai'))) {
          return false;
        }
      }

      return true;
    });
  }, [
    claims,
    searchQuery,
    selectedCategory,
    selectedPlatform,
    selectedStatus,
    highRiskOnly,
    selectedTag,
    selectedSpecialFilter,
  ]);

  // Handlers
  const handleAddNewClaim = (newClaim: Claim) => {
    const updated = addClaimToStore(newClaim);
    setClaims(updated);
    setSelectedClaimForDossier(newClaim);
  };

  const handleCastVote = (claimId: string, vote: Omit<PeerVote, 'id' | 'timestamp'>) => {
    const updated = castPeerVote(claimId, vote);
    setClaims(updated);
  };

  const handlePublishVerdict = (
    claimId: string,
    verdict: VerdictStatus,
    summary: string,
    investigatorName: string,
    confidence: number,
    keyEvidence: string[]
  ) => {
    const updated = publishOfficialVerdict(
      claimId,
      verdict,
      summary,
      investigatorName,
      confidence,
      keyEvidence
    );
    setClaims(updated);
    if (selectedClaimForDossier && selectedClaimForDossier.id === claimId) {
      const refreshed = updated.find((c) => c.id === claimId);
      if (refreshed) setSelectedClaimForDossier(refreshed);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo claims and audit trails to pristine factory defaults?')) {
      const fresh = resetDemoData();
      setClaims(fresh);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111827] flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* 1. Header (Masthead, Live Utility Bar with Sat, 19 Sept 2026, Search) */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        onResetData={handleResetData}
      />

      {/* 2. Structured Main Navigation Bar */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        activeView={activeView}
        setActiveView={setActiveView}
        selectedSpecialFilter={selectedSpecialFilter}
        onSelectSpecialFilter={setSelectedSpecialFilter}
      />

      {/* 3. Trending Hashtag Ticker Bar */}
      <TrendingTicker
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
      />

      {/* 4. Live Stream Verdict Marquee */}
      <LiveStreamMarquee
        claims={claims}
        onSelectClaim={(c) => setSelectedClaimForDossier(c)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'reviewer' ? (
          <ReviewerCommandCenter
            claims={claims}
            onCastVote={handleCastVote}
            onPublishVerdict={handlePublishVerdict}
            onSelectClaimForDossier={(c) => setSelectedClaimForDossier(c)}
          />
        ) : activeView === 'analytics' ? (
          <AnalyticsDashboard
            claims={claims}
            onSelectClaim={(c) => setSelectedClaimForDossier(c)}
            onBackToFeed={() => setActiveView('feed')}
          />
        ) : (
          /* Default: Public Newsroom Feed */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            {/* Feed Controls & Filter Bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Left Filters: Status Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                <span className="text-gray-400 uppercase font-bold text-[11px] mr-1">
                  Status:
                </span>
                {[
                  { id: 'ALL', label: 'All Items' },
                  { id: 'AUTHENTIC', label: 'Authentic' },
                  { id: 'MISLEADING', label: 'Misleading' },
                  { id: 'FALSE', label: 'False' },
                  { id: 'UNVERIFIED', label: 'Unverified / Triage' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStatus(s.id)}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-semibold ${
                      selectedStatus === s.id
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}

                {/* High Risk Toggle */}
                <button
                  onClick={() => setHighRiskOnly(!highRiskOnly)}
                  className={`ml-2 px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 border ${
                    highRiskOnly
                      ? 'bg-rose-600 text-white border-rose-700 font-bold'
                      : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-50'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>High Risk Only</span>
                </button>
              </div>

              {/* Right Controls: Platform Dropdown & Grid/List Switcher */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                {/* Platform Selector */}
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-gray-400">Platform:</span>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="bg-gray-50 text-gray-800 text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  >
                    <option value="ALL">All Platforms</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="X">X (Twitter)</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Other">Other / SMS</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Bar */}
            {(selectedCategory !== 'ALL' ||
              selectedPlatform !== 'ALL' ||
              selectedStatus !== 'ALL' ||
              highRiskOnly ||
              selectedTag ||
              selectedSpecialFilter ||
              searchQuery) && (
              <div className="flex items-center justify-between text-xs bg-amber-50/70 border border-amber-200/80 px-4 py-2 rounded-lg font-mono">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-amber-900">Active Filters:</span>
                  {selectedCategory !== 'ALL' && (
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      Category: {selectedCategory}
                    </span>
                  )}
                  {selectedPlatform !== 'ALL' && (
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      Platform: {selectedPlatform}
                    </span>
                  )}
                  {selectedStatus !== 'ALL' && (
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      Status: {selectedStatus}
                    </span>
                  )}
                  {highRiskOnly && (
                    <span className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-bold">
                      High Risk Only
                    </span>
                  )}
                  {selectedTag && (
                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded">
                      {selectedTag}
                    </span>
                  )}
                  {selectedSpecialFilter && (
                    <span className="bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded">
                      {selectedSpecialFilter}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
                      "{searchQuery}"
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedPlatform('ALL');
                    setSelectedStatus('ALL');
                    setHighRiskOnly(false);
                    setSelectedTag(null);
                    setSelectedSpecialFilter(null);
                    setSearchQuery('');
                  }}
                  className="text-amber-900 hover:text-red-700 font-bold hover:underline cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Claims Feed Content */}
            {filteredClaims.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold font-headline text-gray-900">
                  No Investigative Claims Found
                </h3>
                <p className="text-xs text-gray-500 font-sans max-w-md mx-auto">
                  No claims currently match your filter criteria. Try adjusting your query or submit a new claim to the triage desk.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-mono text-xs font-bold px-4 py-2 rounded-md transition-colors cursor-pointer"
                  >
                    + Submit New Claim
                  </button>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClaims.map((claim) => (
                  <ClaimCard
                    key={claim.id}
                    claim={claim}
                    onSelectClaim={(c) => setSelectedClaimForDossier(c)}
                  />
                ))}
              </div>
            ) : (
              /* Investigative List View */
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs divide-y divide-gray-100">
                {filteredClaims.map((claim) => (
                  <div
                    key={claim.id}
                    onClick={() => setSelectedClaimForDossier(claim)}
                    className="p-4 hover:bg-gray-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={claim.imageUrl}
                        alt={claim.title}
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                            {claim.sourcePlatform}
                          </span>
                          <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                            {claim.category}
                          </span>
                          <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            claim.status === 'AUTHENTIC' ? 'bg-emerald-100 text-emerald-800' :
                            claim.status === 'MISLEADING' ? 'bg-amber-100 text-amber-800' :
                            claim.status === 'FALSE' ? 'bg-rose-100 text-rose-800' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {claim.status}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 font-headline">
                          {claim.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 font-sans">
                          "{claim.content}"
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto shrink-0 font-mono text-xs">
                      <span className="text-amber-700 font-bold flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                        {claim.forensics.viralityScore}/100 Virality
                      </span>
                      <span className="text-gray-500 text-[11px]">
                        Trust: {claim.forensics.credibilityScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <SubmitClaimModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitClaim={handleAddNewClaim}
      />

      <ImpactDossierModal
        claim={selectedClaimForDossier}
        allClaims={claims}
        onClose={() => setSelectedClaimForDossier(null)}
        onSelectSimilarClaim={(sim) => setSelectedClaimForDossier(sim)}
        onOpenReviewerDesk={() => {
          setSelectedClaimForDossier(null);
          setActiveView('reviewer');
        }}
      />

      {/* Formal Newspaper Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-200 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold">
                🦉
              </div>
              <div>
                <span className="font-bold text-sm font-masthead text-slate-900">
                  TruthLens Platform
                </span>
                <p className="text-gray-500 text-[11px]">
                  Track 2: Real-World AI Products — Misinformation Triage Platform
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-gray-600 font-mono text-[11px]">
              <span className="text-slate-900 font-bold">Editorial Principles:</span>
              <span>• Zero Authentication Friction</span>
              <span>• Consensus Peer Staking</span>
              <span>• Heuristic & AI Forensics</span>
              <span>• Open Public Debunking</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2 font-mono">
            <span>
              Edition: Sat, 19 Sept 2026 • Verified Non-Partisan Investigation Desk
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('reviewer')}
                className="hover:text-slate-900 underline cursor-pointer"
              >
                Reviewer Command Center
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveView('analytics')}
                className="hover:text-slate-900 underline cursor-pointer"
              >
                Data Dive
              </button>
              <span>•</span>
              <button
                onClick={handleResetData}
                className="hover:text-amber-700 underline cursor-pointer"
              >
                Reset Store
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
