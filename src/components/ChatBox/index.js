import React from 'react'
import UserList from '../UserList'
import {sendMsg} from 'actions/socket-client'
import connect from 'connect'
@connect
export default class ChatBox extends React.Component {
    state = {
        msg: '',
        w: document.documentElement.clientWidth
    }
    sendMsg () {
        const msg = this.state.msg
        if (!msg) {
            alert('消息发送不能为空！')
            return
        }
        this.props.state.ctx.sendMsg(this.state.msg)
        this.setState({
            msg: ''
        })
    }
    handleMsg (value) {
        this.setState({
            msg: value
        })
    }
    render () {
        const {msgs, mine, nextLeaveUser} = this.props.state.room
        return (
            <div className="chatBox-wrapper cf">
                <div className="fl user-slide">
                    <UserList/>
                </div>
                <div className={`fr wrapper ${this.state.w >= 600 ? '':'avatar-wrapper'}`}>
                    <div className="show-box">
                        {nextLeaveUser?<div className="msg-bar">{nextLeaveUser.username}离开了</div>:''}
                        <ul>
                            {
                                msgs.map( (msg, index) => mine.userId === msg.userId ? (
                                    <li key={index} className="tr">
                                        <div className="msg-l" style={{marginRight: '10px'}}>
                                            <div className="name tr">{msg.username}</div>
                                            <div className={`msg tr msg-active`}>{msg.msg}</div>
                                        </div> 
                                        <div className="msg-r">
                                            <div className="bg-cover cover" style={{backgroundImage: `url(${msg.avatar})`}}></div>
                                        </div> 
                                    </li>
                                ) : (
                                    <li key={index} className="tl">
                                        <div className="msg-r">
                                            <div className="bg-cover cover" style={{backgroundImage: `url(${msg.avatar})`}}></div>
                                        </div> 
                                        <div className="msg-l" style={{marginLeft: '10px'}}>
                                            <div className="name tl">{msg.username}</div>
                                            <div className={`msg tl}`}>{msg.msg}</div>
                                        </div> 
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="input-box">
                        <textarea value={this.state.msg} onChange={e => {this.handleMsg(e.target.value)}}></textarea>
                        <button className="btn" onClick={this.sendMsg.bind(this)}>send</button>
                    </div>
                </div>
            </div>
        )
    }
}
