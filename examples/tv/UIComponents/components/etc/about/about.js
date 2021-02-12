(function (document, tau) {
	var page = document.getElementById("version-page"),
		version = page.querySelector("#tau-version")

	function onPageShow() {
		version.innerText = tau.version;
	}

	page.addEventListener("pagebeforeshow", onPageShow);
}(window.document, window.tau));
