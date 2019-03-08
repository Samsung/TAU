module("profile/wearable/widget/wearable/VirtualListview", {
	});

	test ( "API ej.widget.VirtualListview" , function () {
		var widget;
		equal(typeof ej, 'object', 'Class ej exists');
		equal(typeof ej.widget, 'object', 'Class ej.widget exists');
		equal(typeof ej.widget.wearable, 'object', 'Class ej.widget.wearable exists');
		equal(typeof ej.widget.wearable.VirtualListview, 'function', 'Class ej.widget.wearable.VirtualListview exists');
		widget = new ej.widget.wearable.VirtualListview();

		equal(typeof widget.configure, 'function', 'Method VirtualListview.configure exists');
		equal(typeof widget._getCreateOptions, 'function', 'Method VirtualListview._getCreateOptions exists');
		equal(typeof widget.build, 'function', 'Method VirtualListview.build exists');
		equal(typeof widget.init, 'function', 'Method VirtualListview.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method VirtualListview.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method VirtualListview.destroy exists');
		equal(typeof widget.disable, 'function', 'Method VirtualListview.disable exists');
		equal(typeof widget.enable, 'function', 'Method VirtualListview.enable exists');
		equal(typeof widget.refresh, 'function', 'Method VirtualListview.refresh exists');
		equal(typeof widget.option, 'function', 'Method VirtualListview.option exists');

		equal(typeof widget.scrollToIndex, 'function', 'Method VirtualListview.scrollToIndex exists');
		equal(typeof widget.draw, 'function', 'Method VirtualListview.draw exists');
		equal(typeof widget.setListItemUpdater, 'function', 'Method VirtualListview.setListItemUpdater exists');
	});