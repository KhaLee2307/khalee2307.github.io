const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const count = (text, needle) => text.split(needle).length - 1;
const has = (text, s) => (s instanceof RegExp ? s.test(text) : text.includes(s));
const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
const nav = html.slice(html.indexOf('<nav'), html.indexOf('</nav>'));

// 1. Sections follow the "eligibility, then evidence" order and the page ends on contact.
const sectionIds = [...main.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
assert.deepEqual(sectionIds, ['journey', 'research', 'education', 'skills', 'contact'], 'section order');
assert.ok(main.lastIndexOf('<section') === main.indexOf('<section id="contact"'), 'contact is the last section');

// 2. The menu lists every section.
const navHrefs = [...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
assert.deepEqual(navHrefs, ['#journey', '#research', '#education', '#skills', '#contact'], 'menu links');

// 3. Every in-page link resolves, and anchors that older links may use still exist.
const allIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const ids = new Set(allIds);
for (const m of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(m[1]), `link target #${m[1]} exists`);
for (const id of ['research', 'experience', 'education', 'skills', 'contact', 'profiles']) assert.ok(ids.has(id), `legacy anchor #${id}`);

// 4. Ids are unique.
assert.equal(ids.size, allIds.length, 'no duplicate ids');

// 5. Content the owner decided to keep off the page. Phone numbers and other people's
//    email addresses are matched by pattern in case 13, so this file never spells them out.
for (const s of [/IELTS/i, 'drive.google.com', 'tel:', /2\s*\+\s*years/i, /years of experience/i, /series cup|football/i,
  // Personal social accounts, school-club roles and entry-level course badges say nothing about research or engineering.
  /facebook\.com|instagram\.com|threads\.(?:com|net)/i, /Youth Union|Journalism Club/i, /Hackathon|Coursera|AWS Knowledge/i]) {
  assert.ok(!has(html, s), `must not contain ${s}`);
}

// 6. Each profile link appears once.
for (const u of ['https://github.com/KhaLee2307"', 'https://www.linkedin.com/in/kha-lee-cs-ai/"', 'https://orcid.org/0009-0002-7820-134X"']) {
  assert.equal(count(html, 'href="' + u), 1, `one link to ${u}`);
}

// 7. Each workplace has exactly one heading.
const h3s = [...html.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/g)].map(m => m[1]);
for (const o of ['Agntic.ai', 'CAIR', 'MoMo', 'Viettel AI', 'Cinnamon AI']) {
  assert.equal(h3s.filter(h => h.includes(o)).length, 1, `one <h3> for ${o}`);
}

// 8. Facts brought in from the resumes.
for (const s of ['Python', 'LangChain', 'Strands', '9.25', '1,000 applicants', '9% acceptance', 'iBeta Level 2', 'openaccess.thecvf.com', 'NeurIPS 2026', '31 million']) {
  assert.ok(html.includes(s), `must contain ${s}`);
}

// 9. Journey chart: eight bars on the 78-month axis (index 0 = Jul 2020), each row with its dates as text.
const bars = [...html.matchAll(/class="journey-bar"[^>]*style="--s:(\d+);--e:(\d+)"/g)].map(m => [Number(m[1]), Number(m[2])]);
assert.deepEqual(bars, [[4, 47], [61, 62], [31, 49], [70, 78], [35, 38], [45, 49], [49, 70], [73, 78]], 'journey bars');
assert.equal(count(html, 'class="journey-dates"'), 8, 'journey rows show dates as text');
assert.deepEqual([...html.matchAll(/class="journey-group" data-lane="([a-z]+)"/g)].map(m => m[1]), ['education', 'research', 'industry'], 'journey lanes');

// 10. The page has no print button; the browser's own Print still gives the résumé layout.
assert.ok(!html.includes('print-cv') && !css.includes('print-button'), 'no print button');

// 11. Every expandable block has a label.
assert.ok(count(html, '<details') > 0, 'expandable details exist');
assert.equal(count(html, '<details'), count(html, '<summary'), 'each <details> has a <summary>');

// 12. No text smaller than 12px.
if (!process.env.STRUCTURE_SKIP_CSS) {
  for (const m of css.matchAll(/font(?:-size)?:[^;}]*?(\d+(?:\.\d+)?)px/g)) {
    assert.ok(Number(m[1]) >= 12, `font size below 12px: "${m[0]}"`);
  }
}

// 14. Decorative arrows are hidden from screen readers, so links read as their names.
const arrows = count(html, '↗') + count(html, '↘') + count(html, '↑');
assert.equal(arrows, [...html.matchAll(/aria-hidden="true">[↗↘↑]<\/span>/g)].length, 'every arrow is wrapped in an aria-hidden span');

// 15. Fonts load from the page head, not through a chained @import, and a shared link has a preview.
assert.ok(!css.includes('@import'), 'no @import in styles.css');
assert.match(html, /<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>/, 'font preconnect');
for (const prop of ['og:title', 'og:description', 'og:image', 'og:url']) assert.ok(html.includes(`property="${prop}"`), `${prop} present`);

// 13. Nothing the site publishes carries a phone number or anyone else's email address, this file included.
const published = ['index.html', 'styles.css', 'script.js', 'README.md', 'tests/structure.cjs', 'tests/interactions.cjs'];
const allowedEmails = new Set(['khalee230702@gmail.com', 'git@github.com']);
const phone = /(?<![\w-])(?:\+?84[\s.]?|0)?9\d(?:[\s.]?\d){7}(?![\w-])/;
const email = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
for (const file of published) {
  const text = fs.readFileSync(file, 'utf8').replace(/\?v=[0-9a-f]+/g, '');
  assert.ok(!phone.test(text), `phone number in ${file}`);
  for (const m of text.matchAll(email)) assert.ok(allowedEmails.has(m[0]), `unexpected email address in ${file}`);
}

console.log('PASS: structure, content rules, journey data, type floor, no personal data');
