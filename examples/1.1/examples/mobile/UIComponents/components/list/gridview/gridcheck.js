(function () {
	var list = document.getElementById("gridview"),
		checkboxes = list.querySelectorAll("input[type='checkbox']"),
		elSelectAll = document.getElementById("select-all"),
		page = document.getElementById("grid-check-page"),
		isAll = false;

	/**
	 * Selects/deselects all items
	 */
	function selectAll() {
		var i,
			len;

		for (i = 0, len = checkboxes.length; i < len; i++) {
			checkboxes[i].checked = !isAll;
		}
		isAll = !isAll;
	}

	/**
	 * Change event listener
	 * Checks if all checkbox are selected
	 * and if true sets state of selectAll checkbox
	 */
	function onCheckboxChange() {
		var uncheckedElements = list.querySelectorAll("input[type='checkbox']:not(:checked)");

		isAll = uncheckedElements.length === 0;
		elSelectAll.checked = isAll;
	}

	page.addEventListener("pagebeforeshow", function () {
		list.addEventListener("change", onCheckboxChange);
		elSelectAll.addEventListener("change", selectAll);
	});

	page.addEventListener("pagebeforehide", function () {
		list.removeEventListener("change", onCheckboxChange);
		elSelectAll.removeEventListener("change", selectAll);
	});
}());

