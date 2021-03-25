(function (document, tau) {
	var page = document.getElementById("search-bar-auto-complete-page"),
		search,
		list;

	function onSearchFocus() {
		var popupElement = page.querySelector(".ui-popup");

		if (popupElement) {
			tau.widget.Popup(popupElement).open();
		}
	}

	function onSuggestionClick(ev) {
		var text = tau.util.selectors.getClosestBySelector(ev.target, "li").textContent.trim();

		search.value = text;
	}

	function onPageShow() {
		search = page.querySelector("header .ui-appbar-title-container input[type='search']");
		search.addEventListener("focus", onSearchFocus);

		list = page.querySelector(".ui-listview-search-auto-complete");
		list.addEventListener("vclick", onSuggestionClick, true);
	}

	function onPageHide(ev) {
		var page = ev.target;

		search.removeEventListener("focus", onSearchFocus);
		list.removeEventListener("vclick", onSuggestionClick, true);

		page.removeEventListener("pageshow", onPageShow);
		page.removeEventListener("pagehide", onPageHide);
	}

	page.addEventListener("pageshow", onPageShow);
	page.addEventListener("pagehide", onPageHide);

}(window.document, window.tau));