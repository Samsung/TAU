( function () {

	/**
	 * Here progress bars are created.
	 */
	function pageIndicatorSetup(ev, startPosition) {
		var isCircle = tau.support.shape.circle,
			elPageIndicator = ev.target.querySelector(".pageindicator"),
			pageIndicator;

		// if this is circular UI, the circle progress bar is created in full size
		// in other case, the small circular progress bar is created
		if (isCircle) {
			pageIndicator =  tau.widget.PageIndicator(elPageIndicator, {
				layout: "circular",
				numberOfPages: 3
			});
		} else {
			pageIndicator =  tau.widget.PageIndicator(elPageIndicator, {
				numberOfPages: 3
			});
		}
		pageIndicator.setActive(startPosition);
		return pageIndicator;
	}

	/**
	 * Handler for click for button on the first page.
	 */
	function nextButtonClick() {
		var loginInput = document.getElementById("login");

		// if login is not given, the popup is opened
		// in other case, the page is changed on the next one
		if (login.value === "") {
			tau.openPopup("loginPopup");
		} else {
			tau.changePage("two");
		}
	}

	/**
	 * Handler for event pagebeforeshow for the first page
	 */
	function firstPageBeforeShowHandler(ev) {
		var nextButton = document.getElementById("to_second"),
			pageIndicator;

		pageIndicator = pageIndicatorSetup(ev, 0);
		nextButton.addEventListener("click", nextButtonClick, false);
	}

	/**
	 * Handler for event pagehide for the first page
	 */
	function firstPageHideHandler(ev) {
		var nextButton = document.getElementById("to_second");

		nextButton.removeEventListener("click", nextButtonClick, false);
	}

	function summaryButtonClick(ev) {
		var summaryPage = document.getElementById("summary");

		summaryPage.classList.add("progressing");
		tau.changePage(summaryPage);
	}

	/**
	 * Handler for event pagebeforeshow for the second page
	 */
	function secondPageBeforeShowHandler(ev) {
		var summaryButton = document.getElementById("to_summary"),
			pageIndicator;

		pageIndicator = pageIndicatorSetup(ev, 1);
		summaryButton.addEventListener("click", summaryButtonClick, false);
	}

	/**
	* Handler for event pagehide for the second page
	*/
	function secondPageHideHandler(ev) {
		var summaryButton = document.getElementById("to_summary");

		summaryButton.removeEventListener("click", summaryButtonClick, false);
	}

	/**
	 * Handler for event pagebeforeshow for the third page
	 */
	function thirdPageBeforeShowHandler(ev) {
		var summaryPage = document.getElementById("summary"),
			pageIndicator;

		pageIndicator = pageIndicatorSetup(ev, 2);
		/**
		 * Login process
		 * This timeout simulates the login processing.
		 */
		setTimeout(function(){
			summaryPage.classList.remove("progressing");
		}, 2500);
	}

	function init() {
		var page1 = document.getElementById("one"),
			page2 = document.getElementById("two"),
			page3 = document.getElementById("summary"),
			isCircle = tau.support.shape.circle;

		page1.addEventListener("pagebeforeshow", firstPageBeforeShowHandler, true);
		page1.addEventListener("pagehide", firstPageHideHandler, true);
		page2.addEventListener("pagebeforeshow", secondPageBeforeShowHandler, true);
		page2.addEventListener("pagehide", secondPageHideHandler, true);
		page3.addEventListener("pagebeforeshow", thirdPageBeforeShowHandler, true);
	}

	init();

} () );