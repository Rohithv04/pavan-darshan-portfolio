/**
 * ============================================================================
 * PAVAN DARSHAN DODDALA — CURATED CAREER ACHIEVEMENTS DATASET
 * 
 * CLEAN LAYOUT ARCHITECTURE:
 * - Exactly 9 primary, non-overlapping cards on Desktop (6 on Mobile).
 * - Art-directed orbital slot positions with guaranteed 24–40px minimum clearance.
 * - Strict 15–20vw central safe zone protecting Pavan's head, face, and chest.
 * - Inward pivot angles (2°–6°) configured for organic center collapse.
 * ============================================================================
 */

export const INTRO_WATERMARK = "FINANCE • STRATEGY • EXECUTION";

export const INTRO_FACTS = [
  // --------------------------------------------------------------------------
  // 1. INVESTMENT BANKING (Upper-Left Inner) — Primary Career Focus
  // --------------------------------------------------------------------------
  {
    id: "focus-ib",
    type: "capability",
    size: "medium",
    pivot: { rot: 4, tiltX: 3 },
    desktop: { x: "-22vw", y: "-30vh", z: 20, rot: -1.5 },
    tablet:  { x: "-22vw", y: "-28vh", z: 15, rot: -1.5 },
    mobile:  { x: "0vw",   y: "-33vh", z: 0,  rot: 0 } // Centered directly above head
  },

  // --------------------------------------------------------------------------
  // 2. SILENT AUCTIONS RESEARCH (Upper-Left Outer) — Applied Finance Research
  // --------------------------------------------------------------------------
  {
    id: "res-silent-auctions",
    type: "research",
    size: "small",
    pivot: { rot: 5, tiltX: 2 },
    desktop: { x: "-36vw", y: "-16vh", z: 10, rot: -2.5 },
    tablet:  null,
    mobile:  null
  },

  // --------------------------------------------------------------------------
  // 3. $2M COST OPTIMIZATION (Mid-Left) — Quantified Impact
  // --------------------------------------------------------------------------
  {
    id: "cost-opt",
    type: "metric",
    size: "large",
    pivot: { rot: 4, tiltX: 0 },
    desktop: { x: "-33vw", y: "3vh", z: 25, rot: -2 },
    tablet:  { x: "-30vw", y: "0vh", z: 20, rot: -2 },
    mobile:  { x: "-31vw", y: "-17vh", z: 0, rot: -2 } // Upper-left flanking head
  },

  // --------------------------------------------------------------------------
  // 4. +20% LENDING GROWTH (Lower-Left) — Banking Portfolio Strategy
  // --------------------------------------------------------------------------
  {
    id: "lending-growth",
    type: "metric",
    size: "large",
    pivot: { rot: 3, tiltX: -3 },
    desktop: { x: "-26vw", y: "26vh", z: 20, rot: 2 },
    tablet:  { x: "-24vw", y: "24vh", z: 15, rot: 1.5 },
    mobile:  { x: "-31vw", y: "22vh",  z: 0, rot: 1.5 } // Lower-left flanking waist
  },

  // --------------------------------------------------------------------------
  // 5. 70%+ PAYROLL AUTOMATION (Upper-Right Inner) — High Prominence Metric
  // --------------------------------------------------------------------------
  {
    id: "payroll-auto",
    type: "metric",
    size: "large",
    pivot: { rot: -4, tiltX: 3 },
    desktop: { x: "22vw", y: "-28vh", z: 25, rot: 2 },
    tablet:  { x: "24vw", y: "-26vh", z: 20, rot: 2 },
    mobile:  { x: "31vw",  y: "-17vh", z: 0, rot: 2 } // Upper-right flanking head
  },

  // --------------------------------------------------------------------------
  // 6. QUANTITATIVE TOOLKIT (Upper-Right Outer) — Analytics & Modeling
  // --------------------------------------------------------------------------
  {
    id: "analytics-stack",
    type: "capability",
    size: "small",
    pivot: { rot: -5, tiltX: 2 },
    desktop: { x: "36vw", y: "-16vh", z: 10, rot: 2.5 },
    tablet:  null,
    mobile:  null
  },

  // --------------------------------------------------------------------------
  // 7. ENTERPRISE SYSTEMS INTEGRATION (Mid-Right) — Operational Systems
  // --------------------------------------------------------------------------
  {
    id: "proj-enterprise",
    type: "project",
    size: "medium",
    pivot: { rot: -4, tiltX: 0 },
    desktop: { x: "33vw", y: "4vh", z: 15, rot: 2 },
    tablet:  { x: "30vw", y: "2vh", z: 15, rot: 1.8 },
    mobile:  null
  },

  // --------------------------------------------------------------------------
  // 8. -12% RISK GOVERNANCE (Lower-Right) — Credit Risk & Underwriting
  // --------------------------------------------------------------------------
  {
    id: "risk-gov",
    type: "metric",
    size: "large",
    pivot: { rot: -3, tiltX: -3 },
    desktop: { x: "26vw", y: "24vh", z: 20, rot: -2 },
    tablet:  { x: "24vw", y: "22vh", z: 15, rot: -1.5 },
    mobile:  { x: "31vw",  y: "22vh",  z: 0, rot: -1.5 } // Lower-right flanking waist
  },

  // --------------------------------------------------------------------------
  // 9. CAREER PROGRESSION (Bottom-Center Right) — Promoted in 3 Months
  // --------------------------------------------------------------------------
  {
    id: "exec-leadership",
    type: "capability",
    size: "medium",
    pivot: { rot: -2, tiltX: -4 },
    desktop: { x: "8vw", y: "36vh", z: 20, rot: -1 },
    tablet:  { x: "6vw", y: "35vh", z: 15, rot: -1 },
    mobile:  { x: "0vw", y: "35vh", z: 0, rot: 0 } // Centered directly below torso
  }
];
