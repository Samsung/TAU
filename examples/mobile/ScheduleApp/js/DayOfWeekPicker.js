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
/*jslint nomen: true, plusplus: true */
/**
 * #Day of week picker
 * This widget allow user to select day of week
 *
 * @class ns.widget.mobile.DayOfWeekPicker
 * @extends ns.widget.BaseWidget
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window) {
	"use strict";
	var ns = window.tau,
		BaseWidget = ns.widget.BaseWidget,
		engine = ns.engine,
		events = ns.event,
		classes = {
			/**
			 * Widget class
			 * @style ui-day-of-week-picker
			 * @member ns.widget.mobile.DayOfWeekPicker
			 */
			WIDGET: "ui-day-of-week-picker"
		},
		EVENT_TYPE = {
			CHANGE: "dayofweekchange",
			DESTROY: "dayofweekdestroy"
		},
		DayOfWeekPicker = function () {
			this.options = {
				value: ""
			};
			this._ui = {
				days: []
			};
		},
		prototype = new BaseWidget();

	DayOfWeekPicker.eventType = EVENT_TYPE;
	DayOfWeekPicker.classes = classes;
	DayOfWeekPicker.prototype = prototype;

	/**
	 * Build DayOfWeekPicker widget
	 * @method _build
	 * @param {HTMLElement} element
	 * @return {HTMLElement} Returns built element
	 * @member ns.widget.mobile.DayOfWeekPicker
	 * @protected
	 */
	prototype._build = function (element) {
		var i,
			fragment = document.createDocumentFragment(),
			checkbox,
			ui = this._ui;

		element.classList.add(classes.WIDGET);
		for (i = 0; i < 7; i++) {
			checkbox = document.createElement("input");
			checkbox.setAttribute("type", "checkbox");
			fragment.appendChild(checkbox);
			ui.days[i] = checkbox;
		}

		element.appendChild(fragment);
		return element;
	};

	/**
	 * Init DayOfWeekPicker widget
	 * @method _init
	 * @member ns.widget.mobile.DayOfWeekPicker
	 * @protected
	 */
	prototype._init = function () {
		var self = this;

		self._setValue(self.options.value);
	};

	/**
	 * Set value of widget
	 * @method _setValue
	 * @member ns.widget.mobile.DayOfWeekPicker
	 * @protected
	 */
	prototype._setValue = function (value) {
		if (typeof value === "string") {
			value = value.split(/[^0-9]/).map(function (value) {
				return parseInt(value, 10);
			});
			this._ui.days.forEach(function (checkbox, key) {
				checkbox.checked = value.indexOf(key) > -1;
			});
		} else {
			ns.warn("Widget accepts string value like '0,1,5'.");
		}
	};

	/**
	* Get value of widget
	* @method _getValue
	* @member ns.widget.mobile.DayOfWeekPicker
	* @return {Array} array containing number of selected days
	* @protected
	*/
	prototype._getValue = function () {
		var result = [];

		this._ui.days.forEach(function (checkbox, key) {
			if (checkbox.checked) {
				result.push(key);
			}
		});
		return result;
	};

	/**
	* Handler for change event on inputs represent day of week
	* @method _onChange
	* @member ns.widget.mobile.DayOfWeekPicker
	* @protected
	*/
	prototype._onChange = function () {
		var self = this;

		events.trigger(self.element, EVENT_TYPE.CHANGE, {value: self._getValue()});
	};

	/**
	 * Widget common event handler
	 * @method handleEvent
	 * @param {Event} event
	 * @member ns.widget.mobile.DayOfWeekPicker
	 * @protected
	 */
	prototype.handleEvent = function (event) {
		if (event.type === "change") {
			this._onChange();
		}
	};

	/**
	 * Bind widget events
	 * @method _bindEvents
	 * @member ns.widget.mobile.DayOfWeekPicker
	 * @protected
	 */
	prototype._bindEvents = function () {
		var self = this;

		self.element.addEventListener("change", self, true);
	};

	/**
	 * Unbind widget events
	 * @method _unbindEvents
	 * @member ns.widget.mobile.DayOfWeekPicker
	 * @protected
	 */
	prototype._unbindEvents = function () {
		var self = this;

		self.element.removeEventListener("change", self, true);
	};

	/**
	 * Destroy DayOfWeekPicker component
	 * @method _destroy
	 * @param {HTMLElement} element
	 * @member ns.widget.mobile.DayOfWeekPicker
	 * @protected
	 */
	prototype._destroy = function (element) {
		this._unbindEvents();
		events.trigger(element, EVENT_TYPE.DESTROY);
	};

	// definition
	ns.widget.mobile.DayOfWeekPicker = DayOfWeekPicker;

	engine.defineWidget(
		"DayOfWeekPicker",
		"." + classes.WIDGET,
		[],
		DayOfWeekPicker,
		"mobile"
	);

}(window));
