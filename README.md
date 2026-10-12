# khalee2307.github.io

Personal portfolio of **Le Nhat Kha (Kai)**, AI Research Engineer.

**Live site:** https://khalee2307.github.io

A single-page static site covering research, experience, education, skills, and contact details. It has light and dark themes and a print-friendly résumé layout. There is no framework and no build step.

## Features

- Light/dark theme follows the system setting and remembers a manual choice.
- Responsive layout with a mobile navigation menu (keyboard accessible, closes on Escape).
- Print stylesheet: the browser's Print action produces a résumé-style page.
- Respects `prefers-reduced-motion`; core content works without JavaScript.

## Project structure

```
.
├── index.html               # Page content, metadata, early theme selection
├── styles.css               # Layout, color tokens (light/dark), print styles
├── script.js                # Theme toggle and mobile navigation
├── tests/interactions.cjs   # Dependency-free interaction tests (Node)
└── .nojekyll                # Serve files as-is on GitHub Pages
```

## Run locally

```bash
git clone git@github.com:KhaLee2307/khalee2307.github.io.git
cd khalee2307.github.io
python3 -m http.server 8000
```

Then open http://localhost:8000. You can also open `index.html` directly in a browser.

## Tests

Requires Node.js 18+.

```bash
node --check script.js
node tests/interactions.cjs
```

The tests cover the system theme preference, saved preference, persistence, blocked storage, live preference changes, mobile menu selection, and Escape focus handling.

## Editing

- **Content:** edit the text and links in `index.html`.
- **Colors:** change the CSS custom properties in the `:root` blocks of `styles.css`.

## Deployment

GitHub Pages serves the site from the `main` branch root. Each push to `main` redeploys it, usually within a minute or two.

## Links

- GitHub: [@KhaLee2307](https://github.com/KhaLee2307)
- LinkedIn: [kha-lee-cs-ai](https://www.linkedin.com/in/kha-lee-cs-ai/)
- ORCID: [0009-0002-7820-134X](https://orcid.org/0009-0002-7820-134X)

## License

© Le Nhat Kha. All rights reserved.
