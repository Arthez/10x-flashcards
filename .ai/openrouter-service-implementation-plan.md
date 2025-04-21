# OpenRouter Service Implementation Plan

## 1. Opis usługi
OpenRouter to usługa integrująca się z interfejsem API OpenRouter, która umożliwia generowanie odpowiedzi w czacie opartym na modelach LLM. Usługa ta jest kluczowym elementem systemu 10x-Flashcards, ponieważ:

Kluczowe komponenty usługi:
1. Inicjalizacja i konfiguracja: Pobiera ustawienia i klucze API z plików środowiskowych oraz inicjalizuje klienta HTTP.
2. Payload Builder: Łączy komunikaty systemowe i użytkownika w spójny payload.
3. Metoda wysyłki zapytania (sendChatCompletion): Wysyła payload do OpenRouter API i odbiera odpowiedzi.
4. Response Handler: Waliduje otrzymaną odpowiedź zgodnie z predefiniowanym schematem JSON (response_format).
5. Zarządzanie parametrami modelu: Ustala nazwę modelu (np. "gpt-4") oraz parametry, takie jak temperatura i max_tokens.
6. Obsługa błędów: Implementuje mechanizmy logowania i fallback dla różnych scenariuszy błędów.
7. Integruje się z interfejsem użytkownika, umożliwiając dynamiczną wymianę informacji i prezentację wyników (np. w formie flashcards).

## 2. Opis konstruktora
Konstruktor usługi (np. `OpenRouterService`) odpowiada za:

1. Inicjalizację konfiguracji pobranej z plików .env, w tym kluczy API i adresu bazowego API.
2. Utworzenie instancji klienta HTTP (np. opartego na axios) z odpowiednimi ustawieniami timeoutów i mechanizmami retry.
3. Ustawienie domyślnych wartości dla nazwy modelu, parametrów modelu i komunikatów (systemowego oraz użytkownika).

## 3. Publiczne metody i pola
**Publiczne metody:**

1. `sendChatCompletion(userMessage: string, context?: object): Promise<object>`
   - Łączy komunikat systemowy i komunikat użytkownika, budując payload do wysłania do OpenRouter API.
   - Odbiera odpowiedź i waliduje ją według zdefiniowanego schematu `response_format`.

2. `setModelParameters(parameters: object): void`
   - Umożliwia dynamiczną aktualizację parametrów modelu (np. temperatura, max_tokens, top_p).

3. `getResponseFormat(): object`
   - Zwraca aktualnie zdefiniowany schemat odpowiedzi odpowiadający wzorowi:
     ```
     { type: 'json_schema', json_schema: { name: 'flashcard-schema', strict: true, schema: { question: 'string', answer: 'string' } } }
     ```

**Publiczne pola:**

1. `apiKey: string` – Klucz API potrzebny do autoryzacji z OpenRouter API.
2. `baseURL: string` – Bazowy adres URL interfejsu OpenRouter API.
3. `modelName: string` – Nazwa modelu, np. "gpt-4".
4. `modelParameters: object` – Obiekt zawierający parametry modelu, takie jak temperatura (np. 0.7), max_tokens (np. 150) itp.

## 4. Prywatne metody i pola
**Prywatne metody:**

1. `_buildPayload(userMessage: string, systemMessage: string): object`
   - Tworzy obiekt payload, łączący komunikat systemowy (np. "You are a helpful assistant for generating flashcards") oraz komunikat użytkownika.

2. `_handleResponse(response: any): object`
   - Waliduje odpowiedź otrzymaną z OpenRouter API, wykorzystując predefiniowany `response_format`:
     ```javascript
     { type: 'json_schema', json_schema: { name: 'flashcard-schema', strict: true, schema: { question: 'string', answer: 'string' } } }
     ```

3. `_logError(error: Error): void`
   - Rejestruje błędy w bezpieczny sposób, unikając ujawnienia danych wrażliwych.

**Prywatne pola:**

1. `_httpClient: any` – Instancja klienta HTTP skonfigurowana z retry logic i timeoutami.
2. `_logger: any` – Mechanizm logowania błędów i zdarzeń w systemie.
3. `_defaultMessages: object` – Predefiniowane komunikaty systemowe i ustawienia, które mogą być nadpisywane dynamicznie.

## 5. Obsługa błędów
**Potencjalne scenariusze błędów i wyzwania:**

1. Błąd sieci lub timeout
   - Wyzwanie: Utrata połączenia z API lub opóźnienia w odpowiedzi.
   - Rozwiązania:
     1. Implementacja retry logic z wykładniczym backoffem.
     2. Powiadamianie użytkownika o problemie oraz zapisywanie szczegółowych logów.

2. Błąd walidacji odpowiedzi (ResponseSchemaError)
   - Wyzwanie: Otrzymanie odpowiedzi niezgodnej z predefiniowanym `response_format`.
   - Rozwiązania:
     1. Wdrożenie walidatora JSON schema, który rejestruje rozbieżności.
     2. Zastosowanie mechanizmu fallback w przypadku niepoprawnej struktury danych.

4. Błąd nieoczekiwanego formatu odpowiedzi
   - Wyzwanie: Parser nie potrafi przetworzyć odpowiedzi.
   - Rozwiązania:
     1. Wyraźne komunikaty błędu i logowanie niezgodności.
     2. Mechanizm fallback umożliwiający ponowne żądanie danych lub eskalację problemu.

## 6. Kwestie bezpieczeństwa
1. Przechowywanie wrażliwych danych, takich jak klucze API, w plikach `.env` i wykorzystywanie zmiennych środowiskowych.
2. Wykorzystywanie bezpiecznego połączenia (HTTPS) do komunikacji z OpenRouter API.
3. Zapewnienie, aby żadne dane wrażliwe nie były logowane lub ujawniane w komunikatach błędów.


## 7. Plan wdrożenia krok po kroku
1. **Konfiguracja środowiska:**
   - Upewnij się, że plik `.env` zawiera wszystkie wymagane zmienne, takie jak `OPENROUTER_API_KEY` i `OPENROUTER_MODEL`.
   - Zainstaluj niezbędne zależności (np. axios lub inny klient HTTP).

2. **Implementacja modułu OpenRouter:**
   - Utwórz klasę `OpenRouterService` w katalogu `./src/lib/services`, zgodnie ze strukturą projektu.
   - Zaimplementuj konstruktor, który wczytuje konfigurację i inicjalizuje klienta HTTP.

3. **Implementacja metody `sendChatCompletion`:**
   - Zintegruj metodę `_buildPayload`, która łączy komunikat systemowy i użytkownika. Przykład:
     - Komunikat systemowy: "You are a helpful assistant for generating flashcards."
     - Komunikat użytkownika: dynamicznie pobierany z interfejsu użytkownika.
   - Ustal format odpowiedzi (`response_format`) z przykładem:
     ```javascript
     { type: 'json_schema', json_schema: { name: 'flashcard-schema', strict: true, schema: { question: 'string', answer: 'string' } } }
     ```
   - Określ nazwę modelu (np. "gpt-4") oraz ustaw parametry modelu (np. temperatura: 0.7, max_tokens: 150).

4. **Integracja z interfejsem użytkownika:**
   - Połącz metodę `sendChatCompletion` z komponentami React/ASTRO (lokalizacja: `./src/components`), zapewniając obsługę stanów (loading, error) oraz prezentację wyników.
   - Testuj interakcje użytkownika, symulując różne scenariusze wejścia i otrzymując ustrukturyzowane odpowiedzi.

5. **Implementacja obsługi błędów:**
   - Dodaj mechanizmy try-catch wokół wywołań do OpenRouter API.
   - Zaimplementuj retry logic, walidację odpowiedzi i szczegółowe logowanie błędów przy użyciu metody `_logError`.
   - Uwzględnij fallback dla krytycznych błędów (np. ponowne wysyłanie żądania lub informowanie użytkownika o problemie).

---

**Podsumowanie:**
Plan wdrożenia usługi OpenRouter obejmuje konfigurację środowiska, implementację krytycznych metod, integrację z front-endem oraz solidną obsługę błędów i kwestii bezpieczeństwa. Dzięki temu deweloperzy będą mieli klarowne wytyczne, jak prawidłowo integrować i wdrażać tę usługę w ramach projektu 10x-Flashcards. 
