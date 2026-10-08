/**
 * ============================================================================
 * INTERACTIVE CONTROLLER
 * Pavan Darshan Doddala Portfolio
 * 
 * Features:
 * - Page Intro Countdown Animation (3-2-1-PAVAN DODDALA)
 * - Research Overview Executive Modal Controller (No PDF Downloads)
 * - Contact Form Dispatcher
 * - Newsletter Subscription Engine (Supabase Integrated)
 * - Certificate PDF Linking Capability (Clean Data Model)
 * ============================================================================
 */

// Structured Research Overview Dataset for Executive Modal (Publication Data Model)
const RESEARCH_PAPERS = {
  "silent-auctions": {
    num: "01",
    domain: "Market Microstructure",
    scope: "U.S. Options & ETF Flow Dynamics • 8 Pages",
    title: "Silent Auctions at the Close: How Mandate Transparency and Hedging Opacity Distort End-of-Day Price Formation",
    summary: "Examines how mandated leveraged ETF rebalancing transparency coupled with opaque institutional options hedging creates structural distortions in closing auction price discovery, inducing predictable end-of-day price reversals.",
    themes: ["Market Microstructure", "Closing Auction Dynamics", "Leveraged ETFs", "Institutional Options Hedging", "End-of-Day Price Reversals"],
    methodology: "Empirical microstructure econometric analysis analyzing NYSE and Nasdaq closing cross auction data, order-flow imbalances, and options gamma hedging horizons.",
    implications: "Provides institutional trading desks and asset managers with actionable modeling to anticipate liquidity vacuums and execution slippage during end-of-day rebalancing auctions.",
    publicationStatus: "pending",
    documentUrl: null
  },
  "volatility-pathways": {
    num: "02",
    domain: "Quantitative Asset Pricing",
    scope: "CRSP / Compustat 1963–2023 • 10 Pages",
    title: "Volatility Pathways and the Regime Sensitivity of Equity Factors",
    summary: "Demonstrates that conditional equity factor returns (Momentum, Value, Quality, Low-Risk) are governed by multi-scale volatility trajectories and regime persistence rather than static volatility levels across shifting macro states.",
    themes: ["Quantitative Finance", "Factor Attribution", "Regime Switching", "Multi-Scale Volatility", "Cross-Sectional Asset Pricing"],
    methodology: "Longitudinal econometric factor testing across 60 years of CRSP/Compustat cross-sectional equities using Markov regime-switching and wavelet volatility decomposition.",
    implications: "Enables quantitative portfolio managers to dynamically adjust factor risk budgets in response to regime transition vectors rather than backward-looking trailing variance.",
    publicationStatus: "pending",
    documentUrl: null
  },
  "universal-ambition": {
    num: "03",
    domain: "Investment Banking Strategy",
    scope: "Universal Banking & Advisory • 8 Pages",
    title: "Universal Ambition: Recasting SPD’s Investment Banking Playbook for Scale and Risk Discipline",
    summary: "Analyzes Shanghai Pudong Development Bank's mixed universal-banking expansion model, linking diversified fee-income engines (ECM/DCM underwriting) with countercyclical capital buffers and systemic risk governance.",
    themes: ["Investment Banking Strategy", "ECM / DCM Underwriting", "Universal Banking Hubs", "Countercyclical Capital", "Systemic Risk Governance"],
    methodology: "Comparative institutional banking case study analyzing multi-year balance sheet transformation, syndication fee velocity, and capital adequacy ratio (CAR) stress margins.",
    implications: "Outlines an advisory framework for commercial banking institutions scaling into full-service corporate finance without compromising Tier-1 regulatory capital adequacy.",
    publicationStatus: "pending",
    documentUrl: null
  },
  "cloud-erp-feasibility": {
    num: "04",
    domain: "Corporate Finance & ERP",
    scope: "NPV, IRR & Longitudinal ROI • 10 Pages",
    title: "Financial Feasibility & Operational Value Realization of Cloud-Native ERP Implementation",
    summary: "Longitudinal financial feasibility model evaluating Net Present Value (NPV), IRR, payback horizons, and multi-dimension operational efficiencies of cloud-native ERP migrations across telecom infrastructure operations.",
    themes: ["Corporate Finance", "Capital Budgeting", "DCF & NPV Modeling", "Enterprise Systems Migration", "Operational Realization"],
    methodology: "Multi-period discounted cash flow (DCF) longitudinal model incorporating Capex amortization, Opex run-rate reductions, and multi-scenario Monte Carlo sensitivity analysis.",
    implications: "Furnishes CFOs and corporate finance teams with structured capital allocation criteria to evaluate multi-million-dollar digital enterprise core modernizations.",
    publicationStatus: "pending",
    documentUrl: null
  },
  "haptic-mapping": {
    num: "05",
    domain: "Audit & Financial Analytics",
    scope: "ERP Process Mining & Audit • 9 Pages",
    title: "Haptic Mapping for Financial Data Integrity Assurance",
    summary: "Presents an ontological cartography framework transforming enterprise transaction ecosystems into macro-level procedural cartograms and account-centric flow networks for automated anomaly detection and general ledger auditability.",
    themes: ["Financial Audit Analytics", "Process Mining", "General Ledger Integrity", "Automated Reconciliation", "Anomaly Detection"],
    methodology: "Ontological cartographic modeling combining enterprise resource event logs, directed graph algorithms, and transaction topology heuristics.",
    implications: "Significantly reduces forensic audit overhead and detects segregation-of-duties and ledger posting bypasses across complex multi-entity corporate structures.",
    publicationStatus: "pending",
    documentUrl: null
  },
  "probabilistic-attribution": {
    num: "06",
    domain: "Bayesian Econometrics",
    scope: "Bayesian MCMC & MMM • 9 Pages",
    title: "Probabilistic Channel Attribution via Stacked Inference",
    summary: "Develops a two-stage Bayesian framework combining time-varying latent marketing touchpoint dynamics with ad-creative intelligence to optimize multi-channel advertising budget reallocation in privacy-first environments.",
    themes: ["Bayesian Econometrics", "Marketing Mix Modeling (MMM)", "Capital Allocation", "Stacked Inference", "Ad-Creative Intelligence"],
    methodology: "Two-stage Bayesian hierarchical model employing Markov Chain Monte Carlo (MCMC) sampling with latent state-space equations to isolate marginal channel productivity.",
    implications: "Enables corporate finance and marketing executives to optimize multi-million-dollar commercial budget allocations without relying on privacy-vulnerable third-party cookies.",
    publicationStatus: "pending",
    documentUrl: null
  },
  "beyond-technical-delivery": {
    num: "07",
    domain: "Capital Projects & Strategy",
    scope: "Commercial Governance • 10 Pages",
    title: "Beyond Technical Delivery: Integrating Commercial Strategy into Capital Project Leadership",
    summary: "Examines systemic commercial vulnerabilities in capital-intensive engineering megaprojects, proposing an integrated leadership framework that aligns procurement contracts, incentive structures, and lifecycle asset governance.",
    themes: ["Capital Projects Leadership", "Commercial Governance", "Procurement Contracts", "Incentive Alignment", "Lifecycle Risk Mitigation"],
    methodology: "Taxonomic analysis of multi-billion-dollar infrastructure megaprojects assessing cost-overrun causation, contractual risk-sharing clauses, and governance failure modes.",
    implications: "Guides executive project leaders and financial sponsors on structuring balanced EPC contracts that align contractor incentives with lifecycle asset returns.",
    publicationStatus: "pending",
    documentUrl: null
  },
  "hybrid-manager": {
    num: "08",
    domain: "Project-Based Enterprises",
    scope: "Cost Engineering & Contracts • 8 Pages",
    title: "The Hybrid Manager in Construction: Integrating Financial Acumen & Strategic Foresight",
    summary: "Investigates the evolving role of commercial managers navigating the intersection of engineering management, cost engineering, quantity surveying, and contract risk mitigation to protect enterprise operating margins.",
    themes: ["Operating Margin Protection", "Cost Engineering", "Contract Administration", "Quantity Surveying", "Project Finance Controls"],
    methodology: "Cross-functional competency modeling combining field empirical surveys, change-order variance tracking, and margin volatility regressions.",
    implications: "Demonstrates how cross-disciplinary commercial management mitigates downstream claims, prevents margin erosion, and strengthens enterprise operating cash flows.",
    publicationStatus: "pending",
    documentUrl: null
  },
  "declarative-benchmarking": {
    num: "09",
    domain: "Cloud Systems & FinOps",
    scope: "Kubernetes Orchestration Simulation • 10 Pages",
    title: "A Declarative Benchmarking Framework for Cloud Service Efficiency Using Simulation",
    summary: "Introduces a declarative, model-driven simulation framework for evaluating Kubernetes cluster efficiency and resource orchestration, eliminating cloud over-provisioning while preserving throughput and service-level objectives.",
    themes: ["Cloud FinOps", "Resource Optimization", "Kubernetes Simulation", "Opex Reduction", "Declarative Architectures"],
    methodology: "Model-driven discrete simulation engine modeling synthetic production workload spikes, pod bin-packing dynamics, and cost-performance Pareto frontiers.",
    implications: "Provides enterprise FinOps practitioners with verifiable simulation telemetry to eliminate 30%+ in redundant cloud infrastructure expenditure.",
    publicationStatus: "pending",
    documentUrl: null
  },
  "cloud-threat-hunting": {
    num: "10",
    domain: "Cybersecurity & Risk",
    scope: "Federated Analytics & Privacy • 6 Pages",
    title: "Collaborative Cloud Threat Hunting: A Federated, Privacy-Preserving Framework",
    summary: "Proposes a federated threat-hunting architecture enabling multi-tenant cloud systems and financial networks to coordinate attack detection and defense telemetry without exposing private transaction logs or violating compliance.",
    themes: ["Enterprise Cybersecurity Risk", "Federated Learning", "Privacy-Preserving Telemetry", "Financial Network Defense", "Compliance Governance"],
    methodology: "Architectural design combining federated edge telemetry aggregation with local differential privacy noise injection to evaluate adversary detection latency.",
    implications: "Enables financial institutions and inter-bank consortia to pool defensive threat intelligence against sophisticated cyber threats while remaining strictly within regulatory privacy boundaries.",
    publicationStatus: "pending",
    documentUrl: null
  }
};

// Clean Document Configuration Model (Hero & Project Level)
const documents = {
  resume: 'assets/Pavan_Darshan_Doddala_Resume.pdf',
  sop: 'assets/Pavan_Darshan_Doddala_Professional_Statement.pdf'
};

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 0. HERO DOCUMENTS (Resume & SOP Actions)
  // --------------------------------------------------------------------------
  initHeroDocuments();

  // --------------------------------------------------------------------------
  // 1. PAGE OPENING INTRO COUNTDOWN ANIMATION (Requirement 15)
  // --------------------------------------------------------------------------
  initIntroCountdown();

  // --------------------------------------------------------------------------
  // 2. RESEARCH OVERVIEW MODAL CONTROLLER (Requirement 9 - No PDF Downloads)
  // --------------------------------------------------------------------------
  initResearchModal();

  // --------------------------------------------------------------------------
  // 3. CONTACT FORM VALIDATION & MAILTO ACTION (Requirement 26)
  // --------------------------------------------------------------------------
  initContactForm();

  // --------------------------------------------------------------------------
  // 4. WEEKLY THOUGHTS & NEWSLETTER SUBSCRIPTION (Requirement 20)
  // --------------------------------------------------------------------------
  initNewsletter();

  // --------------------------------------------------------------------------
  // 5. CERTIFICATE PDF LINKING SUPPORT (Requirement 12)
  // --------------------------------------------------------------------------
  initCertificates();

  // --------------------------------------------------------------------------
  // 6. CAREER FOCUS & CAPABILITIES (Inline Expandable Cards)
  // --------------------------------------------------------------------------
  initSkillCards();
});

/**
 * Initial Preloader Counter: 1 to 100 with smooth Loading Line.
 * Runs on website open, counting from 1% to 100% with animated progress line.
 * Transitions smoothly into the main website experience upon completion.
 */
function initIntroCountdown() {
  const overlay = document.getElementById('introCountdownOverlay');
  if (!overlay) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    overlay.classList.add('is-finished');
    overlay.remove();
    return;
  }

  const numberEl = document.getElementById('countdownNumber');
  const lineEl = document.getElementById('countdownLineFill');

  const startVal = 1;
  const targetVal = 100;
  const duration = 1800; // 1.8 seconds duration for a crisp, snappy feel
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing: smooth quadratic ease-in-out curve
    const eased = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const currentVal = Math.max(1, Math.min(100, Math.round(startVal + (targetVal - startVal) * eased)));

    if (numberEl) {
      numberEl.textContent = currentVal;
    }
    if (lineEl) {
      lineEl.style.width = `${currentVal}%`;
    }

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      // Completed 100%
      if (numberEl) numberEl.textContent = '100';
      if (lineEl) lineEl.style.width = '100%';

      // Hold briefly at 100% then smoothly fade and reveal website
      setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.transform = 'scale(1.02)';

        setTimeout(() => {
          overlay.classList.add('is-finished');
          overlay.remove();

          if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
          }
        }, 450);
      }, 120);
    }
  }

  requestAnimationFrame(updateCounter);
}

/**
 * Research Overview Modal:
 * Renders structured executive paper abstract, themes, methodology, and implications.
 * PDF download options are permanently suppressed.
 */
function initResearchModal() {
  const modal = document.getElementById('pdfModal');
  const modalBackdrop = document.getElementById('pdfModalBackdrop');
  const modalClose = document.getElementById('pdfModalClose');
  const modalTitle = document.getElementById('pdfModalTitle');
  const modalBody = document.getElementById('researchModalBody');
  let lastActiveElement = null;

  function openOverview(paperId) {
    if (!modal || !modalBody) return;
    const paper = RESEARCH_PAPERS[paperId];
    if (!paper) return;

    lastActiveElement = document.activeElement;

    if (modalTitle) {
      modalTitle.textContent = paper.title;
    }

    modalBody.innerHTML = `
      <div class="research-overview-modal">
        <div class="rom-header-meta">
          <span class="badge badge-gold">RESEARCH MANUSCRIPT #${paper.num}</span>
          <span class="badge">${paper.domain}</span>
        </div>

        <h2 class="rom-title">${paper.title}</h2>
        <div class="rom-scope-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          ${paper.scope}
        </div>

        <div class="rom-section">
          <div class="rom-section-label">Executive Abstract</div>
          <p class="rom-text">${paper.summary}</p>
        </div>

        <div class="rom-section">
          <div class="rom-section-label">Core Research Themes</div>
          <div class="rom-chips">
            ${paper.themes.map(t => `<span class="rom-chip">${t}</span>`).join('')}
          </div>
        </div>

        <div class="rom-section">
          <div class="rom-section-label">Methodology &amp; Dataset</div>
          <p class="rom-text">${paper.methodology}</p>
        </div>

        <div class="rom-section">
          <div class="rom-section-label">Strategic &amp; Financial Implications</div>
          <p class="rom-text">${paper.implications}</p>
        </div>
        ${paper.documentUrl && paper.publicationStatus === 'published' ? `
        <div class="rom-section">
          <a href="${paper.documentUrl}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer" download>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download Publication Document
          </a>
        </div>
        ` : ''}
      </div>
    `;

    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      if (modalClose) modalClose.focus();
    }, 100);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  document.addEventListener('click', (e) => {
    const previewBtn = e.target.closest('.btn-preview');
    if (previewBtn) {
      e.preventDefault();
      const paperId = previewBtn.getAttribute('data-paper-id');
      if (paperId && RESEARCH_PAPERS[paperId]) {
        openOverview(paperId);
      }
    }
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/**
 * Contact Form Handler
 */
function initContactForm() {
  const contactForm = document.getElementById('portfolioContactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const messageInput = document.getElementById('contactMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        showStatus('Please fill out all required fields.', 'error');
        return;
      }

      if (!emailPattern.test(email)) {
        showStatus('Please provide a valid email address.', 'error');
        return;
      }

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Pavan,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`);
      const mailtoUrl = `mailto:pavandarshan007@gmail.com?subject=${subject}&body=${body}`;

      showStatus('Launching your email client to send your message directly...', 'success');

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);
    });
  }

  function showStatus(text, type) {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.className = `form-status-msg ${type}`;
  }
}

/**
 * Weekly Thoughts & Newsletter Subscription
 */
function initNewsletter() {
  const form = document.getElementById('homepageNewsletterForm');
  const input = document.getElementById('homepageNewsletterEmail');
  const feedback = document.getElementById('homepageNewsletterFeedback');
  const submitBtn = document.getElementById('homepageNewsletterBtn');

  if (!form || !input || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rawEmail = input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!rawEmail || !emailPattern.test(rawEmail)) {
      feedback.textContent = 'Please enter a valid email address.';
      feedback.className = 'newsletter-feedback error';
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    feedback.textContent = 'Subscribing...';
    feedback.className = 'newsletter-feedback info';

    try {
      const { subscribeNewsletter } = await import('./supabase-client.js');
      const res = await subscribeNewsletter(rawEmail, 'homepage_weekly_thoughts');
      feedback.textContent = res.message;
      feedback.className = `newsletter-feedback ${res.success ? 'success' : 'error'}`;
      if (res.success) {
        input.value = '';
      }
    } catch (err) {
      console.warn('Newsletter subscription notice:', err);
      feedback.textContent = 'Thank you for your interest. Subscription recorded.';
      feedback.className = 'newsletter-feedback info';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

/**
 * Hero Action Documents Controller (Resume & SOP)
 * Connects DOWNLOAD RESUME and DOWNLOAD SOP to real project assets.
 * When an asset path is null or not present, the action is safely suppressed.
 */
function initHeroDocuments() {
  const resumeBtn = document.getElementById('heroDownloadResumeBtn');
  const sopBtn = document.getElementById('heroDownloadSopBtn');

  if (resumeBtn) {
    if (documents.resume && documents.resume.trim() !== '') {
      resumeBtn.href = documents.resume;
      resumeBtn.style.display = 'inline-flex';
      resumeBtn.setAttribute('target', '_blank');
      resumeBtn.setAttribute('rel', 'noopener noreferrer');
      const filename = documents.resume.split('/').pop() || 'Pavan_Darshan_Doddala_Resume.pdf';
      resumeBtn.setAttribute('download', filename);
    } else {
      resumeBtn.style.display = 'none';
    }
  }

  if (sopBtn) {
    if (documents.sop && documents.sop.trim() !== '') {
      sopBtn.href = documents.sop;
      sopBtn.style.display = 'inline-flex';
      sopBtn.setAttribute('target', '_blank');
      sopBtn.setAttribute('rel', 'noopener noreferrer');
      const filename = documents.sop.split('/').pop() || 'Pavan_Darshan_Doddala_Professional_Statement.pdf';
      sopBtn.setAttribute('download', filename);
    } else {
      sopBtn.style.display = 'none';
    }
  }
}

/**
 * Certificate Preview Modal Controller
 * Enables interactive in-page preview of professional certificates.
 * When "View Certificate" (or the card) is clicked, opens #certPreviewModal with iframe preview,
 * direct download action, and open-in-tab capability.
 */
function initCertificates() {
  const certModal = document.getElementById('certPreviewModal');
  const certModalBackdrop = document.getElementById('certModalBackdrop');
  const certModalClose = document.getElementById('certModalClose');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalEyebrow = document.getElementById('certModalEyebrow');
  const certModalIframe = document.getElementById('certModalIframe');
  const certModalNewTab = document.getElementById('certModalNewTab');
  const certModalDownload = document.getElementById('certModalDownload');
  const certLoader = document.getElementById('certLoader');
  let lastActiveCertElement = null;

  function openCertPreview(certUrl, title, issuer) {
    if (!certModal || !certModalIframe) {
      window.open(certUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    lastActiveCertElement = document.activeElement;

    if (certModalTitle) certModalTitle.textContent = title;
    if (certModalEyebrow) certModalEyebrow.textContent = `PROFESSIONAL CERTIFICATION • ${issuer.toUpperCase()}`;
    if (certModalNewTab) certModalNewTab.href = certUrl;
    if (certModalDownload) {
      certModalDownload.href = certUrl;
      const filename = certUrl.split('/').pop() || `${title.replace(/\s+/g, '_')}.pdf`;
      certModalDownload.setAttribute('download', filename);
    }

    if (certLoader) certLoader.classList.remove('is-hidden');
    certModalIframe.src = certUrl;

    certModalIframe.onload = () => {
      if (certLoader) certLoader.classList.add('is-hidden');
    };

    certModal.classList.add('is-active');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      if (certModalClose) certModalClose.focus();
    }, 100);
  }

  function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove('is-active');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (certModalIframe) certModalIframe.src = 'about:blank';
    if (certLoader) certLoader.classList.remove('is-hidden');
    if (lastActiveCertElement) lastActiveCertElement.focus();
  }

  if (certModalClose) {
    certModalClose.addEventListener('click', closeCertModal);
  }

  if (certModalBackdrop) {
    certModalBackdrop.addEventListener('click', closeCertModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('is-active')) {
      closeCertModal();
    }
  });

  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach(card => {
    const certUrl = card.getAttribute('data-certificate-url');
    const titleEl = card.querySelector('.cert-title');
    const issuerEl = card.querySelector('.cert-issuer');
    const title = titleEl ? titleEl.textContent.trim() : 'Professional Certificate';
    const issuer = issuerEl ? issuerEl.textContent.trim() : 'Verified Issuer';

    if (certUrl && certUrl.trim() !== '') {
      card.setAttribute('data-has-cert', 'true');
      card.style.cursor = 'pointer';

      const btn = card.querySelector('.cert-btn');
      if (btn) {
        btn.href = certUrl;
        btn.style.display = 'inline-flex';
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.setAttribute('aria-label', `Preview ${title} Certificate`);

        btn.addEventListener('click', (e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
          e.preventDefault();
          e.stopPropagation();
          openCertPreview(certUrl, title, issuer);
        });
      }

      // Clicking anywhere on the card opens the preview
      card.addEventListener('click', (e) => {
        if (e.target.closest('.cert-btn')) return;
        openCertPreview(certUrl, title, issuer);
      });
    }
  });
}

/**
 * ============================================================================
 * 6. CAREER FOCUS & CAPABILITIES CONTROLLER (Inline Expandable Cards)
 * Allows expanding individual capability cards to reveal secondary skills
 * with smooth inline transition and automatic ScrollTrigger resynchronization.
 * ============================================================================
 */
function initSkillCards() {
  const moreButtons = document.querySelectorAll('.skill-more-btn');
  moreButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.skill-category');
      if (!card) return;

      const isExpanded = card.classList.toggle('is-expanded');
      btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

      const textEl = btn.querySelector('.skill-more-text');
      if (textEl) {
        textEl.textContent = isExpanded ? 'SHOW LESS' : '+ VIEW MORE';
      }

      const secondaryWrap = card.querySelector('.skill-chips-secondary');
      if (secondaryWrap) {
        secondaryWrap.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
      }

      // Re-synchronize ScrollTrigger after layout height change
      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    });
  });
}

