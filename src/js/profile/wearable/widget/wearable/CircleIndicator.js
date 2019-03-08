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
/* global window, define, ns */
/**
 * # CircleIndicator Widget
 *
 * Shows a control that indicates the circular shape progress of an on-going operation.
 *
 *
 * ## Sample implementation of circular indicator
 * To add a circular indicator widget to the application, use the following code:
 *
 *      @example
 *      <div class="ui-circleindicator app-circleindicator internal"
 *          data-circle-r="0"
 *          data-from="0"
 *          data-to="210"
 *          data-start="240"
 *          data-cut="140"
 *
 *          data-text="standard"
 *          data-text-r="140"
 *          data-text-color="rgba(154,178,179,1)"
 *
 *          data-big-tick="25"
 *          data-big-tick-r="176"
 *          data-big-tick-height="6"
 *
 *          data-small-tick="1"
 *          data-small-tick-r="174"
 *          data-small-tick-height="2"
 *
 *          data-indicator-type="line"
 *          data-indicator-height="130"
 *          data-indicator-Color="rgba(255,0,0,0.8)"
 *          data-indicator-r="170"
 *      ></div>
 *      <script>
 *
 *          var // get element to build indicator
 *              element = document.querySelector(".ui-circleindicator"),
 *              // create speedometer widget
 *              speedometer = tau.widget.CircleIndicator(element);
 *
 *          // set widget value
 *          speedometer.value(0);
 *      </script>
 *
 * @class ns.widget.wearable.CircleIndicator
 * @since 3.0
 * @extends ns.widget.core.BaseWidget
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../wearable",
			"../../../../core/widget/BaseWidget",
			"../../../../core/util/polar",
			"../../../../core/util/array"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.core.CircleIndicator
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * svg drawing helper
				 * @property {ns.util.polar} polar
				 * @member ns.util.polar
				 * @private
				 */
				polar = ns.util.polar,
				/**
				 * array utils
				 * @property {ns.util.array} arrayUtil
				 * @member ns.util.array
				 * @private
				 */
				arrayUtil = ns.util.array,
				/**
				 * Alias for class CircleIndicator
				 * @method CircleIndicator
				 * @member ns.widget.core.CircleIndicator
				 * @private
				 * @static
				 */
				CircleIndicator = function () {
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {number} [options.circleR = 0] radius for circle, if
					 * circle === 0 then don't draw it

					 * @property {number} [options.from = 0] first step for drawing scale
					 * @property {number} [options.to = 0] last step for drawing scale.
					 * ratio 360 / (to - from) describe how many steps will be set on 360deg circle
					 * @property {number} [options.start = 0] starting point for drawing scale.
					 * @property {number} [options.cut = 0] from where to stop drawing.

					 * @property {string} [options.text = none] ("none", "standard", "rotated") define text and its type
					 * @property {number} [options.textR = 180] radius for text
					 * @property {string} [options.textColor = "white"] color for text if defined
					 * @property {number} [options.textDigits = "0"] represent number with defined number of digits

					 * @property {number} [options.bigTick = 180] start point for drawing bigTick
					 * @property {number} [options.bigTickHeight = 10] height for bigTick
					 * @property {number} [options.bigTickWidth = 3] width for bigTick
					 * @property {number} [options.bigTickR = 0] radius for bigThick

					 * @property {number} [options.smallTick = 180] start point for drawing smallTick
					 * @property {number} [options.smallTickHeight = 10] height for smallTick
					 * * @property {number} [options.bigTickWidth = 1] width for smallTick
					 * @property {number} [options.smallTickR = 0] radius for smallThick

					 * @property {string} [options.indicatorType = "arc"] radius for text
					 * @property {string} [options.indicatorColor = "red"] radius for text
					 * @property {number} [options.indicatorHeight = 40] radius for text
					 * @property {number} [options.indicatorWidth = 2] radius for text
					 * @property {number} [options.indicatorR = 180] radius for text
					 * @member ns.widget.core.CircleIndicator
					 */
					this.options = {
						circleR: 0,
						circleStartArc: 0,
						circleEndArc: 0,
						circleWidth: 2,
						circleColor: "white",

						from: 0,
						to: 60,
						start: 0,
						cut: 0,

						text: "none",
						textR: 180,
						textColor: "white",
						textDigits: 0,

						bigTick: 0,
						bigTickColor: "white",
						bigTickHeight: 10,
						bigTickWidth: 3,
						bigTickR: 0,

						smallTick: 0,
						smallTickHeight: 5,
						smallTickWidth: 1,
						smallTickR: 0,
						smallTickColor: "white",

						indicatorType: "arc",
						indicatorColor: "red",
						indicatorHeight: 40,
						indicatorWidth: 2,
						indicatorR: 180
					};
					this._ui = {
						element: null
					};
					this.indicatorValue = 0;
					this.minimumCirclePoints = 0;
				},

				WIDGET_CLASS = "ui-circleindicator",
				classes = {
					WIDGET: WIDGET_CLASS
				},

				prototype = new BaseWidget();

			CircleIndicator.classes = classes;

			/**
			 * Helper method for parse indicated object properties to int value
			 * @param {Object} object
			 * @param {string[]} props
			 * @method parseIntObject
			 * @private
			 * @member ns.widget.wearable.CircleIndicator
			 */
			function parseIntObject(object, props) {
				var property = null;

				arrayUtil.forEach(props, function (propertyName) {
					property = object[propertyName];
					if (typeof property !== "number" && !Number.isInteger(property)) {
						object[propertyName] = parseInt(property, 10);
					}
				});
			}

			function prepareTick(svg, properties) {
				var svgElement = null,
					width = properties.width,
					height = properties.height,
					degrees = properties.degrees,
					tickHeight = properties.tickHeight;

				svgElement = polar.addRadius(svg, {
					classes: properties.classes,
					x: width / 2,
					y: height / 2,
					r: properties.r,
					degrees: degrees,
					length: tickHeight,
					direction: "out",
					width: properties.strokeWidth,
					color: properties.color,
					animation: properties.animation || false
				});

				return svgElement;
			}

			function prepareCircle(svg, properties) {
				polar.addCircle(svg, {
					arcStart: 0,
					arcEnd: 360,
					r: properties.r,
					width: properties.width,
					color: properties.color,
					fill: "none"
				});
			}

			function prepareArc(svg, properties) {
				polar.addArc(svg, {
					arcStart: properties.arcStart,
					arcEnd: properties.arcEnd,
					r: properties.r - 50,
					width: properties.width,
					color: properties.color,
					fill: "none"
				});
			}

			function prepareArcIndicator(self, properties) {
				var svgIndicator = polar.createSVG(self._ui.element),
					circleIndicator = null,
					options = self.options,
					startPointForAnimation = 0,
					start = parseInt(options.start, 10),
					r = parseInt(properties.r, 10),
					minimumCirclePoints = 0;

				self._ui.svgIndicator = svgIndicator;
				polar.addCircle(svgIndicator, {
					arcStart: 0,
					arcEnd: 360,
					r: r,
					width: 8,
					color: properties.color,
					fill: "transparent"
				});

				circleIndicator = svgIndicator.querySelector("circle");

				//Im using dasharray which starts from right center
				//in order to to set proper start point 90deg needs to be added to start
				//point
				startPointForAnimation = start - 90;

				//minimum circle points depends on r
				minimumCirclePoints = 2 * Math.PI * r;
				circleIndicator.setAttribute("stroke-dasharray", "" + minimumCirclePoints);

				//set the beginning for animation
				svgIndicator.style.transform = "rotate(" + startPointForAnimation + "deg)";

				//hiding indicator at the beginning
				circleIndicator.setAttribute("stroke-dashoffset", "" + minimumCirclePoints);
				self.minimumCirclePoints = minimumCirclePoints;
				return circleIndicator;
			}

			function createTextIndex(index, textDigits) {
				var i = 0,
					textLength = 0,
					textIndex = index + "";

				if (textDigits > 0 && textIndex.toString().length < textDigits) {
					for (i = 0, textLength = textDigits - index.toString.length; i < textLength; i++) {
						textIndex = "0" + textIndex;
					}
				}
				return textIndex;
			}

			function prepareTickText(self, index, width, height, degrees) {
				var options = self.options,
					svg = self._ui.svg,
					text = options.text,
					textDigits = options.textDigits,
					textColor = options.textColor,
					textIndex = "",
					textPolarToCartesian = null,
					textTransform = "";


				textPolarToCartesian = polar.polarToCartesian(width / 2, height / 2 + 8, options.textR, degrees);
				textIndex = createTextIndex(index, textDigits);

				//only if bigTick is set and text defined
				if (text === "rotated") {
					textTransform = "rotate(" + degrees + "," + textPolarToCartesian.x + "," + (textPolarToCartesian.y - 8) + ")";
				}
				polar.addText(svg, {
					x: textPolarToCartesian.x,
					y: textPolarToCartesian.y,
					text: textIndex,
					transform: textTransform,
					color: textColor
				});
			}

			function prepareTickCircle(self, element, index) {
				var options = self.options,
					svg = self._ui.svg,
					degreeRatio = 360 / (options.to - options.from),
					degrees = index * degreeRatio + options.start,
					elementRect = element.getClientRects()[0],
					width = elementRect.width,
					height = elementRect.height;

				// bigTick parameter lets you draw with the given degree step
				if (options.bigTick && index % options.bigTick === 0) {
					prepareTick(svg, {
						"degrees": degrees,
						"width": width,
						"height": height,
						"tickHeight": options.bigTickHeight,
						"classes": "ui-big",
						"color": options.bigTickColor,
						"strokeWidth": options.bigTickWidth,
						"r": options.bigTickR
					});
					if (self.options.text !== "none") {
						prepareTickText(self, index, width, height, degrees);
					}
				} else if (options.smallTick && index % options.smallTick === 0) {
					//s, if circle === 0 then don't draw smallTick parameter lets you draw with the given degree step
					prepareTick(svg, {
						"degrees": degrees,
						"width": width,
						"height": height,
						"tickHeight": options.smallTickHeight,
						"classes": "ui-small",
						"color": options.smallTickColor,
						"strokeWidth": options.smallTickWidth,
						"r": options.smallTickR
					});
				}
			}

			function prepareCircleR(svg, options) {
				var circleData = {
					"r": options.circleR,
					"width": options.circleWidth,
					"color": options.circleColor
				};

				//if circle start or end is defined then we use arc to draw part of
				//the circle
				if (options.circleStartArc !== 0 || options.circleEndArc !== 0) {
					circleData.arcStart = options.circleStartArc;
					circleData.arcEnd = options.circleEndArc;
					prepareArc(svg, circleData);
				} else {
					prepareCircle(svg, circleData);
				}
			}

			/**
			 * Draws indicator
			 * @param {HTMLElement} element
			 * @method _drawIndicator
			 * @protected
			 * @member ns.widget.wearable.CircleIndicator
			 */
			prototype._drawIndicator = function (element) {
				var self = this,
					options = self.options,
					ui = self._ui,
					svg = ui.svg,
					elementRect = element.getClientRects()[0],
					width = elementRect.width,
					height = elementRect.height;

				switch (options.indicatorType) {
					case "line":
						ui.pointer = prepareTick(svg, {
							"degrees": self.indicatorValue + options.start,
							"width": width,
							"strokeWidth": options.indicatorWidth,
							"height": height,
							"tickHeight": options.indicatorHeight,
							"r": options.indicatorR,
							"classes": "ui-pointer",
							"color": options.indicatorColor,
							"animation": true
						});
						break;
					case "arc":
						ui.pointer = prepareArcIndicator(self, {
							r: options.indicatorR,
							color: options.indicatorColor
						});
						break;
					default :
						break;
				}
			};

			/**
			 * Method prepares ticks circle
			 * @param {HTMLElement} element
			 * @method _prepareTicksCircle
			 * @protected
			 * @member ns.widget.wearable.CircleIndicator
			 */
			prototype._prepareTicksCircle = function (element) {
				var self = this,
					svg = self._ui.svg,
					options = self.options,
					index = 0,
					to = (options.cut > 0 && options.cut < options.to) ? options.cut : options.to;

				while (index < to) {
					prepareTickCircle(self, element, index);
					++index;
				}

				//if custom r for circle is given then draw it with this R
				if (options.circleR) {
					prepareCircleR(svg, options);
				}
			};

			/**
			 * Build method
			 * @param {HTMLElement} element
			 * @method _build
			 * @protected
			 * @member ns.widget.wearable.CircleIndicator
			 */
			prototype._build = function (element) {
				var id = element.id,
					self = this,
					svg = polar.createSVG(element);

				// Parse to int indicated values from data-* attributes
				parseIntObject(self.options, ["to", "from", "textR", "cut", "bigTick", "start",
					"textDigits", "bigTickR", "smallTick", "circleWidth", "indicatorR",
					"circleEndArc", "circleStartArc", "indicatorHeight", "indicatorWidth",
					"bigTickHeight", "smallTickHeight"
				]);

				// set id
				if (!id) {
					element.id = "tau-custom-widget-" + Date.now();
				}

				// add widget class if not exists
				element.classList.add(WIDGET_CLASS);

				// set ui components
				self._ui = {
					element: element,
					svgIndicator: null,
					pointer: null,
					svg: svg
				};

				self._prepareTicksCircle(element);
				self._drawIndicator(element);

				return element;
			};

			/**
			 * Get value of Circle Progressbar
			 * @method _getValue
			 * @protected
			 * @member ns.widget.wearable.CircleIndicator
			 */
			prototype._getValue = function () {
				return this.indicatorValue;
			};

			/**
			 * Set value of Circle Progressbar
			 * @method _setValue
			 * @param {string} inputValue
			 * @protected
			 * @member ns.widget.wearable.CircleIndicator
			 */
			prototype._setValue = function (inputValue) {
				var self = this,
					options = self.options,
					ui = self._ui,
					svg = ui.svg,
					pointer = ui.pointer,
					indicatorType = options.indicatorType,
					elementRect = ui.element.getClientRects()[0],
					//this value will not change and can be taken from options
					bigTickR = options.bigTickR,
					width = elementRect.width,
					height = elementRect.height,
					circleValue = 0,
					to = options.to;

				self.indicatorValue = inputValue;

				if (indicatorType === "line") {
					//polar api force me to add all the options again
					polar.updatePosition(svg, ".ui-pointer", {
						degrees: inputValue * (width / to),
						classes: pointer.getAttribute("class"),
						color: pointer.getAttribute("stroke"),
						direction: "out",
						length: 40,
						r: bigTickR,
						width: pointer.getAttribute("stroke-width"),
						x: width / 2,
						y: height / 2,
						animation: true
					});
				} else if (indicatorType === "arc") {
					circleValue = self.minimumCirclePoints - ((inputValue * self.minimumCirclePoints) / to);
					pointer.setAttribute("stroke-dashoffset", "" + circleValue);
				}
			};

			/**
			 * Remove HTML elements created in widget build process
			 * @method _removeItems
			 * @protected
			 * @member ns.widget.wearable.CircleIndicator
			 */
			prototype._removeItems = function () {
				var itemContainer = this._ui.element;

				while (itemContainer.firstChild) {
					itemContainer.removeChild(itemContainer.firstChild);
				}
			};

			prototype._removeTicksCircle = function () {
				var ticks = this._ui.svg.querySelectorAll(".ui-big, .ui-small"),
					length = ticks.length,
					i;

				for (i = 0; i < length; i++) {
					ticks[i].parentElement.removeChild(ticks[i]);
				}
			};

			prototype._refresh = function () {
				var pointer = this._ui.pointer;

				this._removeTicksCircle();
				this._prepareTicksCircle(this.element);
				pointer.parentElement.appendChild(pointer);
			};

			/**
			 * Destroy widget instance
			 * @protected
			 * @method _destroy
			 * @member ns.widget.core.CircleIndicator
			 * @protected
			 */
			prototype._destroy = function () {
				this._removeItems();
			};

			CircleIndicator.prototype = prototype;
			ns.widget.wearable.CircleIndicator = CircleIndicator;

			engine.defineWidget(
				"CircleIndicator",
				"." + classes.WIDGET,
				[],
				CircleIndicator,
				"wearable"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return CircleIndicator;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
