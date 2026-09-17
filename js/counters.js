/**
 * Viewport & Hover Count-up Animation for Metrics
 * Precision easing:
 * 1. Runs upon entering the viewport.
 * 2. Whenever a metric card is hovered, smoothly rolls up the counter in orange.
 */

document.addEventListener('DOMContentLoaded', () => {
  const metricCards = document.querySelectorAll('.metric-number');
  if (!metricCards.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCount = (el, duration = 750) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const isFloat = (el.getAttribute('data-target') || '').includes('.');
    const startTime = performance.now();

    if (prefersReducedMotion || isNaN(target)) {
      el.textContent = el.getAttribute('data-target');
      return;
    }

    const easeOutCubic = (t) => (--t) * t * t + 1;

    // Reset element to start or 0 before rolling up
    el.textContent = '0';

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const currentVal = easedProgress * target;
      el.textContent = isFloat ? currentVal.toFixed(1) : Math.round(currentVal);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = el.getAttribute('data-target');
      }
    };

    requestAnimationFrame(update);
  };

  // 1. Initial viewport intersection observer
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target, 750);
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '0px 0px -40px 0px'
  });

  metricCards.forEach((card) => observer.observe(card));

  // 2. Hover interaction: whenever a card is hovered, re-scroll the counter
  const cards = document.querySelectorAll('.metric-card');
  cards.forEach((card) => {
    const numEl = card.querySelector('.metric-number');
    if (!numEl) return;

    let hoverTimeout;
    card.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      // Fast, slick 450ms counter roll on hover
      animateCount(numEl, 450);
    });
  });
});
