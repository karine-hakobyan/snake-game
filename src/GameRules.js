import React from 'react';

const GameRules = () => {
    return(
        <p className='game-rules-content' style={{ textAlign: 'center' }}>Game rules: <br/>
          This is a simple Snake game. After eating the food your score will increase by 1. 
          Also snake's speed and length will increase.
          'Game over' is announced when the snake go out of borders or when it eats itself.<br/>
          Now choose your speed and start the game.
        </p>
    )
}

export default GameRules;