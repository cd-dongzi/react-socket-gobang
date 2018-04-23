import React from 'react'
import connect from 'connect'
@connect
export default class JoinList extends React.Component {
    joinPK () {
        const {room: {mine}, ctx} = this.props.state
        ctx.joinPK(mine)
    }
    render () {
        const {mine, players} = this.props.state.room
        return (
            <div className="join-wrapper">
                <div className="list">
                    <small>{players.length >= 2 ? '当前游戏人员':`当前等待人数: ${players.length}`}</small>
                    <ul>
                        {
                            players.map((user, index) => (
                                <li key={index} className={mine.userId === user.userId ? 'active':''}>
                                    <img src={user.avatar} alt={user.username}/>
                                    <span>{user.username}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                {
                    players.some(user => user.userId === mine.userId) ? '':<button className="btn" onClick={this.joinPK.bind(this)}>进入PK</button>
                }
            </div>
        )
    }
}