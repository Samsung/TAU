(function () {
	"use strict";

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

		if (event.detail.theme === "light") {
			weatherWidget.setAttribute("data-theme", "pure");
		} else {
			weatherWidget.setAttribute("data-theme", "dark");
		}
		loadWeatherJS();
	}

	function init() {
		loadWeatherJS();
	}

	document.addEventListener("cardcontentchange", init);
	document.addEventListener("themechange", changeTheme);
}());