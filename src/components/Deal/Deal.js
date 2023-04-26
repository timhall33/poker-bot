import { generatePlayersCards , generateRandomNumbers, generateMiddleCards, getMiddleCards, getHandCards} from '../Cards/Cards';
import ButtonOptions from '../BettingOptions/BettingOptions';
import './Deal.css';
import React, { useState } from 'react';
import ShowCardsButton from '../ShowCardsButton/ShowCardsButton';
import { determineWinner, getHandRank } from '../../GameRules/GameRules'; 
import PlayerBetBox from '../PlayerBets/PlayerBets';
import { BotBetBox } from '../PlayerBets/PlayerBets';
import { getPot, RenderPot, resetPot, setPot } from '../Money/Money';
import RenderMoneyInHand from '../Money/Money';
import Player from '../Player/Player';
import { player1, player2 } from '../StartGame/StartGame';
import { EndRound, endRound } from '../../EndRound/EndRound';
import TexasHoldEm from '../../CFR/Cfr';

const DealButton = () => {
  const [myCards, setMyCards] = useState(null);
  const [botCards, setBotCards] = useState(null);
  const [middleCards, setMiddleCards] = useState(null);
  const [showOpponentCards, setShowOpponentCards] = useState(false);
  const [middleCardsShown, setMiddleCardsShown] = useState(0);
  const [nums, setNums] = useState(null);
  const [playerBetAmount, setPlayerBetAmount] = useState(0); 
  const [botBetAmount, setBotBetAmount] = useState(0); 
  const [potAmount, setPotAmount] = useState(getPot());
  const [myFullHand, setMyFullHand] = useState([]);
  const [botFullHand, setBotFullHand] = useState([]);
  const [roundEnded, setRoundEnded] = useState(false);
  const [winner, setWinner] = useState("");
  const [bigBlind, setBigBlind] = useState(true);



  
  const handlePlayerBetAmountChange = (newBetAmount) => {
    setPot(newBetAmount);
    setPotAmount(getPot())
    setPlayerBetAmount(newBetAmount);
  };

  const handleBotBetAmountChange = (newBetAmount) => {
    setPot(newBetAmount)
    setPotAmount(getPot())
    setBotBetAmount(newBetAmount);
  };

  const handleDealClick = () => {
    const pokerGame = new TexasHoldEm();
    const numIterations = 1; // Choose the number of iterations to run
    pokerGame.train(numIterations);

    setRoundEnded(false)
    resetPot();
    let startingBet1 = 10
    let startingBet2 = 10
    if (bigBlind) {
      startingBet2 = 5
    } else {
      startingBet1 = 5
    }
    setBigBlind(prev => !prev)
    if (player1.getMoney() >= startingBet1) {
      player1.removeMoney(startingBet1);
    } else {
      player1.removeMoney(player1.getMoney())
    }
    if (player2.getMoney() >= startingBet2) {
      player2.removeMoney(startingBet2);
    } else {
      player2.removeMoney(player2.getMoney())
    }
    handlePlayerBetAmountChange(startingBet1);
    handleBotBetAmountChange(startingBet2);

    setMiddleCards(null);
    const newNums = generateRandomNumbers();
    const newMyCards = generatePlayersCards(newNums, 0, 1, false);
    const newBotCards = generatePlayersCards(newNums, 2, 3, true);
    const myCardLetters = getHandCards(newNums, 0, 1);
    const botCardLetters = getHandCards(newNums, 2, 3);
    const middleCardLetters = getMiddleCards(newNums);
    setMyFullHand(myCardLetters.concat(middleCardLetters));
    setBotFullHand(botCardLetters.concat(middleCardLetters));
    const myRank = getHandRank(myFullHand);
    const botRank = getHandRank(botFullHand);

    setMyCards(newMyCards);
    setBotCards(newBotCards);
    setShowOpponentCards(false);
    setMiddleCardsShown(0);
    setNums(newNums)


};

const handleCheckClick = () => {
  setMiddleCardsShown(prevCount => prevCount + 1);
  handlePlayerBetAmountChange(0);
  handleBotBetAmountChange(0);
  if (middleCardsShown === 3) {
    setWinner(determineWinner(myFullHand, botFullHand));
    setRoundEnded(true);
    setShowOpponentCards(true);
  } else {
    const newMiddleCards = generateMiddleCards(nums, middleCardsShown + 1);
    setMiddleCards(newMiddleCards);
  }
};

const handleBet1Click = () => {
  setMiddleCardsShown(prevCount => prevCount + 1);
  let betSize1 = Math.floor(getPot() * 2 / 3);
  let betSize2 = Math.floor(getPot() * 2 / 3);
  if (player1.getMoney() < betSize1) {
    betSize1 = player1.getMoney();
  }
  player1.removeMoney(betSize1)

  if (player2.getMoney() < betSize2) {
    betSize2 = player2.getMoney();
  }
  player2.removeMoney(betSize2);

  handlePlayerBetAmountChange(betSize1);
  handleBotBetAmountChange(betSize2);
  if (middleCardsShown === 3) {
    setWinner(determineWinner(myFullHand, botFullHand));
    setRoundEnded(true);
    setShowOpponentCards(true);
  } else {
    const newMiddleCards = generateMiddleCards(nums, middleCardsShown + 1);
    setMiddleCards(newMiddleCards);
  }
};

const handleBet2Click = () => {
  setMiddleCardsShown(prevCount => prevCount + 1);
  let betSize1 = Math.floor(getPot() * 2);
  let betSize2 = Math.floor(getPot() * 2);
  if (player1.getMoney() < betSize1) {
    betSize1 = player1.getMoney();
  }
  player1.removeMoney(betSize1)

  if (player2.getMoney() < betSize2) {
    betSize2 = player2.getMoney();
  }
  player2.removeMoney(betSize2);

  handlePlayerBetAmountChange(betSize1);
  handleBotBetAmountChange(betSize2);
  if (middleCardsShown === 3) {
    setWinner(determineWinner(myFullHand, botFullHand));
    setRoundEnded(true);
    setShowOpponentCards(true);
  } else {
    const newMiddleCards = generateMiddleCards(nums, middleCardsShown + 1);
    setMiddleCards(newMiddleCards);
  }
};

const handleBet3Click = () => {
  setMiddleCardsShown(prevCount => prevCount + 1);
  const betSize1 = player1.getMoney();
  const betSize2 = player2.getMoney();
  player1.removeMoney(betSize1);
  player2.removeMoney(betSize2);
  handlePlayerBetAmountChange(betSize1);
  handleBotBetAmountChange(betSize2);
  if (middleCardsShown === 3) {
    setWinner(determineWinner(myFullHand, botFullHand));
    setRoundEnded(true);
    setShowOpponentCards(true);
  } else {
    const newMiddleCards = generateMiddleCards(nums, middleCardsShown + 1);
    setMiddleCards(newMiddleCards);
  }
};

const handleFoldClick = () => {
  const betsize = getPot();
  player2.addMoney(betsize);
  setWinner("Bot wins.");
  setRoundEnded(true);
};

  return (
    <div>
      <RenderMoneyInHand />
      <RenderPot potAmount={potAmount} />
      <PlayerBetBox betAmount={playerBetAmount} onBetAmountChange={handlePlayerBetAmountChange} />
      <BotBetBox betAmount={botBetAmount} onBetAmountChange={handleBotBetAmountChange}/>
      {myCards}
      {showOpponentCards ? botCards : null}
      {middleCards}
      {roundEnded ? (
        <EndRound winner = {winner}/>
      ) : (
        <ButtonOptions
          handleCheckClick={handleCheckClick}
          handleBet1Click={handleBet1Click}
          handleBet2Click={handleBet2Click}
          handleBet3Click={handleBet3Click}
          handleFoldClick={handleFoldClick}
        />
      )}
      <button className="deal-button" onClick={handleDealClick}>
        Deal
      </button>
      <ShowCardsButton setShowOpponentCards={setShowOpponentCards} />
    </div>
  );
};

export default DealButton;