/* global define, equal, ok, start, asyncTest, test */
define(
	["../compare-helper"],
	function (compareHelper) {
		// circular
		compareHelper.compare({
			path: "/base/examples/wearable/circular",
			appName: "CircularUIComponents",
			indexFile: "index.html",
			width: 360,
			height: 360
		});
	});
