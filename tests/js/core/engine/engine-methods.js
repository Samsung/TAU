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

	test("Checking engine.justBuild method", function () {
		equal(engine.getJustBuild(), false, "Default justBuild value is 'false'");

		engine.setJustBuild(true);
		equal(engine.getJustBuild(), true, "Value changed to 'true'");
		equal(window.location.hash, "#build", "Hash changed to '#build'");

		engine.setJustBuild(false);
		equal(engine.getJustBuild(), false, "Value changed to 'false'");
		equal(window.location.hash, "", "Hash changed to ''");
	});

	test("Checking .instanceWidget method", function () {
		var tempElement = document.getElementById("future-widget"),
			tempBinding,
			tempBinding2;

		tempBinding = engine.instanceWidget(tempElement, "NonExistingWidget");
		ok(tempBinding === null, "Creating a instance of non-existing widget returns 'null'");

		tempBinding = engine.instanceWidget(tempElement, "Test1");
		ok(tempBinding instanceof BaseWidget, "Widget is an instance of Base Widget");
		ok(tempBinding instanceof ns.test.widget1, "Widget is an instance of Test1");

		tempBinding2 = engine.instanceWidget(tempElement, "Test1");
		ok(tempBinding === tempBinding2, "Creating same widget on that same element returns that same reference");

		tempBinding2 = engine.instanceWidget(tempElement, "Test2");
		ok(tempBinding2 instanceof BaseWidget, "New widget on that same HTMLElement is an instance of BaseWidget");
		ok(tempBinding2 instanceof ns.test.widget2, "New widget on that same HTMLElement is an instance of Test2");
	});

	test("Checking .instanceWidget method with empty element", 3, function () {
		var widget = engine.instanceWidget("Button");

		ok(widget, "Widget was created");
		ok(widget instanceof  ns.widget.BaseWidget, "Widget is an instance of BaseWidget");
		ok(widget.element, "Widget has element");
	});

	test("Checking .getAllBindings method", function () {
		var tempBindings,
			tempBindings2;

		tempBindings = engine.getAllBindings(window.ej);
		ok(tempBindings === null, "Passing bad reference returns 'null'");

		tempBindings = engine.getAllBindings(document.documentElement);
		ok(tempBindings === null, "Passing HTMLElement reference to a non-widget element returns 'null'");

		tempBindings = engine.getAllBindings(testElement);
		equal(typeof tempBindings, "object", "Passing a proper reference gives a object");
		ok(!!tempBindings.Page, "Returned object contains proper widget property");
		ok(tempBindings.Page instanceof WidgetPage, "Widget property is a proper reference to a widget object");

		tempBindings2 = engine.getAllBindings("page1");
		ok(tempBindings.Page === tempBindings2.Page, "Same widget references are returned while calling method with ID as parameter");
	});

	test("Checking .getAllBindings method - after manually adding instances", function () {
		var tempElement = document.getElementById("future-widget"),
			tempBindings,
			widgetInstanceTest1,
			widgetInstanceTest2;

		tempBindings = engine.getAllBindings(tempElement);
		ok(tempBindings === null, "Before calling instanceWidget element does is not bound to any widgets.");

		// Instance first widget
		widgetInstanceTest1 = engine.instanceWidget(tempElement, "Test1");

		tempBindings = engine.getAllBindings(tempElement);
		ok(!!tempBindings.Test1, "Method returned an object with .Test1 property");
		ok(tempBindings.Test1 instanceof ns.test.widget1, "Object property is a instanceof ej.test.widget1");
		ok(tempBindings.Test1 === widgetInstanceTest1, "Returned reference targets that same widget instance");

		// Instance second widget
		widgetInstanceTest2 = engine.instanceWidget(tempElement, "Test2");

		tempBindings = engine.getAllBindings(tempElement);
		ok(!!tempBindings.Test2, "Method returned an object with .Test2 property");
		ok(tempBindings.Test2 instanceof ns.test.widget2, "Object property is a proper instance of widget");
		ok(tempBindings.Test2 === widgetInstanceTest2, "Returned reference targets that same widget instance");

		ok(!!tempBindings.Test2 && !!tempBindings.Test1, "Returned object still contains references to both widget instances");
	});

	test("Checking .setBinding method", function () {
		var tempElement = document.getElementById("future-widget"),
			tempBinding,
			widgetInstance,
			widgetInstance2;

		tempBinding = engine.getBinding(tempElement, "Test1");
		ok(tempBinding === null, "getBinding returns null");
		//ok(!window.ejWidgetBindingMap["future-widget"], "Widget map has no Element entry");

		widgetInstance = engine.instanceWidget(tempElement, "Test1");
		//tempBinding = window.ejWidgetBindingMap["future-widget"];
		//equal(typeof tempBinding, "object", "Calling instanceWidget internally fills ejWidgetBindingMap with setBinding");
		//ok(tempBinding.instances.Test1 === widgetInstance, "setBinding creates Test1 reference inside binding map to newly created widget");
		ok(widgetInstance === engine.getBinding(tempElement, "Test1"), "getBinding properly returns the instance");

		widgetInstance2 = engine.instanceWidget(tempElement, "Test2");
		//tempBinding2 = window.ejWidgetBindingMap["future-widget"];
		//ok(tempBinding === tempBinding2, "Internal setBinding calls doesn't rebuild the object for holding widget instance references");
		//ok(tempBinding2.instances.Test2 === widgetInstance2, "setBinding creates Button reference inside binding map to newly created widget");
		ok(widgetInstance2 === engine.getBinding(tempElement, "Test2"), "getBinding properly returns the instance");

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