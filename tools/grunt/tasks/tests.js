/*global module, require*/
/*eslint camelcase: 0 */
/**
 * Tasks for framework testing
 *
 * @author  Maciej Urbanski <m.urbanski@samsung.com>
 * @author  Michał Szepielak <m.szepielak@samsung.com>
 * @author  Hyunkook, Cho <hk0713.cho@samsung.com>
 * @author  Junyoung Park <jy-.park@samsung.com>
 * @author  Tomasz Lukawski <t.lukawski@samsung.com>
 * @author  Hagun Kim <hagun.kim@samsung.com>
 * @author  Maciej Moczulski <m.moczulski@samsung.com>
 * @author  Piotr Karny <p.karny@samsung.com>
 * @author  Hosup Choi <hosup83.choi@samsung.com>
 */

var path = require("path"),
	buildAnalysis = require("rjs-build-analysis");

module.exports = function (grunt) {
	"use strict";

	var configProperty,
		buildFrameworkPath = path.join("dist"),
		testConfig = {},
		lastBuild = "",
		prepareForRunner = false,
		testsFilesArray = grunt.file.expand([path.join("tests", "js", "**", "*.html"), "!" + path.join("**", "test-data", "**")]),
		testFilesObject = {},
		TCTConfig = {
			mobile: {
				"numberOfTestsPerPackage": 30
			},
			wearable: {
				"numberOfTestsPerPackage": 20
			}
		},
		prepareTestsList = function (profileName, done, output) {
			var result = buildAnalysis.parse(output),
				slice = [].slice,
				testModules = grunt.config("qunit.main-" + profileName) || [],
				testSupportModules = (profileName === "mobile" && grunt.config("qunit.main-" + profileName + "_support")) || [],
				jsAddTests = grunt.option("js_add_test") ? grunt.option("js_add_test").split(",") : ["api", profileName],
				singleTest = grunt.option("single_test") ? grunt.option("single_test") : "";

			if (profileName === "mobile" || profileName === "mobile_support") {
				jsAddTests.push("jquery");
				jsAddTests.push("jqm");
				jsAddTests.push("jqm1.4ok");
			}

			if (result && result.bundles.length > 0 && singleTest === "") {
				slice.call(result.bundles[0].children).forEach(function (modulePath) {
					var testDirectory = path.relative("src/", modulePath).replace(/(\.js)+/gi, ""),
						mainTestPattern = path.join("tests", testDirectory, "*.html"),
						testPatterns = [mainTestPattern],
						files = null,
						subPattern = "";

					testModules.push(mainTestPattern);
					jsAddTests.forEach(function (oneDirectory) {
						var subPattern = path.join("tests", testDirectory, oneDirectory, "*.html");

						testModules.push(subPattern);
						testPatterns.push(subPattern);
					});

					subPattern = path.join("tests", testDirectory, "mobile_support", "*.html");
					testSupportModules.push(subPattern);
					testPatterns.push(subPattern);

					files = grunt.file.expand(testPatterns);

					if (files.length) {
						grunt.log.ok("Tests exist for module ", testDirectory);
						files.forEach(function (file) {
							testFilesObject[file] = false;
						});
					} else {
						grunt.log.warn("Tests don't exist for module ", testDirectory);
					}
				});
				grunt.config("qunit.main-" + profileName, testModules);
				if (profileName === "mobile") {
					grunt.config("qunit.main-mobile_support", testSupportModules);
				}
			} else if (singleTest !== "") {
				testModules.push(singleTest);
				grunt.config("qunit.main-" + profileName, testModules);
			}
			done();
		};

	testsFilesArray.forEach(function (file) {
		testFilesObject[file] = true;
	});

	testConfig = {
		wearable: {
			"qunit-main": true,
			default: true
		},
		mobile: {
			"qunit-main": true,
			default: true
		},
		mobile_support: {
			"qunit-main": true,
			default: true
		}
	};
	grunt.config("test", testConfig);

	// Update config for task; copy
	configProperty = grunt.config.get("copy");
	configProperty["test-libs-wearable"] = {
		files: [
			{
				expand: true,
				cwd: path.join(buildFrameworkPath, "wearable", "js"),
				src: "**",
				dest: path.join("tests", "libs", "dist", "js")
			},
			{
				expand: true,
				cwd: path.join(buildFrameworkPath, "wearable", "theme", "default"),
				src: "**",
				dest: path.join("tests", "libs", "dist", "theme", "default")
			},
			{
				expand: true,
				cwd: path.join(buildFrameworkPath, "libs"),
				src: "**",
				dest: path.join("tests", "libs", "dist", "libs")
			}
		]
	};
	configProperty["test-libs-mobile"] = {
		files: [
			{
				expand: true,
				cwd: path.join(buildFrameworkPath, "mobile", "js"),
				src: "**",
				dest: path.join("tests", "libs", "dist", "js")
			},
			{
				expand: true,
				cwd: path.join(buildFrameworkPath, "mobile", "theme", "default"),
				src: "**",
				dest: path.join("tests", "libs", "dist", "theme", "default")
			},
			{
				expand: true,
				cwd: path.join(buildFrameworkPath, "libs"),
				src: "**",
				dest: path.join("tests", "libs", "dist", "libs")
			}
		]
	};
	configProperty["test-libs-mobile_support"] = configProperty["test-libs-mobile"];
	grunt.config.set("copy", configProperty);

	configProperty = grunt.config.get("concat");
	// Update config for task; concat
	if (configProperty) {
		configProperty["ej-namespace"] = {
			src: [path.join("tests", "libs", "dist", "js", "tau.js"), path.join("tests", "libs", "namespace.js")],
			dest: path.join("tests", "libs", "dist", "js", "tau.js")
		};
		grunt.config.set("concat", configProperty);
	}

	// Update config for task; clean
	configProperty = grunt.config.get("clean");

	if (configProperty) {
		configProperty["test-libs"] = {
			expand: true,
			src: [path.join("tests", "libs", "dist")]
		};

		grunt.config.set("clean", configProperty);
	}

	//grunt.loadNpmTasks( "grunt-contrib-qunit" );
	grunt.loadNpmTasks("grunt-qunit-istanbul");
	grunt.loadNpmTasks("grunt-qunit-junit");
	grunt.loadNpmTasks("grunt-karma");

	grunt.config.merge({
		karma: {
			CEUIComponentsMobile: {
				configFile: "./tests/karma/uicomponents.mobile.conf.js",
				singleRun: true
			},
			CEUIComponentsWearable: {
				configFile: "./tests/karma/uicomponents.wearable.conf.js",
				singleRun: true
			},
			CEUIComponentsWearableCircular: {
				configFile: "./tests/karma/uicomponents.wearable.circular.conf.js",
				singleRun: true
			},
			app: {
				configFile: "tests/karma/app.conf.js",
				singleRun: true
			},
			unit: {
				configFile: "tests/karma/all.conf.js",
				runnerPort: 9999,
				singleRun: true
			}
		}
	});

	function testProfile(profile, prepareOnly) {
		var taskConf = grunt.config.get("test"),
			qunitConf = grunt.config.get("qunit"),
			options = taskConf[profile],
			buildProfile = profile && (testConfig[profile].profile || profile);

		if (lastBuild !== buildProfile) {
			// would be better to maintain separate build for tests purposes
			grunt.task.run("build-" + buildProfile);
			lastBuild = buildProfile;
		} else {
			grunt.task.run("requirejs:" + buildProfile);
		}

		if (options) {
			// Clean test libs
			grunt.task.run("clean:test-libs");

			// Copying only the profile which is needed for current test
			grunt.task.run("copy:test-libs-" + profile);

			// Inject EJ's namespace fix
			grunt.task.run("concat:ej-namespace");

			if (!prepareOnly) {
				grunt.task.run("set-profile:" + profile, "qunit_junit");

				// Run qunit main tests. This tests are generated by qunitPrepare in main grunt file
				if (options["qunit-main"] === true) {
					grunt.task.run("qunit:main-" + profile);
				}

				// Run qunit jqm widget profile tests if there are some
				if (qunitConf[profile] && qunitConf[profile].length > 0) {
					grunt.task.run("qunit:" + profile.toLowerCase());
				}
			} else {
				grunt.task.run("prepare-runner:" + profile);
			}
		} else {
			grunt.log.error("There is no configuration for profile " + profile);
		}
	}

	grunt.registerTask("set-profile", function (profile) {
		var testReportPath = path.join("report", "test", profile);

		grunt.config.set("qunit.options.coverage", {
			disposeCollector: true,
			src: ["tests/libs/dist/js/tau.js", "tests/libs/dist/js/tau.support-2.3.js"],
			htmlReport: testReportPath + "/coverage/html/",
			cloverReport: testReportPath + "/coverage/clover/",
			instrumentedFiles: "temp/",
			reportOnFail: true
		});

		grunt.config.set("qunit_junit.options.dest", testReportPath + "/unit/");
		grunt.config.set("qunit_junit.options.fileNamer", function (url) {
			return url.replace(/\.html(.*)$/, "");
		});

		grunt.event.emit("qunit.profile", profile);
	});

	grunt.registerTask("test", "Run tests. \n" +
		"This task requires params:\n" +
		"<profile>\n" +
		"options:\n" +
		"--single_test : determines single test to run\n" +
		"example:\n" +
		"\"grunt test:mobie --single_test=/path/test.html\"",
		function (profile) {
			var profileName;

			// Inject require done callback
			configProperty = grunt.config.get("requirejs");

			for (profileName in testConfig) {
				if (testConfig.hasOwnProperty(profileName) && testConfig[profileName]["qunit-main"]) {
					configProperty[profileName].options.done = prepareTestsList.bind(null, profileName);
				}
			}
			grunt.config.set("requirejs", configProperty);

			if (profile) {
				testProfile(profile, prepareForRunner);
			} else {
				for (profileName in testConfig) {
					if (testConfig.hasOwnProperty(profileName) && testConfig[profileName].default) {
						testProfile(profileName);
					}
				}
			}
			grunt.task.run("test-print-unused");
		});

	grunt.registerTask("test-print-unused", "", function () {
		grunt.log.subhead("Tests file not loaded");
		testsFilesArray.forEach(function (file) {
			if (testFilesObject[file]) {
				grunt.log.warn("Test file not loaded:", file);
			}
		});
	});


	// Encapsulate this task
	grunt.registerTask("prepare-runner", function (profile) {
		var opt = {
				filter: "isFile"
			},
			src = grunt.config.get("qunit.main-" + profile),
			filePaths;

		if (src) {
			grunt.log.ok("Write " + profile + " test list to tests/tau-runner/tests.js");
			filePaths = grunt.file.expand(opt, src);
			grunt.file.write("tests/tau-runner/tests.js",
				"var TESTS = " + JSON.stringify(filePaths) +
				";\n" +
				"var CURRENT_ITERATION = 0;" +
				"\n" +
				"var TESTS_PER_ITERATION = " + TCTConfig[profile].numberOfTestsPerPackage + ";" + "\n"
			);
		} else {
			grunt.log.error("Couldn't find configuration for profile: " + profile);
			return false;
		}
	});

	grunt.registerTask("test-runner-prepare", function (profile) {
		// Set prepare test list for runner flag
		prepareForRunner = true;

		// Run test module
		grunt.task.run("test:" + profile);
	});

	grunt.registerTask("qunit-report",
		"Generate QUnit report", function () {
			var modules = {},
				file = "report/test.txt",
				module = "",
				test = "",
				report = "",
				url,
				currentProfile,
				id = 0;

			grunt.event.on("qunit.moduleStart", function (name) {
				module = name;
				if (url.indexOf("tests/js/" + name) !== 0) {
					grunt.log.error("Wrong module name in ", url, name, " should be changed");
				}
			});
			grunt.event.on("qunit.spawn", function (details) {
				url = details;
				module = "";
			});
			grunt.event.on("qunit.profile", function (details) {
				currentProfile = details;
			});
			grunt.event.on("qunit.testStart", function (name) {
				if (!module && test != name) {
					grunt.log.error(url, " ! ");
				}
				test = name;
			});
			grunt.event.on("qunit.log", function (result, actual, expected, rawMessage) {
				var line = "";

				if (typeof expected === "object") {
					expected = "[object]";
				}
				if (typeof actual === "object") {
					actual = "[object]";
				}
				if (expected instanceof Array) {
					expected = "[Array]";
				}
				if (actual instanceof Array) {
					actual = "[Array]";
				}
				expected = expected.split("\n").join(" ");
				actual = actual.split("\n").join(" ");
				line = test + "	" + currentProfile + "-" + id + "	" + rawMessage + "	" + "	" + expected + "	" + actual + "	" + (result ? "PASS" : "FAIL");

				modules[module] = modules[module] || "";
				modules[module] += line + "\n";
				id++;
			});
			grunt.event.on("qunit.done", function () {
				var module,
					i;

				report = "";
				for (i in modules) {
					if (modules.hasOwnProperty(i)) {
						module = modules[i];
						report += "Module Name	" + i + "\n";
						report += "Function Name	TestCase ID	Test Case Description	Input	Expected Result	Execution Result	Pass/Fail" + "\n";
						report += module;
						report += "\n\n";
					}
				}
				grunt.file.write(file, report);
			});
		});
};
