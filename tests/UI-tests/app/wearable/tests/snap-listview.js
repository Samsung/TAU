/* global tau */
(function () {
	var page = document.getElementById("page-snap-listview-ce"),
		listHelper;

	page.addEventListener("pagebeforeshow", function () {
		var list;

		list = page.querySelector(".ui-listview");

		if (list) {
			listHelper = tau.helper.SnapListStyle.create(list, {animate: "scale"});
		}
	});

	page.addEventListener("pagebeforehide", function () {
		if (listHelper) {
			listHelper.destroy();
			listHelper = null;
		}
	});
}());