/* global equal, test */
(function (ns) {
	"use strict";
	module("core/widget/core/Marquee/api/marquee");
	test("API of core Marquee Widget", function () {
		var widget,
			Marquee;

		equal(typeof ns, "object", "Class ns exists");
		equal(typeof ns.widget, "object", "Class ns.widget exists");
		equal(typeof ns.widget.core, "object", "Class ns.widget.core exists");
		equal(typeof ns.widget.core.Marquee, "function", "Class ns.widget.mobile.Marquee exists");

		widget = ns.engine.instanceWidget(document.getElementById("marquee"), "Marquee");
		Marquee = ns.widget.core.Marquee;

		// check methods of Marquee widget
		equal(typeof widget._build, "function", "Method marquee._build exists");
		equal(typeof widget._init, "function", "Method marquee._build exists");
		equal(typeof widget._destroy, "function", "Method marquee._destroy exists");
		equal(typeof widget.start, "function", "Method marquee.start exists");
		equal(typeof widget.stop, "function", "Method marquee.stop exists");
		equal(typeof widget.reset, "function", "Method marquee.reset exists");


		// check options of widget
		equal(typeof widget.options, "object", "Property marquee.options exists");
		equal(typeof widget.options.marqueeStyle, "string", "Property marquee.options.marqueeStyle exists");
		equal(typeof widget.options.speed, "number", "Property marquee.options.speed exists");
		equal(typeof widget.options.iteration, "number", "Property marquee.options.iteration exists");
		equal(typeof widget.options.delay, "number", "Property marquee.options.delay exists");
		equal(typeof widget.options.timingFunction, "string", "Property marquee.options.timingFunction exists");
		equal(typeof widget.options.runOnlyOnEllipsisText, "boolean", "Property marquee.options.runOnlyEllipsisText exists");
		equal(typeof widget.options.autoRun, "boolean", "Property marquee.options.autoRun exists");
		equal(typeof widget.options.ellipsisEffect, "string", "Property marquee.options.autoRun exists");

		// check options of Marquee classes
		equal(typeof Marquee.classes, "object", "Property marquee.classes exists");
		equal(typeof Marquee.classes.MARQUEE_CONTENT, "string", "Property marquee.classes.MARQUEE_CONTENT exists");
		equal(typeof Marquee.classes.ANIMATION_RUNNING, "string", "Property marquee.classes.ANIMATION_RUNNING exists");
		equal(typeof Marquee.classes.ANIMATION_STOPPED, "string", "Property marquee.classes.ANIMATION_STOPPED exists");
		equal(typeof Marquee.classes.ANIMATION_IDLE, "string", "Property marquee.classes.ANIMATION_IDLE exists");
	});
}(tau));
