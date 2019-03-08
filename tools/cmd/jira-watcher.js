/*eslint camelcase: 0, no-console: 0, no-octal-escape: 0 */

const PHYSICAL_WORK_FIELD = "customfield_10400",
	SERVER = "106.120.57.30",
	readline = require("readline"),
	moment = require("moment"),
	sonarqubeScanner = require("sonarqube-scanner"),
	async = require("async"),
	JiraClient = require("jira-connector"),
	cmd = require("./lib/cmd"),
	packageJSON = require("../../package.json"),
	rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	}),
	config = {
		host: "cam.sprc.samsung.pl",
		port: "80",
		protocol: "http",
		basic_auth: {
			username: process.env.JIRA_USER || process.env.USER
		}
	},
	gerritRegex = /http:\/\/165\.213\.149\.170\/gerrit\/#\/c\/[0-9]+\//,
	artifactsRegex = /http:\/\/106\.120\.57\.30:8080\/([^/]+)\//,
	buildRegex = /http:\/\/[^/]+:8000\/job\/[a-zA-Z0-9]+\/[0-9]+\//;
let jira,
	blockOperations = false;

/**
 * Do password hidden on writing
 * @param {string} query
 * @param {Function} callback
 */
function hidden(query, callback) {
	var stdin = process.openStdin();

	process.stdin.on("data", (char) => {
		char = char + "";
		switch (char) {
			case "\n":
			case "\r":
			case "\u0004":
				stdin.pause();
				break;
			default:
				process.stdout.write("\033[2K\033[200D" + query + Array(rl.line.length + 1).join("*"));
				break;
		}
	});

	rl.question(query, (value) => {
		rl.history = rl.history.slice(1);
		callback(value);
	});
}

/**
 * Operation on issue
 * @param {Object} issue
 * @param {Function} cb
 */
function analyzeIssue(issue, cb) {
	checkSonarCube(issue, () => {
		checkProgress(issue, () => {
			cb();
		});
	});
}

/**
 * Init sonar project
 * @param {string} issue
 * @param {Function} cb
 */
function checkSonarCube(issue, cb) {
	var labels = issue.fields.labels;

	if (labels.indexOf("sonarcube-init") === -1) {
		sonarqubeScanner({
			serverUrl: `http://${SERVER}:9000/`,
			token: "b9090d13d00131fdb08527cdee02ee98e2c777fd",
			options: {
				"sonar.projectName": "TAU - " + issue.key,
				"sonar.projectKey": "TAUG:" + issue.key,
				"sonar.projectVersion": packageJSON.version,
				"sonar.sources": "src",
				"sonar.javascript.lcov.reportPaths": "report/test/karma/coverage/lcov/lcov.info"
			}
		}, () => {
			labels.push("sonarcube-init");
			// fill label inform that sonar was initialized
			jira.issue.editIssue({
				issueKey: issue.key,
				issue: {
					fields: {
						labels
					}
				}
			}, (error) => {
				if (error) {
					console.error(error);
					cb();
				} else {
					// add link in issue
					jira.issue.createRemoteLink({
						issueKey: issue.key,
						remoteLink: {
							"application": {
								"type": "com.sonarcube",
								"name": "SonarCube"
							},
							"relationship": "quality",
							"object": {
								"url": `http://${SERVER}:9000/dashboard?id=TAUG%3A${issue.key}`,
								"title": "SonarCube",
								"summary": "Analytics result",
								"icon": {
									"url16x16": "https://docs.sonarqube.org/download/attachments/7997450/SONAR?version=1&modificationDate=1489492568000&api=v2",
									"title": "Sonar Cube"
								}
							}
						}
					}, () => {
						cb();
					});
				}
			});
		});
	} else {
		console.log("[" + issue.key + "] Sonarcube is ready");
		cb();
	}
}

function checkProgress(issue, cb) {
	// task in ready to automatic review
	console.log("[" + issue.key + "] Start analizing comments");
	// get all comments
	jira.issue.getComments({
		issueKey: issue.key
	}, (error, comments) => {
		var status = "Success";

		if (error) {
			console.error(error);
			cb();
		} else {
			// for each comment
			async.eachSeries(comments.comments, (comment, commentCB) => {
				var gerritLink,
					buildLink,
					artifactsLink,
					regexResult;

					// search jenkins comment
				if (comment.body.indexOf("Automatically created by:") > -1) {
						// find existing links
					jira.issue.getRemoteLinks({
						issueKey: issue.key
					}, (error, links) => {
						async.eachSeries(links, (link, linkCB) => {
								// remove old links
							if (["quality", "CI", "artifacts"].indexOf(link.relationship)) {
								jira.issue.deleteRemoteLinkById({
									issueKey: issue.key,
									linkId: link.id
								}, (error) => {
									if (error) {
										console.error(error);
									}
									linkCB();
								});
							} else {
								linkCB();
							}
						}, () => {
								// find URLS in comment
							if (comment.body.indexOf("Build success (unstable)") > -1) {
								status = "Fail";
							}

							regexResult = gerritRegex.exec(comment.body);
							gerritLink = regexResult ? regexResult[0] : "";
							regexResult = artifactsRegex.exec(comment.body);
							artifactsLink = regexResult ? regexResult[0] : "";
							regexResult = buildRegex.exec(comment.body);
							buildLink = regexResult ? regexResult[0] : "";
								// add link to gerrit
							jira.issue.updateRemoteLink({
								issueKey: issue.key,
								remoteLink: {
									"application": {
										"type": "com.gerrit",
										"name": "Gerrit"
									},
									"relationship": "review",
									"object": {
										"url": gerritLink,
										"title": "Gerrit",
										"icon": {
											"url16x16": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Gerrit_icon.svg/1024px-Gerrit_icon.svg.png",
											"title": "Gerrit"
										}
									}
								}
							}, () => {
									// add link to demo
								jira.issue.updateRemoteLink({
									issueKey: issue.key,
									remoteLink: {
										"relationship": "artifacts",
										"object": {
											"url": `http://${SERVER}:8080/index.html#` + encodeURIComponent(artifactsLink + "examples/%profile%/UIComponents/"),
											"title": "DevieceViewer",
											"icon": {
												"url16x16": "https://download.tizen.org/misc/Tizen-Brand/01-Primary-Assets/Pinwheel/On-Light/01-RGB/Tizen-Pinwheel-On-Light-RGB.png",
												"title": "Tizen"
											}
										}
									}
								}, () => {
										// add link to Jenkins
									jira.issue.updateRemoteLink({
										issueKey: issue.key,
										remoteLink: {
											"relationship": "CI",
											"object": {
												"url": buildLink,
												"title": "Jenkins",
												"summary": status,
												"icon": {
													"url16x16": "https://wiki.jenkins-ci.org/download/attachments/2916393/headshot.png?version=1&modificationDate=1302753947000&api=v2",
													"title": "Jenkins"
												}
											}
										}
									}, () => {
											// delete comment to prevent next processing
										jira.issue.deleteComment({
											issueKey: issue.key,
											commentId: comment.id
										}, function (error) {
											if (error) {
												console.error(error);
											}
											console.log("[" + issue.key + "] Processed Jenkins comment");
											commentCB();
										});
										commentCB();
									});
								});
							});
						});
					});
				} else {
					commentCB();
				}
			}, () => {
					// change status
				var data = {
					issueKey: issue.key,
					transition: "5"
				};

				console.log("[" + issue.key + "] Finish analizing comments");

				if (issue.fields[PHYSICAL_WORK_FIELD].value === "100%") {
					jira.issue.getRemoteLinks({
						issueKey: issue.key
					}, (error, links) => {
						var status = "";

						async.eachSeries(links, (link, linkCB) => {
							if (link.object.summary === "Success") {
								if (status !== "Fail") {
									status = "Success";
								}
							} else if (link.object.summary === "Fail") {
								status = "Fail";
							}
							linkCB();
						}, () => {
							if (status) {
								if (status !== "Success") {
									data.transition = "301";
								}
								data.update = {
									comment: [
										{
											add: {
												body: "Build " + status + " (automatic comment)"
											}
										}
									]
								};
								jira.issue.transitionIssue(data, (error) => {
									if (error) {
										console.error(error);
									} else {
										console.log("[" + issue.key + "] Changed status");
									}
									cb();
								});
							} else {
								cb();
							}
						});
					});
				}					else {
					cb();
				}
			}
			);
		}
	});
}

/**
 * Get data from JIRA
 */
function searchInJIRA() {
// get issues in progress
	if (!blockOperations) {
		console.log(moment().format("MM-DD HH:mm:ss") + " Searching...");
		jira.search.search({
			jql: "project = OAPTAU and status =\"In Progress\""
		}, (error, issues) => {
			if (error) {
				console.error(error);
			} else {
				if (issues) {
					async.eachSeries(issues.issues, analyzeIssue, () => {
						console.log(moment().format("MM-DD HH:mm:ss") + " Sleeping...");
					});
				}
			}
		});
	} else {
		console.log(moment().format("MM-DD HH:mm:ss") + " Operation blocked, refreshing repository...");
	}
}

/**
 * Refresh merged framework data from repository
 */
function refreshRepository() {
	cmd.chain(
		// block other operations
		function (cb) {
			blockOperations = true;
			cb();
		},
		// update repository
		["git pull"],
		// update modules
		["npm install"],
		// build css for tests
		["grunt build"],
		// run karma tests
		["grunt karma"],
		// unblock other operations
		function (cb) {
			blockOperations = false;
			cb();
		}
	);
}

// read password for jira
hidden("Password for JIRA: ", (password) => {
	config.basic_auth.password = password;
	jira = new JiraClient(config);

	refreshRepository();
	// init search
	searchInJIRA();
	// 2 min interval for processing JIRA
	setInterval(searchInJIRA, 120000);
	// 20 min interval for processing repository
	setInterval(refreshRepository, 1200000);
});
