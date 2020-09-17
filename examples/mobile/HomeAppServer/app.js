const homeAppPath = "../HomeApp";
const WebSocket = require("ws");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan"),
	app = express(),
	ws,
	pingCount = 0,
	result = {},
	apps = [{
		"appID": "vUf39tzQ3s.UIComponents",
		"isInstalled": true,
		"isActive": true,
		"webClipsList": [
			{
				url: "webclip/apps-on-tv"
			},
			{
				url: "webclip/latest-news"
			}
		]
	},
	{
		"appID": "vUf39tzQ3t.UIComponents",
		"isInstalled": true,
		"isActive": false,
		"webClipsList": [
			{
				url: "webclip/now-on-tv"
			},
			{
				url: "webclip/restaurant"
			}
		]
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
		]
	}];

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, homeAppPath)));

app.get("/api/register", (req, res) => {
	const wsPort = startWS();

	result.apps = apps;
	result.wsPort = wsPort;

	res.header("Content-Type", "application/json");
	res.send(JSON.stringify(result));
});

function runPing(ws) {
	// send ping
	setInterval(function () {
		pingCount++;
		try {
			ws.send(JSON.stringify({
				apps: apps
			}));
		} catch (e) {
			console.warn("ws error");
		}

		// @test
		// active app rotation
		if (pingCount % 3) {
			apps[0].isActive = false;
			apps[1].isActive = true;
		} else {
			apps[0].isActive = true;
			apps[1].isActive = false;
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
		apps: apps
	}));

	// ping
	runPing(ws);
}

function startWS() {
	var server = app.listen(0);

	ws = new WebSocket.Server({server});
	ws.on("connection", onWSConnection);

	return server.address().port;
}


module.exports = app;
