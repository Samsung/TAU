(function (window) {
	"use strict";

	var page = document.getElementById("no-loop-spin-page"),
		descriptions = document.getElementById("descriptions"),
		content = page.querySelector(".ui-content"),
		element = page.querySelector(".ui-spin"),
		spin = null,
		stage = 0;

	function onClickChange() {
		switch (stage) {
			case 0 :
				descriptions.innerHTML = ".value(9) limited to 6";
				spin.value(9);
				break;
			case 1 :
				descriptions.innerHTML = ".value(5)";
				spin.value(5);
				break;
			case 2 :
				descriptions.innerHTML = ".value(0)";
				spin.value(0);
				break;
		}
		if (++stage > 2) {
			stage = 0;
		}
	}

	function onRotary(ev) {
		var step = 1;

		// get spin widget instance
		spin = window.tau.widget.Spin(element);

		if (spin.option("enabled")) {
			if (ev.detail.direction === "CW") {
				spin.value(spin.value() + step);
			} else {
				spin.value(spin.value() - step);
			}
			descriptions.innerHTML = ".value(" + spin.value() + ")";
		}
	}

	function onClick(ev) {
		var tau = window.tau;

		// get spin widget instance
		spin = window.tau.widget.Spin(element);

		if (tau.util.selectors.getClosestBySelector(ev.target, ".ui-spin") === null) {
			// click on background
			spin.option("enabled", false);
		} else {
			// Disable spin on click on selected item
			if (!spin.option("enabled")) {
				spin.option("enabled", true);
			} else if (ev.target.classList.contains("ui-spin-item-selected")) {
				spin.option("enabled", false);
			}
		}
	}

	/**
	 * Template initializing
	 */
	function init() {
		page.addEventListener("pageshow", function () {
			var tau = window.tau;

			// create range indicator widget
			spin = tau.widget.Spin(element);

			// enable spin on click
			content.addEventListener("vclick", onClick);

			element.addEventListener("spinchange", function () {
				/*
				Event "spinchange" is not triggering when value is changing by .value() method.
				eg. "rotarydetent" does not trigger "spinchange" because of value
				    has changed by .value()
				 */
				descriptions.innerHTML = "on spinchange: " + spin.value();
			});

			// Spin widget doesn't have inner support for rotary event
			// add rotary event
			document.addEventListener("rotarydetent", onRotary);

			// cleanup widget in order to avoid memory leak
			tau.event.one(page, "pagehide", function () {
				document.removeEventListener("rotarydetent", onRotary);
				document.querySelector(".ui-footer .ui-btn")
					.removeEventListener("click", onClick);
				content.removeEventListener("vclick", onClick);

				spin.destroy();
			});
		});

		document.querySelector(".ui-footer .ui-btn")
			.addEventListener("click", onClickChange);
	}

	// init application
	init();

})(window);
