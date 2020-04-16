(function (tau) {
	/**
	 * page - Select theme page element
	 * pageShowHandler - pageshow event handler
	 * pageHideHandler - pagehide event handler
	 * onRadioChange - menu key event handler
	 */
	var page = document.getElementById("select-theme-demo-page"),
		pageShowHandler,
		pageHideHandler,
		onRadioChange;

	/**
	 * onRadioChange event handler
	 * @param {Event} event
	 */
	onRadioChange = function (event) {
		if (event.target.value !== "") {
			tau.theme.setTheme(event.target.value);
		}
	};

	/**
	 * pageshow event handler
	 * Do preparatory works and adds event listeners
	 */
	pageShowHandler = function () {
		var currentTheme = tau.theme.getTheme();

		page.addEventListener("change", onRadioChange, true);
		document.getElementById(currentTheme).checked = true;
	};

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	pageHideHandler = function () {
		page.removeEventListener("change", onRadioChange, true);

	};

	page.addEventListener("pageshow", pageShowHandler, false);
	page.addEventListener("pagehide", pageHideHandler, false);
}(window.tau));
