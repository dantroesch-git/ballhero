/* ===========================================================
   BallHero Kids — Übungs-Animationen v2.1
   Ziel: Ein Kind versteht die Bewegung ohne ein Wort.
   Fokus auf Beine+Füße+Ball, großer Ball mit Schatten,
   farbcodierte Schuhe (links blau / rechts orange), Bewegungs-
   spuren (gestrichelt) + Kontakt-Blitze. Füße stehen NEBEN
   dem Ball (nicht dahinter), damit man den Kontakt sieht.
   Später 1:1 durch echte Videoclips ersetzbar.
   =========================================================== */
'use strict';

const SHOE_L = '#5b8cff', SHOE_R = '#ff9f43';
const HIPY = 86;

/* Kleiner, kräftiger Oberkörper oben (Kontext, nicht der Fokus) */
function frontBody() {
  return `
    <g class="mini">
      <circle cx="110" cy="30" r="13" fill="#ffcf9e"/>
      <path d="M97 26a13 13 0 0 1 26 0z" fill="#5b3a1e"/>
      <circle cx="104" cy="31" r="2" fill="#3a2a1a"/><circle cx="116" cy="31" r="2" fill="#3a2a1a"/>
      <path d="M104 37 q6 4 12 0" stroke="#3a2a1a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M110 44 L110 ${HIPY}" stroke="#4d8bff" stroke-width="27" stroke-linecap="round"/>
      <path d="M99 56 L82 74" stroke="#ffcf9e" stroke-width="8" stroke-linecap="round"/>
      <path d="M121 56 L138 74" stroke="#ffcf9e" stroke-width="8" stroke-linecap="round"/>
    </g>`;
}

/* Ein Bein mit großem, farbigem Schuh */
function leg(cls, hipX, footX, footY, shoeColor) {
  return `<g class="leg ${cls}" style="transform-origin:110px ${HIPY}px">
    <path d="M${hipX} ${HIPY} L${footX} ${footY - 7}" stroke="#2a3488" stroke-width="16" stroke-linecap="round"/>
    <g class="shoe">
      <ellipse cx="${footX}" cy="${footY}" rx="16" ry="8" fill="${shoeColor}" stroke="#20264d" stroke-width="2"/>
      <path d="M${footX - 8} ${footY - 2} q8 -4 16 0" stroke="#20264d" stroke-width="1.5" fill="none"/>
    </g>
  </g>`;
}

/* Großer Ball mit Bodenschatten */
function ball(cls, cx, cy, r) {
  r = r || 19;
  const p = (a) => {
    const rad = (a - 90) * Math.PI / 180;
    return (cx + Math.cos(rad) * r * 0.5).toFixed(1) + ',' + (cy + Math.sin(rad) * r * 0.5).toFixed(1);
  };
  return `<g class="${cls}">
    <ellipse cx="${cx}" cy="${cy + r - 1}" rx="${r * 0.85}" ry="4" fill="rgba(0,0,0,0.28)"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffd23f" stroke="#20264d" stroke-width="2.5"/>
    <polygon points="${p(0)} ${p(72)} ${p(144)} ${p(216)} ${p(288)}" fill="#20264d"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="1.5"/>
  </g>`;
}

function ground() {
  return `<line x1="16" y1="166" x2="204" y2="166" stroke="rgba(255,255,255,0.16)" stroke-width="3" stroke-linecap="round"/>`;
}
/* Gestrichelte Bewegungsspur — zeigt den Weg des Balls */
function trail(d, cls) {
  return `<path class="trail ${cls || ''}" d="${d}" fill="none" stroke="#35d07f" stroke-width="3"
    stroke-dasharray="3 7" stroke-linecap="round"/>`;
}
/* Kontakt-Blitz: pulsiert da, wo der Fuß den Ball berührt */
function flash(cls, cx, cy) {
  return `<circle class="flash ${cls}" cx="${cx}" cy="${cy}" r="11" fill="none" stroke="#fff" stroke-width="3"/>`;
}
function cone(x) {
  return `<path d="M${x} 148 L${x - 8} 166 L${x + 8} 166 Z" fill="#ff6b9d"/><ellipse cx="${x}" cy="166" rx="8" ry="2" fill="rgba(0,0,0,0.25)"/>`;
}
function wall(x) {
  return `<rect x="${x}" y="64" width="10" height="102" rx="3" fill="#8b93c9"/>`;
}
/* Nummerierte Phase (für mehrstufige Tricks) */
function phase(n, x, y) {
  return `<g class="pbadge p${n}"><circle cx="${x}" cy="${y}" r="11" fill="#a06bff"/>
    <text x="${x}" y="${y + 5}" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">${n}</text></g>`;
}
/* Seitenansicht-Oberkörper (für Jonglieren & Schuss — Profil ist klarer) */
function sideBody() {
  const cx = 90;
  return `<g class="mini">
    <circle cx="${cx}" cy="30" r="13" fill="#ffcf9e"/>
    <path d="M${cx - 13} 26a13 13 0 0 1 26 0z" fill="#5b3a1e"/>
    <circle cx="${cx + 7}" cy="31" r="2" fill="#3a2a1a"/>
    <path d="M108 44 L${cx} 46 L${cx} ${HIPY}" stroke="#4d8bff" stroke-width="24" fill="none" stroke-linecap="round"/>
    <path d="M${cx} 58 L${cx + 20} 72" stroke="#ffcf9e" stroke-width="8" stroke-linecap="round"/>
  </g>`;
}

function svg(id, inner) {
  return `<svg viewBox="0 0 220 184" class="demo-svg ${id}" aria-hidden="true">${inner}</svg>`;
}
/* Vorwärts-Pfeil (nach rechts) */
function fwdArrow(x1, x2, y) {
  return `<g class="hint" opacity="0.9">
    <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#35d07f" stroke-width="4" stroke-linecap="round"/>
    <path d="M${x2 - 12} ${y - 9} L${x2} ${y} L${x2 - 12} ${y + 9}" stroke="#35d07f" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}

/* ===========================================================
   SCHRITT-SEQUENZ für Tricks/Finten — 3 Bilder ①②③ nebeneinander,
   ein Highlight wandert durch. Klar erkennbar statt Dauer-Loop.
   Panel-lokale Koordinaten: 0..128 breit, Boden bei y=104.
   =========================================================== */
function sBallS(cx, cy) {
  return `<ellipse cx="${cx}" cy="${cy + 12}" rx="11" ry="3" fill="rgba(0,0,0,0.25)"/>
    <circle cx="${cx}" cy="${cy}" r="13" fill="#ffd23f" stroke="#20264d" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="4" fill="#20264d"/>`;
}
function sShoe(cx, cy, color) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="14" ry="6.5" fill="${color}" stroke="#20264d" stroke-width="1.6"/>`;
}
/* Bein + Schuh (Hüfte oben Mitte) */
function sLeg(hipX, cx, cy, color) {
  return `<path d="M${hipX} 30 L${cx} ${cy - 5}" stroke="#2a3488" stroke-width="9" stroke-linecap="round"/>${sShoe(cx, cy, color)}`;
}
function sHead() {
  return `<circle cx="64" cy="20" r="9" fill="#ffcf9e"/><path d="M55 17a9 9 0 0 1 18 0z" fill="#5b3a1e"/>`;
}
function sArrowH(x1, x2, y, color) { // horizontaler Pfeil, Spitze bei x2
  const dir = x2 > x1 ? -1 : 1;
  return `<g><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M${x2 + dir * 9} ${y - 7} L${x2} ${y} L${x2 + dir * 9} ${y + 7}" stroke="${color}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}
function sArrowUp(x, y1, y2, color) {
  return `<g><line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M${x - 7} ${y2 + 9} L${x} ${y2} L${x + 7} ${y2 + 9}" stroke="${color}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}
function sArcOver(cx, cy, color) { // Bogen ÜBER den Ball (für Übersteiger)
  return `<g><path d="M${cx - 22} ${cy} Q ${cx} ${cy - 32} ${cx + 22} ${cy}" stroke="${color}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-dasharray="4 4"/>
    <path d="M${cx + 13} ${cy - 7} L${cx + 22} ${cy} L${cx + 14} ${cy + 7}" stroke="${color}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}
function sGround() { return `<line x1="12" y1="104" x2="116" y2="104" stroke="rgba(255,255,255,0.18)" stroke-width="2.5" stroke-linecap="round"/>`; }
function sNum(n) {
  return `<g class="s-num s${n}"><circle cx="17" cy="17" r="12" fill="#a06bff"/>
    <text x="17" y="22" font-size="15" font-weight="800" fill="#fff" text-anchor="middle">${n}</text></g>`;
}
/* Setzt 3 Panels zusammen + wanderndes Highlight */
function stepStrip(id, p1, p2, p3) {
  const panel = (i, inner) => `<g transform="translate(${i * 128},0)">${sGround()}${sHead()}${inner}${sNum(i + 1)}</g>`;
  const div = x => `<line x1="${x}" y1="14" x2="${x}" y2="118" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>`;
  return `<svg viewBox="0 0 384 132" class="demo-svg step-strip ${id}" aria-hidden="true">
    ${panel(0, p1)}${div(128)}${panel(1, p2)}${div(256)}${panel(2, p3)}
    <rect class="step-hl" x="3" y="3" width="122" height="126" rx="12" fill="none" stroke="#35d07f" stroke-width="3"/>
  </svg>`;
}

/* ---------------- Die Übungen ---------------- */
const DEMOS = {
  // Toe Taps — Füße NEBEN dem Ball, tippen abwechselnd oben drauf
  toetaps: () => svg('d-toetaps', `
    ${ground()}
    ${leg('tt-l', 100, 76, 154, SHOE_L)}
    ${leg('tt-r', 120, 144, 154, SHOE_R)}
    ${ball('ball tt-ball', 110, 148)}
    ${flash('tt-flash', 110, 131)}
    ${frontBody()}`),

  // Foundations — Ball wandert mit der Innenseite zwischen den Füßen
  foundations: () => svg('d-foundations', `
    ${ground()}
    ${trail('M84 156 H136', 'fd-trail')}
    ${leg('fd-l', 100, 80, 156, SHOE_L)}
    ${leg('fd-r', 120, 140, 156, SHOE_R)}
    ${ball('ball fd-ball', 110, 150)}
    ${flash('fd-flash', 110, 150)}
    ${frontBody()}`),

  // Slalom — Ball schlängelt sich um die Hütchen
  slalom: () => svg('d-slalom', `
    ${ground()}
    ${cone(46)}${cone(94)}${cone(142)}${cone(190)}
    ${trail('M40 158 Q70 120 94 158 T142 158 T190 158', 'sl-trail')}
    <g class="sl-scene">
      <g transform="translate(110 150) scale(0.6) translate(-110 -150)">
        ${leg('', 100, 92, 154, SHOE_L)}${leg('', 120, 128, 154, SHOE_R)}
        ${frontBody()}
      </g>
      ${ball('ball sl-ball', 58, 156, 15)}
    </g>`),

  // Schwacher Fuß — nur der markierte (linke) Fuß arbeitet
  weakfoot: () => svg('d-weakfoot', `
    ${ground()}
    ${trail('M76 156 H120', 'wk-trail')}
    ${leg('wk-l', 100, 82, 156, SHOE_L)}
    ${leg('', 120, 146, 154, '#3a4272')}
    ${ball('ball wk-ball', 100, 150)}
    <circle class="wk-ring" cx="82" cy="156" r="20" fill="none" stroke="#ff6b9d" stroke-width="3"/>
    <text x="82" y="126" font-size="17" text-anchor="middle" class="wk-star">⭐️</text>
    ${frontBody()}`),

  // Jonglieren — Seitenansicht: Ball springt, Fuß tippt ihn hoch
  juggling: () => svg('d-juggling', `
    ${ground()}
    ${trail('M96 148 C 96 92, 122 92, 122 148', 'jug-trail')}
    ${sideBody()}
    <g class="leg jug-leg" style="transform-origin:110px ${HIPY}px">
      <path d="M110 ${HIPY} L108 150" stroke="#2a3488" stroke-width="16" stroke-linecap="round"/>
      <g class="shoe"><ellipse cx="112" cy="152" rx="18" ry="9" fill="${SHOE_R}" stroke="#20264d" stroke-width="2"/></g>
    </g>
    ${ball('ball jug-ball', 112, 116)}
    ${flash('jug-flash', 112, 138)}`),

  // Trick — Sohlen-Rolle: Ball mit der Sohle zur Seite rollen
  trick: () => svg('d-trick', `
    ${ground()}
    ${trail('M82 158 H140', 'rl-trail')}
    ${leg('rl-l', 100, 92, 148, SHOE_L)}
    ${leg('', 120, 142, 154, SHOE_R)}
    ${ball('ball rl-ball', 96, 151)}
    <text class="sparkle" x="150" y="58" font-size="22">✨</text>
    ${frontBody()}`),

  // La Croqueta — Ball blitzschnell von Fuß zu Fuß
  // La Croqueta — Sequenz: Ball rechts → blitzschnell nach links → weiter
  croqueta: () => stepStrip('t-croqueta',
    `${sLeg(56, 42, 100, SHOE_L)}${sBallS(64, 90)}${sLeg(74, 86, 100, SHOE_R)}`,
    `${sLeg(56, 40, 100, SHOE_L)}${sArrowH(76, 48, 96, '#35d07f')}${sBallS(50, 90)}${sLeg(74, 86, 100, SHOE_R)}`,
    `${sLeg(56, 50, 100, SHOE_L)}${sLeg(74, 72, 100, SHOE_R)}${sBallS(60, 90)}${sArrowUp(60, 84, 54, '#35d07f')}`
  ),

  // Übersteiger (Schere) — als Schritt-Sequenz: drüber → Finte → weg
  stepover: () => stepStrip('t-stepover',
    `${sLeg(56, 40, 100, SHOE_L)}${sBallS(64, 88)}${sArcOver(64, 74, '#35d07f')}${sLeg(74, 64, 52, SHOE_R)}`,
    `${sLeg(56, 40, 100, SHOE_L)}${sBallS(64, 88)}${sLeg(74, 94, 100, SHOE_R)}`,
    `${sLeg(62, 74, 100, SHOE_R)}${sArrowH(82, 30, 88, '#ff6b9d')}${sBallS(30, 88)}`
  ),

  // Ballannahme & Schuss — Seitenansicht: Ball zur Wand und zurück
  striking: () => svg('d-striking', `
    ${ground()}
    ${wall(196)}
    ${trail('M120 148 H190', 'st-trail')}
    ${sideBody()}
    <g class="leg st-plant" style="transform-origin:110px ${HIPY}px">
      <path d="M106 ${HIPY} L92 152" stroke="#2a3488" stroke-width="16" stroke-linecap="round"/>
      <g class="shoe"><ellipse cx="90" cy="155" rx="16" ry="8" fill="${SHOE_L}" stroke="#20264d" stroke-width="2"/></g>
    </g>
    <g class="leg st-kick" style="transform-origin:112px ${HIPY}px">
      <path d="M112 ${HIPY} L122 150" stroke="#2a3488" stroke-width="16" stroke-linecap="round"/>
      <g class="shoe"><ellipse cx="124" cy="152" rx="18" ry="9" fill="${SHOE_R}" stroke="#20264d" stroke-width="2"/></g>
    </g>
    ${ball('ball st-ball', 120, 149)}
    ${flash('st-flash', 120, 149)}`),

  // Tempo-Dribbling / Antritt / 1-gegen-1 — mit dem Ball nach vorne laufen
  run: () => svg('d-run', `
    ${ground()}
    ${fwdArrow(126, 190, 150)}
    <g class="run-lines" opacity="0.5">
      <line x1="60" y1="120" x2="30" y2="120" stroke="#8fa0ff" stroke-width="3" stroke-linecap="round"/>
      <line x1="66" y1="134" x2="34" y2="134" stroke="#8fa0ff" stroke-width="3" stroke-linecap="round"/>
    </g>
    ${leg('run-l', 100, 92, 154, SHOE_L)}
    ${leg('run-r', 120, 122, 154, SHOE_R)}
    ${ball('ball run-ball', 134, 150)}
    ${frontBody()}`),

  // Innenseiten-Cut — Sequenz: geradeaus antäuschen → Innenseite → scharf weg
  cut: () => stepStrip('t-cut',
    `${sLeg(56, 44, 100, SHOE_L)}${sBallS(86, 88)}${sArrowH(58, 106, 104, '#35d07f')}`,
    `${sLeg(56, 42, 100, SHOE_L)}${sBallS(66, 88)}${sLeg(74, 84, 98, SHOE_R)}`,
    `${sLeg(62, 74, 100, SHOE_R)}${sArrowH(80, 28, 88, '#ff6b9d')}${sBallS(28, 88)}`
  ),

  // Zurückziehen — Sequenz: Sohle drauf → zurückziehen → drehen & weg
  dragback: () => stepStrip('t-dragback',
    `${sLeg(56, 44, 100, SHOE_L)}${sBallS(74, 90)}${sLeg(76, 74, 78, SHOE_R)}`,
    `${sLeg(56, 44, 100, SHOE_L)}${sArrowH(78, 42, 96, '#ff6b9d')}${sBallS(42, 90)}${sShoe(42, 78, SHOE_R)}`,
    `${sLeg(56, 50, 100, SHOE_L)}${sLeg(74, 72, 100, SHOE_R)}${sBallS(60, 90)}${sArrowUp(60, 84, 54, '#35d07f')}`
  ),

  // Innen-Außen — Ball mit einem Fuß im Zickzack antippen
  insideout: () => svg('d-insideout', `
    ${ground()}
    <path class="trail" d="M96 156 L118 150 L96 144 L118 150" stroke="#35d07f" stroke-width="3" stroke-dasharray="3 6" fill="none"/>
    ${leg('', 100, 90, 154, SHOE_L)}
    ${leg('io-r', 120, 122, 152, SHOE_R)}
    ${ball('ball io-ball', 108, 150)}
    ${frontBody()}`),

  // Schnelle Füße — ohne Ball, ganz schnell auf der Stelle tippen
  ladder: () => svg('d-ladder', `
    ${ground()}
    <g class="ll-lines" opacity="0.45">
      <line x1="70" y1="158" x2="150" y2="158" stroke="#8fa0ff" stroke-width="2"/>
      <line x1="86" y1="150" x2="86" y2="166" stroke="#8fa0ff" stroke-width="2"/>
      <line x1="110" y1="150" x2="110" y2="166" stroke="#8fa0ff" stroke-width="2"/>
      <line x1="134" y1="150" x2="134" y2="166" stroke="#8fa0ff" stroke-width="2"/>
    </g>
    ${leg('lad-l', 100, 96, 154, SHOE_L)}
    ${leg('lad-r', 120, 124, 154, SHOE_R)}
    <text class="sparkle" x="158" y="60" font-size="20">⚡️</text>
    ${frontBody()}`),

  // Ball stoppen & Balance — Sohle auf den Ball, kurz balancieren
  stopball: () => svg('d-stopball', `
    ${ground()}
    ${leg('', 100, 90, 156, SHOE_L)}
    <g class="leg stop-r" style="transform-origin:110px ${HIPY}px">
      <path d="M120 ${HIPY} L124 138" stroke="#2a3488" stroke-width="16" stroke-linecap="round"/>
      <g class="shoe"><ellipse cx="126" cy="140" rx="16" ry="7" fill="${SHOE_R}" stroke="#20264d" stroke-width="2"/></g>
    </g>
    ${ball('ball stop-ball', 126, 150)}
    <circle class="flash stop-flash" cx="126" cy="146" r="12" fill="none" stroke="#fff" stroke-width="3"/>
    ${frontBody()}`),
};

function demoFor(missionId) {
  const fn = DEMOS[missionId];
  return fn ? fn() : `<div style="font-size:4rem;text-align:center">⚽️</div>`;
}
