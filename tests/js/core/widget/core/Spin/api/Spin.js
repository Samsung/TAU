/* global test, equal, tau */
(function (ns) {
	test("API of Spin Widget", function () {
		var widget,
			Spin;

		equal(typeof ns, "object", "Class tau exists");
		equal(typeof ns.widget, "object", "Class tau.widget exists");
		equal(typeof ns.widget.core, "object", "Class tau.widget.wearable exists");
		equal(typeof ns.widget.core.Spin, "function", "Class tau.widget.wearable.Spin exists");

		widget = ns.engine.instanceWidget(document.getElementById("spin"), "Spin");
		Spin = ns.widget.core.Spin;

		equal(typeof widget.value, "function", "Method Spin.getStartValue exists");
		equal(typeof widget.handleEvent, "function", "Method Spin.handleEvent exists");
		equal(typeof widget.options, "object", "Property Spin.options exists");
		equal(typeof Spin.classes, "object", "Property Spin.classes exists");
	});
}(tau));
