/**
 * js/blog.js
 * Public Blog & Dynamic Article Reader Logic
 * Pavan Darshan Doddala Portfolio
 */
import { getSupabase, calculateReadingTime, formatDate, subscribeNewsletter } from './supabase-client.js';

/**
 * Lightweight, robust Markdown to HTML parser
 */
export function parseMarkdown(md) {
  if (!md) return '';
  let html = md;

  // Escape HTML entities to prevent raw injection, preserving intentional markup
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Code blocks: ```code```
  html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h2>$1</h2>');

  // Horizontal Rule: ---
  html = html.replace(/^---$/gim, '<hr>');

  // Blockquotes: > quote
  html = html.replace(/^\&gt;\s?(.*$)/gim, '<blockquote><p>$1</p></blockquote>');
  // Combine consecutive blockquotes
  html = html.replace(/<\/blockquote>\s*<blockquote>/g, '');

  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Images: ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');

  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Lists: Unordered
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<ul-item>$1</ul-item>');
  html = html.replace(/(<ul-item>.*<\/ul-item>\s*)+/g, (match) => {
    const items = match.replace(/<ul-item>/g, '<li>').replace(/<\/ul-item>/g, '</li>');
    return `<ul>${items}</ul>`;
  });

  // Lists: Ordered
  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<ol-item>$1</ol-item>');
  html = html.replace(/(<ol-item>.*<\/ol-item>\s*)+/g, (match) => {
    const items = match.replace(/<ol-item>/g, '<li>').replace(/<\/ol-item>/g, '</li>');
    return `<ol>${items}</ol>`;
  });

  // Paragraphs: Wrap lines separated by blank lines that aren't already wrapped in tags
  const blocks = html.split(/\n{2,}/);
  html = blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    if (/^<(h[2-6]|ul|ol|pre|blockquote|hr|img)/i.test(block)) {
      return block;
    }
    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  }).join('\n\n');

  return html;
}

export const DEFAULT_POST_IMAGES = {
  'understanding-capital-allocation-discipline-over-velocity': {
    url: '/assets/capital-allocation-discipline.jpg',
    alt: 'Editorial illustration depicting capital allocation discipline over velocity: measuring plumb-line and phase-gate arches filtering momentum into stable compounding foundations.'
  },
  'credit-risk-and-alternative-data-in-sme-underwriting': {
    url: '/assets/credit-risk-underwriting.jpg',
    alt: 'Editorial illustration depicting commercial credit risk and alternative data: analyst examining real-time data flows across geometric ledger planes with an optical prism.'
  }
};

export function resolvePostImage(post) {
  if (post.featured_image_url) {
    return {
      url: post.featured_image_url,
      alt: post.featured_image_alt || post.title
    };
  }
  if (DEFAULT_POST_IMAGES[post.slug]) {
    return DEFAULT_POST_IMAGES[post.slug];
  }
  if (post.category && post.category.toLowerCase() === 'banking') {
    return DEFAULT_POST_IMAGES['credit-risk-and-alternative-data-in-sme-underwriting'];
  }
  return DEFAULT_POST_IMAGES['understanding-capital-allocation-discipline-over-velocity'];
}

/**
 * Initializes the Public Blog Listing Page (/blog)
 */
export async function initBlogList() {
  const gridEl = document.getElementById('blogGrid');
  const searchInput = document.getElementById('blogSearch');
  const categoriesContainer = document.getElementById('categoryFilters');
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterInput = document.getElementById('newsletterEmail');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  if (!gridEl) return;

  let allPosts = [];
  let currentCategory = 'all';
  let searchQuery = '';

  // Setup Newsletter Submission
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = newsletterInput.value;
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');

      if (!email) return;
      submitBtn.disabled = true;
      newsletterFeedback.textContent = 'Subscribing...';
      newsletterFeedback.className = 'newsletter-feedback info';

      const res = await subscribeNewsletter(email, 'blog_index');
      submitBtn.disabled = false;

      if (res.success) {
        newsletterFeedback.textContent = res.message;
        newsletterFeedback.className = 'newsletter-feedback success';
        newsletterInput.value = '';
      } else if (res.status === 'already_subscribed') {
        newsletterFeedback.textContent = res.message;
        newsletterFeedback.className = 'newsletter-feedback info';
      } else {
        newsletterFeedback.textContent = res.message;
        newsletterFeedback.className = 'newsletter-feedback error';
      }
    });
  }

  // Fetch published posts from Supabase
  try {
    const supabase = await getSupabase();
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, content, category, featured_image_url, featured_image_alt, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    allPosts = posts || [];
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    gridEl.innerHTML = `
      <div class="blog-empty">
        <h3>Could not load insights</h3>
        <p>Please check your connection and refresh.</p>
      </div>
    `;
    return;
  }

  // Build Category Filters
  const categories = ['all', ...new Set(allPosts.map(p => p.category || 'Finance'))];
  if (categoriesContainer) {
    categoriesContainer.innerHTML = categories.map(cat => `
      <button class="category-pill ${cat === 'all' ? 'active' : ''}" data-category="${cat}">
        ${cat === 'all' ? 'All Topics' : cat}
      </button>
    `).join('');

    categoriesContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.category-pill');
      if (!btn) return;
      categoriesContainer.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderFilteredPosts();
    });
  }

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderFilteredPosts();
    });
  }

  function renderFilteredPosts() {
    let filtered = allPosts;

    if (currentCategory !== 'all') {
      filtered = filtered.filter(p => (p.category || 'Finance').toLowerCase() === currentCategory.toLowerCase());
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(searchQuery)) ||
        (p.category && p.category.toLowerCase().includes(searchQuery))
      );
    }

    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div class="blog-empty" style="grid-column: 1 / -1;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h3>No articles found</h3>
          <p>Try searching for a different keyword or topic filter.</p>
        </div>
      `;
      return;
    }

    // Determine link URL format (clean URL vs query param fallback)
    const isCleanRouting = !window.location.protocol.startsWith('file:') && !window.location.pathname.endsWith('.html');

    gridEl.innerHTML = filtered.map(post => {
      const readingTime = calculateReadingTime(post.content || post.excerpt || '');
      const pubDate = formatDate(post.published_at);
      const postUrl = isCleanRouting ? `/blog/${post.slug}` : `/blog/post.html?slug=${post.slug}`;
      const postImg = resolvePostImage(post);
      const imageHtml = postImg?.url
        ? `<img src="${postImg.url}" alt="${postImg.alt || post.title}" loading="lazy">`
        : `<div class="blog-card-img-fallback">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
             <span>${post.category || 'FINANCE'}</span>
           </div>`;

      return `
        <article class="blog-card">
          <a href="${postUrl}" class="blog-card-img-wrap" aria-label="${post.title}">
            ${imageHtml}
          </a>
          <div class="blog-card-body">
            <div class="blog-card-meta-top">
              <span class="blog-card-badge">${post.category || 'Finance'}</span>
              <span class="blog-card-readtime">${readingTime}</span>
            </div>
            <a href="${postUrl}">
              <h2 class="blog-card-title">${post.title}</h2>
            </a>
            <p class="blog-card-excerpt">${post.excerpt || ''}</p>
            <div class="blog-card-footer">
              <span class="blog-card-date">${pubDate}</span>
              <a href="${postUrl}" class="blog-card-cta">
                <span>Read Article</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Initial render
  renderFilteredPosts();
}

/**
 * Initializes the Individual Dynamic Article Page (/blog/[slug])
 */
export async function initArticlePage() {
  const container = document.getElementById('articleContent');
  if (!container) return;

  // Extract slug from path (/blog/[slug]) or query param (?slug=...)
  let slug = '';
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('slug')) {
    slug = urlParams.get('slug');
  } else {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const blogIndex = segments.indexOf('blog');
    if (blogIndex !== -1 && segments.length > blogIndex + 1) {
      slug = segments[blogIndex + 1];
    }
  }

  if (!slug) {
    renderArticleNotFound('Missing article identifier.');
    return;
  }

  try {
    const supabase = await getSupabase();
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !post) {
      renderArticleNotFound('The requested insight could not be found or has not yet been published.');
      return;
    }

    renderArticle(post);
    setupArticleSEO(post);
  } catch (err) {
    console.error('Error fetching article:', err);
    renderArticleNotFound('An error occurred while loading this article.');
  }

  function renderArticleNotFound(message) {
    container.innerHTML = `
      <div class="blog-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></line><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h3>Article Not Found</h3>
        <p>${message}</p>
        <div style="margin-top: var(--space-lg);">
          <a href="/blog" class="btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">
            <span>&larr; Back to All Insights</span>
          </a>
        </div>
      </div>
    `;
  }

  function renderArticle(post) {
    const readingTime = calculateReadingTime(post.content);
    const pubDate = formatDate(post.published_at);
    const parsedBody = parseMarkdown(post.content);

    const postImg = resolvePostImage(post);
    const imageHtml = postImg?.url ? `
      <div class="article-hero-media">
        <img src="${postImg.url}" alt="${postImg.alt || post.title}">
        ${postImg.alt ? `<div class="article-hero-caption">${postImg.alt}</div>` : ''}
      </div>
    ` : '';

    container.innerHTML = `
      <header class="article-header">
        <a href="/blog" class="article-back-link">
          <span aria-hidden="true">&larr;</span>
          <span>Back to Insights</span>
        </a>
        <div class="article-badge">${post.category || 'Finance'}</div>
        <h1 class="article-title">${post.title}</h1>
        ${post.excerpt ? `<p class="article-lead">${post.excerpt}</p>` : ''}
        
        <div class="article-meta-bar">
          <div class="article-author-info">
            <div class="article-author-monogram">P</div>
            <span>Pavan Darshan Doddala</span>
          </div>
          <span class="article-meta-sep">•</span>
          <span>${pubDate}</span>
          <span class="article-meta-sep">•</span>
          <span>${readingTime}</span>
        </div>
      </header>

      ${imageHtml}

      <div class="article-body">
        ${parsedBody}
      </div>

      <div class="article-author-card">
        <div class="author-card-avatar">P</div>
        <div class="author-card-details">
          <h4>Pavan Darshan Doddala</h4>
          <div class="author-role">Finance & Project Leadership Professional</div>
          <p>Full-Time MBA Candidate at Santa Clara University’s Leavey School of Business. Notes, analysis, and perspectives across corporate finance, banking systems, credit risk, and strategic enterprise execution.</p>
        </div>
      </div>

      <div class="newsletter-section">
        <span class="newsletter-eyebrow">Stay Updated</span>
        <h3 class="newsletter-title">Occasional notes on finance, markets, and strategic execution.</h3>
        <p class="newsletter-desc">Delivered straight to your inbox. No spam, ever.</p>
        <form id="articleNewsletterForm" class="newsletter-form">
          <input type="email" id="articleNewsletterEmail" class="newsletter-input" placeholder="your@email.com" required>
          <button type="submit" class="newsletter-btn">Subscribe</button>
        </form>
        <span class="newsletter-subtext">No spam. Just new articles and occasional insights.</span>
        <div id="articleNewsletterFeedback" class="newsletter-feedback" aria-live="polite"></div>
      </div>

      <div class="article-nav">
        <a href="/blog" class="article-back-link">
          <span aria-hidden="true">&larr;</span>
          <span>View All Insights</span>
        </a>
      </div>
    `;

    // Hook up newsletter form on article
    const articleForm = document.getElementById('articleNewsletterForm');
    const articleInput = document.getElementById('articleNewsletterEmail');
    const articleFeedback = document.getElementById('articleNewsletterFeedback');

    if (articleForm) {
      articleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = articleInput.value;
        const submitBtn = articleForm.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        articleFeedback.textContent = 'Subscribing...';
        articleFeedback.className = 'newsletter-feedback info';

        const res = await subscribeNewsletter(email, `article_${post.slug}`);
        submitBtn.disabled = false;

        if (res.success) {
          articleFeedback.textContent = res.message;
          articleFeedback.className = 'newsletter-feedback success';
          articleInput.value = '';
        } else if (res.status === 'already_subscribed') {
          articleFeedback.textContent = res.message;
          articleFeedback.className = 'newsletter-feedback info';
        } else {
          articleFeedback.textContent = res.message;
          articleFeedback.className = 'newsletter-feedback error';
        }
      });
    }
  }

  function setupArticleSEO(post) {
    const pageTitle = `${post.seo_title || post.title} | Pavan Doddala`;
    const pageDesc = post.seo_description || post.excerpt || '';
    const pageUrl = window.location.href;
    const pageImage = post.featured_image_url || 'https://pavandoddala.com/assets/favicon.svg';

    document.title = pageTitle;

    function setMeta(selector, attr, value) {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          el.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
        } else if (selector.startsWith('meta[property=')) {
          el.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    }

    setMeta('meta[name="description"]', 'content', pageDesc);
    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', pageDesc);
    setMeta('meta[property="og:url"]', 'content', pageUrl);
    setMeta('meta[property="og:type"]', 'content', 'article');
    if (post.featured_image_url) {
      setMeta('meta[property="og:image"]', 'content', pageImage);
    }

    // JSON-LD Structured Data
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": pageDesc,
      "image": post.featured_image_url ? [post.featured_image_url] : [],
      "datePublished": post.published_at,
      "dateModified": post.updated_at || post.published_at,
      "author": {
        "@type": "Person",
        "name": "Pavan Darshan Doddala",
        "url": "https://pavandoddala.com"
      },
      "publisher": {
        "@type": "Person",
        "name": "Pavan Darshan Doddala"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": pageUrl
      }
    });
    document.head.appendChild(schemaScript);
  }
}
