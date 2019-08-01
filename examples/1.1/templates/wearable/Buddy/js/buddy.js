document.addEventListener("DOMContentLoaded", function() {
	"use strict";

	var page = document.getElementById("one"),
		buddyList = document.getElementById("buddy-list"),
		radialListview = null;

	/**
	 * Click on app screen change item to next
	 */
	function onClick(ev) {
		// Get widget instance of RadialListview
		radialListview = tau.widget.RadialListview(buddyList);
		if (ev.clientY < 180) {
			radialListview.next();
		} else {
			radialListview.prev();
		}
	}

	function onSwipe(ev) {
		console.log("swipe", ev);
		// Get widget instance of RadialListview
		radialListview = tau.widget.RadialListview(buddyList);
		// Change radiallist depending from swipe direction
		if (ev.detail.direction === "up") {
			radialListview.next();
		} else {
			radialListview.prev();
		}
	}

	/**
	 * Initializing list
	 */
	function init() {
		page.addEventListener("pagebeforeshow", function () {
			// enable swipe gesture
			tau.event.enableGesture(
				page,
				new tau.event.gesture.Swipe({
					orientation: tau.event.gesture.Orientation.VERTICAL
				})
			);
			// bind swipe gesture to page HTML element
			tau.event.on(page, "swipe", onSwipe);

			if (!tau.support.shape.circle) {
				page.addEventListener("click", onClick);
			}
		});

		// cleanup widget in order to avoid memory leak
		tau.event.one(page, "pagehide", function () {
			if (!tau.support.shape.circle) {
				page.removeEventListener("click", onClick);
			}
			radialList.destroy();
		});

		// create radiallistview widget
		radialListview = tau.widget.RadialListview(buddyList, {
			fx: {
				scale: [0.1, 0.3553, 0.4737, 0.5263, 0.6053, 0.7368, 1, 0.7368, 0.6053, 0.5263, 0.4737, 0.3553, 0.1],
				opacity: [0, 0.2, 0.4, 0.6, 0.8, 1, 1, 1, 0.8, 0.6, 0.4, 0.2, 0],
				angle: [20, 30, 51, 76, 104, 138, 180, 222, 256, 284, 309, 330, 340],
				distance: [150, 150, 145, 145, 144, 139, 140, 139, 144, 145, 145, 150, 150],
				depth: [-6, -5, -4, -3, -2, -1, 0, -1, -2, -3, -4, -5, -6]
			},
			center: {
				x: 180, y: 180
			},
			direction: 1
		});
	}


	// init application
	init();
});