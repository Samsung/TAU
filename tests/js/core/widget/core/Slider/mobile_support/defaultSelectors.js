/*global module, test, ok, equal, tau, window */
(function (document) {
	"use strict";

	module("slider", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	test("Slider default selectors", function () {
		var slider = document.getElementById("mySlider1");

		equal(slider.getAttribute("data-tau-bound"), "Slider,SliderExtra");
		slider = document.getElementById("mySlider3");
		ok(slider.getAttribute("data-icon"));
		ok(slider.parentNode.classList.contains("ui-slider-with-icon"));
		ok(slider.parentNode.querySelector(".ui-slider-icon"));
		slider = document.getElementById("mySlider5");
		ok(slider.getAttribute("data-type"));
		ok(slider.getAttribute("data-text-left"));
		ok(slider.getAttribute("data-text-right"));
		ok(slider.parentNode.classList.contains("ui-slider-with-text-left"));
		ok(slider.parentNode.classList.contains("ui-slider-with-text-right"));
		ok(slider.parentNode.querySelector(".ui-slider-text-left"));
		ok(slider.parentNode.querySelector(".ui-slider-text-right"));
		ok(slider.parentNode.classList.contains("ui-slider-center"));
	});

}(window.document));