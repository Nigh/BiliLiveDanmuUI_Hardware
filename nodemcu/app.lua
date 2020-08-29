print("app start!!!")

-- init the ws2812 module
ws2812.init(ws2812.MODE_SINGLE)
strip_buffer = ws2812.newBuffer(256, 3)

ws_connected = false
if ws then
	ws:close()
end

ws = websocket.createClient()
ws:config({headers = {["User-Agent"] = "NodeMCU"}})

ws:on(
	"connection",
	function(ws)
		ws_connected = true
		print("ws connected")
	end
)

ws:on(
	"receive",
	function(_, msg, opcode)
		print(tic, "msg->:", msg, opcode)
		if opcode == 1 then
			parser = sjson.decode(msg)
		end
		if parser.type and parser.type == "RGB" then
			print(parser.x, parser.y, parser.r, parser.g, parser.b)
			if parser.x <= 15 and parser.y <= 15 then
				strip_buffer:set((16 - parser.x) + parser.y * 16, parser.g, parser.r, parser.b)
				ws2812.write(strip_buffer)
			end
		end
	end
)

-- SETUP: fill in with your server address and port
ws_server = "ws://192.168.1.137:17342"

ws:on(
	"close",
	function(_, status)
		ws_connected = false
		print("on_ws_close", status)
		ws:connect(ws_server)
	end
)
ws:connect(ws_server)

function timer1hz()
	tic = tic + 1
end

tic = 0
mytimer = tmr.create()
mytimer:register(1000, tmr.ALARM_AUTO, timer1hz)
mytimer:start()
