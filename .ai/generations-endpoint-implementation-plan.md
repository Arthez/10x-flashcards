# API Endpoint Implementation Plan: POST /api/generations/generate

## 1. Przegląd punktu końcowego
Endpoint służy do inicjowania sesji generowania fiszek przy użyciu AI. Przyjmuje tekst wejściowy, przetwarza go przez model AI i zwraca propozycje fiszek wraz z metadanymi sesji generowania.

## 2. Szczegóły żądania
- Metoda HTTP: POST
- Struktura URL: `/api/generations/generate`
- Parametry:
  - Wymagane:
    - `input_text`: String (1000-10000 znaków)
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer {supabase-jwt-token}`
- Request Body:
```typescript
{
  input_text: string; // 1000-10000 znaków
}
```

## 3. Wykorzystywane typy
```typescript
// Command model
interface GenerateFlashcardsCommand {
  input_text: string;
}

// Response DTOs
interface GenerationResponseDTO {
  generation_id: string;
  proposals: FlashcardProposalDTO[];
  ai_model: string;
  generation_time_ms: number;
  total_generated: number;
}

interface FlashcardProposalDTO {
  front_content: string;
  back_content: string;
}
```

## 4. Szczegóły odpowiedzi
- Sukces (200 OK):
```typescript
{
  generation_id: string;      // UUID sesji generowania
  proposals: Array<{         // Lista propozycji fiszek
    front_content: string;   // 2-200 znaków
    back_content: string;    // 2-200 znaków
  }>;
  ai_model: string;          // Nazwa użytego modelu AI
  generation_time_ms: number; // Czas generowania w ms
  total_generated: number;    // Liczba wygenerowanych propozycji
}
```
- Błędy:
  - 400: Nieprawidłowa długość tekstu lub format
  - 401: Brak autoryzacji
  - 429: Przekroczono limit żądań
  - 500: Błąd serwera/AI
  - 503: Usługa niedostępna

## 5. Przepływ danych
1. Walidacja żądania i autoryzacja użytkownika
2. Utworzenie rekordu w tabeli `generations`
3. Przetworzenie tekstu przez model AI
4. Walidacja i formatowanie propozycji fiszek
5. Aktualizacja rekordu `generations`
6. Zwrócenie odpowiedzi (na tym etapie skorzystamy z mocków zamiast wywoływania serwisu który łączy się z  AI)

## 6. Względy bezpieczeństwa
1. Autoryzacja:
   - Wymagane uwierzytelnienie przez Supabase
   - Weryfikacja tokena JWT
   - Przestrzeganie polityk RLS

2. Walidacja danych:
   - Sanityzacja input_text przed wysłaniem do AI
   - Walidacja długości i formatu propozycji
   - Zabezpieczenie przed SQL injection

## 7. Obsługa błędów
1. Walidacja wejścia:
```typescript
if (input_text.length < 1000 || input_text.length > 10000) {
  throw new BadRequestError("Input text must be between 1000 and 10000 characters");
}
```

2. Błędy AI:
- Timeout: Przerwanie po 45s
- Błędna odpowiedź: Zapis do tabeli generations (pole error)

3. Błędy bazy danych:
- Rollback transakcji
- Informowanie użytkownika

## 8. Rozważania dotyczące wydajności
1. Optymalizacja:
   - Buforowanie częstych zapytań
   - Indeksowanie tabeli generations
   - Asynchroniczne przetwarzanie

## 9. Etapy wdrożenia
1. Utworzenie struktury plików:
```
src/
  ├── pages/
  │   └── api/
  │       └── generations/
  │           └── generate.ts
  ├── lib/
  │   └── services/
  │       ├── generation.service.ts
  │       └── ai.service.ts
  └── schemas/
      └── generation.schema.ts
```

2. Implementacja schematu walidacji (Zod):
```typescript
export const generateFlashcardsSchema = z.object({
  input_text: z.string()
    .min(1000, "Input text must be at least 1000 characters")
    .max(10000, "Input text must not exceed 10000 characters")
});
```

3. Implementacja GenerationService:
```typescript
class GenerationService {
  async generateFlashcards(userId: string, input: GenerateFlashcardsCommand): Promise<GenerationResponseDTO>;
  private async createGenerationRecord(userId: string): Promise<string>;
  private async updateGenerationRecord(id: string, data: Partial<Generation>): Promise<void>;
}
```

4. Implementacja endpointu:
```typescript
export const POST: APIRoute = async ({ request, locals }) => {
  const { user } = await locals.supabase.auth.validateRequest();
  const data = await request.json();
  const result = await generationService.generateFlashcards(user.id, data);
  return json(result);
};
```
