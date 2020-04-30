var path = require("path"),
	SVGSpriter = require("svg-sprite"),
	mkdirp = require("mkdirp"),
	fs = require("fs");

module.exports = function (grunt) {
	"use strict";

	function compileSVGSprites() {


		var done = this.async(),

			defaultConfig = this.data.config,
			sourcePaths = this.data.sources,

			queue = [];

		sourcePaths.forEach(function (task) {
			queue.push(convert(task.src, task.dest, task.fileMask));
		});

		Promise.all(queue).then(function () {
			grunt.log.writeln("SVGSprites: Done");
			done();
		});

		function convert(srcDir, destDir, fileMask) {
			grunt.log.writeln("convert: " + srcDir);

			return new Promise(function (resolve) {
				var spriter; // instance of spriter

				// read file direcotory
				const fileRegExp = new RegExp(fileMask),
					readDir = new Promise(function (resolve, error) {

						fs.readdir(srcDir, {encoding: "utf-8"}, function (errorDir, files) {
							if (errorDir) {
								grunt.log.error(errorDir);
								error(errorDir);
							} else {
								grunt.log.debug("Files to join:");
								grunt.log.debug(files);
								resolve(files);
							}
						});
					});

				readDir.catch(function (e) {
					grunt.log.error("Error: " + e);
				}).then(function (files) {
					var queue = [],
						config = JSON.parse(JSON.stringify(defaultConfig));

					// destination directory
					config.dest = destDir;

					files = files.filter(function (file) {
						return file.match(fileRegExp);
					});
					files.forEach(function (file) {
						queue.push(new Promise(function (resolve, error) {
							fs.readFile(path.join(srcDir, file), {encoding: "utf-8"}, function (readError, data) {
								if (readError) {
									error(readError);
								} else {
									resolve({file, data});
								}
							});
						}));
					});

					// result file
					config.mode.css.sprite = files[0].replace(fileRegExp, "_sprites");

					spriter = new SVGSpriter(config);

					Promise.all(queue).then(function (data) {
						//console.log("all files read", data);
						data.forEach(function (fileData) {
							spriter.add(path.resolve(fileData.file), fileData.file, fileData.data);
						});

						// Compile the sprite
						spriter.compile(function (error, result) {
							var mode,
								type;

							// Run through all configured output modes
							for (mode in result) {
								if (result.hasOwnProperty(mode)) {
									// Run through all created resources and write them to disk
									for (type in result[mode]) {
										if (result[mode].hasOwnProperty(type)) {
											mkdirp.sync(path.dirname(result[mode][type].path));
											fs.writeFile(result[mode][type].path, result[mode][type].contents, resolve);
										}
									}
								}
							}
						});
					});
				});
			});
		}
	}

	grunt.registerMultiTask("svg-sprites", "Compile sprites from /src to /dist", compileSVGSprites);
}