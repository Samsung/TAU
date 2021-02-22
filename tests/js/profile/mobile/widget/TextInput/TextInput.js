/* global test, module, define, tau */
(function () {
	"use strict";
	function runTests(TextInput, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/mobile/widget/TextInput/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("profile/mobile/widget/TextInput", {
			setup: initHTML
		});

		test("constructor", 3, function (assert) {
			var element = document.getElementById("textinput1");

			helpers.checkWidgetBuild("TextInput", element, ns);

			assert.ok(element.classList.contains("ui-text-input"), "TextInput contains ui-text-input class.");
		});

		test("_resizeTextArea", 5, function (assert) {
			var widget = new TextInput(),
				element = document.getElementById("textinput1");

			element.style.height = "inherit";
			widget._resizeTextArea(element);
			assert.notEqual(element.style.height, "inherit", "TextInput's height has changed.");

			helpers.stub(ns.util.selectors, "getClosestByClass", function () {
				assert.ok(true, "Method: util.selectors.getClosestByClass was called.");
				return "mock";
			});

			helpers.stub(ns.engine, "getBinding", function () {
				assert.ok(true, "Method: ns.engine.getBinding was called.");
				return {
					refresh: function () {
						assert.ok(true, "Method: listview.refresh was called.");
					}
				};
			});

			widget._resizeTextArea(element);

			helpers.restoreStub(ns.util.selectors, "getClosestByClass");
			helpers.restoreStub(ns.engine, "getBinding");
		});

		test("_toggleClearButton", 3, function (assert) {
			var widget = new TextInput(),
				element = document.getElementById("textinput1"),
				clearBtn = document.createElement("div");

			widget.element = element;
			element.setAttribute("class", "");
			clearBtn.setAttribute("class", "");

			widget._toggleClearButton(clearBtn, element);

			assert.ok(clearBtn.classList.contains(TextInput.classes.uiTextInputClearHidden), "Clear button has uiTextInputClearHidden class.");

			widget._state.focused = true;

			widget._toggleClearButton(clearBtn, element);

			assert.equal(clearBtn.classList.contains(TextInput.classes.uiTextInputClearHidden), false, "Clear button doesn't have uiTextInputClearHidden.");
			assert.ok(element.classList.contains(TextInput.classes.uiTextInputClearActive), "Textinput has uiTextInputClearActive class.");
		});

		test("_onClearBtnClick", 4, function (assert) {
			var widget = new TextInput(),
				element = document.getElementById("textinput1");

			element.value = null;
			widget.element = element;

			helpers.stub(widget, "trigger", function (params) {
				assert.ok(true, "Widget.trigger was called.");
				assert.equal(params, "search", "Search parameter ");
			});

			helpers.stub(element, "focus", function () {
				assert.ok(true, "Focus method was called.");
			});

			widget._onClearBtnClick(widget);
			assert.strictEqual(element.value, "", "TextInput's value was cleared.");

			helpers.restoreStub(widget, "trigger");
			helpers.restoreStub(element, "focus");
		});

		test("_onClearBtnAnimationEnd", 2, function (assert) {
			var widget = new TextInput(),
				element = document.getElementById("textinput1"),
				stubTarget = document.createElement("div"),
				stubEvent;

			widget.element = element;
			element.value = "";

			stubEvent = {
				animationName: "btn_pressup_animation",
				target: stubTarget
			};

			assert.ok(!stubEvent.target.classList.contains(TextInput.classes.uiTextInputClearHidden), "TextInput doesn't have TextInputClearHidden class.");

			widget._onClearBtnAnimationEnd(widget, stubEvent);

			assert.ok(stubEvent.target.classList.contains(TextInput.classes.uiTextInputClearHidden), "Added TextInputClearHidden class to TextInput.");
		});

		test("_onFocus", 2, function (assert) {
			var widget = new TextInput(),
				element = document.getElementById("textinput1"),
				clearBtn = document.createElement("div");

			widget.element = element;
			element.value = "mock";

			widget._ui.textClearButtonElement = clearBtn;
			widget._ui.textClearButtonElement.classList.add(TextInput.classes.uiTextInputClearHidden);

			assert.ok(widget._ui.textClearButtonElement.classList.contains(TextInput.classes.uiTextInputClearHidden), "Clear button has uiTextInputClearHidden class.");

			widget._onFocus(widget);

			assert.ok(!widget._ui.textClearButtonElement.classList.contains(TextInput.classes.uiTextInputClearHidden), "Clear button doesn't have uiTextInputClearHidden class.");
		});

		test("_onInput", 3, function (assert) {
			var widget = new TextInput(),
				element = document.getElementById("textinput1"),
				clearBtn = document.createElement("div");

			widget.element = element;
			widget._ui.textClearButtonElement = clearBtn;
			element.value = "";

			element.classList.add(TextInput.classes.uiTextInputClearActive);

			assert.ok(element.classList.contains(TextInput.classes.uiTextInputClearActive), "TextInput has uiTextInputClearActive class.");

			widget._onInput(widget);

			assert.ok(!element.classList.contains(TextInput.classes.uiTextInputClearActive), "TextInput doesn't have uiTextInputClearActive class.");

			element.value = "mock";

			helpers.stub(widget, "_toggleClearButton", function () {
				assert.ok(true, "Method: toggleClearButton was called.");
			});

			widget._onInput(widget);

			helpers.restoreStub(widget, "_toggleClearButton");
		});

		test("_onBlur", 1, function (assert) {
			var widget = new TextInput(),
				element = document.getElementById("textinput1"),
				clearBtn = document.createElement("div");

			widget.element = element;
			widget._ui.textClearButtonElement = clearBtn;

			helpers.stub(widget, "_toggleClearButton", function () {
				assert.ok(true, "Method: toggleClearButton was called.");
			});

			widget._onBlur(widget);

			helpers.restoreStub(widget, "_toggleClearButton");
		});

		test("_createClearButton", 3, function (assert) {
			var widget = new TextInput(),
				element = document.getElementById("textinput1"),
				clearBtn = document.createElement("div"),
				parentNode = document.createElement("div"),
				header = "mock";

			parentNode.appendChild(element);
			widget.element = element;
			clearBtn.setAttribute("class", "");

			helpers.stub(document, "createElement", function () {
				assert.ok(true, "Method: document.createElement was called.");
				return clearBtn;
			});

			helpers.stub(element.parentNode, "appendChild", function () {
				assert.ok(true, "Method: element.parentNode.appendChild was called.");
			});

			widget._createClearButton(element, header);

			assert.ok(clearBtn.classList.contains(TextInput.classes.uiTextInputClearHidden), "Clear button has uiTextInputClearHidden class.");

			helpers.restoreStub(document, "createElement");
			helpers.restoreStub(element.parentNode, "appendChild");
		});

		test("_unbindEvents", 5, function (assert) {
			var widget = new TextInput(),
				clearBtn = document.createElement("div");

			widget._ui.textClearButtonElement = clearBtn;

			helpers.stub(ns.event, "off", function () {
				assert.ok(true, "Method: ns.event.off was called.");
			});

			widget._unbindEvents();

			helpers.restoreStub(ns.event, "off");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.mobile.TextInput,
			window.helpers,
			tau);
	}
}());
