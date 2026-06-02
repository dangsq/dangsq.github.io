# Dangs — Personal Website

Personal portfolio website with an interactive 3D tetrahedron interface built with Three.js.

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Three.js** — 3D rendering
- **Vite** — Build tool

## Development

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (port 3000)
npm run build      # Build for production
```

## Deployment

```bash
./deploy.sh        # Build + push to main branch → GitHub Pages
```

## Structure

- `src/App.tsx` — Main component with 3D tetrahedron logic & content
- `src/App.css` — All styles
- `src/main.tsx` — React entry point
- `docs` branch — Source code (develop here)
- `main` branch — Built output (auto-deployed to GitHub Pages)
