/*global window, define, $, jQuery, ej, ok, equal, deepEqual, test, stop, start */
/*jslint nomen: true, browser: true*/
/*
 * Unit Test: Notification
 *
 * Michał Szepielak <m.szepielak@samsung.com>
 */
'use strict';
module("support/mobile/widget/Notification", {
	teardown: function () {
		ej.engine._clearBindings();
	}
});

var unit_notification = function (element, type, icon, interval) {

	function checkWidgetStructure(widget, element, type) {
		var wrapper = element.firstElementChild,
			text1,
			text2,
			button,
			button_wgt;

		ok((wrapper.classList.contains('ui-' + type) && widget._ui.wrapper === wrapper), "[HTML] Wrapper build");
		switch (type) {
		case 'ticker':
			if (icon === true) {
				ok(widget._ui.iconImg[0].classList.contains('ui-ticker-icon'), "[HTML] Icon was build");
				text1 = wrapper.firstElementChild.nextElementSibling;
			} else {
				text1 = wrapper.firstElementChild;
			}
			text2 = text1.nextElementSibling;

			ok(text1.classList.contains('ui-ticker-text1-bg') && text1 === widget._ui.texts[0], "[HTML] First line was build");
			ok(text2.classList.contains('ui-ticker-text2-bg') && text2 === widget._ui.texts[1], "[HTML] Second line was build");

			button = text2.nextElementSibling;
			button_wgt = ej.engine.getBinding(button.firstElementChild, "Button");
			ok(button.classList.contains('ui-ticker-btn'), "[HTML] Button container build");
			ok(button_wgt.name === 'Button', "[HTML] Button widget created");
			break;

		case "smallpopup":
			ok(wrapper.firstElementChild.classList.contains('ui-smallpopup-text-bg'), "[HTML] First was line build");
			break;
		}

		return true;
	}

	var notification,
		texts,
		el;

	/* Create */
	notification = ej.engine.instanceWidget(element, 'Notification');
	ok(notification.name === 'Notification', "Create notification object");

	/* Check widget structure */
	checkWidgetStructure(notification, element, type, icon);

	/* Open */
	notification.open();
	ok(notification._ui.wrapper.classList.contains("show"), "[API] Opened");

	/* Close */
	notification.close();
	ok(notification._ui.wrapper.classList.contains("hide"), "[API] Closed");

	/* Refresh */
	notification.open();
	notification.refresh();
	ok(notification._ui.wrapper.classList.contains("fix"), "[API] Refreshed");

	/* Get Text */
	if (type === "smallpopup") {
		deepEqual(notification.text(), ["text1", null], "[API] Get Texts if smallpopup");
	} else {
		deepEqual(notification.text(), ["text1", "text2"], "[API] Get Texts if not smallpopup");
	}

	/* Change text */
	texts = notification._ui.texts;
	if (type === "smallpopup") {
		notification.text("Only 1 line");
		equal(texts[0].innerHTML, "Only 1 line", "[API] Text was changed");
	} else {
		notification.text("Line 1", "Line 2");
		equal(texts[0].innerHTML, "Line 1", "[API] First line was changed");
		equal(texts[1].innerHTML, "Line 2", "[API] Second line was changed");
	}

	if (icon === true) {
		/* Icon change */
		notification.icon('icon-change.png');
		el = notification._ui.wrapper.getElementsByTagName('img')[0];
		equal(el.getAttribute('src'), "icon-change.png", "[API] Icon was changed");
	}

	/* Hide when click */
	notification.open();
	ej.event.trigger(notification.element, 'vmouseup');
	ok(notification._ui.wrapper.classList.contains("hide"), "[Event] vmouseup");

	if (interval === true) {
		/* Check interval */
		notification.close();
		stop();
		notification.open();
		setTimeout(function () {
			ok(notification._ui.wrapper.classList.contains("hide"), "[INTERVAL] Closed by interval");
			start();
		}, 101);
	}
};

/**
 * Tests
 */

test("Ticker", function () {
	unit_notification(document.getElementById("ticker"), "ticker", false, false);
});

test("Ticker with icon", function () {
	unit_notification(document.getElementById("ticker-icon"), "ticker", true, false);
});

test("Ticker with interval", function () {
	unit_notification(document.getElementById("ticker-interval"), "ticker", false, true);
});

test("Ticker with icon & interval", function () {
	unit_notification(document.getElementById("ticker-icon-interval"), "ticker", true, true);
});

test("Smallpopup", function () {
	unit_notification(document.getElementById("smallpopup"), "smallpopup", false, false);
});

test("Smallpopup with interval", function () {
	unit_notification(document.getElementById("smallpopup-interval"), "smallpopup", false, true);
});