/* global define, equal, ok, start, asyncTest, test */
define(
	["../compare-helper"],
	function (compareHelper) {
		// square
		compareHelper.compare({
			path: "/base/examples/wearable",
			appName: "UIComponents",
			indexFile: "index.html",
			width: 360,
			height: 480
		});
	});
