/*global window, ns, define, ns */
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
 * #Drawer Widget
 * Core Drawer widget is a base for creating Drawer widgets for profiles. It
 * provides drawer functionality - container with ability to open and close with
 * an animation.
 *
 * ### Positioning Drawer left / right (option)
 * To change position of a Drawer please set data-position attribute of Drawer
 * element to:
 *
 * - left (left position, default)
 * - right (right position)
 *
 * ##Opening / Closing Drawer
 * To open / close Drawer one can use open() and close() methods.
 *
 * ##Checking if Drawer is opened.
 * To check if Drawer is opened use widget`s isOpen() method.
 *
 * ##Creating widget
 * Core drawer is a base class - examples of creating widgets are described in
 * documentation of profiles
 *
 * @class ns.widget.core.Drawer
 * @component-selector .ui-drawer, [data-role]="drawer"
 * @extends ns.widget.BaseWidget
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../util/selectors",
			"../../util/DOM/css",
			"../../event",
			"../../event/gesture",
			"../../history",
			"../core", // fetch namespace
			"./Page",
			"../BaseWidget"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * @property {Object} selectors Alias for class ns.util.selectors
				 * @member ns.widget.core.Drawer
				 * @private
				 * @static
				 * @readonly
				 */
				selectors = ns.util.selectors,
				utilDOM = ns.util.DOM,
				events = ns.event,
				history = ns.history,
				Gesture = ns.event.gesture,
				Page = ns.widget.core.Page,
				STATE = {
					CLOSED: "closed",
					OPENED: "opened",
					SLIDING: "sliding",
					SETTLING: "settling"
				},
				/**
				 * Events
				 * @event draweropen Event triggered then the drawer is opened.
				 * @event drawerclose Event triggered then the drawer is closed.
				 * @member ns.widget.core.Drawer
				 */
				CUSTOM_EVENTS = {
					OPEN: "draweropen",
					CLOSE: "drawerclose"
				},
				/**
				 * Default values
				 */
				DEFAULT = {
					WIDTH: 240,
					DURATION: 300,
					POSITION: "left"
				},
				/**
				 * Drawer constructor
				 * @method Drawer
				 */
				Drawer = function () {
					var self = this;
					/**
					 * Drawer field containing options
					 * @property {string} options.position Position of Drawer ("left" or "right")
					 * @property {number} options.width Width of Drawer
					 * @property {number} options.duration Duration of Drawer entrance animation
					 * @property {boolean} options.closeOnClick If true Drawer will be closed on overlay
					 * @property {boolean} options.overlay Sets whether to show an overlay when Drawer is open.
					 * @property {string} options.drawerTarget Set drawer target element as the css selector
					 * @property {boolean} options.enable Enable drawer component
					 * @property {number} options.dragEdge Set the area that can open the drawer as drag gesture in drawer target element
					 * @member ns.widget.core.Drawer
					 */

					self.options = {
						position: DEFAULT.POSITION,
						width: DEFAULT.WIDTH,
						duration: DEFAULT.DURATION,
						closeOnClick: true,
						overlay: true,
						drawerTarget: "." + Page.classes.uiPage,
						enable: true,
						dragEdge: 1
					};

					self._pageSelector = null;

					self._isDrag = false;
					self._state = STATE.CLOSED;
					self._settlingType = STATE.CLOSED;
					self._translatedX = 0;

					self._ui = {};

					self._eventBoundElement = null;
					self._drawerOverlay = null;
				},
				/**
				 * Dictionary object containing commonly used widget classes
				 * @property {Object} classes
				 * @member ns.widget.core.Drawer
				 * @private
				 * @static
				 * @readonly
				 */
				classes = {
					page: Page.classes.uiPage,
					drawer: "ui-drawer",
					left: "ui-drawer-left",
					right: "ui-drawer-right",
					overlay: "ui-drawer-overlay",
					open: "ui-drawer-open",
					close: "ui-drawer-close"
				},
				/**
				 * {Object} Drawer widget prototype
				 * @member ns.widget.core.Drawer
				 * @private
				 * @static
				 */
				prototype = new BaseWidget();

			Drawer.prototype = prototype;
			Drawer.classes = classes;

			/**
			 * Unbind drag events
			 * @method unbindDragEvents
			 * @param {Object} self
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			function unbindDragEvents(self, element) {
				var overlayElement = self._ui.drawerOverlay;

				events.disableGesture(element);
				events.off(element, "drag dragstart dragend dragcancel swipe swipeleft swiperight vmouseup", self, false);
				events.prefixedFastOff(self.element, "transitionEnd", self, false);
				events.off(window, "resize", self, false);
				if (overlayElement) {
					events.off(overlayElement, "vclick", self, false);
				}
			}

			/**
			 * Bind drag events
			 * @method bindDragEvents
			 * @param {Object} self
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			function bindDragEvents(self, element) {
				var overlayElement = self._ui.drawerOverlay;

				self._eventBoundElement = element;

				events.enableGesture(
					element,

					new Gesture.Drag(),
					new Gesture.Swipe({
						orientation: Gesture.Orientation.HORIZONTAL
					})
				);

				events.on(element, "drag dragstart dragend dragcancel swipe swipeleft swiperight vmouseup", self, false);
				events.prefixedFastOn(self.element, "transitionEnd", self, false);
				events.on(window, "resize", self, false);
				if (overlayElement) {
					events.on(overlayElement, "vclick", self, false);
				}
			}

			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.Drawer
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
						self._onDragEnd(event);
						break;
					case "dragcancel":
						self._onDragCancel(event);
						break;
					case "vmouseup":
						self._onMouseup(event);
						break;
					case "swipe":
					case "swipeleft":
					case "swiperight":
						self._onSwipe(event);
						break;
					case "vclick":
						self._onClick(event);
						break;
					case "transitionend":
					case "webkitTransitionEnd":
					case "mozTransitionEnd":
					case "oTransitionEnd":
					case "msTransitionEnd":
						self._onTransitionEnd(event);
						break;
					case "resize":
						self._onResize(event);
						break;
				}
			};

			/**
			 * MouseUp event handler
			 * @method _onMouseup
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._onMouseup = function () {
				var self = this;

				if (self._state === STATE.SLIDING) {
					self.close();
				}
			};
			/**
			 * Click event handler
			 * @method _onClick
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._onClick = function () {
				var self = this;

				if (self._state === STATE.OPENED) {
					self.close();
				}
			};

			/**
			 * Resize event handler
			 * @method _onResize
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._onResize = function () {
				var self = this;
				// resize event handler

				self._refresh();
			};

			/**
			 * webkitTransitionEnd event handler
			 * @method _onTransitionEnd
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._onTransitionEnd = function () {
				var self = this,
					position = self.options.position,
					drawerOverlay = self._drawerOverlay;

				if (self._state === STATE.SETTLING) {
					if (self._settlingType === STATE.OPENED) {
						self.trigger(CUSTOM_EVENTS.OPEN, {
							position: position
						});
						self._setActive(true);
						self._state = STATE.OPENED;
					} else {
						self.close();
						self.trigger(CUSTOM_EVENTS.CLOSE, {
							position: position
						});
						self._setActive(false);
						self._state = STATE.CLOSED;
						if (drawerOverlay) {
							drawerOverlay.style.visibility = "hidden";
						}
					}
				}
			};

			/**
			 * Swipe event handler
			 * @method _onSwipe
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Drawer
			 */
			prototype._onSwipe = function (event) {
				var self = this,
					direction,
					options = self.options;

				// Now mobile has two swipe event
				if (event.detail) {
					direction = event.detail.direction === "left" ? "right" : "left";
				} else if (event.type === "swiperight") {
					direction = "left";
				} else if (event.type === "swipeleft") {
					direction = "right";
				}
				if (options.enable && self._isDrag && options.position === direction) {
					self.open();
					self._isDrag = false;
				}
			};
			/**
			 * Dragstart event handler
			 * @method _onDragStart
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Drawer
			 */
			prototype._onDragStart = function (event) {
				var self = this;

				if (self._state === STATE.OPENED) {
					return;
				}
				if (self.options.enable && !self._isDrag && self._state !== STATE.SETTLING && self._checkSideEdge(event)) {
					self._isDrag = true;
				} else {
					self.close();
				}
			};
			/**
			 * Drag event handler
			 * @method _onDrag
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Drawer
			 */
			prototype._onDrag = function (event) {
				var self = this,
					deltaX = event.detail.deltaX,
					options = self.options,
					translatedX = self._translatedX,
					movedX;

				if (options.enable && self._isDrag && self._state !== STATE.SETTLING) {
					if (options.position === "left") {
						movedX = -options.width + deltaX + translatedX;
						if (movedX < 0) {
							self._translate(movedX, 0);
						}
					} else {
						movedX = window.innerWidth + deltaX - translatedX;
						if (movedX > 0 && movedX > window.innerWidth - options.width) {
							self._translate(movedX, 0);
						}
					}
				}
			};
			/**
			 * DragEnd event handler
			 * @method _onDragEnd
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Drawer
			 */
			prototype._onDragEnd = function (event) {
				var self = this,
					options = self.options,
					detail = event.detail;

				if (options.enable && self._isDrag) {
					if (Math.abs(detail.deltaX) > options.width / 2) {
						self.open();
					} else if (self._state !== STATE.SETTLING) {
						self.close();
					}
				}
				self._isDrag = false;
			};

			/**
			 * DragCancel event handler
			 * @method _onDragCancel
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._onDragCancel = function () {
				var self = this;

				if (self.options.enable && self._isDrag) {
					self.close();
				}
				self._isDrag = false;
			};
			/**
			 * Drawer translate function
			 * @method _translate
			 * @param {number} x
			 * @param {number} duration
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._translate = function (x, duration) {
				var self = this,
					element = self.element;

				if (self._state !== STATE.SETTLING) {
					self._state = STATE.SLIDING;
				}

				if (duration) {
					utilDOM.setPrefixedStyle(element, "transition", utilDOM.getPrefixedValue("transform " + duration / 1000 + "s ease-out"));
				}

				// there should be a helper for this :(
				utilDOM.setPrefixedStyle(element, "transform", "translate3d(" + x + "px, 0px, 0px)");
				if (self.options.overlay) {
					self._setOverlay(x);
				}
				if (!duration) {
					self._onTransitionEnd();
				}

			};

			/**
			 * Set overlay opacity and visibility
			 * @method _setOverlay
			 * @param {number} x
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._setOverlay = function (x) {
				var self = this,
					options = self.options,
					overlay = self._ui.drawerOverlay,
					overlayStyle = overlay.style,
					absX = Math.abs(x),
					ratio = options.position === "right" ? absX / window.innerWidth : absX / options.width;

				if (ratio < 1) {
					overlayStyle.visibility = "visible";
				} else {
					overlayStyle.visibility = "hidden";
				}
				overlayStyle.opacity = 1 - ratio;
			};

			/**
			 * Set active status in drawer router
			 * @method _setActive
			 * @param {boolean} active
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._setActive = function (active) {
				var self = this,
					route = ns.router.getInstance().getRoute("drawer");

				if (active) {
					route.setActive(self);
				} else {
					route.setActive(null);
				}
			};

			/**
			 * Build structure of Drawer widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					targetElement;

				element.classList.add(classes.drawer);
				element.style.top = 0;
				targetElement = selectors.getClosestBySelector(element, options.drawerTarget);

				if (targetElement) {
					targetElement.appendChild(element);
					targetElement.style.overflowX = "hidden";
				}

				if (self.options.overlay) {
					ui.drawerOverlay = self._createOverlay(element);
					ui.drawerOverlay.style.visibility = "hidden";
				}

				if (!ui.placeholder) {
					ui.placeholder = document.createComment(element.id + "-placeholder");
					element.parentNode.insertBefore(ui.placeholder, element);
				}
				ui.targetElement = targetElement;
				return element;
			};

			/**
			 * Initialization of Drawer widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self._ui;

				ui.drawerPage = selectors.getClosestByClass(element, classes.page);
				ui.drawerPage.style.overflowX = "hidden";
				self._initLayout();
				return element;
			};

			/**
			 * init Drawer widget layout
			 * @method _initLayout
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._initLayout = function () {
				var self = this,
					options = self.options,
					element = self.element,
					elementStyle = element.style,
					ui = self._ui,
					overlayStyle = ui.drawerOverlay ? ui.drawerOverlay.style : null,
					height;

				options.width = options.width || ui.targetElement.offsetWidth;
				height = ui.targetElement.offsetHeight;

				elementStyle.width = (options.width !== 0) ? options.width + "px" : "100%";
				elementStyle.height = (height !== 0) ? height + "px" : "100%";
				elementStyle.top = "0";

				if (overlayStyle) {
					overlayStyle.width = window.innerWidth + "px";
					overlayStyle.height = window.innerHeight + "px";
					overlayStyle.top = 0;
				}
				if (options.position === "right") {
					element.classList.add(classes.right);
					self._translate(window.innerWidth, 0);
				} else {
					// left or default
					element.classList.add(classes.left);
					self._translate(-options.width, 0);
				}

				self._state = STATE.CLOSED;
			};

			/**
			 * Provides translation if position is set to right
			 * @method _translateRight
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._translateRight = function () {
				var self = this,
					options = self.options;

				if (options.position === "right") {
					// If drawer position is right, drawer should be moved right side
					if (self._state === STATE.OPENED) {
						// drawer opened
						self._translate(window.innerWidth - options.width, 0);
					} else {
						// drawer closed
						self._translate(window.innerWidth, 0);
					}
				}
			};

			/**
			 * Check dragstart event whether triggered on side edge area or not
			 * @method _checkSideEdge
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Drawer
			 */
			prototype._checkSideEdge = function (event) {
				var self = this,
					detail = event.detail,
					eventClientX = detail.pointer.clientX - detail.estimatedDeltaX,
					options = self.options,
					position = options.position,
					boundElement = self._eventBoundElement,
					boundElementOffsetWidth = boundElement.offsetWidth,
					boundElementRightEdge = boundElement.offsetLeft + boundElementOffsetWidth,
					dragStartArea = boundElementOffsetWidth * options.dragEdge;

				return ((position === "left" && eventClientX > 0 && eventClientX < dragStartArea) ||
				(position === "right" && eventClientX > boundElementRightEdge - dragStartArea &&
				eventClientX < boundElementRightEdge));
			};
			/**
			 * Refreshes Drawer widget
			 * @method _refresh
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._refresh = function () {
				// Drawer layout has been set by parent element layout
				var self = this;

				self._translateRight();
				self._initLayout();
			};
			/**
			 * Creates Drawer overlay element
			 * @method _createOverlay
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._createOverlay = function (element) {
				var overlayElement = document.createElement("div");

				overlayElement.classList.add(classes.overlay);
				element.parentNode.insertBefore(overlayElement, element);

				return overlayElement;
			};

			/**
			 * Binds events to a Drawer widget
			 * @method _bindEvents
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._bindEvents = function () {
				var self = this,
					targetElement = self._ui.targetElement;

				bindDragEvents(self, targetElement);
			};

			/**
			 * Enable Drawer widget
			 * @method _enable
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._enable = function () {
				this._oneOption("enable", true);
			};

			/**
			 * Disable Drawer widget
			 * @method _disable
			 * @protected
			 * @member ns.widget.core.Drawer
			 */
			prototype._disable = function () {
				this._oneOption("enable", false);
			};

			/**
			 * Checks Drawer status
			 * @method isOpen
			 * @member ns.widget.core.Drawer
			 * @return {boolean} Returns true if Drawer is open
			 */
			prototype.isOpen = function () {
				return (this._state === STATE.OPENED);
			};

			/**
			 * Opens Drawer widget
			 * @method open
			 * @param {number} [duration] Duration for opening, if is not set then method take value from options
			 * @member ns.widget.core.Drawer
			 */
			prototype.open = function (duration) {
				var self = this,
					options = self.options,
					drawerClassList = self.element.classList,
					drawerOverlay = self._ui.drawerOverlay;

				if (self._state !== STATE.OPENED) {
					self._state = STATE.SETTLING;
					self._settlingType = STATE.OPENED;
					duration = duration !== undefined ? duration : options.duration;
					if (drawerOverlay) {
						drawerOverlay.style.visibility = "visible";
					}
					drawerClassList.remove(classes.close);
					drawerClassList.add(classes.open);
					if (options.position === "left") {
						self._translate(0, duration);
					} else {
						self._translate(window.innerWidth - options.width, duration);
					}
				}
			};

			/**
			 * Closes Drawer widget
			 * @requires mobile wearable
			 *
			 *
			 * @method close
			 * @param {Object} options This value is router options whether reverse or not.
			 * @param {number} [duration] Duration for closing, if is not set then method take value from options
			 * @member ns.widget.core.Drawer
			 */
			prototype.close = function (options, duration) {
				var self = this,
					reverse = options ? options.reverse : false,
					selfOptions = self.options,
					drawerClassList = self.element.classList;

				if (self._state !== STATE.CLOSED) {
					if (!reverse && self._state === STATE.OPENED && !ns.getConfig("disableRouter")) {
						// This method was fired by JS code or this widget.
						history.back();
						return;
					}
					self._state = STATE.SETTLING;
					self._settlingType = STATE.CLOSED;
					duration = duration !== undefined ? duration : selfOptions.duration;
					drawerClassList.remove(classes.open);
					drawerClassList.add(classes.close);
					if (selfOptions.position === "left") {
						self._translate(-selfOptions.width, duration);
					} else {
						self._translate(window.innerWidth, duration);
					}
				}
			};

			/**
			 * Set Drawer drag handler.
			 * If developer use handler, drag event is bound at handler only.
			 * @method setDragHandler
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Drawer
			 */
			prototype.setDragHandler = function (element) {
				var self = this;

				self.options.dragEdge = 1;
				unbindDragEvents(self, self._eventBoundElement);
				bindDragEvents(self, element);
			};

			/**
			 * Transition Drawer widget.
			 * This method use only positive integer number.
			 * @method transition
			 * @param {number} position
			 * @member ns.widget.core.Drawer
			 */
			prototype.transition = function (position) {
				var self = this,
					options = self.options;

				if (options.position === "left") {
					self._translate(-options.width + position, options.duration);
				} else {
					self._translate(options.width - position, options.duration);
				}
				self._translatedX = position;
			};

			/**
			 * Get state of Drawer widget.
			 */
			prototype.getState = function () {
				return this._state;
			};
			/**
			 * Destroys Drawer widget
			 * @method _destroy
			 * @member ns.widget.core.Drawer
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this,
					ui = self._ui,
					drawerOverlay = ui.drawerOverlay,
					placeholder = ui.placeholder,
					placeholderParent = placeholder.parentNode,
					element = self.element;

				placeholderParent.insertBefore(element, placeholder);
				placeholderParent.removeChild(placeholder);

				if (drawerOverlay) {
					drawerOverlay.removeEventListener("vclick", self._onClickBound, false);
				}
				unbindDragEvents(self, self._eventBoundElement);
			};

			ns.widget.core.Drawer = Drawer;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Drawer;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
