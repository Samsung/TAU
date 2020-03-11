(function () {
	/**
	 * page - Checkbox page element
	 * checkone - Checkbox element
	 * checkboxResult - Indicator for the checkbox state
	 * favortieone - Favorite checkbox element
	 * favoriteResult - Indicator for the favorite checkbox state
	 */
	var page = document.getElementById("checkbox-demo"),
		checkboxes = document.querySelectorAll(".checkboxes"),
		idx,
		checkboxText1 = document.getElementById("checkbox-text-1"),
		checkboxText2 = document.getElementById("checkbox-text-2");

	/**
	 * Updates text for an selected radio
	 * @param {HTMLElement} target
	 */
	function setCheckboxResultFromTarget(target) {
		var result;

		if (target.checked) {
			result = "Check on";
		} else {
			result = "Check off"
		}

		if (target.name == "checkbox-1") {
			checkboxText1.innerHTML = result;
		} else if (target.name == "checkbox-2") {
			checkboxText2.innerHTML = result;
		}
	}

	/**
	 * pageshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pageshow", function () {
		for (idx = 0; idx < checkboxes.length; idx++) {
			checkboxes[idx].addEventListener("change", function (event) {
				setCheckboxResultFromTarget(event.target);
			})
		}
	});
}());