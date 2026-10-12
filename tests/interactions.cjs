const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
assert.ok(fs.existsSync('script.js'), 'Theme and navigation script must exist');
const code = fs.readFileSync('script.js', 'utf8');
function setup({dark = false, blocked = false, saved = null} = {}) {
  class Element {
    constructor() { this.attrs = {}; this.events = {}; this.dataset = {}; this.focused = false; }
    setAttribute(k, v) { this.attrs[k] = String(v); }
    getAttribute(k) { return this.attrs[k]; }
    addEventListener(k, fn) { this.events[k] = fn; }
    focus() { this.focused = true; }
    fire(k, event = {}) { this.events[k]?.(event); }
  }
  const root = new Element(), theme = new Element(), menu = new Element(), nav = new Element();
  const document = new Element(); document.documentElement = root;
  document.getElementById = id => ({'theme-toggle': theme, 'menu-toggle': menu, 'site-nav': nav}[id]);
  const store = new Map(saved ? [['kai-portfolio-theme', saved]] : []);
  const localStorage = {getItem: k => {if (blocked) throw Error('blocked'); return store.get(k) ?? null;}, setItem: (k, v) => {if (blocked) throw Error('blocked'); store.set(k,v);}};
  const media = {matches: dark, addEventListener: (_, fn) => {media.change = fn;}};
  vm.runInNewContext(code, {document, localStorage, window: {matchMedia: () => media}});
  return {root, theme, menu, nav, document, store, media};
}
let s = setup({dark: true});
assert.equal(s.root.dataset.theme, 'dark');
s.theme.fire('click'); assert.equal(s.root.dataset.theme, 'light');
assert.equal(s.store.get('kai-portfolio-theme'), 'light');
s.media.change({matches: true}); assert.equal(s.root.dataset.theme, 'light');
s = setup({saved: 'dark'}); assert.equal(s.root.dataset.theme, 'dark');
s = setup({blocked: true}); s.theme.fire('click'); assert.equal(s.root.dataset.theme, 'dark');
s = setup(); s.media.change({matches: true}); assert.equal(s.root.dataset.theme, 'dark');
s.menu.fire('click'); assert.equal(s.menu.getAttribute('aria-expanded'), 'true');
s.nav.fire('click', {target: {closest: () => ({})}}); assert.equal(s.menu.getAttribute('aria-expanded'), 'false');
s.menu.fire('click'); s.document.fire('keydown', {key: 'Escape'});
assert.equal(s.menu.getAttribute('aria-expanded'), 'false'); assert.equal(s.menu.focused, true);
console.log('PASS: system theme, saved preference, persistence, blocked storage, system changes, menu selection, Escape focus');
