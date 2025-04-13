
## 1. Przegląd produktu
- Aplikacja webowa umożliwiająca tworzenie fiszek edukacyjnych zarówno ręcznie, jak i za pomocą AI.
- Użytkownicy mogą tworzyć konto przy użyciu modelu email/hasło, co pozwala na dostęp do ich własnych fiszek.
- Produkt integruje fiszki z gotowym algorytmem powtórek, ułatwiając proces nauki metodą spaced repetition.

## 2. Problem użytkownika
- Manualne tworzenie wysokiejściowych fiszek jest czasochłonne, co zniechęca użytkowników do korzystania z efektywnej metody nauki spaced repetition.

## 3. Wymagania funkcjonalne
- Generowanie fiszek przez AI: Użytkownik wprowadza tekst, na podstawie którego AI generuje propozycje fiszek.
- Akceptacja lub odrzucenie fiszek generowanych przez AI: Użytkownik decyduje, czy propozycja fiszki zostanie zapisana.
- Ręczne tworzenie fiszek: Użytkownik ma możliwość tworzenia fiszek przez wpisanie treści.
- Rejestracja i logowanie: Użytkownik zakłada konto (email/hasło) oraz loguje się do systemu.
- Przeglądanie fiszek: Użytkownik przegląda swoje fiszki z możliwością filtrowania według metody dodania (AI vs manual) oraz sortowania po dacie.
- Edycja i usuwanie fiszek: Użytkownik edytuje lub usuwa swoje fiszki, przy czym każda z tych operacji wymaga potwierdzenia.
- Rejestracja działań: System zapisuje każdą akcję użytkownika (dodanie manualne, akceptacja lub odrzucenie fiszki generowanej przez AI) z timestampem.
- Integracja z algorytmem powtórek: Fiszki są automatycznie integrowane z algorytmem powtórek.

## 4. Granice produktu
- Nie obejmuje zaawansowanego algorytmu powtórek (takiego jak SuperMemo lub Anki).
- Brak importu wielu formatów (np. PDF, DOCX).
- Brak możliwości współdzielenia fiszek między użytkownikami.
- Brak integracji z innymi platformami edukacyjnymi i social media.
- Produkt dostępny jest jedynie jako aplikacja webowa – nie ma wsparcia dla aplikacji mobilnych.
- Aspekty marketingowe nie są uwzględnione w MVP.
- Brak zaawansowanych zabezpieczeń przechowywania danych i wymagań skalowalności w MVP.

## 5. Historyjki użytkowników

### US-001: Rejestracja i logowanie
- Tytuł: Rejestracja i logowanie użytkownika
- Opis: Użytkownik tworzy konto za pomocą email/hasło i loguje się do systemu.
- Kryteria akceptacji:
   - Użytkownik jest w stanie zarejestrować konto, podając unikalny email oraz hasło.
   - Użytkownik może zalogować się i wylogować.

### US-002: Tworzenie fiszki manualnie
- Tytuł: Manualne tworzenie fiszki
- Opis: Użytkownik wprowadza treść fiszki ręcznie, która zostaje zapisana w systemie.
- Kryteria akceptacji:
   - Użytkownik może wpisać treść fiszki.
   - Fiszka jest zapisywana w bazie danych z odpowiednim timestampem.
   - System potwierdza zapis fiszki.

### US-003: Generowanie fiszek przez AI
- Tytuł: Generowanie fiszek za pomocą AI
- Opis: Użytkownik wkleja tekst, na podstawie którego AI generuje propozycje fiszek.
- Kryteria akceptacji:
   - Po wprowadzeniu tekstu, system generuje propozycje fiszek poprzez AI.
   - Użytkownik widzi propozycje fiszek wygenerowanych przez AI.
   - Propozycje są przedstawione z możliwością akceptacji lub odrzucenia.

### US-004: Akceptacja/odrzucenie fiszki generowanej przez AI
- Tytuł: Akceptacja lub odrzucenie fiszki generowanej przez AI
- Opis: Użytkownik decyduje się zaakceptować lub odrzucić fiszkę wygenerowaną przez AI.
- Kryteria akceptacji:
   - System umożliwia użytkownikowi akceptację lub odrzucenie fiszki.
   - W przypadku akceptacji, fiszka zostaje zapisana z timestampem.
   - W przypadku odrzucenia, system zapisuje ten fakt z timestampem.

### US-005: Przeglądanie, edycja i usuwanie fiszek
- Tytuł: Zarządzanie fiszkami
- Opis: Użytkownik przegląda swoje fiszki, filtrując je według metody dodania (AI vs manual) oraz sortując po dacie, a następnie dokonuje edycji lub usunięcia pojedynczych fiszek.
- Kryteria akceptacji:
   - Użytkownik widzi listę własnych fiszek.
   - Istnieje możliwość filtrowania fiszek według sposobu dodania.
   - Fiszki można sortować po dacie (timestamp).
   - Operacje edycji i usuwania wymagają potwierdzenia przed wykonaniem.
   - Operacje są wykonywane pojedynczo.

### US-006: Dostęp do statystyk użytkownika
- Tytuł: Statystyki użytkownika
- Opis: Użytkownik ma dostęp do statystyk dotyczących liczby fiszek: manualnie dodanych, zaakceptowanych oraz odrzuconych (wszystkich wygenerowanych przez AI).
- Kryteria akceptacji:
   - System wyświetla statystyki na podstawie zapisanych rekordów.
   - Statystyki są aktualizowane na bieżąco.

## 6. Metryki sukcesu
- 75% fiszek generowanych przez AI musi być zaakceptowanych przez użytkowników.
- Użytkownicy muszą tworzyć 75% swoich fiszek za pomocą funkcji generowania AI.
