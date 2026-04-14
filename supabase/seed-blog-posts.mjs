#!/usr/bin/env node
/**
 * Parses Blogger's feed.atom export and generates SQL to seed the
 * MaQAronesia Supabase blog (categories, tags, posts, post_tags).
 *
 * Usage:
 *   node supabase/seed-blog-posts.mjs > supabase/seed-blog-data.sql
 *
 * Then paste the output into Supabase SQL Editor and run it.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FEED_PATH = resolve(
  process.env.HOME,
  'Downloads/Takeout/Blogger/Blogs/maQAronesia.com/feed.atom'
);

const xml = readFileSync(FEED_PATH, 'utf-8');

// ── Helpers ──────────────────────────────────────────────────────────
function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;amp;/g, '&')
    .replace(/&amp;nbsp;/g, '\u00a0')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

function escapeSQL(s) {
  return s.replace(/'/g, "''");
}

function estimateReadTime(html) {
  const words = stripHtml(html).split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function extractFirstImage(html) {
  const match = html.match(/src=["']([^"']+)["']/);
  return match ? match[1] : null;
}

function extractExcerpt(html, maxLen = 200) {
  const text = stripHtml(html);
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen).replace(/\s+\S*$/, '') + '…';
}

// ── Parse entries ────────────────────────────────────────────────────
const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
const posts = [];
let m;

while ((m = entryRegex.exec(xml)) !== null) {
  const block = m[1];

  // Only LIVE POSTs
  if (!block.includes('<blogger:type>POST</blogger:type>')) continue;
  if (!block.includes('<blogger:status>LIVE</blogger:status>')) continue;

  const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() || '';
  const contentMatch = block.match(/<content[^>]*>([\s\S]*?)<\/content>/);
  const rawContent = contentMatch ? contentMatch[1] : '';
  const content = decodeEntities(rawContent);

  const published =
    block.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim() || '';

  // Blogger categories = tags
  const tagRegex = /term='([^']+)'/g;
  const tags = [];
  let tm;
  while ((tm = tagRegex.exec(block)) !== null) {
    tags.push(tm[1]);
  }

  // Blogger filename → slug
  const filename =
    block.match(/<blogger:filename>([\s\S]*?)<\/blogger:filename>/)?.[1]?.trim() || '';
  const slug = slugify(title) || slugify(filename);

  posts.push({ title, content, published, tags, slug, filename });
}

// ── Determine categories & tags ──────────────────────────────────────
// Assign a single main category per post based on dominant tags
const CATEGORY_MAP = {
  'ia': 'Inteligencia Artificial',
  'chatbot': 'Inteligencia Artificial',
  'soft skills': 'Desarrollo Profesional',
  'casos reales': 'Casos Reales',
  'salesforce': 'Herramientas',
};

function pickCategory(tags) {
  for (const tag of tags) {
    if (CATEGORY_MAP[tag]) return CATEGORY_MAP[tag];
  }
  return 'QA & Testing';
}

const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();
const allCategories = [
  ...new Set([
    'QA & Testing',
    'Inteligencia Artificial',
    'Casos Reales',
    'Desarrollo Profesional',
    'Herramientas',
  ]),
];

// ── Generate SQL ─────────────────────────────────────────────────────
const lines = [];
lines.push('-- ============================================================');
lines.push('-- MaQAronesia – Blog Posts Seed (from Blogger export)');
lines.push('-- Run this in Supabase SQL Editor');
lines.push('-- ============================================================');
lines.push('');
lines.push('BEGIN;');
lines.push('');

// 1. Categories
lines.push('-- ── Categories ──');
for (const cat of allCategories) {
  const s = slugify(cat);
  lines.push(
    `INSERT INTO categories (name, slug) VALUES ('${escapeSQL(cat)}', '${s}') ON CONFLICT (slug) DO NOTHING;`
  );
}
lines.push('');

// 2. Tags
lines.push('-- ── Tags ──');
for (const tag of allTags) {
  const s = slugify(tag);
  lines.push(
    `INSERT INTO tags (name, slug) VALUES ('${escapeSQL(tag)}', '${s}') ON CONFLICT (slug) DO NOTHING;`
  );
}
lines.push('');

// 3. Resolve author
lines.push('-- ── Resolve author (first staff profile) ──');
lines.push("DO $$");
lines.push("DECLARE");
lines.push("  v_author_id uuid;");
for (let i = 0; i < posts.length; i++) {
  lines.push(`  v_post_${i + 1}_id bigint;`);
}
lines.push("BEGIN");
lines.push(
  "  SELECT id INTO v_author_id FROM profiles WHERE is_staff = true LIMIT 1;"
);
lines.push("  IF v_author_id IS NULL THEN");
lines.push(
  "    RAISE EXCEPTION 'No staff profile found. Create a user and set is_staff = true first.';"
);
lines.push("  END IF;");
lines.push('');

// 4. Posts
lines.push('  -- ── Posts ──');
for (let i = 0; i < posts.length; i++) {
  const p = posts[i];
  const cat = pickCategory(p.tags);
  const catSlug = slugify(cat);
  const excerpt = extractExcerpt(p.content);
  const imageUrl = extractFirstImage(p.content);
  const readTime = estimateReadTime(p.content);

  lines.push(`  -- Post ${i + 1}: ${p.title}`);
  lines.push(`  INSERT INTO posts (title, slug, author_id, content, excerpt, category_id, status, image_url, read_time, published_at)`);
  lines.push(`  VALUES (`);
  lines.push(`    '${escapeSQL(p.title)}',`);
  lines.push(`    '${escapeSQL(p.slug)}',`);
  lines.push(`    v_author_id,`);
  lines.push(`    '${escapeSQL(p.content)}',`);
  lines.push(`    '${escapeSQL(excerpt)}',`);
  lines.push(`    (SELECT id FROM categories WHERE slug = '${catSlug}'),`);
  lines.push(`    'published',`);
  lines.push(`    ${imageUrl ? "'" + escapeSQL(imageUrl) + "'" : 'NULL'},`);
  lines.push(`    ${readTime},`);
  lines.push(`    '${p.published}'`);
  lines.push(`  )`);
  lines.push(`  ON CONFLICT (slug) DO NOTHING`);
  lines.push(`  RETURNING id INTO v_post_${i + 1}_id;`);
  lines.push('');
}

// 5. Post-Tags junction
lines.push('  -- ── Post↔Tag links ──');
for (let i = 0; i < posts.length; i++) {
  const p = posts[i];
  for (const tag of p.tags) {
    const tagSlug = slugify(tag);
    lines.push(
      `  INSERT INTO post_tags (post_id, tag_id) SELECT v_post_${i + 1}_id, id FROM tags WHERE slug = '${tagSlug}' AND v_post_${i + 1}_id IS NOT NULL ON CONFLICT DO NOTHING;`
    );
  }
  lines.push('');
}

lines.push("END $$;");
lines.push('');
lines.push('COMMIT;');
lines.push('');
lines.push("-- Done! Check: SELECT title, slug, published_at FROM posts ORDER BY published_at;");

console.log(lines.join('\n'));
