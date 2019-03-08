/*global window, start */
(function (window, document, tau, QUnit, define) {
	"use strict";

	QUnit.config.reorder = false;

	function runTests(orientation, helpers) {
		var mockWindow = {
				matchMedia: null,
				orientation: null,
				screen: null,
				innerHeight: 0,
				innerWidth: 0,
				addEventListener: function (name, listener, capture) {
					return window.addEventListener(name, listener, capture);
				},
				removeEventListener: function (name, listener, capture) {
					return window.removeEventListener(name, listener, capture);
				},
				reset: function () {
					this.orientation = null;
					this.screen = null;
					this.innerHeight = 0;
					this.innerWidth = 0;
					this.matchMedia = null;
				}
			},
			originalSupport = false;

		QUnit.module("core/event/orientationchange", {
			setup: function () {
				orientation._window = mockWindow;
				originalSupport = orientation.supported;
			},
			teardown: function () {
				orientation._window = window;
				orientation.supported = originalSupport;
				mockWindow.reset();
			}
		});

		QUnit.test("detection by dimensions", function (assert) {
			mockWindow.innerWidth = 100;
			mockWindow.innerHeight = 50;
			orientation.detect();
			assert.equal(orientation.getOrientation(), "landscape", "landscape detected by window dimensions");

			mockWindow.innerWidth = 50;
			mockWindow.innerHeight = 100;
			orientation.detect();
			assert.equal(orientation.getOrientation(), "portrait", "landscape detected by window dimensions");

			mockWindow.screen = {
				availWidth: 100,
				availHeight: 50
			};
			orientation.detect();
			assert.equal(orientation.getOrientation(), "landscape", "landscape detected by screen dimensions");

			mockWindow.screen.availWidth = 50;
			mockWindow.screen.availHeight = 100;
			orientation.detect();
			assert.equal(orientation.getOrientation(), "portrait", "landscape detected by screen dimensions");
		});

		QUnit.test("detection by orientation", function (assert) {
			orientation.supported = true;
			mockWindow.orientation = 90;
			orientation.detect();
			assert.equal(orientation.getOrientation(), "portrait", "portrait detected by orientation 90 degrees");

			mockWindow.orientation = 190;
			orientation.detect();
			assert.equal(orientation.getOrientation(), "landscape", "landscape detected by orientation 180 degrees");
		});

		QUnit.test("detection by matchMedia", function (assert) {
			var queryListTrigger = null,
				mockQueryList = {
					matches: 0,
					addListener: function (callback) {
						queryListTrigger = callback;
					}
				};

			mockWindow.matchMedia = function () {
				return mockQueryList;
			};

			orientation.supported = false;

			orientation.detect(); // default should be landscape since matches is 0
			assert.equal(orientation.getOrientation(), "landscape", "landscape is default");

			mockQueryList.matches = 1;
			orientation.detect();
			assert.equal(orientation.getOrientation(), "portrait", "portrait detected");

			mockQueryList.matches = 0;
			queryListTrigger(mockQueryList, true);
			assert.equal(orientation.getOrientation(), "landscape", "landscape when triggered");

			mockQueryList.matches = 1;
			queryListTrigger(mockQueryList, true);
			assert.equal(orientation.getOrientation(), "portrait", "portrait when triggered");
		});

		QUnit.asyncTest("fire event for element", function (assert) {
			var el = document.createElement("div");

			el.addEventListener("orientationchange", function (e) {
				assert.equal(e.detail.orientation, "portrait", "portrait is the default");
				start();
			});

			document.body.appendChild(el);
			orientation.trigger(el);
		});

		QUnit.test("test orientationchange event recheck on mediaquery match", function (assert) {
			var queryListTrigger = null,
				mockQueryList = {
					matches: 0,
					addListener: function (callback) {
						queryListTrigger = callback;
					}
				};

			mockWindow.matchMedia = function () {
				return mockQueryList;
			};

			orientation.supported = false;

			mockQueryList.matches = 1;
			orientation.detect();
			assert.equal(orientation.getOrientation(), "portrait", "portrait detected");

			mockQueryList.matches = 0; // set for landscape
			mockWindow.innerWidth = 50;
			mockWindow.innerHeight = 100; // force portrait by dimensions

			// trigger callback without immiting orientationchange event triggering
			// which will be catched by orientationchange handler, and passed to check by dimensions
			// since orientation=null in mockWindow
			queryListTrigger(mockQueryList);
			assert.equal(orientation.getOrientation(), "portrait", "still set");
		});

		QUnit.test("test unbind", function (assert) {
			mockWindow.innerHeight = 50;
			mockWindow.innerWidth = 100; // force landscape

			orientation.supported = false;

			orientation.detect();

			assert.equal(orientation.getOrientation(), "landscape", "proper orientation set");

			mockWindow.innerHeight = 100;
			mockWindow.innerWidth = 50; // force  portrait

			helpers.triggerEvent(document.body, "throttledresize");

			assert.equal(orientation.getOrientation(), "portrait", "proper orientation set by throttledresize");

			mockWindow.innerHeight = 50;
			mockWindow.innerWidth = 100; // force landscape portrait

			orientation.unbind();
			helpers.triggerEvent(document.body, "throttledresize");

			assert.equal(orientation.getOrientation(), "portrait", "proper orientation still set by throttledresize");
		});
	}

	if (define) {
		define(
			[
				"../../../../../src/js/core/event/orientationchange",
				"../../../../karma/tests/helpers"
			],
			function (engine, event, orientation, helpers) {
				return runTests.bind(null, orientation, helpers);
			}
		);
	} else {
		runTests(tau.event.orientationchange, window.helpers);
	}

}(window, window.document, window.tau, window.QUnit, window.define));
