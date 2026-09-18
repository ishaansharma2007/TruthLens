import React from 'react';
import { Flame, Tag } from 'lucide-react';

interface TrendingTickerProps {
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

const TRENDING_TAGS = [
  '#Election Result 2026',
  '#Scamcheck',
  '#Narendra Modi',
  '#WhatsApp',
  '#Deepfake',
  '#AIVoiceClone',
  '#FakeRecharge',
  '#BankingAlert',
  '#ICMRGuidance',
];

export const TrendingTicker: React.FC<TrendingTickerProps> = ({
  selectedTag,
  onSelectTag,
}) => {
  return (
    <div className="bg-[#f3f4f6] border-b border-gray-200 py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar text-xs">
        <div className="flex items-center gap-1.5 font-bold text-gray-700 uppercase tracking-wider shrink-0 font-mono">
          <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>Trending Dossiers:</span>
        </div>

        <div className="flex items-center gap-2">
          {TRENDING_TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onSelectTag(isSelected ? null : tag)}
                className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-medium transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <span>{tag}</span>
              </button>
            );
          })}

          {selectedTag && (
            <button
              onClick={() => onSelectTag(null)}
              className="text-gray-500 hover:text-red-600 text-[11px] font-mono underline ml-1 cursor-pointer shrink-0"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
