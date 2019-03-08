/* global tau, ok, equal, expect, notEqual, test, helpers, strictEqual, document */
var transformPropertyName = (document.body.style.transform !== undefined) ? "transform" : "-webkit-transform";

module("core/widget/core/scroller/Scroller", {});

function fireEvent(el, type, detail) {
	var evt = new CustomEvent(type, {
		"bubbles": true,
		"cancelable": true,
		"detail": detail
	});

	return el.dispatchEvent(evt);
}

document.getElementById("first").addEventListener("pageshow", function () {

	test("tau.widget.core.scroller.Scroller _build method", function () {
		var scrollerElement = document.getElementById("scroller"),
			scrollerInner = scrollerElement.children[0],
			scrollerWidget = tau.widget.Scroller(scrollerElement),
			scrollBarWidget = tau.engine.getBinding(scrollerElement, "ScrollBar"),
			bar = scrollerWidget.option("scrollbar"),
			orientation = scrollerWidget.option("orientation"),
			useBouncingEffect = scrollerWidget.option("useBouncingEffect");

		ok(scrollerWidget, "widget instance exists");
		equal(scrollerElement.style.position, "relative", "position is set to relative");
		equal(scrollerInner.style.position, "absolute", "position of first child is set to absolute");
		equal(scrollerInner.style.top, "0px", "top of first child is set to 0px");
		equal(scrollerInner.style.left, "0px", "top of first child is set to 0px");
		if (bar) {
			ok(scrollBarWidget, "widget ScrollBar instance exists");
		} else {
			ok(!scrollBarWidget, "widget ScrollBar instance not exists");
		}
		document.addEventListener("scrollstart", function () {
			ok(true, "scrollstart was called");
		});

		document.addEventListener("scrollend", function () {
			ok(true, "scrollend was called");
		});

		fireEvent(scrollerInner, "dragstart", {});
		fireEvent(scrollerInner, "drag", {
			estimatedDeltaX: 0,
			estimatedDeltaY: -50
		});
		fireEvent(scrollerInner, "dragend", {});

		if (orientation === "vertical") {
			notEqual(scrollerInner.style[transformPropertyName], "", "element was scrolled (1)");
		} else {
			// @todo window size in during TCT tests has size 0x0, this cause issue with scroll
			// because content is always bigger then container
			//equal(scrollerInner.style[transformPropertyName], "", "element was scrolled (2)");
		}

		fireEvent(scrollerInner, "dragstart", {});
		fireEvent(scrollerInner, "drag", {
			estimatedDeltaX: 0,
			estimatedDeltaY: 50
		});
		fireEvent(scrollerInner, "dragend", {});

		fireEvent(scrollerInner, "dragstart", {});
		fireEvent(scrollerInner, "drag", {
			estimatedDeltaX: -50,
			estimatedDeltaY: 0
		});
		fireEvent(scrollerInner, "dragend", {});
		if (orientation === "horizontal") {
			notEqual(scrollerInner.style[transformPropertyName], "", "element was scrolled (3)");
		} else {
			equal(scrollerInner.style[transformPropertyName], "translate3d(0px, 0px, 0px)", "element was scrolled (4)");
		}
		fireEvent(scrollerInner, "dragstart", {});
		fireEvent(scrollerInner, "drag", {
			estimatedDeltaX: 50,
			estimatedDeltaY: 0
		});
		fireEvent(scrollerInner, "dragend", {});

		// @todo window size in during TCT tests has size 0x0, this cause issue with scroll
		// because content is always bigger then container
		//equal(scrollerInner.style[transformPropertyName], "translate3d(0px, 0px, 0px)", "element was scrolled (5)");

		if (bar) {
			equal(scrollerElement.children[1].className, "ui-scrollbar-bar-type ui-scrollbar-vertical", "bar has proper classes");
			equal(scrollerElement.children[1].children[0].className, "ui-scrollbar-indicator", "inner bar has proper classes");
			ok(scrollerElement.children[1].children[0].style.height !== "0px", "bar has proper height");
		}
		// if (useBouncingEffect) {
		// 	equal(scrollerElement.children[1].className, "ui-scrollbar-bouncing-effect ui-top ui-show", "top effect container has proper classes");
		// 	equal(scrollerElement.children[2].className, "ui-scrollbar-bouncing-effect ui-bottom", "bottom effect container has proper classes");
		// 	fireEvent(scrollerInner, "dragstart", {});
		// 	fireEvent(scrollerInner, "drag", {
		// 		estimatedDeltaX: 0,
		// 		estimatedDeltaY: 50
		// 	});
		// 	fireEvent(scrollerInner, "dragend", {});
		// 	equal(scrollerElement.children[1].className, "ui-scrollbar-bouncing-effect ui-top", "top effect container has proper classes (none)");
		// 	expect(21);
		// }

		scrollerWidget.disable();

		equal(scrollerWidget.enabled, false, "widget is disabled");

		fireEvent(scrollerInner, "dragcancel", {});

		equal(scrollerWidget.scrolled, false, "scrolled is set to false after cancel");
		equal(scrollerWidget.dragging, false, "scrolled is set to false after cancel");
	});


	// unit test
	test("_refresh", 5, function test() {
		var scrollerElement = document.getElementById("scroller"),
			scroller = new tau.widget.Scroller(scrollerElement);

		helpers.stub(scroller, "_unbindEvents", function () {
			ok(true, "_unbindEvents");
		});
		helpers.stub(scroller, "_clear", function () {
			ok(true, "_clear");
		});
		helpers.stub(scroller, "_init", function (element) {
			ok(true, "_init");
			strictEqual(element, scrollerElement, "_init is called with correct element");
		});
		helpers.stub(scroller, "_bindEvents", function () {
			ok(true, "_bindEvents");
		});

		fireEvent(scrollerElement, "resize", {});

		helpers.restoreStub(scroller, "_unbindEvents");
		helpers.restoreStub(scroller, "_clear");
		helpers.restoreStub(scroller, "_init");
		helpers.restoreStub(scroller, "_bindEvents");
	});


	// unit test
	test("scrollTo", 6, function test() {
		var scrollerElement = document.getElementById("scroller"),
			scroller = new tau.widget.Scroller(scrollerElement);

		helpers.stub(scroller, "_translate", function (x, y, duration) {
			equal(x, 1, "x _translate");
			equal(y, 2, "y _translate");
			equal(duration, 3, "duration _translate");
		});
		helpers.stub(scroller, "_translateScrollbar", function (x, y, duration) {
			equal(x, 1, "x _translateScrollbar");
			equal(y, 2, "y _translateScrollbar");
			equal(duration, 3, "duration _translateScrollbar");
		});

		scroller.scrollTo(1, 2, 3);

		helpers.restoreStub(scroller, "_translate");
		helpers.restoreStub(scroller, "_translateScrollbar");
	});
}, false);