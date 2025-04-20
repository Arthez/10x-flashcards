# Architektura UI dla 10x-Flashcards

## 1. Przegląd struktury UI
UI składa się z pięciu głównych stron Astro z dynamicznymi komponentami React:

- `MainLayout.astro` zawierające pasek nawigacji `TopNav` oraz `ToastProvider`/`ToastContainer`.
- Globalna konfiguracja **SWR** (`src/lib/swr.ts`) z custom hookami `useFlashcards`, `useGenerations`, `useCreateFlashcard`.
- Formularze oparte o `react-hook-form` i schematy walidacji Zod.
- Zestaw komponentów **Shadcn/ui**: `Form`, `Input`, `Textarea`, `Button`, `Modal`, `Spinner`, `Toast`.
- Nawigacja w górnym pasku oraz logika przekierowania na `/login` przy otrzymaniu 401.

## 2. Lista widoków

### 2.1 Login (`/login`)
**Cel:** Uwierzytelnienie użytkownika.
**Kluczowe informacje:** Formularz z polami `email` i `password`, walidacja (Zod), komunikaty błędów.
**Komponenty:** `Form`, `Input`, `Button`, `Toast`.
**UX/Accessibility/Security:** autofocus na pierwsze pole, inline walidacja, disabled podczas submit, aria-invalid, obsługa błędnych danych (toast), pole hasła typu `password`.

### 2.2 Learn (`/learn`)
**Cel:** Sesja nauki fiszek metodą spaced repetition.
**Kluczowe informacje:** Przycisk `Draw flashcard`, aktualna fiszka (front/back), przycisk `Flip card`, informacja o zakończeniu sesji.
**Komponenty:** `Button`, `FlashcardCard` (tryb wyświetlania), lokalny stan (`useState`/`useReducer`).
**UX/Accessibility/Security:** wyłączenie przycisku `Draw` po wyczerpaniu fiszek, aria-live dla zmian treści, czytelne aria-labels.

### 2.3 Browse (`/browse`)
**Cel:** Przeglądanie, filtrowanie, sortowanie oraz zarządzanie fiszkami.
**Kluczowe informacje:**
- Statystyki użytkownika (manual_count, ai_full_count, ai_edited_count, rejected_count i procenty).
- Filtry front-endowe: wszystkie, AI_full, AI_edited, manual.
- Sortowanie po dacie: najnowsze/najstarsze.
- Lista fiszek w gridzie.
**Komponenty:** `Spinner`, `FlashcardCard` (edycja inline), `ConfirmModal`, `Toast`.
**UX/Accessibility/Security:** spinner na czas ładowania, disable buttonów podczas mutate, modal potwierdzenia operacji, aria-pressed na filtrach, komunikat "Brak fiszek" przy pustej liście.

### 2.4 Add (`/add`)
**Cel:** Ręczne tworzenie nowej fiszki.
**Kluczowe informacje:** Formularz z polami `front_content`, `back_content`, walidacja 2–200 znaków, potwierdzenie zapisu.
**Komponenty:** `Form`, `Input`, `Button`, `Toast`.
**UX/Accessibility/Security:** inline walidacja, disabled submit przy błędach, reset formularza po sukcesie, aria-invalid, obsługa błędów API.

### 2.5 Generate (`/generate`)
**Cel:** Generowanie propozycji fiszek z AI.
**Kluczowe informacje:**
- Textarea `input_text` z licznikiem znaków (1000–10000), pre-walidacja.
- Przycisk `Generate` (disabled do spełnienia warunków), loader podczas generacji.
- Lista propozycji: każda edytowalna (`front_content`, `back_content`), przyciski `Accept`/`Reject`.
**Komponenty:** `Form`, `Textarea`, `CharacterCounter`, `Button`, `FlashcardCard`, `Toast`, `Spinner`.
**UX/Accessibility/Security:** inline walidacja, disabled przycisk generacji, komunikaty o sukcesie/błędzie.

## 3. Mapa podróży użytkownika
1. Użytkownik niezalogowany → próba dostępu do dowolnego view → otrzymanie 401 → redirect do `/login`.
2. Na `/login` → wprowadzenie danych → API POST `/api/login` → sukces → redirect do `/browse`.
3. Z poziomu `TopNav` przejście do poszczególnych widoków:
   - `/generate` → generowanie fiszek AI → akceptacja/odrzucenie → toast + aktualizacja danych.
   - `/add` → dodanie manualnej fiszki → toast + reset formularza.
   - `/browse` → przegląd, filtr, sort, edycja/usuń z modalem → toast.
   - `/learn` → sesja nauki: `Draw` → `Flip` → powtarzanie do wyczerpania.
4. Wszystkie odwołania do API obsługują 401 przez przekierowanie.

## 4. Układ i struktura nawigacji
- Górny pasek `TopNav` z linkami do: **Learn**, **Browse**, **Add**, **Generate** po lewej i przyciskiem **Logout** po prawej.
- Wyróżnienie aktywnego linku.
- Kliknięcie **Logout** wywołuje `/api/logout` i redirect do `/login`.

## 5. Kluczowe komponenty
- `TopNav.tsx` – menu nawigacyjne i logika wylogowania.
- `FlashcardCard.tsx` – wyświetlanie fiszki, warianty dla trybu przeglądania i propozycji AI z inline-edytowaniem.
- `ConfirmModal.tsx` – potwierdzenie operacji edycji i usuwania.
- `Spinner.tsx` – loader dla widoków wymagających oczekiwania na dane.
- `ToastProvider.tsx` / `ToastContainer.tsx` – globalna obsługa powiadomień.
- `CharacterCounter.tsx` – licznik znaków dla pola `input_text` na stronie Generate.
- `SWRConfig` + custom hooki (`useFlashcards`, `useGenerations`, `useCreateFlashcard`) w `src/lib/swr.ts`. 
