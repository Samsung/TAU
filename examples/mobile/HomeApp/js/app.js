(function () {
	"use strict";
	var tau = window.tau;

	function changeTheme(event) {
		tau.theme.setTheme(event.target.value);
	}

	function init() {
		var themeChanger = document.querySelector("#theme-selector"),
			page = document.querySelector(".ui-page"),
			themeChangerButton = page.querySelector("#selector-opener");

		themeChanger.addEventListener("change", changeTheme);

		themeChangerButton.addEventListener("vclick", function () {
			var dropdownmenuWidget = tau.widget.DropdownMenu(themeChanger);

			dropdownmenuWidget.open();
		});
	}

	document.addEventListener("pagebeforeshow", init);
}());