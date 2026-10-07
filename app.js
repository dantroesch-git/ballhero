/* ===========================================================
   BallHero Kids — App logic
   No backend. State in localStorage. Pose via MediaPipe (CDN).
   =========================================================== */
'use strict';

/* Backend (Supabase Edge Function) für den Profi-Coach-Report-Push.
   Kinder-Daten sind per RLS gesperrt; nur diese Funktion (Service-Key) liest/schreibt.
   Zugriff nur mit dem unratbaren Profil-Code. */
const BACKEND = 'https://lmymmvudmdvecpawufmm.supabase.co/functions/v1/ballhero-reports';

/* ---------------- Mission catalog ---------------- */
const MISSIONS = [
  {
    id: 'toetaps', cat: 'mastery', emoji: '👟', title: 'Toe Taps',
    goal: 100, unit: 'Kontakte', stars: 3, skill: 'ballControl',
    tags: ['Ballgefühl', 'Rhythmus', 'Beide Füße'],
    desc: 'Tippe abwechselnd mit der Sohle leicht oben auf den Ball – links, rechts, links, rechts. Ganz leichte, schnelle Berührungen.',
    cues: ['Nur die Sohle tippt oben auf den Ball', 'Ganz schnell abwechseln: links, rechts', 'Ball bleibt genau unter dir', 'Alle paar Kontakte kurz hochschauen'],
    kid: 'Toe Taps! Tippe ganz leicht mit der Sohle oben auf den Ball. Links, rechts, links, rechts. Ganz schnell und ganz leicht. Schau ab und zu nach vorne!',
  },
  {
    id: 'foundations', cat: 'mastery', emoji: '↔️', title: 'Foundations',
    goal: 80, unit: 'Kontakte', stars: 3, skill: 'ballControl',
    tags: ['Innenseite', 'Kontrolle'],
    desc: 'Schiebe den Ball mit der Innenseite von einem Fuß zum anderen hin und her. Sauberer, kontrollierter Rhythmus.',
    cues: ['Ball springt von Innenseite zu Innenseite', 'Nur antippen statt wegschieben', 'Füße locker und schnell', 'Knie leicht gebeugt, Oberkörper ruhig'],
    kid: 'Foundations! Schiebe den Ball mit der Innenseite hin und her. Von einem Fuß zum anderen. Immer schön gleichmäßig.',
  },
  {
    id: 'slalom', cat: 'dribbling', emoji: '🏁', title: 'Slalom-Dribbling',
    goal: 60, unit: 'Sekunden', stars: 2, skill: 'dribbling',
    tags: ['Dribbling', 'Richtungswechsel'],
    desc: 'Dribble in kleinen Kontakten durch einen Slalom (Schuhe/Flaschen als Hütchen). Viele Berührungen, enge Führung.',
    cues: ['Ball bleibt dicht am Fuß', 'Eng um jedes Hütchen herum', 'Innen- und Außenseite abwechseln', 'Nach jedem Hütchen kurz hochschauen'],
    kid: 'Slalom! Dribble um die Hütchen herum. Mach ganz viele kleine Berührungen. Der Ball bleibt immer dicht bei deinem Fuß.',
  },
  {
    id: 'weakfoot', cat: 'weakfoot', emoji: '🦶', title: 'Schwacher Fuß',
    goal: 40, unit: 'Kontakte', stars: 3, skill: 'weakFoot',
    tags: ['Schwacher Fuß', 'Riesen-Hebel'],
    desc: 'Nur mit dem schwächeren Fuß: Sohle rollen, Innenseite tippen, kleine Pässe gegen die Wand.',
    cues: ['Nur mit dem schwachen Fuß', 'Lieber langsam und sauber als schnell', 'Gleicher Ablauf wie beim starken Fuß', 'Jeder saubere Kontakt zählt'],
    kid: 'Schwacher Fuß! Jetzt nur mit dem Fuß, der schwerer ist. Ganz langsam und sauber. Das macht dich richtig stark!',
  },
  {
    id: 'juggling', cat: 'coordination', emoji: '🤹', title: 'Jonglieren',
    goal: 30, unit: 'Kontakte', stars: 2, skill: 'coordination',
    tags: ['Koordination', 'Balance'],
    desc: 'Ball hochwerfen und mit dem Fuß hochhalten. Am Anfang: 1 Kontakt, fangen, wieder hoch. Dann steigern.',
    cues: ['Fuß waagerecht, Zehen leicht hoch', 'Ball nur bis Kniehöhe hochtippen', 'Immer die Mitte des Balls treffen', 'Erst ein Kontakt, dann zwei, dann mehr'],
    kid: 'Jonglieren! Halte den Ball mit dem Fuß in der Luft. Wenn er runterfällt, ist das gar nicht schlimm. Einfach nochmal probieren!',
  },
  {
    id: 'trick', cat: 'creativity', emoji: '✨', title: 'Trick des Tages',
    goal: 10, unit: 'Versuche', stars: 2, skill: 'coordination',
    tags: ['Kreativität', 'Spaß'],
    desc: 'Heute: die Sohlen-Rolle (Ball mit der Sohle zur Seite rollen und mit dem anderen Fuß stoppen). Frei ausprobieren!',
    cues: ['Erst ganz langsam Schritt für Schritt', 'Mit links und mit rechts testen', 'Dann Tempo dazugeben', 'Trau dich – einfach ausprobieren'],
    kid: 'Trick des Tages! Rolle den Ball mit der Sohle zur Seite. Und stoppe ihn mit dem anderen Fuß. Trau dich einfach!',
  },

  /* --- Signature-Übungen der Akademien (kindgerecht adaptiert) --- */
  {
    id: 'croqueta', cat: 'dribbling', emoji: '🔀', title: 'La Croqueta',
    goal: 30, unit: 'Wechsel', stars: 3, skill: 'dribbling',
    tags: ['Barça', 'Erster Kontakt', 'Beide Füße'],
    desc: 'Der Iniesta-Trick: den Ball ganz schnell mit der Innenseite von einem Fuß zum anderen schieben, um an einem Gegner vorbeizukommen.',
    cues: ['Ball blitzschnell von Fuß zu Fuß', 'Beide Male mit der Innenseite', 'Ball bleibt flach am Boden', 'Danach sofort weiterlaufen'],
    kid: 'La Croqueta! Schiebe den Ball ganz schnell von einem Fuß zum anderen. Rüber – und weiter. So wie Iniesta beim FC Barcelona!',
  },
  {
    id: 'stepover', cat: 'dribbling', emoji: '🌀', title: 'Übersteiger',
    goal: 20, unit: 'Übersteiger', stars: 3, skill: 'dribbling',
    tags: ['Ajax', 'Finte', 'Kreativität'],
    desc: 'Die Schere: mit dem Fuß außen über den Ball steigen, als gingst du in eine Richtung – und dann in die andere weg.',
    cues: ['Fuß von innen nach außen um den Ball', 'Dabei den Ball nicht berühren', 'Antäuschen, dann in die andere Richtung weg', 'Oberkörper mittäuschen'],
    kid: 'Übersteiger! Steig mit dem Fuß über den Ball, als gehst du nach links. Und dann schnell nach rechts weg. Trau dich!',
  },
  {
    id: 'striking', cat: 'coordination', emoji: '🎯', title: 'Ballannahme & Schuss',
    goal: 20, unit: 'Schüsse', stars: 2, skill: 'coordination',
    tags: ['PSG', 'Technik', 'Schuss'],
    desc: 'Ball gegen die Wand spielen, sauber annehmen und mit dem Vollspann (Schnürsenkel) zurückschießen. Standbein neben den Ball.',
    cues: ['Standbein zeigt neben den Ball', 'Mit dem Spann (Schnürsenkel) treffen', 'Fußgelenk fest machen', 'Kurz aufs Ziel schauen, dann schießen'],
    kid: 'Schuss-Technik! Spiel den Ball gegen die Wand. Nimm ihn an. Und schieß mit den Schnürsenkeln zurück. Standbein neben den Ball!',
  },

  /* ===== Große Übungs-Bibliothek ===== */
  /* --- Ballkontrolle --- */
  {
    id: 'solerolls', cat: 'mastery', emoji: '🦶', title: 'Sohlen-Rollen', demo: 'trick',
    goal: 40, unit: 'Rollen', stars: 2, skill: 'ballControl',
    tags: ['Ballgefühl', 'Sohle'],
    desc: 'Ball mit der Sohle hin und her rollen – ein Fuß rollt ihn zur Seite, der andere stoppt und rollt zurück.',
    cues: ['Ball mit der Sohle zur Seite rollen', 'Sanft rollen statt wegschieben', 'Direkt mit dem anderen Fuß zurück', 'Gleichmäßiger Rhythmus'],
    kid: 'Sohlen-Rollen! Roll den Ball mit der Fußsohle hin und her. Ganz sanft. Der Ball bleibt bei dir.',
  },
  {
    id: 'insideout', cat: 'mastery', emoji: '↩️', title: 'Innen-Außen', demo: 'insideout',
    goal: 40, unit: 'Kontakte', stars: 2, skill: 'ballControl',
    tags: ['Ballgefühl', 'Beide Seiten'],
    desc: 'Ball mit EINEM Fuß antippen: einmal mit der Innenseite, einmal mit der Außenseite – im Zickzack.',
    cues: ['Erst Innenseite, dann Außenseite – selber Fuß', 'Zwei kurze Kontakte hintereinander', 'Ball bleibt dicht am Fuß', 'Dann mit dem anderen Fuß'],
    kid: 'Innen-Außen! Tipp den Ball mit einem Fuß. Erst innen, dann außen. Zickzack. So lernst du beide Seiten!',
  },
  {
    id: 'bells', cat: 'mastery', emoji: '🔔', title: 'Klingeln', demo: 'foundations',
    goal: 50, unit: 'Kontakte', stars: 2, skill: 'ballControl',
    tags: ['Schnelligkeit', 'Ballgefühl'],
    desc: 'Ball ganz schnell mit den Innenseiten zwischen beiden Füßen antippen – wie eine kleine Glocke.',
    cues: ['Ball schnell zwischen den Innenseiten tippen', 'Nur kleine, leichte Berührungen', 'Auf den Fußballen bleiben', 'Ball bleibt in der Mitte'],
    kid: 'Klingeln! Tipp den Ball ganz schnell zwischen deinen Füßen hin und her. Schnell, schnell, schnell!',
  },
  {
    id: 'figure8', cat: 'mastery', emoji: '➰', title: 'Achterschleife', demo: 'croqueta',
    goal: 20, unit: 'Achten', stars: 3, skill: 'ballControl',
    tags: ['Ballführung', 'Beide Füße'],
    desc: 'Ball in einer Acht um beide Beine führen (durch die Beine und außen herum). Toll für Ballgefühl.',
    cues: ['Ball in einer Acht führen', 'Kleine Kontakte, Ball bleibt nah', 'Erst langsam die Form üben', 'Dann in beide Richtungen'],
    kid: 'Achterschleife! Führ den Ball in einer Acht um deine Beine. Langsam und sauber. Wie ein Zauberer!',
  },

  /* --- Dribbling --- */
  {
    id: 'speeddribble', cat: 'dribbling', emoji: '💨', title: 'Tempo-Dribbling', demo: 'run',
    goal: 30, unit: 'Sekunden', stars: 2, skill: 'dribbling',
    tags: ['Tempo', 'Ballführung'],
    desc: 'Mit dem Ball so schnell wie möglich geradeaus laufen – aber der Ball bleibt nah am Fuß.',
    cues: ['Ball mit dem Spann vor dich schieben', 'Nicht zu weit – in Reichweite halten', 'Schnelle Schritte, Ball bleibt vorne', 'Immer wieder kurz hochschauen'],
    kid: 'Tempo-Dribbling! Lauf so schnell du kannst mit dem Ball. Aber er bleibt bei dir – nicht wegschießen!',
  },
  {
    id: 'onevone', cat: 'dribbling', emoji: '⚔️', title: '1-gegen-1', demo: 'run',
    goal: 15, unit: 'Antritte', stars: 3, skill: 'dribbling',
    tags: ['Zweikampf', 'Antritt', 'Deine Stärke'],
    desc: 'Auf ein Hütchen (Gegner) zudribbeln, kurz antäuschen und mit Tempo daran vorbei. Genau deine Stärke!',
    cues: ['Langsam an den Gegner heranfahren', 'Mit dem Körper antäuschen', 'Dann explosiv vorbei', 'Ball sofort mitnehmen'],
    kid: 'Eins gegen eins! Dribbel auf das Hütchen zu, täusch an – und dann ganz schnell vorbei! Das kannst du gut!',
  },
  {
    id: 'cutinside', cat: 'dribbling', emoji: '✂️', title: 'Innenseiten-Cut', demo: 'cut',
    goal: 20, unit: 'Cuts', stars: 3, skill: 'dribbling',
    tags: ['Richtungswechsel', 'Finte'],
    desc: 'Ball antäuschen in eine Richtung und mit der Innenseite scharf in die andere ziehen (abschneiden).',
    cues: ['Mit der Innenseite quer vor dem Körper ziehen', 'Vorher den Körper täuschen', 'Danach sofort beschleunigen', 'Mit beiden Füßen üben'],
    kid: 'Cut! Tu so, als läufst du geradeaus – und zieh den Ball dann scharf zur Seite weg. Überrasch den Gegner!',
  },
  {
    id: 'dragback', cat: 'dribbling', emoji: '⏪', title: 'Zurückziehen', demo: 'dragback',
    goal: 20, unit: 'Züge', stars: 2, skill: 'dribbling',
    tags: ['Finte', 'Sohle'],
    desc: 'Ball mit der Sohle nach vorne stoppen und blitzschnell wieder zurückziehen – dann in eine andere Richtung.',
    cues: ['Sohle oben auf den Ball', 'Ball nach hinten zurückziehen', 'Dann abdrehen und weg', 'Kopf hoch beim Drehen'],
    kid: 'Zurückziehen! Stopp den Ball mit der Sohle und zieh ihn schnell zurück. So drehst du jedem davon!',
  },

  /* --- Schwacher Fuß --- */
  {
    id: 'weakwall', cat: 'weakfoot', emoji: '🧱', title: 'Wandpässe schwacher Fuß', demo: 'striking',
    goal: 25, unit: 'Pässe', stars: 3, skill: 'weakFoot',
    tags: ['Schwacher Fuß', 'Pass'],
    desc: 'Nur mit dem schwächeren Fuß: Ball gegen die Wand passen, annehmen, wieder passen. Sauber und ruhig.',
    cues: ['Nur mit dem schwachen Fuß passen', 'Mit der Innenseite gegen die Wand', 'Standbein zeigt zur Wand', 'Ball ruhig und sauber treffen'],
    kid: 'Schwacher Fuß an der Wand! Spiel den Ball nur mit dem schweren Fuß gegen die Wand. Nimm ihn an, wieder hin. Das macht dich stark!',
  },
  {
    id: 'weakdribble', cat: 'weakfoot', emoji: '🦵', title: 'Dribbling schwacher Fuß', demo: 'run',
    goal: 30, unit: 'Sekunden', stars: 3, skill: 'weakFoot',
    tags: ['Schwacher Fuß', 'Dribbling'],
    desc: 'Nur mit dem schwächeren Fuß dribbeln – kleine Kontakte, Innen- und Außenseite.',
    cues: ['Nur mit dem schwachen Fuß führen', 'Viele kleine Kontakte', 'Innen- und Außenseite nutzen', 'Ruhig bleiben – Übung macht den Meister'],
    kid: 'Schwacher Fuß Dribbling! Führ den Ball nur mit dem schweren Fuß. Klein und sauber. Bald ist er genauso gut!',
  },

  /* --- Koordination / Schnelligkeit --- */
  {
    id: 'quickfeet', cat: 'coordination', emoji: '⚡️', title: 'Schnelle Füße', demo: 'ladder',
    goal: 30, unit: 'Sekunden', stars: 2, skill: 'coordination',
    tags: ['Koordination', 'Fußarbeit'],
    desc: 'Ohne Ball: ganz schnell auf der Stelle die Füße tippen (wie eine Koordinationsleiter). Auf den Fußballen.',
    cues: ['So schnell wie möglich antippen', 'Auf den Fußballen bleiben', 'Kleine, schnelle Schritte', 'Arme locker mitbewegen'],
    kid: 'Schnelle Füße! Tipp ganz schnell mit den Füßen auf den Boden. Wie ein Trommeln. Los, so schnell du kannst!',
  },
  {
    id: 'stopball', cat: 'coordination', emoji: '🛑', title: 'Ball stoppen & Balance', demo: 'stopball',
    goal: 20, unit: 'Stopps', stars: 2, skill: 'coordination',
    tags: ['Balance', 'Kontrolle'],
    desc: 'Ball rollen lassen und mit der Sohle sauber stoppen – kurz auf einem Bein die Balance halten.',
    cues: ['Ball sanft mit der Sohle stoppen', 'Ball liegt sofort ganz still', 'Kurz auf einem Bein balancieren', 'Mit beiden Füßen stoppen'],
    kid: 'Stoppen! Lass den Ball rollen und stopp ihn mit der Sohle. Ganz ruhig. Und halt kurz die Balance!',
  },
  {
    id: 'sprintball', cat: 'coordination', emoji: '🏃', title: 'Antritt mit Ball', demo: 'run',
    goal: 12, unit: 'Sprints', stars: 3, skill: 'coordination',
    tags: ['Antritt', 'Deine Stärke'],
    desc: 'Aus dem Stand explosiv mit dem Ball lossprinten (ein paar Meter), stoppen, zurück. Genau dein Ding!',
    cues: ['Explosiv aus dem Stand losspurten', 'Erste drei Schritte ganz schnell', 'Ball mit dem ersten Kontakt mitnehmen', 'Sauber wieder abstoppen'],
    kid: 'Antritt! Steh still – und dann sprint explosiv mit dem Ball los! Schnell wie eine Rakete. Das ist deine Stärke!',
  },

  /* --- Schuss & Pass --- */
  {
    id: 'wallpass', cat: 'coordination', emoji: '🎾', title: 'Passen gegen die Wand', demo: 'striking',
    goal: 30, unit: 'Pässe', stars: 2, skill: 'coordination',
    tags: ['Pass', 'Beide Füße'],
    desc: 'Ball mit der Innenseite gegen die Wand passen, annehmen, wieder passen – rechts und links.',
    cues: ['Mit der Innenseite gegen die Wand passen', 'Standbein zeigt zur Wand', 'Ball flach und mittig treffen', 'Rückpass direkt annehmen'],
    kid: 'Passen! Spiel den Ball mit der Innenseite gegen die Wand. Nimm ihn an, wieder hin. Rechts und links!',
  },
  {
    id: 'shot', cat: 'coordination', emoji: '🥅', title: 'Torschuss', demo: 'striking',
    goal: 15, unit: 'Schüsse', stars: 3, skill: 'coordination',
    tags: ['Schuss', 'Abschluss'],
    desc: 'Ball hinlegen, kurz Anlauf nehmen und mit dem Vollspann aufs Tor (oder eine Markierung) schießen.',
    cues: ['Standbein neben den Ball', 'Mit dem Spann (Schnürsenkel) treffen', 'Fußgelenk fest, Zehen nach unten', 'Aufs Ziel schauen, dann durchziehen'],
    kid: 'Torschuss! Leg den Ball hin, kurzer Anlauf – und schieß mit den Schnürsenkeln aufs Tor. Zeig deinen harten Schuss!',
  },
];

/* ===========================================================
   AUSRÜSTUNG — jede Übung sagt, was man braucht (+ Heim-Ersatz),
   und ob sie im Zimmer geht. Später: Set direkt in der App kaufen.
   =========================================================== */
const GEAR = {
  ball:     { emoji: '⚽️', label: 'Ball',     alt: 'jeder Ball – ideal ein kleiner Futsal-/Schaumstoffball' },
  wand:     { emoji: '🧱', label: 'Wand',      alt: 'jede glatte Wand' },
  huetchen: { emoji: '🔺', label: 'Hütchen',   alt: 'Schuhe, Flaschen oder Dosen als Markierung' },
  minitor:  { emoji: '🥅', label: 'Mini-Tor',  alt: '2 Schuhe oder Stühle als Torpfosten' },
};
/* Kauf-Sets (Stub – Bezahlung kommt später) */
const GEAR_SHOP = [
  { id: 'huetchen', name: 'Hütchen-Set (10×)', emoji: '🔺', price: '9,90 €' },
  { id: 'ball',     name: 'Futsal-/Schaumstoffball', emoji: '⚽️', price: '14,90 €' },
  { id: 'minitor',  name: 'Faltbares Mini-Tor', emoji: '🥅', price: '24,90 €' },
];
const GEAR_MAP = {
  toetaps:{g:['ball'],s:'zimmer'}, foundations:{g:['ball'],s:'zimmer'},
  slalom:{g:['ball','huetchen'],s:'platz'}, weakfoot:{g:['ball'],s:'zimmer'},
  juggling:{g:['ball'],s:'zimmer'}, trick:{g:['ball'],s:'zimmer'},
  croqueta:{g:['ball'],s:'zimmer'}, stepover:{g:['ball'],s:'zimmer'},
  striking:{g:['ball','wand'],s:'zimmer'}, solerolls:{g:['ball'],s:'zimmer'},
  insideout:{g:['ball'],s:'zimmer'}, bells:{g:['ball'],s:'zimmer'}, figure8:{g:['ball'],s:'zimmer'},
  speeddribble:{g:['ball'],s:'platz'}, onevone:{g:['ball','huetchen'],s:'platz'},
  cutinside:{g:['ball','huetchen'],s:'zimmer'}, dragback:{g:['ball'],s:'zimmer'},
  weakwall:{g:['ball','wand'],s:'zimmer'}, weakdribble:{g:['ball'],s:'zimmer'},
  quickfeet:{g:[],s:'zimmer'}, stopball:{g:['ball'],s:'zimmer'},
  sprintball:{g:['ball'],s:'platz'}, wallpass:{g:['ball','wand'],s:'zimmer'},
  shot:{g:['ball','huetchen','minitor'],s:'platz'},
};
MISSIONS.forEach(m => { const x = GEAR_MAP[m.id] || { g: ['ball'], s: 'zimmer' }; m.gear = x.g; m.space = x.s; });

function ownedGear() { return (S.progress && S.progress.gear) || { ball: true, wand: true, huetchen: false, minitor: false }; }
/* fehlende (nicht besessene) Ausrüstung einer Übung */
function missingGear(m) { const own = ownedGear(); return (m.gear || []).filter(g => !own[g]); }

/* ===========================================================
   TRAININGSSTILE — inspiriert von echten Nachwuchs-Philosophien.
   Keine offiziellen/lizenzierten Vereinsprogramme, sondern
   altersgerechte Solo-Adaptionen der öffentlich bekannten Prinzipien.
   =========================================================== */
const ACADEMIES = [
  {
    id: 'personal', name: 'Mein Plan', sub: 'Für dich', emoji: '⭐️', color: '#35d07f',
    philo: 'Enge Ballführung, Kopf hoch, schwacher Fuß – und dein starker Antritt!',
    missions: ['toetaps', 'onevone', 'weakwall', 'speeddribble', 'cutinside', 'sprintball'],
  },
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
function academyMissions() {
  const a = curAcademy();
  const ids = a.id === 'personal' ? personalPlan() : a.missions;
  return ids.map(id => MISSIONS.find(m => m.id === id)).filter(Boolean);
}

/* ---------------- Ort (drinnen/draußen) + Tagesplan (2/Tag) ---------------- */
function locationPref() { return (S.progress && S.progress.location) || 'drinnen'; }
function indoorOk(m) { return m.space === 'zimmer'; }
function dayOfYear() { const d = new Date(); return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000); }
const DAILY_COUNT = 2;

/* Genau 2 Übungen für heute — passend zum Ort, täglich rotierend, pro Tag stabil. */
function todaysMissions() {
  const p = S.progress;
  const loc = locationPref();
  if (p.today && p.today.planIds && p.today.planDate === p.today.date && p.today.planLoc === loc) {
    const got = p.today.planIds.map(id => MISSIONS.find(m => m.id === id)).filter(Boolean);
    if (got.length) return got;
  }
  let pool = academyMissions();
  if (loc === 'drinnen') {
    const indoor = pool.filter(indoorOk);
    if (indoor.length >= DAILY_COUNT) pool = indoor;
  }
  const pick = [];
  if (pool.length) {
    const off = (dayOfYear() * DAILY_COUNT) % pool.length;
    for (let i = 0; i < DAILY_COUNT && i < pool.length; i++) pick.push(pool[(off + i) % pool.length]);
  }
  const uniq = [...new Map(pick.map(m => [m.id, m])).values()];
  p.today.planIds = uniq.map(m => m.id);
  p.today.planDate = p.today.date;
  p.today.planLoc = loc;
  save();
  return uniq;
}
function setLocation(loc) {
  if (!S.progress) return;
  S.progress.location = loc;
  // Tagesplan neu wählen für den neuen Ort
  if (S.progress.today) { S.progress.today.planIds = null; }
  save();
  renderHome();
  haptic(12);
}

/* ---------------- Medaillen (Leistung pro Übung) ---------------- */
const MEDAL_EMOJI = { gold: '🥇', silver: '🥈', bronze: '🥉' };
const MEDAL_RANK = { bronze: 1, silver: 2, gold: 3 };
const MEDAL_LABEL = { gold: 'Gold', silver: 'Silber', bronze: 'Bronze' };
/* Ziel erreicht = Bronze, 1,5× = Silber, 2× = Gold */
function medalFor(m, reps) {
  const g = goalFor(m);
  if (reps >= g * 2) return 'gold';
  if (reps >= Math.round(g * 1.5)) return 'silver';
  if (reps >= g) return 'bronze';
  return null;
}
function medalCounts() {
  const med = (S.progress && S.progress.medals) || {};
  const c = { gold: 0, silver: 0, bronze: 0 };
  Object.values(med).forEach(v => { if (c[v] != null) c[v]++; });
  return c;
}
function renderMedalCabinet() {
  const tally = document.getElementById('medalTally');
  const gridEl = document.getElementById('medalGrid');
  if (!tally) return;
  const med = (S.progress && S.progress.medals) || {};
  const c = medalCounts();
  const total = c.gold + c.silver + c.bronze;
  const totalEl = document.getElementById('medalTotal');
  if (totalEl) totalEl.textContent = total + ' / ' + MISSIONS.length + ' Übungen';
  tally.innerHTML =
    '<div class="mt-item"><span class="mt-e">🥇</span><span class="mt-n">' + c.gold + '</span></div>' +
    '<div class="mt-item"><span class="mt-e">🥈</span><span class="mt-n">' + c.silver + '</span></div>' +
    '<div class="mt-item"><span class="mt-e">🥉</span><span class="mt-n">' + c.bronze + '</span></div>';
  // Übungen mit Medaille zuerst, dann die ohne (abgeblendet)
  const withM = MISSIONS.filter(m => med[m.id]);
  const noM = MISSIONS.filter(m => !med[m.id]);
  if (!gridEl) return;
  if (!total) {
    gridEl.innerHTML = '<p class="small" style="margin:10px 2px 0">Noch keine Medaille — erreiche das Ziel einer Übung für 🥉, das Doppelte für 🥇.</p>';
    return;
  }
  gridEl.innerHTML = withM.concat(noM).map(m => {
    const v = med[m.id];
    return '<div class="medal-cell' + (v ? '' : ' empty') + '" title="' + m.title + '">' +
      '<span class="mc-ex">' + m.emoji + '</span>' +
      '<span class="mc-med">' + (v ? MEDAL_EMOJI[v] : '▫️') + '</span></div>';
  }).join('');
}

/* ===========================================================
   ALTERSGERECHT — Ziele & Plan hängen vom Alter des Kindes ab.
   Grundlage: FUNdamentals-Phase, FFF/La Masia/Ajax für die Kleinen.
   =========================================================== */
function activeAge() { return (S.profile && S.profile.age) || 6; }
function ageBand(age) {
  age = age || activeAge();
  if (age <= 4) return 'mini';   // 3–4: Spaß, Ballgewöhnung, Koordination
  if (age <= 6) return 'g';      // 5–6: Ballmeisterei, 1-gegen-1, beide Füße, Kreativität
  if (age <= 8) return 'f';      // 7–8: + erster Kontakt, schwacher Fuß, Kopf hoch
  return 'older';
}
const AGE_FACTOR = { mini: 0.3, g: 0.55, f: 0.8, older: 1 };
/* alters-skaliertes Ziel einer Übung (kleine, machbare Häppchen) */
function goalFor(m) {
  const f = AGE_FACTOR[ageBand()] || 1;
  const minG = m.unit === 'Sekunden' ? 15 : 6;
  return Math.max(minG, Math.round(m.goal * f / 5) * 5) || minG;
}
/* alters-passender „Mein Plan" (Top-Nationen-Fokus je Altersband) */
const AGE_PLANS = {
  mini: { philo: 'Ball lieben lernen: spielen, fühlen, Spaß.', missions: ['toetaps', 'solerolls', 'stopball', 'trick', 'insideout', 'juggling'] },
  g:    { philo: 'Ballmeisterei, 1-gegen-1, beide Füße, kreativ — wie bei den Besten.', missions: ['toetaps', 'foundations', 'onevone', 'weakfoot', 'cutinside', 'croqueta'] },
  f:    { philo: 'Enge Ballführung, erster Kontakt, schwacher Fuß, Kopf hoch.', missions: ['toetaps', 'foundations', 'weakwall', 'speeddribble', 'cutinside', 'onevone'] },
  older:{ philo: 'Technik, Tempo, Zweikampf — alles zusammen.', missions: ['toetaps', 'onevone', 'weakwall', 'speeddribble', 'cutinside', 'sprintball'] },
};
function personalPlan() { return (AGE_PLANS[ageBand()] || AGE_PLANS.g).missions; }
function personalPhilo() {
  const p = (AGE_PLANS[ageBand()] || AGE_PLANS.g).philo;
  return p + ' (für ' + activeAge() + ' Jahre)';
}

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
let curClipAudio = null;
function stopSpeaking() {
  try { speechSynthesis.cancel(); } catch (e) {}
  try { if (curClipAudio) { curClipAudio.pause(); curClipAudio.onended = null; curClipAudio = null; } } catch (e) {}
}
/* Spielt vorproduziertes Premium-Audio (voice/<key>.m4a); Fallback = Live-Stimme */
function playClipOrSay(key, fallbackText, onend) {
  if (!VOICE.enabled) { if (onend) onend(); return; }
  stopSpeaking();
  const a = new Audio('voice/' + key + '.m4a');
  curClipAudio = a;
  const fb = () => { if (curClipAudio === a) curClipAudio = null; say(fallbackText, { force: true, onend }); };
  a.onended = () => { if (curClipAudio === a) curClipAudio = null; if (onend) onend(); };
  a.onerror = fb;
  a.play().catch(fb);
}

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
  { id: 'allday',   emoji: '🏆', name: 'Tag geschafft',       test: p => { const ids = (p.today && p.today.planIds) || []; return ids.length > 0 && ids.every(id => p.today.doneIds.includes(id)); } },
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
      // Migration: altes Einzelprofil -> Mehr-Profil-Struktur
      if (!st.profiles) {
        if (st.profile && st.progress) {
          const id = 'p' + Date.now();
          st.profiles = [{ id, profile: st.profile, progress: st.progress }];
          st.activeId = id;
        } else {
          st.profiles = []; st.activeId = null;
        }
      }
      return st;
    }
  } catch (e) {}
  return { profiles: [], activeId: null, profile: null, progress: null };
}
/* S.profile / S.progress zeigen immer aufs aktive Profil (Referenzen in profiles[]) */
function bindActive() {
  const e = S.profiles.find(x => x.id === S.activeId);
  S.profile = e ? e.profile : null;
  S.progress = e ? e.progress : null;
}
function activeEntry() { return S.profiles.find(x => x.id === S.activeId) || null; }
function save() {
  try {
    S.voice = { enabled: VOICE.enabled, countAloud: VOICE.countAloud, voiceName: VOICE.voiceName };
    // aktives Profil im Array aktuell halten (falls Referenz mal ersetzt wurde)
    const e = activeEntry();
    if (e) { e.profile = S.profile; e.progress = S.progress; }
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
    academy: 'personal',
    planSet: true,
    gear: { ball: true, wand: true, huetchen: false, minitor: false },
    medals: {},        // missionId -> 'bronze'|'silver'|'gold' (beste)
    location: 'drinnen',
  };
}

/* Ältere gespeicherte Profile um neue Felder ergänzen */
function migrateProgress(p) {
  if (!p) return;
  if (!p.badges) p.badges = {};
  if (p.videoCount === undefined) p.videoCount = 0;
  if (!p.academy) p.academy = 'allround';
  if (!p.gear) p.gear = { ball: true, wand: true, huetchen: false, minitor: false };
  if (!p.medals) p.medals = {};
  if (!p.location) p.location = 'drinnen';
  // Persönlichen Plan einmalig aktiv setzen (aus der Video-Analyse)
  if (!p.planSet) { p.academy = 'personal'; p.planSet = true; }
}

/* ---------------- Date helpers ---------------- */
function todayKey(d) { const x = d || new Date(); return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate()); }
function pad(n) { return n < 10 ? '0' + n : '' + n; }
function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }

/* ---------------- Screen router ---------------- */
const screens = ['welcome', 'home', 'mission', 'camera', 'manual', 'library', 'progress', 'parent', 'report'];
function go(name) {
  screens.forEach(s => document.getElementById('screen-' + s).classList.toggle('active', s === name));
  const nav = document.getElementById('nav');
  const showNav = ['home', 'library', 'progress', 'parent'].includes(name);
  nav.classList.toggle('hidden', !showNav);
  if (showNav) document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('active', b.dataset.screen === name));
  window.scrollTo(0, 0);
}

/* ---------------- Boot ---------------- */
function boot() {
  buildAvatarPicker();
  wireStaticEvents();
  bindActive();
  if (S.profile && S.progress) {
    ensureDaily();
    go('home');
    renderHome(); renderProgress(); renderParent();
    // Begrüßung erst nach der ersten Nutzergeste (iOS blockt Sprache davor)
    document.addEventListener('pointerdown', () => setTimeout(greetHome, 120), { once: true });
  } else {
    go('welcome');
    let seen = false;
    try { seen = localStorage.getItem('ballhero.onboarded') === '1'; } catch (e) {}
    if (!seen) showOnboarding(false);
  }
}

/* ---------------- Eltern-Onboarding (Willkommens-Tour) ---------------- */
const OB_SLIDES = [
  { emoji: '⚽️', title: 'Willkommen bei BallHero', text: 'Der tägliche Technik-Coach für dein Kind. Kleine Missionen, echter Fortschritt — Schritt für Schritt besser am Ball.' },
  { emoji: '🎥', title: 'So trainiert ihr', text: 'Übung wählen, Animation & Beispielvideo anschauen, dann mit der Kamera aufnehmen. Handy hochkant anlehnen und ca. 3 Schritte zurück — die App zählt von allein los.' },
  { emoji: '🔍', title: 'Gemeinsam besser werden', text: 'Schaut die Aufnahme danach in Zeitlupe an und hakt zusammen ab, was schon klappt. So sieht dein Kind genau, was gut war und woran es noch arbeitet.' },
  { emoji: '🔒', title: 'Sicher & einfach', text: 'Alle Videos und Daten bleiben nur auf diesem Gerät. Keine Anmeldung, keine Werbung. Los geht\'s!' },
];
let obI = 0, obReplay = false;
function showOnboarding(replay) {
  obReplay = !!replay; obI = 0;
  renderOb();
  document.getElementById('onboarding').classList.add('show');
}
function renderOb() {
  const s = OB_SLIDES[obI];
  document.getElementById('obSlide').innerHTML =
    '<div class="ob-emoji">' + s.emoji + '</div><h2>' + s.title + '</h2><p>' + s.text + '</p>';
  document.getElementById('obDots').innerHTML =
    OB_SLIDES.map((_, i) => '<span class="' + (i === obI ? 'on' : '') + '"></span>').join('');
  document.getElementById('obBack').style.visibility = obI === 0 ? 'hidden' : 'visible';
  document.getElementById('obNext').textContent = obI === OB_SLIDES.length - 1 ? 'Los geht\'s ⚽️' : 'Weiter ›';
  document.getElementById('obSkip').style.display = obI === OB_SLIDES.length - 1 ? 'none' : '';
}
function obNext() {
  if (obI < OB_SLIDES.length - 1) { obI++; renderOb(); if (sfx.pop) sfx.pop(); haptic(10); }
  else finishOnboarding();
}
function obBack() { if (obI > 0) { obI--; renderOb(); } }
function finishOnboarding() {
  document.getElementById('onboarding').classList.remove('show');
  try { localStorage.setItem('ballhero.onboarded', '1'); } catch (e) {}
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
  const id = 'p' + Date.now();
  const entry = { id, profile: { name, age, avatar: selectedAvatar, createdAt: todayKey() }, progress: freshProgress() };
  S.profiles.push(entry);
  S.activeId = id;
  bindActive();
  save();
  ensureDaily();
  // Eingabefelder zurücksetzen
  document.getElementById('kidName').value = '';
  document.getElementById('kidAge').value = '';
  renderHome(); renderProgress(); renderParent();
  go('home');
  toast('Willkommen, ' + name + '! ⚽️');
  say('Hallo ' + name + '! Such dir eine Übung aus.', { force: true });
}

/* Zu einem anderen Profil wechseln */
function switchToProfile(id) {
  if (id === S.activeId) { go('home'); return; }
  S.activeId = id;
  bindActive();
  ensureDaily();
  save();
  renderHome(); renderProgress(); renderParent();
  go('home');
  greetHome();
}

/* Profil-Auswahl anzeigen (Kinder-Kacheln + „neu") */
function renderProfileChooser() {
  const wrap = document.getElementById('profileList');
  if (!wrap) return;
  wrap.innerHTML = S.profiles.map(e => {
    const rk = rankFor(e.progress.xp || 0);
    return '<div class="pf-card' + (e.id === S.activeId ? ' active' : '') + '" data-id="' + e.id + '">' +
      '<div class="pf-avatar">' + (e.profile.avatar || '⚽️') + '</div>' +
      '<div class="pf-name">' + e.profile.name + '</div>' +
      '<div class="pf-sub">' + e.profile.age + ' J. · ' + rk.rank.emoji + ' ' + rk.rank.name + '</div>' +
      '<button class="pf-del" data-del="' + e.id + '" title="Löschen">✕</button></div>';
  }).join('') +
    '<div class="pf-card pf-add" data-add="1"><div class="pf-avatar">➕</div><div class="pf-name">Neues Kind</div></div>';

  wrap.querySelectorAll('.pf-card').forEach(el => {
    el.onclick = (ev) => {
      if (ev.target.dataset.del) { deleteProfile(ev.target.dataset.del); return; }
      if (el.dataset.add) { addProfileFlow(); return; }
      sfx.pop(); haptic(14);
      document.getElementById('profileChooser').classList.remove('show');
      switchToProfile(el.dataset.id);
    };
  });
}
function openProfileChooser() {
  renderProfileChooser();
  document.getElementById('profileChooser').classList.add('show');
}
function addProfileFlow() {
  document.getElementById('profileChooser').classList.remove('show');
  document.getElementById('kidName').value = '';
  document.getElementById('kidAge').value = '';
  selectedAvatar = AVATARS[0];
  buildAvatarPicker();
  go('welcome');
}
function deleteProfile(id) {
  const e = S.profiles.find(x => x.id === id);
  if (!e) return;
  if (!confirm('Profil „' + e.profile.name + '" wirklich löschen? Alle Daten dieses Kindes gehen verloren.')) return;
  S.profiles = S.profiles.filter(x => x.id !== id);
  if (S.activeId === id) S.activeId = S.profiles.length ? S.profiles[0].id : null;
  bindActive();
  save();
  if (!S.profiles.length) { document.getElementById('profileChooser').classList.remove('show'); go('welcome'); return; }
  renderProfileChooser();
  renderHome(); renderProgress(); renderParent();
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
  document.getElementById('academyPhilo').textContent = '„' + (cur.id === 'personal' ? personalPhilo() : cur.philo) + '"';
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
  renderLocToggle();

  // Heute: genau 2 Übungen, passend zum Ort
  const missions = todaysMissions();
  const done = p.today.doneIds;
  const medals = p.medals || {};
  const doneCount = missions.filter(m => done.includes(m.id)).length;
  const total = missions.length || DAILY_COUNT;
  document.getElementById('homeProgressLbl').textContent = doneCount + ' / ' + total + ' erledigt';
  document.getElementById('homeTodayStars').textContent = '⭐ ' + p.today.stars;
  document.getElementById('homeDayBar').style.width = Math.round(doneCount / total * 100) + '%';

  const list = document.getElementById('missionList');
  list.innerHTML = '';
  missions.forEach(m => {
    const isDone = done.includes(m.id);
    const med = medals[m.id];
    const el = document.createElement('div');
    el.className = 'mission' + (isDone ? ' done' : '');
    el.dataset.cat = m.cat;
    el.innerHTML =
      '<div class="emoji">' + m.emoji + '</div>' +
      '<div class="body"><div class="title">' + m.title +
        (med ? ' <span class="m-medal" title="Beste Medaille">' + MEDAL_EMOJI[med] + '</span>' : '') + '</div>' +
      '<div class="meta">' + goalFor(m) + ' ' + m.unit + (m.space === 'zimmer' ? ' · 🏠' : ' · 📏') + '</div></div>' +
      (isDone ? '<div class="check">✓</div>' : '<div class="stars">+' + m.stars + '⭐</div>');
    el.onclick = () => { sfx.pop(); haptic(14); openMission(m.id, 'home'); };
    list.appendChild(el);
  });

  document.getElementById('allDoneCard').style.display = (doneCount === total && total > 0) ? 'block' : 'none';
}

/* Ort-Umschalter (drinnen/draußen) */
function renderLocToggle() {
  const box = document.getElementById('locToggle');
  if (!box) return;
  const loc = locationPref();
  box.innerHTML =
    '<button class="loc-chip' + (loc === 'drinnen' ? ' on' : '') + '" data-loc="drinnen">🏠 Drinnen</button>' +
    '<button class="loc-chip' + (loc === 'draußen' ? ' on' : '') + '" data-loc="draußen">🌳 Draußen</button>';
  box.querySelectorAll('.loc-chip').forEach(b => {
    b.onclick = () => { if (b.dataset.loc !== loc) setLocation(b.dataset.loc); };
  });
}

/* ---------------- Übungs-Bibliothek ---------------- */
const SKILL_GROUPS = [
  { skill: 'ballControl',  title: '⚽️ Ballkontrolle' },
  { skill: 'dribbling',    title: '🏃 Dribbling & 1-gegen-1' },
  { skill: 'weakFoot',     title: '🦶 Schwacher Fuß' },
  { skill: 'coordination', title: '⚡️ Koordination, Schuss & Antritt' },
];
let libFilter = 'all';
function libMatches(m) {
  if (libFilter === 'zimmer') return m.space === 'zimmer';
  if (libFilter === 'mine') return missingGear(m).length === 0;
  return true;
}
function renderLibrary() {
  const host = document.getElementById('libraryList');
  if (!host) return;
  const planIds = curAcademy().missions;
  const gearBadge = m => (m.gear || []).map(g => GEAR[g] ? GEAR[g].emoji : '').join('') +
    (m.space === 'zimmer' ? ' 🏠' : ' 📏');
  let any = false;
  host.innerHTML = SKILL_GROUPS.map(g => {
    const drills = MISSIONS.filter(m => m.skill === g.skill && libMatches(m));
    if (!drills.length) return '';
    any = true;
    return '<div class="lib-group"><h3>' + g.title + ' <span class="small">(' + drills.length + ')</span></h3>' +
      '<div class="lib-grid">' + drills.map(m => {
        const inPlan = planIds.includes(m.id);
        const need = missingGear(m).length ? ' need' : '';
        return '<div class="lib-card' + need + '" data-id="' + m.id + '">' +
          (inPlan ? '<div class="lib-star">⭐️</div>' : '') +
          '<div class="lib-emoji">' + m.emoji + '</div>' +
          '<div class="lib-title">' + m.title + '</div>' +
          '<div class="lib-gear">' + gearBadge(m) + '</div></div>';
      }).join('') + '</div></div>';
  }).join('');
  if (!any) host.innerHTML = '<p class="small center" style="margin-top:24px">Keine Übung für diesen Filter. Unter <b>Eltern → Ausrüstung</b> anpassen, was ihr habt.</p>';
  host.querySelectorAll('.lib-card').forEach(el => {
    el.onclick = () => { sfx.pop(); haptic(14); openMission(el.dataset.id, 'library'); };
  });
}

/* ---------------- Mission detail ---------------- */
let currentMission = null;
let missionFrom = 'home';   // wohin „Zurück" führt
function openMission(id, from) {
  if (from) missionFrom = from;
  const m = MISSIONS.find(x => x.id === id);
  currentMission = m;

  // Animierte Demo — erklärt die Bewegung ohne ein Wort
  document.getElementById('mDemo').innerHTML = demoFor(m.demo || m.id);
  const cap = document.getElementById('mDemoCap');
  if (cap) cap.textContent = (m.cues && m.cues[0]) ? '🎯 ' + m.cues[0] : '';

  document.getElementById('mDetailTitle').textContent = m.title;
  document.getElementById('mGoalNum').textContent = goalFor(m);
  document.getElementById('mGoalUnit').textContent = m.unit;
  // Ziel zusätzlich als Punktreihe, damit "wie viel" auch ohne Zahlenverständnis ankommt
  const dots = Math.min(20, Math.max(5, Math.round(goalFor(m) / 10)));
  document.getElementById('mGoalDots').innerHTML = '<span></span>'.repeat(dots);

  const tags = document.getElementById('mDetailTags');
  tags.innerHTML = m.tags.map(t => '<span class="tag">' + t + '</span>').join('') +
    '<span class="tag">🎯 ' + goalFor(m) + ' ' + m.unit + '</span>';
  document.getElementById('mDetailDesc').textContent = m.desc;
  document.getElementById('mDetailCues').innerHTML =
    m.cues.map(c => '<li><span class="dot">›</span>' + c + '</li>').join('');

  renderGearBox(m);
  renderMissionVideos(m);
  renderMissionRecordings(m);

  go('mission');
  narrateMission();
}

/* Eigene Aufnahmen zu DIESER Übung (lokal, pro Kind) — neue hängen unten dran.
   Jede lässt sich ansehen oder direkt in Zeitlupe/Bild-für-Bild analysieren. */
async function renderMissionRecordings(m) {
  const box = document.getElementById('mRecordings');
  if (!box) return;
  let vids = [];
  try { vids = await dbAll(); } catch (e) {}
  vids = vids.filter(v => v.missionId === m.id && (!v.profileId || v.profileId === S.activeId));
  vids.sort((a, b) => a.ts - b.ts); // älteste oben, neueste unten dran
  if (!vids.length) { box.innerHTML = ''; return; }
  box.innerHTML =
    '<div class="recs-head">🎥 Deine Aufnahmen <span class="recs-n">' + vids.length + '</span></div>' +
    '<p class="recs-hint">Schaut sie gemeinsam an — mit 🔍 <b>Zeitlupe</b> Bild für Bild besser werden.</p>' +
    '<div class="recs-list">' + vids.map((v, i) =>
      '<div class="rec-item">' +
        '<div class="rec-n">' + (i + 1) + '</div>' +
        '<div class="rec-info"><div class="rec-t">' + fmtDate(v.date) + '</div>' +
        '<div class="rec-d">' + (v.reps != null ? v.reps + ' · ' : '') + (v.sec || 0) + 's</div></div>' +
        '<button class="rec-btn" data-id="' + v.id + '" data-act="play" aria-label="Ansehen">▶︎</button>' +
        '<button class="rec-btn slow" data-id="' + v.id + '" data-act="slow" aria-label="Zeitlupe">🔍</button>' +
      '</div>').join('') + '</div>';
  box.querySelectorAll('.rec-btn').forEach(b => {
    b.onclick = () => { sfx.pop && sfx.pop(); haptic(12); b.dataset.act === 'slow' ? openSlowmo(b.dataset.id) : playVideo(b.dataset.id); };
  });
}

/* ===========================================================
   ECHTE BEISPIEL-VIDEOS (YouTube-Einbettung, kuratiert)
   Legal: nur einbetten (offizieller Player), nie herunterladen.
   =========================================================== */
const MISSION_VIDEOS = {
  toetaps: [
    { id: 'KaktBhbJUyg', label: 'Ball Mastery (U8–U12)' },
  ],
  foundations: [
    { id: 'p0xM1rLLC9o', label: 'How To: Foundations' },
    { id: 'LfC-nTxvGV0', label: 'Innen/Außen-Touch' },
  ],
  croqueta: [
    { id: 'bYPmNKTHYNw', label: 'How to (Tom Harris)' },
    { id: 'vKmVcf1NQ4A', label: '3 Schritte (FDB)' },
    { id: 'IFUJxXvPg7Q', label: 'Messi in echt' },
  ],
  stepover: [
    { id: 'y1UJrlWu7J8', label: 'Schritt für Schritt' },
  ],
  cutinside: [
    { id: '60nDcFWaa8I', label: 'Inside Cut (U8–U9)' },
    { id: 'nt4ljHSzUfs', label: '5 einfache Moves' },
  ],
  dragback: [
    { id: 'N2tL3QMfvLE', label: 'Für Kids' },
    { id: 'YpuAC0whCY4', label: 'Drag-Back-Turn' },
  ],
  slalom: [
    { id: 'XCoSPAADfXE', label: 'Cone Maze (U8–U12)' },
    { id: 'hXcgw7U6qCw', label: 'Close Control (U9–U12)' },
  ],
  juggling: [
    { id: 'SzZ7Ecql-sg', label: 'Basics für Kids' },
    { id: 'uCwSLF6f5y8', label: 'Super einfach' },
  ],
  shot: [
    { id: '4zn2D__2jwQ', label: 'Mit dem Spann (MOJO)' },
    { id: 'DOsbXTR-XBE', label: 'Schritt für Schritt' },
  ],
  // Deutsche Clips (oEmbed-verifiziert, Freigabe 07.10.26)
  weakfoot: [
    { id: 'xxXfhsGKI98', label: 'Training schwacher Fuß (Kinder)' },
    { id: 'sJV1qZ8kZyY', label: 'Schwacher Fuß — Fußball-Internat' },
  ],
  striking: [
    { id: 'HfV67rCgMI4', label: '9 Varianten der Ballannahme' },
    { id: '13hIPkWR1oU', label: 'Annahme & Mitnahme — Top 3' },
  ],
  solerolls: [
    { id: 'HEr8yv5WBoU', label: 'Technik zuhause — Ballgefühl' },
  ],
  insideout: [
    { id: 'GPyshhYaHrg', label: 'Dribbelslalom — Ballführung' },
    { id: 'VlpqXA1f6Xc', label: 'Inneres & äußeres Viereck' },
  ],
  figure8: [
    { id: 'RxjzfbhATNc', label: 'Übungen mit Hütchen' },
  ],
  speeddribble: [
    { id: 'WdnFYkgI-u4', label: 'Top 10 Dribbling (Kinder)' },
    { id: 'FXAKE-kRgEg', label: 'Dribbling verbessern' },
  ],
  onevone: [
    { id: 'TQWtbbVfaO8', label: 'Clevere Tricks 1-gegen-1' },
    { id: 'Hdh6Hfifq14', label: '6 Skills fürs 1-gegen-1' },
  ],
  weakwall: [
    { id: 'O_3BrYDYRFs', label: 'Passtraining schwacher Fuß' },
  ],
  weakdribble: [
    { id: '8jBTE3BeRe8', label: 'Schwachen Fuß verbessern' },
  ],
  quickfeet: [
    { id: 't89G5t2bC4s', label: 'Schnelle Füße & Antritt' },
  ],
  stopball: [
    { id: 'NqYiqmCYvnA', label: 'Ballkontrolle — Top 8 (Kinder)' },
  ],
  sprintball: [
    { id: '8pJwrDBDV3Y', label: 'Antritt mit Ball (5 Übungen)' },
  ],
  wallpass: [
    { id: 'bzdfu0nFB3o', label: '10 Passübungen alleine' },
    { id: 'PGszElA_a4U', label: 'Passübungen zu zweit' },
  ],
  trick: [
    { id: 'aSnGxTxJ5SQ', label: '5 Skills für Anfänger' },
    { id: '_krm9TtJy4c', label: '6 Tricks in 10 Minuten' },
  ],
};
function renderMissionVideos(m) {
  const box = document.getElementById('mVideos');
  if (!box) return;
  const vids = MISSION_VIDEOS[m.id] || [];
  if (!vids.length) { box.innerHTML = ''; return; }
  box.innerHTML = '<div class="vids-head">🎬 So sieht\'s echt aus</div><div class="vids-row">' +
    vids.map(v => '<div class="vid-thumb" data-yt="' + v.id + '" data-label="' + v.label.replace(/"/g, '') + '">' +
      '<img loading="lazy" src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg" alt="">' +
      '<span class="vt-play">▶︎</span><span class="vt-label">' + v.label + '</span></div>').join('') +
    '</div>';
  box.querySelectorAll('.vid-thumb').forEach(el => {
    el.onclick = () => { sfx.pop(); haptic(12); openYt(el.dataset.yt, el.dataset.label); };
  });
}
function openYt(id, label) {
  stopSpeaking();
  document.getElementById('ytTitle').textContent = '🎬 ' + (label || 'Beispiel');
  document.getElementById('ytFrame').src =
    'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&modestbranding=1&playsinline=1&autoplay=1&cc_load_policy=1&cc_lang_pref=de&hl=de';
  document.getElementById('ytPlayer').classList.add('show');
}
function closeYt() {
  document.getElementById('ytFrame').src = '';
  document.getElementById('ytPlayer').classList.remove('show');
}

/* „Du brauchst" — Ausrüstung mit Heim-Ersatz + Kauf-Hinweis */
function renderGearBox(m) {
  const box = document.getElementById('mGear');
  if (!box) return;
  const gear = m.gear || [];
  const roomTag = m.space === 'zimmer'
    ? '<span class="gear-room ok">🏠 geht im Zimmer</span>'
    : '<span class="gear-room big">📏 braucht etwas Platz (Flur/Garten)</span>';
  if (!gear.length) {
    box.innerHTML = '<div class="gear-head">Du brauchst: <b>nichts</b> 🎉</div>' + roomTag;
    return;
  }
  const own = ownedGear();
  const items = gear.map(g => {
    const it = GEAR[g]; if (!it) return '';
    const have = own[g];
    return '<div class="gear-item' + (have ? ' have' : '') + '">' +
      '<span class="gi-emoji">' + it.emoji + '</span>' +
      '<div class="gi-body"><div class="gi-label">' + it.label + (have ? ' ✓' : '') + '</div>' +
      (have ? '' : '<div class="gi-alt">zuhause: ' + it.alt + '</div>') + '</div></div>';
  }).join('');
  const missing = missingGear(m);
  const buy = missing.filter(g => GEAR_SHOP.some(s => s.id === g));
  const buyBtn = buy.length
    ? '<button class="btn secondary sm mt" id="mGearBuy">🛒 Fehlende Ausrüstung (bald kaufbar)</button>'
    : '';
  box.innerHTML = '<div class="gear-head">Du brauchst:</div><div class="gear-list">' + items + '</div>' + roomTag + buyBtn;
  const bb = document.getElementById('mGearBuy');
  if (bb) bb.onclick = () => openShop();
}

/* Übung laut erklären + Knopf visuell mitlaufen lassen */
function narrateMission() {
  const btn = document.getElementById('mListen');
  if (!VOICE.enabled) return;
  btn.classList.add('speaking');
  const done = () => btn.classList.remove('speaking');
  // Premium-Audio bevorzugen, sonst Live-Stimme
  playClipOrSay('kid_' + currentMission.id, currentMission.kid, done);
  // Sicherheitsnetz, falls onended nicht feuert
  setTimeout(done, 15000);
}

/* ---------------- Manual counting ---------------- */
let manualCount = 0;
function openManual() {
  const m = currentMission;
  manualCount = 0;
  document.getElementById('manDemo').innerHTML = demoFor(m.demo || m.id);
  document.getElementById('manTitle').textContent = m.title;
  document.getElementById('manGoal').textContent = 'Ziel: ' + goalFor(m) + ' ' + m.unit;
  updateManual();
  go('manual');
  say('Tippe auf das Plus, wenn du es gemacht hast.', { force: true });
}
function updateManual() {
  document.getElementById('manCount').textContent = manualCount;
  const pct = Math.min(100, Math.round(manualCount / goalFor(currentMission) * 100));
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
let camFacing = 'environment';   // 'environment' = Rückkamera (Standard fürs Filmen), 'user' = Frontkamera
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
      video: { facingMode: { ideal: camFacing }, width: { ideal: 720 }, height: { ideal: 1280 } },
      audio: false,
    });
    const video = document.getElementById('cam');
    video.srcObject = camStream;
    video.style.transform = camFacing === 'user' ? 'scaleX(-1)' : '';
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

/* Kamera wechseln (vorne/hinten) — funktioniert während Aufbau & Aufnahme */
async function flipCamera() {
  camFacing = camFacing === 'environment' ? 'user' : 'environment';
  try {
    if (camStream) camStream.getTracks().forEach(t => t.stop());
    camStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: camFacing }, width: { ideal: 720 }, height: { ideal: 1280 } },
      audio: false,
    });
    const video = document.getElementById('cam');
    video.srcObject = camStream;
    video.style.transform = camFacing === 'user' ? 'scaleX(-1)' : '';
    await video.play();
    sizeOverlay();
    setStatus(camFacing === 'user' ? 'Frontkamera 🤳' : 'Rückkamera 📷', true);
  } catch (e) {
    console.warn(e);
    setStatus('⚠️ Diese Kamera geht nicht — zurückgewechselt.', true);
    camFacing = camFacing === 'environment' ? 'user' : 'environment';
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
        profileId: S.activeId,
        profileName: S.profile ? S.profile.name : '',
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
  if (currentMission) renderMissionRecordings(currentMission);
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
  // nur Videos des aktiven Kindes (Alt-Videos ohne profileId zeigen wir überall)
  vids = vids.filter(v => !v.profileId || v.profileId === S.activeId);
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

let playingId = null, playingUrl = null, playingBlob = null, playingMeta = null;
async function playVideo(id) {
  const vids = await dbAll();
  const v = vids.find(x => x.id === id);
  if (!v || !v.blob) return;
  playingId = id;
  playingBlob = v.blob;
  playingMeta = { title: v.title, date: v.date, missionId: v.missionId };
  if (playingUrl) URL.revokeObjectURL(playingUrl);
  playingUrl = URL.createObjectURL(v.blob);
  document.getElementById('playerTitle').textContent = v.emoji + ' ' + v.title + ' · ' + fmtDate(v.date);
  document.getElementById('playerVideo').src = playingUrl;
  document.getElementById('playerDlHint').textContent = '';
  document.getElementById('player').classList.add('show');
}

/* Direkt in die Zeitlupe/Analyse springen (ohne den normalen Player). */
async function openSlowmo(id) {
  const vids = await dbAll();
  const v = vids.find(x => x.id === id);
  if (!v || !v.blob) return;
  playingId = id;
  playingBlob = v.blob;
  playingMeta = { title: v.title, date: v.date, missionId: v.missionId };
  if (playingUrl) URL.revokeObjectURL(playingUrl);
  playingUrl = URL.createObjectURL(v.blob);
  openAnalyzer();
}

/* Video speichern — zuerst direkt in den BallHero-Ordner (lokaler Server),
   sonst als normaler Download (Handy / deployte Version). */
function videoFileName() {
  const type = playingBlob.type || '';
  const ext = type.includes('mp4') ? 'mp4' : (type.includes('webm') ? 'webm' : 'mp4');
  const safe = (playingMeta && playingMeta.title ? playingMeta.title : 'Uebung').replace(/[^\w]+/g, '');
  return 'BallHero_' + safe + '_' + (playingMeta ? playingMeta.date : todayKey()) + '.' + ext;
}
async function downloadPlaying() {
  if (!playingBlob) return;
  const name = videoFileName();
  const hint = document.getElementById('playerDlHint');
  hint.textContent = 'Speichere…';
  // 1) Versuch: direkt in den BallHero-Ordner (aufnahmen/) auf dem Mac
  try {
    const res = await fetch('/save?name=' + encodeURIComponent(name), {
      method: 'POST',
      headers: { 'Content-Type': playingBlob.type || 'video/mp4' },
      body: playingBlob,
    });
    if (res.ok) {
      const j = await res.json().catch(() => ({}));
      hint.textContent = '✅ Gespeichert im BallHero-Ordner: aufnahmen/' + (j.name || name);
      haptic(14);
      return;
    }
  } catch (e) { /* kein lokaler Server → Download-Fallback */ }
  // 2) Fallback: normaler Browser-Download
  try {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(playingBlob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    hint.textContent = 'Als „' + name + '" in Downloads gespeichert. Am Handy: per AirDrop an den Mac.';
  } catch (e) {
    hint.textContent = 'Speichern hat nicht geklappt.';
  }
}
function closePlayer() {
  const v = document.getElementById('playerVideo');
  v.pause(); v.removeAttribute('src');
  if (playingUrl) { URL.revokeObjectURL(playingUrl); playingUrl = null; }
  playingBlob = null;
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

/* ===========================================================
   ANALYSE-WERKZEUG (Hudl-Technique-Stil)
   Zeitlupe · Bild-für-Bild · aufs Video zeichnen (Telestrator)
   =========================================================== */
const AN = { url: null, dur: 0, speeds: [1, 0.5, 0.25], si: 0, drawing: false,
  colors: ['#ff5a5a', '#ffd23f', '#35d07f', '#4d8bff', '#ffffff'], ci: 0,
  strokes: [], cur: null, dpr: 1, raf: null };
const FRAME_STEP = 1 / 30;

function openAnalyzer() {
  if (!playingBlob) return;
  const v = document.getElementById('anVideo');
  if (AN.url) URL.revokeObjectURL(AN.url);
  AN.url = URL.createObjectURL(playingBlob);
  v.src = AN.url;
  v.playbackRate = 1; AN.si = 0; document.getElementById('anSpeed').textContent = '1×';
  AN.strokes = []; AN.cur = null;
  AN.drawing = false; document.getElementById('anDraw').classList.remove('on');
  AN.ci = 0; document.getElementById('anColorDot').style.background = AN.colors[0];
  document.getElementById('anTitle').textContent = playingMeta ? (playingMeta.title || 'Analyse') : 'Analyse';
  renderAnCheck(playingMeta && playingMeta.missionId);
  document.getElementById('anPlay').textContent = '▶︎';
  document.getElementById('analyzer').classList.add('show');
  v.onloadedmetadata = () => { AN.dur = v.duration || 0; sizeAnCanvas(); redrawAn(); };
  v.ontimeupdate = () => {
    if (AN.dur) document.getElementById('anScrub').value = Math.round(v.currentTime / AN.dur * 1000);
    document.getElementById('anTime').textContent = v.currentTime.toFixed(2) + 's';
  };
  v.onended = () => { document.getElementById('anPlay').textContent = '▶︎'; };
  setTimeout(sizeAnCanvas, 60);
}
/* Selbst-Check: „Darauf achten"-Punkte der Übung zum gemeinsamen Abhaken.
   Rein visuelle Hilfe fürs Auswerten — Haken werden nicht gespeichert. */
function renderAnCheck(missionId) {
  const box = document.getElementById('anCheck');
  if (!box) return;
  const m = MISSIONS.find(x => x.id === missionId);
  const points = (m && m.cues ? m.cues : []).slice(0, 3);
  if (!points.length) { box.innerHTML = ''; return; }
  box.innerHTML =
    '<div class="an-check-head">👀 Schaut gemeinsam — hat das geklappt?</div>' +
    points.map((p, i) =>
      '<button class="an-check-item" data-i="' + i + '"><span class="acc-box">⬜</span><span>' + p + '</span></button>'
    ).join('');
  box.querySelectorAll('.an-check-item').forEach(el => {
    el.onclick = () => {
      const on = el.classList.toggle('on');
      el.querySelector('.acc-box').textContent = on ? '✅' : '⬜';
      haptic(10);
    };
  });
}

function closeAnalyzer() {
  const v = document.getElementById('anVideo');
  v.pause(); v.removeAttribute('src'); v.load();
  if (AN.url) { URL.revokeObjectURL(AN.url); AN.url = null; }
  document.getElementById('analyzer').classList.remove('show');
}
function sizeAnCanvas() {
  const c = document.getElementById('anCanvas'), stage = document.getElementById('anStage');
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return;
  AN.dpr = window.devicePixelRatio || 1;
  c.width = Math.round(w * AN.dpr); c.height = Math.round(h * AN.dpr);
  const ctx = c.getContext('2d'); ctx.setTransform(AN.dpr, 0, 0, AN.dpr, 0, 0);
  redrawAn();
}
function redrawAn() {
  const c = document.getElementById('anCanvas'); if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const all = AN.cur ? AN.strokes.concat([AN.cur]) : AN.strokes;
  all.forEach(s => {
    if (s.points.length < 2) return;
    ctx.strokeStyle = s.color; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(s.points[0].x, s.points[0].y);
    for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x, s.points[i].y);
    ctx.stroke();
  });
}
function anPoint(ev) {
  const c = document.getElementById('anCanvas'); const r = c.getBoundingClientRect();
  const p = ev.touches ? ev.touches[0] : ev;
  return { x: p.clientX - r.left, y: p.clientY - r.top };
}
function anStepFrame(dir) {
  const v = document.getElementById('anVideo');
  v.pause(); document.getElementById('anPlay').textContent = '▶︎';
  v.currentTime = Math.max(0, Math.min(AN.dur || 0, v.currentTime + dir * FRAME_STEP));
}
function wireAnalyzer() {
  const v = document.getElementById('anVideo'), c = document.getElementById('anCanvas');
  document.getElementById('anClose').onclick = closeAnalyzer;
  document.getElementById('anBack').onclick = () => anStepFrame(-1);
  document.getElementById('anFwd').onclick = () => anStepFrame(1);
  document.getElementById('anPlay').onclick = () => {
    if (v.paused) { v.play(); document.getElementById('anPlay').textContent = '❚❚'; }
    else { v.pause(); document.getElementById('anPlay').textContent = '▶︎'; }
  };
  document.getElementById('anSpeed').onclick = () => {
    AN.si = (AN.si + 1) % AN.speeds.length; v.playbackRate = AN.speeds[AN.si];
    document.getElementById('anSpeed').textContent = AN.speeds[AN.si] + '×';
  };
  document.getElementById('anDraw').onclick = () => {
    AN.drawing = !AN.drawing;
    document.getElementById('anDraw').classList.toggle('on', AN.drawing);
  };
  document.getElementById('anColor').onclick = () => {
    AN.ci = (AN.ci + 1) % AN.colors.length;
    document.getElementById('anColorDot').style.background = AN.colors[AN.ci];
  };
  document.getElementById('anClear').onclick = () => { AN.strokes = []; AN.cur = null; redrawAn(); };
  document.getElementById('anScrub').oninput = (e) => {
    if (AN.dur) { v.pause(); document.getElementById('anPlay').textContent = '▶︎'; v.currentTime = e.target.value / 1000 * AN.dur; }
  };
  // Zeichnen per Pointer
  const start = (ev) => { if (!AN.drawing) return; ev.preventDefault(); AN.cur = { color: AN.colors[AN.ci], points: [anPoint(ev)] }; };
  const move = (ev) => { if (!AN.drawing || !AN.cur) return; ev.preventDefault(); AN.cur.points.push(anPoint(ev)); redrawAn(); };
  const end = () => { if (AN.cur) { AN.strokes.push(AN.cur); AN.cur = null; redrawAn(); } };
  c.addEventListener('pointerdown', start); c.addEventListener('pointermove', move);
  c.addEventListener('pointerup', end); c.addEventListener('pointerleave', end);
  window.addEventListener('resize', sizeAnCanvas);
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
  const gain = Math.max(1, Math.round((reps / goalFor(m)) * 8 * (1 - cur / 130)));
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

  // Medaille (Leistung): beste pro Übung merken
  if (!p.medals) p.medals = {};
  const medal = medalFor(m, reps);
  let medalUp = false;
  if (medal) {
    const prev = p.medals[m.id];
    if (!prev || MEDAL_RANK[medal] > MEDAL_RANK[prev]) { p.medals[m.id] = medal; medalUp = true; }
  }

  // Level-up? Neue Trophäen?
  const leveledUp = rankFor(p.xp).idx > rankFor(xpBefore).idx;
  const newBadges = checkBadges(p);

  save();
  renderHome(); renderProgress(); renderParent();
  showReward(m, reps, starsEarned, extra, { leveledUp, newBadges, medal, medalUp });
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
  if (celebrate.medal) {
    extraHtml += '<div class="reward-medal">' + MEDAL_EMOJI[celebrate.medal] + ' ' +
      (celebrate.medalUp ? 'Neue Bestleistung: ' : '') + MEDAL_LABEL[celebrate.medal] + '-Medaille!</div>';
  }
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
  if (m.cat === 'mastery' && reps >= goalFor(m)) tips.push('⚽️ Ziel erreicht — sehr sauber!');
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

  // Medaillenspiegel
  renderMedalCabinet();

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
  renderGearSettings();
  renderAnalysisCard();
  loadReport();

  // insight + plan
  document.getElementById('parentInsight').textContent = parentInsight(weekContacts, weekSessions);
  document.getElementById('weekPlan').innerHTML = weekPlan();
}

/* Ausrüstung besitzen/verwalten + Set-Shop (Stub) */
function renderGearSettings() {
  const ownWrap = document.getElementById('gearOwn');
  const shopWrap = document.getElementById('gearShop');
  if (!ownWrap) return;
  const own = ownedGear();
  ownWrap.innerHTML = Object.keys(GEAR).map(g => {
    const it = GEAR[g];
    return '<label class="toggle"><input type="checkbox" data-gear="' + g + '"' + (own[g] ? ' checked' : '') + '>' +
      '<span>' + it.emoji + ' ' + it.label + ' <span class="small">(' + it.alt + ')</span></span></label>';
  }).join('');
  ownWrap.querySelectorAll('input[data-gear]').forEach(inp => {
    inp.onchange = () => {
      if (!S.progress.gear) S.progress.gear = {};
      S.progress.gear[inp.dataset.gear] = inp.checked;
      save();
    };
  });
  if (shopWrap) shopWrap.innerHTML = GEAR_SHOP.map(s =>
    '<div class="shop-item"><span class="shop-emoji">' + s.emoji + '</span>' +
    '<div class="shop-body"><div class="shop-name">' + s.name + '</div>' +
    '<div class="small">' + s.price + '</div></div>' +
    '<button class="btn secondary sm shop-buy" data-buy="' + s.id + '">Bald</button></div>'
  ).join('');
  if (shopWrap) shopWrap.querySelectorAll('.shop-buy').forEach(b => {
    b.onclick = () => toast('Set-Shop kommt bald — bis dahin Ersatz-Tipp nutzen 🙂');
  });
}
function openShop() {
  go('parent'); renderParent();
  setTimeout(() => { const el = document.getElementById('gearShop'); if (el) el.scrollIntoView({ block: 'center' }); }, 60);
}

/* ===========================================================
   PROFI-COACH-ANALYSE (Report + Trigger)
   Pilot (Wizard-of-Oz): Eltern fordern an → wir erstellen
   reports/<profilId>.json auf dem Laptop → App lädt & zeigt ihn.
   =========================================================== */
/* Unratbarer Code pro Profil = „Schlüssel" zum Report (kein Login nötig). */
function ensureShareCode() {
  if (!S.progress) return null;
  if (!S.progress.shareCode) {
    const a = new Uint8Array(14); crypto.getRandomValues(a);
    S.progress.shareCode = [...a].map(b => b.toString(36)).join('').slice(0, 20);
    save();
  }
  return S.progress.shareCode;
}
async function loadReport() {
  const code = ensureShareCode();
  if (!code) return;
  try {
    const res = await fetch(BACKEND + '?code=' + encodeURIComponent(code), { cache: 'no-store' });
    if (!res.ok) return;
    const j = await res.json();
    if (j.status === 'ready' && j.report) {
      const cur = S.progress.report || {};
      // neuer Report (anderer Zeitstempel) → als „fertig" übernehmen
      if (!cur.data || cur.data.ts !== j.report.ts) {
        S.progress.report = { status: 'ready', data: j.report };
        save();
        renderAnalysisCard();
      }
    }
  } catch (e) { /* offline → ignorieren */ }
}
function requestAnalysis() {
  const code = ensureShareCode();
  S.progress.report = { status: 'pending', requestedAt: Date.now(), data: (S.progress.report && S.progress.report.data) || null };
  save();
  renderAnalysisCard();
  toast('Analyse angefordert 🔍');
  say('Alles klar! Deine Profi-Analyse kommt in ein paar Stunden.', { force: true });
  if (code) {
    fetch(BACKEND, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, profileName: S.profile.name, age: S.profile.age }),
    }).catch(() => { /* Anfrage wird beim nächsten Öffnen erneut versucht */ });
  }
}
function renderAnalysisCard() {
  const card = document.getElementById('analysisCard');
  if (!card) return;
  const r = S.progress.report || { status: 'none' };
  if (r.status === 'ready' && r.data) {
    card.innerHTML = '<h3>🏅 Profi-Coach-Analyse</h3>' +
      '<p class="small" style="margin:4px 0 10px">Fertig für <b>' + (r.data.profileName || S.profile.name) + '</b>' +
      (r.data.dateLabel ? ' · ' + r.data.dateLabel : '') + '</p>' +
      '<button class="btn green" id="repOpen">✅ Analyse ansehen</button>' +
      '<button class="btn secondary mt" id="repAgain">🔍 Neue Analyse anfordern</button>';
    document.getElementById('repOpen').onclick = () => openReport();
    document.getElementById('repAgain').onclick = () => requestAnalysis();
  } else if (r.status === 'pending') {
    card.innerHTML = '<h3>⏳ Analyse läuft…</h3>' +
      '<p class="small" style="margin-top:4px">Dein Coach schaut sich das Video an — das Ergebnis ist in ein paar Stunden hier. Du kannst die App normal weiter nutzen.</p>';
  } else {
    card.innerHTML = '<h3>🏅 Profi-Coach-Analyse</h3>' +
      '<p class="small" style="margin:4px 0 10px">Lass die Technik deines Kindes vom Coach analysieren — mit klaren Tipps & Challenge. Nimm eine Übung mit der Kamera auf und fordere die Analyse an.</p>' +
      '<button class="btn" id="repRequest">🔍 Profi-Analyse anfordern</button>';
    document.getElementById('repRequest').onclick = () => requestAnalysis();
  }
}
function openReport() {
  const r = S.progress.report;
  if (!r || !r.data) return;
  renderReport(r.data);
  go('report');
  setTimeout(() => speakReport(r.data), 300);
}
function renderReport(d) {
  document.getElementById('repEmoji').textContent = d.emoji || '🏅';
  document.getElementById('repHeadline').textContent = d.headline || 'Deine Coach-Analyse';
  document.getElementById('repSub').textContent = (d.profileName || S.profile.name) + (d.dateLabel ? ' · ' + d.dateLabel : '');
  const item = it => '<div class="rep-item">' +
    (it.img ? '<img class="rep-frame" src="' + it.img + '" alt="">' : '') +
    '<div class="rep-text">' + it.text + '</div></div>';
  document.getElementById('repGood').innerHTML = (d.good || []).map(item).join('') || '<p class="small">—</p>';
  document.getElementById('repImprove').innerHTML = (d.improve || []).map(item).join('') || '<p class="small">—</p>';
  const ch = d.challenge;
  const cm = ch && MISSIONS.find(m => m.id === ch.missionId);
  document.getElementById('repChallenge').innerHTML = ch
    ? '<p style="margin:0 0 10px">' + (ch.text || '') + '</p>' +
      (cm ? '<button class="btn green" id="repChallengeGo">' + cm.emoji + ' ' + cm.title + ' starten</button>' : '')
    : '<p class="small">—</p>';
  const cg = document.getElementById('repChallengeGo');
  if (cg) cg.onclick = () => { stopSpeaking(); openMission(ch.missionId, 'report'); };
}
function speakReport(d) {
  if (!VOICE.enabled) return;
  let t = (d.headline || '') + '. ';
  if (d.good && d.good.length) t += 'Das machst du gut: ' + d.good.map(g => g.text).join('. ') + '. ';
  if (d.improve && d.improve.length) t += 'Daran arbeiten wir: ' + d.improve.map(g => g.text).join('. ') + '. ';
  if (d.challenge && d.challenge.text) t += 'Deine Challenge: ' + d.challenge.text;
  say(t, { force: true });
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
  S = { profiles: [], activeId: null, profile: null, progress: null };
  document.getElementById('kidName').value = '';
  document.getElementById('kidAge').value = '';
  go('welcome');
}
function switchKid() {
  openProfileChooser();
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

  // --- Onboarding (Willkommens-Tour) ---
  document.getElementById('obNext').onclick = obNext;
  document.getElementById('obBack').onclick = obBack;
  document.getElementById('obSkip').onclick = finishOnboarding;
  document.getElementById('obReplayBtn').onclick = () => showOnboarding(true);

  document.getElementById('missionBack').onclick = () => { stopSpeaking(); go(missionFrom); };
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
  document.getElementById('camFlip').onclick = flipCamera;

  // --- Video player ---
  document.getElementById('playerClose').onclick = closePlayer;
  document.getElementById('playerDelete').onclick = deletePlaying;
  document.getElementById('playerDownload').onclick = downloadPlaying;
  document.getElementById('playerAnalyze').onclick = openAnalyzer;
  wireAnalyzer();
  document.getElementById('ytClose').onclick = closeYt;
  document.getElementById('reportBack').onclick = () => { stopSpeaking(); go('parent'); };
  document.getElementById('repListen').onclick = () => { const r = S.progress.report; if (r && r.data) speakReport(r.data); };

  document.getElementById('manualBack').onclick = () => { stopSpeaking(); go('mission'); };
  document.getElementById('manPlus').onclick = () => { manualCount++; updateManual(); countAloud(manualCount); sfx.tap(); haptic(12); };
  document.getElementById('manMinus').onclick = () => { manualCount = Math.max(0, manualCount - 1); updateManual(); };
  document.getElementById('manDone').onclick = () => {
    const reps = manualCount || goalFor(currentMission);
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
      if (s === 'library') renderLibrary();
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

  // Bibliothek-Filter (Alle / Zimmer / Meine Ausrüstung)
  document.querySelectorAll('#libFilter .lf-chip').forEach(chip => {
    chip.onclick = () => {
      libFilter = chip.dataset.filter;
      document.querySelectorAll('#libFilter .lf-chip').forEach(c => c.classList.toggle('active', c === chip));
      sfx.pop(); renderLibrary();
    };
  });

  // Profil-Wähler: Avatar antippen + Schließen
  const homeAv = document.getElementById('homeAvatar');
  if (homeAv) homeAv.onclick = () => { sfx.pop(); haptic(12); openProfileChooser(); };
  const pfClose = document.getElementById('profileClose');
  if (pfClose) pfClose.onclick = () => document.getElementById('profileChooser').classList.remove('show');

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
