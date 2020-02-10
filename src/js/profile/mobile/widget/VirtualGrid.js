/*global $, ns, define*/
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
/*jslint nomen: true, plusplus: true, white: true, browser: true */
/**
 * #Virtual Grid Widget
 * Widget creates special grid which can contain big number of items.
 *
 * @class ns.widget.mobile.VirtualGrid
 * @extends ns.widget.mobile.VirtualListview
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/object",
			"../../../core/util/DOM/css",
			"./Scrollview",
			"./VirtualListview"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var VirtualList = ns.widget.mobile.VirtualListview,
				parentPrototype = VirtualList.prototype,
				engine = ns.engine,
				domUtils = ns.util.DOM,
				/**
				 * @property {Function} utilsObjectMerge
				 * @private
				 * @member ns.widget.mobile.VirtualGrid
				 * @static
				 */
				utilsObjectMerge = ns.util.object.merge,
				// @TODO HORIZONTAL is currently not used, it will be used when horizontal scrolling is ready
				/**
				 * @property {string} HORIZONTAL="x" constant for horizontal virtual grid
				 * @private
				 * @member ns.widget.mobile.VirtualGrid
				 * @static
				 */
				HORIZONTAL = "x",
				/**
				 * @property {string} VERTICAL="y" constant for vertical virtual grid
				 * @private
				 * @member ns.widget.mobile.VirtualGrid
				 * @static
				 */
				VERTICAL = "y",
				classes = {
					WRAP_BLOCK_Y: "ui-virtualgrid-wrapblock-y",
					WRAP_BLOCK_X: "ui-virtualgrid-wrapblock-x",
					ITEM: "virtualgrid-item"
				},
				VirtualGrid = function () {
					return this;
				},
				prototype = new VirtualList();

			prototype._configure = function () {
				var self = this;

				// Call parent _configure
				if (typeof parentPrototype._configure === "function") {
					parentPrototype._configure.apply(self, arguments);
				}

				/**
				 * @property {Object} options
				 * @property {number} options.numItemData number of lines in the grid
				 * @property {number} [options.rawNumItemData] number of items inside data source
				 * @property {string} options.direction='y' direction for scrolling elements
				 * @property {number} options.row number of lines displayed at once
				 * @property {number} options.itemsPerLine number of elements per one line
				 * @property {Function} [options.listItemUpdater=null] Method which modifies list item, depended at specified index from database.
				 * @property {boolean} [options.standalone=false] If true scrollview instance will be created inside of the widget
				 * **Method may be overridden by developer using {@link ns.widget.mobile.VirtualListview#create .create} method with proper arguments.**
				 */
				self.options = utilsObjectMerge({}, self.options, {
					numItemData: 0,
					direction: VERTICAL,
					row: 50,
					itemsPerLine: 1,
					listItemUpdater: null,
					standalone: false
				});

				/**
				 * @property {Object} ui Holds UI elements of the widget
				 * @member ns.widget.mobile.VirtualGrid
				 */
				self._ui = utilsObjectMerge({}, self._ui);

				/**
				 * @property {number} _currentIndex Current zero-based index of data set.
				 * @member ns.widget.mobile.VirtualGrid
				 */
				self._currentIndex = 0;

				// @TODO Developer currently needs to define direction="x" for VirtualGrid and scroll="x" for container with scrollview,
				// @TODO ...it would be better to set scroll="x" for scroll view when it's not forced (defined as HTML attribute)
			};

			prototype._build = function (element) {
				if (typeof parentPrototype._build === "function") {
					parentPrototype._build.apply(this, arguments);
				}

				if (this.options.direction === HORIZONTAL) {
					element.style.height = "100%";
				}

				return element;
			};

			/**
			 * Determines grid sizes, row and column count.
			 * Temporary adds one element into list to fetch it's sizes.
			 * @method _setLineSize
			 * @protected
			 */
			prototype._setLineSize = function () {
				var self = this,
					options = self.options,
					tempElement = document.createElement("div"),
					tempFirstChild,
					tempElementFromTemplate,
					list = self.element,
					size,
					containerSize;

				// Add temporary element for fetching sizes
				list.appendChild(tempElement);
				self._updateListItem(tempElement, 0);
				tempFirstChild = tempElement.firstElementChild;
				tempElementFromTemplate = tempFirstChild.firstElementChild;

				// [NOTE] grid cells are floated to left for vertical scrolling
				// First row child element is the grid cell, it gets styles from CSS stylesheet.
				// We are clearing float to make list row expand to whole list width.
				// To fetch the raw width of template element we are going deeper (tempElementFromTemplate)
				// This ensures we fetch the authored value of width for grid cell element.

				// @TODO consider getting the height/width (.lineSize) each time a new line is parsed, currently all lines are based on the size of first element
				if (options.direction === VERTICAL) {
					// Reset width of first child set by updateListElement
					tempFirstChild.style.width = "";
					tempFirstChild.style.float = "none";
					// Fetch original width with everything (including margins)
					size = domUtils.getElementWidth(tempElementFromTemplate, "outer", true, true);
					// .lineSize is required to set the real height or width of a line
					options.lineSize = tempFirstChild.offsetHeight;
					containerSize = list.offsetWidth;
				} else {
					// @TODO create proper styles for horizontal scrolling
					size = tempElement.offsetHeight;
					if (options.standalone) {
						containerSize = self._ui.scrollview.element.offsetHeight;
					} else {
						containerSize = list.offsetHeight;
					}
					// .lineSize is required to set the real height or width of a line
					options.lineSize = tempFirstChild.offsetWidth;
				}

				// Remove element after fetching sizes
				list.removeChild(tempElement);

				// Calculate item count per line
				options.itemsPerLine = Math.max(Math.floor(containerSize / size), 1);
				// Save original element count
				options.rawNumItemData = options.numItemData;
				// Calculate limited element count
				options.numItemData = Math.ceil(options.numItemData / options.itemsPerLine);
			};

			/**
			 * Configures list. Sets data source and iterator behavior.
			 * @method _configureList
			 * @protected
			 * @param {Object} argumentsArray
			 */
			prototype._configureList = function (argumentsArray) {
				var self = this,
					options = self.options,
					args = argumentsArray[0] || {};

				// @TODO this is easy to use, but the code is confusing
				// and doesn't allow easy merging
				if (typeof args.itemData === "function" && (typeof args.numItemData === "function" || typeof args.numItemData === "number")) {
					if (typeof args.numItemData === "function") {
						options.numItemData = args.numItemData();
					} else {
						options.numItemData = args.numItemData <= 0 ? 0 : args.numItemData;
					}
					self.itemData = args.itemData;
				}

				// @TODO all options should be merged at once without the need of separate defining variables
				options.direction = args.direction || options.direction;

				// @TODO set minimum set size depending on current screen size
				options.row = Math.max(20, options.row);

				self._setLineSize();

				self._buildList();

				//Update scroll info: scroll position etc...
				if (options.standalone) {
					self._updateScrollInfo();
				}
			};

			/**
			 * @method _updateListItem
			 * Prepares list items.
			 * This method is used once while creating widget and later for every list update (on scroll for example)
			 * @param {HTMLElement} element Grid line element (usually a div with proper class)
			 * @param {number} index Index of the item to process
			 * @protected
			 */
			prototype._updateListItem = function (element, index) {
				var self = this,
					options = self.options,
					updateFunction = options.listItemUpdater,
					direction = options.direction,
					itemData = self.itemData,
					$jqTmpl = self._ui.$jqTmpl,
					itemsPerLine = options.itemsPerLine,
					rawNumItemData = options.rawNumItemData,
					elementPercentSize = (100 / itemsPerLine) + "%",
					// Offset for fetching elements from next line
					itemsOffset = itemsPerLine * index,
					templateElement,
					fragment,
					nextItemIndex,
					i = 0;

				// Clean insides before creating new content
				element.innerHTML = "";

				fragment = document.createDocumentFragment();
				nextItemIndex = itemsOffset + i;
				// Add items until line end or data source end
				// rawNumItemData may be undefined for first time size checking
				while (i < itemsPerLine && (rawNumItemData === undefined || nextItemIndex < rawNumItemData)) {
					//@TODO THIS IS A JQUERY INCLUSION IN A TAU WIDGET!!!
					//@TODO FIX THIS!!!
					templateElement = document.createElement("div");
					// Set item-in-line size
					templateElement.style[direction === VERTICAL ? "width" : "height"] = elementPercentSize;

					templateElement.classList.add(classes.ITEM);

					if (typeof updateFunction === "function") {
						updateFunction(templateElement, nextItemIndex);
					} else {
						templateElement.appendChild($.tmpl($jqTmpl, itemData(nextItemIndex))[0]);
					}

					fragment.appendChild(templateElement);

					i++;
					nextItemIndex = itemsOffset + i;
				}

				element.appendChild(fragment);
				engine.createWidgets(element);


				if (options.lineSize) {
					element.style[direction === VERTICAL ? "height" : "width"] = options.lineSize + "px";
				}
				element.classList.add(direction === VERTICAL ? classes.WRAP_BLOCK_Y : classes.WRAP_BLOCK_X);
			};

			/**
			 * List of classes used inside VirtualGrid
			 * @property {Object} classes
			 * @property {string} classes.WRAP_BLOCK_Y="ui-virtualgrid-wrapblock-y"
			 * @property {string} classes.WRAP_BLOCK_X="ui-virtualgrid-wrapblock-x"
			 * @property {string} classes.ITEM="virtualgrid-item"
			 * @static
			 */
			VirtualGrid.classes = classes;

			VirtualGrid.prototype = prototype;

			ns.widget.mobile.VirtualGrid = VirtualGrid;

			engine.defineWidget(
				"VirtualGrid",
				"[data-role=virtualgrid], .ui-virtualgrid",
				["create"],
				VirtualGrid,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return VirtualGrid;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
