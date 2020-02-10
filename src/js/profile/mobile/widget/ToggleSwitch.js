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
/*jslint nomen: true */
/**
 * # Toggle Switch
 * Toggle switch component is a common UI element used for binary on/off or true/false data input.
 *
 * The toggle switch widget shows a 2-state switch on the screen.
 * If defined with select type with options it creates toggles
 * On the toggle its possible to tap one side of the switch.
 *
 * We still support toggles defined with select tag for backward compatibility
 *
 * ## Default selectors
 * INPUT tags with _data-role=toggleswitch_ or SELECT tags
 * with _data-role=toggleswitch_
 * changed to toggle switch
 * To add a toggle switch widget to the application, use the following code:
 *
 *        @example
 *        <input type="checkbox" data-role="toggleswitch">
 *
 *        @example
 *        <select name="flip-11" id="flip-11" data-role="toggleswitch">
 *            <option value="off"></option>
 *            <option value="on"></option>
 *        </select>
 *
 *        @example
 *        <select name="flip-11" id="flip-11" data-role="toggleswitch">
 *            <option value="off">off option</option>
 *            <option value="on">on option</option>
 *        </select>
 *
 * ## Manual constructor
 * For manual creation of toggle switch widget you can use constructor of
 * widget from **tau** namespace:
 *
 *        @example
 *        <select id="toggle" name="flip-11" id="flip-11" data-role="toggleswitch"
 *        data-mini="true">
 *            <option value="off"></option>
 *            <option value="on"></option>
 *        </select>
 *        <script>
 *            var toggleElement = document.getElementById("toggle"),
 *                toggle = tau.widget.ToggleSwitch(toggleElement);
 *        </script>
 *
 * ## JavaScript API
 *
 * ToggleSwitch widget hasn't JavaScript API.
 *
 * @since 2.0
 * @deprecated 1.2
 * @class ns.widget.mobile.ToggleSwitch
 * @component-selector .ui-toggleswitch, [data-role]="toggleswitch"
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/DOM/attributes",
			"../../../core/util/DOM/manipulation",
			"../../../core/util/string",
			"../../../core/event",
			"../../../core/widget/core/Button",
			"../../../core/widget/core/OnOffSwitch",
			"../../../core/widget/BaseKeyboardSupport",
			"../widget", // fetch namespace
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				OnOffSwitch = ns.widget.core.OnOffSwitch,
				ToggleSwitch = function () {
					// constructor;
					OnOffSwitch.call(this, arguments);
				},
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				widgetSelector = "input[data-role='toggleswitch']," +
					"select[data-role='toggleswitch']," +
					"select.ui-toggleswitch," +
					"input.ui-toggleswitch";

			ToggleSwitch.prototype = new OnOffSwitch();
			ns.widget.mobile.ToggleSwitch = ToggleSwitch;
			engine.defineWidget(
				"ToggleSwitch",
				widgetSelector,
				[],
				ToggleSwitch,
				"mobile"
			);

			BaseKeyboardSupport.registerActiveSelector(widgetSelector);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.ToggleSwitch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
