/*global document, window, module, test, asyncTest, ok, setTimeout, start, equal, expect, strictEqual, helpers, QUnit,
 suites */
/*
 * Unit Test: SectionChanger
 */
QUnit.config.reorder = false;

(function (ns) {
	"use strict";

	var sectionTest = document.querySelector("#sectiontest"),
		testContent = document.querySelector("#testContent"),
		tapholdThreshold = 200,
		sectionContent = sectionTest.querySelector("#sectionchanger"),
		i = 1,
		j = 1,

		CSS_ACTIVE = "ui-section-active";

	/*
	 * Function triggering touch event
	 */
	function triggerTouchEvent(el, event, clientXY) {
		var ev = document.createEvent("MouseEvent"),
			move = clientXY || {clientX: 0, clientY: 0};

		ev.initMouseEvent(
			event, /* type */
			true, /* bubble */
			true, /* cancelable */
			window, /* view */
			null, /* detail */
			0, 0, 0, 0, /* coordinates */
			false, false, false, false, /* modifier keys */
			0, /* button, left */
			null /* related target */
		);
		ev.touches = [{clientX: move.clientX, clientY: move.clientY}];
		if (event === "touchend") {
			ev.touches = [];
		}
		ev.changedTouches = [{clientX: move.clientX, clientY: move.clientY}];
		el.dispatchEvent(ev);
	}

	/**
	 * Setup callback
	 */
	function setupModule(scope, options, once) {

		if ((once === true && i === 1) || once === undefined) {
			// Fill up sections with content
			sectionContent.innerHTML = testContent.innerHTML;
		}

		// Create SectionChanger widget
		scope.sectionChanger = new ns.widget.SectionChanger(sectionContent, options);

		scope.scroller = document.querySelectorAll(".scroller")[1];
		scope.sections = scope.scroller.children;

		scope.left = ns.util.DOM.getElementOffset(scope.scroller).left;
		scope.top = ns.util.DOM.getElementOffset(scope.scroller).top;
		scope.clientXY = {clientX: scope.left, clientY: scope.top};

		scope.isActive = function isActive(i) {
			return scope.sections[i].classList.contains(CSS_ACTIVE);
		};

		i = i + 1;
	}

	/**
	 * Teardown callback
	 */
	function teardownModule(scope, expected) {
		if (expected === j || expected === undefined) {
			// Clean up
			ns.engine.destroyWidget(sectionContent);
			sectionContent.innerHTML = "";
			i = 1;
			j = 0;
		}
		j = j + 1;
	}

	window.addEventListener("load", function () {

		suites.orientation.forEach(function each(suite) {

			module("core/widget/core/SectionChanger", {
				setup: function setup() {
					setupModule(this, suite.options);
				},
				teardown: function teardown() {
					teardownModule(this);
				}
			});

			suite.moves.forEach(function each(move) {

				asyncTest(move.name, 6, function swipe() {

					var clientMoveXY = {
							clientX: this.left + move.cord.x,
							clientY: this.top + move.cord.y
						},
						sections = move.sections.before,
						i = sections.length;

					sections = move.sections.before;
					while (i--) {
						equal(this.isActive(i), sections[i], "Section " + i + " before visible: " + sections[i]);
					}

					// Simulate swiping
					triggerTouchEvent(this.scroller, "touchstart", this.clientXY);
					triggerTouchEvent(this.scroller, "touchmove", clientMoveXY);
					triggerTouchEvent(this.scroller, "touchmove", clientMoveXY);

					setTimeout(function setTimeout() {

						// End swiping
						triggerTouchEvent(this.scroller, "touchend", clientMoveXY);

						sections = move.sections.after;
						i = sections.length;
						while (i--) {
							equal(this.isActive(i), sections[i], "Section " + i + " after visible: " + sections[i]);
						}

						start();

					}.bind(this), tapholdThreshold);
				});
			});
		});

		module("core/widget/core/SectionChanger", {
			setup: function setup() {
				setupModule(this, suites.circular.options, true);
			},
			teardown: function teardown() {
				teardownModule(this, suites.circular.moves.length);
			}
		});

		suites.circular.moves.forEach(function each(move) {

			asyncTest(move.name, 6, function swipe() {

				var clientMoveXY = {
						clientX: this.left + move.cord.x,
						clientY: this.top + move.cord.y
					},
					sections = move.sections.before;

				i = sections.length;

				while (i--) {
					equal(this.isActive(i), sections[i], "Section " + i + " before visible: " + sections[i]);
				}

				setTimeout(function setTimeout() {

					// Simulate swiping
					triggerTouchEvent(this.scroller, "touchstart", this.clientXY);
					triggerTouchEvent(this.scroller, "touchmove", clientMoveXY);
					triggerTouchEvent(this.scroller, "touchmove", clientMoveXY);
					// End swiping
					triggerTouchEvent(this.scroller, "touchend", clientMoveXY);

					sections = move.sections.after;
					i = sections.length;
					while (i--) {
						equal(this.isActive(i), sections[i], "Section " + i + " after visible: " + sections[i]);
					}

					start();

				}.bind(this), tapholdThreshold);

			});

		});

		module("core/widget/core/SectionChanger", {
			setup: function setup() {
				setupModule(this, suites.bouncing.options, true);
				this.scrollbars = sectionTest.querySelectorAll(".ui-scrollbar-bouncing-effect");
			},
			teardown: function teardown() {
				teardownModule(this, suites.bouncing.moves.length + 1);
			}
		});

		test("bouncing elements", 1, function test() {
			equal(this.scrollbars.length, 2, "Scrollbar bouncing elements is 2");
		});

		suites.bouncing.moves.forEach(function each(move, step) {

			asyncTest(move.name, function swipe() {
				var clientMoveXY = {
						clientX: this.left + move.cord.x,
						clientY: this.top + move.cord.y
					},
					sections = move.sections.before;

				expect(6);
				if (step === 1) {
					expect(7);
				}


				i = sections.length;

				while (i--) {
					equal(this.isActive(i), sections[i], "Section " + i + " before visible: " + sections[i]);
				}

				setTimeout(function setTimeout() {

					// Simulate swiping
					triggerTouchEvent(this.scroller, "touchstart", this.clientXY);
					triggerTouchEvent(this.scroller, "touchmove", clientMoveXY);
					triggerTouchEvent(this.scroller, "touchmove", clientMoveXY);
					// End swiping
					triggerTouchEvent(this.scroller, "touchend", clientMoveXY);

					sections = move.sections.after;
					i = sections.length;
					while (i--) {
						equal(this.isActive(i), sections[i], "Section " + i + " after visible: " + sections[i]);
					}

					if (step === 1) {
						ok(this.scrollbars[0].classList.contains("ui-show"), "Left scrollbar bouncing is visibile");
					}

					start();

				}.bind(this), tapholdThreshold);

			});

		});

		suites.scrollbar.forEach(function each(suite) {

			module("core/widget/core/SectionChanger", {
				setup: function setup() {
					setupModule(this, suite.options);
				},
				teardown: function teardown() {
					teardownModule(this);
				}
			});

			test("elements", function test() {
				var contains = suite.contains,
					i = suite.contains.length;

				expect(i);

				while (i--) {
					ok(sectionTest.querySelectorAll(contains[i]).length > 0, "Element " + contains[i] + " exists");
				}

			});

		});


		module("core/widget/core/SectionChanger", {
			setup: function setup() {
				setupModule(this, suites.def.options);
			},
			teardown: function teardown() {
				teardownModule(this);
			}
		});

		test("getActiveSectionIndex", 1, function test() {
			var i = this.sections.length,
				activeId = null;

			while (i--) {
				if (this.isActive(i)) {
					activeId = i;
					break;
				}
			}

			equal(this.sectionChanger.getActiveSectionIndex(), activeId, "Active section has correct class");
		});

		test("setActiveSection", 2, function test() {
			var i = this.sections.length,
				newActiveId = 0,
				activeId = null;

			this.sectionChanger.setActiveSection(newActiveId);

			while (i--) {
				if (this.isActive(i)) {
					activeId = i;
					break;
				}
			}

			equal(this.sectionChanger.getActiveSectionIndex(), activeId, "Active section has correct class");
			equal(this.sectionChanger.getActiveSectionIndex(), newActiveId, "Active section index is correct");
		});

		test("set option data-model", function test() {
			var element = document.getElementById("sectionchanger-data-bind"),
				sectionChanger = new ns.widget.SectionChanger(element);

			sectionChanger.option({
				"model": {
					news: [{
						content: "test"
					}]
				},
				"directives": {
					"news": {
						"content": function (data) {
							return this.innerText = data;
						}
					}
				}
			});

			equal(document.getElementById("data-bind-test-element").textContent, "test",
				"SectionChanger has been updated from model");
		});


		// unit test, some cases
		test("_init", 3, function test() {
			var element = document.getElementById("emptysectionchanger"),
				sectionChanger = new ns.widget.SectionChanger(element);

			sectionChanger._init(element);

			equal(element.style.height, "360px", "height is set correct on empty element");

			helpers.stub(ns, "error", function (message) {
				ok(message, "window.setTimeout called");
			});

			sectionChanger.options.circular = true;

			sectionChanger._init(element);

			sectionChanger.options.circular = false;
			sectionChanger.options.animate = false;
			sectionChanger.options.animateDuration = 5;

			sectionChanger._init(element);

			equal(sectionChanger.options.animateDuration, 0, "animateDuration is set correct on empty element");

			helpers.restoreStub(ns, "error");
		});

		// unit test, some case
		test("_translateScrollbar", 6, function test() {
			var element = document.getElementById("emptysectionchanger"),
				sectionChanger = new ns.widget.SectionChanger(element),
				correctOffset = 175;

			sectionChanger.scrollbar = {
				translate: function (offset, duration, autoHidden) {
					equal(offset, correctOffset, "offset is correct set");
					equal(duration, 8, "duration is correct set");
					equal(autoHidden, true, "autoHidden is correct set");
				}
			};

			sectionChanger.minScrollX = 180;
			sectionChanger.minScrollY = 180;

			sectionChanger.orientation = "horizontal";

			sectionChanger._translateScrollbar(5, 7, 8, true);

			correctOffset = 173;

			sectionChanger.orientation = "vertical";

			sectionChanger._translateScrollbar(5, 7, 8, true);
		});

		// unit test, some case
		test("_initTabIndicator", 1, function test() {
			var element = document.getElementById("emptysectionchanger"),
				sectionChanger = new ns.widget.SectionChanger(element);

			sectionChanger._initTabIndicator();

			helpers.stub(sectionChanger.tabIndicator, "setActive", function (index) {
				equal(index, 1, "setActive is called with 1");
			});

			sectionChanger.trigger("sectionchange", {
				active: 1
			});

			helpers.restoreStub(sectionChanger.tabIndicator, "setActive");
		});

		// unit test, some case
		test("_move", 1, function test() {
			var element = document.getElementById("emptysectionchanger"),
				sectionChanger = new ns.widget.SectionChanger(element);

			sectionChanger.scrolled = true;
			sectionChanger.beforeIndex = 2;
			sectionChanger.activeIndex = 1;

			sectionChanger._move({
				detail: {
					deltaX: 20
				}
			});

			equal(sectionChanger.activeIndex, 2, "Active index was changed to beforeIndex");
		});


		// unit test, some case
		test("_end", 6, function test() {
			var element = document.getElementById("emptysectionchanger"),
				sectionChanger = new ns.widget.SectionChanger(element);

			sectionChanger.enabled = true;
			sectionChanger.scrollCanceled = false;
			sectionChanger.dragging = true;
			sectionChanger.activeIndex = 2;
			sectionChanger.options.animateDuration = 1000;

			helpers.stub(sectionChanger, "scrollbar", {
				end: function () {
					ok(true, "scrollbar.end was called");
				}
			});

			helpers.stub(sectionChanger, "bouncingEffect", {
				dragEnd: function () {
					ok(true, "bouncingEffect.dragEnd was called");
				}
			});

			helpers.stub(sectionChanger, "setActiveSection", function (index, duration, direct) {
				equal(index, 2, "index is correct");
				equal(duration, 1000, "duration is correct");
				equal(direct, false, "direct is correct");
			});

			sectionChanger._end();

			equal(sectionChanger.dragging, false, "dragging is set to false");

			helpers.restoreStub(sectionChanger, "scrollbar");
			helpers.restoreStub(sectionChanger, "bouncingEffect");
			helpers.restoreStub(sectionChanger, "setActiveSection");
		});

		// unit test
		test("_repositionSections", function test() {
			var sectionChanger = new ns.widget.SectionChanger(sectionContent),
				i,
				section,
				tops = [0, 360, 720];

			sectionChanger.orientation = "vertical";
			sectionChanger.options.circular = true;

			sectionChanger._repositionSections(true);

			for (i = 0; i < sectionChanger.sections.length; i++) {
				section = sectionChanger.sections[i];
				equal(section.style.left, "0px", "Left is correct set for section " + i);
				equal(section.style.top, tops[i] + "px", "Top is correct set for section " + i);
			}
		});


	}, false);

}(window.tau));
