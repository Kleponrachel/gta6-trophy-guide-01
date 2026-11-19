// Leonida Trophy Atlas — GTA VI trophy guide & tracker.
// Plain static app: loads app/data/trophies.json, keeps ticks in localStorage,
// exports/imports them, filters by kind and grade, hides story spoilers until
// earned, and shows a five-stage platinum roadmap. No network at run time.
const STORAGE_KEY = 'leonida-trophy-atlas-v1';
const SEED_EARNED = [2, 3, 4, 5, 8, 9, 15, 16, 20, 21, 28, 35, 44];
const ROADMAP_STAGES = [
  { n: 1, title: 'Story first — Chapters 1–4 + finale', note: 'Play the story through. Meditate at Lucia’s balcony in Chapter 1 FIRST — that spot vanishes after the chapter.' },
  { n: 2, title: 'Strangers — strands & finales', note: 'Answer the “?” markers across Leonida and finish each stranger’s strand.' },
  { n: 3, title: 'Collectibles & activities', note: 'WAiNK scans, card sets, stunts, shooting ranges, drone races, challenges and the odd jobs.' },
  { n: 4, title: 'Robberies & money', note: 'Vaults, trucks, shops and illegal operations — then launder, spend and buy.' },
  { n: 5, title: 'Cleanup — 100% & the platinum', note: 'Mop up the 100% checklist, then the platinum pops at 55/55.' },
];

const params = new URLSearchParams(location.search);
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

let earned = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'));
if (params.has('seed')) {
  earned = new Set(SEED_EARNED.map((id) => trophies.find((t) => t.id === id)?.name).filter(Boolean));
  saveProgress();
}
let kind = params.get('filter') ?? 'all';
let grade = 'all';
let query = '';
let spoiler = params.has('spoiler') || document.getElementById('spoilerToggle').checked;
let hideEarned = false;
let selectedId = Number(params.get('open') ?? 0) || null;
let view = params.get('view') ?? 'checklist';

const $ = (id) => document.getElementById(id);

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned]));
}

function gradeLabel(g) {
  return g === 'platinum' ? 'Platinum' : g[0].toUpperCase() + g.slice(1);
}

function kindLabel(k) {
  return { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', online: 'Online' }[k] ?? k;
}

function isHidden(t) {
  return spoiler && t.hidden && !earned.has(t.name);
}

function visibleTrophies() {
  return trophies.filter((t) => {
    if (kind !== 'all' && t.kind !== kind) return false;
    if (grade !== 'all' && t.grade !== grade) return false;
    if (hideEarned && earned.has(t.name)) return false;
    if (query) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

function renderProgress() {
  const n = earned.size;
  $('earnedCount').textContent = n;
  $('progressFill').style.width = `${Math.round((n / trophies.length) * 100)}%`;
  const byGrade = {};
  for (const t of trophies) if (earned.has(t.name)) byGrade[t.grade] = (byGrade[t.grade] ?? 0) + 1;
  $('gradeCounts').textContent = `Platinum ${byGrade.platinum ?? 0}/1 · Gold ${byGrade.gold ?? 0}/2 · Silver ${byGrade.silver ?? 0}/6 · Bronze ${byGrade.bronze ?? 0}/46`;
  $('backupStats').textContent = `${n} of 55 earned (${Math.round((n / 55) * 100)}%) — ${55 - n} to go.`;
}

function renderKindCounts() {
  const counts = { all: trophies.length, story: 0, missable: 0, collectibles: 0, activities: 0, online: 0 };
  for (const t of trophies) counts[t.kind] = (counts[t.kind] ?? 0) + 1;
  for (const k of Object.keys(counts)) {
    const el = document.getElementById('count' + k[0].toUpperCase() + k.slice(1));
    if (el) el.textContent = counts[k];
  }
}

function trophyRow(t) {
  const li = document.createElement('li');
  li.className = 'trophy' + (earned.has(t.name) ? ' earned' : '') + (selectedId === t.id ? ' selected' : '');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.name);
  box.setAttribute('aria-label', `Mark ${t.name} earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.name);
    else earned.delete(t.name);
    saveProgress();
    renderAll();
  });
  const medal = document.createElement('span');
  medal.className = `medal ${t.grade}`;
  medal.textContent = t.grade === 'platinum' ? 'P' : t.grade[0].toUpperCase();
  medal.title = gradeLabel(t.grade);
  const body = document.createElement('button');
  body.type = 'button';
  body.className = 'trophyBody';
  body.addEventListener('click', () => { selectedId = t.id; renderAll(); });
  const name = document.createElement('span');
  name.className = 'trophyName';
  name.textContent = isHidden(t) ? 'Hidden trophy — earn it to reveal' : t.name;
  const desc = document.createElement('span');
  desc.className = 'trophyDesc';
  desc.textContent = isHidden(t) ? 'Spoiler-free mode hides this story trophy until you earn it.' : t.description;
  const meta = document.createElement('span');
  meta.className = 'trophyMeta';
  const kindTag = document.createElement('span');
  kindTag.className = 'tag kind';
  kindTag.textContent = kindLabel(t.kind);
  meta.append(kindTag);
  if (t.missable) {
    const m = document.createElement('span');
    m.className = 'tag missable';
    m.textContent = '⚠ Missable';
    meta.append(m);
  }
  if (t.target) {
    const c = document.createElement('span');
    c.className = 'tag target';
    c.textContent = t.target;
    meta.append(c);
  }
  body.append(name, desc, meta);
  li.append(box, medal, body);
  return li;
}

function renderList() {
  const list = visibleTrophies();
  const ul = $('trophyList');
  ul.replaceChildren(...list.map(trophyRow));
  $('emptyNote').hidden = list.length > 0;
  const earnedShown = list.filter((t) => earned.has(t.name)).length;
  $('listHint').textContent = kind === 'online'
    ? 'No online trophies — all 55 are earned offline in single-player.'
    : `Showing ${list.length} of 55 trophies · ${earnedShown} earned in this view.`;
}

function renderDetail() {
  const pane = $('detailPane');
  const t = trophies.find((x) => x.id === selectedId);
  if (!t) {
    pane.innerHTML = '<p class="detailEmpty">Select a trophy to see its guide and sources.</p>';
    return;
  }
  pane.replaceChildren();
  const head = document.createElement('div');
  head.className = 'detailHead';
  const medal = document.createElement('span');
  medal.className = `medal ${t.grade} big`;
  medal.textContent = t.grade === 'platinum' ? 'P' : t.grade[0].toUpperCase();
  const titles = document.createElement('div');
  const h = document.createElement('h2');
  h.textContent = isHidden(t) ? 'Hidden trophy' : t.name;
  const d = document.createElement('p');
  d.className = 'detailDesc';
  d.textContent = isHidden(t) ? 'Spoiler-free mode hides this story trophy until you earn it.' : t.description;
  titles.append(h, d);
  head.append(medal, titles);
  const tags = document.createElement('p');
  tags.className = 'detailTags';
  tags.innerHTML = '';
  const gt = document.createElement('span');
  gt.className = 'tag grade';
  gt.textContent = gradeLabel(t.grade);
  const kt = document.createElement('span');
  kt.className = 'tag kind';
  kt.textContent = kindLabel(t.kind);
  tags.append(gt, kt);
  if (t.missable) {
    const m = document.createElement('span');
    m.className = 'tag missable';
    m.textContent = '⚠ Missable — the game’s only one';
    tags.append(m);
  }
  if (t.target) {
    const c = document.createElement('span');
    c.className = 'tag target';
    c.textContent = 'Target: ' + t.target;
    tags.append(c);
  }
  const earnedRow = document.createElement('p');
  const earnedBox = document.createElement('input');
  earnedBox.type = 'checkbox';
  earnedBox.checked = earned.has(t.name);
  earnedBox.id = 'detailEarned';
  earnedBox.addEventListener('change', () => {
    if (earnedBox.checked) earned.add(t.name);
    else earned.delete(t.name);
    saveProgress();
    renderAll();
  });
  const earnedLabel = document.createElement('label');
  earnedLabel.htmlFor = 'detailEarned';
  earnedLabel.textContent = earned.has(t.name) ? 'Earned ✓' : 'Mark as earned';
  earnedRow.append(earnedBox, ' ', earnedLabel);
  const guideH = document.createElement('h3');
  guideH.textContent = 'Guide';
  const guide = document.createElement('p');
  guide.className = 'guideText';
  guide.textContent = t.guide;
  const srcH = document.createElement('h3');
  srcH.textContent = 'Sources';
  const srcList = document.createElement('ul');
  srcList.className = 'sources';
  for (const s of t.sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.label;
    li.append(a);
    srcList.append(li);
  }
  pane.append(head, tags, earnedRow, guideH, guide, srcH, srcList);
}

function renderRoadmap() {
  const wrap = $('roadmapStages');
  wrap.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const card = document.createElement('article');
    card.className = 'stage';
    const h = document.createElement('h2');
    h.textContent = `Stage ${stage.n} — ${stage.title}`;
    const p = document.createElement('p');
    p.textContent = stage.note;
    const ul = document.createElement('div');
    ul.className = 'stageChips';
    const mine = trophies.filter((t) => t.roadmap === stage.n);
    for (const t of mine) {
      const chip = document.createElement('span');
      chip.className = 'chip' + (earned.has(t.name) ? ' done' : '');
      chip.textContent = `${earned.has(t.name) ? '✓ ' : ''}${t.name} (${t.grade[0].toUpperCase()})${t.missable ? ' ⚠' : ''}`;
      ul.append(chip);
    }
    const done = mine.filter((t) => earned.has(t.name)).length;
    const prog = document.createElement('p');
    prog.className = 'stageProg';
    prog.textContent = `${done} of ${mine.length} earned in this stage`;
    card.append(h, p, ul, prog);
    wrap.append(card);
  }
}

function renderMissables() {
  const wrap = $('missableList');
  wrap.replaceChildren();
  const miss = trophies.filter((t) => t.missable);
  for (const t of miss) {
    const card = document.createElement('article');
    card.className = 'missCard';
    const h = document.createElement('h2');
    h.textContent = `⚠ ${t.name} — ${gradeLabel(t.grade)}`;
    const d = document.createElement('p');
    d.textContent = t.description;
    const g = document.createElement('p');
    g.textContent = t.guide;
    const s = document.createElement('p');
    s.className = 'srcLine';
    s.textContent = 'Sources: ' + t.sources.map((x) => x.label).join(' · ');
    card.append(h, d, g, s);
    wrap.append(card);
  }
  const note = document.createElement('p');
  note.className = 'missNote';
  note.textContent = 'That is the whole list: one missable trophy. Every other trophy can be earned after the story, in any order.';
  wrap.append(note);
}

function renderViews() {
  for (const v of ['checklist', 'roadmap', 'missables']) {
    document.getElementById('view-' + v).hidden = view !== v;
  }
  document.querySelectorAll('#tabs button').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === view);
  });
  document.querySelectorAll('#kindFilters button').forEach((b) => {
    b.classList.toggle('active', b.dataset.kind === kind);
  });
  $('spoilerToggle').checked = spoiler;
  $('toolbar').style.display = view === 'checklist' ? '' : 'none';
}

function renderAll() {
  renderProgress();
  renderKindCounts();
  renderList();
  renderDetail();
  renderRoadmap();
  renderMissables();
  renderViews();
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned] }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importProgress(file) {
  if (!file) return;
  const data = JSON.parse(await file.text());
  const names = new Set(Array.isArray(data) ? data : data.earned ?? []);
  earned = new Set(trophies.filter((t) => names.has(t.name)).map((t) => t.name));
  saveProgress();
  renderAll();
}

document.querySelectorAll('#tabs button').forEach((b) => {
  b.addEventListener('click', () => { view = b.dataset.view; renderAll(); });
});
document.querySelectorAll('#kindFilters button').forEach((b) => {
  b.addEventListener('click', () => { kind = b.dataset.kind; view = 'checklist'; renderAll(); });
});
$('gradeFilter').addEventListener('change', (e) => { grade = e.target.value; renderAll(); });
$('search').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); renderAll(); });
$('spoilerToggle').addEventListener('change', (e) => { spoiler = e.target.checked; renderAll(); });
$('hideEarned').addEventListener('change', (e) => { hideEarned = e.target.checked; renderAll(); });
$('exportBtn').addEventListener('click', exportProgress);
$('exportBtn2').addEventListener('click', exportProgress);
$('importFile').addEventListener('change', (e) => importProgress(e.target.files[0]));
$('importFile2').addEventListener('change', (e) => importProgress(e.target.files[0]));
$('resetBtn').addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) { earned = new Set(); saveProgress(); renderAll(); }
});

renderAll();
