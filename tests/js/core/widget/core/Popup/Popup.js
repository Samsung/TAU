/* global test, ok, equal, define, tau */
(function () {
	"use strict";
	function runTests(Popup, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/Popup/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/widget/core/Popup", {
			setup: initHTML
		});

		test("constructor", 3, function (assert) {
			var element = document.getElementById("popup1");

			helpers.checkWidgetBuild("Popup", element, ns);

			assert.ok(element.classList.contains("ui-popup"), "Popup has ui-popup class");
		});


		test("Test of _init popup", 1, function(assert) {
				var widget = new Popup(),
					element = document.getElementById("popup1"),
					ui = widget._ui;

				ui.header = 1;
				ui.footer = 1;
				ui.content = 1;
				ui.wrapper = 1;
				ui.container = 1;
				widget.element = element;
				widget.element.classList.add("ui-popup-toast");
				widget._init();
				assert.equal(widget.options.closeAfter, 2000, "clearAfter set properly");

		});

		asyncTest("Test of open/close popup", function () {
			var widget = new Popup(),
				element = document.getElementById("popup1"),
				objectUtils = ns.util.object,
				engine = ns.engine.getRouter();

			element.classList.add("ui-popup-toast");
			widget.element = element;

			expect(13);

			helpers.stub(widget, "_isActive", function () {
				ok(true, "Popup is active");
				return false;
			});

			helpers.stub(widget, "_storeOpenOptions", function () {
				ok(true, "Options are stored");
			});

			helpers.stub(engine, "lock", function(){
				ok(true, "Lock works");
			});

			helpers.stub(objectUtils, "merge", function () {
				ok(true, "objectUtils is not null");
				return {
					dismissible: false,
					transition: "",
					closeAfter: 3000
				};
			});
			helpers.stub(widget, "_show", function (newOptions) {
				ok(true, "Show works");
				equal(newOptions.transition, "fade", "Transition is fade");
			});




			helpers.stub(widget, "close", function() {
				start();
				ok(true, "close was called");
			});

			widget.open();

			widget.element.classList.remove("ui-popup-toast");
			helpers.restoreStub(widget, "close");
			helpers.restoreStub(widget, "_show");
			helpers.stub(widget, "_show", function () {
				ok(true, "Show works");
			});

			widget.open();

			helpers.restoreStub(widget, "_isActive");

			helpers.stub(widget, "_isActive", function () {
				ok(true, "Popup is active");
				return true;
			});

			widget.open();



			helpers.restoreStub(objectUtils, "merge");
			helpers.restoreStub(widget, "_isActive");
			helpers.restoreStub(widget, "_storeOpenOptions");
			helpers.restoreStub(engine, "lock");



		});



	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.core.Popup,
			window.helpers,
			tau);
	}

}());
