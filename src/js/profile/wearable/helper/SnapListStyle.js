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
/**
 * #SnapListStyle Helper Script
 * Helper script using SnapListview.
 * @class ns.helper.SnapListStyle
 * @author Junyoung Park <jy-.park@samsung.com>
 */
(function (document, window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../helper",
			"../../../core/engine",
			"../widget/wearable/SnapListview"
		],
		function () { //>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,

				SnapListStyle = function (listDomElement, options) {
					this._snapListviewWidget = engine.instanceWidget(listDomElement, "SnapListview", options);
				},

				prototype = SnapListStyle.prototype;

			/**
			 * Destroy helper
			 * @method destroy
			 * @member ns.helper.SnapListStyle
			 */
			prototype.destroy = function () {
				var self = this;

				if (self._snapListviewWidget) {
					self._snapListviewWidget.destroy();
				}

				self._snapListviewWidget = null;
			};

			/**
			 * Return Snap list
			 * @method getSnapList
			 * @member ns.helper.SnapListStyle
			 */
			prototype.getSnapList = function () {
				return this._snapListviewWidget;
			};

			/**
			 * Create helper
			 * @method create
			 * @param {HTMLElement} listDomElement
			 * @param {Object} options
			 * @static
			 * @member ns.helper.SnapListStyle
			 */
			SnapListStyle.create = function (listDomElement, options) {
				return new SnapListStyle(listDomElement, options);
			};

			ns.helper.SnapListStyle = SnapListStyle;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return SnapListStyle;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
