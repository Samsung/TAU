/*global define, ns */
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
 * # List Divider Widget
 * List divider widget creates a list separator, which can be used for building grouping lists using.
 *
 *
 * ## Default selectors
 * In all elements with _data-role=listdivider_ are changed to Tizen Web UI ListDivider.
 *
 * In addition all elements with class _ui-listdivider_ are changed to Tizen Web UI ListDivider.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider">Item styles</li>
 *			<li><a href="#">Normal lists</a></li>
 *			<li><a href="#">Normal lists</a></li>
 *			<li><a href="#">Normal lists</a></li>
 *		</ul>
 *
 * ## Manual constructor
 * For manual creation of listdivider widget you can use constructor of widget:
 *
 *		@example
 *		<ul data-role="listview">
 *			<li>Item</li>
 *			<li id="listdivider">Divider</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *		<script>
 *			var listdivider = tau.widget.ListDivider(document.getElementById("listdivider"));
 *		</script>
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<ul data-role="listview">
 *			<li>Item</li>
 *			<li id="listdivider">Divider</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *		<script>
 *			$("#listdivider").listdivider();
 *		</script>
 *
 * ## Options
 *
 * ### Style
 * _data-style_ string ["normal" | "checkbox" | "dialogue"] Option sets the style of the list divider.
 *
 * #### Checkbox
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-style="checkbox">
 *				<form><input type="checkbox">Select All</form>
 *			</li>
 *			<li><form><input type="checkbox">Item</form></li>
 *			<li><form><input type="checkbox">Item</form></li>
 *			<li><form><input type="checkbox">Item</form></li>
 *		</ul>
 *
 * #### Dialogue
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-style="dialogue">Items</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *
 * ### Theme
 * _data-theme_ string Theme for list divider
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-theme="c">Item styles</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *
 * ### Folded
 * _data-folded_ string ["true" | "false"] Decide to show divider press effect or not
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-folded="true">Item styles</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *
 * ### Line
 * _data-line_ string ["true" | "false"] Decide to draw divider line or not
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-line="false">Item styles</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *
 * @class ns.widget.mobile.ListDivider
 * @extends ns.widget.BaseWidget
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/DOM/manipulation",
			"../../../core/util/selectors",
			"../widget",
			"./BaseWidgetMobile",
			"../../../core/widget/core/Button"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.mobile.ListDivider
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias to ns.util.DOM
				 * @property {Object} dom
				 * @private
				 * @member ns.widget.mobile.ListDivider
				 * @static
				 */
				dom = ns.util.DOM,

				ListDivider = function () {
					return this;
				};

			ListDivider.prototype = new BaseWidget();

			/**
			 * Dictionary for listdivider related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.ListDivider
			 * @property {string} uiLiDivider Main class of divider
			 * @property {string} uiBarThemePrefix Class prefix of divider bar
			 * @property {string} uiDividerNormalLine Class of divider normal line
			 * @static
			 * @readonly
			 */
			ListDivider.classes = {
				uiBarThemePrefix: "ui-bar-",
				uiLiDivider: "ui-li-divider",
				uiDividerNormalLine: "ui-divider-normal-line"
			};

			/**
			 * Configure widget options
			 * @method _configure
			 * @member ns.widget.mobile.ListDivider
			 * @protected
			 */
			ListDivider.prototype._configure = function () {
				var options = this.options || {};
				/**
				 * Object with default options
				 * @property {Object} options
				 * @property {string} [options.theme="s"] Theme for list divider
				 * @property {"normal"|"checkbox"|"dialogue"} [options.style="normal"] Option sets the style of the list divider
				 * @property {boolean} [options.folded=false] Decide to show divider press effect or not
				 * @property {boolean} [options.line=true] Decide to draw divider line or not
				 * @member ns.widget.mobile.ListDivider
				 */

				this.options = options;
				options.theme = "s";
				options.style = "normal";
				options.folded = false;
				options.line = true;
			};

			/**
			 * Build widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.ListDivider
			 * @protected
			 */
			ListDivider.prototype._build = function (element) {
				var options = this.options,
					classes = ListDivider.classes,
					classList = element.classList,
					elementWithLine;

				classList.add(classes.uiBarThemePrefix + options.theme);
				classList.add(classes.uiLiDivider);
				element.setAttribute("role", "heading");
				element.setAttribute("tabindex", "0");
				//@todo check if ol tag and reset counter

				if (!options.style || options.style === "normal" || options.style === "check") {
					dom.wrapInHTML(
						element.childNodes,
						"<span class='ui-divider-text'></span>"
					);

					if (options.folded === true) {
						dom.wrapInHTML(
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

			// definition
			ns.widget.mobile.ListDivider = ListDivider;
			engine.defineWidget(
				"ListDivider",
				"[data-role='list-divider'], .ui-list-divider",
				[],
				ListDivider,
				"tizen"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.ListDivider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
