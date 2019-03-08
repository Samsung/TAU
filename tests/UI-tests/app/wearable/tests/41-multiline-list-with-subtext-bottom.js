/*global tau */
(function () {
	var page,
		scroller;

	page = document.getElementById("41-multiline-list-with-subtext-bottom-page");

	page.addEventListener("pageshow", function () {
		scroller = page.getElementsByClassName("ui-scroller")[0];
		scroller.scrollTop = 700;
	});
}());