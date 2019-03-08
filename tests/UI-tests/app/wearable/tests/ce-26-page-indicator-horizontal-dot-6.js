/*global tau */
(function () {

	var page = document.getElementById("pageIndicatorPaged6CE") || document.getElementById("pageIndicatorCirclePaged6CE"),
		changer = document.getElementById("hsectionchangerd6CE"),
		sections = changer.querySelectorAll("section"),
		sectionChanger,
		elPageIndicator = document.getElementById("pageIndicatord6CE"),
		pageIndicator,
		pageIndicatorHandler;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function () {
		// make PageIndicator
		pageIndicator = tau.widget.PageIndicator(elPageIndicator, {numberOfPages: sections.length, maxPage: 6});
		pageIndicator.setActive(3);
		// make SectionChanger object
		sectionChanger = new tau.widget.SectionChanger(changer, {
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
		pageIndicator.destroy();
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
