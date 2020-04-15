(function () {
	/**
	 * page - Select theme page element
	 * pageShowHandler - pageshow event handler
	 * pageHideHandler - pagehide event handler
	 */
	var page = document.getElementById("colors-demo-page"),
		pageShowHandler,
		pageHideHandler,
		onThemeChange,
		refreshColorValues;


	refreshColorValues = function () {
		var colors = page.querySelectorAll("[data-color]");

		colors = [].slice.call(colors);
		colors.forEach(function (span) {
			span.innerHTML = window.getComputedStyle(document.body)
				.getPropertyValue(span.dataset["color"]);
		});
	};

	/**
	 * onThemeChange event handler
	 * @param {Event} event
	 */
	onThemeChange = function (event) {
		refreshColorValues(event.detail.theme);
	};

	/**
	 * pageshow event handler
	 * Do preparatory works and adds event listeners
	 */
	pageShowHandler = function () {
		refreshColorValues();
		document.addEventListener("themechange", onThemeChange, true);
	};

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	pageHideHandler = function () {
		document.removeEventListener("themechange", onThemeChange, true);
	};

	page.addEventListener("pageshow", pageShowHandler, false);
	page.addEventListener("pagehide", pageHideHandler, false);
}(window.tau));
