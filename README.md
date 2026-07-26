# Trening — Powrót do siły (PWA)

Aplikacja do śledzenia treningów siłowych po kontuzji łokcia (epicondylitis lateralis).
Cały plan powrotu (Faza 0 → 1 → 2), progresja mezocyklowa, rehab łokcia i żywienie są
zaszyte w aplikacji jako dane domyślne — działa od pierwszego uruchomienia, bez konfiguracji.

## Uruchomienie lokalne

```
node server.js
```

i otwórz **http://localhost:8123**. Żadnych zależności — wystarczy Node.

## Instalacja na iPhone (jako ikona)

PWA wymaga prawdziwego hostingu HTTPS — samego pliku otwartego lokalnie (`file://`)
Safari nie potraktuje jako instalowalną aplikację (service worker nie zarejestruje się).
Potrzebny jest darmowy hosting statyczny, np. **GitHub Pages**, **Cloudflare Pages** albo
**Netlify** — wystarczy wrzucić `index.html`, `manifest.webmanifest`, `sw.js` i folder
`icons/` (bez `server.js`, `trening-artifact.html` i plików `.md`).

Po wystawieniu adresu:
1. Otwórz go w **Safari** na iPhonie (nie w przeglądarce wbudowanej w inną aplikację).
2. Stuknij ikonę udostępniania → **„Dodaj do ekranu głównego"**.
3. Gotowe — ikona działa jak natywna aplikacja, offline, z własnym oknem bez paska Safari.

Do developmentu na komputerze: `node server.js`, potem **http://localhost:8123**.

Dane są trzymane **lokalnie na urządzeniu** (localStorage) — każde urządzenie ma własny
dziennik. Do przenoszenia służy Eksport/Import w zakładce **Plan**.

## Struktura

| Plik | Rola |
|---|---|
| `index.html` | Cała aplikacja w jednym pliku (style + dane planu + logika) — plan A/B/C, silnik progresji, log serii, timer, wykresy, żywienie, rehab, import planu trenera |
| `sw.js` + `manifest.webmanifest` + `icons/` | Offline + instalowalność PWA (ikona na ekranie głównym) |
| `server.js` | Prosty lokalny serwer statyczny (tylko do developmentu na `localhost`) |
| `trening-artifact.html` | Ta sama aplikacja, publikowana też jako Artifact (link przeglądarkowy) — patrz niżej |

`index.html` i `trening-artifact.html` mają tę samą logikę; jedyna różnica to sposób
zapisu eksportowanych plików (PWA używa Web Share API / pobierania w przeglądarce,
Artifact używa `window.claude.downloads`). Numer wersji w obu jest zawsze zgodny
(widoczny w nagłówku jako „ver. NNN”).

## Dwa sposoby korzystania

1. **Zainstalowana aplikacja na iPhone (`index.html`)** — prawdziwa ikona na ekranie
   głównym, działa offline, pliki eksportujesz przez systemowe okno udostępniania
   (Safari → „Zapisz do Plików”). Wymaga hostingu z HTTPS (patrz niżej) — samo otwarcie
   pliku z Plików/AirDrop nie wystarczy, bo Safari nie uruchamia wtedy service workera.
2. **Link w przeglądarce (Artifact)** — zero hostingu, działa od razu, ale otwiera się
   wewnątrz interfejsu Claude, więc „Dodaj do ekranu głównego” nie da czystej,
   pełnoekranowej ikony aplikacji.

## Zaszyta logika bezpieczeństwa

- **Ból >2/10** (w trakcie lub 24h po) → ćwiczenie wstrzymane na 7 dni; przy próbie wykonania ostrzeżenie.
- **Follow-up 24h** — po ~20h od treningu apka prosi o ocenę bólu łokcia per ćwiczenie.
- **Progresja** tylko przy RPE ≤ celu we wszystkich seriach i 0 bólu; **RPE > cel+1 przez 2 sesje = blokada**; po bólu −10% ciężaru.
- **48h regeneracji** — nieblokujące ostrzeżenie przy próbie treningu wcześniej.
- **Paski (lifting straps)** — widoczne przypomnienie przy deadlift / wiosowaniu / farmer carry / hip thrust.
- **Tydzień mezocyklu** przechodzi automatycznie po skompletowaniu sesji tygodnia (T1 RPE 6 → T2 6–7 → T3 7–8 → T4 deload); po T4 nowy mezocykl.
- **Przejście faz** — manualne, z checklistą kryteriów (liczba sesji, czas w fazie, zero bólu, uzupełnione oceny 24h).
