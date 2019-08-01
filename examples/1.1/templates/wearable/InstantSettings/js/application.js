/*global tau */
/*jslint unparam: true */
(function(){
	var getNSData = tau.util.DOM.getNSData,
		setNSData = tau.util.DOM.setNSData,
		page = document.getElementById("main"),
		elSelector = page.querySelector(".ui-selector"),
		elIndicator = page.querySelector(".ui-selector-indicator"),
		elIndicatorTitle = elIndicator.querySelector(".title"),
		elIndicatorStatus = elIndicator.querySelector(".status"),
		selector;

	/**
	 * Logic for click on indicator
	 * @param event
	 */
	function indicatorClick(event) {
		var activeElement = elSelector.querySelector(".ui-item-active"),
			activeElementClasses = activeElement.classList;

		// change appearance of icon
		activeElementClasses.toggle("on");
		// change status shown on indicator
		if (activeElementClasses.contains("on")) {
			setNSData(activeElement, "status", "On");
		} else {
			setNSData(activeElement, "status", "Off");
		}
		// refresh status
		elIndicatorStatus.textContent = getNSData(activeElement, "status");
	}

	/**
	 * Set indicator's texts
	 * @param activeElement
	 */
	function setIndicator(activeElement) {
		elIndicatorTitle.textContent = getNSData(activeElement, "title");
		elIndicatorStatus.textContent = getNSData(activeElement, "status");
	}

	/**
	 * Handler for event selectoritemchange
	 * @param event
	 */
	function selectorItemChanged(event) {
		setIndicator(event.target);
	}

	/*
	 * Prepare callbacks attached before page show
	 */
	page.addEventListener("pagebeforeshow", function() {
		var radius = window.innerHeight / 2 * 0.8;

		selector = tau.widget.Selector(elSelector, {itemRadius: radius});
		// set indicator for active element
		setIndicator(elSelector.querySelector(".ui-item-active"));

		// set updating indicator
		document.addEventListener("selectoritemchange", selectorItemChanged);
		// click on indicator
		elIndicator.addEventListener("click", indicatorClick);
	});

	/*
	 * Cleaning up before closing page
	 */
	page.addEventListener("pagebeforehide", function() {
		if (selector) {
			selector.destroy();
		}

		document.removeEventListener("selectoritemchange", selectorItemChanged);
	});

}());
