# Pavan Darshan Doddala — Executive Finance Portfolio, Insights & CMS

A responsive personal portfolio, editorial finance blog, newsletter system, and private lightweight CMS for **Pavan Darshan Doddala** (Finance & Project Leadership Professional; Full-Time MBA Candidate at Santa Clara University’s Leavey School of Business).

Built with a premium black and champagne gold theme inspired by investment banking and elite management consulting, featuring deep obsidian and charcoal tones (`#0A0A0A` / `#111111`), refined champagne gold accents (`#C6A15B` / `#D8BC7A`), crisp typography (`Plus Jakarta Sans` & `Inter`), custom vector financial diagrams, responsive micro-interactions, and a secure Supabase backend.

---

## 🌟 Key Features

- **Executive Aesthetic**: Premium black + champagne gold theme with restrained accents, warm white typography, and subtle surface elevation.
- **Dynamic Impact Section**: 6 quantifiable achievement metrics with viewport count-up animations and interactive hover card expansion.
- **Experience Timeline**: Career progression with promotional badges and structured bullet points across banking and enterprise systems.
- **Selected Projects**: Custom inline SVG illustrations for POS-to-GL ledger workflows, automated payroll calculation engines, credit risk curves, and SME alternative-data underwriting architecture.
- **Applied Research**: 10 core research papers with micro-statistics, embedded PDF modal preview, and direct downloads.
- **Public Insights (Blog)**: Minimal, editorial, finance-focused publication system (`/blog` and `/blog/:slug`) with category filtering, live keyword search, dynamic reading times, author bio, and OpenGraph / JSON-LD Article structured data.
- **Interactive Newsletter**: Built-in email subscription with duplicate protection, validation, and real-time feedback at `/blog` and the footer of every article.
- **Private Lightweight CMS**: Secure admin portal (`/admin`) for drafting, publishing, editing, and deleting articles, uploading featured/inline images, and managing email subscribers with CSV export.
- **Supabase Backend**: Native database, Row Level Security (RLS), GoTrue Authentication, and `blog-images` Storage.
- **Homepage Integration**: Dynamic "Recent Thinking" preview on the homepage that automatically presents 2–3 latest published articles.

---

## 📁 Project Structure

```
├── index.html            # Portfolio homepage with dynamic Insights section
├── vercel.json           # Vercel clean URL rewrites & noindex headers
├── package.json          # Project metadata & build scripts
├── .env.example          # Environment variables template
├── blog/
│   ├── index.html        # Public Insights listing & newsletter subscription
│   └── post.html         # Dynamic article reader with SEO & structured data
├── admin/
│   ├── index.html        # Private administrator login portal
│   ├── posts.html        # Posts management dashboard & KPI cards
│   ├── post-edit.html    # Article creator & Markdown studio with live preview
│   └── subscribers.html  # Newsletter audience table & CSV exporter
├── api/
│   └── config.js         # Vercel serverless function to serve public config
├── css/
│   ├── variables.css     # Design tokens & color system
│   ├── base.css          # Typography & layout containers
│   ├── components.css    # Cards, timeline, hero frame, forms, modals
│   ├── responsive.css    # Breakpoints & mobile drawer
│   ├── blog.css          # Editorial article styles, grid, newsletter card
│   └── admin.css         # CMS dashboard, editor studio, tables, badges
├── js/
│   ├── supabase-client.js # Supabase client, reading time, auth guard, storage
│   ├── blog.js           # Markdown parser, post loader, search/filter, SEO
│   ├── admin.js          # CMS auth, post CRUD, storage uploads, CSV export
│   ├── animations.js     # GSAP & ScrollTrigger executive animation system
│   ├── interactions.js   # Research expander & contact form handling
│   └── main.js           # Scrollspy, sticky navigation & mobile menu
├── supabase/
│   └── schema.sql        # Complete idempotent database & storage setup
└── assets/
    └── favicon.svg       # Custom geometric monogram favicon
```

---

## 🚀 Getting Started Locally

1. Start a local server from the project directory:

```bash
python3 -m http.server 8000
```
Or:
```bash
npm run dev
```

2. Open your browser:
- **Homepage**: `http://localhost:8000`
- **Insights (Blog)**: `http://localhost:8000/blog/`
- **CMS Admin**: `http://localhost:8000/admin/`

---

## 🛠️ Supabase & Vercel Setup (Step-by-Step)

Follow these simple steps to connect your existing Supabase project (`ugjyjrsidfhqbylgrgbk.supabase.co`) with your Vercel deployment:

### Step 1: Run the Database Setup in Supabase
1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/ugjyjrsidfhqbylgrgbk).
2. In the left navigation sidebar, click on **SQL Editor** (`>_`).
3. Click **New Query** (top left).
4. Open the file `supabase/schema.sql` from this repository, select all the text, and copy it.
5. Paste it into the Supabase SQL editor and click the green **Run** button.
   > **What this does**: Automatically creates the `posts` table, `subscribers` table, performance indexes, Row Level Security policies, the `blog-images` storage bucket, and two starter published articles.

### Step 2: Create Your Admin Account in Supabase
1. In the Supabase Dashboard left sidebar, click **Authentication** (icon with two people / lock).
2. Click on **Users**.
3. Click the green **Add User** button &rarr; select **Create user**.
4. Enter your administrator email and a secure password.
5. Toggle **Auto Confirm User?** to **ON**.
6. Click **Create User**.
   > This is your credential to log into `/admin`.

### Step 3: Add Environment Variables in Vercel
1. Open your [Vercel Dashboard](https://vercel.com/) and select **pavan-darshan-portfolio**.
2. Go to **Settings** &rarr; **Environment Variables**.
3. Add the following variables:
   - **Key**: `SUPABASE_URL`
     - **Value**: `https://ugjyjrsidfhqbylgrgbk.supabase.co`
   - **Key**: `SUPABASE_ANON_KEY`
     - **Value**: `sb_publishable_WsEusdbhKh_zshy6SveoXQ_YMI_EExT`
4. Click **Save** and trigger a redeploy (or push to GitHub).

---

## ✍️ Publishing Workflow

1. Navigate to `/admin` and log in with your Supabase administrator account.
2. You will be directed to `/admin/posts` showing your dashboard KPI metrics (Published, Drafts, Subscribers).
3. Click **+ New Post**.
4. Enter your **Title** (the URL slug generates automatically, and can be edited).
5. Choose or type a **Category** (`Finance`, `Strategy`, `Markets`, `Banking`, etc.).
6. Write a short **Excerpt**.
7. Click the upload area to select a **Featured Image** (it uploads directly to Supabase Storage `blog-images`).
8. Write your article in Markdown using the toolbar (Bold, Italic, Headings, Quotes, Lists, Code, or insert inline images). Click the **Preview** tab anytime to see the live formatted article.
9. Optional: Expand **Search Engine Optimization (SEO)** to customize the Google search preview title and description.
10. Click **Save Draft** to store work in progress, or click **Publish** to immediately push the article live.
11. Published articles instantly appear at `/blog` and the homepage **Recent Thinking** section updates automatically.

---

## 📬 Newsletter Workflow

1. Public visitors can enter their email into the **Stay Updated** section on `/blog` or at the bottom of any article.
2. The system checks email validity, prevents duplicate entries, and saves the subscriber to Supabase.
3. In the CMS at `/admin/subscribers`, you can:
   - View your audience count and registration dates.
   - Search subscribers by email.
   - Deactivate or reactivate subscribers.
   - Click **Export CSV** to download an audience spreadsheet (`email,subscribed_at,status`).

---

## 🔒 Security Architecture & RLS

- **Row Level Security (RLS)** is strictly enforced on all database tables and storage:
  - **Public Visitors**: Can only read posts where `status = 'published'`, and can only insert valid newsletter emails. Visitors cannot read drafts, modify content, or view subscriber emails.
  - **Authenticated Admin**: Full control over posts, drafts, subscriber records, and storage uploads.
- **Admin Pages**: Guarded by Supabase Auth (`getSession()`). Unauthenticated requests are redirected to `/admin`.
- **Search Engines**: All `/admin/*` pages are configured with `<meta name="robots" content="noindex, nofollow">` and Vercel `X-Robots-Tag` headers so they never appear in search engines.

---

## 📄 License & Copyright

© 2026 Pavan Darshan Doddala. All rights reserved.
