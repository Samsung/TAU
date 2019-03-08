/*global window, define, Event, console, ns */
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
 * # Scroller Widget
 * Widget creates scroller on content.
 * @class ns.widget.core.scroller.Scroller
 * @since 2.3
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/object",
			"../../../../core/event",
			"../../../../core/event/gesture/Drag",
			"../../BaseWidget",
			"./effect/Bouncing",
			"../scroller"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			// scroller.start event trigger when user try to move scroller
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				utilsObject = ns.util.object,
				utilsEvents = ns.event,
				prototype = new BaseWidget(),
				EffectBouncing = ns.widget.core.scroller.effect.Bouncing,
				eventType = {
					/**
					 * event trigger when scroller start
					 * @event scrollstart
					 */
					START: "scrollstart",
					/**
					 * event trigger when scroller move
					 * @event scrollmove
					 */
					MOVE: "scrollmove",
					/**
					 * event trigger when scroller end
					 * @event scrollend
					 */
					END: "scrollend",
					/**
					 * event trigger when scroll is cancel
					 * @event scrollcancel
					 */
					CANCEL: "scrollcancel"
				},

				/*
				 * this option is related operation of scroll bar.
				 * the value is true, scroll bar is shown during touching screen even if content doesn't scroll.
				 * the value is false, scroll bar disappear when there is no movement of the scroll bar.
				 */
				_keepShowingScrollbarOnTouch = false,

				Scroller = function () {
				};

			Scroller.Orientation = {
				VERTICAL: "vertical",
				HORIZONTAL: "horizontal"
			};

			Scroller.EventType = eventType;

			prototype._build = function (element) {
				if (element.children.length !== 1) {
					ns.error("[Scroller] Scroller should have only one child.");
				} else {

					this.scroller = element.children[0];
					this.scrollerStyle = this.scroller.style;

					this.bouncingEffect = null;
					this.scrollbar = null;

					this.scrollerWidth = 0;
					this.scrollerHeight = 0;
					this.scrollerOffsetX = 0;
					this.scrollerOffsetY = 0;

					this.maxScrollX = 0;
					this.maxScrollY = 0;

					this.startScrollerOffsetX = 0;
					this.startScrollerOffsetY = 0;

					this.orientation = null;

					this.enabled = true;
					this.scrolled = false;
					this.dragging = false;
					this.scrollCanceled = false;
				}

				return element;
			};

			prototype._configure = function () {
				/**
				 * @property {Object} options Options for widget
				 * @property {number} [options.scrollDelay=0]
				 * @property {number} [options.threshold=10]
				 * @property {""|"bar"|"tab"} [options.scrollbar=""]
				 * @property {boolean} [options.useBouncingEffect=true]
				 * @property {"vertical"|"horizontal"} [options.orientation="vertical"]
				 * @member ns.widget.core.Scroller
				 */
				this.options = utilsObject.merge({}, this.options, {
					scrollDelay: 0,
					threshold: 30,
					scrollbar: "",
					useBouncingEffect: true,
					orientation: "vertical"	// vertical or horizontal,
				});
			};

			prototype._init = function (element) {
				var scroller = null,
					options = this.options,
					scrollerChildren = null,
					elementStyle = element.style,
					scrollerStyle = null,
					elementHalfWidth = element.offsetWidth / 2,
					elementHalfHeight = element.offsetHeight / 2;

				scroller = element.children[0];
				this.scroller = scroller;
				scrollerStyle = scroller.style,
				this.scrollerStyle = scrollerStyle;
				scrollerChildren = scroller.children;

				this.orientation = this.orientation ||
					(options.orientation === "horizontal" ? Scroller.Orientation.HORIZONTAL : Scroller.Orientation.VERTICAL);
				this.scrollerWidth = scroller.offsetWidth;
				this.scrollerHeight = scroller.offsetHeight;

				if (scrollerChildren.length) {
					this.maxScrollX = elementHalfWidth - this.scrollerWidth + scrollerChildren[scrollerChildren.length - 1].offsetWidth / 2;
					this.maxScrollY = elementHalfHeight - this.scrollerHeight + scrollerChildren[scrollerChildren.length - 1].offsetHeight / 2;
					this.minScrollX = elementHalfWidth - scrollerChildren[0].offsetWidth / 2;
					this.minScrollY = elementHalfHeight - scrollerChildren[0].offsetHeight / 2;
				} else {
					this.maxScrollY = 360;
					this.minScrollY = 0;
				}

				this.scrolled = false;
				this.touching = true;
				this.scrollCanceled = false;

				if (this.orientation === Scroller.Orientation.HORIZONTAL) {
					this.maxScrollY = 0;
				} else {
					this.maxScrollX = 0;
				}
				elementStyle.overflow = "hidden";
				elementStyle.position = "relative";
				scrollerStyle.position = "absolute";
				scrollerStyle.top = "0px";
				scrollerStyle.left = "0px";
				scrollerStyle.width = this.scrollerWidth + "px";
				scrollerStyle.height = this.scrollerHeight + "px";
				this._initScrollbar();
				this._initBouncingEffect();
				return element;
			};

			prototype._initScrollbar = function () {
				var type = this.options.scrollbar,
					scrollbarType;

				if (type) {
					scrollbarType = ns.widget.core.scroller.scrollbar.type[type];
					if (scrollbarType) {
						this.scrollbar = engine.instanceWidget(this.element, "ScrollBar", {
							type: scrollbarType,
							orientation: this.orientation
						});
					}
				}
			};

			prototype._initBouncingEffect = function () {
				var o = this.options;

				if (o.useBouncingEffect) {
					this.bouncingEffect = new EffectBouncing(this.element, {
						maxScrollX: this.maxScrollX,
						maxScrollY: this.maxScrollY,
						orientation: this.orientation
					});
				}
			};

			prototype._resetLayout = function () {
				var elementStyle = this.element.style,
					scrollerStyle = this.scrollerStyle;

				elementStyle.overflow = "";
				elementStyle.position = "";

				elementStyle.overflow = "hidden";
				elementStyle.position = "relative";

				if (scrollerStyle) {
					scrollerStyle.position = "";
					scrollerStyle.top = "";
					scrollerStyle.left = "";
					scrollerStyle.width = "";
					scrollerStyle.height = "";

					scrollerStyle["-webkit-transform"] = "";
					scrollerStyle["-moz-transition"] = "";
					scrollerStyle["-ms-transition"] = "";
					scrollerStyle["-o-transition"] = "";
					scrollerStyle["transition"] = "";
				}
			};

			prototype._bindEvents = function () {
				ns.event.enableGesture(
					this.scroller,

					new ns.event.gesture.Drag({
						threshold: this.options.threshold,
						delay: this.options.scrollDelay,
						blockVertical: this.orientation === Scroller.Orientation.HORIZONTAL,
						blockHorizontal: this.orientation === Scroller.Orientation.VERTICAL
					})
				);

				utilsEvents.on(this.scroller, "drag dragstart dragend dragcancel", this);
				window.addEventListener("resize", this);
			};

			prototype._unbindEvents = function () {
				if (this.scroller) {
					ns.event.disableGesture(this.scroller);
					utilsEvents.off(this.scroller, "drag dragstart dragend dragcancel", this);
					window.removeEventListener("resize", this);
				}
			};

			/* jshint -W086 */
			prototype.handleEvent = function (event) {
				switch (event.type) {
					case "dragstart":
						this._start(event);
						break;
					case "drag":
						this._move(event);
						break;
					case "dragend":
						this._end(event);
						break;
					case "dragcancel":
						this._cancel(event);
						break;
					case "resize":
						this.refresh();
						break;
				}
			};

			prototype._refresh = function () {
				this._unbindEvents();
				this._clear();
				this._init(this.element);
				this._bindEvents();
			};

			/**
			 * Scrolls to new position.
			 * @method scrollTo
			 * @param {number} x
			 * @param {number} y
			 * @param {number} duration
			 * @member ns.widget.core.scroller.Scroller
			 */
			prototype.scrollTo = function (x, y, duration) {
				this._translate(x, y, duration);
				this._translateScrollbar(x, y, duration);
			};

			prototype._translate = function (x, y, duration) {
				var translate,
					transition = {
						normal: "none",
						webkit: "none",
						moz: "none",
						ms: "none",
						o: "none"
					},
					scrollerStyle = this.scrollerStyle;

				if (duration) {
					transition.normal = "transform " + duration / 1000 + "s ease-out";
					transition.webkit = "-webkit-transform " + duration / 1000 + "s ease-out";
					transition.moz = "-moz-transform " + duration / 1000 + "s ease-out";
					transition.ms = "-ms-transform " + duration / 1000 + "s ease-out";
					transition.o = "-o-transform " + duration / 1000 + "s ease-out";
				}
				translate = "translate3d(" + x + "px," + y + "px, 0)";

				scrollerStyle["-webkit-transform"] =
					scrollerStyle["-moz-transform"] =
						scrollerStyle["-ms-transform"] =
							scrollerStyle["-o-transform"] =
								scrollerStyle.transform = translate;
				scrollerStyle.transition = transition.normal;
				scrollerStyle["-webkit-transition"] = transition.webkit;
				scrollerStyle["-moz-transition"] = transition.moz;
				scrollerStyle["-ms-transition"] = transition.ms;
				scrollerStyle["-o-transition"] = transition.o;

				this.scrollerOffsetX = window.parseInt(x, 10);
				this.scrollerOffsetY = window.parseInt(y, 10);
			};

			prototype._translateScrollbar = function (x, y, duration, autoHidden) {
				if (!this.scrollbar) {
					return;
				}

				this.scrollbar.translate(this.orientation === Scroller.Orientation.HORIZONTAL ? -x : -y, duration, autoHidden);
			};

			prototype._start = function () {
				var self = this;

				self.scrolled = false;
				self.dragging = true;
				self.scrollCanceled = false;
				self.startScrollerOffsetX = self.scrollerOffsetX;
				self.startScrollerOffsetY = self.scrollerOffsetY;
			};

			prototype._move = function (event) {
				var newX = this.startScrollerOffsetX,
					newY = this.startScrollerOffsetY,
					autoHide = !_keepShowingScrollbarOnTouch;

				if (!this.enabled || this.scrollCanceled || !this.dragging) {
					return;
				}

				if (this.orientation === Scroller.Orientation.HORIZONTAL) {
					newX += event.detail.estimatedDeltaX;
				} else {
					newY += event.detail.estimatedDeltaY;
				}

				if (newX > this.minScrollX || newX < this.maxScrollX) {
					newX = newX > this.minScrollX ? this.minScrollX : this.maxScrollX;
				}
				if (newY > this.minScrollY || newY < this.maxScrollY) {
					newY = newY > this.minScrollY ? this.minScrollY : this.maxScrollY;
				}

				if (newX !== this.scrollerOffsetX || newY !== this.scrollerOffsetY) {
					if (!this.scrolled) {
						this.trigger(eventType.START);
					}
					this.scrolled = true;

					this._translate(newX, newY);
					this._translateScrollbar(newX, newY, 0, autoHide);
					// TODO to dispatch move event is too expansive. it is better to use callback.
					this.trigger(eventType.MOVE);

					if (this.bouncingEffect) {
						this.bouncingEffect.hide();
					}
				} else {
					if (this.bouncingEffect) {
						this.bouncingEffect.drag(newX, newY);
					}
					this._translateScrollbar(newX, newY, 0, autoHide);
				}
			};

			prototype._end = function () {
				if (this.dragging) {

					// bouncing effect
					if (this.bouncingEffect) {
						this.bouncingEffect.dragEnd();
					}

					if (this.scrollbar) {
						this.scrollbar.end();
					}

					this._endScroll();
					this.dragging = false;
				}
			};

			prototype._endScroll = function () {
				if (this.scrolled) {
					this.trigger(eventType.END);
				}

				this.scrolled = false;
			};

			/**
			 * Cancels scroll.
			 * @method _cancel
			 * @protected
			 * @member ns.widget.core.scroller.Scroller
			 */
			prototype._cancel = function () {
				this.scrollCanceled = true;

				if (this.scrolled) {
					this._translate(this.startScrollerOffsetX, this.startScrollerOffsetY);
					this._translateScrollbar(this.startScrollerOffsetX, this.startScrollerOffsetY);
					this.trigger(eventType.CANCEL);
				}

				if (this.scrollbar) {
					this.scrollbar.end();
				}

				this.scrolled = false;
				this.dragging = false;
			};

			prototype._clear = function () {
				this.scrolled = false;
				this.scrollCanceled = false;

				this._resetLayout();
				this._clearScrollbar();
				this._clearBouncingEffect();
			};

			prototype._clearScrollbar = function () {
				if (this.scrollbar) {
					this.scrollbar.destroy();
				}
				this.scrollbar = null;
			};

			prototype._clearBouncingEffect = function () {
				if (this.bouncingEffect) {
					this.bouncingEffect.destroy();
				}
				this.bouncingEffect = null;
			};

			prototype._disable = function () {
				this.enabled = false;
			};

			prototype._enable = function () {
				this.enabled = true;
			};

			prototype._destroy = function () {
				this._unbindEvents();
				this._clear();
				this.scrollerStyle = null;
				this.scroller = null;
			};

			Scroller.prototype = prototype;

			ns.widget.core.scroller.Scroller = Scroller;

			engine.defineWidget(
				"Scroller",
				".scroller",
				["scrollTo", "cancel"],
				Scroller
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
