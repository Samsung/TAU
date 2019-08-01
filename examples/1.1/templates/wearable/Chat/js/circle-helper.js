/* global window: false */
(function (window, tau) {
	var page,
		elScroller = document.querySelector(".ui-content"),
		direction = 1,
		SCROLL_STEP = 50,
		scrollTo = window._animScrollTo;

	function onRotary(ev) {
		var direction = (ev.detail && ev.detail.direction === "CW") ? 1 : -1;

		// scroll element content with animation
		scrollTo(elScroller, direction * SCROLL_STEP, 150);
	}

	if (tau.support.shape.circle) {
		document.addEventListener("pagebeforeshow", function (e) {
			var fn = null;

			page = e.target;
			elScroller = page.querySelector(".ui-scroller");
			elScroller.setAttribute("tizen-circular-scrollbar", "");
			document.addEventListener("rotarydetent", onRotary, true);
		});

		document.addEventListener("pagebeforehide", function (e) {
			if (elScroller) {
				elScroller.removeAttribute("tizen-circular-scrollbar");
			}
			document.removeEventListener("rotarydetent", onRotary, true);
		});
	}
}(window, window.tau));
