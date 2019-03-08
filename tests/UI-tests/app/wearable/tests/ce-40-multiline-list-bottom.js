/*global tau */
(function () {
	var page,
		scroller;

	page = document.getElementById("40-multiline-list-bottom-pageCE");

	page.addEventListener("pageshow", function () {
		scroller = page.getElementsByClassName("ui-scroller")[0];
		scroller.scrollTop = 600;
	});
}());