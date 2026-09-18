export type Platform = 'WhatsApp' | 'X' | 'Instagram' | 'Facebook' | 'YouTube' | 'Other';

export type Category = 
  | 'Politics' 
  | 'Health' 
  | 'Finance' 
  | 'Business' 
  | 'World' 
  | 'Entertainment' 
  | 'Sports' 
  | 'Social' 
  | 'Tech' 
  | 'Other';

export type VerdictStatus = 
  | 'UNVERIFIED' 
  | 'IN_REVIEW' 
  | 'AUTHENTIC' 
  | 'MISLEADING' 
  | 'FALSE';

export type RiskFlag = 'SENSATIONAL' | 'HIGH_CAPS' | 'UNSOURCED';

export type SentimentTone = 'High Panic' | 'Outrage' | 'Urgent Alert' | 'Neutral Fact' | 'Confirmatory';

export interface ForensicsData {
  deepfakeProbability: number; // 0 - 100
  sentimentTone: SentimentTone;
  riskFlags: RiskFlag[];
  isHighRisk: boolean; // 2+ flags met
  capsPercentage: number;
  triggerWordsFound: string[];
  hasSources: boolean;
  viralityScore: number; // 0 - 100 spread velocity
  credibilityScore: number; // 0 - 100 trust rating
}

export interface PeerVote {
  id: string;
  investigatorName: string;
  investigatorRole: string;
  avatarUrl?: string;
  verdict: 'AUTHENTIC' | 'MISLEADING' | 'FALSE';
  confidence: number; // 0 - 100 %
  notes: string;
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  author: string;
  action: string;
  previousStatus?: VerdictStatus;
  newStatus?: VerdictStatus;
  details: string;
}

export interface Claim {
  id: string;
  title: string;
  content: string;
  sourcePlatform: Platform;
  sourceUrl?: string;
  imageUrl: string;
  category: Category;
  tags: string[];
  status: VerdictStatus;
  submitter: {
    name: string;
    isAnonymous: boolean;
    timestamp: string;
  };
  forensics: ForensicsData;
  officialVerdict?: {
    verdict: VerdictStatus;
    summary: string;
    reviewedBy: string;
    reviewedAt: string;
    confidence: number;
    keyEvidence: string[];
  };
  peerVotes: PeerVote[];
  auditTrail: AuditLogEntry[];
  spreadMetrics: {
    estimatedShares: number;
    hourlyVelocity: number;
    estimatedReach: number;
    platformBreakdown: { [key in Platform]?: number };
  };
  similarClaimIds?: string[];
}
