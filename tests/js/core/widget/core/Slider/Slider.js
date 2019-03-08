/* global test, ok, equal, define, tau */
(function () {
	"use strict";
	function runTests(Slider, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/Slider/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/widget/core/Slider", {
			setup: initHTML
		});

		test("_setValue", 3, function () {
			var element = document.getElementById("normal"),
				widget = new Slider();

			widget._build(element);
			widget.element = element;

			//set Value for the slider with the expanded handler
			widget.options.expand = true;
			helpers.stub(widget, "_setNormalValue", function (value) {
				ok(true, "method: _setNormalValue was run");
			});
			helpers.stub(widget, "_updateSliderColors", function (value) {
				ok(true, "method: _updateSliderColors was run");
			});
			widget._setValue(7);
			helpers.restoreStub(widget, "_updateSliderColors");
			helpers.restoreStub(widget, "_setNormalValue");

			equal(widget._ui["handlerElement"].children[0].tagName.toLowerCase() , "span",
					"expander handler was inserted with the value");

		});

		test("_setSliderColors", 3, function () {
			var element = document.getElementById("normal"),
				widget = new Slider();

			widget._build(element);
			helpers.stub(widget, "_setValue", function (value) {
				ok(true, "method: _setValue was run");
			});
			widget._init(element);
			helpers.restoreStub(widget, "_setValue");

			widget._setSliderColors(4);
			ok(widget._ui.barElement.firstElementChild.style.background.indexOf("rgb") >= 0, "standard color is set");

			widget.options.warning = 1;
			widget._setSliderColors(4);
			ok(widget._ui.barElement.firstElementChild.style.background.indexOf("gradient"), "linear gradient is set");
		});

		test("setBackground", 4, function () {
			var element = document.getElementById("normal"),
				widget = new Slider();

			widget._build(element);
			helpers.stub(widget, "_setValue", function (value) {
				ok(true, "method: _setValue was run");
			});
			widget._init(element);
			helpers.restoreStub(widget, "_setValue");

			widget.options.warning = 1;
			widget._setSliderColors(4);

			ok(widget._ui.barElement.firstElementChild.style.background.indexOf("gradient"), "linear gradient is set");

			widget._setSliderColors(0);

			ok(widget._ui.barElement.firstElementChild.style.background.indexOf("rgb") >= 0, "background without gradient was set");

			ok(true, "Slider has ui-slider class");
		});

	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.core.Slider,
			window.helpers,
			tau);
	}

}());
