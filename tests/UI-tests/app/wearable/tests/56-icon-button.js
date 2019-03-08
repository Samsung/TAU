/*global tau */
(function () {
	var page = document.getElementById("56-icon-button-page"),
		element = page.querySelector("button"),
		widget;

	function onPageBeforeShow() {
		widget = tau.widget.Button(element, {
			style: "icon-middle",
			size: "97px",
			icon: "images/gallery_more_opt_save.png"
		});
	}

	function onPageHide() {
		widget.destroy();
	}

	page.addEventListener("pagebeforeshow", onPageBeforeShow);
	page.addEventListener("pagehide", onPageHide);
}());