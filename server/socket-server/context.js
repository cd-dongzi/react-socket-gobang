import Room from './room'
import Channel from './channel'
class Context {
    constructor () {
        this.rooms = new Room().rooms
        this.users = []
        this.msgs = []
        this.players = []
        this.chesses = []
        this.channels = []
        this.nextPlayer = null
        this.over = false
        this.winner = null
    }
    createChannel (userId, socket, io) {
        let channel = new Channel(userId, socket, io, this)
        channel.init()
        this.channels.push(channel)
    }
    createUser (user) {
        let channel = this.channels.find(channel => channel.userId === user.userId)
        channel.setUser(user)
        this.users.push(user)
    }
    removeUser (user) {
        this.users.splice(this.users.findIndex(v => v && v.userId === user.userId), 1)
        let playerIndex = this.players.findIndex(v => v && v.userId === user.userId)
        if (playerIndex>=0) {
            let player = this.players.splice(playerIndex, 1)
            let channel = this.channels.find(channel => channel.userId === user.userId)
            this.chesses = []
            channel.initBoard({user, players: this.players})
        }
        
    }
    addPlayer (user) {
        this.players.push(user)
    }
    addChesses (chesses) {
        this.chesses = chesses
    }
    againPlay () {
        this.chesses = []
        this.players = []
        this.over = false
        this.nextPlayer = null
    }
    setNextPlayer (user) {
        this.nextPlayer = user
    }
    setOverStatus (user) {
        this.over = true
        this.winner = user
    }
    addMsg (msgObj) {
        this.msgs.push(msgObj)
    }
    getUserList (socket) {
        socket.to(`room${this.room.id}`).emit('user_list', this.users)
    }
}
export default Context