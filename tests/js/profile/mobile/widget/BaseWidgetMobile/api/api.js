module("profile/mobile/widget/mobile/BaseWidgetMobile");

	test ( "ej.widget.BaseWidgetMobile" , function () {
		var widget;
		equal(typeof ej, "object", "Class ej exists");
		equal(typeof ej.widget, "object", "Class ej.widget exists");
		equal(typeof ej.widget.mobile, "object", "Class ej.widget.mobile exists");
		equal(typeof ej.widget.mobile.BaseWidgetMobile, "function", "Class ej.widget.BaseWidget exists");
		widget = new ej.widget.mobile.BaseWidgetMobile();
		equal(typeof widget.configure, "function", "Method widget.configure exists");
		equal(typeof widget._getCreateOptions, "function", "Method widget._getCreateOptions exists");
		equal(typeof widget.build, "function", "Method widget.build exists");
		equal(typeof widget.init, "function", "Method widget.init exists");
		equal(typeof widget.bindEvents, "function", "Method widget.bindEvents exists");
		equal(typeof widget.destroy, "function", "Method widget.destroy exists");
		equal(typeof widget.disable, "function", "Method widget.disable exists");
		equal(typeof widget.enable, "function", "Method widget.enable exists");
		equal(typeof widget.refresh, "function", "Method widget.refresh exists");
		equal(typeof widget.option, "function", "Method widget.option exists");
		equal(typeof widget.isBound, "function", "Method widget.isBound exists");
		equal(typeof widget.isBuilt, "function", "Method widget.isBuilt exists");
		equal(typeof widget.widget, "function", "Method widget.widget exists");
		equal(typeof widget.value, "function", "Method widget.value exists");
	});