import { createDeck } from "../components/Cards/Cards";
import { determineWinnerT } from "../GameRules/GameRules";

class TexasHoldEm {
    constructor() {
        this.nodeMap = {};
        this.expected_game_value = 0;
        this.n_cards = 52;
        this.nash_equilibrium = {};
        // this.current_player = 0; // delete
        this.deck = createDeck();
        this.n_actions = 5; //fold, check/call, raise1, raise2, raise3
        this.smallBlind = 5;
        this.bigBlind = 10;
        this.player1Bet = 0;
        this.player2Bet = 0;
        this.startingBalance = 1000;
        this.pot = this.smallBlind + this.bigBlind
        this.player1Balance = this.startingBalance;
        this.player2Balance = this.startingBalance;
        this.player1BuyIns = 0;
        this.player2BuyIns = 0;
        //this.communityCards = []; // delete
        /*this.betSizes = [ // change or get rid
            (2 / 3) * this.startingBalance,
            2 * this.startingBalance,
            this.startingBalance
        ];
        */
    }

    displayResults(expectedGameValue, nodeMap) {
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

    buyIn(player) {
        const startingBalance = this.startingBalance;
    
        if (player === 1) {
          if (this.player1Balance === 0) {
            this.player1Balance += startingBalance;
            this.player1BuyIns++;
          }
        } else if (player === 2) {
          if (this.player2Balance === 0) {
            this.player2Balance += startingBalance;
            this.player2BuyIns++;
          }
        } 
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
    }

    dealCommunityCards() {
        // Deal 5 community cards
        const communityCards = this.deck.slice(4, 9);
        
        // Split community cards into rounds
        const roundCards = [
          [], // First betting round (no community cards)
          communityCards.slice(0, 3), // Second betting round (Flop)
          communityCards.slice(0, 4), // Third betting round (Turn)
          communityCards.slice(0, 5)  // Fourth betting round (River)
        ];
        
        return roundCards;
      }

    train(iterations) {
        let expected_game_value = 0;
        this.pot = 0;
        for (let i = 0; i < iterations; i++) {
            this.shuffleArray(this.deck);
            const smallBlindPlayer = i % 2 === 0 ? 1 : 2;
            if (smallBlindPlayer === 1) {
                this.player1Balance -= this.smallBlind;
                this.player2Balance -= this.bigBlind;
                this.player1Bet = this.smallBlind;
                this.player2Bet = this.bigBlind;
            } else {
                this.player1Balance -= this.bigBlind;
                this.player2Balance -= this.smallBlind;
                this.player1Bet = this.bigBlind;
                this.player2Bet = this.smallBlind;
            }
            let communityCards = this.dealCommunityCards();
            const player1Cards = [this.deck[0], this.deck[1]];
            const player2Cards = [this.deck[2], this.deck[3]];  
            expected_game_value += this.cfr('', 1, 1, 0, this.pot, communityCards, player1Cards, player2Cards);
            // After a hand is completed, handle buy-ins if needed
            if (this.player1Balance < 10) {
                this.buyIn(1);
            }
        
            if (this.player2Balance < 10) {
                this.buyIn(2);
            }
        
            // Update strategies
            for (const key in this.nodeMap) {
                this.nodeMap[key].updateStrategy();
            }
        }
        console.log("made it out of cfr loop");
        expected_game_value /= iterations;
        this.displayResults(expected_game_value, this.nodeMap);
      }
      
      generateNextHistory(history, actionDict, actionIndex, wentAllIn) {
        const actionChar = actionDict[actionIndex];
        return wentAllIn ? history + 'a' : history + actionChar;
      }

      cfr(history, pr1, pr2, round, pot, communityCards, playerCards, opponentCards) {
        console.log("history: " + history);
        console.log("round: " + round);
        console.log("pot: " + pot);
        const n = history.length;
        const isPlayer1 = n % 2 === 0;
        const lastAction = history.slice(-1);
        if (isPlayer1) {
            //update player 2 info
            if (lastAction === 'c') {
                let bet = this.player1Bet;
                if (!(bet < this.player2Balance)) {
                    bet = this.player2Balance
                    history = history.slice(0, -1) + "a";
                }
                this.pot += bet;
                this.player2Bet = bet;
                this.player2Balance -= bet;
            } else if (lastAction === 'b') {
                let bet = Math.floor(pot * (2/3));
                if (!(bet < this.player2Balance)) {
                    bet = this.player2Balance
                    history = history.slice(0, -1) + "a";
                }
                if (bet > this.player1Balance) {
                    bet = this.player1Balance;
                }
                this.pot += bet;
                this.player2Bet = bet;
                this.player2Balance -= bet;
            } else if (lastAction === 'x') {
                let bet = Math.floor(pot * 2);
                if (!(bet < this.player2Balance)) {
                    bet = this.player2Balance
                    history = history.slice(0, -1) + "a";
                }
                if (bet > this.player1Balance) {
                    bet = this.player1Balance;
                }
                this.pot += bet;
                this.player2Bet = bet;
                this.player2Balance -= bet;
            } else if (lastAction === 'a') {
                let bet = this.player2Balance;
                if (bet > this.player1Balance) {
                    bet = this.player1Balance;
                }
                this.pot += bet;
                this.player2Bet = bet;
                this.player2Balance -= bet;
            }
        } else {
            //update player 1 info
            if (lastAction === 'c') {
                let bet = this.player2Bet;
                if (!(bet < this.player1Balance)) {
                    bet = this.player1Balance
                    history = history.slice(0, -1) + "a";
                }
                this.pot += bet;
                this.player1Bet = bet
                this.player1Balance -= bet;
            } else if (lastAction === 'b') {
                let bet = Math.floor(pot * (2/3));
                if (!(bet < this.player1Balance)) {
                    bet = this.player1Balance
                    history = history.slice(0, -1) + "a";
                }
                if (bet > this.player2Balance) {
                    bet = this.player2Balance;
                }
                this.pot += bet;
                this.player1Bet = bet
                this.player1Balance -= bet;
            } else if (lastAction === 'x') {
                let bet = Math.floor(pot * 2);
                if (!(bet < this.player1Balance)) {
                    bet = this.player1Balance
                    history = history.slice(0, -1) + "a";
                }
                if (bet > this.player2Balance) {
                    bet = this.player2Balance;
                }
                this.pot += bet;
                this.player1Bet = bet
                this.player1Balance -= bet;
            } else if (lastAction === 'a') {
                let bet = this.player1Balance;
                if (bet > this.player2Balance) {
                    bet = this.player2Balance;
                }
                this.pot += bet;
                this.player1Bet = bet;
                this.player1Balance -= bet;
            }
        }

        const updatedRound = this.calculateUpdatedRound(history, round);
        const currentComCards = communityCards[round];
        const playerHand = isPlayer1 ? playerCards.concat(currentComCards) : opponentCards.concat(currentComCards); 
        const opponentHand = isPlayer1 ? opponentCards.concat(currentComCards) : playerCards.concat(currentComCards); 

        if (this.isTerminal(history, round)) {
          const reward = this.getReward(history, playerHand, opponentHand, pot, round, communityCards[3]);
          return reward;
        }
      
        const node = this.getNode(playerHand, history);
        console.log("Node: " + node);
        const strategy = node.strategy;
        console.log("strat: " + strategy)
        
      
        // Counterfactual utility per action.
        const actionUtils = new Array(this.n_actions).fill(0);
      
        for (let act = 0; act < this.n_actions; act++) {
            const nextHistory = history + node.actionDict[act]
            if (isPlayer1) {
                actionUtils[act] = -1 * this.cfr(nextHistory, pr1 * strategy[act], pr2, updatedRound, this.pot, communityCards, playerCards, opponentCards);
            } else {
                actionUtils[act] = -1 * this.cfr(nextHistory, pr1, pr2 * strategy[act], updatedRound, this.pot, communityCards, playerCards, opponentCards);
            }
        }
      
        // Utility of information set.
       
        let util = 0;
        if (actionUtils.length === strategy.length) {
            for (let i = 0; i < actionUtils.length; i++) {
                util += actionUtils[i] * strategy[i];
            }
        }
        const regrets = actionUtils.map(val => val - util);
        
        if (isPlayer1) {
            node.reachPr += pr1;
            for (let i = 0; i < node.regretSum.length; i++) {
                node.regretSum[i] += pr2 * regrets[i];
            }           
        } else {
            node.reachPr += pr2;
            for (let i = 0; i < node.regretSum.length; i++) {
                node.regretSum[i] += pr1 * regrets[i];
            } 
        }
        console.log("util: " + util)
        return util;
      }
      
      
    calculateUpdatedRound(history, round) {
        const lastAction = history.slice(-1);
        const lastTwoActions = history.slice(-2);
      
        // If the player called the last bet or both players checked, progress to the next round
        if (lastTwoActions === 'cc' || (lastAction === 'c' && lastTwoActions !== 'ac')) {
            this.player1Bet = 0;
            this.player2Bet = 0;
            return round + 1;
        }
      
        return round;
    }
        
    isTerminal(history, round) {
        const lastAction = history.slice(-1);
        const lastTwoActions = history.slice(-2);
        
        // Player folds
        if (lastAction === 'f') {
            console.log("terminal node reached.")
            return true;
        }
        
        // All-in and call
        if (lastTwoActions === 'ac') {
            console.log("terminal node reached.")
            return true;
        }

        if (lastTwoActions === 'aa') {
            console.log("terminal node reached.")
            return true;
        }
        
        // Showdown after the river betting round
        if (round === 4 && (lastTwoActions === 'cc' || lastTwoActions === 'bc' || lastTwoActions === 'xc')) {
            console.log("terminal node reached.")
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
        if (lastTwoActions === 'aa' || lastTwoActions === 'ac' || (round === 4 && (lastTwoActions === 'cc' || lastTwoActions === 'bc' || lastTwoActions === 'xc'))) {
          const winner = determineWinnerT(playerHand, opponentHand, communityCards)
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
        const sortedCard = card.slice().sort(); 
        const key = `${sortedCard.join(' ')} ${history}`; 
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
        let product = this.strategy.map((element) => element * this.reachPr);
        for (let i = 0; i < this.strategySum.length; i++) {
            this.strategySum[i] += product[i];
        }
        this.reachPrSum += this.reachPr;
        this.strategy = this.getStrategy();
        this.reachPr = 0;
    }
  
    getStrategy() {
      const regrets = this.regretSum;
      for (let i = 0; i < regrets.length; i++) {
        if (regrets[i] < 0) {
          regrets[i] = 0;
        }
      }
      const normalizingSum = regrets.reduce((acc, curr) => acc + curr, 0);
      if (normalizingSum > 0) {
        return regrets.map((x) => x / normalizingSum);
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


export default TexasHoldEm;