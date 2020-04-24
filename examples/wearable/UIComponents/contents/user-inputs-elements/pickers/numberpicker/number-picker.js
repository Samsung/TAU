/*global tau */
(function () {
	var pickerType = typeOfNumberPicker(),
		page,
		element,
		widget,
		SAVED_NUMBER_KEY;

	if (pickerType === "sample") {
		page = document.getElementById("number-picker-page");
		element = document.getElementById("sample-number-picker");
		SAVED_NUMBER_KEY = "SAVED-NUMBER-FROM-PICKER-SIMPLE-KEY";
	} else if (pickerType === "accelerated") {
		page = document.getElementById("accelerated-number-picker-page");
		element = document.getElementById("accelerated-number-picker");
		SAVED_NUMBER_KEY = "SAVED-NUMBER-FROM-PICKER-ACCELERATED-KEY";
	}

	page.addEventListener("pagebeforeshow", init);
	page.addEventListener("pagehide", onPageHide);

	function init() {
		var savedNumberValue = window.sessionStorage.getItem(SAVED_NUMBER_KEY);

		widget = tau.widget.NumberPicker(element);
		element.addEventListener("change", onChange);

		if (savedNumberValue) {
			widget.value(savedNumberValue);
		}
	}

	function onPageHide() {
		element.removeEventListener("change", onChange);
		widget.destroy();
	}

	function onChange(event) {
		window.sessionStorage.setItem(SAVED_NUMBER_KEY, event.detail.value);
	}

	function typeOfNumberPicker() {
		if (document.getElementById("sample-number-picker")) {
			return "sample";
		} else if (document.getElementById("accelerated-number-picker")) {
			return "accelerated";
		}
	}
}());
