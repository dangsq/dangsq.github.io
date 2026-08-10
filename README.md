# Dangs — Personal Website

A maximalist scrapbook / zine personal site — papers, projects and doodles all taped onto a living sticker-bomb background.

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool
- **Framer Motion** — Scroll reveals & hover animations
- Hand-drawn fonts (Caveat, Permanent Marker, Special Elite, Gochi Hand) + a custom kawaii SVG icon library

## Development

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (port 3000)
npm run build      # Build for production
```

## Deployment

```bash
npm run build      # Build into dist/
# then push dist/ contents to the main branch → GitHub Pages
```

## Structure

- `src/data/content.ts` — profile, publications, projects data
- `src/components/Scrapbook.tsx` — the scrollable spreads (cover, about, publications, projects, contact)
- `src/components/ScrapField.tsx` — dense tiled sticker-bomb background
- `src/components/Decorations.tsx` — kawaii SVG icon & material library (stickers, washi tape, stamps…)
- `src/App.tsx` / `src/App.css` — entry & styles
- `docs` branch — Source code (develop here)
- `main` branch — Built output (auto-deployed to GitHub Pages)

## Credits

- Hand-crafted by **Shengqi Dang** ([dangsq123@163.com](mailto:dangsq123@163.com))
- Pair-programmed with **GLM-5.2** ([Zhipu AI](https://www.zhipuai.cn)) via [opencode](https://opencode.ai) — AI contributor ✨
