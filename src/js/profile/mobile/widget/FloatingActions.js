/*global window, ns, define */
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
/*jslint nomen: true */
/**
 * # Floating Actions
 * Floating actions component creates a floating button at the bottom of the screen.
 *
 * ##Default Selectors
 * By default, all elements with the class="ui-floatingactions" or data-role="floatingactions" attribute are displayed as floating actions components.
 *
 * ##Manual constructor
 *      @example
 *      <div class="ui-floatingactions" id="floating">
 *          <button class="ui-floatingactions-item" data-icon="floating-add"/>
 *          <button class="ui-floatingactions-item" data-icon="floating-search"/>
 *      </div>
 *      <script>
 *          var elFloatingActions = document.getElementById("floating"),
 *                floatingActions = tau.widget.FloatingActions(elFloatingActions);
 *      </script>
 *
 * @since 2.4
 * @class ns.widget.mobile.FloatingActions
 * @component-selector .ui-floatingactions, [data-role]="floatingactions"
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/event",
			"../../../core/util/selectors",
			"../../../core/event/gesture",
			"../../../core/widget/core/Page",
			"../../../core/widget/BaseWidget",
			"../../../core/widget/core/Button",
			"../../../core/widget/BaseKeyboardSupport",
			"../widget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var BaseWidget = ns.widget.BaseWidget,
				PageClasses = ns.widget.core.Page.classes,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				KEY_CODES = BaseKeyboardSupport.KEY_CODES,
				engine = ns.engine,
				utilsEvents = ns.event,
				selectorUtils = ns.util.selectors,
				prototype = new BaseWidget(),
				MATRIX_REGEXP = /matrix\((.*), (.*), (.*), (.*), (.*), (.*)\)/,
				SNAP_WIDTH = 19,
				FloatingActions = function () {
					var self = this;

					BaseKeyboardSupport.call(self);
					self.element = null;
					self.options = {};
					self._style = null;
					self._startX = 0;
					self._currentX = 0;
					self._hasSingle = true;
					self._padding = {};
					self._position = {};
					self._scope = {};
				},
				WIDGET_CLASS = "ui-floatingactions",
				WIDGET_POSITION = [
					"left-min",
					"left-2nd-icon",
					"left-1st-icon",
					"center",
					"right-1st-icon",
					"right-2nd-icon",
					"right-min"
				],
				classes = {
					/**
					 * Standard floating actions widget
					 * @style ui-floatingactions
					 * @member ns.widget.mobile.FloatingActions
					 */
					WIDGET: WIDGET_CLASS,
					/**
					 * Enable transition for floating actions widget
					 * @style ui-floatingactions-transitions
					 * @member ns.widget.mobile.FloatingActions
					 */
					TRANSITIONS: WIDGET_CLASS + "-transitions",
					/**
					 * Expand floating actions to the left
					 * @style ui-floatingactions-expand-to-left
					 * @member ns.widget.mobile.FloatingActions
					 */
					EXPAND_TO_LEFT: WIDGET_CLASS + "-expand-to-left",
					/**
					 * Expand floating actions to the right
					 * @style ui-floatingactions-expand-to-right
					 * @member ns.widget.mobile.FloatingActions
					 */
					EXPAND_TO_RIGHT: WIDGET_CLASS + "-expand-to-right",
					/**
					 * Set page to implement floating actions
					 * @style ui-page-floatingactions
					 * @member ns.widget.mobile.FloatingActions
					 */
					PAGE_WITH_FLOATING_ACTIONS: "ui-page-floatingactions"
				};


			/**
			* Configure component
			* @method _configure
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._configure = function () {
				/**
				 * @property {Object} options Object with default options
				 * @property {number} [options.duration=300] animation duration for color and opacity (unit of time : millisecond)
				 * @property {string} [options.position='right-min'] widget position [right-min | right-1st-button | right-2nd-button | center | left-1st-button | left-2nd-button | left-min]
				 * @member ns.widget.mobile.FloatingActions
				 */
				this.options = {
					duration: 300,
					position: "right-1st-icon"
				};
			};

			/**
			* Init component
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._init = function (element) {
				var self = this;

				self._style = element.style;
				if (!self.element.hasAttribute("tabindex")) {
					self.element.setAttribute("tabindex", "0");
				}
				self._hasSingle = element.children.length <= 1;
				self._buildInsideButtons();
				self._positionCalculation();
				self._setScope();
				self._updatePosition();
				self._toggleParentClasses();
				return element;
			};

			/**
			* Bind events
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._bindEvents = function () {
				var self = this,
					element = self.element;

				utilsEvents.enableGesture(
					element,

					new utilsEvents.gesture.Drag({
						blockVertical: true
					})
				);

				utilsEvents.on(element, "drag dragstart dragend dragcancel touchstart touchend vmousedown vmouseup keyup", self);
			};

			/**
			* Unbind events
			* @method _unbindEvents
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._unbindEvents = function () {
				utilsEvents.disableGesture(this.element);
				utilsEvents.off(this.element, "drag dragstart dragend dragcancel touchstart touchend vmousedown vmouseup keyup", this);
			};

			/**
			* Refresh component
			* @method _refresh
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._refresh = function () {
				var self = this,
					element = self.element;

				self._hasSingle = element.children.length <= 1;

				self._positionCalculation();
				self._setScope();
				self._updatePosition();
			};

			/**
			* Destroy component
			* @method _destroy
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._destroy = function () {
				var self = this;

				if (self.isBound()) {
					self._unbindEvents();
					self._style = null;
					self._position = null;
					self._scope = null;
					self._padding = null;
					self._toggleParentClasses(true);
				}
			};

			prototype._buildInsideButtons = function () {
				var i = 0,
					self = this,
					element = self.element,
					elementChildren = element.children,
					length = elementChildren.length;

				for (; i < length; i++) {
					ns.widget.Button(elementChildren[i]);
				}
			};

			/**
			* Set position for move effect
			* @method _positionCalculation
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._positionCalculation = function () {
				var self = this,
					element = self.element,
					elementStyle = window.getComputedStyle(element),
					position = self._position,
					padding = self._padding,
					paddingLeft,
					paddingRight,
					elementWidth = element.offsetWidth;

				paddingLeft = parseInt(elementStyle.paddingLeft, 10);
				paddingLeft = parseInt(elementStyle.paddingLeft, 10);
				paddingRight = parseInt(elementStyle.paddingRight, 10);

				position.min = -window.innerWidth + paddingLeft;
				position.max = elementWidth - paddingRight;
				position.center = (position.max + position.min) / 2;
				position.left = position.min + elementWidth - (paddingLeft + paddingRight);
				position.leftOneButton = position.min + (position.left - position.min) / 2;
				position.right = position.max - elementWidth + (paddingRight + paddingLeft);
				position.rightOneButton = position.right + (position.max - position.right) / 2;

				padding.left = paddingLeft;
				padding.right = paddingRight;
				padding.ratioInShow = SNAP_WIDTH / (position.center - position.left);
				padding.ratioInHide = SNAP_WIDTH / (position.left - position.min);
			};

			/**
			* Set scope for move effect
			* @method _setScope
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._setScope = function () {
				var self = this,
					position = self._position,
					scope = self._scope,
					padding = self._padding,
					hasSingle = self._hasSingle;

				scope.min = position.min + padding.left / 2;
				scope.leftOneButton = !hasSingle ? position.min + (position.left - position.min) * 3 / 4 : null;
				scope.left = position.left + (position.center - position.left) / 2;
				scope.center = position.center + (position.right - position.center) / 2;
				scope.right = position.right + padding.right / 2;
				scope.rightOneButton = !hasSingle ? position.right + (position.max - position.right) * 3 / 4 : null;
				scope.max = position.max;
			};

			/**
			 * Dragstart event handler
			 * @method _start
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.mobile.FloatingActions
			 */
			prototype._start = function (event) {
				var self = this,
					element = self.element;

				self._startX = event.detail.pointer.clientX;
				// get current x value of translated3d
				self._currentX =
					parseInt(window.getComputedStyle(element).webkitTransform.match(MATRIX_REGEXP)[5], 10);
				element.classList.remove(classes.TRANSITIONS);
				self._clearExpandWidget();
			};

			prototype._clearExpandWidget = function () {
				var classList = this.element.classList;

				classList.remove(classes.EXPAND_TO_LEFT);
				classList.remove(classes.EXPAND_TO_RIGHT);
			};

			prototype._expandWidget = function (name) {
				var self = this,
					classList = self.element.classList;

				switch (name) {
					case "left-min" :
					case "left-1st-icon" :
					case "left-2nd-icon" :
						classList.add(classes.EXPAND_TO_LEFT);
						classList.remove(classes.EXPAND_TO_RIGHT);
						break;
					case "center" :
						self._clearExpandWidget();
						break;
					case "right-min" :
					case "right-1st-icon" :
					case "right-2nd-icon" :
						classList.remove(classes.EXPAND_TO_LEFT);
						classList.add(classes.EXPAND_TO_RIGHT);
						break;
				}
			};

			/**
			* Drag event handler
			* @method _move
			 * @param {Event} event
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._move = function (event) {
				var self = this,
					style = self._style,
					moveX = event.detail.estimatedX - self._startX + self._currentX,
					position = self._position,
					transform;

				if (moveX >= position.min && moveX <= position.max) {
					// for component position
					transform = "translate3d(" + moveX + "px, 0, 0)";
					style.webkitTransform = transform;
					style.transform = transform;
				}
			};

			/**
			 * Set widget position by position name
			 * @method _setPosition
			 * @param {HTMLElement} element widget html element
			 * @param {string} name name of preset position
			 * @protected
			 * @member ns.widget.mobile.FloatingActions
			 */
			prototype._setPosition = function (element, name) {
				var self = this,
					hasSingle = self._hasSingle;

				if (hasSingle && name === "left-2nd-icon") {
					name = "left-1st-icon";
					ns.warn("Cannot set 2nd icon when widget has 1 icon");
				}
				if (hasSingle && name === "right-2nd-icon") {
					name = "right-1st-icon";
					ns.warn("Cannot set 2nd icon when widget has 1 icon");
				}

				self.options.position = name;

				self._updatePosition();
			};

			/**
			 * Get widget position by position name
			 * @method _getPositionByName
			 * @param {string} name name of preset position
			 * @protected
			 * @member ns.widget.mobile.FloatingActions
			 */
			prototype._getPositionByName = function (name) {
				var position = this._position;

				switch (name) {
					case "left-min": return position.min;
					case "left-2nd-icon": return position.leftOneButton;
					case "left-1st-icon": return position.left;
					case "center": return position.center;
					case "right-1st-icon": return position.right;
					case "right-2nd-icon": return position.rightOneButton;
					case "right-min": return position.max;
					default: return position.max;
				}
			};


			/**
			 * Find parent element and add/remove widget class
			 * @method _updateParentClasses
			 * @param {boolean} [remove=false] add or remove floating action class from page element
			 * @protected
			 * @member ns.widget.mobile.FloatingActions
			 */
			prototype._toggleParentClasses = function (remove) {
				var self = this,
					parentElement = selectorUtils.getClosestByClass(self.element, PageClasses.uiPage);

				if (parentElement) {
					parentElement.classList.toggle(classes.PAGE_WITH_FLOATING_ACTIONS, !remove);
				}
			};

			/**
			 * Set widget position by position name
			 * @method _getPositionByName
			 * @protected
			 * @member ns.widget.mobile.FloatingActions
			 */
			prototype._updatePosition = function () {
				var self = this,
					style = self.element.style,
					positionName = self.options.position,
					transform;

				self.element.classList.add(classes.TRANSITIONS);

				transform = "translate3d(" + self._getPositionByName(positionName) + "px, 0, 0)";
				style.webkitTransform = transform;
				style.transform = transform;

				self._expandWidget(positionName);
			};

			/**
			 * Get widget position name by position X
			 * @method _getPositionNameByPosition
			 * @param {number} positionX current widget position
			 * @protected
			 * @member ns.widget.mobile.FloatingActions
			 */
			prototype._getPositionNameByPosition = function (positionX) {
				var self = this,
					scope = self._scope,
					hasSingle = self._hasSingle;

				if (positionX < scope.min) {
					return "left-min";
				} else if (!hasSingle && positionX < scope.leftOneButton) {
					return "left-2nd-icon";
				} else if (positionX < scope.left) {
					return "left-1st-icon";
				} else if (positionX < scope.center) {
					return "center";
				} else if (positionX < scope.right) {
					return "right-1st-icon";
				} else if (!hasSingle && positionX < scope.rightOneButton) {
					return "right-2nd-icon";
				} else {
					return "right-min";
				}
			};

			/**
			 * Move widget to position X
			 * @method _moveTo
			 * @param {number} positionX current widget position
			 * @protected
			 * @member ns.widget.mobile.FloatingActions
			 */
			prototype._moveTo = function (positionX) {
				var self = this;

				self.options.position = self._getPositionNameByPosition(positionX);
				self._updatePosition();
			};

			/**
			 * Dragend event handler
			 * @method _end
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.mobile.FloatingActions
			 */
			prototype._end = function (event) {
				var self = this;

				self._moveTo(
					event.detail.estimatedX - self._startX + self._currentX
				);
			};

			prototype._moveOnLeft = function () {
				var positionIndex = Math.max(
					WIDGET_POSITION.indexOf(this.options.position) - 1, 0
					);

				this.option("position", WIDGET_POSITION[positionIndex]);
			};

			prototype._moveOnRight = function () {
				var positionIndex = Math.min(
					WIDGET_POSITION.indexOf(this.options.position) + 1,
					WIDGET_POSITION.length - 1
					);

				this.option("position", WIDGET_POSITION[positionIndex]);
			};

			prototype._onkeyup = function (event) {
				var options = event,
					self = this;

				switch (options.keyCode) {
					case KEY_CODES.left:
						if (self._reposition) {
							self._moveOnLeft();
						}
						break;
					case KEY_CODES.right:
						if (self._reposition) {
							self._moveOnRight();
						}
						break;
					case KEY_CODES.enter:
						// @TODO context enter
						// re-enter in reposition mode back from reposition (position confirm by enter)
						if (event.target === this.element) {
							self._toggleRepositionMode(!self._reposition);
						}
						break;
					case KEY_CODES.escape:
						// this also is done by hwkey
						self._toggleRepositionMode(false);
						break;
					default:
						return;
				}
			}

			prototype._toggleRepositionMode = function (enable) {
				var self = this;

				if (enable) {
					self.element.classList.add("ui-floatingactions-reposition");
					self.disableFocusableElements(self.element);
				} else {
					self.element.classList.remove("ui-floatingactions-reposition");
					self.enableDisabledFocusableElements(self.element);
				}
				self._reposition = enable;
			}

			/**
			 * @static
			 */
			prototype._focus = function (element) {
				if (!element.hasAttribute("tabindex")) {
					element.setAttribute("tabindex", 0);
				}
				element.classList.add("ui-focus");
				element.focus();
			}

			/**
			 * @static
			 */
			prototype._blur = function (element) {
				if (element.hasAttribute("tabindex")) {
					element.removeAttribute("tabindex", 0);
				}
				element.classList.remove("ui-focus");
			}

			/**
			 * Handle events
			 * @method handleEvent
			 * @public
			 * @param {Event} event Event
			 * @member ns.widget.mobile.FloatingActions
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "dragstart":
						self._start(event);
						break;
					case "drag":
						self._move(event);
						break;
					case "dragend":
					case "dragcancel":
						self._end(event);
						break;
					case "keyup":
						self._onkeyup(event);
						break;
				}
			};

			prototype.onAttach = function () {
				this.refresh();
			};

			// definition
			FloatingActions.prototype = prototype;
			FloatingActions.classes = classes;
			ns.widget.mobile.FloatingActions = FloatingActions;

			engine.defineWidget(
				"FloatingActions",
				"[data-role='floatingactions'], ." + WIDGET_CLASS,
				[],
				FloatingActions,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.FloatingActions;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
