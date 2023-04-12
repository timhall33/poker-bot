import './App.css';
import React from "react";
import PokerTable from "./components/PokerTable/PokerTable";
import Header from "./components/Header/Header";
import DealButton from './components/Deal/Deal';
import CardContainer from './components/Cards/Cards';


function App() {
  return (
    <div className="App">
      <Header />
      <PokerTable />
      <DealButton />
      <CardContainer />
    </div>
  );
}

export default App;
