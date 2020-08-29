function startup()
	print("startup")
	if file.open("init.lua") == nil then
		print("init.lua deleted or renamed")
	else
		file.close()
		print("Running")
		if file.open("app.lua") == nil then
			print("app.lua deleted or renamed")
		else
			file.close()
			dofile("app.lua")
		end
	end
end

gpio.mode(1, gpio.INPUT, gpio.PULLUP)

wifi_got_ip_event = function(T)
	print("Wifi connection is ready! IP address is: " .. T.IP)
	tmr.create():alarm(1000, tmr.ALARM_SINGLE, ready)
end

print("Connecting to WiFi access point...")
wifi.setmode(wifi.STATION)
wifi.sta.autoconnect(1)
wifi.eventmon.register(wifi.eventmon.STA_GOT_IP, wifi_got_ip_event)
-- SETUP: fill in with your wifi ssid and password
wifi.sta.config({ssid = "your wifi SSID", pwd = "your PASSWORD"})

function ready()
	print("wait pin 1 connect to GND")
	local t = tmr:create()
	t:alarm(
		2000,
		tmr.ALARM_AUTO,
		function()
			if gpio.read(1) == 0 then
				t:unregister()
				startup()
			else
				print("wait pin 1 connect to GND")
			end
		end
	)
end
