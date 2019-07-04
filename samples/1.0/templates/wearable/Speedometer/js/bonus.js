/*global tau*/
(function (window) {
	"use strict";

	var // bonus page
		page = document.getElementById("bonus"),
		// element of circle indicator
		element = page.querySelector(".ui-circleindicator"),
		// start button
		button = page.querySelector(".app-engine"),
		// cache for circle indicator widget
		speedometer = null,
		// current value
		value = 0;

	// when a user click a button then widget value will be increased
	function onClick() {
		// increase widget value
		speedometer.value(value++);
		// decrease widget value after 1200ms
		window.setTimeout(function () {
			if (speedometer) {
				speedometer.value(value--);
			}
		}, 1200);
	}

	/**
	 * Template initializing
	 */
	function init() {
		// create speedometer widget
		speedometer = tau.widget.CircleIndicator(element);
		// set widget value
		speedometer.value(0);
		// add action on a button click
		button.addEventListener("click", onClick, false);

		// destroy widget on page hide
		tau.event.one(page, "pagehide", function () {
			// remove action from button
			button.removeEventListener("click", onClick, false);
			// destroy widget
			speedometer.destroy();
			// clear widget instance
			speedometer = null;
		});
	}

	// init application
	page.addEventListener("pagebeforeshow", init, true);
})(window);
