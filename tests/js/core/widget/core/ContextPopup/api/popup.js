/*global window, console, test, equal, module, ej, asyncTest, start, HTMLElement, HTMLDivElement, Node */
/*jslint nomen: true */
(function (window, document) {
	"use strict";

	var page = null,
		popup1Link = null,
		popup1 = null,
		popup1Widget = null,
		PopupClass = ej.widget.core.ContextPopup,
		engine = ej.engine;

	function testPopup(title, testCallback, noAutoStart) {
		asyncTest(title, function () {
			var callback = function () {
				page.removeEventListener("pageshow", callback, false);
				testCallback();
				if (!noAutoStart) {
					start();
				}
			};
			page.addEventListener("pageshow", callback, false);
		});
	}

	function testPopupMethodApi(widget) {
		equal(widget instanceof ej.widget.BaseWidget, true, "extends BaseWidget");
		// public methods
		equal(typeof widget.open, "function", "open public method exists");
		equal(typeof widget.close, "function", "close public method exists");
		// protected methods
		equal(typeof widget._setActive, "function", "_setActive protected method exists");
		equal(typeof widget._transition, "function", "_transition protected method exists");
		equal(typeof widget._build, "function", "_build protected method exists");
		equal(typeof widget._init, "function", "_init protected method exists");
		equal(typeof widget._bindEvents, "function", "_bindEvents protected method exists");
		equal(typeof widget._refresh, "function", "_refresh protected method exists");
		equal(typeof widget._destroy, "function", "_destroy protected method exists");
	}

	module("core/widget/core/ContextPopup", {
		setup: function () {
			popup1Link = document.getElementById("popup1Link");
			popup1 = document.getElementById("popup1");
			page = document.getElementById("test");
			engine.run();
		},
		teardown: function () {
			engine._clearBindings();
		}
	});

	testPopup("test prototype", function () {
		testPopupMethodApi(ej.widget.core.Popup.prototype);
	});

	testPopup("test instance", function () {
		var ui,
			definition = engine.getWidgetDefinition("Popup");
		popup1Link.click();
		popup1Widget = engine.getBinding(popup1);
		testPopupMethodApi(popup1Widget);
		ui = popup1Widget._ui;
		equal(ui instanceof Object, true, "ui object dictionary exists and is proper type");
		equal(ui.header instanceof Node, true, "header element exists and is proper type");
		equal(ui.footer instanceof Node, true, "footer element exists and is proper type");
		equal(ui.content instanceof Node, true, "content element exists and is proper type");
		equal(popup1Widget.options instanceof Object && popup1Widget.options !== null, true, "options dictionary exists and is proper type");
		equal(PopupClass.classes instanceof Object && PopupClass.classes !== null, true, "class property classes dictionary exists and is proper type");
		equal(PopupClass.events instanceof Object, PopupClass.events !== null, "class property events dictionary exists and is proper type");

		// definition check
		equal(definition instanceof Object && definition !== null, true, "definition exists and is proper type");
		equal(definition.name, "Popup", "definition.name exists and is proper type and value");
		equal(definition.selector, "[data-role='popup'], .ui-popup", "definition.selector exists, is proper type and value");
		equal(definition.methods instanceof Array, true, "definition.methods exists and is proper type");
	});

}(window, window.document));
