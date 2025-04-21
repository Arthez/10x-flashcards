# Plan implementacji widoku Browse

## 1. Przegląd
Widok Browse jest kluczowym elementem aplikacji 10x-Flashcards, umożliwiającym użytkownikom przeglądanie, filtrowanie i zarządzanie swoimi fiszkami. Widok wyświetla również statystyki użytkownika, pozwalając mu monitorować postępy w tworzeniu i nauce z wykorzystaniem fiszek. Użytkownicy mogą sortować, filtrować, edytować i usuwać fiszki, co zapewnia pełną kontrolę nad ich kolekcją materiałów edukacyjnych.

## 2. Routing widoku
Widok będzie dostępny pod ścieżką `/browse` zgodnie z dokumentacją PRD i opisem widoku.

## 3. Struktura komponentów
```
BrowseView (Astro)
├── StatsPanel (React)
├── FilterBar (React)
│   ├── FilterButton (x4)
│   └── SortButton
├── FlashcardGrid (React)
│   ├── Spinner
│   └── FlashcardCard (wiele instancji)
│       ├── ViewModeContent
│       ├── EditModeContent
│       ├── ActionButtons
│       └── StatusIndicator
└── ConfirmModal (React)
```

## 4. Szczegóły komponentów
### BrowseView (strona Astro)
- Opis komponentu: Główny kontener strony, który zawiera statystyki, filtry i grid fiszek
- Główne elementy: `<Layout>`, `<StatsPanel>`, `<FilterBar>`, `<FlashcardGrid>`
- Obsługiwane interakcje: Brak (komponent kontenerowy)
- Obsługiwana walidacja: Brak
- Typy: Brak specyficznych typów
- Propsy: Brak (strona główna)

### StatsPanel
- Opis komponentu: Panel wyświetlający statystyki użytkownika z podziałem na różne metody tworzenia fiszek
- Główne elementy: Kontener z czterema blokami statystyk, każdy z etykietą, liczbą i wartością procentową
- Obsługiwane interakcje: Brak (komponent prezentacyjny)
- Obsługiwana walidacja: Brak
- Typy: `StatsResponseDTO`
- Propsy: `stats: StatsResponseDTO`

### FilterBar
- Opis komponentu: Pasek z przyciskami do filtrowania i sortowania fiszek
- Główne elementy: Przyciski filtrów dla każdej metody tworzenia oraz przycisk sortowania
- Obsługiwane interakcje:
  - Kliknięcie przycisku filtra
  - Kliknięcie przycisku sortowania
- Obsługiwana walidacja: Brak
- Typy: `FilterType`, `SortDirection`
- Propsy: 
  ```typescript
  {
    activeFilter: FilterType;
    sortDirection: SortDirection;
    onFilterChange: (filter: FilterType) => void;
    onSortChange: () => void;
  }
  ```

### FlashcardGrid
- Opis komponentu: Kontener z gridem fiszek, który obsługuje również ładowanie i komunikat o braku fiszek
- Główne elementy: Grid z kartami fiszek, spinner ładowania, komunikat o braku fiszek
- Obsługiwane interakcje: Brak (komponent kontenerowy)
- Obsługiwana walidacja: Brak
- Typy: `FlashcardDTO[]`, `FilterType`, `SortDirection`
- Propsy: 
  ```typescript
  {
    flashcards: FlashcardDTO[];
    loading: boolean;
    activeFilter: FilterType;
    sortDirection: SortDirection;
    onEdit: (id: string, data: UpdateFlashcardCommand) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
  }
  ```

### FlashcardCard
- Opis komponentu: Karta pojedynczej fiszki, która obsługuje tryb widoku i edycji
- Główne elementy: Treść przodu i tyłu fiszki, przyciski akcji, wskaźnik metody utworzenia
- Obsługiwane interakcje:
  - Kliknięcie przycisku edycji
  - Kliknięcie przycisku zapisania zmian
  - Kliknięcie przycisku usunięcia
  - Zmiana tekstu w polach edycji
- Obsługiwana walidacja:
  - Treść przodu i tyłu fiszki musi mieć od 2 do 200 znaków
- Typy: `FlashcardDTO`, `UpdateFlashcardCommand`
- Propsy: 
  ```typescript
  {
    flashcard: FlashcardDTO;
    onEdit: (id: string, data: UpdateFlashcardCommand) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
  }
  ```

### ConfirmModal
- Opis komponentu: Modal do potwierdzania akcji edycji lub usunięcia fiszki
- Główne elementy: Nagłówek, treść, przyciski potwierdzenia i anulowania
- Obsługiwane interakcje:
  - Kliknięcie przycisku potwierdzenia
  - Kliknięcie przycisku anulowania
  - Kliknięcie poza modalem (zamknięcie)
- Obsługiwana walidacja: Brak
- Typy: `ConfirmModalProps`
- Propsy: 
  ```typescript
  {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
  }
  ```

## 5. Typy
```typescript
// Typy dostępne w aplikacji
import type { FlashcardDTO, CreationMethod, UpdateFlashcardCommand, StatsResponseDTO } from "../types";

// Nowe typy specyficzne dla widoku
type FilterType = "all" | "ai_full" | "ai_edited" | "manual";

type SortDirection = "newest" | "oldest";

interface EditableFlashcard extends FlashcardDTO {
  isEditing: boolean;
  frontDraft: string;
  backDraft: string;
  hasValidationErrors: boolean;
  frontError?: string;
  backError?: string;
}

// ViewModel dla statystyk z dodatkowymi wyliczonymi wartościami
interface StatsViewModel extends StatsResponseDTO {
  rejected_count: number;
  manual_percent: number;
  ai_full_percent: number;
  ai_edited_percent: number;
  rejected_percent: number;
}

// Dla modala potwierdzenia
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```

## 6. Zarządzanie stanem
Stan widoku Browse będzie zarządzany za pomocą React Hooks w komponencie klienckim. Główne elementy stanu:

1. **Lista fiszek i filtry**
```typescript
// Customowy hook do obsługi fiszek, filtrowania i sortowania
function useFlashcards() {
  const [flashcards, setFlashcards] = useState<FlashcardDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortDirection, setSortDirection] = useState<SortDirection>("newest");
  
  // Funkcja do pobierania fiszek
  const fetchFlashcards = async () => {...};
  
  // Funkcje do edycji i usuwania fiszek
  const editFlashcard = async (id: string, data: UpdateFlashcardCommand) => {...};
  const deleteFlashcard = async (id: string) => {...};
  
  // Funkcje pomocnicze do filtrowania i sortowania (wykonywane po stronie klienta)
  const filteredFlashcards = useMemo(() => {...}, [flashcards, activeFilter]);
  const sortedFlashcards = useMemo(() => {...}, [filteredFlashcards, sortDirection]);
  
  return {
    flashcards: sortedFlashcards,
    loading,
    error,
    activeFilter,
    sortDirection,
    setActiveFilter,
    toggleSortDirection: () => setSortDirection(prev => prev === "newest" ? "oldest" : "newest"),
    editFlashcard,
    deleteFlashcard,
    refreshFlashcards: fetchFlashcards
  };
}
```

2. **Statystyki**
```typescript
// Customowy hook do pobierania i przetwarzania statystyk
function useStats() {
  const [stats, setStats] = useState<StatsResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Funkcja do pobierania statystyk
  const fetchStats = async () => {...};
  
  // Obliczenie dodatkowych statystyk pochodnych
  const statsViewModel = useMemo<StatsViewModel | null>(() => {
    if (!stats) return null;
    
    const total = stats.manual_count + stats.ai_full_count + stats.ai_edited_count;
    const rejected_count = stats.total_generated - (stats.ai_full_count + stats.ai_edited_count);
    
    return {
      ...stats,
      rejected_count,
      manual_percent: total > 0 ? Math.round((stats.manual_count / total) * 100) : 0,
      ai_full_percent: total > 0 ? Math.round((stats.ai_full_count / total) * 100) : 0,
      ai_edited_percent: total > 0 ? Math.round((stats.ai_edited_count / total) * 100) : 0,
      rejected_percent: stats.total_generated > 0 
        ? Math.round((rejected_count / stats.total_generated) * 100) 
        : 0
    };
  }, [stats]);
  
  return {
    stats: statsViewModel,
    loading,
    error,
    refreshStats: fetchStats
  };
}
```

3. **Modal potwierdzenia**
```typescript
// Customowy hook do zarządzania modalem potwierdzenia
function useConfirmModal() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Potwierdź",
    onConfirm: () => {}
  });
  
  const openModal = (title: string, message: string, confirmLabel: string, onConfirm: () => void) => {
    setModalState({
      isOpen: true,
      title,
      message,
      confirmLabel,
      onConfirm
    });
  };
  
  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };
  
  return {
    modalProps: {
      ...modalState,
      onCancel: closeModal
    },
    openModal,
    closeModal
  };
}
```

## 7. Integracja API
Widok będzie korzystał z endpointów (które już istnieją):

### 1. Endpoint do pobierania fiszek
- **URL**: `/api/flashcards`
- **Metoda**: GET
- **Response Type**: `FlashcardsResponseDTO`

```typescript
async function fetchFlashcards(): Promise<FlashcardDTO[]> {
  try {
    const response = await fetch('/api/flashcards');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Nie udało się pobrać fiszek');
    }
    const data: FlashcardsResponseDTO = await response.json();
    return data.flashcards;
  } catch (error) {
    console.error('Błąd podczas pobierania fiszek:', error);
    throw error;
  }
}
```

### 2. Endpoint do edycji fiszki
- **URL**: `/api/flashcards/{id}`
- **Metoda**: PUT
- **Request Type**: `UpdateFlashcardCommand`
- **Response Type**: `FlashcardDTO`

```typescript
async function updateFlashcard(id: string, data: UpdateFlashcardCommand): Promise<FlashcardDTO> {
  try {
    const response = await fetch(`/api/flashcards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Nie udało się zaktualizować fiszki');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Błąd podczas aktualizacji fiszki:', error);
    throw error;
  }
}
```

### 3. Endpoint do usuwania fiszki
- **URL**: `/api/flashcards/{id}`
- **Metoda**: DELETE
- **Response Type**: `{ message: string }`

```typescript
async function deleteFlashcard(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/flashcards/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Nie udało się usunąć fiszki');
    }
  } catch (error) {
    console.error('Błąd podczas usuwania fiszki:', error);
    throw error;
  }
}
```

### 4. Endpoint do pobierania statystyk
- **URL**: `/api/stats`
- **Metoda**: GET
- **Response Type**: `StatsResponseDTO`

```typescript
async function fetchStats(): Promise<StatsResponseDTO> {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Nie udało się pobrać statystyk');
    }
    return await response.json();
  } catch (error) {
    console.error('Błąd podczas pobierania statystyk:', error);
    throw error;
  }
}
```

## 8. Interakcje użytkownika
### Filtrowanie fiszek
1. Użytkownik klika jeden z czterech przycisków filtrowania ("All types", "AI Full", "AI Edited", "Manual")
2. Przycisk zmienia stan na aktywny (aria-pressed="true")
3. Lista fiszek jest filtrowana na frontend przy użyciu JavaScript, bez ponownego żądania do API
4. Wyświetlane są tylko fiszki pasujące do wybranego filtra

### Sortowanie fiszek
1. Użytkownik klika przycisk sortowania (domyślnie "Newest")
2. Przycisk zmienia swój tekst i ikonę między "Newest" i "Oldest"
3. Lista fiszek jest sortowana na frontend przy użyciu JavaScript
4. Fiszki są wyświetlane w odpowiedniej kolejności (rosnącej lub malejącej, według daty utworzenia)

### Edycja fiszki
1. Użytkownik klika przycisk "Edit" na karcie fiszki
2. Wyświetla się modal potwierdzenia z pytaniem o kontynuowanie edycji
3. Po potwierdzeniu, pola treści fiszki zmieniają się z trybu tylko do odczytu na tryb edycji
4. Przycisk "Edit" znika, pojawia się przycisk "Save"
5. Użytkownik edytuje treść przodu i/lub tyłu fiszki
6. Podczas edycji, treść jest walidowana (2-200 znaków)
7. Po kliknięciu przycisku "Save" następuje:
   - Walidacja pól (jeśli niepoprawne, wyświetlane są komunikaty błędów)
   - Jeśli poprawne, zapisanie zmian poprzez API
   - Powrót do trybu tylko do odczytu
   - Wyświetlenie powiadomienia o sukcesie

### Usuwanie fiszki
1. Użytkownik klika przycisk "Remove" na karcie fiszki
2. Wyświetla się modal potwierdzenia z ostrzeżeniem o trwałym usunięciu
3. Po potwierdzeniu, wysyłane jest żądanie do API o usunięcie fiszki
4. Fiszka znika z listy (jeśli backend zwróci odpowiedz sukcesu)
5. Wyświetlane jest powiadomienie o sukcesie lub niepowodzeniu

## 9. Warunki i walidacja
### Walidacja treści fiszki (przy edycji)
- **Front**: 2-200 znaków
- **Tył**: 2-200 znaków
- Walidacja jest wykonywana w czasie rzeczywistym, podczas wpisywania
- Przycisk "Save" jest nieaktywny, dopóki oba pola nie przejdą walidacji
- Komunikaty błędów są wyświetlane pod polami z niepoprawną treścią

### Filtry i sortowanie
- Domyślny filtr: "All types"
- Domyślne sortowanie: "Newest"
- Filtry są wzajemnie wykluczające się - tylko jeden może być aktywny
- Przyciski filtrów mają atrybut aria-pressed="true" gdy są aktywne

## 10. Obsługa błędów
### Błędy API
1. **Błąd pobierania fiszek**:
   - Wyświetlenie komunikatu błędu na stronie
   - Opcja ponowienia próby pobrania
   - Tymczasowe ukrycie komponentu grid

2. **Błąd edycji fiszki**:
   - Wyświetlenie powiadomienia (toast) z informacją o błędzie
   - Pozostawienie fiszki w trybie edycji
   - Możliwość ponowienia próby zapisania lub anulowania edycji

3. **Błąd usuwania fiszki**:
   - Wyświetlenie powiadomienia (toast) z informacją o błędzie
   - Fiszka pozostaje na liście
   - Możliwość ponowienia próby usunięcia

4. **Błąd pobierania statystyk**:
   - Wyświetlenie informacji o błędzie w panelu statystyk
   - Opcja ponowienia próby pobrania
   - Wyświetlenie interfejsu fiszek niezależnie od błędu statystyk

### Obsługa pustej listy fiszek
- Wyświetlenie przyjaznego komunikatu "Brak fiszek" z sugestią utworzenia nowych
- Ukrycie filtrów i sortowania, gdy lista jest pusta

### Obsługa stanu ładowania
- Wyświetlenie komponentu Spinner podczas pobierania danych
- Dezaktywacja przycisków interakcji podczas ładowania
- Wskaźnik stanu ładowania (spinner) podczas operacji edycji i usuwania na konkretnych fiszkach

## 11. Kroki implementacji
1. **Utworzenie pliku strony Astro**:
   ```
   src/pages/browse.astro
   ```

2. **Utworzenie głównych komponentów React**:
   ```
   src/components/browse/StatsPanel.tsx
   src/components/browse/FilterBar.tsx
   src/components/browse/FlashcardGrid.tsx
   src/components/browse/FlashcardCard.tsx
   src/components/ui/ConfirmModal.tsx (jeśli nie istnieje)
   src/components/ui/Spinner.tsx (jeśli nie istnieje)
   ```

3. **Implementacja custom hooków**:
   ```
   src/hooks/useFlashcards.ts
   src/hooks/useStats.ts
   src/hooks/useConfirmModal.ts
   ```

4. **Implementacja komponentu `StatsPanel`**:
   - Utworzenie interfejsu
   - Implementacja logiki obliczania procentów
   - Dodanie stylów z Tailwind

5. **Implementacja komponentu `FilterBar`**:
   - Utworzenie przycisków filtrowania
   - Implementacja przycisku sortowania
   - Dodanie stanu aktywnego filtra
   - Dodanie obsługi dostępności (aria-pressed)

6. **Implementacja komponentu `FlashcardCard`**:
   - Utworzenie widoku tylko do odczytu
   - Dodanie trybu edycji
   - Implementacja walidacji pól
   - Dodanie przycisków akcji
   - Implementacja wskaźnika metody utworzenia

7. **Implementacja komponentu `FlashcardGrid`**:
   - Utworzenie gridu z responsywnym układem
   - Dodanie obsługi stanu ładowania (Spinner)
   - Implementacja komunikatu o braku fiszek

8. **Implementacja modalu potwierdzenia** (jeśli nie istnieje):
   - Utworzenie komponentu modalnego
   - Implementacja akcji potwierdzenia i anulowania
   - Dodanie animacji i dostępności

9. **Integracja komponentów w stronie Astro**:
    - Dodanie wszystkich komponentów do strony browse.astro
    - Konfiguracja układu strony
