var fs = require("fs"),
	path = require("path");

module.exports = function (grunt) {
	'use strict';

	/**
	 * Look ma, it's cp -R.
	 * @param {string} src The path to the thing to copy.
	 * @param {string} dest The path to the new copy.
	 */
	function copyRecursiveSync(src, dest) {
		var exists = fs.existsSync(src),
			stats = exists && fs.statSync(src),
			isDirectory = exists && stats.isDirectory();
		if (exists && isDirectory) {
			fs.mkdirSync(dest);
			fs.readdirSync(src).forEach(function(childItemName) {
				copyRecursiveSync(path.join(src, childItemName),
					path.join(dest, childItemName));
			});
		} else {
			fs.linkSync(src, dest);
		}
	}

	function unlinkRecursiveSync(src) {
		var exists = fs.existsSync(src),
			stats = exists && fs.statSync(src),
			isDirectory = exists && stats.isDirectory();
		if (exists) {
			if (isDirectory) {
				fs.readdirSync(src).forEach(function (childItemName) {
					unlinkRecursiveSync(path.join(src, childItemName));
				});
				fs.rmdirSync(src);
			} else {
				fs.unlinkSync(src);
			}
		}
	}

	function mkdirRecursiveSync(dir) {
		var dirs = dir.split(path.sep),
			currentDir = dirs.shift();
		dirs.forEach(function(dirName) {
			if (!fs.existsSync(currentDir)) {
				fs.mkdirSync(currentDir);
			}
			currentDir += path.sep + dirName;
		});
	}

	grunt.registerMultiTask('tizen', '', function (profile) {
		var options = this.options(),
			profile = options["profile"],
			src = options["src"],
			dest = options["dest"];
		if (src.substr(-1) !== "/") {
			src += "/";
		}
		grunt.log.ok("delete " + dest);
		unlinkRecursiveSync(dest);
		mkdirRecursiveSync(dest);
		grunt.log.ok("copy " + src + " -> " + dest);
		copyRecursiveSync(src + profile, dest);
	});
};
