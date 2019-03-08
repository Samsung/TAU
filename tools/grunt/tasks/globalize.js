/*global module */
/*
 * Downloading globalize lib
 *
 * @author Hosup Choi <hosup83.choi@samsung.com>
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
	"use strict";
	var copyTask,
		srcCldrDataPath = "node_modules/cldr-data",
		destCldrDataPath = "libs/cldr-data";

	function getCldrData() {
		var rtn = [],
			src = [],
			expand = true,
			supportLanguages = ["ar", "en", "ko", "zh"],
			path = {
				libs: "libs",
				nodeModule: "node_modules",
				cldrData: "cldr-data",
				main: "main",
				supplemental: "supplemental",
				scriptMetaData: "scriptMetaData.json"
			},
			subdirectories = "**";

		supportLanguages.forEach(function (item) {
			src.push(path.main + "/" + item + "/" + subdirectories);
		});
		src.push(path.supplemental + "/" + subdirectories);
		rtn.push({
			expand: expand,
			cwd: path.nodeModule + "/" + path.cldrData,
			src: src,
			dest: path.libs + "/" + path.cldrData
		});
		rtn.push({
			expand: expand,
			cwd: path.libs,
			src: path.scriptMetaData,
			dest: path.libs + "/" + path.cldrData + "/" + path.supplemental
		});

		return rtn;
	}

	copyTask = grunt.config.get("copy");
	copyTask["cldr-data"] = {
		files: getCldrData()
	};
	grunt.config.set("copy", copyTask);

	grunt.registerTask("globalize", function () {

		if (grunt.file.exists(srcCldrDataPath)) {
			if (!grunt.file.exists(destCldrDataPath)) {
				grunt.task.run("copy:cldr-data");
			}
		} else {
			grunt.log.warn("require download cldr-data...");
		}
	});
};
