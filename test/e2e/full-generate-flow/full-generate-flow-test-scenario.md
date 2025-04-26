1. zaloguj sie (password i login dostępne w wpliku .env.test, plik .env.example zawiera nazwy pól dostępnych w .env.test)
2. Sprawdz następujące rzeczy: pokazuje się strona /learn oraz przycisk "Create Flashcard", nie ma żadnej fiszki (card)
3. Nacisnij "Browse" z top-nav bar
4. Sprawdz następujące rzeczy: pokazuje się strona /browse, upewnij się że wszystkie statystyki pokazują 0, nie ma żadnych fiszek (card) oraz pojawił się napis "No flashcards found. Create your first flashcard to get started!"
5. Nacisnij "Generate" w top-nav bar
6. Sprawdz następujące rzeczy: pokazuje się strona /generate, upewnij się że pojawił się napis "Generate Flashcards" w <h1>
7. Wpisz w textarea tekst: "some text"
8. upewnij się że przycisk "Generate Flashcards" jest wyłączony (stan disabled)
9. wpisz w textarea tekst: "Tygrys azjatycki, tygrys (Panthera tigris) – gatunek dużego, drapieżnego ssaka łożyskowego z podrodziny panter (Pantherinae) w rodzinie kotowatych (Felidae), największego ze współczesnych[a] pięciu gatunków dzikich kotów z rodzaju Panthera, jeden z największych drapieżników lądowych (wielkością ustępuje jedynie niektórym niedźwiedziom). Dorosłe samce osiągają ponad 300 kg masy ciała przy ponad 3 m całkowitej długości. Rekordowa masa ciała samca, z podgatunku tygrysa syberyjskiego, wynosi 423 kg. Dobrze skacze, bardzo dobrze pływa, poluje zwykle samotnie. Dawniej liczny w całej Azji, zawsze budzący grozę, stał się obiektem polowań dla sportu, pieniędzy lub prewencyjnej obrony (ludzi i zwierząt hodowlanych). Wytępiony w wielu regionach, zagrożony wyginięciem, został objęty programami ochrony. Największa dzika populacja żyje w Indiach (gdzie w niektórych regionach tygrysy są uważane za zwierzęta święte). Słowo „tygrys” pochodzi od greckiego wyrazu tigris, które z kolei ma najprawdopodobniej irańskie korzenie."
10. Naciśnij przycisk "Generate Flashcards"
11. Poczekaj aż pojawi się pięc propozycji fiszek (cards)
12. Zedytuj tekst na pierwszej karcie (na koniec front content dodaj: "EDITED"), zaakceptuj pierwsze trzy fiszki, na czwartej fiszce daj reject, z piątą fiszką nic nie rób
13. Nacisnij "Browse" w top-nav bar
14. Sprawdz, że pokazuje się strona /browse, upewnij się że występują nastepujące statystyki: AI unedited 2, AI edited 1, manual 0, AI rejected 2
15. Upewnij się że pokazują się 3 fiszki (cards)
16. Naciśnij filtr "AI edited"
15. Upewnij się że pokazuje się 1 fiszka (card)
17. Naciśnij "logout" w top-nav bar
18. Upewnij się że pokazuje się strona logowania
