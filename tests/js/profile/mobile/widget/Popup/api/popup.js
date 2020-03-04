(function (ns) {
	'use strict';
	module("profile/mobile/widget/mobile/Popup");
	test ( "API ns.widget.mobile.Popup" , function () {
		var widget;
		equal(typeof ns, "object", "Class ns exists");
		equal(typeof ns.widget, "object", "Class ns.widget exists");
		equal(typeof ns.widget.mobile, "object", "Class ns.widget.mobile exists");
		equal(typeof ns.widget.mobile.Popup, "function", "Class ns.widget.mobile exists");

		widget = ns.engine.instanceWidget(document.getElementById("popup"), "Popup");

		equal(typeof widget.configure, "function", "Method popup.configure exists");
		equal(typeof widget._getCreateOptions, "function", "Method popup._getCreateOptions exists");
		equal(typeof widget.build, "function", "Method popup.build exists");
		equal(typeof widget.init, "function", "Method popup.init exists");
		equal(typeof widget.bindEvents, "function", "Method popup.bindEvents exists");
		equal(typeof widget.destroy, "function", "Method popup.destroy exists");
		equal(typeof widget.disable, "function", "Method popup.disable exists");
		equal(typeof widget.enable, "function", "Method popup.enable exists");
		equal(typeof widget.refresh, "function", "Method popup.refresh exists");
		equal(typeof widget.option, "function", "Method popup.option exists");
		equal(typeof widget.open, "function", "Method popup.open exists");
		equal(typeof widget.close, "function", "Method popup.close exists");

		equal(typeof widget.options, "object", "Property popup.options exists");
		equal(widget.options.overlayTheme, null, "Proper default popup.options.overlayTheme value");

		if (widget.namespace === "mobile") {
			equal(typeof widget.options.transition, "string", "Property popup.options.transition exists");
			equal(widget.options.transition, "pop", "Proper default popup.options.transition value");
			equal(typeof widget.options.positionTo, "string", "Property popup.options.positionTo exists");
			equal(widget.options.positionTo, "origin", "Proper default popup.options.positionTo value");
			equal(typeof widget.options.directionPriority, "object", "Property popup.options.directionPriority exists");
			equal(widget.options.directionPriority[0], "bottom", "Proper default popup.options.directionPriority[0] value");
			equal(widget.options.directionPriority[1], "top", "Proper default popup.options.directionPriority[1] value");
			equal(widget.options.directionPriority[2], "right", "Proper default popup.options.directionPriority[2] value");
			equal(widget.options.directionPriority[3], "left", "Proper default popup.options.directionPriority[3] value");
			equal(typeof widget.options.closeLinkSelector, "string", "Property popup.options.closeLinkSelector exists");
			equal(widget.options.closeLinkSelector, "a[data-rel='back']", "Proper default popup.options.closeLinkSelector value");
		}

		equal(typeof widget._build, "function", "Method popup._build exists");
		equal(typeof widget._init, "function", "Method popup._init exists");
		equal(typeof widget._placementCoords, "function", "Method popup._placementCoords exists");
		equal(typeof widget._bindEvents, "function", "Method popup._bindEvents exists");
		equal(typeof widget._destroy, "function", "Method popup._destroy exists");
	});
}(ej));
