import React, { useState, useEffect} from 'react';
import Player from '../Player/Player';
import './PlayerBets.css'; // Import the CSS file for styling

const PlayerBetBox = ({ betAmount }) => {
    const [currentBetAmount, setCurrentBetAmount] = useState(betAmount); // State for the current bet amount
  
    useEffect(() => {
      // Update the current bet amount state when the betAmount prop changes
      setCurrentBetAmount(betAmount);
    }, [betAmount]);
  
    return (
      <div className="app-container">
        <div className="player-bet-box">
          <p className="player-bet-text">Current Bet:</p>
          <p className="player-bet-amount">${currentBetAmount}</p>
        </div>
      </div>
    );
};

export const BotBetBox = ({ betAmount }) => {
    const [currentBetAmount, setCurrentBetAmount] = useState(betAmount); // State for the current bet amount
  
    useEffect(() => {
      // Update the current bet amount state when the betAmount prop changes
      setCurrentBetAmount(betAmount);
    }, [betAmount]);
  
    return (
      <div className="app-container">
          <div className="bot-bet-box">
              <p className="player-bet-text">Current Bet:</p>
              <p className="player-bet-amount">${currentBetAmount}</p>
          </div>
      </div>
    );
  };

export default PlayerBetBox;
