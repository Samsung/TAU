/*global window, define */
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
 * #RadialListview Widget
 *
 * @class ns.widget.wearable.RadialListview
 * @since 2.3
 * @extends ns.widget.wearable.Listview
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	var Listview = ns.widget.wearable.Listview,
		/**
		 * Alias for class {@link ns.engine}
		 * @property {Object} engine
		 * @member ns.widget.wearable.RadialListview
		 * @private
		 * @static
		 */
		engine = ns.engine,
		/**
		 * Alias for class {@link ns.util.DOM}
		 * @property {Object} DOM
		 * @member ns.widget.wearable.RadialListview
		 * @private
		 * @static
		 */
		DOM = ns.util.DOM,
		/**
		 * Alias for class {@link ns.util.object.fastMerge}
		 * @property {Object} copyProperty
		 * @member ns.widget.wearable.RadialListview
		 * @private
		 * @static
		 */
		copyProperty = ns.util.object.fastMerge,
		/**
		 * Alias for class {@link ns.event}
		 * @property {Object} eventUtil
		 * @member ns.widget.wearable.RadialListview
		 * @private
		 * @static
		 */
		eventUtil = ns.event,
		// table of effects
		fx = {
			scale: [1, 1, 1, 1, 1, 1, 1],
			opacity: [0, 1, 1, 1, 1, 1, 0],
			distance: [270, 265, 250, 250, 250, 265, 270],
			angle: [140, 130, 112, 90, 68, 50, 40],
			depth: [-300, -200, -100, 0, -100, -200, -300]
		},
		// predefined factors
		center = {
			x: 180, y: -60
		},
		// time of change beetwen items
		changeTime = 150, // ms
		/**
		 * Alias for class RadialListview
		 * @method RadialListview
		 * @member ns.widget.wearable.RadialListview
		 * @private
		 * @static
		 */
		RadialListview = function () {
			/**
			 * Object with default options
			 * @property {Object} options
			 * @property {Object} options.fx table of effects to apply to itmes
			 * @property {Object} [options.center] Center of radial list
			 * @property {number} [options.center.x=180] x cordinate
			 * @property {number} [options.center.y=-60] y cordinate
			 * @property {number} [options.changeTime=150] time of item change
			 * @property {number} [options.direction=-1] define how to arrange items
			 * @property {number} [options.selectedIndex=0] index current selected item begins from 0
			 * @member ns.widget.wearable.RadialListview
			 */
			this.options = {
				// object contains supported effects like: angle, scale, opacity, depth,
				fx: fx,
				// center of radial list
				center: center,
				// time of item change
				changeTime: changeTime,
				// rotate direction
				direction: -1,
				// selected index
				selectedIndex: 0
			};
			// items table on start is empty
			this._items = [];
			// render method assigned to widget instance
			this._render = null;
			// animation end
			this._end = true;
			// current selected item
			this._currentIndex = 0;
			// default items width/height
			this._itemWidth = 140;
			this._itemHeight = 140;
			// how many elements will anim in one step
			this._itemsToAnim = 0;
		},

		// initial value of widget height
		widgetHeight = 360,

		prototype = new Listview();

	function degToRad(deg) {
		return (deg / 180) * Math.PI;
	}

	function positionCalc(element, state, itemWidth, itemHeight) {
		var distance = state.distance,
			angle = state.angle,
			x = center.x + Math.cos(degToRad(angle)) * distance - itemWidth / 2,
			y = widgetHeight - (center.y + Math.sin(degToRad(angle)) * distance + itemHeight / 2),
			left = (x | 0),
			top = (y | 0);

		return "translate3d(" + left + "px, " + top + "px, " + state.depth + "px)";
	}

	function applyFx(self, item) {
		var state = item.state,
			element = item.element,
			position = positionCalc(element, state, self._itemWidth, self._itemHeight),
			scale = "scale(" + state.scale + ", " + state.scale + ")",
			transform = "";

		element.style.opacity = state.opacity.toFixed(2);

		transform = position + " " + scale;

		// set transform style
		element.style.transform = transform;
		element.style["-webkit-transform"] = transform;

		return self;
	}

	// classic linear timing function
	function linear(startTime, startValue, endValue, endTime) {
		return endValue * startTime / endTime + startValue;
	}

	function animeItems(self, items) {
		var len = items.length,
			i = 0,
			item,
			from,
			to,
			state,
			progress;

		for (; i < len; ++i) {
			item = items[i];
			state = item.state;
			from = item.stateFrom;
			to = item.stateTo;

			progress = (Date.now() - item.startTime) / item.duration;
			if (progress > 1) {
				progress = 1;
			}
			state.angle = linear(progress, from.angle, to.angle - from.angle, 1);
			state.scale = linear(progress, from.scale, to.scale - from.scale, 1);
			state.opacity = linear(progress, from.opacity, to.opacity- from.opacity, 1);
			state.distance = linear(progress, from.distance, to.distance - from.distance, 1);
			state.depth = linear(progress, from.depth, to.depth - from.depth, 1);
		}
		if (progress >= 1) {
			self._end = true;
		}
	}

	/**
	 * Toggle selected item by changing class
	 * @protected
	 * @method _toggleSelectedItem
	 * @member ns.widget.wearable.RadialListview
	 * @protected
	 */
	prototype._toggleSelectedItem = function (visible) {
		var self = this,
			item = this._items[self._currentIndex];

		if (visible) {
			item.element.classList.add("ui-selected");
		} else {
			item.element.classList.remove("ui-selected");
		}
	}

	function render(self) {
		var items = self._items;

		animeItems(self, items);
		drawItems(self, items);
		if (!self._end) {
			window.requestAnimationFrame(self._render);
		} else {
			self._toggleSelectedItem(true);
			eventUtil.trigger(self.element, "change", {
				selectedIndex: self._currentIndex
			});
		}
	}

	function drawItems(self, items) {
		items.reduce(applyFx, self);
	}

	function createState(self, index) {
		var fx = self.options.fx;

		if (index < 0) {
			index = 0;
		}
		if (index >= self._itemsToAnim) {
			index = self._itemsToAnim - 1;
		}
		return {
			angle: fx.angle[index],
			scale: fx.scale[index],
			distance: fx.distance[index],
			opacity: fx.opacity[index],
			depth: fx.depth[index]
		};
	}

	/**
	 * Update items state and start render method
	 * @protected
	 * @method _update
	 * @member ns.widget.wearable.RadialListview
	 * @protected
	 */
	prototype._update = function () {
		var self = this,
			items = self._items,
			currentIndex = self._currentIndex,
			len = items.length,
			item = null,
			i = 0;

		for (; i < len; ++i) {
			item = items[i];
			copyProperty(item.stateFrom, item.state);
			item.stateTo = createState(self, ((self._itemsToAnim) / 2 | 0) + i - currentIndex);
			item.progress = 0;
			item.startTime = Date.now();
			item.duration = changeTime;
		}
		// start render loop;
		if (self._end) {
			self._end = false;
			self._render();
		}
	}

	/**
	 * Method changes items bassed on currentIndex
	 * @protected
	 * @method _change
	 * @member ns.widget.wearable.RadialListview
	 */
	prototype._change = function () {
		var self = this,
			items = this._items;

		if (self._currentIndex > items.length - 1) {
			self._currentIndex = items.length - 1
			self._toggleSelectedItem(true);
		} else if (self._currentIndex < 0) {
			self._currentIndex = 0;
			self._toggleSelectedItem(true);
		}
		eventUtil.trigger(self.element, "ischanging", {
			selectedIndex: self._currentIndex
		});
		self._update();
	}

	/**
	 * Change to next item
	 * @param {number} delta how many items will change
	 * @method next
	 * @member ns.widget.wearable.RadialListview
	 */
	prototype.next = function (delta) {
		var self = this;

		delta = delta || 1;
		self._toggleSelectedItem(false);
		self._currentIndex += delta * self.options.direction;
		self._change();
	}

	/**
	 * Change to prev item
	 * @param {number} delta how many items will change
	 * @method prev
	 * @member ns.widget.wearable.RadialListview
	 */
	prototype.prev = function (delta) {
		var self = this;

		delta = delta || 1;
		self._toggleSelectedItem(false);
		self._currentIndex -= delta * self.options.direction;
		self._change();
	}

	function maxArrayPropertyLength(obj) {
		var max = 0,
			i = "",
			property = null;

		for (i in obj) {
			property = obj[i];
			if (Array.isArray(property)) {
				max = property.length;
			}
		}
		return max;
	}

	/**
	 * Widget init method
	 * @protected
	 * @method _init
	 * @member ns.widget.wearable.RadialListview
	 */
	prototype._init = function () {
		var self = this,
			items = self._items,
			options = self.options,
			element = self.element,
			elements = element.children,
			itemElement = null,
			len = elements.length,
			currentIndex = options.selectedIndex,
			i = 0,
			rect = null;

		self._currentIndex = currentIndex;

		// set items width / height
		if (len && elements[0]) {
			itemElement = elements[0];
			if (itemElement.clientWidth) {
				self._itemWidth = itemElement.clientWidth;
			}
			if (itemElement.clientHeight) {
				self._itemHeight = itemElement.clientHeight;
			}
		}

		// set widget height
		rect = element.getBoundingClientRect();
		widgetHeight = rect.height;

		// get center position from options or update center position based on element rect
		center = options.center || {x: rect.width / 2, y: widgetHeight / 2};

		// prepare render method bound to widget
		self._render = render.bind(null, self);

		// set how to many items will transform in one step;
		self._itemsToAnim = maxArrayPropertyLength(self.options.fx);

		// initialize item states
		for (; i < len; ++i) {
			items.push({
				element: elements[i],
				state: createState(self, ((self._itemsToAnim) / 2 | 0) + i - currentIndex),
				stateTo: {},
				stateFrom: {},
				progress: 1,
			});
		}

		// draw items based on their states
		drawItems(self, items);

		// initialize selected item
		self._toggleSelectedItem(true);
	};

	function onRotary(self, ev) {
		if (ev.detail.direction === "CW") {
			self.next();
		} else {
			self.prev();
		}
	}

	/**
	 * Event handeler for widget
	 * @param {Event} ev
	 * @method handleEvent
	 * @member ns.widget.wearable.RadialListview
	 * @protected
	 */
	prototype.handleEvent = function (ev) {
		switch (ev.type) {
			case "rotarydetent" : onRotary(this, ev);
				break;
		}
	}

	/**
	 * Bind event listeners to widget instance
	 * @protected
	 * @method _bindEvents
	 * @member ns.widget.wearable.RadialListview
	 * @protected
	 */
	prototype._bindEvents = function (element) {
		document.addEventListener("rotarydetent", this, true);
	};

	/**
	 * Remove event listeners from widget instance
	 * @protected
	 * @method _unbindEvents
	 * @member ns.widget.wearable.RadialListview
	 * @protected
	 */
	prototype._unbindEvents = function () {
		document.removeEventListener("rotarydetent", this, true);
	};

	/**
	 * Destroy widget instance
	 * @protected
	 * @method _destroy
	 * @member ns.widget.wearable.RadialListview
	 * @protected
	 */
	prototype._destroy = function () {
		var self = this,
			items = self._items,
			len = items.length,
			i = 0;

		self._unbindEvents();
		// remove items
		for (; i < len; ++i) {
			items[i] = null;
		}
		self._items = [];
	};

	RadialListview.prototype = prototype;
	ns.widget.wearable.RadialListview = RadialListview;

	engine.defineWidget(
		"RadialListview",
		".ui-radial-listview",
		[],
		RadialListview,
		"wearable"
	);

}(window, window.document, window.tau));
