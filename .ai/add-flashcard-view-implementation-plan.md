# Plan implementacji widoku "Add Flashcard"

## 1. Przegląd
Widok "Add Flashcard" umożliwia użytkownikowi ręczne tworzenie nowych fiszek edukacyjnych poprzez wprowadzenie treści dla przodu i tyłu fiszki. Widok realizuje wymagania zdefiniowane w User Story US-002, pozwalając na szybkie i efektywne dodawanie nowych fiszek do systemu z odpowiednią walidacją danych.

## 2. Routing widoku
Widok będzie dostępny pod ścieżką `/add` zgodnie z wymaganiami PRD.

## 3. Struktura komponentów
```
AddFlashcardView (strona Astro)
└── FlashcardForm (komponent React)
    ├── Input (front_content)
    ├── Input (back_content)
    └── Button (submit)
```

## 4. Szczegóły komponentów
### AddFlashcardView (Astro)
- Opis komponentu: Główny komponent widoku, renderowany na serwerze, zawierający strukturę strony i osadzający interaktywny formularz React.
- Główne elementy: Layout strony, nagłówek, osadzony komponent FlashcardForm.
- Obsługiwane interakcje: Przekazuje żądania do komponentu FlashcardForm.
- Obsługiwana walidacja: Brak (walidacja odbywa się w komponencie FlashcardForm).
- Typy: Brak specyficznych typów.
- Propsy: Brak.

### FlashcardForm (React)
- Opis komponentu: Interaktywny formularz pozwalający na wprowadzenie treści fiszki i jej zapisanie.
- Główne elementy: Formularz HTML, pola input dla front_content i back_content, przycisk Submit, komunikaty walidacyjne, toast.
- Obsługiwane interakcje:
  - Wprowadzanie tekstu do pól formularza
  - Kliknięcie przycisku Submit
  - Resetowanie formularza po udanym zapisie
- Obsługiwana walidacja:
  - Minimum 2 znaki w polach front_content i back_content
  - Maksimum 200 znaków w polach front_content i back_content
  - Wyświetlanie komunikatów o błędach przy polach
  - Dezaktywacja przycisku Submit gdy formularz zawiera błędy
- Typy: 
  - `FormSchema` - schemat walidacyjny formularza
  - `FormState` - stan formularza
  - `CreateManualFlashcardCommand` - typ dla żądania API
- Propsy: Brak.

### Input (Shadcn UI)
- Opis komponentu: Komponent input pochodzący z biblioteki Shadcn UI.
- Główne elementy: Input HTML, label, komunikat o błędzie.
- Obsługiwane interakcje: Wprowadzanie tekstu, focus, blur.
- Obsługiwana walidacja: Przekazywana z komponentu nadrzędnego, ustawia atrybut aria-invalid w przypadku błędu.
- Typy: Standardowe propsy komponentu Input z Shadcn UI.
- Propsy: 
  - `label` - etykieta dla pola
  - `name` - nazwa pola
  - `value` - wartość pola
  - `onChange` - funkcja obsługująca zmianę wartości
  - `error` - komunikat błędu
  - `required` - czy pole jest wymagane

### Button (Shadcn UI)
- Opis komponentu: Komponent przycisku pochodzący z biblioteki Shadcn UI.
- Główne elementy: Button HTML.
- Obsługiwane interakcje: Kliknięcie, hover, focus.
- Obsługiwana walidacja: Przyjmuje prop disabled, który blokuje możliwość kliknięcia.
- Typy: Standardowe propsy komponentu Button z Shadcn UI.
- Propsy: 
  - `type` - typ przycisku (submit, button, reset)
  - `disabled` - czy przycisk jest zablokowany
  - `onClick` - funkcja obsługująca kliknięcie

## 5. Typy
```typescript
// Schemat formularza i typ dla stanu formularza
type FormSchema = {
  front_content: string;
  back_content: string;
};

// Stan formularza z informacjami o błędach
type FormState = {
  values: FormSchema;
  errors: {
    front_content?: string;
    back_content?: string;
  };
  isSubmitting: boolean;
  isValid: boolean;
};

// Typ odpowiedzi z serwera w przypadku błędu
type ApiError = {
  error: {
    message: string;
    code: string;
    details?: Record<string, any>;
  };
};
```

## 6. Zarządzanie stanem
Zarządzanie stanem formularza będzie realizowane przy użyciu hooka React `useState`:

```typescript
// Stan formularza
const [formState, setFormState] = useState<FormState>({
  values: { front_content: '', back_content: '' },
  errors: {},
  isSubmitting: false,
  isValid: false
});
```

Dodatkowo zaimplementujemy niestandardowy hook `useFlashcardForm` dla zarządzania stanem formularza, walidacją i wysyłaniem danych:

```typescript
function useFlashcardForm() {
  const [formState, setFormState] = useState<FormState>({
    values: { front_content: '', back_content: '' },
    errors: {},
    isSubmitting: false,
    isValid: false
  });
  
  // Funkcje obsługujące zmianę wartości pól, walidację i wysyłanie formularza
  
  return {
    formState,
    handleChange,
    handleSubmit,
    resetForm
  };
}
```

## 7. Integracja API
Integracja z API będzie polegać na wysłaniu żądania POST do endpointu `/api/flashcards` z odpowiednimi danymi formularza:

```typescript
const createFlashcard = async (data: CreateManualFlashcardCommand) => {
  try {
    const response = await fetch('/api/flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json() as ApiError;
      throw new Error(errorData.error.message);
    }
    
    const flashcard = await response.json() as FlashcardDTO;
    return flashcard;
  } catch (error) {
    throw error;
  }
};
```

Typy żądania i odpowiedzi:
- Żądanie: `CreateManualFlashcardCommand` (z pliku types.ts)
- Odpowiedź: `FlashcardDTO` (z pliku types.ts) lub `ApiError` w przypadku błędu

## 8. Interakcje użytkownika
1. **Wprowadzanie danych**:
   - Użytkownik wpisuje treść przodu fiszki w pole "Front content"
   - Użytkownik wpisuje treść tyłu fiszki w pole "Back content"
   - Podczas wpisywania odbywa się walidacja inline

2. **Wysyłanie formularza**:
   - Użytkownik klika przycisk "Create Flashcard" (aktywny tylko gdy formularz jest poprawny)
   - System wyświetla spinner ładowania na przycisku
   - Po udanym zapisie:
     - System wyświetla komunikat potwierdzający
     - Formularz jest resetowany
   - W przypadku błędu:
     - System wyświetla komunikat o błędzie
     - Dane formularza pozostają wypełnione

## 9. Warunki i walidacja
Walidacja będzie odbywać się na dwóch poziomach:

1. **Walidacja formularza w UI**:
   - `front_content`: min. 2 znaki, maks. 200 znaków
   - `back_content`: min. 2 znaki, maks. 200 znaków
   - Walidacja jest wykonywana w czasie rzeczywistym podczas wpisywania
   - Przycisk Submit jest zablokowany, dopóki formularz nie jest poprawny

2. **Walidacja po stronie serwera**:
   - Endpoint `/api/flashcards` waliduje dane przy użyciu schematu Zod
   - W przypadku niepowodzenia walidacji zwracany jest błąd 400 z informacją o błędach

## 10. Obsługa błędów
1. **Błędy walidacji formularza**:
   - Wyświetlanie komunikatów błędu pod odpowiednimi polami
   - Dodanie atrybutu `aria-invalid` do niepoprawnych pól
   - Blokada przycisku Submit, jeśli formularz zawiera błędy

2. **Błędy API**:
   - Wyświetlanie komunikatu o błędzie przy użyciu komponentu Toast
   - Zachowanie danych formularza, aby użytkownik mógł poprawić błędy
   - Obsługa różnych kodów błędów zwracanych przez API

3. **Błędy sieci**:
   - Wyświetlanie komunikatu o problemach z połączeniem
   - Możliwość ponownego wysłania formularza po rozwiązaniu problemów z siecią

## 11. Kroki implementacji
1. Utworzenie pliku strony Astro `src/pages/add.astro` z podstawowym układem
2. Implementacja komponentu React `FlashcardForm` w pliku `src/components/add/FlashcardForm.tsx`
3. Zaimplementowanie hooka `useFlashcardForm` do zarządzania stanem formularza
4. Dodanie obsługi walidacji formularza
5. Implementacja integracji z API dla funkcji tworzenia fiszki
6. Dodanie obsługi błędów i komunikatów potwierdzających
7. Dodanie stylów
8. Aktualizacja nawigacji, aby zawierała link do nowego widoku
9. Finalna weryfikacja zgodności z wymaganiami PRD i User Story 
