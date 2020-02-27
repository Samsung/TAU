// Karma configuration
// Generated on Thu Jun 11 2015 12:03:58 GMT+0200 (Central European Summer Time)

module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: "../../",

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ["requirejs", "qunit"],

		reporters: ["progress", "html", "console", "coverage"],

		coverageReporter: {
			type: "html",
			dir: "reports/coverage/"
		},

		plugins: ["karma-requirejs",
			"karma-chrome-launcher",
			"karma-qunit",
			"karma-coverage",
			"karma-html-reporter",
			// This is ours custom module,
			// To install, run
			//      npm install tools/karma-plugins/console-reporter/
			//      sudo npm install tools/karma-plugins/console-reporter/ -g
			"karma-console-reporter"
		],
		autoWatch: true,
		// list of files / patterns to load in the browser
		files: [
			{pattern: "tests/libs/qunit-1.11.0.js", included: true, served: true},
			{pattern: "tests/libs/jquery.js", included: true, served: true},
			{pattern: "libs/path-to-regexp.js", included: false, served: true},
			{pattern: "tests/libs/require.js", included: false, served: true},

			{pattern: "examples/wearable/UIComponents/**/*", included: false, served: true},
			// // {pattern: "examples/wearable/UIComponentsCE/**/*", included: false, served: true},

			{pattern: "tests/karma/tests/helpers.js", included: false, served: true, watch: true},
			{pattern: "tests/karma/tests/compare-helper.js", included: false, served: true, watch: true},
			{pattern: "tests/karma/tests/compare-helper-excludes.js", included: false, served: true, watch: true},
			{pattern: "tests/karma/tests/properties-typeof-compare.js", included: false, served: true, watch: true},

			// here put path to tests

			{pattern: "tests/karma/tests/**/wearable-test.js", included: false, served: true, watch: true},
			"tests/karma/testPaths.js",
			"tests/karma/runner.js"
		],


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
		// browsers: ["ChromeHeadless"],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		htmlReporter: {
			outputDir: "reports/wearable", // where to put the reports
			templatePath: null, // set if you moved jasmine_template.html
			focusOnFailures: true, // reports show failures on start
			namedFiles: false, // name files instead of creating sub-directories
			pageTitle: null, // page title for reports; browser info by default
			urlFriendlyName: false // simply replaces spaces with _ for files/dirs
		}
	});
};
