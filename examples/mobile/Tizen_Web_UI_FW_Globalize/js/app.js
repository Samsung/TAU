/*global tau, Globalize */
/* eslint no-console: off */
(function () {
	/**
	 * globalize - TAU globalization utility
	 * selector - Select element for choosing a language
	 * list - List for test
	 * currentLanguage - Indicator for current language information
	 * calendarData - Calendar data element
	 * calendarDataArea - Indicator for calendar data
	 */
	var globalize = tau.util.globalize,
		selector,
		list,
		currentLanguage,
		calendarData;

	/**
	 * Inserts the calendar data elements
	 * @private
	 * @param {string} inp
	 */
	function output(inp) {
		calendarData.innerHTML = "<pre>" + inp + "</pre>";
	}

	/**
	 * Puts a class for syntax highlighting
	 * @private
	 * @param {string} json
	 */
	function syntaxHighlight(json) {
		json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		/*jslint regexp: true*/
		return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
			/*jslint regexp: false*/
			var cls = "number";
			/* Starting with " and Ending with : is key, or string */

			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					cls = "key";
				} else {
					cls = "string";
				}
			} else if (/true|false/.test(match)) {
				cls = "boolean";
			} else if (/null/.test(match)) {
				cls = "null";
			}
			return "<span class=\"" + cls + "\">" + match + "</span>";
		});
	}

	/**
	 * Updates the selected locale information to UI
	 * @private
	 * @param {Object} selectedLocaleInstance
	 */
	function updateLocaleToUI(selectedLocaleInstance) {
		var number = selectedLocaleInstance.numberFormatter(),
			calendarData = JSON.stringify(selectedLocaleInstance.getCalendar().months.format.wide, undefined, 4),
			currencyUnit = null;

		list[0].innerText = selectedLocaleInstance.formatMessage("greeting/hello");
		list[1].innerText = selectedLocaleInstance.formatMessage("greeting/bye");
		list[2].innerText = selectedLocaleInstance.formatDate(new Date(), { datetime: "medium"});
		list[3].innerText = number(123456.789);
		list[4].innerText = selectedLocaleInstance.formatMessage("longText");
		switch (selectedLocaleInstance.getLocale()) {
			case "ko":
				currencyUnit = "KRW";
				break;
			case "en":
				currencyUnit = "USD";
				break;
			case "ar":
				currencyUnit = "EGP";
				break;
			case "zh":
				currencyUnit = "CNY";
				break;
		}
		list[5].innerText = Globalize.formatCurrency(69900, currencyUnit);

		/* Updates the text of current language element */
		currentLanguage.innerHTML = selectedLocaleInstance.getLocale();
		output(syntaxHighlight(calendarData));
	}

	/**
	 * Sets the locale information
	 * @private
	 * @param {Object} selected
	 */
	function setLocale(selected) {
		var locale = selected.value;

		globalize.setLocale(locale)
			.done(updateLocaleToUI)
			.fail(function () {
				console.log("failed");
			});
	}

	/**
	 * Back key event handler
	 */
	window.addEventListener("tizenhwkey", function (ev) {
		var activePopup = null,
			page = null,
			pageid = "";

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			page = document.getElementsByClassName("ui-page-active")[0];
			pageid = page ? page.id : "";

			if (pageid === "main" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});

	/**
	 * pageinit event handler
	 * Do preparatory works
	 */
	document.addEventListener("pageinit", function () {
		selector = document.querySelector("#select-language");
		list = document.querySelectorAll("li.test");
		currentLanguage = document.querySelector("#currentLanguage");
		calendarData = document.querySelector("#calendarData");
	});

	/**
	 * pageshow event handler
	 * Do preparatory works and adds event listeners
	 */
	document.addEventListener("pageshow", function () {
		setLocale(selector);
		selector.addEventListener("change", function () {
			setLocale(selector);
		});
	});
}());