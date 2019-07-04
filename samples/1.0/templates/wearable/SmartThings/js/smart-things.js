document.addEventListener("DOMContentLoaded", function() {
	"use strict";

	var page = document.getElementById("one"),
		listElement = document.getElementById("smart-things"),
		indicatorElement = document.getElementById("indicator"),
		indicator = null,
		radialListview = null,
		INITIAL_INDEX_ITEM = 4;

	function onSwipe(ev) {
		// Get widget instance of RadialListview
		radialListview = tau.widget.RadialListview(listElement);
		// Change radiallist depending from swipe direction
		if (ev.detail.direction === "left") {
			radialListview.prev();
		} else {
			radialListview.next();
		}
	}

	/**
	 * Template initializing
	 */
	function init() {
		page.addEventListener("pagebeforeshow", function () {
			// enable swipe gesture
			tau.event.enableGesture(
				page,
				new tau.event.gesture.Swipe({
					orientation: tau.event.gesture.Orientation.HORIZONTAL
				})
			);
			// bind swipe gesture to page HTML element
			tau.event.on(page, "swipe", onSwipe);

			// make Indicator widget
			indicator =  tau.widget.PageIndicator(indicatorElement, {
				numberOfPages: listElement.querySelectorAll("li").length
			});
			// set initial position of Indicator widget
			indicator.setActive(INITIAL_INDEX_ITEM);
		});

		listElement.addEventListener("change", function (ev) {
			// RadialList dispatch "change" event when item has "selected" state
			indicator.setActive(ev.detail.selectedIndex);
		});
		listElement.addEventListener("ischanging", function (ev) {
			// RadialList dispatch "ischanging" event when widget state is in progress
			// and item goes to "selected"
			indicator.setActive(ev.detail.selectedIndex);
		});

		// cleanup widget in order to avoid memory leak
		tau.event.one(page, "pagehide", function () {
			// Destroy Indicator widget and RadialList widget
			indicator.destroy();
			radialList.destroy();
		});

		// create virtuallist widget
		radialListview = tau.widget.RadialListview(listElement, {
			// how to the ring rotation will rotate items
			direction: 1,
			// selected index beginning from 0
			selectedIndex: INITIAL_INDEX_ITEM
		});
	}

	// init application
	init();
});