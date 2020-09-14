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


		QUnit.test("_configure", function (assert) {
			var sectionChanger = new SectionChanger();

			sectionChanger._configure();

			expect(11);

			assert.equal(sectionChanger.options.items, "section", "items is 'section'");
			assert.equal(sectionChanger.options.activeClass, "ui-section-active", "activeClass is 'ui-section-active'");
			assert.equal(sectionChanger.options.circular, false, "circular is false");
			assert.equal(sectionChanger.options.animate, true, "animate is true");
			assert.equal(sectionChanger.options.animateDuration, 100, "itanimateDurationms is 100");
			assert.equal(sectionChanger.options.orientation, "horizontal", "orientation is 'horizontal'");
			assert.equal(sectionChanger.options.changeThreshold, -1, "changeThreshold is -1");
			assert.equal(sectionChanger.options.useTab, false, "useTab is 'false'");
			assert.equal(sectionChanger.options.fillContent, true, "fillContent is 'true'");
			assert.equal(sectionChanger.options.model, null, "model is null");
			assert.equal(sectionChanger.options.directives, null, "directives is null");
		});

		QUnit.test("_build", function (assert) {
			var element = document.getElementById("emptysectionchanger"),
				sectionChanger = new SectionChanger();

			sectionChanger.options.orientation = "horizontal";
			sectionChanger._build(element);

			expect(3);

			assert.equal(sectionChanger.activeIndex, 0, "activeIndex is '0'");
			assert.equal(sectionChanger.beforeIndex, 0, "beforeIndex is 0");
			assert.equal(sectionChanger.orientation, "horizontal", "orientation is horizontal");
		});

		QUnit.test("setActiveSection & getActiveSectionIndex", function (assert) {
			var element = document.getElementById("emptysectionchanger"),
				sectionChanger = new SectionChanger();

			sectionChanger.element = element;
			sectionChanger._build(element);
			sectionChanger._init(element);

			expect(3);

			assert.equal(sectionChanger.activeIndex, 0, "activeIndex is 0");

			sectionChanger.setActiveSection(1, 0, false, true);

			assert.equal(sectionChanger.getActiveSectionIndex(), 1, "activeIndex is 1");
			assert.equal(sectionChanger.activeIndex, 1, "activeIndex is 1");
		});

		QUnit.test("_calculateIndex", function (assert) {
			var element = document.getElementById("sectionchanger"),
				scroller = element.querySelector(".scroller"),
				sectionChanger = new SectionChanger();

			sectionChanger.scroller = scroller;
			sectionChanger.element = element;
			sectionChanger._build(element);
			sectionChanger._init(element);

			expect(2);

			sectionChanger.options.circular = true;
			assert.equal(sectionChanger._calculateIndex(3), 0, "calculated index is 0");

			sectionChanger.options.circular = false;
			assert.equal(sectionChanger._calculateIndex(3), 2, "calculated index is 2");
		});

		QUnit.test("handleEvent", function (assert) {
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
