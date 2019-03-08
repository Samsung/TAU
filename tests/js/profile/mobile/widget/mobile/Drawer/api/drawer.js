(function (ns) {
	'use strict';
	module("profile/mobile/widget/mobile/Drawer", {
		});

	test ( "API ns.widget.Drawer" , function () {
		var widget, Drawer;
		equal(typeof ns, 'object', 'Class ns exists');
		equal(typeof ns.widget, 'object', 'Class ns.widget exists');
		equal(typeof ns.widget.mobile, 'object', 'Class ns.widget.mobile exists');
		equal(typeof ns.widget.mobile.Drawer, 'function', 'Class ns.widget.mobile.Drawer exists');

		widget = ns.engine.instanceWidget(document.getElementById("drawer"), "Drawer");
		Drawer = ns.widget.core.Drawer;

		equal(typeof widget.configure, 'function', 'Method drawer.configure exists');
		equal(typeof widget._getCreateOptions, 'function', 'Method drawer._getCreateOptions exists');
		equal(typeof widget.build, 'function', 'Method drawer.build exists');
		equal(typeof widget.init, 'function', 'Method drawer.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method drawer.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method drawer.destroy exists');
		equal(typeof widget.disable, 'function', 'Method drawer.disable exists');
		equal(typeof widget.enable, 'function', 'Method drawer.enable exists');
		equal(typeof widget.refresh, 'function', 'Method drawer.refresh exists');
		equal(typeof widget.open, 'function', 'Method drawer.open exists');
		equal(typeof widget.close, 'function', 'Method drawer.close exists');
		equal(typeof widget.isOpen, 'function', 'Method drawer.isOpen exists');
		equal(typeof widget.option, 'function', 'Method drawer.option exists');

		equal(typeof widget.options, 'object', 'Property drawer.options exists');
		equal(typeof widget.options.position, 'string', 'Property drawer.options.position exists');
		equal(typeof widget.options.width, 'number', 'Property drawer.options.width exists');
		equal(typeof widget.options.duration, 'number', 'Property drawer.options.duration exists');
		equal(typeof Drawer.classes, 'object', 'Property drawer.classes exists');
		equal(typeof Drawer.classes.close, 'string', 'Property drawer.classes.close exists');
		equal(typeof Drawer.classes.drawer, 'string', 'Property drawer.classes.drawer exists');
		equal(typeof Drawer.classes.left, 'string', 'Property drawer.classes.left exists');
		equal(typeof Drawer.classes.open, 'string', 'Property drawer.classes.open exists');
		equal(typeof Drawer.classes.overlay, 'string', 'Property drawer.classes.overlay exists');
		equal(typeof Drawer.classes.right, 'string', 'Property drawer.classes.right exists');

		equal(typeof widget._build, 'function', 'Method drawer._build exists');
		equal(typeof widget._bindEvents, 'function', 'Method drawer._bindEvents exists');
		equal(typeof widget._init, 'function', 'Method drawer._bindEvents exists');
	});
}(ej));
