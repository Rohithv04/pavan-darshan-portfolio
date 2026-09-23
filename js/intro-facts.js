/**
 * ============================================================================
 * PAVAN DARSHAN DODDALA — VERIFIED CAREER FACTS DATASET
 * 
 * CONTENT INTEGRITY POLICY:
 * All intro statistics and statements MUST be strictly verified against Pavan's
 * actual resume and portfolio content (#impact, #experience, #projects, #research).
 * NEVER silently invent fictional statistics (no made-up Sharpe ratios, VaR,
 * artificial beta, arbitrary AUM, or fictitious S&P/VIX portfolio returns).
 * ============================================================================
 */

export const INTRO_WATERMARK = "FINANCE • STRATEGY • EXECUTION";

export const INTRO_FACTS = [
  // --------------------------------------------------------------------------
  // WAVE 1: HIGH-IMPACT QUANTIFIABLE OUTCOMES (Foreground / High Prominence)
  // --------------------------------------------------------------------------
  {
    id: "cost-opt",
    type: "metric",
    wave: 1,
    layer: "foreground",
    draggable: true,
    eyebrow: "COST OPTIMIZATION",
    value: "$2M",
    valuePrefix: "",
    valueSuffix: "",
    title: "Cost-Saving Opportunities Identified",
    subtitle: "Financial & Operating Analysis • Carelon / Randstad USA",
    // Art-directed spatial resting coordinates
    desktop: { x: "-36vw", y: "-20vh", z: 95, rot: -3 },
    tablet:  { x: "-32vw", y: "-22vh", z: 70, rot: -2 },
    mobile:  { x: "-24vw", y: "-28vh", z: 40, rot: -2 }
  },
  {
    id: "payroll-auto",
    type: "metric",
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
    desktop: { x: "24vw", y: "-18vh", z: 90, rot: 2.5 },
    tablet:  { x: "22vw", y: "-20vh", z: 65, rot: 2 },
    mobile:  { x: "22vw", y: "-26vh", z: 40, rot: 2 }
  },

  // --------------------------------------------------------------------------
  // WAVE 2: BANKING GROWTH, CREDIT RISK & PROCESS CONTROL (Midground)
  // --------------------------------------------------------------------------
  {
    id: "lending-growth",
    type: "metric",
    wave: 2,
    layer: "midground",
    draggable: true,
    eyebrow: "BANKING GROWTH",
    value: "+20%",
    valuePrefix: "",
    valueSuffix: "",
    title: "SME & Retail Lending Portfolio Growth",
    subtitle: "Credit Risk Strategy & Segmentation • Equitas SFB",
    desktop: { x: "-38vw", y: "8vh", z: 45, rot: 2 },
    tablet:  { x: "-34vw", y: "6vh", z: 35, rot: 1.5 },
    mobile:  { x: "-24vw", y: "24vh", z: 30, rot: 1.5 }
  },
  {
    id: "risk-gov",
    type: "metric",
    wave: 2,
    layer: "midground",
    draggable: true,
    eyebrow: "RISK GOVERNANCE",
    value: "-12%",
    valuePrefix: "",
    valueSuffix: "",
    title: "Non-Performing Assets Reduction",
    subtitle: "Underwriting Governance & Early-Warning Risk Models",
    desktop: { x: "26vw", y: "12vh", z: 50, rot: -2 },
    tablet:  { x: "24vw", y: "10vh", z: 40, rot: -1.5 },
    mobile:  { x: "22vw", y: "26vh", z: 30, rot: -1.5 }
  },
  {
    id: "customer-acq",
    type: "chip",
    wave: 2,
    layer: "midground",
    draggable: false,
    eyebrow: "CUSTOMER ACQUISITION",
    value: "+18%",
    title: "Branch Banking Expansion",
    desktop: { x: "12vw", y: "-32vh", z: 35, rot: -1.5 },
    tablet:  { x: "10vw", y: "-34vh", z: 25, rot: -1 },
    mobile:  null // Hidden on mobile
  },
  {
    id: "billing-ctrl",
    type: "chip",
    wave: 2,
    layer: "midground",
    draggable: false,
    eyebrow: "BILLING CONTROLS",
    value: "-15%",
    title: "Recurring Billing Errors Reduction",
    desktop: { x: "-18vw", y: "28vh", z: 40, rot: 1.8 },
    tablet:  { x: "-16vw", y: "26vh", z: 30, rot: 1.5 },
    mobile:  null
  },

  // --------------------------------------------------------------------------
  // WAVE 3: CAREER FOCUS, TECHNICAL DISCIPLINES & RESEARCH (Layered Depth)
  // --------------------------------------------------------------------------
  {
    id: "focus-ib",
    type: "capability",
    wave: 3,
    layer: "foreground",
    draggable: true,
    eyebrow: "PRIMARY CAREER FOCUS",
    title: "INVESTMENT BANKING",
    subtitle: "Analytical Rigor • Financial Logic • Strategic Judgment",
    tags: ["ECM", "DCM", "M&A Advisory", "Capital Allocation"],
    desktop: { x: "-20vw", y: "-32vh", z: 85, rot: -1.5 },
    tablet:  { x: "-18vw", y: "-32vh", z: 60, rot: -1 },
    mobile:  { x: "0vw", y: "-37vh", z: 35, rot: 0 }
  },
  {
    id: "cap-markets",
    type: "capability",
    wave: 3,
    layer: "midground",
    draggable: true,
    eyebrow: "CAPITAL MARKETS",
    title: "Market Microstructure & Rates",
    subtitle: "Cross-Border Banking • Factor Investing • Liquidity",
    tags: ["SOFR", "Yield Curve", "Treasury Dynamics"],
    desktop: { x: "32vw", y: "-4vh", z: 40, rot: 3 },
    tablet:  { x: "28vw", y: "-4vh", z: 30, rot: 2.5 },
    mobile:  null
  },
  {
    id: "analytics-stack",
    type: "capability",
    wave: 3,
    layer: "rear",
    draggable: false,
    eyebrow: "QUANTITATIVE TOOLKIT",
    title: "Analytics & Data Architecture",
    tags: ["Python", "SQL", "Tableau", "Advanced Excel", "SAS"],
    desktop: { x: "-32vw", y: "26vh", z: -20, rot: -2.5 },
    tablet:  { x: "-26vw", y: "24vh", z: -15, rot: -2 },
    mobile:  null
  },
  {
    id: "exec-leadership",
    type: "capability",
    wave: 3,
    layer: "foreground",
    draggable: true,
    eyebrow: "EXECUTION LEADERSHIP",
    title: "Enterprise Transformation",
    subtitle: "Promoted in 3 Months • PM → Senior PM (ONS Tech)",
    tags: ["Stakeholder Mgmt", "Process Mapping", "UAT", "Agile"],
    desktop: { x: "18vw", y: "28vh", z: 80, rot: -1 },
    tablet:  { x: "16vw", y: "26vh", z: 55, rot: -1 },
    mobile:  { x: "0vw", y: "36vh", z: 35, rot: 0 }
  },
  {
    id: "proj-enterprise",
    type: "project",
    wave: 3,
    layer: "midground",
    draggable: true,
    eyebrow: "SELECTED PROJECT",
    title: "Enterprise Systems Integration",
    subtitle: "Hospitality POS, Inventory & Financial Workflows",
    statusBadge: "DELIVERED",
    desktop: { x: "-14vw", y: "18vh", z: 30, rot: 2.2 },
    tablet:  null,
    mobile:  null
  },
  {
    id: "res-silent-auctions",
    type: "research",
    wave: 3,
    layer: "rear",
    draggable: true,
    eyebrow: "RESEARCH PAPER 01",
    title: "Silent Auctions at the Close",
    subtitle: "ETF Flow Dynamics • Closing Auction Price Discovery",
    tag: "MARKET MICROSTRUCTURE",
    desktop: { x: "-28vw", y: "-4vh", z: -35, rot: -3.5 },
    tablet:  { x: "-24vw", y: "-6vh", z: -25, rot: -3 },
    mobile:  null
  },
  {
    id: "res-volatility",
    type: "research",
    wave: 3,
    layer: "rear",
    draggable: true,
    eyebrow: "RESEARCH PAPER 02",
    title: "Volatility Pathways & Equity Factors",
    subtitle: "Regime Sensitivity • Momentum, Value, Quality & Low-Risk",
    tag: "QUANTITATIVE ASSET PRICING",
    desktop: { x: "28vw", y: "-30vh", z: -40, rot: 2.5 },
    tablet:  null,
    mobile:  null
  },
  {
    id: "res-universal",
    type: "research",
    wave: 3,
    layer: "rear",
    draggable: true,
    eyebrow: "RESEARCH PAPER 03",
    title: "Universal Ambition: Investment Banking Playbook",
    subtitle: "ECM • DCM • Capital Buffers • Risk Discipline",
    tag: "IB STRATEGY",
    desktop: { x: "8vw", y: "34vh", z: -30, rot: 1.8 },
    tablet:  null,
    mobile:  null
  }
];
