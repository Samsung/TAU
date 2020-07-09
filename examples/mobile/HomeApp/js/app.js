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

	function loadWeatherJS() {
		var head = document.getElementsByTagName("head")[0],
			jsScript = document.getElementById("weatherwidget-io-js");

		if (jsScript) {
			jsScript.remove();
		}
		jsScript = document.createElement("script")
		jsScript.src = "https://weatherwidget.io/js/widget.min.js";
		jsScript.id = "weatherwidget-io-js";
		head.appendChild(jsScript);
	}

	function changeTheme(event) {
		var weatherWidget = document.querySelector(".weatherwidget-io");

		tau.theme.setTheme(event.target.value);
		if (event.target.value == "light") {
			weatherWidget.setAttribute("data-theme", "pure");
		} else {
			weatherWidget.setAttribute("data-theme", "dark");
		}
		loadWeatherJS();
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
		loadWeatherJS();
	}

	document.addEventListener("pagebeforeshow", init);
}());