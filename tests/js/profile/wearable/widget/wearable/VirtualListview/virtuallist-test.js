/*global window, ok, equal, test, JSON_DATA, asyncTest, start, tau */
/*jslint nomen: true, browser: true*/
/*
 * Unit Test: VirtualListview
 *
 * Michał Szepielak <m.szepielak@samsung.com>
 * Maciej Urbański <m.urbanski@samsung.com>
 *
 * Testing only vertical orientation.
 * @TODO test horizontal orientation
 */

(function (ns) {
	var elList = document.getElementById("vlist1"),
		fixture = document.getElementById("qunit-fixture"),
		drawListener,
		drawEventReceived = false;

	/*
	 * Function triggering touch event
	 */
	function triggerTouchEvent(el, event, move) {
		var ev = document.createEvent("MouseEvent");

		ev.initMouseEvent(
			event,
			true /* bubble */, true /* cancelable */,
			window, null,
			0, 0, 0, 0, /* coordinates */
			false, false, false, false, /* modifier keys */
			0 /*left*/, null
		);
		ev.touches = move || [{clientX: 0, clientY: 0}];
		ev.changedTouches = move || [{clientX: 0, clientY: 0}];
		el.dispatchEvent(ev);
	}

	// Prepare function to test draw event
	drawListener = function () {
		drawEventReceived = true;
		elList.removeEventListener("draw", drawListener, false);
	};

	// Set listener
	elList.addEventListener("draw", drawListener, false);

	module("profile/wearable/widget/wearable/VirtualList");

	// RUN TEST 1
	asyncTest("VirtualList draw method", 9, function () {
		var children = elList.children,
			nextDiv = elList.nextElementSibling,
			li = children[0];

		// we need wait because vlistn eyquti
		setTimeout(function () {
			equal(drawEventReceived, true, "Draw Event was sent");
			equal(children.length, 100, "Widget created 100 li elements");
			equal(elList.style.position, "relative", "Position style is set to relative");
			equal(elList.style.top, "", "Top style is not set");
			equal(nextDiv.tagName, "DIV", "After UL was created div");
			equal(nextDiv.style.display, "block", "DIV has proper display style");
			equal(nextDiv.style.position, "static", "DIV has proper display position");
			ok(nextDiv.style.height, "DIV has proper display height");
			equal(li.innerHTML, "<a><span class=\"ui-li-text-main\" style=\"overflow:hidden; white-space:nowrap\">Abdelnaby, Alaa</span><div data-role=\"button\" data-inline=\"true\" data-icon=\"plus\" data-style=\"box\"></div></a>", "LI element has proper innerHTML");
			start();
		}, 100);
	});


	// RUN TEST 2
	test("VirtualList scrollToIndex method", 6, function () {
		var scrollview = elList.parentNode,
			vList = tau.widget.VirtualListview(elList),
			height = elList.firstElementChild.offsetHeight,
			numberOfChild = JSON_DATA.length;

		vList.scrollToIndex(100);
		ok(scrollview.scrollTop >= height * 100, "scrollTop is set to >= 100 * height");
		vList.scrollToIndex(500);
		ok(scrollview.scrollTop >= height * 500, "scrollTop is set to >= 500 * height");
		vList.scrollToIndex(1000);
		ok(scrollview.scrollTop >= height * 1000, "scrollTop is set to >= 1000 * height");
		vList.scrollToIndex(0);
		ok(scrollview.scrollTop === 0, "scrollTop is set to 0");
		vList.scrollToIndex(10000000);
		// because virtual list calculate height approximately we have to add 15% for error correction
		ok(scrollview.scrollTop <= height * (numberOfChild * 1.15), "scrollTop is set to <= height * (numberOfChild * 1.15)");
		vList.scrollToIndex(-200);
		ok(scrollview.scrollTop === 0, "scroll to negative index - scrollTop is set to 0");
	});

	// RUN TEST 3
	test("VirtualList on scroll action", 2, function () {
		var scrollview = elList.parentNode,
			li,
			vList = tau.widget.VirtualListview(elList),
			height = elList.firstElementChild.offsetHeight;

		vList.scrollToIndex(0);
		li = elList.children[1];
		li.scrollIntoView();
		ok(scrollview.scrollTop < 3 * height, "scrollTop is set to < 50");
		li = elList.children[elList.children.length / 2];
		li.scrollIntoView();
		ok(scrollview.scrollTop > 3 * height, "scrollTop is set to > 50");
	});

	// RUN TEST 5
	test("VirtualList scrollTo method", function () {
		var scrollview = elList.parentNode,
			vList = tau.widget.VirtualListview(elList),
			height = elList.firstElementChild.offsetHeight,
			numberOfChild = JSON_DATA.length;

		vList.scrollTo(0);
		ns.event.trigger(scrollview, "scroll");

		vList.scrollTo(300);
		ns.event.trigger(scrollview, "scroll");
		equal(scrollview.scrollTop, 300, "scrollTop is set to 300");

		vList.scrollTo(500);
		ns.event.trigger(scrollview, "scroll");

		equal(scrollview.scrollTop, 500, "scrollTop is set to 500");
		ns.event.trigger(scrollview, "scroll");

		vList.scrollTo(5000);
		ns.event.trigger(scrollview, "scroll");
		equal(scrollview.scrollTop, 5000, "scrollTop is set to 5000");

		vList.scrollTo(3000);
		ns.event.trigger(scrollview, "scroll");
		equal(scrollview.scrollTop, 3000, "scrollTop is set to 3000");

		vList.scrollTo(0);
		ns.event.trigger(scrollview, "scroll");
		equal(scrollview.scrollTop, 0, "scrollTop is set to 0");

		vList.scrollTo(30000000);
		ns.event.trigger(scrollview, "scroll");
		// because virtual list calculate height approximately we have to add 15% for error correction
		ok(scrollview.scrollTop > height * (numberOfChild * 0.85) && scrollview.scrollTop < height * (numberOfChild * 1.15), "scrollTop is set to max");
	});

	// RUN TEST 6
	test("VirtualList destroy method", 4, function () {
		var children = elList.children,
			nextDiv = elList.nextElementSibling,
			vList = tau.widget.VirtualListview(elList);

		vList.destroy();
		equal(children.length, 0, "Widget created 0 li elements");
		equal(elList.style.position, "static", "Position style is set to static");
		equal(elList.style.top, "auto", "Top style is not set");
		ok(nextDiv, "After UL DIV was deleted");
	});

	// RUN TEST 7
	test("VirtualList buffer sizing", function () {
		var vList,
			config;

		vList = tau.widget.VirtualListview(elList);
		vList.destroy();
		config = {
			dataLength: 10,
			bufferSize: 0,
			listItemUpdater: function () {
				return null;
			}
		};
		vList = tau.widget.VirtualListview(elList, config);
		equal(vList.options.bufferSize, 1, "Buffer size is set to 1");
		equal(vList.options.dataLength, 10, "Buffer size is set to 1");
		vList.destroy();

		config = {
			dataLength: 10,
			bufferSize: 500,
			listItemUpdater: function () {
				return null;
			}
		};
		vList = tau.widget.VirtualListview(elList, config);
		equal(vList.options.bufferSize, 10, "Buffer size is set to 10");
		equal(vList.options.dataLength, 10, "Buffer size is set to 10");
		vList.destroy();
	});

	fixture.style.position = "absolute";
	fixture.style.top = "-10000px";
	fixture.style.left = "-10000px";
	fixture.style.height = "10000px";
	fixture.style.width = "10000px";

}(window.tau));
