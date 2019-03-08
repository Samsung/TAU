/* global test, ok, equal, define, tau */
(function () {
	"use strict";
	function runTests(Popup, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/mobile/widget/mobile/Popup/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("mobile/widget/mobile/Popup", {
			setup: initHTML
		});

		test("_build", 6, function (assert) {

			var element = document.getElementById("popup1X"),
				element2 = document.getElementById("popup2"),
				widget = new Popup(),
				widget2;

			widget._build(element);

			assert.ok(element.classList.contains("ui-popup-activity"),
				"classes swap between divs is working fine");
			assert.ok(element.classList.contains("ui-popup-activity-small"),
				"classes swap between divs is working fine");
			assert.ok(!element.querySelector(
				".ui-popup-content").classList.contains("ui-popup-activity"),
				"classes swap between divs is working fine");
			assert.ok(!element.querySelector(
				".ui-popup-content").classList.contains("ui-popup-activity-small"),
				"classes swap between divs is working fine");

			equal(document.body.lastChild, element, "popup has been properly appended to the" +
				" document body");

			widget.close();

			helpers.stub(ns.widget.core.ContextPopup.prototype, "_build", function () {
				assert.ok(true, "core Popup module build method called");
			});
			widget2 = new Popup();
			helpers.stub(widget2._ui, "content", {
				classList: {
					contains: function () {
						return false;
					}
				}
			});
			//check if method build from core Popup is called inside build method
			//from mobile Popup
			widget2._build(element2);

			helpers.restoreStub(widget2._ui, "content");
			helpers.restoreStub(ns.widget.core.ContextPopup.prototype, "_build");
		});


		test("_show", 5, function (assert) {
			var widget = new Popup(),
				element = document.getElementById("popup1");

			widget.element = element;
			widget.options.positionTo = "";


			helpers.stub(widget.element, "querySelector", function () {
				assert.ok(true, "querySelector of element works");
				return {
					listviewElement: "abc" //returned so that the test can go into last if statement
				}
			});
			helpers.stub(ns.engine, "getBinding", function () {
				assert.ok(true, "getBinding works");

				return {
					option: function () { //object with function is returned here so the function can be tested
						assert.ok(true, "listview option was called");
					}
				}
			});

			widget._show();
			helpers.restoreStub(ns.engine, "getBinding");

			helpers.stub(ns.engine, "getBinding", function () { //stub of getBinding is used second time here to cover else if statement
				assert.ok(true, "getBinding works");
				return false;
			});
			widget._show();
			widget.options.positionTo = "window";
			widget._show();
			helpers.restoreStub(ns.engine, "getBinding");
			helpers.restoreStub(widget.element, "querySelector");


		});

	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.mobile.Popup,
			window.helpers,
			tau);
	}

}());
