(function (tau) {
	var page = document.getElementById("drawer-page"),
		button = page.querySelector("#openDrawerBtn"),
		drawerElement = page.querySelector("#leftDrawer"),
		drawerWidget;

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function () {
		drawerWidget = tau.widget.Drawer(drawerElement);
		button.addEventListener("click", onButtonClick)
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function () {
		button.removeEventListener("click", onButtonClick);
		drawerWidget.destroy();
	});

	/**
	 * Drawer open event handler.
	 * Enables drawer rotary scrolling
	 */
	page.addEventListener("draweropen", function () {
		tau.util.rotaryScrolling.enable(page.querySelector(".ui-drawer"));
	});

	/**
	 * Drawer close event handler
	 * Enables scroller for drawer page
	 */
	page.addEventListener("drawerclose", function () {
		tau.util.rotaryScrolling.enable(page.querySelector(".ui-scroller"));
	});

	/**
	 * Click button event handler
	 * Opens drawer
	 */
	function onButtonClick() {
		drawerWidget.open();
	}

}(window.tau));
