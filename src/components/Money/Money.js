import './Money.css'
import React, { useEffect, useState } from 'react';
import { player1, player2 } from '../StartGame/StartGame';

let pot = 0;

export const setPot = (newBet) =>{
    pot += newBet;
}

export const getPot = () => {
    return pot;
}

export const resetPot = () =>{
    pot = 0;
}

export const RenderPot = ({potAmount}) => {
  return (
    <div>
      <div className="pot-amount-box">
        <h2 className="pot-amount-heading">Pot Amount</h2>
        <p className="pot-amount-value">{`$${potAmount}`}</p>
      </div>
    </div>
  );
};

const RenderMoneyInHand = () => {
  
    const renderMoneyBox = () => {
      const totalMoney = player1.getMoney();
      return (
        <div className="money-box">
          <h2>My Money</h2>
          <p>Total Amount: ${totalMoney}</p>
        </div>
      );
    };

    const renderBotMoneyBox = () => {
        const botMoney = player2.getMoney();
        return (
            <div className="bot-money-box">
                <h2>Bot Money</h2>
                <p>Total Amount: ${botMoney}</p>
            </div>
        );
      };
  
    return (
      <div className= "money-container">
        {renderBotMoneyBox()}
        {renderMoneyBox()}
      </div>
    );
};

export default RenderMoneyInHand;

