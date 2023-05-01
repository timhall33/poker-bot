import { generatePlayersCards , generateRandomNumbers, generateMiddleCards, getMiddleCards, getHandCards} from '../Cards/Cards';
import ButtonOptions from '../BettingOptions/BettingOptions';
import './Deal.css';
import React, { useState, useEffect } from 'react';
import ShowCardsButton from '../ShowCardsButton/ShowCardsButton';
import { determineWinner, getHandRank } from '../../GameRules/GameRules'; 
import PlayerBetBox from '../PlayerBets/PlayerBets';
import { BotBetBox } from '../PlayerBets/PlayerBets';
import { getPot, RenderPot, resetPot, setPot } from '../Money/Money';
import RenderMoneyInHand from '../Money/Money';
import Player from '../Player/Player';
import { player1, player2 } from '../StartGame/StartGame';
import { EndRound, endRound } from '../../EndRound/EndRound';
import { getBotAction } from '../../CFR/Cfr';
import { last } from 'lodash';

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
  const [botCardLetters, setBotCardLetters] = useState([]);
  const [middleCardLetters, setMiddleCardLetters] = useState([]);
  const [history, setHistory] = useState('');
  const [round, setRound] = useState(0);


  const updateBotAction = (action, holeCards, communityCards, pot, round, newNums) => {
    const lastAction = history.slice(-1);
    let options = ['f', 'c', 'b', 'x', 'a'];
    if (lastAction === 'c') {
      options = ['c', 'b', 'x', 'a']
    } else if (lastAction === 'b' || lastAction === 'x' || lastAction === 'a') {
      options = ['f', 'c'];
    }
    console.log("options for bot to choose from: " + options)
    getBotAction(action, holeCards, communityCards, pot, round, options)
    .then(botAction => {
      if (botAction === 'a') {
        setHistory((prev) => {
          const updatedHistory = prev + 'a'
          const betSize = player2.getMoney();
          player2.removeMoney(betSize);
          handleBotBetAmountChange(betSize);
          updateRound(updatedHistory);
          return updatedHistory
        });
      } else if (botAction === 'c') {
        setHistory((prev) => {
          const updatedHistory = prev + 'c'
          const betSize = playerBetAmount - botBetAmount;
          player2.removeMoney(betSize);
          handleBotBetAmountChange(betSize);
          updateRound(updatedHistory);
          return updatedHistory
        });
      } else if (botAction === 'b') {
        setHistory((prev) => {
          const updatedHistory = prev + 'b'
          let betSize = Math.floor(getPot() * 2 / 3);
          if (player2.getMoney() < betSize) {
            betSize = player2.getMoney();
          }
          player2.removeMoney(betSize);
          handleBotBetAmountChange(betSize);
          updateRound(updatedHistory);
          return updatedHistory
        });
      } else if (botAction === 'x') {
        setHistory((prev) => {
          const updatedHistory = prev + 'x'
          let betSize = Math.floor(getPot() * 2);
          if (player2.getMoney() < betSize) {
            betSize = player2.getMoney();
          }
          player2.removeMoney(betSize);
          handleBotBetAmountChange(betSize);
          updateRound(updatedHistory);
          return updatedHistory
        });
      } else {
        const betsize = (getPot() - playerBetAmount)/2;
        player1.addWinnings(betsize);
        player2.addWinnings(-1 * betsize);
        setWinner("You win.");
        const newMiddleCards = generateMiddleCards(newNums, 4);
        setMiddleCards(newMiddleCards);
        setRoundEnded(true);
      }
    })
    .catch(error => {
      console.error("Error getting bot action:", error);
    });
    
  }
  
  const handlePlayerBetAmountChange = (newBetAmount) => {
    setPot(newBetAmount);
    setPotAmount(getPot())
    setPlayerBetAmount((prev) => prev + newBetAmount);
  };

  const handleBotBetAmountChange = (newBetAmount) => {
    setPot(newBetAmount)
    setPotAmount(getPot())
    setBotBetAmount((prev) => prev + newBetAmount);
  };

  const updateRound = (updatedHistory) => {
    console.log("history: " + updatedHistory);
    const lastTwoActions = updatedHistory.slice(-2);
    let numUpdates = 0;
        for (let i = 1; i < updatedHistory.length; i++) {
            let last = updatedHistory[i - 1];
            if (last === 'b' && updatedHistory[i] === 'c') {
                i++
                numUpdates++;
            } else if (last === 'x' && updatedHistory[i] === 'c') {
                i++
                numUpdates++;
            } else if (last === 'c' && updatedHistory[i] === 'c') {
                i++
                numUpdates++;
            }
        }
    if ((lastTwoActions === 'cc' && numUpdates > round) || lastTwoActions === 'bc' || lastTwoActions === 'xc') {
      setPlayerBetAmount(0);
      setBotBetAmount(0);
      setMiddleCardsShown(prevCount => prevCount + 1);
      if (middleCardsShown === 3) {
        const winner = determineWinner(myFullHand, botFullHand)
        setWinner(winner);
        if (winner === "Bot wins.") {
          player2.addWinnings(getPot()/2)
          player1.addWinnings(-1 *  getPot()/2)
        } else if (winner === "You Win!") {
          player1.addWinnings(getPot()/2)
          player2.addWinnings(-1 *  getPot()/2)
        }
        setRoundEnded(true);
        setShowOpponentCards(true);
      } else {
        const newMiddleCards = generateMiddleCards(nums, middleCardsShown + 1);
        setMiddleCards(newMiddleCards);
      }
      setRound((prev) => prev + 1);
      const curRound = round;
      setMiddleCardLetters(getMiddleCards(nums)[curRound + 1]);
    }    
    if (lastTwoActions === 'ac') {
      const winner = determineWinner(myFullHand, botFullHand)
      setWinner(winner);
      if (winner === "Bot wins.") {
        player2.addWinnings(getPot()/2)
        player1.addWinnings(-1 *  getPot()/2)
      } else if (winner === "You Win!") {
        player1.addWinnings(getPot()/2)
        player2.addWinnings(-1 *  getPot()/2)
      }
        setRoundEnded(true);
        setShowOpponentCards(true);
        const newMiddleCards = generateMiddleCards(nums, 4);
      setMiddleCards(newMiddleCards);
    }

    if (lastTwoActions === 'aa') {
      const winner = determineWinner(myFullHand, botFullHand)
      setWinner(winner);
      if (winner === "Bot wins.") {
        player2.addWinnings(getPot()/2)
        player1.addWinnings(-1 *  getPot()/2)
      } else if (winner === "You Win!") {
        player1.addWinnings(getPot()/2)
        player2.addWinnings(-1 *  getPot()/2)
      }
      setRoundEnded(true);
      setShowOpponentCards(true);
        const newMiddleCards = generateMiddleCards(nums, 4);
      setMiddleCards(newMiddleCards);
    }
    
    // Showdown after the river betting round
    if (round === 4 && (lastTwoActions === 'cc' || lastTwoActions === 'bc' || lastTwoActions === 'xc')) {
      const winner = determineWinner(myFullHand, botFullHand)
      setWinner(winner);
      if (winner === "Bot wins.") {
        player2.addWinnings(getPot()/2)
        player1.addWinnings(-1 *  getPot()/2)
      } else if (winner === "You Win!") {
        player1.addWinnings(getPot()/2)
        player2.addWinnings(-1 *  getPot()/2)
      }
      setRoundEnded(true);
      setShowOpponentCards(true);
      const newMiddleCards = generateMiddleCards(nums, 4);
      setMiddleCards(newMiddleCards);
    }
    console.log("round: " + round);
  };

  const handleDealClick = async () => {
    let startingAmt1 = 1000 - player1.getMoney()
    let startingAmt2 = 1000 - player2.getMoney()
    player1.addMoney(startingAmt1)
    player2.addMoney(startingAmt2)
    setHistory('')
    setRoundEnded(false)
    resetPot();
    setPlayerBetAmount(0)
    setBotBetAmount(0) 
    setRound(0)
    let startingBet1 = 10
    let startingBet2 = 10
    if (bigBlind) {
      startingBet2 = 5
    } else {
      startingBet1 = 5
    }
    //setBotBetAmount(startingBet2);
    //setPlayerBetAmount(startingBet1);
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
    await handlePlayerBetAmountChange(startingBet1);
    await handleBotBetAmountChange(startingBet2);

    setMiddleCards(null);
    const newNums = generateRandomNumbers();
    const newMyCards = generatePlayersCards(newNums, 0, 1, false);
    const newBotCards = generatePlayersCards(newNums, 2, 3, true);
    const myCardLetters = getHandCards(newNums, 0, 1);
    setBotCardLetters(getHandCards(newNums, 2, 3));
    setMiddleCardLetters(getMiddleCards(newNums)[0]);
    setMyFullHand(myCardLetters.concat(middleCardLetters));
    setBotFullHand(botCardLetters.concat(middleCardLetters));
    const myRank = getHandRank(myFullHand);
    const botRank = getHandRank(botFullHand);
    setMyCards(newMyCards);
    setBotCards(newBotCards);
    setShowOpponentCards(false);
    setMiddleCardsShown(0);
    setNums(newNums)

    //updateRound();
};

const handleCheckClick = () => {
  setHistory((prev) => {
    const updatedHistory = prev + 'c';
    const betSize = botBetAmount - playerBetAmount;
    player1.removeMoney(betSize);
    handlePlayerBetAmountChange(betSize);
    updateRound(updatedHistory);
    return updatedHistory;
  });
};

const handleBet1Click = () => {
  setHistory((prev) => {
    const updatedHistory = prev + 'b'
    let betSize1 = Math.floor(getPot() * 2 / 3);
    if (player1.getMoney() < betSize1) {
      betSize1 = player1.getMoney();
    }
    player1.removeMoney(betSize1)
    handlePlayerBetAmountChange(betSize1);
    updateRound(updatedHistory);
    return updatedHistory
  });
};

const handleBet2Click = () => {
  setHistory((prev) => {
    const updatedHistory = prev + 'x'
    let betSize1 = Math.floor(getPot() * 2);
    if (player1.getMoney() < betSize1) {
      betSize1 = player1.getMoney();
    }
    player1.removeMoney(betSize1)
    handlePlayerBetAmountChange(betSize1);
    updateRound(updatedHistory);
    return updatedHistory
  });
};

const handleBet3Click = () => {
  setHistory((prev) => {
    const updatedHistory = prev + 'a'
    const betSize1 = player1.getMoney();
    player1.removeMoney(betSize1);
    handlePlayerBetAmountChange(betSize1);
    updateRound(updatedHistory);
    return updatedHistory
  });
};

const handleFoldClick = () => {
  setHistory((prev) => {
    const updatedHistory = prev + 'f'
    const betsize = (getPot() - botBetAmount)/2;
    console.log("betsize (pot - botcurrentbet)/2: " + getPot() + " - " + botBetAmount + ": " + betsize)
    player2.addWinnings(betsize);
    player1.addWinnings(-1 * betsize);
    setWinner("Bot wins.");
    setRoundEnded(true);
    updateRound(updatedHistory);
    return updatedHistory
  });
};

/*useEffect(() => {
  // this will re-render the component when `history` changes
}, [histo*/
  return (
    <div>
      <RenderMoneyInHand />
      <RenderPot potAmount={potAmount} />
      <PlayerBetBox betAmount={playerBetAmount} onBetAmountChange={handlePlayerBetAmountChange} />
      <BotBetBox betAmount={botBetAmount} onBetAmountChange={handleBotBetAmountChange}/>
      {myCards}
      {showOpponentCards ? (
      botCards
    ) : (
      <button
        className="get-bot-move-button"
        onClick={() => updateBotAction(history.slice(-1), botCardLetters, middleCardLetters, getPot(), round, nums)}
      >
        Get Bot Move
      </button>
    )}
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