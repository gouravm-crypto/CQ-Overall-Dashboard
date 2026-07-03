// ── SHARED UI UTILITIES ──

const NAV_LINKS = [
  ['index.html', 'Overview'],
  ['presales.html', 'Presales'],
  ['postsales.html', 'Postsales'],
  ['queries.html', 'Queries'],
  ['findings.html', 'Findings & AOIs'],
];

function renderHeader(active) {
  const links = NAV_LINKS.map(([href, label]) =>
    `<a class="nav-link${href === active ? ' active' : ''}" href="${href}">${label}</a>`
  ).join('');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return `
    <div class="hdr">
      <div class="hdr-logo-wrap">
        <div class="hdr-brand">
          <div class="hdr-name">CaratLane</div>
          <div class="hdr-tata">A Tata Product</div>
        </div>
      </div>
      <div class="hdr-sep"></div>
      <div class="hdr-title">CQ Dashboard · Online Team</div>
      <div class="hdr-nav">${links}</div>
      <div class="hdr-actions">
        <button class="dm-btn" id="dmToggle" onclick="toggleDarkMode()">${isDark ? '☀️ Light' : '🌙 Dark'}</button>
        <button class="pdf-btn" onclick="window.print()">⬇ Export</button>
      </div>
    </div>`;
}

function renderFooter() {
  const now = new Date();
  const stamp = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return `
    <div class="footer">
      <div class="ft-l">
        <div class="ft-brand">CaratLane</div>
        <div class="ft-tata">A Tata Product</div>
      </div>
      <div class="ft-r">
        <strong>Quality Assurance · Online Team</strong><br>
        Report generated ${stamp} · Audit cycle: 26th – 25th monthly
      </div>
    </div>`;
}

function toggleDarkMode() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  try { localStorage.setItem('cq-theme', next); } catch (e) {}
  const btn = document.getElementById('dmToggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
}

(function initTheme() {
  try {
    const saved = localStorage.getItem('cq-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  } catch (e) {}
})();

const AV_PALETTE = ['#c8a846', '#2563eb', '#16a34a', '#7c3aed', '#ea580c', '#dc2626', '#0891b2', '#be185d', '#6d28d9', '#0e7490', '#f59e0b', '#059669'];

function getAVColor(str) {
  str = String(str || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return AV_PALETTE[hash % AV_PALETTE.length];
}

function cqClass(cq) {
  if (cq >= 95) return { bar: 'bg', pct: 'cg' };
  if (cq >= 80) return { bar: 'bgg', pct: 'cgg' };
  return { bar: 'bo', pct: 'co' };
}

// ── ANIMATIONS: bar fills + count-up stats ──
function animateBars() {
  document.querySelectorAll('.bar-fill[data-w]').forEach(el => {
    const w = el.getAttribute('data-w');
    requestAnimationFrame(() => { el.style.width = w + '%'; });
  });
}

function animateCounters() {
  document.querySelectorAll('[data-cu]').forEach(el => {
    const target = parseFloat(el.getAttribute('data-cu'));
    const suffix = el.getAttribute('data-suf') || '';
    if (isNaN(target)) return;
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  animateBars();
  animateCounters();
});
