(function(tau) {
	var page = document.getElementById("179-matched-text-dropdown-page"),
		search = document.getElementById("179-matched-text-dropdown"),
		list = document.getElementById("179-matched-text-dropdown-list"),
		listItems = list.querySelectorAll("[data-filtertext]"),
		listItemsArray = [].slice.call(listItems),
		searchHandlerBound,
		searchClearBound;

	/**
	 * Shows items that match the entered value
	 * keyup event handler
	 */
	function searchHandler() {
		listItemsArray.forEach(function(item){
			var itemText = item.getAttribute("data-filtertext");
			if ( itemText.toString().toLowerCase().indexOf(search.value.toLowerCase()) === -1 ) {
				item.classList.add("li-search-hidden");
			} else {
				item.classList.remove("li-search-hidden");
			}
		});
	}

	/**
	 * Initializes search result
	 */
	function searchClear() {
		if(search.value === "") {
			listItemsArray.forEach(function(item) {
				item.classList.remove("li-search-hidden");
			});
		}
	}

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function() {
		searchHandlerBound = searchHandler.bind(this);
		searchClearBound = searchClear.bind(this);
		search.addEventListener("keyup", searchHandlerBound, false);
		search.addEventListener("search", searchClearBound, false);
	});

	page.addEventListener("pageshow", function() {
		tau.event.trigger(search, "keyup");
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function() {
		search.removeEventListener("keyup", searchHandlerBound, false);
		search.removeEventListener("search", searchClearBound, false);
	});

}(window.tau));
