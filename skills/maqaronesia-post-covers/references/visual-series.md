# Visual Series

## Shared Art Direction

Use this base prompt language for every cover:

```text
Use case: stylized-concept
Asset type: website editorial article cover, 16:10 panoramic hero image
Style/medium: premium editorial 3D illustration, semi-realistic, subtle paper grain, slightly cinematic, part of a cohesive series for the same publication
Lighting/mood: thoughtful, technical, composed
Color palette: charcoal, warm ivory, steel blue, slate gray, with restrained burnt-orange accents matching the site's brand
Materials/textures: matte surfaces, translucent glass panels, thin luminous lines, fine grain
Constraints: no text, no letters, no numbers unless the user explicitly wants them, no logos, no watermark, no celebrity likeness, no photoreal human faces
Avoid: generic stock-photo look, clutter, neon overload, purple-dominant palette, cartoon style
```

## Scene Heuristics

- QA truth: reveal hidden fragility inside a larger delivery machine.
- Prompt engineering: use a central prompt artifact with multiple elegant failure signals.
- Complex flows: turn an overwhelming route map into one illuminated, navigable path.
- NASA quality lesson: show trajectory drift caused by subtle verification failure.
- Chatbot testing: express branching dialogue, ambiguity, and safety boundaries.
- UAT: frame the image as a threshold between controlled testing and live operations.
- Soft skills and AI: show orchestration, bridge-building, and whole-system thinking.
- Salesforce QA: show a polished enterprise system with fragile dependencies under inspection.
- MrBeast Burger quality lesson: contrast glossy promise with strained operational reality.

## Output Convention

- Copy each generated source image to `public/images/posts/<slug>.png`.
- Optimize the batch into `public/images/posts/<slug>.webp`.
- Keep filenames exactly aligned with the published post slug when possible.
- Preserve the current wide aspect ratio used by the generated series.
