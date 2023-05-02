./src/CFR
Cfr.js- This is the CFR algorithm that trains the bot. The result of training is loaded to a JSON file that can be retrieved later. 

./src/components

BettingOptions:
BettingOptions.js- React component that contains all the buttons for different betting options
BettingOptions.css- styling for this component

Cards:
Cards.js- React components to deal with card functioninality for hole and community cards
Cards.css- styling for this component

Deal:
Deal.js- React component for the deal button. Contains most of the functionality for the game tree including updating the round and getting bot actions. 
Deal.css- styling for this component

Header:
Header.js- contains the title of the pagee
Header.css- styling for this component

Money:
Money.js- components for the pot and total amount of money that the player and bot start with each round
Money.css- styling for this component

Player:
Player.js- constructor for a player object that contains, a name, money amount, cards in hand, and total winnings. 

PlayerBets:
PlayerBets.js- component for the current player bets
PlayerBets.css- styling for this component

PokerTable:
PokerTable.js- component for the poker table background
PokerTable.css- styling for this component

ShowCardsButton:
ShowCardsButton.js- component for seeing the bot cards
ShowCardsButton.css- styling for this component

StartGame:
StartGame.js- creates two new players for the game 

./src/EndRound: 
EndRound.js- compontent for displaying the winner
EndRound.css- styling for this component

./src/GameRules: 
GameRules.js- defines functions to determine the winner of the game based on hand ranks. 

./public
images: containes png for every card and jpg for the poker table picture
trainedData.json: contains trained data for 10,000 iterations
trainedData.json2: contains trained data for 100,000 iterations
trainedData.json3: contains trained data for 1 iteration