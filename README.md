# Portfolio Website

This is a personal portfolio website built using **React** and **Vite**.

## Live Demo

Access the Portfolio website in https://gokulakrishnanm99.github.io/portfolio-gk/

## Holographic (GK.OS) version

A new JARVIS-style portfolio lives in the same repo and URL, behind a flag:

- **Classic site:** https://gokulakrishnanm99.github.io/portfolio-gk/
- **Holographic site:** https://gokulakrishnanm99.github.io/portfolio-gk/?hologram=true (deep links: `?hologram=true#/arsenal`)

Its code is in `hologram/` (see `hologram/README.md`), its page entry is `hologram.html`, and its images are in `public/media/`.
`index.html` has a small script at the top of `<head>` that forwards the flag. When you're ready to swap, remove that
script, make `hologram.html` the main page, and move the classic site behind its own flag.

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
