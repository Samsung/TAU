/* global QUnit, Promise, define, tau */
(function () {
	"use strict";
	function runTests(TextEnveloper, helpers) {
		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/mobile/widget/TextEnveloper/test-data/sample.html"),
					parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML = HTML;
				helpers.loadTAUStyle(document, "mobile", function () {
					resolve();
				});
			});
		}

		QUnit.module("profile/mobile/widget/TextEnveloper", {
			setup: initHTML
		});

		QUnit.test("_build", 15, function (assert) {
			var widget = new TextEnveloper(),
				element = document.getElementById("enveloper"),
				// simple element is without label
				elementSimple = document.getElementById("enveloper-simple"),
				input;

			assert.equal(widget._build(element), element, "_built return element");

			input = element.children[1].children[0];

			assert.equal(element.className, "ui-text-enveloper ui-text-enveloper-container", "Element has proper class");
			assert.equal(element.firstElementChild.className, "ui-text-enveloper-start", "First child element has proper class");
			assert.equal(input.className, "ui-text-enveloper-input ui-text-input ui-text-input-empty", "Input element has proper class");
			assert.equal(input.dataset.tauName, "TextInput", "Input element is instance of TextInput");
			assert.equal(widget._ui.inputElement, input, "Insput is stored in _ui");
			assert.deepEqual(widget._ui.buttons, [], "Insput is stored in _ui");

			assert.equal(element.querySelector(".ui-text-input-textline"), null, "Element hasn't line on TextInput");

			assert.equal(widget._build(elementSimple), elementSimple, "_built return element");

			// label is missing, first element is input
			input = elementSimple.children[0].children[0];

			assert.equal(element.className, "ui-text-enveloper ui-text-enveloper-container", "Element has proper class");
			assert.equal(input.className, "ui-text-enveloper-input ui-text-input ui-text-input-empty", "Input element has proper class");
			assert.equal(input.dataset.tauName, "TextInput", "Input element is instance of TextInput");
			assert.equal(widget._ui.inputElement, input, "Insput is stored in _ui");
			assert.deepEqual(widget._ui.buttons, [], "Insput is stored in _ui");

			assert.equal(element.querySelector(".ui-text-input-textline"), null, "Element hasn't line on TextInput");

		});

		QUnit.test("_onFocus", 1, function (assert) {
			var widget = new TextEnveloper();

			helpers.stub(widget, "expandButtons", function () {
				assert.ok(true, "method: expandButtons was called sucessfully");
			});
			widget._onFocus();
			helpers.restoreStub(widget, "trigger");
		});

		QUnit.test("_onBlur", 1, function (assert) {
			var widget = new TextEnveloper();

			helpers.stub(widget, "foldButtons", function () {
				assert.ok(true, "method: expandButtons was called sucessfully");
			});
			widget._onBlur();
			helpers.restoreStub(widget, "foldButtons");
		});

		QUnit.test("foldButtons", 3, function (assert) {
			var length = 0,
				widget = new TextEnveloper(),
				element = document.getElementById("enveloper");

			widget._build(element);
			widget._isBlurred = false;
			widget.element = element;

			widget.add("Sunder Mohan");
			widget.add("Marry");
			widget.add("Sunde");

			widget.foldButtons(widget);

			assert.equal(widget._isBlurred, true, "widget is blurred and buttons hidden");
			length = widget._ui.buttons.length;

			assert.equal(element.querySelectorAll(".ui-text-enveloper-btn-blur").length, 3,
				"there are three buttons with ui-text-enveloper-btn-blur class");

			assert.ok(widget._ui.buttons[3].childNodes[1].classList.contains("ui-text-enveloper-btn-separator"),
				"first button was moved to the last position and span element was added");

		});

		QUnit.test("_onKeyup", 2, function (assert) {
			var widget = new TextEnveloper(),
				event = {keyCode: 8},
				element = document.getElementById("enveloper");

			widget._build(element);
			widget.element = element;

			helpers.stub(widget, "trigger", function (eventType) {
				assert.ok(true, "onKeyUp run trigger sucessfully");
				assert.ok(eventType === "resize", "onKeyUp run trigger sucessfully");
			});
			widget._onKeyup(event);
			helpers.restoreStub(widget, "trigger");
		});

		function ButtonMock(className, text) {
			var self = this;

			self.className = className;
			self.textContent = text;

			self.classList = {
				contains: function (className) {
					return self.className === className;
				}
			}
		}

		QUnit.test("_setSelectedItems", 5, function (assert) {
			var widget = new TextEnveloper(),
				element = document.getElementById("enveloper"),
				calledTrue = 0,
				calledFalse = 0,
				toggleClass = function (className, state) {
					assert.equal(className, TextEnveloper.classes.TEXT_ENVELOPER_BTN_SELECTED,
						"Correct added class");
					if (state) {
						calledTrue++;
					} else {
						calledFalse++;
					}
				};

			widget._ui.buttons = [{
				classList: {
					toggle: toggleClass
				}
			}, {
				classList: {
					toggle: toggleClass
				}
			}, {
				classList: {
					toggle: toggleClass
				}
			}];
			widget._setSelectedItems(element, [0, 2]);
			assert.equal(calledTrue, 2, "2 items are selected");
			assert.equal(calledFalse, 1, "1 item is not selected");
		});

		QUnit.test("_getSelectedItems", 1, function (assert) {
			var widget = new TextEnveloper(),
				SELECTED_CLASS = TextEnveloper.classes.TEXT_ENVELOPER_BTN_SELECTED;

			widget._ui.buttons = [
				new ButtonMock(SELECTED_CLASS, "a"),
				new ButtonMock("", "b"),
				new ButtonMock(SELECTED_CLASS, "c")
			];
			assert.deepEqual(widget._getSelectedItems(), [
				{
					"index": 0,
					"value": "a"
				},
				{
					"index": 2,
					"value": "c"
				}
			], "Get selected return correct array");
		});

		QUnit.test("_setItems", 2, function (assert) {
			var widget = new TextEnveloper(),
				element = document.getElementById("enveloper"),
				addCount = 0,
				removeCount = 0;

			widget._ui.buttons = [0, 1, 2];
			widget.remove = function () {
				removeCount++;
			};
			widget.add = function () {
				addCount++;
			};
			widget._setItems(element, ["a", "b"]);
			assert.equal(removeCount, 3, "Remove method was called 3 times");
			assert.equal(addCount, 2, "Add method was called 2 times");
		});

		QUnit.test("_getItems", 1, function (assert) {
			var widget = new TextEnveloper();

			widget._ui.buttons = [
				new ButtonMock("", "a"),
				new ButtonMock("", "b"),
				new ButtonMock("", "c")
			];
			assert.deepEqual(widget._getItems(), [
				"a", "b", "c"
			], "Get items return correct array");
		});

		QUnit.test("_destroy", 1, function (assert) {
			var widget = new TextEnveloper(),
				element = document.getElementById("enveloper-destroy"),
				elementOuterHMTL = element.outerHTML;

			widget.element = element;
			widget._build(element);
			widget._init(element);
			widget._destroy();
			assert.equal(element.outerHTML, elementOuterHMTL, "Destroy revert all changes from _build" +
				" and _init");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.mobile.TextEnveloper,
			window.helpers);
	}
}());
