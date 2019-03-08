#!/usr/bin/env node

var cmd = require("./lib/cmd");

cmd.chain(
	["ssh -p 29418 165.213.149.170 gerrit query status:open owner:m.urbanski branch:tizen_3.0 --all-approvals --format=JSON", function (result, callback) {
		var lines = result.split("\n"),
			data = lines.filter(function (item) {
				return item;
			}).map(function (item) {
				return JSON.parse(item);
			}).filter(function (item) {
				return item.branch;
			}),
			commmitsForMerge = [];

		data.forEach(function (item) {
			var codeReview = 0,
				verified = 0;

			item.patchSets.forEach(function (patch) {
				if (patch.approvals) {
					patch.approvals.forEach(function (approval) {
						if (approval.type === "Code-Review") {
							codeReview = approval.value;
						}
						if (approval.type === "Verified") {
							verified = approval.value;
						}
					});
				}
			});

			if (codeReview && verified) {
				commmitsForMerge.push("ssh -p 29418 165.213.149.170 gerrit review --code-review +2 --submit " + item.patchSets[item.patchSets.length - 1].revision);
			}
		});
		commmitsForMerge.push(callback);
		cmd.chain.apply(cmd, commmitsForMerge);
	}]
);