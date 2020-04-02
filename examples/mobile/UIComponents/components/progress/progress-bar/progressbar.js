(function (tau) {
	"use strict";
	var page = document.getElementById("progressbar-demo"),
		progressbar = document.getElementById("progressbar"),
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
