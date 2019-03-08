/*global QUnit, Promise, expect, define, tau */
/*
 * Unit Test: SectionChanger
 */
(function () {
	"use strict";
	function runTests(SectionChanger, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/SectionChanger/test-data/sample.html"),
					parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML = HTML;
				helpers.loadTAUStyle(document, "wearable", function () {
					resolve();
				});
			});
		}

		QUnit.module("core/widget/core/SectionChanger", {
			setup: initHTML
		});


// unit test, one case
		QUnit.test("handleEvent", function test(assert) {
			var element = document.getElementById("emptysectionchanger"),
				sectionChanger = new SectionChanger(),
				event = {
					type: "swipe",
					target: element
				};

			expect(3);

			sectionChanger.element = element;
			sectionChanger.scroller = element;

			sectionChanger._change = function (_event) {
				assert.strictEqual(_event, event, "_change is called with event");
			};

			sectionChanger.handleEvent(event);

			event.type = "rotarydetent";

			sectionChanger.handleEvent(event);

			event.type = "transitionEnd";

			sectionChanger._endScroll = function (_event) {
				assert.strictEqual(_event, undefined, "_endScroll is called without event");
			};

			sectionChanger.handleEvent(event);

		});

// unit test
		QUnit.test("_change", function test(assert) {
			var newActiveId = 1,
				sectionChanger = new SectionChanger();

			expect(8);

			sectionChanger.enabled = true;
			sectionChanger.scrollCanceled = false;
			sectionChanger.dragging = true;
			sectionChanger.beforeIndex = 0;
			sectionChanger.activeIndex = 0;
			sectionChanger.options.animateDuration = 200;

			sectionChanger.bouncingEffect = {
				dragEnd: function () {
					assert.ok(true, "Called dragEnd");
				},
				destroy: function () {

				}
			};

			sectionChanger._notifyChangedSection = function (index) {
				assert.equal(index, 1, "_notifyChangedSection, index is correct");
			};

			sectionChanger.setActiveSection = function (index, duration, bool) {
				assert.equal(index, 1, "setActiveSection, index is correct");
				assert.equal(duration, 200, "setActiveSection, duration is correct");
				assert.equal(bool, false, "setActiveSection, bool is correct");
			};

			sectionChanger._calculateIndex = function (index) {
				assert.equal(index, 1, "_calculateIndex, index is correct");
				return index;
			};

			sectionChanger._change({
				detail: {
					direction: "up"
				}
			});

			assert.equal(sectionChanger.getActiveSectionIndex(), newActiveId, "Active section index is correct");
			assert.equal(sectionChanger.dragging, false, "dragging is correct");
		});

		QUnit.test("_bindEvents", function (assert) {
			var listWidget = new SectionChanger(),
				element = document.getElementById("emptysectionchanger"),
				scroller = element.parentElement;

			listWidget.element = element;
			listWidget.scroller = scroller;

			helpers.stub(ns.event.gesture, "Swipe", function (options) {
				assert.ok(true);
			});

			helpers.stub(ns.event.gesture, "Drag", function (options) {
				assert.ok(true);
			});

			helpers.stub(ns.event, "enableGesture", function (options) {
				assert.ok(true);
			});

			listWidget._bindEvents();

			expect(7);

			listWidget.handleEvent = function (_event) {
				assert.ok(_event, "Event was catched");
			};

			helpers.triggerEvent(scroller, "swipe");
			helpers.triggerEvent(scroller, "transitionEnd");
			helpers.triggerEvent(document, "rotarydetent");

			listWidget._unbindEvents();

			helpers.restoreStub(ns.event.gesture, "Swipe");
			helpers.restoreStub(ns.event.gesture, "Drag");
			helpers.restoreStub(ns.event, "enableGesture");
		});

		QUnit.test("_unbindEvents", function (assert) {
			var listWidget = new SectionChanger(),
				element = document.getElementById("emptysectionchanger"),
				scroller = element.parentElement;

			listWidget.element = element;
			listWidget.scroller = scroller;

			helpers.stub(ns.event.gesture, "Swipe", function () {
				assert.ok(true);
			});

			helpers.stub(ns.event.gesture, "Drag", function () {
				assert.ok(true);
			});

			helpers.stub(ns.event, "enableGesture", function () {
				assert.ok(true);
			});

			helpers.stub(ns.event, "disableGesture", function () {
				assert.ok(true);
			});

			listWidget._bindEvents();

			expect(6);

			listWidget.handleEvent = function (_event) {
				assert.ok(_event, "Event was catched");
			};

			listWidget._unbindEvents();

			helpers.triggerEvent(scroller, "swipe");
			helpers.triggerEvent(scroller, "transitionEnd");
			helpers.triggerEvent(document, "rotarydetent");

			helpers.restoreStub(ns.event.gesture, "Swipe");
			helpers.restoreStub(ns.event.gesture, "Drag");
			helpers.restoreStub(ns.event, "enableGesture");
			helpers.restoreStub(ns.event, "disableGesture");
		});

	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.core.SectionChanger,
			window.helpers,
			tau);
	}

}()
);
