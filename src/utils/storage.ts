import { Claim, PeerVote, VerdictStatus } from '../types/claim';
import { INITIAL_CLAIMS } from '../data/seedClaims';

const STORAGE_KEY = 'truthlens_claims_db_v1';

export function getStoredClaims(): Claim[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLAIMS));
      return INITIAL_CLAIMS;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLAIMS));
      return INITIAL_CLAIMS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to read from localStorage:', err);
    return INITIAL_CLAIMS;
  }
}

export function saveStoredClaims(claims: Claim[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function addClaimToStore(newClaim: Claim): Claim[] {
  const current = getStoredClaims();
  const updated = [newClaim, ...current];
  saveStoredClaims(updated);
  return updated;
}

export function updateClaimInStore(updatedClaim: Claim): Claim[] {
  const current = getStoredClaims();
  const updated = current.map((c) => (c.id === updatedClaim.id ? updatedClaim : c));
  saveStoredClaims(updated);
  return updated;
}

export function castPeerVote(
  claimId: string,
  vote: Omit<PeerVote, 'id' | 'timestamp'>
): Claim[] {
  const current = getStoredClaims();
  const updated = current.map((claim) => {
    if (claim.id !== claimId) return claim;

    const newVote: PeerVote = {
      ...vote,
      id: `vote-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    const newAudit = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author: vote.investigatorName,
      action: 'PEER_VOTE_CAST',
      details: `Staked confidence vote: ${vote.verdict} (${vote.confidence}% confidence). "${vote.notes}"`,
    };

    return {
      ...claim,
      peerVotes: [...claim.peerVotes, newVote],
      auditTrail: [...claim.auditTrail, newAudit],
    };
  });

  saveStoredClaims(updated);
  return updated;
}

export function publishOfficialVerdict(
  claimId: string,
  verdict: VerdictStatus,
  summary: string,
  investigatorName: string,
  confidence: number,
  keyEvidence: string[]
): Claim[] {
  const current = getStoredClaims();
  const updated = current.map((claim) => {
    if (claim.id !== claimId) return claim;

    const prevStatus = claim.status;
    const now = new Date().toISOString();

    const officialVerdict = {
      verdict,
      summary,
      reviewedBy: investigatorName,
      reviewedAt: now,
      confidence,
      keyEvidence,
    };

    const auditEntry = {
      id: `log-${Date.now()}`,
      timestamp: now,
      author: investigatorName,
      action: 'OFFICIAL_VERDICT_COMMITTED',
      previousStatus: prevStatus,
      newStatus: verdict,
      details: `Official stamped verdict published: ${verdict} with ${confidence}% confidence.`,
    };

    return {
      ...claim,
      status: verdict,
      officialVerdict,
      auditTrail: [...claim.auditTrail, auditEntry],
    };
  });

  saveStoredClaims(updated);
  return updated;
}

export function resetDemoData(): Claim[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLAIMS));
  return INITIAL_CLAIMS;
}
