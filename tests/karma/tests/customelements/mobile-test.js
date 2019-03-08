/* global define, equal, ok, start, asyncTest, test */
define(
	["../compare-helper"],
	function (compareHelper) {
		compareHelper.compare({
			path: "/base/examples/mobile",
			appName: "UIComponents",
			indexFile: "index.html"
		});
	});
