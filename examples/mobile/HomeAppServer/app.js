const homeAppPath = "../HomeApp",
	WebSocket = require("ws");

var express = require("express"),
	socketPort = process.env.PORT_SOCKET || 0,
	path = require("path"),
	cookieParser = require("cookie-parser"),
	logger = require("morgan"),
	app = express(),
	ws,
	wsPort,
	pingCount = 0,
	result = {},
	apps = [{
		"appID": "vUf39tzQ3s.UIComponents",
		"isInstalled": true,
		"isActive": true,
		"webClipsList": [
			{
				url: "webclip/apps-on-tv",
				isSelected: "true"
			},
			{
				url: "webclip/latest-news",
				isSelected: "true"
			}
		],
		"action": "add"
	},
	{
		"appID": "vUf39tzQ4s.UIComponents",
		"isInstalled": false,
		"isActive": false,
		"webClipsList": [
			{
				url: "webclip/netflix",
				isSelected: true
			}
		],
		"action": "add"
	},
	{
		"appID": "vUf39tzQ3t.UIComponents",
		"isInstalled": true,
		"isActive": false,
		"webClipsList": [
			{
				url: "webclip/now-on-tv",
				isSelected: "true"
			},
			{
				url: "webclip/restaurant"
			}
		],
		"action": "add"
	},
	{
		"appID": "vUf39tzQ3r.UIComponents",
		"isInstalled": false,
		"isActive": false,
		"webClipsList": [
			{
				url: "webclip/tv-remote-control"
			},
			{
				url: "webclip/weather"
			}
		],
		"action": "add"
	}],
	sampleDiff = [{
		"appID": "vUf39tzQ3s.UIComponents",
		"isInstalled": true,
		"isActive": true,
		"webClipsList": [
			{
				url: "webclip/apps-on-tv",
				isSelected: "true"
			},
			{
				url: "webclip/latest-news",
				isSelected: "true"
			}
		],
		"action": "add"
	},
	{
		"appID": "vUf39tzQ4s.UIComponents",
		"isInstalled": false,
		"isActive": false,
		"webClipsList": [
			{
				url: "webclip/netflix",
				isSelected: true
			}
		],
		"action": "add"
	}];

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, homeAppPath)));

wsPort = startWS();

app.get("/api/register", (req, res) => {

	result.apps = apps;
	result.wsPort = wsPort;

	res.header("Content-Type", "application/json");
	res.send(JSON.stringify({
		type: "full",
		data: result
	}));
});

function runPing(ws) {
	// send ping
	setInterval(function () {
		pingCount++;
		try {
			ws.send(JSON.stringify({
				type: "diff",
				data: sampleDiff
			}));
		} catch (e) {
			console.warn("setInterval: " + e.message);
		}

		// @test
		// active app rotation
		if (pingCount % 3) {
			sampleDiff[0].isActive = false;
			sampleDiff[1].isActive = true;
		} else {
			sampleDiff[0].isActive = true;
			sampleDiff[1].isActive = false;
		}
		// end test
	}, 10000);
}

function onWSMessage(message) {
	const messageObject = JSON.parse(message);

	console.warn("message received: %s", message, messageObject);
}

function onWSConnection(ws) {
	ws.on("message", onWSMessage);

	// send message
	ws.send(JSON.stringify({
		type: "diff",
		data: apps
	}));

	// ping
	runPing(ws);
}

function startWS() {
	var server = app.listen(socketPort);

	ws = new WebSocket.Server({server});
	ws.on("connection", onWSConnection);

	return server.address().port;
}


module.exports = app;
