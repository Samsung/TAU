const fs = require("fs"),
	homeAppPath = "../HomeApp",
	webClipDir = "webclip";

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

app.get("/api/webcliplist", (req, res) => {
	fs.readdir(homeAppPath + "/" + webClipDir, (err, files) => {
		var result = [];

		if (!err) {
			files.forEach((file) => {
				try {
					if (fs.lstatSync(homeAppPath + "/" + webClipDir + "/" + file).isDirectory()) {
						result.push(webClipDir + "/" + file)
					}
				} catch (e) {
					// unable to figure out if element is directory or not
				}
			});
		}
		res.header("Content-Type", "application/json");
		res.send(JSON.stringify(result));
	});
})


module.exports = app;
