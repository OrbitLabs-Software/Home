# OrbitLabs Webseite

Start: `start-lokal.bat` (Python nötig) oder Ordner auf GitHub Pages hochladen. Login funktioniert nur über http/https.

## Vor dem Veröffentlichen unbedingt erledigen
1. **Impressum** (`pages/impressum.html`) und **Datenschutz** (`pages/datenschutz.html`): alle gelb markierten Stellen `[...]` ausfüllen und rechtlich prüfen lassen.
2. **Domain:** In allen Dateien `https://DEINE-DOMAIN` durch die echte Adresse ersetzen (Suchen und Ersetzen im Ordner): `sitemap.xml`, `robots.txt` und die Vorschau-Tags (`og:image`) in den HTML-Dateien.
3. **Programme:** .exe-Dateien in `files/` legen (`notizbrett.exe`, `brettbrowser.exe`, `musikbrett.exe`, `zeichenbrett.exe`).
4. **Programmdaten** (Version, Datum, Größe, Änderungen, Screenshots) in `js/programs-data.js` eintragen.
5. **Firebase:** E-Mail/Passwort und Google unter Authentication aktivieren, Domain unter "Autorisierte Domains" eintragen. Werte stehen in `js/auth-config.js`.
6. Optional: Formular-Dienst (Formspree) in `js/site-config.js` eintragen.

## Struktur
`css/` Styles · `js/` Skripte · `assets/` Icons/Bilder · `pages/` Unterseiten · `files/` Downloads · `404.html` Fehlerseite

## Nachrichten-Menü (Antworten im Konto)
- Angemeldete Nutzer, die das Kontaktformular abschicken, bekommen ihre Anfrage in Firestore gespeichert und sehen Antworten unter `pages/nachrichten.html` (Menüpunkt „Nachrichten“).
- Du antwortest auf `pages/admin.html` (nicht im Menü verlinkt).
- Einrichtung: Firebase → Firestore Database erstellen → Regeln aus `firestore.rules` einfügen. Die Admin-Benutzer-ID ist bereits eingetragen.
