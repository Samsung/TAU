(function (tau) {
	/**
	 * page - Index scroll bar page element
	 * isbElement - Index scroll bar element
	 * dividers - array for group index elements
	 * isb - TAU index scroll bar instance
	 * scroller - Scrollable element
	 */
	var GROUP_INDEX_CLASS = "ui-group-index",
		page = document.getElementById("indexscrollbarPage"),
		isbElement = document.getElementById("indexscrollbar"),
		dividers = [].slice.call(page.querySelectorAll("." + GROUP_INDEX_CLASS)),
		searchButton = page.querySelector("#searchButton"),
		searchInput = page.querySelector("#indexscrollbar-search-input"),
		header = page.querySelector(".ui-header"),
		backButton = header.querySelector("a.ui-btn"),
		list = page.querySelector("#isbList"),
		listItems = list.querySelectorAll("[data-filtertext]"),
		listItemsArray = [].slice.call(listItems),
		listview,
		isb,
		scroller,
		clearButton,
		dividerIndexObject = {},
		selectBound,
		disableSearchBound,
		searchClickBound,
		searchInputKeyupBound,
		clearSearchBound;

	/**
	 * Moves the scroll to selected index
	 * @param {Event} event
	 */
	function onSelect(event) {
		var divider = dividerIndexObject[event.detail.index];

		if (divider && scroller) {
			scroller.scrollTop = divider.offsetTop;
		}
	}

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function () {
		var i,
			len,
			idx;

		scroller = tau.util.selectors.getScrollableParent(document.getElementById("isbList"));
		clearButton = header.querySelector(".ui-text-input-clear");
		len = dividers.length;
		for (i = 0; i < len; i++) {
			idx = dividers[i].textContent.trim();
			dividerIndexObject[idx] = dividers[i];
		}
		isb = new tau.widget.IndexScrollbar(isbElement);
		listview = new tau.widget.Listview(list);
		selectBound = onSelect.bind();
		isb.addEventListener("select", selectBound);
		searchClickBound = onSearchBtnClick.bind();
		searchButton.addEventListener("click", searchClickBound);
		searchInputKeyupBound = onSearchInputKeyup.bind();
		searchInput.addEventListener("keyup", searchInputKeyupBound);
		disableSearchBound = disableSearch.bind();
		backButton.addEventListener("click", disableSearchBound);
		clearSearchBound = onClearClick.bind();
		clearButton.addEventListener("click", clearSearchBound);
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function () {
		isb.removeEventListener("select", selectBound);
		searchButton.removeEventListener("click", searchClickBound);
		searchInput.removeEventListener("keyup", searchInputKeyupBound);
		backButton.removeEventListener("click", disableSearchBound);
		clearButton.removeEventListener("click", clearSearchBound);
		isb.destroy();
	});

	/**
	 * Search button click callback
	 * Sets focus on search input field
	 */
	function onSearchBtnClick() {
		header.classList.add("search-active");
		searchInput.focus();
	}

	/**
	 * Search button click callback
	 * Sets focus on search input field
	 */
	function disableSearch() {
		header.classList.remove("search-active");
	}

	/**
	 * TextInput clear button click handler
	 * Resets search results
	 */

	function onClearClick() {
		listItemsArray.forEach(function (item) {
			item.classList.remove("li-search-hidden");
		});
		dividers.forEach(function (item) {
			item.classList.remove("li-search-hidden");
		});

		listview.refresh();
	}

	/**
	 * Shows items that match the entered value
	 * keyup event handler
	 */
	function onSearchInputKeyup() {
		var nextItem,
			hide;

		// hide items
		listItemsArray.forEach(function (item) {
			var itemText = item.getAttribute("data-filtertext");

			if (itemText.toString().toLowerCase().indexOf(searchInput.value.toLowerCase()) === -1) {
				item.classList.add("li-search-hidden");
			} else {
				item.classList.remove("li-search-hidden");
			}
		});
		// hide empty dividers
		dividers.forEach(function (item) {
			hide = false;
			nextItem = item.nextElementSibling;
			if (!nextItem) {
				hide = true;
			} else {
				while (nextItem) {
					if (!nextItem.classList.contains(GROUP_INDEX_CLASS) &&
						nextItem.getBoundingClientRect().height > 0) {
						hide = false;
						break;
					}
					if (nextItem.classList.contains(GROUP_INDEX_CLASS)) {
						hide = true;
						break;
					}
					nextItem = nextItem.nextElementSibling;
				}
			}
			if (hide) {
				item.classList.add("li-search-hidden");
			} else {
				item.classList.remove("li-search-hidden");
			}
		});

		listview.refresh();
	}

}(window.tau));
