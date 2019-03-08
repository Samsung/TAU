/* global tau */
(function () {
	var page = document.getElementById("103-rotary-selector-edit-mode-page-ce"),
		selector = document.getElementById("103-rotary-selector-edit-mode-ce"),
		selectorComponent;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function () {
		selectorComponent = tau.widget.Selector(selector);
		selectorComponent._enableEditMode();
	});

	/**
	 * pagebeforehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagebeforehide", function () {
		selectorComponent.destroy();
	});
}());