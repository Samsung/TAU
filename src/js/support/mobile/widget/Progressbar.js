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

/**
 * #Progress Bar Widget
 * The progress bar widget shows a control that indicates the progress
 * percentage of an on-going operation.
 *
 * ## Default selectors
 * In default elements matches to :
 *
 *  - HTML elements with data-role equal "progressbar"
 *  - HTML elements with class ui-progressbar
 *
 * ###HTML Examples
 *
 * ####Create simple text input on INPUT element
 *
 *        @example
 *        <div id="progress-bar" data-role="progressbar"></div>
 *
 * ## Manual constructor
 * For manual creation of button widget you can use constructor of widget from
 * **tau** namespace:
 *
 *        @example
 *        <div id="progress-bar"></div>
 *        <script>
 *            var element = document.getElementById("progress-bar"),
 *                progressBar = tau.widget.ProgressBar(element);
 *        </script>
 *
 * Constructor has one required parameter **element** which is base
 * **HTMLElement** to create widget. We recommend fetching this element by
 * method *document.getElementById*. Second parameter is **options** and it is a
 * object with options for widget.
 *
 * If jQuery library is loaded, its method can be used:
 *
 *        @example
 *        <div id="progress-bar"></div>
 *        <script>
 *            $("#progress-bar").progressbar();
 *        </script>
 *
 * jQuery Mobile constructor has one optional parameter **options** and it is
 * a object with options for widget.
 *
 * ##Options for widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *        @example
 *        <script>
 *            var element = document.getElementById("progress-bar"),
 *                progressBar = tau.widget.ProgressBar(element);
 *
 *            progressBar.methodName(argument1, argument2, ...);
 *        </script>
 *
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *        @example
 *        $(".selector").progressbar("methodName", argument1, argument2, ...);
 *
 * @extends ns.widget.BaseWidget
 * @class ns.widget.mobile.ProgressBar
 */

(function (document, ns) {
	"use strict";

	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);


	define(
		[
			"../../../core/engine",
			"../../../profile/mobile/widget/mobile",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile",
			"../../../core/event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,


				events = ns.event,
				/**
				 * @property {ns.engine} engine Alias for class ns.engine
				 * @member ns.widget.mobile.ProgressBar
				 * @private
				 */
				engine = ns.engine,

				ProgressBar = function () {

					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {number} [options.value=0] value of progress
					 * bar
					 * @property {number} [options.min=0] minimal value of
					 * progress bar
					 * @property {number} [options.max=100] maximal value of
					 * progress bar
					 * @member ns.widget.mobile.ProgressBar
					 */
					this.options = {
						value: 0,
						max: 100,
						min: 0
					};
				};

			/**
			 * Event is triggered when value of widget is changing.
			 * @event change
			 * @member ns.widget.mobile.ProgressBar
			 */

			/**
			 * Event is triggered when value of widget riches maximal value.
			 * @event complete
			 * @member ns.widget.mobile.ProgressBar
			 */

			ProgressBar.prototype = new BaseWidget();

			/**
			 * Dictionary for progress related css class names
			 * @property {Object} classes
			 * @static
			 * @member ns.widget.mobile.ProgressBar
			 * @readonly
			 */
			ProgressBar.classes = {
				uiProgressbar: "ui-progressbar",
				uiProgressbarBg: "ui-progressbar-bg",
				uiProgressbarValue: "ui-progressbar-value"
			};

			/**
			 * Build structure of progress widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.ProgressBar
			 */
			ProgressBar.prototype._build = function (element) {
				/* cached ProgressBar.classes object
				 * type Object
				 */
				var classes = ProgressBar.classes,
					self = this,
					options = self.options,
					progressBarBgElement,
					progressBarValueElement;

				progressBarBgElement = document.createElement("div");
				progressBarValueElement = document.createElement("div");

				element.classList.add(classes.uiProgressbar);
				progressBarBgElement.classList.add(classes.uiProgressbarBg);
				progressBarValueElement.classList.add(classes.uiProgressbarValue);

				progressBarValueElement.style.width = options.value + "%";

				progressBarValueElement.style.display = "none";

				element.setAttribute("role", "ProgressBar");
				element.setAttribute("aria-valuemin", options.min);
				element.setAttribute("aria-valuenow", options.value);
				element.setAttribute("aria-valuemax", options.max);

				progressBarBgElement.appendChild(progressBarValueElement);
				element.appendChild(progressBarBgElement);

				// fix for compare tests
				self.min = options.min;
				self.valueDiv = progressBarValueElement;
				self.oldValue = options.value;

				return element;
			};

			/**
			 * Get or set value
			 *
			 * Return inner text of button or set text on button
			 *
			 *    @example
			 *    <div id="progress-bar"></div>
			 *    <script>
			 *        var element = document.getElementById("progress-bar"),
			 *            progressBarWidget = tau.widget.ProgressBar(element),
			 *            // returns current value
			 *            value = progressBarWidget.value();
			 *
			 *        progressBarWidget.value( 30 ); // sets new value to 30
			 *    </script>
			 *
			 *    @example
			 *    <div id="progress-bar"></div>
			 *    <script>
			 *        // returns current value
			 *        $( "#progress-bar" ).progressbar( "value" );
			 *
			 *        // set new value to 30
			 *        $( "#progress-bar" ).progressbar( "value", 30 );
			 *    </script>
			 * @method value
			 * @param {number} [value] Value to set on progress bar
			 * @return {number} In get mode returns current value of progress
			 * bar
			 * @since 2.3
			 * @member ns.widget.mobile.ProgressBar
			 */

			/**
			 * Method sets ProgressBar value.
			 * @method _setValue
			 * @param {number} value
			 * @return {boolean}
			 * @protected
			 * @member ns.widget.mobile.ProgressBar
			 */
			ProgressBar.prototype._setValue = function (value) {
				var options = this.options;

				if (typeof value === "number") {
					value = Math.min(options.max, Math.max(options.min, value));
					if (value !== options.value) {
						events.trigger(this.element, "change");
						options.value = value;
					}
					if (value === options.max) {
						events.trigger(this.element, "complete");
					}
					this.refresh();
					return true;
				}
				return false;
			};

			/**
			 * Method gets ProgressBar value.
			 * @method _getValue
			 * @return {number}
			 * @protected
			 * @member ns.widget.mobile.ProgressBar
			 */
			ProgressBar.prototype._getValue = function () {
				return this.options.value;
			};

			/**
			 * Refresh a progress bar.
			 *
			 * This method will rebuild while DOM structure of widget. Method
			 * should be called after are manually change in HTML attributes of
			 * widget DOM structure. Refresh is called automatically after
			 * change any option of widget.
			 *
			 *    @example
			 *    <div id="progress-bar"></div>
			 *    <script>
			 *        var element = document.getElementById("progress-bar"),
			 *            progressBarWidget = tau.widget.ProgressBar(element),
			 *
			 *        progressBarWidget.refresh();
			 *    </script>
			 *
			 *    @example
			 *    <div id="progress-bar"></div>
			 *    <script>
			 *        $( "#progress-bar" ).progressbar( "refresh" );
			 *    </script>
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.ProgressBar
			 */

			/**
			 * Method refreshes ProgressBar.
			 * @method _refresh
			 * @member ns.widget.mobile.ProgressBar
			 * @protected
			 */
			ProgressBar.prototype._refresh = function () {
				var element = this.element,
					options = this.options,
					elementChild = element.firstElementChild.firstElementChild;

				element.setAttribute("aria-valuenow", options.value);
				elementChild.style.display = "";
				elementChild.style.width = options.value + "%";
			};

			// definition
			ns.widget.mobile.ProgressBar = ProgressBar;
			engine.defineWidget(
				"ProgressBar",
				"[data-role='progressbar'], .ui-progressbar",
				["value"],
				ProgressBar,
				"tizen"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.ProgressBar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
