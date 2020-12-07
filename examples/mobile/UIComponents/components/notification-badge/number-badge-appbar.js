/* global tau */
(function () {
	var page = document.getElementById("number-badge-appbar"),
		dropDownMenu,
		btnMore;

	function openDropdownMenu() {
		var dropdownmenuWidget = tau.widget.DropdownMenu(dropDownMenu);

		dropdownmenuWidget.open();
	}

	function onPageShow() {
		btnMore = document.querySelector(".ui-page-active .ui-btn-icon-more");
		dropDownMenu = document.getElementById("sample-dropdown-menu");
		btnMore.addEventListener("click", openDropdownMenu);
	}

	page.addEventListener("pageshow", onPageShow);
})();
