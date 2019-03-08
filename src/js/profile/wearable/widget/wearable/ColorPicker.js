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
 * # ColorPicker Component
 *
 * Color picker is a Tizen component based on Selector, dedicated for easy color selection.
 * It works in a similar way to Selector and all Selector methods are compatible with Color
 * Picker as well. Compared to Selector it has additional methods for getting the value of selected
 * color. The component has built-in set of 11 default colors.
 *
 * ## HTML example
 *
 *          @example
 *              <div class="ui-page ui-page-active" id="main">
 *                  <div id="colorpicker" class="ui-colorpicker">
 *                  </div>
 *              </div>
 *
 * ## Manual constructor
 *
 *          @example
 *              (function() {
 *                  var page = document.getElementById("main"),
 *                      colorpicker = document.getElementById("colorpicker"),
 *                      clickBound;
 *
 *                  function onClick(event) {
 *                      var activeItem = selector.querySelector(".ui-item-active");
 *                  }
 *                  page.addEventListener("pagebeforeshow", function() {
 *                      clickBound = onClick.bind(null);
 *                      tau.widget.Selector(selector);
 *                      colorpicker.addEventListener("click", clickBound, false);
 *                  });
 *                  page.addEventListener("pagebeforehide", function() {
 *                      colorpicker.removeEventListener("click", clickBound, false);
 *                  });
 *              })();
 *
 * ## Options
 * This component has no additional options.
 *
 * @class ns.widget.wearable.ColorPicker
 * @author Dariusz Dyrda <d.dyrda@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../wearable",
			"./Selector"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var Selector = ns.widget.wearable.Selector,
				engine = ns.engine,
				ColorPicker = function () {
					var self = this;

					self.options = {};
					Selector.call(self);
				},

				colorDefinitions = {
					red: "#FE0030",
					darkorange: "#FE5E34",
					orange: "#FE8E38",
					yellow: "#FEEE43",
					yellowgreen: "#82C350",
					green: "#00B455",
					darkturquoise: "#00A99C",
					deepskyblue: "#00B0EA",
					darkblue: "#0058A1",
					purple: "#6A338D",
					grey: "#727272"
				},

				WIDGET_CLASS = "ui-colorpicker",

				classes = {
					WIDGET: WIDGET_CLASS,
					SELECTOR: "ui-selector",
					ITEM: "ui-item",
					INDICATOR: "ui-selector-indicator-text",
					ITEM_ACTIVE: "ui-item-active"
				},

				activeColor,

				prototype = new Selector();

			/**
			 * Dictionary for ColorPicker related events.
			 * For color picker, it is an empty object.
			 * @property {Object} events
			 * @member ns.widget.wearable.ColorPicker
			 * @static
			 */
			ColorPicker.events = {};

			/**
			 * Build ColorPicker component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.ColorPicker
			 */
			prototype._build = function (element) {
				var self = this;

				self._createItems(element);
				Selector.prototype._build.call(self, element);
				element.classList.add(WIDGET_CLASS, classes.SELECTOR);

				return element;
			};

			/**
			 * Create selector items based on colorDefinitions array
			 * @method _createItems
			 * @param {HTMLElement} element
			 * @protected
			 */
			prototype._createItems = function (element) {
				var itemClass = classes.ITEM,
					item;

				Object.keys(colorDefinitions).forEach(function (color) {
					item = document.createElement("div");
					item.classList.add(itemClass);
					item.style.backgroundColor = colorDefinitions[color];
					item.setAttribute("data-title", color);
					element.appendChild(item);
				});
			};

			/**
			 * Set the active color and set indicator background
			 * @method _setActiveItem
			 * @param {number} index
			 * @protected
			 */
			prototype._setActiveItem = function (index) {
				var self = this,
					activeItem,
					indicator;

				Selector.prototype._setActiveItem.call(self, index);

				indicator = self.element.querySelector("." + classes.INDICATOR);
				activeItem = self.element.querySelector("." + classes.ITEM_ACTIVE).getAttribute("data-title");

				activeColor = colorDefinitions[activeItem];
				indicator.style.backgroundColor = activeColor;
			};

			/**
			 * This method returns hex value of the selected color
			 * @method getSelectedColor
			 * @return {string} color
			 * @public
			 * @member ns.widget.wearable.ColorPicker
			 */
			prototype.getSelectedColor = function () {
				return activeColor;
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.ColorPicker
			 */
			prototype._destroy = function () {
				var self = this,
					element = self.element;

				Selector.prototype._destroy.call(self);
				element.innerHTML = "";
			};

			ColorPicker.prototype = prototype;
			ns.widget.wearable.ColorPicker = ColorPicker;

			engine.defineWidget(
				"ColorPicker",
				".ui-colorpicker",
				[
					"getSelectedColor"
				],
				ColorPicker
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ColorPicker;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
