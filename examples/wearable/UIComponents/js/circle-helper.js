/*global tau */
/*jslint unparam: true */
document.addEventListener("tauinit", function () {

	// This logic works only on circular device.
	if (tau.support.shape.circle) {
		/**
		 * pagebeforeshow event handler
		 * Do preparatory works and adds event listeners
		 */
		document.addEventListener("pagebeforeshow", function (event) {
			/**
			 * page - Active page element
			 * list - NodeList object for lists in the page
			 */
			var page = event.target,
				pageWidget = tau.widget.Page(page),
				pageId = page.id,
				list;

			if (pageWidget.option("enablePageScroll")) {
				if (page.classList.contains("ui-scrollhandler")) {
					tau.util.rotaryScrolling.enable(page);
				} else {
					tau.util.rotaryScrolling.enable(page.querySelector(".ui-scroller"));
				}
			}

			if (!page.classList.contains("page-snaplistview") &&
				pageId !== "page-snaplistview" &&
				pageId !== "page-swipelist" &&
				pageId !== "page-marquee-list" &&
				pageId !== "page-multiline-list" &&
				pageId !== "assist-panel-page") {
				list = page.querySelector(".ui-listview");
				if (list) {
					tau.widget.Listview(list);
				}
			}
		}, true);
		document.addEventListener("pagebeforehide", function (event) {
			var page = event.target,
				pageWidget = tau.widget.Page(page);

			if (pageWidget.option("enablePageScroll")) {
				if (page.classList.contains("ui-scrollhandler")) {
					tau.util.rotaryScrolling.disable(page);
				} else {
					tau.util.rotaryScrolling.disable(page.querySelector(".ui-scroller"));
				}
			}
		});
		document.addEventListener("popupshow", function (event) {
			var popup = event.target,
				list = popup.querySelector(".ui-listview");

			if (list) {
				tau.widget.Listview(list);
			}
			tau.util.rotaryScrolling.enable(popup.querySelector(".ui-popup-wrapper"));
		});
		document.addEventListener("popuphide", function () {
			var list = event.target.querySelector(".ui-listview");

			if (list) {
				tau.engine.getBinding(list).destroy();
			}
			tau.util.rotaryScrolling.disable();
		});
	}
});
