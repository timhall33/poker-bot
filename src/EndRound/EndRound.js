import './EndRound.css'
import React from 'react';

export function EndRound({ winner }) {
return (
    <div className="winner-container">
        <h1 className="winner-message">{`${winner}`}</h1>
    </div>
    );
}