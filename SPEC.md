# SPEC.md — "Trening — Powrót do siły"

Kompletna specyfikacja funkcjonalna i techniczna aplikacji. Napisana tak, żeby
ktoś (człowiek albo inny model AI) bez dostępu do obecnego kodu źródłowego mógł
odtworzyć aplikację od zera z identycznym zachowaniem.

Ten dokument opisuje **zachowanie i reguły**, nie implementację. Fragmenty
oznaczone jako pseudokod opisują algorytm krok po kroku, nie prawdziwy kod.

---

## 1. Cel i zakres aplikacji

### Co to jest

Progresywny dziennik treningowy (PWA) dla jednej osoby wracającej do treningów
siłowych po kontuzji łokcia (epicondylitis lateralis — "łokieć tenisisty"), z
naciskiem na:

- pokazanie **jednym spojrzeniem** na siłowni, co robić teraz (ćwiczenie,
  serie×powtórzenia, ciężar, tempo, przerwa),
- **szybkie logowanie** faktycznych wyników serii (powtórzenia, ciężar, RPE,
  ból łokcia) w 2–3 tapnięciach,
- **automatyczną progresję** obciążenia w oparciu o zasady bezpieczeństwa
  (RPE, ból), a nie tylko sztywny plan,
- **bezpieczeństwo łokcia jako pierwszą klasę obywatelską** — nie tylko
  metadane, ale reguły, które faktycznie wstrzymują ćwiczenia i blokują
  progresję,
- import **planu treningowego od zewnętrznego trenera** (plik tekstowy w
  ludzkim, czytelnym formacie) z pełną integracją z silnikiem progresji,
- log żywieniowy i codzienny protokół rehabilitacji łokcia jako osobne, ale
  równie ważne zakładki.

### Dla kogo

- Pierwotnie: jedna osoba (dorosły mężczyzna) w fazie powrotu do treningu po
  15-tygodniowej przerwie spowodowanej kontuzją łokcia, trenująca pod okiem
  zdalnego trenera personalnego.
- Rozszerzone: aplikacja jest reużywalna przez wiele osób **niezależnie od
  siebie** — każda instalacja na osobnym urządzeniu ma osobne dane
  (localStorage per przeglądarka/urządzenie, zero backendu, zero kont). Drugi
  użytkownik (np. syn pierwszego użytkownika, z innym trenerem) używa
  dokładnie tego samego kodu, ale importuje własny plik planu.

### Jaki problem rozwiązuje

Trener zdalny (nieobecny na siłowni) potrzebuje sposobu na:
1. przekazanie planu treningowego w formacie, który podopieczny łatwo wczyta
   do telefonu i zobaczy właściwy trening na właściwy dzień,
2. otrzymanie z powrotem czytelnej historii wykonanych sesji (powtórzenia,
   ciężar, RPE, ból), żeby zaprojektować kolejny blok treningowy,

bez budowania własnej infrastruktury (konta, backendu, synchronizacji) —
wymiana odbywa się przez zwykłe pliki tekstowe wysyłane komunikatorem/mailem.

### Czego aplikacja NIE robi (świadomie)

- Nie ma backendu, konta użytkownika, synchronizacji między urządzeniami.
- Nie zastępuje porady lekarskiej/fizjoterapeutycznej — w kilku miejscach
  wprost to zaznacza.
- Nie odtwarza dźwięku ani nie wibruje (świadoma decyzja projektowa — patrz
  sekcja 8).
- Nie ma trybu offline-first z synchronizacją po powrocie online — jest po
  prostu lokalna (offline działa, bo nie ma nigdzie "online").

---

## 2. Architektura

### Stack technologiczny

- **Zero zależności, zero buildu.** Czysty HTML + CSS + vanilla JavaScript
  (ES2020+, bez frameworka, bez bundlera, bez transpilacji).
- Cała logika działa **po stronie klienta** w przeglądarce. Brak jakiegokolwiek
  serwera aplikacyjnego czy API.
- Trwałość danych: `localStorage` (jeden klucz, jeden zserializowany obiekt
  JSON — patrz sekcja 3).
- PWA: `manifest.webmanifest` + Service Worker (`sw.js`) dają instalowalność
  na iOS/Android (ikona na ekranie głównym) i działanie offline.
- Renderowanie widoków: ręczne budowanie stringów HTML (template literals) i
  przypisywanie do `element.innerHTML`, potem ręczne podpinanie
  event listenerów po każdym renderze (brak wirtualnego DOM, brak
  reaktywności — pełny, ręczny re-render całego widoku bieżącej zakładki przy
  każdej zmianie stanu).

### Dwa warianty dystrybucji tego samego kodu

Aplikacja istnieje w **dwóch niemal identycznych buildach** wygenerowanych z
jednego źródła prawdy:

| | Artifact (hosting Claude) | PWA (hosting statyczny, np. GitHub Pages) |
|---|---|---|
| Plik | jeden fragment HTML (bez `<!DOCTYPE>/<html>/<head>/<body>` — dostawca hostingu sam je owija) | pełny dokument HTML z `<!DOCTYPE html>`, `<head>` (viewport, manifest, meta Apple), `<body>` |
| Zapis plików (eksport) | `window.claude.downloads.save()` — natywna funkcja hostingu, pokazuje użytkownikowi potwierdzenie zapisu | Web Share API (`navigator.share`/`canShare` z obiektem `File` — otwiera systemowy arkusz udostępniania, działa niezawodnie na iOS) z fallbackiem do klasycznego `Blob` + `<a download>` |
| Instalowalność / offline | Nie — strona żyje wewnątrz interfejsu hostingu, "dodaj do ekranu głównego" nie daje czystej ikony | Tak — pełny manifest + Service Worker, prawdziwa instalowalna aplikacja |
| Reszta kodu (CSS, dane, logika, parser, widoki) | **identyczna** | **identyczna** |

Oba warianty muszą być budowane z **tego samego źródła** (patrz sekcja "Proces
budowania" niżej) — jeśli odtwarzasz tę aplikację od zera, rozważ, czy w ogóle
potrzebujesz wariantu "Artifact" (jest specyficzny dla platformy Claude); dla
niezależnej reimplementacji **wariant PWA jest tym właściwym, kanonicznym
celem**.

### Struktura katalogów (repozytorium)

```
/
├── index.html                 — PWA: pełny, samodzielny plik (style+dane+logika)
├── manifest.webmanifest        — metadane PWA (nazwa, ikony, kolory, start_url)
├── sw.js                       — Service Worker: cache-first + odświeżanie w tle
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
├── server.js                   — minimalny statyczny serwer Node (tylko dev/localhost)
├── .gitignore                  — ignoruje .claude/ i *.txt (pliki narzędziowe/tymczasowe)
├── README.md                   — instrukcja instalacji/uruchomienia
├── PLAN-TRENERA-INSTRUKCJA.md  — pełna specyfikacja formatu pliku planu (dla trenera)
├── plan-trenera-szablon.md     — przykładowy, wypełniony szablon do skopiowania
├── plan-trenera-szablon.json   — ten sam szablon w formacie JSON (starszy, nadal wspierany)
├── plan-4-tygodnie.md          — gotowy, zaszyty w aplikacji plan startowy (4 tygodnie)
└── INSTRUKCJA-WIELU-UZYTKOWNIKOW.md — instrukcja obsługi wielu niezależnych użytkowników
```

Nie ma katalogu `src/`, `dist/`, `node_modules/` — to jest świadome, patrz
sekcja 8 i "Proponowane usprawnienia".

### Proces budowania (jak PWA powstaje z jednego źródła)

Kanoniczne źródło to plik-fragment (styl + znaczniki body + skrypt, bez
opakowania w pełny dokument). Transformacja do `index.html` (PWA) polega na:

1. Wyciągnięciu bloku `<style>...</style>` w całości.
2. Wyciągnięciu zawartości pomiędzy końcem `<style>` a początkiem `<script>`
   (czyli znaczników `<header>`, `<main>`, overlay timera, `<nav>`, root modala).
3. Wyciągnięciu bloku `<script>...</script>` i **podmianie** w nim funkcji
   zapisu plików: usunięcie gałęzi `window.claude.downloads` (dostępnej tylko
   w hostingu Claude), zastąpienie jej próbą Web Share API z fallbackiem do
   `Blob`+`<a download>` (patrz sekcja 4, "Eksport/Import danych").
4. Owinięciu tego w pełny dokument: `<!DOCTYPE html><html><head>` (meta
   charset, viewport z `viewport-fit=cover`, `theme-color`, meta
   `apple-mobile-web-app-*`, link do manifestu, ikony) `</head><body>` ...
   wyciągnięta zawartość ... rejestracja Service Workera na końcu `</body>`.
5. Zapisaniu wyniku jako `index.html`.

Ta transformacja **musi** być powtarzana po każdej zmianie źródła — jeśli
odtwarzasz projekt od zera i nie potrzebujesz wariantu "Artifact", pomiń ten
krok całkowicie i po prostu buduj `index.html` bezpośrednio jako jedyne
źródło prawdy (patrz "Proponowane usprawnienia" — to jedno z pierwszych
uproszczeń, jakie warto wprowadzić).

### Wdrożenie

- Repozytorium Git, zdalne na GitHub.
- Hosting: GitHub Pages serwujący branch `main` z katalogu głównego repo.
- Lokalny development: `node server.js` (prosty statyczny serwer plików bez
  żadnych zależności) na porcie 8123.
- Wersjonowanie: stała `APP_VERSION` (string typu `'009'`) w kodzie źródłowym,
  wyświetlana w nagłówku aplikacji jako "ver. NNN". Podbijana o 1 przy każdej
  publikacji. Nazwa cache w Service Workerze (`CACHE = 'gymapp-vNNN'`)
  bumpowana w tej samej chwili co `APP_VERSION`, żeby wymusić odświeżenie
  cache u zainstalowanych użytkowników.

---

## 3. Model danych

### 3.1. Trwałość i klucz przechowywania

- Cały stan aplikacji to **jeden obiekt JS, serializowany do JSON i zapisywany
  pod jednym kluczem `localStorage`** (`gymapp_v1`).
- Odczyt przy starcie: `JSON.parse(localStorage.getItem(klucz))`, płytko
  scalone (`Object.assign`) z domyślnym stanem — czyli brakujące
  klucze najwyższego poziomu dostają wartości domyślne, ale zagnieżdżone
  obiekty (np. `settings`) są **całkowicie nadpisywane**, jeśli klucz
  najwyższego poziomu istnieje w zapisanych danych (brak głębokiego mergowania
  — patrz "Proponowane usprawnienia").
- Zapis: po **każdej** zmianie stanu, synchronicznie, całość na raz
  (nie ma inkrementalnych zapisów ani debounce).
- Pole `v: 1` istnieje w strukturze stanu jako punkt zaczepienia pod przyszłe
  migracje schematu, ale **nie ma żadnej logiki migracji** — jest czystym
  zarodkiem na przyszłość.

### 3.2. Kształt głównego stanu aplikacji (`AppState`)

```
AppState = {
  v: 1,
  settings: {
    bodyWeightKg: number | null,
    proteinPerKg: number,          // domyślnie 2.1 (z konfiguracji żywieniowej)
    kcalMaintenance: number | null
  },
  plan: {
    phase: number,                 // indeks bieżącej fazy w PLAN_DATA.phases (0, 1, 2, ...)
    week: number,                  // numer tygodnia w bieżącym mezocyklu (1..phase.weeks)
    phaseStartedOn: string (ISO data RRRR-MM-DD)
  },
  sessions: Session[],             // wszystkie ZAKOŃCZONE sesje treningowe, chronologicznie
  activeSession: Session | null,   // sesja aktualnie w trakcie (jedna naraz)
  paused: { [exerciseId: string]: string (ISO data, do kiedy wstrzymane) },
  nutrition: { [isoData: string]: NutritionEntry },
  rehab: { [isoData: string]: RehabEntry },
  customPlan: TrainerPlan | null   // plan wczytany z pliku od trenera; null = używamy planu wbudowanego
}
```

### 3.3. `Session` (sesja treningowa — plan wbudowany)

```
Session = {
  id: number,                      // Date.now() z momentu utworzenia — unikalny identyfikator
  date: string (ISO),              // data ROZPOCZĘCIA sesji
  startedAt: number (epoch ms),
  finishedAt: number (epoch ms) | null,
  phase: number,                   // NUMERYCZNY indeks fazy (0/1/2) — TYLKO dla planu wbudowanego
  week: number,
  day: string,                     // litera dnia, np. "A" / "B" / "C"
  warmup: string[],                // lista kroków rozgrzewki (kopia z planu w momencie startu)
  warmupDone: boolean[],           // równoległa tablica odhaczeń — indeks odpowiada krokowi
  exercises: SessionExercise[]
}
```

### 3.4. `Session` (sesja treningowa — plan od trenera)

Identyczny kształt, ale z różnicami:

```
Session.phase = 'custom'           // string literal, NIE liczba — patrz "code smell" w sekcji 9
Session.plannedId = number         // id treningu z planu trenera (do której pozycji harmonogramu należy)
Session.plannedDate = string (ISO) // zaplanowana data z pliku trenera
Session.rpeLabelCustom = string    // np. "RPE 6-7", do wyświetlenia w nagłówku sesji
Session.day = string                // tu: PEŁNA NAZWA treningu z pliku trenera (nie pojedyncza litera)
```

### 3.5. `SessionExercise`

```
SessionExercise = {
  order: number,                   // kolejność wykonania (1-indexed)
  ex: string,                      // id ćwiczenia (klucz do katalogu ćwiczeń)
  targetSets: number,
  targetReps: string,              // np. "10-12", "do RPE 7", "30-45 s" — TEKST, nie liczba
  targetWeight: number | null,     // wynik silnika progresji (sekcja 6) w momencie STARTU sesji
  targetNote: string | null,       // opisowy cel, gdy weight===null (np. "RPE 6", "+5%")
  suggestReason: string,           // ludzki opis DLACZEGO taki ciężar (np. "wg planu", "ból przy ostatniej sesji → −10%")
  suggestStatus: 'new' | 'ok' | 'caution' | 'blocked',
  tempo: string,                   // np. "3110" albo opis słowny
  rest: number (sekundy),
  restLabel: string,               // etykieta do wyświetlenia (może być zakresem, np. "90-120 s")
  rpeTarget: number,                // docelowe RPE tego ćwiczenia w tej sesji
  optional: boolean,               // czy domyślnie pominięte (np. ćwiczenia Fazy 2)
  sets: LoggedSet[],                // faktycznie wykonane serie, w kolejności wykonania
  pain24h: number (0-10) | null,   // ocena bólu 24h po treningu (wypełniana osobno, później)
  skipped: boolean                 // true jeśli ćwiczenie pominięte (wstrzymane, opcjonalne nierozpoczęte, lub ręcznie pominięte)
}
```

### 3.6. `LoggedSet`

```
LoggedSet = {
  reps: number,
  weight: number | null,           // null = masa własna (bodyweight)
  rpe: number (5-10),
  pain: number (0-10),              // ból W TRAKCIE serii, zgłaszany natychmiast
  t: number (epoch ms)              // znacznik czasu zapisania serii
}
```

### 3.7. `NutritionEntry` (klucz: data ISO)

```
NutritionEntry = {
  weight: number | null,            // waga ciała tego dnia (kg)
  kcal: number | null,               // spożyte kalorie
  protein: number | null,            // spożyte białko (g)
  collagen: boolean,                 // czy przyjęto kolagen + wit. C
  omega3: boolean,
  water: number                      // nawodnienie w litrach
}
```

### 3.8. `RehabEntry` (klucz: data ISO)

```
RehabEntry = {
  pain: number (0-10) | null,        // ogólny ból łokcia tego dnia
  [rehabItemId: string]: boolean     // dynamiczne klucze — jeden na każdą pozycję
                                      // aktualnej listy rehab (wbudowanej albo z planu trenera)
}
```

Uwaga projektowa: struktura jest **celowo dynamiczna** (klucze rehab-checkboxów
nie są sztywno wymienione w typie) — bo lista pozycji rehab może pochodzić z
planu trenera i mieć inne identyfikatory niż wbudowany protokół. Kod musi
zawsze iterować po **aktualnej liście rehab** (patrz `rehabList()` w sekcji 6),
nigdy po zahardkodowanych nazwach pól.

### 3.9. `TrainerPlan` (sparsowany plan od trenera — po walidacji, gotowy do użycia)

```
TrainerPlan = {
  meta: {
    trener: string | null,
    zawodnik: string | null,
    nazwa: string,                   // domyślnie "Plan od trenera" jeśli nie podano
    opis: string | null,
    uwagi: string | null             // ogólna notatka widoczna w karcie planu
  },
  workouts: TrainerWorkout[],        // POSORTOWANE chronologicznie po dacie, id renumerowane 1..N
  rehab: RehabItem[] | null,         // nadpisuje wbudowaną listę rehab, jeśli podana
  techDetails: { [id]: { name, desc, video } } | null  // opisy techniki z appendixu (patrz 5.4)
}

TrainerWorkout = {
  id: number,                       // 1-indexed, PO sortowaniu chronologicznym
  date: string (ISO RRRR-MM-DD),
  name: string,                     // pełna nazwa treningu, np. "A — nogi + plecy"
  week: number | null,               // opcjonalny numer tygodnia (informacyjny + używany w regułach progresji)
  rpeTarget: number | null,          // docelowe RPE całego treningu
  notes: string | null,
  warmup: string[] | null,           // rozgrzewka specyficzna dla tego treningu (nadpisuje globalną)
  items: TrainerPlanItem[]
}

TrainerPlanItem = {
  ex: string,                        // id ćwiczenia (slug)
  name: string,
  sets: number,
  reps: string,
  weight: number | null,
  weightLabel: string | null,        // opis ciężaru gdy weight===null (może zawierać magiczne wzorce "+5%"/"+1 kg")
  tempo: string,
  rest: number (sekundy),
  restLabel: string | null,
  rpeTarget: number | null,
  elbowSafe: true | false | 'warn',
  straps: boolean,
  optional: boolean,
  hint: string | null,
  desc: string | null,               // z appendixu (### Nazwa [id]), jeśli pasujący wpis istnieje
  video: string | null,              // z kolumny tabeli LUB z appendixu (kolumna ma priorytet)
  warnings: string[]
}

RehabItem = { id: string, name: string, desc: string, video: string | null }
```

### 3.10. Katalog ćwiczeń wbudowanych (`PLAN_DATA.exercises`)

Słownik: klucz = slug id (np. `leg_press`), wartość:

```
ExerciseDef = {
  name: string,
  muscles: string[],                 // np. ["nogi-przód"] — czysto informacyjne, nieużywane w logice
  elbowSafe: true | false | 'warn',
  straps: boolean | undefined,        // czy wymaga pasków (lifting straps)
  bodyweight: boolean | undefined,
  timeBased: boolean | undefined,      // np. plank — cel podawany w sekundach, nie powtórzeniach
  distanceBased: boolean | undefined,  // np. farmer carry — cel w metrach
  hint: string | undefined,            // krótka wskazówka bezpieczeństwa (widoczna na karcie)
  warnings: string[] | undefined,      // HISTORYCZNE ostrzeżenia (konkretne incydenty z przeszłości użytkownika)
  preBreak: string | undefined,        // ciężar sprzed przerwy treningowej (kontekst/punkt odniesienia)
  desc: string | undefined,            // pełny opis techniki (widoczny w modalu "jak robić")
  video: string | undefined            // link do YouTube (wyszukiwarka, nie konkretny film — patrz sekcja 8)
}
```

21 wbudowanych pozycji — pełna lista: `leg_press`, `hip_thrust`, `goblet_squat`,
`leg_extension`, `lat_pulldown_neutral`, `chest_press`, `shoulder_press_machine`,
`pallof_press`, `face_pull_straps`, `plank_deadbug`, `seated_row_neutral`,
`pullup_neutral_assisted`, `biceps_curl_hammer`, `deadlift_straps`,
`split_squat`, `seal_row`, `back_squat_light`, `farmer_carry_straps`,
`db_press_free`, `pullup_unassisted`, `barbell_row_straps`.

### 3.11. Fazy planu wbudowanego (`PLAN_DATA.phases`)

Tablica 3 elementów (indeksy 0, 1, 2):

```
Phase = {
  id: number,
  name: string,
  desc: string,
  weeks: number,                     // długość mezocyklu w tygodniach
  sessionsPerWeek: number,
  rpeTarget: { [tydzień: number]: number },   // liczbowy cel RPE per tydzień
  rpeLabel: { [tydzień: number]: string },     // etykieta tekstowa (może być zakresem, np. "RPE 6-7")
  advanceCriteria: string | null,     // opis kryterium przejścia do następnej fazy; null = brak bramki (ostatnia faza)
  days: { [litera: string]: DayPlan } | undefined,   // brak gdy inheritDays ustawione
  inheritDays: number | undefined,    // indeks fazy, z której dziedziczy strukturę dni (tylko Faza 2)
  extras: { [litera: string]: PlanItem[] } | undefined, // dodatkowe/zamienne ćwiczenia dla odziedziczonych dni
  rotation: string[]                  // kolejność liter dni w rotacji (np. ["A","B","C"])
}

DayPlan = { label: string, items: PlanItem[] }

PlanItem = {
  ex: string,
  tempo: string,
  rest: number,
  restLabel: string | undefined,
  optional: boolean | undefined,
  replaces: string | undefined,        // (tylko w extras) — informacyjne, nieużywane programowo do usuwania oryginału
  // WARIANT A — stały cel (Faza 0):
  sets: number, reps: string, weight: number | null, weightLabel: string | undefined,
  // WARIANT B — cel zależny od tygodnia mezocyklu (Faza 1, dziedziczone przez Fazę 2):
  byWeek: { [tydzień: number]: { sets: number, reps: string, weight: number | null, note: string | undefined } }
}
```

**Faza 0** ("Reintroduction"): 2 tygodnie, 3 sesje/tydzień, dni A/B/C, każdy
dzień ma **stałe** cele (wariant A) — brak progresji tygodniowej w danych,
progresję dostarcza wyłącznie silnik (sekcja 6).

**Faza 1** ("Zmodyfikowany A/B/C"): 4-tygodniowy mezocykl, dni A/B/C, każdy
element **ma** `byWeek` z jawnymi celami na tydzień 1–4 (progresja
zaprojektowana ręcznie w danych, silnik i tak może ją korygować w dół).

**Faza 2** ("Reintegracja"): dziedziczy strukturę dni z Fazy 1
(`inheritDays: 1`) i dokleja dodatkowe/zamienne ćwiczenia z `extras` (np.
farmer carry, wolne ciężary) oznaczone jako `optional: true` — więc domyślnie
pominięte, użytkownik świadomie je włącza.

### 3.12. Żywienie (`PLAN_DATA.nutrition`) i bezpieczeństwo (`PLAN_DATA.safetyRules`)

Statyczna konfiguracja tekstowa + liczbowa:
`proteinPerKgMin/Max/Default`, `proteinPerMeal` (opis), `kcalRule` (opis),
`kcalSurplusTraining` (liczba, dodawana automatycznie do celu kcal w dni
treningowe), `carbsPreWorkout`, `collagen`, `omega3`, `stagnation` (opis
reguły korekty przy stagnacji wagi), `meals[]` (5 przykładowych posiłków:
nazwa, timing, cel białkowy, uwaga).

`safetyRules` — lista 7 stringów zawsze wyświetlanych w zakładce Plan
(nieedytowalna, czysto informacyjna — faktyczne reguły są zaimplementowane
osobno w silniku progresji, ta lista to tylko ich czytelne podsumowanie dla
użytkownika).

---

## 4. Funkcjonalności — zachowanie (input → output → efekty uboczne)

### 4.1. Start aplikacji

- **Input:** otwarcie strony (świeża instalacja lub powrót).
- **Zachowanie:** wczytaj stan z `localStorage` (albo utwórz domyślny).
  Odbuduj rejestr ćwiczeń z planu trenera (jeśli jest). Wyrenderuj zakładkę
  "Trening".
- **Output:** widoczny numer wersji w nagłówku, dzisiejszy/najbliższy trening
  do zrobienia.

### 4.2. Nawigacja między zakładkami

- **Input:** tapnięcie ikony w dolnym pasku (Trening / Historia / Żywienie /
  Rehab / Plan).
- **Zachowanie:** zmień aktywną zakładkę, wyrenderuj jej widok, **przewiń na
  samą górę** kontenera treści (to jest jedyne miejsce, gdzie re-render
  resetuje scroll — patrz sekcja 8, "poprawka iOS").
- **Efekt uboczny:** żaden zapis do storage (czysta zmiana widoku).

### 4.3. Widok "dzisiejszy trening" (plan wbudowany, bez importu trenera)

- **Input:** brak (widok domyślny zakładki Trening, gdy `customPlan === null`
  i brak aktywnej sesji).
- **Zachowanie:**
  1. Pokaż banery: pytania follow-up 24h o ból (jeśli są zaległe — patrz 4.9),
     ostrzeżenie o regeneracji <48h od ostatniego treningu, przypomnienie o
     rehabie jeśli dzisiaj jeszcze niezrobiony.
  2. Pokaż 3 kafelki wyboru dnia (A/B/C dla obecnej fazy), z oznaczeniem
     "nast." przy dniu sugerowanym przez rotację.
  3. Dla wybranego dnia: karta rozgrzewki (lista kroków, nieinteraktywna w
     podglądzie) + karta na każde ćwiczenie dnia, pokazująca: nazwę, plakietki
     bezpieczeństwa, docelowe serie×powtórzenia, **sugerowany ciężar z silnika
     progresji** (nie surowy plan!) i uzasadnienie tekstowe.
  4. Przycisk "Rozpocznij trening [litera]".
- **Output:** brak zapisu — to czysty podgląd, dopóki użytkownik nie kliknie
  start.

### 4.4. Wybór dnia sugerowanego przez rotację

- **Algorytm:** znajdź ostatnią zakończoną sesję **w bieżącej fazie**. Jeśli
  brak — zaproponuj pierwszy dzień w kolejności rotacji fazy. Jeśli jest —
  zaproponuj kolejny dzień w rotacji **cyklicznie** (po ostatnim dniu wraca do
  pierwszego).
- To jest tylko **sugestia** — użytkownik może ręcznie wybrać inny kafelek.

### 4.5. Import planu od trenera — wybór pliku

- **Input:** użytkownik wybiera plik `.md`/`.markdown`/`.txt`/`.json` przez
  natywny input pliku w zakładce Plan.
- **Zachowanie:**
  1. Wczytaj zawartość pliku jako tekst.
  2. Jeśli tekst zaczyna się od `{` — traktuj jako JSON, sparsuj, waliduj wg
     schematu (sekcja 5.1).
  3. W przeciwnym razie — traktuj jako Markdown, sparsuj wg gramatyki (sekcja
     5.2), potem zwaliduj wynikowy obiekt tym samym walidatorem co JSON.
  4. Jeśli walidacja zwróci błędy — pokaż modal z listą błędów (max 12 + licznik
     pozostałych), **nic nie zapisuj**, poprzedni stan (`customPlan`,
     `sessions` itd.) pozostaje nietknięty.
  5. Jeśli sukces — zapisz `customPlan`, przebuduj rejestr ćwiczeń z planu
     (`CUSTOM_EX`), zapisz stan, pokaż toast z nazwą planu i liczbą treningów.
- **Efekt uboczny:** od tej chwili zakładka Trening pokazuje **wybór treningu
  po dacie** zamiast kafelków A/B/C, a zakładka Plan pokazuje kartę planu
  trenera zamiast wbudowanej.
- **Ważne:** import NIE kasuje `sessions` (historii) — podmienia tylko plan na
  przyszłość.

### 4.6. Wczytanie gotowego planu 4-tygodniowego (jednym tapnięciem)

- **Input:** tapnięcie przycisku "Wczytaj gotowy plan 4 tyg." w karcie planu
  trenera (widoczny tylko gdy `customPlan === null`).
- **Zachowanie:** identyczne jak import pliku, ale źródłem tekstu jest
  wbudowany string (funkcja generująca zaszyty plan startowy — 12 treningów,
  wtorek/czwartek/sobota, 4 tygodnie, tygodnie 1–2 = Faza 0, tygodnie 3–4 =
  Faza 1 tydzień 1–2 mezocyklu). Ten wbudowany plan MUSI zawsze parsować się
  bez błędów (jeśli nie — to błąd w kodzie aplikacji, nie w danych
  użytkownika).

### 4.7. Wybór treningu po dacie (gdy plan trenera aktywny)

- **Input:** wybór z listy rozwijanej (`<select>`) wszystkich treningów z
  planu, z etykietą "data · nazwa" i ✓ przy już wykonanych.
- **Zachowanie:** domyślnie wybrany trening to (w tej kolejności): dzisiejszy
  jeszcze niewykonany → najbliższy przyszły niewykonany → pierwszy zaległy
  niewykonany → ostatni w ogóle (fallback, gdy wszystko wykonane).
- **Output:** baner informujący, czy trening jest zaplanowany na przyszłość,
  zaległy, czy już wykonany (można powtórzyć — zapisze się jako kolejna,
  osobna sesja).

### 4.8. Rozpoczęcie sesji treningowej

- **Input:** tapnięcie "Rozpocznij trening".
- **Zachowanie:** zbuduj obiekt `Session` (sekcja 3.3/3.4) — dla każdego
  ćwiczenia w dniu/treningu oblicz sugerowany ciężar **raz, w tym momencie**
  (silnik progresji, sekcja 6) i zamroź go jako `targetWeight` — to jest
  ciężar, który zobaczy użytkownik przez całą sesję, nawet jeśli w
  międzyczasie coś by się zmieniło. Ćwiczenia wstrzymane (ból) lub oznaczone
  jako opcjonalne startują z `skipped: true`.
- **Output:** widok aktywnej sesji (4.9). Zapis stanu.

### 4.9. Logowanie serii

- **Input:** w karcie bieżącego ćwiczenia — powtórzenia (stepper ±1), ciężar
  kg (stepper ±2.5), RPE (chipy 5–10), ból łokcia W TRAKCIE (chipy 0–10,
  domyślnie zaznaczone 0). Tapnięcie "Zapisz serię".
- **Walidacja:** powtórzenia muszą być >0. RPE musi być wybrane (wymagane —
  bez tego progresja nie ma jak działać). Ciężar może być pusty (masa
  własna).
- **Zachowanie:**
  1. Dopisz `LoggedSet` do `sets[]` tego ćwiczenia. Zapisz stan.
  2. **Jeśli ból > 2:** pokaż modal bezpieczeństwa — dwie opcje:
     - "Wstrzymaj ćwiczenie na 7 dni i pomiń" (rekomendowana, czerwony
       przycisk) → wywołuje wstrzymanie (4.13), oznacza ćwiczenie jako
       pominięte w TEJ sesji, zamyka modal, **nie startuje timera przerwy**.
     - "Kontynuuję świadomie (niezalecane)" → zamyka modal, **startuje timer
       przerwy normalnie**. Świadomy wybór użytkownika, aplikacja nie blokuje
       na siłę.
  3. **Jeśli ból ≤ 2:** normalnie — start timera przerwy (4.14), re-render z
     **zachowaniem pozycji przewijania** (patrz sekcja 8 — to była zgłoszona
     usterka, naprawiona).
  4. Gdy wszystkie serie ćwiczenia zalogowane → karta pokazuje ✅, znika pole
     do wpisywania kolejnej serii, pojawia się opcja "Pomiń ćwiczenie" zmienia
     się na inny stan (ćwiczenie skończone).

### 4.10. Pomijanie / przywracanie ćwiczenia w trakcie sesji

- **Input:** link "Pomiń ćwiczenie" / "Przywróć ćwiczenie" pod kartą.
- **Zachowanie:** przełącza `skipped` na tym ćwiczeniu. Odwracalne w obrębie
  tej samej, jeszcze niezakończonej sesji.

### 4.11. Zakończenie sesji

- **Input:** tapnięcie "Zakończ trening" → modal potwierdzenia (informuje ile
  ćwiczeń ma niedokończone serie — te i tak zapisują się jako "wykonane
  częściowo") → potwierdzenie.
- **Zachowanie:**
  1. Ustaw `finishedAt`. Ćwiczenia bez ani jednej zalogowanej serii oznacz
     jako `skipped = true`.
  2. Przenieś sesję z `activeSession` na koniec `sessions[]`.
  3. **Jeśli plan trenera aktywny:** policz ile treningów z planu zostało
     niewykonanych, pokaż odpowiedni toast. Koniec — brak dalszej logiki
     faz/tygodni (plan trenera nie ma pojęcia mezocyklu wbudowanego).
  4. **Jeśli plan wbudowany:** policz ile sesji w BIEŻĄCEJ fazie+tygodniu już
     jest w historii. Jeśli osiągnięto `sessionsPerWeek`:
     - jeśli bieżący tydzień < długość mezocyklu fazy → **inkrementuj
       tydzień**, pokaż toast z nowym celem RPE,
     - inaczej, jeśli to Faza 0 → pokaż toast "sprawdź kryteria przejścia do
       Fazy 1" (NIE przechodzi automatycznie — wymaga ręcznego potwierdzenia,
       sekcja 4.16),
     - inaczej (koniec mezocyklu Fazy 1/2) → **zresetuj tydzień do 1**
       (nowy mezocykl), pokaż toast.
  5. Zamknij timer przerwy jeśli aktywny. Wyrenderuj widok od nowa (reset
     scroll — to jest "nowy ekran").

### 4.12. Anulowanie sesji

- **Input:** "Anuluj (bez zapisu)" → modal potwierdzenia → potwierdzenie.
- **Zachowanie:** usuń `activeSession` **bez zapisywania jej do historii**.
  Wszystkie zalogowane w tej sesji serie przepadają. Nieodwracalne (stąd
  modal potwierdzenia).

### 4.13. Wstrzymanie ćwiczenia po bólu

- **Input:** wynik logowania serii z bólem >2 (4.9) albo ocena 24h po
  treningu z bólem >2 (4.15 niżej).
- **Zachowanie:** `paused[exerciseId] = dzisiejsza_data + 7 dni`.
- **Efekt:** każdy widok pokazujący to ćwiczenie (podgląd dnia, aktywna
  sesja) pokazuje czerwony pasek ostrzeżenia + datę powrotu + link "przywróć"
  (który wymaga jawnego potwierdzenia w modalu, bo cofa zalecenie
  bezpieczeństwa).
- **Automatyczne wygaśnięcie:** ćwiczenie przestaje być wstrzymane samo,
  gdy dzisiejsza data przekroczy zapisaną datę (sprawdzane przy każdym
  odczycie, nie ma osobnego zadania czyszczącego).

### 4.14. Timer przerwy

- **Input:** automatyczny start po zalogowaniu serii (chyba że ból>2 i
  wybrano wstrzymanie — wtedy timer się NIE uruchamia).
- **Zachowanie:** nakładka na dole ekranu z odliczaniem mm:ss, nazwą
  ćwiczenia, przyciskami −15s / +15s / Pomiń. Po dojściu do 0: zmienia kolor
  (pulsowanie), tekst na "Koniec przerwy — dawaj!", **automatycznie znika po
  8 sekundach**. Widoczny niezależnie od tego, którą zakładkę użytkownik
  przegląda w międzyczasie (globalny overlay, nie część treści zakładki).
- **Świadomie BRAK:** dźwięku, wibracji, powiadomień systemowych — czysto
  wizualny (patrz sekcja 8, decyzja projektowa).

### 4.15. Follow-up bólu 24h po treningu

- **Kiedy się pojawia:** sesja jest kwalifikowana jako "oczekująca na
  follow-up", gdy `finishedAt` jest **między 20 a 168 godzin temu** (20h =
  dolna granica żeby nie pytać zbyt wcześnie, 168h = 7 dni, żeby stare sesje
  nie wisiały w nieskończoność) ORAZ ma choć jedno ćwiczenie z zalogowanymi
  seriami, dla którego `pain24h` jest wciąż `null`.
- **Gdzie się pojawia:** jako karta na górze zakładki Trening ORAZ zakładki
  Historia (to samo query, dwa miejsca wyświetlania).
- **Input:** dla każdego ćwiczenia z tej sesji — chip bólu 0–10.
- **Zachowanie:** zapisz `pain24h` na tym ćwiczeniu. Jeśli >2 → wstrzymaj
  ćwiczenie tak samo jak w 4.13.

### 4.16. Bramka przejścia do następnej fazy

- **Kiedy widoczna:** w zakładce Plan, tylko gdy plan wbudowany aktywny (nie
  trener), bieżąca faza ma `advanceCriteria` niepuste, i to nie jest
  ostatnia faza.
- **4 kryteria sprawdzane jednocześnie** (wszystkie muszą być ✅ dla
  "odblokowane", ale przycisk jest **zawsze klikalny**, nawet gdy nie
  wszystkie spełnione — patrz niżej):
  1. Liczba sesji w tej fazie ≥ `sessionsPerWeek × weeks` tej fazy.
  2. Liczba dni od pierwszej sesji w tej fazie ≥ (2 tygodnie dla Fazy 0, 6
     tygodni dla pozostałych) × 7 − 1.
  3. Zero jakiegokolwiek bólu (w trakcie serii LUB 24h po) w całej fazie.
  4. Wszystkie sesje w tej fazie mają uzupełnione oceny 24h (żadna nie wisi
     bez odpowiedzi).
- **Input:** tapnięcie przycisku (etykieta zmienia się zależnie od stanu:
  "🔓 Przejdź do Fazy N" gdy wszystko ok, "Przejdź mimo to (kryteria
  niespełnione)" gdy nie) → modal potwierdzenia z ostrzeżeniem jeśli kryteria
  niespełnione → potwierdzenie.
- **Zachowanie po potwierdzeniu:** `phase++`, `week = 1`,
  `phaseStartedOn = dziś`. To jest **zawsze ręczna, świadoma decyzja** —
  aplikacja nigdy nie przechodzi fazy automatycznie, nawet gdy kryteria są
  w pełni spełnione.
- Jest też przycisk "← Wróć do poprzedniej fazy" (bez żadnego potwierdzenia
  ani kryteriów — czysto administracyjny, na wypadek pomyłki).

### 4.17. Ręczna zmiana tygodnia mezocyklu

- **Input:** przyciski +/− przy "Tydzień: N/M" w zakładce Plan (tylko plan
  wbudowany).
- **Zachowanie:** zmienia `plan.week` w granicach [1, długość mezocyklu].
  Brak żadnych zabezpieczeń przed niespójnością z historią sesji (patrz
  sekcja 9 — code smell).

### 4.18. Log żywieniowy

- **Input (zakładka Żywienie, zawsze dotyczy DZISIAJ):** waga ciała, kalorie,
  białko (g), nawodnienie (stepper ±0.25 l), dwa checkboxy (kolagen+wit.C,
  omega-3).
- **Zachowanie:**
  - Cel białkowy = `waga_ciała_wpisana_dziś_lub_ostatnia_znana × proteinPerKg`
    (zaokrąglony). Jeśli brak jakiejkolwiek wagi — brak celu, pokazuje się
    podpowiedź "podaj wagę".
  - Cel kaloryczny = `kcalMaintenance` (z ustawień) `+ kcalSurplusTraining`
    **jeśli dziś istnieje zakończona LUB aktywna sesja treningowa** (wykryte
    po dacie), inaczej sam `kcalMaintenance`. Jeśli `kcalMaintenance` nie
    ustawiony — brak celu.
  - Pasek postępu białka: kolor zwykły do 89%, zielony od 90% w górę.
  - **Reguła stagnacji wagi:** znajdź najnowszy wpis wagi. Znajdź jakikolwiek
    wcześniejszy wpis wagi sprzed **14 do 21 dni** od najnowszego. Jeśli
    różnica wag < 0.4 kg → pokaż baner z liczbą dni i treścią reguły korekty
    z `PLAN_DATA.nutrition.stagnation`.
  - Lista ostatnich 10 dni z wpisami (poza dniem dzisiejszym).
- Wszystkie pola zapisują się **natychmiast po zmianie** (`change` event),
  bez osobnego przycisku "zapisz".

### 4.19. Rehab łokcia — codzienna checklista

- **Input:** lista checkboxów (dynamiczna — z planu trenera jeśli podana,
  inaczej 3 wbudowane pozycje), każdy z opcjonalnym przyciskiem 🎥 do opisu
  techniki. Plus ogólny chip bólu 0–10 na dziś.
- **Zachowanie:**
  - Każdy checkbox zapisuje się natychmiast pod kluczem = id pozycji rehab
    dla dzisiejszej daty.
  - "Zrobione dzisiaj" = WSZYSTKIE pozycje aktualnej listy zaznaczone.
  - **Streak** (seria dni z rzędu): licz wstecz od dziś, dopóki każdy dzień
    ma komplet zaznaczeń; dzisiejszy dzień jest wybaczony jeśli jeszcze
    niezrobiony (nie przerywa liczenia wstecz, po prostu się nie liczy do
    przodu).
  - Siatka "ostatnie 7 dni" — wizualizacja ✓/· per dzień tygodnia.
  - Jeśli ból ogólny >3 → toast z sugestią lodu i lżejszego dnia.
  - Odznaka (badge) na ikonie zakładki Rehab w dolnym pasku widoczna, dopóki
    dzisiejszy komplet nie jest zaznaczony.

### 4.20. Wykres progresji obciążenia (Historia)

- **Input:** wybór ćwiczenia z listy rozwijanej (tylko ćwiczenia, które mają
  choć jedną zalogowaną serię z ciężarem).
- **Zachowanie:** dla wybranego ćwiczenia zbierz z całej historii sesji:
  maksymalny ciężar w każdej sesji (chronologicznie), zaznacz na wykresie
  SVG (polyline + kropki). Kropka **czerwona**, jeśli ta sesja miała ból
  >2 w trakcie JAKIEJKOLWIEK serii tego ćwiczenia LUB ocena 24h >2 — inaczej
  kropka w kolorze akcentu. Skala Y z marginesem (min×0.92 do max×1.05+0.1).
  Etykiety wartości nad kropkami, daty (skrócone MM.DD) pod osią X.

### 4.21. Historia sesji

- Lista wszystkich zakończonych sesji, najnowsza pierwsza, każda jako
  rozwijalny (`<details>`) wiersz pokazujący: dzień/nazwę, datę, fazę+tydzień
  (lub "plan trenera"), sumaryczną objętość (Σ ciężar×powtórzenia po
  wszystkich seriach), znacznik "ból!" jeśli był, i po rozwinięciu — pełny
  zapis każdego ćwiczenia (każda seria: powt.×ciężar @RPE, ból jeśli >0,
  ocena 24h jeśli jest).
- Przycisk usunięcia sesji (z modalem potwierdzenia, nieodwracalne).

### 4.22. Eksport historii do pliku tekstowego

- **Input:** przycisk "Eksportuj historię ćwiczeń (.txt)" w zakładce Historia
  (widoczny tylko gdy jest choć jedna sesja).
- **Zachowanie:** wygeneruj czysty tekst: nagłówek z datą eksportu i liczbą
  sesji, potem dla każdej sesji sekcja `== data · dzień (kontekst) ==` i pod
  nią każde ćwiczenie z pełnym zapisem serii (jak w 4.21, ale w formie tekstu,
  nie HTML). Zapisz plik przez mechanizm eksportu (sekcja 4.24).

### 4.23. Pełny eksport/import/reset danych (kopia zapasowa)

- **Eksport** (zakładka Plan): cały `AppState` jako sformatowany JSON,
  nazwa pliku `trening-backup-{data}.json`.
- **Import:** wybór pliku JSON → `JSON.parse` → scal z domyślnym stanem
  (płytko, jak przy starcie) → zastąp cały bieżący stan → przebuduj rejestr
  ćwiczeń trenera → zapisz → toast sukcesu. Błąd parsowania → toast błędu,
  **stan bieżący pozostaje nietknięty**.
- **Reset:** modal ostrzegawczy ("zrób najpierw eksport!") → potwierdzenie →
  całkowite zastąpienie stanu świeżym `defaultState()`.

### 4.24. Mechanizm zapisu plików (eksport)

Zunifikowana funkcja przyjmująca nazwę pliku, treść tekstową i typ MIME:

```
saveFile(nazwa, tekst, mime):
  jeśli działamy w hostingu Claude (window.claude.downloads istnieje):
    poproś hosting o zapis (pokazuje użytkownikowi natywne potwierdzenie)
    w razie odrzucenia/błędu — pokaż odpowiedni toast, nie traktuj jako fatalne
  w przeciwnym razie (wariant PWA):
    spróbuj zbudować obiekt File i użyć Web Share API (navigator.share z files)
      — na iOS otwiera systemowy arkusz udostępniania, użytkownik wybiera
      "Zapisz w Plikach" i to działa niezawodnie
    jeśli Web Share niedostępne — zbuduj Blob, utwórz tymczasowy link <a download>
      i kliknij go programowo (fallback dla desktopu/starszych przeglądarek)
```

Używane do: eksportu historii (.txt), pełnego backupu (.json), pobrania
szablonu pliku dla trenera (.md).

### 4.25a. Blokada wygaszacza ekranu (Wake Lock)

- **Zachowanie:** przy starcie aplikacji i za każdym razem, gdy karta wraca
  do stanu widocznego (`visibilitychange` → `visible`), aplikacja prosi
  przeglądarkę o `navigator.wakeLock.request('screen')`. Ekran telefonu nie
  gaśnie samoczynnie, dopóki aplikacja jest na wierzchu. Wake Lock jest
  **automatycznie zwalniany przez przeglądarkę**, gdy karta staje się
  niewidoczna (przełączenie aplikacji, zablokowanie telefonu) — stąd
  konieczność ponownej prośby przy powrocie.
- Brak wsparcia przeglądarki albo odmowa uprawnienia → po cichu ignorowane
  (feature-detection przez `'wakeLock' in navigator`, całość w `try/catch`).
  Nie jest to stan błędu wymagający komunikatu do użytkownika.

### 4.9a. Domyślny ciężar kolejnej serii (aktualizacja do 4.9)

Pole "Ciężar" formularza logowania serii domyślnie pokazuje: **ciężar
zapisany w OSTATNIEJ już zalogowanej serii tego samego ćwiczenia w bieżącej
sesji**, jeśli taka istnieje — dopiero w jej braku (pierwsza seria
ćwiczenia) domyślną wartością jest sugestia silnika progresji
(`targetWeight`). To pozwala szybko powtórzyć ten sam ciężar w kolejnych
seriach jednym tapnięciem "Zapisz", zamiast wracać za każdym razem do
oryginalnej sugestii.

### 4.9b. Zwijane karty ćwiczeń w aktywnej sesji (aktualizacja do 4.8/4.9)

Karty ćwiczeń w widoku aktywnej sesji to znaczniki `<details>`/`<summary>`,
nie zwykłe `<div>`. Sterowanie stanem rozwinięcia jest w pełni **wyliczane
przy każdym renderze** (nie ma osobnego stanu "ręcznie otwarte/zamknięte"
trzymanego w danych):

- **Bieżące ćwiczenie** = pierwsze w kolejności, które nie jest pominięte
  (`skipped`) i nie ma jeszcze skompletowanych wszystkich docelowych serii —
  renderowane z atrybutem `open` (rozwinięte).
- **Wszystkie pozostałe** (i wcześniejsze-już-wykonane, i późniejsze-jeszcze-
  nierozpoczęte) renderują się zwinięte, ale `<summary>` ZAWSZE pokazuje
  jednowierszowy podgląd stanu — nawet zwinięte, ćwiczenie jest czytelne
  "jednym spojrzeniem":
  - wykonane: `"{X}/{Y} serii · ostatnia {powt}×{ciężar} @RPE{rpe}"` + dodatkowa
    klasa CSS przygaszająca kartę (`ex-done`, opacity ~0.82) — wizualnie
    odróżnialne od jeszcze niewykonanych.
  - pominięte: `"Pominięte"`.
  - jeszcze nierozpoczęte/w trakcie: `"{X}/{Y} serii · cel {sets}×{reps} ·
    {ciężar lub notatka}"`.
- Użytkownik MOŻE ręcznie rozwinąć/zwinąć dowolną kartę tapnięciem
  `<summary>` (natywne zachowanie `<details>`, zero dodatkowego kodu) — ale
  ten ręczny stan **nie przetrwa** kolejnego pełnego re-renderu (np. po
  zalogowaniu serii gdziekolwiek w sesji), który zawsze na nowo wylicza,
  które ćwiczenie jest "bieżące".
  Wyjątek: kliknięcie plakietek (💡/🎥/📋 — otwierających modal z opisem)
  wewnątrz `<summary>` woła `event.preventDefault()`, żeby nie
  rozwijało/zwijało karty przy okazji otwierania modala.

### 4.25. Pobranie szablonu pliku dla trenera

- Przycisk w karcie planu trenera generuje i zapisuje (przez 4.24) gotowy,
  wypełniony przykładowy plik `.md` demonstrujący pełną gramatykę formatu
  (sekcja 5.2) — 2 przykładowe treningi z komentarzami wyjaśniającymi każdą
  kolumnę.

---

## 5. Format pliku planu od trenera (to jest "API" tej aplikacji)

To jest **jedyny prawdziwy, zewnętrzny kontrakt** tej aplikacji — format
pliku, który osoba trzecia (trener, niekoniecznie techniczna) przygotowuje
ręcznie albo przy pomocy asystenta AI, żeby dostarczyć plan treningowy.
Aplikacja akceptuje dwa formaty tego samego modelu danych.

### 5.1. Format JSON (wspierany, ale nie zalecany dla ludzi)

```
{
  "plan_info": {
    "trener": string?,
    "zawodnik": string?,
    "nazwa": string?,
    "opis": string?,
    "uwagi_ogolne": string?
  },
  "treningi": [
    {
      "data": "RRRR-MM-DD",              // WYMAGANE, walidowane regexem
      "nazwa": string,                    // WYMAGANE
      "tydzien": number?,
      "rpe_cel": number?,                 // 1-10 jeśli podane
      "uwagi": string?,
      "rozgrzewka": string | string[]?,   // string ze średnikami LUB tablica gotowych kroków
      "cwiczenia": [
        {
          "id": string?,                  // slugifikowane jeśli podane; inaczej slugify(nazwa)
          "nazwa": string,                 // WYMAGANE
          "serie": number,                 // WYMAGANE, 1-20
          "powtorzenia": string,           // WYMAGANE, dowolny tekst
          "ciezar_kg": number | null,      // liczba 0-999 albo null
          "ciezar_opis": string?,          // opis gdy ciezar_kg===null (może zawierać "+5%", "+1 kg" — magiczne wzorce, sekcja 6)
          "tempo": string?,
          "przerwa_s": number,              // WYMAGANE, 10-600
          "przerwa_opis": string?,
          "rpe_cel": number?,               // 1-10
          "bezpieczne_dla_lokcia": true | false | "ostrzezenie" | "tak" | "nie" | "warn"?,  // domyślnie true
          "paski": boolean?,
          "opcjonalne": boolean?,
          "wskazowka": string?,
          "video": string?,
          "uwagi": string | string[]?
        }
      ]
    }
  ]
}
```

Walidacja odrzuca cały plik (zero częściowego importu) jeśli którekolwiek
pole wymagane brakuje lub jest poza zakresem — zwraca listę WSZYSTKICH
znalezionych błędów naraz (nie przerywa na pierwszym), każdy z odniesieniem
do konkretnego treningu/ćwiczenia po numerze i nazwie.

### 5.2. Format Markdown (zalecany, czytelny dla człowieka)

To jest preferowany format — zwykły plik `.md`, edytowalny w dowolnym
edytorze tekstu, bez znajomości JSON.

#### Gramatyka, linia po linii

Parser przetwarza plik **liniowo, z automatem stanów** o czterech trybach:
`training` (wewnątrz nagłówka treningu z datą), `rehab` (wewnątrz sekcji
rehab), `reference` (wewnątrz dowolnej innej sekcji dokumentacyjnej), oraz
stan początkowy `null`.

```
DLA każdej linii pliku (przycięte białe znaki, puste linie i komentarze
HTML <!-- --> pomijane):

  JEŚLI linia zaczyna się "# " (pojedynczy hash, nie podwójny):
    → to jest TYTUŁ CAŁEGO PLANU. Zapisz jako nazwę planu (usuwając
      opcjonalny prefiks "Plan: "). Występuje raz, na górze pliku.

  JEŚLI linia zaczyna się "### ":
    → to jest PODSEKCJA OPISU TECHNIKI. Sparsuj wzorzec
      "(opcjonalny numer i kropka) Nazwa [id]" z końca linii.
      JEŚLI pasuje: zapamiętaj bieżący "techId" = to [id]; jeśli jeszcze
        nie ma wpisu dla tego id, utwórz pusty {name, desc:'', video:null}.
        JEŚLI jesteśmy w trybie 'rehab' i ten [id] jeszcze nie jest na
        liście pozycji rehab — dodaj go do tej listy (kolejność ma znaczenie
        — to jest kolejność wyświetlania w checkliście).
      JEŚLI NIE pasuje (podsekcja bez [id], np. "Dodatkowe zalecenia"):
        wyczyść bieżący techId (treść tej podsekcji jest ignorowana).

  JEŚLI linia zaczyna się "## ":
    → to jest NAGŁÓWEK SEKCJI. Rozbij resztę linii po znaku "|" na segmenty.
      Segment[0] spróbuj sparsować jako datę (akceptuj RRRR-MM-DD ORAZ
      DD.MM.RRRR, znormalizuj zawsze do RRRR-MM-DD).
      Wyczyść bieżący techId.

      JEŚLI segment[0] to poprawna data:
        → TRYB = 'training'. Utwórz nowy trening: data, nazwa=segment[1]
          (domyślnie "Trening"), pusta lista ćwiczeń. Dla pozostałych
          segmentów: jeśli zawierają (bez rozróżniania wielkości liter)
          podciąg "tydz" i da się z nich wyciągnąć PIERWSZĄ liczbę →
          zapisz jako numer tygodnia. Jeśli zawierają "rpe" i da się
          wyciągnąć liczbę → zapisz jako cel RPE treningu.
          Dodaj ten trening do listy treningów.

      W PRZECIWNYM RAZIE, JEŚLI segment[0] zawiera (bez rozróżniania
      wielkości liter) podciąg "rehab" GDZIEKOLWIEK w tekście:
        → TRYB = 'rehab'. Brak bieżącego treningu.

      W PRZECIWNYM RAZIE:
        → TRYB = 'reference' (sekcja dokumentacyjna/appendix — dowolna
          treść pod nią, w tym tabele, jest PO CICHU IGNOROWANA, bez
          zgłaszania błędu). Brak bieżącego treningu.

  JEŚLI linia pasuje do wzorca "Słowo-kluczowe: treść" gdzie słowo-kluczowe
  to jedno z {Trener, Zawodnik, Opis, Uwagi, Rozgrzewka} (bez rozróżniania
  wielkości liter) I linia NIE zaczyna się od "|":
    JEŚLI jesteśmy wewnątrz treningu (TRYB==='training'):
      "Uwagi" → notatka TEGO treningu.
      "Rozgrzewka" → rozbij po średnikach na kroki, nadpisz rozgrzewkę
        TYLKO TEGO treningu.
    W PRZECIWNYM RAZIE (poziom globalny pliku):
      "Rozgrzewka" → globalna domyślna rozgrzewka (rozbita po średnikach).
      "Trener"/"Zawodnik"/"Opis" → odpowiednie pole metadanych planu.
      "Uwagi" → ogólna notatka widoczna w karcie planu.

  JEŚLI linia zaczyna się "|":
    Rozbij po "|", odetnij pierwszy i ostatni pusty element z brzegów,
    przytnij białe znaki każdej komórki.
    JEŚLI to wiersz separatora tabeli (same myślniki/dwukropki, np. "---") →
      pomiń.
    JEŚLI pierwsza komórka (bez rozróżniania wielkości liter) zaczyna się
      od "ćwicz" lub "cwicz" → to nagłówek tabeli, pomiń.
    JEŚLI TRYB !== 'training' → pomiń całkowicie, BEZ BŁĘDU (tabela w
      sekcji dokumentacyjnej/rehab jest ignorowana — rehab opisuje się
      przez ### podsekcje, nie przez tabelę).
    JEŚLI brak bieżącego treningu mimo TRYB==='training' (nie powinno się
      zdarzyć przy poprawnej logice powyżej, ale to zabezpieczenie) →
      ZGŁOŚ BŁĄD "tabela ćwiczeń przed nagłówkiem treningu".
    JEŚLI liczba komórek < 6 → ZGŁOŚ BŁĄD (za mało kolumn, oczekiwano 8
      z nazwami kolumn w komunikacie).

    W PRZECIWNYM RAZIE — sparsuj komórki jako WIERSZ ĆWICZENIA (kolumny w
    stałej kolejności, 9-ta opcjonalna):
      [Ćwiczenie, Serie×Powt., Ciężar, Tempo, Przerwa, RPE, Flagi,
       Wskazówka, Video(opcjonalna)]

      Ćwiczenie: jeśli kończy się wzorcem "[id]" — wyciągnij id, reszta to
        nazwa. Bez [id] — id zostanie wyprowadzone przez slugify(nazwa)
        na późniejszym etapie walidacji.

      Serie×Powt.: musi pasować do wzorca "LICZBAxRESZTA" (obsłuż też
        znak "×" jako alias "x"). Zwycza JEŚLI NIE pasuje:
          JEŚLI nazwa/id zawiera "rozgrzew"/"warmup" (bez rozróżniania
            wielkości liter) → ZGŁOŚ BŁĄD SPECJALNY z konkretną
            podpowiedzią: "rozgrzewka nie powinna być wierszem w tabeli —
            użyj linii Rozgrzewka: ...". (To jest najczęstszy błąd
            popełniany przez trenerów — patrz sekcja 8.)
          W PRZECIWNYM RAZIE → ZGŁOŚ BŁĄD OGÓLNY formatu.
        (Uwaga: zgłoszenie błędu NIE przerywa parsowania reszty pliku —
        wszystkie błędy są zbierane i pokazane razem na końcu).

      Ciężar: usuń przecinek→kropka, usuń sufiks "kg". Jeśli to, co
        zostało, to czysta liczba (całkowita lub dziesiętna) → ciężar
        liczbowy. W przeciwnym razie (np. "RPE 6", "+5%", "ten sam ciężar",
        "2x15 kg") → zapisz jako OPIS (tekstowy), ciężar liczbowy = null.
        Puste/"-"/"—" → oba null.

      Tempo: puste/"-"/"—" → brak (użyj wartości domyślnej gdzie indziej).

      Przerwa: wyciągnij WSZYSTKIE liczby z komórki, użyj OSTATNIEJ (żeby
        z zakresu "90-120" wziąć 120 — górną granicę na timer). Jeśli
        komórka to dokładnie "liczba" lub "liczba s" → brak osobnej
        etykiety (pokaż samą liczbę+"s"); w przeciwnym razie zachowaj
        oryginalny tekst jako etykietę do wyświetlenia (np. "90-120 s").
        Brak żadnej liczby → ZGŁOŚ BŁĄD.

      RPE: puste/"-"/"—" → brak. W przeciwnym razie wyciągnij PIERWSZĄ
        liczbę z tekstu (np. z "6-7" weź 6 — to jest baza dla progresji,
        nie środek zakresu).

      Flagi (rozdzielone przecinkami, bez rozróżniania wielkości liter):
        zawiera "nie" (jako całe słowo) lub "wyklucz" → bezpieczne_dla_
          lokcia = false.
        w przeciwnym razie zawiera którekolwiek z "uwaga"/"ostrz"/
          "łokieć"/"lokiec"/"warn" → bezpieczne_dla_lokcia = "ostrzezenie".
        w przeciwnym razie → true (domyślnie bezpieczne).
        niezależnie: zawiera "pask" → wymaga pasków. Zawiera "opcjo" →
          opcjonalne.

      Wskazówka: puste/"-"/"—" → brak.
      Video: puste/"-"/"—" → brak. W przeciwnym razie surowy URL z komórki.

  W PRZECIWNYM RAZIE (linia to zwykły akapit tekstu, nie pasujący do
  żadnego wzorca powyżej):
    JEŚLI jesteśmy wewnątrz podsekcji "### Nazwa [id]" (techId ustawiony):
      JEŚLI linia pasuje do wzorca "Wideo: [tekst](url)" LUB "Wideo: url" →
        zapisz URL jako wideo tej pozycji techDetails (tylko jeśli jeszcze
        nie ma wideo — pierwsze znalezione wygrywa).
      W PRZECIWNYM RAZIE, jeśli linia zaczyna się od pogrubionego
        "**Kiedy**" → dopisz jej treść (bez gwiazdek) do opisu tej pozycji.
      W PRZECIWNYM RAZIE (zwykły akapit, i linia nie zaczyna się od "#") →
        dopisz całą linię (ze spacją-separatorem) do narastającego opisu
        tej pozycji techDetails.
    (jeśli techId nie jest ustawiony — linia jest po prostu ignorowana)

PO PRZETWORZENIU WSZYSTKICH LINII:
  JEŚLI nie znaleziono ŻADNEGO treningu → ZGŁOŚ BŁĄD generyczny.
  Zbuduj listę pozycji rehab z zebranych id (w kolejności napotkania),
    każda z name/desc/video z odpowiadającego wpisu techDetails.
  Przekaż dalej do wspólnego walidatora (5.1) surowy obiekt {plan_info,
    treningi} PLUS dodatkowe, wewnętrzne pola: cały słownik techDetails
    (do doklejenia opis+wideo per ćwiczenie w tabelach) oraz gotową listę
    rehab (jeśli niepusta).
```

#### Dlaczego sekcje bez daty są ignorowane, a nie odrzucane

To jest świadoma decyzja projektowa naprawiająca realny problem: trenerzy
(zwłaszcza używający asystentów AI do pisania planu) naturalnie chcą dodać
wyjaśnienie skali RPE, glosariusz technik ćwiczeń z linkami wideo, czy
pogrupowanie "TYDZIEŃ 1 / TYDZIEŃ 2" jako nagłówki — wszystkie zaczynające
się od `## `, bo to naturalna konwencja Markdown. Pierwsza wersja parsera
próbowała parsować WSZYSTKO po `## ` jako trening i produkowała dziesiątki
mylących błędów. Poprawka: rozróżniaj po tym, czy pierwszy segment nagłówka
da się sparsować jako data.

#### Dlaczego appendix "### Nazwa [id]" istnieje

Pozwala trenerowi napisać długi opis techniki i link do wideo **raz**, a nie
powtarzać go w kolumnie "Wskazówka" przy każdym wystąpieniu ćwiczenia w
każdym tygodniu planu. To bezpośrednio zaobserwowany wzorzec w prawdziwych
plikach dostarczonych przez trenera w tym projekcie.

### 5.3. Kolumny tabeli — pełna referencja

| # | Kolumna | Wymagana | Format |
|---|---|---|---|
| 1 | Ćwiczenie | tak | `Nazwa [opcjonalne_id]` |
| 2 | Serie×Powt. | tak | `LICZBAxTEKST`, np. `3x10-12`, `2x40 m`, `3xdo odmowy` |
| 3 | Ciężar | tak (może być `-`) | liczba w kg, LUB tekst-opis (w tym magiczne `+5%`/`+1 kg`) |
| 4 | Tempo | nie | dowolny tekst, `-` = brak |
| 5 | Przerwa | tak | liczba sekund, może być zakres |
| 6 | RPE | nie | liczba 1-10 albo zakres (bierze się dolną granicę) |
| 7 | Flagi | nie | lista po przecinkach: `paski`, `uwaga-łokieć`, `łokieć-nie`, `opcjonalne` |
| 8 | Wskazówka | nie | krótki tekst |
| 9 | Video | nie | URL (opcjonalna kolumna, można całkiem pominąć) |

### 5.4. Sekcja rehab — pełny format

```markdown
## Rehabilitacja łokcia — [dowolny tytuł zawierający słowo "rehab"]

### 1. Nazwa pierwszego ćwiczenia [unikalne_id]
Dowolnie długi opis techniki, może się rozciągać na kilka linii —
wszystkie zostaną złączone spacją w jeden opis.
**Kiedy**: częstotliwość wykonywania (opcjonalne, dołączane do opisu)
Wideo: [tytuł linku](https://...)

### 2. Nazwa drugiego ćwiczenia [inne_id]
...
```

Każda taka podsekcja staje się jedną pozycją na **codziennej, odhaczalnej
liście** w zakładce Rehab, **zastępując** wbudowany domyślny protokół (3
pozycje: ekscentryczny wyprost nadgarstka z taśmą, stretching wyprostników,
lód/krioterapia).

---

## 6. Logika biznesowa i reguły walidacji

### 6.1. Silnik progresji obciążenia (`suggestTarget`)

To jest **serce** aplikacji — decyduje, jaki ciężar zaproponować na następną
sesję, na podstawie historii i reguł bezpieczeństwa, niezależnie od tego,
czy dane pochodzą z planu wbudowanego czy z planu trenera (oba przechodzą
przez wspólną normalizację `itemTargets()`, która ujednolica ich kształt do
`{sets, reps, weight, note}` przed wejściem do silnika).

```
FUNKCJA suggestTarget(pozycja_planu, numer_tygodnia):
  cel = znormalizowany cel z planu (sets, reps, weight_planowany, note)
  historia = wszystkie przeszłe sesje z tym ćwiczeniem, chronologicznie
  ostatnia = najnowszy wpis historii (albo brak)

  JEŚLI brak historii ALBO ostatnia sesja nie miała zapisanego ciężaru:
    → zwróć { ciężar: weight_planowany, powód: "wg planu" (albo notatka
       jeśli brak liczby), status: 'new' }

  # Od tego miejsca mamy przynajmniej jedną poprzednią sesję z ciężarem.
  był_silny_ból = (max ból w trakcie ostatniej sesji > 2) LUB (ocena 24h
                   ostatniej sesji > 2, jeśli istnieje)
  był_jakikolwiek_ból = (max ból w trakcie > 0) LUB (ocena 24h > 0)
  zablokowane = sprawdź_blokadę(ćwiczenie)   # patrz niżej
  rpe_ok = (brak zapisanego max RPE ostatniej sesji) LUB
           (max RPE ostatniej sesji ≤ cel_RPE_tamtej_sesji + 0.5)

  JEŚLI był_silny_ból:
    → ciężar = round(ostatni_ciężar × 0.9, do 0.5 kg), status 'caution',
       powód "ból przy ostatniej sesji → −10%"

  W PRZECIWNYM RAZIE JEŚLI zablokowane:
    → ciężar = min(planowany, ostatni_ciężar) jeśli planowany istnieje,
       inaczej ostatni_ciężar. status 'blocked'. powód "progresja
       zablokowana (RPE > cel+1 przez 2 sesje)".

  W PRZECIWNYM RAZIE JEŚLI był_jakikolwiek_ból LUB NIE rpe_ok:
    → ciężar = min(planowany, ostatni_ciężar) jeśli planowany istnieje,
       inaczej ostatni_ciężar. status 'caution'. powód zależny od przyczyny
       (ból zgłoszony / RPE powyżej celu).

  W PRZECIWNYM RAZIE (droga wolna do progresji):
    JEŚLI plan podaje konkretny ciężar liczbowy:
      JEŚLI to plan TRENERA → ciężar = dokładnie ten zaplanowany
        (trener mógł CELOWO zaplanować niższy ciężar, np. tydzień
        odciążający — nie podbijaj go automatycznie w górę).
      JEŚLI to plan WBUDOWANY → ciężar = max(zaplanowany, ostatnio
        dźwignięty) — plan wbudowany nigdy nie każe się cofnąć.
      status 'ok', powód "wg planu (kryteria progresji spełnione)".

    W PRZECIWNYM RAZIE (plan nie podaje liczby — cel opisowy typu "RPE 6",
    "+5%", "ten sam ciężar", "poziom T1"):
      JEŚLI to ostatni tydzień mezocyklu (deload):
        → znajdź ciężar z TYGODNIA 1 tego samego mezocyklu/planu dla tego
          ćwiczenia (jeśli brak — przybliż jako ostatni×0.95). status 'ok'.
          powód "deload → poziom T1".
      W PRZECIWNYM RAZIE JEŚLI notatka zawiera "+5%" LUB "+obciążenie":
        → ciężar = round(ostatni × 1.05, do 0.5 kg). status 'ok'.
      W PRZECIWNYM RAZIE JEŚLI notatka zawiera "+1 kg":
        → ciężar = ostatni + 1. status 'ok'.
      W PRZECIWNYM RAZIE:
        → ciężar = dokładnie taki sam jak ostatnio. status 'ok'.
```

**Status → kolor lewego paska karty ćwiczenia:** `new`=szary (neutralny,
brak jeszcze historii), `ok`=zielony, `caution`=bursztynowy, `blocked`=
czerwony. To jedyny sposób, w jaki użytkownik "widzi" działanie silnika bez
czytania opisu.

### 6.2. Blokada progresji (`progressionBlocked`)

```
FUNKCJA sprawdź_blokadę(id_ćwiczenia):
  historia = wpisy historii tego ćwiczenia z niepustym max RPE, chronologicznie
  JEŚLI mniej niż 2 wpisy → NIE zablokowane
  weź OSTATNIE DWA wpisy [a, b]
  ZABLOKOWANE wtedy i tylko wtedy, gdy: a.max_RPE > a.cel_RPE + 1
                                     ORAZ b.max_RPE > b.cel_RPE + 1
  (obie ostatnie sesje z rzędu musiały przekroczyć cel o więcej niż 1 punkt)
```

### 6.3. Kryterium bólu (bezpieczeństwo pierwszej klasy)

- **0/10 w trakcie i 24h po = kontynuuj normalnie.**
- **>2/10 (w trakcie serii LUB w ocenie 24h) = wstrzymanie ćwiczenia na 7 dni**
  — to nie jest sugestia, to automatyczna akcja (zapis do `paused`), z
  jedynym ręcznym obejściem będącym świadomym potwierdzeniem w modalu
  ("Kontynuuję świadomie (niezalecane)" przy logowaniu serii — ale TYLKO dla
  tej jednej, bieżącej serii/sesji; wstrzymanie na przyszłość i tak
  następuje przy ocenie 24h, jeśli ból się utrzyma).
- **1-2/10 = brak progresji** (nie wstrzymanie, ale i nie zwiększanie
  ciężaru w następnej sesji).

### 6.4. Minimum 48h regeneracji

Nieblokujące ostrzeżenie (baner), nie twardy zamek — jeśli od ostatniej
zakończonej sesji (jakiejkolwiek) minęło mniej niż 48 godzin, pokaż
ostrzeżenie na górze widoku Trening. Użytkownik może zignorować i trenować
mimo to.

### 6.5. Reguły walidacji pliku trenera

Zebrane w jednym miejscu (patrz sekcja 5) — kluczowa zasada:
**zero-częściowego-importu**. Jeśli którakolwiek reguła nie przechodzi, CAŁY
plik jest odrzucany, użytkownik dostaje pełną listę problemów (nie tylko
pierwszy), a bieżący stan aplikacji (włącznie z poprzednim planem, jeśli
był) pozostaje absolutnie nietknięty.

### 6.6. Reguła stagnacji wagi ciała

Opisana w 4.18 — porównanie najnowszego wpisu wagi z wpisem sprzed 14-21 dni
(pierwszy pasujący znaleziony w tym oknie), próg różnicy 0.4 kg.

---

## 7. Konfiguracja i "zmienne środowiskowe"

Ta aplikacja **nie ma backendu ani procesu budowania**, więc nie ma
tradycyjnych zmiennych środowiskowych. Odpowiedniki:

| Nazwa | Gdzie | Rola |
|---|---|---|
| `APP_VERSION` | stała w kodzie źródłowym | Numer wersji pokazywany w UI, ręcznie podbijany |
| `PLAN_DATA.planStartDate` | dane planu | Punkt odniesienia daty startu (informacyjny) |
| `CACHE` (nazwa cache) | `sw.js` | Musi być bumpowana razem z `APP_VERSION`, żeby wymusić odświeżenie u zainstalowanych użytkowników |
| `manifest.webmanifest` | plik statyczny | Nazwa, ikony, kolory motywu, `start_url`, `scope`, `display: standalone` |
| `.claude/launch.json` (opcjonalne, tylko dev) | katalog projektu | Konfiguracja lokalnego serwera podglądu dla narzędzi deweloperskich |
| Port serwera deweloperskiego | `server.js` | Domyślnie 8123, nadpisywalny zmienną `PORT` |

Brak kluczy API, brak sekretów, brak połączeń sieciowych poza: (a) linkami
do wyszukiwania YouTube otwieranymi w nowej karcie, (b) natywnymi API
przeglądarki (Web Share, Service Worker, localStorage) — zero komunikacji z
jakimkolwiek serwerem aplikacji.

---

## 8. Znane ograniczenia, edge case'y i decyzje projektowe

### Decyzje świadome (nie naprawiać bez pytania użytkownika)

1. **Zero backendu, dane lokalne per urządzenie.** Świadomy wybór od
   samego początku projektu ("prosta, szybka apka bez backendu"). Konsekwencja:
   wiele osób używających tej samej aplikacji (np. ojciec + syn, każdy z
   innym trenerem) osiąga pełną izolację danych WYŁĄCZNIE przez instalację
   na osobnych urządzeniach — nie ma żadnego mechanizmu kont/profili w
   samej aplikacji, i nie powinno się go dodawać bez wyraźnej prośby, bo
   zmieniłoby to fundamentalny model przechowywania danych.

2. **Timer przerwy: wizualny + dźwiękowy (3 piknięcia na koniec), ale wciąż
   BEZ wibracji i BEZ powiadomień systemowych.** Wcześniej był całkowicie
   bezdźwięczny (świadome życzenie użytkownika po tym, jak wcześniejsza
   natywna wersja PWA miała pełny zestaw: dźwięk+wibrację+powiadomienia) —
   potem użytkownik jawnie poprosił o dodanie samego dźwięku (3 piknięcia
   przez Web Audio API). `AudioContext` jest tworzony leniwie, ale
   WYŁĄCZNIE wewnątrz `startTimer()` (wywoływanego zawsze z prawdziwego
   handlera kliknięcia) — to jest wymagane, żeby ominąć politykę
   autoplay na iOS Safari: kontekst dźwiękowy musi powstać/wznowić się w
   ramach prawdziwego gestu użytkownika, nawet jeśli sam beep odpala się
   później, asynchronicznie po zakończeniu odliczania. Panel przerwy jest
   czerwony (`--danger`) w trakcie odliczania, zielony (`--good`) po
   zakończeniu. Nie dodawać wibracji/powiadomień z powrotem bez pytania —
   tych dwóch user nadal nie chce.

3. **Plan trenera: ciężar jest wiążący, nie podbijany automatycznie w
   górę** (w przeciwieństwie do planu wbudowanego, który nigdy nie każe się
   cofnąć poniżej ostatnio dźwigniętego ciężaru). Uzasadnienie: trener mógł
   celowo zaplanować niższy ciężar (np. tydzień odciążający), i silnik nie
   powinien tego "poprawiać".

4. **Przejście fazy jest zawsze ręczne**, nigdy automatyczne, nawet gdy
   wszystkie 4 kryteria bramki są spełnione — i jednocześnie przycisk
   przejścia jest **zawsze klikalny**, nawet gdy kryteria NIE są spełnione
   (z wyraźnym ostrzeżeniem w modalu). Filozofia: aplikacja doradza, dorosły
   użytkownik decyduje.

5. **Linki wideo dla wbudowanych ćwiczeń to wyszukiwania YouTube, nie
   konkretne filmy.** Świadomy wybór — nie umierają, zawsze pokazują
   aktualne wyniki, nie wymagają utrzymania po stronie aplikacji. (Linki z
   plików trenera MOGĄ być konkretnymi filmami — to zależy od trenera.)

6. **Struktura CSS/layoutu z nie-przewijalnym `<body>` i pojedynczym
   przewijalnym kontenerem `#app-scroll`.** To jest naprawiona wersja
   pierwotnego podejścia (całe `<body>` przewijało się naturalnie) — Safari
   na iOS ma udokumentowaną usterkę, w której elementy `position: fixed`
   potrafią "uciekać"/migać podczas przewijania całego dokumentu, bo pasek
   adresu Safari chowa się/pokazuje w trakcie gestu przewijania, zmieniając
   wysokość viewportu w locie. Rozwiązanie: `html, body { height: 100%;
   overflow: hidden }`, a jedynym przewijalnym elementem jest wewnętrzny
   div; pasek nawigacji na dole i overlay timera żyją JAKO RODZEŃSTWO tego
   diva (poza tokiem przewijania), więc ich `position: fixed` odnosi się do
   naprawdę nieruchomego viewportu. Funkcja `render()` musi manipulować
   `scrollTop` tego wewnętrznego kontenera, NIGDY `window.scrollTo`.

7. **`render(resetScroll)` — zachowanie przewijania jest jawnym parametrem.**
   Domyślnie (bez argumentu) re-render **zachowuje** pozycję przewijania
   (przechwytuje `scrollTop` przed, przywraca po) — to naprawia zgłoszoną
   usterkę, w której zapisanie serii przewijało widok z powrotem na górę.
   Jawne `render(true)` resetuje na górę i jest używane WYŁĄCZNIE przy
   prawdziwej zmianie "ekranu": zmiana zakładki, zmiana wybranego
   dnia/treningu, start/koniec/anulowanie sesji. Wszystkie drobne
   aktualizacje w miejscu (log serii, checkboxy, pola formularzy) muszą
   używać wariantu domyślnego (zachowaj pozycję).

### Znane edge case'y, które są obsłużone

- Sesja z ostatnim tygodniem mezocyklu (deload) i brakiem historii tygodnia
  1 (np. użytkownik dołączył w środku mezocyklu) — silnik przybliża ciężar
  jako ostatni×0.95 zamiast się wywalić.
- Import planu, gdy jest aktywna sesja w toku z poprzedniego planu — plan
  trenera się podmienia, ale aktywna sesja (jeśli jakimś trafem by istniała)
  nie jest explicite obsłużona pod kątem konfliktu (patrz sekcja 9 — luka).
- Follow-up 24h dla sesji, które nigdy nie dostają odpowiedzi (starsze niż 7
  dni) — celowo przestają się pojawiać, żeby nie zaśmiecać widoku
  historycznymi pytaniami bez odpowiedzi w nieskończoność.
- Zakresy liczbowe w tekstach ("RPE 6-7", "3x10-12") są konsekwentnie
  interpretowane jako "weź pierwszą/dolną liczbę" wszędzie tam, gdzie liczba
  jest potrzebna do logiki (to był realny bug — pierwsza wersja parsera
  wyciągała WSZYSTKIE cyfry z tekstu i je sklejała, więc "RPE 7-8" stawało
  się liczbą 78; naprawione przez wyciąganie PIERWSZEGO dopasowania liczby
  regexem, nie przez usuwanie niecyfr).
- Trenerzy (i asystenci AI piszący w ich imieniu) naturalnie próbują wpisać
  rozgrzewkę jako wiersz w tabeli ćwiczeń (bo widzą tabelę i chcą tam
  wszystko umieścić) — zamiast generycznego błędu formatu, parser rozpoznaje
  ten konkretny wzorzec (nazwa/id zawiera "rozgrzewka"/"warmup") i zwraca
  ukierunkowaną podpowiedź, co zrobić zamiast tego.

### Znane, nienaprawione ograniczenia

- Brak synchronizacji/kopii w chmurze — utrata danych urządzenia
  (odinstalowanie, wyczyszczenie danych przeglądarki, iOS Safari czyszczące
  dane witryn nieużywanych >7 dni jeśli NIE zainstalowane jako PWA) oznacza
  **całkowitą utratę historii**, jedyne zabezpieczenie to ręczny eksport
  JSON.
- Brak w aplikacji przełącznika jasny/ciemny motyw — podąża wyłącznie za
  `prefers-color-scheme` systemu (choć CSS ma gotowe zmienne pod
  `[data-theme="dark|light"]`, nic w kodzie JS tego atrybutu nie ustawia w
  wariancie PWA — to zostało napisane pod hosting Claude, który ma własny
  przełącznik motywu wstrzykujący ten atrybut).
- Import pliku podczas aktywnej, niezakończonej sesji nie jest w żaden
  sposób blokowany ani ostrzegany — teoretycznie mógłby doprowadzić do
  niespójności (aktywna sesja odnosi się do planu, który już nie jest
  aktualnym `customPlan`).

---

## 9. Proponowane usprawnienia

*(Ta sekcja jest świadomie oddzielona od reszty specyfikacji — opisuje, co
NALEŻAŁOBY poprawić przy reimplementacji od zera, a nie jak działa obecny
kod).*

### Code smells i niespójności

1. **Martwe/zepsute zmienne CSS.** Kilka reguł odwołuje się do zmiennych,
   które nie istnieją w `:root` (`--card2`, `--ok`, `--accent2`) —
   pozostałość po wcześniejszej nazwie palety kolorów sprzed przemianowania
   na `--surface-2`/`--good`/`--accent`. Dotyczy stylów rozgrzewki i
   przycisku wideo. Efekt: te konkretne reguły cicho nic nie robią (przeglądarka
   ignoruje niepoprawną wartość zmiennej), nikt tego nie zauważył, bo
   wizualnie "wystarczająco dobrze wygląda" nawet bez tych reguł.
2. **Mieszany typ pola `phase` w obiekcie sesji** — bywa liczbą (indeks fazy
   planu wbudowanego) albo literałem stringowym `'custom'`. To wymaga
   sprawdzania typu (`typeof` / `=== 'custom'`) rozsiane po kilku miejscach
   kodu zamiast jednego jawnego pola-dyskryminatora (np. osobne pole
   `source: 'builtin' | 'trainer'`).
3. **Duplikacja `buildSession` / `buildSessionCustom`** — niemal identyczne
   funkcje różniące się głównie źródłem danych wejściowych i kilkoma
   polami. Powinny być jedną funkcją przyjmującą znormalizowany opis
   "co trenować dzisiaj", niezależnie od pochodzenia.
4. **Duplikacja logiki podglądu dnia treningowego** — `renderWorkout`
   (plan wbudowany) i `renderCustomWorkoutHome` (plan trenera) współdzielą
   niemal całą strukturę (banery, karta rozgrzewki, lista kart ćwiczeń,
   przycisk startu) z jedynie innym źródłem "co pokazać" i innym selektorem
   na górze (kafelki dni vs lista rozwijana dat). Kandydat do wspólnego
   komponentu widoku parametryzowanego źródłem danych.
5. **Silnik progresji rozpoznaje intencję trenera przez dopasowanie
   podciągów w wolnym tekście** (`note.includes('+5%')`,
   `note.includes('+1 kg')`, `note.includes('+obciążenie')`) zamiast
   ustrukturyzowanego pola typu `progressionHint: 'percent5' | 'plusOneKg' |
   'sameWeight' | 'deloadToWeek1'`. Działa, dopóki nikt nie zmieni treści
   tekstu notatki (np. wielkość liter, spacja) — kruche.
6. **Niekonsekwentna generalizacja stałych progu bramki fazy.** `needSessions`
   jest już policzone dynamicznie (`sessionsPerWeek × weeks`), ale
   `needWeeks` jest wciąż zahardkodowane jako `id===0 ? 2 : 6` zamiast
   pochodzić z danych fazy (np. osobne pole `advanceMinWeeks` w definicji
   fazy).
7. **Ręczne escapowanie HTML jako konwencja, nie gwarancja.** Cała warstwa
   widoku to budowanie stringów HTML przez template literals z ręcznym
   wołaniem funkcji `esc()` przy każdym wstawieniu tekstu pochodzącego z
   danych. Działa poprawnie (zweryfikowane), ale nic strukturalnie nie
   wymusza tej dyscypliny — łatwo w przyszłości dodać interpolację i
   zapomnieć o `esc()`, otwierając lukę XSS (szczególnie istotne, bo dane
   ćwiczeń/nazw/opisów mogą pochodzić z pliku dostarczonego przez osobę
   trzecią — trenera).
8. **Brak jednego źródła prawdy dla dwóch buildów.** `index.html` (PWA) jest
   ręcznie/skryptowo generowany z fragmentu-artefaktu przez transformację
   opisaną w sekcji 2, ale sam skrypt transformujący nie jest częścią
   repozytorium (żył tylko w tymczasowym katalogu roboczym sesji) — to
   oznacza realne ryzyko rozjazdu dwóch kopii tego samego kodu, jeśli ktoś
   kiedyś edytuje `index.html` bezpośrednio zamiast źródła.

### Przestarzałe wzorce / brak nowoczesnych narzędzi

- Brak modułów ES (`import`/`export`) — wszystko w jednym pliku, w jednym
  globalnym zasięgu (`'use strict'` na poziomie skryptu, ale zero
  faktycznej enkapsulacji; funkcje i stan (`S`, `CUSTOM_EX`, `timer`) to
  globalne zmienne modyfikowane z dowolnego miejsca).
- Brak jakiegokolwiek systemu typów (TypeScript, JSDoc z `@typedef`) mimo
  dość bogatych, ustrukturyzowanych kształtów danych (sesje, plany,
  ćwiczenia) — łatwo o literówkę w nazwie pola, która ujawni się dopiero w
  runtime jako `undefined` w UI.
- Ręczne re-renderowanie całego widoku zakładki przy każdej zmianie
  (zamiast reaktywnego/deklaratywnego podejścia) — działa przy tej skali,
  ale każda funkcja `render*()` musi ręcznie pamiętać o ponownym podpięciu
  wszystkich event listenerów po każdym ustawieniu `innerHTML`
  (`addEventListener` na nowo za każdym razem) — łatwo o wyciek pamięci lub
  podwójne listenery przy nieostrożnej zmianie.

### Gdzie architektura mogłaby być czystsza

- **Rozdzielenie warstw**: dane (katalog ćwiczeń, fazy, żywienie) / stan i
  trwałość / logika biznesowa (silnik progresji, walidacja, parser planu) /
  widoki (renderowanie + obsługa zdarzeń) żyją dziś w jednym pliku, w
  jednym globalnym zasięgu. Naturalny podział na moduły: `data/`
  (statyczna konfiguracja), `state/` (store + persystencja), `domain/`
  (silnik progresji, reguły bezpieczeństwa, parser formatu trenera —
  to jest logika, którą najbardziej opłaca się dobrze przetestować), `ui/`
  (renderery widoków, czysto zależne od `domain`+`state`, bez logiki
  biznesowej w środku).
- **Parser formatu Markdown** zasługuje na wydzielenie do osobnego,
  w pełni przetestowanego modułu z jawną gramatyką (nawet bez pełnego
  parsera-kombinatora — wystarczy dobrze nazwana funkcja na każdy typ
  linii) i zestawem testów jednostkowych na wszystkich opisanych w sekcji
  8 edge case'ach (zakresy liczbowe, rozgrzewka-jako-wiersz, sekcje bez
  daty, appendix z opisami technik).
- **Silnik progresji** to czysta funkcja (bez efektów ubocznych, bez
  dostępu do DOM) — już dziś jest odseparowany logicznie, ale żyje w tym
  samym pliku/zasięgu co reszta; naturalny kandydat na pierwszy moduł z
  prawdziwymi testami jednostkowymi (macierz przypadków: brak historii /
  ból silny / ból lekki / RPE przekroczone raz / RPE przekroczone dwa razy
  z rzędu / droga wolna z planem liczbowym / droga wolna z "+5%" / droga
  wolna z deloadem).

### Braki w obsłudze błędów i testach

- **Zero zautomatyzowanych testów.** Cała weryfikacja poprawności w historii
  tego projektu odbywała się ręcznie, przez sterowanie przeglądarką i
  odczytywanie stanu `localStorage`/DOM w konsoli — działa, ale nic nie
  chroni przed regresją przy przyszłych zmianach. Silnik progresji i parser
  Markdown to najwyższy priorytet pod testy jednostkowe (są deterministyczne,
  bezstanowe względem DOM, łatwe do przetestowania w izolacji).
- **Brak walidacji spójności stanu przy starcie** — jeśli `localStorage`
  zawiera dane w nieoczekiwanym kształcie (np. z bardzo starej wersji przed
  jakąś zmianą schematu), `Object.assign` płytko scali je z domyślnym
  stanem, ale nic nie zweryfikuje, że zagnieżdżone struktury (np. każda
  sesja w `sessions[]`) mają oczekiwany kształt — błąd ujawni się dopiero
  jako wyjątek w trakcie renderowania, potencjalnie blokując całą aplikację.
- **Reset/import danych nie tworzy automatycznej kopii zapasowej przed
  operacją** — poleganie wyłącznie na tym, że użytkownik pamięta zrobić
  eksport najpierw (modal o tym przypomina tekstem, ale nic nie wymusza).
- **Brak testów end-to-end** dla najważniejszej ścieżki użytkownika (import
  planu → rozpoczęcie sesji → zalogowanie serii z bólem → weryfikacja
  wstrzymania ćwiczenia → sprawdzenie follow-upu 24h) — to jest dokładnie
  ten scenariusz, który był ręcznie testowany wielokrotnie w toku tego
  projektu i idealnie nadaje się do zautomatyzowania.
