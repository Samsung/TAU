(function (tau) {
	"use strict";
	var page = document.getElementById("progress-bar-appbar-page"),
		progressbar = document.getElementById("progress-bar-appbar"),
		timer,

		pageBeforeShowHandler = function () {
			var progressbarWidget = new tau.widget.Progress(progressbar);

			timer = setTimeout(function () {
				progressbarWidget.value(100);
			}, 3000);
		},

		pageBeforeHideHandler = function () {
			clearTimeout(timer);
		};

	page.addEventListener("pagebeforeshow", pageBeforeShowHandler);
	page.addEventListener("pagebeforehide", pageBeforeHideHandler);

}(window.tau));
