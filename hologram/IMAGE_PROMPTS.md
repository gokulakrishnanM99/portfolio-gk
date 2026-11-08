# Image prompts — GK.OS holographic portfolio

The site runs fine without these images. Each project card currently shows a clean
typographic face, and swaps to the image automatically once the file exists.

## How to add a generated image

1. Generate the image with the prompt below (any capable image model).
2. Save it (PNG or JPG is fine) into `public/media/generated/` using the **exact base name** listed.
3. Run `python hologram/scripts/optimize_images.py` — it converts to the `.webp` sizes the site expects.
4. Reload. No code changes needed.

## Shared style (append to every prompt)

> Style: holographic HUD visualisation in the style of a sci-fi heads-up display, rendered as
> glowing light on a near-black deep-navy background (#02060C). Primary colour luminous cyan
> (#5FD4FF) with thin precise line-work, subtle amber/gold (#FFB547) accents used sparingly
> (under 10% of the image). Volumetric glow, faint scanlines, fine particle dust, shallow depth
> of field. Clean, premium, uncluttered composition with generous dark negative space.
> **No text, no letters, no numbers, no logos, no watermarks, no UI chrome, no people's faces.**
> Photorealistic lighting, 8k detail, sharp focus on the subject.

Negative prompt (if supported): `text, typography, letters, watermark, signature, logo, frame, border, cartoon, flat vector, clipart, low detail, blurry, oversaturated, purple, pink, cluttered`

---

## 1. Story → Comic agent  · `project-comic-agent`
- **Used in:** Arsenal (04) → card P-02
- **Size / ratio:** 1500 × 1000 (3:2), subject centred

> A floating holographic comic-book page assembling itself in mid-air: six empty comic panels
> made of glowing cyan wireframe borders, arranged in a 2×3 grid, slightly tilted in 3D
> perspective. Thin luminous data-threads flow from a small hovering glowing orb on the left
> (representing an AI agent) into each panel, and inside the panels faint silhouettes of
> abstract scenes (a city skyline, a figure walking, a sunrise) are materialising as particle
> clouds. One panel is highlighted with an amber outline as if "currently rendering".
> + shared style

## 2. Liver tumour segmentation  · `project-liver-segmentation`
- **Used in:** Arsenal (04) → card P-04
- **Size / ratio:** 1500 × 1000 (3:2)

> A holographic axial CT-scan slice of a human abdomen floating in space, rendered as a
> translucent cyan medical hologram with fine scan-line texture. The liver region is outlined
> with a crisp glowing cyan segmentation contour, and a small tumour region inside it is filled
> with a soft amber highlight mask. Behind it, a stack of additional faint CT slices recedes in
> depth forming a 3D volume. A thin U-shaped network diagram (encoder–decoder) floats faintly in
> the background as delicate glowing lines.
> + shared style

## 3. Deep-learning classification  · `project-dl-classification`
- **Used in:** Arsenal (04) → card P-05
- **Size / ratio:** 1500 × 1000 (3:2)

> A deep neural network visualised as a sequence of translucent holographic layers receding
> diagonally into depth: the first layer is a grid of small glowing image tiles (abstract
> handwritten-digit-like shapes, not real digits), followed by progressively smaller stacked
> convolution feature-map planes in cyan, connected by fine luminous lines, ending in a column
> of ten glowing nodes where exactly one node burns bright amber (the predicted class).
> + shared style

## 4. Hyperparameter sensitivity  · `project-ml-tuning`
- **Used in:** Arsenal (04) → card P-06
- **Size / ratio:** 1500 × 1000 (3:2)

> A glowing cyan 3D wireframe surface plot floating above a dark holographic grid floor, shaped
> like a smooth mountainous loss landscape with valleys and ridges. A small bright amber marker
> sits in the deepest valley (the optimal configuration) with a thin dotted trail of earlier
> search points leading to it. To one side, a small inset of a thermal image segmented into
> three colour clusters (cyan, teal, amber), shown as a floating translucent panel.
> + shared style

## 5. Social share card  · `og-cover`
- **Used in:** link previews (LinkedIn, WhatsApp, X) via `og:image`
- **Size / ratio:** 1200 × 630 (1.91:1). Keep the **left 55% dark and empty** — the name can be
  added later in any editor if you want text on it.
- **Note:** this one stays a JPG. The script writes `og-cover.jpg`.

> Wide cinematic shot of a holographic projection table in a dark room: from a circular glowing
> projector disc on the floor, a cone of faint cyan light rises and forms a floating gyroscopic
> core — several concentric tilted HUD rings with tick marks and dashed segments surrounding a
> small luminous lattice sphere made of connected points. One thin amber arc ring orbits it.
> A faint perspective grid floor fades into darkness, and thin vertical data-light pillars stand
> in the far background. The core sits in the right third of the frame.
> + shared style

---

## Optional — restyle existing project art

These already have images; regenerate only if you want them to match the hologram look.

### Cubiverse · overwrite `public/media/projects/cubiverse.webp`
- 1500 × 1000 (3:2). Save as `project-cubiverse` in `generated/`, run the script, then copy the
  resulting `project-cubiverse.webp` over `public/media/projects/cubiverse.webp` (and `.thumb.webp`).

> A 3×3 puzzle cube floating in deep space, constructed entirely from glowing cyan holographic
> wireframe edges and translucent faces, slightly exploded so the individual cubelets drift
> apart with small gaps, rotating mid-twist. A nebula of fine cyan and faint amber particles
> surrounds it. One layer of cubelets glows amber as if being rotated.
> + shared style
