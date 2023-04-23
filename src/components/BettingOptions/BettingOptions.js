import React from 'react';
import './BettingOptions.css';

const ButtonOptions = (props) => {

    return (
        <div class="buttons-container">
            <button class="poker-button" id="check-button" onClick={props.handleCheckClick}>Check/Call</button>
            <button class="poker-button" id="bet-button1" onClick={props.handleBet1Click}>Bet 2/3 Pot</button>
            <button class="poker-button" id="bet-button2" onClick={props.handleBet2Click}>Bet 2x Pot</button>
            <button class="poker-button" id="bet-button3" onClick={props.handleBet3Click}>Bet all in</button>
            <button class="poker-button" id="fold-button" onClick={props.handleFoldClick}>Fold</button>
        </div>
    );
  };

  export default ButtonOptions
  
