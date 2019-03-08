/* global QUnit, ns, define, tau, Promise */
(function () {
	"use strict";
	function runTests(Scrollview, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/wearable/widget/wearable/Scrollview/test-data/sample.html"),
					parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML = HTML;
				helpers.loadTAUStyle(document, "wearable", function () {
					resolve();
				});
			});
		}

		function clearHTML() {
			helpers.removeTAUStyle(document);
		}

		QUnit.module("profile/wearable/widget/wearable/Scrollview", {
			setup: initHTML,
			teardown: clearHTML
		});

		QUnit.test("_build", function (assert) {
			var element = document.getElementById("scrollview-page-w"),
				scrollview;

			scrollview = new Scrollview();

			helpers.stub(ns.support.shape, "circle", function () {
				return true;
			});

			scrollview._build(element);

			assert.ok(element.classList.contains("ui-scroll-on"), "Scrollview has ui-scroll-on class.");
			assert.ok(document.querySelector(".ui-scroller"), "Scroller was found");

			helpers.restoreStub(ns.support.shape, "circle");
		});

	}
	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.wearable.Scrollview,
			window.helpers,
			tau);
	}
}());
