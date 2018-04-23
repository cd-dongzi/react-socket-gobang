import Koa from 'koa'
import staticFiles from 'koa-static'
import IO from 'koa-socket'
const app = new Koa()
const io = new IO()
io.attach(app)

import Context from './socket-server'
let userId = 1

app._io.on('connection', socket => {
    console.log('新用户连接')
    Context.createChannel(++userId, socket, app._io)
})
app._io.on('close', data => {
    console.log(data)
})

app.listen(3000, () => {
    console.log(`server is running at http://localhost:${3000}`)
})

