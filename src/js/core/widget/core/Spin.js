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
		"../../../core/engine",
		"../../../core/util/animation/animation",
		"../../../core/event/gesture",
		"../../../core/util/selectors",
		"./Page",
		"./Appbar"
	],
	function () {
		//>>excludeEnd("tauBuildExclude");
		var document = window.document,
			BaseWidget = ns.widget.BaseWidget,
			Page = ns.widget.core.Page,
			Appbar = ns.widget.core.Appbar,
			engine = ns.engine,
			utilsEvents = ns.event,
			gesture = utilsEvents.gesture,
			utilSelectors = ns.util.selectors,

			Animation = ns.util.Animate,

			ENABLING_DURATION = 300, // [ms]
			ROLL_DURATION = 600,
			DELTA_Y = 100,
			DRAG_STEP_TO_VALUE = 60,
			NUMBER_OF_CAROUSEL_ITEMS = 7,

			/**
			 * Alias for class Spin
			 * @method Spin
			 * @member ns.widget.core.Spin
			 * @private
			 * @static
			 */
			Spin = function () {
				var self = this;

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
				 * @property {string} [options.rollHeight="custom"] size of frame to rotate one item
				 * @property {number} [options.itemHeight=38] size of frame for "custom" rollHeight
				 * @property {number} [options.momentumLevel=0] define momentum level on drag
				 * @property {number} [options.scaleFactor=0.4] second / next items scale factor
				 * @property {number} [options.moveFactor=0.4] second / next items move factor from center
				 * @property {number} [options.loop="enabled"] when the spin reaches max value then loops to min value
				 * @property {string} [options.labels=""] defines labels for values likes days of week separated by ","
				 * // eg. "Monday,Tuesday,Wednesday"
				 * @property {string} [options.digits=0] value filling with zeros, eg. 002 for digits=3;
				 * @property {string} [options.dragTarget="document"] set target element for drag gesture
				 * @member ns.widget.core.Spin
				 */
				self.options = {
					min: 0,
					max: 9,
					step: 1,
					moduloValue: "enabled",
					shortPath: "enabled",
					duration: ROLL_DURATION,
					direction: "up",
					rollHeight: "custom", // "container" | "item" | "custom"
					itemHeight: 38,
					momentumLevel: 0, // 0 - one item on swipe,
					momentumDuration: 800,
					scaleFactor: 0.4,
					moveFactor: 0.4,
					loop: "enabled",
					labels: [],
					digits: 0, // 0 - doesn't complete by zeros
					value: 0,
					dragTarget: "document", // "document" | "self",
					enabled: false
				};
				self._ui = {
					scrollableParent: null,
					page: null,
					appbar: null
				};
				self._carouselItems = [];
				self._numberOfCarouselItems = NUMBER_OF_CAROUSEL_ITEMS;
				self.length = self.options.max - self.options.min + self.options.step;
				self._prevValue = null; // self property has to be "null" on start
				self._overflowYBeforeDrag = null;
				self._lastCurrentIndex = null;
				self._currentCentralCarouseItem = 0;
				self._count = 0;
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
				CAROUSEL_ITEM: WIDGET_CLASS + "-carousel-item"
			},

			prototype = new BaseWidget();

		Spin.classes = classes;
		Spin.timing = Animation.timing;

		prototype._fillCarouselByCount = function (count) {
			var self = this,
				itemToAppend,
				i;

			count = Math.round(count);
			// remove all items
			for (i = 0; i < self._numberOfCarouselItems; i++) {
				if (self._carouselItems[i].element.firstElementChild) {
					self._carouselItems[i].element.removeChild(self._carouselItems[i].element.firstElementChild);
				}
			}
			// append new items
			for (i = 0; i < self._numberOfCarouselItems; i++) {
				itemToAppend = self._itemByCount(count + i - self._carouselCenterIndex);
				if (itemToAppend) {
					self._carouselItems[self._carouselItemByCount(count + i - self._carouselCenterIndex)]
						.element.appendChild(itemToAppend);
				}
			}
		};

		prototype._rollItems = function (delta, count) {
			var self = this,
				direction = delta > 0 ? 1 : -1,
				borderItem,
				newItemToPlace;

			delta = Math.abs(delta);
			if (delta === 1) { // move one item
				borderItem = self._carouselItems[
					self._carouselItemByCount(count + direction * self._carouselCenterIndex)
				];
				newItemToPlace = self._itemByCount(count + direction * self._carouselCenterIndex);

				if (borderItem.element.firstElementChild) {
					borderItem.element.removeChild(borderItem.element.firstElementChild);
				}
				if (newItemToPlace) {
					borderItem.element.appendChild(newItemToPlace);
				}
			} else if (delta > 1) {
				self._fillCarouselByCount(count);
			}
		}

		function transform(value, index, centerY, options, self) {
			var diff,
				direction,
				diffAbs,
				scale,
				moveY,
				opacity,
				count = value,
				currentIndex = self._carouselItemByCount(count);

			// change carousel items content on change current index
			if (self._lastCurrentIndex !== Math.round(value)) {
				if (self._lastCurrentIndex !== null) {
					self._rollItems(Math.round(value) - self._lastCurrentIndex, Math.round(value));
				}
				self._lastCurrentIndex = Math.round(value);
			}

			diff = index - currentIndex;
			if (diff < -self._carouselCenterIndex) {
				diff += self._numberOfCarouselItems;
			} else if (diff > self._carouselCenterIndex) {
				diff -= self._numberOfCarouselItems;
			}

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
				centerY = (self._containerHeight - itemHeight) / 2;

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

		prototype._valueToIndex = function (value) {
			var options = this.options,
				delta = options.max - options.min + options.step;

			value = value - options.min;
			while (value < options.min) {
				value += delta;
			}
			while (value > options.max) {
				value -= delta;
			}

			return parseInt(value, 10) % this.length;
		};

		prototype._removeSelectedLayout = function () {
			var self = this,
				item = self._itemByCount(self._previousCount);

			if (item) {
				item.classList.remove(classes.SELECTED);
			}
		};

		prototype._addSelectedLayout = function () {
			var self = this,
				item = self._itemByCount(self._count);

			if (item) {
				item.classList.add(classes.SELECTED);
			}
		};

		prototype._show = function () {
			var self = this,
				animation = new Animation({}),
				state = null,
				objectValue = {
					value: self._previousCount
				};

			self._removeSelectedLayout();

			state = {
				animation: [{
					object: objectValue,
					property: "value",
					to: self._count
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
				self._prevValue = self.options.value;
				self.options.value = self._getValueByCount(self._count);

				ns.event.trigger(self.element, "spinchange", {
					value: parseInt(self.options.value, 10),
					dValue: parseInt(self.options.value, 10) - parseInt(self._prevValue, 10)
				});
			});

		};

		prototype._modifyItems = function () {
			var self = this,
				options = self.options,
				element = self.element,
				itemHeight = 0,
				items = self._ui.items ||
					[].slice.call(element.querySelectorAll("." + classes.ITEM)),
				len = Math.abs(options.max - options.min) / options.step + 1,
				diff = len - items.length,
				index = 0,
				textValue = "",
				centerY,
				item = null,
				i = 0;

			// add or remove item from spin widget
			if (diff > 0) {
				for (; i < diff; i++) {
					item = document.createElement("div");
					item.classList.add(classes.ITEM);
					items.push(item);
				}
			} else if (diff < 0) {
				for (; i < -diff; i++) {
					items.pop();
				}
			}

			// set content for new items
			if (diff > 0) {
				for (i = 0; i < diff; i++) {
					index = len - diff + i;
					item = items[index];
					textValue = "";

					if (self.options.labels.length) {
						textValue = self.options.labels[index];
					} else {
						textValue += (options.min + index * options.step);
						if (options.digits > 0) {
							while (textValue.length < options.digits) {
								textValue = "0" + textValue;
							}
						}
					}
					item.innerHTML = textValue;
				}
			}

			// determine item height for scroll
			if (options.rollHeight === "container") {
				itemHeight = self._containerHeight;
			} else if (options.rollHeight === "custom") {
				itemHeight = options.itemHeight;
			} else { // item height
				item = items[0];
				itemHeight = (item) ?
					item.getBoundingClientRect().height :
					self._containerHeight;
			}
			self._itemHeight = itemHeight;
			centerY = (self._containerHeight - itemHeight) / 2;

			// set position of carousel items;
			self._carouselItems.forEach(function (carouselItem, index) {
				var change = transform(self._valueToCount(options.value), index, centerY, options, self);

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

		/**
		 * Update items
		 * @method _updateItems
		 * @member ns.widget.core.Spin
		 * @protected
		 */
		prototype._updateItems = function () {
			var self = this;

			self._removeSelectedLayout();
			self._modifyItems();
			self._addSelectedLayout();
		}

		prototype._refresh = function () {
			var self = this,
				computedHeight = getComputedStyle(self.element).height || 0;

			self._containerHeight = parseInt(computedHeight, 10);
			self._modifyItems();
			self._fillCarouselByCount(self._count);
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
			options.step = (options.step !== undefined) ? parseInt(options.step, 10) : 1;
			options.duration = (options.duration !== undefined) ? parseInt(options.duration, 10) : 0;
			options.labels = (Array.isArray(options.labels)) ? options.labels : options.labels.split(",");

			self.length = options.max - options.min + options.step;
			self._count = self._valueToCount(options.value);

			self.dragTarget = (options.dragTarget === "document") ? document : self.element;

			self._refresh();
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
			self._carouselCenterIndex = Math.floor(count / 2)

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
				carousel = null;

			element.classList.add(classes.SPIN);

			placeholder.classList.add(classes.PLACEHOLDER);
			element.appendChild(placeholder);

			carousel = this._buildCarousel(NUMBER_OF_CAROUSEL_ITEMS);
			element.appendChild(carousel);

			this._ui.carousel = carousel;
			this._ui.placeholder = placeholder;
			return element;
		};

		prototype._valueToCount = function (value) {
			var self = this;

			return (value - self.options.min) / self.options.step || 0;
		};

		prototype._setValue = function (value) {
			var self = this;

			value = window.parseFloat(value, 10);
			// @todo: for spin with labels the textContent should contains label by value;
			self._ui.placeholder.textContent = value;

			if (isNaN(value)) {
				ns.warn("Spin: value is not a number");
			} else if (value !== self.options.value) {
				if (value >= self.options.min && value <= self.options.max || self.options.loop === "enabled") {

					self._previousCount = self._count;
					self._count = self._valueToCount(value);

					self.options.value = value;
					// set data-value on element
					self.element.dataset.value = value;

					// stop previous animation
					self._stopAnimation();

					// update status of widget
					self._show();
				}
			}
		};

		prototype._stopAnimation = function () {
			var self = this,
				animation = self.state.animation[0];

			if (animation !== null && animation.to !== animation.current) {
				self._animation.stop();
			}
		};

		prototype._carouselItemByCount = function (count) {
			var centerIndex = this._carouselCenterIndex,
				carouselItemIndex = (count + centerIndex) % this._numberOfCarouselItems;

			if (carouselItemIndex < 0) {
				carouselItemIndex += this._numberOfCarouselItems;
			}

			return carouselItemIndex;
		};

		prototype._getValueByCount = function (count) {
			var value,
				self = this,
				options = self.options,
				rest;

			if (options.loop !== "enabled") {
				value = count * options.step + options.min;
			} else {
				if (count >= 0) {
					value = (count % self.length) * options.step + options.min;
				} else {
					rest = count % self.length || 0;
					if (rest < 0) {
						rest += self.length;
					}
					value = rest * options.step + options.min;
				}
			}
			return value;
		};

		prototype._getValue = function () {
			var self = this,
				options = self.options,
				value = self._getValueByCount(self._count);

			if (self.options.loop !== "enabled") {
				self._objectValue.value = Math.min(Math.max(value, options.min), options.max);
			}
			return value;
		};

		prototype._setMax = function (element, max) {
			var options = this.options;

			options.max = (max !== undefined) ? parseInt(max, 10) : 0;
			this.length = options.max - options.min + options.step;
		};

		prototype._setMin = function (element, min) {
			var options = this.options;

			options.min = (min !== undefined) ? parseInt(min, 10) : 0;
			this.length = options.max - options.min + options.step;
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
				utilsEvents.on(self.dragTarget, "drag dragend dragstart", self);
				utilsEvents.on(self.dragTarget, "vmousedown vmouseup", self);
			} else {
				element.classList.add(classes.ENABLING);
				window.setTimeout(function () {
					element.classList.remove(classes.ENABLING);
					self.refresh();
				}, ENABLING_DURATION);
				element.classList.remove(classes.ENABLED);
				utilsEvents.off(self.dragTarget, "drag dragend dragstart", self);
				utilsEvents.off(self.dragTarget, "vmousedown vmouseup", self);
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
			var self = this;

			// if element is detached from DOM then event listener should be removed
			if (document.getElementById(self.element.id) === null) {
				utilsEvents.off(self.dragTarget, "drag dragend dragstart", self);
			} else {
				if (self.options.enabled) {
					self._objectValue.value = this._startDragCount - e.detail.deltaY / DRAG_STEP_TO_VALUE;
					if (self.options.loop !== "enabled") {
						self._objectValue.value = Math.min(Math.max(self._objectValue.value, 0), self.length - 1);
					}
					showAnimationTick(self);
				}
			}
		};

		prototype._dragStart = function () {
			var self = this;

			self._animation.pause();
			self._startDragCount = self._count;
			self._previousCount = self._count;
			self._removeSelectedLayout();
		};

		prototype._dragEnd = function (e) {
			var self = this,
				chain = self._animation._animate.chain[0],
				momentum = 0,
				duration = self.options.duration;

			if (self.options.momentumLevel > 0 &&
				e.detail.velocityY > 0.7 &&
				e.detail.distance) {

				momentum = self.options.momentumLevel * Math.round(e.detail.distance / 20);
				if (e.detail.direction === "up") {
					momentum = -momentum;
				}
				self._count = Math.round(self._objectValue.value) - momentum || 0;
				if (self.options.loop !== "enabled") {
					self._count = Math.min(Math.max(self._count, 0), self.length - 1);
				}
				duration = self.options.momentumDuration;
				chain[0].timing = Spin.timing.easeOut;
			} else {
				self._count = Math.round(self._objectValue.value) || 0;
				if (self.options.loop !== "enabled") {
					self._count = Math.min(Math.max(self._count, 0), self.length - 1);
				}
				duration = Math.abs(self._count - self._objectValue.value) * duration;
			}

			chain[0].from = self._objectValue.value;
			// @todo: move to nearest
			chain[0].to = self._count;
			chain[0].duration = duration;
			self._animation.start(self._animation._animate.callback);
		};

		/**
		 * Handler for mouse down / touch start event
		 * The method is intended to block the scroll during drag event on Spin widget
		 * @protected
		 * @method _vmouseDown
		 * @member ns.widget.core.Spin
		 */
		prototype._vmouseDown = function () {
			var self = this,
				ui = self._ui;

			ui.scrollableParent = utilSelectors.getScrollableParent(self.element);
			if (ui.scrollableParent) {
				self._overflowYBeforeDrag = ui.scrollableParent.style.overflowY;
				ui.scrollableParent.style.overflowY = "hidden";
			}
			ui.page = utilSelectors.getClosestBySelector(self.element, Page.selector);
			if (ui.page) {
				ui.appbar = ui.page.querySelector(Appbar.selector);
				if (ui.appbar) {
					ns.widget.Appbar(ui.appbar).lockExpanding(true);
				}
			}
		};

		/**
		 * Handler for mouse up / touch end event
		 * The method is intended to unblock the scroll after drag event on Spin widget
		 * @protected
		 * @method _vmouseUp
		 * @member ns.widget.core.Spin
		 */
		prototype._vmouseUp = function () {
			var self = this,
				ui = self._ui;

			if (ui.scrollableParent) {
				ui.scrollableParent.style.overflowY = self._overflowYBeforeDrag;
			}
			if (ui.appbar) {
				ns.widget.Appbar(ui.appbar).lockExpanding(false);
			}
		};

		prototype._itemIndexByValue = function (value) {
			var options = this.options;

			return Math.round((value - options.min) / options.step);
		};

		prototype._itemByCount = function (count) {
			var self = this,
				value = self._getValueByCount(count);

			return self._ui.items[self._itemIndexByValue(value)];
		};

		prototype._click = function (e) {
			var target = e.target,
				self = this,
				items = self._ui.items,
				count = self._count,
				targetIndex = items.indexOf(target);

			if (!self.element.classList.contains(classes.ENABLING) &&
				targetIndex > -1) {
				self._previousCount = count;

				if (target === self._itemByCount(count - 1)) {
					self._count--;
				} else if (target === self._itemByCount(count + 1)) {
					self._count++;
				}
				if (self._previousCount !== self._count) {
					self._show();
				}
			}
		}

		prototype.handleEvent = function (event) {
			var self = this;

			switch (event.type) {
				case "drag":
					self._drag(event);
					break;
				case "vmousedown":
					self._vmouseDown(event);
					break;
				case "vmouseup":
					self._vmouseUp(event);
					break;
				case "dragend":
					self._dragEnd(event);
					break;
				case "dragstart":
					self._dragStart(event);
					break;
				case "click":
					self._click(event);
					break;
			}
		};

		prototype._bindEvents = function () {
			var self = this;

			// enabled drag gesture for document
			utilsEvents.enableGesture(self.dragTarget, new gesture.Drag({
				blockHorizontal: true,
				threshold: 7 // minimal allowed value from Drag module
			}));

			utilsEvents.on(self.element, "click", self);
		};

		prototype._unbindEvents = function () {
			var self = this;

			utilsEvents.disableGesture(self.dragTarget);

			utilsEvents.off(self.dragTarget, "drag dragend dragstart", self);
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
				if (item.parentNode) {
					item.parentNode.removeChild(item);
				}
			});
			self._carouselItems.forEach(function (carouselItem) {
				carouselItem.element.parentNode.removeChild(carouselItem.element);
			});
			element.removeChild(ui.carousel);
			element.removeChild(ui.placeholder);
			element.classList.remove(classes.SPIN);
		};

		Spin.prototype = prototype;
		ns.widget.core.Spin = Spin;

		engine.defineWidget(
			"Spin",
			".ui-spin",
			[],
			Spin,
			"core"
		);

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		return Spin;
	});
	//>>excludeEnd("tauBuildExclude");

})(window, ns);
