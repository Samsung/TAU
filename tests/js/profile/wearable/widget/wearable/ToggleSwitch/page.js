module("profile/wearable/widget/wearable/ToggleSwitch", {});

var pageWidget = document.getElementById('first');

asyncTest("profile/wearable/widget/wearable/ToggleSwitch _build method", function () {
	pageWidget.addEventListener('pageshow', function() {
		var switchElement = document.getElementById('switch'),
			switchWidget = tau.widget.ToggleSwitch(switchElement);
		equal(switchElement.children[0].className, "ui-switch-text", 'text element has proper class');
		equal(switchElement.children[0].innerHTML, "text", 'text element has proper value');
		equal(switchElement.children[1].className, "ui-toggleswitch", 'label element has proper class');
		equal(switchElement.children.length, 2, 'element has proper number of child');
		equal(switchElement.children[1].children.length, 2, 'label element has proper number of child');
		equal(switchElement.children[1].children[0].className, "ui-switch-input", 'input element has proper class');
		equal(switchElement.children[1].children[1].className, "ui-switch-activation", 'activation element has proper class');
		start();
	}, true);

	tau.engine.run();
});