module("profile/wearable/widget/wearable/CircularIndexScrollbar", {});

test ("API of CircularIndexScrllbar Widget", function() {
	var widget;

	equal(typeof tau, 'object', 'Class tau exists');
	equal(typeof tau.widget, 'object', 'Class tau.widget exists');
	equal(typeof tau.widget.wearable, 'object', 'Class tau.widget.wearable exists');
	equal(typeof tau.widget.wearable.CircularIndexScrollbar, 'function', 'Class tau.widget.wearable.CircularIndexScrollbar exists');

	widget = new tau.widget.wearable.CircularIndexScrollbar(document.getElementById("widget"));

	equal(typeof widget._configure, 'function', 'Method circularIndexScrollbar._configure exists');
	equal(typeof widget._init, 'function', 'Method circularIndexScrollbar._init exists');
	equal(typeof widget._setIndices, 'function', 'Method circularIndexScrollbar._setIndices exists');
	equal(typeof widget._setValueByPosition, 'function', 'Method circularIndexScrollbar.setValueByPosition exists');
	equal(typeof widget._nextIndex, 'function', 'Method circularIndexScrollbar._nextIndex exists');
	equal(typeof widget._prevIndex, 'function', 'Method circularIndexScrollbar._prevIndex exists');
	equal(typeof widget._setValue, 'function', 'Method circularIndexScrollbar._setValue exists');
	equal(typeof widget._getValue, 'function', 'Method circularIndexScrollbar._getValue exists');
	equal(typeof widget._rotary, 'function', 'Method circularIndexScrollbar._rotary exists');
	equal(typeof widget.handleEvent, 'function', 'Method circularIndexScrollbar.handleEvent exists');
	equal(typeof widget._bindEvents, 'function', 'Method circularIndexScrollbar._bindEvents exists');
	equal(typeof widget._unbindEvents, 'function', 'Method circularIndexScrollbar._unbindEvents exists');
	equal(typeof widget._refresh, 'function', 'Method circularIndexScrollbar._refresh exists');
	equal(typeof widget._destroy, 'function', 'Method circularIndexScrollbar._destroy exists');
});
