(function (tau) {
	"use strict";
	var page = document.getElementById("progress-bar-bottom-bar-page"),
		progressbar = document.getElementById("progress-bar-bottom-bar"),
		progressText = document.getElementById("progress-text"),
		value = 40,
		timer,

		pageBeforeShowHandler = function () {
			var progressbarWidget = new tau.widget.Progress(progressbar);

			timer = setInterval(function () {
				value = value + 5;
				progressbarWidget.value(value);
				progressText.innerHTML = value + "%";
				if (value === 100) {
					clearInterval(timer);
				}
			}, 1000);
		},

		pageBeforeHideHandler = function () {
			clearInterval(timer);
		};

	page.addEventListener("pagebeforeshow", pageBeforeShowHandler);
	page.addEventListener("pagebeforehide", pageBeforeHideHandler);

}(window.tau));
