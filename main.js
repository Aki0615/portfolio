/* ================ Tweak defaults ================ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "blue": "electric",
  "waves": "on",
  "mascot": "letter",
  "sparks": "on"
}/*EDITMODE-END*/;

let state = { ...TWEAK_DEFAULTS };


/* ================ SKILL GRID ================ */
const SKILLS = [
  { name: 'Figma',   jp: 'UI / UX デザイン',  lvl: 90, flag: true,  tag: 'Design'    },
  { name: 'Flutter', jp: 'モバイルアプリ開発', lvl: 85, flag: false, tag: 'Framework' },
  { name: 'HTML',    jp: 'マークアップ',       lvl: 80, flag: false, tag: 'Markup'    },
  { name: 'CSS',     jp: 'スタイリング',       lvl: 80, flag: false, tag: 'Style'     },
  { name: 'Python',  jp: 'スクリプト / AI',   lvl: 70, flag: false, tag: 'Language'  },
  { name: 'C',       jp: '基礎科目',           lvl: 60, flag: false, tag: 'Language'  },
  { name: 'Git',     jp: 'バージョン管理',     lvl: 75, flag: false, tag: 'Tool'      },
  { name: 'GitHub',  jp: 'チーム開発',         lvl: 75, flag: false, tag: 'Platform'  },
];

document.getElementById('skillGrid').innerHTML = SKILLS.map((s, i) => `
  <div class="skill ${s.flag ? 'flag' : ''}">
    <span class="num">${String(i + 1).padStart(2, '0')} / 08</span>
    <div>
      <div class="name">${s.name}</div>
      <div class="jp">${s.jp}</div>
    </div>
    <div>
      <div class="bar"><i data-lvl="${s.lvl}"></i></div>
      <div class="tag">${s.tag} · ${s.lvl}</div>
    </div>
    <div class="glyph">${s.name[0]}</div>
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


/* ================ Tweaks panel ================ */
const tweaks = document.getElementById('tweaks');

window.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === '__activate_edit_mode')   tweaks.classList.add('on');
  if (d.type === '__deactivate_edit_mode') tweaks.classList.remove('on');
});

try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}

function applyState() {
  const BLUES = { electric: '#1C3CFF', royal: '#0a24c9', sky: '#0EA5E9' };

  document.documentElement.style.setProperty('--blue', BLUES[state.blue] || '#1C3CFF');
  document.querySelector('.home-bg').style.display = state.waves === 'off' ? 'none' : 'block';
  document.querySelectorAll('.spark, .deco-spark, .home-avatar .sparkle').forEach(s => {
    s.style.display = state.sparks === 'off' ? 'none' : '';
  });

  const letter = state.mascot === 'p' ? 'p' : 'え';
  document.querySelector('.mascot .letter').textContent = letter;
  document.querySelectorAll('.home-avatar .mark').forEach(m => m.textContent = letter);

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
