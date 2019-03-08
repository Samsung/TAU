(function (ns) {
	'use strict';
	module("profile/mobile/widget/mobile/Button", {
		});

	test ( "API ns.widget.Button" , function () {
		var widget, Button;
		equal(typeof ns, 'object', 'Class ns exists');
		equal(typeof ns.widget, 'object', 'Class ns.widget exists');
		equal(typeof ns.widget.mobile, 'object', 'Class ns.widget.mobile exists');
		equal(typeof ns.widget.mobile.Button, 'function', 'Class ns.widget.mobile.Button exists');

		widget = ns.engine.instanceWidget(document.getElementById("button"), "Button");
		Button = ns.widget.mobile.Button;

		equal(typeof widget.configure, 'function', 'Method button.configure exists');
		equal(typeof widget._configure, 'function', 'Method button._configure exists');
		equal(typeof widget._getCreateOptions, 'function', 'Method button._getCreateOptions exists');
		equal(typeof widget.build, 'function', 'Method button.build exists');
		equal(typeof widget.init, 'function', 'Method button.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method button.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method button.destroy exists');
		equal(typeof widget.disable, 'function', 'Method button.disable exists');
		equal(typeof widget.enable, 'function', 'Method button.enable exists');
		equal(typeof widget.refresh, 'function', 'Method button.refresh exists');
		equal(typeof widget.option, 'function', 'Method button.option exists');

		equal(typeof widget.options, 'object', 'Property button.options exists');

		equal(typeof widget._build, 'function', 'Method button._build exists');
	});
}(ej));