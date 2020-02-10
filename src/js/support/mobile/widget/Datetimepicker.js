/*global window, ns, define, ns */
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
/*jslint nomen: true, plusplus: true */
/**
 * #Date-time Picker Widget
 * The picker widget shows a control that you can use to enter date and time values.
 *
 * @class ns.widget.mobile.Datetimepicker
 * @extends ns.widget.mobile.BaseWidgetMobile
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/event",
			"../../../core/event/vmouse",
			"../../../core/util/DOM/attributes",
			"../../../core/util/DOM/manipulation",
			"../../../core/util/array",
			"../../../core/util/globalize",
			"../../../core/widget/core/Button",
			"../../../profile/mobile/widget/mobile",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile",
			"../../../profile/mobile/widget/mobile/Popup",
			"./Circularview"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Datetimepicker = function () {
					this.options = {
						type: null, // date, time, datetime applicable
						format: null,
						date: null
					};
				},
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				dom = ns.util.DOM,
				globalize = ns.util.globalize,
				eventUtils = ns.event,
				range = ns.util.array.range,
				daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
				parsePatternRegexp = /\/|\s|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|f|gg|g|'[\w\W]*'$|[\w\W]/g,
				fieldRegexp = /ui-datefield-([\w]*)/;

			Datetimepicker.prototype = new BaseWidget();

			Datetimepicker.classes = {
				uiBtnPicker: "ui-btn-picker",
				uiDatefield: "ui-datefield",
				uiDatefieldPrefix: "ui-datefield-",
				uiDatefieldSelected: "ui-datefield-selected",
				uiDatefieldPeriod: "ui-datefield-period",
				uiLink: "ui-link",
				uiDatetimepickerSelector: "ui-datetimepicker-selector",
				uiDatetimepicker: "ui-datetimepicker",
				uiInputText: "ui-input-text",
				uiBodyPrefix: "ui-body-",
				uiDivider1st: "ui-divider-1st",
				uiDivider2nd: "ui-divider-2nd",
				inClass: "in",
				outClass: "out",
				current: "current"
			};

			function getCalendar() {
				return globalize.culture().calendars.standard;
			}

			function isLeapYear(year) {
				return year % 4 ? 0 : (year % 100 ? 1 : (year % 400 ? 0 : 1));
			}

			function makeTwoDigits(val) {
				var ret = val.toString(10);

				if (val < 10) {
					ret = "0" + ret;
				}
				return ret;
			}

			function createDateField(type, pat, container) {
				var span = document.createElement("span"),
					spanClassList = span.classList,
					classes = Datetimepicker.classes;

				if (type !== "seperator" && type !== "tab") {
					spanClassList.add(classes.uiBtnPicker);
					dom.setNSData(span, "type", type);
				}
				spanClassList.add(classes.uiDatefieldPrefix + type);
				dom.setNSData(span, "pat", pat);
				if (type !== "seperator" && type !== "tab") {
					dom.setNSData(span, "role", "button");
					dom.setNSData(span, "inline", "true");
					engine.instanceWidget(span, "Button");
				}
				dom.appendNodes(container, span);
				return span;
			}

			function updateField(self, target, value) {
				var pat,
					hour,
					text,
					targetClassList,
					classes = Datetimepicker.classes;

				if (!target) {
					return;
				}

				pat = dom.getNSData(target, "pat");
				targetClassList = target.classList;

				switch (pat) {
					case "H":
					case "HH":
					case "h":
					case "hh":
						hour = value;
						if (pat.charAt(0) === "h") {
							if (hour > 12) {
								hour -= 12;
							} else if (hour === 0) {
								hour = 12;
							}
						}
						text = makeTwoDigits(hour);
						break;
					case "m":
					case "M":
					case "d":
					case "s":
						text = value;
						break;
					case "mm":
					case "dd":
					case "MM":
					case "ss":
						text = makeTwoDigits(value);
						break;
					case "MMM":
						text = getCalendar().months.namesAbbr[value - 1];
						break;
					case "MMMM":
						text = getCalendar().months.names[value - 1];
						break;
					case "yy":
						text = makeTwoDigits(value % 100);
						break;
					case "yyyy":
						if (value < 10) {
							text = "000" + value;
						} else if (value < 100) {
							text = "00" + value;
						} else if (value < 1000) {
							text = "0" + value;
						}
						break;
					case "t":
					case "tt":
						text = value;
						target = target.firstChild.firstChild;
						break;
				}

				// to avoid reflow where its value isn't out-dated
				if (target.innerText !== text) {
					if (targetClassList.contains(classes.uiDatefieldSelected)) {
						targetClassList.add(classes.outClass);
						self._newValue = text;
						/*
						 * @todo animation
						 target.animationComplete( function () {
						 target.text( self._newValue);
						 target.addClass("in")
						 removeClass("out");

						 target.animationComplete( function () {
						 target.removeClass("in").
						 removeClass("ui-datefield-selected");
						 });
						 });
						 */
						target.innerText = self._newValue;
						targetClassList.remove(classes.inClass);
						targetClassList.remove(classes.uiDatefieldSelected);
					} else {
						target.innerText = text;
					}
				}
			}

			Datetimepicker.prototype._setType = function (element, type) {
				var options = this.options;

				switch (type) {
					case "datetime":
					case "date":
					case "time":
						options.type = type;
						break;
					default:
						options.type = "datetime";
						break;
				}

				dom.setNSData(element, "type", options.type);
				return this;
			};


			Datetimepicker.prototype._setDate = function (element, newDate) {
				var oldValue = this._getValue(),
					newValue,
					fields,
					type,
					val,
					field,
					i,
					fieldsLength;

				if (typeof newDate === "string") {
					newDate = new Date(newDate);
				}

				if (this._ui) {
					fields = this._ui.querySelectorAll("[data-type]");
					fieldsLength = fields.length;

					for (i = 0; i < fieldsLength; i++) {
						field = fields[i];
						type = dom.getNSData(field, "type");
						if (!type) {
							type = "";
						}
						switch (type) {
							case "hour":
								val = newDate.getHours();
								break;
							case "min":
								val = newDate.getMinutes();
								break;
							case "sec":
								val = newDate.getSeconds();
								break;
							case "year":
								val = newDate.getFullYear();
								break;
							case "month":
								val = newDate.getMonth() + 1;
								break;
							case "day":
								val = newDate.getDate();
								break;
							case "period":
								val = newDate.getHours() < 12 && getCalendar().AM ? getCalendar().AM[0] : getCalendar().PM[0];
								break;
							default:
								val = null;
								break;
						}
						if (val !== null) {
							updateField(this, field, val);
						}
					}
				}

				this.options.date = newDate;
				dom.setNSData(element, "date", newDate);

				newValue = this._getValue();

				eventUtils.trigger(element, "change", {
					oldValue: oldValue,
					newValue: newValue
				});
				eventUtils.trigger(element, "date-changed", newValue);
				return this;
			};

			Datetimepicker.prototype._getDate = function () {
				return new Date(this.options.date);
			};

			function switchAmPm(self, element) {
				var date,
					change;

				if (getCalendar().AM !== null) {
					date = new Date(self.options.date);
					change = 1000 * 60 * 60 * 12;

					if (date.getHours() > 11) {
						change = -change;
					}
					date.setTime(date.getTime() + change);
					self._setDate(element, date);
				}
			}

			function addButton(self, container, element, pat) {
				var button = document.createElement("a");

				dom.setNSData(button, "role", "button");
				dom.setNSData(button, "pat", pat);
				dom.setNSData(button, "type", "period");
				button.innerText = "period";
				button.classList.add(Datetimepicker.classes.uiDatefieldPeriod);

				engine.instanceWidget(button, "Button", {
					inline: true
				});

				button.addEventListener("vclick", function () {
					switchAmPm(self, element);
				});
				dom.appendNodes(container, button);

				return button;
			}

			function parsePattern(pattern) {
				var matches = pattern.match(parsePatternRegexp),
					matchesLength = matches.length,
					i;

				for (i = 0; i < matchesLength; i++) {
					if (matches[i].charAt(0) === "'") {
						matches[i] = matches[i].substr(1, matches[i].length - 2);
					}
				}
				return matches;
			}

			function populateDataSelector(self, field, pat) {
				var date = new Date(self.options.date),
					values,
					numItems,
					current,
					data,
					yearLB,
					yearHB,
					day;

				switch (field) {
					case "hour":
						if (pat === "H" || pat === "HH") {
							// twenty four
							values = range(0, 23);
							data = range(0, 23);
							current = date.getHours();
						} else {
							values = range(1, 12);
							current = date.getHours() - 1;//11
							if (current >= 11) {
								current = current - 12;
								data = range(13, 23);
								data.push(12); // consider 12:00 am as 00:00
							} else {
								data = range(1, 11);
								data.push(0);
							}
							if (current < 0) {
								current = 11; // 12:00 or 00:00
							}
						}
						if (pat.length === 2) {
							// two digit
							values = values.map(makeTwoDigits);
						}
						numItems = values.length;
						break;
					case "min":
					case "sec":
						values = range(0, 59);
						if (pat.length === 2) {
							values = values.map(makeTwoDigits);
						}
						data = range(0, 59);
						current = (field === "min" ? date.getMinutes() : date.getSeconds());
						numItems = values.length;
						break;
					case "year":
						yearLB = 1900;
						yearHB = 2100;
						data = range(yearLB, yearHB);
						current = date.getFullYear() - yearLB;
						values = range(yearLB, yearHB);
						numItems = values.length;
						break;
					case "month":
						switch (pat.length) {
							case 1:
								values = range(1, 12);
								break;
							case 2:
								values = range(1, 12).map(makeTwoDigits);
								break;
							case 3:
								values = getCalendar().months.namesAbbr.slice();
								break;
							case 4:
								values = getCalendar().months.names.slice();
								break;
							default:
								values = [];
						}
						if (values.length === 13) { // @TODO Lunar calendar support
							if (values[12] === "") { // to remove lunar calendar reserved space
								values.pop();
							}
						}
						data = range(1, values.length);
						current = date.getMonth();
						numItems = values.length;
						break;
					case "day":
						day = daysInMonth[date.getMonth()];
						if (day === 28) {
							day += isLeapYear(date.getFullYear());
						}
						values = range(1, day);
						if (pat.length === 2) {
							values = values.map(makeTwoDigits);
						}
						data = range(1, day);
						current = date.getDate() - 1;
						numItems = day;
						break;
				}
				return {
					values: values,
					data: data,
					numItems: numItems,
					current: current
				};
			}

			function dateCalibration(date) {
				date.setDate(1);
				date.setDate(date.getDate() - 1);
			}

			function updateHandler(self, field, val) {
				var date = new Date(self.options.date),
					month;

				switch (field[1]) {
					case "min":
						date.setMinutes(val);
						break;
					case "hour":
						date.setHours(val);
						break;
					case "sec":
						date.setSeconds(val);
						break;
					case "year":
						month = date.getMonth();
						date.setFullYear(val);
						if (date.getMonth() !== month) {
							dateCalibration();
						}
						break;
					case "month":
						date.setMonth(val - 1);
						if (date.getMonth() === val) {
							dateCalibration();
						}
						break;
					case "day":
						date.setDate(val);
						break;
				}
				self._setDate(self.element, date);
			}

			function liClickHandler(self, event) {
				var val,
					target = event.target,
					classes = Datetimepicker.classes;

				if (target.tagName === "A") {
					target.parentNode.parentNode.querySelector("." + classes.current).classList.remove(classes.current);
					target.parentNode.classList.add(classes.current);
					val = dom.getNSData(target, "val");

					updateHandler(self, self._field, val);

					self._ctx.close();
				}
			}

			function closePopupHandler(self) {
				var ctxElement = self._ctx.element,
					targetClassList = self._target.classList,
					classes = Datetimepicker.classes;

				if (self._reflow) {
					window.removeEventListener("resize", self._reflow);
					self._reflow = null;
				}

				if (!(targetClassList.contains(classes.inClass) || targetClassList.contains(classes.outClass))) {
					targetClassList.remove(classes.uiDatefieldSelected);
				}

				ctxElement.removeEventListener("popupafterclose", self._closePopupHandler);
				self._circularview.element.removeEventListener("vclick", self.liClickHandler);
				self._ctx.destroy();
				ctxElement.parentNode.removeChild(ctxElement);
				self._popupOpen = false;
			}

			function scrollEndHandler(self) {
				if (!self._reflow) {
					self._reflow = function () {
						self._circularview.reflow();
					};
					window.addEventListener("resize", self._reflow);
				}
			}

			/**
			 * Method shows data selector.
			 * @method showDataSelector
			 * @param {ns.widget.mobile.Datetimepicker} self
			 * @param {HTMLElement} target
			 * @return {?Object}
			 */
			function showDataSelector(self, target) {
				var className = target.className,
					field = className ? className.match(fieldRegexp) : null,
					pat,
					data,
					values,
					valuesData,
					current,
					dataNS,
					ul,
					div,
					li,
					a,
					i,
					ctx,
					circularview,
					valuesLength,
					divCircularview,
					divCircularviewContainer,
					ctxElement,
					classes = Datetimepicker.classes;

				if (!field) {
					return null;
				}
				if (self._popupOpen) {
					return null;
				}

				self._target = target;
				self._field = field;
				target.classList.add(classes.uiDatefieldSelected);

				pat = dom.getNSData(target, "pat");
				data = populateDataSelector(self, field[1], pat);

				if (!target.id) {
					target.id = self.element.id + "-" + pat;
				}

				values = data.values;
				valuesLength = values.length;
				valuesData = data.data;
				current = data.current;

				if (values) {
					dataNS = "data-val";
					ul = document.createElement("ul");
					for (i = 0; i < valuesLength; i++) {
						li = document.createElement("li");
						if (i === current) {
							li.classList.add(classes.current);
						}
						a = document.createElement("a");
						a.classList.add(classes.uiLink);
						a.setAttribute(dataNS, valuesData[i]);
						a.innerText = values[i];
						li.appendChild(a);
						ul.appendChild(li);
					}

					div = document.createElement("div");
					div.classList.add(classes.uiDatetimepickerSelector);
					div.setAttribute("data-transition", "fade");
					div.setAttribute("data-fade", "false");
					div.setAttribute("data-role", "popup");
					div.setAttribute("data-corners", "false");
					divCircularview = document.createElement("div");
					divCircularview.appendChild(ul);

					self._ui.appendChild(div);

					ctx = engine.instanceWidget(div, "Popup");
					self._ctx = ctx;
					divCircularviewContainer = document.createElement("div");
					div.appendChild(divCircularviewContainer);
					divCircularviewContainer.appendChild(divCircularview);
					divCircularviewContainer.style.overflow = "hidden";
					// @TODO quick fix, change to proper width
					divCircularviewContainer.style.width = window.innerWidth + "px";
					ctxElement = ctx.element;
					ctxElement.parentNode.classList.add(classes.uiDatetimepicker);
					divCircularview.setAttribute("data-list", ">li");
					divCircularview.setAttribute("data-role", "circularview");

					circularview = engine.instanceWidget(divCircularview, "Circularview");
					self._circularview = circularview;
					if (!self._reflow) {
						self._reflow = function () {
							circularview.reflow();
							circularview.centerTo("." + classes.current, 0);
						};
						window.addEventListener("resize", self._reflow);
					}
					ctx.open({
						link: target.id,
						popupwindow: true,
						tolerance: "10,0"
					});

					self.contextPopup = ctx;
					self._popupOpen = true;

					self._closePopupHandler = closePopupHandler.bind(null, self);
					self._liClickHandler = liClickHandler.bind(null, self);
					self._scrollEndHandler = scrollEndHandler.bind(null, self);
					ctxElement.addEventListener("popupafterclose", self._closePopupHandler);
					divCircularview.addEventListener("vclick", self._liClickHandler, true);

					circularview.centerTo("." + classes.current, 500);
					ctxElement.addEventListener("scrollend", self._scrollEndHandler);
				}
				return self._ui;
			}

			/**
			 *
			 * @param {ns.widget.mobile.Datetimepicker} self
			 * @return {boolean}
			 */
			function orientationHandler(self) {
				if (self._popupOpen) {
					self._popupOpen = false;
					self.contextPopup.close();
				}
				return false;
			}

			Datetimepicker.prototype._setFormat = function (element, format, create) {
				var options = this.options,
					token,
					div = document.createElement("div"),
					tabulatorDiv,
					pat,
					span,
					classes = Datetimepicker.classes;

				if (format) {
					if (options.format === format) {
						return null;
					} else {
						options.format = format;
					}
				} else {
					if (!create) {
						return null;
					}
					format = options.format;
				}

				dom.removeAllChildren(this._ui);

				token = parsePattern(format);

				while (token.length > 0) {
					pat = token.shift();
					switch (pat) {
						case "H": //0 1 2 3 ... 21 22 23
						case "HH": //00 01 02 ... 21 22 23
						case "h": //0 1 2 3 ... 11 12
						case "hh": //00 01 02 ... 11 12
							span = createDateField("hour", pat, div);
							break;
						case "mm": //00 01 ... 59
						case "m": //0 1 2 ... 59
							if (options.type === "date") {
								span = createDateField("month", pat, div);
							} else {
								span = createDateField("min", pat, div);
							}
							break;
						case "ss":
						case "s":
							span = createDateField("sec", pat, div);
							break;
						case "d": // day of month 5
						case "dd": // day of month(leading zero) 05
							span = createDateField("day", pat, div);
							break;
						case "M": // Month of year 9
						case "MM": // Month of year(leading zero) 09
						case "MMM":
						case "MMMM":
							span = createDateField("month", pat, div);
							break;
						case "yy":	// year two digit
						case "yyyy": // year four digit
							span = createDateField("year", pat, div);
							break;
						case "t": //AM / PM indicator(first letter) A, P
						case "tt": //AM / PM indicator AM/PM
							// add button
							span = addButton(this, div, element, pat);
							break;
						case "g":
						case "gg":
							span = createDateField("era", pat, div);
							span.innerText = this._calendar().eras.name;
							break;
						case "\t":
							span = createDateField("tab", pat, div);
							tabulatorDiv = document.createElement("div");
							tabulatorDiv.classList.add(classes.uiDivider1st);
							tabulatorDiv.innerHTML = "&nbsp;";
							span.appendChild(tabulatorDiv);
							tabulatorDiv = document.createElement("div");
							tabulatorDiv.classList.add(classes.uiDivider2nd);
							tabulatorDiv.innerHTML = "&nbsp;";
							span.appendChild(tabulatorDiv);
							break;
						default: // string or any non-clickable object
							span = createDateField("seperator", pat, div);
							span.innerText = pat.replace(/[\-\/]/gi, "");
							break;
					}
				}

				dom.appendNodes(this._ui, div);
				if (options.date) {
					this._setDate(element, options.date);
				}

				element.setAttribute("data-format", options.format);
				return options.format;
			};

			/**
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @private
			 * @member ns.widget.mobile.Datetimepicker
			 */
			Datetimepicker.prototype._build = function (element) {
				var ui,
					elementClassList = element.classList,
					tagName = element.tagName.toLowerCase(),
					classes = Datetimepicker.classes;

				// INFO: Since 2.3, we decided to use Webkit based date-time picker.
				ns.warn("TAU based Datetimepicker widget will be deprecated. It is decided to be replaced <input> based date-time picker. Please use <input type='month|week|date|time|datetime-local'> for date-time picker");

				if (tagName === "input") {
					element.style.display = "none";
					/*
					 * @todo change to class object
					 */
					elementClassList.add(classes.uiInputText);
					elementClassList.add(classes.uiBodyPrefix + "s");
				}
				ui = document.createElement("div");
				ui.setAttribute("id", this.id + "-datetimepicker-ui");
				ui.classList.add(classes.uiDatefield);
				this._ui = ui;
				if (tagName === "input") {
					dom.insertNodeAfter(element, ui);
				} else {
					element.appendNode(ui);
				}

				return element;
			};

			function datetimepicerClick(self, event) {
				showDataSelector(self, event.target);
				return false;
			}

			Datetimepicker.prototype._bindEvents = function () {
				this._orientationHandlerBound = orientationHandler.bind(null, this);
				this._datetimepicerClickBound = datetimepicerClick.bind(null, this);
				this._ui.addEventListener("vclick", this._datetimepicerClickBound, true);
				window.addEventListener("orientationchange", this._orientationHandlerBound, false);
			};

			/**
			 * @method _init
			 * @protected
			 * @member ns.widget.mobile.Datetimepicker
			 */
			Datetimepicker.prototype._init = function () {
				var options = this.options,
					element = this.element,
					value,
					tagName = element.tagName.toLowerCase(),
					type;

				if (!this._ui) {
					this._ui = document.getElementById(this.id + "-datetimepicker-ui");
				}
				if (!options.format) {
					switch (options.type) {
						case "datetime":
							this._setFormat(getCalendar().patterns.d + "\t" + getCalendar().patterns.t);
							break;
						case "date":
							this._setFormat(element, getCalendar().patterns.d);
							break;
						case "time":
							this._setFormat(element, getCalendar().patterns.t);
							break;
					}
				}

				if (element && tagName === "input") {
					value = element.getAttribute("value");
					if (value) {
						options.date = new Date(value);
					}
					type = element.getAttribute("type");
					this._setType(element, type);
					if (!options.format) {
						switch (type) {
							case "datetime":
								this._setFormat(element, getCalendar().patterns.d + "\t" + getCalendar().patterns.t);
								break;
							case "date":
								this._setFormat(element, getCalendar().patterns.d);
								break;
							case "time":
								this._setFormat(element, getCalendar().patterns.t);
								break;
						}
					}
				}

				if (!options.date) {
					options.date = new Date();
				}
				this._setFormat(element, null, true);
				this._popupOpen = false;
			};

			Datetimepicker.prototype._destroy = function () {
				this._ui.removeEventListener("vclick", this._datetimepicerClickBound, true);
				window.removeEventListener("orientationchange", this._orientationHandlerBound, false);
			};

			Datetimepicker.prototype._setValue = function (value) {
				return this._setDate(this.element, value);
			};

			function timetoString(time) {
				return makeTwoDigits(time.getHours()) + ":" +
					makeTwoDigits(time.getMinutes()) + ":" +
					makeTwoDigits(time.getSeconds());
			}

			function dateToString(date) {
				return ((date.getFullYear() % 10000) + 10000).toString().substr(1) + "-" +
					makeTwoDigits(date.getMonth() + 1) + "-" +
					makeTwoDigits(date.getDate());
			}

			Datetimepicker.prototype._isLeapYear = function (year) {
				return isLeapYear(year);
			};

			Datetimepicker.prototype._switchAmPm = function () {
				return switchAmPm(this, this.element);
			};

			Datetimepicker.prototype._getValue = function () {
				var date = this._getDate(this.element),
					rValue;

				switch (this.options.type) {
					case "time":
						rValue = timetoString(date);
						break;
					case "date":
						rValue = dateToString(date);
						break;
					default:
						rValue = dateToString(date) + "T" + timetoString(date);
						break;
				}
				return rValue;
			};

			// definition
			ns.widget.mobile.Datetimepicker = Datetimepicker;
			engine.defineWidget(
				"Datetimepicker",
				// Datetimepicker UI changed in changeable UX.
				// New UX need to UX whole change so we decide datetimepicker re-implement lately
				//"input[type='date'], input[type='datetime'], input[type='time'], [date-role='datetimepicker'], .ui-datetimepicker",
				"[data-role='datetimepicker']",
				[],
				Datetimepicker,
				"tizen"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Datetimepicker;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
