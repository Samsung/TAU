/* global module, test, equal, tau */
(function (ns) {
	"use strict";
	module("profile/mobile/widget/mobile/TextEnveloper");

	test("API ns.widget.TextEnveloper", function () {
		var widget,
			TextEnveloper;

		equal(typeof ns, "object", "Class ns exists");
		equal(typeof ns.widget, "object", "Class ns.widget exists");
		equal(typeof ns.widget.mobile, "object", "Class ns.widget.mobile exists");
		equal(typeof ns.widget.mobile.TextEnveloper, "function", "Class ns.widget.mobile.TextEnveloper exists");

		widget = ns.engine.instanceWidget(document.getElementById("textenveloper"), "TextEnveloper");
		TextEnveloper = ns.widget.mobile.TextEnveloper;

		equal(typeof widget.configure, "function", "Method textenveloper.configure exists");
		equal(typeof widget._getCreateOptions, "function", "Method textenveloper._getCreateOptions exists");
		equal(typeof widget.build, "function", "Method textenveloper.build exists");
		equal(typeof widget.init, "function", "Method textenveloper.init exists");
		equal(typeof widget.bindEvents, "function", "Method textenveloper.bindEvents exists");
		equal(typeof widget.destroy, "function", "Method textenveloper.destroy exists");
		equal(typeof widget.disable, "function", "Method textenveloper.disable exists");
		equal(typeof widget.enable, "function", "Method textenveloper.enable exists");
		equal(typeof widget.refresh, "function", "Method textenveloper.refresh exists");
		equal(typeof widget.add, "function", "Method textenveloper.add exists");
		equal(typeof widget.remove, "function", "Method textenveloper.remove exists");
		equal(typeof widget.length, "function", "Method textenveloper.length exists");

		equal(typeof widget.options, "object", "Property textenveloper.options exists");
		equal(typeof TextEnveloper.classes, "object", "Property textenveloper.classes exists");
		equal(typeof TextEnveloper.classes.TEXT_ENVELOPER, "string", "Property textenveloper.classes.TEXT_ENVELOPER exists");
		equal(typeof TextEnveloper.classes.TEXT_ENVELOPER_INPUT, "string", "Property textenveloper.classes.TEXT_ENVELOPER_INPUT exists");
		equal(typeof TextEnveloper.classes.TEXT_ENVELOPER_BTN, "string", "Property textenveloper.classes.TEXT_ENVELOPER_BTN exists");
		equal(typeof TextEnveloper.classes.TEXT_ENVELOPER_BTN_ACTIVE, "string", "Property textenveloper.classes.TEXT_ENVELOPER_BTN_ACTIVE exists");
		equal(typeof TextEnveloper.classes.TEXT_ENVELOPER_BTN_BLUR, "string", "Property textenveloper.classes.TEXT_ENVELOPER_BTN_BLUR exists");

		equal(typeof widget._build, "function", "Method textenveloper._build exists");
		equal(typeof widget._bindEvents, "function", "Method textenveloper._bindEvents exists");
		equal(typeof widget._init, "function", "Method textenveloper._bindEvents exists");
	});
}(tau));
