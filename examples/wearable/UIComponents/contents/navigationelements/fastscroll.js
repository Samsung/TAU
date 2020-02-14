(function (tau) {
	var page = document.getElementById("fast-scroll-page"),
		fastScroll = null;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function () {
		fastScroll = tau.widget.ScrollHandler(this);
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function () {
		fastScroll.destroy();
	});

}(window.tau));
