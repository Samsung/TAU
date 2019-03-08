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
 * # Processing
 * Shows a control that operates as progress infinitely.
 *
 * The processing widget shows that an operation is in progress.
 *
 * ## Default selectors
 *
 * To add a processing widget to the application, use the following code:
 *
 *      @example template tau-precessing
 *      <div class="ui-processing"></div>
 *      <div class="ui-processing-text">
 *          Description about progress
 *      </div>
 *
 * ## JavaScript API
 *
 * Processing widget hasn't JavaScript API.
 * @component-selector .ui-processing
 * @component-type standalone-component
 * @class ns.widget.wearable.Progressing
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
				Progressing = function () {
					return this;
				},
				prototype = new BaseWidget();

			Progressing.events = {};
			/**
			 * Set full screen size
			 * @style ui-processing-full-size
			 * @member ns.widget.wearable.Progressing
			 */

			/**
			 * Build Progressing
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.Progressing
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
			 * @member ns.widget.wearable.Progressing
			 */
			prototype._refresh = function () {
				return null;
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.Progressing
			 */
			prototype._destroy = function () {
				return null;
			};

			Progressing.prototype = prototype;
			ns.widget.wearable.Progressing = Progressing;

			engine.defineWidget(
				"Progressing",
				".ui-progress",
				[],
				Progressing,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Progressing;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
