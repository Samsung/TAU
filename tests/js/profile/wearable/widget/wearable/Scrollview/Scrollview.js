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

		QUnit.test("_init", 4, function (assert) {
			var element = document.getElementById("scrollview-page-w"),
				scrollview = new Scrollview();

			helpers.stub(scrollview, "_setBouncingEffect", function () {
				assert.ok(true, "_setBouncingEffect should be called");
			});

			scrollview.element = element;
			scrollview._init();

			assert.equal(scrollview.maxScrollX, 0, "maxScrollX is 0");
			assert.equal(scrollview.maxScrollY, 0, "maxScrollY is 0");
			assert.notEqual(scrollview.bouncingEffect, undefined, "bouncing effect is created");

			helpers.restoreStub(scrollview, "_setBouncingEffect");
		});

		QUnit.test("_start & _end", 6, function (assert) {
			var element = document.getElementById("scrollview-page-w"),
				scrollview = new Scrollview();

			helpers.stub(scrollview, "_setBouncingEffect", function () {
				assert.ok(true, "_setBouncingEffect should be called");
			});

			scrollview.element = element;
			scrollview._build(element);
			scrollview._init();

			scrollview._start();

			assert.equal(scrollview.scrolled, false, "scrolled is false");
			assert.equal(scrollview.dragging, true, "dragging is true");
			assert.equal(scrollview.scrollCanceled, false, "scrollCanceled is false");

			helpers.stub(scrollview.bouncingEffect, "dragEnd", function () {
				assert.ok(true, "dragEnd should be called");
			});

			scrollview._end();

			assert.equal(scrollview.dragging, false, "dragging is false");

			helpers.restoreStub(scrollview.bouncingEffect, "dragEnd");
			helpers.restoreStub(scrollview, "_setBouncingEffect");
		});

		QUnit.test("showBouncingEffect & hideBouncingEffect", 4, function (assert) {
			var scrollview = new Scrollview();

			scrollview.bouncingEffect = {
				drag: function (x, y) {
					assert.ok(true, "drag should be called");
					assert.equal(x, 0, "x is 0");
					assert.equal(y, 0, "y is 0");
				},
				dragEnd: function () {
					assert.ok(true, "dragEnd should be called");
				}
			}

			scrollview.showBouncingEffect();
			scrollview.hideBouncingEffect();

			helpers.restoreStub(scrollview.bouncingEffect, "dragEnd");
			helpers.restoreStub(scrollview, "_setBouncingEffect");
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
