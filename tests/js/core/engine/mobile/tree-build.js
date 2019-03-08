/*global module, test, asyncTest, equal, start, expect */
(function (ej, $){
	"use strict";
	var engine = ej.engine,
		_tempSaveSequence;

	module("core/engine", {
		teardown: function () {
			engine.stop();
			if (typeof _tempSaveSequence === "function") {
				document.removeEventListener("widgetbound", _tempSaveSequence, true);
				_tempSaveSequence = null;
			}
		}
	});

	asyncTest("Build sequence", function () {
		var expectedSequence = [
			"page1",
				"el-25",
					"el-1",
						"el-2",
							"el-3",
								"el-4",
									"el-5", "el-6", "el-7", "el-8",
						"el-9",
							"el-10",
								"el-11",
									"el-12", "el-13", "el-14", "el-15",
						"el-16",
							"el-17", "el-18", "el-19", "el-20",
						"el-21",
							"el-22", "el-23",
					"el-24"
			],
			receivedSequence = [],
			eventCount = 0;

		expect(expectedSequence.length);

		function saveSequence(event) {
			var elementId = event.detail.id;

			// Two events reach document, we want to handle only one of it
			if(event.target === event.detail.element) {
				equal(elementId, expectedSequence[eventCount], "Element [" + elementId + "] with widget [" + event.detail.name + "] was build in proper order");

				receivedSequence.push(elementId);
				eventCount += 1;

				if (eventCount === expectedSequence.length) {
					start();
					// Do not remove event listener here, because it's possible that other widgets will trigger widgetbound
					// and we want to know this
				}
			}
		}

		// Save reference to saveSequence outside test for calling the teardown
		// not the most elegant way of handling this but very convenient
		_tempSaveSequence = saveSequence;

		document.getElementById("page1").addEventListener("widgetbound", saveSequence, true);

		engine.run();
	});

}(window.ej, window.jQuery));
