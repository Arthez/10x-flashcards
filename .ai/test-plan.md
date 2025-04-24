# Plan Testów dla Aplikacji 10x-Flashcards

## 1. Wprowadzenie i cele testowania

### 1.1 Cel dokumentu
Niniejszy dokument przedstawia kompleksowy plan testów dla aplikacji 10x-Flashcards. Plan ten definiuje strategie, zasoby, harmonogram i metodologie niezbędne do skutecznego testowania aplikacji.

### 1.2 Opis aplikacji
10x-Flashcards to aplikacja webowa umożliwiająca użytkownikom tworzenie i korzystanie z fiszek wspomaganych przez sztuczną inteligencję. Głównym celem projektu jest przyspieszenie procesu tworzenia fiszek, co ma ułatwić korzystanie z techniki powtórek odstępowych (spaced repetition).

### 1.3 Cele testowania
- Weryfikacja zgodności aplikacji z wymaganiami funkcjonalnymi
- Zapewnienie wysokiej jakości użytkowej interfejsu
- Testowanie integracji z zewnętrznymi API (OpenRouter.ai)
- Weryfikacja bezpieczeństwa danych użytkowników
- Zapewnienie wydajności aplikacji przy różnym obciążeniu
- Weryfikacja poprawności działania aplikacji na różnych urządzeniach i przeglądarkach

## 2. Zakres testów

### 2.1 Funkcjonalności objęte testami
- Rejestracja i logowanie użytkownika (Supabase Auth)
- Ręczne tworzenie fiszek
- Generowanie fiszek przez AI
- Edycja wygenerowanych fiszek
- Przeglądanie fiszek
- Nauka z wykorzystaniem fiszek
- Statystyki użytkowania

### 2.2 Komponenty podlegające testowaniu
- Frontend (Astro, React)
- Backend (API Endpoints, Astro SSR)
- Integracja z bazą danych (Supabase)
- Integracja z AI (OpenRouter.ai)

### 2.3 Elementy wyłączone z testów
- Infrastruktura hostingowa (DigitalOcean)
- Wewnętrzne mechanizmy działania Supabase
- Wewnętrzne mechanizmy OpenRouter.ai

## 3. Typy testów

### 3.1 Testy jednostkowe
- **Zakres**: Testowanie poszczególnych komponentów i funkcji aplikacji w izolacji
- **Narzędzia**: Vitest, React Testing Library
- **Priorytety**:
  - Logika biznesowa (serwisy w lib/services)
  - Walidacja danych (schemas)
  - Obsługa błędów (errors)

### 3.2 Testy integracyjne
- **Zakres**: Testowanie integracji między komponentami i modułami
- **Narzędzia**: Vitest, Supertest
- **Priorytety**:
  - Integracja frontendu z backendem
  - Integracja z bazą danych Supabase
  - Integracja z OpenRouter.ai

### 3.3 Testy E2E (End-to-End)
- **Zakres**: Testowanie pełnych ścieżek użytkownika
- **Narzędzia**: Playwright
- **Priorytety**:
  - Przepływ rejestracji i logowania
  - Proces generowania fiszek przez AI
  - Proces nauki z wykorzystaniem fiszek
  - Nawigacja w aplikacji

### 3.4 Testy wydajnościowe
- **Zakres**: Testowanie wydajności aplikacji pod obciążeniem
- **Narzędzia**: k6, Lighthouse
- **Priorytety**:
  - Czas ładowania strony
  - Wydajność generowania fiszek
  - Zachowanie przy dużej liczbie fiszek

### 3.5 Testy bezpieczeństwa
- **Zakres**: Testowanie zabezpieczeń aplikacji
- **Narzędzia**: OWASP ZAP, ręczne testy penetracyjne
- **Priorytety**:
  - Zabezpieczenia API
  - Mechanizmy autentykacji
  - Podatności XSS, CSRF, SQL Injection

### 3.6 Testy dostępności
- **Zakres**: Testowanie zgodności z WCAG 2.1
- **Narzędzia**: Axe, Lighthouse
- **Priorytety**:
  - Dostępność dla czytników ekranowych
  - Kontrast i czytelność
  - Nawigacja klawiaturowa

### 3.7 Testy użyteczności
- **Zakres**: Testowanie interfejsu użytkownika
- **Metodologia**: Scenariuszowe testy z udziałem użytkowników
- **Priorytety**:
  - Intuicyjność interfejsu
  - Responsywność na różnych urządzeniach
  - Satysfakcja użytkownika

## 4. Scenariusze testowe dla kluczowych funkcjonalności

### 4.1 Rejestracja i logowanie
1. Rejestracja nowego użytkownika
2. Logowanie istniejącego użytkownika
3. Odzyskiwanie hasła
4. Walidacja danych wejściowych formularzy
5. Sesje i wylogowywanie

### 4.2 Ręczne tworzenie fiszek
1. Tworzenie poprawnej fiszki z przednią i tylną stroną
2. Walidacja wprowadzanych danych (długość, format)
3. Edycja istniejących fiszek
4. Usuwanie fiszek
5. Obsługa błędów przy zapisie

### 4.3 Generowanie fiszek przez AI
1. Generowanie fiszek z krótkiego tekstu
2. Generowanie fiszek z długiego tekstu
3. Dostosowanie liczby generowanych fiszek
4. Weryfikacja jakości wygenerowanych fiszek
5. Obsługa błędów API (OpenRouter.ai)
6. Limit czasowy i timeout przy generowaniu
7. Akceptacja wygenerowanych fiszek
8. Edycja wygenerowanych fiszek przed zapisem

### 4.4 Przeglądanie fiszek
1. Wyświetlanie listy wszystkich fiszek
2. Filtrowanie i sortowanie fiszek
3. Wyszukiwanie fiszek
4. Nawigacja między stronami wyników
5. Renderowanie różnych typów zawartości fiszek

### 4.5 Nauka z wykorzystaniem fiszek
1. Rozpoczęcie sesji nauki
2. Przełączanie między przednią a tylną stroną fiszki
3. Ocena wiedzy i algorytm powtórek
4. Statystyki sesji nauki
5. Zakończenie sesji nauki

### 4.6 Statystyki użytkowania
1. Wyświetlanie prawidłowych statystyk
2. Aktualizacja statystyk po działaniach użytkownika
3. Wizualizacja danych statystycznych
4. Filtrowanie statystyk według przedziałów czasowych

## 5. Środowisko testowe

### 5.1 Środowiska testowe
- **Lokalne**: Środowisko deweloperskie, testy jednostkowe i podstawowe testy integracyjne
- **Testowe**: Dedykowane środowisko z własną instancją Supabase
- **Staging**: Przedprodukcyjne środowisko z konfiguracją zbliżoną do produkcyjnej
- **Produkcyjne**: Monitoring i testy produkcyjne (niepowodujące zmian w danych)

### 5.2 Wymagania sprzętowe i programowe
- **Przeglądarki**: Chrome, Firefox, Safari, Edge (najnowsze wersje)
- **Urządzenia mobilne**: iOS 14+, Android 10+
- **Rozdzielczości ekranu**: Mobile, Tablet, Desktop
- **Serwer testowy**: Node.js 18+, Docker

### 5.3 Zarządzanie danymi testowymi
- Zestawy danych testowych dla różnych scenariuszy
- Mechanizm resetowania danych testowych
- Mockowanie odpowiedzi API dla OpenRouter.ai

## 6. Narzędzia do testowania

### 6.1 Narzędzia automatyzacji testów
- **Testy jednostkowe**: Vitest, React Testing Library
- **Testy E2E**: Playwright
- **Testy API**: Supertest, Postman
- **Testy wydajnościowe**: k6, Lighthouse

### 6.2 Narzędzia CI/CD
- GitHub Actions do automatycznego uruchamiania testów
- Raporty pokrycia kodu (code coverage)
- Automatyczna walidacja PR przed mergem

### 6.3 Narzędzia monitorowania
- Sentry do śledzenia błędów frontendowych
- New Relic lub Datadog do monitorowania wydajności
- Supabase Analytics do monitorowania bazy danych

## 7. Harmonogram testów

### 7.1 Fazy testowania
1. **Planowanie testów**: Opracowanie szczegółowych przypadków testowych
2. **Przygotowanie środowiska**: Konfiguracja środowisk testowych
3. **Implementacja testów**: Tworzenie skryptów automatycznych
4. **Wykonanie testów**: Przeprowadzenie testów zgodnie z planem
5. **Raportowanie**: Analiza wyników i raportowanie błędów
6. **Retesty**: Weryfikacja poprawionych błędów

### 7.2 Kryteria wejścia i wyjścia
- **Kryteria wejścia**: 
  - Zakończona implementacja funkcjonalności
  - Podstawowe testy deweloperskie zakończone pomyślnie
  - Środowisko testowe gotowe
  
- **Kryteria wyjścia**:
  - Wszystkie testy priorytetowe wykonane
  - Brak krytycznych i wysokopriorytetowych błędów
  - Pokrycie kodu testami na zadowalającym poziomie (min. 80%)

### 7.3 Kamienie milowe
- Ukończenie testów jednostkowych (T+2 tygodnie)
- Ukończenie testów integracyjnych (T+3 tygodnie)
- Ukończenie testów E2E (T+4 tygodnie)
- Ukończenie testów wydajnościowych i bezpieczeństwa (T+5 tygodni)
- Finalna runda testów regresyjnych (T+6 tygodni)

## 8. Kryteria akceptacji testów

### 8.1 Kryteria funkcjonalne
- Wszystkie przypadki testowe wysokiego priorytetu zakończone pomyślnie
- Brak błędów krytycznych i wysokiego priorytetu
- Funkcjonalności działają zgodnie ze specyfikacją

### 8.2 Kryteria wydajnościowe
- Czas ładowania strony głównej < 2s
- Czas generowania zestawu fiszek < 10s
- Aplikacja obsługuje min. 100 równoczesnych użytkowników
- Lighthouse Performance Score > 85

### 8.3 Kryteria bezpieczeństwa
- Brak wykrytych podatności wysokiego i średniego ryzyka
- Dane użytkowników są odpowiednio zabezpieczone
- Mechanizmy autentykacji działają poprawnie

### 8.4 Kryteria UX
- Zgodność z wytycznymi dostępności WCAG 2.1 (poziom AA)
- Interfejs działa poprawnie na wszystkich wspieranych przeglądarkach
- Responsywność na urządzeniach mobilnych i desktopowych

## 9. Role i odpowiedzialności w procesie testowania

### 9.1 Zespół testujący
- **Kierownik testów**: Koordynacja procesu testowania, raportowanie postępów
- **Testerzy funkcjonalni**: Wykonywanie testów manualnych i przygotowywanie scenariuszy
- **Testerzy automatyzujący**: Tworzenie i utrzymanie testów automatycznych
- **Tester bezpieczeństwa**: Przeprowadzanie testów bezpieczeństwa
- **Tester wydajnościowy**: Wykonywanie testów wydajnościowych

### 9.2 Interesariusze
- **Zespół deweloperski**: Implementacja i naprawianie błędów
- **Product Owner**: Weryfikacja zgodności z wymaganiami biznesowymi
- **UX Designer**: Ocena interfejsu użytkownika
- **Użytkownicy końcowi**: Testowanie beta

## 10. Procedury raportowania błędów

### 10.1 Priorytetyzacja błędów
- **Krytyczny**: Błąd powodujący niedostępność kluczowych funkcji aplikacji
- **Wysoki**: Błąd znacząco utrudniający korzystanie z aplikacji
- **Średni**: Błąd wpływający na doświadczenie użytkownika, ale z możliwością obejścia
- **Niski**: Drobne błędy kosmetyczne lub niewielkie niedogodności

### 10.2 Cykl życia błędu
1. Zgłoszenie błędu (GitHub Issues)
2. Triage i priorytetyzacja
3. Przypisanie do dewelopera
4. Naprawa błędu
5. Weryfikacja naprawy
6. Zamknięcie zgłoszenia

### 10.3 Szablon zgłoszenia błędu
- **Tytuł**: Krótki, opisowy
- **Priorytet/Waga**: Krytyczny/Wysoki/Średni/Niski
- **Środowisko**: Gdzie występuje błąd
- **Kroki reprodukcji**: Dokładny opis jak odtworzyć błąd
- **Aktualny rezultat**: Co się dzieje
- **Oczekiwany rezultat**: Co powinno się dziać
- **Zrzuty ekranu/Nagrania**: Jeśli dostępne
- **Dodatkowe informacje**: Logi, dane konsoli, itp.

## 11. Zarządzanie ryzykiem

### 11.1 Zidentyfikowane ryzyka
1. Ograniczona dostępność API OpenRouter.ai - wpływ na testy generacji AI
2. Zmiany w API Supabase - wpływ na testy integracyjne
3. Ograniczone zasoby testowe - wpływ na zakres testów
4. Zmieniające się wymagania - wpływ na scenariusze testowe

### 11.2 Strategie mitygacji ryzyka
1. Przygotowanie mockowanych odpowiedzi API
2. Regularne śledzenie zmian w dokumentacji partnerów
3. Priorytetyzacja testów według krytyczności
4. Agile'owe podejście do testowania

## 12. Wymagania dotyczące dokumentacji testowej

### 12.1 Dokumenty wymagane
- Plan testów (niniejszy dokument)
- Scenariusze testowe
- Raporty z wykonania testów
- Raporty z błędów
- Raport końcowy z testów

### 12.2 Zarządzanie dokumentacją
- Przechowywanie w repozytorium GitHub
- Wersjonowanie dokumentacji testowej
- Aktualizacja zgodnie ze zmianami w aplikacji

## 13. Zatwierdzenie planu testów

Plan testów został przygotowany przez zespół QA i wymaga zatwierdzenia przez kluczowych interesariuszy projektu przed rozpoczęciem fazy testów.
