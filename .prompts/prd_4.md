Jesteś doświadczonym menedżerem produktu, którego zadaniem jest stworzenie kompleksowego dokumentu wymagań produktu (PRD) w oparciu o poniższe opisy:

<project_description>
### Główny problem
Manualne tworzenie wysokiej jakości fiszek edukacyjnych jest czasochłonne, co zniechęca do korzystania z efektywnej metody nauki jaką jest spaced repetition.

### Najmniejszy zestaw funkcjonalności
- Generowanie fiszek przez AI na podstawie wprowadzonego tekstu (kopiuj-wklej)
- Akceptacja lub odrzucenie fiszki wygenerowanej przez AI
- Manualne tworzenie fiszek (bazujących wyłącznie na tekście)
- Prosty system kont użytkowników do przechowywania fiszek
- Przeglądanie, edycja i usuwanie swoich fiszek
- Integracja fiszek z gotowym algorytmem powtórek
- Zbieranie następujących danych: manualne dodanie fiszki, akceptacja wygenerowania fiszki przez AI, odrzucenie wygenerowanej fiszki przez AI

### Co NIE wchodzi w zakres MVP
- Własny, zaawansowany algorytm powtórek (jak SuperMemo, Anki)
- Import wielu formatów (PDF, DOCX, itp.)
- Współdzielenie zestawów fiszek między użytkownikami
- Integracje z innymi platformami edukacyjnymi
- Integracja z platformami social media
- Aplikacje mobilne (tylko web)
- Aspekty marketingowe

### Kryteria sukcesu
- 75% fiszek wygenerowanych przez AI jest akceptowane przez użytkownika
- Użytkownicy tworzą 75% fiszek z wykorzystaniem AI
</project_description>

<project_details>
<decisions>
1. System autoryzacji będzie oparty wyłącznie na tradycyjnym modelu email/hasło.  
2. Fiszki mogą być tworzone ręcznie lub generowane przez AI na podstawie wprowadzonego tekstu.  
3. Mechanizm akceptacji lub odrzucenia fiszek generowanych przez AI będzie dostępny.  
4. Po dodaniu fiszki (manualnie lub przez AI) następuje zapis rekordu w bazie danych wraz z timestampem, co umożliwia mierzenie KPI.  
5. Widok przeglądania fiszek powinien umożliwiać filtrowanie po sposobie dodania (AI vs MANUAL) oraz sortowanie po dacie (timestamp).  
6. Przy operacjach edycji i usuwania fiszek wdrożony zostanie mechanizm potwierdzenia akcji.  
7. Użytkownik będzie miał dostęp do swoich statystyk – liczby dodanych, zaakceptowanych oraz odrzuconych fiszek.  
8. Nie przewiduje się możliwości ręcznej modyfikacji propozycji AI przed ich zapisaniem.  
9. Operacje edycji oraz usuwania będą realizowane pojedynczo, bez możliwości masowych działań.  
10. Nie są wymagane zaawansowane zabezpieczenia przechowywania danych ani skalowalność bazy w MVP.  
11. UI ma być bardzo intuicyjne i dostarczać najwyższego poziomu UX, ale nie będzie optymalizowane pod kątem dostępności.
</decisions>

<matched_recommendations>
1. Uściślić wymagania dotyczące metod autoryzacji i zabezpieczenia kont użytkowników.  
2. Doprecyzować funkcjonalności widoku przeglądania fiszek, szczególnie filtrowanie po typie dodania oraz sortowanie po timestampie.  
3. Zdefiniować mechanizmy potwierdzania operacji edycji i usuwania, aby zapobiec przypadkowym modyfikacjom.  
4. Zaprojektować moduł statystyk umożliwiający użytkownikom monitorowanie ich działań (manualnie dodane fiszki, wygenerowane przez AI fiszki zaakceptowane, wygenerowane przez AI fiszki odrzucone).  
5. Upewnić się, że system rejestruje akcje użytkownika poprzez zapisywanie odpowiednich rekordów w bazie danych.  
</matched_recommendations>

<prd_planning_summary>
Produkt MVP ma na celu usprawnienie procesu tworzenia fiszek poprzez automatyczne generowanie fiszek przez AI oraz umożliwienie ręcznego ich tworzenia. Kluczowe funkcjonalności obejmują:
- Logowanie użytkowników używając modelu email/hasło.
- Dodawanie fiszek ręcznie oraz generowanie fiszek na podstawie wprowadzonego tekstu, gdzie użytkownik ma możliwość akceptacji lub odrzucenia propozycji AI.
- Widok przeglądania fiszek, umożliwiający filtrowanie (AI vs manualnie) oraz sortowanie po dacie dodania.
- Mechanizmy edycji i usuwania fiszek, zabezpieczone poprzez komunikaty potwierdzające operacje, aby uniknąć przypadkowych zmian.
- Rejestrowanie wszystkich akcji (dodanie, akceptacja, odrzucenie) w bazie danych z timestampami, co umożliwia mierzenie wskaźników sukcesu, tj. 75% akceptacji fiszek generowanych przez AI oraz 75% udziału fiszek generowanych przez AI w ogólnej liczbie zapisanych fiszek.
- Użytkownik ma dostęp do statystyk dotyczących jego działań (ilość dodanych, zaakceptowanych i odrzuconych fiszek).

Podsumowując, najważniejsze elementy to:
a. Funkcjonalności: logowanie, tworzenie fiszek (ręczne i AI), przeglądanie, edycja, usuwanie, oraz rejestracja akcji użytkowników.  
b. Historie użytkownika: logowanie, wybór trybu dodawania fiszki, przeglądanie swoich fiszek, zarządzanie (edycja/usuwanie) oraz monitorowanie statystyk.  
c. Kryteria sukcesu mierzone poprzez analizę zapisów w bazie danych.  
d. System nie przewiduje zaawansowanych wymagań dotyczących bezpieczeństwa danych, skalowalności ani integracji z innymi systemami.
</prd_planning_summary>

<unresolved_issues>
1. Brak szczegółowych wymagań dotyczących interfejsu użytkownika poza intuicyjnością i wysokim UX (np. brak specyfikacji co do stylu graficznego).  
</unresolved_issues>
</project_details>

Wykonaj następujące kroki, aby stworzyć kompleksowy i dobrze zorganizowany dokument:

1. Podziel PRD na następujące sekcje:
   a. Przegląd projektu
   b. Problem użytkownika
   c. Wymagania funkcjonalne
   d. Granice projektu
   e. Historie użytkownika
   f. Metryki sukcesu

2. W każdej sekcji należy podać szczegółowe i istotne informacje w oparciu o opis projektu i odpowiedzi na pytania wyjaśniające. Upewnij się, że:
   - Używasz jasnego i zwięzłego języka
   - W razie potrzeby podajesz konkretne szczegóły i dane
   - Zachowujesz spójność w całym dokumencie
   - Odnosisz się do wszystkich punktów wymienionych w każdej sekcji

3. Podczas tworzenia historyjek użytkownika i kryteriów akceptacji
   - Wymień WSZYSTKIE niezbędne historyjki użytkownika, w tym scenariusze podstawowe, alternatywne i skrajne.
   - Przypisz unikalny identyfikator wymagań (np. US-001) do każdej historyjki użytkownika w celu bezpośredniej identyfikowalności.
   - Uwzględnij co najmniej jedną historię użytkownika specjalnie dla bezpiecznego dostępu lub uwierzytelniania, jeśli aplikacja wymaga identyfikacji użytkownika lub ograniczeń dostępu.
   - Upewnij się, że żadna potencjalna interakcja użytkownika nie została pominięta.
   - Upewnij się, że każda historia użytkownika jest testowalna.

Użyj następującej struktury dla każdej historii użytkownika:
- ID
- Tytuł
- Opis
- Kryteria akceptacji

4. Po ukończeniu PRD przejrzyj go pod kątem tej listy kontrolnej:
   - Czy każdą historię użytkownika można przetestować?
   - Czy kryteria akceptacji są jasne i konkretne?
   - Czy mamy wystarczająco dużo historyjek użytkownika, aby zbudować w pełni funkcjonalną aplikację?
   - Czy uwzględniliśmy wymagania dotyczące uwierzytelniania i autoryzacji (jeśli dotyczy)?

5. Formatowanie PRD:
   - Zachowaj spójne formatowanie i numerację.
   - Nie używaj pogrubionego formatowania w markdown ( ** ).
   - Wymień WSZYSTKIE historyjki użytkownika.
   - Sformatuj PRD w poprawnym markdown.

Przygotuj PRD z następującą strukturą:

```markdown
# Dokument wymagań produktu (PRD) - {{app-name}}
## 1. Przegląd produktu
## 2. Problem użytkownika
## 3. Wymagania funkcjonalne
## 4. Granice produktu
## 5. Historyjki użytkowników
## 6. Metryki sukcesu
```

Pamiętaj, aby wypełnić każdą sekcję szczegółowymi, istotnymi informacjami w oparciu o opis projektu i nasze pytania wyjaśniające. Upewnij się, że PRD jest wyczerpujący, jasny i zawiera wszystkie istotne informacje potrzebne do dalszej pracy nad produktem.

Ostateczny wynik powinien składać się wyłącznie z PRD zgodnego ze wskazanym formatem w markdown, który zapiszesz w pliku .ai/prd.md