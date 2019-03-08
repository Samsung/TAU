/*global window, define, $, jQuery, ej, ok, equal, test */
/*jslint nomen: true, browser: true*/
/*
 * Unit Test: Notification
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($) {
	'use strict';
	module("Notification");

	var unit_notification = function (widget, type) {
		var notification,
			elem = ".ui-" + type,
			text;

		/* Create */
		widget.notification();

		notification = widget.children(elem);
		ok(notification, "Create");

		/* Open */
		widget.notification("open");

		notification = widget.children(elem);
		ok(notification.hasClass("show"), "API: open");

		/* Close */
		widget.notification("close");

		notification = widget.children(elem);
		ok(notification.hasClass("hide"), "API: close");

		/* hide when click */
		widget.notification("open");
		notification = widget.children(elem);
		notification.trigger("vmouseup");

		notification = widget.children(elem);
		ok(notification.hasClass("hide"), "Hide when click the notification");

		text = notification.children("p");

		if (type !== "smallpopup") {
			ok($(text[0]).hasClass("ui-ticker-text1-bg"), "Top Text");
			ok($(text[1]).hasClass("ui-ticker-text2-bg"), "Bottom Text");
		}
	};

	test("smallpopup", function () {
		unit_notification($("#smallpopup"), "smallpopup");
	});

	test("tickernoti", function () {
		unit_notification($("#tickernoti"), "ticker");
	});
}(jQuery));