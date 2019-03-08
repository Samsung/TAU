#!/usr/bin/env node
/* eslint no-console:0 */
/* eslint-env es6 */
/**
 * #How use
 *
 * ## from to period
 *
 *  node tools/cmd/report.js 2017-01-01 2017-01-29
 *
 * ## from to today period
 *
 *  node tools/cmd/report.js 2017-02-01
 *
 */
"use strict"; // for enable es6 in old version of nodes
const cmd = require("./lib/cmd"),
	stats = {},
	CliTable = require("cli-table"),
	argv = process.argv;
let	before = "",
	after = "",
	time = "";

function initUser(name) {
	stats[name] = stats[name] || {
		patchSets: 0,
		commits: {},
		reviews: 0
	};
	return stats[name];
}

if (argv.length === 4) {
	after = argv[2];
	before = argv[3];
	time = `after:${after} before:${before}`;
} else if (argv.length === 3) {
	after = argv[2];
	time = `after:${after}`;
}

cmd.chain(
	[`ssh -p 29418 165.213.149.170 gerrit query --all-approvals --format=JSON project:framework/web/web-ui-fw branch:devel/tizen_3.0 ${time}`, (result, callback) => {
		var lines = result.split("\n"),
			// get only lines with commit descriptions
			data = lines.filter((item) => item).map((item) => JSON.parse(item)).filter((item) => item.branch);

		// for each commit
		data.forEach((item) => {
			const authorUsername = item.owner.username,
				// init stats object
				stat = initUser(authorUsername);

			stats[authorUsername] = stat;
			// for each patchset
			item.patchSets.forEach((patch) => {
				// lines stats
				stat.commits[item.number] = {
					deletions: patch.sizeDeletions,
					insertions: patch.sizeInsertions
				};


				if (patch.approvals) {
					patch.approvals.forEach((approval) => {
						if (approval.type === "Code-Review") {
							if (approval.value !== "+2") {
								// user review count increase
								initUser(approval.by.username).reviews++;
								// author patchset count increase
								stat.patchSets++;
							}
						}
					});
				}
			});
		});
		// finish colect data
		callback();
	}],
	(callback) => {
		// prepare summary
		// init table
		const tableSettings = {
				head: ["Name", "Patch set count", "Commit count", "Review rate", "-", "+", "Reviews count"],
				colWidths: [15, 9, 9, 9, 9, 9, 9],
				colAligns: ["left", "right", "right", "right", "right", "right", "right", "right"]
			},
			table = new CliTable(tableSettings),
			// prepare sum object
			sum = {
				patchsetCount: 0,
				commitCount: 0,
				deletionCount: 0,
				insertionCount: 0,
				reviewsCount: 0
			};

		// for each user
		Object.keys(stats).forEach((key) => {
			// set row data
			const patchsetCount = stats[key].patchSets,
				commitKeys = Object.keys(stats[key].commits),
				commitCount = commitKeys.length,
				reviewsCount = stats[key].reviews,
				// how many reviews per commit
				reviewRate = commitCount > 0 ? Math.round(patchsetCount / commitCount * 10) / 10 : 0;
			let deletionCount = 0,
				insertionCount = 0;

				// sum line stats for commits
			commitKeys.forEach((commitId) => {
				deletionCount += stats[key].commits[commitId].deletions;
				insertionCount += stats[key].commits[commitId].insertions;
			});

			// get sum data
			sum.patchsetCount += patchsetCount;
			sum.commitCount += commitCount;
			sum.deletionCount += deletionCount;
			sum.insertionCount += insertionCount;
			sum.reviewsCount += reviewsCount;

			// print table row
			table.push([key, patchsetCount, commitCount, reviewRate, deletionCount, insertionCount, reviewsCount]);
		});

		// print sum row
		table.push(["SUM", sum.patchsetCount, sum.commitCount, Math.round(sum.patchsetCount / sum.commitCount * 10) / 10, sum.deletionCount, sum.insertionCount, sum.reviewsCount]);

		console.log(table.toString());
		// finish
		callback();
	}
);