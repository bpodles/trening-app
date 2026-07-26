# BUILD_PROMPT.md

Gotowy prompt do wklejenia w Claude Code, gdy zdecydujesz się odtworzyć tę
aplikację od zera — na podstawie `SPEC.md`, z uwzględnieniem proponowanych
usprawnień i **bez** przenoszenia długu technicznego ze starego kodu.

Nie edytuj tego pliku pod kątem treści merytorycznej planu (to żyje w
`SPEC.md`) — edytuj go tylko, jeśli chcesz zmienić SPOSÓB podejścia do
odbudowy (np. inny stack, inna kolejność faz).

---

## Prompt (skopiuj wszystko poniżej tej linii)

Przeanalizuj plik `SPEC.md` w tym katalogu — to kompletna specyfikacja
funkcjonalna i techniczna aplikacji "Trening — Powrót do siły", napisana na
podstawie analizy działającego kodu. Twoje zadanie: **zbuduj tę aplikację od
zera**, jako zupełnie nowy kod, z czystą architekturą — nie kopiuj żadnego
fragmentu ze starego źródła (jeśli masz do niego dostęp), traktuj `SPEC.md`
jako jedyne źródło prawdy o wymaganym zachowaniu.

### Zakres tego zadania

Buduj **wyłącznie wariant PWA** opisany w SPEC.md (statyczna aplikacja,
hosting typu GitHub Pages, `manifest.webmanifest` + Service Worker). **Pomiń
całkowicie wariant "Artifact"** (hosting Claude, `window.claude.downloads`) —
to była specyficzna dla platformy ścieżka dystrybucji poprzedniej wersji i
nie jest częścią tego zadania, chyba że wyraźnie o to poproszę. Jeśli
mechanizm zapisu plików (eksport historii, backupu, szablonu dla trenera)
jest potrzebny — użyj od razu Web Share API z fallbackiem do
`Blob`+`<a download>` (sekcja 4.24 i 2 w SPEC.md), bez gałęzi warunkowej pod
platformę Claude.

### Twarde wymagania (nie negocjowalne, chyba że zapytasz)

1. **Zero backendu, zero kont użytkowników.** Cały stan w `localStorage`,
   jedno urządzenie = jeden, niezależny zestaw danych. Wielu użytkowników
   obsługujemy przez osobne instalacje, nie przez logowanie.
2. **Zachowaj dokładnie logikę biznesową opisaną w SPEC.md sekcja 6**
   (silnik progresji, blokada progresji, kryteria bólu, bramka fazy,
   stagnacja wagi) — to jest przetestowana w praktyce logika medyczno-
   -treningowa, nie zmieniaj jej reguł bez wyraźnej prośby, nawet jeśli
   "wyglądałaby czyściej" inaczej.
3. **Zachowaj dokładnie gramatykę formatu pliku trenera** (SPEC.md sekcja 5)
   — to jest zewnętrzny kontrakt z osobami, które nie znają kodu (trenerzy).
   Zmiana formatu złamałaby istniejące pliki planów, które ludzie już mają.
4. **Zachowaj decyzje projektowe z SPEC.md sekcji 8** dosłownie — zwłaszcza:
   timer bez dźwięku/wibracji/powiadomień, ręczne (nie automatyczne)
   przejście fazy, plan trenera z wiążącym (nienadpisywanym w górę) ciężarem,
   strukturalną poprawkę na przewijanie iOS (nie-przewijalny `<body>` +
   jeden przewijalny kontener, fixed elementy jako jego rodzeństwo).
5. Zachowaj model danych z sekcji 3 SPEC.md **strukturalnie** (te same
   pojęcia, te same relacje) — możesz poprawić TYPY/reprezentację (patrz
   niżej), ale nie zmieniaj znaczenia pól bez wyraźnej potrzeby.

### Czego NIE przenosić (napraw to od razu, zgodnie z sekcją 9 SPEC.md)

1. Nie twórz zepsutych/martwych zmiennych CSS — użyj jednego spójnego,
   kompletnego zestawu tokenów kolorów od początku, zweryfikuj że każda
   reguła CSS odwołuje się do zmiennej, która faktycznie istnieje.
2. Nie mieszaj typów w polu określającym pochodzenie sesji/planu (numer
   fazy vs literał `'custom'`) — użyj jawnego, jednoznacznego pola
   dyskryminującego (np. `source: 'builtin' | 'trainer'`), a numer fazy i
   identyfikator planu trzymaj w osobnych, zawsze-obecnych polach.
3. Nie duplikuj `buildSession`/`buildSessionCustom` ani duplikuj widoku
   podglądu dnia treningowego (plan wbudowany vs plan trenera) — zaprojektuj
   jeden, wspólny kształt "co dziś trenować" (lista pozycji ćwiczeń + cel +
   metadane dnia), niezależny od tego, czy pochodzi z planu wbudowanego, czy
   z importu, i jedną funkcję/komponent budującą sesję oraz jeden
   renderer podglądu, parametryzowany źródłem danych.
4. Nie koduj intencji progresji trenera jako dopasowywanie podciągów w
   dowolnym tekście (`"+5%"`, `"+1 kg"` w treści notatki) — jeśli
   odtwarzasz format pliku trenera, rozważ dodanie w gramaturze formatu
   jawnego, ustrukturyzowanego sposobu wyrażenia tej intencji (np. osobna,
   opcjonalna kolumna albo prefiks w komórce Ciężar rozpoznawany
   jednoznacznie), zamiast polegać na dopasowaniu wolnego tekstu. Jeśli
   zachowujesz zgodność wsteczną z istniejącymi plikami planu (patrz wymóg
   3 wyżej) — rozpoznawaj oba na wejściu, ale wewnętrznie reprezentuj to
   jako ustrukturyzowane pole.
5. Nie hardkoduj progów bramki fazy (jak stare `needWeeks`) w kodzie —
   wszystkie progi kryteriów przejścia fazy powinny pochodzić z definicji
   danych tej fazy, w pełni sparametryzowane.
6. Nie polegaj na ręcznej, konwencyjnej dyscyplinie escapowania HTML przy
   budowaniu widoków ze stringów. Wybierz podejście, w którym escapowanie
   jest **strukturalnie gwarantowane** — albo lekka biblioteka renderująca
   (np. `lit-html`, lub nawet natywne szablony z `textContent` zamiast
   `innerHTML` tam, gdzie to możliwe), albo — jeśli świadomie zostajesz przy
   stringowym budowaniu HTML dla prostoty — jeden, wspólny helper
   renderujący pola danych, który NIE POZWALA ominąć escapowania (np.
   funkcja `text(str)` zwracająca już-bezpieczny fragment, używana
   konsekwentnie zamiast bezpośredniej interpolacji).
7. **Jedno źródło prawdy dla builda.** Jeśli w ogóle potrzebujesz więcej niż
   jednego pliku wynikowego — zbuduj to jako właściwy, powtarzalny krok
   budowania (skrypt w repozytorium, komenda npm, cokolwiek), NIE jako
   ręczną transformację żyjącą poza kontrolą wersji. W tym zadaniu (patrz
   "Zakres" wyżej) budujesz tylko jeden wariant, więc ten problem w ogóle
   nie powinien wystąpić — ale jeśli w przyszłości dojdzie wariant
   dodatkowy, zaplanuj to z góry jako skrypt w repo.
8. Rozdziel warstwy zgodnie z sekcją 9 SPEC.md: dane konfiguracyjne / stan
   i trwałość / logika domenowa (silnik progresji, walidacja, parser
   formatu trenera) / warstwa widoku. Logika domenowa powinna być
   **czystymi funkcjami** (żadnego odczytu/zapisu DOM ani `localStorage`
   wewnątrz silnika progresji czy parsera) — to jest warunek konieczny do
   sensownego testowania jednostkowego.
9. Napisz **testy jednostkowe** dla: silnika progresji (pełna macierz
   przypadków z SPEC.md sekcja 6.1 — brak historii, ból silny, ból lekki,
   RPE przekroczone raz vs dwa razy z rzędu, ścieżka z planem liczbowym,
   ścieżka "+5%"/"+1 kg"/deload) oraz parsera formatu Markdown (wszystkie
   edge case'y z SPEC.md sekcja 8: zakresy liczbowe w RPE/tygodniach,
   rozgrzewka błędnie wpisana jako wiersz tabeli, sekcje bez daty
   ignorowane bez błędu, sekcja rehab, appendix opisów technik doklejany do
   właściwego ćwiczenia). Nie musisz pisać testów end-to-end dla całego UI,
   ale te dwa moduły muszą mieć realne pokrycie.
10. Rozważ (nie wymagane, ale zalecane) dodanie lekkiej walidacji kształtu
    stanu wczytanego z `localStorage` przy starcie — żeby uszkodzone/
    nieoczekiwane dane nie wywalały się dopiero w trakcie renderowania.

### Swoboda decyzji (możesz wybrać sam, bez pytania)

- Stack: wciąż może to być vanilla JS bez frameworka (to była działająca,
  celowa decyzja projektowa dla prostoty) ALBO lekki framework/biblioteka
  (Preact, lit, Svelte) jeśli uznasz, że realnie poprawi to czytelność bez
  utraty "zero-build, łatwe do zrozumienia" charakteru — Twoja decyzja,
  uzasadnij ją krótko w commit message.
- Podział na pliki/moduły ES — użyj natywnych `<script type="module">` i
  osobnych plików `.js` zamiast jednego pliku 2500+ linii, chyba że masz
  dobry powód, żeby tego nie robić dla tego konkretnego wdrożenia (np.
  ograniczenia hostingu).
- Framework testowy: wybierz dowolny lekki, uruchamialny bez ciężkiej
  infrastruktury (np. `node --test`, `vitest`), o ile nie wymaga
  backendowego środowiska uruchomieniowego innego niż Node do samego
  odpalenia testów.

### Kolejność pracy (zalecana)

1. Przeczytaj cały `SPEC.md` przed napisaniem czegokolwiek.
2. Zacznij od warstwy domenowej (dane statyczne + silnik progresji + parser
   formatu trenera) i jej testów — to jest część, którą najłatwiej
   zweryfikować w izolacji i najbardziej opłaca się mieć poprawną od
   początku.
3. Dopiero potem warstwa stanu/trwałości, potem widoki.
4. Na końcu: manifest, service worker, weryfikacja w prawdziwej przeglądarce
   mobilnej (użyj dostępnych narzędzi podglądu, przetestuj realny przepływ:
   import planu → sesja → log serii z bólem → wstrzymanie → follow-up 24h →
   eksport historii).
5. Nie publikuj/wdrażaj niczego bez wyraźnej prośby — zatrzymaj się po
   zbudowaniu i lokalnym zweryfikowaniu, zapytaj o dalsze kroki (hosting,
   repozytorium, itd.), zgodnie z ogólnymi zasadami ostrożności przy
   akcjach nieodwracalnych/publicznych.

Zanim zaczniesz pisać kod, podsumuj mi w 4–6 zdaniach swój plan podziału na
moduły/pliki i jak zamierzasz przetestować silnik progresji — chcę to
zatwierdzić przed pełną implementacją.
