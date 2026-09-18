import React, { useRef, useState } from 'react';
import { Claim } from '../types/claim';
import { Download, Copy, Check, Share2, Sparkles } from 'lucide-react';
import { VerdictStamp } from './VerdictStamp';

interface ShareCardGeneratorProps {
  claim: Claim;
}

export const ShareCardGenerator: React.FC<ShareCardGeneratorProps> = ({ claim }) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCopyText = () => {
    const shareText = `🚨 [TRUTHLENS FACT-CHECK VERDICT: ${claim.status}]\n\nClaim: "${claim.title}"\n\nVerdict: ${claim.officialVerdict?.summary || 'Investigated by TruthLens Newsroom.'}\n\nEvidence & Full Dossier: ${window.location.origin}/#${claim.id}\n#TruthLens #FactCheck #StopMisinformation`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    setIsGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 1200;
    canvas.height = 675;

    // 1. Background fill
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Load and draw media image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = claim.imageUrl;

    img.onload = () => {
      // Draw image in top half or background
      ctx.drawImage(img, 0, 0, canvas.width, 360);

      // Dark gradient overlay on image bottom
      const gradient = ctx.createLinearGradient(0, 240, 0, 360);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 240, canvas.width, 120);

      // Platform & Category Badge
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(40, 30, 160, 36);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`${claim.sourcePlatform.toUpperCase()} ALERT`, 55, 55);

      // Angled Stamped Seal Graphic
      ctx.save();
      ctx.translate(canvas.width - 240, 100);
      ctx.rotate((-12 * Math.PI) / 180);

      let stampColor = '#dc2626';
      let stampBg = '#fee2e2';
      if (claim.status === 'AUTHENTIC') {
        stampColor = '#059669';
        stampBg = '#ecfdf5';
      } else if (claim.status === 'MISLEADING') {
        stampColor = '#d97706';
        stampBg = '#fef3c7';
      }

      ctx.fillStyle = stampBg;
      ctx.fillRect(-180, -35, 360, 70);
      ctx.strokeStyle = stampColor;
      ctx.lineWidth = 6;
      ctx.strokeRect(-180, -35, 360, 70);

      ctx.fillStyle = stampColor;
      ctx.font = '900 36px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(claim.status, 0, 2);
      ctx.restore();

      // Lower Area (Card Details)
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 30px Georgia, serif';
      ctx.textAlign = 'left';

      // Multi-line Title
      const title = claim.title;
      ctx.fillText(title.slice(0, 65) + (title.length > 65 ? '...' : ''), 40, 420);

      // Debunk Summary
      ctx.fillStyle = '#374151';
      ctx.font = '20px sans-serif';
      const summary =
        claim.officialVerdict?.summary ||
        'Independently investigated by TruthLens Newsroom AI Forensics Desk.';
      ctx.fillText(summary.slice(0, 95) + (summary.length > 95 ? '...' : ''), 40, 470);
      if (summary.length > 95) {
        ctx.fillText(summary.slice(95, 190) + (summary.length > 190 ? '...' : ''), 40, 500);
      }

      // Footer Banner
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 585, canvas.width, 90);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 22px "Playfair Display", serif';
      ctx.fillText('TruthLens Investigative Newsroom', 40, 638);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px monospace';
      ctx.fillText('VERIFIED: Sat, 19 Sept 2026 • AI Forensics & Consensus Stamped', 450, 638);

      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `truthlens-debunk-${claim.id}.png`;
      link.href = dataUrl;
      link.click();
      setIsGenerating(false);
    };

    img.onerror = () => {
      // Fallback simple draw
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('TruthLens Debunk Card', 40, 80);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `truthlens-debunk-${claim.id}.png`;
      link.href = dataUrl;
      link.click();
      setIsGenerating(false);
    };
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold font-headline text-white">
              One-Click Public Debunk Share Card
            </h4>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Ready-to-share social image stamped with official TruthLens verdict seal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-medium px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1 border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isGenerating}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-bold px-3.5 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Rendering...' : 'Download Card (PNG)'}</span>
          </button>
        </div>
      </div>

      {/* Preview Card Mockup */}
      <div className="bg-white text-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-md">
        <div className="relative h-40 bg-gray-200 overflow-hidden">
          <img
            src={claim.imageUrl}
            alt={claim.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-4 drop-shadow-lg">
            <VerdictStamp verdict={claim.status} size="md" />
          </div>
          <div className="absolute bottom-2 left-3 bg-slate-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded">
            {claim.sourcePlatform} FACT-CHECK
          </div>
        </div>

        <div className="p-4 bg-white">
          <h5 className="font-bold text-sm font-headline line-clamp-1 text-gray-900">
            {claim.title}
          </h5>
          <p className="text-xs text-gray-600 font-sans line-clamp-2 mt-1">
            {claim.officialVerdict?.summary || claim.content}
          </p>
          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono text-gray-500">
            <span className="font-bold text-slate-900">TruthLens Newsroom</span>
            <span>Sat, 19 Sept 2026 • Verified AI Debunk</span>
          </div>
        </div>
      </div>

      {/* Hidden Canvas for High-Resolution Export */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
