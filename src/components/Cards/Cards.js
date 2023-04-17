import React from 'react';
import './Cards.css';

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
  
  export const getHandCards = (nums, num1, num2) => {
    const card1 = Object.keys(cardImages)[nums[num1]];
    const card2 = Object.keys(cardImages)[nums[num2]];
    const cards = [card1, card2];
    return cards;
  }

  export const getMiddleCards = (nums) => {
    
    const card1 = Object.keys(cardImages)[nums[47]];
    const card2 = Object.keys(cardImages)[nums[48]];
    const card3 = Object.keys(cardImages)[nums[49]];
    const card4 = Object.keys(cardImages)[nums[50]];
    const card5 = Object.keys(cardImages)[nums[51]];
    const cards = [card1, card2, card3, card4, card5];
    return cards;
  }

  export const generatePlayersCards = (nums, num1, num2, isBot) => {
    const card1 = Object.values(cardImages)[nums[num1]];
    const card2 = Object.values(cardImages)[nums[num2]];
    const cardContainerClass = isBot ? 'bot-cards' : 'my-cards';
    return (
      <div className={cardContainerClass}>
        <img className = 'card-image' src={process.env.PUBLIC_URL + card1} alt={`Card ${nums[num1]}`} /> 
        <img className = 'card-image' src={process.env.PUBLIC_URL + card2} alt={`Card ${nums[num2]}`} />
      </div>
    );
  };


  export const generateMiddleCards = (nums, count) => {
    const card1 = Object.values(cardImages)[nums[47]];
    const card2 = Object.values(cardImages)[nums[48]];
    const card3 = Object.values(cardImages)[nums[49]];
    const card4 = Object.values(cardImages)[nums[50]];
    const card5 = Object.values(cardImages)[nums[51]];
  
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
    const randomNumbers = shuffledNumbers.slice(0, num).map(num => num - 1);
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