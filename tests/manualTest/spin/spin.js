/* global tau */
(function () {
	var page = document.getElementById("spin-demo"),
		spinElement = page.querySelector(".ui-spin"),
		slider = document.getElementById("digits-slider"),
		inputBound,
		spin;

	page.addEventListener("pagebeforeshow", function () {
		inputBound = onInput.bind(null);
		spin = tau.widget.Spin(spinElement);
		slider.addEventListener("input", inputBound, false);
	});

	function onInput(event) {
		var newVal = parseInt(event.target.value);

		spin.option("digits", newVal);
	}

	page.addEventListener("pagebeforehide", function () {
		slider.removeEventListener("input", inputBound);
		spin.destroy();
	});
})();
