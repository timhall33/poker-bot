import './App.css';
import React from "react";
import PokerTable from "./components/PokerTable/PokerTable";
import Header from "./components/Header/Header";
import DealButton from './components/Deal/Deal';


function App() {
  return (
    <div className="App">
      <Header />
      <PokerTable />
      <DealButton />
    </div>
  );
}

export default App;
