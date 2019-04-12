/* global document, tau, module, test, window, ok, equal */
module("Dimmer tests", {
	setup: function () {},
	teardown: function () {
		tau.engine._clearBindings();
	}
});

if (window.MutationObserver && !window.MutationObserver.mockup) { // Disable tests if MutationObserver does not exist
	test("Default Dimmer options test", 7, function () {
		var dimmer = document.getElementById("dimmer"),
			dimmerWidget = tau.widget.Dimmer(dimmer),
			dimmerClasses = {
				dimmer: "ui-dimmer",
				sample: "sample-dimmer"
			},
			defaultOptions = {
				min: 0,
				max: 100,
				bulb: false,
				options: "30:blue; 60:yellow; 100:red"
			},
			defaultValue = 50;

		ok(dimmer.classList.contains(dimmerClasses.dimmer), "Dimmer classname of element is defined");
		ok(dimmer.classList.contains(dimmerClasses.sample), "Custom classname of element is defined");

		equal(dimmerWidget.value(), defaultValue, "Default value for Dimmer is " + defaultValue);
		equal(dimmerWidget.option("min"), defaultOptions.min, "Default option min for Dimmer is " + defaultOptions.min);
		equal(dimmerWidget.option("max"), defaultOptions.max, "Default option max for Dimmer is " + defaultOptions.max);
		equal(dimmerWidget.option("options"), defaultOptions.options, "Default option options for Dimmer is " + defaultOptions.options);
		equal(dimmerWidget.option("bulb"), defaultOptions.bulb, "Default option bulb for Dimmer is " + defaultOptions.bulb);

		dimmerWidget.destroy();
	});

	test("Dimmer options setting test", 5, function () {
		var dimmer = document.getElementById("dimmer"),
			dimmerWidget,
			options = {
				min: 20,
				max: 40,
				bulb: true,
				options: "25:blue; 30:yellow; 35:red"
			},
			value = 99;

		dimmer.setAttribute("value", value);
		dimmerWidget = tau.widget.Dimmer(dimmer, options);

		equal(dimmerWidget.value(), value, "Dimmer value is " + value);
		equal(dimmerWidget.option("min"), options.min, "Min option for Dimmer is " + options.min);
		equal(dimmerWidget.option("max"), options.max, "Max option for Dimmer is " + options.max);
		equal(dimmerWidget.option("options"), options.options, "Options option for Dimmer is " + options.options);
		equal(dimmerWidget.option("bulb"), options.bulb, "Bulb option for Dimmer is " + options.bulb);

		dimmerWidget.destroy();
	});


	test("Dimmer set and change value test", 4, function () {
		var dimmer = document.getElementById("dimmer"),
			dimmerWidget = tau.widget.Dimmer(dimmer),
			defaultValue = 50,
			valueToCheck = 30,
			min = 0,
			max = 100,
			lessThanMinimal = -30,
			greaterThanMax = 120;

		equal(dimmerWidget.value(), defaultValue, "Default value for dimmer is " + defaultValue);
		dimmerWidget.value(valueToCheck);
		equal(dimmerWidget.value(), valueToCheck, "Dimmer value after change is " + valueToCheck);

		dimmerWidget.value(lessThanMinimal);
		equal(dimmerWidget.value(), min, "Dimmer value after attempt to set it less than minimal");

		dimmerWidget.value(greaterThanMax);
		equal(dimmerWidget.value(), max, "Dimmer value after attempt to set it greater than maximal");

		dimmerWidget.destroy();
	});

	test("Check widget opacity depending on value set", 8, function () {
		var dimmer = document.getElementById("dimmer"),
			dimmerWidget,
			max = 10,
			min = 0,
			valuesToSet = [-4, 0, 1, 3, 5, 7, 10, 15],
			correspondingAlphas = [0, 0, 0.1, 0.3, 0.5, 0.7, 1, 1],
			borderStyle,
			getAlphaRe = /rgba\(.*, (.+)\)/,
			alphaValue,
			i = 0;

		dimmerWidget = tau.widget.Dimmer(dimmer, {min: min, max: max, value: 0, bulb: false});

		for (; i < valuesToSet.length; i++) {
			dimmerWidget.value(valuesToSet[i]);
			borderStyle = dimmer.style.border;
			alphaValue = (getAlphaRe.test(borderStyle)) ? parseFloat(borderStyle.match(getAlphaRe)[1]) : 1.0;
			ok(Math.abs(alphaValue - correspondingAlphas[i]) < 0.05, "Checking border alpha depending on value set " + valuesToSet[i]);
		}

		dimmerWidget.destroy();
	});
} else {
	test("Dimmer Widget cannot be created in this environment", function () {
		equal(1, 1, "Mutation observer does not exist");
	});
}