/**
 * js/admin.js
 * Admin CMS Dashboard, Posts Management, Editor & Subscribers Logic
 * Pavan Darshan Doddala Portfolio
 */
import { getSupabase, requireAdminAuth, generateSlug, formatDate, uploadBlogImage, getActiveResume, uploadResumeFile, deleteActiveResume } from './supabase-client.js';
import { parseMarkdown } from './blog.js';

/**
 * Toast Notification Helper
 */
export function showToast(message, type = 'success') {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.className = 'admin-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `admin-toast show ${type}`;
  setTimeout(() => {
    toast.className = 'admin-toast';
  }, 3500);
}

/**
 * Sets up the Common Admin Sidebar (User info, Sign Out, Mobile toggle)
 */
export function setupAdminSidebar(session) {
  const userEmailEl = document.getElementById('adminUserEmail');
  if (userEmailEl && session?.user?.email) {
    userEmailEl.textContent = session.user.email;
  }

  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const supabase = await getSupabase();
      await supabase.auth.signOut();
      window.location.href = '/admin';
    });
  }

  const mobileToggle = document.getElementById('adminMobileToggle');
  const sidebar = document.querySelector('.admin-sidebar');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

/**
 * 1. Admin Login Page (/admin)
 */
export async function initAdminLogin() {
  const form = document.getElementById('adminLoginForm');
  const errorEl = document.getElementById('loginError');
  const submitBtn = document.getElementById('loginSubmitBtn');

  if (!form) return;

  // If already authenticated, redirect straight to /admin/posts
  const supabase = await getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    window.location.href = '/admin/posts';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';
    errorEl.style.display = 'none';

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign In';

    if (error) {
      errorEl.textContent = error.message || 'Invalid email or password.';
      errorEl.style.display = 'block';
      return;
    }

    if (data?.session) {
      const redirectUrl = sessionStorage.getItem('admin_redirect_after_login') || '/admin/posts';
      sessionStorage.removeItem('admin_redirect_after_login');
      window.location.href = redirectUrl;
    }
  });
}

/**
 * 2. Admin Posts Listing & Dashboard (/admin/posts)
 */
export async function initAdminPosts() {
  const session = await requireAdminAuth();
  if (!session) return;
  setupAdminSidebar(session);

  const postsTableBody = document.getElementById('postsTableBody');
  const searchInput = document.getElementById('postsSearch');
  const filterTabs = document.getElementById('postsFilterTabs');
  const statPublished = document.getElementById('statPublished');
  const statDrafts = document.getElementById('statDrafts');
  const statSubscribers = document.getElementById('statSubscribers');

  let allPosts = [];
  let currentFilter = 'all';
  let searchQuery = '';

  const supabase = await getSupabase();

  // Load KPI Stats
  async function loadStats() {
    try {
      const [{ count: pubCount }, { count: draftCount }, { count: subCount }] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('subscribers').select('*', { count: 'exact', head: true })
      ]);

      if (statPublished) statPublished.textContent = pubCount || 0;
      if (statDrafts) statDrafts.textContent = draftCount || 0;
      if (statSubscribers) statSubscribers.textContent = subCount || 0;
    } catch (err) {
      console.warn('Could not load admin stats:', err);
    }
  }

  // Load Posts
  async function loadPosts() {
    if (postsTableBody) {
      postsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 32px;">Loading posts...</td></tr>`;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      allPosts = data || [];
      renderPostsTable();
    } catch (err) {
      console.error('Error fetching posts:', err);
      if (postsTableBody) {
        postsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#F87171; padding: 32px;">Failed to load posts. Please try again.</td></tr>`;
      }
    }
  }

  function renderPostsTable() {
    if (!postsTableBody) return;

    let filtered = allPosts;
    if (currentFilter !== 'all') {
      filtered = filtered.filter(p => p.status === currentFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery) ||
        (p.category && p.category.toLowerCase().includes(searchQuery)) ||
        p.slug.toLowerCase().includes(searchQuery)
      );
    }

    if (filtered.length === 0) {
      postsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 48px; color: var(--text-muted);">
            No posts found. Click "+ New Post" to write your first article.
          </td>
        </tr>
      `;
      return;
    }

    postsTableBody.innerHTML = filtered.map(post => {
      const isPublished = post.status === 'published';
      const statusClass = isPublished ? 'published' : 'draft';
      const displayDate = isPublished ? formatDate(post.published_at) : formatDate(post.updated_at || post.created_at);
      const isClean = !window.location.protocol.startsWith('file:') && !window.location.pathname.endsWith('.html');
      const editUrl = isClean ? `/admin/posts/${post.id}/edit` : `/admin/post-edit.html?id=${post.id}`;
      const viewUrl = isClean ? `/blog/${post.slug}` : `/blog/post.html?slug=${post.slug}`;

      return `
        <tr data-id="${post.id}">
          <td>
            <div class="table-post-title">${post.title}</div>
            <div class="table-post-slug">/${post.slug}</div>
          </td>
          <td><span class="badge-status ${statusClass}">${post.status}</span></td>
          <td>${post.category || 'Finance'}</td>
          <td style="font-family: var(--font-mono); font-size: 0.78rem;">${displayDate || '—'}</td>
          <td>
            <div class="table-actions">
              <a href="${editUrl}" class="btn-action" title="Edit Post">Edit</a>
              ${isPublished ? `<a href="${viewUrl}" target="_blank" class="btn-action" title="View Public Post">View</a>` : ''}
              <button class="btn-action delete" data-action="delete" data-id="${post.id}" data-title="${post.title}" title="Delete Post">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Filter tab clicks
  if (filterTabs) {
    filterTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.filter-tab');
      if (!tab) return;
      filterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderPostsTable();
    });
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderPostsTable();
    });
  }

  // Delete Post Modal Logic
  const deleteModal = document.getElementById('deleteConfirmModal');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const deletePostTitleEl = document.getElementById('deletePostTitle');
  let postToDeleteId = null;

  if (postsTableBody) {
    postsTableBody.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('[data-action="delete"]');
      if (!deleteBtn) return;
      postToDeleteId = deleteBtn.dataset.id;
      if (deletePostTitleEl) deletePostTitleEl.textContent = `"${deleteBtn.dataset.title}"`;
      if (deleteModal) deleteModal.classList.add('active');
    });
  }

  if (cancelDeleteBtn && deleteModal) {
    cancelDeleteBtn.addEventListener('click', () => {
      deleteModal.classList.remove('active');
      postToDeleteId = null;
    });
  }

  if (confirmDeleteBtn && deleteModal) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!postToDeleteId) return;
      confirmDeleteBtn.disabled = true;
      confirmDeleteBtn.textContent = 'Deleting...';

      try {
        const { error } = await supabase.from('posts').delete().eq('id', postToDeleteId);
        if (error) throw error;
        showToast('Post deleted successfully');
        deleteModal.classList.remove('active');
        allPosts = allPosts.filter(p => p.id !== postToDeleteId);
        renderPostsTable();
        loadStats();
      } catch (err) {
        console.error('Delete error:', err);
        showToast(err.message || 'Failed to delete post.', 'error');
      } finally {
        confirmDeleteBtn.disabled = false;
        confirmDeleteBtn.textContent = 'Delete Post';
        postToDeleteId = null;
      }
    });
  }

  loadStats();
  loadPosts();
}

/**
 * 3. Admin Post Editor: Create & Edit (/admin/posts/new & /admin/posts/[id]/edit)
 */
export async function initAdminPostEdit() {
  const session = await requireAdminAuth();
  if (!session) return;
  setupAdminSidebar(session);

  const form = document.getElementById('postEditForm');
  const pageHeading = document.getElementById('editorPageHeading');
  const pageSubheading = document.getElementById('editorPageSubheading');
  const titleInput = document.getElementById('postTitle');
  const slugInput = document.getElementById('postSlug');
  const categoryInput = document.getElementById('postCategory');
  const excerptInput = document.getElementById('postExcerpt');
  const contentInput = document.getElementById('postContent');
  const previewArea = document.getElementById('editorPreview');
  const altInput = document.getElementById('postFeaturedAlt');
  const seoTitleInput = document.getElementById('postSeoTitle');
  const seoDescInput = document.getElementById('postSeoDesc');
  const statusSelect = document.getElementById('postStatus');
  const saveDraftBtn = document.getElementById('btnSaveDraft');
  const publishBtn = document.getElementById('btnPublish');
  const deleteBtn = document.getElementById('btnDeletePost');
  const imageFileInput = document.getElementById('featuredImageFile');
  const imagePreviewWrap = document.getElementById('imagePreviewWrap');
  const imagePreviewImg = document.getElementById('imagePreviewImg');
  const removeImageBtn = document.getElementById('removeImageBtn');

  // Determine post ID from URL path or query parameter
  let postId = null;
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('id')) {
    postId = urlParams.get('id');
  } else {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const postsIdx = parts.indexOf('posts');
    if (postsIdx !== -1 && parts.length > postsIdx + 1 && parts[postsIdx + 1] !== 'new') {
      postId = parts[postsIdx + 1];
    }
  }

  let isNew = !postId;
  let currentPost = null;
  let hasManuallyEditedSlug = false;
  let featuredImageUrl = '';

  const supabase = await getSupabase();

  // If editing, load post details
  if (!isNew) {
    if (pageHeading) pageHeading.textContent = 'Edit Insight';
    if (pageSubheading) pageSubheading.textContent = 'Update your article content, metadata, or publishing status.';
    if (publishBtn) publishBtn.textContent = 'Update Post';
    if (deleteBtn) deleteBtn.style.display = 'inline-flex';

    try {
      const { data, error } = await supabase.from('posts').select('*').eq('id', postId).single();
      if (error || !data) throw error || new Error('Post not found');
      currentPost = data;

      titleInput.value = data.title || '';
      slugInput.value = data.slug || '';
      categoryInput.value = data.category || 'Finance';
      excerptInput.value = data.excerpt || '';
      contentInput.value = data.content || '';
      altInput.value = data.featured_image_alt || '';
      seoTitleInput.value = data.seo_title || '';
      seoDescInput.value = data.seo_description || '';
      statusSelect.value = data.status || 'draft';
      hasManuallyEditedSlug = true;

      if (data.featured_image_url) {
        featuredImageUrl = data.featured_image_url;
        imagePreviewImg.src = data.featured_image_url;
        imagePreviewWrap.style.display = 'block';
      }

      updateGoogleSnippet();
    } catch (err) {
      console.error('Error loading post:', err);
      showToast('Could not load post data.', 'error');
    }
  }

  // Auto-slugify as title is typed
  if (titleInput && slugInput) {
    titleInput.addEventListener('input', () => {
      if (!hasManuallyEditedSlug) {
        slugInput.value = generateSlug(titleInput.value);
      }
      updateGoogleSnippet();
    });

    slugInput.addEventListener('input', () => {
      hasManuallyEditedSlug = true;
      updateGoogleSnippet();
    });
  }

  if (excerptInput) {
    excerptInput.addEventListener('input', updateGoogleSnippet);
  }

  if (seoTitleInput) {
    seoTitleInput.addEventListener('input', updateGoogleSnippet);
  }

  if (seoDescInput) {
    seoDescInput.addEventListener('input', updateGoogleSnippet);
  }

  // Google Snippet Preview update
  function updateGoogleSnippet() {
    const title = seoTitleInput.value || titleInput.value || 'Insight Title';
    const slug = slugInput.value || 'insight-slug';
    const desc = seoDescInput.value || excerptInput.value || 'Insight description preview...';

    const snippetTitle = document.getElementById('snippetTitle');
    const snippetUrl = document.getElementById('snippetUrl');
    const snippetDesc = document.getElementById('snippetDesc');

    if (snippetTitle) snippetTitle.textContent = `${title} | Pavan Doddala`;
    if (snippetUrl) snippetUrl.textContent = `https://pavandoddala.com/blog/${slug}`;
    if (snippetDesc) snippetDesc.textContent = desc;
  }

  // SEO Accordion Toggle
  const accordionHeader = document.getElementById('seoAccordionHeader');
  const accordionBody = document.getElementById('seoAccordionBody');
  if (accordionHeader && accordionBody) {
    accordionHeader.addEventListener('click', () => {
      accordionBody.classList.toggle('open');
    });
  }

  // Markdown Toolbar actions
  const toolbar = document.querySelector('.editor-toolbar');
  if (toolbar && contentInput) {
    toolbar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cmd]');
      if (!btn) return;
      const cmd = btn.dataset.cmd;
      insertFormatting(cmd);
    });
  }

  function insertFormatting(cmd) {
    const start = contentInput.selectionStart;
    const end = contentInput.selectionEnd;
    const selected = contentInput.value.substring(start, end);
    let before = contentInput.value.substring(0, start);
    let after = contentInput.value.substring(end);
    let replacement = '';

    switch (cmd) {
      case 'bold':
        replacement = `**${selected || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selected || 'italic text'}*`;
        break;
      case 'h2':
        replacement = `\n## ${selected || 'Heading 2'}\n`;
        break;
      case 'h3':
        replacement = `\n### ${selected || 'Heading 3'}\n`;
        break;
      case 'quote':
        replacement = `\n> ${selected || 'Quote text here'}\n`;
        break;
      case 'link':
        replacement = `[${selected || 'Link Title'}](https://example.com)`;
        break;
      case 'ul':
        replacement = `\n- ${selected || 'List item 1'}\n- List item 2\n`;
        break;
      case 'ol':
        replacement = `\n1. ${selected || 'Step 1'}\n2. Step 2\n`;
        break;
      case 'hr':
        replacement = `\n---\n`;
        break;
      case 'code':
        replacement = `\`${selected || 'code'}\``;
        break;
    }

    contentInput.value = before + replacement + after;
    contentInput.focus();
    contentInput.setSelectionRange(start + replacement.length, start + replacement.length);
  }

  // Write vs Preview Tab toggle
  const writeTabBtn = document.getElementById('btnTabWrite');
  const previewTabBtn = document.getElementById('btnTabPreview');
  if (writeTabBtn && previewTabBtn && contentInput && previewArea) {
    writeTabBtn.addEventListener('click', () => {
      writeTabBtn.classList.add('active');
      previewTabBtn.classList.remove('active');
      contentInput.style.display = 'block';
      previewArea.classList.remove('active');
    });

    previewTabBtn.addEventListener('click', () => {
      previewTabBtn.classList.add('active');
      writeTabBtn.classList.remove('active');
      contentInput.style.display = 'none';
      previewArea.classList.add('active');
      previewArea.innerHTML = `<div class="article-body">${parseMarkdown(contentInput.value)}</div>`;
    });
  }

  // Featured Image Upload handler
  if (imageFileInput) {
    imageFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      showToast('Uploading image to Supabase Storage...', 'info');
      try {
        const publicUrl = await uploadBlogImage(file, postId || 'drafts');
        featuredImageUrl = publicUrl;
        imagePreviewImg.src = publicUrl;
        imagePreviewWrap.style.display = 'block';
        showToast('Image uploaded successfully!');
      } catch (err) {
        console.error('Image upload failed:', err);
        showToast(err.message || 'Failed to upload image.', 'error');
      }
    });
  }

  if (removeImageBtn) {
    removeImageBtn.addEventListener('click', () => {
      featuredImageUrl = '';
      imagePreviewImg.src = '';
      imagePreviewWrap.style.display = 'none';
      imageFileInput.value = '';
    });
  }

  // Inline Image Upload prompt for toolbar
  const insertImageBtn = document.getElementById('btnInsertInlineImage');
  const inlineImageFileInput = document.getElementById('inlineImageFile');
  if (insertImageBtn && inlineImageFileInput) {
    insertImageBtn.addEventListener('click', () => {
      inlineImageFileInput.click();
    });

    inlineImageFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      showToast('Uploading inline article image...', 'info');
      try {
        const publicUrl = await uploadBlogImage(file, postId || 'articles');
        const markdownImage = `\n![${file.name.split('.')[0]}](${publicUrl})\n`;
        const start = contentInput.selectionStart;
        contentInput.value = contentInput.value.substring(0, start) + markdownImage + contentInput.value.substring(start);
        showToast('Image inserted into article!');
      } catch (err) {
        showToast(err.message || 'Failed to upload inline image.', 'error');
      }
    });
  }

  // Save Post logic (handles Draft and Publish)
  async function savePost(targetStatus) {
    const title = titleInput.value.trim();
    const slug = slugInput.value.trim() || generateSlug(title);

    if (!title) {
      showToast('Post title is required.', 'error');
      titleInput.focus();
      return;
    }
    if (!slug) {
      showToast('Post slug is required.', 'error');
      slugInput.focus();
      return;
    }

    // Set buttons state
    if (saveDraftBtn) saveDraftBtn.disabled = true;
    if (publishBtn) publishBtn.disabled = true;

    try {
      const payload = {
        title,
        slug,
        category: categoryInput.value.trim() || 'Finance',
        excerpt: excerptInput.value.trim(),
        content: contentInput.value,
        featured_image_url: featuredImageUrl || null,
        featured_image_alt: altInput.value.trim() || null,
        seo_title: seoTitleInput.value.trim() || null,
        seo_description: seoDescInput.value.trim() || null,
        status: targetStatus
      };

      // Set published_at timestamp when publishing
      if (targetStatus === 'published') {
        if (!currentPost?.published_at) {
          payload.published_at = new Date().toISOString();
        }
      }

      let savedId = postId;

      if (isNew) {
        const { data, error } = await supabase.from('posts').insert([payload]).select().single();
        if (error) {
          if (error.code === '23505') throw new Error('A post with this slug already exists. Please modify the slug.');
          throw error;
        }
        savedId = data.id;
        showToast(`Post saved as ${targetStatus}!`);
        // Navigate to edit mode with ID
        setTimeout(() => {
          const isClean = !window.location.protocol.startsWith('file:') && !window.location.pathname.endsWith('.html');
          window.location.href = isClean ? `/admin/posts/${savedId}/edit` : `/admin/post-edit.html?id=${savedId}`;
        }, 1000);
      } else {
        const { error } = await supabase.from('posts').update(payload).eq('id', postId);
        if (error) {
          if (error.code === '23505') throw new Error('A post with this slug already exists. Please modify the slug.');
          throw error;
        }
        showToast(`Post successfully updated (${targetStatus})!`);
        currentPost = { ...currentPost, ...payload };
        statusSelect.value = targetStatus;
      }
    } catch (err) {
      console.error('Save post error:', err);
      showToast(err.message || 'Error saving post.', 'error');
    } finally {
      if (saveDraftBtn) saveDraftBtn.disabled = false;
      if (publishBtn) publishBtn.disabled = false;
    }
  }

  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => savePost('draft'));
  }

  if (publishBtn) {
    publishBtn.addEventListener('click', () => savePost('published'));
  }

  // Delete Post confirmation from edit page
  const deleteModal = document.getElementById('deleteConfirmModal');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  if (deleteBtn && deleteModal) {
    deleteBtn.addEventListener('click', () => {
      deleteModal.classList.add('active');
    });
  }

  if (cancelDeleteBtn && deleteModal) {
    cancelDeleteBtn.addEventListener('click', () => {
      deleteModal.classList.remove('active');
    });
  }

  if (confirmDeleteBtn && deleteModal && postId) {
    confirmDeleteBtn.addEventListener('click', async () => {
      confirmDeleteBtn.disabled = true;
      confirmDeleteBtn.textContent = 'Deleting...';
      try {
        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (error) throw error;
        showToast('Post deleted successfully');
        setTimeout(() => {
          window.location.href = '/admin/posts';
        }, 800);
      } catch (err) {
        showToast(err.message || 'Failed to delete post.', 'error');
        confirmDeleteBtn.disabled = false;
        confirmDeleteBtn.textContent = 'Delete Post';
      }
    });
  }
}

/**
 * 4. Admin Subscribers Management (/admin/subscribers)
 */
export async function initAdminSubscribers() {
  const session = await requireAdminAuth();
  if (!session) return;
  setupAdminSidebar(session);

  const tableBody = document.getElementById('subscribersTableBody');
  const countEl = document.getElementById('subscriberTotalCount');
  const searchInput = document.getElementById('subscriberSearch');
  const exportCsvBtn = document.getElementById('exportCsvBtn');

  let allSubscribers = [];
  let searchQuery = '';

  const supabase = await getSupabase();

  async function loadSubscribers() {
    if (tableBody) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 32px;">Loading subscribers...</td></tr>`;
    }

    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      allSubscribers = data || [];
      if (countEl) countEl.textContent = allSubscribers.length;
      renderTable();
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#F87171; padding: 32px;">Failed to load subscribers.</td></tr>`;
      }
    }
  }

  function renderTable() {
    if (!tableBody) return;

    let filtered = allSubscribers;
    if (searchQuery) {
      filtered = filtered.filter(s => s.email.toLowerCase().includes(searchQuery));
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 48px; color: var(--text-muted);">
            No subscribers found.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(sub => {
      const dateStr = formatDate(sub.created_at);
      const isSubscribed = sub.status === 'active';

      return `
        <tr data-id="${sub.id}">
          <td style="font-weight: 500; color: var(--text-primary);">${sub.email}</td>
          <td style="font-family: var(--font-mono); font-size: 0.78rem;">${dateStr}</td>
          <td><span class="badge-status ${sub.status}">${sub.status}</span></td>
          <td style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">${sub.source || 'blog'}</td>
          <td>
            <div class="table-actions">
              ${isSubscribed ? `
                <button class="btn-action" data-action="toggle-status" data-id="${sub.id}" data-current="${sub.status}">Deactivate</button>
              ` : `
                <button class="btn-action" data-action="toggle-status" data-id="${sub.id}" data-current="${sub.status}">Reactivate</button>
              `}
              <button class="btn-action delete" data-action="delete-sub" data-id="${sub.id}" data-email="${sub.email}">Remove</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderTable();
    });
  }

  // Table action clicks (Status toggle and Delete)
  if (tableBody) {
    tableBody.addEventListener('click', async (e) => {
      const toggleBtn = e.target.closest('[data-action="toggle-status"]');
      const deleteSubBtn = e.target.closest('[data-action="delete-sub"]');

      if (toggleBtn) {
        const id = toggleBtn.dataset.id;
        const current = toggleBtn.dataset.current;
        const newStatus = current === 'active' ? 'unsubscribed' : 'active';
        toggleBtn.disabled = true;

        try {
          const { error } = await supabase.from('subscribers').update({ status: newStatus }).eq('id', id);
          if (error) throw error;
          showToast(`Subscriber ${newStatus === 'active' ? 'reactivated' : 'deactivated'}.`);
          allSubscribers = allSubscribers.map(s => s.id === id ? { ...s, status: newStatus } : s);
          renderTable();
        } catch (err) {
          showToast('Could not update subscriber status.', 'error');
        }
      }

      if (deleteSubBtn) {
        const id = deleteSubBtn.dataset.id;
        const email = deleteSubBtn.dataset.email;
        if (!confirm(`Permanently remove subscriber ${email}?`)) return;

        try {
          const { error } = await supabase.from('subscribers').delete().eq('id', id);
          if (error) throw error;
          showToast('Subscriber removed.');
          allSubscribers = allSubscribers.filter(s => s.id !== id);
          if (countEl) countEl.textContent = allSubscribers.length;
          renderTable();
        } catch (err) {
          showToast('Could not delete subscriber.', 'error');
        }
      }
    });
  }

  // Export CSV
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      if (allSubscribers.length === 0) {
        showToast('No subscribers to export.', 'info');
        return;
      }

      const headers = ['email', 'status', 'source', 'subscribed_at'];
      const rows = allSubscribers.map(s => [
        `"${s.email}"`,
        `"${s.status}"`,
        `"${s.source || 'blog'}"`,
        `"${s.created_at}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Subscribers CSV exported successfully!');
    });
  }

  loadSubscribers();
}

/**
 * 4. Admin Resume Management Page (/admin/resume)
 */
export async function initAdminResume() {
  const session = await requireAdminAuth('/admin');
  if (!session) return;
  setupAdminSidebar(session);

  const activeSection = document.getElementById('activeResumeSection');
  const emptySection = document.getElementById('emptyResumeSection');
  const fileInput = document.getElementById('resumeFileInput');
  const btnUploadNew = document.getElementById('btnUploadNewResume');
  const btnReplace = document.getElementById('btnReplaceResume');
  const btnDelete = document.getElementById('btnDeleteResume');
  const btnPreview = document.getElementById('btnPreviewResume');
  const btnDownload = document.getElementById('btnDownloadResume');
  const dropzone = document.getElementById('resumeDropzone');
  const progressWrap = document.getElementById('uploadProgressWrap');
  const progressBar = document.getElementById('uploadProgressBar');
  const progressPercent = document.getElementById('uploadProgressPercent');

  const activeFileName = document.getElementById('activeFileName');
  const activeFileSize = document.getElementById('activeFileSize');
  const activeUploadDate = document.getElementById('activeUploadDate');

  let currentResume = null;

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  async function refreshResumeState() {
    try {
      currentResume = await getActiveResume();
      if (currentResume && !currentResume.is_deleted && currentResume.file_url) {
        // Active
        activeFileName.textContent = currentResume.file_name || 'Resume Document';
        activeFileSize.textContent = formatBytes(currentResume.file_size);
        activeUploadDate.textContent = currentResume.uploaded_at ? `Updated ${formatDate(currentResume.uploaded_at)}` : 'Active';
        
        btnPreview.href = currentResume.file_url;
        btnDownload.href = currentResume.file_url;
        btnDownload.download = currentResume.file_name || 'Pavan_Darshan_Doddala_Resume.pdf';

        activeSection.style.display = 'block';
        emptySection.style.display = 'none';
        if (btnUploadNew) btnUploadNew.style.display = 'none';
      } else {
        // Empty / Deleted
        activeSection.style.display = 'none';
        emptySection.style.display = 'block';
        if (btnUploadNew) btnUploadNew.style.display = 'inline-flex';
      }
    } catch (err) {
      console.error('Error loading resume:', err);
      showToast('Could not load current resume status.', 'error');
    }
  }

  async function handleFile(file) {
    if (!file) return;

    if (progressWrap) {
      progressWrap.style.display = 'block';
      progressBar.style.width = '30%';
      progressPercent.textContent = '30%';
    }

    try {
      if (progressWrap) {
        progressBar.style.width = '65%';
        progressPercent.textContent = '65%';
      }

      const uploaded = await uploadResumeFile(file);

      if (progressWrap) {
        progressBar.style.width = '100%';
        progressPercent.textContent = '100%';
        setTimeout(() => {
          progressWrap.style.display = 'none';
          progressBar.style.width = '0%';
        }, 500);
      }

      showToast(`Resume "${uploaded.file_name}" uploaded and activated!`, 'success');
      await refreshResumeState();
    } catch (err) {
      if (progressWrap) progressWrap.style.display = 'none';
      console.error('Upload error:', err);
      showToast(err.message || 'Failed to upload resume.', 'error');
    } finally {
      if (fileInput) fileInput.value = '';
    }
  }

  // Upload button listeners
  if (btnUploadNew) {
    btnUploadNew.addEventListener('click', () => fileInput && fileInput.click());
  }

  if (btnReplace) {
    btnReplace.addEventListener('click', () => fileInput && fileInput.click());
  }

  // Drag & drop
  if (dropzone) {
    dropzone.addEventListener('click', () => fileInput && fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
    });
  }

  // Delete Action
  if (btnDelete) {
    btnDelete.addEventListener('click', async () => {
      const confirmed = confirm(
        'Are you sure you want to delete this resume?\n\n' +
        'Once deleted, visitors to the portfolio will see that your resume is currently being updated and will be prompted to contact you directly.'
      );
      if (!confirmed) return;

      try {
        await deleteActiveResume();
        showToast('Resume removed successfully. You can upload a new one anytime.', 'success');
        await refreshResumeState();
      } catch (err) {
        console.error('Delete error:', err);
        showToast('Could not delete resume.', 'error');
      }
    });
  }

  await refreshResumeState();
}
