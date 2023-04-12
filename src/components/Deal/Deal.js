import { generatePlayersCards , generateRandomNumbers, generateMiddleCards} from '../Cards/Cards';
import ButtonOptions from '../BettingOptions/BettingOptions';
import './Deal.css';
import React, { useState } from 'react';
import ShowCardsButton from '../ShowCardsButton/ShowCardsButton';

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

    setMyCards(newMyCards);
    setBotCards(newBotCards);
    setShowOpponentCards(false);
    setMiddleCardsShown(0);
    setNums(newNums)
};

const handleCheckClick = () => {
  console.log("check button clicked");
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