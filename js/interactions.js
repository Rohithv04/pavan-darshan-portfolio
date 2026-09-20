/**
 * Interactive Features: Research Accordion, Contact Form Handling, & UI Enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. PDF Research Preview Modal Controller
  const pdfModal = document.getElementById('pdfModal');
  const pdfModalBackdrop = document.getElementById('pdfModalBackdrop');
  const pdfModalClose = document.getElementById('pdfModalClose');
  const pdfModalTitle = document.getElementById('pdfModalTitle');
  const pdfModalDownload = document.getElementById('pdfModalDownload');
  const pdfModalOpenTab = document.getElementById('pdfModalOpenTab');
  const pdfFrame = document.getElementById('pdfFrame');
  const pdfLoader = document.getElementById('pdfLoader');
  let lastActiveElement = null;

  function openPdfModal(pdfUrl, title) {
    if (!pdfModal || !pdfFrame) return;

    lastActiveElement = document.activeElement;

    if (pdfModalTitle) pdfModalTitle.textContent = title;
    if (pdfModalDownload) {
      pdfModalDownload.href = pdfUrl;
      const filename = pdfUrl.split('/').pop();
      pdfModalDownload.setAttribute('download', filename);
    }
    if (pdfModalOpenTab) {
      pdfModalOpenTab.href = pdfUrl;
    }

    if (pdfLoader) pdfLoader.classList.remove('is-hidden');

    // Load PDF in iframe
    pdfFrame.onload = () => {
      if (pdfLoader) pdfLoader.classList.add('is-hidden');
    };
    pdfFrame.src = pdfUrl;

    // Open modal
    pdfModal.classList.add('is-active');
    pdfModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    setTimeout(() => {
      if (pdfModalClose) pdfModalClose.focus();
    }, 100);
  }

  function closePdfModal() {
    if (!pdfModal) return;

    pdfModal.classList.remove('is-active');
    pdfModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Clear iframe src to release browser memory and cancel rendering
    if (pdfFrame) pdfFrame.src = '';
    if (pdfLoader) pdfLoader.classList.remove('is-hidden');

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  // Delegated click handler for preview buttons
  document.addEventListener('click', (e) => {
    const previewBtn = e.target.closest('.btn-preview');
    if (previewBtn) {
      e.preventDefault();
      const pdfSrc = previewBtn.getAttribute('data-pdf');
      const pdfTitle = previewBtn.getAttribute('data-title') || 'Research Paper Preview';
      if (pdfSrc) {
        openPdfModal(pdfSrc, pdfTitle);
      }
    }
  });

  if (pdfModalClose) {
    pdfModalClose.addEventListener('click', closePdfModal);
  }

  if (pdfModalBackdrop) {
    pdfModalBackdrop.addEventListener('click', closePdfModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal && pdfModal.classList.contains('is-active')) {
      closePdfModal();
    }
  });

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
