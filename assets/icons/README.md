# assets/icons

Qompres keeps its UI icons (upload, settings, download, shield, etc.) as
**inline `<svg>` markup directly inside `index.html`**, not as separate
files in this folder.

Why inline instead of separate icon files:

- **No extra HTTP requests.** Every icon renders on first paint with zero
  additional network round-trips.
- **`currentColor` theming.** Inline icons inherit `color` from their
  parent, so the same icon automatically re-colors for hover states and
  dark mode without duplicate files per color.
- **No sprite/build step.** The project intentionally has zero build
  tooling — inline SVG keeps it that way.

This folder is kept in the repository structure so any **brand-level**
icon assets (e.g. app store icons, social share images, press kit icons)
have a clear home if the project grows. It is currently empty aside from
this file.
