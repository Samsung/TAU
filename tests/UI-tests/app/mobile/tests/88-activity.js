(function (document, tau) {
	var page = document.getElementById("activity-page"),
		popupElement = document.getElementById("activity-popup"),
		popup = tau.widget.Popup(popupElement),
		onPageShow = function () {
			popup.open();
		};

	page.addEventListener("pageshow", onPageShow);

}(window.document, window.tau));

