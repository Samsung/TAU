(function () {
	"use strict";
	var tau = window.tau,
		state = {
			widgets: {
				news: false,
				nowontv: false
			}
		};

	function getWidgetsState() {
		var latestNews = document.querySelector("#latest-news-check"),
			nowOnTV = document.querySelector("#now-on-tv-check");

		state.widgets.news = latestNews.checked;
		state.widgets.nowontv = nowOnTV.checked;
	}

	function toggleWidgetsState() {
		var latestNews = document.querySelector("#latest-news-container"),
			nowOnTv = document.querySelector("#now-on-tv-container");

		latestNews.classList.toggle("app-display-none", !state.widgets.news);
		nowOnTv.classList.toggle("app-display-none", !state.widgets.nowontv);
	}

	function changeTheme(event) {
		tau.theme.setTheme(event.target.value);
	}

	function onPopupSubmit() {
		getWidgetsState();
		toggleWidgetsState();
		tau.history.back();
	}

	/**
     * Click button event handler
     * Opens drawer
     */
	function onButtonClick() {
		var drawerWidget = tau.widget.Drawer(document.querySelector(".ui-drawer"));

		drawerWidget.open();
	}

	function init() {
		var themeChanger = document.querySelector("#theme-selector"),
			page = document.querySelector(".ui-page"),
			themeChangerButton = page.querySelector("#selector-opener"),
			burgerButton = page.querySelector(".app-btn-icon-burger"),
			popupButton = page.querySelector("#popup-submit");

		themeChanger.addEventListener("change", changeTheme);

		themeChangerButton.addEventListener("vclick", function () {
			var dropdownmenuWidget = tau.widget.DropdownMenu(themeChanger);

			dropdownmenuWidget.open();
		});

		burgerButton.addEventListener("click", onButtonClick);
		popupButton.addEventListener("click", onPopupSubmit);
	}

	document.addEventListener("pagebeforeshow", init);
}());