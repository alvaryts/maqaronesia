---
name: maqaronesia-post-covers
description: Generate or refresh the AI cover-image series for the Maqaronesia blog. Use when Codex needs to replace featured post images, create a new coherent batch of article covers, update the local slug-to-image manifest, or keep new blog posts visually aligned with the existing editorial series.
---

# Maqaronesia Post Covers

Use this workflow to create or refresh the featured-image series for the Maqaronesia blog.

## Workflow

1. Read the published posts from the live Supabase project with `node scripts/fetch-published-posts.mjs`.
2. Read `references/visual-series.md` before drafting prompts.
3. Inspect `src/lib/postImages.ts` to see which slugs already resolve to local files.
4. Generate one image per published post with the built-in `image_gen` tool.
5. Copy each newly generated image into `public/images/posts/<slug>.png` with `node scripts/copy-latest-generated-image.mjs <destination>`.
6. Optimize the batch to WebP with `python3 scripts/optimize-post-images.py public/images/posts --delete-source`.
7. Update `src/lib/postImages.ts` if a new slug needs to be mapped.
8. Verify the result with `npm run build`.
9. If the user wants visual QA, run the local server and inspect Home plus at least one post detail page.

## Project Paths

- Published posts fetcher: `scripts/fetch-published-posts.mjs`
- Latest generated image copier: `scripts/copy-latest-generated-image.mjs`
- Batch optimizer: `scripts/optimize-post-images.py`
- Local image folder: `public/images/posts/`
- Slug-to-image manifest: `src/lib/postImages.ts`
- Main surfaces that render featured post images:
  - `src/pages/Home.tsx`
  - `src/pages/PostDetail.tsx`
  - `src/pages/AdminPostEditor.tsx`

## Prompt Rules

- Keep one shared visual family across the whole batch.
- Use a panoramic editorial cover composition that fits the existing `16:10` card ratio.
- Derive each scene from the article title, excerpt, and tags.
- Prefer conceptual metaphors over literal stock-photo scenes.
- Never include text, letters, numbers, logos, watermarks, or brand marks inside the image.
- Avoid purple-dominant palettes, generic SaaS screenshots, and cartoon mascot aesthetics.

## Working Notes

- The repo deliberately overrides remote `image_url` values with local assets through `src/lib/postImages.ts`.
- Do not delete the original generated files under `~/.codex/generated_images`; copy them into the repo.
- If a post slug changes, update both the filename in `public/images/posts/` and the mapping in `src/lib/postImages.ts`.
- If there are more published posts than mapped local covers, add only the missing slugs instead of rewriting the entire manifest.
