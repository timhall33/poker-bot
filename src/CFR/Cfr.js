import { createDeck } from "../components/Cards/Cards";
import { determineWinner } from "../GameRules/GameRules";

class TexasHoldEm {
    constructor() {
        this.nodeMap = {};
        this.expected_game_value = 0;
        this.n_cards = 52;
        this.nash_equilibrium = {};
        this.current_player = 0;
        this.deck = this.createDeck();
        this.n_actions = 5; //fold, check/call, raise1, raise2, raise3
        this.smallBlind = 5;
        this.bigBlind = 10;
        this.startingBalance = 1000;
        this.player1Balance = this.startingBalance;
        this.player2Balance = this.startingBalance;
        this.communityCards = [];
    }

    buyIn(player) {
        const startingBalance = this.startingBalance;
    
        if (player === 1) {
          if (this.player1Balance === 0) {
            this.player1Balance = startingBalance;
            this.player1BuyIns++;
          }
        } else if (player === 2) {
          if (this.player2Balance === 0) {
            this.player2Balance = startingBalance;
            this.player2BuyIns++;
          }
        } 
    }

    dealCommunityCards() {
        // Deal 5 community cards
        const communityCards = this.deck.slice(2, 7);
        
        // Split community cards into rounds
        const roundCards = [
          [], // First betting round (no community cards)
          communityCards.slice(0, 3), // Second betting round (Flop)
          communityCards.slice(0, 4), // Third betting round (Turn)
          communityCards.slice(0, 5)  // Fourth betting round (River)
        ];
        
        return roundCards;
      }

    train(n_iterations = 50000) {
        let expected_game_value = 0;
      
        for (let i = 0; i < n_iterations; i++) {
          shuffleArray(this.deck);
          this.communityCards = this.dealCommunityCards();
          expected_game_value += this.cfr('', 1, 1, 0, 0, blinds, this.communityCards);
      
          // After a hand is completed, handle buy-ins if needed
          if (this.player1Balance === 0) {
            this.buyIn(1);
          }
      
          if (this.player2Balance === 0) {
            this.buyIn(2);
          }
      
          // Update strategies
          for (const key in this.nodeMap) {
            this.nodeMap[key].updateStrategy();
          }
        }
      
        expected_game_value /= n_iterations;
        this.displayResults(expected_game_value, this.nodeMap);
      }
      

      cfr(history, pr1, pr2, round, pot, communityCards) {
        const n = history.length;
        const isPlayer1 = n % 2 === 0;
        const playerCard = isPlayer1 ? this.deck[0] : this.deck[1];
        const opponentCard = isPlayer1 ? this.deck[1] : this.deck[0];
      
        if (this.isTerminal(history, round)) {
          const playerHand = isPlayer1 ? playerCard : opponentCard;
          const opponentHand = isPlayer1 ? opponentCard : playerCard;
          const currentCommunityCards = communityCards[round];
          const reward = this.getReward(history, playerHand, opponentHand, pot, round, currentCommunityCards);
          return reward;
        }
      
        const node = this.getNode(playerCard, history);
        const strategy = node.getStrategy();
        const numActions = strategy.length;
      
        // Counterfactual utility per action.
        const actionUtils = new Array(numActions).fill(0);
      
        for (let act = 0; act < numActions; act++) {
          const nextHistory = history + node.actionDict[act];
          const playerBalance = isPlayer1 ? this.player1Balance : this.player2Balance;
          const updatedPot = this.calculateUpdatedPot(history, pot, act, playerBalance);
          const updatedRound = this.calculateUpdatedRound(history, round, act);
      
          if (isPlayer1) {
            actionUtils[act] = -1 * this.cfr(nextHistory, pr1 * strategy[act], pr2, updatedRound, updatedPot, communityCards);
          } else {
            actionUtils[act] = -1 * this.cfr(nextHistory, pr1, pr2 * strategy[act], updatedRound, updatedPot, communityCards);
          }
        }
      
        // Utility of information set.
        const util = actionUtils.reduce((acc, val, idx) => acc + val * strategy[idx], 0);
        const regrets = actionUtils.map((actionUtil, idx) => actionUtil - util);
        for (let idx = 0; idx < numActions; idx++) {
          if (isPlayer1) {
            node.reachPr += pr1;
            node.regretSum[idx] += pr2 * regrets[idx];
          } else {
            node.reachPr += pr2;
            node.regretSum[idx] += pr1 * regrets[idx];
          }
        }
      
        return util;
      }
      
      
    calculateUpdatedPot(history, pot, actionIdx, playerBalance) {
        const lastAction = history.slice(-1);
      
        // The available bet sizes
        const betSizes = [
          (2 / 3) * pot,
          2 * pot,
          playerBalance // All-in amount, based on the player's remaining balance
        ];
      
        // Check if the action is a bet
        if (actionIdx >= 2 && actionIdx <= 4) {
          const betAmount = betSizes[actionIdx - 2];
          return pot + betAmount;
        }
      
        // In case of call/check or fold, the pot remains the same
        return pot;
    }
      
      
    calculateUpdatedRound(history, round) {
        const lastAction = history.slice(-1);
        const lastTwoActions = history.slice(-2);
      
        // If the player called the last bet or both players checked, progress to the next round
        if (lastTwoActions === 'cc' || (lastAction === 'c' && lastTwoActions !== 'ac')) {
          return round + 1;
        }
      
        return round;
    }
        
    isTerminal(history, round) {
        const lastAction = history.slice(-1);
        const lastTwoActions = history.slice(-2);
        
        // Player folds
        if (lastAction === 'f') {
            return true;
        }
        
        // All-in and call
        if (lastTwoActions === 'ac') {
            return true;
        }
        
        // Showdown after the river betting round
        if (round === 4 && (lastTwoActions === 'cc' || lastTwoActions === 'bc' || lastTwoActions === 'xc')) {
            return true;
        }
        
        return false;
    }
      
    getReward(history, playerHand, opponentHand, pot, round, communityCards) {
        const lastAction = history.slice(-1);
        const lastTwoActions = history.slice(-2);
      
        // Player folds
        if (lastAction === 'f') {
          if (history.length % 2 === 0) { // Player 2 folds
            return pot;
          } else { // Player 1 folds
            return -pot;
          }
        }
      
        // All-in and call, or showdown after river betting round
        if (lastTwoActions === 'ac' || (round === 4 && (lastTwoActions === 'cc' || lastTwoActions === 'bc' || lastTwoActions === 'xc'))) {
          const winner = determineWinner(playerHand, opponentHand)
          if (winner === 1) {
            return pot;
          } else if (winner === 2) {
            return -pot;
          } else {
            return 0; // Tie, split pot
          }
        }
      
        return 0; // Not a terminal state
      }
        

    getNode(card, history) {
        const key = `${card} ${history}`;
        if (!this.nodeMap.hasOwnProperty(key)) {
            const actionDict = {0: 'f', 1: 'c', 2: 'b', 3: 'x', 4: 'a'};
            const infoSet = new Node(key, actionDict);
            this.nodeMap[key] = infoSet;
            return infoSet;
        }
        return this.nodeMap[key];
    }
}

class Node {
    constructor(key, actionDict, nActions = 5) {
        this.key = key;
        this.nActions = nActions;
        this.regretSum = new Array(this.nActions).fill(0);
        this.strategySum = new Array(this.nActions).fill(0);
        this.actionDict = actionDict;
        this.strategy = new Array(this.nActions).fill(1 / this.nActions);
        this.reachPr = 0;
        this.reachPrSum = 0;
      }
  
    updateStrategy() {
      this.strategySum = this.strategySum.map((x, idx) => x + this.reachPr * this.strategy[idx]);
      this.reachPrSum += this.reachPr;
      this.strategy = this.getStrategy();
      this.reachPr = 0;
    }
  
    getStrategy() {
      const regrets = this.regretSum.map(x => Math.max(x, 0));
      const normalizingSum = regrets.reduce((acc, curr) => acc + curr, 0);
  
      if (normalizingSum > 0) {
        return regrets.map(x => x / normalizingSum);
      } else {
        return Array(this.nActions).fill(1 / this.nActions);
      }
    }
  
    getAverageStrategy() {
      const strategy = this.strategySum.map(x => x / this.reachPrSum);
      const total = strategy.reduce((acc, curr) => acc + curr, 0);
      return strategy.map(x => x / total);
    }

    toString() {
        const averageStrategy = this.getAverageStrategy();
        const formattedStrategy = averageStrategy.map((value) => value.toFixed(2)).join(', ');
      
        return `${this.key.padEnd(6)}: [${formattedStrategy}]`;
      }

}

function displayResults(expectedGameValue, nodeMap) {
    console.log(`Player 1 expected value: ${expectedGameValue}`);
    console.log(`Player 2 expected value: ${-1 * expectedGameValue}`);
  
    console.log("\nPlayer 1 strategies:");
    const sortedKeys = Object.keys(nodeMap).sort();
    for (const key of sortedKeys) {
      if (key.length % 2 === 0) {
        console.log(nodeMap[key].toString());
      }
    }
  
    console.log("\nPlayer 2 strategies:");
    for (const key of sortedKeys) {
      if (key.length % 2 === 1) {
        console.log(nodeMap[key].toString());
      }
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

  
    
  