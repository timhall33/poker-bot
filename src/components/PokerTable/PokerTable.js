import React from "react";
import "./PokerTable.css"; 

const PokerTable = () => {
    return (
      <div className="container">
        <img src={process.env.PUBLIC_URL + "/images/poker-table.jpg"} alt="Poker Table" className="pokerImg"/>
      </div>
    );
  };
  
  export default PokerTable;