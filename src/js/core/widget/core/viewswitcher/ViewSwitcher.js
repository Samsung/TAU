/*global window, ns, define */
/*jslint nomen: true */
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
/**
 * #ViewSwitcher
 * Shows a viewswitcher that controls each view elements.
 *
 * ViewSwitcher component is controller for each view elements is changing position.
 * This component managed to animation, views position, events and get/set active view index.
 * If you want to change the view as various animating, you should wrap views as the ViewSwitcher element then
 * ViewSwitcher would set views position and start to manage to gesture event.
 *
 * ##Set and Get the active index
 * You can set or get the active index as the setActiveIndex() and getActiveIndex()
 *
 * @class ns.widget.core.viewswitcher.ViewSwitcher
 * @extends ns.widget.BaseWidget
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../util/selectors",
			"../../../util/DOM/css",
			"../../../util/object",
			"../../../event/gesture",
			"../../../event",
			"../../core", // fetch namespace
			"../../BaseWidget",
			"../viewswitcher",
			"./animation/carousel"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				events = ns.event,
				engine = ns.engine,
				utilsObject = ns.util.object,
				Gesture = ns.event.gesture,
				cancelAnimationFrame = ns.util.cancelAnimationFrame,
				requestAnimationFrame = ns.util.requestAnimationFrame,
				/**
				 * Default values
				 */
				DEFAULT = {
					ACTIVE_INDEX: 0,
					ANIMATION_TYPE: "carousel",
					ANIMATION_SPEED: 30,
					ANIMATION_TIMING_FUNCTION: "ease-out"
				},
				/**
				 * ViewSwitcher triggered some customEvents
				 * viewchangestart : This event has been triggered when view changing started.
				 * viewchangeend : This event has been triggered when view changing ended.
				 * viewchange: This event has been triggered when view changing complete to user.
				 */
				EVENT_TYPE = {
					CHANGE_START: "viewchangestart",
					CHANGE_END: "viewchangeend",
					CHANGE: "viewchange"
				},
				/**
				 * ViewSwitcher constructor
				 * @method ViewSwitcher
				 */
				ViewSwitcher = function () {
					var self = this;

					self.options = {};
					self._ui = {};
				},
				/**
				 * Dictionary object containing commonly used widget classes
				 * @property {Object} classes
				 * @member ns.widget.core.viewswitcher.ViewSwitcher
				 * @private
				 * @static
				 * @readonly
				 */
				classes = {
					VIEW: "ui-view",
					VIEW_ACTIVE: "ui-view-active",
					ANIMATION_TYPE: "ui-animation-"
				},
				/**
				 * {Object} ViewSwitcher widget prototype
				 * @member ns.widget.core.viewswitcher.ViewSwitcher
				 * @private
				 * @static
				 */
				prototype = new BaseWidget();

			ViewSwitcher.prototype = prototype;
			ViewSwitcher.classes = classes;

			/**
			 * Configure of ViewSwitcher component
			 * @method _configure
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 * @protected
			 */
			prototype._configure = function () {
				var self = this;

				/**
				 * ViewSwitcher containing some options
				 * @property {number} ViewSwitcher default active index (Default is 0)
				 * @property {string} ViewSwitcher animation type (Default is "carousel")
				 * @property {number} ViewSwitcher animation speed (Default is 18)
				 */
				self.options = utilsObject.merge(self.options, {
					active: DEFAULT.ACTIVE_INDEX,
					animationType: DEFAULT.ANIMATION_TYPE,
					animationSpeed: DEFAULT.ANIMATION_SPEED
				});
			};
			/**
			 * Build structure of ViewSwitcher component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 * @protected
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui;

				ui._views = element.querySelectorAll("." + classes.VIEW);
				return element;
			};

			/**
			 * Initialization of ViewSwitcher component
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 * @protected
			 */
			prototype._init = function (element) {
				var self = this;

				self._elementOffsetWidth = element.offsetWidth;
				self._initPosition();

				return element;
			};

			/**
			 * Init position of Views inner ViewSwitcher
			 * @method _initPosition
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 * @protected
			 */
			prototype._initPosition = function () {
				var self = this,
					views = self._ui._views,
					options = self.options,
					activeIndex = self._getActiveIndex();

				self._type = ns.widget.core.viewswitcher.animation[options.animationType];
				self._type.initPosition(views, activeIndex);
				self._activeIndex = activeIndex;
			};

			/**
			 * Get the active index as view has the "ui-view-active" or not
			 * @method _getActiveIndex
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 * @protected
			 */
			prototype._getActiveIndex = function () {
				var self = this,
					ui = self._ui,
					views = ui._views,
					i,
					len;

				len = views.length;
				for (i = 0; i < len; i++) {
					if (views[i].classList.contains(classes.VIEW_ACTIVE)) {
						return i;
					}
				}
				return self.options.active;
			};

			/**
			 * Binds events to a ViewSwitcher component
			 * @method _bindEvents
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 * @protected
			 */
			prototype._bindEvents = function () {
				var self = this,
					element = self.element;

				events.enableGesture(
					element,
					new events.gesture.Drag({
						blockVertical: true,
						threshold: 0
					}),
					new events.gesture.Swipe({
						orientation: Gesture.Orientation.HORIZONTAL
					})
				);
				events.on(element, "drag dragstart dragend swipe", self, false);

			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "drag":
						self._onDrag(event);
						break;
					case "dragstart":
						self._onDragStart(event);
						break;
					case "dragend":
					case "swipe":
						self._onDragEnd(event);
						break;
				}
			};

			/**
			 * Drag event handler
			 * @method _onDrag
			 * @param {Event} event
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 * @protected
			 */
			prototype._onDrag = function (event) {
				var self = this,
					direction = event.detail.direction,
					ex = event.detail.estimatedDeltaX,
					deltaX = ex / self._elementOffsetWidth * 100,
					ui = self._ui,
					active = ui._views[self._activeIndex];

				if ((direction === "left" && !active.nextElementSibling) || (direction === "right" && !active.previousElementSibling)) {
					return;
				}
				if (self._dragging && !self._isAnimating && Math.abs(deltaX) < 100) {
					self._type.animate(ui._views, self._activeIndex, deltaX);
					self._triggerChange(deltaX);
				}
			};

			/**
			 * DragStart event handler
			 * @method _onDragStart
			 * @param {Event} event
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 * @protected
			 */
			prototype._onDragStart = function (event) {
				var self = this,
					direction = event.detail.direction,
					ui = self._ui,
					active = ui._views[self._activeIndex];

				if ((direction === "left" && !active.nextElementSibling) || (direction === "right" && !active.previousElementSibling) || self._dragging) {
					return;
				}
				self._dragging = true;
			};

			/**
			 * DragEnd event handler
			 * @method _onDragEnd
			 * @param {Event} event
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 * @protected
			 */
			prototype._onDragEnd = function (event) {
				var self = this,
					ui = self._ui,
					active = ui._views[self._activeIndex],
					direction = event.detail.direction,
					estimatedDeltaX = event.detail.estimatedDeltaX;

				if (!self._dragging ||
					self._isAnimating ||
					(direction === "left" && !active.nextElementSibling) ||
					(direction === "right" && !active.previousElementSibling)) {
					return;
				}
				self._lastDirection = direction;
				if (event.type === "dragend" && Math.abs(estimatedDeltaX) < self._elementOffsetWidth / 2) {
					direction = "backward";
				}
				self.trigger(EVENT_TYPE.CHANGE_START);
				self._requestFrame(estimatedDeltaX, direction);
			};

			prototype._triggerChange = function (estimatedDeltaX) {
				var self = this,
					absEx = Math.abs(estimatedDeltaX);

				if (absEx > 50 && !self._changed) {
					self.trigger(EVENT_TYPE.CHANGE, {
						index: self._activeIndex + (estimatedDeltaX < 0 ? 1 : -1)
					});
					self._changed = true;
				} else if (absEx < 50 && self._changed) {
					self.trigger(EVENT_TYPE.CHANGE, {
						index: self._activeIndex
					});
					self._changed = false;
				}
			};
			/**
			 * Animate views as the requestAnimationFrame.
			 * @method _requestFrame
			 * @param {number} estimatedDeltaX
			 * @param {string} direction
			 * @param {string} animationTiming timing type (ease-out|linear)
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 * @protected
			 */
			prototype._requestFrame = function (estimatedDeltaX, direction, animationTiming) {
				var self = this,
					elementOffsetWidth = self._elementOffsetWidth,
					animationTimingFunction = animationTiming ? animationTiming : DEFAULT.ANIMATION_TIMING_FUNCTION,
					isStop = false,
					lastDirection = self._lastDirection,
					ui = self._ui,
					ex = estimatedDeltaX,
					deltaX = ex / elementOffsetWidth * 100,
					animationFrame = self._animationFrame,
					validDirection,
					stopPosition,
					mark;

				if (direction === "backward") {
					validDirection = lastDirection === "left" ? "right" : "left";
					if (lastDirection === "left" && ex > 0 || lastDirection === "right" && ex < 0) {
						isStop = true;
						stopPosition = 0;
					}
				} else {
					validDirection = direction;
					if (Math.abs(ex) > elementOffsetWidth) {
						isStop = true;
						stopPosition = 100;
					}
				}
				mark = validDirection === "left" ? -1 : 1;
				if (isStop) {
					self._type.animate(ui._views, self._activeIndex, stopPosition * mark);
					cancelAnimationFrame(animationFrame);
					if (direction !== "backward") {
						ui._views[self._activeIndex].classList.remove(classes.VIEW_ACTIVE);
						self._activeIndex = self._activeIndex - mark;
						self._type.resetPosition(ui._views, self._activeIndex);
						ui._views[self._activeIndex].classList.add(classes.VIEW_ACTIVE);
					}
					self._dragging = false;
					self._isAnimating = false;
					self._changed = false;
					self.trigger(EVENT_TYPE.CHANGE_END);
					return;
				}
				self._type.animate(ui._views, self._activeIndex, deltaX);
				self._triggerChange(deltaX);
				self._isAnimating = true;

				if (animationTimingFunction === "ease-out") {
					if (Math.abs(ex) > elementOffsetWidth * 0.95) {
						ex = ex + mark;
					} else {
						ex = ex + self.options.animationSpeed * mark;
					}
				} else if (animationTimingFunction === "linear") {
					ex = ex + self.options.animationSpeed * mark;
				}
				self._animationFrame = requestAnimationFrame(self._requestFrame.bind(self, ex, direction, animationTiming));
			};
			/**
			 * Set the active view
			 * @method setActiveIndex
			 * @param {number} index
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 * @public
			 */
			prototype.setActiveIndex = function (index) {
				var self = this,
					latestActiveIndex = self._activeIndex,
					interval = latestActiveIndex - index,
					direction,
					i,
					len;

				if (!self._isAnimating && index < self._ui._views.length && index >= 0) {
					self._lastDeltaX = 0;
					if (interval < 0) {
						direction = "left";
					} else {
						direction = "right";
					}
					len = Math.abs(interval);
					self._lastDirection = direction;
					for (i = 0; i < len; i++) {
						self.trigger(EVENT_TYPE.CHANGE_START);
						self._requestFrame(0, direction, "linear");
					}
				}
			};

			/**
			 * Get the active view index
			 * @method getActiveIndex
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 * @public
			 */
			prototype.getActiveIndex = function () {
				return this._activeIndex;
			};
			/**
			 * Destroys ViewSwitcher widget
			 * @method _destroy
			 * @member ns.widget.core.viewswitcher.ViewSwitcher
			 * @protected
			 */
			prototype._destroy = function () {
				var element = this.element;

				events.disableGesture(element);
				events.off(element, "drag dragstart dragend", this, false);
				this.options = null;
				this._ui = null;
			};

			ns.widget.core.viewswitcher.ViewSwitcher = ViewSwitcher;

			engine.defineWidget(
				"ViewSwitcher",
				"[data-role='viewSwitcher'], .ui-view-switcher",
				[
					"setActiveIndex",
					"getActiveIndex"
				],
				ViewSwitcher
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
