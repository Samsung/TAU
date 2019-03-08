(function () {
	var page = document.getElementById("page-slider-119-ce");

	page.addEventListener("pageshow", function () {
		var sliderContainers = page.querySelectorAll(".active .ui-slider-handler");

		Array.prototype.forEach.call(sliderContainers, function (slider) {
			slider.classList.add("ui-slider-handler-active");
		});
	});
}());