(function (window, document, ns) {
	var engine = ns.engine,
		objectUtils = ns.util.object,
		Gesture = ns.event.gesture,
		utilsEvents = ns.event,
		Button = ns.widget.core.Button,
		min = Math.min,
		abs = Math.abs,
		SwipeButton = function() {
			var self = this;

			Button.call(self);

			self._cancelled = false;
			self._dragging = false;
			self._animating = false;
		},
		eventType = {
			SWIPED: "swiped"
		},
		classes = {
			swipeButton: "ui-swipe-button",
			container: "ui-container",
			moveLeft: "ui-move-left",
			moveRight: "ui-move-right"
		},
		defaults = {
			direction: "right",
			buttonWidth: 80,
			backgroundWidth: 200,
			swipeThreshold: 100

		},
		selectors = {
			buttonSwipe: "." + classes.swipeButton
		},
		styleIdPrefix = "#swipeButton-",
		ButtonPrototype = Button.prototype,
		prototype = new Button();

	SwipeButton.prototype = prototype;

	function createStyleElement(id) {
		var style;

		if (!document.head.querySelector(styleIdPrefix + id)) {
			style = document.createElement("style");
			style.id = "swipeButton-" + id;
			document.head.appendChild(style);
		}
	}

	function addCSSRules(id, rules) {
		var sheet = document.head.querySelector(styleIdPrefix + id).sheet,
			length = rules.length,
			i = 0;

		for (; i < length; i++) {
			sheet.insertRule(rules[i], 0);
		}
	}

	function removeStyleElement(id) {
		var style = document.head.querySelector(styleIdPrefix + id);

		document.head.removeChild(style);
	}

	prototype._addStylesheet = function (element) {
		var id = element.id,
			options = this.options,
			buttonWidth = parseInt(options.buttonWidth, 10),
			totalWidth = parseInt(options.backgroundWidth, 10),
			descriptionWidth = totalWidth - buttonWidth;

		createStyleElement(id);
		addCSSRules(id, [
			"#" + id + " { width: " + buttonWidth + "px; }",
			"#" + id + "::before { width: " + buttonWidth + "px; }",
			"#" + id + ".active::before { width: " + totalWidth + "px; }",
			"#" + id + ":active::before { width: " + totalWidth + "px; }",
			"#" + id + " ." + classes.container + " { width: " + totalWidth + "px; }",
			"#" + id + " ." + classes.container + " > :nth-child(1) { width: " + buttonWidth + "px; }",
			"#" + id + " ." + classes.container + " > :nth-child(2) { width: " + descriptionWidth + "px; }"
		]);
	};

	prototype._removeStylesheet = function () {
		removeStyleElement(this.element.id);
	};

	prototype._configure = function(element) {
		var self = this;

		if (typeof ButtonPrototype._configure === "function") {
			ButtonPrototype._configure.call(self, element);
		}
		self.options = objectUtils.merge(self.options, defaults);
	};

	prototype._build = function(element) {
		var containerElement = document.createElement("div");

		if (typeof ButtonPrototype._build === "function") {
			ButtonPrototype._build.call(this, element);
		}

		// build container for elements inside button
		containerElement.classList.add(classes.container);
		// button can have only 2 elements
		// - the first element is visible all the time
		// - the second element is hidden at the beginning and it is shown during swiping
		// - the rest elements are not displayed
		containerElement.innerHTML = element.innerHTML;
		element.innerHTML = "";
		element.appendChild(containerElement);

		// set class defined direction of movement
		if (this.options.direction == "left") {
			element.classList.add(classes.moveLeft);
		} else {
			element.classList.add(classes.moveRight);
		}

		// add style for elements
		this._addStylesheet(element);

		return element;
	};

	prototype._bindEvents = function () {
		var self = this,
			element = self.element;

		ns.event.enableGesture(
			element,
			new Gesture.Drag({
				blockVertical: true
			}),
			new Gesture.Swipe({
				orientation: Gesture.Orientation.HORIZONTAL
			})
		);

		utilsEvents.on(element, "drag dragstart dragend dragcancel swipe", self);
	};

	prototype._unbindEvents = function () {
		var self = this,
			element = self.element;

		ns.event.disableGesture(element);

		utilsEvents.off(element, "drag dragstart dragend dragcancel swipe", self);
	};

	prototype.handleEvent = function (event) {
		switch (event.type) {
			case "dragstart":
				this._start(event);
				break;
			case "drag":
				this._move(event);
				break;
			case "dragend":
				this._end(event);
				break;
			case "swipe":
				this._swipe(event);
				break;
			case "dragcancel":
			case "scroll":
				this._cancel();
				break;
		}
	};

	prototype._start = function (e) {
		var self = this;

		self._dragging = true;
		self._cancelled = false;

		self.element.classList.add("active");
	};

	prototype._move = function (e) {
		var self = this,
			options = self.options,
			gesture = e.detail,
			maxWidth = parseInt(options.backgroundWidth),
			translateX = gesture.estimatedDeltaX,
			activeElementStyle = self.element.style,
			activeElementWidth = options.buttonWidth;

		if (!self._dragging || self._cancelled) {
			return;
		}

		if (options.direction == "right") {
			if (translateX > 0) {
				activeElementStyle.width = min(activeElementWidth + translateX, maxWidth) + "px";
			}
		} else {
			// translateX is negative
			if (translateX < 0) {
				activeElementStyle.width = min(activeElementWidth - translateX, maxWidth) + "px";
			}
		}
	};

	prototype._end = function (e) {
		var self = this,
			element = self.element,
			options = self.options,
			gesture = e.detail;

		if (!self._dragging || self._cancelled) {
			return;
		}

		element.classList.remove("active");
		element.style.width = options.buttonWidth + "px";

		self._dragging = false;

		if (abs(gesture.estimatedDeltaX) >= options.swipeThreshold) {
			// fire event
			utilsEvents.trigger(element, eventType.SWIPED, gesture);
		}
	};

	prototype._swipe = function (e) {
		var self = this,
			element = self.element;

		if (!self._dragging || self._cancelled) {
			return;
		}

		element.classList.remove("active");
		element.style.width = "";

		self._dragging = false;

		// fire event
		utilsEvents.trigger(element, eventType.SWIPED, e.detail);
	};

	prototype._cancel = function () {
		var self = this;
		self._dragging = false;
		self._cancelled = true;
	};

	prototype._destroy = function () {
		var self = this,
			element = self.element,
			containerElement = element.querySelector("." + classes.container);

		// remove structure of button
		element.innerHTML = containerElement.innerHTML;
		element.classList.remove(classes.moveLeft);
		element.classList.remove(classes.moveRight);

		// remove styles for elements
		self._removeStylesheet();
		self._unbindEvents();

		if (typeof ButtonPrototype._destroy === "function") {
			ButtonPrototype._destroy.call(self);
		}
	};

	ns.widget.wearable.SwipeButton = SwipeButton;

	engine.defineWidget(
		"SwipeButton",
		selectors.buttonSwipe,
		[],
		SwipeButton,
		"wearable"
	);

}(window, window.document, window.tau));