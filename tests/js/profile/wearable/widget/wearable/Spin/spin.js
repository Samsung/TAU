/* global module, test, ok, equal, tau */
module("Spin tests (circular)", {
	setup: function () {
		tau.support.shape.circle = true;
	},
	teardown: function () {
		tau.engine._clearBindings();
		tau.support.shape.circle = false;
	}
});

test("Default options Spin test", 17, function () {
	var spin = document.getElementById("spin"),
		spinWidget = new tau.widget.Spin(spin),
		spinClasses = {
			spin: "ui-spin",
			sample: "sample-spin"
		},
		defaultoptions = {
			min: 0,
			max: 9,
			moduloValue: "enabled",
			shortPath: "enabled",
			duration: 600,
			direction: "up",
			rollHeight: "custom", // "container" | "item" | "custom"
			itemHeight: 38,
			momentumLevel: 0, // 0 - one item on swipe
			scaleFactor: 0.4,
			moveFactor: 0.4,
			loop: "enabled",
			labels: [],
			digits: 0, // 0 - doesn't complete by zeros
			dragTarget: "self"
		};

	ok(spin.classList.contains(spinClasses.spin),
		"Spin classname of element is defined");
	ok(spin.classList.contains(spinClasses.sample),
		"Custom classname of element is defined");

	equal(spinWidget.option("min"), defaultoptions.min, "Default option min of Spin is " + defaultoptions.min);
	equal(spinWidget.option("max"), defaultoptions.max, "Default option max of Spin is " + defaultoptions.max);
	equal(spinWidget.option("moduloValue"), defaultoptions.moduloValue,
		"Default option moduloValue of Spin is " + defaultoptions.moduloValue);
	equal(spinWidget.option("shortPath"), defaultoptions.shortPath,
		"Default option shortPath of Spin is " + defaultoptions.shortPath);
	equal(spinWidget.option("duration"), defaultoptions.duration,
		"Default option duration of Spin is " + defaultoptions.duration);
	equal(spinWidget.option("rollHeight"), defaultoptions.rollHeight,
		"Default option rollHeight of Spin is " + defaultoptions.rollHeight);
	equal(spinWidget.option("itemHeight"), defaultoptions.itemHeight,
		"Default option itemHeight of Spin is " + defaultoptions.itemHeight);
	equal(spinWidget.option("momentumLevel"), defaultoptions.momentumLevel,
		"Default option momentumLevel of Spin is " + defaultoptions.momentumLevel);
	equal(spinWidget.option("scaleFactor"), defaultoptions.scaleFactor,
		"Default option scaleFactor of Spin is " + defaultoptions.scaleFactor);
	equal(spinWidget.option("moveFactor"), defaultoptions.moveFactor,
		"Default option moveFactor of Spin is " + defaultoptions.moveFactor);
	equal(spinWidget.option("loop"), defaultoptions.loop,
		"Default option loop of Spin is " + defaultoptions.loop);
	equal(spinWidget.option("digits"), defaultoptions.digits,
		"Default option digits of Spin is " + defaultoptions.digits);
	equal(spinWidget.option("dragTarget"), defaultoptions.dragTarget,
		"Default option dragTarget of Spin is " + defaultoptions.dragTarget);
	spinWidget.value(5);
	equal(spinWidget.value(), 5,
		"Default option value of Spin is " + 5);
	equal(typeof spinWidget.option("labels"), typeof defaultoptions.labels,
		"TYpe of Default option labels of Spin is " + typeof defaultoptions.labels);

	spinWidget.destroy();

});

test("Defined options Spin test", 14, function () {
	var spin = document.getElementById("spin"),
		options = {
			min: 3,
			max: 10,
			moduloValue: "enabled",
			shortPath: "enabled",
			duration: 200,
			direction: "down",
			rollHeight: "container", // "container" | "item" | "custom"
			itemHeight: 48,
			momentumLevel: 3, // 0 - one item on swipe
			scaleFactor: 0.7,
			moveFactor: 0.1,
			loop: "disabled",
			labels: ["Aaa", "Bbb", "Ccc", "Ddd"],
			digits: 3, // 0 - doesn't complete by zeros
			dragTarget: "self"
		},
		spinWidget = new tau.widget.Spin(spin, options);

	equal(spinWidget.option("min"), options.min, "Option min of Spin is " + options.min);
	equal(spinWidget.option("max"), options.max, "Option max of Spin is " + options.max);
	equal(spinWidget.option("moduloValue"), options.moduloValue,
		"Option moduloValue of Spin is " + options.moduloValue);
	equal(spinWidget.option("shortPath"), options.shortPath,
		"Option shortPath of Spin is " + options.shortPath);
	equal(spinWidget.option("duration"), options.duration,
		"Option duration of Spin is " + options.duration);
	equal(spinWidget.option("rollHeight"), options.rollHeight,
		"Option rollHeight of Spin is " + options.rollHeight);
	equal(spinWidget.option("itemHeight"), options.itemHeight,
		"Option itemHeight of Spin is " + options.itemHeight);
	equal(spinWidget.option("momentumLevel"), options.momentumLevel,
		"Option momentumLevel of Spin is " + options.momentumLevel);
	equal(spinWidget.option("scaleFactor"), options.scaleFactor,
		"Option scaleFactor of Spin is " + options.scaleFactor);
	equal(spinWidget.option("moveFactor"), options.moveFactor,
		"Option moveFactor of Spin is " + options.moveFactor);
	equal(spinWidget.option("loop"), options.loop,
		"Option loop of Spin is " + options.loop);
	equal(spinWidget.option("labels"), options.labels,
		"Option labels of Spin is " + options.labels);
	equal(spinWidget.option("digits"), options.digits,
		"Option digits of Spin is " + options.digits);
	equal(spinWidget.option("dragTarget"), options.dragTarget,
		"Option dragTarget of Spin is " + options.dragTarget);

	spinWidget.destroy();

});

test("Undefined values of options Spin test", 4, function () {
	var spin = document.getElementById("spin"),
		options = {
			min: undefined,
			max: undefined,
			duration: undefined
		},
		spinWidget = new tau.widget.Spin(spin, options);

	spinWidget.value(undefined);

	equal(spinWidget.option("min"), 0, "Spin option min with undefined value check");
	equal(spinWidget.option("max"), 0, "Spin option max with undefined value check");
	equal(spinWidget.option("duration"), 0, "Spin option duration with undefined value check");
	spinWidget.value(0);
	equal(spinWidget.value(), 0,
		"Default option value of Spin is " + 0);

	spinWidget.destroy();

});


test("Values Spin test", 4, function () {
	var spin = document.getElementById("spin"),
		options = {
			min: 3,
			max: 10,
			loop: "disabled"
		},
		testValues = [0, 10, 100, 11],
		spinWidget = new tau.widget.Spin(spin, options);

	spinWidget.value(testValues[0]);
	equal(spinWidget.value(), testValues[0], "Spin value check (0)");
	spinWidget.value(testValues[1]);
	equal(spinWidget.value(), testValues[1], "Spin value check (10)");
	spinWidget.value(testValues[2]);
	equal(spinWidget.value(), spinWidget.option("max"), "Spin value check (100) limited to max");
	spinWidget.option("loop", "enabled");
	spinWidget.value(testValues[3]);
	equal(spinWidget.value(), spinWidget.option("min"), "Spin value check (max + 1) equal min for loop enabled");

	spinWidget.destroy();

});
