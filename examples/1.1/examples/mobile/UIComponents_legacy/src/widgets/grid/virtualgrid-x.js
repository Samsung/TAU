/*global jQuery*/
/*jslint unparam: true */
(function ($) {
	"use strict";

	$("div.virtualgrid_grid_demo").one("pagecreate", function () {
		$.getScript("virtualgrid-db-demo.js", function () {
			$(":jqmData(role='virtualgrid')").virtualgrid("create", {
				orientation: "x",
				itemData: function (idx) {
					return window.JSON_DATA[idx];
				},
				numItemData: window.JSON_DATA.length,
				cacheItemData: function () {
					return;
				}
			});
		});
	});
}(jQuery));