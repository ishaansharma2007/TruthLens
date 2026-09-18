import React, { useState } from 'react';
import { Claim, VerdictStatus, PeerVote } from '../types/claim';
import { VerdictStamp } from './VerdictStamp';
import { 
  synthesizeFactCheck, 
  SynthesizedFactCheck 
} from '../utils/forensicsEngine';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Vote, 
  Clock, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Send, 
  History, 
  Filter,
  UserCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewerCommandCenterProps {
  claims: Claim[];
  onCastVote: (claimId: string, vote: Omit<PeerVote, 'id' | 'timestamp'>) => void;
  onPublishVerdict: (
    claimId: string,
    verdict: VerdictStatus,
    summary: string,
    investigatorName: string,
    confidence: number,
    keyEvidence: string[]
  ) => void;
  onSelectClaimForDossier: (claim: Claim) => void;
}

export const ReviewerCommandCenter: React.FC<ReviewerCommandCenterProps> = ({
  claims,
  onCastVote,
  onPublishVerdict,
  onSelectClaimForDossier,
}) => {
  const [selectedClaimId, setSelectedClaimId] = useState<string>(
    claims.find((c) => c.status === 'UNVERIFIED')?.id || claims[0]?.id || ''
  );
  const [triageFilter, setTriageFilter] = useState<
    'ALL' | 'UNVERIFIED' | 'HIGH_RISK' | 'IN_REVIEW' | 'VERIFIED'
  >('UNVERIFIED');

  // Active investigator identity (no login needed!)
  const [investigatorName, setInvestigatorName] = useState('Senior Investigator Sarah Jenkins');
  const [investigatorRole, setInvestigatorRole] = useState('Senior Forensic Fact-Checker');

  // Peer review form state
  const [voteVerdict, setVoteVerdict] = useState<'AUTHENTIC' | 'MISLEADING' | 'FALSE'>('FALSE');
  const [voteConfidence, setVoteConfidence] = useState<number>(90);
  const [voteNotes, setVoteNotes] = useState<string>('');

  // AI Fact-Check Synthesizer state
  const [synthesizedData, setSynthesizedData] = useState<SynthesizedFactCheck | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Verdict Publication Form
  const [verdictSummary, setVerdictSummary] = useState('');
  const [officialVerdictChoice, setOfficialVerdictChoice] = useState<VerdictStatus>('FALSE');
  const [finalConfidence, setFinalConfidence] = useState(95);

  const selectedClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];

  // Filter queue
  const filteredClaims = claims.filter((claim) => {
    if (triageFilter === 'UNVERIFIED') return claim.status === 'UNVERIFIED';
    if (triageFilter === 'HIGH_RISK') return claim.forensics.isHighRisk;
    if (triageFilter === 'IN_REVIEW') return claim.status === 'IN_REVIEW';
    if (triageFilter === 'VERIFIED')
      return (
        claim.status === 'AUTHENTIC' ||
        claim.status === 'MISLEADING' ||
        claim.status === 'FALSE'
      );
    return true;
  });

  // Calculate peer consensus percentage
  const calculateConsensus = (claim: Claim) => {
    if (!claim.peerVotes || claim.peerVotes.length === 0) {
      return { authentic: 0, misleading: 0, falseCount: 0, total: 0 };
    }
    const total = claim.peerVotes.length;
    const authentic = Math.round(
      (claim.peerVotes.filter((v) => v.verdict === 'AUTHENTIC').length / total) * 100
    );
    const misleading = Math.round(
      (claim.peerVotes.filter((v) => v.verdict === 'MISLEADING').length / total) * 100
    );
    const falseCount = Math.round(
      (claim.peerVotes.filter((v) => v.verdict === 'FALSE').length / total) * 100
    );
    return { authentic, misleading, falseCount, total };
  };

  const handleSynthesize = () => {
    if (!selectedClaim) return;
    setIsSynthesizing(true);
    setTimeout(() => {
      const syn = synthesizeFactCheck(
        selectedClaim.title,
        selectedClaim.content,
        selectedClaim.forensics
      );
      setSynthesizedData(syn);
      setVerdictSummary(syn.draftSummary);
      setOfficialVerdictChoice(syn.recommendedVerdict);
      setFinalConfidence(syn.confidence);
      setVoteNotes(`Synthesized evidence corroboration: ${syn.keyEvidence[0] || 'Matches forensic index.'}`);
      setIsSynthesizing(false);
    }, 400);
  };

  const handleCastVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim || !voteNotes.trim()) return;

    onCastVote(selectedClaim.id, {
      investigatorName,
      investigatorRole,
      verdict: voteVerdict,
      confidence: voteConfidence,
      notes: voteNotes.trim(),
    });

    setVoteNotes('');
  };

  const handlePublishVerdict = () => {
    if (!selectedClaim || !verdictSummary.trim()) return;

    const evidenceList = synthesizedData?.keyEvidence || [
      'Cross-checked with official registries and forensic rule engine flags.',
      'Corroborated by peer consensus investigative review.',
    ];

    onPublishVerdict(
      selectedClaim.id,
      officialVerdictChoice,
      verdictSummary.trim(),
      investigatorName,
      finalConfidence,
      evidenceList
    );

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  if (!selectedClaim) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500 font-mono">
        No claims available in the triage system.
      </div>
    );
  }

  const consensus = calculateConsensus(selectedClaim);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* Top Banner: Newsroom Investigator Identity Bar */}
      <div className="bg-[#111827] text-white p-4 rounded-xl mb-6 shadow-md border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black font-mono shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-headline text-white">
                Reviewer Command Center & Consensus Queue
              </h1>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold">
                Open Access Mode
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Peer-review triage, AI forensic synthesis, and stamped verdict authorization
            </p>
          </div>
        </div>

        {/* Investigator Quick Identity Profile */}
        <div className="flex items-center gap-3 bg-slate-800/80 px-3.5 py-2 rounded-lg border border-slate-700 text-xs">
          <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="font-mono text-gray-400 text-[10px] uppercase">Logged Investigator:</div>
            <input
              type="text"
              value={investigatorName}
              onChange={(e) => setInvestigatorName(e.target.value)}
              className="bg-transparent font-semibold text-white focus:outline-hidden border-b border-gray-600 hover:border-amber-400 text-xs w-48"
              title="Click to edit reviewer identity"
            />
          </div>
          <select
            value={investigatorRole}
            onChange={(e) => setInvestigatorRole(e.target.value)}
            className="bg-slate-900 text-gray-300 text-[11px] border border-slate-700 rounded px-2 py-1 font-mono focus:outline-hidden"
          >
            <option value="Senior Forensic Fact-Checker">Forensics Lead</option>
            <option value="Political Desk Editor">Political Editor</option>
            <option value="Cyber Threat Analyst">Malware Analyst</option>
            <option value="Public Health Lead">Health Specialist</option>
            <option value="OSINT Investigator">OSINT Specialist</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Triage Queue Sidebar (4 cols) + Active Case Investigation Workspace (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Triage Queue List */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-[750px]">
          {/* Queue Header & Filters */}
          <div className="p-4 border-b border-gray-200 bg-gray-50/70">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-gray-500" />
                Triage Intake Queue ({filteredClaims.length})
              </span>
              <span className="text-[10px] font-mono text-gray-500">Live Queue</span>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'UNVERIFIED', label: 'Unverified' },
                { id: 'HIGH_RISK', label: 'High Risk' },
                { id: 'IN_REVIEW', label: 'In Review' },
                { id: 'VERIFIED', label: 'Published' },
                { id: 'ALL', label: 'All' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTriageFilter(f.id as any)}
                  className={`text-[11px] font-mono px-2 py-1 rounded transition-colors cursor-pointer ${
                    triageFilter === f.id
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Claim Items Scrollable */}
          <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
            {filteredClaims.map((claim) => {
              const isSelected = claim.id === selectedClaim.id;
              return (
                <div
                  key={claim.id}
                  onClick={() => {
                    setSelectedClaimId(claim.id);
                    setSynthesizedData(null);
                    setVerdictSummary(claim.officialVerdict?.summary || '');
                    setOfficialVerdictChoice(claim.officialVerdict?.verdict || 'MISLEADING');
                  }}
                  className={`p-3.5 transition-colors cursor-pointer text-left ${
                    isSelected ? 'bg-amber-50/80 border-l-4 border-slate-900' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-semibold">
                      {claim.sourcePlatform}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                      claim.status === 'AUTHENTIC' ? 'bg-emerald-100 text-emerald-800' :
                      claim.status === 'MISLEADING' ? 'bg-amber-100 text-amber-800' :
                      claim.status === 'FALSE' ? 'bg-rose-100 text-rose-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {claim.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug font-headline">
                    {claim.title}
                  </h4>

                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-gray-500">
                    <span className="flex items-center gap-1">
                      <Vote className="w-3 h-3 text-gray-400" />
                      {claim.peerVotes.length} votes
                    </span>
                    {claim.forensics.isHighRisk && (
                      <span className="text-rose-600 font-bold flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" /> High Risk
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Case Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Case Card Header */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-6">
              {/* Status and Category Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <VerdictStamp verdict={selectedClaim.status} size="sm" />
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase">
                    Desk: {selectedClaim.category}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    ID: {selectedClaim.id}
                  </span>
                </div>

                <button
                  onClick={() => onSelectClaimForDossier(selectedClaim)}
                  className="text-xs font-semibold text-slate-900 hover:text-amber-600 flex items-center gap-1 cursor-pointer font-mono underline"
                >
                  <span>Open Full Impact Dossier</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Title & Viral Content */}
              <h2 className="text-xl font-bold font-headline text-gray-900 leading-tight">
                {selectedClaim.title}
              </h2>

              <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs font-sans text-gray-800 leading-relaxed">
                <div className="font-mono text-[10px] text-gray-400 uppercase font-bold mb-1">
                  Ingested Viral Text:
                </div>
                "{selectedClaim.content}"
              </div>

              {/* Forensic Metric Strip */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="text-[10px] text-gray-500 uppercase">Deepfake Prob</div>
                  <div className="text-sm font-bold text-purple-700 mt-0.5">
                    {selectedClaim.forensics.deepfakeProbability}%
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="text-[10px] text-gray-500 uppercase">Sentiment Tone</div>
                  <div className="text-sm font-bold text-gray-800 mt-0.5">
                    {selectedClaim.forensics.sentimentTone}
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="text-[10px] text-gray-500 uppercase">Virality Score</div>
                  <div className="text-sm font-bold text-amber-700 mt-0.5">
                    {selectedClaim.forensics.viralityScore}/100
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="text-[10px] text-gray-500 uppercase">Trust Rating</div>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">
                    {selectedClaim.forensics.credibilityScore}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI-Assisted Fact-Check Synthesizer Module */}
          <div className="bg-gradient-to-br from-purple-50/50 to-amber-50/30 border border-purple-200/80 rounded-xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 font-headline">
                    AI-Assisted Fact-Check Synthesizer
                  </h3>
                  <p className="text-[11px] text-gray-600 font-sans">
                    Automated draft notes, cross-referencing registries and acoustic spectrograms
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSynthesize}
                disabled={isSynthesizing}
                className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-mono font-bold px-4 py-2 rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
                <span>{isSynthesizing ? 'Synthesizing...' : 'Run AI Synthesis'}</span>
              </button>
            </div>

            {synthesizedData ? (
              <div className="mt-4 space-y-3 animate-in fade-in duration-200 text-xs">
                <div className="bg-white p-3.5 rounded-lg border border-purple-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <span className="text-gray-500 uppercase text-[10px] font-bold">Recommended Verdict:</span>
                    <span className="font-bold text-purple-900 px-2 py-0.5 rounded bg-purple-100">
                      {synthesizedData.recommendedVerdict} ({synthesizedData.confidence}% Confidence)
                    </span>
                  </div>
                  <p className="text-gray-800 leading-relaxed font-sans">
                    {synthesizedData.draftSummary}
                  </p>
                </div>

                {/* Key Discrepancies & Evidence */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <span className="font-mono text-[10px] font-bold text-rose-700 uppercase block mb-1.5">
                      Factual Discrepancies:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-[11px]">
                      {synthesizedData.discrepancies.map((disc, idx) => (
                        <li key={idx}>{disc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <span className="font-mono text-[10px] font-bold text-emerald-700 uppercase block mb-1.5">
                      Corroborating Evidence:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-[11px]">
                      {synthesizedData.keyEvidence.map((ev, idx) => (
                        <li key={idx}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-center py-4 text-gray-500 text-xs font-mono">
                Click "Run AI Synthesis" to generate cross-referenced notes and evidence citations.
              </div>
            )}
          </div>

          {/* Consensus Peer Review Voting Module */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-gray-900 font-headline">
                  Investigator Consensus Voting & Peer Review
                </h3>
              </div>
              <span className="text-xs font-mono text-gray-500">
                {selectedClaim.peerVotes.length} Verified Votes Cast
              </span>
            </div>

            {/* Live Consensus Meter Bar */}
            <div className="mb-5">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="font-bold text-gray-700">Peer Consensus Agreement:</span>
                <span className="text-gray-500 text-[11px]">
                  {consensus.falseCount}% False • {consensus.misleading}% Misleading • {consensus.authentic}% Authentic
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex shadow-inner">
                <div
                  className="h-full bg-rose-600 transition-all"
                  style={{ width: `${consensus.falseCount}%` }}
                  title={`False: ${consensus.falseCount}%`}
                />
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${consensus.misleading}%` }}
                  title={`Misleading: ${consensus.misleading}%`}
                />
                <div
                  className="h-full bg-emerald-600 transition-all"
                  style={{ width: `${consensus.authentic}%` }}
                  title={`Authentic: ${consensus.authentic}%`}
                />
              </div>
            </div>

            {/* Stake Your Peer Vote Form */}
            <form onSubmit={handleCastVote} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-5 space-y-3">
              <div className="text-xs font-bold text-gray-800 font-mono uppercase flex items-center justify-between">
                <span>Stake Your Peer Review Vote:</span>
                <span className="text-indigo-600 font-normal text-[11px]">Acting as {investigatorName}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Verdict Buttons */}
                <button
                  type="button"
                  onClick={() => setVoteVerdict('AUTHENTIC')}
                  className={`py-2 px-3 rounded-md text-xs font-bold font-mono transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                    voteVerdict === 'AUTHENTIC'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AUTHENTIC</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVoteVerdict('MISLEADING')}
                  className={`py-2 px-3 rounded-md text-xs font-bold font-mono transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                    voteVerdict === 'MISLEADING'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>MISLEADING</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVoteVerdict('FALSE')}
                  className={`py-2 px-3 rounded-md text-xs font-bold font-mono transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                    voteVerdict === 'FALSE'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                      : 'bg-white text-rose-800 border-rose-300 hover:bg-rose-50'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  <span>FALSE</span>
                </button>
              </div>

              {/* Confidence Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-1">
                  <span className="text-gray-600 font-semibold">Investigator Confidence:</span>
                  <span className="font-bold text-indigo-700">{voteConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={voteConfidence}
                  onChange={(e) => setVoteConfidence(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Reviewer Note */}
              <div>
                <label className="block text-xs font-mono font-bold text-gray-700 uppercase mb-1">
                  Investigation Rationale / Technical Note:
                </label>
                <textarea
                  rows={2}
                  required
                  value={voteNotes}
                  onChange={(e) => setVoteNotes(e.target.value)}
                  placeholder="State evidence, discrepancy source, or forensic observations..."
                  className="w-full text-xs font-sans px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-slate-900 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={!voteNotes.trim()}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-mono font-bold px-4 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Cast Peer Vote</span>
              </button>
            </form>

            {/* List of Cast Peer Votes */}
            <div className="space-y-2.5">
              <span className="font-mono text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Investigator Stake Ledger:
              </span>
              {selectedClaim.peerVotes.length === 0 ? (
                <div className="text-xs text-gray-400 font-mono py-2">
                  No peer votes cast yet. Be the first investigator to stake a vote!
                </div>
              ) : (
                selectedClaim.peerVotes.map((vote) => (
                  <div
                    key={vote.id}
                    className="p-3 bg-white rounded-lg border border-gray-200 text-xs space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{vote.investigatorName}</span>
                        <span className="text-[10px] font-mono text-gray-500">
                          ({vote.investigatorRole})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          vote.verdict === 'AUTHENTIC' ? 'bg-emerald-100 text-emerald-800' :
                          vote.verdict === 'MISLEADING' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {vote.verdict} ({vote.confidence}%)
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(vote.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 font-sans">{vote.notes}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Official Verdict Publication Box */}
          <div className="bg-white border-2 border-slate-900 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200 mb-4">
              <FileText className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 font-headline">
                  Publish Official Newsroom Stamped Verdict
                </h3>
                <p className="text-[11px] text-gray-500 font-sans">
                  Finalizes claim status, stamps public feed cards, and updates live marquee
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-gray-700 uppercase mb-1">
                    Official Stamp Decision:
                  </label>
                  <select
                    value={officialVerdictChoice}
                    onChange={(e) => setOfficialVerdictChoice(e.target.value as VerdictStatus)}
                    className="w-full text-xs font-mono font-bold px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-slate-900 bg-white"
                  >
                    <option value="FALSE">FALSE (Debunk Hoax)</option>
                    <option value="MISLEADING">MISLEADING (Context Missing)</option>
                    <option value="AUTHENTIC">AUTHENTIC (Verified Real)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-gray-700 uppercase mb-1">
                    Editorial Confidence (%):
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={finalConfidence}
                    onChange={(e) => setFinalConfidence(Number(e.target.value))}
                    className="w-full text-xs font-mono px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-gray-700 uppercase mb-1">
                  Official Debunk Explanatory Summary Note:
                </label>
                <textarea
                  rows={3}
                  value={verdictSummary}
                  onChange={(e) => setVerdictSummary(e.target.value)}
                  placeholder="Official public explanation outlining evidence, why the claim is false/authentic, and institutional sources..."
                  className="w-full text-xs font-sans px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlePublishVerdict}
                  disabled={!verdictSummary.trim()}
                  className="bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white font-mono font-bold text-xs px-6 py-3 rounded-lg shadow-md transition-colors cursor-pointer flex items-center gap-2 uppercase tracking-wider"
                >
                  <VerdictStamp verdict={officialVerdictChoice} size="sm" showIcon={false} />
                  <span>Authorize & Stamp Verdict</span>
                </button>
              </div>
            </div>
          </div>

          {/* Audit Trail & Versioning Log */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200 mb-4">
              <History className="w-4 h-4 text-gray-600" />
              <h3 className="text-xs font-mono font-bold text-gray-800 uppercase tracking-wider">
                Audit Trail & Version History
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {selectedClaim.auditTrail.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{log.author}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-[11px] font-sans mt-0.5">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
