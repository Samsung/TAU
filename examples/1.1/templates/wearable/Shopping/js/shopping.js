(function() {
	"use strict";

		// Get HTML element references
	var page = document.getElementById("one"),
		popup = page.querySelector("#moreoptionsPopup"),
		popupCircle = page.querySelector("#moreoptionsPopupCircle"),
		handler = page.querySelector(".ui-more"),
		elSelector = page.querySelector("#selector"),
		selector = null,
		clickHandlerBound = null;

	function clickHandler(event) {
		tau.openPopup((tau.support.shape.circle) ? popupCircle : popup);
	}

	page.addEventListener( "pagebeforeshow", function() {
		var radius = window.innerHeight / 2 * 0.8;

		clickHandlerBound = clickHandler.bind(null);
		handler.addEventListener("click", clickHandlerBound);
		if (tau.support.shape.circle) {
			selector = tau.widget.Selector(elSelector, {itemRadius: radius});
		}
	});

	page.addEventListener( "pagebeforehide", function() {
		handler.removeEventListener("click", clickHandlerBound);
		if (tau.support.shape.circle) {
			selector.destroy();
		}
	});

	/*
	 * When user click the indicator of Selector, drawer will close.
	 */
	elSelector.addEventListener("click", function(event) {
		var target = event.target;

		if (tau.support.shape.circle) {
			// 'ui-selector-indicator' is default indicator class name of Selector component
			if (target.classList.contains("ui-selector-indicator")) {
				tau.closePopup(popupCircle);
			}
		}
	});

}());