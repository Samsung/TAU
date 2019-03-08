/*
 * Unit Test: Header Footer
 *
 *
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
$(document).ready(function () {

	module("Header Footer", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	var unit_headerfooter_test = function (widget, type) {
		var html;

		/*Markuo check*/
		equal(widget.hasClass('ui-' + type), true, "Markup check");

		equal(widget.jqmData('position'), 'fixed', "jqmData - position");
		equal($('.ui.page-active').find('.ui-footer a.ui-btn-back').length, 0, "markup check back button present");
		equal(widget.css('display'), 'block', "CSS check for display");

		/*hide show API*/
		widget.hide();
		equal(widget.css('display'), 'none', "API hide");
		widget.show();
		equal(widget.css('display'), 'block', "API show");

		/*add text */
		html = "<h1>Sample text</h1>";
		widget.html(html);
		$('.ui.page-active').page('refresh');
		equal(widget.html() , html, "Markup check after adding text");
	};

	test("Header", function () {
		// trigger pagecreate
		$("#headerfooter-unit-test").page();
		unit_headerfooter_test($("#headerfooter-unit-test").find(':jqmData(role=header)') , 'header');

	});

	test("footer", function () {
		// trigger pagecreate
		$("#headerfooter-unit-test-footer").page();
		unit_headerfooter_test($("#headerfooter-unit-test-footer").find(':jqmData(role=footer)'), 'footer');

	});

});
