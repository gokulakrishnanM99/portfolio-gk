# Portfolio Website

This is a personal portfolio website built using **React** and **Vite**.

## Live Demo

Access the Portfolio website in https://gokulakrishnanm99.github.io/portfolio-gk/

## Sites and addresses

The holographic portfolio (GK.OS) is the main site; the classic portfolio stays available behind a flag.

- **Main site:** https://gokulakrishnanm99.github.io/portfolio-gk/ (opens `/portfolio-gk/identity`). Pages: `/identity`, `/missions`, `/arsenal`, `/credentials`, `/transmissions`; sections: `/origin`, `/uplink`, `/matrix`. Any unknown path goes to `/identity`.
- **Classic site:** https://gokulakrishnanm99.github.io/portfolio-gk/?classic=true (e.g. `/portfolio-gk/resume?classic=true`). No `#` in addresses.
- Old links still work: `?hologram=true#/arsenal` opens `/arsenal`, and classic `#/resume` links open the classic Resume page.

How it works: `index.html` is the holographic site (code in `hologram/`, see `hologram/README.md`; images in `public/media/`).
The build also copies it to `404.html`, because GitHub Pages has no server-side rewrites: a path like `/portfolio-gk/missions`
is answered by `404.html`, which reads the path and opens that page. A script at the top of `index.html` sends `?classic=true`
visits to `classic.html` (the classic site), which restores the clean address before React Router starts.

## Project Structure

- `src/`: Contains the application source code, including components, hooks, and styles.
- `public/`: Static assets like images and icons that are served directly.
- `vite.config.js`: Configuration file for the Vite build tool.
- `INTERNAL_CONTENT_GUIDE.md`: Internal maintenance guide for editing blogs, certificates, quotes, resume, and page structure.

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed on your machine.

### Installation & Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```
