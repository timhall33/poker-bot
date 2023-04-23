class Player {
    constructor(name, money) {
      this.name = name;
      this.money = money;
      this.hand = [];
    }
  
    // Method to add money to the player's hand
    addMoney(amount) {
      this.money += amount;
    }
  
    // Method to remove money from the player's hand
    removeMoney(amount) {
      if (this.money >= amount) {
        this.money -= amount;
        return true;
      } else {
        return false;
      }
    }
  
    // Method to add cards to the player's hand
    addCards(cards) {
      this.hand = this.hand.concat(cards);
    }
  
    // Method to reset the player's hand
    resetHand() {
      this.hand = [];
    }

    getMoney() {
      return this.money;
    }
  }
  
  export default Player;
  