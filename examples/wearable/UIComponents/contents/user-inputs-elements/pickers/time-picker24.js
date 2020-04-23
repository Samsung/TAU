/*global tau */
(function () {
	var page = document.getElementById("number-picker-page"),
		element = page.querySelector(".ui-time-picker"),
		widget = null,
		SAVED_TIME_24_KEY = "SAVED-TIME-24-KEY",
		savedTimeValue = null;

	function init() {
		widget = tau.widget.TimePicker(element);
		element.addEventListener("change", onChange);

		savedTimeValue = window.sessionStorage.getItem(SAVED_TIME_24_KEY);
		if (savedTimeValue) {
			widget.value(new Date(savedTimeValue));
		}
	}

	function onChange(event) {
		window.sessionStorage.setItem(SAVED_TIME_24_KEY, event.detail.value);
	}

	function onPageHide() {
		element.removeEventListener("change", onChange);
		widget.destroy();
	}

	page.addEventListener("pagebeforeshow", init);
	page.addEventListener("pagehide", onPageHide);
}());
