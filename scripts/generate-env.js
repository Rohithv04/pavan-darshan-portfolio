#!/usr/bin/env node
/**
 * scripts/generate-env.js
 * Generates js/env.js from process.env (Vercel Build step).
 * If SUPABASE_URL and SUPABASE_ANON_KEY are present in the environment,
 * it writes them into js/env.js for zero-latency client bootstrap.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (supabaseUrl && supabaseAnonKey) {
  const targetPath = path.join(__dirname, '..', 'js', 'env.js');
  const content = `// Generated at build time - DO NOT COMMIT\nwindow.__ENV__ = {\n  SUPABASE_URL: ${JSON.stringify(supabaseUrl)},\n  SUPABASE_ANON_KEY: ${JSON.stringify(supabaseAnonKey)}\n};\n`;
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log('Successfully generated js/env.js from environment variables.');
} else {
  console.log('No build-time environment variables found; frontend will use /api/config or existing js/env.js.');
}
