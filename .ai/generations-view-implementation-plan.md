# Plan implementacji widoku Generate

## 1. Przegląd
Widok Generate służy do generowania propozycji fiszek za pomocą AI na podstawie wprowadzonego przez użytkownika tekstu. Użytkownik wprowadza tekst, a następnie po kliknięciu przycisku generuje propozycje fiszek. Dla każdej wygenerowanej propozycji użytkownik może edytować zawartość, zaakceptować ją bez zmian, zaakceptować ze zmianami lub odrzucić.

## 2. Routing widoku
Widok Generate powinien być dostępny pod ścieżką `/generate`.

## 3. Struktura komponentów
```
GenerateView
├── InputForm
│   ├── Textarea
│   ├── CharacterCounter
│   └── Button
├── Spinner (widoczny podczas generowania)
└── FlashcardProposalsList (widoczny po generacji)
    ├── FlashcardProposalCard
    │   ├── FlashcardEditorField (przód)
    │   ├── FlashcardEditorField (tył)
    │   ├── Button (Accept)
    │   └── Button (Reject)
    └── ...
```

## 4. Szczegóły komponentów

### GenerateView
- Opis komponentu: Główny komponent zawierający całą logikę widoku generowania fiszek.
- Główne elementy: Kontener z tytułem strony, InputForm oraz FlashcardProposalsList (warunkowe).
- Obsługiwane interakcje: Brak bezpośrednich (deleguje do komponentów potomnych).
- Obsługiwana walidacja: Brak bezpośredniej (deleguje do komponentów potomnych).
- Typy: Wykorzystuje GenerateFlashcardsCommand, GenerationResponseDTO, FlashcardProposalViewModel.
- Propsy: Brak (komponent najwyższego poziomu).

### GenerationInputForm
- Opis komponentu: Formularz do wprowadzania tekstu źródłowego i inicjowania generacji.
- Główne elementy: Textarea, CharacterCounter, Button.
- Obsługiwane interakcje: Wprowadzanie tekstu, przesyłanie formularza.
- Obsługiwana walidacja: Długość tekstu (minimum 1000, maksimum 10000 znaków).
- Typy: InputFormViewModel, GenerateFlashcardsCommand.
- Propsy: onSubmit: (data: GenerateFlashcardsCommand) => Promise<void>, isLoading: boolean.

### Textarea
- Opis komponentu: Pole tekstowe do wprowadzania długiego tekstu.
- Główne elementy: Element textarea z etykietą.
- Obsługiwane interakcje: Wprowadzanie tekstu, zmiana fokusa.
- Obsługiwana walidacja: Min/max długość przez rodzica.
- Typy: string.
- Propsy: value: string, onChange: (value: string) => void, minLength?: number, maxLength?: number.

### CharacterCounter
- Opis komponentu: Licznik znaków pokazujący aktualną ilość znaków oraz limity.
- Główne elementy: Tekst z informacją o liczbie znaków.
- Obsługiwane interakcje: Brak (tylko wyświetlanie).
- Obsługiwana walidacja: Brak (tylko informacyjny).
- Typy: number.
- Propsy: currentCount: number, minCount: number, maxCount: number.

### Button
- Opis komponentu: Przycisk do wysyłania formularza lub wykonywania akcji.
- Główne elementy: Element button z etykietą.
- Obsługiwane interakcje: Kliknięcie.
- Obsługiwana walidacja: Brak (kontrolowany przez rodzica).
- Typy: ButtonProps z Shadcn/UI.
- Propsy: children: ReactNode, onClick?: () => void, disabled?: boolean, variant?: 'default' | 'destructive' | 'outline'.

### FlashcardProposalsList
- Opis komponentu: Lista wygenerowanych propozycji fiszek.
- Główne elementy: Kontener z nagłówkiem i listą FlashcardProposalCard.
- Obsługiwane interakcje: Brak bezpośrednich (deleguje do komponentów potomnych).
- Obsługiwana walidacja: Brak bezpośredniej (deleguje do komponentów potomnych).
- Typy: Array<FlashcardProposalViewModel>.
- Propsy: proposals: FlashcardProposalViewModel[], generationId: string, onAccept: (id: string) => Promise<void>, onReject: (id: string) => void, onUpdate: (id: string, updates: Partial<FlashcardProposalDTO>) => void.

### FlashcardProposalCard
- Opis komponentu: Karta pojedynczej propozycji fiszki z możliwością edycji.
- Główne elementy: FlashcardEditorField (przód i tył), przyciski Accept i Reject.
- Obsługiwane interakcje: Edycja zawartości, akceptacja, odrzucenie.
- Obsługiwana walidacja: Długość zawartości przodu i tyłu (2-200 znaków).
- Typy: FlashcardProposalViewModel.
- Propsy: proposal: FlashcardProposalViewModel, onAccept: () => Promise<void>, onReject: () => void, onUpdate: (updates: Partial<FlashcardProposalDTO>) => void.

### FlashcardEditorField
- Opis komponentu: Edytowalne pole tekstowe dla zawartości fiszki.
- Główne elementy: Textarea z etykietą.
- Obsługiwane interakcje: Edycja tekstu, zmiana fokusa.
- Obsługiwana walidacja: Długość tekstu (2-200 znaków).
- Typy: string.
- Propsy: label: string, value: string, onChange: (value: string) => void, error?: string.

### Spinner
- Opis komponentu: Wskaźnik ładowania podczas generowania.
- Główne elementy: Animowany element z tekstem.
- Obsługiwane interakcje: Brak (tylko wyświetlanie).
- Obsługiwana walidacja: Brak.
- Typy: Brak specyficznych.
- Propsy: size?: 'sm' | 'md' | 'lg'.

### Toast
- Opis komponentu: Komponent powiadomień dla informacji zwrotnej.
- Główne elementy: Wyskakujące powiadomienie z tekstem.
- Obsługiwane interakcje: Zamknięcie.
- Obsługiwana walidacja: Brak.
- Typy: ToastProps z Shadcn/UI.
- Propsy: message: string, type: 'success' | 'error' | 'info'.

## 5. Typy

### Istniejące typy DTO
```typescript
// Z src/types.ts
interface GenerateFlashcardsCommand {
  input_text: string; // 1000-10000 znaków
}

interface GenerationResponseDTO {
  generation_id: string;
  proposals: FlashcardProposalDTO[];
  ai_model: string;
  generation_time_ms: number;
  total_generated: number;
}

interface FlashcardProposalDTO {
  front_content: string; // 2-200 znaków
  back_content: string; // 2-200 znaków
}

interface AcceptAIFlashcardCommand {
  front_content: string; // 2-200 znaków
  back_content: string; // 2-200 znaków
  creation_method: "ai_full" | "ai_edited";
  generation_id: string;
}
```

### Nowe typy ViewModel
```typescript
// Nowe typy potrzebne dla widoku

interface FlashcardProposalViewModel extends FlashcardProposalDTO {
  id: string; // Unikalny ID po stronie klienta do śledzenia
  isEdited: boolean; // Czy propozycja została zedytowana
  isSaving: boolean; // Czy propozycja jest aktualnie zapisywana
  errors?: {
    front_content?: string;
    back_content?: string;
  };
}

interface GenerationViewModel {
  isGenerating: boolean;
  error: string | null;
  result: GenerationResponseDTO | null;
}

interface InputFormViewModel {
  inputText: string;
  isValid: boolean;
  error: string | null;
  characterCount: number;
}
```

## 6. Zarządzanie stanem

### useGeneration Hook
```typescript
function useGeneration() {
  const [state, setState] = useState<GenerationViewModel>({
    isGenerating: false,
    error: null,
    result: null
  });

  async function generateFlashcards(input: GenerateFlashcardsCommand) {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      // Wywołanie API /api/generations/generate
      const result = await api.post<GenerationResponseDTO>('/api/generations/generate', input);
      setState({ isGenerating: false, error: null, result });
      return result;
    } catch (error) {
      setState({ isGenerating: false, error: getErrorMessage(error), result: null });
      throw error;
    }
  }

  function resetGeneration() {
    setState({ isGenerating: false, error: null, result: null });
  }

  return {
    ...state,
    generateFlashcards,
    resetGeneration
  };
}
```

### useFlashcardProposals Hook
```typescript
function useFlashcardProposals() {
  const [proposals, setProposals] = useState<FlashcardProposalViewModel[]>([]);
  const [generationId, setGenerationId] = useState<string | null>(null);

  function initializeProposals(proposalsDTO: FlashcardProposalDTO[], genId: string) {
    setGenerationId(genId);
    setProposals(
      proposalsDTO.map((p, index) => ({
        ...p,
        id: `proposal-${index}`,
        isEdited: false,
        isSaving: false
      }))
    );
  }

  function updateProposal(id: string, updates: Partial<FlashcardProposalDTO>) {
    setProposals(current =>
      current.map(p => 
        p.id === id 
          ? { ...p, ...updates, isEdited: true } 
          : p
      )
    );
  }

  async function acceptProposal(id: string) {
    if (!generationId) return;
    
    const proposal = proposals.find(p => p.id === id);
    if (!proposal) return;
    
    setProposals(current =>
      current.map(p => 
        p.id === id 
          ? { ...p, isSaving: true } 
          : p
      )
    );
    
    try {
      // Wywołanie API do zapisania fiszki
      const command: AcceptAIFlashcardCommand = {
        front_content: proposal.front_content,
        back_content: proposal.back_content,
        creation_method: proposal.isEdited ? "ai_edited" : "ai_full",
        generation_id: generationId
      };
      
      await api.post('/api/flashcards', command);
      
      // Usunięcie zaakceptowanej propozycji z listy
      setProposals(current => current.filter(p => p.id !== id));
      
      // Wyświetlenie powiadomienia o sukcesie
      toast.success("Flashcard accepted successfully!");
    } catch (error) {
      // Przywrócenie stanu i wyświetlenie błędu
      setProposals(current =>
        current.map(p => 
          p.id === id 
            ? { ...p, isSaving: false } 
            : p
        )
      );
      toast.error("Error while saving flashcard.");
    }
  }

  function rejectProposal(id: string) {
    // Usunięcie odrzuconej propozycji z listy
    setProposals(current => current.filter(p => p.id !== id));
  }

  function reset() {
    setProposals([]);
    setGenerationId(null);
  }

  return {
    proposals,
    generationId,
    initializeProposals,
    updateProposal,
    acceptProposal,
    rejectProposal,
    reset
  };
}
```

## 7. Integracja API

### Generowanie fiszek
- Endpoint: POST /api/generations/generate
- Żądanie:
  ```typescript
  {
    input_text: string; // 1000-10000 znaków
  }
  ```
- Odpowiedź:
  ```typescript
  {
    generation_id: string;
    proposals: Array<{
      front_content: string; // 2-200 znaków
      back_content: string; // 2-200 znaków
    }>;
    ai_model: string;
    generation_time_ms: number;
    total_generated: number;
  }
  ```
- Obsługa błędów: 400 (nieprawidłowe dane wejściowe), 401 (nieautoryzowany), 429 (przekroczono limit żądań), 500 (błąd serwera), 503 (usługa niedostępna)

### Akceptacja fiszki
- Endpoint: POST /api/flashcards
- Żądanie:
  ```typescript
  {
    front_content: string; // 2-200 znaków
    back_content: string; // 2-200 znaków
    creation_method: "ai_full" | "ai_edited";
    generation_id: string;
  }
  ```
- Odpowiedź: FlashcardDTO
- Obsługa błędów: 400 (nieprawidłowe dane wejściowe), 401 (nieautoryzowany), 500 (błąd serwera)

## 8. Interakcje użytkownika

### Wprowadzanie tekstu:
1. Użytkownik wprowadza tekst w polu textarea.
2. Podczas pisania licznik znaków aktualizuje się w czasie rzeczywistym.
3. Przycisk "Generate" jest wyłączony, dopóki długość tekstu nie spełnia wymagań (1000-10000 znaków).
4. Po spełnieniu wymagań długości tekstu przycisk "Generate" staje się aktywny.

### Generowanie fiszek:
1. Użytkownik klika przycisk "Generate", po czym pojawia się spinner ładowania.
2. System wysyła żądanie do API.
3. Po otrzymaniu odpowiedzi, pod formularzem pojawia się lista propozycji fiszek w kartach.
4. W przypadku błędu wyświetlany jest komunikat błędu.

### Edycja propozycji:
1. Użytkownik klika w pola z treścią frontu lub tyłu fiszki (pola cały czas są edytowalne).
2. System waliduje długość treści (2-200 znaków).
3. System śledzi, czy propozycja została zedytowana.

### Akceptacja propozycji:
1. Użytkownik klika przycisk "Accept" na karcie propozycji.
2. System waliduje treść frontu i tyłu.
3. Jeśli walidacja przechodzi pomyślnie, system wysyła żądanie do API z odpowiednim typem creation_method ("ai_full" lub "ai_edited").
4. W trakcie zapisywania przycisk "Accept" i "Reject" jest wyłączony i wyświetla się wskaźnik ładowania.
5. Po pomyślnym zapisaniu fiszka znika z listy propozycji i wyświetlane jest powiadomienie o sukcesie (toast).
6. W przypadku błędu wyświetlany jest komunikat błędu (toast), a propozycja pozostaje na liście.

### Odrzucenie propozycji:
1. Użytkownik klika przycisk "Reject" na karcie propozycji.
2. Propozycja znika z listy bez zapisywania.

## 9. Warunki i walidacja

### Walidacja tekstu wejściowego:
- Minimalna długość: 1000 znaków
- Maksymalna długość: 10000 znaków
- Czas walidacji: podczas wprowadzania tekstu (dla aktywacji przycisku) oraz przed wysłaniem formularza
- Komunikaty błędów:
  - "Enter at least 1000 characters"
  - "Text cannot exceed 10000 characters"

### Walidacja treści fiszki:
- Minimalna długość: 2 znaki
- Maksymalna długość: 200 znaków
- Czas walidacji: podczas edycji oraz przed akceptacją
- Komunikaty błędów:
  - "Enter at least 2 characters"
  - "Text cannot exceed 200 characters"

### Warunki przesłania formularza:
- Przycisk "Generate" jest aktywny tylko gdy długość tekstu wynosi 1000-10000 znaków
- Przycisk "Accept" jest aktywny tylko gdy zarówno front_content jak i back_content mają 2-200 znaków

## 10. Obsługa błędów

### Błędy walidacji formularza:
- Wyświetlanie inline komunikatów błędów
- Wyłączenie przycisków akcji do czasu spełnienia warunków walidacji

### Błędy API podczas generowania:
- 400: "Invalid input data. Make sure the text has the correct length."
- 401: "Session expired. Please log in again."
- 429: "Request limit exceeded. Please try again later."
- 500: "An error occurred during generation. Please try again later."
- 503: "The generation service is currently unavailable. Please try again later."

### Błędy API podczas akceptacji:
- 400: "Invalid flashcard data. Make sure the content has the correct length."
- 401: "Session expired. Please log in again."
- 500: "An error occurred while saving the flashcard. Please try again later."

### Błędy połączenia:
- "No connection to the server. Check your internet connection and try again."

## 11. Kroki implementacji

1. Utworzenie struktury plików:
   ```
   src/
     ├── pages/
     │   └── generate.astro
     ├── components/
     │   ├── generate/
     │   │   ├── GenerateView.tsx
     │   │   ├── InputForm.tsx
     │   │   ├── CharacterCounter.tsx
     │   │   ├── FlashcardProposalsList.tsx
     │   │   └── FlashcardProposalCard.tsx
     │   └── ui/
     │       ├── Button.tsx (z shadcn/ui)
     │       ├── Textarea.tsx (z shadcn/ui)
     │       ├── Spinner.tsx
     │       └── Toast.tsx (z shadcn/ui)
     └── hooks/
         ├── useGeneration.ts
         └── useFlashcardProposals.ts
   ```

2. Implementacja hooków:
   - Implementacja useGeneration do zarządzania stanem generowania
   - Implementacja useFlashcardProposals do zarządzania stanem propozycji fiszek

3. Implementacja komponentów UI:
   - Implementacja/konfiguracja komponentów z shadcn/ui
   - Implementacja prostych komponentów (CharacterCounter, Spinner)

4. Implementacja komponentów widoku:
   - Implementacja InputForm z walidacją
   - Implementacja FlashcardProposalCard
   - Implementacja FlashcardProposalsList

5. Integracja komponentów w GenerateView:
   - Połączenie hooków z komponentami UI
   - Implementacja przepływu danych między komponentami

6. Implementacja strony Astro:
   - Ustawienie routingu (Astro)
   - Osadzenie GenerateView w stronie

7. Testowanie:
   - Testowanie walidacji formularza
   - Testowanie przepływu generowania fiszek
   - Testowanie edycji, akceptacji i odrzucania propozycji
   - Testowanie obsługi błędów

8. Dopracowanie UX:
   - Dodanie komunikatów o sukcesie/błędzie
   - Dopracowanie stanów ładowania
   - Optymalizacja dostępności i użyteczności 
