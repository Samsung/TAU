/*global tau*/
(function (window, setTimeout) {
	"use strict";

	var // speedometer page
		page = document.getElementById("car"),
		// element of circle indicator
		element = page.querySelector(".ui-circleindicator"),
		// start button
		button = page.querySelector(".app-engine"),
		// info message
		textMessage = page.querySelector(".app-content > p"),
		// instance of widget
		speedometer = null;

	/**
	 * Method check current value and changes info text
	 * @param value {number}
	 */
	function checkValue(value) {
		if (value > 120) {
			textMessage.innerHTML = "overspeeding";
			textMessage.style.color = "red";
		} else {
			textMessage.innerHTML = "Need for speed?";
			textMessage.style.color = "white";
		}
	}

	/**
	 * On click event handler
	 */
	function onClick() {
		var value = parseInt(Math.random() * 70, 10);

		speedometer.value(value);

		setTimeout(function () {
			value += 60;
			speedometer.value(value);
			checkValue(value);
		}, 600);

		setTimeout(function () {
			value += 30;
			speedometer.value(value);
			checkValue(value);
		}, 1200);

		setTimeout(function () {
			value -= 60;
			speedometer.value(value);
			checkValue(value);
		}, 1800);

		setTimeout(function () {
			value += 50;
			speedometer.value(value);
			checkValue(value);
		}, 2400);

		setTimeout(function () {
			value -= 50;
			speedometer.value(value);
			checkValue(value);
		}, 3000);

		setTimeout(function () {
			speedometer.value(0);
			textMessage.innerHTML = "Need for speed?";
			textMessage.style.color = "white";
			textMessage.style.backgroundColor = "";
		}, 3400);
	}

	/**
	 * Template initializing
	 */
	function init() {
		// create speedometer widget
		speedometer = tau.widget.CircleIndicator(element);
		speedometer.value(0);
		// add action on a button click
		button.addEventListener("click", onClick, false);

		// cleanup widget in order to avoid memory leak
		tau.event.one(page, "pagehide", function () {
			// remove action from button
			button.removeEventListener("click", onClick, false);
			// destroy widget
			speedometer.destroy();
		});
	}

	// init application
	page.addEventListener("pagebeforeshow", init, true);
})(window, window.setTimeout);
