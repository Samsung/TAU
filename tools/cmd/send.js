#!/usr/bin/env node
/* eslint no-process-exit: off, no-console: off*/

var cmd = require("./lib/cmd"),
	ref = "",
	commitId = "",
	Jenkins = require("jenkins"),
	jenkins = Jenkins({baseUrl: "http://sample:25ffd7aff6eb367970b8da326f34a673@106.120.57.30:8000/"});


cmd.chain(
	// get commit id of last commit
	["git rev-list --max-count=1 HEAD",
		function (result, callback) {
			commitId = result.trim();
			callback();
		}],
	// send commit to gerrit
	["git push origin HEAD:refs/for/devel/tizen_3.0",
		function (result, callback) {
			callback();
		}],
	// get from gerrit information about last commit
	[function () {
		return "ssh -p 29418 165.213.149.170 gerrit query commit:" + commitId + " --current-patch-set --format=JSON";
	}, function (result, callback) {
		var lines = result.split("\n"),
			// filter only lines with commit descriptions
			data = lines.filter(function (item) {
				return item;
			}).map(function (item) {
				// convert text to JSON
				return JSON.parse(item);
			}).filter(function (item) {
				return item.branch;
			});

		// get refs of last commit
		ref = data[0].currentPatchSet.ref;
		callback();
	}
	],
	function () {
		// start jenkins build with refs id
		jenkins.job.build({
			name: "TAUgerrit",
			parameters: {
				GERRIT_CHANGE_URL: ref
			},
			token: "token"
		}, function (error) {
			if (error) {
				console.error("Jenkins Error: ", error);
			}
		});
	}
);