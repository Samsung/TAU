module("core/widget/core/PanelChanger", {
	});

	test ( "API ns.widget.core.PanelChanger" , function () {
		var widget;
		equal(typeof tau, 'object', 'Class tau exists');
		equal(typeof tau.widget, 'object', 'Class tau.widget exists');
		equal(typeof tau.widget.core, 'object', 'Class tau.widget.core exists');
		equal(typeof tau.widget.core.PanelChanger, 'function', 'Class tau.widget.core.PanelChanger exists');
		widget = new tau.widget.core.PanelChanger();

		equal(typeof widget.configure, 'function', 'Method Panel.configure exists');
		equal(typeof widget.build, 'function', 'Method Panel.build exists');
		equal(typeof widget.init, 'function', 'Method Panel.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method Panel.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method Panel.destroy exists');
		equal(typeof widget.disable, 'function', 'Method Panel.disable exists');
		equal(typeof widget.enable, 'function', 'Method Panel.enable exists');
		equal(typeof widget.refresh, 'function', 'Method Panel.refresh exists');
		equal(typeof widget.option, 'function', 'Method Panel.option exists');
		equal(typeof widget.changePanel, 'function', 'Method Panel.changePanel exists');

	});