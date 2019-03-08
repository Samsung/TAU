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
					self._maxValue = null;

					self._container = null;
					self._minEffectElement = null;
					self._maxEffectElement = null;

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
					HORIZONTAL: "horizontal"
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
					self._maxValue = self._getValue(options.maxScrollX, options.maxScrollY);

					self._initLayout();
				},

				_initLayout: function () {
					var self = this,
						minElement = self._minEffectElement = document.createElement("DIV"),
						maxElement = self._maxEffectElement = document.createElement("DIV"),
						className = classes.bouncingEffect;

					if (self._orientation === Orientation.HORIZONTAL) {
						minElement.className = className + " " + classes.left;
						maxElement.className = className + " " + classes.right;
					} else {
						minElement.className = className + " " + classes.top;
						maxElement.className = className + " " + classes.bottom;
					}

					self._container.appendChild(minElement);
					self._container.appendChild(maxElement);

					minElement.addEventListener("animationEnd", this);
					minElement.addEventListener("webkitAnimationEnd", this);
					minElement.addEventListener("mozAnimationEnd", this);
					minElement.addEventListener("msAnimationEnd", this);
					minElement.addEventListener("oAnimationEnd", this);

					maxElement.addEventListener("animationEnd", this);
					maxElement.addEventListener("webkitAnimationEnd", this);
					maxElement.addEventListener("mozAnimationEnd", this);
					maxElement.addEventListener("msAnimationEnd", this);
					maxElement.addEventListener("oAnimationEnd", this);
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
						self._minEffectElement.style.display = "none";
						self._maxEffectElement.style.display = "none";
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
						val = self._getValue(x, y);

					if (!self._isShow) {
						if (val >= 0) {
							self._targetElement = self._minEffectElement;
							self.show();
						} else if (val <= self._maxValue) {
							self._targetElement = self._maxEffectElement;
							self.show();
						}

					} else if (self._isShow && !self._isDrag && !self._isShowAnimating && !self._isHideAnimating) {
						self._beginHide();
					}
				},

				_getValue: function (x, y) {
					return this._orientation === Orientation.HORIZONTAL ? x : y;
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
						maxEffectElement = this._maxEffectElement,
						minEffectElement = this._minEffectElement;

					minEffectElement.removeEventListener("animationEnd", this);
					minEffectElement.removeEventListener("webkitAnimationEnd", this);
					minEffectElement.removeEventListener("mozAnimationEnd", this);
					minEffectElement.removeEventListener("msAnimationEnd", this);
					minEffectElement.removeEventListener("oAnimationEnd", this);

					maxEffectElement.removeEventListener("animationEnd", this);
					maxEffectElement.removeEventListener("webkitAnimationEnd", this);
					maxEffectElement.removeEventListener("mozAnimationEnd", this);
					maxEffectElement.removeEventListener("msAnimationEnd", this);
					maxEffectElement.removeEventListener("oAnimationEnd", this);

					self._container.removeChild(minEffectElement);
					self._container.removeChild(maxEffectElement);

					self._container = null;
					self._minEffectElement = null;
					self._maxEffectElement = null;
					self._targetElement = null;

					self._isShow = null;
					self._orientation = null;
					self._maxValue = null;
				}
			};

			ns.widget.core.scroller.effect.Bouncing = Bouncing;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
