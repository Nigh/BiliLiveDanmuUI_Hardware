
var Room = require('./BiliBiliRoomLiveConnection')
const Ws = require('ws')

const test_str = '#x2y1r1g0b25 #x23y7r12g33b12'
const test_str2 = '横十纵十二红三绿五蓝〇 横三纵十二红三绿五蓝十'

const rgb_reg = /#[xX](\d+)[yY](\d+)[rR](\d+)[gG](\d+)[bB](\d+)/g
const rgb_reg_cn = /横(十?[一二三四五六七八九十])纵(十?[一二三四五六七八九十])红([零〇一二三四五六七八九十])绿([零〇一二三四五六七八九十])蓝([零〇一二三四五六七八九十])/g
var num_cn_map = new Map([
	['零', 0],
	['〇', 0],
	['一', 1],
	['二', 2],
	['三', 3],
	['四', 4],
	['五', 5],
	['六', 6],
	['七', 7],
	['八', 8],
	['九', 9],
	['十', 10]
]);

const cn_num_to_num = (str) => {
	let num = 0
	for (let index = 0; index < str.length; index++) {
		let chr = str.substr(index, 1);
		if (num_cn_map.has(chr)) {
			num += num_cn_map.get(chr)
		}
	}
	return num;
}

// /*
var ws_connected = false;
// SETUP: set the port number as you like
const wss = new Ws.Server({ port: 17342 });
wss.on('connection', function connection(ws) {
	ws_connected = ws;
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});
});

// SETUP: fill in with your liveroom number
var room = new Room(866146, 'ws', 2)
room.connect()
room.on('authSucceeded', () => {
	console.log("authSucceeded")
})
// room.on('*', console.log) // 输出所有的消息
room.on('DANMU_MSG', (message) => {
	const decodedMessage = Room.danmakuMessageDecoder(message)
	console.log(`${decodedMessage.userInfo.uname} : ${decodedMessage.comment}`)
	do {
		var parser = rgb_reg.exec(decodedMessage.comment)
		let out_value = [];
		if (parser != null) {
			parser.forEach(function (v, i) {
				if (i >= 3) {
					out_value[i] = Math.min(Math.ceil(Number(v) / 2.55), 100)
				}
			})
			// console.log(Number(parser[1]), parser[2], parser[3], parser[4], parser[5])
			let json_str = JSON.stringify({ type: 'RGB', x: Number(parser[1]), y: Number(parser[2]), r: (out_value[3]), g: (out_value[4]), b: (out_value[5]) })
			console.log("send:", json_str)
			if (ws_connected != false) {
				ws_connected.send(json_str);
			}
		}
	}
	while (parser != null)

	do {
		var parser = rgb_reg_cn.exec(decodedMessage.comment)
		if (parser != null) {
			console.log((parser[1]), (parser[2]), (parser[3]), (parser[4]), (parser[5]))
			let json_str = JSON.stringify({ type: 'RGB', x: cn_num_to_num(parser[1]) - 1, y: cn_num_to_num(parser[2]) - 1, r: cn_num_to_num(parser[3]) * 10, g: cn_num_to_num(parser[4]) * 10, b: cn_num_to_num(parser[5]) * 10 })
			console.log("send:", json_str)
			if (ws_connected != false) {
				ws_connected.send(json_str);
			}
		}
	}
	while (parser != null)

})

// */
