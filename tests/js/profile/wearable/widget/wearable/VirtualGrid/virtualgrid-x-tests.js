/* global ok, equal, test */
(function () {
	"use strict";

	var list = document.getElementById("vgrid2");

	module("profile/wearable/widget/wearable/VirtualGrid");

	list.addEventListener("draw", function drawHandler() {
		list.removeEventListener("draw", drawHandler);

		test("Testing drawing horizontal oriented grid", function () {
			var children = list.children,
				li = children[0],
				card = li.querySelector(".ui-demo-rotation-namecard"),
				listStyle = window.getComputedStyle(list),
				liStyle = window.getComputedStyle(li);

			ok(true, "'draw' event was handled");

			ok(!!card, "Template is used properly");
			ok(!!card.querySelector(".ui-demo-namecard-pic"), "Template is used properly - image");
			ok(!!card.querySelector(".ui-demo-namecard-contents"), "Template is used properly - content");

			equal(children.length, 40, "Widget created 40 elements");
			equal(card.children.length, 2, "Elements contain proper number of children");

			equal(listStyle.getPropertyValue("overflow-x"), "auto", "List overflow-x is set to auto");
			equal(list.style.left, "", "List has no left value");

			equal(list.parentElement.tagName, "DIV", "List is wrapped in div");
			equal(list.parentElement.style.height, "100%", "List parent div has 100% height style");

			equal(liStyle.getPropertyValue("float"), "left", "Li elements are floated left");
			equal(liStyle.getPropertyValue("overflow"), "hidden", "Li elements have overflow set to hidden");
			equal(li.style.height, "100%", "Li height is set to 100%");
		});
	}, false);
}());
