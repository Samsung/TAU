(function (window, document) {
	"use strict";

	module("core/widget/core/Button");

	tau.engine.defineWidget(
		"Button",
		"button, [data-role='button'], .ui-btn, input[type='button']",
		[],
		tau.widget.core.Button,
		"core",
		true
	);

	test("Button - Create", 2, function() {
		var el = document.getElementById("button1");

		tau.engine.instanceWidget(el, "Button");

		equal(el.getAttribute("data-tau-bound"), "Button", "Button widget is created");
		ok(el.classList.contains("ui-btn"), "Button has ui-btn class");
	});

	test("Button - Inline, Icon", 4, function() {
		var el = document.getElementById("button2");

		tau.engine.instanceWidget(el, "Button");

		ok(el.classList.contains("ui-inline"), "Button has ui-inline class");
		ok(el.classList.contains("ui-btn-icon"), "Button has ui-btn-icon class");
		ok(el.classList.contains("ui-btn-icon-only"), "Button has ui-btn-icon-only class");
		ok(el.classList.contains("ui-icon-call"), "Button has ui-icon-call class");
	});

	test("Button - Circle", 1, function() {
		var el = document.getElementById("button3");

		tau.engine.instanceWidget(el, "Button");

		ok(el.classList.contains("ui-btn-circle"), "Button has ui-btn-circle class");
	});

	test("Button - Icon Position", 4, function() {
		var el1 = document.getElementById("button4"),
			el2 = document.getElementById("button5"),
			el3 = document.getElementById("button6"),
			el4 = document.getElementById("button7");

		tau.engine.instanceWidget(el1, "Button");
		tau.engine.instanceWidget(el2, "Button");
		tau.engine.instanceWidget(el3, "Button");
		tau.engine.instanceWidget(el4, "Button");

		ok(el1.classList.contains("ui-btn-icon-top"), "Button has ui-btn-icon-top class");
		ok(el2.classList.contains("ui-btn-icon-bottom"), "Button has ui-btn-icon-bottom class");
		ok(el3.classList.contains("ui-btn-icon-left"), "Button has ui-btn-icon-left class");
		ok(el4.classList.contains("ui-btn-icon-right"), "Button has ui-btn-icon-right class");
	});

	test("Button - Enable/Disable State", 2, function() {
		var el = document.getElementById("button8"),
			widget = tau.engine.instanceWidget(el, "Button");

		widget.disable();
		ok(el.classList.contains("ui-state-disabled"), "Button has ui-state-disabled class");
		widget.enable();
		ok(!el.classList.contains("ui-state-disabled"), "Button hasn\'t ui-state-disabled class");
	});

	test("Button - Set/Get Method", 2, function() {
		var el = document.getElementById("button9"),
			widget = tau.engine.instanceWidget(el, "Button");

		equal(widget.value(), "Value", "Get Value");
		widget.value("Change");
		equal(widget.value(), "Change", "Set Value");
	});

	test("Button - refresh and style change", function (assert) {
		var btn1 = document.getElementById("button10"),
			btn2 = document.getElementById("button11"),
			btn3 = document.getElementById("button12"),
			btn4 = document.getElementById("button16"),
			btn1Widget = null,
			btn2Widget = null,
			btn3Widget = null,
			btn4Widget = null,
			classes = tau.widget.core.Button.classes;

		btn1Widget = tau.engine.instanceWidget(btn1, "Button");
		assert.ok(btn1.classList.contains(classes.BTN_CIRCLE), "button contains circle style from data params");

		btn2Widget = tau.engine.instanceWidget(btn2, "Button");
		assert.ok(!btn2.classList.contains(classes.BTN_TEXT_LIGHT), "button has no ligtht style set as default");
		assert.ok(btn2.classList.contains(classes.BTN_TEXT), "button has text style set as default");


		btn2Widget.option("style", "light");
		assert.ok(btn2.classList.contains(classes.BTN_TEXT_LIGHT), "button has light style set after refresh");
		assert.ok(btn2.classList.contains(classes.BTN_TEXT), "button has text style after refresh");

		btn3Widget = tau.engine.instanceWidget(btn3, "Button");
		assert.ok(!btn3.classList.contains(classes.BTN_TEXT_DARK), "button has no dark style set as default");
		assert.ok(btn3.classList.contains(classes.BTN_TEXT), "button has text style set as default");

		btn3Widget.option("style", "dark");
		assert.ok(btn3.classList.contains(classes.BTN_TEXT_DARK), "button has dark style set after refresh");
		assert.ok(btn3.classList.contains(classes.BTN_TEXT), "button has text style after refresh");

		btn1Widget.option("style", "nobg");
		assert.ok(btn1.classList.contains(classes.BTN_NOBG), "button has nobg style set after refresh");
		assert.ok(!btn1.classList.contains(classes.BTN_CIRCLE), "button has no circle style");

		btn4Widget = tau.engine.instanceWidget(btn4, "Button");
		assert.ok(!btn4.classList.contains(classes.BTN_TEXT), "button without textContent has no text style set as default");

	});

	test("Button - setting title for icon", function (assert) {
		var btn = document.getElementById("button14"),
			widget = tau.engine.instanceWidget(btn, "Button"),
			desiredTitle = "iconpos-desired-title";

		assert.equal(btn.getAttribute("title"), null, "button has no title set");

		btn.textContent = desiredTitle;
		widget.option("icon", "call");

		assert.equal(btn.getAttribute("title"), desiredTitle, "button has proper title set");
	});

	test("Button - disable", function (assert) {
		var btn = document.getElementById("button15"),
			widget = tau.engine.instanceWidget(btn, "Button");

		assert.ok(!btn.classList.contains("ui-state-disabled"), "button has no disabled class");
		assert.ok(!btn.hasAttribute("disabled", "button has no disabled attribute"));
		assert.ok(!btn.disabled, "button disabled property is false");

		widget.disable();

		assert.ok(btn.classList.contains("ui-state-disabled"), "button has disabled class");
		assert.ok(btn.hasAttribute("disabled", "button has disabled attribute"));
		assert.ok(btn.disabled, "button disabled property is true");

		widget.enable();

		assert.ok(!btn.classList.contains("ui-state-disabled"), "button has no disabled class");
		assert.ok(!btn.hasAttribute("disabled", "button has no disabled attribute"));
		assert.ok(!btn.disabled, "button disabled property is false");

		btn.disabled = true;
		widget.refresh();

		assert.ok(btn.classList.contains("ui-state-disabled"), "button has disabled class");
		assert.ok(btn.hasAttribute("disabled", "button has disabled attribute"));
		assert.ok(btn.disabled, "button disabled property is true");
	});

})(window, window.document);

