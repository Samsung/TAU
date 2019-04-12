/* global test, tau, equal */
module("core/widget/core/Dimmer", {});

if (window.MutationObserver && !window.MutationObserver.mockup) { // Disable tests if MutationObserver does not exist
	test("API", function () {
		var widget;

		equal(typeof tau, "object", "Class tau exists");
		equal(typeof tau.widget, "object", "Class tau.widget exists");
		equal(typeof tau.widget.core, "object", "Class tau.widget.core exists");
		equal(typeof tau.widget.core.Dimmer, "function", "Class tau.widget.core.Dimmer exists");
		widget = new tau.widget.core.Dimmer();

		equal(typeof widget.configure, "function", "Method Dimmer.configure exists");
		equal(typeof widget.build, "function", "Method Dimmer.build exists");
		equal(typeof widget.init, "function", "Method Dimmer.init exists");
		equal(typeof widget.bindEvents, "function", "Method Dimmer.bindEvents exists");
		equal(typeof widget.destroy, "function", "Method Dimmer.destroy exists");
		equal(typeof widget.disable, "function", "Method Dimmer.disable exists");
		equal(typeof widget.enable, "function", "Method Dimmer.enable exists");
		equal(typeof widget.refresh, "function", "Method Dimmer.refresh exists");
		equal(typeof widget.option, "function", "Method Dimmer.option exists");
		equal(typeof widget.value, "function", "Method Dimmer.value exists");

	});
} else {
	test("Dimmer Widget cannot be created in this environment", function () {
		equal(1, 1, "Mutation observer does not exist");
	});
}