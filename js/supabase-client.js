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
