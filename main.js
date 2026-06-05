/* ================ Reduced motion check ================ */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;


/* ================ Tweak defaults ================ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "blue": "fluorescent",
  "waves": "on",
  "mascot": "letter",
  "sparks": "on"
}/*EDITMODE-END*/;

let state = { ...TWEAK_DEFAULTS };


/* ================ SKILL GRID ================ */
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
const SKILLS = [
  { initial: 'f', rest: 'igma',   icon: 'figma/figma-original.svg' },
  { initial: 'f', rest: 'lutter', icon: 'flutter/flutter-original.svg' },
  { initial: 'H', rest: 'tml',    icon: 'html5/html5-original.svg' },
  { initial: 'C', rest: 'ss',     icon: 'css3/css3-original.svg' },
  { initial: 'p', rest: 'ython',  icon: 'python/python-original.svg' },
  { initial: 'C', rest: '',       icon: 'c/c-original.svg' },
  { initial: 'G', rest: 'it',     icon: 'git/git-original.svg' },
  { initial: 'G', rest: 'itHub',  icon: 'github/github-original.svg' },
];

document.getElementById('skillGrid').innerHTML = SKILLS.map(s => `
  <div class="skill-card">
    <div class="card-overlay"></div>
    <p class="card-name"><span class="card-initial">${s.initial}</span>${s.rest}</p>
    <img class="card-icon" src="${DEVICON}${s.icon}" alt="${s.initial}${s.rest}" width="83" height="83">
    <div class="card-shine"></div>
  </div>
`).join('');


/* ================ Scroll-spy + "here" chip ================ */
const SECTIONS  = ['home', 'about', 'skills', 'works', 'likes'];
const navLinks  = document.querySelectorAll('.nav a');

navLinks.forEach(a => {
  a.addEventListener('click', () => {
    const target = document.getElementById(a.dataset.sec);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

function updateSpy() {
  const y = window.scrollY + 160;
  let cur = 'home';

  for (const id of SECTIONS) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= y) cur = id;
  }

  navLinks.forEach(a => a.classList.toggle('on', a.dataset.sec === cur));
}

window.addEventListener('scroll', updateSpy, { passive: true });
updateSpy();


/* ================ Custom cursor ================ */
if (!isTouch && !reducedMotion) {
  const dot = document.getElementById('cursorDot');
  let mx = 0, my = 0, dx = 0, dy = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function moveDot() {
    dx += (mx - dx) * 0.18;
    dy += (my - dy) * 0.18;
    dot.style.left = dx + 'px';
    dot.style.top = dy + 'px';
    requestAnimationFrame(moveDot);
  })();

  const hoverTargets = 'a, button, .work, .skill-card, .like';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) dot.classList.add('hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) dot.classList.remove('hover');
  });
} else {
  document.body.style.cursor = 'auto';
  const dot = document.getElementById('cursorDot');
  if (dot) dot.style.display = 'none';
}


/* ================ Tweaks panel ================ */
const tweaks = document.getElementById('tweaks');

window.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === '__activate_edit_mode')   tweaks.classList.add('on');
  if (d.type === '__deactivate_edit_mode') tweaks.classList.remove('on');
});

try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}

function applyState() {
  const BLUES = { fluorescent: '#3D5AFF', royal: '#1C3CFF', sky: '#0EA5E9' };

  document.documentElement.style.setProperty('--blue', BLUES[state.blue] || '#3D5AFF');

  document.querySelectorAll('.tweaks .ctl').forEach(ctl => {
    const key = ctl.dataset.group;
    ctl.querySelectorAll('button').forEach(btn => {
      btn.classList.toggle('on', btn.dataset.val === state[key]);
    });
  });
}

document.querySelectorAll('.tweaks .ctl button').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.parentElement.dataset.group;
    state[key] = btn.dataset.val;
    applyState();
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: btn.dataset.val } }, '*');
    } catch {}
  });
});

applyState();
