# Dokument wymagań produktu (PRD) - Fiszki AI

## 1. Przegląd produktu
- Aplikacja webowa umożliwiająca tworzenie fiszek edukacyjnych zarówno ręcznie, jak i za pomocą AI.
- Użytkownicy mogą tworzyć konto przy użyciu modelu email/hasło, co pozwala na dostęp do ich własnych fiszek.
- Produkt integruje fiszki z gotowym algorytmem powtórek, ułatwiając proces nauki metodą spaced repetition.

## 2. Problem użytkownika
- Manualne tworzenie wysokiejściowych fiszek jest czasochłonne, co zniechęca użytkowników do korzystania z efektywnej metody nauki spaced repetition.

## 3. Wymagania funkcjonalne
- Generowanie fiszek przez AI: Użytkownik wprowadza tekst, na podstawie którego AI generuje propozycje fiszek (przodu i tyłu fiszki).
- Akceptacja lub odrzucenie fiszek generowanych przez AI: Użytkownik decyduje, czy propozycja fiszki zostanie zapisana czy odrzucona.
- Ręczne tworzenie fiszek: Użytkownik ma możliwość tworzenia fiszek przez wpisanie treści (przodu i tyłu fiszki).
- Rejestracja i logowanie: Użytkownik zakłada konto (email/hasło) oraz loguje się do systemu.
- Przeglądanie fiszek: Użytkownik przegląda swoje fiszki z możliwością filtrowania według metody dodania (AI vs manual) oraz sortowania po dacie.
- Edycja i usuwanie fiszek: Użytkownik edytuje lub usuwa swoje fiszki (z widoku przeglądania fiszek), przy czym każda z tych operacji wymaga potwierdzenia.
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
   - Do rejestracji będzie dedykowany widok z formularzem rejestracji, gdzie użytkownik będzie mógł podać email, hasło i powtórzyć hasło
   - Do logowania będzie dedykowany widok z formularzem logowania, gdzie użytkownik będzie mógł podać email i hasło
   - Do wylogowania będzie przycisk w pasku górnym po prawej stronie od nawigacji z labelką "Logout"
   - Pole na email musi posiadać walidację zawierania znaku "@" oraz "." 
   - Pole na hasło musi posiadać walidację na minimum 4 znaki, te 4 znaki muszą się składać z liter oraz cyfr

### US-002: Tworzenie fiszki manualnie
- Tytuł: Manualne tworzenie fiszki
- Opis: Użytkownik wprowadza treść fiszki ręcznie, która zostaje zapisana w systemie.
- Kryteria akceptacji:
   - Użytkownik może wpisać treść fiszki dla przodu i tyłu fiszki.
   - Treść każdego pola nie może być pusta, aby zapisać fiszkę (walidacja z wiadomością błędu).
   - Fiszka jest zapisywana w bazie danych z odpowiednim timestampem dla zalogowanego użytkownika.
   - System potwierdza zapis fiszki oraz czyści pola do ponownego dodania fiszki manualnej.
   - Manualne dodawanie odbywa się na dedykowanym widoku do manualnego dodawania fiszek, na który można wejść z nawigacji paska górnego z labelką "Add".

### US-003: Generowanie fiszek przez AI
- Tytuł: Generowanie fiszek za pomocą AI
- Opis: Użytkownik wkleja tekst, na podstawie którego AI generuje propozycje fiszek.
- Kryteria akceptacji:
   - Po wprowadzeniu tekstu, który musi posiadać co najmniej 1000 znaków i nie może przekroczyć 10000 znaków, system generuje propozycje przodu i tyłu pięciu fiszek poprzez AI.
   - Użytkownik widzi propozycje fiszek wygenerowanych przez AI, jako kafelki z propozycjami tyłu i przodu fiszki, znajdujące się pod polem na wpisywanie tekstu do wygenerowania fiszek.
   - Propozycje są przedstawione z możliwością akceptacji (naciskając przycisk "Accept" na kafelku fiszki) lub odrzucenia (naciskając przycisk "Reject" na fiszce).
   - Po akceptacji przez użytkownika wygenerowanej fiszki, fiszka jest zapisywana w bazie danych z odpowiednim timestampem dla zalogowanego użytkownika.
   - System potwierdza zapis fiszki.
   - W przypadku odrzucenia lub akceptacji, system zapisuje ten fakt z timestampem.
   - Generowanie fiszek za pomocą AI odbywa się na dedykowanym widoku do manualnego dodawania fiszek, na który można wejść z nawigacji paska górnego z labelką "Generate".

### US-004: Przeglądanie, edycja i usuwanie fiszek
- Tytuł: Zarządzanie fiszkami
- Opis: Użytkownik przegląda swoje fiszki, filtrując je według metody dodania (AI vs manual) oraz sortując po dacie, a następnie dokonuje edycji lub usunięcia pojedynczych fiszek.
- Kryteria akceptacji:
   - Użytkownik widzi listę własnych fiszek jako kafelki z treścią przodu i tyłu fiszki w trybie tylko do odczytu.
   - Istnieje możliwość filtrowania fiszek według sposobu dodania - filtrowanie frontendowe.
   - Fiszki można sortować po dacie (timestamp), od najstarszych lub od najnowszych (toggle) - sortowanie frontendowe.
   - Operacja usunięcią odbywa się za pomocą przycisku na kafelku fiszki z labelką "Remove".
   - Operacja edycji odbywa się za pomocą przycisku na kafelku fiszki z labelką "Edit", wtedy treści stają się edytowalne (wyłącza się tryb tylko do odczytu), a przycisk "Edit" znika pojawia się przycisk "Save", który zapisuje treść fiszki w bazie danych.
   - Operacje edycji i usuwania wymagają potwierdzenia przed wykonaniem za pomocą modalu potwierdzającego.
   - Operacje są wykonywane pojedynczo.
   - Przeglądanie fiszek za pomocą AI odbywa się na dedykowanym widoku do przeglądania fiszek, na który można wejść z nawigacji paska górnego z labelką "Browse".

### US-005: Dostęp do statystyk użytkownika
- Tytuł: Statystyki użytkownika
- Opis: Użytkownik ma dostęp do swoich statystyk dotyczących liczby fiszek: manualnie dodanych, zaakceptowanych oraz odrzuconych (wszystkich wygenerowanych przez AI).
- Kryteria akceptacji:
   - System wyświetla statystyki zalogowanego użytkownika na podstawie zapisanych rekordów odrzucenia i akceptacji wygenerowanych przez AI fiszek oraz zapisanych manualnie fiszek.
   - Statystyki są dostępne na widoku przeglądania fiszek jako licznik ilości zapisanych manualnie fiszek, akceptacji wygenerowanych fiszek, odrzuceń wygenerowanych fiszek oraz ich procentowy odpowiednik w nawiasie przy ilości.

### US-006: Sesja uczenia się na podstawie własnych fiszek
- Tytuł: Użytkownik uczy się przy pomocy własnych fiszek
- Opis: Zalogowany użytkownik ma możliwość wylosowania własnej fiszki za pomocą gotowego algorytmu (spaced repetition), oraz odwrócenia fiszki.
- Kryteria akceptacji:
   - Widok possada przycisk "Draw flashcard", wciśniecie tego przycisku powoduje wylosowanie fiszki i wyświetlenie fiszki pokazując jej tekst z przodu fiszki.
   - Gdy fiszka jest wyświetlona, przycisk "Flip card" jest dostępny, który zmienia treść przodu fiszki na tył lub tył na przód (toggle).
   - Uczenie się za pomocą fiszek odbywa się na dedykowanym widoku do nauki fiszek, na który można wejść z nawigacji paska górnego z labelką "Learn".


## 6. Metryki sukcesu
- 75% fiszek generowanych przez AI musi być zaakceptowanych przez użytkowników.
- Użytkownicy muszą tworzyć 75% swoich fiszek za pomocą funkcji generowania AI. 
