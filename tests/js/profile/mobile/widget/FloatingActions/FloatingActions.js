/* global test, module, define, tau */
(function () {
	"use strict";
	function runTests(FloatingActions, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/mobile/widget/FloatingActions/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("profile/mobile/widget/FloatingActions", {
			setup: initHTML
		});

		test("constructor", 6, function (assert) {
			var widget = new FloatingActions(),
				element = document.getElementById("floatingactions");

			assert.equal(widget.element, null, "Property element is set to null.");
			assert.equal(widget._style, null, "Property _style is set to null.");
			assert.equal(widget._startX, 0, "Property _startX is set to 0.");
			assert.equal(widget._currentX, 0, "Property _currentX is set to 0.");
			assert.ok(widget._hasSingle, "Property _hasSingle is set to true;");

			assert.ok(element.classList.contains(FloatingActions.classes.WIDGET), "FloatingActions contains ui-floatingactions class.");
		});

		test("_init", 1, function (assert) {
			var widget = new FloatingActions(),
				element = document.getElementById("floatingactions");

			widget.element = element;

			helpers.stub(widget, "_toggleParentClasses", function () {
				assert.ok(true, "Method: widget._toggleParentClasses was called");
			});

			widget._init(element);

			helpers.restoreStub(widget, "_toggleParentClasses");
		});

		test("_destroy", 2, function (assert) {
			var widget = new FloatingActions(),
				element = document.getElementById("floatingactions");

			widget.element = element;

			helpers.stub(widget, "isBound", function () {
				assert.ok(true, "Method: widget.isBound was called");
				return true;
			});

			helpers.stub(widget, "_toggleParentClasses", function () {
				assert.ok(true, "Method: widget._toggleParentClasses was called");
			});

			widget._destroy();

			helpers.restoreStub(widget, "_toggleParentClasses");
			helpers.restoreStub(widget, "isBound");
		});

		test("_toggleParentClasses", 2, function (assert) {
			var widget = new FloatingActions(),
				element = document.getElementById("floatingactions"),
				parentElement = document.createElement("div"),
				remove;

			widget.element = element;

			helpers.stub(ns.util.selectors, "getClosestByClass", function () {
				assert.ok(true, "Method: selectorUtils.getClosestByClass was called");
				return parentElement;
			});

			parentElement.classList.add(FloatingActions.classes.PAGE_WITH_FLOATING_ACTIONS);

			remove = true;
			widget._toggleParentClasses(remove);

			assert.ok(!parentElement.classList.contains(FloatingActions.classes.PAGE_WITH_FLOATING_ACTIONS), "Class PAGE_WITH_FLOATING_ACTIONS was removed.");

			helpers.restoreStub(ns.util.selectors, "getClosestByClass");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.mobile.FloatingActions,
			window.helpers,
			tau);
	}
}());
