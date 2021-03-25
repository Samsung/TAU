(function (document, tau) {
	var page = document.getElementById("search-bar-page"),
		search;

	function onSearchFocus() {
		var popupElement = page.querySelector(".ui-popup");

		if (popupElement) {
			tau.widget.Popup(popupElement).open();
		}
	}

	function onPageShow() {
		search = page.querySelector("header .ui-appbar-title-container input[type='search']");
		search.addEventListener("focus", onSearchFocus);
	}

	function onPageHide(ev) {
		var page = ev.target;

		search.removeEventListener("focus", onSearchFocus);
		page.removeEventListener("pageshow", onPageShow);
		page.removeEventListener("pagehide", onPageHide);
	}

	page.addEventListener("pageshow", onPageShow);
	page.addEventListener("pagehide", onPageHide);

}(window.document, window.tau));