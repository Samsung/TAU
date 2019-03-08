// Karma configuration
// Generated on Thu Jun 11 2015 12:03:58 GMT+0200 (Central European Summer Time)

module.exports = function (config) {
	config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: "../../",


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ["requirejs", "qunit"],

		reporters: ["progress", "coverage"],

		coverageReporter: {
			type: "html",
			dir: "reports/coverage/"
		},

		plugins: ["karma-requirejs", "karma-chrome-launcher", "karma-qunit", "karma-coverage"],
		autoWatch: true,
        // list of files / patterns to load in the browser
		files: [
            {pattern: "tests/libs/qunit-1.11.0.js", included: true, served: true},
            {pattern: "tests/libs/jquery.js", included: true, served: true},
            {pattern: "libs/path-to-regexp.js", included: false, served: true},
            {pattern: "demos/TAUApplicationFramework/**", included: false, served: true, watch: false},
            {pattern: "demos/TAUControllerWithRouter/**", included: false, served: true, watch: false},
            {pattern: "demos/TAUControllerWithOutRouter/**", included: false, served: true, watch: false},
            {pattern: "demos/TAUControllerWithOutRouterWithPolymer/**", included: false, served: true, watch: false},
            {pattern: "demos/TAUMultiProfilesTemplateLoad/**", included: false, served: true, watch: false},
            {pattern: "tests/libs/require.js", included: false, served: true},
            {pattern: "tests/karma/tests/helpers.js", included: false, served: true, watch: true},
            {pattern: "tests/karma/tests/appframework/app-helpers.js", included: false, served: true, watch: true},
            // here put path to single test
            {pattern: "tests/karma/tests/appframework/*-test.js", included: false, served: true, watch: true},
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
		singleRun: false
	});
};
