(function(){
	var progressBar = document.getElementById("progressbar"),
		popup = document.getElementById("progress_popup"),
		button = document.getElementById("button"),
		page = document.getElementById("main"),
		progressBarWidget,
		pageShowHandler,
		pageHideHandler,
		popupWidget,
		idInterval,
		timeout1,
		timeout2;

	pageClickHandler = function () {
		progressBarWidget = new tau.widget.Progress(progressBar);
		popupWidget = new tau.widget.Popup(popup),

		timeout1 = setTimeout(function() {
			progressBarWidget.value(50);
		}, 500);

		timeout2 = setTimeout(function() {
			progressBarWidget.value(100);
			idInterval = setInterval(function() {
				if (!progressBarWidget._isAnimating) {
					popupWidget.open();
				}
			}, 100);
		}, 1000);

	};

	clearHandler = function () {
		clearTimeout(timeout1);
		clearTimeout(timeout2);
		clearInterval(idInterval);
	}

	button.addEventListener("click", pageClickHandler, false);
	page.addEventListener("pagehide", clearHandler, false);
	popup.addEventListener("popupafteropen", clearHandler, false);
}());
