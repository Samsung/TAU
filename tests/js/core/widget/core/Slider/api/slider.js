/* global test, equal, tau */
(function (ns) {
	"use strict";

	module("core/widget/core/Slider");

	test("API ns.widget.Slider", function () {
		var widget,
			Slider;

		equal(typeof ns, "object", "Class ns exists");
		equal(typeof ns.widget, "object", "Class ns.widget exists");
		equal(typeof ns.widget.core, "object", "Class ns.widget.mobile exists");
		equal(typeof ns.widget.core.Slider, "function", "Class ns.widget.mobile.Slider exists");

		widget = new ns.widget.core.Slider();
		Slider = ns.widget.core.Slider;

		equal(typeof widget.configure, "function", "Method slider.configure exists");
		equal(typeof widget._getCreateOptions, "function", "Method slider._getCreateOptions exists");
		equal(typeof widget.build, "function", "Method slider.build exists");
		equal(typeof widget.init, "function", "Method slider.init exists");
		equal(typeof widget.bindEvents, "function", "Method slider.bindEvents exists");
		equal(typeof widget.destroy, "function", "Method slider.destroy exists");
		equal(typeof widget.disable, "function", "Method slider.disable exists");
		equal(typeof widget.enable, "function", "Method slider.enable exists");
		equal(typeof widget.refresh, "function", "Method slider.refresh exists");
		equal(typeof widget.option, "function", "Method slider.option exists");

		equal(typeof Slider.classes, "object", "Property slider.classes exists");
		equal(typeof Slider.classes.SLIDER, "string", "Property slider.classes.SLIDER exists");
		equal(typeof Slider.classes.SLIDER_HORIZONTAL, "string", "Property slider.classes.SLIDER_HORIZONTAL exists");
		equal(typeof Slider.classes.SLIDER_VERTICAL, "string", "Property slider.classes.SLIDER_VERTICAL exists");
		equal(typeof Slider.classes.SLIDER_VALUE, "string", "Property slider.classes.SLIDER_VALUE exists");
		equal(typeof Slider.classes.SLIDER_HANDLER, "string", "Property slider.classes.SLIDER_HANDLER exists");
		equal(typeof Slider.classes.SLIDER_HANDLER_EXPAND, "string", "Property slider.classes.SLIDER_HANDLER_EXPAND exists");
		equal(typeof Slider.classes.SLIDER_CENTER, "string", "Property slider.classes.SLIDER_CENTER exists");
		equal(typeof Slider.classes.SLIDER_HANDLER_ACTIVE, "string", "Property slider.classes.SLIDER_HANDLER_ACTIVE exists");


		equal(typeof widget._build, "function", "Method slider._build exists");
		equal(typeof widget._bindEvents, "function", "Method slider._bindEvents exists");
		equal(typeof widget._init, "function", "Method slider._bindEvents exists");
		equal(typeof widget.value, "function", "Method slider.value exists");
	});
}(tau));
