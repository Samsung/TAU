/* global tau */
(function () {
	var page = document.getElementById("chips-add-page"),
		input = page.querySelector(".chip-content"),
		addButton = page.querySelector(".add-button"),
		chips = page.querySelector(".ui-chips");

	page.addEventListener("pagehide", onPageHide);
	page.addEventListener("pageshow", onPageShow);

	function addChip(name) {
		var chip = document.createElement("div");

		chip.classList.add("ui-chip");
		chip.textContent = name;

		chips.appendChild(chip);
		tau.widget.Chip(chip);
	}

	function onPageShow() {
		addButton.addEventListener("vclick", function () {
			addChip(input.value);
			input.value = "";
		});
	}

	function onPageHide() {
		page.removeEventListener("pageshow", onPageShow);
		page.removeEventListener("pagehide", onPageHide);
	}
}());