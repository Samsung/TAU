/* global helpers, test, ok, equal, tau */
(function () {
	"use strict";

	function initHTML() {
		var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/mobile/widget/TimePicker/test-data/sample.html"),
			parent = document.getElementById("qunit-fixture") || helpers.initFixture();

		parent.innerHTML = HTML;
	}

	module("profile/mobile/widget/mobile/TimePicker", {
		setup: initHTML,
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test("Default options TimePicker test", 2, function () {
		var timePicker = document.getElementById("timePicker"),
			timePickerWidget = tau.engine.instanceWidget(timePicker, "TimePicker"),
			timePickerClasses = {
				timePicker: "ui-time-picker"
			},
			defaultoptions = {
				format: "12"
			};

		ok(timePicker.classList.contains(timePickerClasses.timePicker),
			"TimePickder classname of element is defined");
		equal(timePickerWidget.option("format"), defaultoptions.format,
			"Default option format of TimePicker is " + defaultoptions.format);

		timePickerWidget.destroy();
	});

	test("Defined options TimePicker test", 1, function () {
		var timePicker = document.getElementById("timePicker"),
			options = {
				format: "24"
			},
			timePickerWidget = tau.engine.instanceWidget(timePicker, "mobile.TimePicker", options);

		equal(timePickerWidget.option("format"), options.format, "Option format of TimePicker is " + options.format);

		timePickerWidget.destroy();
	});

	test("Undefined values of options TimePicker test", 1, function () {
		var timePicker = document.getElementById("timePicker"),
			options = {
				format: undefined
			},
			timePickerWidget = tau.engine.instanceWidget(timePicker, "mobile.TimePicker", options);

		equal(timePickerWidget.option("format"), "12", "TimePicker option format with undefined value check");

		timePickerWidget.destroy();
	});

	test("Values TimePicker test", 2, function () {
		var timePicker = document.getElementById("timePicker"),
			timePickerWidget = tau.engine.instanceWidget(timePicker, "mobile.TimePicker"),
			testDate = new Date(0),
			result;

		testDate.setHours(2);
		testDate.setMinutes(30);
		timePickerWidget.value(testDate);

		result = timePickerWidget.value();

		equal(result.getHours(), testDate.getHours(), "TimePicker hours value check with test date");
		equal(result.getMinutes(), testDate.getMinutes(), "TimePicker minutes value check with test date");

		timePickerWidget.destroy();
	});

}());
