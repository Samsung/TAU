(function (window, document) {
	"use strict";

	module("support/mobile/widget/TextInput", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test("options check", function () {
		var input = document.getElementById("options"),
		//after build
			textInput = tau.widget.TextInput(input),
			clearSearchButtonText;

		equal(textInput.value(), "default value", "textinput initial value not read");
		clearSearchButtonText = textInput.option("clearSearchButtonText");

		equal(clearSearchButtonText, "clear text", "textinput support option");
	});

	test("textinput - value get/set", function () {
		var input9 = document.getElementById("getset"),
			//after build
			textInput = tau.widget.TextInput(input9),
			labelText = textInput.getLabel();

		equal(labelText, "TEST", "textinput supports getLabel method");
		textInput.setLabel("TEXTINPUT");
		labelText = textInput.getLabel();
		equal(labelText, "TEXTINPUT", "textinput supports setLabel method");
	});
}(window, window.document));
