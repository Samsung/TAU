(function(tau) {
	var page = document.getElementById("scrollbarPage"),
		handler = page.querySelector(".ui-scrollhandler"),
		widget = null;

	page.addEventListener("pageshow", function() {
		var widget = tau.engine.getBinding(handler);

		widget.scrollTo(0, 154);
	});

}(window.tau));
