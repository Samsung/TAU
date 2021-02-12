/* global tau */
(function () {
	var page = document.getElementById("page-reorder-list"),
		dragButton = page.querySelector(".drag-button"),
		listElement = page.querySelector(".ui-listview"),
		appBarElememt = page.querySelector("header, .ui-header"),
		listviewWidget = null,
		pageWidget = tau.widget.Page(page);

	function dragElements() {
		listviewWidget.toggleDragMode();
		tau.widget.Appbar(appBarElememt).option("expandingEnabled", false);
	}

	// Callback for page before show
	function pageBeforeShow() {
		listviewWidget = tau.widget.Listview(listElement),
		tau.event.on(dragButton, "click", dragElements);
	}

	//Callback for page hide
	function pageHide() {
		listviewWidget.destroy();
		tau.event.off(dragButton, "click", dragElements);
	}

	pageWidget.on("pagebeforeshow", pageBeforeShow);
	pageWidget.on("pagehide", pageHide);
}());
