(function (window) {
	"use strict";

	var page = document.getElementById("spin-group-page"),
		digit1 = document.getElementById("digit-1"),
		digit2 = document.getElementById("digit-2"),
		digit3 = document.getElementById("digit-3"),
		spins = [];

	function toggleSpins(target) {
		var tau = window.tau,
			spinElement = tau.util.selectors
				.getClosestBySelector(target, ".ui-spin"),
			// get widget instance
			spin = tau.widget.Spin(spinElement);

		if (spin) {
			// Disable spin on click on selected item
			if (!spin.option("enabled")) {
				spin.option("enabled", true);
			} else if (target.classList.contains("ui-spin-item-selected")) {
				spin.option("enabled", false);
			}

			// disble previous enbled spin
			spins.forEach(function (toDisable) {
				if (toDisable !== spin) {
					toDisable.option("enabled", false);
				}
			});
		}
	}

	function onClick(ev) {
		toggleSpins(ev.target);
	}

	function onRotary(ev) {
		var step = 1,
			// find enabled spin
			spin = spins.filter(function (spin) {
				return spin.option("enabled");
			})[0];

		if (spin && spin.option("enabled")) {
			if (ev.detail.direction === "CW") {
				spin.value(spin.value() + step);
			} else {
				spin.value(spin.value() - step);
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
			spins[0] = tau.widget.Spin(digit1);
			spins[1] = tau.widget.Spin(digit2);
			spins[2] = tau.widget.Spin(digit3);

			// enable spin on click
			document.addEventListener("vclick", onClick);

			document.addEventListener("spinchange", function () {
				//console.log("spinchange");
				/*
				Event "spinchange" is not triggering when value is changing by .value() method.
				eg. "rotarydetent" does not trigger "spinchange" because of value
				    has changed by .value()
				 */
			}, true);

			document.addEventListener("spinstep", function () {
				//console.log("spinstep");
			}, true);

			// Spin widget doesn't have inner support for rotary event
			// add rotary event
			document.addEventListener("rotarydetent", onRotary);

			// cleanup widget in order to avoid memory leak
			tau.event.one(page, "pagehide", function () {
				document.removeEventListener("vclick", onClick);
				document.removeEventListener("rotarydetent", onRotary);
				spins.forEach(function (spin) {
					spin.destroy();
				});
			});
		});
	}

	// init application
	init();

})(window);
