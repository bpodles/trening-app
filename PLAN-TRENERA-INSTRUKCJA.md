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

### Rozgrzewka (opcjonalnie) — ⚠️ WAŻNE, częsty błąd

**Rozgrzewka nigdy nie jest wierszem w tabeli ćwiczeń.** Ma osobną, dedykowaną linię
`Rozgrzewka:` z krokami rozdzielonymi średnikiem — na górze pliku (dla wszystkich
treningów) albo pod nagłówkiem `##` konkretnego treningu (nadpisuje ogólną):

```markdown
Rozgrzewka: 5 min rower; krążenia ramion 2 min; stretching przedramion 2x30 s
```

To pokazuje się w aplikacji jako osobna, odhaczalna karta na górze treningu — **nie**
dodawaj wiersza typu `| Rozgrzewka [rozgrzewka] | 8-10 min | ... |` do tabeli ćwiczeń,
bo tabela ćwiczeń wymaga formatu `3x10-12`, a "8-10 min" tego formatu nie spełnia
(aplikacja to wyłapie i poprosi o poprawkę). Jeśli chcesz opisać rozgrzewkę bardzo
szczegółowo (kilka etapów, linki wideo) — zrób to w sekcji dodatkowej opisanej niżej
("### Rozgrzewka ogólna [rozgrzewka]"), a w linii `Rozgrzewka:` daj tylko skróconą
listę kroków. Jeśli nie podasz żadnej, aplikacja pokaże swoją domyślną rozgrzewkę
(zawiera stretching wyprostników przedramienia pod rehab łokcia).

### Dodatkowe sekcje — wyjaśnienia, opisy technik, wideo (opcjonalnie)

Możesz dopisać do pliku dowolne sekcje `## ...` **bez daty na początku** — np.
"## Jak czytać ten plan", "## Opisy techniki i materiały wideo". Aplikacja
rozpoznaje, że to nie jest trening (nie zaczyna się datą) i **bezpiecznie je
pomija** — nie zgłasza błędu, po prostu ich nie pokazuje w apce. Możesz tam pisać
cokolwiek — tabele, wyjaśnienia RPE, wskazówki ogólne — Bartek/Łukasz to przeczyta
otwierając sam plik, ale aplikacja tego nie potrzebuje.

**Wyjątek, który JEST wykorzystywany przez aplikację:** podsekcje w formacie
`### Nazwa ćwiczenia [id]` (trzy krzyżyki, ten sam `[id]` co w tabeli). Wszystko,
co napiszesz pod taką podsekcją (akapit opisu + ewentualnie linia
`Wideo: [tytuł](https://...)`), aplikacja **doczepia automatycznie** do ćwiczenia
o tym `[id]` — pokaże się jako pełny opis + przycisk „Zobacz na YouTube" w karcie
ćwiczenia. Dzięki temu opis piszesz **raz**, a każdy wiersz tabeli z tym samym `[id]`
(w dowolnym tygodniu) go dziedziczy — nie musisz powtarzać wskazówek w każdej kolumnie
Wskazówka.

```markdown
## Opisy techniki i materiały wideo

### Leg press [leg_press]
Siadasz w maszynie, stopy na platformie na szerokość barków... (dowolnie długi opis)
Wideo: [How to do a Leg Press](https://www.youtube.com/watch?v=...)
```

### Rehab łokcia — codzienna checklista (opcjonalnie)

Jeśli fizjoterapeuta zmienia protokół rehabilitacji, możesz go wpisać do pliku —
**zastąpi wtedy wbudowaną checklistę** w zakładce Rehab (i będzie tak samo odhaczalny
codziennie, ze streakiem dni z rzędu). Format: nagłówek `##` zawierający słowo
"rehab" (w dowolnym miejscu nazwy), a pod nim podsekcje `### N. Nazwa [id]` — dokładnie
ten sam mechanizm co opisy technik wyżej, plus opcjonalna linia `**Kiedy**: ...`
(częstotliwość, pokaże się razem z opisem):

```markdown
## Rehabilitacja łokcia — protokół fizjoterapeuty

### 1. Rozciąganie zginaczy nadgarstka [rehab_zginacze]
Ramię wyprostowane przed sobą, nadgarstek zgięty grzbietowo... Trzymaj 20-30s.
**Kiedy**: kilka razy dziennie.
Wideo: [Wrist Flexor Stretch](https://www.youtube.com/watch?v=...)

### 2. Rozciąganie wyprostników nadgarstka [rehab_wyprostniki]
...

### 3. Rotacja tułowia (open book stretch) [rehab_rotacja_tulowia]
...
```

Każda podsekcja `### N. Nazwa [id]` w tej sekcji staje się jedną pozycją na
codziennej liście do odhaczenia. Możesz wpisać dowolną liczbę pozycji (nie musi
być akurat 3).

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

- **Rozgrzewka jako wiersz tabeli** (np. `| Rozgrzewka [rozgrzewka] | 8-10 min | ... |`) —
  format "8-10 min" nie pasuje do wymaganego "3x10-12". Użyj linii `Rozgrzewka:` (patrz wyżej).
- **Serie×Powt. bez „x"** — np. "1 seria do odmowy" albo "1 seria max". Musi być
  `1x do odmowy` / `1x max` — liczba, litera „x", potem opis.
- Brak daty na początku nagłówka `##` treningu — jeśli to nie jest trening tylko
  dokumentacja/wyjaśnienie, to OK, aplikacja go pominie bez błędu (patrz sekcja
  "Dodatkowe sekcje" wyżej). Błąd pojawi się tylko, jeśli sekcja zawiera słowo
  "rehab" (wtedy aplikacja oczekuje formatu rehab-checklisty) — w innym wypadku
  brak daty nigdy nie blokuje importu.
- Usunięcie linii z kreskami `|---|---|...` pod nagłówkiem tabeli — zostaw ją.
- Za mało kolumn w wierszu (musi być min. 6, docelowo 8-9, puste wypełniaj `-`).
- Inna liczba `|` niż w pozostałych wierszach (każdy wiersz zaczyna i kończy się `|`).

Aplikacja waliduje plik przy wczytaniu i wypisuje po polsku, co i w której linii
jest nie tak. Nic nie zostanie wczytane, dopóki plik nie jest poprawny — nie da się
"zepsuć" istniejących danych złym plikiem.

---

*Format JSON z wcześniejszej wersji (`plan-trenera-szablon.json`) jest nadal
akceptowany — aplikacja rozpoznaje format automatycznie.*
