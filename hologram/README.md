# GK.OS — Holographic Portfolio

A JARVIS-inspired, 3D holographic portfolio for **Gokulakrishnan M** (AI Engineer).
Built separately from the classic site (`portfolio-gk`), which this project never touches.

## Experience

- **Boot sequence:** a reactor-ring loader with a system log; skip it with a click or any key.
- **Orbital navigation:** all 8 pages live on a ring around the 3D core.
  - On an open page, scrolling (wheel, trackpad, swipe, ↑/↓, Esc) pulls back into the ring with that page in front.
  - In the ring, scroll / drag / swipe horizontally (or ←/→) to spin it; the front page is larger and shows a rich
    preview, the side and back pages show their titles. Tap any page (or press Enter) to dive into it; Esc returns.
  - Rail, dial, console and number keys play the whole pull-back → spin → dive sequence.
  - Ring logic: `src/components/Orbit.tsx` (light preview cards, one rAF loop, transform/opacity only).
  - Gestures in the ring work inside a motion zone (the ring + 50% around it): mouse wheel, two-finger trackpad
    scroll (vertical or horizontal), mouse drag, one-finger swipe and two-finger touch swipe.
- **Living network world:** the centre ball is a GPU-animated plexus orb (drifting nodes, breathing ripple, signals
  travelling along links) inside gyroscope rings; floating network clouds (one gold) and a far network map fill the
  deep navy sky. See `src/three/plexus.ts`. No post-processing — glow comes from additive points/lines, so it stays
  fast on integrated GPUs.
- **Motion preference:** if the visitor's OS asks for reduced motion (on Windows: *Settings → Accessibility → Visual
  effects → Animation effects*), the site starts with short, gentle motion and offers a one-time "Enable full motion"
  prompt. The choice is remembered and can be toggled any time (HUD → Motion, or the console).
- **Navigation dial** (`M`): a radial holographic menu of all eight sectors.
- **Command console** (`Ctrl/⌘ + K` or `/`): search roles, projects, skills and actions ("RAG", "resume", "IIT"…).
- **Live telemetry:** callouts track the 3D core's screen position; the HUD shows camera coordinates.
- **Neural matrix:** each skill is wired to the roles and projects where it was used (hover or click to trace).
- Interface sounds are synthesised with WebAudio and off by default (speaker icon).
- Adapts quality on slow GPUs; falls back to 2D if WebGL is unavailable.
- Deep links open a page directly: `#/identity`, `#/origin`, `#/missions`, `#/arsenal`, `#/matrix`, `#/credentials`, `#/transmissions`, `#/uplink`.

## Sectors

| # | Sector | Content |
|---|--------|---------|
| 01 | Identity | Name, headline, CTA, telemetry callouts |
| 02 | Origin | Biomedical → AI story, education, "neural signature" artwork |
| 03 | Mission Log | Experience timeline (Gantt) and briefings |
| 04 | Arsenal | 3D project carousel and live GitHub feed |
| 05 | Neural Matrix | Skills cross-referenced to deployments |
| 06 | Credentials | Distinctions, leadership, certificate vault |
| 07 | Transmissions | Decrypting quotes, Medium blogs, designs |
| 08 | Uplink | Contact channels, resume, compose message |

## Editing content

All text lives in **`src/data/profile.ts`**. Media lives in `public/media/` (optimised WebP copies of the
original assets). To add AI-generated artwork, see **`IMAGE_PROMPTS.md`**.

## Develop & deploy

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # outputs dist/
```

The Vite `base` is relative (`./`), so the build works under any GitHub Pages path.
Create a **new** GitHub repository (for example `gk-holographic`), push this folder to it, and enable
**Settings → Pages → Source: GitHub Actions**. `.github/workflows/deploy.yml` builds and publishes on every
push to `main`, giving a separate URL such as `https://gokulakrishnanm99.github.io/gk-holographic/`.

After deploying, change `og:image` in `index.html` to the absolute URL of `media/generated/og-cover.jpg`
so link previews work.

Screenshot/testing aid: append `&capture` to a hash URL (e.g. `#/arsenal&capture`) to skip the boot and motion.
