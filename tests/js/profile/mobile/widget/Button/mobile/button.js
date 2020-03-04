/*global module, test, asyncTest, ok, equal, tau, $ */
(function() {
	"use strict";

	module("profile/mobile/widget/mobile/Button", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test( "Button" , function () {
		var button = document.getElementById('button-0'),
			eventsCalled = {},
			eventHandler = function(e) {
				eventsCalled[e.type] = true;
			};

		document.addEventListener("buttonbeforecreate", eventHandler);
		document.addEventListener("buttoncreate", eventHandler);

		//after build
		tau.engine.instanceWidget(button, 'Button');
		equal(button.getAttribute('data-tau-bound'), "Button", "Button widget is created");
		ok(button.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(eventsCalled.buttonbeforecreate, 'buttonbeforecreate called');
		ok(eventsCalled.buttoncreate, 'buttoncreate called');
		document.removeEventListener("buttonbeforecreate", eventHandler);
		document.removeEventListener("buttoncreate", eventHandler);
	});
	test( "Button - Inline" , function () {
		var button1 = document.getElementById('button-1');

		//after build
		tau.engine.instanceWidget(button1, 'Button');
		equal(button1.getAttribute('data-tau-bound'), "Button", "Button widget is created");
		ok(button1.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button1.classList.contains('ui-inline'), 'Button has ui-inline class');

	});
	test( "Button - Inline, Icon" , function () {
		var button2 = document.getElementById('button-2');

		//after build
		tau.engine.instanceWidget(button2, 'Button');
		equal(button2.getAttribute('data-tau-bound'), "Button", "Button widget is created");
		ok(button2.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button2.classList.contains('ui-inline'), 'Button has ui-inline class');
		ok(button2.classList.contains('ui-btn-icon-left'), 'Button has ui-btn-icon-left class');

	});
	test( "Button - Inline, Call Icon, Icon Position(Right)" , function () {
		var button3 = document.getElementById('button-3');

		//after build
		tau.engine.instanceWidget(button3, 'Button');
		equal(button3.getAttribute('data-tau-bound'), "Button", "Button widget is created");
		ok(button3.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button3.classList.contains('ui-inline'), 'Button has ui-inline class');
		ok(button3.classList.contains('ui-btn-icon-right'), 'Button has ui-btn-icon-right class');
	});
	test( "Button - Inline, Only Icon(Reveal)" , function () {
		var button4 = document.getElementById('button-4');

		//after build
		tau.engine.instanceWidget(button4, 'Button');
		equal(button4.getAttribute('data-tau-bound'), "Button", "Button widget is created");
		ok(button4.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button4.classList.contains('ui-inline'), 'Button has ui-inline class');
		ok(button4.classList.contains('ui-btn-icon-only'), 'Button has ui-btn-icon-only class');
	});
	test( "Button - Inline, Icon, circle" , function () {
		var button5 = document.getElementById('button-5'),buttonStyle,hasClass;

		//after build
		tau.engine.instanceWidget(button5, 'Button');
		equal(button5.getAttribute('data-tau-bound'), "Button", "Button widget is created");
		ok(button5.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button5.classList.contains('ui-inline'), 'Button has ui-inline class');
		ok(button5.classList.contains('ui-btn-circle'), 'Button has ui-btn-circle class');
	});
	test( "Button - Inline, Icon, nobackground" , function () {
		var button6 = document.getElementById('button-6'),buttonStyle,hasClass;

		//after build
		tau.engine.instanceWidget(button6, 'Button');
		equal(button6.getAttribute('data-tau-bound'), "Button", "Button widget is created");
		ok(button6.classList.contains('ui-btn'), 'Button has ui-btn class');
		ok(button6.classList.contains('ui-inline'), 'Button has ui-inline class');
		ok(button6.classList.contains('ui-btn-nobg'), 'Button has ui-btn-nobg class');
	});
	test("Button - Enabled state", function () {
		var button7 = document.getElementById('button-7');

		//after build
		tau.engine.instanceWidget(button7, 'Button');
		equal(button7.getAttribute('data-tau-bound'), "Button", "Button widget is created");
		ok(button7.classList.contains('ui-btn'), 'Button has ui-btn class');

		ok(!button7.classList.contains('ui-disabled'), 'Button hasn\'t ui-disabled class');
		ok(!button7.getAttribute('disabled'), 'Button hasn\'t disabled attribute');
		equal(button7.getAttribute('aria-disabled'), "false", "Button aria-disabled attribute is false");
	});
	test("Button - Disabled state", function () {
		var button8 = document.getElementById('button-8');

		//after build
		tau.engine.instanceWidget(button8, 'Button');
		equal(button8.getAttribute('data-tau-bound'), "Button", "Button widget is created");
		ok(button8.classList.contains('ui-btn'), 'Button has ui-btn class');

		ok(button8.classList.contains('ui-state-disabled'), 'Button has ui-disabled class');
		ok(button8.getAttribute('disabled'), 'Button has disabled attribute');
		equal(button8.getAttribute('aria-disabled'), "true", "Button aria-disabled attribute is true");
	});
}());