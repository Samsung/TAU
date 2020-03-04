(function (ns) {
	"use strict";

	module("profile/mobile/widget/mobile/Expandable", {});

	test("Check the existence of objects/functions", function () {
		equal(typeof ns, "object", "ns exists");
		equal(typeof ns.widget, "object", "ns.widget exists");
		equal(typeof ns.widget.mobile, "object", "ns.widget.mobile exists");
		equal(typeof ns.widget.mobile.Expandable, "function", "ns.widget.mobile.Collapsible exists");
	});

	test("Check widget options existance and default values", function () {
		var widget = new tau.widget.Expandable(),
			options = widget.options;

		equal(typeof options, "object", "Options object exists");

		strictEqual(options.collapsed, true, "options.collapsed has proper default value");

		equal(options.heading, "h1,h2,h3,h4,h5,h6,legend,li", "options.heading has proper default value");
		equal(typeof widget.build, 'function', 'Method Expandable.build exists');
		equal(typeof widget.init, 'function', 'Method Expandable.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method Expandable.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method Expandable.destroy exists');
	});
}(ej));