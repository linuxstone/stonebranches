import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Canonical list of family branches. Add to this list when you start tracing a
// new surname. The order here controls the order on the Families landing page.
export const FAMILY_BRANCHES = [
  'Stones',
  'Jollows',
] as const;

export const BRANCH_SLUGS: Record<(typeof FAMILY_BRANCHES)[number], string> = {
  'Stones': 'stones',
  'Jollows': 'jollows',
};

// People — one folder per ancestor, with an index.md and any image files.
const people = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/people' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),           // "Robert Stone"
      // Branches they belong to. A person can belong to multiple (e.g. by marriage).
      branches: z.array(z.enum(FAMILY_BRANCHES)).default([]),
      born: z.string().optional(),       // free text: "c. 1780, Plymouth, Devon, England"
      died: z.string().optional(),       // free text: "24 Oct 1862, St Winnow, Cornwall"
      life_dates: z.string().optional(), // optional short form: "1780 – 1862"
      // Short summary sentence, shown on branch listing pages.
      summary: z.string().optional(),
      hero: image().optional(),          // primary portrait / headline image
      // Loose genealogy tags (names, places, dates) — kept from WordPress import
      // for search and discovery; displayed as a small tag cluster on the page.
      tags: z.array(z.string()).optional(),
      // Stable publication date — used for sort order and "latest stories".
      date: z.coerce.date().optional(),
      // Old WordPress post ID, for traceability.
      wp_id: z.number().int().optional(),
    }),
});

// Family branches — one markdown file per branch. Body is the branch landing
// page prose. "Stones" gets the old "Stone Heritage" content, per James's call.
const families = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/families' }),
  schema: ({ image }) =>
    z.object({
      title: z.enum(FAMILY_BRANCHES),
      tagline: z.string().optional(),
      // slug reference to a person whose hero image represents this branch
      cover_person: z.string().optional(),
      hero: image().optional(),
    }),
});

// Standalone pages (about, contact, etc.) — simple text content.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
  }),
});

export const collections = { people, families, pages };
