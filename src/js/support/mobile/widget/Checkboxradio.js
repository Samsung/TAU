/*global window, define, ns */
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
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../profile/mobile/widget/mobile",
			"../../../core/engine",
			"../../../core/util/selectors",
			"../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				Checkboxradio = function () {
					var self = this;

					self._inputType = null;
				},
				classes = {
					UI_PREFIX: "ui-"
				},
				prototype = new BaseWidget();

			Checkboxradio.prototype = prototype;

			/**
			 * Build Checkboxradio widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Checkboxradio
			 * @instance
			 */
			prototype._build = function (element) {
				var inputType = element.getAttribute("type"),
					elementClassList = element.classList;

				if (inputType !== "checkbox" && inputType !== "radio") {
					//_build should always return element
					return element;
				}

				elementClassList.add(classes.UI_PREFIX + inputType);

				return element;
			};

			/**
			 * Returns the value of checkbox or radio
			 * @method _getValue
			 * @member ns.widget.mobile.Checkboxradio
			 * @return {?string}
			 * @protected
			 * @instance
			 */
			prototype._getValue = function () {
				return this.element.value;
			};

			/**
			 * Set value to the checkbox or radio
			 * @method _setValue
			 * @param {string} value
			 * @member ns.widget.mobile.Checkboxradio
			 * @return {ns.widget.mobile.Checkboxradio}
			 * @instance
			 * @protected
			 */
			prototype._setValue = function (value) {
				this.element.value = value;
			};

			// definition
			ns.widget.mobile.Checkboxradio = Checkboxradio;
			engine.defineWidget(
				"Checkboxradio",
				"input[type='checkbox']:not(.ui-slider-switch-input):not([data-role='toggleswitch']):not(.ui-toggleswitch), " +
				"input[type='radio'], " +
				"input.ui-checkbox, " +
				"input.ui-radio",
				[],
				Checkboxradio,
				""
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Checkboxradio;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
