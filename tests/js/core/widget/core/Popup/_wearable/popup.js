/*global window, console, test, equal, module, ej, asyncTest, start, HTMLElement, HTMLDivElement */
/*jslint nomen: true */
(function (window, document) {
	"use strict";

	var INSTANCE_WIDGET = "Popup",
		page = null,
		popup1Link = null,
		popup1 = null,
		popup1Widget = null,
		PopupClass = ej.widget.core.Popup,
		engine = ej.engine;

	module("core/widget/core/Popup", {
		setup: function () {
			popup1Link = document.getElementById("popup1Link");
			popup1 = document.getElementById("popup1");
			page = document.getElementById("test");

			// @TODO! there is problem with closing popup between tests!
			engine.getRouter().getRoute("popup").activePopup = null;

		},
		teardown: function () {
			engine._clearBindings();
		}
	});

	function testPopupMarkup(popup, element) {
		var opts = popup.options,
			ui = popup._ui,
			header = ui.header,
			footer = ui.footer,
			content = ui.content;

		equal(popup instanceof PopupClass, true, "Popup is instance of ns.widget.wearable.Popup");
		equal(popup.element, element, "Popup element is the same as starting markup element");

		if (opts.header !== false) {
			equal(header instanceof HTMLDivElement, true, "header is a HTMLDivElement");
			equal(header.classList.contains(PopupClass.classes.header), true, "header contains proper class");
			if (typeof opts.header !== "boolean") {
				equal(opts.header, header.innerHTML, "header has content properly set");
			}
		}

		if (opts.footer !== false) {
			equal(footer instanceof HTMLDivElement, true, "footer is a HTMLDivElement");
			equal(footer.classList.contains(PopupClass.classes.footer), true, "footer contains proper class");
			if (typeof opts.footer !== "boolean") {
				equal(opts.footer, footer.innerHTML, "footer has content properly set");
			}
		}

		equal(content instanceof HTMLDivElement, true, "content is a HTMLDivElement");
		equal(content.classList.contains(PopupClass.classes.content), true, "content contains proper class");
	}

	function popupshow () {
		popup1.removeEventListener("popupshow", popupshow);
		popup1Widget = engine.getBinding(popup1);
		testPopupMarkup(popup1Widget, popup1);

		popup1Widget.close();
		start();
	}

	function popuphide() {
		popup1.removeEventListener("popuphide", popuphide);

		popup1Widget.destroy();

		popup1 = document.getElementById("popup1");

		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET, {header: "test content header", footer: "test footer content"});

		testPopupMarkup(popup1Widget, popup1);
		popup1Widget.close();
		start();
	}

	function popupshowOptions () {
		popup1.removeEventListener("popupshow", popupshowOptions);
		popup1.addEventListener("popuphide", popuphide);
		popup1Widget = engine.getBinding(popup1);

		testPopupMarkup(popup1Widget, popup1);
		popup1Widget.close();

		// lets try to imitate built widget and test that
	}


	if (!window.navigator.userAgent.match("PhantomJS")) {
		asyncTest("test popup close transition slideup", 3, function () {
			tau.event.one(page, "pageshow", function() {
				var callbackFinished = function () {
						// this equal is just for qunit not to complain
						popup1.removeEventListener(PopupClass.events.hide, callbackFinished);
						equal(true, true, "hide properly run");
						start();
					},
					callbackPre = function () {
						// this equal is just for qunit not to complain
						popup1.removeEventListener(PopupClass.events.before_hide, callbackPre);
						equal(true, true, "before hide properly run");
					},
					callbackOpen = function () {
						popup1.removeEventListener(PopupClass.events.show, callbackOpen);
						equal(true, true, "open properly");
						popup1Widget = engine.getBinding(popup1);
						popup1Widget.close({
							transition: "slideup"
						});
					};

				popup1.addEventListener(PopupClass.events.hide, callbackFinished);
				popup1.addEventListener(PopupClass.events.before_hide, callbackPre);

				popup1.addEventListener(PopupClass.events.show, callbackOpen);
				popup1Link.click();
			});
			engine.run();
		});

		asyncTest("test popup open transition fade", 2, function () {
			tau.event.one(page, "pageshow", function() {
				var callbackFinished = function () {
						// this equal is just for qunit not to complain
						popup1.removeEventListener(PopupClass.events.show, callbackFinished);
						equal(true, true, "show properly run");
						start();
					},
					callbackPre = function () {
						// this equal is just for qunit not to complain
						popup1.removeEventListener(PopupClass.events.before_show, callbackPre);
						equal(true, true, "before show properly run");
					};

				tau.widget.Popup(popup1);
				popup1Widget = engine.getBinding(popup1);
				popup1.addEventListener(PopupClass.events.show, callbackFinished);
				popup1.addEventListener(PopupClass.events.before_show, callbackPre);
				popup1Widget.open({
					transition: "fade"
				});
			});
			engine.run();
		});

		asyncTest("test popup close onpagehide", 1, function () {
			tau.event.one(page, "pageshow", function() {
				popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
				tau.event.one(popup1, "popuphide", function() {
					ok(true, "Popup is not open");
					start();
				});
				tau.event.one(popup1, PopupClass.events.show, function() {
					tau.event.trigger(page, "pagebeforehide");
				});
				popup1Widget.open();
			});
			engine.run();
		});


		asyncTest("test popup close by click on overlay", 1, function () {
			tau.event.one(page, "pageshow", function() {
				popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
				tau.event.one(popup1, PopupClass.events.hide, function() {
					ok(!popup1Widget._isOpened(), "Popup is not open");
					start();
				});
				tau.event.one(popup1, PopupClass.events.show, function() {
					tau.event.trigger(popup1Widget._ui.overlay, "click");
				});
				popup1Widget.open();
			});
			engine.run();
		});

		asyncTest("positionTo as a object", 1, function() {
			tau.event.one(page, "pageshow", function() {
				popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
				tau.event.one(popup1, PopupClass.events.show, function() {
					ok("Popup is opened");
					popup1Widget.close();
					start();
				});
				popup1Widget.open({positionTo: document.getElementById("popup1Link")});
			});
			engine.run();
		});

		asyncTest("widget creation with header and footer passed by options", function () {
			expect(21);
			tau.event.one(page, "pageshow", function() {
				popup1.addEventListener(PopupClass.events.show, popupshowOptions);
				popup1Widget = engine.getBinding(popup1);
				equal(popup1Widget, null, "widget not created before user click");

				engine.instanceWidget(popup1, INSTANCE_WIDGET, {header: "test content header", footer: "test footer content"});
				popup1Link.click();
			});
			engine.run();
		});

		asyncTest("basic widget creation", function () {
			expect(5);
			tau.event.one(page, "pageshow", function() {
				popup1.addEventListener(PopupClass.events.show, popupshow);
				popup1Widget = engine.getBinding(popup1);
				equal(popup1Widget, null, "widget not created before user click");
				popup1Link.click();
			});
			engine.run();
		});

		asyncTest("widget creation with header and footer in data attributes", function () {
			expect(11);
			tau.event.one(page, "pageshow", function() {
				popup1.addEventListener(PopupClass.events.show, popupshow);
				popup1Widget = engine.getBinding(popup1);
				equal(popup1Widget, null, "widget not created before user click");
				popup1.setAttribute("data-header", "Test header");
				popup1.setAttribute("data-footer", "Test footer");
				popup1Link.click();
			});
			engine.run();
		});

		asyncTest("widget creation with children and widget methods", 8, function () {
			tau.event.one(page, "pageshow", function() {
				var display,
					visibility,
					style = popup1.style;
				popup1.innerHTML = "<span>Hello world!</span>";
				popup1.classList.add(PopupClass.classes.toast);
				popup1Link.click();
				popup1Widget = engine.getBinding(popup1);

				display = style.display;
				visibility = style.visibility;
				ej.event.trigger(window, "resize");
				popup1Widget.close();
				equal(style.display, display, "display the same after refresh");
				equal(style.visibility, visibility, "visibility the same after refresh");

				// recheck refresh if popup was hidden

				display = style.display = "none";
				visibility = style.visibility;
				popup1Widget.refresh();
				equal(style.display, display, "display the same after refresh");
				equal(style.visibility, visibility, "visibility the same after refresh");

				testPopupMarkup(popup1Widget, popup1);
				start();
			});
			engine.run();
		});

		asyncTest("popup hidden before open", 1, function () {
			tau.event.one(page, "pageshow", function() {
				popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
				tau.event.one(popup1, PopupClass.events.hide, function() {
					ok("Popup is hidden");
					start();
				});
				popup1Widget.open({
					transition: "fade"
				});
				popup1Widget._hide();
			});
			engine.run();
		});
	}

	test("set header test", function () {
		expect(3);
		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
		popup1Widget.option("header", "new header");
		equal(popup1Widget._ui.header.innerHTML, "new header", "widget change header to string");
		popup1Widget.option("header", false);
		equal(popup1Widget._ui.header, null, "widget change header to null");
		popup1Widget.option('header', 'new header 2');
		equal(popup1Widget._ui.header.innerHTML, 'new header 2', "widget change header to string");
	});

	test("set footer test", function () {
		expect(3);
		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
		popup1Widget.option("footer", "new footer");
		equal(popup1Widget._ui.footer.innerHTML, "new footer", "widget change footer to string");
		popup1Widget.option("footer", false);
		equal(popup1Widget._ui.footer, null, "widget change footer to null");
		popup1Widget.option('footer', 'new footer 2');
		equal(popup1Widget._ui.footer.innerHTML, 'new footer 2', "widget change footer to string");
	});

	test("set overlay test", function () {
		expect(5);
		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
		popup1Widget.option("overlay", true);
		ok(popup1Widget._ui.overlay, "widget set overlay");
		popup1Widget.option('overlay', false);
		ok(popup1Widget._ui.overlay, "widget has overlay");
		equal(popup1Widget._ui.overlay.style.opacity, "0", "widget has invisible overlay");
		popup1Widget.option('overlay', true);
		ok(popup1Widget._ui.overlay, "widget set overlay");
		equal(popup1Widget._ui.overlay.style.opacity, "", "widget has visible overlay");
	});

	test("set multi options", function () {
		expect(2);
		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);

		popup1Widget.option({
				'header': 'header multi',
				'footer': 'footer multi'
			});
		equal(popup1Widget._ui.header.innerHTML, 'header multi', "widget change header to string");
		equal(popup1Widget._ui.footer.innerHTML, 'footer multi', "widget change footer to string");
	});

	function eventCallback() {
		ok('Event called');
	}

	test("on method", function () {
		expect(1);
		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
		popup1Widget.on("event", eventCallback, false);
		popup1Widget.trigger("event");
	});

	test("off method", function () {
		expect(1);
		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
		popup1Widget.on("event", eventCallback, false);
		popup1Widget.off("event", eventCallback, false);
		popup1Widget.trigger("event");
		ok(true, "not triggered");
	});
	//
	// asyncTest("close with option dismissible", 2, function() {
	// 	tau.event.one(page, "pageshow", function() {
	// 		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
	// 		tau.event.one(popup1, PopupClass.events.show, function() {
	// 			ok(true, "Popup is opened");
	// 			popup1Widget.close();
	// 			start();
	// 		});
	// 		tau.event.one(popup1, PopupClass.events.hide, function() {
	// 			ok(true, "Popup is being closed");
	// 		});
	// 		popup1Widget.open({dismissible: false});
	// 	});
	// 	engine.run();
	// });
	//
	// asyncTest("open with option dismissible", 1, function() {
	// 	tau.event.one(page, "pageshow", function() {
	// 		popup1Widget = engine.instanceWidget(popup1, INSTANCE_WIDGET);
	// 		tau.event.one(popup1, PopupClass.events.show, function() {
	// 			ok(true, "Popup is opened");
	// 			tau.event.trigger(popup1Widget._ui.overlay, "click");
	// 			start();
	// 		});
	// 		tau.event.one(popup1, PopupClass.events.hide, function() {
	// 			ok(false, "Popup should not be closed");
	// 		});
	// 		popup1Widget.open({dismissible: false});
	// 	});
	// 	engine.run();
	// });
}(window, window.document));
