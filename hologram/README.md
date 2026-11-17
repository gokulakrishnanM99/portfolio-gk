# GK.OS — Holographic Portfolio

A JARVIS-inspired, 3D holographic portfolio for **Gokulakrishnan M** (AI Engineer).
Built separately from the classic site (`portfolio-gk`), which this project never touches.

## Experience

- **Boot sequence:** a reactor-ring loader with a system log; skip it with a click or any key.
- **Five scrolling pages:** Profile (+ About, Contact), Experience, Projects (+ Neural matrix), Credentials and
  Transmissions. Each page scrolls vertically; the 3D camera re-frames itself for each section as you scroll, and every
  page ends with the contact channels and an end-of-page marker.
- **End-of-page pause:** the scroll that reaches the end stops there; the next scroll is a pause (the marker lights up
  and a hint appears); the one after that orbits to the next page. Scrolling up past the top works the same way back to
  the previous page (opening at its end). After the last page the pause leads to the orbit overview. Staying 40 s at
  the end of a page shows a reminder. Logic: `usePageInput` in `src/lib/nav.tsx`.
- **Orbital navigation:** all pages live on a ring around the 3D core (Esc or the HUD "Orbit view" button).
  - In the ring, scroll / drag / swipe horizontally (or ←/→) to spin it; the front page is larger and shows a rich
    preview, the side and back pages show their titles. Tap any page (or press Enter) to dive into it; Esc returns.
  - Rail, dial, console, number keys and the end-of-page scroll play the whole pull-back → spin → dive sequence.
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
- **Navigation dial** (`M`): a radial holographic menu of all five pages.
- **Command console** (`Ctrl/⌘ + K` or `/`): search roles, projects, skills and actions ("RAG", "resume", "IIT"…).
- **Live telemetry:** callouts track the 3D core's screen position; the HUD shows camera coordinates.
- **Neural matrix:** each skill is wired to the roles and projects where it was used (hover or click to trace).
- Interface sounds are synthesised with WebAudio and off by default (speaker icon).
- Adapts quality on slow GPUs; falls back to 2D if WebGL is unavailable.
- Deep links open a page directly: `#/identity`, `#/missions`, `#/arsenal`, `#/credentials`, `#/transmissions`;
  the section links `#/origin`, `#/uplink` and `#/matrix` open their page scrolled to that section.

## Pages

| # | Page | Sections |
|---|------|----------|
| 01 | Profile | Identity (name, headline, telemetry callouts) → Origin (biomedical → AI story, education) → Uplink (contact) |
| 02 | Experience | Every role as a full briefing; the timeline stays pinned and follows the role you are reading |
| 03 | Projects | Arsenal (3D project carousel, live GitHub feed) → Neural matrix (skills cross-referenced) |
| 04 | Credentials | Distinctions, leadership, certificate vault |
| 05 | Transmissions | Decrypting quotes, Medium blogs, designs |

Pages and their sections are defined by `SECTORS` and `BLOCKS` in `src/data/profile.ts`.

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
