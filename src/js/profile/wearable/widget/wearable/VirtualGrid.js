/*global window, ns, define */
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
 */
/**
 * #VirtualGrid Widget
 * Widget creates special grid which can contain big number of items.
 *
 * @class ns.widget.wearable.VirtualGrid
 * @since 2.3
 * @extends ns.widget.wearable.VirtualListview
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/DOM/css",
			"../wearable",
			"./VirtualListview"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Alias for {@link ns.widget.wearable.VirtualListview}
			 * @property {Object} VirtualList
			 * @member ns.widget.wearable.VirtualGrid
			 * @private
			 * @static
			 */
			var VirtualList = ns.widget.wearable.VirtualListview,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias for class {@link ns.util.DOM}
				 * @property {Object} DOM
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				DOM = ns.util.DOM,
				/**
				 * Constant for horizontal virtual grid
				 * @property {string} HORIZONTAL="x"
				 * @private
				 * @member ns.widget.wearable.VirtualGrid
				 * @static
				 */
				HORIZONTAL = "x",
				/**
				 * Constant for vertical virtual grid
				 * @property {string} VERTICAL="y"
				 * @private
				 * @member ns.widget.wearable.VirtualGrid
				 * @static
				 */
				VERTICAL = "y",
				FOCUS_SELECTOR = "::virtualgrid",
				FOCUS_SELECTOR_PATTERN = /(::virtualgrid\((\d+)\))/gi,
				/**
				 * Alias for class VirtualGrid
				 * @method VirtualGrid
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				VirtualGrid = function () {
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {number} [options.bufferSize=100] Element count in buffer
					 * @property {number} [options.dataLength=0] Element count in list
					 * @property {"x"|"y"} [options.orientation="y"] Orientation : horizontal ("x"), vertical ("y")
					 * @member ns.widget.wearable.VirtualGrid
					 */
					this.options = {
						bufferSize: 100,
						dataLength: 0,
						orientation: VERTICAL,
						/**
						 * Method which modifies list item, depended at specified index from database.
						 * @method options.listItemUpdater
						 * @member ns.widget.wearable.VirtualGrid
						 */
						listItemUpdater: function () {
							return null;
						}
					};
					this._onFocusQuery = null;
					return this;
				},

				prototype = new VirtualList(),
				/**
				 * Alias for VirtualList prototype
				 * @property {Object} VirtualListPrototype
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				VirtualListPrototype = VirtualList.prototype,
				/**
				 * Alias for {@link ns.widget.wearable.VirtualListview#draw VirtualList.draw}
				 * @method parentDraw
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				parentDraw = VirtualListPrototype.draw,
				/**
				 * Alias for {@link ns.widget.wearable.VirtualListview#_refreshScrollbar VirtualList.\_refreshScrollbar}
				 * @method parentRefreshScrollbar
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				parentRefreshScrollbar = VirtualListPrototype._refreshScrollbar,
				parentBindEvents = VirtualListPrototype._bindEvents,
				parentDestroy = VirtualListPrototype._destroy;

			/**
			 * This method draws item.
			 * @method draw
			 * @member ns.widget.wearable.VirtualGrid
			 */
			prototype.draw = function () {
				var self = this,
					element = self.element,
					ui = self._ui,
					newDiv = null,
					newDivStyle = null;

				if (self.options.orientation === HORIZONTAL) {
					newDiv = document.createElement("div");
					newDivStyle = newDiv.style;
					element.parentNode.appendChild(newDiv);
					newDiv.appendChild(element);
					newDiv.appendChild(ui.spacer);
					newDivStyle.width = "10000px";
					newDivStyle.height = "100%";
					ui.container = newDiv;
				}
				self._initListItem();
				parentDraw.call(self);
			};

			function onFocusQuery(self, event) {
				var data = event.detail,
					selector = data.selector,
					index = -1;

				if (selector.indexOf(FOCUS_SELECTOR) > -1) {
					data.selector = selector = selector.replace(FOCUS_SELECTOR_PATTERN,
						function (match, widgetMatch, indexMatch) {
							if (widgetMatch && indexMatch) {
								index = indexMatch | 0;
								return "#" + self.id + " [data-index='" + index + "']";
							}
							return match;
						});

					if (index > -1) {
						self.scrollToIndex(index);
						data.nextElement = document.querySelector(selector);
						event.preventDefault(); // consume
					}
				}
			}

			prototype._bindEvents = function (element) {
				var self = this;

				parentBindEvents.call(self, element);
				self._onFocusQuery = onFocusQuery.bind(null, self);
				self.element.addEventListener("focusquery", self._onFocusQuery);
			};

			prototype._destroy = function (element) {
				var self = this;

				parentDestroy.call(self, element);
				self.element.removeEventListener("focusquery", self._onFocusQuery);
			};

			/**
			 * Sets proper scrollbar size: width (horizontal)
			 * @method _refreshScrollbar
			 * @protected
			 * @member ns.widget.wearable.VirtualGrid
			 */
			prototype._refreshScrollbar = function () {
				var width = 0,
					ui = this._ui;

				parentRefreshScrollbar.call(this);
				if (ui.container) {
					width = this.element.clientWidth + ui.spacer.clientWidth;
					ui.container.style.width = width + "px";
				}
			};

			/**
			 * Initializes list item
			 * @method _initListItem
			 * @protected
			 * @member ns.widget.wearable.VirtualGrid
			 */
			prototype._initListItem = function () {
				var self = this,
					thisElement = self.element,
					element = document.createElement("div"),
					rowElement = document.createElement("div"),
					elementStyle = element.style,
					orientation = self.options.orientation,
					thisElementStyle = thisElement.style,
					rowElementStyle = rowElement.style;

				elementStyle.overflow = "hidden";
				rowElement.style.overflow = "hidden";
				thisElement.appendChild(rowElement);
				rowElement.appendChild(element);
				self.options.listItemUpdater(element, 0);

				if (orientation === VERTICAL) {
					thisElementStyle.overflowY = "auto";
					thisElementStyle.overflowX = "hidden";
					rowElementStyle.overflow = "hidden";
					element.style.float = "left";
					self._cellSize = DOM.getElementWidth(element);
					self._columnsCount = Math.floor(DOM.getElementWidth(thisElement) / self._cellSize);
				} else {
					thisElementStyle.overflowX = "auto";
					thisElementStyle.overflowY = "hidden";
					rowElementStyle.overflow = "hidden";
					rowElementStyle.float = "left";
					thisElementStyle.height = "100%";
					rowElementStyle.height = "100%";
					self._cellSize = DOM.getElementHeight(element);
					self._columnsCount = Math.floor(DOM.getElementHeight(thisElement) / self._cellSize);
				}
				thisElement.removeChild(rowElement);
				self.options.originalDataLength = self.options.dataLength;
				self.options.dataLength /= self._columnsCount;
			};

			/**
			 * Updates list item with data using defined template
			 * @method _updateListItem
			 * @param {HTMLElement} element List element to update
			 * @param {number} index Data row index
			 * @protected
			 * @member ns.widget.wearable.VirtualGrid
			 */
			prototype._updateListItem = function (element, index) {
				var elementI,
					i,
					count,
					elementStyle = element.style,
					options = this.options,
					elementIStyle,
					size;

				element.innerHTML = "";
				elementStyle.overflow = "hidden";
				elementStyle.position = "relative";
				if (options.orientation === HORIZONTAL) {
					elementStyle.height = "100%";
				}
				count = this._columnsCount;
				size = (100 / count);
				for (i = 0; i < count; i++) {
					elementI = document.createElement("div");
					elementIStyle = elementI.style;
					elementIStyle.overflow = "hidden";
					elementI.setAttribute("data-index", count * index + i);

					if (options.orientation === VERTICAL) {
						elementI.style.float = "left";
						elementI.style.width = size + "%";
					} else {
						elementI.style.height = size + "%";
					}

					if (count * index + i < options.originalDataLength) {
						this.options.listItemUpdater(elementI, count * index + i, count);
					}
					element.appendChild(elementI);
				}
			};

			VirtualGrid.prototype = prototype;

			ns.widget.wearable.VirtualGrid = VirtualGrid;

			engine.defineWidget(
				"VirtualGrid",
				".ui-virtualgrid",
				[],
				VirtualGrid
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return VirtualGrid;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
