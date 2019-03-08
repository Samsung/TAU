/*global tau */
(function () {
	var page = document.getElementById("76-date-picker-1CE"),
		element = page.querySelector(".ui-date-picker"),
		daySpan,
		widget = null;

	function init() {
		widget = tau.widget.DatePicker(element);
		widget.value(new Date(2015, 1, 28));
		daySpan = page.querySelector(".ui-date-picker-container-day .ui-number-picker-number");
		daySpan.click();
		daySpan.style["animationPlayState"] = "paused";
	}

	function onPageHide() {
		widget.destroy();
	}

	page.addEventListener("pagebeforeshow", init);
	page.addEventListener("pagehide", onPageHide);
}());
