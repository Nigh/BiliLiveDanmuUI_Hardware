var Room = require('./BiliBiliRoomLiveConnection')
var ws = require('ws')

var room = new Room(80232, 'ws', 2)
room.connect()
room.on('authSucceeded', () => {
	console.log("Now , you can send some danmaku to author's live room.")
	console.log('https://live.bilibili.com/80232')
	console.log('Then , you will see something log to the console.')
})
room.on('*', console.log) // 输出所有的消息
room.on('DANMU_MSG', (message) => {
	const decodedMessage = Room.danmakuMessageDecoder(message)
	console.log(`${decodedMessage.userInfo.uname} : ${decodedMessage.comment}`)
})
