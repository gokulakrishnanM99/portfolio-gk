# Internal Content Guide

This document explains how this portfolio is structured and exactly where to edit content.

## 1. App Structure

### Routing

Routes are defined in `App.tsx`:

- `/` -> `pages/Home.tsx`
- `/portfolio` -> `pages/Portfolio.tsx`
- `/resume` -> `pages/Resume.tsx`
- `/certificates` -> `pages/Certificates.tsx`
- `/works` -> `WorksLayout` in `pages/Works.tsx`
- `/works/blogs` -> `BlogsGallery`
- `/works/quotes` -> `QuotesGallery`
- `/works/designs` -> `DesignsGallery`

Navigation links are configured in `components/Navbar.tsx` (`navItems`).

## 2. Main Data Source Files

- `constants.ts`: Primary editable content for profile/resume/manual overrides.
- `utils/contentLoader.ts`: Auto-load logic from `assets/` folders.
- `types.ts`: Data shape definitions for each section.
- `services/githubService.ts`: GitHub portfolio feed.
- `pages/*.tsx`: Display structure/UI for each page.

### 2.1 Relevant Folder Map

- `components/`
- `pages/`
- `services/`
- `utils/`
- `assets/blogs/`
- `assets/certificates/`
- `assets/quotes/`
- `assets/design/` (current local folder)
- `assets/designs/` (expected by dynamic design loader)

### 2.2 Page-by-Page Structure

- `pages/Home.tsx`
- Hero section (intro, CTA, social icons)
- Technical Expertise section (from `SKILLS_DATA`)
- Social icons from `SOCIAL_LINKS`

- `pages/Portfolio.tsx`
- Featured projects grid (from `FEATURED_PROJECTS`)
- GitHub repos grid (from `fetchGitHubRepos()` in `services/githubService.ts`)
- Language filter tabs generated from fetched repo languages

- `pages/Resume.tsx`
- Experience timeline (from `EXPERIENCE_DATA`)
- Education cards (from `EDUCATION_DATA`)
- Key achievements block (hardcoded in this page file)
- Download button currently disabled

- `pages/Certificates.tsx`
- Loads all certs from `getCertificates()`
- Category filters generated dynamically from loaded data
- Card metadata uses `title`, `category`, `issuer`, `date`

- `pages/Works.tsx`
- `/works` root shows `WorksHub` cards
- `/works/blogs` shows `BlogsGallery` from `getBlogs()`
- `/works/quotes` shows `QuotesGallery` from `getQuotes()`
- `/works/designs` shows `DesignsGallery` from `getDesigns()`
- Shared internal sub-navigation comes from `WorksSubNav`

## 3. Content Update Guide

### 3.1 Blogs

#### Quick add (auto mode)

1. Add a cover image to `assets/blogs/`.
2. Name the file using your Medium slug style (example: `my-new-post.jpg`).
3. The blog appears in `/works/blogs` automatically.

How this works:

- Loader: `getBlogs()` in `utils/contentLoader.ts`
- URL generated as: `MEDIUM_BASE_URL + filename_without_extension`
- Base URL is in `constants.ts` (`MEDIUM_BASE_URL`)

#### Add custom metadata (recommended)

Edit `MANUAL_BLOGS` in `constants.ts`:

- `id` must match filename without extension.
- Set `title`, `subtitle`, `date`, `readTime`, `url`, `imageUrl`.

Example:

```ts
{
  id: 'my-new-post',
  title: 'My New Post',
  subtitle: 'Short preview text',
  date: 'Feb 20, 2026',
  readTime: '4 min read',
  url: 'https://medium.com/@your-id/my-new-post',
  imageUrl: myImportedImage
}
```

### 3.2 Certificates

#### Quick add (auto mode)

1. Place image files in `assets/certificates/<Category>/`.
2. Example: `assets/certificates/Course/aws-foundations.jpg`.
3. Item appears in `/certificates` automatically.

How this works:

- Loader: `getCertificates()` in `utils/contentLoader.ts`
- Category is derived from folder name (`<Category>`)
- Title is derived from filename

#### Add issuer/date/category override

Edit `MANUAL_CERTIFICATES` in `constants.ts`:

- `id` should match filename without extension if overriding a local file.
- Provide rich fields (`issuer`, `date`, cleaner `title`, category rename).

### 3.3 Quotes

#### Quick add (text quote)

1. Add a `.txt` file in `assets/quotes/`.
2. File content becomes quote text.
3. Filename becomes quote `id`.

#### Quick add (image quote)

1. Add an image (`.png/.jpg/.jpeg/.webp`) to `assets/quotes/`.
2. It appears as an image tile in `/works/quotes`.

How this works:

- Loader: `getQuotes()` in `utils/contentLoader.ts`
- Default author from `DEFAULT_QUOTE_AUTHOR` in `constants.ts`

#### Override text/author manually

Edit `MANUAL_QUOTES` in `constants.ts`:

- `type: 'text'` with `content` as quote text, or
- `type: 'image'` with `content` as image URL
- Set `author` explicitly per quote

### 3.4 Resume

#### Experience and Education

Edit `constants.ts`:

- `EXPERIENCE_DATA` -> work history on `/resume`
- `EDUCATION_DATA` -> education cards on `/resume`

#### Skills shown on Home page

Edit `SKILLS_DATA` in `constants.ts`.

#### Hardcoded achievements

Edit the "Key Achievements" list directly in `pages/Resume.tsx`.

#### Resume PDF download button

Current button is disabled in `pages/Resume.tsx` (`Download PDF`).
To enable real download:

1. Add resume PDF in assets/public path.
2. Replace disabled button with anchor/button linking to the file.

## 4. Works Section Details

`pages/Works.tsx` contains:

- `WorksHub` (entry cards for Blogs/Quotes/Designs)
- `WorksSubNav` (top sub-navigation)
- `BlogsGallery`
- `QuotesGallery`
- `DesignsGallery`

Customization examples:

- Change card text/icons/colors in `WorksHub`.
- Change layout/animations in each gallery component.
- Quote tile colors are from `COLOR_RED` and `COLOR_GREY` in `constants.ts`.

## 5. Portfolio and Profile Customization

### Featured projects cards

Edit `FEATURED_PROJECTS` in `constants.ts`.

### GitHub live repos

- Source: `fetchGitHubRepos()` in `services/githubService.ts`
- GitHub username constant: `USERNAME` in `services/githubService.ts`

### Social links (Home + Footer)

Edit `SOCIAL_LINKS` in `constants.ts`.

## 6. Theme and Visual System

Global theme setup is in `index.html`:

- Tailwind theme extension
- font family mappings
- CSS variables for light/dark/minimal accent modes
- minimal mode accent palettes

Navbar theme controls are in `components/Navbar.tsx`:

- dark/light toggle
- primary/minimal mode toggle
- minimal accent selection

## 7. File Naming and Override Rules

Important behavior in `utils/contentLoader.ts`:

- IDs are usually filename without extension.
- Manual override arrays in `constants.ts` are merged first, then dynamic items.
- If manual `id` does not match file-derived id, you get duplicate entries.

Recommended convention:

- Use lowercase kebab-case for filenames and matching manual IDs.
- Keep folder categories stable (example: `Course`, `Workshop`, `Achievements`).

## 8. Known Path Caveat (Designs)

`getDesigns()` currently scans:

- `/assets/designs/*/*.*`

Current repo folder is:

- `assets/design/Posters/...`

If you want dynamic designs auto-loading, use one of these:

1. Create/use `assets/designs/<Category>/...`, or
2. Update `getDesigns()` glob pattern to match `assets/design/*/*.*`.

Manual design entries in `MANUAL_DESIGNS` still work regardless.

## 9. Fast Edit Checklist

For most content updates:

1. Add asset file in correct `assets/` folder.
2. Add/adjust manual metadata in `constants.ts` (optional but recommended).
3. Verify ID/filename match.
4. Run app and check target page.

Useful commands:

```bash
npm run dev
npm run build
```
