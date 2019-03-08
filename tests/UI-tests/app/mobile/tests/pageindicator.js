(function(tau) {
	var page = document.getElementById( "page-indicator-page" ),
		changer = document.getElementById( "hsectionchanger" ),
		elPageIndicator = document.getElementById("pageIndicator"),
		pageIndicator,
		pageIndicatorHandler;

	/**
	 * pageshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pageshow", function() {
		pageIndicator =  tau.widget.PageIndicator(elPageIndicator);
		pageIndicator.setActive(2);
	});

	/**
	 * sectionchange event handler
	 */
	pageIndicatorHandler = function (e) {
		pageIndicator.setActive(e.detail.active);
	};
	changer.addEventListener("sectionchange", pageIndicatorHandler, false);

}(window.tau));
