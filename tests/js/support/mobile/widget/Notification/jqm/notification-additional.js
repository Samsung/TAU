/*
 * Unit Test : Notification
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
(function ($) {
	module("Notification");

	var unit_notification = function (widget, type) {
		var notification,
			elem = ".ui-" + type,
			text,
			closebutton;

		/* Create */
		widget.notification();

		notification = widget.children(elem);
		ok(notification, "Create");

		/*markup check*/
		if (type == " ticker") {
			ok(notification.find(".ui-ticker-btn"), "makrup Check : Close button") ;
			ok(notification.find(".ui-ticker-btn").find(":jqmData(role=button)"), "makrup Check : Close button present") ;
			equal(notification.find(".ui-ticker-btn").find(":jqmData(role=button)").text(), "Close", "makrup Check : Close button text") ;
			ok(notification.find(".ui-ticker").find(".ui.ticker-text1-bg"), "makrup Check : ticker text present") ;
			ok(notification.find(".ui-ticker").find(".ui.ticker-text2-bg"), "makrup Check : ticker text present") ;
			ok(notification.find(".ui-ticker").find("img.ui-ticker-icon").length > 0, "makrup Check : ticker icon present") ;
		} else {
			ok(notification.find(".ui-smallpopup"), "makrup Check : smapll popup") ;
			ok(notification.find(".ui-smallpopup").find(".ui.smallpopup-text-bg"), "makrup Check : popup text present") ;
		}

		/* Open */
		widget.notification("open");
		notification = widget.children(elem);
		ok(notification.hasClass("show"), "API : open");

		/* Close */
		widget.notification("close");
		notification = widget.children(elem);
		ok(notification.hasClass("hide"), "API : close");

		/* hide when click */
		widget.notification("open");
		notification = widget.children(elem);

		/*for coverage open notification when it is already open*/
		widget.notification("open");
		notification.trigger("vmouseup");
		notification = widget.children(elem);
		ok(notification.hasClass("hide"), "Hide when click the notification");

		if (type == " ticker") {
			widget.notification("open");
			closebutton = widget.find(":jqmData(role=button)");
			closebutton.trigger("vmouseup");
			notification = widget.children(elem);
			ok(notification.hasClass("hide"), "Hide when click on the close button");
		}

		text = notification.children("p");
		if (type !== "smallpopup") {
			ok($(text[0]).hasClass("ui-ticker-text1-bg"), "Top Text");
			ok($(text[1]).hasClass("ui-ticker-text2-bg"), "Bottom Text");

			widget.notification("text", "Text31", "Text32");
			ok($(text[0]).hasClass("ui-ticker-text1-bg"), "Text31", "API : text- ticker");
			ok($(text[1]).hasClass("ui-ticker-text2-bg"), "Text32", "API : text- ticker");
			equal(text[0].innerHTML, "Text31", "API : text - ticker");
			equal(text[1].innerHTML, "Text32", "API : text - ticker");
			equal(widget.notification("text")[0], "Text31", "API : text - ticker");
			equal(widget.notification("text")[1], "Text32", "API : text - ticker");

			/*icon*/
			equal(widget.jqmData("icon"), "02_icon.png", "API : icon , initial check") ;
			widget.notification("icon", "03_icon.png");
			equal(widget.find("img").attr("src"), "03_icon.png", "API : icon , new icon is set") ;
		}
		/*destroy*/
		widget.notification("destroy");
		notification = widget.children(elem);
		ok(!notification.hasClass("show") || !notification.hasClass("hide"), "destroy check");
	};

	test("smallpopup", function () {
		$("#notifiaction0").page();
		unit_notification($("#smallpopup"), "smallpopup");
		unit_notification($("#smallpopup2"), "smallpopup");
		unit_notification($("#smallpopup3"), "smallpopup");
	});

	test("tickernoti", function () {
		$("#notifiaction1").page();
		unit_notification($("#tickernoti"), "ticker");
		unit_notification($("#tickernoti2"), "ticker");
		unit_notification($("#tickernoti3"), "ticker");
	});
}(jQuery));
