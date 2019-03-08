/*global window, ns, define */
/*jslint nomen: true */
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
 * ListDivider Widget for Support Backward Compatibility
 *
 * @class ns.widget.mobile.GroupIndex
 * @author Heeju Joo <heeju.joo@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/DOM",
			"../../../core/util/object",
			"../../../profile/mobile/widget/mobile",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.mobile.GroupIndex
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias to ns.util.DOM
				 * @property {Object} dom
				 * @private
				 * @member ns.widget.mobile.GroupIndex
				 * @static
				 */
				DOM = ns.util.DOM,

				classes = {
					uiLiDivider: "ui-li-divider",
					uiDividerNormalLine: "ui-divider-normal-line"
				},

				ListDivider = function () {
					return this;
				};

			ListDivider.prototype = new BaseWidget();
			ListDivider.classes = classes;

			ListDivider.prototype._configure = function () {
				this.options = {
					style: "normal",
					folded: false,
					line: true
				};
			};

			ListDivider.prototype._build = function (element) {
				var options = this.options,
					classes = ListDivider.classes,
					classList = element.classList,
					elementWithLine;

				classList.add(classes.uiLiDivider);

				if (!options.style || options.style === "normal" || options.style === "check") {
					DOM.wrapInHTML(
						element.childNodes,
						"<span class='ui-divider-text'></span>"
					);

					if (options.folded === true) {
						DOM.wrapInHTML(
							element.childNodes,
							"<a href='#'></a>"
						);
					}

					if (options.line === true) {
						if (options.folded === true) {
							elementWithLine = element.firstChild;
						} else {
							elementWithLine = element;
						}
						if (elementWithLine) {
							elementWithLine.insertAdjacentHTML(
								"beforeend",
								"<span class='" + classes.uiDividerNormalLine + "'></span>"
							);
						}
					}
				}
				return element;
			};

			ListDivider.prototype._init = function (element) {
				element.setAttribute("role", "heading");
				element.setAttribute("tabindex", "0");

				return element;
			};

			ns.widget.mobile.ListDivider = ListDivider;
			engine.defineWidget(
				"ListDivider",
				"[data-role='list-divider'], .ui-list-divider",
				[],
				ListDivider,
				"mobile",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ListDivider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
