/*global tau */
/*jslint unparam: true */
(function(){
	var page = document.getElementById("one"),
		listHelper,
		elScroller;

	page.addEventListener("pagebeforeshow", function () {
		var list;

		elScroller = page.querySelector(".ui-scroller");
		if (elScroller) {
			list = elScroller.querySelector(".ui-listview");
			if (list) {
				listHelper = tau.helper.SnapListStyle.create(list, {animate: "scale"});
			}
			elScroller.setAttribute("tizen-circular-scrollbar", "");
		}

	});

	page.addEventListener("pagebeforehide", function () {
		if (listHelper) {
			listHelper.destroy();
			listHelper = null;
		}
		if (elScroller) {
			elScroller.removeAttribute("tizen-circular-scrollbar");
		}
	});
}());