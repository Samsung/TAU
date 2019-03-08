(function (tau) {
	/**
	 * page - Panel page element
	 * panelChanger - Panel changer element
	 * panelChangerComponent - TAU panel changer instance
	 * navigation - navigation element
	 * navigationComponent - TAU navigation instance
	 */
	var page = document.querySelector("#text-input-popup-page-ce");

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pageshow", function () {
		tau.openPopup("text-input-popup-ce");
	});

}(window.tau));