class RoomInfo {
    constructor (id, name, maxNum=100) {
        this.id = id
        this.name = name
        this.maxNum = maxNum
    }
}
class Room {
    constructor () {
        this.rooms = []
        for (var i = 0; i < 5; i++) {
            this.rooms.push(new RoomInfo(i+1, `name${i+1}`))
        }
    }
    createRoom (room) {
        this.rooms.push(room)
    }
    findRoom (id) {
        return this.rooms.find(room => room.id === id)
    }
}
export default Room