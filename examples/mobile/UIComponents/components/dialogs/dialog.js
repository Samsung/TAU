(function (document, tau) {
	var page = document.getElementById("demo-dialog-page"),
		progressPage = page.querySelector("#progressbar-dialog"),
		progressbar = page.querySelector("#progressbar"),
		progressPercent = page.querySelector("#percent"),
		setTimer,
		getTimer;

	function onPageShow() {
		progressPage.addEventListener("popupshow", onProgressPageShow);
	}

	function onPageHide() {
		progressPage.addEventListener("popuphide", onProgressPageHide);
	}

	function onProgressPageShow() {
		var progressbarWidget = new tau.widget.Progress(progressbar);

		setTimer = setTimeout(function () {
			progressbarWidget.value(100);
		}, 1000);

		getTimer = setTimeout(function () {
			progressPercent.innerHTML = progressbarWidget.value() + "%";
		}, 2000);
	}

	function onProgressPageHide() {
		clearTimeout(setTimer);
		clearTimeout(getTimer);
	}

	page.addEventListener("pagebeforeshow", onPageShow);
	page.addEventListener("pagebeforehide", onPageHide);

}(window.document, window.tau));
