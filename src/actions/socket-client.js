import { createAction } from 'redux-actions'
class Context {
    constructor (socket, url, store) {
        this.socket = socket
        this.url = url
        this.store = store
    }
    init () {
        return new Promise(async (resolve, reject) => {
            try {
                await this.createIo() 
            }catch(e) {
                reject(e)
            }
            
            this.err()
            this.removeUser()
            this.initBoard()
            this.getUserList()
            this.getMsgList()
            this.getPlayerList()
            this.getChessesList()
            this.getNextPlayer()
            this.getOverStatus()
            this.onAgainPlay()
            resolve()
        })
    }

    // 生成socket
    createIo () {
        /*
        connect：连接成功
        connecting：正在连接
        disconnect：断开连接
        connect_failed：连接失败
        error：错误发生，并且无法被其他事件类型所处理
        message：同服务器端message事件
        anything：同服务器端anything事件
        reconnect_failed：重连失败
        reconnect：成功重连
        reconnecting：正在重连
         */
        return new Promise((resolve, reject) => {
            this.io = this.socket(this.url)
            this.io.on('connect', () => {
                console.log("连接成功")
                resolve("连接成功")
            })
            this.io.on("error", () => {
                console.log("连接失败")
                reject('连接失败')
            })
            this.io.on('disconnect', function() {
                console.log("与服务器断开")
                reject('与服务器断开')
            })
            this.io.on('reconnect', function() {
                console.log("重新连接到服务器")
                resolve('重新连接到服务器')
            })
        })
    }

    // 错误处理
    err () {
        this.io.on("err", (err) => {
            alert(err)
        })
    }

    // 退出
    out (user) {
        this.io.emit('out', user)
    }

    // 添加新用户
    addUser (info) {
        return new Promise( r => {
            this.io.emit('add_user', info)
            this.io.on('new_user', data => {
                this.store.dispatch(createAction('NEW_USER')(data))
                r()
            })
        })
    }

    // 发送消息
    sendMsg (msg) {
        this.io.emit('send_msg', {msg})
    }

    // 加入PK
    joinPK (user) {
        this.io.emit('joinPK', user)
    }

    // 发送棋局状态
    sendChesses (data) {
        this.io.emit('send_chesses', data)
    }
    // 下一个下子的棋手
    sendNextPlayer (user) {
        this.io.emit('send_next_player', user)
    }
    // 发送结束状态
    sendOverStatus (user) {
        this.io.emit('send_over_status', user)
    }

    // 重新开始
    againPlay () {
        this.io.emit('again_play')
    }

    onAgainPlay () {
        this.io.on('on_again_play', () => {
            this.store.dispatch(createAction('AGAIN_PLAY')())
        })

    }

    // 监听谁离开了
    removeUser () {
        this.io.on('remove_user', data => {
            this.store.dispatch(createAction('REMOVE_USER')(data))
        })
    }

    // 初始化棋盘
    initBoard () {
        this.io.on('init_board', data => {
            this.store.dispatch(createAction('INIIT_BOARD')(data))
        })
    }

    // 获取下一个下子的人
    getNextPlayer () {
        this.io.on('new_next_player', data => {
            this.store.dispatch(createAction('GET_NEXT_PLAYER')(data))
        })
    }

    // 获取用户列表
    getUserList () {
        this.io.on('user_list', data => {
            this.store.dispatch(createAction('GET_USER_LIST')(data))
        })
    }

    // 获取消息列表
    getMsgList () {
        this.io.on('msg_list', data => {
            this.store.dispatch(createAction('GET_MSG_LIST')(data))
        })
    }

    // 获取玩家列表
    getPlayerList () {
        this.io.on('players', data => {
            this.store.dispatch(createAction('GET_PLAYERS')(data))
        })
    }

    // 获取棋子数据
    getChessesList () {
        this.io.on('chesses_list', data => {
            this.store.dispatch(createAction('GET_CHESSES_LIST')(data))
        })
    }

    // 获取结束信息 
    getOverStatus () {
        this.io.on('over', data => {
            this.store.dispatch(createAction('GET_OVER_STATUS')(data))
        })
    }
}

export default Context