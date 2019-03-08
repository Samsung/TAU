module("core/widget/core/Button/api/button");

test ("API of Button Widget", function() {
	var widget;

	equal(typeof tau, "object", "Class tau exists");
	equal(typeof tau.widget, "object", "Class tau.widget exists");
	equal(typeof tau.widget.core, "object", "Class tau.widget exists");
	equal(typeof tau.widget.core.Button, "function", "Class tau.widget.core.Button exists");

	widget = new tau.widget.core.Button(document.getElementById("button"));

	equal(typeof widget._configure, "function", "Method Button._configure exists");
	equal(typeof widget._setStyle, 'function', 'Method Button._setStyle exists');
	equal(typeof widget._setInline, 'function', 'Method Button._setInline exists');
	equal(typeof widget._setIcon, 'function', 'Method Button._setIcom exists');
	equal(typeof widget._setIconpos, 'function', 'Method Button._setIconpos exists');
	equal(typeof widget._setTitleForIcon, 'function', 'Method Button._setTitleForIcon exists');
	equal(typeof widget._build, 'function', 'Method Button._build exists');
	equal(typeof widget._refresh, 'function', 'Method Button._refresh exists');
	equal(typeof widget._getValue, 'function', 'Method Button.getValue exists');
	equal(typeof widget._setValue, 'function', 'Method Button._setValue exists');
	equal(typeof widget._enable, 'function', 'Method Button._enable exists');
	equal(typeof widget._disable, 'function', 'Method Button._disable exists');
	equal(typeof widget._getCreateOptions, 'function', 'Method page._getCreateOptions exists');
});
