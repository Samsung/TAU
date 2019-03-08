module("profile/mobile/widget/mobile/IndexScrollbar", {
	});

	test ( "API tau.widget.mobile.IndexScrollbar" , function () {
		var widget;
		equal(typeof tau, "object", "Class tau exists");
		equal(typeof tau.widget, "object", "Class tau.widget exists");
		equal(typeof tau.widget.mobile, "object", "Class tau.widget.micro exists");
		equal(typeof tau.widget.mobile.IndexScrollbar, "function", "Class tau.widget.mobile.Page exists");
		widget = new tau.widget.mobile.IndexScrollbar();

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