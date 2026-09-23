-- ============================================================================
-- PAVAN DARSHAN PORTFOLIO — BLOG, CMS & NEWSLETTER DATABASE SCHEMA
-- Target Project: ugjyjrsidfhqbylgrgbk.supabase.co
-- ============================================================================

-- 1. Enable UUID Extension (standard in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. POSTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'Finance',
    featured_image_url TEXT,
    featured_image_alt TEXT,
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status_published ON public.posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- Trigger to auto-update 'updated_at' column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_posts_updated_at ON public.posts;
CREATE TRIGGER set_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();


-- ============================================================================
-- 3. SUBSCRIBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    source TEXT DEFAULT 'blog',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    unsubscribed_at TIMESTAMPTZ
);

-- Index for searching and unique lookup
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON public.subscribers(created_at DESC);


-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if re-running
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated admin has full access to posts" ON public.posts;
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.subscribers;
DROP POLICY IF EXISTS "Authenticated admin has full access to subscribers" ON public.subscribers;

-- POSTS POLICIES:
-- 1. Public can read ONLY published posts
CREATE POLICY "Public can view published posts"
    ON public.posts
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- 2. Authenticated Administrator can do EVERYTHING (select drafts, insert, update, delete)
CREATE POLICY "Authenticated admin has full access to posts"
    ON public.posts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- SUBSCRIBERS POLICIES:
-- 1. Anyone (public anon or logged-in) can INSERT their email to subscribe
CREATE POLICY "Public can subscribe to newsletter"
    ON public.subscribers
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        email IS NOT NULL AND 
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    );

-- 2. ONLY authenticated Administrator can view, edit, or delete subscribers
CREATE POLICY "Authenticated admin has full access to subscribers"
    ON public.subscribers
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- ============================================================================
-- 5. STORAGE BUCKET: blog-images
-- ============================================================================

-- Insert bucket if not already present
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'blog-images',
    'blog-images',
    true,
    5242880, -- 5 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admin can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admin can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admin can delete blog images" ON storage.objects;

-- 1. Public read access to blog-images
CREATE POLICY "Public can view blog images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'blog-images');

-- 2. Authenticated Admin can upload
CREATE POLICY "Authenticated admin can upload blog images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'blog-images');

-- 3. Authenticated Admin can update
CREATE POLICY "Authenticated admin can update blog images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'blog-images')
    WITH CHECK (bucket_id = 'blog-images');

-- 4. Authenticated Admin can delete
CREATE POLICY "Authenticated admin can delete blog images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'blog-images');


-- ============================================================================
-- 6. OPTIONAL INITIAL SEED POSTS (Published Editorial Notes)
-- ============================================================================
INSERT INTO public.posts (
    title,
    slug,
    excerpt,
    content,
    category,
    status,
    published_at,
    seo_title,
    seo_description
)
VALUES
(
    'Understanding Capital Allocation: Discipline Over Velocity',
    'understanding-capital-allocation-discipline-over-velocity',
    'Why the most critical strategic lever in corporate finance is not the pace of capital deployment, but the hurdle rate discipline and terminal value rigor.',
    '## The Fallacy of Deployment Speed

In corporate finance and private equity alike, momentum is often mistakenly conflated with progress. Teams celebrate the closing of capital rounds or rapid asset deployments, yet the ultimate determinant of enterprise value creation remains stubbornly grounded in capital allocation discipline.

### 1. The Hurdle Rate Imperative

A hurdle rate should never be a theoretical hurdle. In capital-intensive project environments, inflation risks, cost-of-capital fluctuations, and operational delays compress projected internal rates of return (IRR). 

When evaluating new ventures, three rules must govern allocation:

- **Scenario-Weighted Sensitivity**: Stress-test downside margin compression by at least 300 basis points.
- **Terminal Value Prudence**: Never assume perpetual expansion multiples higher than the cost of capital.
- **Opportunity Cost Benchmarking**: Capital committed to a mediocre project is capital denied to strategic flexibility.

> "Capital allocation is the CEO''s and CFO''s single most consequential responsibility. Operations produce cash; allocation determines whether that cash compounds or evaporates."

### 2. Strategic Execution Framework

Disciplined leadership requires establishing automated checkpoints throughout project lifecycles. Rather than releasing full capex commitments up front, phase-gate milestones preserve optionality and protect enterprise balance sheets from unexpected macro shocks.',
    'Finance',
    'published',
    timezone('utc'::text, now()),
    'Understanding Capital Allocation: Discipline Over Velocity | Pavan Doddala',
    'Why the most critical strategic lever in corporate finance is not the pace of capital deployment, but the hurdle rate discipline and terminal value rigor.'
),
(
    'Credit Risk and Alternative Data in SME Underwriting',
    'credit-risk-and-alternative-data-in-sme-underwriting',
    'How real-time ledger access and transactional velocity indices are transforming commercial banking underwriting beyond static balance sheet ratios.',
    '## Moving Beyond Static Financial Statements

Traditional commercial underwriting models rely heavily on annualized balance sheets and trailing income statements. In volatile macroeconomic cycles, however, an audited statement is often a post-mortem rather than a real-time health indicator.

### Transactional Velocity as Leading Indicator

By synthesizing real-time point-of-sale (POS) transactional data, enterprise resource planning (ERP) ledger integration, and bank reconciliation feeds, credit committees can construct continuous liquidity monitors.

Key advantages include:

1. **Intra-Month Cash Volatility Tracking**: Spotting working capital stress weeks before standard monthly covenant reports.
2. **Receivables Aging Friction**: Real-time detection of invoice dispute clusters across Tier-1 enterprise buyers.
3. **Adaptive Credit Limits**: Dynamic facilities that expand during seasonal inventory builds and contract as receivables convert to cash.

The modern credit analyst must combine quantitative statistical modeling with qualitative domain knowledge of supply chain logistics.',
    'Banking',
    'published',
    timezone('utc'::text, now() - interval '3 days'),
    'Credit Risk and Alternative Data in SME Underwriting | Pavan Doddala',
    'How real-time ledger access and transactional velocity indices are transforming commercial banking underwriting beyond static balance sheet ratios.'
)
ON CONFLICT (slug) DO NOTHING;
