/*global module:false, require:false*/

var fs = require("fs"),
	path = require("path"),
	async = require("async");

module.exports = function (grunt) {
	"use strict";


	function prepareProfile(app, profile, destination, appDest, done) {
		fs.exists(app + path.sep + profile, function (exists) {
			if (exists) {
				app += path.sep + profile + path.sep;
			}
			grunt.config("multitau." + profile + ".options", {
				src: 'dist',
				dest: path.join(app, destination),
				profile: profile,
				app: app,
				type: "landscape",
				"app-dest": appDest
			});
			done();
		});
	}

	grunt.registerTask("prepare-app", function () {
		var profile = grunt.option("profile"),
			app = grunt.option("app") + path.sep,
			appDest = grunt.option("app-dest"),
			destination = grunt.option("destination") || path.join("lib", "tau"),
			done = this.async(),
			tasks = [];

		if (!app) {
			grunt.log.error("missing option app");
		}

		grunt.log.error("grunt.option: " + profile);
		if (profile) {
			grunt.log.error("prepare Profile: " + profile);
			tasks.push(prepareProfile.bind(null, app, profile, destination, appDest));
		} else {
			grunt.log.error("prepare Profile: " + profile);
			tasks.push(prepareProfile.bind(null, app, "wearable", destination, appDest));
			tasks.push(prepareProfile.bind(null, app, "mobile", destination, appDest));
		}

		async.series(tasks, function () {
			grunt.task.run("multitau");
			done();
		});

	});
};
