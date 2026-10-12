(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const menuButton = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try { const saved = localStorage.getItem('kai-portfolio-theme'); if (saved === 'light' || saved === 'dark') preference = saved; } catch { /* Storage is optional. */ }
  function setTheme(theme) {
    root.dataset.theme = theme;
    themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    themeButton.setAttribute('aria-pressed', theme === 'dark');
  }
  setTheme(preference || (media.matches ? 'dark' : 'light'));
  themeButton.hidden = false;
  themeButton.addEventListener('click', () => {
    preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(preference);
    try { localStorage.setItem('kai-portfolio-theme', preference); } catch { /* Keep the selection for this session. */ }
  });
  media.addEventListener('change', event => { if (!preference) setTheme(event.matches ? 'dark' : 'light'); });
  root.dataset.enhanced = 'true';
  menuButton.hidden = false;
  function setMenu(open) { menuButton.setAttribute('aria-expanded', open); nav.dataset.open = String(open); }
  setMenu(false);
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); }
  });
})();
