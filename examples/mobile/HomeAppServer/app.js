const homeAppPath = "../HomeApp";

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan"),
	app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, homeAppPath)));

app.get("/api/appslist", (req, res) => {
	var result = [
		{
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
		}
	];

	res.header("Content-Type", "application/json");
	res.send(JSON.stringify(result));

})


module.exports = app;
