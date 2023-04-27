const { createDeck } = require("../components/Cards/Cards");
const { determineWinnerTrain } = require("../GameRules/GameRules");

class TexasHoldEm {
    constructor() {
        this.nodeMap = {};
        this.expected_game_value = 0;
        this.n_cards = 52;
        this.nash_equilibrium = {};
        this.deck = createDeck();
        this.n_actions = 5; //fold, check/call, raise1, raise2, raise3
        this.smallBlind = 5;
        this.bigBlind = 10;
        this.startingBalance = 1000;
        this.player1BuyIns = 0;
        this.player2BuyIns = 0;
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
          communityCards.slice(0, 5),  // Fourth betting round (River)
          communityCards.slice(0, 5)  // Fourth betting round (River)
        ];
        
        return roundCards;
      }

    train(iterations) {
        let expected_game_value = 0;
        for (let i = 0; i < iterations; i++) {
            let player1Balance = this.startingBalance;
            let player2Balance = this.startingBalance;
            let player1Bet = 0;
            let player2Bet = 0;
            this.shuffleArray(this.deck);
            const smallBlindPlayer = i % 2 === 0 ? 0 : 1;
            if (smallBlindPlayer === 0) {
                player1Balance -= this.smallBlind;
                player2Balance -= this.bigBlind;
                player1Bet = this.smallBlind;
                player2Bet = this.bigBlind;
            } else {
                player1Balance -= this.bigBlind;
                player2Balance -= this.smallBlind;
                player1Bet = this.bigBlind;
                player2Bet = this.smallBlind;
            }
            let pot = player1Bet + player2Bet;
            const communityCards = this.dealCommunityCards();
            const player1Cards = [this.deck[0], this.deck[1]];
            const player2Cards = [this.deck[2], this.deck[3]];  
            expected_game_value += this.cfr('', pot, player1Bet, player2Bet, player1Balance, player2Balance, 1, 1, 0, communityCards, player1Cards, player2Cards, smallBlindPlayer);
            // After a hand is completed, handle buy-ins if needed
            if (this.player1Balance < this.bigBlind) {
                this.buyIn(1);
            }
        
            if (this.player2Balance < this.bigBlind) {
                this.buyIn(2);
            }
        
            // Update strategies
            for (const key in this.nodeMap) {
                this.nodeMap[key].updateStrategy();
            }
        }
        console.log("player 1 buy ins: " + this.player1BuyIns)
        console.log("player 2 buy ins: " + this.player2BuyIns)
        expected_game_value /= iterations;
        this.displayResults(expected_game_value, this.nodeMap);
      }
      
      generateNextHistory(history, actionDict, actionIndex, wentAllIn) {
        const actionChar = actionDict[actionIndex];
        return wentAllIn ? history + 'a' : history + actionChar;
      }

      cfr(history, pot, player1Bet, player2Bet, player1Balance, player2Balance, pr1, pr2, round, communityCards, playerCards, opponentCards, startingPlayer) {
        console.log("");
        console.log("pr1: " + pr1)
        console.log("pr2: " + pr2)
        const n = history.length;
        const isPlayer1 = n % 2 === startingPlayer;
        let lastAction = history.slice(-1);
        const lastTwoActions = history.slice(-2);

        if (isPlayer1) {
            //update player 2 info
            if (lastAction === 'c') {
                let bet = player1Bet  - player2Bet;
                if (!(bet < player2Balance)) {
                    bet = player2Balance
                    history = history.slice(0, -1) + "a";
                }
                pot += bet;
                player2Bet += bet;
                player2Balance -= bet;
            } else if (lastAction === 'b') {
                let bet = Math.floor(pot * (2/3));
                if (!(bet < player2Balance)) {
                    bet = player2Balance;
                    history = history.slice(0, -1) + "a";
                }
                if (bet > (player1Balance + player1Bet - player2Bet)) {
                    bet = (player1Balance + player1Bet - player2Bet);
                }
                pot += bet;
                player2Bet += bet;
                player2Balance -= bet;
            } else if (lastAction === 'x') {
                let bet = Math.floor(pot * 2);
                if (!(bet < player2Balance)) {
                    bet = player2Balance
                    history = history.slice(0, -1) + "a";
                }
                if (bet > (player1Balance + player1Bet - player2Bet)) {
                    bet = (player1Balance + player1Bet - player2Bet);
                }
                pot += bet;
                player2Bet += bet;
                player2Balance -= bet;
            } else if (lastAction === 'a') {
                let bet = player2Balance;
                if (bet > (player1Balance + player1Bet - player2Bet)) {
                    bet = (player1Balance + player1Bet - player2Bet);
                }
                pot += bet;
                player2Bet += bet;
                player2Balance -= bet;
            }
        } else {
            //update player 1 info
            if (lastAction === 'c') {
                let bet = player2Bet - player1Bet;
                if (!(bet < player1Balance)) {
                    bet = player1Balance
                    history = history.slice(0, -1) + "a";
                }
                pot += bet;
                player1Bet += bet
                player1Balance -= bet;
            } else if (lastAction === 'b') {
                let bet = Math.floor(pot * (2/3));
                if (!(bet < player1Balance)) {
                    bet = player1Balance
                    history = history.slice(0, -1) + "a";
                }
                if (bet > (player2Balance + player2Bet - player1Bet)) {
                    bet = (player2Balance + player2Bet - player1Bet);
                }
                pot += bet;
                player1Bet += bet
                player1Balance -= bet;
            } else if (lastAction === 'x') {
                let bet = Math.floor(pot * 2);
                if (!(bet < player1Balance)) {
                    bet = player1Balance
                    history = history.slice(0, -1) + "a";
                }
                if (bet > (player2Balance + player2Bet - player1Bet)) {
                    bet = (player2Balance + player2Bet - player1Bet);
                }
                pot += bet;
                player1Bet += bet
                player1Balance -= bet;
            } else if (lastAction === 'a') {
                let bet = player1Balance;
                if (bet > (player2Balance + player2Bet - player1Bet)) {
                    bet = (player2Balance + player2Bet - player1Bet);
                }
                pot += bet;
                player1Bet += bet;
                player1Balance -= bet;
            }
        }
        
        // Find all occurrences of two consecutive 'c's
        const matches = history.match(/cc/g);

        // Update the round once for each match
        const numUpdates = matches ? matches.length : 0;


        // If the player called the last bet or both players checked, progress to the next round
        if ((lastTwoActions === 'cc' && numUpdates > round) || lastTwoActions === 'bc' || lastTwoActions === 'xc') {
            player1Bet = 0;
            player2Bet = 0;
            round++;
        }
      
        const currentComCards = communityCards[round];

        const playerHand = isPlayer1 ? playerCards.concat(currentComCards) : opponentCards.concat(currentComCards); 

        console.log("isPlayer1: " + isPlayer1)
        console.log("history: " + history);
        console.log("round: " + round);
        console.log("player1 current bet: " + player1Bet)
        console.log("player1 Balance: " + player1Balance);
        console.log("player2 current bet: " + player2Bet)
        console.log("player2 Balance: " + player2Balance);
        console.log("pot: " + pot);
        console.log("Player Cards: " + playerCards);
        console.log("Opponent Cards: " + opponentCards);
        console.log("current Community cards: " + currentComCards);
        
        if (this.isTerminal(history, round)) {
          const reward = this.getReward(history, playerCards, opponentCards, round, communityCards[3], pot, player1Balance, player2Balance);
          console.log("Reward: " + reward);
          return reward;
        }

        const node = this.getNode(playerHand, history);
        console.log("Node: " + node);
        const strategy = node.strategy;
        console.log("strat: " + strategy)
        
      
        // Counterfactual utility per action.
        const actionUtils = new Array(this.n_actions).fill(0);
        
        lastAction = history.slice(-1);
        if (lastAction === 'a') {
            for (let act = 0; act < 2; act++) {
                //if (node.regretSum[act] > 0.000000001) {
                  const nextHistory = history + node.actionDict[act]
                  if (isPlayer1) {
                      actionUtils[act] = -1 * this.cfr(nextHistory, pot, player1Bet, player2Bet, player1Balance, player2Balance, pr1 * strategy[act], pr2, round, communityCards, playerCards, opponentCards, startingPlayer);
                  } else {
                      actionUtils[act] = -1 * this.cfr(nextHistory, pot, player1Bet, player2Bet, player1Balance, player2Balance, pr1, pr2 * strategy[act], round, communityCards, playerCards, opponentCards, startingPlayer);
                  }
              //}
            }
        } else {
            for (let act = 0; act < this.n_actions; act++) {
                //if (node.regretSum[act] > 0.000000001) {
                  const nextHistory = history + node.actionDict[act]
                  if (isPlayer1) {
                      actionUtils[act] = -1 * this.cfr(nextHistory, pot, player1Bet, player2Bet, player1Balance, player2Balance, pr1 * strategy[act], pr2, round, communityCards, playerCards, opponentCards, startingPlayer);
                  } else {
                      actionUtils[act] = -1 * this.cfr(nextHistory, pot, player1Bet, player2Bet, player1Balance, player2Balance, pr1, pr2 * strategy[act], round, communityCards, playerCards, opponentCards, startingPlayer);
                  }
                //}
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
        console.log("Regrets: " + regrets)
        if (isPlayer1) {
            node.reachPr += pr1;
            console.log("node.reachPr: " + node.reachPr)
            for (let i = 0; i < node.regretSum.length; i++) {
                node.regretSum[i] += pr2 * regrets[i];
            }           
        } else {
            node.reachPr += pr2;
            console.log("node.reachPr: " + node.reachPr)
            for (let i = 0; i < node.regretSum.length; i++) {
                node.regretSum[i] += pr1 * regrets[i];
            } 
        }
        console.log("node.regretSum: " + node.regretSum);
        console.log("node.strategySum: " + node.strategySum)
        console.log("util: " + util)
        return util;
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

        if (lastTwoActions === 'aa') {
            return true;
        }
        
        // Showdown after the river betting round
        if (round === 4 && (lastTwoActions === 'cc' || lastTwoActions === 'bc' || lastTwoActions === 'xc')) {
            return true;
        }
        
        return false;
    }
      
    getReward(history, playerCards, opponentCards, round, communityCards, pot, player1Balance, player2Balance) {
        const lastAction = history.slice(-1);
        const lastTwoActions = history.slice(-2);
        // Player folds
        if (lastAction === 'f') {
          if (history.length % 2 === 0) { // Player 2 folds
            return pot + player1Balance - this.startingBalance;
          } else { // Player 1 folds
            return this.startingBalance - player2Balance - pot;
          }
        }
      
        // All-in and call, or showdown after river betting round
        if (lastTwoActions === 'aa' || lastTwoActions === 'ac' || (round === 4 && (lastTwoActions === 'cc' || lastTwoActions === 'bc' || lastTwoActions === 'xc'))) {
          const hand1 = playerCards.concat(communityCards);
          const hand2 = opponentCards.concat(communityCards);
          const winner = determineWinnerTrain(hand1, hand2)
          console.log("The winner is: " + winner);
          if (winner === 1) {
            return pot + player1Balance - this.startingBalance;
          } else if (winner === 2) {
            return this.startingBalance - player2Balance - pot;
          } else {
            return 0; // Tie, split pot
          }
        }
        console.log("THIS SHOULD NOT BE PRINTED")
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

function main() {
    const pokerGame = new TexasHoldEm();
    const numIterations = 1; // Choose the number of iterations to run
    pokerGame.train(numIterations);
}
  
main();

//export default TexasHoldEm;