#!/usr/bin/env node
/* eslint no-process-exit: off*/

var moment = require("moment"),
	fs = require("fs"),
	cmd = require("./lib/cmd"),
	env = process.env,
	FILE_CHANGELOG = "../packaging/changelog",
	FILE_SPEC = "../packaging/web-ui-fw.spec",
	FILE_PACKAGEJSON = "./package.json",
	gitAccount = "",
	userName = "",
	lastTag = env.LASTTAG || "",
	tauVersion = env.VERSION || env.bamboo_deploy_release || env.bamboo_jira_version,
	commitMessage = "TAU " + tauVersion + " release",
	commitId = "";

/**
 * Async helper for read file, modify content and  write to the same file
 * @param {string} fileName NAme of file
 * @param {Function} operation Function with one string parameter and return string to save
 * @param {Function} callback Callback inform that operation was end (async)
 */
function modifyFile(fileName, operation, callback) {
	fs.readFile(fileName, function (err, data) {
		var saveData = "";

		// on errors display it and finish working
		if (err) {
			console.error(err);
			process.exit(1);
		}
		// prepare data to save
		saveData = operation(data.toString());
		// write to file
		fs.writeFile(fileName, saveData, function (err) {
			// on errors display it and finish working
			if (err) {
				console.error(err);
				process.exit(1);
			}
			// go to next step
			callback();
		});
	});
}

cmd.chain(
	// check that version is set
	function (callback) {
		if (!tauVersion) {
			console.error("Version is not set, use one of environment variables VERSION, bamboo_deploy_release, env.bamboo_jira_version");
			process.exit(1);
		}
		callback();
	},
	// get user email form git
	["git config user.email",
		function (result, callback) {
			gitAccount = result.trim();
			callback();
		}],
	// get user name form git
	["git config user.name",
		function (result, callback) {
			userName = result.trim();
			callback();
		}],
	// get last tag
	["git describe --abbrev=0 --tags",
		function (result, callback) {
			if (!lastTag) {
				lastTag = result.trim();
			}
			callback();
		}],
	// get last changes
	[
		function () {
			return "git log --pretty=oneline --no-merges " + lastTag + "..HEAD | sed -e 's/ *\\\[OAPTAU-[0-9]*\\\]//g' | sed -e 's/^\\\S* /- /g'"
		},
		function (logLines, callback) {
			var now = moment().format("ddd MMM D YYYY");

			logLines = "* " + now + " " + userName + " <" + gitAccount + "> " + tauVersion + "\n\t" + logLines.replace(/\n-/g, "\n\t-");
			// save changes to changelog
			modifyFile(FILE_CHANGELOG, function (data) {
				return data.replace("%changelog", "%changelog\n" + logLines + "\n");
			}, callback);
		}
	],
	// Version up in filespec
	function (callback) {
		modifyFile(FILE_SPEC, function (data) {
			return data.replace(/^Version:.*$/gm, "Version:    " + tauVersion);
		}, callback);
	},
	// Version up in package.json
	function (callback) {
		modifyFile(FILE_PACKAGEJSON, function (data) {
			return data.replace(/"version": ".*"/gm, "\"version\": \"" + tauVersion + "\"");
		}, callback);
	},
	// add files to git
	[function () {
		return "git add " + FILE_CHANGELOG + " " + FILE_SPEC + " " + FILE_PACKAGEJSON;
	}],
	// create commit
	[function () {
		return "git commit -s -m '" + commitMessage + "'"
	}],
	// send to gerrit
	"git push origin HEAD:refs/for/devel/tizen_3.0",
	["git log --format='%H' -n 1",
		function (result, callback) {
			commitId = result.trim();
			callback();
		}],
	// add reviewers
	[function () {
		return "ssh -p 29418 165.213.149.170 gerrit set-reviewers -a t.lukawski@samsung.com " + commitId;
	}]
);