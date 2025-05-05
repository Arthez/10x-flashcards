```mermaid
flowchart LR
subgraph Legenda
  DE0[Domain Event]
  CMD0[Command]
  RM0[(Read Model)]
  POL0>Policy]
  AGG0{Aggregate}
  HS0/!/
  ACT0((Actor))
  EX0{{External System}}

  style DE0 fill:#FF9900,color:black
  style CMD0 fill:#1E90FF,color:white
  style RM0 fill:#32CD32,color:black
  style POL0 fill:#9932CC,color:white
  style AGG0 fill:#FFFF00,color:black
  style HS0 fill:#FF0000,color:white
  style ACT0 fill:#FFFF00,color:black
  style EX0 fill:#A9A9A9,color:white
end

subgraph System_Powtórek_Fiszek
  %% Actors
  ACT1((Zalogowany Użytkownik))
  EX1{{AI System}}
  EX2{{Backend DB}}

  %% Policies
  POL1>Generowanie 5 fiszek z tekstu]
  POL2>Losowanie następnej fiszki]
  POL3>Powiadomienie o końcu puli]
  POL4>Walidacja długości tekstu fiszki 2-200]
  POL5>Walidacja długości tekstu źródłowego 1k-10k]
  POL6>Obsługa błędów generowania]

  %% Hot Spots
  HS1/!/
  HS2/!/
  HS3/!/

  %% Aggregates
  AGG1{Kolekcja Fiszek}
  AGG2{Sesja Nauki}
  AGG3{Stan Fiszki}

  %% Read Models
  RM1[(Menu Nawigacji)]
  RM2[(Aktualna Fiszka)]
  RM3[(Przyciski Kontroli Fiszki)]
  RM4[(Komunikaty Walidacji)]
  RM5[(Komunikaty Błędów)]

  %% Commands for flashcard creation
  CMD1[Wygeneruj fiszki przez AI]
  CMD2[Zaakceptuj wygenerowane fiszki]
  CMD3[Dodaj fiszkę ręcznie]
  
  %% Commands for learning session
  CMD4[Rozpocznij sesję nauki]
  CMD5[Odwróć fiszkę]
  CMD6[Przerwij sesję]

  %% Events
  DE1[Fiszki zostały utworzone]
  DE2[Sesja nauki została rozpoczęta]
  DE3[Fiszka została wyświetlona]
  DE4[Fiszka została odwrócona]
  DE5[Odpowiedź została zweryfikowana]
  DE6[Kolejna fiszka została wylosowana]
  DE7[Wszystkie fiszki zostały przetworzone]
  DE8[Sesja nauki została zakończona]
  DE9[Sesja nauki została przerwana]
  DE10[Walidacja nie powiodła się]
  DE11[Generowanie fiszek nie powiodło się]

  %% Policy relationships
  CMD1 ==> POL1
  POL1 -.-> EX1
  DE5 ==> POL2
  POL2 -.-> DE6
  DE7 ==> POL3
  POL3 -.-> DE8
  CMD3 ==> POL4
  POL4 -.-> DE1
  POL4 -.-> DE10
  CMD1 ==> POL5
  POL5 -.-> POL1
  POL5 -.-> DE10
  EX1 ==> POL6
  POL6 -.-> DE11

  %% Relationships for flashcard creation
  ACT1 -.-> CMD1
  CMD1 -.-> EX1
  EX1 -.-> CMD2
  CMD2 -.-> DE1
  ACT1 -.-> CMD3
  CMD3 -.-> DE1

  %% Aggregate relationships
  AGG1 --- EX2
  DE1 --> AGG1
  AGG1 --> AGG2
  AGG2 --> AGG3
  AGG2 -.-> DE6
  AGG3 -.-> DE4

  %% Read Model relationships
  RM1 -.-> CMD1
  RM1 -.-> CMD3
  RM1 -.-> CMD4
  RM2 -.-> CMD5
  RM3 -.-> CMD5
  RM3 -.-> CMD6
  AGG1 -.-> RM1
  AGG3 -.-> RM2
  DE10 -.-> RM4
  DE11 -.-> RM5

  %% Relationships for learning session
  ACT1 -.-> CMD4
  ACT1 -.-> CMD5
  ACT1 -.-> CMD6
  CMD4 -.-> DE2
  CMD5 -.-> DE4
  CMD6 -.-> DE9

  %% Original event flow
  DE1 --> DE2
  DE2 --> DE3
  DE3 --> DE4
  DE4 --> DE5
  DE5 --> DE6
  DE6 --> DE3
  DE6 --> DE7
  DE7 --> DE8
  DE3 --> DE9
  DE4 --> DE9
  DE5 --> DE9

  %% Styles
  style DE1 fill:#FF9900,color:black
  style DE2 fill:#FF9900,color:black
  style DE3 fill:#FF9900,color:black
  style DE4 fill:#FF9900,color:black
  style DE5 fill:#FF9900,color:black
  style DE6 fill:#FF9900,color:black
  style DE7 fill:#FF9900,color:black
  style DE8 fill:#FF9900,color:black
  style DE9 fill:#FF9900,color:black
  style DE10 fill:#FF9900,color:black
  style DE11 fill:#FF9900,color:black
  style CMD1 fill:#1E90FF,color:white
  style CMD2 fill:#1E90FF,color:white
  style CMD3 fill:#1E90FF,color:white
  style CMD4 fill:#1E90FF,color:white
  style CMD5 fill:#1E90FF,color:white
  style CMD6 fill:#1E90FF,color:white
  style POL1 fill:#9932CC,color:white
  style POL2 fill:#9932CC,color:white
  style POL3 fill:#9932CC,color:white
  style POL4 fill:#9932CC,color:white
  style POL5 fill:#9932CC,color:white
  style POL6 fill:#9932CC,color:white
  style RM1 fill:#32CD32,color:black
  style RM2 fill:#32CD32,color:black
  style RM3 fill:#32CD32,color:black
  style RM4 fill:#32CD32,color:black
  style RM5 fill:#32CD32,color:black
  style AGG1 fill:#FFFF00,color:black
  style AGG2 fill:#FFFF00,color:black
  style AGG3 fill:#FFFF00,color:black
  style ACT1 fill:#FFFF00,color:black
  style EX1 fill:#A9A9A9,color:white
  style EX2 fill:#A9A9A9,color:white
  style HS1 fill:#FF0000,color:white
  style HS2 fill:#FF0000,color:white
  style HS3 fill:#FF0000,color:white

  %% Hot Spots
  HS1 -.- DE9
  %% Brak persystencji postępu
  HS2 -.- DE5
  %% Brak śledzenia poprawności odpowiedzi
  HS3 -.- DE7
  %% Brak statystyk sesji
end
