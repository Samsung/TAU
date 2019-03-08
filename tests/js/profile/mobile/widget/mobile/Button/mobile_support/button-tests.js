/*
 * Unit Test: Button
 *
 * Hyunjung Kim <hjnim.kim@samsung.com>
 *
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
$(document).ready(function () {

	module("button", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	var unit_button = function (widget, type, text) {
			var buttonClassPrefix = "ui-btn",
				buttonText = type,
				icon,
				position,
				buttonStyle,
				hasClass;

			widget.button();
			ok(widget.hasClass(buttonClassPrefix), "Create - Button");

			if (widget.jqmData("inline")) {
				ok(widget.hasClass("ui-inline"), "Style - Inline");
			} else {
				ok(!widget.hasClass("ui-inline"), "Style - Non Inline");
			}

			if (!widget.children().first().hasClass(buttonClassPrefix + "-hastxt")) {
				buttonText = "";
			}

			icon = widget.jqmData("icon");
			if (icon !== undefined) {
				ok(widget.hasClass("ui-icon-" + icon), "Style - Button Icon");
			}
			if (icon !== undefined && buttonText != "") {
				position = widget.jqmData("iconpos");
				if (position === undefined) {
					position = "left";
				}
				ok(widget.children().children().first().hasClass(buttonClassPrefix + "-text-padding-" + position), "Style - Button Icon, Text Position");
			}

			buttonStyle = widget.jqmData("style");
			if (buttonStyle !== undefined) {
				switch (buttonStyle) {
					case "circle":
						hasClass = ".ui-btn-circle";
						break;
					case "light":
						hasClass = ".ui-btn-text-light";
						break;
					case "dark":
						hasClass = ".ui-btn-text-dark";
						break;
					case "nobg":
						hasClass = ".ui-btn-nobg";
						break;
				}
				ok(widget.is(hasClass), "has correct other class");
			}

			// Check APIs
			widget.button("disable");
			equal(widget.attr("disabled"), "disabled", "button disable test");

			widget.button("enable");
			equal(widget.attr("disabled"), undefined, "button enable test");
		},

		unit_button_events = function () {

			var createEvent = false,
				clickEvent = false,
				buttonClassPrefix = "ui-btn",
				widget,
				markup;

			//remove all controls form content
			$("#checkboxpage").find(":jqmData(role=content)").empty();
			markup = "<div data-role=\"button\"id=\"button-0\">Text Button Dynamic</div>";
			$("#checkboxpage").find(":jqmData(role=content)").append(markup);
			widget = $("#button-0");

			/*Bind Event*/
			widget.button({
				create: function () {
					createEvent = true;
				}
			});

			widget.bind("click", function () {
				clickEvent = true;
			});

			$("#checkboxpage").find(":jqmData(role=content)").trigger("create");
			widget.button();

			/*Check Event*/
			$("#checkboxpage").find(":jqmData(role=content)").trigger("create");
			ok(widget.hasClass(buttonClassPrefix), "Create - Button");
			ok(createEvent, "Button Create Event");
			widget.trigger("click");
			ok(clickEvent, "Button Click Event");
		};

	test("Button", function () {
		unit_button($("#button-0"), "Text Button");
	});

	test("Button - Inline", function () {
		unit_button($("#button-1"), "Text Button Inline");
	});

	test("Button - Inline, Icon", function () {
		unit_button($("#button-2"), "Call Icon");
	});

	test("Button - Inline, Call Icon, Icon Position ( Right )", function () {
		unit_button($("#button-3"), "Icon Text");
	});

	test("Button - Inline, Only Icon ( Reveal )", function () {
		unit_button($("#button-4"), "Non Text Button", "reveal");
	});

	test("Button - Inline, Only Icon ( Send ) , circle", function () {
		unit_button($("#button-5"), "Non Text Button", "send");
	});

	test("Button - Inline, Only Icon ( Favorite ) , nobackground", function () {
		unit_button($("#button-6"), "Non Text Button", "favorite");
	});

	test("Remove buttons", function () {
		//remove all controls form content
		$("#checkboxpage").find(":jqmData(role=content)").empty();
		unit_button_events();
	});

});
