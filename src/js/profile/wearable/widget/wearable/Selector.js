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
/**
 * # Selector Component
 *
 * Selector component is special component that has unique UX of Tizen wearable profile.
 * Selector component has been used in more options commonly but If you want to use other situation
 * then you can use this component as standalone component in everywhere.
 * Selector component was consisted as selector element and item elements. You can set the item
 * selector, each items locate degree and radius.
 * Selector component has made layers automatically. Layer has items and you can set items number
 * on one layer.
 * Indicator is indicator that located center of Selector. We provide default indicator style and
 * function.
 * But, If you want to change indicator style and function, you can make the custom indicator and
 * set your indicator for operate with Selector.
 * Indicator arrow is special indicator style that has the arrow. That was used for provide more
 * correct indicate information for user.
 * Also, you can make the custom indicator arrow and set your custom indicator arrow for operate
 * with Selector.
 * Selector provide to control for arrow indicate active item position.
 *
 * ## HTML example
 *
 *          @example
 *              <div class="ui-page ui-page-active" id="main">
 *                  <div id="selector" class="ui-selector">
 *                      <div class="ui-item ui-show-icon" data-title="Show"></div>
 *                      <div class="ui-item ui-human-icon" data-title="Human"></div>
 *                      <div class="ui-item ui-delete-icon" data-title="Delete"></div>
 *                      <div class="ui-item ui-show-icon" data-title="Show"></div>
 *                      <div class="ui-item ui-human-icon" data-title="Human"></div>
 *                      <div class="ui-item ui-delete-icon" data-title="Delete"></div>
 *                      <div class="ui-item ui-x-icon" data-title="X Icon"></div>
 *                      <div class="ui-item ui-fail-icon" data-title="Fail"></div>
 *                      <div class="ui-item ui-show-icon" data-title="Show"></div>
 *                      <div class="ui-item ui-human-icon" data-title="Human"></div>
 *                      <div class="ui-item ui-delete-icon" data-title="Delete"></div>
 *                  </div>
 *              </div>
 *
 * ## Manual constructor
 *
 *          @example
 *              (function() {
 *                  var page = document.getElementById("selectorPage"),
 *                      selector = document.getElementById("selector"),
 *                      clickBound;
 *
 *                  function onClick(event) {
 *                      var activeItem = selector.querySelector(".ui-item-active");
 *                  }
 *                  page.addEventListener("pagebeforeshow", function() {
 *                      clickBound = onClick.bind(null);
 *                      tau.widget.Selector(selector);
 *                      selector.addEventListener("click", clickBound, false);
 *                  });
 *                  page.addEventListener("pagebeforehide", function() {
 *                      selector.removeEventListener("click", clickBound, false);
 *                  });
 *              })();
 *
 * ## Options
 * Selector component options
 *
 * {string} itemSelector [options.itemSelector=".ui-item"] or You can set attribute on tag
 * [data-item-selector=".ui-item] Selector item selector that style is css selector.
 * {string} indicatorSelector [options.indicatorSelector=".ui-selector-indicator"] or You can set
 * attribute on tag [data-indicator-selector=".ui-selector-indicator"] Selector indicator selector
 * that style is css selector.
 * {string} indicatorArrowSelector [options.indicatorArrowSelector=".ui-selector-indicator-arrow"]
 * or You can set attribute on tag [data-indicator-arrow-selector=".ui-selector-indicator-arrow"]
 * Selector indicator arrow selector that style is css style.
 * {number} itemDegree [options.itemDegree=30] or You can set attribute on tag
 * [data-item-degree=30] Items degree each other.
 * {number} itemRadius [options.itemRadius=140] or You can set attribute on tag
 * [data-item-radius=140] Items radius between center and it.
 * {number} maxItemNumber [options.maxItemNumber=11] or You can set attribute on tag
 * [data-max-item-number=11] Max item number on one layer. If you change the itemDegree, we
 * recommend to consider to modify this value for fit your Selector layout.
 * {boolean} indicatorAutoControl [options.indicatorAutoControl=true] or You can set attribute on
 * tag [data-indicator-auto-control=true] Indicator auto control switch. If you want to control
 * your indicator manually, change this options to false.
 *
 * @class ns.widget.wearable.Selector
 * @component-selector .ui-selector
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/DOM",
			"../../../../core/util/selectors",
			"../../../../core/util/object",
			"../../../../core/widget/BaseWidget",
			"../../../../core/event",
			"../../../../core/event/gesture/Drag",
			"../../../../core/event/gesture/LongPress",
			"../../../../core/event/gesture/Swipe",
			"../wearable"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				utilDom = ns.util.DOM,
				Gesture = ns.event.gesture,
				events = ns.event,
				utilsObject = ns.util.object,
				requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame,
				Selector = function () {
					var self = this;

					self._ui = {};
					self.options = {
						editable: false,
						plusButton: true
					};

					self._editModeEnabled = false;
					self._movedElementIndex = null;
					self._destinationIndex = null;
					self._pointedLayer = null;
					self._changeLayerInterval = null;
					self._itemsToReorder = [];
					self._removedItemIndex = null;
					self._reorderEnd = null;
					self._reorderAnimationEnd = null;
				},
				classes = {
					/**
					* Standard selector widget
					* @style ui-selector
					* @member ns.widget.wearable.Selector
					*/
					SELECTOR: "ui-selector",
					/**
					* Layer element on selector widget
					* @style ui-layer
					* @member ns.widget.wearable.Selector
					*/
					LAYER: "ui-layer",
					/**
					* Active layer element on selector widget
					* @style ui-layer-active
					* @member ns.widget.wearable.Selector
					*/
					LAYER_ACTIVE: "ui-layer-active",
					/**
					* Previous layer element on selector widget
					* @style ui-layer-prev
					* @member ns.widget.wearable.Selector
					*/
					LAYER_PREV: "ui-layer-prev",
					/**
					* Next layer element on selector widget
					* @style ui-layer-next
					* @member ns.widget.wearable.Selector
					*/
					LAYER_NEXT: "ui-layer-next",
					/**
					* Hide layer element on selector widget
					* @style ui-layer-hide
					* @member ns.widget.wearable.Selector
					*/
					LAYER_HIDE: "ui-layer-hide",
					/**
					* Item element on selector widget
					* @style ui-item
					* @member ns.widget.wearable.Selector
					*/
					ITEM: "ui-item",
					/**
					* Active item element on selector widget
					* @style ui-item-active
					* @member ns.widget.wearable.Selector
					*/
					ITEM_ACTIVE: "ui-item-active",
					/**
					* Removable item element on selector widget
					* @style ui-item-removable
					* @member ns.widget.wearable.Selector
					*/
					ITEM_REMOVABLE: "ui-item-removable",
					/**
					* Add remove item element on selector widget
					* @style ui-item-icon-remove
					* @member ns.widget.wearable.Selector
					*/
					ITEM_ICON_REMOVE: "ui-item-icon-remove",
					/**
					* Add remove item element without background on selector widget
					* @style ui-item-icon-remove-bg
					* @member ns.widget.wearable.Selector
					*/
					ITEM_ICON_REMOVE_BG: "ui-item-icon-remove-bg",
					/**
					* Add indicator item element to selector widget
					* @style ui-selector-indicator
					* @member ns.widget.wearable.Selector
					*/
					INDICATOR: "ui-selector-indicator",
					/**
					* Add active indicator item element to selector widget
					* @style ui-selector-indicator-active
					* @member ns.widget.wearable.Selector
					*/
					INDICATOR_ACTIVE: "ui-selector-indicator-active",
					/**
					* Add text indicator item element to selector widget
					* @style ui-selector-indicator-text
					* @member ns.widget.wearable.Selector
					*/
					INDICATOR_TEXT: "ui-selector-indicator-text",
					/**
					* Add icon indicator item element to selector widget
					* @style ui-selector-indicator-icon
					* @member ns.widget.wearable.Selector
					*/
					INDICATOR_ICON: "ui-selector-indicator-icon",
					/**
					* Add active indicator icon element to selector widget
					* @style ui-selector-indicator-icon-active
					* @member ns.widget.wearable.Selector
					*/
					INDICATOR_ICON_ACTIVE: "ui-selector-indicator-icon-active",
					/**
					* Add active indicator icon element with text to selector widget
					* @style ui-selector-indicator-icon-active-with-text
					* @member ns.widget.wearable.Selector
					*/
					INDICATOR_ICON_ACTIVE_WITH_TEXT: "ui-selector-indicator-icon-active-with-text",
					/**
					* Add subtext to selector indicator in selector widget
					* @style ui-selector-indicator-subtext
					* @member ns.widget.wearable.Selector
					*/
					INDICATOR_SUBTEXT: "ui-selector-indicator-subtext",
					/**
					* Add subtitle to selector indicator in selector widget
					* @style ui-selector-indicator-with-subtext
					* @member ns.widget.wearable.Selector
					*/
					INDICATOR_WITH_SUBTITLE: "ui-selector-indicator-with-subtext",
					/**
					* Set indicator to next element as the end of selector indicator in selector widget
					* @style ui-selector-indicator-next-end
					* @member ns.widget.wearable.Selector
					*/
					INDICATOR_NEXT_END: "ui-selector-indicator-next-end",
					/**
					* Set indicator to previous element as the end of selector indicator in selector widget
					* @style ui-selector-indicator-prev-end
					* @member ns.widget.wearable.Selector
					*/
					INDICATOR_PREV_END: "ui-selector-indicator-prev-end",
					/**
					* Set arrow indicator style to selector indicator
					* @style ui-selector-indicator-arrow
					* @member ns.widget.wearable.Selector
					*/
					INDICATOR_ARROW: "ui-selector-indicator-arrow",
					/**
					* Set edit mode in selector widget
					* @style ui-selector-edit-mode
					* @member ns.widget.wearable.Selector
					*/
					EDIT_MODE: "ui-selector-edit-mode",
					/**
					* Reorder elements in selector widget
					* @style ui-selector-reorder
					* @member ns.widget.wearable.Selector
					*/
					REORDER: "ui-selector-reorder",
					/**
					* Add plus button in selector widget
					* @style ui-item-plus
					* @member ns.widget.wearable.Selector
					*/
					PLUS_BUTTON: "ui-item-plus",
					/**
					* Add placeholder to item in selector widget
					* @style ui-item-placeholder
					* @member ns.widget.wearable.Selector
					*/
					ITEM_PLACEHOLDER: "ui-item-placeholder",
					/**
					* Add moved item class in selector widget
					* @style ui-item-moved
					* @member ns.widget.wearable.Selector
					*/
					ITEM_MOVED: "ui-item-moved",
					/**
					* Add removed item class in selector widget
					* @style ui-item-removed
					* @member ns.widget.wearable.Selector
					*/
					ITEM_REMOVED: "ui-item-removed",
					/**
					* Add moved end item class in selector widget
					* @style ui-item-moved-end
					* @member ns.widget.wearable.Selector
					*/
					ITEM_END: "ui-item-moved-end"
				},
				STATIC = {
					RADIUS_RATIO: 0.8,
					SCALE_FACTOR: 0.8235
				},
				DEFAULT = {
					ITEM_SELECTOR: "." + classes.ITEM,
					INDICATOR_SELECTOR: "." + classes.INDICATOR,
					INDICATOR_TEXT_SELECTOR: "." + classes.INDICATOR_TEXT,
					INDICATOR_ARROW_SELECTOR: "." + classes.INDICATOR_ARROW,
					ITEM_DEGREE: 30,
					MAX_ITEM_NUMBER: 11,
					ITEM_RADIUS: -1,
					ITEM_START_DEGREE: 30,
					ITEM_END_DEGREE: 330,
					ITEM_NORMAL_SCALE: "scale(" + STATIC.SCALE_FACTOR.toString() + ")",
					ITEM_ACTIVE_SCALE: "scale(1)",
					ITEM_MOVED_SCALE: "scale(0.92)",
					EMPTY_STATE_TEXT: "Selector is empty"
				},
				EVENT_TYPE = {
					/**
					 * Triggered when the active item is changed. Target is active item element.
					 * This event has detail information.
					 * - layer: Layer element on active item
					 * - layerIndex: Layer's index on active item
					 * - index: Item index on layer.
					 * - title: If Item has 'data-title' attribute, this value is that.
					 * @event selectoritemchange
					 * @member ns.widget.wearable.Selector
					 */
					ITEM_CHANGE: "selectoritemchange",
					/**
					 * Triggered when the active layer is changed. Target is active layer element.
					 * This event has detail information.
					 * - index: Layer index.
					 * @event selectorlayerchange
					 * @member ns.widget.wearable.Selector
					 */
					LAYER_CHANGE: "selectorlayerchange"
				},
				BaseWidget = ns.widget.BaseWidget,
				prototype = new BaseWidget();

			Selector.prototype = prototype;

			function buildLayers(element, items, options) {
				var layers = [],
					layer,
					i,
					len;

				removeLayers(element, options);
				len = items.length;
				for (i = 0; i < len; i++) {
					if (!(i % options.maxItemNumber)) {
						layer = document.createElement("div");
						layer.classList.add(classes.LAYER);
						element.appendChild(layer);
						layers.push(layer);
					}
					if (layer) {
						layer.appendChild(items[i]);
						if (utilDom.getNSData(items[i], "active")) {
							items[i].classList.add(classes.ITEM_ACTIVE);
							layer.classList.add(classes.LAYER_ACTIVE);
						}
					}
				}
				return layers;
			}

			function removeLayers(element, options) {
				var layers = element.getElementsByClassName(classes.LAYER),
					items,
					i,
					len,
					j,
					itemLength;

				if (layers.length) {
					// Delete legacy layers
					len = layers.length;
					for (i = 0; i < len; i++) {
						items = layers[0].querySelectorAll(options.itemSelector);
						itemLength = items.length;
						for (j = 0; j < itemLength; j++) {
							element.appendChild(items[j]);
						}
						element.removeChild(layers[0]);
					}
				}
			}

			/**
			 * Bind events
			 * @method bindEvents
			 * @param {Object} self
			 * @private
			 * @member ns.widget.wearable.Selector
			 */
			function bindEvents(self) {
				var element = self.element;

				events.enableGesture(
					element,

					new Gesture.Drag(),
					new Gesture.LongPress(),
					new Gesture.Swipe({
						orientation: Gesture.Orientation.HORIZONTAL
					})
				);

				events.on(document, "rotarydetent", self, false);
				events.on(document, "swipe", self, true);
				self.on("dragstart drag dragend click longpress mouseup touchend transitionend" +
					" animationend webkitAnimationEnd", self, false);
			}

			/**
			 * Unbind events
			 * @method unbindEvents
			 * @param {Object} self
			 * @private
			 * @member ns.widget.wearable.Selector
			 */
			function unbindEvents(self) {
				var element = self.element;

				events.disableGesture(
					element
				);
				events.off(document, "rotarydetent", self, false);
				events.off(document, "swipe", self, true);
				self.off("dragstart drag dragend click longpress mouseup touchend transitionend" +
					" animationend webkitAnimationEnd", self, false);
			}

			/**
			 * Remove ordering classes of layers base on parameter.
			 * @method removeLayerClasses
			 * @param {HTMLElement} activeLayer
			 * @private
			 * @member ns.widget.wearable.Selector
			 */
			function removeLayerClasses(activeLayer) {
				var activePrevLayer = activeLayer.previousElementSibling,
					activeNextLayer = activeLayer.nextElementSibling;

				if (activePrevLayer) {
					activePrevLayer.classList.remove(classes.LAYER_PREV);
				}
				if (activeNextLayer) {
					activeNextLayer.classList.remove(classes.LAYER_NEXT);
				}
				activeLayer.classList.remove(classes.LAYER_ACTIVE);
			}

			/**
			 * Add ordering classes of layers base on parameter.
			 * @method addLayerClasses
			 * @param {HTMLElement} validLayer
			 * @private
			 * @member ns.widget.wearable.Selector
			 */
			function addLayerClasses(validLayer) {
				var validPrevLayer = validLayer.previousElementSibling,
					validNextLayer = validLayer.nextElementSibling;

				if (validPrevLayer && validPrevLayer.classList.contains(classes.LAYER)) {
					validPrevLayer.classList.add(classes.LAYER_PREV);
				}

				if (validNextLayer && validNextLayer.classList.contains(classes.LAYER)) {
					validNextLayer.classList.add(classes.LAYER_NEXT);
				}
				validLayer.classList.add(classes.LAYER_ACTIVE);
				validLayer.style.transform = "none";
			}

			function setItemTransform(element, degree, radius, selfDegree, scale) {
				element.style.transform = "rotate(" + degree + "deg) " +
					"translate3d(0, " + -radius + "px, 0) " +
					"rotate(" + selfDegree + "deg) " +
					scale;
				console.log("setItemTransform", element.style.transform);
			}

			function setIndicatorTransform(element, selfDegree) {
				element.style.transform = "rotate(" + selfDegree + "deg) translate3d(0, 0, 0)";
				element.style.transition = "transform 300ms";
			}

			prototype._configure = function () {
				var self = this;
				/**
				 * Selector component options
				 * @property {string} itemSelector [options.itemSelector=".ui-item"] Selector item selector
				 * that style is css selector.
				 * @property {string} indicatorSelector
				 * [options.indicatorSelector=".ui-selector-indicator"] Selector indicator selector that
				 * style is css selector.
				 * @property {string} indicatorArrowSelector
				 * [options.indicatorArrowSelector=".ui-selector-indicator-arrow"] Selector indicator
				 * arrow selector that style is css style.
				 * @property {number} itemDegree [options.itemDegree=30] Each items locate degree.
				 * @property {number} itemRadius [options.itemRadius=-1] Items locate radius between center
				 * to it. Default value is determined by Selector element layout.
				 * @property {number} maxItemNumber [options.maxItemNumber=11] Max item number on one
				 * layer. If you change the itemDegree, we recommend to consider to modify this value for
				 * fit your Selector layout.
				 * @property {boolean} indicatorAutoControl [options.indicatorAutoControl=true] Indicator
				 * auto control switch. If you want to control your indicator manually, change this options
				 * to false.
				 */

				self.options = utilsObject.merge(self.options, {
					itemSelector: DEFAULT.ITEM_SELECTOR,
					indicatorSelector: DEFAULT.INDICATOR_SELECTOR,
					indicatorTextSelector: DEFAULT.INDICATOR_TEXT_SELECTOR,
					indicatorArrowSelector: DEFAULT.INDICATOR_ARROW_SELECTOR,
					itemDegree: DEFAULT.ITEM_DEGREE,
					itemRadius: DEFAULT.ITEM_RADIUS,
					maxItemNumber: DEFAULT.MAX_ITEM_NUMBER,
					indicatorAutoControl: true,
					emptyStateText: DEFAULT.EMPTY_STATE_TEXT
				});
			};


			/**
			 * Create indicator structure
			 * @param {Object} ui
			 * @param {HTMLElement} element
			 */
			function createIndicator(ui, element) {
				var indicator,
					indicatorText,
					indicatorSubText,
					indicatorIcon;

				indicator = document.createElement("div");
				indicator.classList.add(classes.INDICATOR);
				ui.indicator = indicator;
				indicatorIcon = document.createElement("div");
				indicatorIcon.classList.add(classes.INDICATOR_ICON);
				ui.indicatorIcon = indicatorIcon;
				ui.indicator.appendChild(ui.indicatorIcon);
				indicatorText = document.createElement("div");
				indicatorText.classList.add(classes.INDICATOR_TEXT);
				ui.indicatorText = indicatorText;
				indicator.appendChild(indicatorText);
				indicatorSubText = document.createElement("div");
				indicatorSubText.classList.add(classes.INDICATOR_SUBTEXT);
				ui.indicatorSubText = indicatorSubText;
				ui.indicator.appendChild(ui.indicatorSubText);
				element.appendChild(ui.indicator);
			}

			prototype._buildIndicator = function (element) {
				var self = this,
					options = self.options,
					ui = self._ui,
					queryIndicator = element.querySelector(options.indicatorSelector),
					queryIndicatorArrow = element.querySelector(options.indicatorArrowSelector),
					queryIndicatorText = element.querySelector(options.indicatorTextSelector),
					indicatorArrow;

				if (queryIndicator) {
					ui.indicator = queryIndicator;
					if (queryIndicatorText) {
						ui.indicatorText = queryIndicatorText;
					}
				} else {
					createIndicator(ui, element);
				}
				if (queryIndicatorArrow) {
					ui.indicatorArrow = queryIndicatorArrow;
				} else {
					indicatorArrow = document.createElement("div");
					indicatorArrow.classList.add(classes.INDICATOR_ARROW);
					ui.indicatorArrow = indicatorArrow;
					element.appendChild(ui.indicatorArrow);
				}
			};

			/**
			 * Build Selector component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} element
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					items = element.querySelectorAll(self.options.itemSelector),
					layers;

				if (items && items.length) {
					layers = buildLayers(element, items, options);
					element.classList.add(classes.SELECTOR);

					if (options.indicatorAutoControl) {
						self._buildIndicator(element);
					}
					ui.items = items;
					ui.layers = layers;
				} else {
					ns.warn("Please check your item selector option. Default value is '.ui-item'");
					return null;
				}

				return element;
			};

			/**
			 * Init Selector component
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement} element
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._init = function (element) {
				var self = this,
					options = self.options,
					items = self._ui.items,
					activeLayerIndex = self._getActiveLayer(),
					activeItemIndex = self._getActiveItem(),
					validLayout = element.offsetWidth > element.offsetHeight ?
						element.offsetHeight : element.offsetWidth,
					i,
					len;

				self._started = false;
				self._enabled = true;

				self._activeItemIndex = activeItemIndex === null ? 0 : activeItemIndex;

				options.itemRadius = options.itemRadius < 0 ? validLayout / 2 * STATIC.RADIUS_RATIO :
					options.itemRadius;
				len = items.length;
				for (i = 0; i < len; i++) {
					utilDom.setNSData(items[i], "index", i);
					setItemTransform(items[i], DEFAULT.ITEM_END_DEGREE, options.itemRadius,
						-DEFAULT.ITEM_END_DEGREE, DEFAULT.ITEM_NORMAL_SCALE);
				}
				if (activeLayerIndex === null) {
					self._activeLayerIndex = 0;
					self._setActiveLayer(0);
				} else {
					self._activeLayerIndex = activeLayerIndex;
					self._setActiveLayer(activeLayerIndex);
				}
				return element;
			};

			/**
			 * Init items on layer
			 * @method _initItems
			 * @param {HTMLElement} layer
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._initItems = function (layer) {
				var self = this,
					options = self.options,
					items = layer.querySelectorAll(options.itemSelector),
					degree,
					i,
					len;

				len = items.length > options.maxItemNumber ? options.maxItemNumber : items.length;

				for (i = 0; i < len; i++) {
					if (self._itemsToReorder.indexOf(i) === -1) {
						degree = DEFAULT.ITEM_START_DEGREE + (options.itemDegree * i);
						setItemTransform(items[i], degree, options.itemRadius, -degree,
							DEFAULT.ITEM_NORMAL_SCALE);
					}
				}

				if (self._editModeEnabled) {
					self._animateReorderedItems();

					if (self.options.plusButton) {
						len--;
					}
				}

				if (!self._editModeEnabled && len > 0) {
					self._setActiveItem(self._activeItemIndex);
				}
			};

			prototype._animateReorderedItems = function () {
				var self = this,
					options = self.options,
					layer = self._ui.layers[self._activeLayerIndex],
					items = layer.querySelectorAll(options.itemSelector),
					reorderedItems = self._itemsToReorder,
					length = reorderedItems.length,
					degree,
					i;

				if (length) {
					self._disable();
					setTimeout(function () {
						for (i = 0; i < length; i++) {
							degree = DEFAULT.ITEM_START_DEGREE + (options.itemDegree *
								reorderedItems[i]);
							setItemTransform(items[reorderedItems[i]], degree, options.itemRadius,
								-degree, DEFAULT.ITEM_NORMAL_SCALE);
						}
						self._itemsToReorder = [];
					}, 30);
				}
			};

			prototype._addIconRemove = function (item, index) {
				var maxItemNumber = this.options.maxItemNumber,
					iconScaleFactor = 1 / STATIC.SCALE_FACTOR,
					iconElement = document.createElement("div"),
					iconBgElement = document.createElement("div"),
					leftItemsCount,
					removeIconPosition;

				leftItemsCount = parseInt(maxItemNumber / 2, 10) - 1;
				removeIconPosition = (index % maxItemNumber) > leftItemsCount ? "right" : "left";
				iconBgElement.classList.add(classes.ITEM_ICON_REMOVE_BG);

				iconElement.classList.add(classes.ITEM_ICON_REMOVE + "-" + removeIconPosition);
				iconElement.style.transform = "scale(" + iconScaleFactor.toString() + ")";
				iconElement.appendChild(iconBgElement);

				item.classList.add(classes.ITEM_REMOVABLE);
				item.appendChild(iconElement);
			};

			prototype._addRemoveIcons = function () {
				var self = this,
					isRemovable,
					item,
					items = self._ui.items,
					i;

				for (i = 0; i < items.length; i++) {
					item = items[i];
					isRemovable = utilDom.getNSData(item, "removable");
					item.setAttribute("draggable", "true");
					if (isRemovable !== false) {
						self._addIconRemove(item, i);
					}
				}
			};

			prototype._removeRemoveIcons = function () {
				var self = this,
					i,
					items = self._ui.items,
					item;

				for (i = 0; i < items.length; i++) {
					item = items[i];
					if (item.classList.contains(classes.ITEM_REMOVABLE)) {
						item.innerHTML = "";
						item.classList.remove(classes.ITEM_REMOVABLE);
					}
				}
			};
			/**
			 * Bind events on Selector component
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._bindEvents = function () {
				bindEvents(this);
			};

			/**
			 * Handle events on Selector component
			 * @method handleEvent
			 * @param {Event} event
			 * @public
			 * @member ns.widget.wearable.Selector
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "dragstart":
						self._onDragstart(event);
						break;
					case "drag":
						self._onDrag(event);
						break;
					case "dragend":
						self._onDragend(event);
						break;
					case "click":
						self._onClick(event);
						break;
					case "rotarydetent":
						self._onRotary(event);
						break;
					case "transitionend":
						self._onTransitionEnd(event);
						break;
					case "animationend":
					case "webkitAnimationEnd":
						self._onAnimationEnd(event);
						break;
					case "longpress":
						self._onLongPress(event);
						break;
					case "mouseup":
					case "touchend":
						self._onTouchEnd(event);
						break;
					case "tizenhwkey":
						event.stopPropagation();
						self._onHWKey(event);
						break;
					case "swipe":
						self._onSwipe(event);
						break;
				}
			};

			/**
			 * Get the active layer
			 * @method _getActiveLayer
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._getActiveLayer = function () {
				var self = this,
					ui = self._ui,
					i,
					len;

				len = ui.layers.length;
				for (i = 0; i < len; i++) {
					if (ui.layers[i].classList.contains(classes.LAYER_ACTIVE)) {
						return i;
					}
				}
				return null;
			};

			/**
			 * Set the active layer
			 * @method _setActiveLayer
			 * @param {number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._setActiveLayer = function (index) {
				var self = this,
					ui = self._ui,
					active = self._activeLayerIndex,
					activeLayer = ui.layers[active],
					validLayer = ui.layers[index];

				if (activeLayer) {
					removeLayerClasses(activeLayer);
				}
				if (validLayer) {
					addLayerClasses(validLayer);
				}
				self._activeLayerIndex = index;
				if (ui.items.length > 0 && ui.layers[index]) {
					self._initItems(validLayer);
					events.trigger(validLayer, EVENT_TYPE, {
						index: index
					});
				}
			};

			/**
			 * Get the active item
			 * @method _getActiveItem
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._getActiveItem = function () {
				var self = this,
					ui = self._ui,
					i,
					len;

				len = ui.items.length;
				for (i = 0; i < len; i++) {
					if (ui.items[i].classList.contains(classes.ITEM_ACTIVE)) {
						return i;
					}
				}
				return null;
			};

			/**
			 * Set the active item
			 * @method _setActiveItem
			 * @param {number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._setActiveItem = function (index) {
				var self = this,
					element = self.element,
					ui = self._ui,
					items = ui.items,
					transform,
					newTransformStyle,
					active = element.querySelector("." + classes.ITEM_ACTIVE);

				index = index !== undefined ? index : 0;

				transform = items[index].style.transform || items[index].style.webkitTransform;

				if (active) {
					active.style.transform =
						active.style.transform.replace(DEFAULT.ITEM_ACTIVE_SCALE,
							DEFAULT.ITEM_NORMAL_SCALE);
					active.classList.remove(classes.ITEM_ACTIVE);
				}
				if (items.length) {
					items[index].classList.add(classes.ITEM_ACTIVE);
					newTransformStyle = transform.replace(DEFAULT.ITEM_NORMAL_SCALE,
						DEFAULT.ITEM_ACTIVE_SCALE);
					items[index].style.transform = newTransformStyle;
					items[index].style.webkitTransform = newTransformStyle;
					if (self.options.indicatorAutoControl) {
						self._setIndicatorIndex(index);
					}
					self._activeItemIndex = index;
					events.trigger(items[index], EVENT_TYPE.ITEM_CHANGE, {
						layer: ui.layers[self._activeLayerIndex],
						layerIndex: self._activeLayerIndex,
						index: index,
						title: utilDom.getNSData(items[index], "title")
					});
				}
			};

			/**
			 * Set indicator index. Handler direction was set by index value.
			 * @method _setIndicatorIndex
			 * @param {number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._setIndicatorIndex = function (index) {
				var self = this,
					ui = self._ui,
					item = ui.items[index],
					title = utilDom.getNSData(item, "title"),
					icon = utilDom.getNSData(item, "icon"),
					subtext = utilDom.getNSData(item, "subtitle"),
					iconActiveClass = classes.INDICATOR_ICON_ACTIVE,
					iconActiveWithTextClass = classes.INDICATOR_ICON_ACTIVE_WITH_TEXT,
					indicatorWithSubtitleClass = classes.INDICATOR_WITH_SUBTITLE,
					indicator = ui.indicator,
					indicatorText = ui.indicatorText,
					indicatorIcon = ui.indicatorIcon,
					indicatorSubText = ui.indicatorSubText,
					indicatorArrow = ui.indicatorArrow,
					indicatorClassList = indicator.classList,
					indicatorIconClassList = indicatorIcon.classList,
					idcIndex = index % self.options.maxItemNumber;

				if (title) {
					indicatorText.textContent = title;
					if (subtext) {
						indicatorClassList.add(indicatorWithSubtitleClass);
						indicatorSubText.textContent = subtext;
					} else {
						indicatorClassList.remove(indicatorWithSubtitleClass);
						indicatorSubText.textContent = "";
					}
					if (icon) {
						indicatorIconClassList.add(iconActiveWithTextClass);
					}
				} else {
					indicatorText.textContent = "";
					indicatorIconClassList.remove(iconActiveWithTextClass);
				}

				if (icon) {
					indicatorIconClassList.add(iconActiveClass);
					indicatorIcon.style.backgroundImage = "url(" + icon + ")";
					indicatorSubText.textContent = "";
				} else {
					indicatorIconClassList.remove(iconActiveClass);
					indicatorIconClassList.remove(iconActiveWithTextClass);
				}

				utilDom.setNSData(indicator, "index", index);

				setIndicatorTransform(indicatorArrow, DEFAULT.ITEM_START_DEGREE + self.options.itemDegree *
					idcIndex);
			};

			/**
			 * Dragstart event handler
			 * @method _onDragstart
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onDragstart = function () {
				this._started = true;
			};

			/**
			 * Clear active class on animation end
			 * @method _onAnimationEnd
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onAnimationEnd = function (event) {
				var self = this,
					ui = self._ui,
					targetClassList = event.target.classList;

				if (targetClassList.contains(classes.INDICATOR)) {
					ui.indicator.classList.remove(classes.INDICATOR_ACTIVE);
				} else if (targetClassList.contains(classes.ITEM_MOVED)) {
					self._reorderAnimationEnd = true;
					if (self._reorderEnd && !self._started) {
						setTimeout(function () {
							ui.movedItem.classList.add(classes.ITEM_END);
						}, 30);
					}
				}
			};

			prototype._onTransitionEnd = function (event) {
				var self = this,
					targetElement = event.target,
					classList = targetElement.classList;

				if (!self._enabled && classList.contains(classes.ITEM)) {
					if (classList.contains(classes.ITEM_REMOVED)) {
						self.removeItem(parseInt(utilDom.getNSData(targetElement, "index"), 10));
					} else if (classList.contains(classes.ITEM_END)) {
						self._clearReorder();
					} else if (classList.contains(classes.ITEM_MOVED)) {
						requestAnimationFrame(function () {
							classList.add(classes.ITEM_END);
						});
					} else if (!self._reorderEnd) {
						self._enable();
					}
				}
			};

			prototype._clearReorder = function () {
				var self = this,
					ui = self._ui;

				ui.items[self._destinationIndex].classList.remove(classes.ITEM_PLACEHOLDER);
				self.element.removeChild(self._ui.movedItem);
				ui.movedItem = null;
				self.element.classList.remove(classes.REORDER);
				self._movedElementIndex = null;
				self._destinationIndex = null;
				self._pointedLayer = null;
				clearInterval(self._changeLayerInterval);
				self._changeLayerInterval = null;
				self._enable();
				self._reorderEnd = false;
				self._reorderAnimationEnd = false;
			};

			prototype._onDragMovedElement = function (pointedElement, x, y, index) {
				var self = this,
					movedItemStyle = self._ui.movedItem.style,
					pointedClassList = pointedElement && pointedElement.classList;

				movedItemStyle.top = y + "px";
				movedItemStyle.left = x + "px";

				if (pointedElement) {
					if (pointedClassList.contains(classes.LAYER_PREV)) {
						self._pointedLayer = "prev";
					} else if (pointedClassList.contains(classes.LAYER_NEXT)) {
						self._pointedLayer = "next";
					} else {
						self._pointedLayer = null;
						clearInterval(self._changeLayerInterval);
						self._changeLayerInterval = null;
					}
				}

				if (self._enabled) {
					if (pointedElement && self._pointedLayer !== null) {
						self._moveItemToLayer();
					}
					if (index !== null && index !== self._destinationIndex) {
						self._setNewItemDestination(index);
					}
				}
			};

			/**
			 * Drag event handler
			 * @method _onDrag
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onDrag = function (event) {
				var self = this,
					x,
					y,
					pointedElement,
					index = null;

				if (this._started) {
					x = event.detail.estimatedX;
					y = event.detail.estimatedY;
					pointedElement = document.elementFromPoint(x, y);

					if (pointedElement && pointedElement.classList.contains(classes.ITEM) &&
						!pointedElement.classList.contains(classes.ITEM_PLACEHOLDER)) {
						index = parseInt(utilDom.getNSData(pointedElement, "index"), 10);
					}

					if (!self._editModeEnabled && index !== null) {
						self._setActiveItem(index);
					}

					if (self._movedElementIndex !== null) {
						self._onDragMovedElement(pointedElement, x, y, index);
					}
				}
			};

			prototype._moveItemToLayer = function () {
				var self = this,
					layer = self._pointedLayer;

				if (self._changeLayerInterval === null) {
					self._changeLayerInterval = setInterval(function () {
						if (self._pointedLayer !== null && layer === self._pointedLayer) {
							if (layer === "prev") {
								self._setPreviousLayer();
							} else {
								self._setNextLayer();
							}
						}
					}, 1000);
				}
			};

			prototype._setNextLayer = function () {
				var self = this,
					options = self.options,
					items = self._ui.items,
					len = items.length,
					i;

				if (self._enabled) {
					for (i = 0; i < len; i++) {
						utilDom.setNSData(items[i], "index", i);
						setItemTransform(items[i], DEFAULT.ITEM_START_DEGREE, options.itemRadius,
							-DEFAULT.ITEM_START_DEGREE, DEFAULT.ITEM_NORMAL_SCALE);
					}

					self._setItemAndLayer(self._activeLayerIndex + 1,
						(self._activeLayerIndex + 1) * self.options.maxItemNumber);
				}
			};

			prototype._setPreviousLayer = function () {
				var self = this,
					options = self.options,
					items = self._ui.items,
					len = items.length,
					i;

				if (self._enabled) {
					for (i = 0; i < len; i++) {
						utilDom.setNSData(items[i], "index", i);
						setItemTransform(items[i], DEFAULT.ITEM_END_DEGREE, options.itemRadius,
							-DEFAULT.ITEM_END_DEGREE, DEFAULT.ITEM_NORMAL_SCALE);
					}
					self._setItemAndLayer(self._activeLayerIndex - 1,
						self._activeLayerIndex * self.options.maxItemNumber - 1);
				}
			};

			prototype._setNewItemDestination = function (index) {
				var self = this,
					element = self.element,
					destinationIndex = self._destinationIndex,
					items = self._ui.items,
					destinationParent;

				removeLayers(element, self.options);
				destinationParent = items[destinationIndex].parentNode;

				if (index + 1 > self._destinationIndex) {
					destinationParent.insertBefore(items[destinationIndex], items[index + 1]);
				} else {
					destinationParent.insertBefore(items[destinationIndex], items[index]);
				}

				self._ui.items = element.querySelectorAll("." + classes.ITEM + ":not(." +
					classes.ITEM_MOVED + ")");
				self._refresh();

				self._destinationIndex = index;
			};

			prototype._onTouchEnd = function () {
				var self = this,
					ui = self._ui,
					movedElement,
					movedStyle,
					destinationRect;

				if (self._movedElementIndex !== null && !self._reorderEnd) {
					self.disable();
					self._reorderEnd = true;
					movedElement = ui.movedItem;
					movedStyle = movedElement.style;
					movedStyle.transition = "top 200ms, left 200ms, opacity 200ms, transform 200ms";
					destinationRect = ui.items[self._destinationIndex].getBoundingClientRect();
					if (self._reorderAnimationEnd && !self._started) {
						setTimeout(function () {
							movedElement.classList.add(classes.ITEM_END);
						}, 30);
					} else if (self._reorderAnimationEnd) {
						movedStyle.top = (destinationRect.top + destinationRect.width / 2) + "px";
						movedStyle.left = (destinationRect.left + destinationRect.height / 2) +
						"px";
					}
				}
			};

			/**
			 * Dragend event handler
			 * @method _onDragend
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onDragend = function (event) {
				var self = this,
					pointedElement = self._getPointedElement(event.detail),
					index;

				if (!self._editModeEnabled && pointedElement &&
					pointedElement.classList.contains(classes.ITEM)) {
					index = parseInt(utilDom.getNSData(pointedElement, "index"), 10);
					self._setActiveItem(index);
				}

				self._started = false;
			};

			prototype._onClickChangeActive = function (targetElement) {
				var self = this,
					ui = self._ui,
					pointedElement = document.elementFromPoint(event.pageX, event.pageY),
					indicatorClassList = self._ui.indicator.classList,
					activeLayer,
					prevLayer,
					nextLayer,
					index;

				if (ui.items.length > 0) {
					activeLayer = ui.layers[self._activeLayerIndex];
					prevLayer = activeLayer.previousElementSibling;
					nextLayer = activeLayer.nextElementSibling;
				}

				if (targetElement.classList.contains(classes.LAYER_PREV) && prevLayer) {
					self._setPreviousLayer();
				} else if (targetElement.classList.contains(classes.LAYER_NEXT) && nextLayer) {
					self._setNextLayer();
				} else if (self._enabled && !self._editModeEnabled) {
					if (pointedElement && (pointedElement.classList.contains(classes.INDICATOR) ||
							pointedElement.parentElement.classList.contains(classes.INDICATOR))) {
						indicatorClassList.remove(classes.INDICATOR_ACTIVE);
						requestAnimationFrame(function () {
							indicatorClassList.add(classes.INDICATOR_ACTIVE);
						});
					}
					if (pointedElement && pointedElement.classList.contains(classes.ITEM)) {
						index = parseInt(utilDom.getNSData(pointedElement, "index"), 10);
						self._setActiveItem(index);
					}
				}
			};

			/**
			 * Click event handler
			 * @method _onClick
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onClick = function (event) {
				var self = this,
					targetElement = event.target,
					targetClassList = targetElement.classList,
					activeItem = self._getActiveItem(),
					indicatorClassList = null;

				if (activeItem !== null &&
					self._ui.items[activeItem] === targetElement) {
					// Show press effect on selector indicator after click on selected item
					indicatorClassList = self._ui.indicator.classList;
					requestAnimationFrame(function () {
						indicatorClassList.add(classes.INDICATOR_ACTIVE);
					});
				}

				self._onClickChangeActive(targetElement);

				if (targetElement.classList.contains(classes.PLUS_BUTTON)) {
					self.trigger("add");
				}

				if (self._editModeEnabled) {
					event.stopImmediatePropagation();
					if (self._enabled &&
						(targetClassList.contains(classes.ITEM_ICON_REMOVE + "-left") ||
						targetClassList.contains(classes.ITEM_ICON_REMOVE + "-right"))) {
						self._disable();
						targetElement.parentElement.classList.add(classes.ITEM_REMOVED);
					}
				}

			};

			/**
			 * Sets active layer and item
			 * @param {number} layerIndex
			 * @param {number} itemIndex
			 * @private
			 */
			prototype._setItemAndLayer = function (layerIndex, itemIndex) {
				this._activeItemIndex = itemIndex;
				this._changeLayer(layerIndex);
			};

			prototype._onRotaryCW = function () {
				var self = this,
					ui = self._ui,
					options = self.options,
					activeLayer = ui.layers[self._activeLayerIndex],
					activeLayerItemsLength = activeLayer &&
						activeLayer.querySelectorAll(options.itemSelector).length,
					bounceDegree;

				// check length
				if ((self._activeItemIndex === (activeLayerItemsLength +
						self._activeLayerIndex * options.maxItemNumber) - 1) ||
					self._editModeEnabled) {
					if (self._siblingLayerExists("next")) {
						self._setNextLayer();
					} else {
						bounceDegree = DEFAULT.ITEM_START_DEGREE + options.itemDegree *
							(self._activeItemIndex % options.maxItemNumber);
						setIndicatorTransform(ui.indicatorArrow, bounceDegree +
							options.itemDegree / 3);
						setTimeout(function () {
							setIndicatorTransform(ui.indicatorArrow, bounceDegree);
						}, 100);
					}
				} else {
					self._changeItem(self._activeItemIndex + 1);
				}
			};

			prototype._onRotaryCCW = function () {
				var self = this,
					ui = self._ui,
					options = self.options;

				// check 0
				if ((self._activeItemIndex % options.maxItemNumber === 0) ||
					self._editModeEnabled) {
					if (self._siblingLayerExists("prev")) {
						self._setPreviousLayer();
					} else {
						setIndicatorTransform(ui.indicatorArrow, DEFAULT.ITEM_START_DEGREE -
							DEFAULT.ITEM_START_DEGREE / 3);
						setTimeout(function () {
							setIndicatorTransform(ui.indicatorArrow, DEFAULT.ITEM_START_DEGREE);
						}, 100);
					}
				} else {
					self._changeItem(self._activeItemIndex - 1);
				}
			};

			/**
			 * Rotary event handler
			 * @method _onRotary
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onRotary = function (event) {
				var self = this,
					ui = self._ui,
					options = self.options,
					direction = event.detail.direction;

				if (!options.indicatorAutoControl || !self._enabled || ui.items.length === 0) {
					return;
				}
				event.stopPropagation();

				if (direction === "CW") {
					self._onRotaryCW();
				} else {
					self._onRotaryCCW();
				}
			};

			/**
			 * Hide items on layer
			 * @method _hideItems
			 * @param {HTMLElement} layer
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._hideItems = function (layer) {
				var self = this,
					items = layer.getElementsByClassName(classes.ITEM),
					i,
					len;

				layer.classList.add(classes.LAYER_HIDE);
				len = items.length;
				for (i = 0; i < len; i++) {
					setItemTransform(items[i], DEFAULT.ITEM_START_DEGREE, self.options.itemRadius,
						-DEFAULT.ITEM_START_DEGREE, DEFAULT.ITEM_NORMAL_SCALE);
				}

				setTimeout(function () {
					len = items.length;
					for (i = 0; i < len; i++) {
						setItemTransform(items[i], DEFAULT.ITEM_END_DEGREE, self.options.itemRadius,
							-DEFAULT.ITEM_END_DEGREE, DEFAULT.ITEM_NORMAL_SCALE);
					}
					layer.classList.remove(classes.LAYER_HIDE);
				}, 150);
			};

			prototype._setIndexes = function () {
				var self = this,
					ui = self._ui,
					items = ui.items,
					i;

				for (i = 0; i < ui.items.length; i++) {
					utilDom.setNSData(items[i], "index", i);
				}
			};

			prototype._refreshEditMode = function () {
				var self = this,
					ui = self._ui,
					items = ui.items,
					options = self.options,
					reorderedItems = self._itemsToReorder,
					maxItemNumber = options.maxItemNumber,
					activeLayerIndex = self._activeLayerIndex,
					lastOnLayerIndex = (activeLayerIndex + 1) * maxItemNumber,
					firstOnLayerIndex = activeLayerIndex * maxItemNumber,
					index,
					additionalDegree,
					i,
					isCorrectIndex;

				for (i = 0; i < ui.items.length; i++) {
					index = parseInt(utilDom.getNSData(items[i], "index"), 10);
					isCorrectIndex = i !== index && !Number.isNaN(index);
					if (isCorrectIndex &&
						(i < lastOnLayerIndex) &&
						(i >= firstOnLayerIndex) &&
						!items[i].classList.contains(classes.ITEM_PLACEHOLDER)) {
						if (index >= lastOnLayerIndex) {
							additionalDegree = DEFAULT.ITEM_START_DEGREE +
								(options.itemDegree * maxItemNumber);
							setItemTransform(items[i], additionalDegree, options.itemRadius,
								-additionalDegree, DEFAULT.ITEM_NORMAL_SCALE);
						}
						reorderedItems.push(i % maxItemNumber);
					}
				}

			};

			/**
			 * Refresh Selector component
			 * @method _refresh
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._refresh = function () {
				var self = this,
					ui = self._ui,
					items = ui.items,
					options = self.options,
					element = self.element;

				if (self._editModeEnabled) {
					self._removeRemoveIcons();
					self._refreshEditMode();
					self._setIndexes();
					self._addRemoveIcons();
				} else {
					self._setIndexes();
				}

				ui.layers = buildLayers(element, items, options);

				self._setActiveLayer(self._activeLayerIndex);
			};

			/**
			 * Change active layer
			 * @method _changeLayer
			 * @param {number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._changeLayer = function (index) {
				var self = this,
					layers = self._ui.layers,
					activeLayer = layers[self._activeLayerIndex];

				if (index < 0 || index > layers.length - 1) {
					ns.warn("Please insert index between 0 to layers number");
					return;
				}
				self._enabled = false;
				self._hideItems(activeLayer);
				requestAnimationFrame(function () {
					self._setActiveLayer(index);
				});
			};

			prototype._onLongPress = function (event) {
				var self = this,
					pointedElement = self._getPointedElement(event.detail),
					pointedClassList = pointedElement.classList,
					index = parseInt(utilDom.getNSData(pointedElement, "index"), 10),
					movedElement;

				if (self.options.editable && self._editModeEnabled === false) {
					self._enableEditMode();
				}

				if (self._editModeEnabled && pointedClassList.contains(classes.ITEM) &&
					!pointedClassList.contains(classes.PLUS_BUTTON)) {
					movedElement = self._ui.items[index];
					self._cloneMovedItem(index);
					movedElement.classList.add(classes.ITEM_PLACEHOLDER);
					self._movedElementIndex = index;
					self._destinationIndex = index;
					self.element.classList.add(classes.REORDER);
				}
			};

			prototype._getPointedElement = function (detail) {
				var x = detail.estimatedX,
					y = detail.estimatedY;

				return document.elementFromPoint(x, y);
			};

			prototype._cloneMovedItem = function (index) {
				var self = this,
					element = self.element,
					clonedElement,
					clonedElementRect,
					movedElement,
					initialPosX,
					initialPosY;

				clonedElement = self._ui.items[index];
				movedElement = clonedElement.cloneNode(true);
				clonedElementRect = clonedElement.getBoundingClientRect();
				// This sets moved item in the middle of cloned item
				// Additional operations are needed due to margins set on items
				initialPosX = clonedElementRect.left + clonedElementRect.height / 2;
				initialPosY = clonedElementRect.top + clonedElementRect.width / 2;
				movedElement.classList.add(classes.ITEM_MOVED);
				movedElement.setAttribute("style", "left:" + initialPosX + "px; top:" +
					initialPosY + "px");
				element.appendChild(movedElement);
				self._ui.movedItem = element.querySelector("." + classes.ITEM_MOVED);
			};

			prototype._onHWKey = function (event) {
				var self = this;

				if (event.keyName === "back" && self.options.editable && self._editModeEnabled) {
					self._disableEditMode();
				}
			};

			/**
			 * Check if sibling (next or previous) layer exists
			 * @method _siblingLayerExists
			 * @param {string} sibling ["next", "prev"]
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._siblingLayerExists = function (sibling) {
				var self = this,
					next = sibling === "next",
					ui = self._ui,
					activeLayer = ui.layers[self._activeLayerIndex],
					siblingLayer = activeLayer && (next ?
						activeLayer.nextElementSibling :
						activeLayer.previousElementSibling);

				return siblingLayer && siblingLayer.classList.contains(next ?
					classes.LAYER_NEXT :
					classes.LAYER_PREV);
			}

			prototype._onSwipe = function (event) {
				var self = this;

				if ((event.detail.direction === "right") &&
					(self._siblingLayerExists("next"))) {
					self._setNextLayer();
				} else if ((event.detail.direction === "left") &&
					(self._siblingLayerExists("prev"))) {
					self._setPreviousLayer();
				}
			};

			prototype._addPlusButton = function () {
				var plusButtonElement;

				plusButtonElement = document.createElement("div");
				plusButtonElement.classList.add(classes.PLUS_BUTTON);
				utilDom.setNSData(plusButtonElement, "removable", "false");

				this.addItem(plusButtonElement);
			};

			prototype._removePlusButton = function () {
				var self = this,
					items = self._ui.items,
					lastItemIndex = items.length - 1,
					itemsOnLayer = self.options.maxItemNumber,
					activeLayerIndex = self._activeLayerIndex,
					firstItemOnLayerIndex;

				firstItemOnLayerIndex = activeLayerIndex * itemsOnLayer;

				if (lastItemIndex === firstItemOnLayerIndex) {
					self._changeLayer(activeLayerIndex - 1);
				}

				if (items[lastItemIndex].classList.contains(classes.PLUS_BUTTON)) {
					self.removeItem(lastItemIndex);
				}
			};

			prototype._enableEditMode = function () {
				var self = this,
					ui = self._ui,
					length = ui.items.length,
					activeItem = ui.items[self._activeItemIndex];

				if (self.options.plusButton) {
					self._addPlusButton();
				}

				self._addRemoveIcons();

				self.element.classList.add(classes.EDIT_MODE);
				ui.indicatorText.textContent = "Edit mode";
				if (length > 0) {
					activeItem.classList.remove(classes.ITEM_ACTIVE);
					requestAnimationFrame(function () {
						activeItem.style.transform =
							activeItem.style.transform.replace(DEFAULT.ITEM_ACTIVE_SCALE,
								DEFAULT.ITEM_NORMAL_SCALE);
					});
				}
				events.on(window, "tizenhwkey", self, true);
				self._editModeEnabled = true;
			};

			prototype._disableEditMode = function () {
				var self = this,
					items,
					ui = self._ui,
					elementClassList = self.element.classList;

				if (self.options.plusButton) {
					self._removePlusButton();
				}

				elementClassList.remove(classes.EDIT_MODE);

				items = ui.items;
				if (items.length > 0) {
					items[self._activeItemIndex].classList.add(classes.ITEM_ACTIVE);
					self._removeRemoveIcons();
					requestAnimationFrame(function () {
						self._setActiveItem(self._activeItemIndex);
					});
				} else {
					ui.indicatorText.textContent = self.options.emptyStateText;
					ui.indicatorSubText.textContent = "";
					ui.indicatorIcon.classList.remove(classes.INDICATOR_ICON_ACTIVE,
						classes.INDICATOR_ICON_ACTIVE_WITH_TEXT);
				}
				events.off(window, "tizenhwkey", self, true);

				self._editModeEnabled = false;
			};

			/**
			 * Change active item on active layer
			 * @method _changeItem
			 * @param {number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._changeItem = function (index) {
				this._setActiveItem(index);
			};

			/**
			 * Change active item on active layer
			 * @method changeItem
			 * @param {number} index
			 * @public
			 * @member ns.widget.wearable.Selector
			 */
			prototype.changeItem = function (index) {
				this._changeItem(index);
			};

			/**
			 * Add new item
			 * @method addItem
			 * @param {HTMLElement} item
			 * @param {number} index
			 * @public
			 * @member ns.widget.wearable.Selector
			 */
			prototype.addItem = function (item, index) {
				var self = this,
					element = self.element,
					items = element.querySelectorAll(self.options.itemSelector),
					plusBtnIndex = items.length - 1,
					plusBtnEnabled = items[plusBtnIndex].classList.contains(classes.PLUS_BUTTON),
					ui = self._ui,
					length = plusBtnEnabled ? ui.items.length : ui.items.length - 1;

				removeLayers(self.element, self.options);
				setItemTransform(item, DEFAULT.ITEM_END_DEGREE,
					self.options.itemRadius, -DEFAULT.ITEM_END_DEGREE, DEFAULT.ITEM_NORMAL_SCALE);
				item.classList.add(classes.ITEM);

				if (index >= 0 && index < length) {
					element.insertBefore(item, items[index]);
				} else if (plusBtnEnabled) {
					element.insertBefore(item, items[plusBtnIndex]);
				} else {
					element.appendChild(item);
				}
				ui.items = element.querySelectorAll(self.options.itemSelector);
				self._refresh();
			};

			/**
			 * Remove item on specific layer
			 * @method removeItem
			 * @param {number} index
			 * @public
			 * @member ns.widget.wearable.Selector
			 */
			prototype.removeItem = function (index) {
				var self = this,
					ui = self._ui,
					element = self.element,
					length,
					itemsOnLayer = self.options.maxItemNumber;

				removeLayers(self.element, self.options);

				element.removeChild(ui.items[index]);
				ui.items = element.querySelectorAll(self.options.itemSelector);
				length = ui.items.length;

				/** This block checks if the removed item is last on active layer, and if this
				 *  condition is true, it changes active layer to previous one.
				 */
				if ((index % itemsOnLayer === 0) && (index === ui.items.length - 1)) {
					self._changeLayer(self._activeLayerIndex - 1);
				}

				if (self._activeItemIndex >= length) {
					self._activeItemIndex = length - 1;
				}

				self._refresh();
			};

			/**
			 * Removes given item from widget
			 * @method removeGivenItem
			 * @param {HTMLElement} item
			 * @public
			 * @member ns.widget.wearable.Selector
			 */
			prototype.removeItemByElement = function (item) {
				var self = this,
					index = Array.prototype.indexOf.call(self._ui.items, item);

				if (index !== -1) {
					self.removeItem(index);
				}
			}

			prototype._destroy = function () {
				var self = this,
					activeItem;

				unbindEvents(self);
				activeItem = self._getActiveItem();
				if (activeItem !== null) {
					self._ui.items[activeItem].classList.remove(classes.ITEM_ACTIVE);
				}
				self._ui = null;
			};

			/**
			 * Disable Selector
			 * @method _disable
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._disable = function () {
				this._enabled = false;
			};

			/**
			 * Enable Selector
			 * @method _enable
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._enable = function () {
				this._enabled = true;
			};

			ns.widget.wearable.Selector = Selector;
			engine.defineWidget(
				"Selector",
				".ui-selector",
				[
					"changeItem",
					"addItem",
					"removeItem",
					"enable",
					"disable"
				],
				Selector,
				"wearable"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.wearable.Selector;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
