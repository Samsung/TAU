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
/*jslint nomen: true */
/**
 * # Master OnOff Switch
 * Master OnOff switch component is a common UI element used for binary on/off data input.
 * In difference to standard switch the master controls all switches in depended listview.
 * If Master On/Off switch is "Off", the lower items are switched to disabled state.
 * If Master On/Off switch is "On", the lower items are switched to enabled state.
 *
 * The Master OnOff switch widget shows a 2-state switch on the screen.
 * On the toggle its possible to tap one side of the switch.
 *
 * ## Default selectors
 * HTML element with class ui-master-on-off-switch" will changed to master on-off switch
 * To add a Master on-off switch widget to the application, use the following code:
 *
 *        @example
 *        <div class="ui-master-on-off-switch" data-target="list-1"></div>
 *
 * ## JavaScript API
 *
 * MasterOnOffSwitch widget hasn't JavaScript API.
 *
 * @since 1.2
 * @class ns.widget.core.MasterOnOffSwitch
 * @component-selector .ui-master-on-off-switch
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../BaseKeyboardSupport",
			"../core", // fetch namespace
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var MasterOnOffSwitch = function () {
					var self = this;

					/**
					 * Options for widget
					 * @property {Object} options
					 * @member ns.widget.core.MasterOnOffSwitch
					 */
					self.options = {
						target: null
					},
					self._ui = {};
					self._onChangeMasterOnOff = null;
				},
				BaseWidget = ns.widget.BaseWidget,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				engine = ns.engine,
				widgetClass = "ui-master-on-off-switch",

				classes = {
					/**
					 * Standard toggle switch widget
					 * @member ns.widget.core.MasterOnOffSwitch
					 */
					WIDGET: widgetClass
				},
				keyCode = {
					ENTER: 13,
					SPACE: 32
				},
				widgetSelector = ".ui-master-on-off-switch",
				prototype = new BaseWidget();

			MasterOnOffSwitch.prototype = prototype;

			/**
			 * Dictionary for MasterOnOffSwitch related css class names
			 * @property {Object} classes
			 * @member ns.widget.core.MasterOnOffSwitch
			 * @static
			 * @readonly
			 */
			MasterOnOffSwitch.classes = classes;

			/**
			 * Dictionary for keyboard codes
			 * @property {Object} keyCode
			 * @member ns.widget.core.MasterOnOffSwitch
			 * @static
			 * @readonly
			 */
			MasterOnOffSwitch.keyCode = keyCode;

			/**
			 * Build OnOffSwitch
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.MasterOnOffSwitch
			 */
			prototype._build = function (element) {
				var self = this,
					label = document.createElement("label"),
					labelText = document.createElement("span"),
					onOff = document.createElement("input");

				onOff.classList.add("ui-on-off-switch");
				onOff.type = "checkbox";
				label.classList.add("ui-on-off-label");

				labelText.innerHTML = "Off";
				label.appendChild(labelText);
				label.appendChild(onOff);

				element.appendChild(label);
				element.classList.add(classes.WIDGET);

				self._ui.onOff = onOff;
				self._ui.labelOnOff = label;
				self._ui.labelTextOnOff = labelText;

				// create instance of widget
				ns.widget.OnOffSwitch(onOff);

				return element;
			};

			/**
			 * Initiate widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.MasterOnOffSwitch
			 * @instance
			 */
			prototype._init = function (element) {
				var self = this;

				self._ui.input = element.querySelector("input.ui-on-off-switch");
				// set initial look
				onChangeMasterOnOff(self);
			};

			function onChangeMasterOnOff(self) {
				var onOff = self._ui.onOff,
					label = self._ui.labelOnOff,
					labelText = self._ui.labelTextOnOff;

				if (onOff.checked) {
					label.classList.add("ui-on-off-label-active");
					labelText.innerHTML = "On";
				} else {
					label.classList.remove("ui-on-off-label-active");
					labelText.innerHTML = "Off";
				}
				self._disableAllOnOff(!onOff.checked);
			}

			/**
			 * Binds events to widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.MasterOnOffSwitch
			 * @instance
			 */
			prototype._bindEvents = function () {
				var self = this,
					onOff = self._ui.onOff,
					_onChangeMasterOnOff = onChangeMasterOnOff.bind(null, self);

				onOff.addEventListener("change", _onChangeMasterOnOff);

				self._onChangeMasterOnOff = _onChangeMasterOnOff;
			};

			prototype._unbindEvents = function () {
				var self = this,
					onOff = self._ui.onOff;

				onOff.removeEventListener("change", self._onChangeMasterOnOff);

				self._onChangeMasterOnOff = null;
			};

			/**
			 * Disables / enables on/off switches on list
			 * @method _disableAllOnOff
			 * @param {boolean} disabled
			 * @member ns.widget.core.MasterOnOffSwitch
			 * @protected
			 */
			prototype._disableAllOnOff = function (disabled) {
				var targetElement = document.getElementById(this.options.target),
					allOnOff = [],
					ui = this._ui,
					onOffSwitch = null;

				if (targetElement) {
					allOnOff = [].slice.call(targetElement.querySelectorAll(".ui-on-off-switch")),
					allOnOff.filter(function (item) {
						return item !== ui.onOff;
					}).forEach(function (onOff) {
						onOffSwitch = ns.widget.OnOffSwitch(onOff);
						if (disabled) {
							onOffSwitch.disable();
						} else {
							onOffSwitch.enable();
						}
					});
				} else {
					ns.warn("MasterOnOffSwitch: indicated target element (" + this.options.target + ") not found");
				}
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.MasterOnOffSwitch
			 */
			prototype._destroy = function () {
				this._unbindEvents();
			};

			prototype._keyUp = function (event) {
				if (event.keyCode === keyCode.ENTER) {
					this._ui.onOff.checked = !this._ui.onOff.checked;
				}
			};

			MasterOnOffSwitch.widgetSelector = widgetSelector;

			ns.widget.core.MasterOnOffSwitch = MasterOnOffSwitch;
			engine.defineWidget(
				"MasterOnOffSwitch",
				widgetSelector,
				[],
				MasterOnOffSwitch,
				"core"
			);

			BaseKeyboardSupport.registerActiveSelector(widgetSelector);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.MasterOnOffSwitch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
