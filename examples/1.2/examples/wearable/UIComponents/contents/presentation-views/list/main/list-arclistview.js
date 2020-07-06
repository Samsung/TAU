/*global tau*/
(function () {
	"use strict";
	var /**
		 * Cache of arc-listview-page
		 * @type {HTMLElement}
		 */
		page = document.getElementById("arc-listview-page"),
		/**
		 * ArcListview widget instance
		 * @type {Object}
		 */
		widget = null;

	/**
	 * Create ArcListview widget and scroll to third position before page show
	 */
	page.addEventListener("pagebeforeshow", function () {
		var element = page.querySelector(".ui-arc-listview");

		widget = tau.widget.ArcListview(element);
		widget.scrollToPosition(2);
	});

	/**
	 * Destroy ArcListview widget on page hide
	 */
	page.addEventListener("pagehide", function () {
		widget.destroy();
	});
})();


