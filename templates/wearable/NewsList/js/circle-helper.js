/*global tau */
/*jslint unparam: true */
(function(tau) {
	var page,
		elScroller,
		list,
		listHelper = [],
		snapList = [],
		i, len;

	if (tau.support.shape.circle) {
		document.addEventListener("pagebeforeshow", function (e) {
			page = e.target;
			elScroller = page.querySelector(".ui-scroller");
			if (elScroller) {
				list = elScroller.querySelectorAll(".ui-listview");
				if (list) {
					if (page.id !== "pageMarqueeList" && page.id !== "pageTestVirtualList" && page.id !== "pageAnimation") {
						len = list.length;
						for (i = 0; i < len; i++) {
							listHelper[i] = tau.helper.SnapListStyle.create(list[i]);
						}
						len = listHelper.length;
						if (len) {
							for (i = 0; i < len; i++) {
								snapList[i] = listHelper[i].getSnapList();
							}
						}
					}
					elScroller.setAttribute("tizen-circular-scrollbar", "");
				}
			}
		});

		document.addEventListener("pagebeforehide", function (e) {
			len = listHelper.length;
			if (len) {
				for (i = 0; i < len; i++) {
					listHelper[i].destroy();
				}
				listHelper = [];
			}
			if(elScroller) {
				elScroller.removeAttribute("tizen-circular-scrollbar");
			}
		});
	}
}(tau));
