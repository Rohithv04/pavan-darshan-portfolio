/**
 * ============================================================================
 * GSAP ANIMATION SYSTEM
 * Pavan Darshan Doddala Portfolio — Executive Finance & Project Leadership
 * 
 * Aesthetics: Senior Finance & Investment Banking presentation.
 * Style: Restrained, editorial, precise, luxurious, 60fps transform/opacity.
 * ============================================================================
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin once
gsap.registerPlugin(ScrollTrigger);
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

function initAnimations() {
  // --------------------------------------------------------------------------
  // 1. Accessibility & Reduced Motion Check
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    // Ensure all data targets on metric numbers are immediately filled
    document.querySelectorAll(".metric-number").forEach((el) => {
      const target = el.getAttribute("data-target");
      if (target) el.textContent = target;
    });
    // Ensure all reveals and elements are fully visible
    document.querySelectorAll(".reveal, .hero-title-line, .scroll-progress-bar").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  // --------------------------------------------------------------------------
  // 2. Scoped GSAP Context & Responsive matchMedia
  // --------------------------------------------------------------------------
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    // ------------------------------------------------------------------------
    // Page Scroll Progress Indicator (Top 2.5px Line)
    // ------------------------------------------------------------------------
    const scrollBar = document.getElementById("scrollProgress");
    if (scrollBar) {
      gsap.to(scrollBar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3
        }
      });
    }

    // ========================================================================
    // A. DESKTOP & SHARED ANIMATIONS (min-width: 769px)
    // ========================================================================
    mm.add("(min-width: 769px)", () => {
      // ----------------------------------------------------------------------
      // HERO SECTION TIMELINE (Runs once on initial load)
      // ----------------------------------------------------------------------
      const heroTL = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.15
      });

      // 1. Navbar enters subtly
      heroTL.from("#navbar", {
        y: -15,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      });

      // 2. "HELLO, I'M" eyebrow appears
      heroTL.from("#hero .section-eyebrow", {
        y: 16,
        opacity: 0,
        duration: 0.6
      }, "-=0.35");

      // 3. Main name masked reveal (overflow:hidden wrapper, yPercent: 100 -> 0)
      heroTL.from(".hero-title-line", {
        yPercent: 100,
        opacity: 0,
        duration: 1.0,
        stagger: 0.12,
        ease: "power4.out"
      }, "-=0.4");

      // 4. Role: FINANCE & PROJECT LEADERSHIP PROFESSIONAL
      heroTL.from(".hero-role", {
        y: 18,
        opacity: 0,
        duration: 0.6
      }, "-=0.65");

      // 5. Descriptor line
      heroTL.from(".hero-descriptor", {
        y: 14,
        opacity: 0,
        duration: 0.5
      }, "-=0.45");

      // 6. Hero bio
      heroTL.from(".hero-bio", {
        y: 18,
        opacity: 0,
        duration: 0.6
      }, "-=0.35");

      // 7. Hero CTAs (View Experience, Download Resume, Contact Me)
      heroTL.from(".hero-actions > *", {
        y: 18,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        clearProps: "opacity,transform"
      }, "-=0.35");

      // Hero Socials
      heroTL.from(".hero-socials .icon-btn", {
        y: 12,
        opacity: 0,
        duration: 0.4,
        stagger: 0.06,
        clearProps: "opacity,transform"
      }, "-=0.25");

      // 8. Hero portrait image (opacity 0 -> 1, scale 1.04 -> 1)
      heroTL.from(".hero-portrait-image", {
        opacity: 0,
        scale: 1.04,
        duration: 1.15,
        ease: "power3.out"
      }, "<+=0.15");

      // Circular gradient light spots
      heroTL.from(".light-spot", {
        opacity: 0,
        scale: 0.85,
        duration: 1.2,
        stagger: 0.15,
        ease: "power2.out"
      }, "<");

      // 9. Floating badges (5+ Years Experience, MBA Santa Clara)
      heroTL.from(".hero-floating-badge", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "transform,opacity"
      }, "-=0.45");

      // Minimal cursor-reactive float parallax for hero floating badges (Desktop)
      const heroEl = document.getElementById("hero");
      const badge1 = document.querySelector(".badge-top-left");
      const badge2 = document.querySelector(".badge-bottom-right");

      if (heroEl && badge1 && badge2) {
        const xTo1 = gsap.quickTo(badge1, "x", { duration: 0.85, ease: "power2.out" });
        const yTo1 = gsap.quickTo(badge1, "y", { duration: 0.85, ease: "power2.out" });
        const xTo2 = gsap.quickTo(badge2, "x", { duration: 0.85, ease: "power2.out" });
        const yTo2 = gsap.quickTo(badge2, "y", { duration: 0.85, ease: "power2.out" });

        const handleHeroMouseMove = (e) => {
          const rect = heroEl.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;

          // Subtle, minimal reaction (14-18px max travel)
          xTo1(normX * 18);
          yTo1(normY * 14);
          xTo2(-normX * 14);
          yTo2(-normY * 12);
        };

        const handleHeroMouseLeave = () => {
          xTo1(0);
          yTo1(0);
          xTo2(0);
          yTo2(0);
        };

        heroEl.addEventListener("mousemove", handleHeroMouseMove);
        heroEl.addEventListener("mouseleave", handleHeroMouseLeave);
      }

      // ----------------------------------------------------------------------
      // CONTACT SECTION (Desktop: Opposing subtle horizontal slide-ins)
      // ----------------------------------------------------------------------
      const contactTL = gsap.timeline({
        scrollTrigger: {
          trigger: "#contact",
          start: "top 82%",
          once: true
        }
      });

      contactTL.from("#contact .section-eyebrow, #contact .section-title, #contact .contact-bio-text", {
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power3.out"
      })
      .from(".contact-info-block", {
        x: -25,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out"
      }, "-=0.35")
      .from(".contact-form-card", {
        x: 25,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out"
      }, "<")
      .from(".contact-form-card .form-group, .contact-form-card .btn", {
        y: 14,
        opacity: 0,
        duration: 0.45,
        stagger: 0.07,
        ease: "power2.out"
      }, "-=0.35");
    });

    // ========================================================================
    // B. MOBILE ANIMATIONS (max-width: 768px)
    // ========================================================================
    mm.add("(max-width: 768px)", () => {
      // ----------------------------------------------------------------------
      // HERO SECTION (Mobile: Portrait & Badges First, then Title & CTAs)
      // ----------------------------------------------------------------------
      const heroTLMobile = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.15
      });

      heroTLMobile.from("#navbar", {
        y: -10,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      })
      .from(".hero-portrait-image", {
        opacity: 0,
        scale: 1.03,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.2")
      .from(".hero-floating-badge", {
        y: 12,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        clearProps: "transform,opacity"
      }, "-=0.35")
      .from("#hero .section-eyebrow", {
        y: 12,
        opacity: 0,
        duration: 0.5
      }, "-=0.2")
      .from(".hero-title-line", {
        yPercent: 100,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power4.out"
      }, "-=0.35")
      .from(".hero-role", {
        y: 14,
        opacity: 0,
        duration: 0.5
      }, "-=0.55")
      .from(".hero-descriptor, .hero-bio", {
        y: 14,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1
      }, "-=0.35")
      .from(".hero-actions > *", {
        y: 14,
        opacity: 0,
        duration: 0.45,
        stagger: 0.06,
        clearProps: "opacity,transform"
      }, "-=0.3")
      .from(".hero-socials .icon-btn", {
        y: 10,
        opacity: 0,
        duration: 0.35,
        stagger: 0.05,
        clearProps: "opacity,transform"
      }, "-=0.2");

      // ----------------------------------------------------------------------
      // CONTACT SECTION (Mobile: Clean sequential vertical fade-up, NO X transforms)
      // ----------------------------------------------------------------------
      const contactTLMobile = gsap.timeline({
        scrollTrigger: {
          trigger: "#contact",
          start: "top 85%",
          once: true
        }
      });

      contactTLMobile.from("#contact .contact-info-block > *", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out"
      })
      .from(".contact-form-card", {
        y: 22,
        opacity: 0,
        duration: 0.65,
        ease: "power3.out"
      }, "-=0.25")
      .from(".contact-form-card .form-group, .contact-form-card .btn", {
        y: 12,
        opacity: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: "power2.out"
      }, "-=0.3");
    });

    // ========================================================================
    // C. GENERAL SECTIONS (Shared across viewports)
    // ========================================================================

    // ------------------------------------------------------------------------
    // 3. ABOUT SECTION
    // ------------------------------------------------------------------------
    const aboutTL = gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top 82%",
        once: true
      }
    });

    aboutTL.from("#about .section-eyebrow", {
      y: 18,
      opacity: 0,
      duration: 0.55,
      ease: "power2.out"
    })
    .from("#about .section-title", {
      y: 26,
      opacity: 0,
      duration: 0.65,
      ease: "power3.out"
    }, "-=0.35")
    .from("#about .about-text p", {
      y: 22,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.3")
    .from("#about .about-philosophy", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.3")
    .from("#about .snapshot-card", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.07,
      ease: "power2.out",
      clearProps: "opacity,transform"
    }, "-=0.25");

    // ------------------------------------------------------------------------
    // 4. SELECTED IMPACT — NUMBER COUNTERS
    // ------------------------------------------------------------------------
    const impactTL = gsap.timeline({
      scrollTrigger: {
        trigger: "#impact",
        start: "top 82%",
        once: true
      }
    });

    // Reveal heading & subtitle
    impactTL.from("#impact .section-header > *", {
      y: 28,
      opacity: 0,
      duration: 0.7,
      stagger: 0.09,
      ease: "power3.out"
    })
    // Cards enter upward with small stagger
    .from("#impact .metric-card", {
      y: 32,
      opacity: 0,
      duration: 0.75,
      stagger: 0.08,
      ease: "power3.out"
    }, "-=0.35");

    // Count-up numbers from zero to actual target values
    const metricElements = document.querySelectorAll("#impact .metric-number");
    metricElements.forEach((numEl) => {
      const rawTarget = numEl.getAttribute("data-target") || numEl.textContent.trim();
      const targetVal = parseFloat(rawTarget);
      if (isNaN(targetVal)) return;

      const isFloat = rawTarget.includes(".");
      const counterObj = { val: 0 };

      // Reset to 0 initially
      numEl.textContent = "0";

      impactTL.to(counterObj, {
        val: targetVal,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          numEl.textContent = isFloat ? counterObj.val.toFixed(1) : Math.round(counterObj.val).toString();
        },
        onComplete: () => {
          numEl.textContent = rawTarget;
        }
      }, "<+=0.05");
    });

    // Animate metric descriptions slightly after numbers
    impactTL.from("#impact .metric-label", {
      y: 12,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: "power2.out"
    }, "<+=0.35");

    // Metric cards interactive hover re-roll
    const metricCards = document.querySelectorAll("#impact .metric-card");
    metricCards.forEach((card) => {
      const numEl = card.querySelector(".metric-number");
      if (!numEl) return;
      const rawTarget = numEl.getAttribute("data-target") || numEl.textContent.trim();
      const targetVal = parseFloat(rawTarget);
      if (isNaN(targetVal)) return;
      const isFloat = rawTarget.includes(".");

      card.addEventListener("mouseenter", () => {
        const hoverObj = { val: 0 };
        gsap.to(hoverObj, {
          val: targetVal,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
          onUpdate: () => {
            numEl.textContent = isFloat ? hoverObj.val.toFixed(1) : Math.round(hoverObj.val).toString();
          },
          onComplete: () => {
            numEl.textContent = rawTarget;
          }
        });
      });
    });

    // ------------------------------------------------------------------------
    // 5. EXPERIENCE / PROFESSIONAL JOURNEY
    // ------------------------------------------------------------------------
    // Section Header
    gsap.from("#experience .section-header > *", {
      y: 28,
      opacity: 0,
      duration: 0.7,
      stagger: 0.09,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#experience",
        start: "top 82%",
        once: true
      }
    });

    // Vertical Timeline Line — ScaleY scrub from 0 -> 1 connected to scroll
    const timelineLine = document.querySelector(".timeline-line");
    if (timelineLine) {
      gsap.fromTo(timelineLine, 
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 78%",
            end: "bottom 85%",
            scrub: 0.8
          }
        }
      );
    }

    // Reveal each employment entry as it approaches viewport
    const timelineItems = document.querySelectorAll(".timeline-item");
    timelineItems.forEach((item) => {
      const itemTL = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          once: true
        }
      });

      // Entry container & marker
      itemTL.from(item, {
        y: 38,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out"
      })
      // Sequence: Company & Role
      .from(item.querySelectorAll(".exp-company, .exp-role-title"), {
        y: 14,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out"
      }, "-=0.45")
      // Dates & Location
      .from(item.querySelectorAll(".exp-dates, .exp-location, .exp-role-sub"), {
        y: 10,
        opacity: 0,
        duration: 0.45,
        stagger: 0.05,
        ease: "power2.out"
      }, "-=0.35");

      // Impact badge if present (e.g. "PROMOTED IN 3 MONTHS", "70%+ EFFORT REDUCTION")
      const badge = item.querySelector(".badge");
      if (badge) {
        itemTL.from(badge, {
          scale: 0.96,
          opacity: 0,
          duration: 0.45,
          ease: "back.out(1.2)"
        }, "-=0.3");
      }

      // Summary
      const summary = item.querySelector(".exp-desc");
      if (summary) {
        itemTL.from(summary, {
          y: 12,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out"
        }, "-=0.3");
      }

      // Bullet points
      const bullets = item.querySelectorAll(".exp-bullet-item");
      if (bullets.length) {
        itemTL.from(bullets, {
          y: 10,
          opacity: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out"
        }, "-=0.3");
      }
    });

    // ------------------------------------------------------------------------
    // 6. SELECTED PROJECTS
    // ------------------------------------------------------------------------
    const projectsTL = gsap.timeline({
      scrollTrigger: {
        trigger: "#projects",
        start: "top 82%",
        once: true
      }
    });

    projectsTL.from("#projects .section-header > *", {
      y: 28,
      opacity: 0,
      duration: 0.7,
      stagger: 0.09,
      ease: "power3.out"
    })
    .from(".projects-grid .project-card", {
      y: 35,
      opacity: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "opacity,transform"
    }, "-=0.35");

    // Initialize Selected Projects Diagrams Contextual Construction Animations
    initProjectDiagramAnimations();

    // ------------------------------------------------------------------------
    // 7. APPLIED RESEARCH SECTION
    // ------------------------------------------------------------------------
    const researchTL = gsap.timeline({
      scrollTrigger: {
        trigger: "#research",
        start: "top 82%",
        once: true
      }
    });

    researchTL.from("#research .section-header > *", {
      y: 28,
      opacity: 0,
      duration: 0.7,
      stagger: 0.09,
      ease: "power3.out"
    })
    .from(".research-grid .research-card", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      clearProps: "opacity,transform"
    }, "-=0.35")
    .from(".research-status-banner", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
      clearProps: "opacity,transform"
    }, "-=0.2");

    // ------------------------------------------------------------------------
    // 8. EDUCATION & CREDENTIALS
    // ------------------------------------------------------------------------
    const eduTL = gsap.timeline({
      scrollTrigger: {
        trigger: "#education",
        start: "top 82%",
        once: true
      }
    });

    eduTL.from("#education .section-header > *", {
      y: 28,
      opacity: 0,
      duration: 0.7,
      stagger: 0.09,
      ease: "power3.out"
    })
    .from(".education-list .education-card", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      clearProps: "opacity,transform"
    }, "-=0.35")
    .from(".certifications-wrap .cert-card", {
      y: 15,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
      clearProps: "opacity,transform"
    }, "-=0.2")
    .from(".involvement-grid .involvement-card", {
      y: 20,
      opacity: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: "power2.out",
      clearProps: "opacity,transform"
    }, "-=0.25");

    // ------------------------------------------------------------------------
    // 9. CAREER FOCUS & CAPABILITIES
    // ------------------------------------------------------------------------
    const focusTL = gsap.timeline({
      scrollTrigger: {
        trigger: "#focus",
        start: "top 82%",
        once: true
      }
    });

    focusTL.from("#focus .section-header > *", {
      y: 28,
      opacity: 0,
      duration: 0.7,
      stagger: 0.09,
      ease: "power3.out"
    })
    // Primary Career Direction Box
    .from(".focus-primary-box, .secondary-focus-list", {
      y: 24,
      opacity: 0,
      duration: 0.65,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.35")
    // Capability groups (Finance, Capital Markets, Analytics, Execution)
    .from(".skill-category", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
      clearProps: "opacity,transform"
    }, "-=0.3");

    // Subtle chips micro-stagger inside skill categories
    const skillCategories = document.querySelectorAll(".skill-category");
    skillCategories.forEach((cat) => {
      const chips = cat.querySelectorAll(".skill-chip");
      if (chips.length) {
        gsap.from(chips, {
          y: 10,
          opacity: 0,
          duration: 0.45,
          stagger: 0.03,
          ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: cat,
            start: "top 85%",
            once: true
          }
        });
      }
    });

    // ========================================================================
    // SELECTED PROJECTS DIAGRAMS CONTEXTUAL REAL-TIME ANIMATIONS
    // ========================================================================
    function initProjectDiagramAnimations() {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        return; // Leave diagrams directly in static completed state
      }

      const hasHover = window.matchMedia("(hover: hover)").matches;

      // ----------------------------------------------------------------------
      // DIAGRAM 1: POS -> INVENTORY -> ERP / GL -> EXECUTIVE
      // ----------------------------------------------------------------------
      const d1Svg = document.querySelector(".diagram-1");
      const d1Card = d1Svg ? d1Svg.closest(".project-card") : null;
      if (d1Svg && d1Card) {
        const d1TL = gsap.timeline({
          paused: true,
          defaults: { ease: "power2.out", overwrite: "auto" }
        });

        // Initial setup at time 0
        d1TL.set(d1Svg.querySelectorAll(".d1-node"), { opacity: 0.22, scale: 0.97, transformOrigin: "center center" })
          .set(d1Svg.querySelectorAll(".d1-line"), { scaleX: 0 })
          .set(d1Svg.querySelectorAll(".d1-dot"), { opacity: 0, scale: 0 })
          .set(d1Svg.querySelectorAll(".d1-sub"), { opacity: 0, y: 3 })
          .set(d1Svg.querySelector(".d1-node-inv .d1-box"), { stroke: "rgba(255,255,255,0.15)" })
          .set(d1Svg.querySelector(".d1-node-erp .d1-box"), { stroke: "rgba(255,255,255,0.15)" })
          .set(d1Svg.querySelector(".d1-node-erp .d1-title"), { fill: "#F5F5F5" })

          // STEP 1 — POS: Reveal POS node and "Capture"
          .to(d1Svg.querySelector(".d1-node-pos"), { opacity: 1, scale: 1, duration: 0.35 })
          .to(d1Svg.querySelector(".d1-node-pos .d1-sub"), { opacity: 1, y: 0, duration: 0.2 }, "-=0.15")

          // STEP 2 — CONNECTION POS -> INVENTORY
          .to(d1Svg.querySelector(".d1-line-1"), { scaleX: 1, transformOrigin: "130px 100px", duration: 0.3 }, "+=0.04")
          .fromTo(d1Svg.querySelector(".d1-dot-1"), { opacity: 0, scale: 0, x: -35 }, { opacity: 1, scale: 1, x: 0, duration: 0.25, ease: "sine.inOut" }, "<+=0.06")

          // STEP 3 — INVENTORY: Activate node, highlight border briefly, reveal "Reconciliation"
          .to(d1Svg.querySelector(".d1-node-inv"), { opacity: 1, scale: 1, duration: 0.3 }, "-=0.08")
          .to(d1Svg.querySelector(".d1-node-inv .d1-box"), { stroke: "#C6A15B", duration: 0.15 }, "<")
          .to(d1Svg.querySelector(".d1-node-inv .d1-sub"), { opacity: 1, y: 0, duration: 0.2 }, "<+=0.04")
          .to(d1Svg.querySelector(".d1-node-inv .d1-box"), { stroke: "rgba(255,255,255,0.15)", duration: 0.25 }, "+=0.25")

          // STEP 4 — INVENTORY -> ERP / GL
          .to(d1Svg.querySelector(".d1-line-2"), { scaleX: 1, transformOrigin: "290px 100px", duration: 0.3 }, "-=0.12")
          .fromTo(d1Svg.querySelector(".d1-dot-2"), { opacity: 0, scale: 0, x: -35 }, { opacity: 1, scale: 1, x: 0, duration: 0.25, ease: "sine.inOut" }, "<+=0.06")

          // STEP 5 — ERP / GL: Processing node, draws gold border & title, reveals "Auto-Post", stays highlighted
          .to(d1Svg.querySelector(".d1-node-erp"), { opacity: 1, scale: 1, duration: 0.35 }, "-=0.08")
          .to(d1Svg.querySelector(".d1-node-erp .d1-box"), { stroke: "#C6A15B", duration: 0.3 }, "<")
          .to(d1Svg.querySelector(".d1-node-erp .d1-title"), { fill: "#C6A15B", duration: 0.25 }, "<")
          .to(d1Svg.querySelector(".d1-node-erp .d1-sub"), { opacity: 1, y: 0, duration: 0.2 }, "<+=0.1")

          // STEP 6 — ERP / GL -> EXECUTIVE
          .to(d1Svg.querySelector(".d1-line-3"), { scaleX: 1, transformOrigin: "450px 100px", duration: 0.28 }, "+=0.04")
          .fromTo(d1Svg.querySelector(".d1-dot-3"), { opacity: 0, scale: 0, x: -30 }, { opacity: 1, scale: 1, x: 0, duration: 0.22, ease: "sine.inOut" }, "<+=0.06")

          // STEP 7 — EXECUTIVE: Activate Executive node and "Audit BI"
          .to(d1Svg.querySelector(".d1-node-exec"), { opacity: 1, scale: 1, duration: 0.3 }, "-=0.08")
          .to(d1Svg.querySelector(".d1-node-exec .d1-sub"), { opacity: 1, y: 0, duration: 0.2 }, "<+=0.04")

          // Final pipeline pulse (one subtle travel pulse)
          .to(d1Svg.querySelectorAll(".d1-dot"), { scale: 1.35, duration: 0.16, stagger: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" }, "+=0.06");

        // Prime initial state
        d1TL.seek(0);

        ScrollTrigger.create({
          trigger: d1Card,
          start: "top 78%",
          once: true,
          onEnter: () => d1TL.play()
        });

        if (hasHover) {
          d1Card.addEventListener("mouseenter", () => {
            d1TL.restart();
          });
        }
      }

      // ----------------------------------------------------------------------
      // DIAGRAM 2: MANUAL PROCESS -> 70% CYCLE REDUCTION -> RULES ENGINE
      // ----------------------------------------------------------------------
      const d2Svg = document.querySelector(".diagram-2");
      const d2Card = d2Svg ? d2Svg.closest(".project-card") : null;
      if (d2Svg && d2Card) {
        const d2TL = gsap.timeline({
          paused: true,
          defaults: { ease: "power2.out", overwrite: "auto" }
        });

        d2TL.set(d2Svg.querySelectorAll(".d2-grid-line"), { opacity: 0 })
          .set(d2Svg.querySelector(".d2-label-manual"), { opacity: 0, y: -4 })
          .set(d2Svg.querySelector(".d2-bar-manual"), { scaleY: 0, transformOrigin: "170px 160px", opacity: 1 })
          .set(d2Svg.querySelector(".d2-label-cycle"), { opacity: 0, y: -4 })
          .set(d2Svg.querySelector(".d2-bar-reduced"), { scaleY: 0, transformOrigin: "280px 160px" })
          .set(d2Svg.querySelector(".d2-connector"), { strokeDasharray: 100, strokeDashoffset: 100 })
          .set(d2Svg.querySelector(".d2-rules-box"), { opacity: 0, scale: 0.97, transformOrigin: "450px 100px", stroke: "rgba(255,255,255,0.2)" })
          .set(d2Svg.querySelector(".d2-rules-title"), { opacity: 0, y: 3 })
          .set(d2Svg.querySelector(".d2-rules-sub"), { opacity: 0, y: 3 })

          // STEP 1 — BASELINE: Grid lines and Manual label
          .to(d2Svg.querySelectorAll(".d2-grid-line"), { opacity: 1, duration: 0.3, stagger: 0.05 })
          .to(d2Svg.querySelector(".d2-label-manual"), { opacity: 1, y: 0, duration: 0.25 }, "-=0.15")

          // STEP 2 — MANUAL BAR: Grows bottom-up
          .to(d2Svg.querySelector(".d2-bar-manual"), { scaleY: 1, duration: 0.45, ease: "power2.out" })

          // STEP 3 — REDUCTION: Reveal -70% Cycle, animate gold bar, de-emphasize manual bar to 0.65
          .to(d2Svg.querySelector(".d2-label-cycle"), { opacity: 1, y: 0, duration: 0.25 }, "+=0.12")
          .to(d2Svg.querySelector(".d2-bar-reduced"), { scaleY: 1, duration: 0.35, ease: "power2.out" }, "<")
          .to(d2Svg.querySelector(".d2-bar-manual"), { opacity: 0.65, duration: 0.3 }, "<")

          // STEP 4 — CONNECTOR: Draw toward Rules Engine
          .to(d2Svg.querySelector(".d2-connector"), { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, "+=0.05")

          // STEP 5 — RULES ENGINE: Activate box, border to gold, reveal text
          .to(d2Svg.querySelector(".d2-rules-box"), { opacity: 1, scale: 1, stroke: "#C6A15B", duration: 0.35, ease: "power2.out" }, "-=0.08")
          .to(d2Svg.querySelector(".d2-rules-title"), { opacity: 1, y: 0, duration: 0.2 }, "<+=0.1")
          .to(d2Svg.querySelector(".d2-rules-sub"), { opacity: 1, y: 0, duration: 0.2 }, "<+=0.08");

        d2TL.seek(0);

        ScrollTrigger.create({
          trigger: d2Card,
          start: "top 78%",
          once: true,
          onEnter: () => d2TL.play()
        });

        if (hasHover) {
          d2Card.addEventListener("mouseenter", () => {
            d2TL.restart();
          });
        }
      }

      // ----------------------------------------------------------------------
      // DIAGRAM 3: UNDERWRITING FILTER / +20% LENDING / -12% NPAs
      // ----------------------------------------------------------------------
      const d3Svg = document.querySelector(".diagram-3");
      const d3Card = d3Svg ? d3Svg.closest(".project-card") : null;
      if (d3Svg && d3Card) {
        const d3TL = gsap.timeline({
          paused: true,
          defaults: { ease: "power2.out", overwrite: "auto" }
        });

        d3TL.set(d3Svg.querySelectorAll(".d3-axis"), { opacity: 0 })
          .set(d3Svg.querySelector(".d3-filter-line"), { scaleY: 0, transformOrigin: "280px 160px" })
          .set(d3Svg.querySelector(".d3-filter-label"), { opacity: 0, y: 4 })
          .set(d3Svg.querySelector(".d3-npa-clip-rect"), { scaleX: 0, transformOrigin: "80px 100px" })
          .set(d3Svg.querySelector(".d3-npa-label"), { opacity: 0, x: -8 })
          .set(d3Svg.querySelector(".d3-growth-curve"), { strokeDasharray: 450, strokeDashoffset: 450 })
          .set(d3Svg.querySelector(".d3-growth-label"), { opacity: 0, x: -8 })
          .set(d3Svg.querySelector(".d3-intersect-dot"), { opacity: 0, scale: 0, transformOrigin: "280px 106px" })

          // STEP 1 — AXES
          .to(d3Svg.querySelectorAll(".d3-axis"), { opacity: 1, duration: 0.3 })

          // STEP 2 — UNDERWRITING FILTER: Animate vertical line bottom-to-top, fade in label
          .to(d3Svg.querySelector(".d3-filter-line"), { scaleY: 1, duration: 0.35, ease: "power2.out" }, "-=0.1")
          .to(d3Svg.querySelector(".d3-filter-label"), { opacity: 1, y: 0, duration: 0.25 }, "-=0.15")

          // STEP 3 — NPA DECLINING CURVE: Progressive left-to-right draw, reveal -12% NPAs
          .to(d3Svg.querySelector(".d3-npa-clip-rect"), { scaleX: 1, duration: 0.5, ease: "power2.out" }, "+=0.04")
          .to(d3Svg.querySelector(".d3-npa-label"), { opacity: 1, x: 0, duration: 0.25 }, "-=0.15")

          // STEP 4 — LENDING GROWTH CURVE: Progressive left-to-right growth, reveal +20% Lending
          .to(d3Svg.querySelector(".d3-growth-curve"), { strokeDashoffset: 0, duration: 0.85, ease: "power2.out" }, "-=0.35")
          .to(d3Svg.querySelector(".d3-growth-label"), { opacity: 1, x: 0, duration: 0.25 }, "-=0.15")

          // STEP 5 — INTERSECTION / FILTER MOMENT: Subtle gold pulse at intersection
          .fromTo(d3Svg.querySelector(".d3-intersect-dot"), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1.5, duration: 0.2, ease: "power2.out" }, "-=0.45")
          .to(d3Svg.querySelector(".d3-intersect-dot"), { opacity: 0.85, scale: 1, duration: 0.15 }, "<+=0.15");

        d3TL.seek(0);

        ScrollTrigger.create({
          trigger: d3Card,
          start: "top 78%",
          once: true,
          onEnter: () => d3TL.play()
        });

        if (hasHover) {
          d3Card.addEventListener("mouseenter", () => {
            d3TL.restart();
          });
        }
      }

      // ----------------------------------------------------------------------
      // DIAGRAM 4: DATA SOURCES -> AI CREDIT ENGINE -> EXPLAINABLE DECISION
      // ----------------------------------------------------------------------
      const d4Svg = document.querySelector(".diagram-4");
      const d4Card = d4Svg ? d4Svg.closest(".project-card") : null;
      if (d4Svg && d4Card) {
        const d4TL = gsap.timeline({
          paused: true,
          defaults: { ease: "power2.out", overwrite: "auto" }
        });

        d4TL.set(d4Svg.querySelector(".d4-input-1"), { opacity: 0, x: -15 })
          .set(d4Svg.querySelector(".d4-input-2"), { opacity: 0, x: -15 })
          .set(d4Svg.querySelectorAll(".d4-input-line"), { strokeDasharray: 85, strokeDashoffset: 85 })
          .set(d4Svg.querySelector(".d4-signal-1"), { opacity: 0, cx: 190, cy: 65 })
          .set(d4Svg.querySelector(".d4-signal-2"), { opacity: 0, cx: 190, cy: 135 })
          .set(d4Svg.querySelector(".d4-engine-circle"), { scale: 0.94, opacity: 0, stroke: "rgba(198,161,91,0.3)", transformOrigin: "300px 100px" })
          .set(d4Svg.querySelector(".d4-engine-title"), { opacity: 0, y: 3 })
          .set(d4Svg.querySelector(".d4-engine-sub"), { opacity: 0, y: 3 })
          .set(d4Svg.querySelector(".d4-output-line"), { strokeDasharray: 85, strokeDashoffset: 85 })
          .set(d4Svg.querySelector(".d4-signal-out"), { opacity: 0, cx: 338 })
          .set(d4Svg.querySelector(".d4-output-box"), { opacity: 0, scale: 0.97, stroke: "rgba(255,255,255,0.15)", transformOrigin: "485px 100px" })
          .set(d4Svg.querySelector(".d4-output-title"), { opacity: 0, y: 3 })
          .set(d4Svg.querySelector(".d4-output-sub"), { opacity: 0, y: 3 })

          // STEP 1 — INPUT SOURCES: Slide in from left
          .to(d4Svg.querySelector(".d4-input-1"), { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" })
          .to(d4Svg.querySelector(".d4-input-2"), { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }, "-=0.25")

          // STEP 2 — INPUT CONNECTIONS: Draw lines, signal dots travel toward engine
          .to(d4Svg.querySelectorAll(".d4-input-line"), { strokeDashoffset: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }, "-=0.1")
          .fromTo(d4Svg.querySelector(".d4-signal-1"), { opacity: 1, cx: 190, cy: 65 }, { cx: 264, cy: 90, opacity: 0, duration: 0.3, ease: "sine.inOut" }, "<")
          .fromTo(d4Svg.querySelector(".d4-signal-2"), { opacity: 1, cx: 190, cy: 135 }, { cx: 264, cy: 110, opacity: 0, duration: 0.3, ease: "sine.inOut" }, "<+=0.04")

          // STEP 3 — AI CREDIT ENGINE: Activate center engine, stroke to gold, reveal text, single pulse
          .to(d4Svg.querySelector(".d4-engine-circle"), { scale: 1, opacity: 1, stroke: "#C6A15B", duration: 0.45, ease: "power3.out" }, "-=0.08")
          .to(d4Svg.querySelector(".d4-engine-title"), { opacity: 1, y: 0, duration: 0.2 }, "<+=0.1")
          .to(d4Svg.querySelector(".d4-engine-sub"), { opacity: 1, y: 0, duration: 0.2 }, "<+=0.08")
          .to(d4Svg.querySelector(".d4-engine-circle"), { scale: 1.025, duration: 0.18, yoyo: true, repeat: 1, ease: "power1.inOut" })

          // STEP 4 — OUTPUT CONNECTION: Draw line to output box, signal dot travels
          .to(d4Svg.querySelector(".d4-output-line"), { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, "-=0.05")
          .fromTo(d4Svg.querySelector(".d4-signal-out"), { opacity: 1, cx: 338 }, { cx: 420, opacity: 0, duration: 0.3, ease: "sine.inOut" }, "<")

          // STEP 5 — EXPLAINABLE DECISION: Activate output box, reveal decision text and Basel subtitle
          .to(d4Svg.querySelector(".d4-output-box"), { opacity: 1, scale: 1, stroke: "rgba(198,161,91,0.4)", duration: 0.35, ease: "power2.out" }, "-=0.08")
          .to(d4Svg.querySelector(".d4-output-title"), { opacity: 1, y: 0, duration: 0.2 }, "<+=0.08")
          .to(d4Svg.querySelector(".d4-output-sub"), { opacity: 1, y: 0, duration: 0.25 }, "<+=0.08");

        d4TL.seek(0);

        ScrollTrigger.create({
          trigger: d4Card,
          start: "top 78%",
          once: true,
          onEnter: () => d4TL.play()
        });

        if (hasHover) {
          d4Card.addEventListener("mouseenter", () => {
            d4TL.restart();
          });
        }
      }
    }

  }); // end gsap.context

  // --------------------------------------------------------------------------
  // Recalculate ScrollTrigger on window load (after images & fonts load)
  // --------------------------------------------------------------------------
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

  // --------------------------------------------------------------------------
  // Clean up on page unload
  // --------------------------------------------------------------------------
  window.addEventListener("beforeunload", () => {
    ctx.revert();
  });
}

// Execute on DOM ready or immediately if already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAnimations);
} else {
  initAnimations();
}
