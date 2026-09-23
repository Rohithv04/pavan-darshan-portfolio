/**
 * js/supabase-client.js
 * Universal Supabase Client & Helper Utilities for Blog, CMS & Newsletter
 * Pavan Darshan Doddala Portfolio
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

let supabaseInstance = null;
let initPromise = null;

/**
 * Resolves Supabase credentials using environment hierarchy:
 * 1. window.__ENV__ (local js/env.js or build script)
 * 2. /api/config (Vercel serverless runtime config)
 */
async function getCredentials() {
  if (typeof window !== 'undefined' && window.__ENV__?.SUPABASE_URL && window.__ENV__?.SUPABASE_ANON_KEY) {
    return {
      url: window.__ENV__.SUPABASE_URL,
      anonKey: window.__ENV__.SUPABASE_ANON_KEY
    };
  }

  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      if (data.supabaseUrl && data.supabaseAnonKey) {
        return {
          url: data.supabaseUrl,
          anonKey: data.supabaseAnonKey
        };
      }
    }
  } catch (err) {
    console.warn('Could not fetch /api/config; falling back to default or cached config.', err);
  }

  // Fallback defaults for this specific portfolio's existing project
  return {
    url: 'https://ugjyjrsidfhqbylgrgbk.supabase.co',
    anonKey: 'sb_publishable_WsEusdbhKh_zshy6SveoXQ_YMI_EExT'
  };
}

/**
 * Initializes and returns the singleton Supabase client
 */
export async function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  if (!initPromise) {
    initPromise = (async () => {
      const { url, anonKey } = await getCredentials();
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage
        }
      });
      return supabaseInstance;
    })();
  }

  return initPromise;
}

/**
 * Calculates estimated reading time at ~220 words per minute
 */
export function calculateReadingTime(text) {
  if (!text || typeof text !== 'string') return '1 min read';
  // Strip markdown/html tags
  const cleanText = text.replace(/<[^>]*>/g, '').replace(/[#*_`~[\]()]/g, ' ');
  const words = cleanText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

/**
 * Generates an SEO and URL-safe slug from a title string
 */
export function generateSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // Remove non-word characters (except spaces and hyphens)
    .replace(/[\s_-]+/g, '-')     // Swap spaces and underscores for single hyphen
    .replace(/^-+|-+$/g, '');     // Trim leading/trailing hyphens
}

/**
 * Formats ISO date string to executive style: "September 20, 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Newsletter subscription handler with full validation and duplicate detection
 */
export async function subscribeNewsletter(rawEmail, source = 'blog') {
  if (!rawEmail || typeof rawEmail !== 'string') {
    return {
      success: false,
      status: 'invalid_email',
      message: 'Please enter a valid email address.'
    };
  }

  const email = rawEmail.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      status: 'invalid_email',
      message: 'Please enter a valid email address.'
    };
  }

  try {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email, source, status: 'active' }]);

    if (error) {
      // Postgres unique constraint violation is 23505
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        return {
          success: false,
          status: 'already_subscribed',
          message: "You're already subscribed."
        };
      }
      console.error('Newsletter subscription error:', error);
      return {
        success: false,
        status: 'error',
        message: 'Something went wrong. Please try again.'
      };
    }

    return {
      success: true,
      status: 'success',
      message: "You're subscribed. Thanks for reading."
    };
  } catch (err) {
    console.error('Newsletter exception:', err);
    return {
      success: false,
      status: 'error',
      message: 'Something went wrong. Please try again.'
    };
  }
}

/**
 * Admin Route Guard: Redirects to /admin if not authenticated
 */
export async function requireAdminAuth(redirectTo = '/admin') {
  const supabase = await getSupabase();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session || !session.user) {
    // Save attempted URL to redirect back after login
    const currentPath = window.location.pathname + window.location.search;
    if (!window.location.pathname.endsWith('/admin') && !window.location.pathname.endsWith('/admin/')) {
      sessionStorage.setItem('admin_redirect_after_login', currentPath);
    }
    window.location.href = redirectTo;
    return null;
  }
  
  return session;
}

/**
 * Uploads an image to Supabase Storage bucket 'blog-images'
 */
export async function uploadBlogImage(file, postId = 'general') {
  if (!file) throw new Error('No file provided for upload.');

  // Validate size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('Image exceeds 5MB size limit. Please upload a smaller image.');
  }

  // Validate mime type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, GIF, and SVG are supported.');
  }

  const supabase = await getSupabase();
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${postId}/${Date.now()}-${cleanName}`;

  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Supabase storage upload error:', error);
    throw new Error(error.message || 'Failed to upload image to storage.');
  }

  const { data: publicUrlData } = supabase.storage
    .from('blog-images')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

/**
 * Resume Management Configuration & Utilities
 */
export const RESUME_STORAGE_KEY = 'pavan_active_resume';
export const DEFAULT_RESUME = {
  id: 'default',
  file_name: 'Pavan_Darshan_Doddala_Resume.pdf',
  file_url: '/assets/Pavan_Darshan_Doddala_Resume.pdf',
  file_size: 245760,
  mime_type: 'application/pdf',
  is_active: true,
  uploaded_at: '2026-09-23T00:00:00.000Z',
  is_default: true
};

/**
 * Retrieves the currently active resume from Supabase with localStorage & default fallback
 */
export async function getActiveResume() {
  let localData = null;
  try {
    const raw = localStorage.getItem(RESUME_STORAGE_KEY);
    if (raw) localData = JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read resume from localStorage:', e);
  }

  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      const activeObj = {
        id: data.id,
        file_name: data.file_name,
        file_url: data.file_url,
        file_size: data.file_size,
        mime_type: data.mime_type,
        is_active: true,
        uploaded_at: data.created_at,
        is_default: false
      };
      try {
        localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(activeObj));
      } catch (err) {}
      return activeObj;
    }
  } catch (err) {
    // If table doesn't exist yet, graceful fallback
  }

  // If Supabase didn't have an active record or errored, check localStorage
  if (localData) {
    if (localData.is_active === false || localData.is_deleted === true) {
      return { is_deleted: true, is_active: false };
    }
    return localData;
  }

  // Default active resume
  return DEFAULT_RESUME;
}

/**
 * Uploads a new resume document (PDF or Word DOC/DOCX)
 */
export async function uploadResumeFile(file) {
  if (!file) throw new Error('No resume file selected.');

  const maxSize = 15 * 1024 * 1024; // 15MB
  if (file.size > maxSize) {
    throw new Error('Resume file exceeds 15MB size limit.');
  }

  const validExtensions = ['.pdf', '.doc', '.docx'];
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  const validMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/octet-stream'
  ];

  if (!validExtensions.includes(ext) && !validMimes.includes(file.type)) {
    throw new Error('Invalid file format. Please upload a PDF or Word document (.pdf, .docx, .doc).');
  }

  let uploadedUrl = null;
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `resumes/${Date.now()}-${cleanName}`;

  try {
    const supabase = await getSupabase();
    // Try uploading to 'resumes' bucket first, fallback to 'blog-images'
    let uploadRes = await supabase.storage.from('resumes').upload(path, file, { upsert: true });
    let bucketName = 'resumes';

    if (uploadRes.error) {
      uploadRes = await supabase.storage.from('blog-images').upload(path, file, { upsert: true });
      bucketName = 'blog-images';
    }

    if (!uploadRes.error && uploadRes.data?.path) {
      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(uploadRes.data.path);
      uploadedUrl = publicUrlData.publicUrl;
    }
  } catch (err) {
    console.warn('Storage upload fallback:', err);
  }

  // Fallback to data URL for immediate client persistence
  if (!uploadedUrl) {
    uploadedUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const resumeRecord = {
    file_name: file.name,
    file_url: uploadedUrl,
    file_size: file.size,
    mime_type: file.type || (ext === '.pdf' ? 'application/pdf' : 'application/msword'),
    is_active: true,
    uploaded_at: new Date().toISOString(),
    is_default: false
  };

  try {
    const supabase = await getSupabase();
    await supabase.from('resumes').update({ is_active: false }).eq('is_active', true);
    const { data } = await supabase.from('resumes').insert([resumeRecord]).select().single();
    if (data?.id) resumeRecord.id = data.id;
  } catch (err) {
    // If table not yet migrated, still saved in localStorage
  }

  try {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resumeRecord));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }

  return resumeRecord;
}

/**
 * Deletes / Deactivates the active resume
 */
export async function deleteActiveResume() {
  try {
    const supabase = await getSupabase();
    await supabase.from('resumes').update({ is_active: false }).eq('is_active', true);
  } catch (err) {
    console.warn('Supabase deleteActiveResume error:', err);
  }

  const deletedMeta = {
    is_active: false,
    is_deleted: true,
    deleted_at: new Date().toISOString()
  };

  try {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(deletedMeta));
  } catch (e) {}

  return { success: true };
}

