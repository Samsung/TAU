/*
 * Copyright (c) 2018 Samsung Electronics Co., Ltd
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
/*
 * #Graph
 *
 * Graph widget are using external libraries:
 * http://cdn.jsdelivr.net/d3js/3.5.17/d3.min.js
 * http://cdn.jsdelivr.net/npm/taucharts@1/build/production/tauCharts.min.js
 * These libraries are not part of TAU source code.
 * These libraries are attached to project but references should be added in a application
 *
 * <script src="tau/libs/d3.min.js" charset="utf-8"></script>
 * <script src="tau/libs/tauCharts.min.js" type="text/javascript"></script>
 * <link rel="stylesheet" type="text/css" href="tau/libs/tauCharts.min.css">
 *
 * @example
 * 	<div class="ui-graph"></div>
 *
 * <div class="ui-graph"
 *      data-graph="scatterplot"
 *      data-color="#FF0000"
 *      data-xlabel="x label"
 *      data-ylabel="y label"
 * ></div>
 *
 * @since 5.0
 * @class ns.widget.core.Graph
 * @extends ns.widget.core.BaseWidget
 */
(function (window, document, ns) {
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
			var utilsObject = ns.util.object,

				Graph = function () {
					var self = this;

					self.options = utilsObject.merge({}, Graph.defaults);

					self.data = [];
					self.size = "";
					self._initialData = true;
					self.split = "formula";
					self.guide = {
						color: {
							brewer: [defaults.color]
						},
						showGridLines: "xy",
						x: {
							nice: false,
							label: {
								text: defaults.xlabel
							}
						},
						y: {
							nice: false,
							label: {
								text: defaults.ylabel
							}
						}
					};
					self.dimensions = {
						x: {
							type: "order",
							scale: "time"
						},
						y: {
							type: "order",
							scale: "linear"
						}
					};
					self.chart = null;
				},

				addLibText = "Please, include tauCharts library (https://www.taucharts.com/).",

				MODE_INTERMITTENT = "intermittent",
				MODE_CONTINUOUS = "continuous",

				xAxis = "x",
				yAxis = "y",

				TIME_AXIS_X = xAxis,
				TIME_AXIS_Y = yAxis,
				TIME_AXIS_NONE = "none",

				graphTypes = {
					stackedBar: "stacked-bar",
					line: "line",
					stackedArea: "stacked-area",
					scatterplot: "scatterplot",
					bar: "bar"
				},

				defaults = {
					graph: graphTypes.line,
					color: "#0097D8",
					xlabel: "",
					ylabel: "",
					axisXType: "time",
					axisYType: "linear",
					mode: MODE_INTERMITTENT,
					value: [],
					timeAxis: TIME_AXIS_X, // only when one value supplied
					groupKey: "label",
					legend: false
				},

				classes = {
					graphContainer: "ui-graph"
				},


				BaseWidget = ns.widget.BaseWidget,
				prototype = new BaseWidget();

			Graph.prototype = prototype;
			Graph.defaults = defaults;
			Graph.MODE = {
				INTERMITTENT: MODE_INTERMITTENT,
				CONTINUOS: MODE_CONTINUOUS
			};
			Graph.TIME_AXIS = {
				X: TIME_AXIS_X,
				Y: TIME_AXIS_Y,
				NONE: TIME_AXIS_NONE
			};

			prototype._newChart = function (element) {
				var self = this,
					data = null;

				self.element.innerHTML = "";
				self._rebuildCache();
				data = self._prepareChartData();
				self.chart = new window.tauCharts.Chart({
					data: [],
					type: self.options.graph,
					x: xAxis,
					y: yAxis,
					color: "label",
					size: self.size,
					split: self.split,
					guide: self.guide,
					dimensions: self.dimensions,
					plugins: (self.options.legend) ? [window.tauCharts.api.plugins.get("legend")] : []
				});

				self.chart.renderTo(element);

				self._updateChart(data);
			};

			prototype._setChartAxis = function (identifier) {
				var self = this,
					axisDimensions = self.dimensions[identifier],
					axisType = self.options["axis" + identifier.toUpperCase() + "Type"];

				axisDimensions.type = "order";
				switch (axisType) {
					case "time":
					case "index":
						axisDimensions.scale = "time";
						self.guide[identifier].tickFormat = "day";
						break;
					case "order":
						axisDimensions.scale = "ordinal";
						break;
					case "linear":
						axisDimensions.scale = "linear";
						break;
				}
			}

			prototype._init = function (element) {
				var self = this,
					oldData = [],
					guide = self.guide;

				self.options.color = (typeof self.options.color === "string") ?
					self.options.color.split(",") :
					self.options.color;
				guide.color.brewer = self.options.color;
				guide.x.label.text = self.options.xlabel;
				guide.y.label.text = self.options.ylabel;

				self._setChartAxis("x");
				self._setChartAxis("y");

				self.data.length = 0;
				// get chart data from data-value attribute
				if (self.options.value) {
					try {
						oldData = JSON.parse(self.options.value);
					} catch (e) { }

					if (oldData.length > 0) {
						//self.data = self.data.concat(oldData);
						oldData.forEach(function (data) {
							self._addData(data);
						});
						self._initialData = true;
					}
				} else {
					self._addData(0);
					self._initialData = true;
				}

				// create chart widget
				self._newChart(element);

				return element;
			};

			prototype._build = function (element) {
				var self = this;

				if (!window.tauCharts) {
					console.warn(addLibText);
					return null;
				}

				self._createDivElement(element, classes.graphContainer);
				return element;
			};

			prototype._addData = function (value) {
				var now = Date.now(),
					valueObject = {
						time: now,
						value: value,
						cache: null
					},
					self = this;

				if (self._initialData) { // remove initial data
					self.data = [];
					self._initialData = false;
				}

				valueObject.cache = self._map(valueObject, self.data.length);
				self.data.push(valueObject);
			};

			prototype._map = function (valueObject, index) {
				var dataset = [],
					value = valueObject.value,
					time = valueObject.time,
					timeAxis = this.options.timeAxis,
					axisXType = this.options.axisXType,
					groupKey = this.options.groupKey,
					label,
					x = 0,
					y = 0;

				// Convert data to array [x, y]
				if (typeof value === "object") {
					// if data object has "x" and "y" property
					if (value.x !== undefined) {
						dataset.push(value.x);
						if (value.y !== undefined) {
							dataset.push(value.y);
						}
						if (value[groupKey] !== undefined) {
							dataset.push(value[groupKey]);
						}
					} else {
						// data object has other keys
						Object.keys(value).forEach(function (key) {
							dataset.push(value[key]);
						});
					}
				} else {
					// value is single value;
					dataset = [value];
				}

				// convert array [x, y] to object {x: x, y: y}
				if (dataset.length === 1) {
					switch (axisXType) {
						case "time":
							if (timeAxis === TIME_AXIS_X) {
								y = parseFloat(dataset[0]) || 0;
								x = time;
							} else {
								x = parseFloat(dataset[0]) || 0;
								if (timeAxis === TIME_AXIS_Y) {
									y = time;
								}
							}
							break;
						case "index":
							x = index;
							y = parseFloat(dataset[0]) || 0;
							break;
					}
					label = "Series 1";
				} else {
					switch (axisXType) {
						case "index":
							x = index;
							y = parseFloat(dataset[0]) || 0;
							break;
						default:
							x = parseFloat(dataset[0]) || 0;
							y = parseFloat(dataset[1]) || 0;
							break;
					}
					label = dataset[dataset.length - 1];
				}

				return {
					x: x,
					y: y,
					label: label
				}
			}

			prototype._rebuildCache = function () {
				var self = this;

				self.data.forEach(function (value, index) {
					value.cache = self._map(value, index);
				});
			};

			prototype._prepareChartData = function () {
				return this.data.map(function (value) {
					return value.cache;
				})
			};

			prototype._updateChart = function (data) {
				var self = this;

				if (self.options.mode === MODE_INTERMITTENT) {
					data.length = 0;
				}

				self.chart.setData(data);

				self.element.setAttribute(
					"data-value",
					JSON.stringify(data)
				);
			};

			prototype._setOneValue = function (value) {
				var self = this;

				self._addData(value),
				self._updateChart(self._prepareChartData());

				return false;
			}

			prototype._setValue = function (value) {
				var dataset = Array.isArray(value) ? value : [value],
					result = true,
					self = this;

				dataset.forEach(function (val) {
					if (!self._setOneValue(val) && result) {
						result = false;
					}
				});

				return result;
			};

			prototype._getValue = function () {
				return this.data;
			};

			prototype._createDivElement = function (
					parentElement, className) {
				var newElement = document.createElement("div");

				newElement.classList.add(className);

				parentElement.appendChild(newElement);
			};

			prototype._refresh = function () {
				var self = this;

				self.guide = {
					color: {
						brewer: (typeof self.options.color === "string") ?
							self.options.color.split(",") :
							self.options.color
					},
					x: {
						label: {
							text: self.options.xlabel
						}
					},
					y: {
						label: {
							text: self.options.ylabel
						}
					}
				};
				self._newChart(self.element);

			}

			ns.widget.core.Graph = Graph;

			ns.engine.defineWidget(
				"Graph",
				".ui-graph", [],
				Graph,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Graph;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
