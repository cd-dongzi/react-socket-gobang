import React from 'react'
import connect from 'connect'
@connect
export default class extends React.Component {
	state = {
        w: document.documentElement.clientWidth
	}
	render () {
		const {users, mine} = this.props.state.room
		return (
			<div className="userlist-wrapper">
				{
					this.state.w >= 600 ? (
						<div className="userlist-box">
							<small>用户列表</small>
							<ul>
								{
									users.map( (user, index) => (
										<li key={index} className={user.userId === mine.userId ? 'active':''}>
											<div className="bg-cover cover" style={{backgroundImage: `url(${user.avatar})`}}></div>
											<span>{user.username}</span>
										</li>
									))
								}
							</ul>
						</div>
					) : (
						<div className="avatar-box">
							<small>用户</small>
							<ul>
								{
									users.map( (user, index) => (
										<li key={index} className={user.userId === mine.userId ? 'active':''}>
											<div className="bg-cover cover" style={{backgroundImage: `url(${user.avatar})`}}></div>
										</li>
									))
								}
							</ul>
						</div>
					)
				}
			</div>
		)
	}
}