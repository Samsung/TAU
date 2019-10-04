/*global tau */
/*jslint unparam: true */
(function (tau) {

	var tauSectionChanger;

	// This logic works only on circular device.
	if (tau.support.shape.circle) {

		/**
		 * pagebeforeshow event handler
		 * Do preparatory works and adds event listeners
		 */
		document.addEventListener("pagebeforeshow", function (event) {
			/**
			 * page - Active page element
			 * list - NodeList object for lists in the page
			 * changer - SectionChanger element in the page
			 */
			var page,
				list,
				changer;

			page = event.target;
			if (page.id !== "page-snaplistview" && page.id !== "page-swipelist" && page.id !== "page-marquee-list") {
				list = page.querySelector(".ui-listview");
				if (list) {
					tau.widget.ArcListview(list);
				}

				changer = page.querySelector(".ui-section-changer");
				if (changer) {
					tauSectionChanger = tau.widget.SectionChanger(changer /* overwrite default options if needed */);
				}
			}
		});

		/**
		 * pagehide event handler
		 */
		document.addEventListener("pagehide", function () {
			// Release object.
			tauSectionChanger.destroy();
		});
	}
}(tau));
