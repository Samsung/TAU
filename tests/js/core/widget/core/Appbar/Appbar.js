/* global test, define, tau */
(function () {
	"use strict";
	function runTests(Appbar, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/Appbar/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/widget/core/Appbar", {
			setup: initHTML
		});

		test("constructor", 2, function () {
			var element = document.getElementById("appbar-1");

			helpers.checkWidgetBuild("Appbar", element, ns);
		});


		test("Test of _init appbar", 5, function (assert) {
			var widget = new Appbar(),
				element = document.getElementById("appbar-1");

			helpers.stub(widget, "_initExpandedContainer", function (param) {
				assert.ok(true, "_initExpandedContainer");
				assert.equal(param, element, "_initExpandedContainer: element is given");
				return false;
			});

			helpers.stub(widget, "_setAnimation", function () {
				assert.ok(true, "_setAnimation has been called");
			});

			helpers.stub(widget, "_validateExpanding", function () {
				assert.ok(true, "_validateExpanding has been called");
			});

			widget._init(element);

			assert.equal(widget._appbarState, "COLLAPSED", "_init: _appbarState is 'COLLAPSED'");
		});

		test("Test of handleEvent appbar", 16, function (assert) {
			var widget = new Appbar(),
				testEvent = {
					type: ""
				};

			helpers.stub(widget, "_onScrollBoundary", function (event) {
				assert.ok(true, "_onScrollBoundary has been called");
				assert.equal(event, testEvent, "_onScrollBoundary: event has been provided");
			});

			helpers.stub(widget, "_onDrag", function (event) {
				assert.ok(true, "_onDrag has been called");
				assert.equal(event, testEvent, "_onDrag: event has been provided");
			});

			helpers.stub(widget, "_onDragStart", function (event) {
				assert.ok(true, "_onDragStart has been called");
				assert.equal(event, testEvent, "_onDragStart: event has been provided");
			});

			helpers.stub(widget, "_onDragEnd", function (event) {
				assert.ok(true, "_onDragEnd has been called");
				assert.equal(event, testEvent, "_onDragEnd: event has been provided");
			});

			helpers.stub(widget, "_onScrollStart", function (event) {
				assert.ok(true, "_onScrollStart has been called");
				assert.equal(event, testEvent, "_onScrollStart: event has been provided");
			});

			helpers.stub(widget, "_onChange", function (event) {
				assert.ok(true, "_onChange has been called");
				assert.equal(event, testEvent, "_onChange: event has been provided");
			});

			helpers.stub(widget, "_onPageBeforeShow", function () {
				assert.ok(true, "_onPageBeforeShow has been called");
			});

			helpers.stub(widget, "_onPopupShow", function () {
				assert.ok(true, "_onPopupShow has been called");
			});

			helpers.stub(widget, "_onPopupHide", function () {
				assert.ok(true, "_onPopupHide has been called");
			});

			helpers.stub(widget, "_onResize", function () {
				assert.ok(true, "_onResize has been called");
			});

			testEvent.type = "scrollboundary";
			widget.handleEvent(testEvent);

			testEvent.type = "drag";
			widget.handleEvent(testEvent);

			testEvent.type = "dragstart";
			widget.handleEvent(testEvent);

			testEvent.type = "dragend";
			widget.handleEvent(testEvent);

			testEvent.type = "scrollstart";
			widget.handleEvent(testEvent);

			testEvent.type = "change";
			widget.handleEvent(testEvent);

			testEvent.type = "pagebeforeshow";
			widget.handleEvent(testEvent);

			testEvent.type = "popupshow";
			widget.handleEvent(testEvent);

			testEvent.type = "popuphide";
			widget.handleEvent(testEvent);

			testEvent.type = "resize";
			widget.handleEvent(testEvent);
		});

		test("Test of _onDrag appbar", 2, function (assert) {
			var widget = new Appbar(),
				element = document.getElementById("appbar-1"),
				testEvent = {
					detail: {
						deltaY: 20
					}
				};

			widget.element = element;
			widget._dragStartingHeight = 80;
			widget._lockExpanding = false;
			widget._appbarState = "DRAGGING";
			widget._currentHeight = 80;
			widget._expandedHeight = 100;

			helpers.stub(widget, "_setTitlesOpacity", function () {
				assert.ok(true, "_setTitlesOpacity has been called");
			});

			widget._onDrag(testEvent);

			assert.equal(widget.element.style.height, "100px", "_onDrag: element height has been changed");
		});

		test("Test of _onDragStart appbar", 4, function (assert) {
			var widget = new Appbar(),
				element = document.getElementById("appbar-1"),
				testEvent = {
					detail: {
						direction: "down",
						deltaY: 20
					}
				};

			widget.element = element;
			widget.options.expandingEnabled = true;
			widget._dragStartingHeight = 80;
			widget._lockExpanding = false;
			widget._appbarState = "COLLAPSED";
			self._scrolledToTop = true;
			widget._currentHeight = 80;
			widget._expandedHeight = 100;
			element.style.height = "100px";
			widget._ui = {
				expandedTitleContainer: {
					children: [{
						offsetHeight: 100
					}, {
						offsetHeight: 100
					}]
				}
			}

			widget._onDragStart(testEvent);

			assert.equal(widget._appbarState, "DRAGGING", "_appbar state is set to dragging");
			assert.ok(widget.element.classList.contains("ui-appbar-dragging"), "element contains dragging class");
			assert.equal(widget._dragStartingHeight, 100, "dragStartingHeight has correct value");
			assert.equal(widget._expandedTitleHeight, 200, "_expandedTitleHeight has been calculated correctly");
		});

		test("Test of collapse appbar", 6, function (assert) {
			var widget = new Appbar(),
				element = document.getElementById("appbar-1");

			widget.element = element;
			widget._appbarState = "";

			helpers.stub(widget, "_setTitlesOpacity", function (value) {
				assert.ok(true, "_setTitlesOpacity has been called");
				assert.equal(value, 0, "Oppacity of expanded title is set to 0");
			});

			widget.collapse();

			assert.equal(widget.element.style.height, "56px", "collapse: element height has been changed");
			assert.equal(widget._currentHeight, 0, "_currentHeight equals 0");
			assert.ok(!widget.element.classList.contains("ui-appbar-expanded"), "element doesn't contain expanded class");
			assert.equal(widget._appbarState, "COLLAPSED", "_appbar state is collapsed");
		});

		test("Test of expand appbar", 5, function (assert) {
			var widget = new Appbar(),
				element = document.getElementById("appbar-1");

			widget.element = element;
			widget._appbarState = "";

			helpers.stub(widget, "_setTitlesOpacity", function (value) {
				assert.ok(true, "_setTitlesOpacity has been called");
				assert.equal(value, 1, "Oppacity of expanded title is set to 1");
			});

			widget.expand();

			assert.notEqual(widget.element.style.height, "56px", "expand: element height has been changed");
			assert.ok(widget.element.classList.contains("ui-appbar-expanded"), "element contains expanded class");
			assert.equal(widget._appbarState, "EXPANDED", "_appbar state is expanded");
		});

	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.core.Appbar,
			window.helpers,
			tau);
	}

}());
