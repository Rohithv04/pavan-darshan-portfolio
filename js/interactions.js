/**
 * Interactive Features: Research Accordion, Contact Form Handling, & UI Enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Research Drawer Expand / Collapse
  const researchToggleBtn = document.getElementById('toggleResearchBtn');
  const extraResearchDrawer = document.getElementById('extraResearchDrawer');
  const toggleIcon = document.getElementById('researchToggleIcon');
  const toggleText = document.getElementById('researchToggleText');

  if (researchToggleBtn && extraResearchDrawer) {
    researchToggleBtn.addEventListener('click', () => {
      const isExpanded = extraResearchDrawer.classList.toggle('is-expanded');
      researchToggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

      if (isExpanded) {
        toggleText.textContent = 'Show Fewer Research Areas';
        if (toggleIcon) toggleIcon.style.transform = 'rotate(180deg)';
      } else {
        toggleText.textContent = 'View All Research Areas';
        if (toggleIcon) toggleIcon.style.transform = 'rotate(0deg)';
      }
    });
  }

  // 2. Contact Form Validation & Mailto Action
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

      // Simple email validation regex
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        showStatus('Please fill out all required fields.', 'error');
        return;
      }

      if (!emailPattern.test(email)) {
        showStatus('Please provide a valid email address.', 'error');
        return;
      }

      // Prepare mailto fallback link with prefilled subject and body
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
});
