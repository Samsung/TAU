/* global test, define, tau */
(function () {
	"use strict";
	function runTests(Drawer, helpers) {

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/Drawer/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/widget/core/Drawer", {
			setup: initHTML
		});

		test("constructor", 2, function (assert) {
			var widget = new Drawer();

			assert.ok(!!widget, "instance of widget exists");
			assert.ok(!!widget._ui, "cache for UI components exists");
		});

		test("Test of _build drawer", 5, function (assert) {
			var widget = new Drawer(),
				element = document.getElementById("drawer-1"),
				result;

			widget.options.overlay = true;

			result = widget._build(element);

			assert.equal(result, element, "method returns widget based element");
			assert.ok(element.classList.contains("ui-drawer"), "widget class has been added to element");
			assert.equal(element.style.top, "0px", "widget element has been set to top = 0px");
			assert.ok(!!widget._ui.drawerOverlay, "overlay appended to widget");
			assert.equal(widget._ui.drawerOverlay.style.visibility, "hidden", "overlay appended to widget");
		});

		test("Test of _init drawer", 4, function (assert) {
			var widget = new Drawer(),
				element = document.getElementById("drawer-1"),
				result;

			helpers.stub(widget, "_initLayout", function () {
				assert.ok(true, "_initLayout has been called");
			});

			result = widget._init(element);

			assert.equal(result, element, "method returns widget based element");
			assert.equal(widget._ui.drawerPage, document.getElementById("page-1"), "page has been cached in widget");
			assert.equal(widget._ui.drawerPage.style.overflowX, "hidden", "overflowX is hidden for page");
		});

		test("Test of handleEvent drawer", 34, function (assert) {
			var widget = new Drawer(),
				testEvent = {
					type: ""
				};

			helpers.stub(widget, "_onDrag", function (event) {
				assert.ok(true, "_onDrag has been called");
				assert.equal(event, testEvent, "_onDrag: event has been provided");
			});

			helpers.stub(widget, "_onDragStart", function (event) {
				assert.ok(true, "_onDragStart has been called");
				assert.equal(event, testEvent, "_onDragStart: event has been provided");
			});

			helpers.stub(widget, "_onDragEnd", function (event) {
				assert.ok(true, "_onDragEnd has been called");
				assert.equal(event, testEvent, "_onDragEnd: event has been provided");
			});

			helpers.stub(widget, "_onDragCancel", function (event) {
				assert.ok(true, "_onDragCancel has been called");
				assert.equal(event, testEvent, "_onDragCancel: event has been provided");
			});

			helpers.stub(widget, "_onMouseup", function (event) {
				assert.ok(true, "_onMouseup has been called");
				assert.equal(event, testEvent, "_onMouseup: event has been provided");
			});

			helpers.stub(widget, "_onSwipe", function (event) {
				assert.ok(true, "_onSwipe has been called");
				assert.equal(event, testEvent, "_onSwipe: event has been provided");
			});

			helpers.stub(widget, "_onClick", function (event) {
				assert.ok(true, "_onClick has been called");
				assert.equal(event, testEvent, "_onClick: event has been provided");
			});

			helpers.stub(widget, "_onTransitionEnd", function (event) {
				assert.ok(true, "_onTransitionEnd has been called");
				assert.equal(event, testEvent, "_onTransitionEnd: event has been provided");
			});

			helpers.stub(widget, "_onResize", function (event) {
				assert.ok(true, "_onResize has been called");
				assert.equal(event, testEvent, "_onResize: event has been provided");
			});

			testEvent.type = "drag";
			widget.handleEvent(testEvent);

			testEvent.type = "dragstart";
			widget.handleEvent(testEvent);

			testEvent.type = "dragend";
			widget.handleEvent(testEvent);

			testEvent.type = "dragcancel";
			widget.handleEvent(testEvent);

			testEvent.type = "vmouseup";
			widget.handleEvent(testEvent);

			testEvent.type = "swipe";
			widget.handleEvent(testEvent);

			testEvent.type = "swipeleft";
			widget.handleEvent(testEvent);

			testEvent.type = "swiperight";
			widget.handleEvent(testEvent);

			testEvent.type = "swipeup";
			widget.handleEvent(testEvent);

			testEvent.type = "swipedown";
			widget.handleEvent(testEvent);

			testEvent.type = "vclick";
			widget.handleEvent(testEvent);

			testEvent.type = "transitionend";
			widget.handleEvent(testEvent);

			testEvent.type = "webkitTransitionEnd";
			widget.handleEvent(testEvent);

			testEvent.type = "mozTransitionEnd";
			widget.handleEvent(testEvent);

			testEvent.type = "oTransitionEnd";
			widget.handleEvent(testEvent);

			testEvent.type = "msTransitionEnd";
			widget.handleEvent(testEvent);

			testEvent.type = "resize";
			widget.handleEvent(testEvent);
		});

		test("Test of _onTransitionEnd drawer", 12, function (assert) {
			var widget = new Drawer();

			helpers.stub(widget, "_setActive", function (bool) {
				assert.ok(true, "_setActive has been called");
				assert.ok(bool !== undefined, "argument has been provided");
			});

			helpers.stub(widget, "trigger", function (eventName, details) {
				assert.ok(true, "trigger has been called");
				assert.ok(!!details, "details has been provided");
			});

			helpers.stub(widget, "close", function () {
				assert.ok(true, "close has been called");
			});

			// Case open
			widget._state = "settling";
			widget._settlingType = "opened";

			widget._onTransitionEnd();

			assert.equal(widget._state, "opened", "widget state has been changed to 'opened'");

			// Case close
			widget._state = "settling";
			widget._settlingType = "sliding";
			widget._drawerOverlay = document.createElement("div");

			widget._onTransitionEnd();

			assert.equal(widget._state, "closed", "widget state has been changed to 'closed'");
			assert.equal(widget._drawerOverlay.style.visibility, "hidden", "widget overlay hidden");
		});


		test("Test of open drawer", 21, function (assert) {
			var widget = new Drawer(),
				element = document.getElementById("drawer-1");

			widget._state = "not opened";
			widget._settlingType = "not defined";
			widget.element = element;
			widget._ui = {
				drawerOverlay: document.createElement("div")
			};

			// case left
			widget.options = {
				position: "left"
			};
			helpers.stub(widget, "_translate", function (x, y, duration) {
				assert.ok(true, "_translate has been called");
				assert.equal(x, 0, "x has been provided as 0");
				assert.equal(y, 0, "y has been provided as 0");
				assert.equal(duration, 1000, "duration has been provided as 1000");
			});
			widget.open(1000);

			// common for all cases
			assert.equal(widget._state, "settling", "widget state has been changed to 'settling'");
			assert.equal(widget._settlingType, "opened", "widget _settlingType has been changed to 'opened'");
			assert.equal(widget._ui.drawerOverlay.style.visibility, "visible", "widget overaly visible");
			assert.ok(!element.classList.contains("ui-drawer-close"), "widget doesn't have close class");
			assert.ok(element.classList.contains("ui-drawer-open"), "widget has open class");

			// case up
			widget._state = "not opened";
			widget.options = {
				position: "up"
			};
			helpers.stub(widget, "_translate", function (x, y, duration) {
				assert.ok(true, "_translate has been called");
				assert.equal(x, 0, "x has been provided as 0");
				assert.equal(y, 0, "y has been provided as 0");
				assert.equal(duration, 500, "duration has been provided as 500");
			});
			widget.open(500);

			// case right
			widget._state = "not opened";
			widget.options = {
				position: "right",
				width: 0
			};
			helpers.stub(widget, "_translate", function (x, y, duration) {
				assert.ok(true, "_translate has been called");
				assert.equal(x, window.innerWidth, "x has been provided as window.innerWidth (x = innerWidth - options.width)");
				assert.equal(y, 0, "y has been provided as 0");
				assert.equal(duration, 700, "duration has been provided as 700");
			});
			widget.open(700);

			// case down
			widget._state = "not opened";
			widget.options = {
				position: "down",
				height: 0
			};
			helpers.stub(widget, "_translate", function (x, y, duration) {
				assert.ok(true, "_translate has been called");
				assert.equal(x, 0, "x has been provided as 0");
				assert.equal(y, window.innerHeight, "y has been provided as window.innerHeight (y = innerHeight - options.height)");
				assert.equal(duration, 600, "duration has been provided as 600");
			});
			widget.open(600);
		});

		test("Test of close drawer", 20, function (assert) {
			var widget = new Drawer(),
				element = document.getElementById("drawer-1"),
				options = {};

			widget._state = "not closed";
			widget._settlingType = "not defined";
			widget.element = element;
			options.reverse = false;

			// case left
			widget.options = {
				position: "left",
				width: 100
			};
			helpers.stub(widget, "_translate", function (x, y, duration) {
				assert.ok(true, "_translate has been called");
				assert.equal(x, -100, "x has been provided as -100");
				assert.equal(y, 0, "y has been provided as 0");
				assert.equal(duration, 1000, "duration has been provided as 1000");
			});
			widget.close(options, 1000);

			// common for all cases
			assert.equal(widget._state, "settling", "widget state has been changed to 'settling'");
			assert.equal(widget._settlingType, "closed", "widget _settlingType has been changed to 'closed'");
			assert.ok(element.classList.contains("ui-drawer-close"), "widget havs close class");
			assert.ok(!element.classList.contains("ui-drawer-open"), "widget doesn't have open class");

			// case up
			widget.options = {
				position: "up",
				height: 200
			};
			helpers.stub(widget, "_translate", function (x, y, duration) {
				assert.ok(true, "_translate has been called");
				assert.equal(x, 0, "x has been provided as 0");
				assert.equal(y, -200, "y has been provided as -200");
				assert.equal(duration, 500, "duration has been provided as 500");
			});
			widget.close(options, 500);

			// case right
			widget.options = {
				position: "right",
				width: window.innerWidth
			};
			helpers.stub(widget, "_translate", function (x, y, duration) {
				assert.ok(true, "_translate has been called");
				assert.equal(x, window.innerWidth, "x has been provided as window.innerWidth");
				assert.equal(y, 0, "y has been provided as 0");
				assert.equal(duration, 600, "duration has been provided as 600");
			});
			widget.close(options, 600);

			// case down
			widget.options = {
				position: "down",
				height: window.innerHeight
			};
			helpers.stub(widget, "_translate", function (x, y, duration) {
				assert.ok(true, "_translate has been called");
				assert.equal(x, 0, "x has been provided as 0");
				assert.equal(y, window.innerHeight, "y has been provided as window.innerHeight");
				assert.equal(duration, 700, "duration has been provided as 700");
			});
			widget.close(options, 700);
		});

		test("Test of _onMouseup drawer", 1, function (assert) {
			var widget = new Drawer();

			helpers.stub(widget, "close", function () {
				assert.ok(true, "close has been called");
			});
			widget._state = "sliding";

			widget._onMouseup();
		});

		test("Test of _onClick drawer", 1, function (assert) {
			var widget = new Drawer();

			helpers.stub(widget, "close", function () {
				assert.ok(true, "close has been called");
			});
			widget._state = "opened";

			widget._onClick();
		});

		test("Test of _onResize drawer", 1, function (assert) {
			var widget = new Drawer();

			helpers.stub(widget, "_refresh", function () {
				assert.ok(true, "_refresh has been called");
			});

			widget._onResize();
		});

		test("Test of _onSwipe drawer", 16, function (assert) {
			var widget = new Drawer(),
				event = {};

			helpers.stub(widget, "open", function () {
				assert.ok(true, "open has been called");
			});

			// direction provided in event detail
			// case right
			event.detail = {
				direction: "right"
			};
			widget.options = {
				enable: true,
				position: "left"
			};
			widget._isDrag = true;
			widget._onSwipe(event);
			assert.ok(!widget._isDrag, "widget swipe from right");

			// case left
			event.detail = {
				direction: "left"
			};
			widget.options = {
				enable: true,
				position: "right"
			};
			widget._isDrag = true;
			widget._onSwipe(event);
			assert.ok(!widget._isDrag, "widget swipe from left");

			// case up
			event.detail = {
				direction: "up"
			};
			widget.options = {
				enable: true,
				position: "down"
			};
			widget._isDrag = true;
			widget._onSwipe(event);
			assert.ok(!widget._isDrag, "widget swipe from up");

			// case down
			event.detail = {
				direction: "down"
			};
			widget.options = {
				enable: true,
				position: "up"
			};
			widget._isDrag = true;
			widget._onSwipe(event);
			assert.ok(!widget._isDrag, "widget swipe from down");

			// reset event object
			event = {};

			// direction provided by event type
			// case right
			event.type = "swiperight"
			widget.options = {
				enable: true,
				position: "left"
			};
			widget._isDrag = true;
			widget._onSwipe(event);
			assert.ok(!widget._isDrag, "widget swipe from right");

			// case left
			event.type = "swipeleft";
			widget.options = {
				enable: true,
				position: "right"
			};
			widget._isDrag = true;
			widget._onSwipe(event);
			assert.ok(!widget._isDrag, "widget swipe from left");

			// case up
			event.type = "swipeup";
			widget.options = {
				enable: true,
				position: "down"
			};
			widget._isDrag = true;
			widget._onSwipe(event);
			assert.ok(!widget._isDrag, "widget swipe from up");

			// case down
			event.type = "swipedown";
			widget.options = {
				enable: true,
				position: "up"
			};
			widget._isDrag = true;
			widget._onSwipe(event);
			assert.ok(!widget._isDrag, "widget swipe from down");
		});

		test("Test of _translate drawer", 8, function (assert) {
			var widget = new Drawer(),
				element = element = document.getElementById("drawer-1");

			widget.element = element;
			widget._state = "not settling";
			widget.options = {
				overlay: true
			}

			helpers.stub(widget, "_setOverlay", function (x, y) {
				assert.ok(true, "_setOverlay has been called");
				assert.equal(x, 10, "x provided as 10");
				assert.equal(y, 20, "y provided as 20");
			});
			helpers.stub(widget, "_onTransitionEnd", function () {
				assert.ok(true, "_onTransitionEnd has been called");
			});

			// case 1
			widget._translate(10, 20, 1000);

			assert.equal(widget._state, "sliding", "widget _state set to 'sliding'");

			// case 2 (duration is 0)
			widget._state = "not settling";
			widget._translate(10, 20, 0);
		});

		test("Test of _onDragStart drawer", 1, function (assert) {
			var widget = new Drawer();

			helpers.stub(widget, "close", function () {
				assert.ok(true, "close has been called");
			});

			widget._state = "opened";
			widget.options = {
				enable: false
			}
			widget._onDragStart();
			// close method mustn't be call

			widget._state = "not opened";
			widget.options = {
				enable: false
			}
			widget._onDragStart();
		});

		test("Test of _onDrag drawer", 8, function (assert) {
			var widget = new Drawer(),
				event;

			// case left
			event = {
				detail: {
					deltaX: 10,
					deltaY: 0
				}
			};
			widget._translatedX = 10;
			widget._translatedY = 0;
			widget.options = {
				enable: true,
				width: 50,
				position: "left"
			};
			widget._isDrag = true;
			widget._state = "not settling";
			helpers.stub(widget, "_translate", function (x, y, duration) {
				assert.ok(true, "_translate has been called");
				assert.equal(x, -30, "x has been provided as -30");
				assert.equal(y, 0, "y has been provided");
				assert.equal(duration, 0, "duration has been provided");
			});
			widget._onDrag(event);

			// case up
			event = {
				detail: {
					deltaX: 0,
					deltaY: 20
				}
			};
			widget._translatedX = 0;
			widget._translatedY = 0;
			widget.options = {
				enable: true,
				height: 70,
				position: "up"
			};
			widget._isDrag = true;
			widget._state = "not settling";
			helpers.stub(widget, "_translate", function (x, y, duration) {
				assert.ok(true, "_translate has been called");
				assert.equal(x, 0, "x has been provided as 0");
				assert.equal(y, -50, "y has been provided as -50");
				assert.equal(duration, 0, "duration has been provided");
			});
			widget._onDrag(event);
		});

		test("Test of _onDragEnd drawer", 4, function (assert) {
			var widget = new Drawer(),
				event;

			helpers.stub(widget, "close", function () {
				assert.ok(true, "close has been called");
			});
			helpers.stub(widget, "open", function () {
				assert.ok(true, "open has been called");
			});

			// case open / left
			event = {
				detail: {
					deltaX: 30
				}
			};
			widget._state = "opened";
			widget._isDrag = true;

			widget.options = {
				enable: true,
				position: "left",
				width: 50
			}
			widget._onDragEnd(event);

			// case close / left
			event = {
				detail: {
					deltaX: 10
				}
			};
			widget._state = "opened";
			widget._isDrag = true;

			widget.options = {
				enable: true,
				position: "left",
				width: 50
			}
			widget._onDragEnd(event);

			// case open / up
			event = {
				detail: {
					deltaY: 30
				}
			};
			widget._state = "opened";
			widget._isDrag = true;

			widget.options = {
				enable: true,
				position: "up",
				height: 50
			}
			widget._onDragEnd(event);

			// case close / up
			event = {
				detail: {
					deltaY: 10
				}
			};
			widget._state = "opened";
			widget._isDrag = true;

			widget.options = {
				enable: true,
				position: "up",
				height: 50
			}
			widget._onDragEnd(event);
		});

		test("Test of _onDragCancel drawer", 3, function (assert) {
			var widget = new Drawer();

			helpers.stub(widget, "close", function () {
				assert.ok(true, "close has been called");
			});

			widget._isDrag = true;
			widget.options = {
				enable: false
			}
			widget._onDragCancel();
			// close method mustn't be call
			assert.ok(!widget._isDrag, "widget _isDrag has been changed to false");

			widget._isDrag = true;
			widget.options = {
				enable: true
			}
			widget._onDragCancel();
			assert.ok(!widget._isDrag, "widget _isDrag has been changed to false");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.core.Drawer,
			window.helpers,
			tau);
	}

}());
