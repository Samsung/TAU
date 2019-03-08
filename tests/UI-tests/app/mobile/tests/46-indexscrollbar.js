(function (tau) {
	/**
	 * page - Index scroll bar page element
	 * isbElement - Index scroll bar element
	 * dividers - NodeList object for group index elements
	 * isb - TAU index scroll bar instance
	 * scroller - Scrollable element
	 */
	var page = document.getElementById("46-index-scroll-bar-page"),
		isbElement = document.getElementById("46-index-scroll-bar"),
		dividers = page.getElementsByClassName("ui-group-index"),
		testedIndex = document.getElementById("tested-index"),
		isb,
		scroller,
		dividerIndexObject = {},
		selectBound;

	/**
	 * Moves the scroll to selected index
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

		scroller = tau.util.selectors.getScrollableParent(document.getElementById("46-index-scroll-bar-list"));
		len = dividers.length;
		for (i = 0; i < len; i++) {
			idx = dividers[i].textContent;
			dividerIndexObject[idx] = dividers[i];
		}
		isb = new tau.widget.IndexScrollbar(isbElement);
		selectBound = onSelect.bind();
		isb.addEventListener("select", selectBound);
	});

	page.addEventListener("pageshow", function () {
		var element = document.getElementById("46-index-scroll-bar"),
			evt = new CustomEvent("vmousedown", {}),
			liElements = [].slice.call(document.querySelectorAll(".ui-indexscrollbar li")),
			testedIndex,
			rect;

		liElements.some(function (element) {
			if (element.textContent === "N") {
				testedIndex = element;
				return true;
			}
			return false;
		});

		if (testedIndex) {
			rect = testedIndex.getBoundingClientRect();

			evt.clientX = rect.left + rect.width / 2;
			evt.clientY = rect.top + rect.height / 2;

			element.dispatchEvent(evt);
		}
	});

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function () {
		isb.removeEventListener("select", selectBound);
		isb.destroy();
	});
}(window.tau));
