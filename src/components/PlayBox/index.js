import React from 'react'
import Gobang from '../Gobang'
import connect from 'connect'
import {withRouter} from 'react-router-dom'
@connect
@withRouter
export default class extends React.Component {
	state = {
		again: false
	}
    onChange(data) {
        this.props.state.ctx.sendChesses(data)
    }
    onNext (user) {
    	this.props.state.ctx.sendNextPlayer(user)
    }
    onWinner (user) {
    	this.props.state.ctx.sendOverStatus(user)
    }
    out () {
    	this.props.state.ctx.out(this.props.state.room.mine)
    	this.props.clearRoom()
		this.props.history.push('/')
    }
    again () {
    	this.props.state.ctx.againPlay()
    }
	render () {
		let {players, nextPlayar, over, winner, isPopupRes, mine} = this.props.state.room
		let blackPlayer = players.length >= 2 ? players[0] : null
		let whitePlayer = players.length >= 2 ? players[1] : null
		if (players.some(v => v && nextPlayar && v.userId === nextPlayar.userId)) {
			nextPlayar = nextPlayar || blackPlayer
		}else{
			nextPlayar = players[0]
		}
		return (
			<div className="board-wrapper">
				<Gobang 
					onChange={this.onChange.bind(this)} 
					type="R" 
					chesses={this.props.state.room.chesses} 
					nextPlayer={nextPlayar || blackPlayer}
					onNext={this.onNext.bind(this)}
					onWinner={this.onWinner.bind(this)}
					blackPlayer={blackPlayer}
					whitePlayer={whitePlayer}
					over={over}
					style={!over && nextPlayar && mine.userId === nextPlayar.userId ? {} : {pointerEvents: 'none'}}/>
			    {
			    	players.length >= 2 && !over ? (
						<div className="players cd">
							<div className="black-player player fl">
								<div className="guide">
									{nextPlayar.userId === blackPlayer.userId ? <img src={require('assets/black.png')} alt=""/>:''}
								</div>
								<div className="info">
									<img src={blackPlayer.avatar} alt=""/>
									<div>{blackPlayer.username}</div>
								</div>
							</div>
							<div className="white-player player fr">
								<div className="guide">
									{nextPlayar.userId === whitePlayer.userId ? <img src={require('assets/white.png')} alt=""/>:''}
								</div>
								<div className="info">
									<img src={whitePlayer.avatar} alt=""/>
									<div>{whitePlayer.username}</div>
								</div>
							</div>
						</div>
			    	) : (over && !isPopupRes) ? 
			    	<div className="canvas-mask df-c">
			    		<div>
    			    		<img src={winner.avatar} alt={winner.username}/>
    						<p>恭喜 {winner.username} 获胜</p>
    						<button className="btn" onClick={this.again.bind(this)}>再来一次</button>
			    		</div>
			    	</div> : 
			    	<div className="canvas-mask df-c">等待选手就位</div>
			    }
			</div>
		)
	}
}