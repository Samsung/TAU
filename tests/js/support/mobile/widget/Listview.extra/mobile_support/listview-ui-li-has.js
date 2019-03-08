/*jslint nomen: true */
/*global window:false, document:false,
 test:false, ok:false, module:false,
 $:false, console:false */
(function (document, ej) {
	"use strict";
	module("profile/mobile/widget/mobile/Listview", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test("Presence of ui-li-has- classes", function () {
		var page = $("#ui-li-has-test"),
			items = page.find("li");

		ok(items.eq(0).hasClass("ui-li-has-count"), "First LI should have ui-li-has-count class");
		ok(!items.eq(1).hasClass("ui-li-has-count"), "Second LI should NOT have ui-li-has-count class");
		ok(!items.eq(2).hasClass("ui-li-has-count"), "Third LI should NOT have ui-li-has-count class");
		ok(!items.eq(2).hasClass("ui-li-has-arrow"), "Third LI should NOT have ui-li-has-arrow class");
		ok(items.eq(3).hasClass("ui-li-has-count"), "Fourth LI should have ui-li-has-count class");
		ok(!items.eq(3).hasClass("ui-li-has-arrow"), "Fourth LI should NOT have ui-li-has-arrow class");
		ok(!items.eq(4).hasClass("ui-li-has-count"), "Fifth LI should NOT have ui-li-has-count class");
		ok(!items.eq(4).hasClass("ui-li-has-arrow"), "Fifth LI should NOT have ui-li-has-arrow class");
	});
}(document, window.ej));

