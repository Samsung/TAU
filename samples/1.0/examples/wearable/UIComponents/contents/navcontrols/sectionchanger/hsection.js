/*global tau */
(function () {

	var page = document.getElementById("hsectionchangerPage"),
		changer = document.getElementById("hsectionchanger"),
		sectionLength = document.querySelectorAll("section").length,
		elPageIndicator = document.getElementById("pageIndicator"),
		sectionChanger,
		pageIndicator,
		pageIndicatorHandler;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function () {
		// make PageIndicator
		pageIndicator = tau.widget.PageIndicator(elPageIndicator, {numberOfPages: sectionLength});
		pageIndicator.setActive(2);
		// make SectionChanger object
		sectionChanger = tau.widget.SectionChanger(changer, {
			circular: false,
			orientation: "horizontal",
			useBouncingEffect: true
		});
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function () {
		// release object
		sectionChanger.destroy();
	});

	/**
	 * sectionchange event handler
	 * @param {Event} e
	 */
	pageIndicatorHandler = function (e) {
		pageIndicator.setActive(e.detail.active);
	};

	changer.addEventListener("sectionchange", pageIndicatorHandler, false);

}());
