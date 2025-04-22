# Specyfikacja modułu autentykacji (US-001)

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1. Frontend - widoki i komponenty

- Utworzę dedykowane strony autentykacyjne: `/auth/login`, `/auth/register`, oraz dwustopniowy proces resetowania hasła składający się z widoku `/auth/reset-password/request` (wysłanie linku resetującego) oraz widoku `/auth/reset-password/reset` (ustawienie nowego hasła), zlokalizowanych w katalogu `src/pages/auth`.
- Każda ze stron będzie oparta na Astro, wykorzystując istniejący system layoutów (np. `src/layouts`) oraz integrację z komponentami UI z biblioteki Shadcn/ui.
- Formularze rejestracji, logowania oraz resetowania hasła zostaną zaimplementowane jako komponenty React w katalogu `src/components/ui`, aby zapewnić interaktywność (walidacja, dynamiczne komunikaty błędów, observacja stanu formularza).
- Formy będą walidować dane wejściowe na poziomie client-side (np. za pomocą React state i/lub dedykowanych hooków) oraz zostaną poddane dodatkowej walidacji po stronie serwera w endpointach API.
- Walidacja obejmuje:
  - Pole email: sprawdzenie, czy zawiera znaki "@" i ".".
  - Pole hasło: minimum 4 znaki, złożone z liter i cyfr.
  - Dla rejestracji: weryfikację zgodności pola hasło z potwierdzeniem hasła.
- Komunikaty błędów (np. "Invalid email format", "Password must be at least 4 characters long and contain letters and numbers") będą wyświetlane bezpośrednio w formularzach.
- Po udanym logowaniu, widok główny aplikacji (np. `Learn`, `Browse`, `Add`, `Generate`) zostanie zmieniony, a w nagłówku pojawi się przycisk "Logout".
- W przypadku nieautoryzowanego dostępu do stron chronionych, użytkownik zostanie przekierowany do strony `/auth/login`.

### 1.2. Rozdzielenie odpowiedzialności między Astro a React

- Astro:
  - Odpowiada za renderowanie stron, layoutów oraz obsługę SSR, w tym przekazywanie informacji o stanie uwierzytelnienia za pośrednictwem `Astro.locals`.
  - Strony autentykacyjne są serwerowo renderowane z wyłączeniem prerenderingu (`export const prerender = false` lub `output: "server"`).
- React:
  - Zajmuje się interaktywnymi elementami formularzy, dynamiczną walidacją, zarządzaniem stanem komponentów i obsługą akcji użytkownika (np. wysyłaniem formularzy przez fetch do API).
- Podział odpowiedzialności gwarantuje, że logika uwierzytelnienia jest oddzielona od prezentacji interfejsu, co poprawia bezpieczeństwo i skalowalność aplikacji.

## 2. LOGIKA BACKENDOWA

### 2.1. Struktura endpointów API

- Endpointy autentykacyjne zostaną utworzone w katalogu `src/pages/api/auth`:
  - `login.ts` – obsługuje logowanie (metoda POST), wywołując `supabase.auth.signInWithPassword`.
  - `register.ts` – obsługuje rejestrację (metoda POST), wywołując `supabase.auth.signUp`.
  - `reset-password-request.ts` – endpoint do inicjowania procesu resetowania hasła poprzez wysłanie linku resetującego na e-mail (metoda POST).
  - `reset-password-reset.ts` – endpoint do zmiany hasła po weryfikacji tokenu z linku resetującego (metoda POST).
  - `logout.ts` – endpoint wylogowania, wykorzystujący `supabase.auth.signOut`.
- Endpointy będą przyjmować dane wejściowe w formacie JSON, walidować je przy użyciu np. biblioteki zod lub własnych mechanizmów walidacji.
- W przypadku błędów (np. niepoprawne dane, błąd Supabase) endpointy zwrócą odpowiedź HTTP 400 z komunikatem błędu.
- Wszystkie endpointy są zaprojektowane do działania w środowisku SSR, zgodnie z wytycznymi Astro (`export const prerender = false`).

### 2.2. Walidacja danych wejściowych i obsługa wyjątków

- Dane wejściowe (email, hasło, potwierdzenie hasła) są weryfikowane:
  - Obecność wszystkich wymaganych pól.
  - Format email – sprawdzenie obecności znaku "@" oraz kropki.
  - Hasło – minimalna długość 4 znaki, złożone z liter i cyfr.
- W przypadku nieprawidłowych danych, serwer odpowiada odpowiednimi komunikatami błędów, umożliwiając łatwą diagnostykę problemu dla użytkownika.
- Mechanizmy try-catch zapewnią obsługę wyjątków i błędów, z możliwością logowania krytycznych zdarzeń.

## 3. SYSTEM AUTENTYKACJI

### 3.1. Integracja z Supabase Auth

- Moduł autentykacji oparty jest na Supabase Auth, wykorzystującym pakiet `@supabase/ssr`:
  - Tworzona jest instancja Supabase za pomocą funkcji `createServerClient` (w module `src/db/supabase.client.ts`), która zarządza sesją i ciasteczkami przy użyciu metod `getAll` i `setAll`.
  - Wykorzystywane są funkcje: `supabase.auth.signUp`, `supabase.auth.signInWithPassword` oraz `supabase.auth.signOut` do odpowiednio rejestracji, logowania i wylogowywania użytkowników.
- Middleware (umieszczony np. w `src/middleware/index.ts`) sprawdza stan sesji użytkownika poprzez wywołanie `supabase.auth.getUser()`.
  - W przypadku, gdy użytkownik nie jest zalogowany, następuje przekierowanie do strony `/auth/login`.
- System zarządzania sesjami jest oparty o bezpieczne ciasteczka (httpOnly, secure, sameSite: 'lax'), co zapewnia zgodność z najlepszymi praktykami bezpieczeństwa.
- W przypadku resetowania hasła:
  - Proces składa się z dwóch etapów: (1) wysłania linku resetującego na adres e-mail użytkownika, realizowanego przez endpoint `reset-password-request.ts` (metoda POST), oraz (2) zmiany hasła po weryfikacji tokenu, realizowanej przez endpoint `reset-password-reset.ts` (metoda POST).

## Wnioski i podsumowanie

- Architektura modułu autentykacji została zaprojektowana zgodnie z wymaganiami projektu 10x-Flashcards, zapewniając spójne działanie aplikacji i bezpieczeństwo danych użytkowników.
- Podział odpowiedzialności między warstwę prezentacji (Astro + React) a logikę back-endową (API, Supabase Auth) umożliwia łatwą rozbudowę i utrzymanie systemu.
- Wdrożenie walidacji i odpowiedniej obsługi wyjątków zarówno po stronie klienta, jak i serwera, gwarantuje przyjazne doświadczenie użytkownika oraz stabilność aplikacji.
- Integracja z Supabase Auth oraz odpowiednia konfiguracja middleware zapewniają bezpieczne zarządzanie sesjami i autentykację, spełniając wymagania bezpieczeństwa i wydajności aplikacji. 
