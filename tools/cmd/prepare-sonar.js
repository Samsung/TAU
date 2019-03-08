#!/usr/bin/env node
/* eslint no-process-exit: off, no-console: off*/

var cmd = require("./lib/cmd"),
	fs = require("fs"),
	properties = "",
	propertiesObject = {},
	package = require("../../package.json"),
	mode = !process.argv[2] ? "git" : "gerrit",
	commitId = "";

if (mode === "gerrit") {
	propertiesObject.projectName = "TAU - Gerrit";
	propertiesObject.projectKey = "TAUG";
} else {
	propertiesObject.projectName = "TAU - merged";
	propertiesObject.projectKey = "TAU";
	propertiesObject.projectVersion = package.version;
}

cmd.chain(
	function (cb) {
		fs.readFile("report/test/karma/coverage/lcov/lcov.info", "UTF-8", function (err, data) {
			var lines;

			if (err) {
				throw err;
			}

			lines = data.split("\n").map(function (line) {
				return line.replace(/SF:\/.*\/src\/js/, "SF:src/js");
			}).join("\n");
			fs.writeFile("report/test/karma/coverage/lcov/lcov.info", lines, function (err) {
				if (err) {
					throw err;
				}
				cb();
			});
		});
	},
	// get commit id of last commit
	["git rev-list --max-count=1 HEAD",
		function (result, callback) {
			commitId = result;
			callback();
		}],
	["git log --format=%B -n 1", function (result, callback) {
		var regexData = result.match(/OAPTAU-[0-9]+/);

		if (regexData === null) {
			propertiesObject.projectVersion = commitId;
		} else {
			if (mode === "gerrit") {
				propertiesObject.projectName += " - " + regexData[0];
				propertiesObject.projectKey += ":" + regexData[0];
				propertiesObject.projectVersion = commitId;
			} else {
				propertiesObject.projectVersion = regexData[0];
			}
		}
		callback();
	}], function (cb) {
		Object.keys(propertiesObject).forEach(function (key) {
			properties += "\nsonar." + key + "=" + propertiesObject[key];
		});
		cb();
	},
	function (cb) {
		fs.appendFile("sonar-project.properties", properties, function (err) {
			if (err) {
				throw err;
			}
			cb();
		});
	}
)
;
