/*global tau */
(function () {
	var page = document.getElementById("95-more-options-open-2-lines-page"),
		popup = document.getElementById("95-more-options-open-2-lines-popup"),
		selector = document.getElementById("95-more-options-open-2-lines-selector"),
		selectorComponent;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function () {
		var radius = window.innerHeight / 2 * 0.8;

		selectorComponent = tau.widget.Selector(selector, {itemRadius: radius});
		selectorComponent._changeLayer(1);
		selectorComponent.changeItem(13);
	});

	page.addEventListener("pageshow", function () {
		tau.openPopup(popup);
	});

	/**
	 * pagebeforehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagebeforehide", function () {
		selectorComponent.destroy();
	});

}());