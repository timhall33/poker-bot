import Player from "../Player/Player";

let player1;
let player2;

export const startGame = () => {
    player1 = new Player('Tim', 1000);
    player2 = new Player('Bot', 1000);
}

export { player1, player2 };
