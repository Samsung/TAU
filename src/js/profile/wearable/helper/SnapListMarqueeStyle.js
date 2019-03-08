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
 */
/*global window, define, ns */
/**
 * #SnapListMarqueeStyle Helper Script
 *
 * Helper script using SnapListview and Marquee.
 * @class ns.helper.SnapListMarqueeStyle
 * @author Heeju Joo <heeju.joo@samsung.com>
 */
(function (document, window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../helper",
			"../../../core/engine",
			"../../../core/util/object",
			"../../../core/support/tizen",
			"../../../core/widget/core/Marquee",
			"../widget/wearable/Listview",
			"../widget/wearable/SnapListview"
		],
		function () { //>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				helper = ns.helper,
				objectUtils = ns.util.object,
				defaults = {
					marqueeDelay: 0,
					marqueeStyle: "slide",
					speed: 60,
					iteration: 1,
					timingFunction: "linear",
					ellipsisEffect: "gradient",
					runOnlyOnEllipsisText: true,
					autoRun: false,
					snapListview: true
				},

				ListMarqueeStyle = function (listElement, options) {
					var self = this;

					self.options = objectUtils.fastMerge({}, defaults);
					objectUtils.fastMerge(self.options, options);

					self._listviewWidget = null;
					self._selectedMarqueeWidget = null;
					self.element = listElement;
				},

				prototype = ListMarqueeStyle.prototype;

			/**
			 * Destroy previous Marquee and create new.
			 * @method _instanceMarquee
			 * @protected
			 * @member ns.helper.SnapListMarqueeStyle
			 */
			prototype._instanceMarquee = function () {
				var self = this,
					marqueeElement = self._marqueeElement,
					selectedMarqueeWidget;

				self._destroyMarqueeWidget();

				if (marqueeElement) {
					selectedMarqueeWidget = engine.instanceWidget(marqueeElement, "Marquee", self.options);
					selectedMarqueeWidget.start();
					self._marqueeElement = null;
					self._selectedMarqueeWidget = selectedMarqueeWidget;
				}
			};

			/**
			 * Handler for click event on rectangle version
			 * @method _clickHandlerForRectangular
			 * @param {Event} event
			 * @protected
			 * @member ns.helper.SnapListMarqueeStyle
			 */
			prototype._clickHandlerForRectangular = function (event) {
				var self = this,
					eventTarget = event.target,
					selectedMarqueeWidget = self._selectedMarqueeWidget;

				if (selectedMarqueeWidget &&
					eventTarget.parentElement === selectedMarqueeWidget.element) {
					if (selectedMarqueeWidget._state === "running") {
						selectedMarqueeWidget.reset();
					} else {
						selectedMarqueeWidget.start();
					}
				} else {
					if (eventTarget && eventTarget.classList.contains("ui-marquee")) {
						self._marqueeElement = eventTarget;
						requestAnimationFrame(self._instanceMarquee.bind(self));
					}
				}
			};

			/**
			 * Handler for scroll event on rectangular version
			 * @method _scrollHandlerForRectangular
			 * @member ns.helper.SnapListMarqueeStyle
			 * @protected
			 */
			prototype._scrollHandlerForRectangular = function () {
				this._destroyMarqueeWidget();
			};

			/**
			 * Destroy Marquee widget on element
			 * @method _destroyMarqueeWidget
			 * @member ns.helper.SnapListMarqueeStyle
			 * @protected
			 */
			prototype._destroyMarqueeWidget = function () {
				var selectedMarqueeWidget = this._selectedMarqueeWidget;

				if (selectedMarqueeWidget) {
					selectedMarqueeWidget.stop();
					selectedMarqueeWidget.reset();
					selectedMarqueeWidget.destroy();
					this._selectedMarqueeWidget = null;
				}
			};

			/**
			 * Handler for touch start event
			 * @method _touchStartHandler
			 * @protected
			 * @member ns.helper.SnapListMarqueeStyle
			 */
			prototype._touchStartHandler = function () {
				if (this._selectedMarqueeWidget) {
					this._selectedMarqueeWidget.reset();
				}
			};

			/**
			 * Handler for scrollend event
			 * @method _scrollEndHandler
			 * @member ns.helper.SnapListMarqueeStyle
			 * @protected
			 */
			prototype._scrollEndHandler = function () {
				this._destroyMarqueeWidget();
			};

			/**
			 * Handler for selected event
			 * @method _selectedHandler
			 * @param {Event} event
			 * @protected
			 * @member ns.helper.SnapListMarqueeStyle
			 */
			prototype._selectedHandler = function (event) {
				var self = this,
					marqueeElement = event.target.querySelector(".ui-marquee");

				if (marqueeElement) {
					self._marqueeElement = marqueeElement;
					requestAnimationFrame(self._instanceMarquee.bind(self));
				}
			};

			/**
			 * Handler for all events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.helper.SnapListMarqueeStyle
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "click":
						self._clickHandlerForRectangular(event);
						break;
					case "scroll":
						self._scrollHandlerForRectangular(event);
						break;
					case "rotarydetent":
					case "touchstart":
						self._touchStartHandler(event);
						break;
					case "scrollend":
						self._scrollEndHandler(event);
						break;
					case "selected":
						self._selectedHandler(event);
						break;
				}
			};

			/**
			 * Init helper
			 * @method init
			 * @member ns.helper.SnapListMarqueeStyle
			 */
			prototype.init = function () {
				var self = this,
					listElement = self.element,
					listWidgetName,
					options = self.options;

				options.delay = options.delay || options.marqueeDelay;

				if (ns.support.shape.circle) {
					self._bindEventsForCircular();
				} else {
					self._bindEventsForRectangular();
					options.snapListview = false;
				}
				// create SnapListStyle helper
				if (options.snapListview) {
					listWidgetName = "SnapListview";
				} else {
					listWidgetName = "Listview";
				}
				self._listviewWidget = engine.instanceWidget(listElement, listWidgetName, options);
			};

			/**
			 * Bind events for rectangle version
			 * @method _bindEventsForRectangular
			 * @protected
			 * @member ns.helper.SnapListMarqueeStyle
			 */
			prototype._bindEventsForRectangular = function () {
				document.addEventListener("click", this, false);
				document.addEventListener("scroll", this, true);
			};

			/**
			 * Unbind events for rectangle version
			 * @method _unbindEventsForRectangular
			 * @protected
			 * @member ns.helper.SnapListMarqueeStyle
			 */
			prototype._unbindEventsForRectangular = function () {
				document.removeEventListener("click", this, false);
				document.removeEventListener("scroll", this, true);
			};

			/**
			 * Bind events for circular version
			 * @method _bindEventsForCircular
			 * @protected
			 * @member ns.helper.SnapListMarqueeStyle
			 */
			prototype._bindEventsForCircular = function () {
				var self = this;

				document.addEventListener("touchstart", self, false);
				document.addEventListener("scrollend", self, false);
				document.addEventListener("rotarydetent", self, false);
				document.addEventListener("selected", self, false);
			};

			/**
			 * Unbind events for circular version
			 * @method _unbindEventsForCircular
			 * @protected
			 * @member ns.helper.SnapListMarqueeStyle
			 */
			prototype._unbindEventsForCircular = function () {
				var self = this;

				document.removeEventListener("touchstart", self, false);
				document.removeEventListener("scrollend", self, false);
				document.removeEventListener("rotarydetent", self, false);
				document.removeEventListener("selected", self, false);

			};

			/**
			 * Destroy helper and all widgets
			 * @method destroy
			 * @member ns.helper.SnapListMarqueeStyle
			 */
			prototype.destroy = function () {
				var self = this;

				if (ns.support.shape.circle) {
					self._unbindEventsForCircular();
				} else {
					self._unbindEventsForRectangular();
				}

				self._destroyMarqueeWidget();

				if (self._listviewWidget) {
					self._listviewWidget.destroy();
					self._listviewWidget = null;
				}

				self.options = null;
			};

			ListMarqueeStyle.create = function (listElement, options) {
				var instance = new ListMarqueeStyle(listElement, options);

				instance.init();
				return instance;
			};

			helper.SnapListMarqueeStyle = ListMarqueeStyle;
			helper.ListMarqueeStyle = ListMarqueeStyle;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ListMarqueeStyle;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
