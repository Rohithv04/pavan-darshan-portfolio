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
