/*global document, CustomEvent, asyncTest, ok, start, QUnit, equal, ns, test, define, tau*/
(function () {
	"use strict";
	function runTests(anchorHighlight, helpers) {
		QUnit.config.testTimeout = 10000;
		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/util/anchorHighlight/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/util/anchorHighlight", {
			setup: initHTML
		});


		function fireEvent(el, type, props, touches) {
			var evt = new CustomEvent(type, {
					"bubbles": true,
					"cancelable": true
				}),
				prop;

			for (prop in props) {
				if (props.hasOwnProperty(prop)) {
					evt[prop] = props[prop];
				}
			}
			if (touches) {
				evt.touches = touches;
			}
			try {
				return el.dispatchEvent(evt);
			} catch (err) {
				ns.log(err);
			}
			return false;
		}

		function hasClassName(node, classname) {
			return node.classList.contains(classname);
		}

		function checkClassTimerAnchor() {
			var element = document.getElementById("anchor-inner"),
				testClass = hasClassName(element.parentNode.parentNode, "ui-li-active");

			document.removeEventListener("anchorhighlightactiveli", checkClassTimerAnchor, true);
			ok(testClass, "add class and find anchor element");
			start();
		}

		function checkClassAnchor() {
			document.addEventListener("anchorhighlightactiveli", checkClassTimerAnchor, true);

			document.removeEventListener("touchstart", checkClassAnchor, false);
			ok(true, "event fired");
		}

		asyncTest("class added, element inside anchor", function () {
			var element = document.getElementById("anchor-inner");

			document.addEventListener("touchstart", checkClassAnchor, false);
			fireEvent(element, "touchstart", {
				"clientX": 50,
				"clientY": 50
			}, [{pageX: 0, pageY: 0, clientX: 0, clientY: 0}]);
		});

		function checkClassTimer(target) {
			var testClass = hasClassName(target.parentNode, "ui-li-active");

			ok(testClass, "class added");
			start();
		}

		function checkClass(event) {
			var target = event.target;

			document.removeEventListener("touchstart", checkClass, false);
			ok(true, "event fired");
			setTimeout(checkClassTimer.bind(null, target), 100);
		}

		asyncTest("class added, standard anchor", function () {
			var element = document.getElementById("link1");

			document.addEventListener("touchstart", checkClass, false);
			fireEvent(element, "touchstart", {
				"clientX": 50,
				"clientY": 50
			}, [{pageX: 0, pageY: 0, clientX: 0, clientY: 0}]);
		});


		function checkRemoveClassTimer() {
			start();
		}

		function checkRemoveClass(event) {
			var target = event.target;

			document.removeEventListener("touchstart", checkRemoveClass, false);
			ok(true, "event fired");
			setTimeout(checkRemoveClassTimer.bind(null, target), 100);
		}

		asyncTest("touch move class removed", function () {
			var element = document.getElementById("link1");

			document.addEventListener("touchstart", checkRemoveClass, false);
			fireEvent(element, "touchstart", {
				"clientX": 50,
				"clientY": 50
			}, [{pageX: 0, pageY: 0, clientX: 0, clientY: 0}]);

			setTimeout(function () {
				fireEvent(element, "touchmove", {
					"clientX": 150,
					"clientY": 150
				}, [{pageX: 100, pageY: 100, clientX: 100, clientY: 100}]);
			}, 100);
			equal(hasClassName(element.parentNode, "ui-li-active"), false, "class removed");
		});


		function checkRemoveClassEndTimer() {
			start();
		}

		function checkRemoveClassEnd(event) {
			var target = event.target;

			document.removeEventListener("touchstart", checkRemoveClassEnd, false);
			ok(true, "event fired");
			setTimeout(checkRemoveClassEndTimer.bind(null, target), 100);
		}

		function invokeCheck() {
			ok(true, "method should be invoked");
		}

		function stubEventListenersThatShouldBeCalled(eventListenersToStub) {
			var i,
				message;

			function stubOkFunction(event) {
				message = "Event " + event.type + " should be triggered and handled by this event listener stub";
				ok(true, message);
			}

			for (i = 0; i < eventListenersToStub.length; i++) {
				helpers.stub(anchorHighlight, eventListenersToStub[i], stubOkFunction);
			}
		}

		function unstubEventListeners(eventsToUnstub) {
			var i;

			for (i = 0; i < eventsToUnstub.length; i++) {
				helpers.restoreStub(anchorHighlight, eventsToUnstub[i]);
			}
		}

		function triggerEvents(eventsToTrigger) {
			var i;

			for (i = 0; i < eventsToTrigger.length; i++) {
				helpers.triggerEvent(document, eventsToTrigger[i]);
			}
		}

		asyncTest("touch end class removed", function () {
			var element = document.getElementById("link1");

			document.addEventListener("touchstart", checkRemoveClassEnd, false);
			fireEvent(element, "touchstart", {
				"clientX": 50,
				"clientY": 50
			}, [{pageX: 0, pageY: 0, clientX: 0, clientY: 0}]);

			setTimeout(function () {
				fireEvent(element, "touchend", {
					"clientX": 150,
					"clientY": 150
				}, [{pageX: 100, pageY: 100, clientX: 100, clientY: 100}]);
			}, 100);
			equal(hasClassName(element.parentNode, "ui-li-active"), false, "class removed");
		});

		test("_detectHighlightTarget method", function () {
			var target1 = document.getElementById("anchor-inner"),
				target2 = document.getElementById("span-id");

			equal(anchorHighlight._detectHighlightTarget(target1), document.getElementById("link2"),
				"function should return nearest highlightable element to #link2");

			equal(anchorHighlight._detectHighlightTarget(target2), document.getElementById("label-id"),
				"function should return nearest highlightable element to #label-id");

			equal(anchorHighlight._detectHighlightTarget(document.getElementById("button2")), null,
				"function should return nearest highlightable element to #button2");
		});

		test("_clearBtnActiveClass method", function () {
			var buttonActive = document.getElementById("button3"),
				buttonInActive = document.getElementById("button4"),
				buttonEmpty = document.getElementById("button5");

			anchorHighlight._activeAnimationFinished = false;
			anchorHighlight._touchEnd = true;
			anchorHighlight._buttonTarget = null;
			anchorHighlight._clearBtnActiveClass({
				target: buttonActive
			});

			equal(anchorHighlight._activeAnimationFinished, true, "anchorHighlight._activeAnimationFinished is changed to true(1)");
			ok(buttonActive.classList.contains("ui-btn-inactive"), "class inactive-btn is set for target when buttonTarget is null");
			ok(buttonActive.classList.contains("ui-btn-active"), "class active-btn is set for target when buttonTarget is null");

			anchorHighlight._activeAnimationFinished = false;
			anchorHighlight._touchEnd = false;
			anchorHighlight._buttonTarget = buttonActive;
			buttonActive.className = "ui-btn-active";
			anchorHighlight._clearBtnActiveClass({
				target: buttonActive
			});

			equal(anchorHighlight._activeAnimationFinished, true, "anchorHighlight._activeAnimationFinished is changed to true(2)");
			ok(!buttonActive.classList.contains("ui-btn-inactive"), "class inactive-btn is not set when target and and buttonTarget equals buttonActive");
			ok(buttonActive.classList.contains("ui-btn-active"), "class inactive-btn is set when target and and buttonTarget equals buttonActive");

			anchorHighlight._clearBtnActiveClass({
				target: buttonEmpty
			});

			equal(anchorHighlight._activeAnimationFinished, true, "anchorHighlight._activeAnimationFinished is changed to true(3)");
			ok(!buttonEmpty.classList.contains("ui-btn-inactive"), "class inactive-btn is not set when target equals buttonEmpty");
			ok(!buttonEmpty.classList.contains("ui-btn-active"), "class active-btn is not set when target equals buttonEmpty");

			anchorHighlight._clearBtnActiveClass({
				target: buttonInActive
			});

			equal(anchorHighlight._activeAnimationFinished, true, "anchorHighlight._activeAnimationFinished is changed to true");
			ok(!buttonInActive.classList.contains("ui-btn-inactive"), "class inactive-btn is not set when target equals buttonInActive");
			ok(!buttonInActive.classList.contains("ui-btn-active"), "class inactive-btn is not set when target equals buttonInActive");
		});

		test("removeActiveClassLoop method", function () {
			anchorHighlight._startRemoveTime = Date.now() - 20;
			anchorHighlight.options.keepActiveClassDelay = 2000;

			helpers.stub(anchorHighlight, "_requestAnimationFrame", function () {
				ok(1, "method should be invoked");
			});
			anchorHighlight._removeActiveClassLoop();
			helpers.restoreStub(anchorHighlight, "_requestAnimationFrame");

			document.getElementById("li-id3").classList.add("ui-li-active");
			anchorHighlight.options.keepActiveClassDelay = 10;
			anchorHighlight._removeActiveClassLoop();
			ok(!document.getElementById("li-id3").classList.contains("ui-li-active"), "method removeActiveClassLoop should remove active class");
		});

		test("_detectBtnElement method", function () {
			var target = document.getElementById("a-id");

			equal(anchorHighlight._detectBtnElement(target), document.getElementById("button2"),
				"function should return button nearest to given parameter");
		});

		test("_clearActiveClass method", function () {
			var liElement1 = document.getElementById("li-id1"),
				liElement2 = document.getElementById("li-id2"),
				liElement3 = document.getElementById("li-id3");

			liElement1.classList.add("ui-li-active");
			liElement2.classList.add("ui-li-active");
			liElement3.classList.add("ui-li-active");

			anchorHighlight._clearActiveClass();
			equal(liElement1.classList.contains("ui-li-active"), false,
				"method should remove active class from list element #li-id1");
			equal(liElement2.classList.contains("ui-li-active"), false,
				"method should remove active class from list element #li-id2");
			equal(liElement3.classList.contains("ui-li-active"), false,
				"method should remove active class from list element #li-id3");
		});

		test("addButtonInactiveClass method", function () {
			anchorHighlight._buttonTarget = null;
			anchorHighlight._addButtonInactiveClass();
			ok(true, "Function should do nothing and not throw an error");

			anchorHighlight._buttonTarget = document.getElementById("button5");
			anchorHighlight._addButtonInactiveClass();
			equal(anchorHighlight._buttonTarget.classList.contains("ui-btn-inactive"), true,
				"button should contain inactive class");
		});

		test("addButtonActiveClass method", function () {
			anchorHighlight._buttonTarget = document.getElementById("button5");
			anchorHighlight._addButtonActiveClass();
			equal(anchorHighlight._buttonTarget.classList.contains("ui-btn-active"), true,
				"button should contain active class");
		});

		test("hideClear method", function () {
			anchorHighlight._buttonTarget = document.getElementById("button4");
			anchorHighlight._target = document.getElementById("li-id2");
			anchorHighlight._hideClear();
			equal(anchorHighlight._buttonTarget.classList.contains("ui-btn-active"), false,
				"button should not contain ui-btn-active class");
			equal(anchorHighlight._buttonTarget.classList.contains("ui-btn-inactive"), false,
				"button should not contain ui-btn-inactive class");
			equal(anchorHighlight._target.classList.contains("ui-li-active"), false,
				"button should not contain ui-li-active class");
		});

		test("addActiveClass method", function () {
			anchorHighlight._target = document.getElementById("a-id");
			anchorHighlight._startTime = 1;
			anchorHighlight._addActiveClass();
			equal(document.getElementById("button2").classList.contains("ui-btn-active"), false,
				"button3 should not contain active class");

			anchorHighlight._target = document.getElementById("foofoo");
			anchorHighlight._addActiveClass();
			equal(anchorHighlight._liTarget, null, "null should be assign to variable");

			helpers.stub(anchorHighlight, "_detectLiElement", function () {
				ok(false, "method _detectLiElement  should not be invoked");
			});
			anchorHighlight._didScroll = true;
			anchorHighlight._startTime = -10000;
			anchorHighlight._addActiveClass();
			helpers.restoreStub(anchorHighlight, "_detectLiElement");
			ok(true, "test passed");

			anchorHighlight._didScroll = false;
			anchorHighlight._target = document.getElementById("link2");
			document.addEventListener("anchorhighlightactiveli", invokeCheck, false);
			anchorHighlight._startTime = 1;
			anchorHighlight._addActiveClass();
			document.removeEventListener("anchorhighlightactiveli", invokeCheck, false);

			anchorHighlight._buttonTarget = document.getElementById("button5");
		});

		test("enable method", 9, function () {
			var eventListeners = ["_clearBtnActiveClass", "_checkPageVisibility", "_hideClear",
					"_touchmoveHandler", "_touchendHandler", "_touchstartHandler"],
				events = ["touchstart", "touchend", "touchmove", "visibilitychange", "pagehide",
					"popuphide", "animationend", "animationEnd", "webkitAnimationEnd"];

			anchorHighlight.disable();
			stubEventListenersThatShouldBeCalled(eventListeners);
			anchorHighlight.enable();
			triggerEvents(events);
			anchorHighlight.disable();
			unstubEventListeners(eventListeners);
			anchorHighlight.enable();
		});

		test("touchendHandler method", 1, function () {
			var element = document.getElementById("li-id1"),
				touches = [];

			anchorHighlight._didScroll = true;
			anchorHighlight._activeAnimationFinished = true;
			helpers.stub(anchorHighlight, "_requestAnimationFrame", function () {
				ok(true, "method requestAnimationFrame should be invoked");
			});
			fireEvent(element, "touchend", {}, touches);
			helpers.restoreStub(anchorHighlight, "_requestAnimationFrame");
		});

		//method can't be fully tested because it is browser-dependent
		test("checkPageVisibility method", 0, function () {
			helpers.stub(anchorHighlight, "_removeActiveClassLoop", function () {
				ok(false, "method requestAnimationFrame should not be invoked");
			});
			helpers.triggerEvent(document, "visibilitychange");
			helpers.restoreStub(anchorHighlight, "_removeActiveClassLoop");
		})
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.util.anchorHighlight,
			window.helpers);
	}
}());

