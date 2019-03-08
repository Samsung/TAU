/* global document, tau, define, module, test, equal, deepEqual, ok, initFixture, injectStyle, $ */

function cssTests(dom, helpers) {

	function initHTML() {
		var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/util/DOM/css/test-data/sample.html"),
			parent = document.getElementById("qunit-fixture") || initFixture();

		parent.innerHTML = HTML;

		injectStyle("#util-dom-css-test1 {" +
			"width: 100px;" +
			"height: 10px;" +
			"display: block;" +
			"opacity: 0.3;" +
			"}" +

			"#util-dom-css-test2 {" +
			"max-width: 40px;" +
			"}" +

			"#util-dom-css-test3 > .spacer {" +
			"min-width: 120px;" +
			"height: 200px;" +
			"}" +

			"#util-dom-css-test4 {" +
			"width: 10px;" +
			"margin: 20px;" +
			"padding: 10px;" +
			"max-height: 10px;" +
			"height: 10px;" +
			"border: 0;" +
			"line-height: 10px;" +
			"font-size: 8px;" +
			"}" +

			"#util-dom-css-test4 > li {" +
			"max-width: 80px;" +
			"height: 5px;" +
			"margin: 10px;" +
			"padding: 5px;" +
			"border: 0;" +
			"}" +

			"#util-dom-css-test4 > li > .spacer {" +
			"min-height: 10px;" +
			"min-width: 100px;" +
			"}" +

			"#util-dom-css-test5 {" +
			"margin: 0;" +
			"padding: 0;" +
			"list-style-type: none;" +
			"}" +

			"#util-dom-css-test5 > li {" +
			"margin: 0;" +
			"padding: 0;" +
			"border: 1px solid black;" +
			"max-width: 100px;" +
			"min-height: 40px;" +
			"text-overflow: clip;" +
			"white-space: nowrap;" +
			"overflow: hidden;" +
			"}" +

			"#util-dom-css-test9 {" +
			"width: 50.5%;" +
			"height: 10px;" +
			"opacity: 0.3;" +
			"}" +

			"#util-dom-css-test10 {" +
			"width: 100%;" +
			"height: 100%;" +
			"}");
	}

	module("core/util/DOM/css", {
		setup: initHTML
	});

	test("util.DOM.css", function () {
		// basic props check
		var testElement1 = document.getElementById("util-dom-css-test1"),
			testElement2 = document.getElementById("util-dom-css-test2"),
			testElement3 = document.getElementById("util-dom-css-test3"),
			testList1 = document.getElementById("util-dom-css-test4"),
			testList1Li1 = testList1.querySelector("li"),
			testList2 = document.getElementById("util-dom-css-test5"),
			testList2Li1 = testList2.querySelector("li"),
			testElement6 = document.getElementById("util-dom-css-test6"),
			testElement7 = document.getElementById("util-dom-css-test7"),
			testElement9 = document.getElementById("util-dom-css-test9"),
			testElement10 = document.getElementById("util-dom-css-test10"),
			testElement11 = document.getElementById("util-dom-css-test11"),
			testElement12 = document.getElementById("util-dom-css-test12"),
			testElement14 = document.getElementById("util-dom-css-test14"),
			testElement8,
			props = {
				"width": 0,
				"height": 0,
				"opacity": 0
			},
			floatValue = dom.getCSSProperty(testElement9, "opacity", 0, "float"),
			floatValueRound = Math.round(floatValue),
			$test8 = $("#util-dom-css-test8");

		equal(dom.getCSSProperty(testElement1, "display", false), "block", "fetching css property value");
		equal(dom.getCSSProperty(testElement1, "display", false), $(testElement1).css("display"), "compare with jquery");
		deepEqual(dom.getCSSProperty(testElement1, "width", 0, "integer"), 50, "fetching css property value and matching types");

		ok(floatValueRound !== floatValue, "checks if float");

		dom.extractCSSProperties(testElement1, props);
		equal(typeof props["opacity"], "number", "Opacity is a typeof number");
		props["opacity"] = Number(props["opacity"].toFixed(1));
		deepEqual(
			props,
			{
				"width": 50,
				"height": 50,
				"opacity": 0.3
			},
			"fetching multiple props at once"
		);
		equal(props.width, parseInt($(testElement1).css("width")), "comparing with jquery");
		equal(props.height, parseInt($(testElement1).css("height")), "comparing with jquery");

		// height width
		equal(dom.getElementHeight(testElement1), 50, "check element 1 height");
		equal(dom.getElementWidth(testElement1), 50, "check element 1 width");

		equal(dom.getElementWidth(testElement2), 40, "check element 2 width");
		equal(dom.getElementWidth(testElement2), $(testElement2).width(), "compare with jquery");

		equal(dom.getElementHeight(testElement3), 200, "check element 3 height");
		equal(dom.getElementHeight(testElement3), $(testElement3).height(), "compare with jquery");

		equal(dom.getElementHeight(testList1, "outer"), 30, "check list 1 height");
		equal(Math.ceil(dom.getElementHeight(testList1, "outer")), $(testList1).outerHeight(), "compare with jquery");
		equal(dom.getElementWidth(testList1, "outer"), 30, "check list 1 width");
		equal(dom.getElementWidth(testList1, "outer"), $(testList1).outerWidth(), "compare with jquery");

		equal(dom.getElementWidth(testList1Li1), 10, "check list 1 element 1 width");
		equal(dom.getElementHeight(testList1Li1), 15, "check list 1 element 1 height");

		equal(parseInt(dom.getElementHeight(testList2), 10), 42, "check list 2 height");

		equal(dom.getElementWidth(testList2Li1), 100, "check list 2 element 1 width");

		testElement6.style.width = "55px";
		testElement6.style.border = "1px solid black";
		testElement6.style.margin = "0px";
		testElement6.style.padding = "0px";
		equal(parseInt(dom.getElementWidth(testElement6, "outer", false, true), 10), 57, "check element 6 dynamic set width");
		equal(Math.ceil(parseInt(dom.getElementWidth(testElement6, "outer", false, true), 10)), $(testElement6).outerWidth(true), "compare with jquery");

		equal(parseInt(dom.getElementWidth(testElement7, "outer", false, true, null, true), 10), 72, "check hidden element 7 width");
		equal(parseInt(dom.getElementWidth(testElement7, "outer", false, true, null, true), 10), $(testElement7).outerWidth(true), "compare with jquery");
		equal(parseInt(dom.getElementHeight(testElement7, "outer", false, true, null, true), 10), 72, "check hidden element 7 height");
		equal(parseInt(dom.getElementHeight(testElement7, "outer", false, true, null, true), 10), $(testElement7).outerHeight(true), "compare with jquery");
		equal(testElement7.style.display, "none", "check testElement7 display style attribute modification");

		$test8 = $("<div id='util-dom-css-test8'></div>");
		$("#qunit-fixture").append($test8);

		$test8.css({
			"width": "100px",
			"margin": "10px",
			"padding": "0",
			"max-height": "10px",
			"height": "100px",
			"border": "0",
			"line-height": "10px",
			"font-size": "8px"
		});
		testElement8 = document.getElementById("util-dom-css-test8");
		equal(parseInt(dom.getElementHeight(testElement8, "outer", false, true), 10), $test8.outerHeight(true), "compare with jquery method 'outerHeight'");
		equal(parseInt(dom.getElementWidth(testElement8, "outer", false, true), 10), $test8.outerWidth(true), "compare with jquery method 'outerWidth'");
		equal(dom.getElementWidth(testElement8, "outer", false, true), 120, "check width of the created element");
		equal(dom.getElementHeight(testElement8, "outer", false, true), 30, "check height of the created element");

		$test8.css({
			"width": "100px",
			"margin": "10px",
			"padding": "10px",
			"max-height": "10px",
			"height": "10px",
			"border": "0",
			"line-height": "10px",
			"font-size": "8px",
			"left": "10px",
			"top": "10px"
		});
		equal(dom.getElementWidth(testElement8, false, true), 120, "check width of the created element with offset");
		equal(dom.getElementHeight(testElement8, false, true), 30, "check height of the created element with offset");
		equal(dom.getElementWidth(testElement8, "outer", false), 120, "check width of the created element with outer");
		equal(dom.getElementHeight(testElement8, "outer", false), 30, "check height of the created element with outer");
		equal(dom.getElementWidth(testElement8, false, false, true), 140, "check width of the created element with margin");
		equal(dom.getElementHeight(testElement8, false, false, true), 50, "check height of the created element with margin");

		// @TODO 50.5% width causes tests fail inside phantom (probably due to different rounding implementation)
		equal(Math.round(dom.getElementWidth(testElement9)), Math.floor(testElement9.parentElement.offsetWidth * 0.505), "Percentage width to pixel (50.5%)");
		equal(dom.getElementWidth(testElement10), testElement10.parentElement.offsetWidth, "Percentage width 2");
		equal(dom.getElementHeight(testElement10), 20, "Percentage height");

		equal(dom.getElementHeight(testElement11), 50, "Auto height");
		equal(dom.getElementWidth(testElement11), testElement11.parentElement.offsetWidth, "Auto width");

		equal(dom.getElementOffset(testElement8).left, -9990, "Check offset left");
		equal(dom.getElementOffset(testElement8).top, -8986, "Check offset top");

		equal(dom.isOccupiedPlace(testElement8), true, "Check if element occupies place at view");

		equal(dom.getElementHeight(testElement12), 60, "Box-sizing=border-box height");
		equal(dom.getElementWidth(testElement12), 60, "Box-sizing=border-box width");

		equal(dom.getElementWidth(testElement14), 500, "check element with 50% width");
		equal(dom.getElementHeight(testElement14), 500, "check element with 50% width");

	});

	test("setPrefixedStyle", function () {
		var testElement1 = document.getElementById("util-dom-css-test1");

		dom.setPrefixedStyle(testElement1, "transform", "translate3d(2px, 2px, 2px)");
		equal(testElement1.style.transform || testElement1.style.webkitTransform, "translate3d(2px, 2px, 2px)", "style is set correctly");

		// test when value is number
		dom.setPrefixedStyle(testElement1, "zIndex", 0);
		equal(testElement1.style.webkitZIndex || testElement1.style.zIndex, 0, "style is set correctly");

		dom.setPrefixedStyle(testElement1, "mask", {
			webkit: "url(\"a.png\")",
			normal: "none"
		});
		equal(testElement1.style.webkitMask.substr(0, 3), "url", "style is set correctly");
		equal(testElement1.style.mask, "none", "style is set correctly");
	});

	test("getPrefixedValue", function () {
		var values = dom.getPrefixedValue("transform");

		equal(values.normal, "transform", "return correct values");
		equal(values.webkit, "-webkit-transform", "return correct values");
	});

	test("getPrefixedStyleValue", function () {
		var testElement1 = document.getElementById("util-dom-css-test13");

		equal(dom.getPrefixedStyleValue(window.getComputedStyle(testElement1), "transform"), "matrix(2, 0, 0, 2, 0, 0)", "return correct values");

		equal(dom.getPrefixedStyleValue(window.getComputedStyle(testElement1), "mask"), "none", "return correct values");
	});

	test("toCSSSize", function () {
		equal(dom.toCSSSize("10,20"), "width: 10px; height: 20px;", "return correct values");

		equal(dom.toCSSSize(""), "", "return correct values");
	});
}

if (typeof define === "function") {
	define(function () {
		return cssTests;
	});
} else {
	cssTests(tau.util.DOM, window.helpers);
}
