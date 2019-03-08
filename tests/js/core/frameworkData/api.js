(function (tau){
	"use strict";

	module("core/frameworkData");

	(function (frameworkData) {
		test("API tau.frameworkData", function () {
			equal(typeof frameworkData.frameworkName, "string", "Framework name property exists");
			equal(typeof frameworkData.rootDir, "string", "Framework device root directory property exists");
			equal(typeof frameworkData.version, "string", "Framework version is string");
			equal(typeof frameworkData.theme, "string", "Framework theme is string value");
			equal(typeof frameworkData.themeLoaded, "boolean", "Framework themeLoaded is boolean");
			equal(typeof frameworkData.defaultViewportWidth, "number", "Framework default viewport width is number");
			equal(typeof frameworkData.viewportWidth, "string", "Framework default viewport width is number");
			equal(typeof frameworkData.viewportScale, "boolean", "Framework default viewport scale is boolean");
			equal(typeof frameworkData.defaultFontSize, "number", "Framework default font size is number");
			equal(typeof frameworkData.minified, "boolean", "Framework source is minified");
			equal(typeof frameworkData.deviceCapa, "object", "Device capability object exists");
			equal(typeof frameworkData.deviceCapa.inputKeyBack, "boolean", "Back key support is boolean");
			equal(typeof frameworkData.deviceCapa.inputKeyMenu, "boolean", "Menu key support is boolean");
			equal(typeof frameworkData.debug, "boolean", "Debug mode is a boolean");
			equal(typeof frameworkData.pkgVersion, "string", "Framework pkgVersion is string");
			equal(typeof frameworkData.dataPrefix, "string", "Framework dataPrefix is string");
			equal(typeof frameworkData.profile, "string", "Framework profile is string");
		});

		test("API tau.frameworkData length", function () {
			equal(Object.keys(frameworkData).length, 18, "tau.frameworkData has right amount of props");
		});
	}) (tau.frameworkData);
}(window.tau));
