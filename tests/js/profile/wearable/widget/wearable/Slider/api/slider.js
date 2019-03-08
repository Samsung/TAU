/* global test, equal, tau */
(function (ns) {
	test("API of Slider Widget", function () {
		var widget,
			Slider;

		equal(typeof ns, "object", "Class tau exists");
		equal(typeof ns.widget, "object", "Class tau.widget exists");
		equal(typeof ns.widget.wearable, "object", "Class tau.widget.wearable exists");
		equal(typeof ns.widget.wearable.Slider, "function", "Class tau.widget.wearable.Slider exists");

		widget = ns.engine.instanceWidget(document.getElementById("slider"), "Slider");
		Slider = ns.widget.wearable.Slider;

		equal(typeof widget.configure, "function", "Method Slider.configure exists");
		equal(typeof widget.build, "function", "Method Slider.build exists");
		equal(typeof widget.init, "function", "Method Slider.init exists");
		equal(typeof widget.destroy, "function", "Method Slider.destroy exists");
		equal(typeof widget.refresh, "function", "Method Slider.refresh exists");
		equal(typeof widget.option, "function", "Method Slider.option exists");
		equal(typeof widget._setValue, "function", "Method Slider._setValue exists");
		equal(typeof widget._getValue, "function", "Method Slider._getValue exists");

		equal(typeof widget.options, "object", "Property Slider.options exists");
		equal(typeof Slider.classes, "object", "Property Slider.classes exists");
	});
}(tau));