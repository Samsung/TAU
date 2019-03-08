(function (window, document) {
	"use strict";

	module("profile/mobile/widget/mobile/TextInput", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test("input type=text" , function () {
		var input = document.getElementById('namei');
		tau.widget.TextInput(input);
		ok(input.classList.contains('ui-text-input'), 'Input has ui-text-input class');
	});

	test("input type=textarea" , function () {
		var input1 = document.getElementById('textarea');
		tau.widget.TextInput(input1);
		ok(input1.classList.contains('ui-text-input'), 'Input has ui-text-input class');
	});

	test("input type=password" , function () {
		var input2 = document.getElementById('password');
		tau.widget.TextInput(input2);
		ok(input2.classList.contains('ui-text-input'), 'Input has ui-text-input class');
	});

	test("input type=number" , function () {
		var input3 = document.getElementById('number');
		tau.widget.TextInput(input3);
		ok(input3.classList.contains('ui-text-input'), 'Input has ui-text-input class');
	});

	test("input type=email" , function () {
		var input4 = document.getElementById('email');
		tau.widget.TextInput(input4);
		ok(input4.classList.contains('ui-text-input'), 'Input has ui-text-input class');
	});

	test("input type=url" , function () {
		var input5 = document.getElementById('url');
		tau.widget.TextInput(input5);
		ok(input5.classList.contains('ui-text-input'), 'Input has ui-text-input class');
	});

	test("input type=tel" , function () {
		var input6 = document.getElementById('tel');
		tau.widget.TextInput(input6);
		ok(input6.classList.contains('ui-text-input'), 'Input has ui-text-input class');
	});

	test("textinput - Enabled state", function () {
		var input7 = document.getElementById('enabled');
		tau.widget.TextInput(input7);
		ok(!input7.getAttribute('disabled'), 'textinput hasn\'t disabled attribute');
	});

	test("textinput - Disabled state", function () {
		var input8 = document.getElementById('disabled');
		tau.widget.TextInput(input8);
		ok(input8.getAttribute('disabled'), 'textinput has disabled attribute');
		ok(input8.classList.contains('ui-text-input-disabled'), 'Input has ui-text-input-disabled class');
	});

	test("textinput - value get/set", function () {
		var input9 = document.getElementById('getset');

		//after build
		var textInput = tau.widget.TextInput(input9);

		equal(textInput.value(), "default value", "textinput initial value not read");
		textInput.value('tEsT 1');
		equal(textInput.value(), "tEsT 1", "textinput value set");
	});
}(window, window.document));
