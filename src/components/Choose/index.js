import React from 'react'

export default ({history}) => (
    <div className="type-wrapper mask-fixed-wrapper df-c">
        <div className="type-box">
            <button className="btn" onClick={e => {history.push('/man-machine')}}>人机对战</button>
            <button className="btn" onClick={e => {history.push('/battle')}}>在线PK</button>
        </div>
    </div>
)