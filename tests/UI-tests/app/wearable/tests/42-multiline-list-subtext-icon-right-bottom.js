/*global tau */
(function () {
	var page,
		scroller;

	page = document.getElementById("42-multiline-list-subtext-icon-right-bottom-page");

	page.addEventListener("pageshow", function () {
		scroller = page.getElementsByClassName("ui-scroller")[0];
		scroller.scrollTop = 700;
	});
}());