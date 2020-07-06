/*global tau */
(function () {
	var page = document.getElementById("date-picker-page"),
		element = page.querySelector(".ui-date-picker"),
		widget = null,
		SAVED_DATE_KEY = "SAVED-DATE-KEY",
		savedDateValue = null;

	function init() {
		widget = tau.widget.DatePicker(element);
		element.addEventListener("change", onChange);

		savedDateValue = window.sessionStorage.getItem(SAVED_DATE_KEY);
		if (savedDateValue) {
			widget.value(new Date(savedDateValue));
		}
	}

	function onChange(event) {
		window.sessionStorage.setItem(SAVED_DATE_KEY, event.detail.value);
	}

	function onPageHide() {
		element.removeEventListener("change", onChange);
		widget.destroy();
	}

	page.addEventListener("pagebeforeshow", init);
	page.addEventListener("pagehide", onPageHide);
}());
