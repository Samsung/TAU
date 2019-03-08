/*
 * mobile page unit tests
 */
(function ($) {
	var libName = "jquery.mobile.page.sections";

	module(libName);

	test("nested header anchors aren't altered", function () {
		ok(!$(".ui-header > div > a").hasClass("ui-btn"));
	});

	test("nested footer anchors aren't altered", function () {
		ok(!$(".ui-footer > div > a").hasClass("ui-btn"));
	});

	test("no auto-generated back button exists on first page", function () {
		ok(!$(".ui-header > :jqmData(rel='back')").length);
	});

})(jQuery);
