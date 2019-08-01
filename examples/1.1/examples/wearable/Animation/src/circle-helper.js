/*global tau */
/*jslint unparam: true */
(function (tau) {
	/**
	 * page - Active page element
	 * list - NodeList object for lists in the page
	 * listHelper - Array for TAU snap list helper instances
	 */
	var page,
		list,
		listHelper = [],
		i,
		len;

	// This logic works only on circular device.
	if (tau.support.shape.circle) {
		/**
		 * pagebeforeshow event handler
		 * Do preparatory works and adds event listeners
		 */
		document.addEventListener("pagebeforeshow", function (e) {
			page = e.target;
			if (page.id !== "page-snaplistview" && page.id !== "page-swipelist") {
				list = page.querySelector(".ui-listview");
				if (list) {
					listHelper.push(tau.widget.Listview(list));
				}
			}
		});

		/**
		 * pagebeforehide event handler
		 * Destroys and removes event listeners
		 */
		document.addEventListener("pagebeforehide", function () {
			len = listHelper.length;
			/**
			 * Since the snap list helper attaches rotary event listener,
			 * you must destroy the helper before the page is closed.
			 */
			if (len) {
				for (i = 0; i < len; i++) {
					listHelper[i].destroy();
				}
				listHelper = [];
			}
		});
	}
}(tau));
