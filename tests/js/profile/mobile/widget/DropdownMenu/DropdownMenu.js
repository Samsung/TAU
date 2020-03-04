/* global test, module, define, tau */
(function () {
	"use strict";
	function runTests(DropdownMenu, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			var parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = helpers.loadHTMLFromFile(
				"/base/tests/js/profile/mobile/widget/DropdownMenu/test-data/sample.html");
		}

		module("profile/mobile/widget/DropdownMenu", {
			setup: initHTML
		});

		test("constructor", 2, function () {
			var element = document.getElementById("select");

			helpers.checkWidgetBuild("DropdownMenu", element, ns);
		});

		test("_build", 3, function (assert) {
			var widget = new DropdownMenu(),
				element = document.getElementById("select");

			widget._generate = function (_element, construct) {
				assert.equal(_element, element, "First argument is element");
				assert.equal(construct, true, "Second argument is true");
				return _element;
			};
			assert.equal(widget._build(element), element, "_build return element");
		});

		test("_setInline(true)", 3, function (assert) {
			var widget = new DropdownMenu(),
				element = document.getElementById("select");

			widget._ui = {
				elSelectWrapper: {
					classList: {
						toggle: function (className) {
							assert.equal(className, "ui-dropdownmenu-inline", "class ui-dropdownmenu-inline is" +
								" added");
						}
					}
				},
				elPlaceHolder: {
					removeAttribute: function (styleName) {
						assert.equal(styleName, "style", "style is reset");
					}
				}
			};
			widget._setInline(element, true);
			assert.equal(widget.options.inline, true, "options.inline is set correctly");
		});

		test("_setInline(false)", 2, function (assert) {
			var widget = new DropdownMenu(),
				element = document.getElementById("select");

			widget._ui = {
				elSelectWrapper: {
					classList: {
						toggle: function (className) {
							assert.equal(className, "ui-dropdownmenu-inline", "class ui-dropdownmenu-inline is" +
							" removed");
						}
					}
				}
			};
			widget._setInline(element, false);
			assert.equal(widget.options.inline, false, "options.inline is set correctly");
		});

		test("_setNativeMenu(true)", 3, function (assert) {
			var widget = new DropdownMenu(),
				element = document.getElementById("select-in-page");

			widget._ui = {
				elSelectWrapper: {
					classList: {
						add: function (className) {
							assert.equal(className, "ui-dropdownmenu-native", "class ui-dropdownmenu-inline is" +
							" added");
						}
					}
				}
			};
			widget._setNativeMenu(element, true);
			assert.equal(widget._ui.elOptions.length, element.querySelectorAll("option").length, "optionElements" +
				" is set correctly");
			assert.equal(widget.options.nativeMenu, true, "options.nativeMenu is set correctly");
		});

		test("_setNativeMenu(false)", 7, function (assert) {
			var widget = new DropdownMenu(),
				element = document.getElementById("select-in-page");

			widget._buildFilter = function (_element, _elementId) {
				assert.equal(_element, element, "First argument is element");
				assert.equal(_elementId, element.id, "Second argument is element.id");
			};
			widget._constructOption = function () {
				assert.ok(1);
			};
			widget._selectedIndex = 0;
			widget._ui = {
				elOptionContainer: {
					items: [{
						classList: {
							add: function (className) {
								assert.equal(className, "ui-dropdownmenu-selected", "class ui-dropdownmenu-inline" +
									" is set correctly");
							}
						}
					}],
					querySelectorAll: function (selector) {
						assert.equal(selector, "li[data-value]", "selector is correct");
						return this.items;
					}
				}
			};
			widget._setNativeMenu(element, false);
			assert.equal(widget._ui.elOptions.length, 1, "optionElements has correct length");
			assert.equal(widget.options.nativeMenu, false, "options.nativeMenu is set correctly");
		});

		test("_buildFilter", 4, function (assert) {
			var widget = new DropdownMenu(),
				element = document.getElementById("select");

			widget._ui.page = {
				appendChild: function (childElement) {
					assert.ok(childElement instanceof DocumentFragment, "append document fragment");
				}
			};
			widget._buildFilter(element, "id");
			assert.equal(widget._ui.elOptionContainer.outerHTML, "<ul class=\"ui-dropdownmenu-options\"" +
				" id=\"id-options\"></ul>", "elOptionContainer has correct HTML");
			assert.equal(widget._ui.elOptionWrapper.outerHTML,
				"<div class=\"ui-dropdownmenu-options-wrapper\" id=\"id-options-wrapper\">" +
				"<ul class=\"ui-dropdownmenu-options\" id=\"id-options\"></ul></div>", "elOptionWrapper" +
				" has correct HTML");
			assert.equal(widget._ui.screenFilter.outerHTML,
				"<div class=\"ui-dropdownmenu-overlay ui-dropdownmenu-overlay-hidden\"" +
				" id=\"id-overlay\"></div>", "screenFilter has correct HTML");
		});

		test("_buildPlaceholder", 1, function (assert) {
			var widget = new DropdownMenu(),
				element = document.getElementById("select");

			widget._buildPlaceholder(element, element.parentElement, "id", "text");
			assert.equal(widget._ui.elPlaceHolder.outerHTML, "<span id=\"id-placeholder\" " +
				"class=\"ui-dropdownmenu-placeholder\">text</span>", "elPlaceHolder has correct HTML");
		});

		test("_buildWrapper", 3, function (assert) {
			var widget = new DropdownMenu(),
				element = document.getElementById("select");

			widget._buildWrapper(element);
			assert.equal(widget._ui.elSelectWrapper.tagName, "DIV", "elSelectWrapper is DIV");
			assert.ok(widget._ui.elSelectWrapper.hasAttribute("data-tau-wrapper"), "elSelectWrapper has wrapper attribute");
			assert.ok(widget._ui.elSelectWrapper.querySelector("select") === element, "elSelectWrapper contains select");
		});

		test("_generate", 15, function (assert) {
			var widget = new DropdownMenu(),
				element = document.getElementById("select-in-page");

			widget._buildWrapper = function (_element) {
				assert.equal(_element, element, "first argument is element (_buildWrapper)");
				widget._ui.elSelectWrapper = "wrapper";
			};
			widget._buildPlaceholder = function (_element, _wrapper, id, text) {
				assert.equal(element, _element, "first argument is wrapper");
				assert.equal(_wrapper, "wrapper", "second argument is wrapper");
				assert.equal(id, "select-in-page", "third argument is select-in-page");
				assert.equal(text, "c", "fourth argument is c");
			};
			widget._setNativeMenu = function (_element, value) {
				assert.equal(_element, element, "first argument is element (_setNativeMenu)");
				assert.equal(value, true, "second argument is true");
			};
			widget._setInline = function (_element, value) {
				assert.equal(_element, element, "first argument is element (_setInline)");
				assert.equal(value, false, "second argument is false");
			};
			assert.equal(widget._generate(element, true), element, "_generate return element");
			assert.equal(widget._ui.elSelect, element, "elSelect is element");
			assert.equal(widget._ui.page, element.parentElement.parentElement, "page is correct found");
			assert.equal(widget._ui.content, element.parentElement, "content is correct found");
			assert.equal(widget._ui.elDefaultOption, element.children[2], "elDefaultOption is correct" +
				" initialized");
			assert.equal(widget._selectedIndex, 1, "_selectedIndex is correct initialized");
		});

		test("_convertOptionToHTML", 6, function (assert) {
			var widget = new DropdownMenu(),
				option = document.getElementById("select-in-page").firstElementChild,
				option2 = option.nextElementSibling,
				option3 = option2.nextElementSibling;

			assert.equal(widget._convertOptionToHTML(true, option, true),
				"<li data-value='a' class='a ui-dropdownmenu-disabled'>a</li>", "_convertOptionToHTML" +
				" return correct value (1)");
			assert.equal(widget._convertOptionToHTML(false, option, true),
				"<li data-value='a' class='a ui-dropdownmenu-disabled'>a</li>", "_convertOptionToHTML" +
				" return correct value (2)");
			assert.equal(widget._convertOptionToHTML(true, option, false),
				"<li data-value='a' class='a' tabindex='0'>a</li>", "_convertOptionToHTML" +
				" return correct value (3)");
			assert.equal(widget._convertOptionToHTML(false, option, false),
				"<li data-value='a' class='a' tabindex='0'>a</li>", "_convertOptionToHTML" +
				" return correct value (4)");
			assert.equal(widget._convertOptionToHTML(true, option2, false),
				"<li data-value='b' tabindex='0'>b</li>", "_convertOptionToHTML" +
				" return correct value (5)");
			assert.equal(widget._convertOptionToHTML(true, option3, false),
				"", "");
		});

		test("_constructOption", 16, function (assert) {
			var widget = new DropdownMenu(),
				element = document.getElementById("select-in-page"),
				i = 0;

			widget._convertOptionToHTML = function (hidePlaceholderMenuItems, option, isDisabled) {
				assert.equal(hidePlaceholderMenuItems, true, "first argument is true");
				assert.equal(option.tagName, "OPTION", "second argument is option element");
				assert.equal(isDisabled, false, "third argument is false");
				return i++;
			};
			widget._ui = {
				elSelect: element
			};
			assert.equal(widget._constructOption(), "012<li class='ui-dropdownmenu-optiongroup'>d</li>34",
				"_constructOption return correct string");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.mobile.DropdownMenu,
			window.helpers,
			tau);
	}
}());
