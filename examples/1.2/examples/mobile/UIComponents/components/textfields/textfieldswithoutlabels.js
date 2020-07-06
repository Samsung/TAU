(function () {
	var page = document.getElementById("textinput-demo"),
		textInputs = document.querySelectorAll(".input-hint");

	function onFocus(event) {
		event.target.placeholder = "Hint text Activated";
	}

	function onBlur(event) {
		event.target.placeholder = "Hint text Inactive";
	}

	page.addEventListener("pageshow", function () {
		textInputs.forEach((element) => {
			element.addEventListener("focus", onFocus);
			element.addEventListener("blur", onBlur);
		});
	});
})();