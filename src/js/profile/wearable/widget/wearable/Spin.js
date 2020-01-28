/*global window, define, ns */
/*jslint nomen: true, plusplus: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
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
 * @class ns.widget.wearable.Spin
 * @since 5.0
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
		"../../../../core/util/animation/animation",
		"../../../../core/event/gesture/Swipe"
	],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var document = window.document,
				BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.wearable.Spin
				 * @private
				 * @static
				 */
				engine = ns.engine,
				utilsEvents = ns.event,
				gesture = utilsEvents.gesture,

				Animation = ns.util.Animate,

				ENABLING_DURATION = 300, // [ms]
				ROLL_DURATION = 600,
				DELTA_Y = 100,
				DRAG_STEP_TO_VALUE = 60,
				NUMBER_OF_CAROUSEL_ITMES = 7,
				VIBRATION_DURATION = 10,
				lastDragValueChange = 0,
				dragGestureInstance = null,

				/**
				 * Alias for class Spin
				 * @method Spin
				 * @member ns.widget.wearable.Spin
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
					 *  // the spin will rotate by 1 -> 0 -> 9 -> 8
					 * @property {number} [options.duration=ROLL_DURATION] time of rotate to indicated value
					 * @property {string} [options.direction="up"] direction of spin rotation
					 * @property {string} [options.rollHeight="container"] size of frame to rotate one item
					 * @property {number} [options.itemHeight=38] size of frame for "custom" rollHeight
					 * @property {number} [options.momentumLevel=0] define momentum level on drag
					 * @property {number} [options.scaleFactor=0.4] second / next items scale factor
					 * @property {number} [options.moveFactor=0.4] second / next items move factor from center
					 * @property {number} [options.loop="enabled"] when the spin reaches max value then loops to min value
					 * @property {string} [options.labels=""] defines labels for values likes days of week separated by ","
					 * // eg. "Monday,Tuesday,Wednesday"
					 * @property {string} [options.digits=0] value filling with zeros, eg. 002 for digits=3;
					 * @member ns.widget.wearable.Spin
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
					this._carouselItems = [];
					this._numberOfCarouselItems = 0;
					this.length = this.options.max - this.options.min + this.options.step;
					this._prevValue = null; // this property has to be "null" on start
					this._lastCurrentIndex = null;

					// enabled drag gesture for document
					if (dragGestureInstance === null) {
						dragGestureInstance = new gesture.Drag({
							blockHorizontal: true
						});
						utilsEvents.enableGesture(document, dragGestureInstance);
					}
				},

				WIDGET_CLASS = "ui-spin",

				classes = {
					SPIN: WIDGET_CLASS,
					PREFIX: WIDGET_CLASS + "-",
					ITEM: WIDGET_CLASS + "-item",
					SELECTED: WIDGET_CLASS + "-item-selected",
					NEXT: WIDGET_CLASS + "-item-next",
					PREV: WIDGET_CLASS + "-item-prev",
					ENABLED: "enabled",
					ENABLING: WIDGET_CLASS + "-enabling",
					PLACEHOLDER: WIDGET_CLASS + "-placeholder",
					CAROUSEL: WIDGET_CLASS + "-carousel",
					CAROUSEL_ITEM: WIDGET_CLASS + "-carousel-item",
					DUMMY: WIDGET_CLASS + "-dummy"
				},

				prototype = new BaseWidget();

			Spin.classes = classes;
			Spin.timing = Animation.timing;

			prototype._rollItems = function (direction, currentIndex) {
				var carouselItems = this._carouselItems,
					corouselElement,
					borderIndex,
					itemIndex,
					contentItem;

				if (currentIndex < 0) {
					currentIndex += this._ui.items.length - 1;
					currentIndex = currentIndex || 0;
				}
				borderIndex = currentIndex - direction;
				itemIndex = currentIndex + direction * 3;

				console.log("rollitems", currentIndex, borderIndex, itemIndex);

				while (borderIndex < 0) {
					borderIndex += carouselItems.length;
				}
				while (borderIndex >= carouselItems.length) {
					borderIndex -= carouselItems.length;
				}

				// remove content from border item
				corouselElement = carouselItems[borderIndex].element;
				contentItem = corouselElement.firstElementChild;
				if (contentItem) {
					corouselElement.removeChild(corouselElement.firstElementChild);
				}

				if (direction < 0) {
					itemIndex = itemIndex + 1;
				}
				while (itemIndex < 0) {
					itemIndex += this._ui.items.length;
				}
				while (itemIndex >= this._ui.items.length) {
					itemIndex -= this._ui.items.length;
				}
				corouselElement.appendChild(this._ui.items[itemIndex]);
			}

			function transform(value, index, centerY, options, self) {
				var diff,
					direction,
					diffAbs,
					scale,
					moveY,
					opacity,
					numberOfItems = self._numberOfCarouselItems,
					currentIndex = (value - options.min) / options.step,
					centerIndex = Math.floor(numberOfItems / 2),
					renderIndex,
					valueOfDiff;

				// change carousel items content on change current index
				if (self._lastCurrentIndex !== Math.round(currentIndex)) {
					console.log("currentIndexChange", self._lastCurrentIndex, Math.round(currentIndex));
					if (self._lastCurrentIndex !== null) {
						// loop of items eg. change 0 -> 1000, or 1000 -> 0
						if (self._lastCurrentIndex === self.options.min && value > self.options.max) {
							valueOfDiff = -options.step;
						} else if (self._lastCurrentIndex === self.options.max && value < self.options.min) {
							valueOfDiff = options.step;
						} else {
							valueOfDiff = (Math.round(currentIndex) - self._lastCurrentIndex) * options.step;
						}
						self._rollItems(valueOfDiff, Math.round(currentIndex));
					}
					self._lastCurrentIndex = Math.round(currentIndex);
				}

				renderIndex = currentIndex % numberOfItems - index + centerIndex;

				if (renderIndex < -centerIndex) {
					renderIndex += numberOfItems;
				} else if (renderIndex > centerIndex) {
					renderIndex -= numberOfItems;
				}
				diff = value - options.min - (currentIndex + renderIndex) * options.step;

				direction = diff < 0 ? -1 : 1;
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
				var carouselItems = self._carouselItems,
					options = self.options,
					itemHeight = self._itemHeight,
					state = self._objectValue,
					centerY = (self._containerRect.height - itemHeight) / 2;

				carouselItems.forEach(function (carouselItem, index) {
					var change = transform(state.value, index, centerY, options, self);

					// set carouselItem position
					if (change.opacity > 0) {
						carouselItem.element.style.transform = "translateY(" + change.moveY + "px) scale(" + change.scale + ")";
					} else {
						carouselItem.element.style.transform = "translateY(-1000px)"; // move carouselItem from active area
					}
					carouselItem.element.style.opacity = change.opacity;
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
					dummyElement = self._ui.dummyElement,
					itemHeight = 0,
					items = [].slice.call(element.querySelectorAll("." + classes.ITEM)),
					len = options.max - options.min + options.step,
					diff = len - items.length,
					centerY,
					item = null,
					i = 0;

				// add or remove item from spin widget
				if (diff > 0) {
					for (; i < diff; i++) {
						item = document.createElement("div");
						item.classList.add(classes.ITEM);
						dummyElement.appendChild(item);
						items.push(item);
					}
				} else if (diff < 0) {
					diff = -diff;
					for (; i < diff; i++) {
						dummyElement.removeChild(items.pop());
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

				// set position of carousel items;
				self._carouselItems.forEach(function (carouselItem, index) {
					var change = transform(options.value, index, centerY, options, self);

					// set carouselItem position
					carouselItem.element.style.transform = "translateY(" + change.moveY + "px) scale(" + change.scale + ")";
					carouselItem.element.style.opacity = change.opacity;
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
				self._fillCarousel();
				self._show();
			};

			/**
			 * Widget init method
			 * @protected
			 * @method _init
			 * @member ns.widget.wearable.Spin
			 */
			prototype._init = function () {
				var self = this,
					options = self.options;

				// convert options
				options.min = (options.min !== undefined) ? parseInt(options.min, 10) : 0;
				options.max = (options.max !== undefined) ? parseInt(options.max, 10) : 0;
				options.step = (options.step !== undefined) ? parseInt(options.step, 10) : 1;
				options.value = (options.value !== undefined) ? parseInt(options.value, 10) : 0;
				options.duration = (options.duration !== undefined) ? parseInt(options.duration, 10) : 0;
				options.labels = (Array.isArray(options.labels)) ? options.labels : options.labels.split(",");

				self.length = options.max - options.min + options.step;
				console.log("_init", options);

				self._refresh();
			};

			prototype._fillCarousel = function () {
				var numberOfItems = this._numberOfCarouselItems,
					options = this.options,
					value = options.value,
					centerIndex = Math.floor(numberOfItems / 2),
					currentIndex = Math.round((value - options.min) / options.step),
					index = 0,
					carouselItems = this._carouselItems,
					items = this._ui.items,
					indexOfItemToAppend = 0;

				for (index = 0; index < numberOfItems; index++) {
					indexOfItemToAppend = currentIndex + index - centerIndex;
					if (indexOfItemToAppend < 0) {
						indexOfItemToAppend += items.length;
					}
					// check if carousel content should be changed
					if (carouselItems[index].element.firstElementChild !== items[indexOfItemToAppend]) {
						// remove previous element from carousel by append to dummy element
						if (carouselItems[index].element.firstElementChild) {
							this._ui.dummyElement.appendChild(carouselItems[index].element.firstElementChild);
						}
						// append new child element
						carouselItems[index].element.appendChild(items[indexOfItemToAppend]);
					}
				}
			};

			prototype._buildCarousel = function (count) {
				// create carousel
				var self = this,
					carousel = document.createElement("div"),
					carouselElement,
					fragment = document.createDocumentFragment(),
					i = 0;

				self._carouselItems = [];
				self._numberOfCarouselItems = count;

				carousel.classList.add(classes.CAROUSEL, classes.PREFIX + count);
				for (; i < count; i++) {
					carouselElement = document.createElement("div");
					carouselElement.id = "cel-" + i;
					carouselElement.classList.add(classes.CAROUSEL_ITEM);
					self._carouselItems[i] = {
						element: carouselElement
					};
					fragment.appendChild(carouselElement);
				}
				carousel.appendChild(fragment);
				return carousel;
			};

			prototype._build = function (element) {
				var placeholder = document.createElement("div"),
					dummyElement = document.createElement("div"),
					carousel = null;

				element.classList.add(classes.SPIN);

				dummyElement.classList.add(classes.DUMMY);
				element.appendChild(dummyElement);

				placeholder.classList.add(classes.PLACEHOLDER);
				element.appendChild(placeholder);

				carousel = this._buildCarousel(NUMBER_OF_CAROUSEL_ITMES);
				element.appendChild(carousel);

				this._ui.dummyElement = dummyElement;
				this._ui.carousel = carousel;
				this._ui.placeholder = placeholder;
				return element;
			};

			prototype._setValue = function (value, enableChangeEvent) {
				var self = this,
					animation,
					valueRange;

				value = window.parseInt(value, 10);
				self._ui.placeholder.textContent = value;

				if (isNaN(value)) {
					ns.warn("Spin: value is not a number");
				} else if (value !== self.options.value) {
					if (value >= self.options.min && value <= self.options.max || self.options.loop === "enabled") {
						self._prevValue = self.options.value;
						if (self.options.loop === "enabled") {
							valueRange = self.options.max - self.options.min + self.options.step;
							while (value > self.options.max) {
								value = value - valueRange;
							}
							while (value < self.options.min) {
								value = value + valueRange;
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
				this.length = options.max - options.min + options.step;
				console.log("_setMax:", options.max, "length:", this.length);
			};

			prototype._setMin = function (element, min) {
				var options = this.options;

				options.min = (min !== undefined) ? parseInt(min, 10) : 0;
				this.length = options.max - options.min + options.step;
				console.log("_setMin:", options.min, "length:", this.length);
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

					// disable tau rotaryScroller the widget has own support for rotary event
					ns.util.rotaryScrolling && ns.util.rotaryScrolling.lock();
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
					// enable tau rotaryScroller the widget has own support for rotary event
					ns.util.rotaryScrolling && ns.util.rotaryScrolling.unlock();
				}
				// reset previous value;
				this._prevValue = null;
				return true;
			};

			prototype._setDirection = function (element, direction) {
				this.options.direction = (["up", "down"].indexOf(direction) > -1) ?
					direction : "up";
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

				utilsEvents.on(self.element, "click", self);
			};

			prototype._unbindEvents = function () {
				var self = this;

				utilsEvents.off(document, "drag dragend", self);
				utilsEvents.off(self.element, "click", self);
			};

			/**
			 * Destroy widget instance
			 * @protected
			 * @method _destroy
			 * @member ns.widget.wearable.Spin
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this,
					element = self.element,
					ui = self._ui;

				self._unbindEvents();
				// @todo remove carousel

				ui.items.forEach(function (item) {
					item.parentNode.removeChild(item);
				});
				element.removeChild(ui.placeholder);
				element.classList.remove(classes.SPIN);
			};

			Spin.prototype = prototype;
			ns.widget.wearable.Spin = Spin;

			engine.defineWidget(
				"Spin",
				"." + WIDGET_CLASS,
				[],
				Spin,
				"wearable"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Spin;
		});
	//>>excludeEnd("tauBuildExclude");

})(window, ns);

