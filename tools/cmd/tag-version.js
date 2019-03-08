#!/usr/bin/env node
/* eslint no-process-exit: off*/

var cmd = require("./lib/cmd"),
	env = process.env,
	tauVersion = env.VERSION || env.bamboo_deploy_release || env.bamboo_jira_version;

if (tauVersion) {
	cmd.chain(
		// create tag
		[`git tag tau_${tauVersion}`],
		// push to repository
		[`git push origin tau_${tauVersion}`]
	);
} else {
	console.error("set VERSION in environment");
}