# stonebranches.life

A family history site for the Stone and Jollow branches. Built with [Astro](https://astro.build), deployed on [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/).

Content lives as plain Markdown + images in this repo. Every push to `main` triggers a fresh build and deploy — there's no CMS, no database, no admin login.

---

## Quick reference — the tasks you'll actually do

| I want to... | Go to |
|---|---|
| Add a new ancestor biography | [Add a new person](#add-a-new-person) |
| Edit an existing biography | [Edit a person](#edit-a-person) |
| Add a new family branch | [Add a new branch](#add-a-new-branch) |
| Edit the branch intro paragraph | [Edit a branch](#edit-a-branch) |
| Edit the About or Contact page | [Edit About / Contact](#edit-about--contact) |
| Redirect an old URL | [Redirects](#redirects) |
| Change fonts, colors, or type sizes | [Design tokens](#design-tokens) |
| Preview changes before pushing | [Local development](#local-development) |
| Push changes live | [Deploy](#deploy) |

---

## Folder structure

```
src/
  content/
    people/                One folder per ancestor. Folder name = URL slug.
      <slug>/
        index.md           Frontmatter (name, branches, dates, etc.) + body story.
        <image>.jpg        Photos referenced by the biography.
    families/              One markdown file per branch (Stones, Jollows, ...).
      stones.md
      jollows.md
    pages/                 About, Contact page copy.
  components/              Astro components (Nav, Footer).
  layouts/                 Base.astro — the shared page shell.
  pages/                   File-based routes. The file path IS the URL.
    index.astro                /                    Home
    families/index.astro       /families/           All branches
    families/[branch].astro    /families/stones/    One branch page
    people/[slug].astro        /people/charles-stone/   One biography
    about.astro                /about/
    contact.astro              /contact/
    photos.astro               /photos/             (placeholder for now)
    404.astro                  fallback
  styles/
    global.css             Design tokens, type scale, colors.
  content.config.ts        Zod schemas + FAMILY_BRANCHES list + BRANCH_SLUGS.
public/
  _redirects               Cloudflare 301s for legacy WordPress URLs.
wrangler.toml              Cloudflare Workers deploy config.
astro.config.mjs           Astro build config.
```

---

## Local development

Requires [Node.js](https://nodejs.org/) 18+.

```bash
npm install             # first time only
npm run dev             # live preview at http://localhost:4321
npm run build           # produce dist/ — same command Cloudflare runs
```

Save any file and the browser reloads automatically.

---

## Deploy

The site auto-deploys on every push to `main`. Cloudflare watches the GitHub repo.

```bash
git add -A
git commit -m "short description of what changed"
git push
```

Wait ~60 seconds, reload the site. If a build fails, the Cloudflare dashboard → Workers & Pages → your worker → Deployments shows the error log.

---

## Add a new person

1. Under `src/content/people/`, create a folder with the URL slug. Slugs are lowercase, dashes only.

   Example: `src/content/people/rebecca-french/`

2. Drop photos into the folder. Any filename works — `portrait.jpg`, `gravestone.jpg`.

3. Create `index.md`:

   ```yaml
   ---
   title: "Rebecca Jane French"
   branches: ["Stones"]              # or ["Stones", "Jollows"] if multiple
   born: "12 Apr 1784, St Winnow, Cornwall, England"
   died: "(date and place)"
   life_dates: "1784 – 18??"         # optional short form shown in listings
   summary: "Wife of Robert Stone; mother of seven children born at St Winnow."
   date: 2026-04-20                  # any date — just for sort order
   hero: ./portrait.jpg              # thumbnail + top image on page
   tags:
     - Robert Stone
     - St Winnow
     - Cornwall
   ---

   The body of the biography in plain Markdown. Use **bold**, *italic*, and
   [links](/people/robert-stone/) to other ancestors.

   ![Caption text](./portrait.jpg)

   ## A subheading inside the story

   More paragraphs…
   ```

4. Preview:

   ```bash
   npm run dev
   ```

   Visit `http://localhost:4321/people/rebecca-french/`.

5. Ship it:

   ```bash
   git add src/content/people/rebecca-french
   git commit -m "Add Rebecca Jane French biography"
   git push
   ```

### Frontmatter field reference

| Field | Required? | Notes |
|---|---|---|
| `title` | yes | The person's name, shown as the page headline. |
| `branches` | yes | List: one or more of the values in `FAMILY_BRANCHES` (currently `"Stones"`, `"Jollows"`). |
| `born` | no | Free text — date + place is fine. |
| `died` | no | Same. |
| `life_dates` | no | Short form shown in branch listings when present, e.g. `"1780 – 1862"`. |
| `summary` | no | 1-sentence description for the branch listing + card teasers. |
| `date` | no | Controls chronological sort order on branch pages and prev/next navigation. Use the year of birth if you have it. |
| `hero` | yes | Relative path to the portrait / headline image. |
| `tags` | no | List of names, places, dates — displayed at the bottom of the biography. |
| `wp_id` | no | The old WordPress post ID, kept for traceability. |

---

## Edit a person

Open `src/content/people/<slug>/index.md`, change anything, save, commit, push. That's the whole flow.

In VS Code:

1. `⌘P` → type `charles-stone` → open `index.md`
2. Edit
3. Source Control panel (left sidebar) → stage the file → commit message → push

---

## Add a new branch

Uncommon — usually you only do this when tracing a new surname into the tree.

1. In `src/content.config.ts`, add the branch to `FAMILY_BRANCHES` and `BRANCH_SLUGS`:

   ```ts
   export const FAMILY_BRANCHES = [
     'Stones',
     'Jollows',
     'Hancocks',            // <-- add here
   ] as const;

   export const BRANCH_SLUGS = {
     'Stones': 'stones',
     'Jollows': 'jollows',
     'Hancocks': 'hancocks',   // <-- and here
   };
   ```

2. Create `src/content/families/hancocks.md`:

   ```yaml
   ---
   title: Hancocks
   tagline: The Hancock branch
   ---

   A paragraph or two introducing the branch — where they came from, who
   the notable figures are, what ties them into the rest of the tree.
   ```

3. Tag new people with `branches: ["Hancocks"]` in their frontmatter.

---

## Edit a branch

Open `src/content/families/<slug>.md` and edit the body. The body is plain Markdown — headings, paragraphs, images all work. The `title` and `tagline` in frontmatter control what shows on the Families landing page.

To change which photo represents a branch on the Families landing page, add a `cover_person` field in that branch's frontmatter pointing at a person slug:

```yaml
---
title: Stones
tagline: The Stone branch
cover_person: charles-stone
---
```

If you don't set `cover_person`, the site falls back to the first person in the branch who has a hero image.

---

## Edit About / Contact

The About page (`/about/`) pulls body copy from `src/content/pages/about.md`. Contact works the same way (`pages/contact.md`). Edit those markdown files; the page templates (`src/pages/about.astro` / `contact.astro`) handle the layout and add the maintainer info.

---

## Redirects

Legacy WordPress URLs 301 to their new homes via `public/_redirects`. One redirect per line:

```
/old-path/    /new-path/    301
```

Add a line, push, done.

---

## Design tokens

Fonts, colors, type sizes all live at the top of `src/styles/global.css`:

```css
:root {
  --paper:     #f7f1e3;     /* cream background */
  --ink:       #2b231a;     /* warm near-black */
  --accent:    #8b3a2a;     /* deep brick red */
  --display:   "Fraunces", ...;   /* headings */
  --body:      "EB Garamond", ...; /* body copy */
  --fs-body:   clamp(...);   /* responsive body size */
  ...
}
```

Each `clamp(MIN, FLUID, MAX)` sets the smallest mobile size, the viewport-scaling rate, and the largest desktop size.

Changing fonts: update `--display` or `--body`, then update the Google Fonts link in `src/layouts/Base.astro` to actually load the font you chose.

---

## Troubleshooting

**Build fails after I added a person.** Usually frontmatter. Check: the `branches` values exactly match what's in `FAMILY_BRANCHES` (case-sensitive), your `hero` path starts with `./`, and every image path matches a file that exists in the folder.

**Image doesn't show.** The path in frontmatter starts with `./` and matches the filename exactly. Case-sensitive — `Portrait.jpg` and `portrait.jpg` are different.

**Cross-link to another person doesn't work.** Use the format `[Name](/people/slug/)` — absolute path starting with `/people/`, trailing slash included.

**Old WordPress URL 404s.** Add a line to `public/_redirects` and push.

---

## What's here, as shipped

Five ancestor biographies imported from the old WordPress site:

- **Robert Stone** (c. 1780 Plymouth — 1862 St Winnow)
- **William H. Stone** (son of Robert)
- **Charles Stone** (son of William H.)
- **Marry Ann Jollow** (wife of Charles)
- **Ivor Tudor Stone** (the longest biography — follows the family from South Wales coal mines to Scofield, Utah)

Two family branches: Stones and Jollows. About 36 images across the biographies. Redirects from every old URL.

Add more over time by following [Add a new person](#add-a-new-person).
