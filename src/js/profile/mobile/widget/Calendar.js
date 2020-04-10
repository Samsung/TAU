/*global define, ns */
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
/*
 * @example
 * <div class="ui-calendar"></div>
 *
 * @since 1.2
 * @class ns.widget.mobile.Calendar
 * @extends ns.widget.BaseWidget
 * @author Dohyung Lim <delight.lim@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/DOM/attributes",
			"../../../core/event",
			"../widget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.util.object,
				engine = ns.engine,
				events = ns.event,
				days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
				fullNameMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				today = new Date(),
				todayYear = today.getFullYear(),
				todayMonth = today.getMonth() + 1,
				defaultToday = today.getUTCDate(),
				switchElement,
				selectDay,

				Calendar = function () {
					this.options = utilsObject.merge({}, defaultOptions);
				},

				defaultOptions = {
					pastSelection: false
				},

				BaseWidget = ns.widget.BaseWidget,
				prototype = new BaseWidget();

			Calendar.prototype = prototype;

			/**
			* Init widget
			* @method _init
			* @param {HTMLElement} element
			* @return {HTMLElement} Returns built element
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._init = function (element) {
				var self = this,
					calendarElement = self.element.querySelector(".calendarView");

				switchElement = self.element.querySelector(".calendarSwitch");

				if (!element.getAttribute("value")) {
					element.setAttribute("value", self.options.value);
				}

				self._buildCalendar(calendarElement);

				return element;
			};

			/**
			* Draw a calendar on the table
			* @method _buildCalendar
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._buildCalendar = function (calendarElement) {
				var firstDate = new Date(todayYear, todayMonth - 1, 0),
					lastDate = new Date(todayYear, todayMonth, 0),
					day = firstDate.getDay(),
					prevLastDate = lastDate.getDate(),
					week = Math.ceil(prevLastDate / 7) + 1,
					leftDays = 7,
					setDays = 1,
					nextMonthDate = 1,
					cell = null,
					marginRow = calendarElement.insertRow(),
					divElement = "<div></div>",
					idx,
					row,
					div = null;

				marginRow.style.height = "7px";

				for (idx = 1; idx < week + 1; idx++) {
					row = calendarElement.insertRow();

					while (day != 0) { // prev disabled days.
						day = day - 1;
						leftDays = leftDays - 1;
						cell = row.insertCell();
						cell.insertAdjacentHTML("afterbegin", divElement);
						div = cell.firstChild;
						div.classList.add("prevDisableDay");
						div.innerHTML = prevLastDate - day;
					}
					while (leftDays != 0) {
						if (setDays > prevLastDate) { // next disabled days.
							cell = row.insertCell();
							cell.insertAdjacentHTML("afterbegin", divElement);
							div = cell.firstChild;
							div.classList.add("nextDisableDay");
							div.innerHTML = nextMonthDate;
							leftDays = leftDays - 1;
							nextMonthDate = nextMonthDate + 1;
						} else { // current enabled days.
							cell = row.insertCell();
							cell.insertAdjacentHTML("afterbegin", divElement);
							div = cell.firstChild;
							div.classList.add("currentEnableDay");
							div.innerHTML = setDays;
							setDays = setDays + 1;
							leftDays = leftDays - 1;

							if (div.innerHTML === defaultToday.toLocaleString()) { // today selected.
								div.classList.add("selection");
								selectDay = div;
							}
						}
					}
					leftDays = 7;
				}

				switchElement.innerHTML = fullNameMonth[todayMonth - 1] + " " + todayYear;
			}

			/**
			* Moving to another month erases the existing calendar
			* @method _deleteCalendar
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._deleteCalendar = function (calendarElement) {
				while (calendarElement.rows.length > 2) {
					calendarElement.deleteRow(2);
				}
			}

			/**
			* Click the arrow on the calendar to move to another month
			* @method _onClick
			* @param {Event} event
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._onClick = function (event) {
				var calendarElement = this.element.querySelector(".calendarView");

				if (event.srcElement.className === "calendarArrowRight") {
					todayMonth = todayMonth + 1;
					if (todayMonth === 13) {
						todayMonth = 1;
						todayYear = todayYear + 1;
					}
					prototype._deleteCalendar(calendarElement);
					today = new Date(todayYear, todayMonth - 1);
					prototype._buildCalendar(calendarElement);
				} else if (event.srcElement.className === "calendarArrowLeft") {
					todayMonth = todayMonth - 1;
					if (todayMonth === 0) {
						todayMonth = 12;
						todayYear = todayYear - 1;
					}
					prototype._deleteCalendar(calendarElement);
					today = new Date(todayYear, todayMonth - 1);
					prototype._buildCalendar(calendarElement);
				} else {
					this._selection(event.target);
				}
			};

			/**
			* Selecting a date leaves a mark
			* @method _selection
			* @param {HTMLElement} element
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._selection = function (element) {
				if (selectDay.innerHTML != element.innerHTML) {
					element.classList.add("selection");
					selectDay.classList.remove("selection");
					selectDay = element;
				}
			}

			prototype._unBindEvents = function (element) {
				var self = this;

				events.off(element, "vclick", self, false);
			}

			prototype._bindEvents = function (element) {
				var self = this;

				events.on(element, "vclick", self, false);
			};

			prototype.handleEvent = function (event) {
				var self = this;

				if (event.type === "vclick") {
					self._onClick(event);
				} else {
					event.preventDefault();
				}
			};

			prototype._refresh = function () {
				var self = this;

				self._setValue(self.options.value);
			}

			prototype._setValue = function (value) {
				var self = this,
					options = self.options;

				options.pastSelection = value;
			}

			prototype._build = function (element) {
				var controllerElement = document.createElement("div"),
					leftArrowElement = document.createElement("div"),
					rightArrowElement = document.createElement("div"),
					viewChangeElement = document.createElement("div"),
					viewTableElement = document.createElement("table"),
					spaceElement = document.createElement("tr"),
					oneWeekElement = document.createElement("tr"),
					monElement = document.createElement("td"),
					tueElement = document.createElement("td"),
					wedElement = document.createElement("td"),
					thuElement = document.createElement("td"),
					friElement = document.createElement("td"),
					satElement = document.createElement("td"),
					sunElement = document.createElement("td");

				// Controller
				controllerElement.classList.add("controller");
				leftArrowElement.classList.add("calendarArrowLeft");
				rightArrowElement.classList.add("calendarArrowRight");
				viewChangeElement.classList.add("calendarSwitch");

				controllerElement.appendChild(leftArrowElement);
				controllerElement.appendChild(rightArrowElement);
				controllerElement.appendChild(viewChangeElement);

				// View Container
				viewTableElement.classList.add("calendarView");
				spaceElement.classList.add("topSpace");
				oneWeekElement.classList.add("oneWeek");

				monElement.innerHTML = days[0];
				oneWeekElement.appendChild(monElement);
				tueElement.innerHTML = days[1];
				oneWeekElement.appendChild(tueElement);
				wedElement.innerHTML = days[2];
				oneWeekElement.appendChild(wedElement);
				thuElement.innerHTML = days[3];
				oneWeekElement.appendChild(thuElement);
				friElement.innerHTML = days[4];
				oneWeekElement.appendChild(friElement);
				satElement.innerHTML = days[5];
				oneWeekElement.appendChild(satElement);
				sunElement.innerHTML = days[6];
				sunElement.classList.add("sunday");
				oneWeekElement.appendChild(sunElement);

				viewTableElement.appendChild(spaceElement);
				viewTableElement.appendChild(oneWeekElement);

				// append Elements
				element.appendChild(controllerElement);
				element.appendChild(viewTableElement);

				return element;
			};

			prototype._destroy = function () {
				var self = this;

				self.options = null;
				self.unBindEvents(self.element);
			};

			ns.widget.mobile.Calendar = Calendar;
			engine.defineWidget(
				"Calendar",
				".ui-calendar",
				[],
				Calendar,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Calendar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, ns));
