/* ===========================================================
   BallHero Kids — App logic
   No backend. State in localStorage. Pose via MediaPipe (CDN).
   =========================================================== */
'use strict';

/* ---------------- Mission catalog ---------------- */
const MISSIONS = [
  {
    id: 'toetaps', cat: 'mastery', emoji: '👟', title: 'Toe Taps',
    goal: 100, unit: 'Kontakte', stars: 3, skill: 'ballControl',
    tags: ['Ballgefühl', 'Rhythmus', 'Beide Füße'],
    desc: 'Tippe abwechselnd mit der Sohle leicht oben auf den Ball – links, rechts, links, rechts. Ganz leichte, schnelle Berührungen.',
    cues: ['Kleine, schnelle Berührungen', 'Auf den Fußballen bleiben', 'Kopf alle paar Kontakte kurz hoch', 'Ball ruhig unter dir halten'],
    kid: 'Toe Taps! Tippe ganz leicht mit der Sohle oben auf den Ball. Links, rechts, links, rechts. Ganz schnell und ganz leicht. Schau ab und zu nach vorne!',
  },
  {
    id: 'foundations', cat: 'mastery', emoji: '↔️', title: 'Foundations',
    goal: 80, unit: 'Kontakte', stars: 3, skill: 'ballControl',
    tags: ['Innenseite', 'Kontrolle'],
    desc: 'Schiebe den Ball mit der Innenseite von einem Fuß zum anderen hin und her. Sauberer, kontrollierter Rhythmus.',
    cues: ['Innenseite benutzen', 'Ball berühren, nicht wegschieben', 'Knie leicht gebeugt', 'Gleichmäßiges Tempo'],
    kid: 'Foundations! Schiebe den Ball mit der Innenseite hin und her. Von einem Fuß zum anderen. Immer schön gleichmäßig.',
  },
  {
    id: 'slalom', cat: 'dribbling', emoji: '🏁', title: 'Slalom-Dribbling',
    goal: 60, unit: 'Sekunden', stars: 2, skill: 'dribbling',
    tags: ['Dribbling', 'Richtungswechsel'],
    desc: 'Dribble in kleinen Kontakten durch einen Slalom (Schuhe/Flaschen als Hütchen). Viele Berührungen, enge Führung.',
    cues: ['Viele kleine Kontakte', 'Ball nah am Fuß', 'Innen- und Außenseite nutzen', 'Bei jedem Hütchen Blick hoch'],
    kid: 'Slalom! Dribble um die Hütchen herum. Mach ganz viele kleine Berührungen. Der Ball bleibt immer dicht bei deinem Fuß.',
  },
  {
    id: 'weakfoot', cat: 'weakfoot', emoji: '🦶', title: 'Schwacher Fuß',
    goal: 40, unit: 'Kontakte', stars: 3, skill: 'weakFoot',
    tags: ['Schwacher Fuß', 'Riesen-Hebel'],
    desc: 'Nur mit dem schwächeren Fuß: Sohle rollen, Innenseite tippen, kleine Pässe gegen die Wand.',
    cues: ['Bewusst langsam & sauber', 'Nicht ärgern – üben!', 'Gleicher Ablauf wie starker Fuß', 'Lieber wenige gute Kontakte'],
    kid: 'Schwacher Fuß! Jetzt nur mit dem Fuß, der schwerer ist. Ganz langsam und sauber. Das macht dich richtig stark!',
  },
  {
    id: 'juggling', cat: 'coordination', emoji: '🤹', title: 'Jonglieren',
    goal: 30, unit: 'Kontakte', stars: 2, skill: 'coordination',
    tags: ['Koordination', 'Balance'],
    desc: 'Ball hochwerfen und mit dem Fuß hochhalten. Am Anfang: 1 Kontakt, fangen, wieder hoch. Dann steigern.',
    cues: ['Fuß fest, Zehen leicht hoch', 'Ball auf Kopfhöhe halten', 'Ruhig atmen', 'Beide Füße probieren'],
    kid: 'Jonglieren! Halte den Ball mit dem Fuß in der Luft. Wenn er runterfällt, ist das gar nicht schlimm. Einfach nochmal probieren!',
  },
  {
    id: 'trick', cat: 'creativity', emoji: '✨', title: 'Trick des Tages',
    goal: 10, unit: 'Versuche', stars: 2, skill: 'coordination',
    tags: ['Kreativität', 'Spaß'],
    desc: 'Heute: die Sohlen-Rolle (Ball mit der Sohle zur Seite rollen und mit dem anderen Fuß stoppen). Frei ausprobieren!',
    cues: ['Trauen & ausprobieren', 'Links und rechts testen', 'Erst langsam, dann schneller', 'Fehler sind okay'],
    kid: 'Trick des Tages! Rolle den Ball mit der Sohle zur Seite. Und stoppe ihn mit dem anderen Fuß. Trau dich einfach!',
  },

  /* --- Signature-Übungen der Akademien (kindgerecht adaptiert) --- */
  {
    id: 'croqueta', cat: 'dribbling', emoji: '🔀', title: 'La Croqueta',
    goal: 30, unit: 'Wechsel', stars: 3, skill: 'dribbling',
    tags: ['Barça', 'Erster Kontakt', 'Beide Füße'],
    desc: 'Der Iniesta-Trick: den Ball ganz schnell mit der Innenseite von einem Fuß zum anderen schieben, um an einem Gegner vorbeizukommen.',
    cues: ['Innenseite → Innenseite', 'Ganz schnell rüberschieben', 'Ball dicht am Fuß', 'Danach sofort weiter'],
    kid: 'La Croqueta! Schiebe den Ball ganz schnell von einem Fuß zum anderen. Rüber – und weiter. So wie Iniesta beim FC Barcelona!',
  },
  {
    id: 'stepover', cat: 'dribbling', emoji: '🌀', title: 'Übersteiger',
    goal: 20, unit: 'Übersteiger', stars: 3, skill: 'dribbling',
    tags: ['Ajax', 'Finte', 'Kreativität'],
    desc: 'Die Schere: mit dem Fuß außen über den Ball steigen, als gingst du in eine Richtung – und dann in die andere weg.',
    cues: ['Fuß außen um den Ball', 'Erst antäuschen', 'Dann in die andere Richtung', 'Mutig und schnell'],
    kid: 'Übersteiger! Steig mit dem Fuß über den Ball, als gehst du nach links. Und dann schnell nach rechts weg. Trau dich!',
  },
  {
    id: 'striking', cat: 'coordination', emoji: '🎯', title: 'Ballannahme & Schuss',
    goal: 20, unit: 'Schüsse', stars: 2, skill: 'coordination',
    tags: ['PSG', 'Technik', 'Schuss'],
    desc: 'Ball gegen die Wand spielen, sauber annehmen und mit dem Vollspann (Schnürsenkel) zurückschießen. Standbein neben den Ball.',
    cues: ['Standbein neben den Ball', 'Mit dem Spann treffen', 'Fuß fest machen', 'Beide Füße üben'],
    kid: 'Schuss-Technik! Spiel den Ball gegen die Wand. Nimm ihn an. Und schieß mit den Schnürsenkeln zurück. Standbein neben den Ball!',
  },
];

/* ===========================================================
   TRAININGSSTILE — inspiriert von echten Nachwuchs-Philosophien.
   Keine offiziellen/lizenzierten Vereinsprogramme, sondern
   altersgerechte Solo-Adaptionen der öffentlich bekannten Prinzipien.
   =========================================================== */
const ACADEMIES = [
  {
    id: 'allround', name: 'Allround', sub: 'Ausgewogen', emoji: '⚽️', color: '#ffd23f',
    philo: 'Von allem etwas – der perfekte Start.',
    missions: ['toetaps', 'foundations', 'slalom', 'weakfoot', 'juggling', 'trick'],
  },
  {
    id: 'barca', name: 'Barcelona', sub: 'La Masia', emoji: '🔵', color: '#a50044',
    philo: 'Ball zähmen, erster Kontakt, Kopf hoch, schnell denken.',
    missions: ['toetaps', 'foundations', 'croqueta', 'weakfoot', 'slalom', 'trick'],
  },
  {
    id: 'ajax', name: 'Amsterdam', sub: 'Ajax', emoji: '🔴', color: '#d2122e',
    philo: '1-gegen-1, Finten, beide Füße – mutig und kreativ.',
    missions: ['stepover', 'slalom', 'croqueta', 'weakfoot', 'juggling', 'trick'],
  },
  {
    id: 'psg', name: 'Paris', sub: 'PSG-Stil', emoji: '🗼', color: '#1e5aa8',
    philo: 'Saubere Technik plus Explosivität: Schuss, Antritt, Kontrolle.',
    missions: ['striking', 'foundations', 'slalom', 'juggling', 'weakfoot', 'toetaps'],
  },
];
function curAcademy() { return ACADEMIES.find(a => a.id === (S.progress && S.progress.academy)) || ACADEMIES[0]; }
function academyMissions() { return curAcademy().missions.map(id => MISSIONS.find(m => m.id === id)).filter(Boolean); }

const AVATARS = ['🦊', '🦁', '🐯', '🐸', '🐵', '🐼', '🦄', '🐲', '🦖', '⚽️'];
const SKILL_LABELS = { ballControl: 'Ballkontrolle', weakFoot: 'Schwacher Fuß', dribbling: 'Dribbling', coordination: 'Koordination' };

/* ===========================================================
   SPRACHE — das Kernstück für Kinder, die noch nicht lesen.
   Jeder Screen erklärt sich selbst laut.
   =========================================================== */
const VOICE = { enabled: true, countAloud: true, ready: false, voiceName: null };

/* Die deutschen "Spaß-Stimmen" von macOS/iOS klingen schrecklich — meiden. */
const NOVELTY_VOICES = /eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|bells|boing|bubbles|jester|organ|cellos|superstar|trinoids|whisper|wobble|zarvox|albert|bad news|good news|junior|ralph|kathy|fred/i;
/* Bekannte gute/natürliche Kennzeichen. */
const GOOD_VOICE = /siri|premium|enhanced|neural|natural|google/i;
/* Standard-Namen deutscher Systemstimmen (solide, nicht Spaß). */
const STD_DE = /anna|petra|markus|viktoria|helena|martin|yannick/i;

function scoreVoice(v) {
  let s = -1000;
  if (/de[-_]DE/i.test(v.lang)) s = 100;
  else if (/^de/i.test(v.lang)) s = 60;
  else return -1000;
  if (GOOD_VOICE.test(v.name)) s += 50;
  if (/siri/i.test(v.name)) s += 25;              // Siri klingt am natürlichsten
  if (STD_DE.test(v.name)) s += 12;
  if (NOVELTY_VOICES.test(v.name)) s -= 200;      // Spaßstimmen hart abwerten
  if (v.localService) s += 4;
  if (v.default) s += 2;
  return s;
}

/* Alle brauchbaren deutschen Stimmen, beste zuerst */
function germanVoices() {
  try {
    return speechSynthesis.getVoices()
      .filter(v => /^de/i.test(v.lang))
      .map(v => ({ v, score: scoreVoice(v) }))
      .filter(x => x.score > -500)
      .sort((a, b) => b.score - a.score)
      .map(x => x.v);
  } catch (e) { return []; }
}

let deVoice = null;
function pickVoice() {
  try {
    const list = germanVoices();
    // Vom Nutzer gewählte Stimme bevorzugen, sonst die bestbewertete
    deVoice = (VOICE.voiceName && list.find(v => v.name === VOICE.voiceName)) || list[0] || null;
  } catch (e) {}
}
if ('speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

let lastSaid = '', lastSaidTs = 0;
function say(text, opts) {
  const o = opts || {};
  if (!VOICE.enabled || !text || !('speechSynthesis' in window)) return;
  const now = Date.now();
  // Nicht nerven: gleicher Satz nicht innerhalb von 4 s wiederholen
  if (!o.force && text === lastSaid && now - lastSaidTs < 4000) return;
  lastSaid = text; lastSaidTs = now;
  try {
    if (!o.queue) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'de-DE';
    if (deVoice) u.voice = deVoice;
    u.rate = o.rate || 1.0;    // natürliches Tempo
    u.pitch = o.pitch || 1.05; // leicht freundlich, aber nicht künstlich
    if (o.onend) u.onend = o.onend;
    speechSynthesis.speak(u);
  } catch (e) {}
}
function stopSpeaking() { try { speechSynthesis.cancel(); } catch (e) {} }

/* Sprachausgabe muss auf iOS durch eine echte Nutzergeste freigeschaltet werden */
function unlockVoice() {
  if (VOICE.ready) return;
  VOICE.ready = true;
  try { speechSynthesis.speak(new SpeechSynthesisUtterance('')); } catch (e) {}
}
document.addEventListener('pointerdown', () => { unlockVoice(); ac(); }, { once: true });

/* ===========================================================
   SOUND, HAPTIK & KONFETTI — die "Juice", die eine Kinder-App
   lebendig macht. Kein externes Asset, alles im Browser erzeugt.
   =========================================================== */
let AC = null;
function ac() {
  try {
    if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
  } catch (e) {}
  return AC;
}
function tone(freq, startAt, dur, vol, type) {
  const c = ac(); if (!c) return;
  try {
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    o.connect(g); g.connect(c.destination);
    const t = c.currentTime + (startAt || 0);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.18, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.2));
    o.start(t); o.stop(t + (dur || 0.2) + 0.03);
  } catch (e) {}
}
const sfx = {
  tap:     () => tone(880, 0, 0.06, 0.10, 'triangle'),
  pop:     () => { tone(660, 0, 0.09, 0.14); tone(990, 0.05, 0.10, 0.10); },
  success: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.08, 0.28, 0.16)),
  levelup: () => [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, i * 0.11, 0.42, 0.18)),
  badge:   () => [784, 1046, 1318].forEach((f, i) => tone(f, i * 0.10, 0.32, 0.16)),
};
function haptic(ms) { try { navigator.vibrate && navigator.vibrate(ms || 18); } catch (e) {} }

function confetti(count) {
  const host = document.getElementById('confetti');
  if (!host) return;
  const colors = ['#ffd23f', '#35d07f', '#4d8bff', '#ff6b9d', '#a06bff', '#ffa63f'];
  const n = count || 46;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'confetti-piece';
    // deterministische Streuung ohne Math.random (in manchen Umgebungen blockiert)
    const seed = (i * 0.61803398875) % 1;
    const seed2 = (i * 0.7548776662) % 1;
    s.style.left = Math.round(seed * 100) + '%';
    s.style.background = colors[i % colors.length];
    s.style.animationDelay = (seed2 * 0.35).toFixed(2) + 's';
    s.style.animationDuration = (1.7 + seed * 1.1).toFixed(2) + 's';
    s.style.transform = 'rotate(' + Math.round(seed2 * 360) + 'deg)';
    if (i % 3 === 0) s.style.borderRadius = '50%';
    host.appendChild(s);
    setTimeout(() => s.remove(), 3200);
  }
}

/* ===========================================================
   FORTSCHRITT: RÄNGE (Level) & TROPHÄEN (Badges)
   Gibt Kindern ein sichtbares Ziel und Sammel-Motivation.
   =========================================================== */
const RANKS = [
  { xp: 0,    name: 'Anfänger',     emoji: '🐣' },
  { xp: 60,   name: 'Kicker',       emoji: '⚽️' },
  { xp: 180,  name: 'Techniker',    emoji: '🎯' },
  { xp: 400,  name: 'Ballkünstler', emoji: '🌟' },
  { xp: 750,  name: 'Profi',        emoji: '🔥' },
  { xp: 1300, name: 'Legende',      emoji: '👑' },
];
function rankFor(xp) {
  let idx = 0;
  RANKS.forEach((r, i) => { if (xp >= r.xp) idx = i; });
  const rank = RANKS[idx], next = RANKS[idx + 1] || null;
  const progress = next ? (xp - rank.xp) / (next.xp - rank.xp) : 1;
  return { rank, idx, next, progress: Math.max(0, Math.min(1, progress)) };
}

function skillSessions(p, skill) { return p.history.filter(h => h.skill === skill).length; }
const BADGES = [
  { id: 'first',    emoji: '🎯', name: 'Erste Übung',        test: p => p.sessions >= 1 },
  { id: 'video',    emoji: '🎬', name: 'Erstes Video',       test: p => (p.videoCount || 0) >= 1 },
  { id: 'streak3',  emoji: '🔥', name: '3 Tage am Ball',      test: p => p.streak >= 3 },
  { id: 'streak7',  emoji: '🌈', name: '7 Tage am Ball',      test: p => p.streak >= 7 },
  { id: 'juggler',  emoji: '🤹', name: 'Jongleur',           test: p => p.history.some(h => h.missionId === 'juggling') },
  { id: 'weakhero', emoji: '🦶', name: 'Schwacher-Fuß-Held', test: p => skillSessions(p, 'weakFoot') >= 8 },
  { id: 'allday',   emoji: '🏆', name: 'Tag geschafft',       test: p => { const a = ACADEMIES.find(x => x.id === (p.academy || 'allround')) || ACADEMIES[0]; return a.missions.every(id => p.today.doneIds.includes(id)); } },
  { id: 'k500',     emoji: '⚡️', name: '500 Kontakte',        test: p => p.totalContacts >= 500 },
  { id: 'k2000',    emoji: '💫', name: '2000 Kontakte',       test: p => p.totalContacts >= 2000 },
];
function checkBadges(p) {
  if (!p.badges) p.badges = {};
  const fresh = [];
  BADGES.forEach(b => {
    if (!p.badges[b.id] && b.test(p)) { p.badges[b.id] = todayKey(); fresh.push(b); }
  });
  return fresh;
}

/* ---------------- State ---------------- */
const LS_KEY = 'ballhero.v1';
let S = load();

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const st = JSON.parse(raw);
      if (st.voice) {
        VOICE.enabled = st.voice.enabled !== false;
        VOICE.countAloud = st.voice.countAloud !== false;
        VOICE.voiceName = st.voice.voiceName || null;
      }
      return st;
    }
  } catch (e) {}
  return { profile: null, progress: null };
}
function save() {
  try {
    S.voice = { enabled: VOICE.enabled, countAloud: VOICE.countAloud, voiceName: VOICE.voiceName };
    localStorage.setItem(LS_KEY, JSON.stringify(S));
  } catch (e) {}
}

function freshProgress() {
  return {
    xp: 0, streak: 0, lastActiveDate: null,
    totalContacts: 0, totalSeconds: 0, sessions: 0,
    skills: { ballControl: 5, weakFoot: 3, dribbling: 5, coordination: 4 },
    today: { date: todayKey(), doneIds: [], stars: 0 },
    history: [],       // {date, missionId, reps, sec, skill}
    daily: {},         // dateKey -> contacts
    badges: {},        // badgeId -> dateKey earned
    videoCount: 0,
    academy: 'allround',
  };
}

/* Ältere gespeicherte Profile um neue Felder ergänzen */
function migrateProgress(p) {
  if (!p) return;
  if (!p.badges) p.badges = {};
  if (p.videoCount === undefined) p.videoCount = 0;
  if (!p.academy) p.academy = 'allround';
}

/* ---------------- Date helpers ---------------- */
function todayKey(d) { const x = d || new Date(); return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate()); }
function pad(n) { return n < 10 ? '0' + n : '' + n; }
function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }

/* ---------------- Screen router ---------------- */
const screens = ['welcome', 'home', 'mission', 'camera', 'manual', 'progress', 'parent'];
function go(name) {
  screens.forEach(s => document.getElementById('screen-' + s).classList.toggle('active', s === name));
  const nav = document.getElementById('nav');
  const showNav = ['home', 'progress', 'parent'].includes(name);
  nav.classList.toggle('hidden', !showNav);
  if (showNav) document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('active', b.dataset.screen === name));
  window.scrollTo(0, 0);
}

/* ---------------- Boot ---------------- */
function boot() {
  buildAvatarPicker();
  wireStaticEvents();
  if (S.profile && S.progress) {
    ensureDaily();
    go('home');
    renderHome(); renderProgress(); renderParent();
    // Begrüßung erst nach der ersten Nutzergeste (iOS blockt Sprache davor)
    document.addEventListener('pointerdown', () => setTimeout(greetHome, 120), { once: true });
  } else {
    go('welcome');
  }
}

function ensureDaily() {
  const tk = todayKey();
  const p = S.progress;
  migrateProgress(p);
  if (!p.today || p.today.date !== tk) {
    p.today = { date: tk, doneIds: [], stars: 0 };
  }
  // Streak break check: if last active more than 1 day ago, reset streak
  if (p.lastActiveDate) {
    const gap = daysBetween(p.lastActiveDate, tk);
    if (gap > 1) p.streak = 0;
  }
  save();
}

/* ---------------- Onboarding ---------------- */
let selectedAvatar = AVATARS[0];
function buildAvatarPicker() {
  const wrap = document.getElementById('avatarPicker');
  wrap.innerHTML = '';
  AVATARS.forEach((a, i) => {
    const el = document.createElement('button');
    el.className = 'avatar-opt' + (i === 0 ? ' sel' : '');
    el.textContent = a; el.type = 'button';
    el.onclick = () => {
      selectedAvatar = a;
      wrap.querySelectorAll('.avatar-opt').forEach(x => x.classList.remove('sel'));
      el.classList.add('sel');
    };
    wrap.appendChild(el);
  });
}

function createProfile() {
  const name = document.getElementById('kidName').value.trim() || 'Champion';
  const age = parseInt(document.getElementById('kidAge').value, 10) || 6;
  S.profile = { name, age, avatar: selectedAvatar, createdAt: todayKey() };
  S.progress = freshProgress();
  save();
  ensureDaily();
  renderHome(); renderProgress(); renderParent();
  go('home');
  toast('Willkommen, ' + name + '! ⚽️');
  say('Hallo ' + name + '! Such dir eine Übung aus.', { force: true });
}

/* Begrüßung auf dem Start-Screen — sagt, was zu tun ist */
function greetHome() {
  const p = S.progress;
  const list = academyMissions();
  const doneCount = list.filter(m => p.today.doneIds.includes(m.id)).length;
  const left = list.length - doneCount;
  if (left === 0) say('Super! Du hast heute alles geschafft!', { force: true });
  else if (doneCount === 0) say('Hallo ' + S.profile.name + '! Tippe auf eine Übung.', { force: true });
  else say('Noch ' + left + (left === 1 ? ' Übung' : ' Übungen') + '. Weiter so!', { force: true });
}

/* ---------------- Home ---------------- */
function renderAcademyRow() {
  const row = document.getElementById('academyRow');
  if (!row) return;
  const cur = curAcademy();
  row.innerHTML = ACADEMIES.map(a =>
    '<div class="academy-chip' + (a.id === cur.id ? ' sel' : '') + '" data-id="' + a.id + '" style="--acc:' + a.color + '">' +
      '<div class="ac-emoji">' + a.emoji + '</div>' +
      '<div class="ac-name">' + a.name + '</div>' +
      '<div class="ac-sub">' + a.sub + '</div></div>'
  ).join('');
  row.querySelectorAll('.academy-chip').forEach(el => {
    el.onclick = () => {
      const id = el.dataset.id;
      if (id === S.progress.academy) return;
      S.progress.academy = id; save();
      sfx.pop(); haptic(14);
      renderHome();
      const a = curAcademy();
      say(a.name + '-Stil. ' + a.philo, { force: true });
    };
  });
  document.getElementById('academyPhilo').textContent = '„' + cur.philo + '"';
}

function renderHome() {
  const p = S.progress, prof = S.profile;
  document.getElementById('homeAvatar').textContent = prof.avatar;
  document.getElementById('homeName').textContent = prof.name;
  document.getElementById('homeStreak').textContent = p.streak;
  document.getElementById('homeXP').textContent = p.xp;

  // Rang / Level
  const rk = rankFor(p.xp);
  document.getElementById('rankName').textContent = rk.rank.emoji + ' ' + rk.rank.name;
  document.getElementById('rankNext').textContent = rk.next ? 'noch ' + (rk.next.xp - p.xp) + ' XP' : 'Maximum! 👑';
  document.getElementById('rankBar').style.width = Math.round(rk.progress * 100) + '%';

  renderAcademyRow();

  // Heutige Missionen = Übungen des gewählten Stils
  const missions = academyMissions();
  const done = p.today.doneIds;
  const doneCount = missions.filter(m => done.includes(m.id)).length;
  document.getElementById('homeProgressLbl').textContent = doneCount + ' / ' + missions.length + ' erledigt';
  document.getElementById('homeTodayStars').textContent = '⭐ ' + p.today.stars;
  document.getElementById('homeDayBar').style.width = Math.round(doneCount / missions.length * 100) + '%';

  const list = document.getElementById('missionList');
  list.innerHTML = '';
  missions.forEach(m => {
    const isDone = done.includes(m.id);
    const el = document.createElement('div');
    el.className = 'mission' + (isDone ? ' done' : '');
    el.dataset.cat = m.cat;
    el.innerHTML =
      '<div class="emoji">' + m.emoji + '</div>' +
      '<div class="body"><div class="title">' + m.title + '</div>' +
      '<div class="meta">' + m.goal + ' ' + m.unit + '</div></div>' +
      (isDone ? '<div class="check">✓</div>' : '<div class="stars">+' + m.stars + '⭐</div>');
    el.onclick = () => { sfx.pop(); haptic(14); openMission(m.id); };
    list.appendChild(el);
  });

  document.getElementById('allDoneCard').style.display = doneCount === missions.length ? 'block' : 'none';
}

/* ---------------- Mission detail ---------------- */
let currentMission = null;
function openMission(id) {
  const m = MISSIONS.find(x => x.id === id);
  currentMission = m;

  // Animierte Demo — erklärt die Bewegung ohne ein Wort
  document.getElementById('mDemo').innerHTML = demoFor(m.id);

  document.getElementById('mDetailTitle').textContent = m.title;
  document.getElementById('mGoalNum').textContent = m.goal;
  document.getElementById('mGoalUnit').textContent = m.unit;
  // Ziel zusätzlich als Punktreihe, damit "wie viel" auch ohne Zahlenverständnis ankommt
  const dots = Math.min(20, Math.max(5, Math.round(m.goal / 10)));
  document.getElementById('mGoalDots').innerHTML = '<span></span>'.repeat(dots);

  const tags = document.getElementById('mDetailTags');
  tags.innerHTML = m.tags.map(t => '<span class="tag">' + t + '</span>').join('') +
    '<span class="tag">🎯 ' + m.goal + ' ' + m.unit + '</span>';
  document.getElementById('mDetailDesc').textContent = m.desc;
  document.getElementById('mDetailCues').innerHTML =
    m.cues.map(c => '<li><span class="dot">›</span>' + c + '</li>').join('');

  go('mission');
  narrateMission();
}

/* Übung laut erklären + Knopf visuell mitlaufen lassen */
function narrateMission() {
  const btn = document.getElementById('mListen');
  if (!VOICE.enabled) return;
  btn.classList.add('speaking');
  say(currentMission.kid, { force: true, onend: () => btn.classList.remove('speaking') });
  // Sicherheitsnetz, falls onend nicht feuert (kommt auf manchen Geräten vor)
  setTimeout(() => btn.classList.remove('speaking'), 14000);
}

/* ---------------- Manual counting ---------------- */
let manualCount = 0;
function openManual() {
  const m = currentMission;
  manualCount = 0;
  document.getElementById('manDemo').innerHTML = demoFor(m.id);
  document.getElementById('manTitle').textContent = m.title;
  document.getElementById('manGoal').textContent = 'Ziel: ' + m.goal + ' ' + m.unit;
  updateManual();
  go('manual');
  say('Tippe auf das Plus, wenn du es gemacht hast.', { force: true });
}
function updateManual() {
  document.getElementById('manCount').textContent = manualCount;
  const pct = Math.min(100, Math.round(manualCount / currentMission.goal * 100));
  document.getElementById('manBar').style.width = pct + '%';
}

/* Laut mitzählen — kleine Zahlen einzeln, dann nur noch Meilensteine,
   damit es bei 100 Kontakten nicht zur Dauerbeschallung wird. */
function countAloud(n) {
  if (!VOICE.countAloud || !VOICE.enabled) return;
  if (n <= 20) say(String(n), { force: true, rate: 1.15 });
  else if (n % 10 === 0) say(String(n), { force: true, rate: 1.1 });
  const goal = currentMission.goal;
  if (n === goal) say('Geschafft! Super!', { force: true, queue: true });
  else if (n === Math.round(goal / 2)) say('Die Hälfte!', { force: true, queue: true });
}

/* ===========================================================
   RECORDING STUDIO
   Hands-free: the kid props up the phone, steps back, and the
   app guides them by voice, auto-starts and auto-stops.
   =========================================================== */

/* ---------------- Settings ---------------- */
const REC = {
  duration: 30,
  voice: true,
  saveVideo: true,
  phase: 'setup',          // setup | framing | countdown | recording | review
};

/* ---------------- Video storage (IndexedDB) ---------------- */
const DB_NAME = 'ballhero-videos', STORE = 'videos', MAX_VIDEOS = 24;

function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => {
      const db = r.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function dbPut(rec) {
  const db = await idb();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(rec);
    tx.oncomplete = res; tx.onerror = () => rej(tx.error);
  });
}
async function dbAll() {
  const db = await idb();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => res((req.result || []).sort((a, b) => b.ts - a.ts));
    req.onerror = () => rej(req.error);
  });
}
async function dbDelete(id) {
  const db = await idb();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = res; tx.onerror = () => rej(tx.error);
  });
}
async function prune() {
  const all = await dbAll();
  for (const v of all.slice(MAX_VIDEOS)) await dbDelete(v.id);
}

/* ---------------- Voice & sound ---------------- */
let audioCtx = null;
function initAudio() {
  try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  unlockVoice();
}
function beep(freq, ms, vol) {
  if (!audioCtx) return;
  try {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.value = vol || 0.25;
    o.connect(g); g.connect(audioCtx.destination);
    const t = audioCtx.currentTime;
    o.start(t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
    o.stop(t + ms / 1000);
  } catch (e) {}
}
/* Kamera-Ansagen laufen über dieselbe Sprach-Engine wie der Rest der App */
function speak(text, force) {
  if (!REC.voice) return;
  say(text, { force: force });
}

/* ---------------- Keep screen awake ---------------- */
let wakeLock = null;
async function keepAwake() {
  try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (e) {}
}
function releaseAwake() { try { wakeLock && wakeLock.release(); } catch (e) {} wakeLock = null; }

/* ---------------- Pose model ---------------- */
let poseLandmarker = null, poseLoading = false, drawUtils = null;

async function loadPose() {
  if (poseLandmarker || poseLoading) return poseLandmarker;
  poseLoading = true;
  try {
    const vision = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs');
    const { PoseLandmarker, FilesetResolver, DrawingUtils } = vision;
    const fileset = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
    poseLandmarker = await PoseLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numPoses: 1,
    });
    const ctx = document.getElementById('overlay').getContext('2d');
    drawUtils = { util: new DrawingUtils(ctx), PoseLandmarker };
    poseLoading = false;
    return poseLandmarker;
  } catch (e) {
    poseLoading = false;
    console.warn('Pose load failed', e);
    return null;
  }
}

/* ---------------- Camera state ---------------- */
let camStream = null, rafId = null;
let mediaRecorder = null, recChunks = [], recBlob = null, recUrl = null;
let camElapsed = 0, camStartTs = 0, camReps = 0, camTimerInt = null;
let framingOkFrames = 0, countdownRunning = false;
const rep = { baseline: null, state: 'low', lastCountTs: 0, headUpFrames: 0, totalFrames: 0 };

/* ---------------- Entry: setup card ---------------- */
function openCamera() {
  REC.phase = 'setup';
  show('camSetupCard', true); show('camStage', false); show('camReview', false);
  go('camera');
}
function show(id, on) { const el = document.getElementById(id); if (el) el.style.display = on ? '' : 'none'; }

/* ---------------- Begin: start camera + framing ---------------- */
async function camBegin() {
  REC.duration = parseInt(document.querySelector('#durationPicker .dur.sel').dataset.sec, 10) || 30;
  REC.voice = document.getElementById('voiceOn').checked;
  REC.saveVideo = document.getElementById('saveVideoOn').checked;

  initAudio();          // must happen inside the click gesture
  keepAwake();

  show('camSetupCard', false); show('camStage', true); show('camReview', false);
  resetRun();
  setStatus('Kamera wird gestartet…', true);
  renderControls();

  try {
    camStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 720 }, height: { ideal: 1280 } },
      audio: false,
    });
    const video = document.getElementById('cam');
    video.srcObject = camStream;
    await video.play();
    sizeOverlay();

    REC.phase = 'framing';
    setStatus('Stell dich so hin, dass man dich ganz sieht.', true);
    speak('Stell dich so hin, dass man dich ganz sieht.', true);
    renderControls();

    const pl = await loadPose();
    if (pl) { startLoop(); }
    else {
      document.getElementById('camPose').textContent = 'Pose: aus';
      setStatus('Skelett-Erkennung nicht verfügbar — tippe auf Start.', true);
      speak('Tippe auf Start, wenn du bereit bist.', true);
      renderControls();
    }
  } catch (e) {
    console.warn(e);
    setStatus('⚠️ Kamera nicht verfügbar. Nutze „Nur zählen".', true);
    document.getElementById('camHint').textContent = 'Kamera braucht HTTPS oder localhost + Freigabe.';
    renderControls();
  }
}

function resetRun() {
  camReps = 0; camElapsed = 0; framingOkFrames = 0; countdownRunning = false;
  recChunks = []; recBlob = null;
  if (recUrl) { URL.revokeObjectURL(recUrl); recUrl = null; }
  rep.baseline = null; rep.state = 'low'; rep.headUpFrames = 0; rep.totalFrames = 0;
  document.getElementById('camReps').textContent = 'Kontakte: 0';
  document.getElementById('camTimer').textContent = fmtTime(REC.duration);
  document.getElementById('camTimer').classList.remove('huge');
  document.getElementById('camPose').textContent = 'Pose: …';
  document.getElementById('recDot').classList.remove('show');
  document.getElementById('bigCount').classList.remove('show', 'word');
  document.getElementById('frameGuide').className = '';
}

function sizeOverlay() {
  const video = document.getElementById('cam');
  const c = document.getElementById('overlay');
  c.width = video.videoWidth || 720;
  c.height = video.videoHeight || 1280;
}

/* ---------------- Per-phase controls ---------------- */
function renderControls() {
  const el = document.getElementById('camControls');
  if (REC.phase === 'framing') {
    el.innerHTML = '<button class="btn green" id="cForce">▶︎ Jetzt starten</button>' +
      '<button class="btn ghost" id="cExit" style="margin-top:8px">Abbrechen</button>';
    document.getElementById('cForce').onclick = () => startCountdown(true);
  } else if (REC.phase === 'countdown') {
    el.innerHTML = '<button class="btn danger" id="cExit">Abbrechen</button>';
  } else if (REC.phase === 'recording') {
    el.innerHTML = '<button class="btn danger" id="cStop">■ Stopp (für Eltern)</button>';
    document.getElementById('cStop').onclick = () => finishRecording(true);
  } else {
    el.innerHTML = '<button class="btn ghost" id="cExit">Abbrechen</button>';
  }
  const ex = document.getElementById('cExit');
  if (ex) ex.onclick = exitCamera;
}

function setStatus(t, big) {
  const el = document.getElementById('camStatus');
  el.textContent = t;
  el.classList.toggle('big', !!big);
}

/* ---------------- Detection loop ---------------- */
function startLoop() {
  const video = document.getElementById('cam');
  const canvas = document.getElementById('overlay');
  const ctx = canvas.getContext('2d');
  let lastVideoTime = -1;

  const tick = () => {
    rafId = requestAnimationFrame(tick);
    if (!poseLandmarker || video.readyState < 2) return;
    if (video.currentTime === lastVideoTime) return;
    lastVideoTime = video.currentTime;

    let result;
    try { result = poseLandmarker.detectForVideo(video, performance.now()); } catch (e) { return; }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const has = result && result.landmarks && result.landmarks.length;

    if (has) {
      const lm = result.landmarks[0];
      drawUtils.util.drawConnectors(lm, drawUtils.PoseLandmarker.POSE_CONNECTIONS, { color: 'rgba(255,210,63,0.9)', lineWidth: 3 });
      drawUtils.util.drawLandmarks(lm, { radius: 3, color: '#35d07f', lineWidth: 1 });
      document.getElementById('camPose').textContent = 'Pose: erkannt';
      if (REC.phase === 'framing') doFraming(lm);
      if (REC.phase === 'recording') analyze(lm, performance.now());
    } else {
      document.getElementById('camPose').textContent = 'Pose: —';
      if (REC.phase === 'framing') doFraming(null);
    }
  };
  cancelAnimationFrame(rafId);
  tick();
}

/* ---------------- Framing: is the kid fully in frame? ---------------- */
function checkFraming(lm) {
  if (!lm) return { ok: false, msg: 'Ich sehe dich noch nicht 👀', voice: 'Ich sehe dich noch nicht. Stell dich vor die Kamera.' };
  const vis = l => l && (l.visibility === undefined || l.visibility > 0.4);
  const nose = lm[0], la = lm[27], ra = lm[28];
  if (!vis(nose) || (!vis(la) && !vis(ra))) {
    return { ok: false, msg: 'Ich sehe dich nicht ganz — geh zurück!', voice: 'Geh noch ein Stück zurück, ich sehe deine Füße nicht.' };
  }
  const footY = Math.max(vis(la) ? la.y : 0, vis(ra) ? ra.y : 0);
  const headY = nose.y;
  const height = footY - headY;

  if (headY < 0.05) return { ok: false, msg: 'Dein Kopf ist abgeschnitten!', voice: 'Geh noch ein Stück zurück.' };
  if (footY > 0.98) return { ok: false, msg: 'Deine Füße sind abgeschnitten!', voice: 'Geh noch zwei Schritte zurück.' };
  if (height > 0.88) return { ok: false, msg: 'Noch ein Schritt zurück!', voice: 'Geh noch einen Schritt zurück.' };
  if (height < 0.32) return { ok: false, msg: 'Komm ein bisschen näher!', voice: 'Komm ein bisschen näher.' };
  return { ok: true, msg: 'Perfekt! Bleib so stehen 👌', voice: 'Perfekt!' };
}

function doFraming(lm) {
  if (countdownRunning) return;
  const f = checkFraming(lm);
  const guide = document.getElementById('frameGuide');
  guide.className = f.ok ? 'ok' : 'bad';
  setStatus(f.msg, true);
  if (!f.ok) { framingOkFrames = 0; speak(f.voice); return; }

  framingOkFrames++;
  // ~45 frames ≈ 1.5–2 s of stable good framing
  if (framingOkFrames === 8) speak('Perfekt! Gleich geht es los.', true);
  if (framingOkFrames >= 45) startCountdown(false);
}

/* ---------------- Countdown ---------------- */
function startCountdown(forced) {
  if (countdownRunning || REC.phase === 'recording') return;
  countdownRunning = true;
  REC.phase = 'countdown';
  renderControls();
  document.getElementById('frameGuide').className = 'ok';
  setStatus('Gleich geht\'s los…', true);
  if (forced) speak('Achtung, es geht los!', true);

  const big = document.getElementById('bigCount');
  let n = 3;
  const step = () => {
    if (REC.phase !== 'countdown') { big.classList.remove('show', 'word'); return; }
    if (n > 0) {
      big.textContent = n;
      big.classList.remove('word');
      big.classList.remove('show'); void big.offsetWidth; big.classList.add('show');
      beep(660, 160);
      speak(String(n), true);
      n--;
      setTimeout(step, 1000);
    } else {
      big.textContent = 'LOS!';
      big.classList.add('word');
      big.classList.remove('show'); void big.offsetWidth; big.classList.add('show');
      beep(990, 380, 0.35);
      speak('Los!', true);
      setTimeout(() => { big.classList.remove('show', 'word'); beginRecording(); }, 900);
    }
  };
  step();
}

/* ---------------- Recording ---------------- */
function pickMime() {
  const cands = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  if (!window.MediaRecorder) return null;
  for (const m of cands) { try { if (MediaRecorder.isTypeSupported(m)) return m; } catch (e) {} }
  return '';
}

function beginRecording() {
  REC.phase = 'recording';
  countdownRunning = false;
  renderControls();
  document.getElementById('recDot').classList.add('show');
  document.getElementById('camTimer').classList.add('huge');
  document.getElementById('frameGuide').className = '';
  setStatus('Los! Zeig was du kannst 💪', true);

  // start video capture
  recChunks = [];
  if (REC.saveVideo && camStream) {
    const mime = pickMime();
    if (mime !== null) {
      try {
        mediaRecorder = new MediaRecorder(camStream, mime ? { mimeType: mime, videoBitsPerSecond: 2500000 } : undefined);
        mediaRecorder.ondataavailable = e => { if (e.data && e.data.size) recChunks.push(e.data); };
        mediaRecorder.start();
      } catch (e) { console.warn('MediaRecorder failed', e); mediaRecorder = null; }
    }
  }

  camElapsed = 0;
  camStartTs = performance.now();
  let spokeHalf = false, spokeFive = false;
  clearInterval(camTimerInt);
  camTimerInt = setInterval(() => {
    camElapsed = (performance.now() - camStartTs) / 1000;
    const left = Math.max(0, REC.duration - camElapsed);
    document.getElementById('camTimer').textContent = fmtTime(left);
    if (!spokeHalf && left <= REC.duration / 2) { spokeHalf = true; speak('Die Hälfte ist geschafft!', true); }
    if (!spokeFive && left <= 5.4) { spokeFive = true; speak('Noch fünf Sekunden!', true); beep(520, 120); }
    if (left <= 0) finishRecording(false);
  }, 150);
}

function finishRecording(early) {
  if (REC.phase !== 'recording') return;
  clearInterval(camTimerInt);
  REC.phase = 'review';
  document.getElementById('recDot').classList.remove('show');
  document.getElementById('camTimer').classList.remove('huge');

  const secs = Math.max(1, Math.round(Math.min(REC.duration, camElapsed)));
  const headUpPct = rep.totalFrames ? Math.round(rep.headUpFrames / rep.totalFrames * 100) : 0;
  const reps = camReps > 0 ? camReps : Math.round(secs * 2.5);

  beep(880, 200); setTimeout(() => beep(1180, 300), 200);
  speak(early ? 'Aufnahme gestoppt.' : 'Fertig! Super gemacht!', true);
  setStatus('Fertig! 🎉', true);

  pendingResult = { reps, secs, headUpPct, hadPose: camReps > 0 };

  const finalize = () => {
    stopCamera();
    if (recChunks.length) {
      recBlob = new Blob(recChunks, { type: recChunks[0].type || 'video/webm' });
      recUrl = URL.createObjectURL(recBlob);
    }
    showReview();
  };

  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.onstop = finalize;
    try { mediaRecorder.stop(); } catch (e) { finalize(); }
  } else {
    finalize();
  }
}

/* ---------------- Review ---------------- */
let pendingResult = null;

function showReview() {
  show('camStage', false); show('camReview', true);
  const r = pendingResult;
  document.getElementById('reviewSub').textContent =
    r.reps + ' ' + currentMission.unit + ' · ' + r.secs + ' Sekunden' +
    (r.hadPose ? ' · Kopf oben: ' + r.headUpPct + '%' : '');

  const v = document.getElementById('reviewVideo');
  if (recUrl) { v.src = recUrl; v.style.display = ''; }
  else { v.removeAttribute('src'); v.style.display = 'none'; }

  document.getElementById('reviewKeep').textContent = recUrl ? '✓ Speichern & fertig' : '✓ Fertig';
}

async function reviewKeep() {
  if (recBlob && REC.saveVideo) {
    try {
      await dbPut({
        id: 'v' + Date.now(),
        ts: Date.now(),
        date: todayKey(),
        missionId: currentMission.id,
        title: currentMission.title,
        emoji: currentMission.emoji,
        sec: pendingResult.secs,
        reps: pendingResult.reps,
        blob: recBlob,
      });
      await prune();
      S.progress.videoCount = (S.progress.videoCount || 0) + 1;
      save();
    } catch (e) { console.warn('save video failed', e); toast('Video konnte nicht gespeichert werden'); }
  }
  finishSession();
}

function reviewDiscard() {
  recBlob = null;
  if (recUrl) { URL.revokeObjectURL(recUrl); recUrl = null; }
  finishSession();
}

function finishSession() {
  const r = pendingResult;
  const v = document.getElementById('reviewVideo');
  v.pause(); v.removeAttribute('src');
  releaseAwake();
  show('camReview', false);
  completeMission(currentMission, r.reps, r.secs, { headUpPct: r.headUpPct, hadPose: r.hadPose });
  renderVideoList();
}

function reviewRetry() {
  const v = document.getElementById('reviewVideo');
  v.pause(); v.removeAttribute('src');
  if (recUrl) { URL.revokeObjectURL(recUrl); recUrl = null; }
  recBlob = null;
  show('camReview', false);
  camBegin();
}

/* ---------------- Rep detection ---------------- */
function analyze(lm, ts) {
  const la = lm[27], ra = lm[28], lh = lm[23], rh = lm[24];
  const nose = lm[0], ls = lm[11], rs = lm[12];
  if (!la || !ra || !lh || !rh) return;
  rep.totalFrames++;

  const hipY = (lh.y + rh.y) / 2;
  const ankY = (la.y + ra.y) / 2;
  const scale = Math.max(0.15, Math.abs(ankY - hipY));

  const topFoot = Math.min(la.y, ra.y);
  const sig = hipY - topFoot;
  if (rep.baseline === null) rep.baseline = sig;
  rep.baseline = rep.baseline * 0.95 + sig * 0.05;

  const amp = (sig - rep.baseline) / scale;
  const HI = 0.10, LO = 0.03;
  if (rep.state === 'low' && amp > HI) {
    rep.state = 'high';
    if (ts - rep.lastCountTs > 160) {
      camReps++; rep.lastCountTs = ts;
      document.getElementById('camReps').textContent = 'Kontakte: ' + camReps;
      if (camReps === 25) speak('Stark, weiter so!');
    }
  } else if (rep.state === 'high' && amp < LO) {
    rep.state = 'low';
  }

  if (nose && ls && rs) {
    const shoulderY = (ls.y + rs.y) / 2;
    if (nose.y < shoulderY - 0.02) rep.headUpFrames++;
  }
}

/* ---------------- Teardown ---------------- */
function stopCamera() {
  clearInterval(camTimerInt);
  cancelAnimationFrame(rafId);
  if (camStream) { camStream.getTracks().forEach(t => t.stop()); camStream = null; }
  const c = document.getElementById('overlay');
  if (c) { const ctx = c.getContext('2d'); ctx && ctx.clearRect(0, 0, c.width, c.height); }
}

function exitCamera() {
  try { speechSynthesis.cancel(); } catch (e) {}
  clearInterval(camTimerInt);
  countdownRunning = false;
  REC.phase = 'setup';
  stopCamera();
  releaseAwake();
  document.getElementById('bigCount').classList.remove('show', 'word');
  show('camStage', false); show('camReview', false); show('camSetupCard', true);
  go('mission');
}

function fmtTime(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + pad(s % 60); }

/* ---------------- Video library ---------------- */
async function renderVideoList() {
  const list = document.getElementById('videoList');
  const meta = document.getElementById('vidMeta');
  if (!list) return;
  let vids = [];
  try { vids = await dbAll(); } catch (e) {}
  if (!vids.length) {
    list.innerHTML = '<p class="small">Noch keine Videos. Nimm eine Übung mit der Kamera auf.</p>';
    meta.textContent = '';
    return;
  }
  const bytes = vids.reduce((s, v) => s + (v.blob ? v.blob.size : 0), 0);
  meta.textContent = vids.length + ' · ' + (bytes / 1048576).toFixed(1) + ' MB';
  list.innerHTML = vids.map(v =>
    '<div class="vid-item" data-id="' + v.id + '">' +
      '<div class="thumb">' + (v.emoji || '🎬') + '</div>' +
      '<div class="info"><div class="t">' + v.title + '</div>' +
      '<div class="d">' + fmtDate(v.date) + ' · ' + v.reps + ' · ' + v.sec + 's</div></div>' +
      '<div class="play">▶︎</div></div>'
  ).join('');
  list.querySelectorAll('.vid-item').forEach(el => {
    el.onclick = () => playVideo(el.dataset.id);
  });
}

function fmtDate(key) {
  const [y, m, d] = key.split('-');
  return d + '.' + m + '.' + y;
}

let playingId = null, playingUrl = null;
async function playVideo(id) {
  const vids = await dbAll();
  const v = vids.find(x => x.id === id);
  if (!v || !v.blob) return;
  playingId = id;
  if (playingUrl) URL.revokeObjectURL(playingUrl);
  playingUrl = URL.createObjectURL(v.blob);
  document.getElementById('playerTitle').textContent = v.emoji + ' ' + v.title + ' · ' + fmtDate(v.date);
  document.getElementById('playerVideo').src = playingUrl;
  document.getElementById('player').classList.add('show');
}
function closePlayer() {
  const v = document.getElementById('playerVideo');
  v.pause(); v.removeAttribute('src');
  if (playingUrl) { URL.revokeObjectURL(playingUrl); playingUrl = null; }
  document.getElementById('player').classList.remove('show');
}
async function deletePlaying() {
  if (!playingId) return;
  if (!confirm('Dieses Video löschen?')) return;
  await dbDelete(playingId);
  closePlayer();
  renderVideoList();
  toast('Video gelöscht');
}

/* ---------------- Complete mission ---------------- */
function completeMission(m, reps, seconds, extra) {
  const p = S.progress;
  const tk = todayKey();
  const firstToday = !p.today.doneIds.includes(m.id);

  // Stats
  p.totalContacts += reps;
  p.totalSeconds += seconds;
  p.sessions += 1;
  p.daily[tk] = (p.daily[tk] || 0) + reps;
  p.history.push({ date: tk, missionId: m.id, reps, sec: seconds, skill: m.skill });
  if (p.history.length > 400) p.history = p.history.slice(-400);

  // Skill bump (diminishing)
  const cur = p.skills[m.skill] || 0;
  const gain = Math.max(1, Math.round((reps / m.goal) * 8 * (1 - cur / 130)));
  p.skills[m.skill] = Math.min(100, cur + gain);

  // Streak (vor der Badge-Prüfung, damit streak-Badges sofort greifen)
  if (p.lastActiveDate !== tk) {
    const gap = p.lastActiveDate ? daysBetween(p.lastActiveDate, tk) : 1;
    p.streak = gap === 1 ? p.streak + 1 : 1;
    p.lastActiveDate = tk;
  }

  // XP + stars (only first completion per day gives stars)
  let starsEarned = 0;
  const xpBefore = p.xp;
  p.xp += Math.round(reps / 4) + 5;
  if (firstToday) {
    p.today.doneIds.push(m.id);
    starsEarned = m.stars;
    p.today.stars += starsEarned;
  }

  // Level-up? Neue Trophäen?
  const leveledUp = rankFor(p.xp).idx > rankFor(xpBefore).idx;
  const newBadges = checkBadges(p);

  save();
  renderHome(); renderProgress(); renderParent();
  showReward(m, reps, starsEarned, extra, { leveledUp, newBadges });
}

/* ---------------- Reward ---------------- */
function showReward(m, reps, stars, extra, celebrate) {
  celebrate = celebrate || {};
  const leveledUp = celebrate.leveledUp;
  const newBadges = celebrate.newBadges || [];

  const emoji = leveledUp ? rankFor(S.progress.xp).rank.emoji : (stars >= 3 ? '🏅' : (stars > 0 ? '⭐️' : '💪'));
  const praise = leveledUp ? 'NEUES LEVEL!' : pickPraise();
  document.getElementById('rewardEmoji').textContent = emoji;
  document.getElementById('rewardTitle').textContent = praise;
  document.getElementById('rewardStars').textContent = stars > 0 ? '⭐️'.repeat(stars) : '+' + (Math.round(reps / 4) + 5) + ' XP';

  let extraHtml = '';
  if (leveledUp) {
    const r = rankFor(S.progress.xp).rank;
    extraHtml += '<div class="reward-level">' + r.emoji + ' Du bist jetzt <b>' + r.name + '</b>!</div>';
  }
  if (newBadges.length) {
    extraHtml += '<div class="reward-badges">' + newBadges.map(b =>
      '<div class="reward-badge"><span class="be">' + b.emoji + '</span><span>' + b.name + '</span></div>').join('') + '</div>';
  }
  document.getElementById('rewardMsg').innerHTML = extraHtml + buildFeedback(m, reps, extra);
  document.getElementById('reward').classList.add('show');

  // Juice: Konfetti, Ton, Haptik — stärker bei Level-up
  haptic(leveledUp ? [30, 40, 60] : 25);
  if (leveledUp) { confetti(80); sfx.levelup(); }
  else { confetti(stars >= 3 ? 60 : 40); sfx.success(); }
  if (newBadges.length) setTimeout(() => { sfx.badge(); confetti(30); }, 600);

  // Ansage laut — Level-up und Trophäen zuerst, dann Lob + ein Tipp
  let spoken = '';
  if (leveledUp) spoken += 'Neues Level! Du bist jetzt ' + rankFor(S.progress.xp).rank.name + '! ';
  if (newBadges.length) spoken += 'Neue Trophäe: ' + newBadges.map(b => b.name).join(' und ') + '! ';
  if (!leveledUp) spoken += praise.replace(/[⚡️✨]/g, '').trim() + ' ' +
    (stars > 0 ? 'Du hast ' + stars + (stars === 1 ? ' Stern' : ' Sterne') + ' bekommen! ' : '');
  spoken += kidTip(m, extra);
  say(spoken, { force: true });
}

/* Ein einziger, einfacher Tipp — mehr überfordert ein Kind */
function kidTip(m, extra) {
  if (extra && extra.hadPose && extra.headUpPct < 25) return 'Nächstes Mal: schau öfter nach vorne!';
  if (m.skill === 'weakFoot') return 'Toll, dass du den schweren Fuß geübt hast!';
  return m.cues[0] + '.';
}
function pickPraise() {
  const a = ['Super gemacht!', 'Stark! ⚡️', 'Weiter so!', 'Mega!', 'Klasse Arbeit!', 'Ballzauber! ✨'];
  return a[Math.floor(percentSeed() * a.length)];
}
// deterministic-ish seed to avoid Math.random dependency issues in some envs
function percentSeed() { return (S.progress.sessions * 0.6180339887) % 1; }

function buildFeedback(m, reps, extra) {
  let msg = '<b>' + reps + ' ' + m.unit + '</b> geschafft.';
  const tips = [];
  if (extra && extra.hadPose) {
    if (extra.headUpPct < 25) tips.push('👀 Versuch, den Kopf öfter kurz zu heben.');
    else if (extra.headUpPct > 55) tips.push('👀 Toll, dein Kopf war oft oben!');
  }
  if (m.skill === 'weakFoot') tips.push('🦶 Klasse, dass du den schwachen Fuß trainierst!');
  if (m.cat === 'mastery' && reps >= m.goal) tips.push('⚽️ Ziel erreicht — sehr sauber!');
  if (!tips.length) tips.push(m.cues[0] + ' — dranbleiben!');
  return msg + '<br><span class="small">' + tips.slice(0, 2).join('<br>') + '</span>';
}

/* ---------------- Progress ---------------- */
function renderProgress() {
  const p = S.progress;
  migrateProgress(p);
  document.getElementById('statContacts').textContent = p.totalContacts.toLocaleString('de-DE');
  document.getElementById('statSessions').textContent = p.sessions;
  document.getElementById('statStreak').textContent = p.streak;
  document.getElementById('statMinutes').textContent = Math.round(p.totalSeconds / 60);
  document.getElementById('progSubtitle').textContent = 'Seit ' + (S.profile ? S.profile.createdAt : 'Start');

  // Level-Held
  const rk = rankFor(p.xp);
  document.getElementById('levelEmoji').textContent = rk.rank.emoji;
  document.getElementById('levelName').textContent = rk.rank.name;
  document.getElementById('levelBar').style.width = Math.round(rk.progress * 100) + '%';
  document.getElementById('levelNext').textContent = rk.next
    ? 'noch ' + (rk.next.xp - p.xp) + ' XP bis ' + rk.next.name
    : 'Höchstes Level erreicht! 👑';

  // Trophäen-Regal
  const grid = document.getElementById('badgeGrid');
  const earned = p.badges || {};
  document.getElementById('badgeCount').textContent = Object.keys(earned).length + ' / ' + BADGES.length;
  grid.innerHTML = BADGES.map(b => {
    const has = !!earned[b.id];
    return '<div class="badge-item' + (has ? '' : ' locked') + '">' +
      '<div class="badge-emoji">' + (has ? b.emoji : '🔒') + '</div>' +
      '<div class="badge-name">' + b.name + '</div></div>';
  }).join('');

  ['ballControl', 'weakFoot', 'dribbling', 'coordination'].forEach(k => {
    const v = Math.round(p.skills[k] || 0);
    document.getElementById('bar' + cap(k)).style.width = v + '%';
    document.getElementById('lbl' + cap(k)).textContent = v + '%';
  });

  document.getElementById('coachTip').textContent = coachTip();
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function coachTip() {
  const sk = S.progress.skills;
  const weakest = Object.keys(sk).reduce((a, b) => sk[a] < sk[b] ? a : b);
  const tips = {
    ballControl: 'Diese Woche: viele kleine Kontakte. Lieber 6 leichte Berührungen als 2 große.',
    weakFoot: 'Dein schwacher Fuß ist der größte Hebel. Jede Übung einmal rechts, einmal links.',
    dribbling: 'Beim Dribbling: Ball ganz nah am Fuß, bei jedem Hütchen kurz den Kopf heben.',
    coordination: 'Jonglieren & Balance stärken die Koordination — jeden Tag ein paar Minuten.',
  };
  return 'Fokus: ' + SKILL_LABELS[weakest] + '. ' + tips[weakest];
}

/* ---------------- Parent dashboard ---------------- */
function renderParent() {
  const p = S.progress;
  const days = last7Days();
  const max = Math.max(1, ...days.map(d => d.contacts));
  const chart = document.getElementById('weekChart');
  chart.innerHTML = days.map(d => {
    const h = Math.round(d.contacts / max * 100);
    return '<div class="day"><div class="col ' + (d.contacts > 0 ? 'on' : '') + '" style="height:' + h + '%"></div>' +
      '<div class="lbl">' + d.label + '</div></div>';
  }).join('');

  const weekContacts = days.reduce((s, d) => s + d.contacts, 0);
  const weekSessions = p.history.filter(h => days.some(d => d.key === h.date)).length;
  document.getElementById('pWeekContacts').textContent = weekContacts.toLocaleString('de-DE');
  document.getElementById('pWeekSessions').textContent = weekSessions;

  renderVideoList();
  renderVoicePicker();

  // insight + plan
  document.getElementById('parentInsight').textContent = parentInsight(weekContacts, weekSessions);
  document.getElementById('weekPlan').innerHTML = weekPlan();
}

/* Stimmen-Auswahl im Eltern-Bereich: Liste + Test + Geräte-Tipp */
function renderVoicePicker() {
  const sel = document.getElementById('voiceSelect');
  const hint = document.getElementById('voiceHint');
  if (!sel) return;
  const list = germanVoices();

  if (!list.length) {
    sel.innerHTML = '<option>Keine deutsche Stimme gefunden</option>';
    sel.disabled = true;
    hint.innerHTML = deviceVoiceHint(true);
    return;
  }
  sel.disabled = false;
  pickVoice();
  sel.innerHTML = list.map(v => {
    const nice = GOOD_VOICE.test(v.name) ? ' ⭐️' : '';
    const on = (deVoice && v.name === deVoice.name) ? ' selected' : '';
    return '<option value="' + v.name.replace(/"/g, '') + '"' + on + '>' + v.name + nice + '</option>';
  }).join('');
  hint.innerHTML = deviceVoiceHint(false);
}

/* Ehrlicher Hinweis: die wirklich natürlichen Stimmen muss man laden */
function deviceVoiceHint(none) {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/i.test(ua);
  const mac = /Macintosh/i.test(ua) && !ios;
  const withStar = 'Stimmen mit ⭐️ klingen am natürlichsten.';
  if (ios) return (none ? 'Keine gute Stimme aktiv. ' : withStar + ' ') +
    'Für eine echte Stimme: <b>Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Deutsch</b> und z.&nbsp;B. „Anna (Premium)" oder eine Siri-Stimme laden. Danach hier neu wählen.';
  if (mac) return withStar + ' Mehr Stimmen: <b>Systemeinstellungen → Bedienungshilfen → Gesprochene Inhalte → Systemstimme → Stimmen verwalten</b> (z.&nbsp;B. „Anna (Premium)").';
  return withStar + ' Tipp: Chrome bietet oft die natürliche „Google Deutsch"-Stimme.';
}

function last7Days() {
  const out = [];
  const wd = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = todayKey(d);
    out.push({ key, label: wd[d.getDay()], contacts: (S.progress.daily[key] || 0) });
  }
  return out;
}

function parentInsight(weekContacts, weekSessions) {
  const p = S.progress;
  if (weekSessions === 0) return 'Diese Woche noch kein Training. Schon 10 Minuten pro Tag machen einen Unterschied.';
  const sk = p.skills;
  const strong = Object.keys(sk).reduce((a, b) => sk[a] > sk[b] ? a : b);
  const weak = Object.keys(sk).reduce((a, b) => sk[a] < sk[b] ? a : b);
  return S.profile.name + ' hat diese Woche ' + weekContacts.toLocaleString('de-DE') + ' Ballkontakte in ' +
    weekSessions + ' Trainings gemacht. Stärkster Bereich: ' + SKILL_LABELS[strong] +
    '. Fokus nächste Woche: ' + SKILL_LABELS[weak] + '.';
}

function weekPlan() {
  const sk = S.progress.skills;
  const order = Object.keys(sk).sort((a, b) => sk[a] - sk[b]); // weakest first
  const map = {
    ballControl: 'Toe Taps & Foundations',
    weakFoot: 'Schwacher Fuß (Pässe & Sohle)',
    dribbling: 'Slalom-Dribbling',
    coordination: 'Jonglieren & Trick des Tages',
  };
  const plan = ['Mo', 'Mi', 'Fr'].map((day, i) =>
    '<b>' + day + ':</b> ' + map[order[i % order.length]]).join('<br>');
  return '3× pro Woche, je ~15 Min:<br>' + plan + '<br><span class="small">Automatisch an ' +
    S.profile.name + 's Schwächen angepasst.</span>';
}

/* ---------------- Reset / switch ---------------- */
function resetAll() {
  if (!confirm('Wirklich ALLE Daten löschen? Das kann nicht rückgängig gemacht werden.')) return;
  localStorage.removeItem(LS_KEY);
  S = { profile: null, progress: null };
  document.getElementById('kidName').value = '';
  document.getElementById('kidAge').value = '';
  go('welcome');
}
function switchKid() {
  if (!confirm('Neues Profil anlegen? Das aktuelle Profil wird ersetzt.')) return;
  go('welcome');
}

/* ---------------- Toast ---------------- */
let toastT = null;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------------- Events ---------------- */
function wireStaticEvents() {
  document.getElementById('createProfile').onclick = createProfile;

  document.getElementById('missionBack').onclick = () => { stopSpeaking(); go('home'); };
  document.getElementById('startCamera').onclick = () => { stopSpeaking(); openCamera(); };
  document.getElementById('startManual').onclick = () => { stopSpeaking(); openManual(); };
  document.getElementById('mListen').onclick = narrateMission;

  // --- Recording studio ---
  document.getElementById('camBegin').onclick = camBegin;
  document.getElementById('camCancelSetup').onclick = () => go('mission');
  document.querySelectorAll('#durationPicker .dur').forEach(b => {
    b.onclick = () => {
      document.querySelectorAll('#durationPicker .dur').forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
    };
  });
  document.getElementById('reviewKeep').onclick = reviewKeep;
  document.getElementById('reviewRetry').onclick = reviewRetry;
  document.getElementById('reviewDiscard').onclick = reviewDiscard;

  // --- Video player ---
  document.getElementById('playerClose').onclick = closePlayer;
  document.getElementById('playerDelete').onclick = deletePlaying;

  document.getElementById('manualBack').onclick = () => { stopSpeaking(); go('mission'); };
  document.getElementById('manPlus').onclick = () => { manualCount++; updateManual(); countAloud(manualCount); sfx.tap(); haptic(12); };
  document.getElementById('manMinus').onclick = () => { manualCount = Math.max(0, manualCount - 1); updateManual(); };
  document.getElementById('manDone').onclick = () => {
    const reps = manualCount || currentMission.goal;
    const secs = Math.max(20, Math.round(reps * 0.6));
    completeMission(currentMission, reps, secs, { hadPose: false });
  };

  document.getElementById('rewardClose').onclick = () => {
    stopSpeaking();
    document.getElementById('reward').classList.remove('show');
    go('home');
    greetHome();
  };

  document.querySelectorAll('#nav button').forEach(b => {
    b.onclick = () => {
      stopSpeaking();
      const s = b.dataset.screen;
      if (s === 'progress') renderProgress();
      if (s === 'parent') renderParent();
      go(s);
      if (s === 'home') greetHome();
    };
  });

  // --- Sprach-Einstellungen ---
  const vg = document.getElementById('voiceGlobal'), ca = document.getElementById('countAloud');
  vg.checked = VOICE.enabled; ca.checked = VOICE.countAloud;
  vg.onchange = () => {
    VOICE.enabled = vg.checked; save();
    if (VOICE.enabled) say('Vorlesen ist jetzt an.', { force: true }); else stopSpeaking();
  };
  ca.onchange = () => { VOICE.countAloud = ca.checked; save(); };

  // Stimmen-Auswahl + Anhören
  const vsel = document.getElementById('voiceSelect');
  const vtest = document.getElementById('voiceTest');
  if (vsel) vsel.onchange = () => {
    VOICE.voiceName = vsel.value; save(); pickVoice();
    unlockVoice();
    say('Hallo! So klinge ich. Los geht\'s, ' + (S.profile ? S.profile.name : 'Champion') + '!', { force: true });
  };
  if (vtest) vtest.onclick = () => {
    unlockVoice(); pickVoice();
    say('Super gemacht! Weiter so, ' + (S.profile ? S.profile.name : 'Champion') + '!', { force: true });
  };

  // Maskottchen antippen → nochmal begrüßen + freuen
  const mascot = document.getElementById('mascot');
  if (mascot) mascot.onclick = () => {
    mascot.classList.add('happy'); sfx.pop(); haptic(14);
    setTimeout(() => mascot.classList.remove('happy'), 1900);
    greetHome();
  };

  document.getElementById('switchKid').onclick = switchKid;
  document.getElementById('resetAll').onclick = resetAll;

  // If the app is backgrounded mid-run, save what we have instead of losing it
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    if (REC.phase === 'recording') finishRecording(true);
    else if (REC.phase === 'framing' || REC.phase === 'countdown') exitCamera();
  });
}

/* ---------------- Service worker ---------------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

boot();
