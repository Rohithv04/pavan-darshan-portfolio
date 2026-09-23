/**
 * ============================================================================
 * PAVAN DARSHAN DODDALA — VERIFIED CAREER FACTS DATASET
 * 
 * CONTENT INTEGRITY POLICY:
 * All intro statistics and statements MUST be strictly verified against Pavan's
 * actual resume and portfolio content (#impact, #experience, #projects, #research).
 * NEVER silently invent fictional statistics (no made-up Sharpe ratios, VaR,
 * artificial beta, arbitrary AUM, or fictitious S&P/VIX portfolio returns).
 * 
 * LAYOUT ARCHITECTURE:
 * Art-directed radial distribution around Pavan with a strict 15–20vw safe zone
 * protecting his face, head, and upper torso.
 * Size hierarchy:
 *   - Large (230–280px): Major quantified impact outcomes
 *   - Medium (180–230px): Career focus, projects, research papers
 *   - Small (100–160px): Skills, credentials, and metric chips
 * ============================================================================
 */

export const INTRO_WATERMARK = "FINANCE • STRATEGY • EXECUTION";

export const INTRO_FACTS = [
  // --------------------------------------------------------------------------
  // QUADRANT 1: UPPER-LEFT (Investment Banking & Market Research)
  // --------------------------------------------------------------------------
  {
    id: "focus-ib",
    type: "capability",
    size: "medium",
    wave: 3,
    layer: "foreground",
    draggable: true,
    eyebrow: "PRIMARY CAREER FOCUS",
    title: "INVESTMENT BANKING",
    subtitle: "Analytical Rigor • Financial Logic • Strategic Judgment",
    tags: ["ECM", "DCM", "M&A Advisory", "Capital Allocation"],
    // Clear of face safe zone (sits in upper-left orbit)
    desktop: { x: "-26vw", y: "-26vh", z: 80, rot: -2 },
    tablet:  { x: "-24vw", y: "-24vh", z: 55, rot: -1.5 },
    mobile:  { x: "0vw", y: "-36vh", z: 30, rot: 0 } // Above head on mobile
  },
  {
    id: "res-silent-auctions",
    type: "research",
    size: "medium",
    wave: 3,
    layer: "rear",
    draggable: true,
    eyebrow: "RESEARCH PAPER 01",
    title: "Silent Auctions at the Close",
    subtitle: "ETF Flow Dynamics • Closing Auction Price Discovery",
    tag: "MARKET MICROSTRUCTURE",
    desktop: { x: "-37vw", y: "-15vh", z: -35, rot: -3 },
    tablet:  null,
    mobile:  null
  },

  // --------------------------------------------------------------------------
  // QUADRANT 2: UPPER-RIGHT (Payroll Automation & Factor Research)
  // --------------------------------------------------------------------------
  {
    id: "payroll-auto",
    type: "metric",
    size: "large",
    wave: 1,
    layer: "foreground",
    draggable: true,
    eyebrow: "PAYROLL AUTOMATION",
    value: "70%+",
    valuePrefix: "",
    valueSuffix: "",
    title: "Processing Effort Reduction",
    subtitle: "Automated Disbursement Logic • ABS Tech",
    tags: ["SQL", "Tableau", "UAT", "Financial Ops"],
    desktop: { x: "27vw", y: "-24vh", z: 85, rot: 2.5 },
    tablet:  { x: "26vw", y: "-22vh", z: 60, rot: 2 },
    mobile:  { x: "28vw", y: "-22vh", z: 35, rot: 2 } // Top-right of head on mobile
  },
  {
    id: "res-volatility",
    type: "research",
    size: "medium",
    wave: 3,
    layer: "rear",
    draggable: true,
    eyebrow: "RESEARCH PAPER 02",
    title: "Volatility Pathways & Equity Factors",
    subtitle: "Regime Sensitivity • Momentum, Value, Quality & Low-Risk",
    tag: "QUANTITATIVE ASSET PRICING",
    desktop: { x: "36vw", y: "-15vh", z: -40, rot: 2 },
    tablet:  null,
    mobile:  null
  },

  // --------------------------------------------------------------------------
  // QUADRANT 3: MID-LEFT ($2M Cost Optimization & Customer Acq Chip)
  // --------------------------------------------------------------------------
  {
    id: "cost-opt",
    type: "metric",
    size: "large",
    wave: 1,
    layer: "foreground",
    draggable: true,
    eyebrow: "COST OPTIMIZATION",
    value: "$2M",
    valuePrefix: "",
    valueSuffix: "",
    title: "Cost-Saving Opportunities Identified",
    subtitle: "Financial & Operating Analysis • Carelon / Randstad USA",
    desktop: { x: "-34vw", y: "-2vh", z: 95, rot: -2.5 },
    tablet:  { x: "-30vw", y: "-4vh", z: 65, rot: -2 },
    mobile:  { x: "-28vw", y: "-22vh", z: 35, rot: -2 } // Top-left of head on mobile
  },
  {
    id: "customer-acq",
    type: "chip",
    size: "small",
    wave: 2,
    layer: "midground",
    draggable: false,
    eyebrow: "CUSTOMER ACQUISITION",
    value: "+18%",
    title: "Branch Banking Expansion",
    desktop: { x: "-21vw", y: "11vh", z: 35, rot: -1.5 },
    tablet:  null,
    mobile:  null
  },

  // --------------------------------------------------------------------------
  // QUADRANT 4: MID-RIGHT (Capital Markets & Cross-Border Rates)
  // --------------------------------------------------------------------------
  {
    id: "cap-markets",
    type: "capability",
    size: "medium",
    wave: 3,
    layer: "midground",
    draggable: true,
    eyebrow: "CAPITAL MARKETS",
    title: "Market Microstructure & Rates",
    subtitle: "Cross-Border Banking • Factor Investing • Liquidity",
    tags: ["SOFR", "Yield Curve", "Treasury Dynamics"],
    desktop: { x: "33vw", y: "0vh", z: 45, rot: 2.8 },
    tablet:  { x: "30vw", y: "-2vh", z: 30, rot: 2 },
    mobile:  null
  },

  // --------------------------------------------------------------------------
  // QUADRANT 5: LOWER-LEFT (+20% Lending Growth & Analytics Toolkit)
  // --------------------------------------------------------------------------
  {
    id: "lending-growth",
    type: "metric",
    size: "large",
    wave: 2,
    layer: "midground",
    draggable: true,
    eyebrow: "BANKING GROWTH",
    value: "+20%",
    valuePrefix: "",
    valueSuffix: "",
    title: "SME & Retail Lending Portfolio Growth",
    subtitle: "Credit Risk Strategy & Segmentation • Equitas SFB",
    desktop: { x: "-28vw", y: "22vh", z: 50, rot: 2 },
    tablet:  { x: "-26vw", y: "20vh", z: 40, rot: 1.5 },
    mobile:  { x: "-28vw", y: "24vh", z: 30, rot: 1.5 } // Lower-left waist on mobile
  },
  {
    id: "analytics-stack",
    type: "capability",
    size: "small",
    wave: 3,
    layer: "rear",
    draggable: false,
    eyebrow: "QUANTITATIVE TOOLKIT",
    title: "Analytics & Data Architecture",
    tags: ["Python", "SQL", "Tableau", "Excel", "SAS"],
    desktop: { x: "-36vw", y: "32vh", z: -25, rot: -2 },
    tablet:  null,
    mobile:  null
  },
  {
    id: "billing-ctrl",
    type: "chip",
    size: "small",
    wave: 2,
    layer: "midground",
    draggable: false,
    eyebrow: "BILLING CONTROLS",
    value: "-15%",
    title: "Recurring Billing Errors Reduction",
    desktop: { x: "-16vw", y: "35vh", z: 40, rot: 1.5 },
    tablet:  null,
    mobile:  null
  },

  // --------------------------------------------------------------------------
  // QUADRANT 6: LOWER-RIGHT (-12% NPA & Career Progression)
  // --------------------------------------------------------------------------
  {
    id: "risk-gov",
    type: "metric",
    size: "large",
    wave: 2,
    layer: "midground",
    draggable: true,
    eyebrow: "RISK GOVERNANCE",
    value: "-12%",
    valuePrefix: "",
    valueSuffix: "",
    title: "Non-Performing Assets Reduction",
    subtitle: "Underwriting Governance & Early-Warning Risk Models",
    desktop: { x: "28vw", y: "16vh", z: 55, rot: -2 },
    tablet:  { x: "26vw", y: "18vh", z: 40, rot: -1.5 },
    mobile:  { x: "28vw", y: "24vh", z: 30, rot: -1.5 } // Lower-right waist on mobile
  },
  {
    id: "exec-leadership",
    type: "capability",
    size: "medium",
    wave: 3,
    layer: "foreground",
    draggable: true,
    eyebrow: "CAREER PROGRESSION",
    title: "Enterprise Transformation",
    subtitle: "Promoted in 3 Months • PM → Senior PM (ONS Tech)",
    tags: ["Stakeholder Mgmt", "Process Mapping", "UAT", "Agile"],
    desktop: { x: "30vw", y: "30vh", z: 75, rot: -1.5 },
    tablet:  { x: "22vw", y: "32vh", z: 50, rot: -1 },
    mobile:  { x: "0vw", y: "35vh", z: 35, rot: 0 } // Below torso on mobile
  },

  // --------------------------------------------------------------------------
  // BOTTOM-CENTER / OFFSETS (Enterprise Systems & Research Paper 03)
  // --------------------------------------------------------------------------
  {
    id: "proj-enterprise",
    type: "project",
    size: "medium",
    wave: 3,
    layer: "midground",
    draggable: true,
    eyebrow: "SELECTED PROJECT",
    title: "Enterprise Systems Integration",
    subtitle: "Hospitality POS, Inventory & Financial Workflows",
    statusBadge: "DELIVERED",
    desktop: { x: "-8vw", y: "37vh", z: 30, rot: 1.8 },
    tablet:  null,
    mobile:  null
  },
  {
    id: "res-universal",
    type: "research",
    size: "medium",
    wave: 3,
    layer: "rear",
    draggable: true,
    eyebrow: "RESEARCH PAPER 03",
    title: "Universal Ambition: IB Playbook",
    subtitle: "ECM • DCM • Capital Buffers • Risk Discipline",
    tag: "IB STRATEGY",
    desktop: { x: "12vw", y: "37vh", z: -20, rot: -2 },
    tablet:  null,
    mobile:  null
  }
];

// Pill tags positions (chips)
export const INTRO_PILLS = {
  "pill-1": {
    desktop: { x: "22vw", y: "-36vh", z: 20, rot: -1.5 },
    tablet:  null,
    mobile:  null
  },
  "pill-2": {
    desktop: { x: "16vw", y: "24vh", z: 60, rot: 1.2 },
    tablet:  { x: "0vw", y: "36vh", z: 45, rot: 0 },
    mobile:  null
  },
  "pill-3": {
    desktop: { x: "-2vw", y: "-38vh", z: 90, rot: 1 },
    tablet:  { x: "0vw", y: "-36vh", z: 55, rot: 0 },
    mobile:  { x: "0vw", y: "-43vh", z: 25, rot: 0 }
  }
};
