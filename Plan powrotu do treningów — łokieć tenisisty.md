# Plan powrotu do treningów siłowych — łokieć tenisisty

> Wsad do budowy aplikacji treningowej (Claude Code). Zawiera historię treningów, diagnozę sytuacji, plan rehabilitacyjny i pełną progresję 4-tygodniową z konkretnymi liczbami: serie x powtórzenia, obciążenie, tempo, przerwa.

**Data przygotowania:** 18 lipca 2026
**Użytkownik:** mężczyzna, trening siłowy A/B/C split, cel: hipertrofia + siła funkcjonalna
**Kontekst medyczny:** epicondylitis lateralis (łokieć tenisisty), diagnoza ok. 1 kwietnia 2026, wizyta u lekarza od łokcia. Przerwa w treningach od ok. 3 kwietnia 2026 do 18 lipca 2026 (~3,5 miesiąca). Dieta trzymana w większym stopniu niż treningi.

---

## 1. Historia treningowa (dane z dashboardu, styczeń–kwiecień 2026)

Split A/B/C, progresja mezocyklowa 4-tygodniowa (Tydz.1 RPE 6 → Tydz.2 RPE 6-7 → Tydz.3 RPE 7-8 → Tydz.4 deload RPE 6).

### Dzień A — nogi (przód) + plecy (szerokość) + barki

| Ćwiczenie | Seria x powt (baza) | Obciążenie ostatnie odnotowane | Tempo | Przerwa |
|---|---|---|---|---|
| Cable pull (pull-through) | 3x12-15 | 40 kg | 3110 | 75-90 s |
| Leg press | 3x10 | 75-80 kg | 3110 | 120 s |
| Hip thrust | 3x10-12 | 60 kg | 2111 | 120 s |
| Bench press | 3x8-9 | 45-47,5 kg | 2110 | 120 s |
| Shoulder press (hantle) | 3x8-9 | 2x12-14 kg | 2110 | 90-120 s |

### Dzień B — plecy (grubość) + biceps + core (anti-rotacja)

| Ćwiczenie | Seria x powt (baza) | Obciążenie ostatnie odnotowane | Tempo | Przerwa |
|---|---|---|---|---|
| Face pulls | 3x12-15 | 12 kg | 2121 | 60-75 s |
| Podciągania | 3 serie do RPE 7-8 | masa własna | kontrolowane | 120 s |
| Wiosowanie (hantla/maszyna) | 3x10-11 | 16-25 kg | 3110 | 90 s |
| Farmer carry | 3x60-70 m | 2x25-28 kg | stabilny tułów | 90 s |
| Biceps curl | 2-3x10-12 | 9 kg | 3110 | 75 s |
| Russian twist / Pallof press | 3x10-12/stronę | 12 kg | 2121 | 45-60 s |

### Dzień C — nogi (tył, dominacja stawu biodrowego) + pchanie

| Ćwiczenie | Seria x powt (baza) | Obciążenie ostatnie odnotowane | Tempo | Przerwa |
|---|---|---|---|---|
| Deadlift | 3x6-8 | 70-75 kg | 2110 | 150 s |
| Wykroki / split squat | 3x10-11/stronę | 2x10-16 kg | 3110 | 90 s |
| Wyciskanie hantle (pochylnia/płasko) | 3x10-11 | 2x15-17,5 kg | 2110 | 120 s |
| Focze wiosło (seal row) | 3x10-12 | 15-17,5 kg | 3110 | 90 s |
| Farmer carry | 3x60-70 m | 2x25-28 kg | stabilny tułów | 90 s |

### Kluczowe notatki z dziennika (istotne dla bezpieczeństwa)

- **16.01.2026**: "mocny trening siłowy w domu. Biceps boli jeszcze tydzień później" — sygnał przeciążenia bicepsa.
- **17.01.2026**: "naderwany dwugłowy przy wykrokach" — wcześniejszy incydent z mięśniem dwugłowym uda.
- **3.02.2026**: "przy leg press coś mnie zabolało pod lewym żebrem powyżej wątroby" — obserwować przy powrocie do leg press.
- **14-15.03.2026**: "lekki powrót kontuzji mięśnia dwugłowego lewej nogi przy wykrokach" — wykroki wymagają ostrożnej progresji.
- **1.04.2026**: "praca w ogrodzie, **lekarz od łokcia**" — początek problemu z łokciem tenisisty.
- **3.04.2026**: ostatni zapisany trening w dashboardzie (siłowy B, sauna, przejażdżka motocyklem). Od tego momentu brak wpisów treningowych do 18.07.2026.

### Wzorce z danych biometrycznych (do wykorzystania w apce jako reguły decyzyjne)

- Regularnie odnotowywane niskie HRV/słaby sen korelowały z decyzją o pominięciu treningu lub jego odłożeniu (np. 6-7.02.2026: "niski HRV bez treningu").
- Sen ok. 6,5-8h typowo, z wahaniami REM i głębokiego snu; kilka epizodów "słaby sen" bezpośrednio przed dniami bez treningu lub z lekkim treningiem.
- Aktywność dzienna: kroki wahają się 2 000–14 600, z medianą ok. 6 500-9 000; dni "chód" (marsz/spacer) przeplatają dni siłowe.

---

## 2. Diagnoza sytuacji (18 lipca 2026)

- **Przerwa treningowa:** ~15 tygodni bez treningu siłowego.
- **Kontuzja:** epicondylitis lateralis (łokieć tenisisty) — zapalenie przyczepu ścięgien mięśni wyprostujących nadgarstek przy nadkłykciu bocznym kości ramiennej. Prowokowane przez: chwyt pod obciążeniem, wyprost nadgarstka, ruchy pociągające (podciąganie, wiosowanie sztangą, curl swobodny), izometryczny uchwyt (farmer carry).
- **Dieta:** trzymana relatywnie dobrze mimo przerwy treningowej — dobry punkt wyjścia, nie trzeba jej teraz gwałtownie zmieniać.
- **Cel:** wrócić do budowania dużych partii mięśniowych (nogi, plecy, pierś, barki, core) bez obciążania łokcia.

### Zasady doboru ćwiczeń (reguły dla aplikacji)

**Wykluczone / wymagają modyfikacji na starcie:**
- Podciąganie nadhwytem, wiosowanie sztangą wolną → zamiana na neutralny uchwyt / maszynę
- Curl biceps hantlą klasycznym chwytem (ciężki) → pauza lub uchwyt młotkowy, niski ciężar
- Farmer carry z dużym obciążeniem → pauza na 2-4 tygodnie lub paski na przedramiona
- Face pulls trzymane bezpośrednio dłonią → pasy na nadgarstki lub pauza
- Deadlift z chwytem overhand bez zabezpieczenia → paski (lifting straps) obowiązkowo

**Bezpieczne strategie:**
- Uchwyt neutralny (młotkowy) zamiast supinowanego wszędzie, gdzie możliwe
- Lifting straps na deadlift, wiosowanie, farmer carry
- Maszyny z prowadzonym torem zamiast wolnych ciężarów przy ćwiczeniach górnej części ciała
- Obciążenie na barkach/tułowiu (nie w dłoniach) przy wykrokach/split squat na start
- Kryterium bólu: 0/10 podczas i 24h po ćwiczeniu = kontynuuj; >2/10 = wypadnij z ćwiczenia na tydzień

---

## 3. Plan powrotu — struktura 4-tygodniowa

### Faza 0 (Tydzień 1-2): Reintroduction — Full Body 2x/tydzień, RPE ≤ 5-6

**Dzień A — Nogi + plecy (zero chwytu obciążonego)**

| # | Ćwiczenie | Serie x Powt | Obciążenie start | Tempo | Przerwa | Uwaga łokieć |
|---|---|---|---|---|---|---|
| 1 | Leg press | 3x10-12 | 55-60 kg | 3110 | 120 s | Brak udziału łokcia |
| 2 | Hip thrust (sztanga na paskach) | 3x10-12 | 45-50 kg | 2111 | 120 s | Paski chronią chwyt |
| 3 | Przysiad goblet (hantla przy klatce) | 3x10 | 10-14 kg | 3110 | 90 s | Neutralny uchwyt, sprawdź komfort |
| 4 | Wyprost nóg (maszyna) | 3x12 | wg maszyny, RPE 6 | 2110 | 90 s | Zero obciążenia łokcia |
| 5 | Ściąganie wyciągu górnego, V-bar neutralny | 3x10-12 | 30-35 kg | 3110 | 90 s | Neutralny chwyt |

**Dzień B — Pierś + barki + core**

| # | Ćwiczenie | Serie x Powt | Obciążenie start | Tempo | Przerwa | Uwaga łokieć |
|---|---|---|---|---|---|---|
| 1 | Chest press (maszyna) | 3x10-12 | RPE 6 | 3110 | 120 s | Prowadzony tor, mniej stresu niż hantle wolne |
| 2 | Shoulder press (maszyna) | 3x10-12 | RPE 6 | 2110 | 90-120 s | Prowadzony tor |
| 3 | Pallof press | 3x10/stronę | 8-10 kg | 2121 | 60 s | Zero obciążenia łokcia |
| 4 | Face pull z paskami na nadgarstkach | 3x12-15 | 8-10 kg | 2121 | 60-75 s | Pauza jeśli boli nawet z paskami |
| 5 | Plank / dead bug | 3x30-45 s | masa własna | — | 45 s | Bez obciążenia |

**Kryterium przejścia do Fazy 1:** 2 tygodnie bez bólu łokcia w trakcie i 24h po treningu, przy wszystkich ćwiczeniach powyżej.

---

### Faza 1 (Tydzień 3-6): Powrót do zmodyfikowanego A/B/C, 3x/tydzień

Progresja mezocyklowa jak w oryginalnym planie: Tydz.1 RPE 6 → Tydz.2 RPE 6-7 → Tydz.3 RPE 7-8 → Tydz.4 RPE 6 (deload). Ciężary startowe obniżone o 20-30% względem ostatnich odnotowanych w historii.

#### Dzień A (nogi + plecy + barki)

| # | Ćwiczenie | Tydz.1 (RPE 6) | Tydz.2 (RPE 6-7) | Tydz.3 (RPE 7-8) | Tydz.4 deload (RPE 6) | Tempo | Przerwa |
|---|---|---|---|---|---|---|---|
| 1 | Ściąganie wyciągu górnego, neutralny uchwyt | 3x12, 30 kg | 3x13, 30 kg | 3x15, 32,5 kg | 2x12, 30 kg | 3110 | 75-90 s |
| 2 | Leg press | 3x10, 60 kg | 3x10, 65 kg | 3x10, 70 kg | 2x10, 60 kg | 3110 | 120 s |
| 3 | Hip thrust (paski) | 3x10, 50 kg | 3x11, 50 kg | 3x12, 52,5 kg | 2x10, 50 kg | 2111 | 120 s |
| 4 | Chest press (maszyna) | 3x8, RPE6 | 3x9, +5% | 3x8, +5% | 2x8, poziom T1 | 2110 | 120 s |
| 5 | Shoulder press (maszyna) | 3x8, RPE6 | 3x9, +5% | 3x8, +5% | 2x8, poziom T1 | 2110 | 90-120 s |

#### Dzień B (plecy grubość + biceps + core)

| # | Ćwiczenie | Tydz.1 (RPE 6) | Tydz.2 (RPE 6-7) | Tydz.3 (RPE 7-8) | Tydz.4 deload (RPE 6) | Tempo | Przerwa |
|---|---|---|---|---|---|---|---|
| 1 | Face pull (pasy na nadgarstkach) | 3x12, 10 kg | 3x13, 10 kg | 3x15, 10 kg | 2x12, 10 kg | 2121 | 60-75 s |
| 2 | Wiosowanie siedząc, neutralny uchwyt (maszyna) | 3x10, RPE6 | 3x11, ten sam ciężar | 3x10, +5% | 2x10, poziom T1 | 3110 | 90 s |
| 3 | Podciąganie neutralnym uchwytem (asystowane gumą/maszyną, TYLKO gdy 0 bólu) | 3 serie do RPE 7, 2-3 powt. w zapasie | 1 seria do odmowy | ostatnia seria max RPE 8 | wracasz do wyniku T1 | kontrolowane | 120 s |
| 4 | Biceps curl uchwyt młotkowy (hantle lekkie) | 2x10, 6-7 kg | 2x12, ten sam | 3x10, +1 kg | 2x10, poziom T1 | 3110 | 75 s |
| 5 | Pallof press | 3x10/stronę | 3x10/stronę | 3x10/stronę | 2x10/stronę | 2121 | 45-60 s |

#### Dzień C (nogi tył + pchanie)

| # | Ćwiczenie | Tydz.1 (RPE 6) | Tydz.2 (RPE 6-7) | Tydz.3 (RPE 7-8) | Tydz.4 deload (RPE 6) | Tempo | Przerwa |
|---|---|---|---|---|---|---|---|
| 1 | Deadlift (lifting straps) | 3x6, 50 kg | 3x7, 50 kg | 3x6, 52,5-55 kg | 2x6, 50 kg | 2110 | 150 s |
| 2 | Split squat / step-up (obciążenie na barkach, nie w dłoni) | 3x10/stronę, RPE6 | 3x11/stronę, ten sam | 3x10/stronę, +obciążenie | 2x10/stronę, T1 | 3110 | 90 s |
| 3 | Wyciskanie na maszynie (chest press, kąt pochyły jeśli dostępny) | 3x10, RPE6 | 3x11, +5% | 3x10, +5% | 2x10, T1 | 2110 | 120 s |
| 4 | Focze wiosło / seal row (maszyna, neutralny uchwyt) | 3x10, 12 kg | 3x12, 12 kg | 3x10, 14 kg | 2x10, 12 kg | 3110 | 90 s |
| 5 | Przysiad z obciążeniem na barkach (zamiast farmer carry na razie) | 3x10, RPE6 | 3x10, +5% | 3x10, +5% | 2x10, T1 | 3110 | 90 s |

**Uwaga progresji:** zwiększaj obciążenie tylko gdy RPE pozostaje ≤6-7 we wszystkich seriach ORAZ brak bólu łokcia w trakcie i 24h po treningu. Minimum 48h regeneracji między sesjami obciążającymi tę samą grupę mięśniową.

---

### Faza 2 (Tydzień 7+): Reintegracja farmer carry i wolnych ciężarów górnej części ciała

Po 6 tygodniach bez bólu, stopniowo wprowadzać:
1. Farmer carry z paskami, niski ciężar (2x15 kg, 40 m) — obserwować 48h
2. Hantle wolne w wyciskaniu (zamiast maszyny) — zacznij od 60% ostatniego ciężaru z maszyny
3. Podciąganie bez asysty, jeśli faza 1 przeszła bez bólu
4. Wiosowanie sztangą wolną — wyłącznie z paskami, niski ciężar na start

---

## 4. Rehabilitacja łokcia — protokół równoległy (codziennie)

- **Eccentric wrist extension** (opór taśmą oporową): 3x15 powtórzeń, tempo 3-4 sekundy w fazie opuszczania (ekscentrycznej), codziennie. To najlepiej udokumentowana interwencja przy epicondylitis lateralis.
- **Stretching wyprostników przedramienia**: 3x30 s, kilka razy dziennie, szczególnie przed i po treningu.
- **Krioterapia / lód** na okolicę nadkłykcia bocznego po treningu, jeśli występuje jakikolwiek dyskomfort — 10-15 min.
- **Unikać** w życiu codziennym: intensywnego chwytu (np. długie ściskanie kierownicy motocykla bez przerw, mocny uścisk podczas pracy w ogrodzie).

To nie zastępuje konsultacji fizjoterapeutycznej — jeśli lekarz od łokcia dał konkretne zalecenia lub ograniczenia, powinny mieć priorytet nad tym planem.

---

## 5. Struktura danych dla aplikacji (sugestia dla Claude Code)

Przykładowa struktura JSON per sesja treningowa, gotowa do zaimplementowania jako model danych:

```json
{
  "workout_day": "A",
  "phase": "Faza 1",
  "week": 1,
  "date": "2026-07-21",
  "exercises": [
    {
      "order": 1,
      "name": "Ściąganie wyciągu górnego, neutralny uchwyt",
      "target_sets": 3,
      "target_reps": 12,
      "target_weight_kg": 30,
      "tempo": "3110",
      "rest_seconds": 90,
      "elbow_safe": true,
      "notes": "Neutralny uchwyt V-bar, kontroluj ból łokcia"
    }
  ],
  "rpe_target": 6,
  "pain_check": {
    "during_workout": null,
    "24h_after": null
  }
}
```

**Kluczowe pola do śledzenia w apce:**
- `pain_level` (0-10) po każdym ćwiczeniu i następnego dnia — to jest bezpiecznik progresji
- `rpe_actual` vs `rpe_target` — automatyczna reguła: jeśli `rpe_actual > target + 1` przez 2 sesje, zablokuj progresję obciążenia
- `elbow_safe` flag per ćwiczenie — pozwala filtrować/ostrzegać przy dodawaniu nowych ćwiczeń
- Widok "dzisiejszy trening" — lista ćwiczeń w kolejności z: nazwa, serie x powtórzenia, obciążenie, tempo, przerwa (do odczytania jednym spojrzeniem na telefonie)
- Historia progresji per ćwiczenie (wykres obciążenia w czasie) — bazując na danych z sekcji 1

---

## 6. Dieta i białko — wsparcie powrotu do treningów

### Kontekst z historii

Z dziennika wynika, że dieta była trzymana relatywnie dobrze mimo przerwy treningowej (deficyt/kontrola kalorii widoczna w większości wpisów, wahania 1600-2700 kcal/dzień, białko notowane nieregularnie w danych ale ślady sugerują świadome planowanie posiłków). To dobry punkt wyjścia — nie trzeba teraz radykalnie zmieniać diety, tylko dostosować ją do powrotu obciążeń treningowych i procesu regeneracji tkanki łącznej (ścięgna przy epicondylitis leczą się wolniej niż mięśnie).

### Cele kaloryczne i białkowe na fazę powrotu

| Parametr | Zalecenie | Uzasadnienie |
|---|---|---|
| Białko dzienne | 1,8-2,2 g/kg masy ciała | Górny zakres zalecany przy: (a) powrocie po przerwie — wsparcie resyntezy białek mięśniowych, (b) gojeniu tkanki łącznej (ścięgno wyprostników nadgarstka) — kolagen i regeneracja ścięgien wymagają wyższego spożycia białka niż standardowe 1,6 g/kg |
| Rozkład białka w ciągu dnia | 4 porcje x 0,4-0,5 g/kg, co 3-4h | Równomierny rozkład zwiększa syntezę białek mięśniowych bardziej niż 1-2 duże porcje |
| Bilans kaloryczny | Utrzymanie (maintenance) lub lekka nadwyżka +200-300 kcal w dniach treningowych | Powrót po przerwie + gojenie tkanki łącznej to nie jest dobry moment na agresywny deficyt — organizm potrzebuje energii do regeneracji |
| Węglowodany okołotreningowe | 30-50 g w ciągu 1-2h przed treningiem | Wsparcie wydolności przy powrocie do obciążeń po 15 tyg. przerwy |

### Specyfika dla gojenia ścięgna (epicondylitis lateralis)

Ścięgna mają znacznie słabsze ukrwienie niż mięśnie, więc regenerują się wolniej — wsparcie żywieniowe ma tu mniejszy, ale nie zerowy wpływ:

- **Kolagen + witamina C**: 15-20 g kolagenu hydrolizowanego lub żelatyny + 100-200 mg witaminy C, spożyte 30-60 min przed treningiem lub sesją eccentric wrist extension — badania wskazują na zwiększoną syntezę kolagenu w ścięgnach przy tym timing'u.
- **Kwasy omega-3** (ryby tłuste 2-3x/tydzień lub suplementacja 2-3 g EPA/DHA dziennie) — wsparcie przeciwzapalne, korzystne przy stanach zapalnych ścięgien.
- **Witamina D + magnez** — jeśli nie suplementowane, warto sprawdzić poziom, obie wspierają regenerację tkanek i funkcję nerwowo-mięśniową.
- **Nawodnienie** — pełne nawodnienie wspiera jakość tkanki łącznej; przy niedoborze płynów ścięgna i powięzi są mniej elastyczne.

### Rozkład dnia treningowego (przykład, dostosuj do wagi)

| Posiłek | Timing | Białko | Uwaga |
|---|---|---|---|
| Śniadanie | rano | 30-40 g | np. jajka + serek wiejski — wzorzec już obecny w Twoim dzienniku |
| Przed treningiem | 1-2h przed | 20-30 g + węglowodany | Lekkostrawne, unikaj dużej porcji tłuszczu tuż przed |
| Po treningu | do 1-2h po | 30-40 g + kolagen/wit. C jeśli sesja rehab łokcia | Okno anaboliczne + wsparcie ścięgna |
| Obiad | — | 30-40 g | — |
| Kolacja | — | 30-40 g | Kazeina/twaróg dobry wybór przed snem — wolniejsze wchłanianie białka nocą |

### Reguła przy stagnacji wagi

Jeśli waga nie zmienia się przez 2-3 tygodnie mimo świadomego bilansu kalorycznego — zastosuj dwie łagodne modyfikacje jednocześnie (nie więcej), np.:
1. Korekta kalorii o ±150-200 kcal/dzień (w zależności od celu redukcja/budowa)
2. Zwiększenie NEAT (kroki, aktywność ogólna) o 1000-1500 kroków dziennie

Unikaj ekstremalnych diet lub gwałtownych cięć kalorii — szczególnie teraz, gdy organizm jednocześnie regeneruje tkankę łączną i wraca do obciążeń po przerwie.

### Sugerowane pola do śledzenia w apce (żywienie)

```json
{
  "date": "2026-07-21",
  "body_weight_kg": null,
  "calories_target": null,
  "calories_actual": null,
  "protein_target_g": null,
  "protein_actual_g": null,
  "protein_per_kg": null,
  "collagen_taken": false,
  "omega3_taken": false,
  "hydration_liters": null
}
```

---

## 7. Podsumowanie zasad bezpieczeństwa

1. Zero bólu jako kryterium — nie "przeczekuj bólu przez trening"
2. Paski/straps obowiązkowo przy deadlift, wiosowaniu, farmer carry (gdy wrócą)
3. Uchwyt neutralny zawsze gdy dostępna opcja (podciąganie, wiosowanie, curl)
4. Maszyny > wolne ciężary dla górnej części ciała w pierwszych 6 tygodniach
5. Minimum 48h regeneracji między sesjami tej samej grupy mięśniowej
6. Progresja obciążenia tylko gdy RPE ≤6-7 we wszystkich seriach i brak bólu 24h po
7. Codzienny rehab łokcia (eccentric wrist extension) niezależnie od dni treningowych
8. W razie wątpliwości medycznych — konsultacja z lekarzem/fizjoterapeutą ma priorytet nad tym planem
