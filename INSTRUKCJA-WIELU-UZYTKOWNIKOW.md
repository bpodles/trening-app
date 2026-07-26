# Jedna aplikacja, wielu użytkowników — Ty (Pedro) + Łukasz (Carlos)

Ten dokument opisuje, jak Ty i syn możecie korzystać z **tej samej aplikacji**
(ten sam link: https://bpodles.github.io/trening-app/), każdy ze **swoim własnym
trenerem, swoim planem i swoją własną historią treningów** — bez wzajemnego
mieszania danych.

## Zasada, która to umożliwia

Aplikacja nie ma żadnego serwera ani konta — wszystkie dane (plan, historia,
żywienie, rehab) siedzą **lokalnie na telefonie**, w pamięci przeglądarki tego
konkretnego urządzenia. Jeśli Ty i Łukasz zainstalujecie tę samą apkę z tego
samego linku, ale **każdy na swoim własnym telefonie**, to od razu macie dwa
całkowicie niezależne zestawy danych — mimo że kod aplikacji jest identyczny.

**Jedyny warunek: osobne urządzenia (lub przynajmniej osobne przeglądarki).**
Jeśli oboje kiedykolwiek otworzylibyście apkę na tym samym telefonie, dane by się
nałożyły — więc instalacja musi być zrobiona osobno, na telefonie Łukasza.

## Flow 1 — Ty i Pedro (bez zmian)

Nic się nie zmienia w tym, co już robisz:
1. Trenujesz według planu od Pedro, wczytanego w zakładce **Plan**.
2. Logujesz serie (powtórzenia, ciężar, RPE, ból łokcia) jak dotychczas.
3. Gdy chcesz, żeby Pedro ułożył kolejny blok, wysyłasz mu swoją historię
   (patrz **Flow 3** niżej).
4. Gdy dostaniesz od Pedro nowy plik z kolejnym blokiem, wczytujesz go tak samo
   jak poprzedni (**Plan → Wczytaj nowy plan**) — **stara historia treningów
   zostaje zachowana**, podmienia się tylko plan na przyszłość.

## Flow 2 — Łukasz i Carlos (nowa instalacja)

### Krok 1 — Carlos przygotowuje plan dla Łukasza

Carlos używa **dokładnie tego samego formatu**, co Pedro. Daj mu te dwa pliki
z tego projektu:
- [`plan-trenera-szablon.md`](plan-trenera-szablon.md) — szablon do wypełnienia
- [`PLAN-TRENERA-INSTRUKCJA.md`](PLAN-TRENERA-INSTRUKCJA.md) — pełna instrukcja pól

Carlos powinien tylko podmienić w nagłówku pliku:
```
Trener: Carlos
Zawodnik: Łukasz
```
i wypełnić treningi z datami, ćwiczeniami, seriami/powtórzeniami itd. — dokładnie
tak jak Pedro robi to dla Ciebie. Efektem jest jeden plik `.md`, który Carlos
przesyła Łukaszowi (mail, WhatsApp, AirDrop — cokolwiek).

### Krok 2 — Łukasz instaluje aplikację na swoim telefonie

1. Łukasz otwiera **https://bpodles.github.io/trening-app/** w Safari **na swoim
   iPhonie**.
2. Ikona udostępniania → **„Dodaj do ekranu głównego"**.
3. Uruchamia apkę z nowej ikony.

### Krok 3 — Łukasz od razu wczytuje plik od Carlosa

To ważny krok: zaraz po pierwszym uruchomieniu aplikacja pokazuje **domyślny,
wbudowany plan** — ale to jest plan zaprojektowany pod Twój powrót po kontuzji
łokcia, więc Łukasza kompletnie nie dotyczy. Żeby to zastąpić:
1. Zakładka **Plan** → **„Wczytaj plan"**.
2. Wybiera plik `.md` od Carlosa.
3. Od tej chwili zakładka **Trening** pokazuje Łukaszowi listę treningów
   od Carlosa **z datami**, dokładnie jak u Ciebie — wybiera dzień, trenuje,
   loguje serie, ma swoją własną historię i wykresy progresji.

Od tego momentu Łukasz używa aplikacji zupełnie niezależnie od Ciebie — inny
plan, inna historia, inny trener, to samo urządzenie-do-urządzenia rozdzielenie
co między Wami.

## Flow 3 — wysyłanie swoich treningów do trenera (Ty→Pedro, Łukasz→Carlos)

Ten sam mechanizm działa dla obu z Was:

1. Zakładka **Historia**.
2. Przycisk **„⬇ Eksportuj historię ćwiczeń (.txt)"**.
3. Telefon pokaże okno udostępniania (share sheet) — wybierz Wiadomości, Mail,
   WhatsApp czy cokolwiek, czym kontaktujesz się z trenerem, i wyślij plik.
4. Trener dostaje czytelny plik tekstowy: data, dzień, ćwiczenie, każda seria
   (powtórzenia × ciężar @ RPE, ból), ocena bólu 24h po treningu.
5. Na tej podstawie trener układa kolejny blok — **stosując te same reguły
   progresji, które są opisane w `PLAN-TRENERA-INSTRUKCJA.md`** (RPE, ból,
   blokada progresji) — i przygotowuje nowy plik `.md`.
6. Ty/Łukasz wczytujecie nowy plik tak samo jak za pierwszym razem
   (**Plan → Wczytaj nowy plan**). Poprzedni plan znika, ale **cała historia
   dotychczasowych treningów zostaje** — nic nie trzeba eksportować/robić kopii
   zapasowej przed podmianą planu.

## Cały cykl w skrócie

```
Trener (Pedro/Carlos)                    Zawodnik (Ty/Łukasz)
──────────────────────                   ─────────────────────
1. Pisze plan .md         ────plik───▶    2. Wczytuje plik w Plan
                                          3. Trenuje, loguje serie
                                             (powt., ciężar, RPE, ból)
4. Dostaje eksport .txt   ◀───plik────    5. Historia → Eksportuj (.txt)
6. Układa kolejny blok
   na podstawie wyników
   (powrót do kroku 1)
```

## Dodatkowe uwagi

- **Aktualizacje aplikacji** (poprawki, nowe funkcje) trafiają automatycznie do
  Was obu — to ten sam adres i ten sam kod, więc jak coś zmienię, wystarczy że
  każdy odświeży aplikację na swoim telefonie (zobaczycie nowy numer „ver."
  w nagłówku).
- **Pełna kopia zapasowa** (zakładka Plan → Eksport/Import) to coś innego niż
  plan trenera — to zrzut wszystkich danych (plan + historia + żywienie + rehab)
  do jednego pliku JSON, przydatny np. przy zmianie telefonu. Plan trenera
  (`.md`) to tylko treningi na przyszłość.
- Jeśli kiedyś Łukasz zmieni trenera albo Ty zmienisz Pedro na kogoś innego,
  procedura jest identyczna — nowy plik `.md` w tym samym formacie.
