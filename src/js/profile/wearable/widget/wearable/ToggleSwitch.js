/*global window, ns, define */
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
 * # Toggle Switch Widget
 * Shows a 2-state switch.
 *
 * The toggle switch widget shows a 2-state switch on the screen.
 *
 * ## Default selectors
 *
 * To add a toggle switch widget to the application, use the following code:
 *
 *      @example template
 *      <div class="ui-toggleswitch ui-toggleswitch-large">
 *          <input type="checkbox" class="ui-switch-input" />
 *          <div class="ui-switch-button"></div>
 *      </div>
 *
 *      @example tau-toggle-switch
 *      <div class="ui-switch">
 *          <div class="ui-switch-text">
 *              Toggle Switch
 *          </div>
 *          <label class="ui-toggleswitch">
 *              <input type="checkbox" class="ui-switch-input">
 *              <div class="ui-switch-activation">
 *                   <div class="ui-switch-inneroffset">
 *                       <div class="ui-switch-handler"></div>
 *                   </div>
 *              </div>
 *           </label>
 *      </div>
 *
 * ## JavaScript API
 *
 * ToggleSwitch widget hasn't JavaScript API.
 *
 * @class ns.widget.wearable.ToggleSwitch
 * @component-selector .ui-toggleswitch
 * @component-type standalone-component
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../wearable",
			"../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,

				ToggleSwitch = function () {
					/**
					 * Options for widget
					 * @property {Object} options
					 * @property {?string} [options.text=null] Shown text
					 * @member ns.widget.wearable.ToggleSwitch
					 */
					this.options = {
						text: null
					};
				},
				events = {},
				classesPrefix = "ui-switch",
				classes = {
					handler: classesPrefix + "-handler",
					inneroffset: classesPrefix + "-inneroffset",
					activation: classesPrefix + "-activation",
					input: classesPrefix + "-input",
					text: classesPrefix + "-text"
					/**
					 * Set big size
					 * @style ui-toggleswitch-large
					 * @member ns.widget.wearable.ToggleSwitch
					 */
				},
				prototype = new BaseWidget();

			function getClass(name) {
				return classes[name];
			}

			function addClass(element, classId) {
				element.classList.add(getClass(classId));
			}

			function createElement(name) {
				return document.createElement(name);
			}

			/**
			 * Dictionary for ToggleSwitch related events.
			 * For ToggleSwitch, it is an empty object.
			 * @property {Object} events
			 * @member ns.widget.wearable.ToggleSwitch
			 * @static
			 */
			ToggleSwitch.events = events;

			/**
			 * Dictionary for ToggleSwitch related css class names
			 * @property {Object} classes
			 * @member ns.widget.wearable.ToggleSwitch
			 * @static
			 * @readonly
			 */
			ToggleSwitch.classes = classes;

			/**
			 * Build ToggleSwitch
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.ToggleSwitch
			 */
			prototype._build = function (element) {
				var options = this.options,
					text = options.text,
					divText,
					label = createElement("label"),
					input = createElement("input"),
					divActivation = createElement("div"),
					divInnerOffset = createElement("div"),
					divHandler = createElement("div");

				if (text) {
					divText = createElement("div");
					addClass(divText, "text");
					divText.innerHTML = text;
					element.appendChild(divText);
				}
				addClass(divHandler, "handler");
				divInnerOffset.appendChild(divHandler);
				addClass(divInnerOffset, "inneroffset");
				divActivation.appendChild(divInnerOffset);
				addClass(divActivation, "activation");
				label.classList.add("ui-toggleswitch");
				input.type = "checkbox";
				addClass(input, "input");
				label.appendChild(input);
				label.appendChild(divActivation);
				element.appendChild(label);
				return element;
			};

			ToggleSwitch.prototype = prototype;
			ns.widget.wearable.ToggleSwitch = ToggleSwitch;

			engine.defineWidget(
				"ToggleSwitch",
				".ui-switch",
				[],
				ToggleSwitch,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ToggleSwitch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
