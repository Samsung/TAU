/* global tau, test */
module("profile/wearable/widget/wearable/Drawer/api/drawer");

test("API", function (assert) {
	var widget;

	assert.equal(typeof tau, "object", "Class tau exists");
	assert.equal(typeof tau.widget, "object", "Class tau.widget exists");
	assert.equal(typeof tau.widget.wearable.Drawer, "function", "Class tau.widget.wearable.Drawer exists");
	widget = new tau.widget.wearable.Drawer();

	assert.equal(typeof widget.configure, "function", "Method Drawer.configure exists");
	assert.equal(typeof widget.build, "function", "Method Drawer.build exists");
	assert.equal(typeof widget.init, "function", "Method Drawer.init exists");
	assert.equal(typeof widget.bindEvents, "function", "Method Drawer.bindEvents exists");
	assert.equal(typeof widget.destroy, "function", "Method Drawer.destroy exists");
	assert.equal(typeof widget.disable, "function", "Method Drawer.disable exists");
	assert.equal(typeof widget.enable, "function", "Method Drawer.enable exists");
	assert.equal(typeof widget.refresh, "function", "Method Drawer.refresh exists");
	assert.equal(typeof widget.option, "function", "Method Drawer.option exists");

	assert.equal(typeof widget._checkSideEdge, "function", "Method Drawer._checkSideEdge exists");
	assert.equal(typeof widget._translate, "function", "Method Drawer._translate exists");
	assert.equal(typeof widget._setActive, "function", "Method Drawer._setActive exists");
	assert.equal(typeof widget.transition, "function", "Method Drawer.transition exists");
	assert.equal(typeof widget.setDragHandler, "function", "Method Drawer.setDragHandler exists");
	assert.equal(typeof widget.open, "function", "Method Drawer.open exists");
	assert.equal(typeof widget.close, "function", "Method Drawer.close exists");
	assert.equal(typeof widget.getState, "function", "Method Drawer.getState exists");
});