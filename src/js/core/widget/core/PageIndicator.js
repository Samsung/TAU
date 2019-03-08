/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *	 http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Page Indicator
 * PageIndicator component presents as a dot-typed indicator.
 *
 * @since 2.4
 * @class ns.widget.core.PageIndicator
 * @component-selector [data-role="page-indicator"], .ui-page-indicator
 * @component-type standalone-component
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../widget/BaseWidget",
			"../core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,

				PageIndicator = function () {
					var self = this;

					self._activeIndex = null;
					self.options = {};
				},
				classes = {
					indicator: "ui-page-indicator",
					indicatorActive: "ui-page-indicator-active",
					indicatorItem: "ui-page-indicator-item",
					indicatorDashed: "ui-page-indicator-dashed",
					linearIndicator: "ui-page-indicator-linear",
					circularIndicator: "ui-page-indicator-circular"
				},
				maxDots = {
					IN_CIRCLE: 60,
					IN_LINEAR: 5
				},
				layoutType = {
					LINEAR: "linear",
					CIRCULAR: "circular"
				},
				DISTANCE_FROM_EDGE = 8,

				prototype = new BaseWidget();

			PageIndicator.classes = classes;

			prototype._configure = function () {
				/**
				 * Options for widget.
				 * @property {Object} options
				 * @property {number} [options.maxPage=null] Maximum number of dots(pages) in indicator.
				 * @property {number} [options.numberOfPages=null] Number of pages to be linked to PageIndicator.
				 * @property {string} [options.layout="linear"] Layout type of page indicator.
				 * @property {number} [options.intervalAngle=6] angle between each dot in page indicator.
				 * @property {string} [options.style="dashed"] style of the page indicator "dotted" "dashed"
				 * @member ns.widget.core.PageIndicator
				 */
				this.options = {
					maxPage: null,
					numberOfPages: null,
					layout: "linear",
					intervalAngle: 6,
					style: "dashed"
				};
			};
			/**
			 * Build PageIndicator
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._build = function (element) {
				var self = this,
					options = self.options;

				self._createIndicator(element);
				if (options.layout === layoutType.CIRCULAR) {
					self._circularPositioning(element);
				}
				if (options.style === "dashed") {
					element.classList.add(classes.indicatorDashed);
				}
				return element;
			};

			/**
			 * Create HTML elements for PageIndicator
			 * @method _createIndicator
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._createIndicator = function (element) {
				var self = this,
					i,
					len,
					maxPage,
					span,
					numberOfPages = self.options.numberOfPages;

				if (numberOfPages === null) {
					ns.error("build error: numberOfPages is null");
					return;
				}

				self.options.layout = self.options.layout.toLowerCase();

				if (self.options.layout === layoutType.CIRCULAR) {
					element.classList.remove(classes.linearIndicator);
					element.classList.add(classes.circularIndicator);
				} else {
					element.classList.remove(classes.circularIndicator);
					element.classList.add(classes.linearIndicator);
				}

				maxPage = self._getMaxPage();

				len = numberOfPages < maxPage ? numberOfPages : maxPage;

				for (i = 0; i < len; i++) {
					span = document.createElement("span");
					span.classList.add(classes.indicatorItem);

					element.appendChild(span);
				}
			};

			/**
			 * Make circular positioned indicator
			 * @method _circularPositioning
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._circularPositioning = function (element) {
				var self = this,
					items = element.children,
					numberOfDots = items.length,
					intervalAngle = self.options.intervalAngle - "0",
					translatePixel,
					style,
					i;

				translatePixel = element.offsetWidth / 2 - DISTANCE_FROM_EDGE;

				for (i = 0; i < numberOfDots; i++) {
					style = "rotate(" + (i * intervalAngle - 90 - (numberOfDots - 1) * intervalAngle * 0.5) + "deg) translate(" +
						translatePixel + "px) ";

					items[i].style.transform = style;
				}

			};

			/**
			 * Return maximum number of dots(pages) in indicator
			 * @method _getMaxPage
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._getMaxPage = function () {
				var self = this,
					options = self.options,
					maxPage;

				if (options.layout === layoutType.CIRCULAR) {
					maxPage = options.maxPage || maxDots.IN_CIRCLE;
				} else {
					maxPage = options.maxPage || maxDots.IN_LINEAR;
				}
				return maxPage;
			};

			/**
			 * Remove contents of HTML elements for PageIndicator
			 * @method _removeIndicator
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._removeIndicator = function (element) {
				element.textContent = "";
			};

			/**
			 * This method sets a dot to active state.
			 * @method setActive
			 * @param {number} position index to be active state.
			 * @member ns.widget.core.PageIndicator
			 */
			prototype.setActive = function (position) {
				var self = this,
					dotIndex = position,
					elPageIndicatorItems = self.element.children,
					maxPage,
					numberOfPages = parseInt(self.options.numberOfPages, 10),
					middle,
					numberOfCentralDotPages = 0,
					indicatorActive = classes.indicatorActive,
					previousActive;

				if (position === null || position === undefined) {
					return;
				}

				self._activeIndex = position;
				maxPage = self._getMaxPage();
				middle = window.parseInt(maxPage / 2, 10);

				if (numberOfPages > maxPage) {
					numberOfCentralDotPages = numberOfPages - maxPage;
				} else if (isNaN(numberOfPages)) {
					ns.error("setActive error: numberOfPages is not a number");
					return;
				} else if (numberOfPages === 0) {
					return;
				}

				previousActive = self.element.querySelector("." + indicatorActive);
				if (previousActive) {
					previousActive.classList.remove(indicatorActive);
				}

				if ((middle < position) && (position <= (middle + numberOfCentralDotPages))) {
					dotIndex = middle;
				} else if (position > (middle + numberOfCentralDotPages)) {
					dotIndex = position - numberOfCentralDotPages;
				}

				elPageIndicatorItems[dotIndex].classList.add(indicatorActive);
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._refresh = function () {
				var self = this,
					element = self.element;

				self._removeIndicator(element);
				self._createIndicator(element);
				if (self.options.layout === layoutType.CIRCULAR) {
					self._circularPositioning(element);
				}
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._destroy = function () {
				this._removeIndicator(this.element);
			};

			PageIndicator.prototype = prototype;

			ns.widget.core.PageIndicator = PageIndicator;

			engine.defineWidget(
				"PageIndicator",
				"[data-role='page-indicator'], .ui-page-indicator",
				["setActive"],
				PageIndicator,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.PageIndicator;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
