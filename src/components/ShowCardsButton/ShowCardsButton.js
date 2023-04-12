import React from 'react';
import './ShowCardsButton.css';

const ShowCardsButton = ({ setShowOpponentCards }) => {

    return (
        <div className="show-opponent-cards-button-container">
            <button className="show-opponent-cards-button" onClick={() => setShowOpponentCards(true)}>
                Show Opponent Cards
            </button>
        </div>
    );
  };

  export default ShowCardsButton;  
