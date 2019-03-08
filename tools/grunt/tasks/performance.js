/*global module, console, require, __dirname */
var Stats = require("fast-stats").Stats,
	CliTable = require("cli-table"),
	path = require("path"),
	PhantomTester = require("./modules/performance/phantom"),
	DeviceTester = require("./modules/performance/device");

module.exports = function (grunt) {
	var TEST_COUNT = 50,
		RESULT_PRECISION = 3;

	function preparePerformanceReport(storage) {
		var deviceUIDs = Object.keys(storage),
			section,
			stepNames,
			table,
			tableSettings = {
				head: ["[Section/Step]", "[Median]", "[Avg]", "[StdDev]"],
				colWidths: [60, 20, 20, 20]
			};

		grunt.log.writeln("=============================================================================================================================");
		grunt.log.writeln(" PERFORMANCE REPORT ");
		grunt.log.writeln(" Note: Shows time between section start and following steps ");
		grunt.log.writeln("=============================================================================================================================");

		deviceUIDs.forEach(function (uid) {
			var sectionNames = Object.keys(storage[uid]);

			table = new CliTable(tableSettings);

			grunt.log.writeln("\n Device: " + uid);
			grunt.log.writeln("-----------------------------------------------------------------------------------------------------------------------------");

			sectionNames.forEach(function (sectionName) {
				var startStats;

				section = storage[uid][sectionName];
				startStats = new Stats().push(section.start);

				table.push([
					sectionName + " (start time)",
					startStats.amean().toFixed(RESULT_PRECISION) + "ms",
					startStats.median().toFixed(RESULT_PRECISION) + "ms",
					startStats.stddev().toFixed(RESULT_PRECISION) + "ms"
				]);

				stepNames = Object.keys(storage[uid][sectionName].steps);
				stepNames.forEach(function (stepName) {
					var stats = new Stats().push(section.steps[stepName]);

					table.push([
						" \\_ " + stepName,
						"+" + stats.amean().toFixed(RESULT_PRECISION) + "ms",
						"+" + stats.median().toFixed(RESULT_PRECISION) + "ms",
						stats.stddev().toFixed(RESULT_PRECISION) + "ms"
					]);
				});

			});

			grunt.log.writeln(table.toString());
		});

	}

	function saveToFile(filePath, output) {
		var pathParts = filePath.split(path.sep);

		grunt.file.mkdir(pathParts.join(path.sep));

		if (grunt.file.write(filePath, JSON.stringify(output))) {
			grunt.log.ok("Output was saved to " + filePath);
		}
	}

	grunt.registerTask("performance", "", function () {
		var currentTask = this,
			testApps = [
				{
					// [OPTIONAL] for device tests
					//id: "vUf39tzQ3s.Winset",
					// [OPTIONAL] for device tests
					//name: "Mobile Winset",
					// REQUIRED for Phantom tests
					//path: "examples/MobileWinset/src/index.html",
					// REQUIRED for device tests
					wgtPath: "examples/MobileWinset/MobileWinset.wgt"
				}
			],
			noBuild = grunt.option("no-build"),
			inputFile = grunt.option("input-file") || null,
			outputFile = grunt.option("output-file") || null,
			testCount = grunt.option("test-count") || TEST_COUNT,
			done = this.async(),
			tester;

		if (currentTask.flags.device) {
			tester = new DeviceTester();
		} else {
			tester = new PhantomTester();
		}

		// Read input test apps
		if (inputFile) {
			testApps = grunt.file.readJSON(inputFile);
		}

		function collectTests(err) {
			var currentApp,
				testIndex,
				i;

			if (err) {
				grunt.verbose.error(err);
				done(err);
			} else {
				if (!noBuild) {
					grunt.log.ok();
				}

				grunt.log.writeln("Building performance tests list");

				// Performance tests for every requested profile
				for (i = 0; i < testApps.length; i++) {
					currentApp = testApps[i];

					for (testIndex = 0; testIndex < testCount; testIndex++) {
						tester.addTest(currentApp);
					}
				}

				grunt.log.write("Running tests: ");
				grunt.log.writeln(testCount * testApps.length);

				tester.run(function () {
					var results = tester.getRawResults(),
						output;

					preparePerformanceReport(results);

					if (outputFile) {
						output = {
							info: tester.info,
							results: results
						};

						saveToFile(outputFile, output);
					}

					done();
				});
			}
		}

		if (!noBuild) {
			grunt.log.write("Running 'grunt build' task with performance flag...");
			grunt.util.spawn({
				grunt: true,
				args: ["build", "--tau-performance=true"]
			}, collectTests);
		} else {
			collectTests(null, "", 0);
		}
	});
};
