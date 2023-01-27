Spaceman pseudocode:

Steps:
1) delcare array of secret words
2) declare array of letters to choose from

3) randomly select secret word
4) get length of secret word
5) display length of secret word to user but with _
6) display letters

7) declare guesses variable

loop: 
8) check for a win
  8a) if: (win)
    8a-1) string of secret word = string of user guess
    8a-2) display message that the user won
    8a-3) end game
  8b) else: (no win)
    8b-1) continue to step 9
9) prompt user to choose a letter
10) if: 
  10a) letter is included in secret word:
    10a-1) find location(s) of letter in secret word array
    10a-2) display the letter to the user in that location
  10b) else (letter is not in word):
    10b-2) remove letter from letter list
    10b-3) add part of spaceman
    10b-4) add 1 to guesses
      10b-5) if guesses = 5:
        10b-6) end the game
        10b-7) display a message that the user lost
      10b-8) else:
        10b-10)continue the game

11) at game end, allow restart