module("profile/wearable/widget/wearable/IndexScrollbar", {
	});

	test ( "API ej.widget.wearable.IndexScrollbar" , function () {
		var widget;
		equal(typeof ej, "object", "Class ej exists");
		equal(typeof ej.widget, "object", "Class ej.widget exists");
		equal(typeof ej.widget.wearable, "object", "Class ej.widget.micro exists");
		equal(typeof ej.widget.wearable.IndexScrollbar, "function", "Class ej.widget.wearable.Page exists");
		widget = new ej.widget.wearable.IndexScrollbar();

		equal(typeof widget.configure, "function", "Method IndexScrollbar.configure exists");
		equal(typeof widget._getCreateOptions, "function", "Method IndexScrollbar._getCreateOptions exists");
		equal(typeof widget.build, "function", "Method IndexScrollbar.build exists");
		equal(typeof widget.init, "function", "Method IndexScrollbar.init exists");
		equal(typeof widget.bindEvents, "function", "Method IndexScrollbar.bindEvents exists");
		equal(typeof widget.destroy, "function", "Method IndexScrollbar.destroy exists");
		equal(typeof widget.disable, "function", "Method IndexScrollbar.disable exists");
		equal(typeof widget.enable, "function", "Method IndexScrollbar.enable exists");
		equal(typeof widget.refresh, "function", "Method IndexScrollbar.refresh exists");
		equal(typeof widget.option, "function", "Method IndexScrollbar.option exists");

		equal(typeof widget._build, "function", "Method IndexScrollbar._build exists");
		equal(typeof widget._init, "function", "Method IndexScrollbar._init exists");
		equal(typeof widget._bindEvents, "function", "Method IndexScrollbar._bindEvents exists");
		equal(typeof widget._destroy, "function", "Method IndexScrollbar._destroy exists");

		equal(typeof widget.addEventListener, "function", "Method IndexScrollbar.addEventListener exists");
		equal(typeof widget.removeEventListener, "function", "Method IndexScrollbar.removeEventListener exists");
	});