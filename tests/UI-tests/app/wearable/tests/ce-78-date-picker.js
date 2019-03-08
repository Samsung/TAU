/*global tau */
(function () {
	var page = document.getElementById("78-date-pickerCE"),
		element = page.querySelector(".ui-date-picker"),
		yearSpan,
		widget = null;

	function init() {
		widget = tau.widget.DatePicker(element);
		widget.value(new Date(2015, 11, 31));
		yearSpan = page.querySelector(".ui-date-picker-container-year .ui-number-picker-number");
		yearSpan.click();
		yearSpan.style["animationPlayState"] = "paused";
	}

	function onPageHide() {
		widget.destroy();
	}

	page.addEventListener("pagebeforeshow", init);
	page.addEventListener("pagehide", onPageHide);
}());
