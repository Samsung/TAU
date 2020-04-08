/*
 * Copyright (c) 2020 Samsung Electronics Co., Ltd
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
/* global define */
/**
 * # TimePicker Widget
 * Shows a control that can be used to set hours and minutes.
 * It support 12/24 hours format. It contains two inputs which control the values
 *
 * ## Default selectors
 *
 * Default selector for timepicker is class *ui-time-picker*
 *
 * ### HTML Examples
 *
 * #### 12 hours format
 * To add a timepicker widget to the application, use the following code:
 *
 *      @example
 *      <div class="ui-time-picker" data-format="12">
 *
 * #### 24 hours format
 * To add a timepicker widget to the application, use the following code:
 *
 *      @example
 *      <div class="ui-time-picker" data-format="24">
 *
 * @class ns.widget.mobile.TimePicker
 * @since 1.2
 * @component-selector .ui-time-picker
 * @extends ns.widget.mobile.TimePicker
 * @author Hunseop Jeong <hs85.jeong@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/event",
			"../../../core/event/gesture",
			"./BaseWidgetMobile",
			"./Spin"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				Spin = ns.widget.mobile.Spin,
				WIDGET_CLASS = "ui-time-picker",
				classes = {
					CONTAINER: WIDGET_CLASS + "-container",
					HOUR_CONTAINER: WIDGET_CLASS + "-container-hour",
					MINUTE_CONTAINER: WIDGET_CLASS + "-container-minute",
					FORMAT_CONTAINER: WIDGET_CLASS + "-container-format"
				},
				WIDGET_SELECTOR = "." + WIDGET_CLASS,
				TimePicker = function () {
					this.options = {
						format: "12"
					};

					this._spins = {
						hour: null,
						minute: null,
						format: null
					};
				},
				prototype = new BaseWidget();

			TimePicker.classes = classes;

			/**
			* Init method
			* @method _init
			* @member ns.widget.mobile.TimePicker
			* @protected
			*/
			prototype._init = function () {
				var self = this,
					options = self.options;

				options.format = (options.format !== undefined) ? options.format : "12";

				self._setValue(new Date());

				self.option("format", options.format);

				// Calculate the spin widget after building the widget
				Object.keys(self._spins).forEach(function (key) {
					self._spins[key].refresh();
				});
			};

			/**
			* Build widget instance
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement} Builded element
			* @member ns.widget.mobile.TimePicker
			* @protected
			*/
			prototype._build = function (element) {
				var self = this,
					hourPicker = self._buildTimePicker("hour"),
					minutePicker = self._buildTimePicker("minute"),
					formatPicker = self._buildFormat();

				element.appendChild(hourPicker);
				element.appendChild(minutePicker);
				element.appendChild(formatPicker);

				return element;
			};

			/**
			* Build Spin Widget for the time
			* @method _buildTimePicker
			* @param {string} name
			* @return {HTMLElement} container for time spin
			* @member ns.widget.mobile.TimePicker
			* @protected
			*/
			prototype._buildTimePicker = function (name) {
				var self = this,
					spin = document.createElement("div"),
					spinContainer = document.createElement("div"),
					options = {},
					spinWidget;

				spin.classList.add(Spin.classes.SPIN);
				spinContainer.classList.add(TimePicker.classes.CONTAINER);

				if (name === "hour") {
					if (self.options.format === "24") {
						options.min = 0;
						options.max = 24;
					} else {
						options.min = 0;
						options.max = 12;
					}
					spinContainer.classList.add(TimePicker.classes.HOUR_CONTAINER);
				} else if (name === "minute") {
					options.min = 0;
					options.max = 60;
					spinContainer.classList.add(TimePicker.classes.MINUTE_CONTAINER);
				}

				spinContainer.appendChild(spin);

				spinWidget = ns.widget.Spin(spin, options);
				self._spins[name] = spinWidget;

				return spinContainer;
			};

			/**
			* Build Spin Widget for the format
			* @method _buildFormat
			* @return {HTMLElement} container for format spin
			* @member ns.widget.mobile.TimePicker
			* @protected
			*/
			prototype._buildFormat = function () {
				var self = this,
					spin = document.createElement("div"),
					spinContainer = document.createElement("div"),
					options = {
						min: 0,
						max: 1,
						labels: "AM,PM",
						loop: "false"
					},
					spinWidget;

				spin.classList.add(Spin.classes.SPIN);
				spinContainer.classList.add(TimePicker.classes.CONTAINER);
				spinContainer.classList.add(TimePicker.classes.FORMAT_CONTAINER);
				spinContainer.appendChild(spin);

				spinWidget = ns.widget.Spin(spin, options);
				self._spins.format = spinWidget;

				return spinContainer;
			};

			/**
			* Set the value for Date object
			* @method _setDateValue
			* @param {Date} value
			* @member ns.widget.mobile.TimePicker
			* @protected
			*/
			prototype._setDateValue = function (value) {
				var self = this,
					spins = self._spins,
					hours,
					minutes;

				hours = value.getHours();
				minutes = value.getMinutes();

				if (self.options.format === "12") {
					if (hours > 12) {
						hours -= 12;
						spins.format.value(1);
					} else {
						spins.format.value(0);
					}
				}

				spins.hour.value(hours);
				spins.minute.value(minutes);
			};

			/**
			* Set the value of TimePicker
			* @method _setValue
			* @param {Date} value
			* @member ns.widget.mobile.TimePicker
			* @protected
			*/
			prototype._setValue = function (value) {
				var self = this;

				if (value instanceof Date) {
					self._setDateValue(value);
				}
			};

			/**
			* Get the value of TimePicker
			* @method _getValue
			* @return {Date} current time of time picker
			* @member ns.widget.mobile.TimePicker
			* @protected
			*/
			prototype._getValue = function () {
				var time = new Date(0),
					self = this,
					spins = self._spins,
					hours = parseInt(spins.hour.value(), 10);

				if (self.options.format === "12" && spins.format.value() === 1) {
					hours += 12;
				}

				time.setHours(hours);
				time.setMinutes(parseInt(spins.minute.value(), 10));

				return time;
			}

			/**
			* Destory TimePicker widget
			* @method _destory
			* @member ns.widget.mobile.TimePicker
			* @protected
			*/
			prototype._destory = function () {
				var self = this,
					spins = self._spins;

				Object.keys(spins).forEach(function (key) {
					spins[key]._destory();
				});
			};

			TimePicker.prototype = prototype;

			// definition
			ns.widget.mobile.TimePicker = TimePicker;
			engine.defineWidget(
				"TimePicker",
				WIDGET_SELECTOR,
				[],
				TimePicker,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return TimePicker;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, window.tau));
