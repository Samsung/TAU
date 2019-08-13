/* global document, tau, define, module, test, strictEqual, initFixture, window*/
/* eslint no-multi-str:off */
(function () {
	"use strict";
	var graph;

	function runTests() {
		function initHTML() {
			var HTML = "<div class='ui-graph'\
				id='graph'\
				data-mode='continuous'\
				data-graph='bar'\
				data-color='#FF0000'\
				data-xlabel='Number'\
				data-ylabel='Value'\
				data-xinit='1'\
				data-yinit='1'\
				data-axis-x-type='index'\
				data-axis-x-max-count='10'\
				data-axis-x-unit='s'\
				data-value='[1,2,5]'></div>\
				",
				parent = document.getElementById("qunit-fixture") || initFixture();

			parent.innerHTML = HTML;
		}

		module("mobile/widget/mobile/Graph", {
			setup: initHTML,
			teardown: function () {
				if (graph && typeof graph.destroy === "function") {
					graph.destroy();
				}
			}
		});

		test("constructor (default values)", function (qunit) {
			if (window.WeakMap && window.Map) { // WeekMap is required by Graph widget
				graph = tau.widget.Graph(document.createElement("div"));

				// Default values
				strictEqual(graph.option("graph"), "line", "Option 'graph' is set to line");
				strictEqual(graph.option("color").toString(), "#0097D8", "Option 'color' is set to #0097D8");
				strictEqual(graph.option("xlabel"), "", "Option 'xlabel' is set to ''");
				strictEqual(graph.option("ylabel"), "", "Option 'ylabel' is set to ''");
				strictEqual(graph.option("axisXType"), "time", "Option 'axisXType' is set to 'time'");
				strictEqual(graph.option("axisYType"), "linear", "Option 'axisYType' is set to 'linear'");
				strictEqual(graph.option("mode"), "intermittent", "Option 'mode' is set to 'intermittent'");
				strictEqual(graph.option("value").toString(), "", "Option 'value' is set to '[]'");
				strictEqual(graph.option("timeAxis"), "x", "Option 'timeAxis' is set to 'x'");
				strictEqual(graph.option("groupKey"), "label", "Option 'groupKey' is set to 'label'");
				strictEqual(graph.option("legend"), false, "Option 'legend' is set to 'false'");
			} else {
				qunit.ok(true, "The Graph widget cannot be tested on this platform.");
			}
		});

		test("constructor (Values from widget element)", function (qunit) {
			if (window.WeakMap && window.Map) { // WeekMap is required by Graph widget
				// Values from widget element
				graph = tau.widget.Graph(document.querySelector(".ui-graph"));

				strictEqual(graph.option("graph"), "bar", "Option 'graph' is set to bar");
				strictEqual(graph.option("color").toString(), "#FF0000", "Option 'color' is set to #FF0000");
				strictEqual(graph.option("xlabel"), "Number", "Option 'xlabel' is set to 'Number'");
				strictEqual(graph.option("ylabel"), "Value", "Option 'ylabel' is set to 'Value'");
				strictEqual(graph.option("axisXType"), "index", "Option 'axisXType' is set to 'index'");
				strictEqual(graph.option("axisYType"), "linear", "Option 'axisYType' is set to 'linear'");
				strictEqual(graph.option("mode"), "continuous", "Option 'mode' is set to 'continuous'");
				strictEqual(graph.option("value").length, 3, "Option 'value' length is set to 3 records");
			} else {
				qunit.ok(true, "The Graph widget cannot be tested on this platform.");
			}
		});

		test("add value", function (qunit) {
			if (window.WeakMap && window.Map) { // WeekMap is required by Graph widget
				// Values from widget element
				graph = tau.widget.Graph(document.createElement("div"));

				graph.option("mode", "continuous");
				graph.value(6);
				graph.value(7);
				graph.value(8);
				graph.value(9);
				strictEqual(graph.option("value").length, 4, "Option 'value' length is set to 4 records");
			} else {
				qunit.ok(true, "The Graph widget cannot be tested on this platform.");
			}
		});

	}

	if (typeof define === "function") {
		define([
			"../../../../../../../src/js/core/widget/core/Page"
		], function (Page) {
			return runTests.bind(null, Page);
		});
	} else {
		runTests(
			tau.widget.Graph,
			window.helpers);
	}
}());
