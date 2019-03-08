(function (ns) {
	'use strict';
	module("support/mobile/widget/Gallery");

	test ( "API ns.widget.mobile.Gallery" , function () {
		var widget, Gallery;
		equal(typeof ns, 'object', 'Class ns exists');
		equal(typeof ns.widget, 'object', 'Class ns.widget exists');
		equal(typeof ns.widget.mobile, 'object', 'Class ns.widget.mobile exists');
		equal(typeof ns.widget.mobile.Gallery, 'function', 'Class ns.widget.mobile.Gallery exists');

		widget = ns.engine.instanceWidget(document.getElementById("gallery"), "Gallery");
		Gallery = ns.widget.mobile.Gallery;

		equal(typeof widget.configure, 'function', 'Method gallery.configure exists');
		equal(typeof widget._configure, 'function', 'Method gallery._configure exists');
		equal(typeof widget._getCreateOptions, 'function', 'Method gallery._getCreateOptions exists');
		equal(typeof widget.build, 'function', 'Method gallery.build exists');
		equal(typeof widget.init, 'function', 'Method gallery.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method gallery.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method gallery.destroy exists');
		equal(typeof widget.disable, 'function', 'Method gallery.disable exists');
		equal(typeof widget.enable, 'function', 'Method gallery.enable exists');
		equal(typeof widget.refresh, 'function', 'Method gallery.refresh exists');
		equal(typeof widget.option, 'function', 'Method gallery.option exists');

		equal(typeof widget.value, 'function', 'Method gallery.value exists');
		equal(typeof widget.length, 'function', 'Method gallery.length exists');
		equal(typeof widget.empty, 'function', 'Method gallery.empty exists');
		equal(typeof widget.refresh, 'function', 'Method gallery.refresh exists');
		equal(typeof widget.remove, 'function', 'Method gallery.remove exists');
		equal(typeof widget.add, 'function', 'Method gallery.add exists');

		equal(typeof widget.options, 'object', 'Property gallery.options exists');
		equal(typeof widget.options.flicking, 'boolean', 'Property gallery.options.flicking exists');
		equal(typeof widget.options.duration, 'number', 'Property gallery.options.duration exists');
		equal(typeof widget.options.verticalAlign, 'string', 'Property gallery.options.verticalAlign exists');

		equal(typeof Gallery.classes, 'object', 'Property gallery.classes exists');
		equal(typeof Gallery.classes.uiGallery, 'string', 'Property gallery.classes.uiGallery exists');
		equal(typeof Gallery.classes.uiGalleryBg, 'string', 'Property gallery.classes.uiGalleryBg exists');
		equal(typeof Gallery.classes.uiContent, 'string', 'Property gallery.classes.uiContent exists');
		equal(typeof Gallery.classes.uiHeader, 'string', 'Property gallery.classes.uiHeader exists');
		equal(typeof Gallery.classes.uiFooter, 'string', 'Property gallery.classes.uiFooter exists');

		equal(typeof widget._build, 'function', 'Method button._build exists');
		equal(typeof widget._bindEvents, 'function', 'Method button._bindEvents exists');
		equal(typeof widget._init, 'function', 'Method button._bindEvents exists');
	});
}(ej));
