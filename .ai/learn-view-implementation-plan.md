# Plan implementacji widoku Learn

## 1. Przegląd
Widok Learn to dedykowany interfejs do nauki metodą spaced repetition, umożliwiający użytkownikom efektywne uczenie się z wykorzystaniem flashcardsek. Głównym celem tego widoku jest umożliwienie użytkownikowi losowego wyciągania fiszek ze wszystkich dodanych wcześniej fiszek i przeglądania ich zawartości (przód/tył) w sposób wspierający proces zapamiętywania.

## 2. Routing widoku
Widok powinien być dostępny pod ścieżką `/learn` i być częścią głównej nawigacji aplikacji.

## 3. Struktura komponentów
```
LearnView (strona Astro)
└── LearnContainer (komponent React)
    ├── DrawFlashcardButton
    ├── FlashcardDisplay
    │   └── FlipCardButton
    └── SessionEndMessage
```

## 4. Szczegóły komponentów

### LearnView (strona Astro)
- Opis komponentu: Główna strona Astro, która zawiera komponent React LearnContainer.
- Główne elementy: Layout, nagłówek strony, komponent LearnContainer.
- Obsługiwane interakcje: Brak bezpośrednich interakcji - wszystkie interakcje są obsługiwane przez komponenty React.
- Typy: Brak specyficznych typów dla samego komponentu Astro.

### LearnContainer
- Opis komponentu: Główny komponent React zarządzający stanem sesji nauki i renderujący komponenty uczenia się.
- Główne elementy: DrawFlashcardButton, FlashcardDisplay, komunikat o końcu sesji, obsługa stanu sesji.
- Obsługiwane interakcje: 
  - Pobieranie fiszek z API
  - Zarządzanie stanem aktualnie wyświetlanej fiszki
  - Monitorowanie stanu sesji (czy są dostępne fiszki)
- Obsługiwana walidacja:
  - Sprawdzanie czy są dostępne fiszki do nauki
- Typy: LearnSessionState (stan sesji nauki), FlashcardDTO
- Propsy: Brak - komponent najwyższego poziomu w hierarchii komponentów React na tej stronie

### DrawFlashcardButton
- Opis komponentu: Przycisk umożliwiający wylosowanie nowej fiszki.
- Główne elementy: Komponent Button z biblioteki shadcn/ui.
- Obsługiwane interakcje: Kliknięcie przycisku wywołuje losowanie nowej fiszki.
- Obsługiwana walidacja:
  - Przycisk jest wyłączony, gdy nie ma więcej dostępnych fiszek
- Typy: Brak specyficznych typów
- Propsy:
  ```typescript
  interface DrawFlashcardButtonProps {
    onDraw: () => void;
    disabled: boolean;
  }
  ```

### FlashcardDisplay
- Opis komponentu: Komponent wyświetlający aktualnie wylosowaną fiszkę.
- Główne elementy: Karta z wyświetloną treścią, przycisk do odwracania fiszki.
- Obsługiwane interakcje: 
  - Wyświetlanie zawartości fiszki (przód/tył)
  - Obsługa kliknięcia na przycisk do odwracania fiszki
- Obsługiwana walidacja: Sprawdzanie czy fiszka istnieje przed jej wyświetleniem
- Typy: FlashcardDTO, FlashcardDisplayState
- Propsy:
  ```typescript
  interface FlashcardDisplayProps {
    flashcard: FlashcardDTO | null;
    isFlipped: boolean;
    onFlip: () => void;
  }
  ```

### FlipCardButton
- Opis komponentu: Przycisk umożliwiający odwrócenie fiszki (przełączenie między przodem a tyłem).
- Główne elementy: Komponent Button z biblioteki shadcn/ui.
- Obsługiwane interakcje: Kliknięcie przycisku odwraca fiszkę.
- Obsługiwana walidacja: Przycisk jest wyłączony, gdy nie ma wylosowanej fiszki.
- Typy: Brak specyficznych typów
- Propsy:
  ```typescript
  interface FlipCardButtonProps {
    onFlip: () => void;
    disabled: boolean;
  }
  ```

### SessionEndMessage
- Opis komponentu: Komunikat wyświetlany, gdy użytkownik przerobił wszystkie dostępne fiszki.
- Główne elementy: Tekst informujący o zakończeniu sesji.
- Obsługiwane interakcje: Brak interakcji.
- Obsługiwana walidacja: Brak walidacji.
- Typy: Brak specyficznych typów
- Propsy:
  ```typescript
  interface SessionEndMessageProps {
    isVisible: boolean;
  }
  ```

## 5. Typy

### LearnSessionState
```typescript
interface LearnSessionState {
  flashcards: FlashcardDTO[];         // wszystkie dostępne fiszki
  currentFlashcard: FlashcardDTO | null; // aktualnie wyświetlana fiszka
  isFlipped: boolean;                // czy fiszka jest odwrócona (pokazuje tył)
  availableFlashcards: FlashcardDTO[]; // fiszki, które nie zostały jeszcze wylosowane w tej sesji
  sessionEnded: boolean;             // czy sesja się zakończyła (brak więcej fiszek)
  isLoading: boolean;                // czy trwa ładowanie danych
  error: string | null;              // komunikat błędu, jeśli wystąpił
}
```

### FlashcardDisplayState
```typescript
interface FlashcardDisplayState {
  isFlipped: boolean;
}
```

## 6. Zarządzanie stanem
Stan widoku Learn będzie zarządzany przez hook `useLearnSession`, który będzie odpowiedzialny za:
- Pobieranie fiszek z API
- Zarządzanie aktualnie wyświetlaną fiszką
- Losowe wybieranie fiszek
- Obsługę odwracania fiszki (front/back)
- Śledzenie stanu sesji (dostępne fiszki, koniec sesji)

```typescript
interface UseLearnSessionReturn {
  state: LearnSessionState;
  drawFlashcard: () => void;
  flipCard: () => void;
  resetSession: () => void;
}

function useLearnSession(): UseLearnSessionReturn {
  // implementacja hooka
}
```

## 7. Integracja API
Widok będzie korzystał z endpointu `GET /api/flashcards` do pobierania fiszek.

- Endpoint: `GET /api/flashcards`
- Typ odpowiedzi: `FlashcardsResponseDTO`
```typescript
interface FlashcardsResponseDTO {
  flashcards: FlashcardDTO[];
}
```

Przykładowa implementacja pobierania fiszek:
```typescript
const fetchFlashcards = async (): Promise<FlashcardDTO[]> => {
  const response = await fetch('/api/flashcards');
  if (!response.ok) {
    throw new Error('Failed to fetch flashcards');
  }
  const data: FlashcardsResponseDTO = await response.json();
  return data.flashcards;
};
```

## 8. Interakcje użytkownika
1. **Wylosowanie fiszki**:
   - Użytkownik klika przycisk "Draw flashcard"
   - System losuje fiszkę z dostępnej puli
   - Wyświetla się przód fiszki
   - Przycisk "Flip card" staje się aktywny

2. **Odwrócenie fiszki**:
   - Użytkownik klika przycisk "Flip card"
   - System odwraca fiszkę, pokazując tył fiszki
   - Ponowne kliknięcie przywraca widok przodu fiszki

3. **Koniec sesji**:
   - Gdy wszystkie fiszki zostały już wylosowane, przycisk "Draw flashcard" staje się nieaktywny
   - Wyświetla się komunikat o zakończeniu sesji
   - Użytkownik może zresetować sesję, aby zacząć od nowa

## 9. Warunki i walidacja
1. **Walidacja dostępności fiszek**:
   - Przycisk "Draw flashcard" jest aktywny tylko wtedy, gdy istnieją niewylosowane fiszki
   - Gdy brak dostępnych fiszek, przycisk jest wyłączony i wyświetla się komunikat o końcu sesji

2. **Walidacja wyświetlania fiszki**:
   - Fiszka jest wyświetlana tylko wtedy, gdy została wylosowana
   - Przycisk "Flip card" jest aktywny tylko gdy fiszka jest wyświetlana

## 10. Obsługa błędów
1. **Błąd pobierania fiszek**:
   - Wyświetlenie komunikatu o błędzie pobierania fiszek
   - Możliwość ponowienia próby

2. **Brak fiszek**:
   - Gdy użytkownik nie ma żadnych fiszek, wyświetlamy komunikat zachęcający do stworzenia fiszek
   - Link do widoku dodawania fiszek

3. **Nieoczekiwane błędy**:
   - Obsługa i wyświetlanie komunikatów błędów z API
   - Logi błędów w konsoli dla celów deweloperskich

## 11. Kroki implementacji
1. Utworzenie pliku strony Astro `/src/pages/learn.astro`
2. Utworzenie głównego komponentu React `LearnContainer` w `/src/components/learn/LearnContainer.tsx`
3. Implementacja hooka `useLearnSession` w `/src/hooks/useLearnSession.ts`
4. Utworzenie komponentu `FlashcardDisplay` w `/src/components/learn/FlashcardDisplay.tsx`
5. Implementacja przycisku `DrawFlashcardButton` w `/src/components/learn/DrawFlashcardButton.tsx`  
6. Implementacja przycisku `FlipCardButton` w `/src/components/learn/FlipCardButton.tsx`
7. Utworzenie komponentu `SessionEndMessage` w `/src/components/learn/SessionEndMessage.tsx`
8. Integracja wszystkich komponentów w `LearnContainer`
9. Dodanie strony do głównej nawigacji
10. Optymalizacja dostępności (ARIA atrybuty, focus management)
