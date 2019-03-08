/* global tau */
(function () {
	var page = document.getElementById("101-rotary-selector-with-icon-page"),
		selector = document.getElementById("101-rotary-selector-with-icon-selector"),
		selectorComponent;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function () {
		selectorComponent = tau.widget.Selector(selector);
		selectorComponent._changeLayer(1);
		selectorComponent.changeItem(13);
	});

	/**
	 * pagebeforehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagebeforehide", function () {
		selectorComponent.destroy();
	});
}());