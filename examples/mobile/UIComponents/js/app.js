/*global tau*/

(function () {

	var themeChanger = document.querySelector("#theme-selector"),
		themeChangerButton = document.querySelector("#selector-opener");

	window.addEventListener("tizenhwkey", function (ev) {
		var activePopup = null,
			page = null,
			pageId = "";

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			page = document.getElementsByClassName("ui-page-active")[0];
			pageId = page ? page.id : "";

			if (pageId === "main" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});

	function onMenuChange(event) {
		tau.theme.setTheme(event.target.value);
	}

	function onMenuClick() {
		var dropDownMenuWidget = tau.widget.DropdownMenu(themeChanger);

		dropDownMenuWidget.open();
	}

	document.addEventListener("pagebeforeshow", function () {
		themeChanger.addEventListener("change", onMenuChange);
		themeChangerButton.addEventListener("click", onMenuClick);
	});

	document.addEventListener("pagebeforehide", function () {
		themeChanger.removeEventListener("change", onMenuChange);
		themeChangerButton.removeEventListener("click", onMenuClick);
	});

}());