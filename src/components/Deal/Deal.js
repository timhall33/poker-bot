import { generatePlayersCards , generateRandomNumbers, generateMiddleCards, getMiddleCards, getHandCards} from '../Cards/Cards';
import ButtonOptions from '../BettingOptions/BettingOptions';
import './Deal.css';
import React, { useState } from 'react';
import ShowCardsButton from '../ShowCardsButton/ShowCardsButton';
import { determineWinner, getHandRank } from '../../GameRules/GameRules'; 

const DealButton = () => {
  const [myCards, setMyCards] = useState(null);
  const [botCards, setBotCards] = useState(null);
  const [middleCards, setMiddleCards] = useState(null);
  const [showOpponentCards, setShowOpponentCards] = useState(false);
  const [middleCardsShown, setMiddleCardsShown] = useState(0);
  const [nums, setNums] = useState(null);



  const handleDealClick = () => {
    setMiddleCards(null)
    const newNums = generateRandomNumbers();
    const newMyCards = generatePlayersCards(newNums, 0, 1, false);
    const newBotCards = generatePlayersCards(newNums, 2, 3, true);
    const myCardLetters = getHandCards(newNums, 0, 1);
    const botCardLetters = getHandCards(newNums, 2, 3);
    const middleCardLetters = getMiddleCards(newNums);
    const myFullHand = myCardLetters.concat(middleCardLetters);
    const botFullHand = botCardLetters.concat(middleCardLetters);

    
    const hand = ['4D', 'AS', 'AD', '3H', '2C', '4C', '2D'];
    const myRank = getHandRank(myFullHand)
    const botRank = getHandRank(botFullHand)
    console.log("myRank: " + myRank);
    console.log("botRank: " + botRank);
    const winner = determineWinner(myFullHand, botFullHand);

   /*
    if (determineWinner(myRank, botRank) === 1) {
      console.log("You Win!")
    } else if (determineWinner(myRank, botRank) === 2) {
      console.log("Bot Wins!")
    } else {
      console.log("Its a tie")
    }
*/
    setMyCards(newMyCards);
    setBotCards(newBotCards);
    setShowOpponentCards(false);
    setMiddleCardsShown(0);
    setNums(newNums)


};

const handleCheckClick = () => {
  setMiddleCardsShown(prevCount => prevCount + 1);
  const newMiddleCards = generateMiddleCards(nums, middleCardsShown + 1);
  setMiddleCards(newMiddleCards);
};

  return (
    <div>
      {myCards}
      {showOpponentCards ? botCards : null}
      {middleCards}
      <ButtonOptions handleCheckClick={handleCheckClick} />
      <button className="deal-button" onClick={handleDealClick}>
        Deal
      </button>
      <ShowCardsButton setShowOpponentCards={setShowOpponentCards} />
    </div>
  );
};

export default DealButton;