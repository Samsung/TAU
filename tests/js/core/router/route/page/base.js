/* global test, window, document */
/**
 * @TODO delete tau namespace from this file
 */
module("core/router/route/page/custom-base", {
	setup: function () {
		var base = document.createElement("base");

		base.href = "/test-base.html"
		document.head.appendChild(base);
	},
	teardown: function () {
		var base = document.head.querySelector("base");

		if (base) {
			document.head.removeChild(base);
		}
	}
});

test("Custom base element", function (assert) {
	var base = document.head.querySelector("base");

	window.tau.engine.run();

	base = document.head.querySelector("base");
	assert.ok(base.href.indexOf("test-base.html") != -1, "Base element was set by developer");
});
