const shuffle = require('shuffle-array');
const assert = require('assert');

class Kuhn {
  constructor() {
    this.nodeMap = {};
    this.expectedGameValue = 0;
    this.nCards = 3;
    this.nashEquilibrium = {};
    this.currentPlayer = 0;
    this.deck = [0, 1, 2];
    this.nActions = 2;
  }

  train(nIterations = 50000) {
    let expectedGameValue = 0;

    for (let i = 0; i < nIterations; i++) {
      shuffle(this.deck);
      expectedGameValue += this.cfr('', 1, 1);
      for (const key in this.nodeMap) {
        this.nodeMap[key].updateStrategy();
      }
    }

    expectedGameValue /= nIterations;
    displayResults(expectedGameValue, this.nodeMap);
  }

  cfr(history, pr1, pr2) {
    const n = history.length;
    const isPlayer1 = n % 2 === 0;
    const playerCard = isPlayer1 ? this.deck[0] : this.deck[1];

    if (this.isTerminal(history)) {
      const cardPlayer = isPlayer1 ? this.deck[0] : this.deck[1];
      const cardOpponent = isPlayer1 ? this.deck[1] : this.deck[0];
      const reward = this.getReward(history, cardPlayer, cardOpponent);
      return reward;
    }

    const node = this.getNode(playerCard, history);
    const strategy = node.strategy;

    let actionUtils = Array(this.nActions).fill(0);

    for (let act = 0; act < this.nActions; act++) {
      const nextHistory = history + node.actionDict[act];
      if (isPlayer1) {
        actionUtils[act] = -1 * this.cfr(nextHistory, pr1 * strategy[act], pr2);
      } else {
        actionUtils[act] = -1 * this.cfr(nextHistory, pr1, pr2 * strategy[act]);
      }
    }

    const util = actionUtils.reduce((acc, curr, idx) => acc + curr * strategy[idx], 0);

    let regrets = actionUtils.map((x, idx) => x - util);
    if (isPlayer1) {
      node.reachPr += pr1;
      node.regretSum = node.regretSum.map((x, idx) => x + pr2 * regrets[idx]);
    } else {
      node.reachPr += pr2;
      node.regretSum = node.regretSum.map((x, idx) => x + pr1 * regrets[idx]);
    }

    return util;
  }

  isTerminal(history) {
    return history.slice(-2) === 'pp' || history.slice(-2) === 'bb' || history.slice(-2) === 'bp';
  }

  getReward(history, playerCard, opponentCard) {
    const terminalPass = history.slice(-1) === 'p';
    const doubleBet = history.slice(-2) === 'bb';
    if (terminalPass) {
      if (history.slice(-2) === 'pp') {
        return playerCard > opponentCard ? 1 : -1;
      } else {
        return 1;
      }
    } else if (doubleBet) {
      return playerCard > opponentCard ? 2 : -2;
    }
  }

  getNode(card, history) {
    const key = `${card} ${history}`;
    if (!this.nodeMap.hasOwnProperty(key)) {
        const actionDict = { 0: 'p', 1: 'b' };
        const infoSet = new Node(key, actionDict);
        this.nodeMap[key] = infoSet;
        return infoSet;
      }
      return this.nodeMap[key];
    }
  }
  
  class Node {
    constructor(key, actionDict, nActions = 2) {
      this.key = key;
      this.nActions = nActions;
      this.regretSum = Array(this.nActions).fill(0);
      this.strategySum = Array(this.nActions).fill(0);
      this.actionDict = actionDict;
      this.strategy = Array(this.nActions).fill(1 / this.nActions);
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
      const strategies = this.getAverageStrategy().map(x => x.toFixed(2));
      return `${this.key.padEnd(6)} ${strategies}`;
    }
  }
  
  function displayResults(ev, iMap) {
    console.log(`player 1 expected value: ${ev}`);
    console.log(`player 2 expected value: ${-1 * ev}`);
    console.log();
  
    console.log('player 1 strategies:');
    const sortedKeys = Object.keys(iMap).sort();
    for (const key of sortedKeys.filter(x => x.split(' ')[1].length % 2 === 0)) {
      console.log(iMap[key].toString());
    }
  
    console.log();
    console.log('player 2 strategies:');
    for (const key of sortedKeys.filter(x => x.split(' ')[1].length % 2 === 1)) {
      console.log(iMap[key].toString());
    }
  }
  
  if (require.main === module) {
    const startTime = new Date();
    const trainer = new Kuhn();
    trainer.train(25000);
    const endTime = new Date();
    console.log(`Execution time: ${endTime - startTime} ms`);
  }
  
  module.exports = Kuhn;
