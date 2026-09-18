import React from 'react';
import { VerdictStatus } from '../types/claim';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface VerdictStampProps {
  verdict: VerdictStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export const VerdictStamp: React.FC<VerdictStampProps> = ({
  verdict,
  size = 'md',
  className = '',
  showIcon = true,
}) => {
  let text = 'UNDER REVIEW';
  let themeClasses = 'stamp-unverified';
  let icon = <Clock className="w-3.5 h-3.5 inline mr-1" />;

  switch (verdict) {
    case 'AUTHENTIC':
      text = 'AUTHENTIC';
      themeClasses = 'stamp-authentic';
      icon = <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 stroke-[3]" />;
      break;
    case 'MISLEADING':
      text = 'MISLEADING';
      themeClasses = 'stamp-misleading';
      icon = <AlertTriangle className="w-3.5 h-3.5 inline mr-1 stroke-[3]" />;
      break;
    case 'FALSE':
      text = 'FALSE';
      themeClasses = 'stamp-false';
      icon = <XCircle className="w-3.5 h-3.5 inline mr-1 stroke-[3]" />;
      break;
    case 'IN_REVIEW':
      text = 'IN REVIEW';
      themeClasses = 'stamp-unverified';
      icon = <Clock className="w-3.5 h-3.5 inline mr-1 stroke-[2.5]" />;
      break;
    default:
      text = 'UNVERIFIED';
      themeClasses = 'stamp-unverified';
      icon = <Clock className="w-3.5 h-3.5 inline mr-1 stroke-[2.5]" />;
      break;
  }

  const sizeClasses = {
    sm: 'text-[10px] tracking-widest px-2 py-0.5 border-2',
    md: 'text-xs tracking-widest px-3 py-1 border-[3px]',
    lg: 'text-base sm:text-lg tracking-widest px-5 py-2 border-4',
  }[size];

  return (
    <div
      className={`stamp-seal select-none font-mono font-black drop-shadow-sm ${themeClasses} ${sizeClasses} ${className}`}
      title={`Verdict: ${text}`}
    >
      <div className="flex items-center justify-center gap-1">
        {showIcon && icon}
        <span>{text}</span>
      </div>
    </div>
  );
};
