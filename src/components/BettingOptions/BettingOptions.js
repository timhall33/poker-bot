import React from 'react';
import './BettingOptions.css';

const ButtonOptions = (props) => {

    return (
        <div class="buttons-container">
            <button class="poker-button" id="check-button" onClick={props.handleCheckClick}>Check</button>
            <button class="poker-button" id="bet-button">Bet</button>
            <button class="poker-button" id="fold-button">Fold</button>
        </div>
    );
  };

  export default ButtonOptions
  
