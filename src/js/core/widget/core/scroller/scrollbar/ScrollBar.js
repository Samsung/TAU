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
 * #Scroll Bar Widget
 * Widget creates scroll bar.
 * @class ns.widget.core.scroller.scrollbar.ScrollBar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../engine",
			"../../../../util/object",
			"../../../../util/selectors",
			"../scrollbar",
			"./type/bar",
			"./type/tab",
			"../../../../../core/widget/core/Page",
			"../../../../../core/widget/BaseWidget",
			"../Scroller"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			// scroller.start event trigger when user try to move scroller
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				prototype = new BaseWidget(),
				utilsObject = ns.util.object,
				selectors = ns.util.selectors,
				Page = ns.widget.core.Page,
				Classes = {
					wrapperClass: "ui-scrollbar-bar-type",
					barClass: "ui-scrollbar-indicator",
					orientationClass: "ui-scrollbar-",
					page: Page.classes.uiPage
				},

				Scroller = ns.widget.core.scroller.Scroller,
				ScrollerScrollBar = function () {

					this.wrapper = null;
					this.barElement = null;

					this.container = null;
					this.view = null;

					this.options = {};
					this.type = null;

					this.maxScroll = null;
					this.started = false;
					this.displayDelayTimeoutId = null;

					this.lastScrollPosition = 0;
				};

			prototype._build = function (scrollElement) {
				this.clip = scrollElement;
				this.view = scrollElement.children[0];
				this.firstChild = this.view.children[0];
				return scrollElement;
			};

			prototype._configure = function () {
				/**
				 * @property {Object} options Options for widget
				 * @property {boolean} [options.type=false]
				 * @property {number} [options.displayDelay=700]
				 * @property {"vertical"|"horizontal"} [options.orientation="vertical"]
				 * @member ns.widget.core.scroller.scrollbar.ScrollBar
				 */
				this.options = utilsObject.merge({}, this.options, {
					type: false,
					displayDelay: 700,
					orientation: Scroller.Orientation.VERTICAL
				});
			};

			prototype._init = function (scrollElement) {
				this.clip = scrollElement;
				this.view = scrollElement.children[0];
				this.firstChild = this.view.children[0];
				this.type = this.options.type;

				if (!this.type) {
					return;
				}
				this._createScrollbar();
			};

			prototype._bindEvents = function () {
				document.addEventListener("visibilitychange", this);
			};

			prototype._createScrollbar = function () {
				var orientation = this.options.orientation,
					wrapper = document.createElement("DIV"),
					bar = document.createElement("span"),
					view = this.view,
					clip = this.clip,
					firstChild = this.firstChild,
					type = this.type;

				clip.appendChild(wrapper);
				wrapper.appendChild(bar);
				wrapper.classList.add(Classes.wrapperClass);
				bar.className = Classes.barClass;

				if (orientation === Scroller.Orientation.HORIZONTAL) {
					type.setScrollbar(view.offsetWidth, firstChild.offsetWidth, clip.offsetWidth);
					bar.style.width = type.getScrollbarSize() + "px";
					wrapper.classList.add(Classes.orientationClass + "horizontal");
				} else {
					type.setScrollbar(view.offsetHeight, firstChild.offsetHeight, clip.offsetHeight);
					bar.style.height = type.getScrollbarSize() + "px";
					wrapper.classList.add(Classes.orientationClass + "vertical");
				}

				this.wrapper = wrapper;
				this.barElement = bar;
			};

			prototype._removeScrollbar = function () {
				this.clip.removeChild(this.wrapper);

				this.wrapper = null;
				this.barElement = null;
			};

			prototype._refresh = function () {
				var self = this;

				self._clear();
				self._init(self.element);
				self.translate(self.lastScrollPosition);
			};

			/**
			 * Translates widget.
			 * @method translate
			 * @param {number} offset
			 * @param {number} duration
			 * @param {boolean} autoHidden
			 * @member ns.widget.core.scroller.scrollbar.ScrollBar
			 */
			prototype.translate = function (offset, duration, autoHidden) {
				var orientation = this.options.orientation,
					translate,
					transition = {
						normal: "none",
						webkit: "none",
						moz: "none",
						ms: "none",
						o: "none"
					},
					barStyle,
					endDelay;

				if (!this.wrapper || !this.type || this.lastScrollPosition === offset) {
					return;
				}

				autoHidden = autoHidden !== false;

				this.lastScrollPosition = offset;

				offset = this.type.offset(orientation, offset);

				barStyle = this.barElement.style;
				if (duration) {
					transition.normal = "transform " + duration / 1000 + "s ease-out";
					transition.webkit = "-webkit-transform " + duration / 1000 + "s ease-out";
					transition.moz = "-moz-transform " + duration / 1000 + "s ease-out";
					transition.ms = "-ms-transform " + duration / 1000 + "s ease-out";
					transition.o = "-o-transform " + duration / 1000 + "s ease-out";
				}

				translate = "translate3d(" + offset.x + "px," + offset.y + "px, 0)";

				barStyle["-webkit-transform"] =
					barStyle["-moz-transform"] =
						barStyle["-ms-transform"] =
							barStyle["-o-transform"] =
								barStyle.transform = translate;
				barStyle["-webkit-transition"] = transition.webkit;
				barStyle["-moz-transition"] = transition.moz;
				barStyle["-ms-transition"] = transition.ms;
				barStyle["-o-transition"] = transition.o;
				barStyle.transition = transition.normal;

				if (!this.started) {
					this._start();
				}

				if (this.displayDelayTimeoutId !== null) {
					window.clearTimeout(this.displayDelayTimeoutId);
					this.displayDelayTimeoutId = null;
				}

				if (autoHidden) {
					endDelay = (duration || 0) + this.options.displayDelay;
					this.displayDelayTimeoutId = window.setTimeout(this._end.bind(this), endDelay);
				}
			};

			prototype.end = function () {
				if (!this.displayDelayTimeoutId) {
					this.displayDelayTimeoutId = window.setTimeout(this._end.bind(this), this.options.displayDelay);
				}
			};

			prototype._start = function () {
				this.type.start(this.wrapper, this.barElement);
				this.started = true;
			};

			prototype._end = function () {
				this.started = false;
				this.displayDelayTimeoutId = null;

				if (this.type) {
					this.type.end(this.wrapper, this.barElement);
				}
			};

			/**
			 * Supports events.
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.scroller.scrollbar.ScrollBar
			 */
			prototype.handleEvent = function (event) {
				var page;

				switch (event.type) {
					case "visibilitychange":
						page = selectors.getClosestBySelector(this.clip, "." + Classes.page);
						if (document.visibilityState === "visible" && page === ns.activePage) {
							this.refresh();
						}
						break;
				}
			};

			prototype._clear = function () {
				this._removeScrollbar();

				this.started = false;
				this.type = null;
				this.barElement = null;
				this.displayDelayTimeoutId = null;
			};

			prototype._destroy = function () {
				this._clear();
				document.removeEventListener("visibilitychange", this);

				this.options = null;
				this.clip = null;
				this.view = null;
			};

			ScrollerScrollBar.prototype = prototype;

			ns.widget.core.scroller.scrollbar.ScrollBar = ScrollerScrollBar;

			engine.defineWidget(
				"ScrollBar",
				"",
				["translate"],
				ScrollerScrollBar
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
