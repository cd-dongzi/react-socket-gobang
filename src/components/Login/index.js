import React from 'react'
import {Redirect} from 'react-router-dom'
import {ctx, createCtx} from 'actions'
import connect from 'connect'
@connect
export default class Login extends React.Component {
    state = {
        username: '',
        avatar: require('assets/avatar1.jpg')
    }
    async login () {
        const {username, avatar} = this.state
        if (!username) {
            return alert('请输入用户名!!!')
        }
        this.props.createCtx(ctx)
        try {
            await ctx.init()
            await ctx.addUser({
                username,
                avatar
            })
        }catch(e) {
            alert(e)
        }
        
    }
    handleUser (value) {
        this.setState({ username: value })
    } 
    handleAvatar (avatar) {
        this.setState({ avatar })
    }
    render () {
        if (this.props.state.room.mine) {
            return <Redirect to="/battle"/>
        }
        let avatars = []
        for (var i = 1; i <= 5; i++) {
            avatars[i] = require(`assets/avatar${i}.jpg`)
        }
        
        return (
            <div className="login-wrapper mask-fixed-wrapper df-c">
                <div className="login-box">
                    <div className="login-item">
                        <span>用户名</span>
                        <input className="input username" maxLength="10" type="text" value={this.state.username} onChange={e => {this.handleUser(e.target.value)}}/>
                    </div>
                    <div className="login-item">
                        <div className="curr-avatar">
                            <span>当前头像:</span>
                            <div className="bg-cover show-cover" style={{backgroundImage: `url(${this.state.avatar})`}}></div>
                        </div>
                        <ul>
                            {
                                avatars.map((avatar, index) => (
                                    <li key={index}>
                                        <div key={index} className="cover bg-cover" style={{backgroundImage: `url(${avatar})`}}>
                                            <input className="cover-checkbox" name="avatars" type="radio" onClick={this.handleAvatar.bind(this, avatar)}></input>
                                            <div className="icon"></div>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <button className="btn" onClick={this.login.bind(this)}>登陆</button>
                </div>
            </div>
        )
    }
}
