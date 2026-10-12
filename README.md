# Kai — AI Research Portfolio

English single-page portfolio for Le Nhat Kha (Kai), with light and dark themes. Personal facts and links come from `kai.tex`.

## View locally

Open `index.html` in your browser, or serve this directory:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then visit http://127.0.0.1:8000. No dependency installation or build is required. Google Fonts is optional: offline browsers use Arial fallbacks.

## Files

- `index.html`: profile content, section anchors, metadata, and early theme selection.
- `styles.css`: responsive layout, semantic light/dark colors, reduced motion, and print layout.
- `script.js`: persistent theme selection and mobile navigation.
- `tests/interactions.cjs`: dependency-free interaction checks using Node's VM with a small browser-environment stub.

Edit profile text and links in `index.html`; adjust colors in the CSS root tokens. The theme follows the system preference until the visitor explicitly selects a theme. Storage failures do not stop switching. Without JavaScript, navigation stays visible and the system theme is applied by CSS.

The standard browser Print action produces a resume-style view of the substantive content. The site does not claim a downloadable PDF or public URLs for private projects.

## Verification

```bash
node --check script.js
node tests/interactions.cjs
```

Interaction checks cover system preference, stored preference, persistence, denied storage, preference changes, mobile menu selection, and Escape focus handling. HTML parser checks verified unique IDs, heading hierarchy, internal anchors, supplied external URLs, and safe new-tab links. Calculated normal-text contrast is at least 4.5:1 for foreground, muted text, and accents on the defined surfaces in both themes.

In the development environment, Chromium launch and local HTTP socket creation were blocked by sandbox restrictions. Browser rendering, viewport/zoom checks, browser printing, and HTTP serving have **not** been verified. The interaction stub is not a substitute for real-browser QA. No hosted deployment was performed.

## Supplementary public sources

The research/work section also uses the owner-provided GitHub profile and repository READMEs, reviewed on 2026-10-11:

- https://github.com/KhaLee2307/StrDA — poster and slides links.
- https://github.com/KhaLee2307/hand-pose-estimation — hand-pose project description.
- https://github.com/KhaLee2307/image-retrieval — visual search project description.

LinkedIn could not be fetched. Employment and education continue to follow `kai.tex`; its LinkedIn URL is preserved as explicitly supplied by the owner. No changing star counts or inferred authorship roles are displayed.
