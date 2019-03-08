/*jslint nomen: true, plusplus: true */
/*global module, require, __dirname, console */
var path = require("path");

module.exports = function (grunt) {
	"use strict";
	var sep = path.sep;

	function onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	}

	function notExistsInFileContent(fileContent, keyword) {
		// @TODO Needs more precision
		// this may pass files ending with similar name
		// file.png will cover two cases test-file.png and file.png
		return fileContent.indexOf(keyword) === -1;
	}

	// This task requires prebuild .css files
	// Please remember to run `grunt build` task first
	grunt.registerMultiTask("remove-unused", "Finds unused files inside give paths. Run `build` first!", function () {
		var taskSettings = this.data,
			imageFiles = grunt.file.expandMapping(taskSettings.imageFiles),
			codeFiles = grunt.file.expandMapping(taskSettings.codeFiles),
			deleteCount = 0;

		grunt.log.ok(imageFiles.length + " images found");

		imageFiles = imageFiles.map(function (image) {
			var pathSplit = image.src[0].split(sep);

			return pathSplit[pathSplit.length - 1];
		}).filter(onlyUnique);

		grunt.log.ok(imageFiles.length + " unique image names found");

		// Go through all css files
		codeFiles.forEach(function (file) {
			var fileContent = grunt.file.read(file.src[0]),
				finder = notExistsInFileContent.bind(null, fileContent);

			// Reduce imageFiles to have only those that haven't been found yet
			// after all files are done, this will contain only files that are unused
			imageFiles = imageFiles.filter(finder);
		});

		grunt.log.ok(imageFiles.length + " unique image names NOT found in final .css files");
		grunt.verbose.write(imageFiles);

		imageFiles.forEach(function (image) {
			var expandedPath = grunt.file.expandMapping(taskSettings.resourcesPath + sep + "**" + sep + image);

			expandedPath.forEach(function (themePaths) {
				if (grunt.file.delete(themePaths.dest)) {
					deleteCount++;
				}
			});
		});

		grunt.log.ok(deleteCount + " files removed");
	});

};