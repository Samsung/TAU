/*global tau*/

(function () {

	var themeChanger,
		themeChangerButton,
		themeChangerWidget;

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
		var dropDownMenuWidget;

		if (themeChanger) {
			dropDownMenuWidget = tau.widget.DropdownMenu(themeChanger);
			dropDownMenuWidget.open();
		}
	}

	function onPageShow() {
		themeChanger = document.querySelector(".ui-page-active .theme-changer"),
		themeChangerButton = document.querySelector(".ui-page-active .ui-btn-icon-more");

		if (themeChanger && themeChangerButton) {
			themeChanger.value = tau.theme.getTheme();
			themeChanger.addEventListener("change", onMenuChange);
			themeChangerWidget = tau.engine.getBinding(themeChanger);
			themeChangerWidget.refresh();
		}
		if (themeChangerButton) {
			themeChangerButton.addEventListener("click", onMenuClick);
		}
	}

	function onPageHide() {
		if (themeChanger) {
			themeChanger.removeEventListener("change", onMenuChange);
		}
		if (themeChangerButton) {
			themeChangerButton.removeEventListener("click", onMenuClick);
		}
	}

	document.addEventListener("pageshow", onPageShow);
	document.addEventListener("pagehide", onPageHide);

}());