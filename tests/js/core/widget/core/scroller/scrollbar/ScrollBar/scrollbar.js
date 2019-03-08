/* global test, equal, tau  */
module("core/widget/core/scroller/Scrollbar");

test("API ns.widget.core.scroller.scrollbar.ScrollBar", function () {
	var widget;

	equal(typeof tau.widget.core.scroller.scrollbar.ScrollBar, "function", "Class tau.widget.wearable.scroller.scrolbar.ScrollBar exists");
	widget = new tau.widget.core.scroller.scrollbar.ScrollBar();

	equal(typeof widget.configure, "function", "Method scrollbar.configure exists");
	equal(typeof widget._getCreateOptions, "function", "Method scrollbar._getCreateOptions exists");
	equal(typeof widget.build, "function", "Method scrollbar.build exists");
	equal(typeof widget.init, "function", "Method scrollbar.init exists");
	equal(typeof widget.bindEvents, "function", "Method scrollbar.bindEvents exists");
	equal(typeof widget.destroy, "function", "Method scrollbar.destroy exists");
	equal(typeof widget.disable, "function", "Method scrollbar.disable exists");
	equal(typeof widget.enable, "function", "Method scrollbar.enable exists");
	equal(typeof widget.refresh, "function", "Method scrollbar.refresh exists");
	equal(typeof widget.option, "function", "Method scrollbar.option exists");

	equal(typeof widget.translate, "function", "Method scrollbar.translate exists");
});
