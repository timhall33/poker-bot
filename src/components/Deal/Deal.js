import React from 'react';
import { generatePlayersCards , generateRandomNumbers} from '../Cards/Cards';
import './Deal.css';
import ReactDOM from 'react-dom'; 


const DealButton = () => {
  const handleDealClick = () => {
    const nums = generateRandomNumbers();
    const cardImages = generatePlayersCards(nums);
    ReactDOM.render(cardImages, document.getElementById('my-cards'));
  };

  return (
    <div>
      <div className="deal-button-container">
          <button className="deal-button" onClick={handleDealClick}>
          Deal
          </button>
      </div>
      <div id="my-cards"></div>
    </div>
  );
};

export default DealButton;