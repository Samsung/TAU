/*global define, ns */
/*
 * Copyright (c) 2020 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/**
 * #Spin
 *
 * @class ns.widget.core.Spin
 * @since 1.2
 * @extends ns.widget.core.BaseWidget
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
/**
 * Main file of applications, which connect other parts
 */
// then we can load plugins for libraries and application
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../core",
		"../BaseWidget",
		"../../../core/util/animation/animation",
		"../../../core/event/gesture"
	],
	function () {
		//>>excludeEnd("tauBuildExclude");
		var document = window.document,
			BaseWidget = ns.widget.BaseWidget,
			utilsEvents = ns.event,
			gesture = utilsEvents.gesture,

			Animation = ns.util.Animate,

			ENABLING_DURATION = 300, // [ms]
			ROLL_DURATION = 600,
			DELTA_Y = 100,
			DRAG_STEP_TO_VALUE = 60,
			VIBRATION_DURATION = 10,
			lastDragValueChange = 0,

			/**
			 * Alias for class Spin
			 * @method Spin
			 * @member ns.widget.core.Spin
			 * @private
			 * @static
			 */
			Spin = function () {
				/**
				 * Object with default options
				 * @property {Object} options
				 * @property {number} options.min minimum value of spin
				 * @property {number} options.max maximum value of spin
				 * @property {number} options.step step of decrease / increase value
				 * @property {string} [options.moduloValue="enabled"] value will be show as modulo
				 *  // if enabled then value above max will be show as modulo eg. 102
				 *  // with range 0-9 will be show as 2 (12 % 10)
				 * @property {string} [options.shortPath="enabled"] spin rotate with short path
				 *  // eg. when value will be 1 and then will change to 8
				 *  // the spin will rotate by 1 -> 0 -> 9 -> 0
				 * @property {number} [options.duration=ROLL_DURATION] time of rotate to indicated value
				 * @property {string} [options.direction="up"] direction of spin rotation
				 * @property {string} [options.rollHeight="container"] size of frame to rotate one item
				 * @property {number} [options.itemHeight=38] size of frame for "custom" rollHeight
				 * @property {number} [options.momentumLevel=0] define moementum level on drag
				 * @property {number} [options.scaleFactor=0.4] second / next items scale factor
				 * @property {number} [options.moveFactor=0.4] second / next items move factor from center
				 * @property {number} [options.loop="enabled"] when the spin reaches max value then loops to min value
				 * @property {string} [options.labels=""] defines labels for values likes days of week separated by ","
				 * // eg. "Monday,Tuesday,Wednesday"
				 * @property {string} [options.digits=0] value filling with zeros, eg. 002 for digits=3;
				 * // eg. "Monday,Tuesday,Wednesday"
				 * @member ns.widget.core.Spin
				 */
				this.options = {
					min: 0,
					max: 9,
					step: 1,
					moduloValue: "enabled",
					shortPath: "enabled",
					duration: ROLL_DURATION,
					direction: "up",
					rollHeight: "custom", // "container" | "item" | "custom"
					itemHeight: 38,
					momentumLevel: 0, // 0 - one item on swipe
					scaleFactor: 0.4,
					moveFactor: 0.4,
					loop: "enabled",
					labels: [],
					digits: 0, // 0 - doesn't complete by zeros
					value: 0
				};
				this._ui = {};
				this.length = this.options.max - this.options.min + 1;
				this._prevValue = null; // this property has to be "null" on start
			},

			WIDGET_CLASS = "ui-spin",

			classes = {
				SPIN: WIDGET_CLASS,
				ITEM: WIDGET_CLASS + "-item",
				SELECTED: WIDGET_CLASS + "-item-selected",
				NEXT: WIDGET_CLASS + "-item-next",
				PREV: WIDGET_CLASS + "-item-prev",
				ENABLED: "enabled",
				ENABLING: WIDGET_CLASS + "-enabling",
				PLACEHOLDER: WIDGET_CLASS + "-placeholder"
			},

			prototype = new BaseWidget();

		Spin.classes = classes;
		Spin.timing = Animation.timing;

		function transform(value, index, centerY, options) {
			var diff,
				direction,
				diffAbs,
				scale,
				moveY,
				opacity,
				delta = options.max - options.min + options.step,
				numberOfItems = delta / options.step,
				currentIndex = Math.round((value - options.min) / options.step);

			if (options.loop === "enabled") {
				if (value >= options.max - 2 * options.step) {
					if (numberOfItems - currentIndex < 3) {
						if (index < 3) {
							index = index + numberOfItems;
						}
					}
				} else if (value <= options.min + 2 * options.step) {
					if (currentIndex < 3) {
						if (index > numberOfItems - 3) {
							index = index - numberOfItems;
						}
					}
				}
			}

			diff = value - options.min - index * options.step;
			direction = diff < 0 ? 1 : -1;
			diffAbs = Math.abs(diff);
			scale = 1 - options.scaleFactor * diffAbs;
			moveY = 1 - options.moveFactor * diffAbs;
			opacity = 1 - ((options.enabled) ? options.scaleFactor : 1) * diffAbs;

			scale = (scale < 0) ? 0 : scale;
			opacity = (opacity < 0) ? 0 : opacity;
			moveY = direction * (DELTA_Y * (1 - moveY)) + centerY;

			return {
				moveY: moveY,
				scale: scale,
				opacity: opacity
			}
		}

		function showAnimationTick(self) {
			var items = self._ui.items,
				options = self.options,
				itemHeight = self._itemHeight,
				state = self._objectValue,
				centerY = (self._containerRect.height - itemHeight) / 2;

			items.forEach(function (item, index) {
				var change = transform(state.value, index, centerY, options);

				// set item position
				if (change.opacity > 0) {
					item.style.transform = "translateY(" + change.moveY + "px) scale(" + change.scale + ")";
				} else {
					item.style.transform = "translateY(-1000px)"; // move item from active area
				}
				item.style.opacity = change.opacity;
			});
			ns.event.trigger(self.element, "spinstep", parseInt(state.value, 10));
		}

		function getStartValue(self) {
			var prevValue = (self._prevValue === null) ? self.options.value : self._prevValue,
				startValue = prevValue,
				diff = self.options.value - prevValue,
				rest = 0,
				int = 0;

			if (self.options.moduloValue === "enabled") {
				int = diff / self.length | 0;
				if (Math.abs(diff) >= self.length) {
					startValue = prevValue + self.length * int;
				}
				rest = diff % self.length;
				if (self.options.shortPath === "enabled" &&
					Math.abs(rest) > self.length / 2) {
					int += (rest < 0) ? -1 : 1;
					startValue = prevValue + self.length * int;
				}
			}

			return startValue;
		}

		prototype._valueToIndex = function (value) {
			var options = this.options,
				delta = options.max - options.min + 1;

			value = value - options.min;
			while (value < options.min) {
				value += delta;
			}
			while (value > options.max) {
				value -= delta;
			}

			return parseInt(value, 10) % this.length;
		}

		prototype._removeSelectedLayout = function () {
			var self = this;

			if (self._prevValue !== null) {
				self._ui.items[self._valueToIndex(self._prevValue)]
					.classList.remove(classes.SELECTED);
			}
		}

		prototype._addSelectedLayout = function () {
			var self = this,
				index = self._valueToIndex(self.options.value);

			self._ui.items[index].classList.add(classes.SELECTED);
		}

		prototype._show = function (triggerChangeEvent) {
			var self = this,
				animation = new Animation({}),
				state = null,
				objectValue = {
					value: getStartValue(self)
				};

			self._removeSelectedLayout();

			state = {
				animation: [{
					object: objectValue,
					property: "value",
					to: self.options.value
				}],
				animationConfig: {
					// when widget is disabled then duration of animation should be minimal
					duration: (self.options.enabled) ? self.options.duration : 1,
					timing: Spin.timing.ease
				}
			};
			self.state = state;
			self._objectValue = objectValue;
			self._animation = animation;

			animation.set(state.animation, state.animationConfig);
			animation.tick(showAnimationTick.bind(null, self));
			animation.start(function () {
				self._addSelectedLayout();
				if (triggerChangeEvent) {
					ns.event.trigger(self.element, "spinchange", {
						value: parseInt(self.options.value, 10),
						dValue: parseInt(self.options.value, 10) - parseInt(self._prevValue, 10)
					});
				}
			});

		};

		prototype._modifyItems = function () {
			var self = this,
				options = self.options,
				element = self.element,
				itemHeight = 0,
				items = [].slice.call(element.querySelectorAll("." + classes.ITEM)),
				len = options.max - options.min + 1,
				diff = len - items.length,
				centerY,
				item = null,
				i = 0;

			// add or remove item from spin widget
			if (diff > 0) {
				for (; i < diff; i++) {
					item = document.createElement("div");
					item.classList.add(classes.ITEM);
					element.appendChild(item);
					items.push(item);
				}
			} else if (diff < 0) {
				diff = -diff;
				for (; i < diff; i++) {
					element.removeChild(items.pop());
				}
			}

			// set content;
			items.forEach(function (item, index) {
				var textValue = "";

				if (self.options.labels.length) {
					textValue = self.options.labels[index];
				} else {
					textValue += (options.min + index);
					if (options.digits > 0) {
						while (textValue.length < options.digits) {
							textValue = "0" + textValue;
						}
					}
				}
				item.innerHTML = textValue
			});

			// determine item height for scroll
			if (options.rollHeight === "container") {
				itemHeight = self._containerRect.height;
			} else if (options.rollHeight === "custom") {
				itemHeight = options.itemHeight;
			} else { // item height
				item = items[0];
				itemHeight = (item) ?
					item.getBoundingClientRect().height :
					self._containerRect.height;
			}
			self._itemHeight = itemHeight;
			centerY = (self._containerRect.height - itemHeight) / 2,

			// set position;
			items.forEach(function (item, index) {
				var change = transform(self.value, index, centerY, options);

				// set item position
				item.style.transform = "translateY(" + change.moveY + "px) scale(" + change.scale + ")";
				item.style.opacity = change.opacity;
			});

			self._ui.items = items;
		};

		prototype._setItemHeight = function (element, value) {
			value = (typeof value === "string") ? parseInt(value.replace("px").trim(), 10) : value;
			this.options.itemHeight = value;
		};

		prototype._refresh = function () {
			var self = this;

			self._containerRect = self.element.getBoundingClientRect();
			self._modifyItems();
			self._show();
		};

		/**
		 * Widget init method
		 * @protected
		 * @method _init
		 * @member ns.widget.core.Spin
		 */
		prototype._init = function () {
			var self = this,
				options = self.options;

			// convert options
			options.min = (options.min !== undefined) ? parseInt(options.min, 10) : 0;
			options.max = (options.max !== undefined) ? parseInt(options.max, 10) : 0;
			options.value = (options.value !== undefined) ? parseInt(options.value, 10) : 0;
			options.duration = (options.duration !== undefined) ? parseInt(options.duration, 10) : 0;
			options.labels = (Array.isArray(options.labels)) ? options.labels : options.labels.split(",");

			self.length = options.max - options.min + 1;

			self._refresh();
		};

		prototype._build = function (element) {
			var placeholder = document.createElement("div");

			element.classList.add(classes.SPIN);
			placeholder.classList.add(classes.PLACEHOLDER);
			element.appendChild(placeholder);

			this._ui.placeholder = placeholder;
			return element;
		};

		prototype._setValue = function (value, enableChangeEvent) {
			var self = this,
				animation;

			value = window.parseInt(value, 10);
			self._ui.placeholder.textContent = value;

			if (isNaN(value)) {
				ns.warn("Spin: value is not a number");
			} else if (value !== self.options.value) {
				if (value >= self.options.min && value <= self.options.max || self.options.loop === "enabled") {
					self._prevValue = self.options.value;
					if (self.options.loop === "enabled") {
						if (value > self.options.max) {
							value = self.options.min;
						} else if (value < self.options.min) {
							value = self.options.max;
						}
					}
					self.options.value = value;
					// set data-value on element
					self.element.dataset.value = value;

					// stop previous animation
					animation = self.state.animation[0];
					if (animation !== null && animation.to !== animation.current) {
						self._animation.stop();
					}
					// update status of widget
					self._show(enableChangeEvent);
				}
			}
		};

		prototype._getValue = function () {
			return this.options.value;
		};

		prototype._setMax = function (element, max) {
			var options = this.options;

			options.max = (max !== undefined) ? parseInt(max, 10) : 0;
			this.length = options.max - options.min + 1;
		};

		prototype._setMin = function (element, min) {
			var options = this.options;

			options.min = (min !== undefined) ? parseInt(min, 10) : 0;
			this.length = options.max - options.min + 1;
		};

		prototype._setLabels = function (element, value) {
			var self = this;

			self.options.labels = value.split(",");
			self._refresh();
		};

		prototype._setModuloValue = function (element, value) {
			this.options.moduloValue = (value === "enabled") ? "enabled" : "disabled";
		};

		prototype._setShortPath = function (element, value) {
			this.options.shortPath = (value === "enabled") ? "enabled" : "disabled";
		};

		prototype._setLoop = function (element, value) {
			this.options.loop = (value === "enabled") ? "enabled" : "disabled";
		};

		prototype._setDuration = function (element, value) {
			this.options.duration = window.parseInt(value, 10);
		};

		prototype._setEnabled = function (element, value) {
			var self = this;

			self.options.enabled = (value === "false") ? false : value;
			if (self.options.enabled) {
				element.classList.add(classes.ENABLING);
				window.setTimeout(function () {
					element.classList.remove(classes.ENABLING);
				}, ENABLING_DURATION);
				element.classList.add(classes.ENABLED);
				utilsEvents.on(document, "drag dragend", self);

			} else {
				element.classList.add(classes.ENABLING);
				window.setTimeout(function () {
					element.classList.remove(classes.ENABLING);
					self.refresh();
				}, ENABLING_DURATION);
				element.classList.remove(classes.ENABLED);
				utilsEvents.off(document, "drag dragend", self);
				// disable animation
				self._animation.stop();
			}
			// reset previous value;
			this._prevValue = null;
			return true;
		};

		prototype._setDirection = function (element, direction) {
			this.options.direction = (["up", "down"].indexOf(direction) > -1) ? direction : "up";
		};

		prototype._drag = function (e) {
			var self = this,
				dragValue,
				value;

			// if element is detached from DOM then event listener should be removed
			if (document.getElementById(self.element.id) === null) {
				utilsEvents.off(document, "drag dragend", self);
			} else {
				if (self.options.enabled) {
					value = self.value();
					dragValue = e.detail.deltaY - lastDragValueChange;

					if (Math.abs(dragValue) > DRAG_STEP_TO_VALUE) {
						self._setValue(value - Math.round(dragValue / DRAG_STEP_TO_VALUE), true);
						lastDragValueChange = e.detail.deltaY;
						window.navigator.vibrate(VIBRATION_DURATION);
					}
				}
			}

		};

		prototype._dragEnd = function () {
			lastDragValueChange = 0;
		};

		prototype._click = function (e) {
			var target = e.target,
				self = this,
				items = self._ui.items,
				value = self.value(),
				targetIndex = items.indexOf(target),
				currentIndex = self._valueToIndex(value);

			if (targetIndex > -1 && targetIndex !== currentIndex) {
				if (currentIndex === items.length - 1 && targetIndex == 0) {
					// loop - current index is 12/12 and event target has index 0/12
					self._setValue(value + 1, true);
				} else if (currentIndex === 0 && targetIndex == items.length - 1) {
					// loop - current index is 0/12 and event target has index 12/12
					self._setValue(value - 1, true);
				} else if (targetIndex < currentIndex) {
					self._setValue(value - 1, true);
				} else if (targetIndex > currentIndex) {
					self._setValue(value + 1, true);
				}
			}
		}

		prototype.handleEvent = function (event) {
			switch (event.type) {
				case "drag":
					this._drag(event);
					break;
				case "dragend":
					this._dragEnd(event);
					break;
				case "click":
					this._click(event);
					break;
			}
		};

		prototype._bindEvents = function () {
			var self = this;

			// enabled drag gesture for document
			utilsEvents.enableGesture(document, new gesture.Drag({
				blockHorizontal: true
			}));

			utilsEvents.on(self.element, "click", self);
		};

		prototype._unbindEvents = function () {
			var self = this;

			utilsEvents.disableGesture(document);

			utilsEvents.off(document, "drag dragend", self);
			utilsEvents.off(self.element, "click", self);
		};

		/**
		 * Destroy widget instance
		 * @protected
		 * @method _destroy
		 * @member ns.widget.core.Spin
		 * @protected
		 */
		prototype._destroy = function () {
			var self = this,
				element = self.element,
				ui = self._ui;

			self._unbindEvents();
			ui.items.forEach(function (item) {
				item.parentNode.removeChild(item);
			});
			element.removeChild(ui.placeholder);
			element.classList.remove(classes.SPIN);
		};

		Spin.prototype = prototype;
		ns.widget.core.Spin = Spin;

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		return Spin;
	});
	//>>excludeEnd("tauBuildExclude");

})(window, ns);
