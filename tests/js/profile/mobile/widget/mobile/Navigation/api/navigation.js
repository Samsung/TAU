(function (ns) {
	'use strict';
	module("profile/mobile/widget/mobile/Navigation", {
		});

	test ( "API ns.widget.Navigation" , function () {
		var widget, Navigation;
		equal(typeof ns, 'object', 'Class ns exists');
		equal(typeof ns.widget, 'object', 'Class ns.widget exists');
		equal(typeof ns.widget.mobile, 'object', 'Class ns.widget.mobile exists');
		equal(typeof ns.widget.mobile.Navigation, 'function', 'Class ns.widget.mobile.Navigation exists');

		widget = ns.engine.instanceWidget(document.getElementsByTagName("nav")[0], "Navigation");
		Navigation = ns.widget.mobile.Navigation;

		equal(typeof widget.configure, 'function', 'Method navigation.configure exists');
		equal(typeof widget._getCreateOptions, 'function', 'Method navigation._getCreateOptions exists');
		equal(typeof widget.build, 'function', 'Method navigation.build exists');
		equal(typeof widget.init, 'function', 'Method navigation.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method navigation.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method navigation.destroy exists');
		equal(typeof widget.disable, 'function', 'Method navigation.disable exists');
		equal(typeof widget.enable, 'function', 'Method navigation.enable exists');
		equal(typeof widget.refresh, 'function', 'Method navigation.refresh exists');
		equal(typeof widget.push, 'function', 'Method navigation.push exists');

		equal(typeof Navigation.classes, 'object', 'Property navigation.classes exists');
		equal(typeof Navigation.classes.NAVIGATION, 'string', 'Property navigation.classes.NAVIGATION exists');
		equal(typeof Navigation.classes.NAVIGATION_CONTAINER, 'string', 'Property navigation.classes.NAVIGATION_CONTAINER exists');
		equal(typeof Navigation.classes.NAVIGATION_ITEM, 'string', 'Property navigation.classes.NAVIGATION_ITEM exists');
		equal(typeof Navigation.classes.NAVIGATION_ACTIVE, 'string', 'Property navigation.calsses.NAVIGATION_ACTIVE exists')

		equal(typeof widget._build, 'function', 'Method navigation._build exists');
		equal(typeof widget._bindEvents, 'function', 'Method navigation._bindEvents exists');
	});
}(tau));
