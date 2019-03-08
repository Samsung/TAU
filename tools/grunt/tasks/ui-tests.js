/* eslint global-require: 0 */
var resemble = require("node-resemble-js"),
	async = require("async"),
	xml2js = require("xml2js"),
	fs = require("fs"),
	path = require("path"),
	testName,
	onlyAccepted = false,
	addReport = false,
	tasks = require("../../../tests/UI-tests/config.json"),
	uiTest = require("../../../tools/cmd/lib/ui-tests");

module.exports = function (grunt) {
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-run");

	grunt.config.merge({
		connect: {
			uiTests: {
				options: {
					port: 9001,
					open: {
						target: "http://localhost:9001/tests/UI-tests/test.html?" + Date.now()
					},
					keepalive: true
				}
			}
		}
	});

	grunt.registerTask("ui-tests-report", "Generate UI tests report in junit format",
		function (index) {
			var done = this.async(),
				builder = new xml2js.Builder(),
				testcases = [],
				count = 0,
				errorsCount = 0,
				task = tasks[index],
				screenshots = [],
				profile = task.profile,
				type = task.type,
				diffPathArray = [__dirname, "..", "..", "..", "tests", "UI-tests", "diff"],
				reportPathArray = [__dirname, "..", "..", "..", "report"],
				resultObject = {
					testsuites: {
						$: {
							errors: 0,
							failures: 0,
							name: "UI",
							tests: 0
						},
						testsuite: [
							{
								$: {
									errors: 0,
									failures: 0,
									name: "UI/" + profile,
									tests: 0,
									disabled: 0,
									hostname: "",
									id: "",
									package: "",
									skipped: 0,
									timestamp: Date.now()
								}
							}
						]
					}
				};

			task.screens.forEach(function (item) {
				if (testName) {
					if (testName === item.id) {
						screenshots.push(item);
					}
				} else if (onlyAccepted) {
					if (item.pass) {
						screenshots.push(item);
					}
				} else {
					screenshots.push(item);
				}
			});

			fs.mkdir(path.join.apply(path, diffPathArray),
				function () {
					fs.mkdir(path.join.apply(path, diffPathArray.concat(profile)),
						function () {
							fs.mkdir(path.join.apply(path, diffPathArray.concat([profile, type])),
								function () {
									resemble.outputSettings({
										errorColor: {
											red: 255,
											green: 0,
											blue: 0
										},
										errorType: "floatDifferenceIntensity",
										transparency: 1,
										largeImageThreshold: 0,
										useCrossOrigin: false
									});

									async.eachSeries(screenshots, function (test, callback) {
										var resultFile = path.join(__dirname, "..", "..", "..", "tests", "UI-tests",
											"result", profile, type, test.name + ".png");

										fs.access(resultFile, fs.constants.R_OK, function (err) {
											var testcase = {
												$: {
													assertions: 1,
													classname: profile + "." + type + "." + test.name,
													name: test.name
												}
											};

											if (!err) {
												resemble(path.join(__dirname, "..", "..", "..", "tests", "UI-tests",
													"images", profile, type, test.name + ".png"))
													.compareTo(resultFile)
													.onComplete(function (result) {
														var tc = {
																$: {
																	assertions: 1,
																	classname: profile + "." + type + "." + test.name,
																	name: test.name
																}
															},
															value = parseFloat(result.misMatchPercentage);

														result.getDiffImage().pack().pipe(fs.createWriteStream(
															path.join.apply(path,
																diffPathArray.concat([profile, type, test.name + ".png"]))));

														if (value > (test.threshold || 0.2)) {
															if (test.pass) {
																tc.error = [{
																	$: {
																		message: "Not match, current diff: " + value + "%"
																	}
																}];
																grunt.log.error("[error] Run test: " + test.name +
																	" result, difference pixels: " + value + "%");
																errorsCount++;
															} else {
																tc["system-out"] = ["Not match, current diff: " + value + "%"];
																grunt.log.warn("[quarantine] Run test: " + test.name +
																	" result, difference pixels: " + value + "%");
															}
														} else {
															grunt.log.ok("[ok] Run test: " + test.name +
																" result, difference pixels: " + value + "%");
														}

														count++;
														testcases.push(tc);
														callback();
													});
											} else {
												testcase.error = [{
													$: {
														message: "File not exists"
													}
												}];
												grunt.log.error("[error] Run test: " + test.name + ", File not exists");
												count++;
												errorsCount++;
												testcases.push(testcase);
												callback();
											}
										});
									}, function () {
										var xml;

										resultObject.testsuites.testsuite[0].testcase = testcases;
										resultObject.testsuites.testsuite[0].$.tests = count;
										resultObject.testsuites.testsuite[0].$.errors = errorsCount;
										resultObject.testsuites.$.tests = count;
										resultObject.testsuites.$.errors = errorsCount;
										xml = builder.buildObject(resultObject);

										fs.mkdir(path.join.apply(path, reportPathArray), function () {
											fs.mkdir(path.join.apply(path, reportPathArray.concat("test")), function () {
												fs.mkdir(path.join.apply(path, reportPathArray.concat(["test", "UI"])), function () {
													fs.mkdir(path.join.apply(path, reportPathArray.concat(["test", "UI", profile])),
														function () {
															fs.writeFile(path.join.apply(path, reportPathArray.concat(["test", "UI", profile,
																type + ".xml"])), xml, function () {
																	done();
																});
														});
												});
											});
										});
									});
								});
						});
				});
		});

	function prepareScreenShots(task) {
		var screenshots = [];

		task.screens.forEach(function (item) {
			if (testName) {
				// we can give testname as regex but we have to begin string from ~
				if (testName[0] === "~") {
					if (item.name.match(new RegExp(testName.substr(1)))) {
						screenshots.push(item);
					}
				} else {
					if (testName === item.name) {
						screenshots.push(item);
					}
				}
			} else if (onlyAccepted) {
				if (item.pass) {
					screenshots.push(item);
				}
			} else {
				screenshots.push(item);
			}
		});

		return screenshots;
	}

	grunt.registerTask("ui-tests-prepare-app", "Runner of UI tests", function (index) {
		var task = tasks[index],
			screenshots,
			cfgSrc = "tests/UI-tests/app/" + task.profile + "/config/" + task.type + ".xml",
			cfgDst = "tests/UI-tests/app/" + task.profile + "/config.xml";

		grunt.log.ok("copy config file from: " + cfgSrc + ", to: " + cfgDst);
		grunt.file.copy(cfgSrc, cfgDst);

		screenshots = prepareScreenShots(task);

		fs.writeFileSync(path.join(__dirname, "..", "..", "..", "tests", "UI-tests", "app", task.profile, "_screenshots.json"), JSON.stringify(screenshots));

		if (!screenshots.length) {
			grunt.log.warn("Empty tests for " + task.profile + " - " + task.type);
		}
	});

	grunt.registerTask("ui-tests-screens", "Runner of UI tests", function (index) {
		var task = tasks[index],
			screenshots,
			done = this.async();

		screenshots = prepareScreenShots(task);

		if (!screenshots.length) {
			grunt.log.warn("Empty tests for " + task.profile + " - " + task.type);
		}

		uiTest.config({
			screenshots: screenshots,
			app: "tests/UI-tests/app/" + task.profile + "/",
			profile: task.profile,
			type: task.type
		}, function () {
			uiTest.run(done);
		});
	});

	grunt.registerTask("ui-tests-base", "Base mechanism to UI test", function () {
		var test = grunt.option("test"),
			profile = grunt.option("profile"),
			type = grunt.option("type"),
			tauDebug = grunt.option("tau-debug"),
			taskToRun = ["build", "clean:ui-test"];

		grunt.config.merge({
			clean: {
				"ui-test": {
					expand: true,
					src: ["report", "temp", "tests/UI-tests/result", "tests/UI-tests/diff", "tests/UI-tests/app/**/config.xml", "tests/UI-tests/app/**/_screenshots.json"]
				}
			}
		});

		tasks.forEach(function (task, index) {
			var configObject = {run: {}},
				args = ["prepare-app", "--app=tests/UI-tests/app/" + task.profile],
				toRun = true;

			configObject.run["uiTests" + index] = {
				cmd: "grunt"
			};

			if (test) {
				args.push("--test=" + test);
				testName = test;
			}

			args.push("--profile=" + task.profile);

			args.push("--type=" + task.type);

			if (tauDebug) {
				args.push("--tau-debug=1");
			}

			configObject.run["uiTests" + index].args = args;

			grunt.config.merge(configObject);

			if (profile && profile !== task.profile) {
				toRun = false;
			}

			if (type && type !== task.type) {
				toRun = false;
			}

			if (toRun) {
				taskToRun.push("ui-tests-prepare-app:" + index);
				taskToRun.push("run:uiTests" + index);
				taskToRun.push("ui-tests-screens:" + index);
				if (addReport) {
					taskToRun.push("ui-tests-report:" + index);
				}
			}
		});

		grunt.task.run(taskToRun);
	});

	grunt.registerTask("ui-tests-junit", "Jenkins runner of UI tests", function () {
		onlyAccepted = true;
		addReport = true;

		grunt.task.run("ui-tests-base");
	});

	grunt.registerTask("ui-tests", "Runner of UI tests", ["ui-tests-base", "connect:uiTests"]);
};