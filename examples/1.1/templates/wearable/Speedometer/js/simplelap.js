/*global tau, parseInt */
(function (window, setTimeout) {
	"use strict";

	var // simple lap page
		page = document.getElementById("simplelap"),
		// element of internal circle indicator
		elementInternal = page.querySelector(".internal"),
		// element of external circle indicator
		elementExternal = page.querySelector(".external"),
		// start button
		button = page.querySelector(".app-engine"),
		// widget instance of internal indicator
		speedometerInternal = null,
		// widget instance of external indicator
		speedometerExternal = null;

	/**
	 * On click event handler
	 */
	function onClick() {
		var // set starting value
			value = parseInt(Math.random() * 9, 10);

		// set init values of widgets
		speedometerInternal.value(value);
		speedometerExternal.value(value * 5);

		// set a some scenario of widget demonstration
		setTimeout(function () {
			value += 1;
			speedometerInternal.value(value);
			speedometerExternal.value(value * 5);
		}, 600);

		setTimeout(function () {
			value -= 1;
			speedometerInternal.value(value);
			speedometerExternal.value(value * 5);
		}, 1200);

		setTimeout(function () {
			value += 2;
			speedometerInternal.value(value);
			speedometerExternal.value(value * 5);
		}, 1800);

		setTimeout(function () {
			speedometerInternal.value(0);
			speedometerExternal.value(0);
		}, 2400);
	}

	/**
	 * Template initializing
	 */
	function init() {
		// create widgets instances
		speedometerInternal = tau.widget.CircleIndicator(elementInternal);
		speedometerExternal = tau.widget.CircleIndicator(elementExternal);
		// set initial values of widges
		speedometerInternal.value(0);
		speedometerExternal.value(0);
		// add action on a button click
		button.addEventListener("click", onClick, false);

		// cleanup widget in order to avoid memory leak
		tau.event.one(page, "pagehide", function () {
			button.removeEventListener("click", onClick, false);
			speedometerInternal.destroy();
			speedometerExternal.destroy();
		});

	}

	// init application
	page.addEventListener("pagebeforeshow", init, true);
})(window, window.setTimeout);
