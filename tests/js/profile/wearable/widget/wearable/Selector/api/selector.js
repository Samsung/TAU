module("profile/wearable/widget/wearable/Selector", {});

test("API" , function () {
	var widget;
	equal(typeof tau, 'object', 'Class tau exists');
	equal(typeof tau.widget, 'object', 'Class tau.widget exists');
	equal(typeof tau.widget.wearable, 'object', 'Class tau.widget.wearable exists');
	equal(typeof tau.widget.wearable.Selector, 'function', 'Class tau.widget.wearable.Selector exists');
	widget = new tau.widget.wearable.Selector();

	equal(typeof widget.configure, 'function', 'Method Selector.configure exists');
	equal(typeof widget.build, 'function', 'Method Selector.build exists');
	equal(typeof widget.init, 'function', 'Method Selector.init exists');
	equal(typeof widget.bindEvents, 'function', 'Method Selector.bindEvents exists');
	equal(typeof widget.destroy, 'function', 'Method Selector.destroy exists');
	equal(typeof widget.disable, 'function', 'Method Selector.disable exists');
	equal(typeof widget.enable, 'function', 'Method Selector.enable exists');
	equal(typeof widget.refresh, 'function', 'Method Selector.refresh exists');
	equal(typeof widget.option, 'function', 'Method Selector.option exists');

	equal(typeof widget.changeItem, 'function', 'Method Selector.changeItem exists');
	equal(typeof widget.addItem, 'function', 'Method Selector.addItem exists');
	equal(typeof widget.removeItem, 'function', 'Method Selector.removeItem exists');
	equal(typeof widget._getActiveLayer, 'function', 'Method Selector._getActiveLayer exists');
	equal(typeof widget._setActiveLayer, 'function', 'Method Selector._setActiveLayer exists');
	equal(typeof widget._getActiveItem, 'function', 'Method Selector._getActiveItem exists');
	equal(typeof widget._setActiveItem, 'function', 'Method Selector._setActiveItem exists');
	equal(typeof widget._setIndicatorIndex, 'function', 'Method Selector._setIndicatorIndex exists');
	equal(typeof widget._onDragstart, 'function', 'Method Selector._onDragstart exists');
	equal(typeof widget._onDrag, 'function', 'Method Selector._onDrag exists');
	equal(typeof widget._onDragend, 'function', 'Method Selector._onDragend exists');
	equal(typeof widget._onClick, 'function', 'Method Selector._onClick exists');
	equal(typeof widget._onRotary, 'function', 'Method Selector._onRotary exists');
	equal(typeof widget._initItems, 'function', 'Method Selector._initItems exists');
	equal(typeof widget._hideItems, 'function', 'Method Selector._hideItems exists');
	equal(typeof widget._refresh, 'function', 'Method Selector._refresh exists');
	equal(typeof widget._changeLayer, 'function', 'Method Selector._changeLayer exists');
	equal(typeof widget._changeItem, 'function', 'Method Selector._changeItem exists');
});