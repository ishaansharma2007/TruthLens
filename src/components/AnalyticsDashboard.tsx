import React from 'react';
import { Claim, Platform, Category } from '../types/claim';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ShieldAlert, 
  Flame, 
  Activity, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Clock,
  Layers
} from 'lucide-react';

interface AnalyticsDashboardProps {
  claims: Claim[];
  onSelectClaim: (claim: Claim) => void;
  onBackToFeed: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  claims,
  onSelectClaim,
  onBackToFeed,
}) => {
  const totalClaims = claims.length;
  const verifiedFalse = claims.filter((c) => c.status === 'FALSE').length;
  const verifiedMisleading = claims.filter((c) => c.status === 'MISLEADING').length;
  const verifiedAuthentic = claims.filter((c) => c.status === 'AUTHENTIC').length;
  const pendingTriage = claims.filter(
    (c) => c.status === 'UNVERIFIED' || c.status === 'IN_REVIEW'
  ).length;
  const highRiskCount = claims.filter((c) => c.forensics.isHighRisk).length;

  const avgVirality = Math.round(
    claims.reduce((acc, c) => acc + c.forensics.viralityScore, 0) / (totalClaims || 1)
  );
  const avgCredibility = Math.round(
    claims.reduce((acc, c) => acc + c.forensics.credibilityScore, 0) / (totalClaims || 1)
  );

  // Platform Breakdown
  const platformCounts: { [key in Platform]?: number } = {};
  claims.forEach((c) => {
    platformCounts[c.sourcePlatform] = (platformCounts[c.sourcePlatform] || 0) + 1;
  });

  const platformsList = Object.entries(platformCounts).sort((a, b) => b[1] - a[1]);

  // Category Breakdown
  const categoryCounts: { [key in Category]?: number } = {};
  claims.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });
  const categoriesList = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111827] text-white p-6 rounded-xl shadow-md border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black font-mono shadow-xs">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-headline text-white">
                Data Dive: Misinformation Analytics & Platform Vulnerability
              </h1>
              <span className="bg-amber-950 text-amber-300 border border-amber-600 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold">
                Q3 2026 Intelligence
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Algorithmic spread vectors, platform vulnerability metrics, and forensic triage telemetry
            </p>
          </div>
        </div>

        <button
          onClick={onBackToFeed}
          className="bg-white hover:bg-gray-100 text-slate-900 font-mono text-xs font-bold px-4 py-2 rounded-md transition-colors cursor-pointer"
        >
          ← Return to Claims Feed
        </button>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 font-mono">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-[10px] text-gray-500 uppercase font-bold">Total Ingested</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalClaims}</div>
          <div className="text-[11px] text-gray-400 mt-0.5 font-sans">Claims cataloged</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-[10px] text-rose-600 uppercase font-bold">Debunked False</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{verifiedFalse}</div>
          <div className="text-[11px] text-gray-400 mt-0.5 font-sans">Outright hoaxes</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-[10px] text-amber-600 uppercase font-bold">Misleading</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{verifiedMisleading}</div>
          <div className="text-[11px] text-gray-400 mt-0.5 font-sans">Context distorted</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-[10px] text-emerald-600 uppercase font-bold">Authentic</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{verifiedAuthentic}</div>
          <div className="text-[11px] text-gray-400 mt-0.5 font-sans">Verified authentic</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-[10px] text-slate-600 uppercase font-bold">Avg Virality</div>
          <div className="text-2xl font-black text-amber-700 mt-1 flex items-center gap-1">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
            <span>{avgVirality}/100</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5 font-sans">Spread velocity</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-[10px] text-purple-600 uppercase font-bold">High Risk Ratio</div>
          <div className="text-2xl font-black text-purple-700 mt-1">
            {Math.round((highRiskCount / (totalClaims || 1)) * 100)}%
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5 font-sans">2+ flags triggered</div>
        </div>
      </div>

      {/* Main Charts & Analytics Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Platform Vulnerability Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-headline">
                Platform Vulnerability Breakdown
              </h3>
              <p className="text-xs text-gray-500 font-sans">
                Distribution of viral disinformation origins across major social networks
              </p>
            </div>
            <span className="font-mono text-xs text-gray-400 font-bold uppercase">Volume</span>
          </div>

          <div className="space-y-3">
            {platformsList.map(([platform, count]) => {
              const pct = Math.round((count / totalClaims) * 100);
              return (
                <div key={platform} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-gray-800">{platform}</span>
                    <span className="text-gray-500">{count} claims ({pct}%)</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${
                        platform === 'WhatsApp' ? 'bg-emerald-600' :
                        platform === 'X' ? 'bg-slate-900' :
                        platform === 'Instagram' ? 'bg-purple-600' :
                        platform === 'Facebook' ? 'bg-blue-600' :
                        'bg-amber-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 font-sans border border-gray-200">
            <span className="font-bold text-slate-900">Key Vulnerability Insight: </span>
            WhatsApp and dark social forwarding exhibit the highest velocity and lowest factual sourcing, requiring immediate automated debunk card syndication.
          </div>
        </div>

        {/* Category Risk Heatmap (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-headline">
                Thematic Category Distribution
              </h3>
              <p className="text-xs text-gray-500 font-sans">
                Concentration of viral claims across subject domains
              </p>
            </div>
            <span className="font-mono text-xs text-gray-400 font-bold uppercase">Desk Split</span>
          </div>

          <div className="space-y-3">
            {categoriesList.map(([cat, count]) => {
              const pct = Math.round((count / totalClaims) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-gray-800">{cat}</span>
                    <span className="text-gray-500">{count} dossiers ({pct}%)</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-indigo-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 font-sans border border-gray-200">
            <span className="font-bold text-slate-900">Editorial Alert: </span>
            Electoral politics and financial smishing scams represent 65% of high-risk triage alerts in September 2026.
          </div>
        </div>
      </div>

      {/* Highest Virality Claims Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-gray-900 font-headline">
              Top Virality Spread Velocity Ranking
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-500">Sorted by Velocity Score</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-gray-200 font-mono text-[11px] text-gray-400 uppercase">
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Claim Headline</th>
                <th className="py-2.5 px-3">Platform</th>
                <th className="py-2.5 px-3">Virality</th>
                <th className="py-2.5 px-3">Est. Reach</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...claims]
                .sort((a, b) => b.forensics.viralityScore - a.forensics.viralityScore)
                .map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        claim.status === 'AUTHENTIC' ? 'bg-emerald-100 text-emerald-800' :
                        claim.status === 'MISLEADING' ? 'bg-amber-100 text-amber-800' :
                        claim.status === 'FALSE' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-900 max-w-xs truncate">
                      {claim.title}
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-600">
                      {claim.sourcePlatform}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-700">
                      {claim.forensics.viralityScore}/100
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-600">
                      {claim.spreadMetrics.estimatedReach.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectClaim(claim)}
                        className="text-slate-900 hover:text-amber-600 font-mono font-bold hover:underline cursor-pointer"
                      >
                        Dossier →
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
