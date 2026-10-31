@echo off
cd /d "%~dp0"
echo Lokaler Server laeuft auf http://localhost:8000  (Fenster offen lassen, Strg+C zum Beenden)
start "" http://localhost:8000/index.html
python -m http.server 8000 || py -m http.server 8000
pause
