/*global tau, $*/

(function () {

	var page,
		button;

	function addItem() {
		var newLiElement = $("<li></li>").get(0),
			// get listview widget instance
			listview = tau.widget.Listview(document.getElementById("list"));

		listview.addItem("item content", null, newLiElement);
	}

	document.addEventListener("pagebeforeshow", function (ev) {
		page = ev.target;
		button = document.getElementById("button-add");
		button.addEventListener("click", addItem);
	}, true);

	window.addEventListener("tizenhwkey", function (ev) {
		var activePopup = null,
			pageId = "";

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");

			pageId = page ? page.id : "";

			if (pageId === "main" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});
}());