(function (document, tau) {
	var page = document.getElementById("dropdownmenu-open"),
		menuElement = document.getElementById("select-custom-1"),
		menu = tau.widget.DropdownMenu(menuElement),
		onPageShow = function () {
			menu.open();
		};

	page.addEventListener("pageshow", onPageShow);

}(window.document, window.tau));

