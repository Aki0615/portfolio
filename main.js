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
  { name: 'Figma',      jp: 'UIデザイン',                    lvl: 90, icon: 'figma/figma-original.svg' },
  { name: 'Flutter',    jp: 'モバイルアプリ開発',            lvl: 85, icon: 'flutter/flutter-original.svg' },
  { name: 'Dart',       jp: 'プログラミング言語',            lvl: 80, icon: 'dart/dart-original.svg' },
  { name: 'HTML / CSS', jp: 'マークアップ / スタイリング',    lvl: 80, icon: 'html5/html5-original.svg' },
  { name: 'Python',     jp: 'スクリプト / AI',               lvl: 70, icon: 'python/python-original.svg' },
  { name: 'C',          jp: 'プログラミング言語',            lvl: 60, icon: 'c/c-original.svg' },
  { name: 'Git',        jp: 'バージョン管理',                lvl: 70, icon: 'git/git-original.svg' },
  { name: 'GitHub',     jp: 'コード管理 / コラボレーション',  lvl: 75, icon: 'github/github-original.svg' },
];

document.getElementById('skillGrid').innerHTML = SKILLS.map(s => `
  <div class="skill">
    <div class="skill-top">
      <img class="skill-icon" src="${DEVICON}${s.icon}" alt="${s.name}" width="40" height="40">
      <div class="skill-info">
        <div class="name">${s.name}</div>
        <div class="jp">${s.jp}</div>
      </div>
      <div class="skill-lvl">Lv. ${s.lvl}</div>
    </div>
    <div class="bar"><i data-lvl="${s.lvl}"></i></div>
  </div>
`).join('');


/* ================ Scroll-spy + "here" chip ================ */
const SECTIONS  = ['home', 'about', 'skills', 'works', 'likes'];
const SEC_LABEL = { home: '/HOME', about: '/ABOUT', skills: '/SKILLS', works: '/WORKS', likes: '/LIKES' };
const hereChip  = document.getElementById('hereChip');
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

  hereChip.innerHTML = `今<span class="cur">${SEC_LABEL[cur]}</span>にいるよ`;
  navLinks.forEach(a => a.classList.toggle('on', a.dataset.sec === cur));

  // Animate skill bars when scrolled into view
  const sk = document.getElementById('skills');
  if (sk && sk.getBoundingClientRect().top < window.innerHeight * 0.7) {
    document.querySelectorAll('.skill .bar i').forEach(i => {
      if (!i.style.width) i.style.width = i.dataset.lvl + '%';
    });
  }
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

  const hoverTargets = 'a, button, .work, .skill, .like';
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
  document.querySelector('.home-bg').style.display = state.waves === 'off' ? 'none' : 'block';
  document.querySelectorAll('.spark, .deco-spark, .home-avatar .sparkle').forEach(s => {
    s.style.display = state.sparks === 'off' ? 'none' : '';
  });

  const letter = state.mascot === 'p' ? 'p' : 'え';
  document.querySelector('.mascot .letter').textContent = letter;

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
