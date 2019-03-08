/*global test, ok, equal, module, strictEqual*/
/**
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (ej){
	"use strict";

	module("core/config");

	test("Test default config values - global", function() {
		strictEqual(ej.get('rootDir'), ej.getFrameworkPath(), "'rootDir' - is set to: ns.getFrameworkPath() value");
		strictEqual(ej.get('version'), '', "'version' - is an empty string");
		strictEqual(ej.get('allowCrossDomainPages'), false, "'allowCrossDomainPages' - is set to: false");
		strictEqual(ej.get('domCache'), false, "'domCache' - is set to: false");
	});
}(window.ej));