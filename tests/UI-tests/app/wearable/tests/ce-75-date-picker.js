/*global tau */
(function () {
	var page = document.getElementById("75-date-picker-ce"),
		element = page.querySelector(".ui-date-picker"),
		monthSpan,
		widget = null;

	function init() {
		widget = tau.widget.DatePicker(element);
		widget.value(new Date(2015, 11, 20));
		monthSpan = page.querySelector(".ui-date-picker-container-month .ui-number-picker-number");
		monthSpan.click();
		monthSpan.style["animationPlayState"] = "paused";
	}

	function onPageHide() {
		widget.destroy();
	}

	page.addEventListener("pagebeforeshow", init);
	page.addEventListener("pagehide", onPageHide);
}());
