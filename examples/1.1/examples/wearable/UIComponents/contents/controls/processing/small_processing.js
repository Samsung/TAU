var page = document.getElementById("smallProcessingPage");

page.addEventListener("pageshow", function (event) {
	var page = event.target,
		processing = page.querySelector(".ui-processing");

	processing.style.visibility = "";
}, false);

page.addEventListener("pagebeforehide", function (event) {
	var page = event.target,
		processing = page.querySelector(".ui-processing");

	processing.style.visibility = "hidden";
}, false);