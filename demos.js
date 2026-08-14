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
  croqueta: () => svg('d-croqueta', `
    ${ground()}
    ${trail('M84 156 H136', 'cq-trail')}
    ${leg('cq-l', 100, 80, 156, SHOE_L)}
    ${leg('cq-r', 120, 140, 156, SHOE_R)}
    ${ball('ball cq-ball', 110, 150)}
    ${flash('cq-flash', 110, 150)}
    <text class="sparkle" x="152" y="56" font-size="20">⚡️</text>
    ${frontBody()}`),

  // Übersteiger — Fuß kreist über den Ball (1), dann Ball weg (2)
  stepover: () => svg('d-stepover', `
    ${ground()}
    <path class="trail so-circle" d="M106 136 a19 15 0 1 1 0.1 0" fill="none" stroke="#a06bff" stroke-width="3" stroke-dasharray="3 6"/>
    ${trail('M112 154 H172', 'so-out')}
    ${leg('', 100, 84, 154, SHOE_L)}
    ${leg('so-r', 120, 116, 154, SHOE_R)}
    ${ball('ball so-ball', 106, 150)}
    ${phase(1, 130, 116)}${phase(2, 176, 148)}
    ${frontBody()}`),

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
};

function demoFor(missionId) {
  const fn = DEMOS[missionId];
  return fn ? fn() : `<div style="font-size:4rem;text-align:center">⚽️</div>`;
}
