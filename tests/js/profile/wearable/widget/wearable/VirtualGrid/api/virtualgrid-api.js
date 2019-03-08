/* global module, equal, test, ej */
module("profile/wearable/widget/wearable/VirtualGrid/API", {});

test("API ej.widget.VirtualGrid", function () {
	var widget;

	equal(typeof ej, "object", "Class ej exists");
	equal(typeof ej.widget, "object", "Class ej.widget exists");
	equal(typeof ej.widget.wearable, "object", "Class ej.widget.wearable exists");
	equal(typeof ej.widget.wearable.VirtualGrid, "function", "Class ej.widget.wearable.VirtualGrid exists");
	widget = new ej.widget.wearable.VirtualGrid();

	equal(typeof widget.configure, "function", "Method VirtualGrid.configure exists");
	equal(typeof widget._getCreateOptions, "function", "Method VirtualGrid._getCreateOptions exists");
	equal(typeof widget.build, "function", "Method VirtualGrid.build exists");
	equal(typeof widget.init, "function", "Method VirtualGrid.init exists");
	equal(typeof widget.bindEvents, "function", "Method VirtualGrid.bindEvents exists");
	equal(typeof widget.destroy, "function", "Method VirtualGrid.destroy exists");
	equal(typeof widget.disable, "function", "Method VirtualGrid.disable exists");
	equal(typeof widget.enable, "function", "Method VirtualGrid.enable exists");
	equal(typeof widget.refresh, "function", "Method VirtualGrid.refresh exists");
	equal(typeof widget.option, "function", "Method VirtualGrid.option exists");

	equal(typeof widget.scrollToIndex, "function", "Method VirtualGrid.scrollToIndex exists");
	equal(typeof widget.draw, "function", "Method VirtualGrid.draw exists");
	equal(typeof widget.setListItemUpdater, "function", "Method VirtualGrid.setListItemUpdater exists");
});