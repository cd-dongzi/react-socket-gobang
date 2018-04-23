import React from 'react'
import ChatBox from '../ChatBox'
import PlayBox from '../PlayBox'
import JoinList from '../JoinList'
import connect from 'connect'
@connect
export default class extends React.Component {
	state = {
		isChatBox: false
	}
    out () {
    	this.props.state.ctx.out(this.props.state.room.mine)
    	this.props.clearRoom()
		this.props.history.push('/')
    }
	render () {
		let {isChatBox} = this.state
		return (
			<div className="battle-wrapper">
				<div className="cf nav">
					<button className="btn out fr" onClick={this.out.bind(this)}>退出</button>
					<p>当前总人数：{this.props.state.room.users.length}</p>
				</div>
				<div className="df-c main">
					<PlayBox/>
					<JoinList/>
				</div>
				<button className="btn show-chatBox" onClick={() => {this.setState({isChatBox: !isChatBox})}}>{!isChatBox ? '显示':'隐藏'}聊天框</button>
				{
					isChatBox ? (
						<div className="charbox-container">
							<ChatBox/>
						</div>
					) : ''
				}
			</div>
		)
	}
}