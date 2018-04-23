# react-gobang
react 开发 五子棋小游戏

## socket API
以下是使用socket常用的一些API

**服务端监听：**
* connection: 连接成功
* disconnect：用户退出

**客户端监听事件：**
* connect：连接成功
* connecting：正在连接
* disconnect：断开连接
* connect_failed：连接失败
* error：错误发生，并且无法被其他事件类型所处理
* message：同服务器端message事件
* anything：同服务器端anything事件
* reconnect_failed：重连失败
* reconnect：成功重连
* reconnecting：正在重连


**广播消息**

```
// 给指定的客户端发送消息
socket.emit('msg', "this is a test");

//给除了自己以外的客户端广播消息
socket.broadcast.emit("msg",{data:"hello,everyone"}); 

//给所有客户端广播消息
io.sockets.emit("msg",{data:"hello,all"})


//分组
socket.on('group1', function (data) {
        socket.join('group1'); //加入group1
});
socket.on('group2',function(data){
        socket.join('group2'); //加入group2
});


//给'group1'所有成员发送消息，不包括自己
socket.broadcast.to('group1').emit('msg', data);

//给'group1'所有成员发送消息，包括自己
io.sockets.in('group1').emit('msg', data);

//当前socket离开 'group1'
socket.leave('group1');

```
### yarn/npm run server

### yarn/npm run dev

> [博客地址](http://dzblog.cn)

