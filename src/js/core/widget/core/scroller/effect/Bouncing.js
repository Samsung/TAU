/*global window, define, ns */
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
/*jslint nomen: true, plusplus: true */
/**
 * # Bouncing effect
 * Bouncing effect for scroller widget.
 * @class ns.widget.core.scroller.effect.Bouncing
 * @internal
 * @since 2.3
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../effect"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			// scroller.start event trigger when user try to move scroller
			var utilsObject = ns.util.object,
				selectors = ns.util.selectors,
				Bouncing = function (scrollerElement, options) {
					var self = this;

					self._orientation = null;
					self._maxScrollValue = null;
					self._container = null;
					self._effectElement = {
						top: null,
						bottom: null,
						left: null,
						right: null
					}

					self.options = utilsObject.merge({}, Bouncing.defaults, {scrollEndEffectArea: ns.getConfig("scrollEndEffectArea", Bouncing.defaults.scrollEndEffectArea)});
					/**
					 * target element for bouncing effect
					 * @property {HTMLElement} targetElement
					 * @member ns.widget.core.scroller.effect.Bouncing
					 */
					self._targetElement = null;

					self._isShow = false;
					self._isDrag = false;
					self._isShowAnimating = false;
					self._isHideAnimating = false;

					self._create(scrollerElement, options);
				},
				Orientation = {
					VERTICAL: "vertical",
					HORIZONTAL: "horizontal",
					VERTICAL_HORIZONTAL: "vertical-horizontal"
				},
				endEffectAreaType = {
					content: "content",
					screen: "screen"
				},
				defaults = {
					duration: 500,
					scrollEndEffectArea: "content"
				},
				classes = {
					bouncingEffect: "ui-scrollbar-bouncing-effect",
					page: "ui-page",
					left: "ui-left",
					right: "ui-right",
					top: "ui-top",
					bottom: "ui-bottom",
					hide: "ui-hide",
					show: "ui-show"
				};

			Bouncing.Orientation = Orientation;

			Bouncing.defaults = defaults;

			Bouncing.prototype = {
				_create: function (scrollerElement, options) {
					var self = this;

					if (self.options.scrollEndEffectArea === endEffectAreaType.content) {
						self._container = scrollerElement;
					} else {
						self._container = selectors.getClosestByClass(scrollerElement, classes.page);
					}

					self._orientation = options.orientation;

					if (self._orientation === Orientation.HORIZONTAL || self._orientation == Orientation.VERTICAL) {
						self._maxScrollValue = self._getValue(options.maxScrollX, options.maxScrollY);
					} else {
						self._maxScrollValue = {
							x: options.maxScrollX,
							y: options.maxScrollY
						}
					}

					self._initLayout();
				},

				_createDivElement: function () {
					return document.createElement("DIV");
				},

				_initLayout: function () {
					var self = this,
						leftEffectElement = null,
						rightEffectElement = null,
						topEffectElement = null,
						bottomEffectElement = null,
						className = classes.bouncingEffect;

					if (self._orientation === Orientation.HORIZONTAL || self._orientation == Orientation.VERTICAL_HORIZONTAL) {
						leftEffectElement = self._createDivElement();
						rightEffectElement = self._createDivElement();
						leftEffectElement.className = className + " " + classes.left;
						rightEffectElement.className = className + " " + classes.right;
						self._container.appendChild(leftEffectElement);
						self._container.appendChild(rightEffectElement);
						self._registerAnimationEnd(leftEffectElement);
						self._registerAnimationEnd(rightEffectElement);
						self._effectElement.left = leftEffectElement;
						self._effectElement.right = rightEffectElement;
					}

					if (self._orientation === Orientation.VERTICAL || self._orientation == Orientation.VERTICAL_HORIZONTAL) {
						topEffectElement = self._createDivElement();
						bottomEffectElement = self._createDivElement();
						topEffectElement.className = className + " " + classes.top;
						bottomEffectElement.className = className + " " + classes.bottom;
						self._container.appendChild(topEffectElement);
						self._container.appendChild(bottomEffectElement);
						self._registerAnimationEnd(topEffectElement);
						self._registerAnimationEnd(bottomEffectElement);
						self._effectElement.top = topEffectElement;
						self._effectElement.bottom = bottomEffectElement;
					}
				},

				_registerAnimationEnd: function (element) {
					element.addEventListener("animationEnd", this);
					element.addEventListener("webkitAnimationEnd", this);
					element.addEventListener("mozAnimationEnd", this);
					element.addEventListener("msAnimationEnd", this);
					element.addEventListener("oAnimationEnd", this);
				},

				_unregisterAnimationEnd: function (element) {
					element.removeEventListener("animationEnd", this);
					element.removeEventListener("webkitAnimationEnd", this);
					element.removeEventListener("mozAnimationEnd", this);
					element.removeEventListener("msAnimationEnd", this);
					element.removeEventListener("oAnimationEnd", this);
				},

				/**
				 * ...
				 * @method drag
				 * @param {number} x
				 * @param {number} y
				 * @member ns.widget.core.scroller.effect.Bouncing
				 */
				drag: function (x, y) {
					this._isDrag = true;
					this._checkAndShow(x, y);
				},

				/**
				 * ...
				 * @method dragEnd
				 * @member ns.widget.core.scroller.effect.Bouncing
				 */
				dragEnd: function () {
					var self = this;

					if (self._isShow && !self._isShowAnimating && !self._isHideAnimating) {
						self._beginHide();
					}

					self._isDrag = false;
				},

				/**
				 * Shows effect.
				 * @method show
				 * @member ns.widget.core.scroller.effect.Bouncing
				 */
				show: function () {
					var self = this;

					if (self._targetElement) {
						self._isShow = true;
						self._beginShow();
					}
				},

				/**
				 * Hides effect.
				 * @method hide
				 * @member ns.widget.core.scroller.effect.Bouncing
				 */
				hide: function () {
					var self = this;

					if (self._isShow) {
						self._targetElement.style.display = "none";
						self._targetElement.classList.remove(classes.hide);
						self._targetElement.classList.remove(classes.show);
					}
					self._isShow = false;
					self._isShowAnimating = false;
					self._isHideAnimating = false;
					self._targetElement = null;
				},

				_checkAndShow: function (x, y) {
					var self = this,
						val = null;

					if (!self._isShow) {
						if (self._orientation === Orientation.HORIZONTAL || self._orientation === Orientation.VERTICAL) {
							val = self._getValue(x, y);
							if (val >= 0) {
								self._targetElement = self._getMinEffectElement();
							} else if (val <= self._maxScrollValue) {
								self._targetElement = self._getMaxEffectElement();
							}
						} else {
							// Handle bouncing in both orientations.
							if (y == 0) {
								self._targetElement = self._effectElement.top;
							} else if (y == -self._maxScrollValue.y) {
								self._targetElement = self._effectElement.bottom;
							} else if (x == 0) {
								self._targetElement = self._effectElement.left;
							} else if (x == -self._maxScrollValue.x) {
								self._targetElement = self._effectElement.right;
							}
						}
						self.show();
					} else if (self._isShow && !self._isDrag && !self._isShowAnimating && !self._isHideAnimating) {
						self._beginHide();
					}
				},

				_getValue: function (x, y) {
					if (this._orientation === Orientation.VERTICAL_HORIZONTAL) {
						return null;
					}
					return this._orientation === Orientation.HORIZONTAL ? x : y;
				},

				_getMinEffectElement: function () {
					var self = this;

					if (self._orientation === Orientation.VERTICAL_HORIZONTAL) {
						return null;
					}
					return self._orientation === Orientation.HORIZONTAL ? self._effectElement.left : self._effectElement.top;
				},

				_getMaxEffectElement: function () {
					var self = this;

					if (self._orientation === Orientation.VERTICAL_HORIZONTAL) {
						return null;
					}
					return self._orientation === Orientation.HORIZONTAL ? self._effectElement.right : self._effectElement.bottom;
				},

				_beginShow: function () {
					var self = this;

					if (!self._targetElement || self._isShowAnimating) {
						return;
					}

					self._targetElement.style.display = "block";

					self._targetElement.classList.remove(classes.hide);
					self._targetElement.classList.add(classes.show);

					self._isShowAnimating = true;
					self._isHideAnimating = false;
				},

				_finishShow: function () {
					var self = this;

					self._isShowAnimating = false;
					if (!self._isDrag) {
						self._targetElement.classList.remove(classes.show);
						self._beginHide();
					}
				},

				_beginHide: function () {
					var self = this;

					if (self._isHideAnimating) {
						return;
					}

					self._targetElement.classList.remove(classes.show);
					self._targetElement.classList.add(classes.hide);

					self._isHideAnimating = true;
					self._isShowAnimating = false;
				},

				_finishHide: function () {
					var self = this;

					self._isHideAnimating = false;
					self._targetElement.classList.remove(classes.hide);
					self.hide();
					self._checkAndShow();
				},

				/**
				 * Supports events.
				 * @method handleEvent
				 * @param {Event} event
				 * @member ns.widget.core.scroller.effect.Bouncing
				 */
				handleEvent: function (event) {
					if (event.type.toLowerCase().indexOf("animationend") > -1 && event.animationName.charAt(0) !== "-") {
						if (this._isShowAnimating) {
							this._finishShow();
						} else if (this._isHideAnimating) {
							this._finishHide();
						}
					}
				},

				/**
				 * Destroys effect.
				 * @method destroy
				 * @member ns.widget.core.scroller.effect.Bouncing
				 */
				destroy: function () {
					var self = this,
						topEffectElement = self._effectElement.top,
						bottomEffectElement = self._effectElement.bottom,
						leftEffectElement = self._effectElement.left,
						rightEffectElement = self._effectElement.right;

					if (topEffectElement) {
						self._unregisterAnimationEnd(topEffectElement);
						self._container.removeChild(topEffectElement);
					}

					if (bottomEffectElement) {
						self._unregisterAnimationEnd(bottomEffectElement);
						self._container.removeChild(bottomEffectElement);
					}

					if (leftEffectElement) {
						self._unregisterAnimationEnd(leftEffectElement);
						self._container.removeChild(leftEffectElement);
					}

					if (rightEffectElement) {
						self._unregisterAnimationEnd(rightEffectElement);
						self._container.removeChild(rightEffectElement);
					}

					self._container = null;
					self._effectElement = null;
					self._targetElement = null;

					self._isShow = null;
					self._orientation = null;
					self._maxScrollValue = null;
				}
			};

			ns.widget.core.scroller.effect.Bouncing = Bouncing;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
