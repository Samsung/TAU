(function (tau) {
	"use strict";
	var page = document.getElementById("progress-bar-page"),
		progressbar = document.getElementById("progress-bar"),
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
