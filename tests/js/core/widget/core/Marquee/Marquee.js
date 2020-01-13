/* global document, tau, define, module, test, window, ok, equal */
(function () {
	"use strict";

	function runTests(engine, Marquee, helpers) {

		function initHTML() {
			return new Promise(function (resolve) {
				var parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML =
					helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/Marquee/test-data/sample.html");
				helpers.loadTAUStyle(document, "wearable", function () {
					resolve();
				});
			});
		}

		module("core/widget/core/Marquee", {
			setup: initHTML,
			teardown: function () {
				engine._clearBindings();
			}
		});

		// This widget use animations and style injections which can't be tested in phantom
		test("simple marquee div test", 9, function () {
			var marqueeElement = document.getElementById("marquee"),
				marqueeWidget = tau.widget.Marquee(marqueeElement, {
					runOnlyOnEllipsisText: false
				}),
				marqueeObject = marqueeElement.querySelector(".ui-marquee-content");

			equal(marqueeObject.tagName, "DIV", "Marquee created DIV for marquee content");
			// check default marquee Style (slide)
			equal(marqueeWidget.option("marqueeStyle"), "slide", "Default marquee style is Slide");
			equal(marqueeWidget.option("timingFunction"), "linear", "Default marquee timing function is" +
				" linear");
			equal(marqueeWidget.option("iteration"), 1, "Default iteration count is 1");
			equal(marqueeWidget.option("speed"), 60, "Default speed of marquee is 60(px/sec)");
			equal(marqueeWidget.option("delay"), 0, "Default delay time is 0");
			equal(marqueeWidget.option("autoRun"), true, "Default autoRun option is true");
			equal(marqueeWidget.option("ellipsisEffect"), "gradient", "Default ellipsisEffect option is" +
				" gradient");


			marqueeWidget.destroy();
			// after destroy, check resetDOM.
			equal(marqueeElement.innerHTML, "<p>Marquee Test sample with Only text</p>",
				"original marquee element has proper innerHTML");
		});

		test("marquee with several element", 2, function () {
			var marqueeElement = document.getElementById("marquee2"),
				marqueeWidget = tau.widget.Marquee(marqueeElement, {
					runOnlyOnEllipsisText: false,
					autoRun: false
				}),
				marqueeObject = marqueeElement.querySelector(".ui-marquee-content");

			equal(marqueeObject.childElementCount, 2,
				"All childNodes in original element copied to marquee Object DOM");
			equal(marqueeObject.children[0].innerHTML, "Marquee Text with image file",
				"Text copied well into Marquee object DOM");

			marqueeWidget.destroy();
		});

		test("marquee Style and animation name Check", 3, function () {
			var marqueeSlideWidget = tau.widget.Marquee(document.getElementById("marqueeSlide"), {
					marqueeStyle: "slide",
					runOnlyOnEllipsisText: false,
					autoRun: false
				}),
				marqueeScrollWidget = tau.widget.Marquee(document.getElementById("marqueeScroll"), {
					marqueeStyle: "scroll",
					runOnlyOnEllipsisText: false,
					autoRun: false
				}),
				marqueeAlternateWidget = tau.widget.Marquee(document.getElementById("marqueeAlternate"), {
					marqueeStyle: "alternate",
					runOnlyOnEllipsisText: false,
					autoRun: false
				});

			equal(marqueeSlideWidget.option("marqueeStyle"), "slide",
				"Marquee widget has marqueeStyle=slide option");
			equal(marqueeScrollWidget.option("marqueeStyle"), "scroll",
				"Marquee widget has marqueeStyle=scroll option");
			equal(marqueeAlternateWidget.option("marqueeStyle"), "alternate",
				"Marquee widget has marqueeStyle=alternate option");

			marqueeSlideWidget.destroy();
			marqueeScrollWidget.destroy();
			marqueeAlternateWidget.destroy();
		});

		test("change option and refresh test for marquee", 2, function () {
			var marqueeWidget = tau.widget.Marquee(document.getElementById("optionsTest"), {
				marqueeStyle: "slide",
				runOnlyOnEllipsisText: false,
				autoRun: false
			});

			equal(marqueeWidget.option("marqueeStyle"), "slide",
				"Marquee widget has marqueeStyle=slide option");
			marqueeWidget.option("marqueeStyle", "alternate");
			equal(marqueeWidget.option("marqueeStyle"), "alternate",
				"Marquee style has been changed");
			marqueeWidget.option("iteration", "infinite");

			marqueeWidget.destroy();
		});

		test("method test for marquee", 2, function () {
			var marqueeElement = document.getElementById("methodTest"),
				marqueeWidget = tau.widget.Marquee(marqueeElement, {
					marqueeStyle: "alternate",
					iteration: "infinite",
					autoRun: false,
					runOnlyOnEllipsisText: false
				}),
				eventsCalled = {};

			marqueeElement.addEventListener("marqueestart", function (e) {
				eventsCalled[e.type] = true;
			});
			marqueeElement.addEventListener("marqueestopped", function (e) {
				eventsCalled[e.type] = true;
			});

			marqueeWidget.start();
			ok(eventsCalled.marqueestart, "Marquee is started");

			marqueeWidget.stop();
			ok(eventsCalled.marqueestopped, "Marquee is stopped");

			marqueeWidget.destroy();
		});

		/// new tests
		test("_calculateTranslateFunctions.scroll", 4, function (assert) {
			var marquee = new Marquee();

			assert.equal(
				marquee._calculateTranslateFunctions.scroll(marquee, 0, 10, 0, ""),
				"translateX(0px)", "0, 10, 0, ''");
			assert.equal(
				marquee._calculateTranslateFunctions.scroll(marquee, 0.5, 10, 0, ""),
				"translateX(-5px)", "0.5, 10, 0, ''");
			assert.equal(
				marquee._calculateTranslateFunctions.scroll(marquee, 1, 10, 0, ""),
				"translateX(-10px)", ", 10, 0, ''");
			assert.equal(
				marquee._calculateTranslateFunctions.scroll(marquee, 1, 10, 0, "translateX(-10px)"),
				null, "1, 10, 0, translateX(-10px)");
		});

		test("_calculateTranslateFunctions.slide", 4, function (assert) {
			var marquee = new Marquee();

			marquee._stateDOM = {
				offsetWidth: 10,
				children: [{
					offsetWidth: 30
				}]
			};
			assert.equal(
				marquee._calculateTranslateFunctions.slide(marquee, 0, 10, 0, ""),
				"translateX(0px)", "0, 10, 0, ''");
			assert.equal(
				marquee._calculateTranslateFunctions.slide(marquee, 0.5, 10, 0, ""),
				"translateX(-10.38px)", "0.5, 10, 0, ''");
			assert.equal(
				marquee._calculateTranslateFunctions.slide(marquee, 1, 10, 0, ""),
				"translateX(-20.75px)", ", 10, 0, ''");
			assert.equal(
				marquee._calculateTranslateFunctions.slide(marquee, 1, 10, 0, "translateX(-20.75px)"),
				null, "1, 10, 0, translateX(-20.75px)");
		});

		test("_calculateTranslateFunctions.alternate", 5, function (assert) {
			var marquee = new Marquee();

			marquee._stateDOM = {
				offsetWidth: 10,
				children: [{
					offsetWidth: 30
				}]
			};
			assert.equal(
				marquee._calculateTranslateFunctions.alternate(marquee, 0, 10, 0, ""),
				"translateX(0px)", "0, 10, 0, ''");
			assert.equal(
				marquee._calculateTranslateFunctions.alternate(marquee, 0.5, 10, 0, ""),
				"translateX(-6.67px)", "0.5, 10, 0, ''");
			assert.equal(
				marquee._calculateTranslateFunctions.alternate(marquee, 0.9, 20, 0, ""),
				"translateX(-16px)", "0.8, 20, 0, ''");
			assert.equal(
				marquee._calculateTranslateFunctions.alternate(marquee, 1, 10, 0, ""),
				"translateX(-13.33px)", ", 10, 0, ''");
			assert.equal(
				marquee._calculateTranslateFunctions.alternate(marquee, 1, 10, 0, "translateX(-13.33px)"),
				null, "1, 10, 0, translateX(-10px)");
		});

		test("_calculateTranslateFunctions.endToEnd", 4, function (assert) {
			var marquee = new Marquee();

			marquee._stateDOM = {
				offsetWidth: 100,
				children: [{
					offsetWidth: 300
				}]
			};
			assert.equal(
				marquee._calculateTranslateFunctions.endToEnd(marquee, 0, 100, 0, ""),
				"translateX(0px)", "0, 100, 0, ''");
			assert.equal(
				marquee._calculateTranslateFunctions.endToEnd(marquee, 0.5, 100, 0, ""),
				"translateX(-50px)", "0.5, 100, 0, ''");
			assert.equal(
				marquee._calculateTranslateFunctions.endToEnd(marquee, 1, 100, 0, ""),
				"translateX(-100px)", "1, 100, 0, ''");
			assert.equal(
				marquee._calculateTranslateFunctions.endToEnd(marquee, 1, 150, 0, "translateX(-150px)"),
				null, "1, 150, 0, translateX(-150px)");
		});

		test("_calculateEndToEndGradient", 3, function (assert) {
			var marquee = new Marquee();

			marquee._stateDOM = {
				offsetWidth: 100,
				children: [{
					offsetWidth: 300
				}]
			};
			assert.equal(
				marquee._calculateEndToEndGradient(0),
				"-webkit-linear-gradient(left, transparent 0, rgb(255, 255, 255) 15%," +
				" rgb(255, 255, 255) 100%)",
				"state: 0 - begining of animation");
			assert.equal(
				marquee._calculateEndToEndGradient(0.4),
				"-webkit-linear-gradient(left, transparent 0, rgb(255, 255, 255) 15%," +
				" rgb(255, 255, 255) 85%, transparent 100%",
				"state: 0.4 during of animation");
			assert.equal(
				marquee._calculateEndToEndGradient(1),
				"-webkit-linear-gradient(left, rgb(255, 255, 255) 0, rgb(255, 255, 255) 85%," +
				" transparent 100%)",
				"state: 1 - end of animation");
		});

		test("_calculateStandardGradient", 3, function (assert) {
			var marquee = new Marquee();

			marquee._stateDOM = {
				offsetWidth: 10,
				children: [{
					offsetWidth: 30
				}]
			};
			assert.equal(
				marquee._calculateStandardGradient(0, 10, 0, ""),
				"-webkit-linear-gradient(left, rgb(255, 255, 255) 0, rgb(255, 255, 255) 85%," +
				" transparent 100%)",
				"0, 10, 0, ''");
			assert.equal(
				marquee._calculateStandardGradient(0.5, 10, 0, ""),
				"-webkit-linear-gradient(left, transparent 0, rgb(255, 255, 255) 15%," +
				" rgb(255, 255, 255) 85%, transparent 100%",
				"0.5, 10, 0, ''");
			assert.equal(
				marquee._calculateStandardGradient(1, 10, 0, ""),
				"-webkit-linear-gradient(left, transparent 0, rgb(255, 255, 255) 15%," +
				" rgb(255, 255, 255) 100%)",
				"1, 10, 0, ''");
		});


		test("_setIteration", 18, function (assert) {
			var marquee = new Marquee(),
				marqueeElement = document.getElementById("marquee"),
				animationObject = {
				},
				configObject = {};

			marquee._animation = {
				set: function (_animationObject, _configObject) {
					assert.equal(_animationObject, animationObject, "");
					assert.equal(_configObject, configObject, "");
				},
				start: function () {
					assert.ok(true, "animation start was called");
				},
				reset: function () {
					assert.ok(true, "animation reset was called");
				}
			};
			marquee.trigger = function (eventName) {
				assert.equal(eventName, "marqueeend", "");
			};
			marquee.state = {
				animation: animationObject,
				animationConfig: configObject
			};
			marquee.element = marqueeElement;

			// tests
			assert.equal(
				marquee._setIteration(null, "infinite"),
				false,
				"null, 'infinite'");
			assert.equal(configObject.loop, true, "loop is set to true");
			configObject.callback();
			assert.equal(
				marquee._setIteration(null, "2"),
				false,
				"null, '2'");
			assert.equal(typeof configObject.callback, "function", "callback is set");
			configObject.callback();
			configObject.callback();
			assert.equal(
				marquee._setIteration(null, 3),
				false,
				"null, 3");
			assert.equal(typeof configObject.callback, "function", "callback is set");
			configObject.callback();
		});

		test("_setMarqueeStyle", 10, function (assert) {
			var marquee = new Marquee(),
				animationObject = [{}, {}];

			marquee.state = {
				animation: animationObject
			};
			marquee._calculateTranslateFunctions = {
				a: function (self) {
					assert.equal(self, marquee, "first arg is widget");
				},
				endToEnd: function (self) {
					assert.equal(self, marquee, "first arg is widget");
				}
			};
			marquee._calculateEndToEndGradient = function () {
				assert.equal(this, marquee, "this is widget");
			};
			marquee._calculateStandardGradient = function () {
				assert.equal(this, marquee, "this is widget");
			};

			assert.equal(
				marquee._setMarqueeStyle(null, "endToEnd"),
				false,
				"null, 'endToEnd'");
			assert.equal(typeof animationObject[0].calculate, "function", "callback is set");
			assert.equal(typeof animationObject[1].calculate, "function", "callback is set");
			animationObject[0].calculate();
			animationObject[1].calculate();
			assert.equal(
				marquee._setMarqueeStyle(null, "a"),
				false,
				"null, 'a'");
			assert.equal(typeof animationObject[0].calculate, "function", "callback is set");
			assert.equal(typeof animationObject[1].calculate, "function", "callback is set");
			animationObject[0].calculate();
			animationObject[1].calculate();
		});

		test("reset", 2, function (assert) {
			var marquee = new Marquee();

			marquee._stateDOM = {
				style: {
					webkitMaskImage: ""
				},
				children: [
					{
						style: {
							webkitTransform: ""
						}
					}
				]
			};

			marquee.element = {
				style: {
					webkitMaskImage: ""
				},

				children: [
					{
						style: {
							webkitTransform: ""
						}
					}
				],

				setAttribute: function () {}
			};

			marquee._animation = {
				reset: function () {
					assert.ok(true, "stop was called");
				}
			};

			marquee.reset();

			assert.equal(
				marquee.element.style.webkitMaskImage,
				"-webkit-linear-gradient(left, rgb(255, 255, 255) 0, rgb(255, 255, 255) 85%, transparent 100%)",
				"marquee.element.style.webkitMaskImage is correctly set");
		});
	}

	if (typeof define === "function") {
		define([
			"../../../../../../src/js/core/engine"
		], function (engine) {
			return runTests.bind(null, engine);
		});
	} else {
		runTests(tau.engine,
			tau.widget.core.Marquee,
			window.helpers);
	}
}());

