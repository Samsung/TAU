/* global $, test, module, equal, ok, tau */
$().ready(function () {
	module("profile/mobile/widget/mobile/TextEnveloper", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test("TextEnveloper", function () {
		var te = document.getElementById("textenveloper"),
			teComponent = tau.widget.TextEnveloper(te);

		ok(te.classList.contains("ui-text-enveloper"), "TextEnveloper has ui-text-enveloper class");
		teComponent.add("test");
		ok(te.getElementsByClassName("ui-text-enveloper-btn").length > 0, "TextEnveloper can add button");
		equal(teComponent.length(), 1, "TextEnveloper can get buttons length");
		teComponent.remove(0);
		equal(teComponent.length(), 0, "TextEnveloper can remove button");
	});
});
