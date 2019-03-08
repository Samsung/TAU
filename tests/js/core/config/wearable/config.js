/*global test, ok, equal, module, strictEqual*/
/**
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (ej){
	"use strict";

	module("core/config");

	test("Test default config values", function() {
		strictEqual(ej.get("autoBuildOnPageChange"), false, "'autoBuildOnPageChange' - Auto building widgets on page change is set to: false");
	});
}(window.ej));