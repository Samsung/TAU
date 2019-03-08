/*global document, window, module, test, asyncTest, ok, setTimeout, start, equal, expect,
QUnit, suites */
/*
* Unit Test: Selector
*/
QUnit.config.reorder = false;

(function (ns) {
	"use strict";
	module("profile/wearable/widget/wearable/Selector", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test("Selector component test", 8, function() {
		var element = document.getElementById("selector"),
			selector = tau.widget.Selector(element),
			activeLayer = element.querySelector(".ui-layer-active"),
			handler = element.querySelector(".ui-selector-indicator"),
			tempItem = document.createElement("div"),
			tempLayer = document.createElement("div");

		tempItem.classList.add("ui-item");
		tempLayer.classList.add("ui-layer");
		equal(selector._activeLayerIndex, 0, "ui-layer-active was set correctly");
		equal(activeLayer.children[0].getAttribute("data-index"), "0", "icons index was set");
		equal(handler.getAttribute("data-index"), "0", "handler index was set");
		ok(activeLayer.children[0].classList.contains("ui-item-active"), "ui-item-active was set correctly");
		selector.changeItem(2);
		ok(activeLayer.children[2].classList.contains("ui-item-active"), "changeItem method operated correctly");
		equal(handler.getAttribute("data-index"), "2", "handler index was set by changeIcon method");
		selector.addItem(tempItem);
		equal( element.querySelectorAll(".ui-item").length, 34, "addIcon method operated correctly");
		selector.removeItem(0);
		equal( element.querySelectorAll(".ui-item").length, 33, "removeIcon method operated correctly");
	});
}(window.tau));
