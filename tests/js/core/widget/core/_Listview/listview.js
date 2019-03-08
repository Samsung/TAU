/*global window, console, test, equal, module, ej, asyncTest, start, HTMLElement, HTMLDivElement */
/*jslint nomen: true */
(function (window, document) {
		"use strict";

		var engine = ej.engine;

		module("core/widget/core/Listview", {
			setup: function () {
			},
			teardown: function () {
				engine.destroyAllWidgets(document.body);
				engine.removeAllBindings(document.body);
			}
		});

		test("Listview with data-role='listview'", function () {
			var list = document.getElementById("list-with-data-role"),
				listWidget = engine.instanceWidget(list, "Listview");

			//after build
			equal(list.getAttribute("data-tau-bound"), "Listview", "List widget is created");
			ok(list.classList.contains("ui-listview"), "List has ui-listview class");
			equal(list.getAttribute("data-tau-built"), "Listview", "Listview widget is built");
			equal(list.getAttribute("data-tau-name"), "Listview", "Listview has correct widget name");
		});

		test('Refresh listview', function () {
			var li3 = document.createElement("li"),
				li4 = document.createElement("li"),
				link3 = document.createElement("a"),
				link4 = document.createElement("a"),
				list = document.getElementById("list-with-data-role"),
				listWidget = engine.instanceWidget(list, "Listview");

			// append new li element and refresh list;
			li3.appendChild(link3);
			li4.appendChild(link4);
			li3.setAttribute("id", "li-dr-3");
			li4.setAttribute("id", "li-dr-4");
			list.appendChild(li3);
			list.appendChild(li4);

			listWidget = engine.instanceWidget(list, "Listview");
			listWidget.refresh();

			//after refresh
			list = document.getElementById("list-with-data-role");
			equal(list.getAttribute("data-tau-bound"), "Listview", "List widget is created");
			ok(list.classList.contains("ui-listview"), "List has ui-listview class");
			equal(list.getAttribute("data-tau-built"), "Listview", "Listview widget is built");
			equal(list.getAttribute("data-tau-name"), "Listview", "Listview has correct widget name");

			//check if link is changed to button
			li3 = document.getElementById("li-dr-3");
			equal(li3.childNodes.length, 1, "List item contains one link");
		});

		test('Destroy', function () {
			var list = document.getElementById("list-with-data-role"),
				listWidget = engine.instanceWidget(list, "Listview");

			equal(list.getAttribute("data-tau-bound"), "Listview", "List widget is created");

			engine.destroyWidget(list, "Listview");

			equal(list.getAttribute("data-tau-bound"), null, "List widget is destroyed");
		});

}(window, window.document));
