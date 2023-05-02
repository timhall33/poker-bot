const fs = require('fs');


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
        const sortedKeys = Object.keys(nodeMap).sort();
        for (const key of sortedKeys) {
            console.log(nodeMap[key].toString());
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
            console.log("Iteration: " + i)
            let player1Balance = this.startingBalance;
            let player2Balance = this.startingBalance;
            let player1Bet = 0;
            let player2Bet = 0;
            this.shuffleArray(this.deck); // shuffles the deck
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
        
            // Update strategies
            for (const key in this.nodeMap) {
                this.nodeMap[key].updateStrategy();
            }
        }
        expected_game_value /= iterations;
        this.displayResults(expected_game_value, this.nodeMap);
      }

      cfr(history, pot, player1Bet, player2Bet, player1Balance, player2Balance, pr1, pr2, round, communityCards, playerCards, opponentCards, startingPlayer) {
        const n = history.length;
        const isPlayer1 = n % 2 === startingPlayer;
        let lastAction = history.slice(-1);
        const lastTwoActions = history.slice(-2);

        // Game Tree for Poker Varient
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

        // count number of game updates
        let numUpdates = 0;
        for (let i = 1; i < history.length; i++) {
            let last = history[i - 1];
            if (last === 'b' && history[i] === 'c') {
                i++
                numUpdates++;
            } else if (last === 'x' && history[i] === 'c') {
                i++
                numUpdates++;
            } else if (last === 'c' && history[i] === 'c') {
                i++
                numUpdates++;
            }
        }

        // If the player called the last bet or both players checked, progress to the next round
        if ((lastTwoActions === 'cc' && numUpdates > round) || lastTwoActions === 'bc' || lastTwoActions === 'xc') {
            player1Bet = 0;
            player2Bet = 0;
            round++;
        }
      
        const currentComCards = communityCards[round];
        const playerHand = isPlayer1 ? playerCards.concat(currentComCards) : opponentCards.concat(currentComCards); 
        if (this.isTerminal(history, round)) {
          const reward = this.getReward(history, playerCards, opponentCards, round, communityCards[3], pot, player1Balance, player2Balance);
          return reward;
        }

        // get the current node and strategy
        const node = this.getNode(playerCards, communityCards[round], lastAction, round, pot);
        const strategy = node.strategy;
        
      
        // Counterfactual utility per action.
        const actionUtils = new Array(this.n_actions).fill(0);
        
        lastAction = history.slice(-1);
        if (lastAction === 'a' || lastAction === 'b' || lastAction === 'x') {
            for (let act = 0; act < 2; act++) {
                const nextHistory = history + node.actionDict[act]
                if (isPlayer1) {
                    actionUtils[act] = -1 * this.cfr(nextHistory, pot, player1Bet, player2Bet, player1Balance, player2Balance, pr1 * strategy[act], pr2, round, communityCards, playerCards, opponentCards, startingPlayer);
                } else {
                    actionUtils[act] = -1 * this.cfr(nextHistory, pot, player1Bet, player2Bet, player1Balance, player2Balance, pr1, pr2 * strategy[act], round, communityCards, playerCards, opponentCards, startingPlayer);
                }
            }
        } else {
            for (let act = 0; act < this.n_actions; act++) {
                  const nextHistory = history + node.actionDict[act]
                  if (isPlayer1) {
                      actionUtils[act] = -1 * this.cfr(nextHistory, pot, player1Bet, player2Bet, player1Balance, player2Balance, pr1 * strategy[act], pr2, round, communityCards, playerCards, opponentCards, startingPlayer);
                  } else {
                      actionUtils[act] = -1 * this.cfr(nextHistory, pot, player1Bet, player2Bet, player1Balance, player2Balance, pr1, pr2 * strategy[act], round, communityCards, playerCards, opponentCards, startingPlayer);
                  }
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
        // update reach probability
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

        // Both players go all in
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
          //console.log("The winner is: " + winner);
          if (winner === 1) {
            return pot + player1Balance - this.startingBalance;
          } else if (winner === 2) {
            return this.startingBalance - player2Balance - pot;
          } else {
            return 0; // Tie, split pot
          }
        }
        return 0; // Not a terminal state
      }
        

    getNode(playercards, communityCards, action, round, pot) {
        const cards = playercards.concat(communityCards);
        const lastAction = action;
        const cardBucket = getHandRank(cards)[0];
        const nodeRound = round;
        let potVal = 0;
        if (pot <= 200 ) {
            potVal = 0;
        } else if (pot > 200 && pot < 500) {
            potVal = 1;
        } else {
            potVal = 2;
        }
        const key = `${cardBucket} ${lastAction} ${nodeRound} ${potVal}`
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

const cardImages = {
    '2C': "/images/2_of_clubs.png",
    '3C': "/images/3_of_clubs.png",
    '4C': "/images/4_of_clubs.png",
    '5C': "/images/5_of_clubs.png",
    '6C': "/images/6_of_clubs.png",
    '7C': "/images/7_of_clubs.png",
    '8C': "/images/8_of_clubs.png",
    '9C': "/images/9_of_clubs.png",
    'TC': "/images/10_of_clubs.png",
    'JC': "/images/jack_of_clubs2.png",
    'QC': "/images/queen_of_clubs2.png",
    'KC': "/images/king_of_clubs2.png",
    'AC': "/images/ace_of_clubs.png",
    '2D': "/images/2_of_diamonds.png",
    '3D': "/images/3_of_diamonds.png",
    '4D': "/images/4_of_diamonds.png",
    '5D': "/images/5_of_diamonds.png",
    '6D': "/images/6_of_diamonds.png",
    '7D': "/images/7_of_diamonds.png",
    '8D': "/images/8_of_diamonds.png",
    '9D': "/images/9_of_diamonds.png",
    'TD': "/images/10_of_diamonds.png",
    'JD': "/images/jack_of_diamonds2.png",
    'QD': "/images/queen_of_diamonds2.png",
    'KD': "/images/king_of_diamonds2.png",
    'AD': "/images/ace_of_diamonds.png",
    '2H': "/images/2_of_hearts.png",
    '3H': "/images/3_of_hearts.png",
    '4H': "/images/4_of_hearts.png",
    '5H': "/images/5_of_hearts.png",
    '6H': "/images/6_of_hearts.png",
    '7H': "/images/7_of_hearts.png",
    '8H': "/images/8_of_hearts.png",
    '9H': "/images/9_of_hearts.png",
    'TH': "/images/10_of_hearts.png",
    'JH': "/images/jack_of_hearts2.png",
    'QH': "/images/queen_of_hearts2.png",
    'KH': "/images/king_of_hearts2.png",
    'AH': "/images/ace_of_hearts.png",
    '2S': "/images/2_of_spades.png",
    '3S': "/images/3_of_spades.png",
    '4S': "/images/4_of_spades.png",
    '5S': "/images/5_of_spades.png",
    '6S': "/images/6_of_spades.png",
    '7S': "/images/7_of_spades.png",
    '8S': "/images/8_of_spades.png",
    '9S': "/images/9_of_spades.png",
    'TS': "/images/10_of_spades.png",
    'JS': "/images/jack_of_spades2.png",
    'QS': "/images/queen_of_spades2.png",
    'KS': "/images/king_of_spades2.png",
    'AS': "/images/ace_of_spades2.png"
};
  
function createDeck() {
    let deck = [];
    for (let i = 0; i < 52; i++) {
    deck.push(Object.keys(cardImages)[i])
    }
    return deck;
}

function determineWinnerTrain(playerHand, opponentHand) {
    const handRank1 = getHandRank(playerHand);
    const handRank2 = getHandRank(opponentHand);
    if (handRank1[0] > handRank2[0]) {
        return 1;
    } else if (handRank2[0] > handRank1[0]) {
        return 2;
    } else {
        for (let i = 1; i < handRank1.length; i++) {
            if (handRank1[i] > handRank2[i]) {
                return 1;
            } else if (handRank2[i] > handRank1[i]) {
                return 2;
            }
        }
      return 0;
    }
  }
  function getHandRank(hand) {
    if (hasStraightFlush(hand)) {
        return hasStraightFlush(hand);
    } else if (hasFourOfAKind(hand)) {
        return hasFourOfAKind(hand);
    } else if (hasFullHouse(hand)) {
        return hasFullHouse(hand);
    } else if (hasFlush(hand)) {
        return hasFlush(hand);
    } else if (hasStraight(hand)) {
        return hasStraight(hand);
    } else if (hasThreeOfAKind(hand)) {
        return hasThreeOfAKind(hand);
    } else if (hasTwoPair(hand)) {
        return hasTwoPair(hand);
    } else if (hasOnePair(hand)) {
        return hasOnePair(hand);
    } else {
        return hasHighCard(hand);
    }
}



function hasStraightFlush(hand) {
    const rankValues = new Map([
      ['A', 14],
      ['K', 13],
      ['Q', 12],
      ['J', 11],
      ['T', 10],
      ['9', 9],
      ['8', 8],
      ['7', 7],
      ['6', 6],
      ['5', 5],
      ['4', 4],
      ['3', 3],
      ['2', 2]
    ]);
  
    const suits = new Set(['H', 'D', 'C', 'S']); // Set of valid suits
  
    let straightFlushStart = null; // Variable to store the starting rank of the straight flush
  
    // Iterate through hand to check for a straight flush
    for (let suit of suits) {
      const suitedCards = hand.filter(card => card.endsWith(suit)); // Filter hand for cards of the current suit
  
      if (suitedCards.length >= 5) {
        const suitedHandValues = suitedCards.map(card => {
          const rank = card.slice(0, -1); // Extract rank without suit
          return rankValues.get(rank) || parseInt(rank); // Convert rank to numerical value, or parse as integer
        }).sort((a, b) => b - a); // Sort hand values in descending order
  
        for (let i = 0; i < suitedHandValues.length - 1; i++) {
          if (suitedHandValues[i] - 1 !== suitedHandValues[i + 1]) {
            if (straightFlushStart !== null && suitedHandValues[i] !== suitedHandValues[i + 1]) {
              straightFlushStart = null; // Reset straight flush start if not consecutive
            }
          } else if (straightFlushStart === null) {
            straightFlushStart = suitedHandValues[i]; // Set straight flush start
          }
  
          if (straightFlushStart !== null && straightFlushStart - suitedHandValues[i + 1] === 4) {
            // Found a straight flush
            const straightFlushRank = 9; // Rank 10 for straight flush
            const straightFlushCards = [straightFlushStart, straightFlushStart - 1, straightFlushStart - 2, straightFlushStart - 3, straightFlushStart - 4]; // Generate 5 consecutive cards
            return [straightFlushRank].concat(straightFlushCards);
          }
        }
      }
    }
  
    return 0; // Return [0] for no straight flush
  }
  
  function hasFourOfAKind(hand) {
    const rankValues = new Map([
      ['A', 14],
      ['K', 13],
      ['Q', 12],
      ['J', 11],
      ['T', 10],
      ['9', 9],
      ['8', 8],
      ['7', 7],
      ['6', 6],
      ['5', 5],
      ['4', 4],
      ['3', 3],
      ['2', 2]
    ]);
  
    const rankCounts = new Map(); // Map to store count of each rank in the hand
  
    // Iterate through hand to count ranks
    for (let card of hand) {
      const rank = card.slice(0, -1); // Extract rank without suit
      rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1); // Increment rank count in map
    }
  
    for (let [rank, count] of rankCounts) {
      if (count === 4) {
        // Found four of a kind
        const fourOfAKindRank = rankValues.get(rank) || parseInt(rank); // Convert rank to numerical value, or parse as integer
        const remainingCards = hand
          .map(card => card.slice(0, -1)) // Extract ranks without suit
          .filter(r => r !== rank) // Filter out the rank of the four of a kind
          .sort((a, b) => rankValues.get(b) - rankValues.get(a) || parseInt(b) - parseInt(a)); // Sort remaining ranks by value
  
        const fourOfAKindRankValue = rankValues.get(rank) || parseInt(rank); // Convert rank to numerical value, or parse as integer
        const remainingCardRankValue = rankValues.get(remainingCards[0]) || parseInt(remainingCards[0]); // Convert rank to numerical value, or parse as integer
  
        // Return [8, four of a kind rank, remaining highest card rank]
        return [8, fourOfAKindRankValue, remainingCardRankValue];
      }
    }
  
    return 0; // Return 0 for no four of a kind
}
  

function hasFullHouse(hand) {
    const rankValues = new Map([
      ['A', 14],
      ['K', 13],
      ['Q', 12],
      ['J', 11],
      ['T', 10],
      ['9', 9],
      ['8', 8],
      ['7', 7],
      ['6', 6],
      ['5', 5],
      ['4', 4],
      ['3', 3],
      ['2', 2]
    ]);
  
    const rankCounts = new Map(); // Map to store count of each rank in the hand
  
    // Iterate through hand to count ranks
    for (let card of hand) {
      const rank = card.slice(0, -1); // Extract rank without suit
      rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1); // Increment rank count in map
    }
  
    let threeOfAKindRank = null;
    let pairRank = null;
  
    for (let [rank, count] of rankCounts) {
      if (count === 3) {
        // Found three of a kind
        threeOfAKindRank = rankValues.get(rank) || parseInt(rank); // Convert rank to numerical value, or parse as integer
      }
      if (count === 2) {
        // Found a pair
        pairRank = rankValues.get(rank) || parseInt(rank); // Convert rank to numerical value, or parse as integer
      }
    }
  
    if (threeOfAKindRank && pairRank) {
      // Found both three of a kind and a pair, indicates full house
      // Return [7, three of a kind rank, pair rank]
      return [7, threeOfAKindRank, pairRank];
    }
  
    return 0; // Return 0 for no full house
  }
  

//Example Hand: [2H, 7D, JC, QS, 3C, 4C, AD]
function hasFlush(hand) {
    const suits = new Set(['H', 'D', 'C', 'S']); // Set of possible suits
    const suitCounts = new Map(); // Map to store counts of each suit
    let flushSuit = null; // Variable to store the suit that forms the flush
    for (const card of hand) {
        const suit = card.slice(-1); // Extract the last character as the suit
        if (suitCounts.has(suit)) {
          suitCounts.set(suit, suitCounts.get(suit) + 1); // Increment suit count
        } else {
          suitCounts.set(suit, 1); // Initialize suit count to 1
        }
    
        // Check if the current suit forms a flush
        if (suitCounts.get(suit) >= 5) {
          flushSuit = suit;
        }
      }

    // if there is a flush return 9
    if (flushSuit) {
        const flushCards = [];
        const rankToValue = new Map([
            ['A', 14],
            ['K', 13],
            ['Q', 12],
            ['J', 11],
            ['T', 10]
          ]);
        for (const card of hand) {
            if (card.endsWith(flushSuit)) {
                const rank = card.slice(0, -1); // Extract rank without suit
                flushCards.push(rankToValue.get(rank) || parseInt(rank)); // Convert rank to numerical value, or parse as integer
            }
        }

        flushCards.sort((a, b) => b - a); // Sort the flush cards in ascending order

        // Return [9, card1, card2, card3, card4, card5] for a flush
        return [6].concat(flushCards.slice(0, 5)); // Return only the first 5 cards
    }
    return 0;

}

function hasStraight(hand) {
    const rankValues = new Map([
      ['A', 14],
      ['K', 13],
      ['Q', 12],
      ['J', 11],
      ['T', 10],
      ['9', 9],
      ['8', 8],
      ['7', 7],
      ['6', 6],
      ['5', 5],
      ['4', 4],
      ['3', 3],
      ['2', 2]
    ]);
  
    // Convert hand ranks to numerical values and sort in descending order
    const handValues = hand.map(card => {
      const rank = card.slice(0, -1); // Extract rank without suit
      return rankValues.get(rank) || parseInt(rank); // Convert rank to numerical value, or parse as integer
    }).sort((a, b) => b - a);
  
    let straightStart = null; // Variable to store the starting rank of the straight
  
    // Iterate through hand values to check for a straight
    for (let i = 0; i < handValues.length - 1; i++) {
      if (handValues[i] - 1 !== handValues[i + 1]) {
        if (straightStart !== null && handValues[i] !== handValues[i + 1]) {
          straightStart = null; // Reset straight start if not consecutive
        }
      } else if (straightStart === null) {
        straightStart = handValues[i]; // Set straight start
      }
  
      if (straightStart !== null && straightStart - handValues[i + 1] === 4) {
        // Found a straight
        const straightRank = 5; // Rank 8 for straight
        const straightCards = [straightStart, straightStart - 1, straightStart - 2, straightStart - 3, straightStart - 4]; // Generate 5 consecutive cards
        return [straightRank].concat(straightCards);
      }
    }
  
    return 0; // Return [0] for no straight
  }
  
 
  function hasThreeOfAKind(hand) {
    const rankValues = new Map([
      ['A', 14],
      ['K', 13],
      ['Q', 12],
      ['J', 11],
      ['T', 10],
      ['9', 9],
      ['8', 8],
      ['7', 7],
      ['6', 6],
      ['5', 5],
      ['4', 4],
      ['3', 3],
      ['2', 2]
    ]);
  
    const rankCounts = new Map(); // Map to store count of each rank in the hand
  
    // Iterate through hand to count ranks
    for (let card of hand) {
      const rank = card.slice(0, -1); // Extract rank without suit
      rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1); // Increment rank count in map
    }
  
    let threeOfAKindRank = null;
    const additionalRanks = []; // Array to store additional ranks (excluding three of a kind)
  
    for (let [rank, count] of rankCounts) {
      if (count === 3) {
        // Found three of a kind
        threeOfAKindRank = rankValues.get(rank) || parseInt(rank); // Convert rank to numerical value, or parse as integer
      } else {
        // Not three of a kind, store rank for additional ranks
        additionalRanks.push(rankValues.get(rank) || parseInt(rank));
      }
    }
  
    if (threeOfAKindRank) {
      // Found three of a kind
      // Sort additional ranks in descending order
      additionalRanks.sort((a, b) => b - a);
  
      // Return [4, three of a kind rank, next highest rank, second next highest rank]
      return [4, threeOfAKindRank, additionalRanks[0], additionalRanks[1]];
    }
  
    return 0; // Return 0 for no three of a kind
  }
  
  function hasTwoPair(hand) {
    const rankValues = new Map([
        ['A', 14],
        ['K', 13],
        ['Q', 12],
        ['J', 11],
        ['T', 10],
        ['9', 9],
        ['8', 8],
        ['7', 7],
        ['6', 6],
        ['5', 5],
        ['4', 4],
        ['3', 3],
        ['2', 2]
    ]);

    const rankCounts = new Map(); // Map to store count of each rank in the hand

    // Iterate through hand to count ranks
    for (let card of hand) {
        const rank = card.slice(0, -1); // Extract rank without suit
        rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1); // Increment rank count in map
    }

    const pairRanks = [];
    let highestRank = 0;
    const remainingRanks = [];

    for (let [rank, count] of rankCounts) {
        if (count === 2) {
            // Found a pair
            const rankValue = rankValues.get(rank) || parseInt(rank); // Convert rank to numerical value, or parse as integer
            pairRanks.push(rankValue);
        } else if (count === 1) {
            // Found a single card
            const rankValue = rankValues.get(rank) || parseInt(rank); // Convert rank to numerical value, or parse as integer
            remainingRanks.push(rankValue);
        }
    }

    if (pairRanks.length === 2) {
        // Found two pairs
        // Sort pair ranks in descending order
        pairRanks.sort((a, b) => b - a);

        // Sort remaining ranks in descending order
        remainingRanks.sort((a, b) => b - a);

        // Return [3, highest pair rank, second highest pair rank, highest remaining card rank]
        return [3, pairRanks[0], pairRanks[1], Math.max(...remainingRanks)];
    } else if (pairRanks.length === 3) {
        // Found three pairs
        // Sort pair ranks in descending order
        pairRanks.sort((a, b) => b - a);

        // Sort remaining ranks in descending order
        remainingRanks.sort((a, b) => b - a);

        // Return [3, highest pair rank, second highest pair rank, highest remaining card rank]
        return [3, pairRanks[0], pairRanks[1], Math.max(pairRanks[2], ...remainingRanks)];
    }

    return 0; // Return 0 for no two pair
}






  function hasOnePair(hand) {
    const rankValues = new Map([
      ['A', 14],
      ['K', 13],
      ['Q', 12],
      ['J', 11],
      ['T', 10],
      ['9', 9],
      ['8', 8],
      ['7', 7],
      ['6', 6],
      ['5', 5],
      ['4', 4],
      ['3', 3],
      ['2', 2]
    ]);
  
    const rankCounts = new Map(); // Map to store count of each rank in the hand
  
    // Iterate through hand to count ranks
    for (let card of hand) {
      const rank = card.slice(0, -1); // Extract rank without suit
      rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1); // Increment rank count in map
    }
  
    let pairRank = null;
    const remainingRanks = [];
  
    for (let [rank, count] of rankCounts) {
      if (count === 2) {
        // Found a pair
        pairRank = rankValues.get(rank) || parseInt(rank); // Convert rank to numerical value, or parse as integer
      } else if (count === 1) {
        // Found a single card
        const rankValue = rankValues.get(rank) || parseInt(rank); // Convert rank to numerical value, or parse as integer
        remainingRanks.push(rankValue);
      }
    }

    if (pairRank) {
      // Found one pair
      // Sort remaining ranks in descending order
      remainingRanks.sort((a, b) => b - a);
      // Return [2, pair rank, highest remaining card rank, second highest remaining card rank, third highest remaining card rank]
      return [2, pairRank, remainingRanks[0], remainingRanks[1], remainingRanks[2]];
    }
  
    return 0; // Return [0] for no one pair
  }
  
  function hasHighCard(hand) {
    const rankValues = new Map([
      ['A', 14],
      ['K', 13],
      ['Q', 12],
      ['J', 11],
      ['T', 10],
      ['9', 9],
      ['8', 8],
      ['7', 7],
      ['6', 6],
      ['5', 5],
      ['4', 4],
      ['3', 3],
      ['2', 2]
    ]);
  
    const ranks = [];
  
    // Iterate through hand to get ranks of all cards
    for (let card of hand) {
      const rank = card.slice(0, -1); // Extract rank without suit
      const rankValue = rankValues.get(rank) || parseInt(rank); // Convert rank to numerical value, or parse as integer
      ranks.push(rankValue);
    }
  
    // Sort ranks in descending order
    ranks.sort((a, b) => b - a);
  
    // Return [1, highest card rank, second highest card rank, third highest card rank, fourth highest card rank, fifth highest card rank]
    return [1, ranks[0], ranks[1], ranks[2], ranks[3], ranks[4]];
  }

export function getBotAction(actionB, playerCardsB, communityCardsB, potB, roundB, options) {
    console.log("the community cards are: " + communityCardsB)
    console.log("the player cards are: " + playerCardsB)
        const cardsB = playerCardsB.concat(communityCardsB);
        console.log("full hand: " + cardsB)
        const lastAction = actionB;
        const cardBucket = getHandRank(cardsB)[0];
        const nodeRound = roundB;
        let potVal = 0;
        if (potB <= 300 ) {
            potVal = 0;
        } else if (potB > 300 && potB < 900) {
            potVal = 1;
        } else {
            potVal = 2;
        }
    const key = `${cardBucket} ${lastAction} ${nodeRound} ${potVal}`;
    console.log("key: " + key)
    return fetch('/trainedData2.json')
    .then(response => response.json())
    .then(strategy => {
        if (key in strategy) {
            console.log("strategy[key]: " + strategy[key]);
            const move = strategy[key];
            const action = getRandomChoice(options, move);
            console.log("action: " + action)
            return action;
        } else {
            console.log('this is a random choice')
            return getRandomChoice(options,null);
        }
    })
    .catch(error => {
        console.error('Error fetching trainedData2.json:', error);
    });
}


function getFilteredProbabilities(options, move) {
    const actionMap = ['f', 'c', 'b', 'x', 'a'];
    const filteredProbabilities = options.map(option => {
      const index = actionMap.indexOf(option);
      return move[index];
    });
  
    // Normalize the probabilities so they add up to 1
    const total = filteredProbabilities.reduce((a, b) => a + b, 0);
    return filteredProbabilities.map(prob => prob / total);
  }

function getRandomChoice(options, probabilities = null) {
    if (probabilities === null) {
        const randomIndex = Math.floor(Math.random() * options.length);
        console.log("options[randomIndex]: " + options[randomIndex])
        return options[randomIndex];
    } else {
        const filteredProbabilities = getFilteredProbabilities(options, probabilities);
        let randomValue = Math.random();
        let sum = 0;
        for (let i = 0; i < filteredProbabilities.length; i++) {
            sum += filteredProbabilities[i];
            if (randomValue < sum) {
                return options[i];
            }
        }
    }
}

let strategies;

function main() {
    const pokerGame = new TexasHoldEm();
    const numIterations = 1; // Choose the number of iterations to run
    const startTime = performance.now();
    pokerGame.train(numIterations);
    strategies = Object.fromEntries(
        Object.entries(pokerGame.nodeMap).map(([k, v]) => [k, v.getAverageStrategy()])
    );
    const jsonString = JSON.stringify(strategies, null, 2); // The '2' parameter adds indentation for readability
    fs.writeFile('public/trainedData3.json', jsonString, (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('Strategy saved to trainedData3.json');
        }
      });
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log(`The code took ${elapsedTime} milliseconds to run for ${numIterations} iterations.`);
}

//main();

//export default TexasHoldEm;