/*global tau */
(function () {
	/**
	 * page - Popup page element
	 * elPopup - Popup element
	 * popup - Popup component
	 * pageShowHandler - pageshow event handler
	 * pageHideHandler - pagehide event handler
	 */
	var page = document.getElementById("page-popup-btn-2-lines"),
		elPopup = document.getElementById("popup-btn-2-lines"),
		popup,
		pageShowHandler,
		pageHideHandler;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	pageShowHandler = function () {
		popup = tau.widget.Popup(elPopup);
		popup.open();
	};

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	pageHideHandler = function () {
		popup.destroy();
	};

	page.addEventListener("pageshow", pageShowHandler);
	page.addEventListener("pagehide", pageHideHandler);
}());
