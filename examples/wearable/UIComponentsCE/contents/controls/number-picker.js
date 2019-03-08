/*global tau */
(function () {
	var page = document.getElementById("number-picker-page"),
		element = page.querySelector("input[type=\"number\"]"),
		widget = null;

	function init() {
		widget = tau.widget.NumberPicker(element);
	}

	function onPageHide() {
		widget.destroy();
	}

	page.addEventListener("pagebeforeshow", init);
	page.addEventListener("pagehide", onPageHide);
}());
