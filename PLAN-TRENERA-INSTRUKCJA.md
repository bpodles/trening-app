# Instrukcja dla trenera — plik planu treningowego

Cześć Pedro! Ten dokument opisuje, jak przygotować plan treningowy w pliku, który
Bartłomiej wczyta do swojej aplikacji treningowej. Aplikacja pokaże mu na siłowni
właściwy trening na dany dzień, poprowadzi zapisywanie serii (powtórzenia, ciężar,
RPE, ból łokcia), odliczy przerwy i będzie pilnować zasad bezpieczeństwa łokcia.

## Jak to działa

1. Wypełniasz plik `plan-trenera-szablon.md` — to zwykły plik tekstowy (Markdown).
   Edytuj w czymkolwiek: Notatnik, VS Code, aplikacja Notatki. Ważne, żeby zachować
   strukturę: nagłówki `##` i tabele z kreskami `|`.
2. Wysyłasz plik Bartkowi (może być przez komunikator — byle dotarł jako plik `.md` lub `.txt`).
3. Bartek wczytuje go w aplikacji: zakładka **Plan → Wczytaj plan**.
4. Aplikacja sama pokazuje trening przypisany do dzisiejszej daty.

Plan może obejmować dowolną liczbę tygodni — dodajesz po prostu kolejne treningi
z kolejnymi datami.

## Struktura pliku

### Nagłówek planu (raz, na górze pliku)

```markdown
# Plan: Blok wrzesień 2026
Trener: Pedro
Zawodnik: Bartłomiej
Opis: Hipertrofia z ochroną łokcia.
Uwagi: Rozgrzewka 10 min przed każdym treningiem.
```

Wszystkie linie poza pierwszą (`# Plan: ...`) są opcjonalne.

### Trening (powtarzasz dla każdego dnia)

```markdown
## 2026-08-03 | A — nogi + plecy | tydzień 1 | RPE 6
Uwagi: Opcjonalna notatka do tego treningu.

| Ćwiczenie | Serie×Powt. | Ciężar | Tempo | Przerwa | RPE | Flagi | Wskazówka |
|---|---|---|---|---|---|---|---|
| Leg press [leg_press] | 3x10-12 | 60 | 3110 | 120 | 6 | - | Pełny zakres |
```

Nagłówek `##` to segmenty rozdzielone `|`:

| Segment | Wymagany | Opis |
|---|---|---|
| data | **TAK** | `2026-08-03` albo `3.08.2026` |
| nazwa | **TAK** | np. `A — nogi + plecy` |
| `tydzień N` | nie | numer tygodnia bloku |
| `RPE N` | nie | docelowe RPE całego treningu (1–10) |

### Kolumny tabeli ćwiczeń (kolejność stała, puste pole = `-`)

| Kolumna | Jak wypełnić |
|---|---|
| **Ćwiczenie** | Nazwa + opcjonalnie identyfikator w nawiasach kwadratowych, np. `Leg press [leg_press]`. **Używaj tego samego `[id]` dla tego samego ćwiczenia w całym planie** — po nim aplikacja łączy historię, rysuje wykres progresji i stosuje reguły bezpieczeństwa. Bez `[id]` liczy się identyczna nazwa. |
| **Serie×Powt.** | `3x10-12`, `3x10/str.`, `2x40 m`, `3x30-45 s`, `3xdo RPE 7` |
| **Ciężar** | Liczba w kg: `60` lub `47,5` (może być z "kg"). Gdy ciężar dobierany na miejscu — wpisz opis, np. `RPE 6` albo `2x15 kg`. Specjalne: `+5%` = aplikacja sama zaproponuje +5% względem ostatniej sesji (o ile RPE i ból pozwolą). `-` = masa własna / brak. |
| **Tempo** | np. `3110` (opuszczanie-pauza-unoszenie-pauza) albo opis, `-` gdy nieistotne |
| **Przerwa** | Sekundy: `120`. Może być zakres `90-120` (timer użyje górnej wartości) |
| **RPE** | Docelowe RPE tego ćwiczenia (nadpisuje RPE treningu), `-` = bez zmian |
| **Flagi** | Lista po przecinku: `paski` (przypomnienie o lifting straps), `uwaga-łokieć` (żółte ostrzeżenie ⚠️), `łokieć-nie` (czerwone "wykluczone"), `opcjonalne` (domyślnie pominięte, Bartek może włączyć). `-` = brak flag |
| **Wskazówka** | Krótka wskazówka techniczna widoczna na karcie ćwiczenia, `-` = brak |
| **Video** (opcjonalna 9. kolumna) | Link do YouTube pokazujący technikę — pojawi się jako przycisk "Zobacz na YouTube" w karcie ćwiczenia. Możesz pominąć całą kolumnę. Uwaga: jeśli użyjesz identyfikatorów z wbudowanej bazy (`leg_press`, `hip_thrust`, `chest_press`, `deadlift_straps`...), ćwiczenie automatycznie dostanie opis techniki i link video z aplikacji |

### Rozgrzewka (opcjonalnie)

Linia `Rozgrzewka:` z krokami rozdzielonymi średnikiem — na górze pliku (dla wszystkich
treningów) albo pod nagłówkiem `##` konkretnego treningu (nadpisuje ogólną):

```markdown
Rozgrzewka: 5 min rower; krążenia ramion 2 min; stretching przedramion 2x30 s
```

Jeśli nie podasz żadnej, aplikacja pokaże swoją domyślną rozgrzewkę (zawiera
stretching wyprostników przedramienia pod rehab łokcia).

## Co aplikacja robi sama (musisz o tym wiedzieć)

Twoje zaplanowane ciężary są punktem wyjścia i **aplikacja ich nie podnosi** —
ale koryguje w dół, jeśli coś się dzieje:

- **Ból łokcia >2/10** (w trakcie serii lub 24 h po treningu) → ćwiczenie automatycznie
  wstrzymane na 7 dni, a przy powrocie propozycja −10% ciężaru.
- **RPE > cel+1 przez 2 sesje z rzędu** → blokada zwiększania ciężaru (propozycja
  nie przekroczy ostatnio użytego ciężaru, nawet jeśli w planie jest więcej).
- **Jakikolwiek ból (1–2/10) albo RPE powyżej celu** → brak progresji w następnej sesji.
- Trening z datą wsteczną pokaże się jako "zaległy"; przyszły — jako "zaplanowany".
- Jeśli dwa treningi wypadną <48 h od siebie, Bartek zobaczy ostrzeżenie o regeneracji.

Kontekst medyczny: Bartek wraca po łokciu tenisisty (epicondylitis lateralis).
Unikamy: podciągania nadchwytem, wiosłowania wolną sztangą bez pasków, ciężkich curli
chwytem supinowanym, farmer carry bez pasków, obciążonego chwytu. Preferujemy uchwyt
neutralny i maszyny dla górnej części ciała.

## Częste błędy

- Brak daty na początku nagłówka `##` — aplikacja powie, w której linii.
- Usunięcie linii z kreskami `|---|---|...` pod nagłówkiem tabeli — zostaw ją.
- Za mało kolumn w wierszu (musi być 8, puste wypełniaj `-`).
- Inna liczba `|` niż w pozostałych wierszach (każdy wiersz zaczyna i kończy się `|`).

Aplikacja waliduje plik przy wczytaniu i wypisuje po polsku, co i w której linii
jest nie tak. Nic nie zostanie wczytane, dopóki plik nie jest poprawny — nie da się
"zepsuć" istniejących danych złym plikiem.

---

*Format JSON z wcześniejszej wersji (`plan-trenera-szablon.json`) jest nadal
akceptowany — aplikacja rozpoznaje format automatycznie.*
