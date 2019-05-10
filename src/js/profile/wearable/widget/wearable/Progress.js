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
/*jslint nomen: true */
/**
 * # Progress
 * Shows a control that indicates the linear shape progressbar percentage of an on-going operation.
 *
 * The progress widget shows a control that indicates the progress percentage of an on-going operation. This widget can be scaled to fit inside a parent container.
 *
 * ## Default selectors
 *
 * This widget provide three style progress.
 *
 * ### Simple progress bar
 * If you don't implement any class, you can show default progress style
 * To add a progress widget to the application, use the following code:
 *
 *      @example
 *      <progress max="100" value="90"></progress>
 *
 * ### Infinite progress bar
 * If you implement class (*ui-progress-indeterminate*), you can show image looks like infinite move.
 *
 * To add a progress widget to the application, use the following code:
 *      @example
 *      <progress class="ui-progress-indeterminate" max="100" value="100"></progress>
 *
 * ### Progress bar with additional information
 * If you implement div tag that can choose two classes (*ui-progress-proportion* or *ui-progress-ratio*) at progress tag same level, you can show two information (proportion information is located left below and ratio information is located right below)
 *
 * To add a progress widget to the application, use the following code:
 *
 *      @example
 *      <progress max="100" value="50"></progress>
 *      <div class="ui-progress-proportion">00/20</div>
 *      <div class="ui-progress-ratio">50%</div>
 *
 * ## JavaScript API
 *
 * Progress widget hasn't JavaScript API.
 *
 * @class ns.widget.wearable.Progress
 * @component-selector .ui-progress-indeterminate, .ui-progress-proportion, .ui-progress-ratio
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

				Progress = function () {
					return this;
				},
				prototype = new BaseWidget();

			Progress.events = {};

			/**
			 * Build Progress
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.Progress
			 */
			prototype._build = function (element) {
				return element;
			};

			prototype._init = function (element) {
				return element;
			};

			prototype._bindEvents = function (element) {
				return element;
			};

			/**
			 * Refresh structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.wearable.Progress
			 */
			prototype._refresh = function () {
				return null;
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.Progress
			 */
			prototype._destroy = function () {
				return null;
			};

			Progress.prototype = prototype;
			ns.widget.wearable.Progress = Progress;

			engine.defineWidget(
				"Progress",
				"progress",
				[],
				Progress,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Progress;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
