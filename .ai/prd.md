# Dokument wymagań produktu (PRD) - Fiszki AI

## 1. Przegląd produktu
- Aplikacja webowa umożliwiająca tworzenie fiszek edukacyjnych zarówno ręcznie, jak i za pomocą AI.
- Użytkownicy mogą tworzyć konto przy użyciu modelu email/hasło, co pozwala na dostęp do ich własnych fiszek.
- Produkt integruje fiszki z gotowym algorytmem powtórek, ułatwiając proces nauki metodą spaced repetition.

## 2. Problem użytkownika
- Manualne tworzenie wysokiejściowych fiszek jest czasochłonne, co zniechęca użytkowników do korzystania z efektywnej metody nauki spaced repetition.

## 3. Wymagania funkcjonalne
- Generowanie fiszek przez AI: Użytkownik wprowadza tekst, na podstawie którego AI generuje propozycje fiszek (przodu i tyłu fiszki).
- Akceptacja lub odrzucenie fiszek generowanych przez AI: Użytkownik decyduje, czy propozycja fiszki zostanie zaakceptowana (zapisana) czy odrzucona. Zaakceptowane fiszki mogą być zapisane bez edycji (AI_full) lub po edycji (AI_edited).
- Ręczne tworzenie fiszek: Użytkownik ma możliwość tworzenia fiszek przez wpisanie treści (przodu i tyłu fiszki).
- Rejestracja, logowanie i resetowanie hasła: Użytkownik zakłada konto (email/hasło) oraz loguje się do systemu, ma też możliwość zresetowania hasła.
- Przeglądanie fiszek: Użytkownik przegląda swoje fiszki z możliwością filtrowania według metody dodania (AI_full, AI_edited, manual) oraz sortowania po dacie.
- Edycja i usuwanie fiszek: Użytkownik edytuje lub usuwa swoje fiszki (z widoku przeglądania fiszek), przy czym każda z tych operacji wymaga potwierdzenia.
- Rejestracja generacji: System zapisuje sesje generacji fiszek przez AI, rejestrując liczbę wygenerowanych fiszek, liczbę zaakceptowanych fiszek bez edycji (AI_full), liczbę zaakceptowanych fiszek po edycji (AI_edited), czas generacji oraz wykorzystany model AI.
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

### US-001: Rejestracja, logowanie i resetowanie hasła
- Tytuł: Rejestracja i logowanie użytkownika oraz resetowanie hasła
- Opis: Użytkownik tworzy konto za pomocą email/hasło i loguje się do systemu. Użytkownik ma możliwość zresetowania hasła za pomocą wysłania linka na maila.
- Kryteria akceptacji:
   - Użytkownik jest w stanie zarejestrować konto, podając unikalny email oraz hasło.
   - Użytkownik może zalogować się i wylogować.
   - Użytkownik może zresetować hasło przed zalogowaniem
   - Do rejestracji będzie dedykowany widok z formularzem rejestracji, gdzie użytkownik będzie mógł podać email, hasło i powtórzyć hasło
   - Do logowania będzie dedykowany widok z formularzem logowania, gdzie użytkownik będzie mógł podać email i hasło
   - Do resetowania hasła będą dedykowane widoki z formularzem resetowania hasła, na pierwszym widoku użytkownik będzie mógł podać email (jeśli istnieje w bazie dostanie linka do drugiego widoku), na drugim widoku użytkownik będzie mógł podać nowe hasło i je powtórzyć aby dokonać zmiany hasła
   - Do wylogowania będzie przycisk w pasku górnym po prawej stronie od nawigacji z labelką "Logout" (tylko gdy jest zalogowany)
   - Pole na email musi posiadać walidację zawierania znaku "@" oraz "." 
   - Pole na hasło musi posiadać walidację na minimum 4 znaki, te 4 znaki muszą się składać z liter oraz cyfr
   - Przed zalogowaniem, użytkownik będzie miał tylko dostęp do widoku "Login", "Register", "Reset password"
   - Po zalogowaniu użytkownik będzie miał tylko dostęp do widoku "Learn", "Browse", "Add", "Generate"

### US-002: Tworzenie fiszki manualnie
- Tytuł: Manualne tworzenie fiszki
- Opis: Użytkownik wprowadza treść fiszki ręcznie, która zostaje zapisana w systemie.
- Kryteria akceptacji:
   - Użytkownik może wpisać treść fiszki dla przodu i tyłu fiszki.
   - Tekst tyłu i przodu fiszki ma mieć minimum 2 znaki, do 200 znaków, aby zapisać fiszkę (walidacja z wiadomością błędu).
   - Fiszka jest zapisywana w bazie danych z odpowiednim timestampem dla zalogowanego użytkownika.
   - System potwierdza zapis fiszki oraz czyści pola do ponownego dodania fiszki manualnej.
   - Manualne dodawanie odbywa się na dedykowanym widoku do manualnego dodawania fiszek, na który można wejść z nawigacji paska górnego z labelką "Add".

### US-003: Generowanie fiszek przez AI
- Tytuł: Generowanie fiszek za pomocą AI
- Opis: Użytkownik wkleja tekst, na podstawie którego AI generuje propozycje fiszek.
- Kryteria akceptacji:
   - Po wprowadzeniu tekstu, który musi posiadać co najmniej 1000 znaków i nie może przekroczyć 10000 znaków, system generuje propozycje przodu i tyłu pięciu fiszek poprzez AI.
   - System zapisuje rekord generacji w tabeli generations z całkowitą liczbą wygenerowanych fiszek, czasem generacji w milisekundach oraz nazwą wykorzystanego modelu AI.
   - Użytkownik widzi propozycje fiszek wygenerowanych przez AI, jako kafelki z propozycjami tyłu i przodu fiszki, znajdujące się pod polem na wpisywanie tekstu do wygenerowania fiszek.
   - Tekst tyłu i przodu fiszki ma mieć minimum 2 znaki, do 200 znaków.
   - Tekst tyłu i przodu fiszki jest w trybie edytowalnym (użytkownik może zedytować przed zaakceptowaniem)
   - Propozycje są przedstawione z możliwością akceptacji (naciskając przycisk "Accept" na kafelku fiszki) lub odrzucenia (naciskając przycisk "Reject" na fiszce).
   - Po akceptacji przez użytkownika wygenerowanej fiszki, fiszka jest zapisywana w bazie danych z odpowiednim timestampem dla zalogowanego użytkownika.
   - Jeśli użytkownik zaakceptuje fiszkę bez edycji, jest ona zapisywana z typem creation_method "AI_full", a licznik accepted_full w rekordzie generacji jest zwiększany.
   - Jeśli użytkownik edytuje fiszkę przed zaakceptowaniem, jest ona zapisywana z typem creation_method "AI_edited", a licznik accepted_edited w rekordzie generacji jest zwiększany.
   - System potwierdza zapis fiszki.
   - W przypadku odrzucenia, system usuwa wygenerowaną fiszkę z listy wygenerowanych fiszek na UI.
   - Generowanie fiszek za pomocą AI odbywa się na dedykowanym widoku do generowania fiszek, na który można wejść z nawigacji paska górnego z labelką "Generate".

### US-004: Przeglądanie, edycja i usuwanie fiszek
- Tytuł: Zarządzanie fiszkami
- Opis: Użytkownik przegląda swoje fiszki, filtrując je według metody dodania oraz sortując po dacie, a następnie dokonuje edycji lub usunięcia pojedynczych fiszek.
- Kryteria akceptacji:
   - Użytkownik widzi listę własnych fiszek jako kafelki z treścią przodu i tyłu fiszki w trybie tylko do odczytu.
   - Istnieje możliwość filtrowania fiszek według sposobu dodania - filtrowanie frontendowe (dostępne opcje filtrowania: wszystkie, AI_full, AI_edited, manual; default: wszystkie).
   - Fiszki można sortować po dacie (timestamp), od najstarszych lub od najnowszych (toggle) - sortowanie frontendowe (default: od najnowszych).
   - Operacja usunięcią odbywa się za pomocą przycisku na kafelku fiszki z labelką "Remove".
   - Operacja edycji odbywa się za pomocą przycisku na kafelku fiszki z labelką "Edit", wtedy treści stają się edytowalne (wyłącza się tryb tylko do odczytu), a przycisk "Edit" znika pojawia się przycisk "Save", który zapisuje treść fiszki w bazie danych.
   - Operacje edycji i usuwania wymagają potwierdzenia przed wykonaniem za pomocą modalu potwierdzającego.
   - Operacje są wykonywane pojedynczo.
   - Przeglądanie fiszek za pomocą AI odbywa się na dedykowanym widoku do przeglądania fiszek, na który można wejść z nawigacji paska górnego z labelką "Browse".

### US-005: Dostęp do statystyk użytkownika
- Tytuł: Statystyki użytkownika
- Opis: Użytkownik ma dostęp do swoich statystyk dotyczących liczby fiszek: manualnie dodanych, zaakceptowanych bez edycji (AI_full), zaakceptowanych po edycji (AI_edited) oraz niezaakceptowanych (wygenerowanych przez AI).
- Kryteria akceptacji:
   - System wyświetla statystyki zalogowanego użytkownika na podstawie zapisanych danych o ilości wygenerowanych fiszek przez AI, ilości zaakceptowanych fiszek bez edycji, ilości zaakceptowanych fiszek po edycji oraz zapisanych manualnie fiszek.
   - System oblicza ilość odrzuconych fiszek jako różnicę między całkowitą liczbą wygenerowanych fiszek a sumą zaakceptowanych fiszek (zarówno AI_full, jak i AI_edited).
   - Statystyki są dostępne na widoku przeglądania fiszek jako licznik ilości zapisanych manualnie fiszek, ilości zaakceptowanych fiszek bez edycji, ilości zaakceptowanych fiszek po edycji, ilości odrzuconych fiszek, każdy licznik ma procentowy odpowiednik w nawiasie (obok wartości).

### US-006: Sesja uczenia się na podstawie własnych fiszek
- Tytuł: Użytkownik uczy się przy pomocy własnych fiszek
- Opis: Zalogowany użytkownik ma możliwość wylosowania własnej fiszki za pomocą gotowego algorytmu (spaced repetition), oraz odwrócenia fiszki.
- Kryteria akceptacji:
   - Widok posiada przycisk "Draw flashcard", wciśniecie tego przycisku powoduje wylosowanie fiszki i wyświetlenie fiszki pokazując jej tekst z przodu fiszki.
   - Gdy fiszka jest wyświetlona, przycisk "Flip card" jest dostępny, który zmienia treść przodu fiszki na tył lub tył na przód (toggle).
   - Uczenie się za pomocą fiszek odbywa się na dedykowanym widoku do nauki fiszek, na który można wejść z nawigacji paska górnego z labelką "Learn".


## 6. Metryki sukcesu
- 75% fiszek generowanych przez AI musi być zaakceptowanych przez użytkowników.
- Użytkownicy muszą tworzyć 75% swoich fiszek za pomocą funkcji generowania AI. 
