# ⚽️ BallHero Kids

Täglicher Fußball-Technik-Coach für Kinder (5–12) — „Duolingo für Fußball".
Mobile-first Web-App (PWA), läuft ohne Backend, ohne Anmeldung, ohne Kosten.

## Was drin ist (MVP v1)

- **Kinderprofil** (Name, Alter, Avatar) + Elternzugang
- **6 Tagesmissionen**: Toe Taps, Foundations, Slalom, Schwacher Fuß, Jonglieren, Trick des Tages
- **Freihändiger Aufnahme-Modus** — das Kind stellt das Handy hin und geht weg:
  - **Positionierungs-Hilfe**: erkennt per Pose, ob das Kind komplett im Bild ist, und sagt es ihm laut
    („Geh noch zwei Schritte zurück!") — grüner Rahmen = passt
  - **Auto-Start**: steht es ~1,5 s richtig, zählt die App runter (3-2-1-LOS) mit Sprache + Pieptönen
  - **Riesen-Anzeige**: Countdown & Timer aus 3 m lesbar
  - **Auto-Stopp** nach 20/30/45/60 s, Zwischenrufe bei Halbzeit und den letzten 5 s
  - **Video wird gespeichert** (MediaRecorder → IndexedDB) für den Vorher/Nachher-Vergleich
  - Bildschirm bleibt an (Wake Lock), Eltern-Stopp-Knopf als Notausgang
- **Live-Skelett-Erkennung** (MediaPipe Pose, läuft komplett lokal im Browser)
  - zählt Ballkontakte über Fuß-Bewegung, misst „Kopf oben"-Anteil, gibt kindgerechtes Feedback
- **Video-Bibliothek** im Eltern-Dashboard: abspielen, löschen, Speicherverbrauch im Blick
- **Manuelles Zählen** als Alternative (funktioniert immer, auch ohne Kamera)
- **Gamification**: Sterne, XP, Streaks, Belohnungs-Screen mit Konfetti + Sound
- **Trainingsstile**: 4 wählbare Stile mit eigenem Übungsplan —
  Allround, **Barcelona/La Masia** (erster Kontakt, La Croqueta), **Ajax** (1-gegen-1,
  Übersteiger), **PSG-Stil** (Technik & Schuss). Inspiriert von den öffentlich
  bekannten Philosophien, kindgerecht adaptiert (keine lizenzierten Vereinsprogramme).
- **Level-System**: 6 Ränge (Anfänger → Legende) mit Level-up-Feier
- **Trophäen**: 9 sammelbare Badges (erstes Video, 3-Tage-Streak, Jongleur …)
- **Maskottchen „Kicky"**: animierter Ball, begrüßt & feiert mit
- **Sound & Haptik**: erzeugte Töne (kein Asset), Vibration beim Tippen
- **Sprach-Auswahl**: intelligente Stimmen-Wahl (meidet Roboter-/Spaßstimmen),
  Eltern können Stimme wählen & testen. Beste Qualität = Premium/Siri-Stimme im
  Gerät laden (Anleitung in der App unter Eltern → Einstellungen)
- **Fortschritt**: Skill-Balken (Ballkontrolle, schwacher Fuß, Dribbling, Koordination) + adaptiver Coach-Tipp
- **Eltern-Dashboard**: Wochen-Chart, Insights, automatisch angepasster Wochenplan
- **PWA**: installierbar auf dem Homescreen, funktioniert offline
- **Datenschutz**: alle Daten bleiben im Browser (localStorage) — nichts wird hochgeladen

## Lokal starten

Die Kamera braucht einen sicheren Kontext (`localhost` oder HTTPS):

```bash
cd BallHero
python3 -m http.server 8137
# dann im Browser: http://localhost:8137/index.html
```

## Auf dem Handy testen

`localhost` gilt nur auf dem Rechner als sicher. Fürs Handy brauchst du HTTPS:

1. **Am einfachsten** — kostenlos deployen (Drag & Drop des Ordners):
   - [netlify.com/drop](https://app.netlify.com/drop) oder [vercel.com](https://vercel.com) oder GitHub Pages
   - Ergebnis ist eine `https://…`-URL → dort funktioniert Kamera + „Zum Homescreen hinzufügen"
2. Alternativ im LAN ein HTTPS-Tunnel (`ngrok http 8137`).

## Technik

- Reines HTML/CSS/JS, kein Build-Schritt, keine Abhängigkeiten zu installieren
- Pose-Erkennung: `@mediapipe/tasks-vision` (Lite-Modell, per CDN geladen)
- `index.html` · `styles.css` · `app.js` · `sw.js` (Service Worker) · `manifest.webmanifest`

## Nächste Ausbaustufen

1. **Gemini-Videoanalyse** serverseitig — echtes technisches Feedback pro Übung (Standbein, Treffpunkt, Fußöffnung)
2. **Supabase** — Sync über Geräte, Eltern-Login, Verlauf sichern
3. **Baseline-Test & Vorher/Nachher-Videovergleich** (Woche 1 vs. Woche 6)
4. **Mehr Übungen + Editionen** je Alter, echte Demo-Videos
5. **App-Store-Wrapper** (Capacitor) für native Store-Veröffentlichung
