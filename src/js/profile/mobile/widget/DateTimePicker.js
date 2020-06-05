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
 * # DateTimePicker Widget
 * Shows a control that can be used to set date and time.
 * The DataTimePicker has possibility to change view between wheel view and calendar view.
 *
 * It support 12/24 hours format. It contains two inputs which control the values
 *
 * ## Default selectors
 *
 * Default selector for timepicker is class *ui-datetime-picker*
 *
 * ### HTML Examples
 *
 * #### 12 hours format
 * To add a timepicker widget to the application, use the following code:
 *
 *      @example
 *      <div class="ui-datetime-picker" data-format="12">
 *
 * #### 24 hours format
 * To add a timepicker widget to the application, use the following code:
 *
 *      @example
 *      <div class="ui-datetime-picker" data-format="24">
 *
 * @class ns.widget.mobile.DateTimePicker
 * @since 1.2
 * @component-selector .ui-datetime-picker
 * @extends ns.widget.mobile.DateTimePicker
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/event",
			"../../../core/util/selectors",
			"./BaseWidgetMobile",
			"./Calendar",
			"./DateTimePickerWheel"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				utilsEvents = ns.event,
				WIDGET_CLASS = "ui-datetime-picker",
				classes = {
					CONTAINER: WIDGET_CLASS + "-container",
					HIDDEN: WIDGET_CLASS + "-hidden"
				},
				WIDGET_SELECTOR = "." + WIDGET_CLASS,

				DateTimePicker = function () {
					var self = this;

					self.options = {
						format: "12",
						view: "wheel",
						value: (new Date()).toUTCString()
					};

					self._datetime = null;
					self._calendar = null;

					self._ui = {
						datetime: null,
						calendar: null
					};
				},
				events = {
					/**
					 * Event will be triggered when datetime change
					 * @event
					 */
					CHANGE: "datetimepickerchange"
				},
				prototype = new BaseWidget();

			DateTimePicker.classes = classes;

			/**
			* Init method
			* @method _init
			* @member ns.widget.mobile.DateTimePicker
			* @protected
			*/
			prototype._init = function () {
				var self = this,
					options = self.options;

				options.format = (options.format !== undefined) ? options.format : "12";

				self._setValue(options.value);

				self.option("format", options.format);

				// Change view on init
				self._setView(self.element, options.view);
			};

			/**
			* Build widget instance
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement} Builded element
			* @member ns.widget.mobile.DateTimePicker
			* @protected
			*/
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					datetime = document.createElement("div"),
					calendar = document.createElement("div");

				element.appendChild(datetime);
				element.appendChild(calendar);

				self._datetime = ns.widget.DateTimePickerWheel(datetime);
				self._calendar = ns.widget.Calendar(calendar, {
					closeOnSelect: true
				});

				ui.datetime = datetime;
				ui.calendar = calendar;
				return element;
			};

			/**
			* Handle event for select date on datetime picker
			* @method _onDateTimeSelected
			* @param {Event} event
			* @member ns.widget.mobile.DateTimePicker
			* @protected
			*/
			prototype._onDateTimeSelected = function (event) {
				var self = this;

				if (event.target === self._ui.datetime) {
					self._calendar.value(event.detail.datetime);
					self._setView(self.element, "calendar");
				}
			};

			/**
			* Handle event for calendar change view to wheel view
			* @method _onCalendarSwitch
			* @param {Event} event
			* @member ns.widget.mobile.DateTimePicker
			* @protected
			*/
			prototype._onCalendarSwitch = function (event) {
				var self = this;

				if (event.target === self._ui.calendar) {
					self._datetime.value(event.detail.date);
					self._setView(self.element, "wheel");
					ns.event.trigger(self.element, events.CHANGE, {date: self._getValue()});
				}
			};

			/**
			* Method changes widget look
			* @method _setView
			* @param {HTMLElement} element
			* @param {string} value
			* @member ns.widget.mobile.DateTimePicker
			* @protected
			*/
			prototype._setView = function (element, value) {
				var ui = this._ui;

				this.options.view = value;
				if (value === "wheel") {
					ui.calendar.classList.add(classes.HIDDEN);
					ui.datetime.classList.remove(classes.HIDDEN);
				} else if (value === "calendar") {
					ui.datetime.classList.add(classes.HIDDEN);
					ui.calendar.classList.remove(classes.HIDDEN);
				}
			};

			/**
			* Set the value of DateTimePicker
			* @method _setValue
			* @param {Date|string} value
			* @member ns.widget.mobile.DateTimePicker
			* @protected
			*/
			prototype._setValue = function (value) {
				var self = this;

				if (typeof value === "string") {
					value = new Date(value);
				}

				if (value instanceof Date) {
					self._datetime.value(value);
					self._calendar.value(value);
					self.options.value = value;
				}
			};

			/**
			* Get the value of DateTimePicker
			* @method _getValue
			* @return {Date} current time of time picker
			* @member ns.widget.mobile.DateTimePicker
			* @protected
			*/
			prototype._getValue = function () {
				var self = this;

				if (self.options.view === "wheel") {
					return self._datetime.value();
				} else if (self.options.view === "calendar") {
					return self._calendar.value();
				}
				return self.options.value;
			};

			/**
			* Handle event for date time change in DateTimePicker
			* @method _onDateTimeChange
			* @param {Event} event
			* @member ns.widget.mobile.DateTimePicker
			* @protected
			*/
			prototype._onDateTimeChange = function (event) {
				var self = this;

				self.options.value = event.detail.datetime;
				ns.event.trigger(self.element, events.CHANGE, {date: self._getValue()});
			};

			/**
			* Set format 12/24h option for DateTimePickerWheel
			* @method _setFormat
			* @param {HTMLElement} element
			* @param {string} format
			* @member ns.widget.mobile.DateTimePicker
			* @protected
			*/
			prototype._setFormat = function (element, format) {
				var self = this;

				self.options.format = format;
				self._datetime.option("format", format);
			};

			/**
			* Get format 12/24h option for DateTimePickerWheel
			* @method _getFormat
			* @member ns.widget.mobile.DateTimePicker
			* @return {string} format of time 12/24h
			* @protected
			*/
			prototype._getFormat = function () {
				return self._datetime.option("format");
			};

			/**
			* Handle events
			* @method handleEvent
			* @param {Event} event
			* @member ns.widget.mobile.DateTimePicker
			* @public
			*/
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "datetimepickerwheelselected":
						self._onDateTimeSelected(event);
						break;
					case "calendarswitch":
						self._onCalendarSwitch(event);
						break;
					case "datetimepickerwheelchange":
						self._onDateTimeChange(event);
						break;
				}
			};

			/**
			* Bind widget event handlers
			* @method _bindEvents
			* @member ns.widget.mobile.DateTimePicker
			* @protected
			*/
			prototype._bindEvents = function () {
				var self = this;

				self.element.addEventListener("datetimepickerwheelselected", this, false);
				self.element.addEventListener("datetimepickerwheelchange", this, false);
				self.element.addEventListener("calendarswitch", this, false);
			};

			/**
			* Unbind widget event handlers
			* @method _unbindEvents
			* @member ns.widget.mobile.DateTimePicker
			* @protected
			*/
			prototype._unbindEvents = function () {
				var self = this;

				self.element.removeEventListener("datetimepickerwheelselected", this, false);
				self.element.removeEventListener("calendarswitch", this, false);
			};

			/**
			* Destory DateTimePicker widget
			* @method _destory
			* @member ns.widget.mobile.DateTimePicker
			* @protected
			*/
			prototype._destory = function () {
				var self = this,
					ui = self._ui,
					element = self.element;

				self._unbindEvents();

				self._calendar.destory();
				self._datetime.destory();

				element.removeChild(ui.datetime);
				element.removeChild(ui.calendar);
			};

			DateTimePicker.prototype = prototype;

			// definition
			ns.widget.mobile.DateTimePicker = DateTimePicker;
			engine.defineWidget(
				"DateTimePicker",
				WIDGET_SELECTOR,
				[],
				DateTimePicker,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return DateTimePicker;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, window.tau));
