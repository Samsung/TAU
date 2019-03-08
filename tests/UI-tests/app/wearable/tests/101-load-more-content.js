/*global window*/
(function (window, document) {
	var page = document.getElementById("load-more-contents-page"),
		activityIndicator = page.querySelector(".ui-processing");

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function () {
		activityIndicator.classList.remove("ui-hidden");
	});

}(window, window.document));
