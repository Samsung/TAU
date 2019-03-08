	module("profile/wearable/widget/wearable/IndexScrollbar", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	var toucheventHandler;

	function fireEvent(el, type, props) {
		var evt = new CustomEvent(type, {
				"bubbles": true,
				"cancelable": true
			}),
			prop;
		for (prop in props) {
			if (props.hasOwnProperty(prop)) {
				evt[prop] = props[prop];
			}
		}
		try {
			return el.dispatchEvent(evt);
		} catch (err) {
			console.log(err);
		}
		return false;
	}

	test ("Settings after building", function () {
		var elem1 = document.getElementById("withdata"),
			elem2 = document.getElementById("settings1"),
			elem3 = document.getElementById("settings2"),
			widget = ej.engine.instanceWidget(elem1, "IndexScrollbar");

		equal(widget._data("extended"), true, "Widget is extended");
		equal(widget.options.index.length, 3, "Widget has new index from data-index");
		equal(typeof widget.indicator, "object", "Widget has indicator");
		equal(widget.indicator.element.className, "ui-indexscrollbar-indicator", "Widget indicator has proper className");
		equal(widget.indicator.element.children.length, 1, "Widget indicator has one child");
		equal(widget.indicator.element.children[0].tagName, "SPAN", "Widget indicator has span child");
		equal(widget.element.previousElementSibling.className, widget.options.indicatorClass, "Widget indicator is placed previous widget");

		widget = ej.engine.instanceWidget(elem2, "IndexScrollbar", {indicatorClass: "new-indicator"});
		equal(widget._data("extended"), true, "Widget is extended");
		equal(widget.options.index.length, 27, "Widget has default index");
		equal(widget.element.previousElementSibling.className,"new-indicator", "Widget indicator has a new indicator's class from options");

		widget = ej.engine.instanceWidget(elem3, "IndexScrollbar", {delimiter: "#", index: "A#B"});
		equal(widget._data("extended"), true, "Widget is extended");
		equal(widget.options.index.length, 2, "Widget has new a index from options");
		equal(widget.options.index[0], "A", "Widget has new a index from options");
		equal(widget.options.index[1], "B", "Widget has new a index from options");
		equal(widget.options.delimiter, "#", "Widget has a new index");
	});

	test ("Built list", function () {
		var elem1 = document.getElementById("list7"),
			elem2 = document.getElementById("list8"),
			widget,
			list;

		widget = ej.engine.instanceWidget(elem1, "IndexScrollbar", {index: ["X", "Y", "Z"]});
		// widget with 3 elements in index (all of them are shown)
		list = widget.element.children[0];
		equal(list.tagName, "UL", "Element has child, which is a list");
		equal(list.children.length, 3, "List has 3 children");
		equal(list.children[0].textContent, "X", "First child is 'X'");
		equal(list.children[1].textContent, "Y", "Second child is 'Y'");
		equal(list.children[2].textContent, "Z", "Third child is 'Z'");

		widget = ej.engine.instanceWidget(elem2, "IndexScrollbar", {maxIndexLen: 12});
		// widget with default index (olny A, G, L, Q, V and 1 are shown)
		list = widget.element.children[0];
		equal(list.tagName, "UL", "Element has child, which is a list");
		equal(widget.options.maxIndexLen, 11, "maxIndexLen was corrected");
		equal(list.children.length, 11, "List has 11 children");
		equal(list.children[0].textContent, "A", "First child is 'A'");
		equal(list.children[1].textContent, "*", "Second child is '*'");
		equal(list.children[2].textContent, "G", "Third child is 'G");
		equal(list.children[3].textContent, "*", "4. child is '*'");
		equal(list.children[4].textContent, "L", "5. child is 'L'");
		equal(list.children[5].textContent, "*", "6. child is '*'");
		equal(list.children[6].textContent, "Q", "7. child is 'Q'");
		equal(list.children[7].textContent, "*", "8. child is '*'");
		equal(list.children[8].textContent, "V", "9. child is 'V'");
		equal(list.children[9].textContent, "*", "10. child is '*'");
		equal(list.children[10].textContent, "1", "11. child is '1'");
	});

	test ("Built list with supplementaryIndex", function () {
		var elem1 = document.getElementById("list9"),
			widget,
			list,
			elemA,
			secondIndex = ["1", "2", "3"];

		widget = ej.engine.instanceWidget(elem1, "IndexScrollbar", {index: ["X", "Y", "Z"], supplementaryIndex: function(firstIndex) {
			return secondIndex;
		}});
		// widget with 3 elements in index (all of them are shown)
		list = widget.element.children[0];
		equal(list.tagName, "UL", "Element has child, which is a list");
		equal(list.children.length, 3, "List has 3 children");
		equal(list.children[0].textContent, "X", "First child is 'X'");
		equal(list.children[1].textContent, "Y", "Second child is 'Y'");
		equal(list.children[2].textContent, "Z", "Third child is 'Z'");
		elemA = list.children[0];

		list = widget.element.children[1];
		equal(list.tagName, "UL", "Element has child, which is a list");
		equal(list.children.length, 0, "List has 3 children");

		ej.event.trigger(elemA, "vmousedown");

		lastElementOffset = ej.util.DOM.getElementOffset(elemA);
		fireEvent(elem1, "vmousemove", {clientX: lastElementOffset.left - 2 , clientY: lastElementOffset.top});

		equal(list.children.length, 3, "List has 3 children");

		equal(list.children[0].textContent, "1", "First child is 'X'");
		equal(list.children[1].textContent, "2", "Second child is 'Y'");
		equal(list.children[2].textContent, "3", "Third child is 'Z'");

		lastElementOffset = ej.util.DOM.getElementOffset(list.children[0]);
		fireEvent(list.children[1], "vmousemove", {clientX: lastElementOffset.left , clientY: lastElementOffset.top});

		fireEvent(elem1, "vmousemove", {clientX: lastElementOffset.left , clientY: lastElementOffset.top});

		equal(list.children[0].className, "ui-state-selected", "Element is selected");

		lastElementOffset = ej.util.DOM.getElementOffset(list.children[1]);
		fireEvent(list.children[1], "vmousemove", {clientX: lastElementOffset.left , clientY: lastElementOffset.top});

		equal(list.children[1].className, "ui-state-selected", "Element is selected");

		fireEvent(elem1, "vmouseup", {clientX: lastElementOffset.left , clientY: lastElementOffset.top});

		elemA = widget.element.children[0].children[1];

		ej.event.trigger(elemA, "vmousedown");

		lastElementOffset = ej.util.DOM.getElementOffset(elemA);
		fireEvent(elem1, "vmousemove", {clientX: lastElementOffset.left , clientY: lastElementOffset.top});
		fireEvent(elem1, "vmousemove", {clientX: lastElementOffset.left - 2 , clientY: lastElementOffset.top});

		equal(list.children.length, 3, "List has 3 children");

		equal(list.children[0].textContent, "1", "First child is 'X'");
		equal(list.children[1].textContent, "2", "Second child is 'Y'");
		equal(list.children[2].textContent, "3", "Third child is 'Z'");

		lastElementOffset = ej.util.DOM.getElementOffset(list.children[0]);
		fireEvent(list.children[1], "vmousemove", {clientX: lastElementOffset.left , clientY: lastElementOffset.top});

		fireEvent(elem1, "vmousemove", {clientX: lastElementOffset.left , clientY: lastElementOffset.top});

		equal(list.children[0].className, "ui-state-selected", "Element is selected");

		lastElementOffset = ej.util.DOM.getElementOffset(list.children[1]);
		fireEvent(list.children[1], "vmousemove", {clientX: lastElementOffset.left , clientY: lastElementOffset.top});

		equal(list.children[1].className, "ui-state-selected", "Element is selected");

		fireEvent(elem1, "vmouseup", {clientX: lastElementOffset.left , clientY: lastElementOffset.top});

		widget.destroy();
	});

	test ("Refresh", function () {
		var elem1 = document.getElementById("withdata"),
			widget = ej.engine.instanceWidget(elem1, "IndexScrollbar");

		equal(widget._data("extended"), true, "Widget is _extended before refresh");
		equal(widget.element.children[0].children.length, 3, "Widget has 3 element before refresh");
		widget.refresh();
		equal(widget._data("extended"), true, "Widget is _extended after refresh");
		equal(widget.element.children[0].children.length, 3, "Widget has 3 element after refresh");
	});

	test ("Destroy", function () {
		var elem1 = document.getElementById("withdata"),
			widget = ej.engine.instanceWidget(elem1, "IndexScrollbar");

		equal(widget.widgetName, "IndexScrollbar", "Widget has proper name");
		equal(widget.isBuilt(), true, "Widget is built");
		equal(widget.isBound(), true, "Widget is bound");
		widget.destroy();
		equal(widget.isBuilt(), false, "Widget was destroyed");
		equal(widget.isBound(), false, "Widget was destroyed");
	});

	function testEvent(event) {
		ok(true, "Test event was fired only once");
	}

	asyncTest ("Public - addEventListener", 1, function () {
		var elem1 = document.getElementById("addevent"),
			widget = ej.engine.instanceWidget(elem1, "IndexScrollbar");

		widget.addEventListener("test", testEvent);

		ej.event.trigger(elem1, "test");

		setTimeout(function(){
			widget.removeEventListener("test", testEvent);
			ej.event.trigger(elem1, "test");
			start();
		}, 100);
	});

	asyncTest ("Click", 1, function () {
		var elem1 = document.getElementById("click"),
			widget = ej.engine.instanceWidget(elem1, "IndexScrollbar"),
			elemA = elem1.children[0].children[0],
			elemAtext;

		elemAtext = elemA.textContent;

		ej.event.one(elem1, "select", function (options) {
			equal(options.detail.index, elemAtext, "First element is checked");
			start();
			widget.destroy();
		});

		ej.event.trigger(elemA, "vmousedown");
		ej.event.trigger(elemA, "vmouseup");

	});

	function touchevent (elem1, widget) {
		var indicator = widget.indicator.element,
			value = indicator.textContent,
			lastElementOffset,
			list = elem1.children[0].children;

		equal(indicator && window.getComputedStyle(indicator).display, "block", "Indicatior is displayed");

		lastElementOffset = ej.util.DOM.getElementOffset(list[list.length -1]);

		fireEvent(elem1, "vmousemove", {clientX: lastElementOffset.left, clientY: lastElementOffset.top});
		ok(indicator.textContent !== value, "Indicator has different text");

		fireEvent(elem1, "vmouseup", {touches: []});
		equal(window.getComputedStyle(indicator).display, "none", "Indicatior is not displayed");

		// make widget invisible
		document.getElementById("first").style.left = "-99999em";
		document.getElementById("first").style.top = "-99999em";

		start();
	}

	test ("Resize", function () {
		var elem1 = document.getElementById("resize");

		widget = ej.engine.instanceWidget(elem1, "IndexScrollbar", {index: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15", maxIndexLen: 15});

		equal(widget.options.maxIndexLen, 15, "maxIndexLen before resize");
		document.getElementById("container").classList.add("small");
		ej.event.trigger(window, "resize");
		list = widget.element.children[0];
		equal(list.children.length, 3, "List has 3 children");
		equal(list.children[0].textContent, "1", "First child is '1'");
		equal(list.children[1].textContent, "*", "Second child is '*'");
		equal(list.children[2].textContent, "15", "Third child is '15");

		document.getElementById("container").classList.remove("small");
		document.getElementById("container").classList.add("big");
		ej.event.trigger(window, "resize");
		equal(widget.options.maxIndexLen, 15,"maxIndexLen after resize - big container");

		document.getElementById("container").classList.remove("big");
		ej.event.trigger(window, "resize");
		equal(widget.options.maxIndexLen, 15,"maxIndexLen after resize - normal container");
	});

	asyncTest ("Touch", 3, function () {
		var elem1 = document.getElementById("touch"),
			widget,
			elemA,
			elemOffset;

		// make widget visible for a while
		document.getElementById("first").style.left = "1em";
		document.getElementById("first").style.top = "1em";

		widget = ej.engine.instanceWidget(elem1, "IndexScrollbar");
		toucheventHandler = touchevent.bind(null, elem1, widget);
		elemA = elem1.children[0].children[0];
		elemOffset = ej.util.DOM.getElementOffset(elemA);

		ej.event.one(document, "vmousedown", toucheventHandler);

		fireEvent(elem1, "vmousedown", {clientX: elemOffset.left, clientY: elemOffset.top});
		widget.destroy();
	});

