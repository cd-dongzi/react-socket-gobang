class Channel {
    constructor (userId, socket, io, ctx) {
        this.ctx = ctx
        this.io = io
        this.socket = socket
        this.userId = userId
        this.user = null
        this.room = null
    }

    init () {
        const room = this.ctx.rooms[0]
        this.room = room
        this.socket.join(`room${room.id}`)
        this.sendMsg()
        this.addUser()
        this.joinPK()
        this.sendChesses()
        this.sendNextPlayer()
        this.sendOverStatus()
        this.againPlay()
        this.socket.on('disconnect', data => {
            this.removeUser(this.user)
        })
        
        this.socket.on('out', data => {
            this.removeUser(data)
        })
    }
    // 用户离开
    removeUser (user) {
        this.ctx.removeUser(user)
        this.io.sockets.to(`room${this.room.id}`).emit('remove_user', user)
        this.sendUserList()
        this.sendPlayers()
    }
    initSend () {
        this.sendUserList()
        this.sendChessesList()
        this.newNextPlay()
        this.sendMsgList()
        this.sendPlayers()
    }
    initBoard (data) {
        this.io.sockets.to(`room${this.room.id}`).emit('init_board', data)
        this.socket.leave(`room${this.room.id}`)
    }
    addUser () {
        this.socket.on('add_user', data => {
            if (this.ctx.users.some(v => v.username === data.username)) {
                console.log('用户名重复')
                this.socket.emit('err', '用户名重复')
                return
            }
            let user = {
                ...data,
                userId: this.userId
            }
            this.ctx.createUser(user)
            this.initSend()
        })
    }
    sendChesses () {
        this.socket.on('send_chesses', data => {
            this.ctx.addChesses(data.chesses)
            this.sendChessesList()
        })
    }
    sendNextPlayer () {
        this.socket.on('send_next_player', data => {
            this.ctx.setNextPlayer(data)
            this.newNextPlay()
        })
    }
    sendOverStatus () {
        this.socket.on('send_over_status', data => {
            this.ctx.setOverStatus(data)
            this.sendOver()
        })
    }
    sendMsg () {
        this.socket.on('send_msg', data => {
            this.ctx.addMsg({
                ...this.user,
                msg: data.msg
            })
            this.sendMsgList()
        })
    }
    setUser (user) {
        console.log(user)
        this.user = user
        this.socket.emit('new_user', user)
    }
    joinPK () {
        this.socket.on('joinPK', data => {
            if (this.ctx.players.some(user => user.userId === data.userId)) {
                console.log('你已在等待列表中')
                this.socket.emit('err', '你已在等待列表中')
                return
            }
             if (this.ctx.players.length >= 2) {
                console.log('对战人数足够')
                this.socket.emit('err', '对战人数足够')
                return
            }
            this.ctx.addPlayer(data)
            console.log('对战人数')
            console.log(this.ctx.players)
            this.sendPlayers()
        })
    }
    againPlay () {
        this.socket.on('again_play', () => {
            this.ctx.againPlay()
            this.io.sockets.to(`room${this.room.id}`).emit('on_again_play')
        })
    }
    newNextPlay () {
        this.io.sockets.to(`room${this.room.id}`).emit('new_next_player', this.ctx.nextPlayer)
    }
    sendPlayers () {
        this.io.sockets.to(`room${this.room.id}`).emit('players', this.ctx.players)
    }
    sendUserList () {
        this.io.sockets.to(`room${this.room.id}`).emit('user_list', this.ctx.users)
    }
    sendMsgList () {
        this.io.sockets.to(`room${this.room.id}`).emit('msg_list', this.ctx.msgs)
    }
    sendChessesList () {
        this.io.sockets.to(`room${this.room.id}`).emit('chesses_list', this.ctx.chesses)
    }
    sendOver () {
        this.io.sockets.to(`room${this.room.id}`).emit('over', this.ctx.winner)
    }
}

export default Channel