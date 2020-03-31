(function (document, tau) {
	var page = document.getElementById("demo-dialog-page"),
		buttons = document.querySelectorAll(".ui-btn"),
		idx;

	function onClick() {
		tau.history.back();
	}

	function onPageShow() {
		for (idx = 0; idx < buttons.length; idx++) {
			buttons[idx].addEventListener("vclick", onClick);
		}
	}

	function onPageHide() {
		for (idx = 0; idx < buttons.length; idx++) {
			buttons[idx].removeEventListener("vclick", onClick);
		}
	}

	page.addEventListener("pagebeforeshow", onPageShow);
	page.addEventListener("pagebeforehide", onPageHide);
}());
