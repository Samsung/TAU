(function () {
	var page = document.getElementById("switch-demo"),
		switch1 = document.getElementById("switch-1"),
		switch2 = document.getElementById("switch-2"),
		switchResult1 = document.getElementById("switch-result-1"),
		switchResult2 = document.getElementById("switch-result-2");

	page.addEventListener("pagehide", onPageHide);
	page.addEventListener("pageshow", onPageShow);

	function onPageShow() {
		switch1.addEventListener("change", function () {
			switchResult1.innerHTML = switch1.value;
		});
		switch2.addEventListener("change", function () {
			switchResult2.innerHTML = switch2.value;
		});
	}

	function onPageHide() {
		page.removeEventListener("pageshow", onPageShow);
		page.removeEventListener("pagehide", onPageHide);
	}
}());