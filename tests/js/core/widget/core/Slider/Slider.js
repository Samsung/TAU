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

		test("_setValue", 1, function () {
			var element = document.getElementById("normal"),
				widget = new Slider();

			widget._build(element);
			widget.element = element;

			//set Value for the slider with the expanded handler
			widget.options.expand = true;
			helpers.stub(widget, "_setNormalValue", function () {
				ok(true, "method: _setNormalValue was run");
			});

			widget._setValue(7);

			helpers.restoreStub(widget, "_setNormalValue");
		});

		test("Slider getContainer method", 4, function () {
			var input = document.getElementById("normal"),
				slider = new tau.widget.Slider(input, {type: "normal"}),
				sliderContainer;

			sliderContainer = slider.getContainer();

			ok(sliderContainer instanceof HTMLElement, "Slider.getContainer returns HTMLElement");
			equal(sliderContainer.tagName, "DIV", "Container is div element");
			ok(sliderContainer !== input, "Container element is different than original input element");
			ok(sliderContainer.classList.contains("ui-slider"), "Slider container has ui-slider class");
		});

		test("value method of Slider", 5, function () {
			var input = document.getElementById("normal"),
				slider = new tau.widget.Slider(input);

			equal(slider.value(), 5, "slider value check");
			slider.value(7);
			equal(slider.value(), 7, "slider value check");
			slider.value(10);
			equal(slider.value(), 10, "slider value check");
			slider.value(15);
			equal(slider.value(), 10, "slider value(with over-value) check");
			slider.value(-2);
			equal(slider.value(), 0, "slider value(with over-value) check");
		});

		test("Check if styles defined on base element will be moved to container", 3, function () {
			var element = document.getElementById("slider-with-additional-styles"),
				slider = tau.widget.Slider(element),
				container = slider.getContainer();

			equal(container.style.width, "150px", "Check if container width style has been set");

			slider.destroy();

			equal(element.style.width, "150px", "Check if style has been saved after calling destroy");

			equal(element.hasAttribute("data-original-style"), false, "Check if original-style attribute has been removed")
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
