import React from 'react';

export default (props) => {
    const style = {
        left: `${props.coord[0]}%`,
        top: `${props.coord[1]}%`
    }
    return (
        <div className="snake-food" style={style}>
        </div>
    )
}