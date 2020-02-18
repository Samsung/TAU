(function (tau) {
	var page = document.getElementById("assist-panel-page"),
		assistPanelElement = page.querySelector("#assistPanel"),
		assistPanelWidget;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function () {
		assistPanelWidget = tau.widget.AssistPanel(assistPanelElement);
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function () {
		assistPanelWidget.destroy();
	});

	/**
	 * Assist Panel open event handler.
	 * Enables assist panel rotary scrolling
	 */
	page.addEventListener("assistpanelopen", function () {
		tau.util.rotaryScrolling.enable(page.querySelector(".ui-assist-panel"));
	});

	/**
	 * Assist Panel close event handler
	 * Enables scroller for assist panel page
	 */
	page.addEventListener("assistpanelclose", function () {
		tau.util.rotaryScrolling.enable(page.querySelector(".ui-scroller"));
	});

}(window.tau));
