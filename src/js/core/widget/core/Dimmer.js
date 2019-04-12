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
/*global window, define, ns */
/**
 * #Dimmer
 *
 * @example
 *    <div class="ui-dimmer"></dimmer>
 *
 * @since 5.0
 * @class ns.widget.core.Dimmer
 * @extends ns.widget.core.BaseWidget
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/DOM/css",
			"../core",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.util.object,

				Dimmer = function () {
					this.options = utilsObject.merge({}, Dimmer.defaults);
					this.bulbMode = false;
					this._observer = null;
					this._observerCallback = this._checkStyleChange.bind(this);
					this._refreshCallback = this.refresh.bind(this);
				},

				DOMUtils = ns.util.DOM,

				defaults = {
					value: 50,
					min: 0,
					max: 100,
					bulb: false,
					options: "30:blue; 60:yellow; 100:red"
				},

				classes = {
					UI_DIMMER: "ui-dimmer",
					UI_DIMMER_BULB: "ui-dimmer-lightbulb",
					UI_DIMMER_BULB_LIGHT: "ui-dimmer-lightbulb-light",
					UI_DIMMER_TEXT: "ui-dimmer-text",
					UI_DIMMER_HIDDEN: "ui-dimmer-hidden"
				},

				BaseWidget = ns.widget.BaseWidget,
				prototype = new BaseWidget();

			Dimmer.prototype = prototype;
			Dimmer.defaults = defaults;
			Dimmer.classes = classes;

			prototype._init = function (element) {
				var self = this,
					observer = new MutationObserver(this._observerCallback);

				if (!element.getAttribute("value")) {
					element.setAttribute("value", self.options.value);
				}

				observer.observe(element, {attributes: true});
				self._observer = observer;

				return element;
			};

			function rebuild(element, bulbMode) {
				var child = document.createElement("div"),
					text = element.querySelector("." + classes.UI_DIMMER_TEXT),
					light = element.querySelector("." + classes.UI_DIMMER_BULB_LIGHT),
					elementCls = element.classList;

				if (child) {
					if (bulbMode) {
						text.classList.add(classes.UI_DIMMER_HIDDEN);
						light.classList.remove(classes.UI_DIMMER_HIDDEN);
					} else {
						text.classList.remove(classes.UI_DIMMER_HIDDEN);
						light.classList.add(classes.UI_DIMMER_HIDDEN);
					}
				}

				if (bulbMode) {
					elementCls.add(classes.UI_DIMMER_BULB);
				} else {
					elementCls.remove(classes.UI_DIMMER_BULB);
				}
			}

			function processBulbMode(element) {
				return DOMUtils.getCSSProperty(element, "background-image", "none", "string") !==
						"none";
			}

			prototype._checkStyleChange = function (mutationsList) {
				var self = this,
					options = self.options,
					refresh = self._refreshCallback;

				mutationsList.forEach(function (mutation) {
					if (mutation.attributeName === "style") {
						options.bulb = processBulbMode(mutation.target);
						refresh();
					}
				});
			};


			prototype._refresh = function () {
				var self = this;

				rebuild(self.element, self.options.bulb);
				self.value(self.options.value);
			};

			prototype._build = function (element) {
				var bulb = processBulbMode(element),
					options = this.options,
					textElement = element.querySelector("." + classes.UI_DIMMER_TEXT),
					light = document.createElement("div");

				if (!textElement) {
					textElement = document.createElement("span");
					textElement.classList.add(classes.UI_DIMMER_TEXT);
					element.appendChild(textElement);
				}
				light.classList.add(classes.UI_DIMMER_BULB_LIGHT);
				element.appendChild(light);

				if (!bulb) {
					bulb = element.classList.contains(classes.UI_DIMMER_BULB);

					if (!options.bulb) {
						options.bulb = bulb;
					}
				}

				rebuild(element, options.bulb);

				this._refreshValue(element);

				return element;
			};

			prototype._destroy = function () {
				this._observer.disconnect();
				this.element.innerHTML = "";
			};

			prototype._refreshValue = function (element) {
				var self = this,
					options = self.options,
					value = options.value,
					min = options.min,
					max = options.max,
					textElement,
					colors = [],
					ranges = [],
					opacity,
					items,
					itemArray,
					lightElement,
					i;

				element = element || self.element;
				textElement = element.querySelector(".ui-dimmer-text");

				if (!options.bulb) {
					value = parseInt(value, 10);
					opacity = value / max;
					element.style.border = "60px solid rgba(0, 151, 216, " + opacity + ")";
					textElement.innerHTML = value + "%";
					return true;
				} else if (options.bulb && options.options) {
					items = options.options.replace(/\s+/g, "").split(";").filter(function (item) {
						return item && item.length > 0;
					});

					items.forEach(function (item) {
						itemArray = item.split(":");
						ranges.push(itemArray[0]);
						colors.push(itemArray[1]);
					});

					lightElement = element.querySelector("." + classes.UI_DIMMER_BULB_LIGHT);
					ranges.unshift(min);

					for (i = 0; i < ranges.length; i++) {
						if (i > 0 && value < ranges[i] && value > ranges[i - 1]) {
							lightElement.style.backgroundColor = colors[i - 1];
							return true;
						}
					}
				}
			}

			prototype._setValue = function (element, value) {
				var self = this,
					options = self.options;

				// Patch for BaseWidget.value
				if (!(element instanceof HTMLElement)) {
					value = element;
					element = self.element;
				}

				if (value < options.min) {
					value = options.min;
				} else if (value > options.max) {
					value = options.max;
				}

				options.value = value;
				element.setAttribute("value", value);

				self._refreshValue();

				return false;
			};

			prototype._setBulb = function (element, value) {
				this.options.bulb = value;

				return true;
			};

			prototype._getValue = function () {
				return parseInt(this.element.getAttribute("value"), 10);
			};

			ns.widget.core.Dimmer = Dimmer;
			ns.engine.defineWidget(
				"Dimmer",
				"." + classes.UI_DIMMER,
				[],
				Dimmer,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Dimmer;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
