import React from 'react';

export default (props) => {
    return (
        <div>
            {props.snakeCoordinates.map((coord, i) => {
                const style = {
                    left: `${coord[0]}%`,
                    top: `${coord[1]}%`
                }
                return (
                    <div className='snake-coord' key={i} style={style}></div>
                )
            })}
        </div>
    )
}