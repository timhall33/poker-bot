import { getPot } from "../components/Money/Money";
import { player1, player2 } from "../components/StartGame/StartGame";

export function getHandRank(hand) {
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
  
    return 0; // Return [0] for no four of a kind
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
  
    return 0; // Return [0] for no full house
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
  
    return 0; // Return [0] for no three of a kind
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

    return 0; // Return [0] for no two pair
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
  


export function determineWinner(hand1, hand2) {
    const handRank1 = getHandRank(hand1);
    const handRank2 = getHandRank(hand2);
    if (handRank1[0] > handRank2[0]) {
        player1.addMoney(getPot());
        return "You Win!";
    } else if (handRank2[0] > handRank1[0]) {
        player2.addMoney(getPot());
        return "Bot wins.";
    } else {
        for (let i = 1; i < handRank1.length; i++) {
            if (handRank1[i] > handRank2[i]) {
                console.log("hand 1 wins.");
                player1.addMoney(getPot());
                return "You Win!";
            } else if (handRank2[i] > handRank1[i]) {
                player2.addMoney(getPot());
                return "Bot wins.";
            }
        }
        player1.addMoney(getPot()/2);
        player2.addMoney(getPot()/2);
        return "Tie.";
    }
}

export function determineWinnerT(hand1, hand2, communityCards) {
  const fullHand1 = hand1 + "," + communityCards;
  const fullHand2 = hand2 + "," + communityCards;
  const fullHand1A = fullHand1.split(',');
  const fullHand2A = fullHand2.split(',');
  const handRank1 = getHandRank(fullHand1A);
  const handRank2 = getHandRank(fullHand2A);
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