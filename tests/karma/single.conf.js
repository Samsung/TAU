/* global module */
// Karma configuration
// Generated on Thu Jun 11 2015 12:03:58 GMT+0200 (Central European Summer Time)

module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: "../../",


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ["requirejs", "qunit"],

		reporters: ["progress", "coverage", "junit"],

		coverageReporter: {
				// specify a common output directory
			dir: "report/test/karma/coverage",
			reporters: [
					// reporters not supporting the `file` property
					{ type: "html", subdir: "html" },
					{ type: "clover", subdir: "clover" },
					{ type: "lcov", subdir: "lcov" }
			]
		},

		// the default configuration
		junitReporter: {
			outputDir: "report/test/karma/unit", // results will be saved as $outputDir/$browserName.xml
			outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
			suite: "Karma", // suite will become the package name attribute in xml testsuite element
			useBrowserName: false, // add browser name to report and classes names
			nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
			classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
			properties: {} // key value pair of properties to add to the <properties> section of the report
		},

		plugins: ["karma-requirejs", "karma-chrome-launcher", "karma-qunit", "karma-coverage", "karma-junit-reporter"],
		autoWatch: true,
		// list of files / patterns to load in the browser
		files: [
			{pattern: "tests/libs/jquery.js", included: true, served: true},
			{pattern: "tests/libs/require.js", included: false, served: true},
			{pattern: "tests/karma/tests/helpers.js", included: false, served: true, watch: true},
			{pattern: "tests/js/**/*.js", included: false, served: true, watch: true},
			{pattern: "tests/js/**/*.html", included: false, served: true, watch: true},
			{pattern: "src/js/**/*.js", included: false, served: true, watch: true},
			{pattern: "dist/**/*", included: false, served: true, watch: true},
			"tests/karma/single.test.path.js",
			"tests/karma/runner.js"
		],

		// list of files to exclude
		exclude: [],

		preprocessors: {
			// source files, that you wanna generate coverage for
			// do not include tests or libraries
			// (these files will be instrumented by Istanbul)
			"src/js/**/*.js": ["coverage"]
		},


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		customLaunchers: {
			bigScreen: {
				base: "Chrome",
				flags: ["--window-size=800,800"]
			}
		},

		browsers: ["bigScreen"],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,
		processKillTimeout: 10000,
		browserDisconnectTimeout: 10000
	});
};
