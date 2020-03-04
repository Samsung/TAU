/*
 * mobile popup unit tests
 */
$(document).ready(function () {

	module("popup", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	var urlObject = $.mobile.path.parseLocation(),
		home = urlObject.pathname + urlObject.search;

	$.extend($.testHelper, {

	// detailedEventCascade: call a function and expect a series of events to be triggered (or not to be triggered), and guard
	// with a timeout against getting stood up. Record the result (timed out / was triggered) for each event, and the order
	// in which the event arrived wrt. any other events expected.
	//		seq : [
	//			fn(result),
	//			{ key: {
	//					src: event source (is jQuery object),
	//					event: event name (is string),
	//					       NB: It's a good idea to namespace your events, because the handler will be removed
	//					       based on the name you give here if a timeout occurs before the event fires.
	//					userData1: value,
	//					...
	//					userDatan: value
	//			  },
	//				...
	//			]
	//			...
	//		]
	//		result: {
	//			key: {
	//				idx: order in which the event fired
	//				src: event source (is jQuery object),
	//				event: event name (is string)
	//				timedOut: timed out (is boolean)
	//				userData1: value,
	//				...
	//				userDatan: value
	//			}
	//			...
	//		}
		detailedEventCascade: function (seq, result) {
				// grab one step from the sequence
			var fn = seq.shift(),
				events = seq.shift(),
				self = this,
				derefSrc = function (src) {
					return ($.isFunction(src) ? src() : src);
				};

				// we're done
			if (fn === undefined) {
				return;
			}

				// Attach handlers to the various objects which are to be checked for correct event generation
			if (events) {
				var newResult = {},
					nEventsDone = 0,
					nEvents = 0,
						// set a failsafe timer in case one of the events never happens
					warnTimer = setTimeout(function () {
						$.each(events, function (key, event) {
							if (newResult[key] === undefined) {
									// clean up the unused handler
								derefSrc(event.src).unbind(event.event);
								newResult[key] = $.extend({}, event, { timedOut: true });
							}
						});

							// Move on to the next step
						self.detailedEventCascade(seq, newResult);
					}, 500);

				function recordResult(key, event, result) {
						// Record the result
					newResult[key] = $.extend({}, event, result);
						// Increment the number of received responses
					nEventsDone++;
					if (nEventsDone === nEvents) {
							// clear the timeout and move on to the next step when all events have been received
						clearTimeout(warnTimer);
						setTimeout(function () {
							self.detailedEventCascade(seq, newResult);
						}, 0);
					}
				}

				$.each(events, function (key, event) {
						// Count the events so that we may know how many responses to expect
					nEvents++;
						// If it's an event
					if (event.src) {
							// Hook up to the event
						derefSrc(event.src).one(event.event, function () {
							recordResult(key, event, { timedOut: false, idx: nEventsDone });
						});
					}
						// If it's a timeout
					else {
						setTimeout(function () {
							recordResult(key, event, { timedOut: true, idx: -1 });
						}, event.length);
					}
				});
			}

				// Call the function with the result of the events
			fn(result);
		}
	});

		// this test was moved because it didn't pass when it was at the end of the file
	asyncTest("Navigating away from the popup page closes the popup without history enabled", function () {
		var $popup = $("#test-history-popup");

		expect(3);

		$.testHelper.detailedEventCascade([
			function () {
				$popup.popup();
				$popup.popup("open", {transition: "none"});
			},

			{
				open: { src: $popup, event: "popupafterclose.historyOffTestStep1" }
			},

			function () {
				ok($popup.is(":visible"), "popup is indeed visible");
				$.mobile.changePage("#no-popups", {transition: "none"});
			},

			{
				hashchange: { src: $(window), event: "hashchange.historyOffTestStep2" },
				close: { src: $popup, event: "popupafterclose.historyOffTestStep2" }
			},

			function (result) {
				ok(!result.close.timedOut, "close happened");
				ok(!result.close.timedOut, "hashchange happened");
				$.mobile.changePage("#page1", {transition: "none"});

					// TODO make sure that the afterclose is fired after the nav finishes
				setTimeout(start, 300);
			}
		]);
	});

	function popupEnhancementTests($sel, prefix) {
		var $container = $sel.parent(),
			$screen = $sel.parent().prev();

		ok($sel.popup(), prefix + ", popup div is associated with a popup widget");
		ok($sel.hasClass("ui-popup"), prefix + ", popup payload has class 'ui-popup'");
	}

	function tolTest(el, popup, val, expected) {
		el.popup("option", "tolerance", val);
		deepEqual(el.popup("option", "tolerance"), expected, "Popup tolerance: '" + val + "' results in expected tolerances");
	}

	test("Popup is enhanced correctly", function () {
		popupEnhancementTests($("#test-popup"), "When autoenhanced");
	});

	test("Popup rearranges DOM elements correctly when it is destroyed and again when it is re-created", function () {

			// widget must be built before destroying
		$("#test-popup").popup();
		$("#test-popup").popup("destroy");

		$("#test-popup").popup();

		popupEnhancementTests($("#test-popup"), "When re-created");
	});

	test("On-the-fly popup is enhanced and de-enhanced correctly", function () {
		var $container = $("<div></div>").appendTo($("#page-content")),
			$payload = $("<p id='otf-popup'>This is an on-the-fly-popup</p>").appendTo($container);

		$payload.popup();

		popupEnhancementTests($payload, "When created on-the-fly");
	});

		// This test assumes that the popup opens into a state that does not include dialogHashKey.
		// This should be the case if the previous test has cleaned up correctly.

}) ;

