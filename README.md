# TruthLens 🦉

> **Track 2: Real-World AI Products — Misinformation Triage Platform**  
> **Hackathon Team ID:** `[HACKATHON_TEAM_ID: TL-AI-2026-TRACK2]`  
> **Date:** Sat, 19 Sept 2026  
> **Zero Authentication / No Login Barrier:** Direct, unrestricted open access for evaluators, investigators, and the public.

---

## 1. Executive Summary

**TruthLens** is an investigative newsroom web application designed to combat viral misinformation, synthetic audio/video deepfakes, and state/national disinformation campaigns. Built with an editorial investigative aesthetic (clean white paper motif, dark charcoal typography, serif headlines, subtle hairline borders, and realistic tilted ink stamp seals), TruthLens enables automated intake, real-time forensic pre-checks, multi-investigator consensus voting, and instant public debunking.

---

## 2. Mandatory Decision Points (`DECISIONS.md`)

TruthLens includes a dedicated [`DECISIONS.md`](./DECISIONS.md) in the project root addressing the three mandatory architectural choices:

1. **DP1: Feed Order** — Implements a hybrid virality-weighted velocity model (with dark social WhatsApp multipliers and heuristic triggers) to surface high-consequence falsehoods before viral saturation occurs, while preserving transparent chronological filters.
2. **DP2: Visibility of Unverified Claims** — Retains unverified items in the public stream under strict `[UNVERIFIED / TRIAGE]` stamp seals with live forensic hazard flags to avoid information vacuums while preventing uncritical forwarding.
3. **DP3: Post-Submission Editing Policy** — Enforces strict immutability of raw viral text and media assets upon ingestion, recording all contextual notes, synthesized evidence, and reviewer verdicts on a versioned, append-only audit trail.

---

## 3. UI & Theme Design System

- **Clean Investigative Newsroom Styling**: Pristine formal white background (`#ffffff` / `#f9fafb`), dark charcoal text (`#111827`), subtle borders (`#e5e7eb`), and crisp typographic hierarchy.
- **Typography**: Classical serif headlines (`Merriweather`, `Playfair Display`), clean modern sans-serif body (`Inter`), and monospace forensic telemetry (`JetBrains Mono`).
- **Master Header**:
  - Investigator Owl emblem and "TruthLens" masthead typography.
  - Live utility bar displaying current date (**Sat, 19 Sept 2026**), edition indicators, and active forensics ticker.
  - Global instant search with real-time text matching across claims, tags, and sources.
  - One-click share and reset demo data triggers.
- **Navigation & Dropdowns**:
  - Main navigation with structured **Fact Check** dropdown (**Business, World, Entertainment, Sports, Social, Politics**).
  - Quick-navigation desks: **Election Tracker**, **ScamCheck**, **Explainers**, **Decode**, and **Data Dive**.
- **Trending Hashtag Ticker Bar**:
  - Clickable query pills: `#Election Result 2026`, `#Scamcheck`, `#Narendra Modi`, `#WhatsApp`, `#Deepfake`, `#AIVoiceClone`, `#FakeRecharge`, `#BankingAlert`, `#ICMRGuidance`.
- **Stamped Verdict Visuals**:
  - Realistic angled ink stamps (-9° rotation, distressed double borders, official typography) reading:
    - `AUTHENTIC` (Emerald Green `#059669`)
    - `MISLEADING` (Amber `#d97706`)
    - `FALSE` (Crimson Red `#dc2626`)
    - `UNDER REVIEW / UNVERIFIED` (Slate Navy `#475569`)

---

## 4. Core Features & Advanced Enhancements

### Feature 1: Submit Claim & Advanced AI Forensics Engine
- **Intake Form**: Textarea for viral forwards, source platform selector (*WhatsApp, X, Instagram, Facebook, YouTube, Other*), primary category selector, and explicit **Image URL input field** with live media banner preview and quick presets (EVM, RBI note, Telecom phishing, Deepfake voice clone).
- **Auto-Scraper / URL Ingestion**: Users can paste social links or click sample presets (X thread, WhatsApp forward, Instagram reel) to auto-extract text, handle, and platform metadata.
- **Real-Time Deepfake & Media Forensics Pre-Check**:
  - Dynamic **Deepfake Probability** percentage meter (0–100%) detecting synthetic speech and video artifacts.
  - **Sentiment Tone Detector** (*High Panic*, *Outrage*, *Urgent Alert*, *Neutral Fact*, *Confirmatory*).
  - Real-time text analysis: shouting uppercase %, trigger words counter, link validation.
  - Automated risk badges (`[SENSATIONAL]`, `[HIGH_CAPS]`, `[UNSOURCED]`, and `[HIGH RISK]` badge if 2+ flags met).

### Feature 2: Heuristic Risk Flags & Automated Triage
- Trigger word evaluation ("breaking", "shocking", "urgent", "secret leaked", "banned").
- High Caps threshold (>50% uppercase).
- Unsourced link checker (missing http/https).
- Cross-platform virality velocity score (0–100).
- Automated Credibility Trust Score (0–100%).

### Feature 3: Reviewer Command Center & Consensus Voting
- **Zero Authentication Friction**: Direct access to newsroom reviewer controls with customizable investigator identity and roles.
- **Triage Queue**: Filterable by Unverified, High Risk, In Review, and Published.
- **AI-Assisted Fact-Check Synthesizer**: One-click synthesis generating draft debunk notes, factual discrepancies against official registries (ECI, RBI, WHO, ICMR, CERT-In), and confidence scores.
- **Consensus Voting / Peer Review**: Multiple reviewers can stake confidence votes (AUTHENTIC, MISLEADING, FALSE) with confidence percentage and notes; live consensus agreement meter aggregates peer alignment.
- **Official Stamped Verdict Authorization**: Lead reviewer commits final status with explanatory note.
- **Audit Trail & Versioning**: Complete history timeline recording timestamps, authors, previous states, and diffs.

### Feature 4: Public Feed, Live Stream Ticker & Analytics
- **Live Stream Ticker**: Moving marquee of recently stamped verdicts.
- **Multi-Filter Feed**: Category filters, platform selectors, status badges, High Risk toggle, and Grid / List view switcher.
- **Data Dive (Analytics Dashboard)**:
  - Total claims ingested, false/misleading/authentic ratios.
  - Platform vulnerability breakdown (WhatsApp vs X vs Instagram volume).
  - Thematic category distribution heatmaps.
  - Virality velocity rankings.

### Feature 5: Detail View & Impact Dossier
- **Full Dossier Modal**: Full text transcript, media banner with bold stamped verdict overlay, sentiment trigger heatmap highlights.
- **Impact Radius & Spread Map**: Visual milestone timeline (Ingestion → AI Forensics → Peer Consensus Staked → Verdict Published) and cross-platform reach statistics.
- **One-Click Public Share Cards**: Downloadable social debunker cards rendered directly to PNG via HTML5 canvas, complete with stamped seals, official TruthLens watermark, and copyable share text.
- **Similar Claims Recommender**: Semantic and category matching linking related historical claims to prevent duplicate inquiries.

---

## 5. Technology Stack & Local Persistence

- **Frontend**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Custom Serif Typography (`Merriweather`, `Playfair Display`, `JetBrains Mono`)
- **Icons**: Lucide React
- **Graphics & Export**: HTML5 Canvas for dynamic social debunk card rendering; Canvas Confetti for investigator milestone feedback
- **Data Persistence**: Robust LocalStorage store (`truthlens_claims_db_v1`) pre-seeded with rich 2026 claims across Indian and global news contexts. Reset Demo Data button available at any time.

---

## 6. Installation & Verification

To run TruthLens locally:

```bash
# 1. Navigate to the project folder
cd C:\Users\HP\.gemini\antigravity\scratch\truthlens

# 2. Install dependencies (if not already installed)
npm install

# 3. Build for production verification
npm run build

# 4. Start local development server
npm run dev
```

The application will run with live hot reload, zero backend requirements, and immediate access to all features.
