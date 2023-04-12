import React from 'react';
import { generatePlayersCards , generateRandomNumbers, generateMiddleCards} from '../Cards/Cards';
import './Deal.css';
import ReactDOM from 'react-dom'; 

const handleDealClick = () => {
  const nums = generateRandomNumbers();
  const myCards = generatePlayersCards(nums, 0, 1);
  const botCards = generatePlayersCards(nums, 2, 3);
  const middleCards = generateMiddleCards(nums);
  ReactDOM.render(myCards, document.getElementById('my-cards'));
  ReactDOM.render(botCards, document.getElementById('bot-cards'));
  ReactDOM.render(middleCards, document.getElementById('middle-cards'));
};


const DealButton = () => {

  return (
      <button className="deal-button" onClick={handleDealClick}>
      Deal
      </button>
  );
};

export default DealButton;