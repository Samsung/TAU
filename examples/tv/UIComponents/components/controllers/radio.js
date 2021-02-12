(function () {
	/**
	 * page - Radio page element
	 * radios - NodeList object for radios
	 * radioresult - Indicator for active radio
	 */
	var page = document.getElementById("radio-demo"),
		idx,
		radios = document.querySelectorAll("input[name='radio-group']"),
		radioText1 = document.getElementById("radio-text-1"),
		radioText2 = document.getElementById("radio-text-2");

	/**
	 * Updates text for an selected radio
	 * @param {HTMLElement} target
	 */
	function setRadioResultFromTarget(target) {
		if (target.id == "radio-1") {
			radioText1.innerHTML = "Radio on";
			radioText2.innerHTML = "Radio off"
		} else if (target.id == "radio-2") {
			radioText1.innerHTML = "Radio off";
			radioText2.innerHTML = "Radio on"
		}
	}

	/**
	 * pageshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pageshow", function () {
		for (idx = 0; idx < radios.length; idx++) {
			radios[idx].addEventListener("change", function (event) {
				setRadioResultFromTarget(event.target);
			});
		}
	});
}());
