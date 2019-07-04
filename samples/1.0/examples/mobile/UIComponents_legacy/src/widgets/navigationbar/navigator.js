/*global $,tau,navigationHistory */
/*jslint unparam: true */
(function () {
	var historyMaker = function (event) {
		//make browsing history be stored in navigationHistory array.
			var iteration = window.navigationHistory.length,
				i = 0,
				targetId = event.target.id;

			if (!iteration) {
				navigationHistory.push({
					pageId: targetId
				});
			} else {
				for (i = 0; i < iteration; i++) {
					if (targetId === navigationHistory[i].pageId) {
						navigationHistory.splice(i + 1, iteration - i - 1);
						break;
					}
				}
				if (i >= iteration) {
					navigationHistory.push({
						pageId: targetId
					});
				}
			}
		},
		historyMove = function (event) {
			var selectedIndex = event.originalEvent.detail,
				barLength = navigationHistory.length;

		//clear unnecessary array of history out
			navigationHistory.splice(selectedIndex + 1, barLength - selectedIndex);
			history.go(-(barLength - selectedIndex) + 1);
		},
		historyDrawer = function (event) {
			var pageId = event.target.id,
				page = document.getElementById(pageId),
				navi = page.getElementsByClassName("ui-navigation")[0],
				naviWidget = tau.widget.Navigation(navi);

			if (page.getElementsByClassName("ui-navigation-ul")[0]
				.childElementCount) {
				tau.warn("Create method should be called only once in a page");
			} else {
				naviWidget.create(navigationHistory);
			}
			$(navi).one("navigate", historyMove);
		};

	window.navigationHistory = window.navigationHistory || [];

	$(document).one("pagebeforeshow", historyMaker);
	$(document).one("pageshow", historyDrawer);
}());
