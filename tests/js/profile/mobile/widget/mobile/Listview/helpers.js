/*global ok:false, equal:false*/
/**
 * List view item test
 * @param {HTMLLIElement|HTMLOLElement} listviewItem
 * @returns {undefined}
 */
function listviewItemTests(listviewItem) {
	"use strict";
	ok(listviewItem !== undefined, "List item instance exists");
	ok(listviewItem.classList.contains("ui-li-static"), "List item has ui-li-static class");
	equal(listviewItem.getAttribute("tabindex"), "0", "List item has tabindex=0");
}

function dividerTests(divider) {
	"use strict";
	ok(divider !== undefined, "divider instance exists");
	ok(divider.classList.contains("ui-li-divider"), "divider item has ui-li-divider class");
	equal(divider.getAttribute("tabindex"), "0", "Divider item has tabindex=0");
	equal(divider.getAttribute("role"), "heading", "Divider item has role=heading");
	equal(divider.getAttribute("data-tau-bound"), "ListDivider", "Divider ej widget is created");
}

function dividerBuildTests(divider) {
	"use strict";
	var dividerText,
		dividerLine;

	equal(divider.children.length, 2, "Divider: content wrapped with span and inserted line");
	dividerText = divider.children[0];
	ok(dividerText !== undefined, "divider text instance exists");
	ok(dividerText.tagName === "SPAN", "divider text instance is HTML Span Element");
	ok(dividerText.classList.contains("ui-divider-text"), "divider text item has ui-divider-text");
	dividerLine = divider.children[1];
	ok(dividerLine !== undefined, "divider line instance exists");
	ok(dividerText.tagName === "SPAN", "divider line instance is HTML Span Element");
	ok(dividerLine.classList.contains("ui-divider-normal-line"), "divider line item has ui-divider-normal-line");
}

