# Instrukcja dla trenera — plik planu żywieniowego

Ten dokument opisuje, jak przygotować plan żywieniowy w pliku, który
zawodnik wczyta do aplikacji Trening (zakładka **Żywienie → Wczytaj plan
żywieniowy**). To jest **osobny plik od planu treningowego** — inny format,
inny przycisk importu, wczytywany niezależnie.

## Jak to działa

1. Wypełnij plik `dieta-trenera-szablon.md` — zwykły plik tekstowy
   (Markdown), edytowalny w czymkolwiek.
2. Wyślij plik zawodnikowi.
3. Zawodnik wczytuje go: zakładka **Żywienie → Wczytaj plan żywieniowy**.
4. Aplikacja od razu ustawia cel kaloryczny, białko g/kg, listę suplementów
   (z codzienną checklistą) i priorytet błonnika — nic nie trzeba wpisywać
   ręcznie.

## Struktura pliku

```markdown
# Dieta: nazwa bloku/celu
Trener: Pedro
Zawodnik: Bartłomiej
Deficyt: 400-500 kcal
Bialko: 2.1 g/kg
Blonnik: skup się na odpowiedniej podaży błonnika codziennie
Uwagi: Dowolna dodatkowa notatka.

| Suplement | Dawka | Kiedy |
|---|---|---|
| Kreatyna | 9 g | codziennie |
```

### Linie nagłówkowe (wszystkie opcjonalne poza pierwszą)

| Linia | Opis |
|---|---|
| `# Dieta: ...` | Nazwa bloku/planu — pokazuje się jako tytuł karty w aplikacji |
| `Trener:` / `Zawodnik:` | Metadane, czysto informacyjne |
| `Deficyt: X-Y kcal` | Cel kaloryczny jako deficyt względem "Kcal maintenance" zawodnika (jego własnego, wcześniej ustawionego szacunku utrzymania). Można podać zakres (`400-500`) albo pojedynczą liczbę (`450`). |
| `Nadwyżka: X-Y kcal` | To samo co wyżej, ale w drugą stronę — dla celu budowy masy zamiast redukcji. Użyj albo `Deficyt:`, albo `Nadwyżka:`, nie obu naraz. |
| `Bialko:` / `Białko:` | Docelowe białko w g/kg masy ciała, np. `2.1 g/kg` — liczba przed "g/kg" jest tym, co się liczy. |
| `Blonnik:` / `Błonnik:` | Obecność tej linii **włącza przypomnienie o błonniku** w aplikacji (zakładka Żywienie pokaże je jako regułę + osobne pole do wpisania gramów dziennie). Możesz opcjonalnie podać liczbę — pierwsza liczba w tej linii staje się celem gramowym (np. `Błonnik: cel 30 g dziennie` → cel 30 g). Bez liczby — samo przypomnienie, bez konkretnego celu liczbowego. |
| `Uwagi:` | Dowolna notatka wyświetlana w karcie planu w aplikacji. |

**Ważne:** jeśli zawodnik nie potrzebuje jakiegoś suplementu z poprzedniego
planu (np. kolagenu) — **po prostu go pomiń w tabeli**. Import **całkowicie
podmienia** listę suplementów, nie dokleja do starej — więc pominięcie
pozycji jest wystarczające, żeby ją usunąć.

### Tabela suplementów

| Kolumna | Wymagana | Opis |
|---|---|---|
| **Suplement** | tak | Nazwa, np. `Kreatyna`, `VitaPack+` |
| **Dawka** | tak (może być `-`) | np. `9 g`, `4000 mg`, `2 tabletki`. `-` = bez podanej dawki (np. gdy dawka jest zmienna/wg opakowania) |
| **Kiedy** | nie | Domyślnie "codziennie", jeśli pominięta albo `-` |

Każdy wiersz staje się jedną pozycją na **codziennej, odhaczalnej liście**
suplementów w zakładce Żywienie. Zawodnik może też ręcznie dopisać własne
pozycje w aplikacji (np. coś, co bierze doraźnie) — to nie koliduje z
importem, dopóki nie wczyta kolejnego pliku (który znowu podmienia całą
listę na to, co w nim jest).

## Co aplikacja liczy sama

- **Cel kaloryczny** = własne "Kcal maintenance" zawodnika (wpisane wcześniej
  w Ustawieniach) ± Twój deficyt/nadwyżka. Jeśli zawodnik nie ma jeszcze
  ustawionego maintenance — aplikacja poprosi go o to, zanim pokaże cel.
- **Cel białkowy** = aktualna waga ciała zawodnika × podane g/kg — przeliczane
  codziennie na nowo, gdy zawodnik wpisze świeżą wagę.
- Zawodnik ma też w aplikacji: wykres wagi ciała w czasie (z automatycznym
  wskazaniem trendu: rośnie/spada/stabilnie) oraz cotygodniowe obwody
  (talia, brzuch, uda, klatka, biceps, łydki) z takimi samymi wykresami —
  to dobre źródło danych do oceny, czy plan działa, przy okazji kolejnych
  korekt.

## Częste błędy

- `Deficyt:` bez żadnej liczby w linii.
- `Bialko:` bez liczby przed "g/kg".
- Wiersz tabeli z tylko jedną kolumną (brakuje kolumny Dawka).
- Usunięcie linii separatora `|---|---|---|` pod nagłówkiem tabeli.

Aplikacja waliduje plik przy wczytaniu i pokazuje pełną listę błędów po
polsku — nic się nie zaimportuje, dopóki plik nie jest poprawny.
