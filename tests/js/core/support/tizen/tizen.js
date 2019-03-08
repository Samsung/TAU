/* global module, define, tau, QUnit */
(function () {
	"use strict";
	function runTests(supportTizen) {

		QUnit.module("core/support/tizen");

		QUnit.test("isCircleShape", function (assert) {
			var circleStatus = supportTizen.isCircleShape(),
				style = document.createElement("style");

			assert.equal(circleStatus, false, "Default circle is false");

			style.type = "text/css";
			style.innerHTML = ".is-circle-test { width: 1px }";
			document.getElementsByTagName("head")[0].appendChild(style);

			circleStatus = supportTizen.isCircleShape();

			assert.equal(circleStatus, true, "circle is true when class is defined");

			style.parentElement.removeChild(style);
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.support);
	}
}());