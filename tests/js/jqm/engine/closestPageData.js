module("jqm/engine", {});

test ( "closestPageData" , function () {
	var elem1 = document.getElementById("elem1"),
		elem2 = document.getElementById("elem2"),
		pageElem = document.getElementById("test1"),
		page = ej.engine.instanceWidget(pageElem, tau.getConfig('pageWidget'));

	equal($.mobile.closestPageData(elem1), page, "element: Compare with page");
	equal($.mobile.closestPageData(elem2), page, "element: Compare with page");
	equal($.mobile.closestPageData(elem2).options.theme, page.options.theme, "Compare theme option");
	equal($.mobile.closestPageData(pageElem), page, "page: Compare with page");
});
