import './App.css';
import React from "react";
import PokerTable from "./components/PokerTable/PokerTable";
import Header from "./components/Header/Header";
import DealButton from './components/Deal/Deal';
import RenderMoneyInHand, { RenderPot } from './components/Money/Money';
import PlayerBetBox, { BotBetBox } from './components/PlayerBets/PlayerBets';
import { startGame } from './components/StartGame/StartGame';


function App() {
  startGame();
  return (
    <div className="App">
      <Header />
      <PokerTable />
      <DealButton />
    </div>
  );
}

export default App;
