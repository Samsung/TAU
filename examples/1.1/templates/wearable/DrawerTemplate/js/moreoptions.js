/*global tau */
/*jslint unparam: true */
(function(){
	var page = document.querySelector("#moreoptionsPage"),
		popup = page.querySelector("#moreoptionsPopup"),
		handler = page.querySelector(".ui-more"),
		popupCircle = page.querySelector("#moreoptionsPopupCircle"),
		elSelector = page.querySelector("#selector"),
		selector,
		clickHandlerBound;

	/*
	 * Callback called when more button is pressed
	 * If circle is support then circle popup is opened
	 */
	function clickHandler(event) {
		if (tau.support.shape.circle) {
			tau.openPopup(popupCircle);
		} else {
			tau.openPopup(popup);
		}
	}

	/*
	 * Prepare callbacks attached before page show
	 */
	page.addEventListener( "pagebeforeshow", function() {
		var radius = window.innerHeight / 2 * 0.8;

		clickHandlerBound = clickHandler.bind(null);
		handler.addEventListener("click", clickHandlerBound);
		if (tau.support.shape.circle) {
			selector = tau.widget.Selector(elSelector, {
				itemRadius: radius,
				layout: "circular"
			});
		}
	});

	/*
	 * Cleaning up before closing page
	 */
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
