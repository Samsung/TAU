(function (ns) {
	'use strict';
	module("profile/mobile/widget/mobile/DropdownMenu", {
		});

	test ( "API ns.widget.DropdownMenu" , function () {
		var widget, DropdownMenu;
		equal(typeof ns, 'object', 'Class ns exists');
		equal(typeof ns.widget, 'object', 'Class ns.widget exists');
		equal(typeof ns.widget.mobile, 'object', 'Class ns.widget.mobile exists');
		equal(typeof ns.widget.mobile.DropdownMenu, 'function', 'Class ns.widget.mobile.DropdownMenu exists');

		widget = ns.engine.instanceWidget(document.getElementById("select"), "DropdownMenu");
		DropdownMenu = ns.widget.mobile.DropdownMenu;

		equal(typeof widget.configure, 'function', 'Method DropdownMenu.configure exists');
		equal(typeof widget._getCreateOptions, 'function', 'Method DropdownMenu._getCreateOptions exists');
		equal(typeof widget.build, 'function', 'Method DropdownMenu.build exists');
		equal(typeof widget.init, 'function', 'Method DropdownMenu.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method DropdownMenu.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method DropdownMenu.destroy exists');
		equal(typeof widget.disable, 'function', 'Method DropdownMenu.disable exists');
		equal(typeof widget.enable, 'function', 'Method DropdownMenu.enable exists');
		equal(typeof widget.refresh, 'function', 'Method DropdownMenu.refresh exists');
		equal(typeof widget.open, 'function', 'Method DropdownMenu.open exists');
		equal(typeof widget.close, 'function', 'Method DropdownMenu.close exists');
		equal(typeof widget.option, 'function', 'Method DropdownMenu.option exists');

		equal(typeof DropdownMenu.classes, 'object', 'Property DropdownMenu.classes exists');
		equal(typeof DropdownMenu.classes.selectWrapper, 'string', 'Property DropdownMenu.classes.selectWrapper exists');
		equal(typeof DropdownMenu.classes.optionGroup, 'string', 'Property DropdownMenu.classes.optionGroup exists');
		equal(typeof DropdownMenu.classes.placeHolder, 'string', 'Property DropdownMenu.classes.placeHolder exists');
		equal(typeof DropdownMenu.classes.optionList, 'string', 'Property DropdownMenu.classes.optionList exists');
		equal(typeof DropdownMenu.classes.selected, 'string', 'Property DropdownMenu.classes.selected exists');
		equal(typeof DropdownMenu.classes.active, 'string', 'Property DropdownMenu.classes.active exists');
		equal(typeof DropdownMenu.classes.filter, 'string', 'Property DropdownMenu.classes.filter exists');
		equal(typeof DropdownMenu.classes.filterHidden, 'string', 'Property DropdownMenu.classes.filterHidden exists');
		equal(typeof DropdownMenu.classes.disabled, 'string', 'Property DropdownMenu.classes.disabled exists');
		equal(typeof DropdownMenu.classes.inline, 'string', 'Property DropdownMenu.classes.inline exists');
		equal(typeof DropdownMenu.classes.native, 'string', 'Property DropdownMenu.classes.native exists');

		equal(typeof widget._build, 'function', 'Method DropdownMenu._build exists');
		equal(typeof widget._bindEvents, 'function', 'Method DropdownMenu._bindEvents exists');
	});
}(tau));
