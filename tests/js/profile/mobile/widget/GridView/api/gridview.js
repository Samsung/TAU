(function (ns) {
	'use strict';
	module("profile/mobile/widget/mobile/GridView", {
		});

	test ( "API ns.widget.GridView" , function () {
		var widget, GridView;
		equal(typeof ns, 'object', 'Class ns exists');
		equal(typeof ns.widget, 'object', 'Class ns.widget exists');
		equal(typeof ns.widget.mobile, 'object', 'Class ns.widget.mobile exists');
		equal(typeof ns.widget.mobile.GridView, 'function', 'Class ns.widget.mobile.GridView exists');

		widget = ns.engine.instanceWidget(document.getElementById("gridview"), "GridView");
		GridView = ns.widget.mobile.GridView;

		equal(typeof widget.configure, 'function', 'Method GridView.configure exists');
		equal(typeof widget.build, 'function', 'Method GridView.build exists');
		equal(typeof widget.init, 'function', 'Method GridView.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method GridView.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method GridView.destroy exists');
		equal(typeof widget.disable, 'function', 'Method GridView.disable exists');
		equal(typeof widget.enable, 'function', 'Method GridView.enable exists');
		equal(typeof widget.refresh, 'function', 'Method GridView.refresh exists');
		equal(typeof widget.option, 'function', 'Method GridView.option exists');
		equal(typeof widget.addItem, 'function', 'Method GridView.addItem exists');
		equal(typeof widget.removeItem, 'function', 'Method GridView.removeItem exists');

		equal(typeof GridView.classes, 'object', 'Property GridView.classes exists');
		equal(typeof GridView.classes.GRIDLIST, 'string', 'Property GridView.classes.selectWrapper exists');
		equal(typeof GridView.classes.ITEM, 'string', 'Property GridView.classes.optionGroup exists');
		equal(typeof GridView.classes.HELPER, 'string', 'Property GridView.classes.placeHolder exists');
		equal(typeof GridView.classes.HOLDER, 'string', 'Property GridView.classes.optionList exists');
		equal(typeof GridView.classes.LABEL, 'string', 'Property GridView.classes.selected exists');
		equal(typeof GridView.classes.LABEL_IN, 'string', 'Property GridView.classes.active exists');
		equal(typeof GridView.classes.LABEL_OUT, 'string', 'Property GridView.classes.filter exists');
		equal(typeof GridView.classes.HANDLER, 'string', 'Property GridView.classes.filterHidden exists');
	});
}(tau));
