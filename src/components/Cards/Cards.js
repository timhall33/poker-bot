import React from 'react';
import './Cards.css';

const cardImages = {
    1: "/images/2_of_clubs.png",
    2: "/images/3_of_clubs.png",
    3: "/images/4_of_clubs.png",
    4: "/images/5_of_clubs.png",
    5: "/images/6_of_clubs.png",
    6: "/images/7_of_clubs.png",
    7: "/images/8_of_clubs.png",
    8: "/images/9_of_clubs.png",
    9: "/images/10_of_clubs.png",
    10: "/images/jack_of_clubs2.png",
    11: "/images/queen_of_clubs2.png",
    12: "/images/king_of_clubs2.png",
    13: "/images/ace_of_clubs.png",
    14: "/images/2_of_diamonds.png",
    15: "/images/3_of_diamonds.png",
    16: "/images/4_of_diamonds.png",
    17: "/images/5_of_diamonds.png",
    18: "/images/6_of_diamonds.png",
    19: "/images/7_of_diamonds.png",
    20: "/images/8_of_diamonds.png",
    21: "/images/9_of_diamonds.png",
    22: "/images/10_of_diamonds.png",
    23: "/images/jack_of_diamonds2.png",
    24: "/images/queen_of_diamonds2.png",
    25: "/images/king_of_diamonds2.png",
    26: "/images/ace_of_diamonds.png",
    27: "/images/2_of_hearts.png",
    28: "/images/3_of_hearts.png",
    29: "/images/4_of_hearts.png",
    30: "/images/5_of_hearts.png",
    31: "/images/6_of_hearts.png",
    32: "/images/7_of_hearts.png",
    33: "/images/8_of_hearts.png",
    34: "/images/9_of_hearts.png",
    35: "/images/10_of_hearts.png",
    36: "/images/jack_of_hearts2.png",
    37: "/images/queen_of_hearts2.png",
    38: "/images/king_of_hearts2.png",
    39: "/images/ace_of_hearts.png",
    40: "/images/2_of_spades.png",
    41: "/images/3_of_spades.png",
    42: "/images/4_of_spades.png",
    43: "/images/5_of_spades.png",
    44: "/images/6_of_spades.png",
    45: "/images/7_of_spades.png",
    46: "/images/8_of_spades.png",
    47: "/images/9_of_spades.png",
    48: "/images/10_of_spades.png",
    49: "/images/jack_of_spades2.png",
    50: "/images/queen_of_spades2.png",
    51: "/images/king_of_spades2.png",
    52: "/images/ace_of_spades2.png"
  };
  
  export const generatePlayersCards = (nums, num1, num2, isBot) => {
    const card1 = cardImages[nums[num1]];
    const card2 = cardImages[nums[num2]]; 
    const cardContainerClass = isBot ? 'bot-cards' : 'my-cards';
    return (
      <div className={cardContainerClass}>
        <img className = 'card-image' src={process.env.PUBLIC_URL + card1} alt={`Card ${nums[num1]}`} /> 
        <img className = 'card-image' src={process.env.PUBLIC_URL + card2} alt={`Card ${nums[num2]}`} />
      </div>
    );
  };


  export const generateMiddleCards = (nums, count) => {
    console.log("Count: " + count);
    const card1 = cardImages[nums[47]];
    const card2 = cardImages[nums[48]]; 
    const card3 = cardImages[nums[49]];
    const card4 = cardImages[nums[50]]; 
    const card5 = cardImages[nums[51]];
  
    let renderedCards;
    if (count === 0) {
      renderedCards = (
        <div className='middle-cards'></div>
      );
    } else if (count === 1) {
      renderedCards = (
        <div className='middle-cards'>
          <img className='card-image' src={process.env.PUBLIC_URL + card1} alt={`Card ${nums[47]}`} /> 
          <img className='card-image' src={process.env.PUBLIC_URL + card2} alt={`Card ${nums[48]}`} />
          <img className='card-image' src={process.env.PUBLIC_URL + card3} alt={`Card ${nums[49]}`} /> 
        </div>
      );
    } else if (count === 2) {
      renderedCards = (
        <div className='middle-cards'>
          <img className='card-image' src={process.env.PUBLIC_URL + card1} alt={`Card ${nums[47]}`} /> 
          <img className='card-image' src={process.env.PUBLIC_URL + card2} alt={`Card ${nums[48]}`} />
          <img className='card-image' src={process.env.PUBLIC_URL + card3} alt={`Card ${nums[49]}`} /> 
          <img className='card-image' src={process.env.PUBLIC_URL + card4} alt={`Card ${nums[50]}`} />
        </div>
      );
    } else {
      renderedCards = (
        <div className='middle-cards'>
          <img className='card-image' src={process.env.PUBLIC_URL + card1} alt={`Card ${nums[47]}`} /> 
          <img className='card-image' src={process.env.PUBLIC_URL + card2} alt={`Card ${nums[48]}`} />
          <img className='card-image' src={process.env.PUBLIC_URL + card3} alt={`Card ${nums[49]}`} /> 
          <img className='card-image' src={process.env.PUBLIC_URL + card4} alt={`Card ${nums[50]}`} />
          <img className='card-image' src={process.env.PUBLIC_URL + card5} alt={`Card ${nums[51]}`} /> 
        </div>
      );
    }
  
    return renderedCards;
  };
  


  export function generateRandomNumbers(num) {
    const numbers = Array.from({length: 52}, (_, i) => i + 1);
    const shuffledNumbers = shuffle(numbers);
    const randomNumbers = shuffledNumbers.slice(0, num);
    return randomNumbers;
  }
  
  function shuffle(array) {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }