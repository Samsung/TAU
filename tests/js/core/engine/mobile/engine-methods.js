/*global test, ok, equal, module, ej */
(function (document, console, ns) {
	"use strict";
	var engine = ns.engine,
		BaseWidget = ns.widget.BaseWidget,
		WidgetPage = (ns.widget.core && ns.widget.core.Page) || ns.widget.mobile.Page,
		testElement;

	function _manualClean(elementId) {
		var possibleWidget,
			newElement;

		engine.removeBinding(elementId);

		possibleWidget = document.getElementById(elementId);
		newElement = document.createElement("div");

		newElement.innerHTML = possibleWidget.innerHTML;

		possibleWidget.parentElement.replaceChild(newElement, possibleWidget);
		newElement.id = elementId;
	}

	module("core/engine", {
		setup: function () {
			testElement = document.getElementById("page1");
			engine.run();
		},
		teardown: function () {
			_manualClean("non-widget");
			_manualClean("future-widget");
			engine.destroyAllWidgets(document.body);
			engine.removeAllBindings(document.body);
			engine.stop();
		}
	});

	test("Checking .getBinding method - one parameter", function () {
		var tempBinding,
			tempBinding2;

		tempBinding = engine.getBinding(window.ej);
		ok(tempBinding === null, "Passing bad reference returns 'null'");

		tempBinding = engine.getBinding(document.documentElement);
		ok(tempBinding === null, "Passing element reference to a non-widget element returns 'null'");

		tempBinding = engine.getBinding("non-widget");
		ok(tempBinding === null, "Passing string as ID to a non-widget element returns 'null'");

		tempBinding = engine.getBinding(testElement);
		ok(!!tempBinding, "Widget exists");
		ok(tempBinding instanceof BaseWidget, "Widget is a instanceof BaseWidget");
		ok(tempBinding instanceof WidgetPage, "Widget is a instanceof Page");

		tempBinding2 = engine.getBinding("page1");
		ok(tempBinding === tempBinding2, "Passing HTMLElement reference and string ID returns that same object reference");
	});

	test("Checking .getBinding method - two parameters", function () {
		var tempBinding,
			tempBinding2;

		tempBinding = engine.getBinding(window.ej, "Test1");
		ok(tempBinding === null, "Passing bad reference returns 'null'");

		tempBinding = engine.getBinding(document.documentElement, "Test1");
		ok(tempBinding === null, "Passing HTMLElement reference to a non-widget element returns 'null'");

		tempBinding = engine.getBinding("non-widget", "Test1");
		ok(tempBinding === null, "Passing string as ID to a non-widget element returns 'null'");

		// A binding should be returned only when HTMLElement contains a widget of the a proper type
		tempBinding = engine.getBinding(testElement, "Test2");
		ok(tempBinding === null, "'null' should be returned when a HTMLElement (that is bound) does not have a widget binding of a proper type");

		tempBinding = engine.getBinding(testElement, "Page");
		ok(!!tempBinding, "Widget reference was returned");
		ok(tempBinding instanceof BaseWidget, "Widget is a instanceof BaseWidget");
		ok(tempBinding instanceof WidgetPage, "Widget is a instanceof Page");

		tempBinding2 = engine.getBinding("page1", "Page");
		ok(tempBinding === tempBinding2, "Passing HTMLElement reference and string ID returns that same object reference");
	});


//	test("Checking .removeBinding method", function () {
//		ok(true, "@TODO!");
//
//		// 1. Add widget instances (many)
//		// 2. remove widget instance of a given type
//		// Check if attributes are parts are removed
//		// check if full attributes are removed if last widget is removed
//	});

//	test("Checking .removeAllBindings method", function () {
//		ok(true, "@TODO!");
//
//		// 1. Add widget instances
//		// 2. Remove all
//		// 3. Check if all references were cleared
//	});

}(window.document, window.console, window.ej));