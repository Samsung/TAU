(function(tau) {
	/**
	 * elPage - Grid view page element
	 * elGrid - Grid view element
	 * modeBtn - Mode toggle button element
	 * gridList - TAU grid view instance
	 */
	var elPage = document.getElementById("grid-page"),
		elGrid = document.getElementById("gridview"),
		modeBtn = document.getElementById("modeBtn"),
		gridList;

	/**
	 * Toggles reorder/edit mode
	 */
	function modeHandler() {
		if (gridList.options.reorder === true) {
			gridList.option("reorder", false);
			modeBtn.textContent = "Edit";
		} else {
			gridList.option("reorder", true);
			modeBtn.textContent = "Done";
		}
	}

	/**
	 * pageshow event handler
	 * Do preparatory works and adds event listeners
	 */
	elPage.addEventListener("pageshow", function() {
		gridList = tau.widget.GridView(elGrid);
		if (modeBtn) {
			modeBtn.addEventListener("click", modeHandler);
		}
	});

	/**
	  * pagebeforehide event handler
	  * Destroys and removes event listeners
	  */
	elPage.addEventListener("pagebeforehide", function() {
		if (modeBtn) {
			modeBtn.removeEventListener("click", modeHandler);
		}
	});

}(window.tau));
