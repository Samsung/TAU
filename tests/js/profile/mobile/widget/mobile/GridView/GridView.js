/* global document, tau, define, module, test, strictEqual, initFixture, window */
(function () {
	"use strict";
	function runTests(Page, GridView) {
		function initHTML() {
			var HTML = "<div class='ui-page' id='first'>\
					<div class='ui-header'>Header</div>\
					<div class='ui-content'>Content<input id='input' autofocus='true' />\
						<ul id='gridview' class='ui-gridview'>\
							<li class='ui-gridview-item'>\
								<img class='ui-gridview-image' src='images/1.jpg'>\
								<div class='ui-gridview-handler'></div>\
							</li>\
							<li class='ui-gridview-item'>\
								<img class='ui-gridview-image' src='images/2.jpg'>\
								<div class='ui-gridview-handler'></div>\
							</li>\
							<li class='ui-gridview-item'>\
								<img class='ui-gridview-image' src='images/3.jpg'>\
								<div class='ui-gridview-handler'></div>\
							</li>\
							<li class='ui-gridview-item'>\
								<img class='ui-gridview-image' src='images/4.jpg'>\
								<div class='ui-gridview-handler'></div>\
							</li>\
							<li class='ui-gridview-item'>\
								<img class='ui-gridview-image' src='images/5.jpg'>\
								<div class='ui-gridview-handler'></div>\
							</li>\
							<li class='ui-gridview-item'>\
								<img class='ui-gridview-image' src='images/6.jpg'>\
								<div class='ui-gridview-handler'></div>\
							</li>\
						</ul>\
					</div>\
					<div class='ui-footer'>Footer</div>\
				</div>",
				parent = document.getElementById("qunit-fixture") || initFixture();

			parent.innerHTML = HTML;
		}

		module("mobile/widget/mobile/GridView", {
			setup: initHTML
		});

		test("constructor", function () {
			var gridView = new GridView();

			strictEqual(true, true, "Option header is set correct");

			strictEqual(gridView.options.cols, undefined, "Option header is set correct");
			strictEqual(gridView.options.reorder, undefined, "Option content is set correct");
			strictEqual(gridView.options.label, undefined, "Option footer is set correct");
			strictEqual(gridView.options.minWidth, undefined, "Option footer is set correct");
			strictEqual(gridView.options.minCols, undefined, "Option footer is set correct");
			strictEqual(gridView.options.maxCols, undefined, "Option footer is set correct");
			gridView._configure();
			strictEqual(gridView.options.cols, (window.innerWidth > window.innerHeight) ? 7 : 4,
				"Option header is set correct");
			strictEqual(gridView.options.reorder, false, "Option content is set correct");
			strictEqual(gridView.options.label, "none", "Option footer is set correct");
			strictEqual(gridView.options.minWidth, null, "Option footer is set correct");
			strictEqual(gridView.options.minCols, 1, "Option footer is set correct");
			strictEqual(gridView.options.maxCols, (window.innerWidth > window.innerHeight) ? 7 : 5,
				"Option footer is set correct");
		});

		test("onSetGridStyle", 4, function () {
			var page = new Page(),
				gridView = new GridView(),
				gridViewElement = document.getElementById("gridview"),
				firstPageElement = document.getElementById("first");

			page.element = firstPageElement;
			gridView.element = gridViewElement;

			gridView._configure();
			gridView.init(gridViewElement);
			gridView._bindEvents();

			page.on("pageshow", function () {
				var element = gridView.element,
					gridViewStyles = document.getElementById("GridView"),
					numberOfStylesAdded = gridViewStyles.innerText.split(".ui-gridview").length - 1,
					length = element.children.length;

				strictEqual(Boolean(gridViewStyles), true, "GridView style tag with translate3D for each element is defined");
				strictEqual(numberOfStylesAdded, length, "every element has relevant styles added");
				strictEqual(element.children[0].style.animation.indexOf("grid_show_item"), 0, "firstElement has an animation added");
				strictEqual(element.children[length - 1].style.animation.indexOf("grid_show_item"), 0, "lastElement has an animation added");
			});

			page.onShow();
		});
	}

	if (typeof define === "function") {
		define([
			"../../../../../../../src/js/core/widget/core/Page"
		], function (Page) {
			return runTests.bind(null, Page);
		});
	} else {
		runTests(tau.widget.core.Page,
			tau.widget.mobile.GridView,
			window.helpers);
	}
}());
