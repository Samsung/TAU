/* global asyncTest, expect, tau, ok, equal, start */
module("core/engine");
asyncTest("generating widgets", function () {
	expect(6);
	document.addEventListener("bound", function test1() {
		var engine = tau.engine,
			eventUtils = tau.event,
			el1 = document.getElementById("test1-test-widget"),
			b1 = engine.getBinding(el1, "Test1"),
			e1 = b1.element;

		// @NOTE: ACTUAL TESTS HERE!
		document.removeEventListener("bound", test1);

		ok(b1, "binding for widget1 with def created");

		equal(b1.id, el1.id, "DOM and binding ids are the same for widget1");

		ok(e1.children.length, "widget1 child created");

		ok(e1.classList.contains("test"), "Widget1 classes moved");

		equal(b1.apiCall(2), 4, "Widget1 api call");

		e1.addEventListener("test-event-bounce", function (evt1) {
			var data = evt1.detail.testData;

			equal(data, 4, "Widget1 event returning data");
			start();
		}, false);

		eventUtils.trigger(e1, "test-event", {"testData": 2});
	});
	tau.engine.run();
});