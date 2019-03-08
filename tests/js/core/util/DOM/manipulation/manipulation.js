/* global ns, equal, ok, test, throws, notEqual */
function runTests(DOM, helpers) {
	function initHTML() {
		var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/util/DOM/manipulation/test-data/sample.html"),
			parent = document.getElementById("qunit-fixture") || helpers.initFixture(),
			testNode = document.createElement("div"),
			tmpNode,
			tmp = 10;

		parent.innerHTML = HTML;

		testNode.setAttribute("class", "test-node");
		while (tmp--) {
			tmpNode = document.createElement("div");
			tmpNode.setAttribute("class", "test-node");
			testNode.appendChild(tmpNode)
		}
		parent.appendChild(testNode);
	}

	module("core/util/DOM/manipulation", {
		setup: initHTML
	});

	test("util.DOM.manipulation - basic test for function appendNodes", function () {
		var elem1 = document.getElementById("dom1"),
			elem2 = document.getElementById("dom2"),
			elem3 = document.getElementById("dom3"),
			thrownValue;

		equal(typeof DOM.appendNodes(elem1, elem2), "object", "function appendNodes returns object");
		ok(DOM.appendNodes(elem1, [elem2, elem3]) instanceof Array, "function appendNodes returns array");
		throws(function () {
			thrownValue = DOM.appendNodes(null, elem1);
		}, "Context empty!", "function throws error on null context");
		equal(thrownValue, null, "thrown value is null");
	});

	test("util.DOM.manipulation - check function appendNodes", function () {
		var t5 = document.getElementById("test5"),
			t6 = document.getElementById("test6"),
			testNode = document.querySelector(".test-node"),
			testNodes = testNode.children;

		equal(t5.children.length, 0, "appendNodes: element has 0 children before appending 1 node");
		DOM.appendNodes(t5, testNode);
		equal(t5.children.length, 1, "appendNodes: element has 1 children after appending");
		equal(t5.children[0].className, "test-node", "appendNodes: elements child node has proper class");

		equal(t6.children.length, 0, "appendNodes: element has 0 children before appending 10 nodes");
		DOM.appendNodes(t6, testNodes);
		equal(t6.children.length, 10, "appendNodes: element has 10 children after appending");
		equal(t6.children[0].className, "test-node", "appendNodes: elements child node has proper class");
	});

	test("util.DOM.manipulation - basic test for function replaceWithNodes", function () {
		var elem1 = document.getElementById("dom1"),
			elem2 = document.getElementById("dom2"),
			elem3 = document.getElementById("dom3"),
			elem4 = document.getElementById("dom4");

		equal(typeof DOM.replaceWithNodes(elem1, elem2), "object", "function replaceWithNodes returns object");
		ok(DOM.replaceWithNodes(elem2, [elem3, elem4]) instanceof Array, "function replaceWithNodes returns array");
	});

	test("util.DOM.manipulation - check function replaceWithNodes", function () {
		var t7 = document.getElementById("test7"),
			t8 = document.getElementById("test8"),
			testNode = document.querySelector(".test-node"),
			testNodes = [].slice.call(testNode.children);

		equal(t7.parentNode.id, "qunit-fixture", "replaceWithNodes: element has has parent node qunit-fixture");
		DOM.replaceWithNodes(t7, testNode);
		equal(t7.parentNode, null, "replaceWithNodes: element has not any parent node (element has been replaced)");
		equal(testNode.parentNode.id, "qunit-fixture", "replaceWithNodes: test node has a parent qunit-fixture");

		equal(t8.parentNode.id, "qunit-fixture", "replaceWithNodes: element has has parent node qunit-fixture");
		DOM.replaceWithNodes(t8, testNodes);
		equal(t8.parentNode, null, "replaceWithNodes: element no parent (element has been replaced with 10 nodes)");
		equal(testNodes[0] && testNodes[0].parentNode.id, "qunit-fixture", "replaceWithNodes: testNodes at index 0 has a parent node qunit-fixture");

	});

	test("util.DOM.manipulation - check function removeAllChildren", function () {
		var elem1 = document.getElementById("dom1");

		equal(elem1.children.length, 3, "element has 3 children before calling removeAllChildren");
		equal(typeof DOM.removeAllChildren(elem1), "undefined", "function removeAllChildren returns nothing");
		equal(elem1.children.length, 0, "element has no child after calling removeAllChildren");
	});

	test("util.DOM.manipulation - check function insertNodesBefore", function () {
		var elem1 = document.getElementById("dom1"),
			elem2 = document.getElementById("dom2"),
			elem3 = document.getElementById("dom3"),
			t9 = document.getElementById("test9"),
			t10 = document.getElementById("test10"),
			testNode = document.querySelector(".test-node"),
			testNodes = [].slice.call(testNode.children),
			thrownValue;

		equal(typeof DOM.insertNodesBefore(elem1, elem2), "object", "function insertNodesBefore returns object");
		ok(DOM.insertNodesBefore(elem1, [elem2, elem3]) instanceof Array, "function insertNodesBefore returns array");
		throws(function () {
			thrownValue = DOM.insertNodesBefore(null, elem1);
		}, "Context empty!", "function throws error on null context");
		equal(thrownValue, null, "thrown value is null");

		notEqual(t9.previousSibling.className, "test-node", "insertNodesBefore: elements previous sibling class name is not equal test-node");
		DOM.insertNodesBefore(t9, testNode);
		equal(t9.previousSibling.className, "test-node", "insertNodesBefore: elements previous sibling class name is equal test-node after insertNodesBefore");

		notEqual(t10.previousSibling.className, "test-node", "insertNodesBefore: elements previous sibling class name is not equal test-node");
		DOM.insertNodesBefore(t10, testNodes);
		equal(t10.previousSibling.className, "test-node", "insertNodesBefore: elements previous sibling class name is equal test-node after insertNodesBefore with collection");

	});

	test("util.DOM.manipulation - check function insertNodeAfter", function () {
		var elem1 = document.getElementById("dom1"),
			elem2 = document.getElementById("dom2"),
			thrownValue;

		equal(typeof DOM.insertNodeAfter(elem1, elem2), "object", "function insertNodeAfter returns object");
		throws(function () {
			thrownValue = DOM.insertNodeAfter(null, elem1);
		}, "Context empty!", "function throws error on null context");
		equal(thrownValue, null, "thrown value is null");
	});

	test("util.DOM.manipulation - basic test for function wrapInHTML", function () {
		var elem1 = document.getElementById("dom1"),
			elem2 = document.getElementById("dom2"),
			elem3 = document.getElementById("dom3");

		equal(typeof DOM.wrapInHTML(elem1, "<div></div>"), "object", "function wrapInHTML returns object");
		ok(DOM.wrapInHTML([elem2, elem3], "<a></a>") instanceof Array, "function wrapInHTML returns array");
	});

	test("util.DOM.manipulation - check function wrapInHTML", function () {
		var t1 = document.getElementById("test1"),
			t1OldParent = t1.parentNode,
			t2 = document.getElementById("test2"),
			t4 = document.getElementById("qunit-fixture").getElementsByClassName("test4"),
			t1Rref = DOM.wrapInHTML(t1, "<div id=\"first-test\"></div>"),
			t1Parent = t1Rref.parentNode,
			t2Ref,
			t2PrevSibling,
			t2NextSibling,
			t3 = document.createElement("div"),
			t3Ref,
			t3Parent,
			t4Ref,
			t4i,
			t4Len,
			t11 = document.getElementById("test11");

		equal(t1Rref, t1, "wrapInHTML: wrapped node and original node are the same");
		equal(t1Parent, t1.parentNode, "wrapInHTML: wrapped node and original node parents are the same");
		equal("first-test", t1Parent.id, "wrapInHTML: parent node has proper id attribute");
		notEqual(t1OldParent, t1Parent, "wrapInHTML: previous parent and new parent are not the same");
		equal(t1OldParent, t1Parent.parentNode, "wrapInHTML: previous parent and new parents parent are the same");

		t2Ref = DOM.wrapInHTML(t2, "<div id=\"second-test\"><span id=\"sibling-1\"></span><span id=\"sibling-2\"></span>${content}<span id=\"sibling-3\"></span></div>");
		t2PrevSibling = t2Ref.previousSibling;
		t2NextSibling = t2Ref.nextSibling;
		ok(t2PrevSibling, "wrapInHTML: ref has prev sibling");
		ok(t2NextSibling, "wrapInHTML: ref has next sibling");
		ok(t2.previousSibling, "wrapInHTML: original has prev sibling");
		ok(t2.nextSibling, "wrapInHTML: original has next sibling");
		equal("second-test", t2.parentNode.id, "wrapInHTML: parent node has proper id attribute");

		equal(t3.parentNode, null, "wrapInHTML: in-memory element has no parent node");
		t3Ref = DOM.wrapInHTML(t3, "<div id=\"third-test\"></div>");
		t3Parent = t3Ref.parentNode;
		ok(t3Parent, "wrapInHTML: in-memory element has parent after wrap");
		equal(t3Parent.parentNode, null, "wrapInHTML: in-memory elements parent node has no parent node");
		equal("third-test", t3Parent.id, "wrapInHTML: in-memory elements parent node has proper id attribute");

		t4Ref = DOM.wrapInHTML(t4, "<div id=\"fourth-test\"></div>");
		for (t4i = 0, t4Len = t4Ref.length; t4i < t4Len; ++t4i) {
			ok(t4Ref[t4i], "wrapInHTML: Collection element " + (t4i + 1) + " has a parent");
			equal(t4Ref[t4i].parentNode.id, "fourth-test", "wrapInHTML: Collection element " + (t4i + 1) + " parent has proper id");
		}

		DOM.wrapInHTML(t11.childNodes, "<span class='foo'></span>");
		equal(t11.childNodes.length, 1, "Wrapped with span");
		equal(t11.childNodes[0].tagName, "SPAN", "Wrapped with span");
		equal(t11.childNodes[0].childNodes.length, 2, "All nodes moved to span");
	});
}


if (typeof define === "function") {
	define(function () {
		return runTests;
	});
} else {
	runTests(tau.util.DOM, window.helpers);
}
