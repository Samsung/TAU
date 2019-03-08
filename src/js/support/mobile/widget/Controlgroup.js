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
 * #Control Group Widget
 * Controlgroup widget improves the styling of a group of buttons by grouping them to form a single block.
 *
 * ##Default selectors
 * In default all divs with _data-role=controlgroup_ are changed to Controlgroup widget.
 *
 * ##HTML Examples
 *
 * ### Create Controlgroup
 *
 *        @example
 *        <div data-role="controlgroup">
 *            <a href="#" data-role="button">Yes</a>
 *            <a href="#" data-role="button">No</a>
 *            <a href="#" data-role="button">Cancel</a>
 *        </div>
 *
 * @class ns.widget.mobile.Controlgroup
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/selectors",
			"../../../core/util/DOM/manipulation",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Alias for class ns.widget.mobile.Controlgroup
			 * @method Controlgroup
			 * @member ns.widget.mobile.Controlgroup
			 * @private
			 * @static
			 */
			var Controlgroup = function () {
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {"vertical"|"horizontal"} [options.type="vertical"] Direction of widget
					 * @property {boolean} [options.shadow=false] Shadow of Controlgroup
					 * @property {boolean} [options.excludeInvisible=false] Flag specifying exclusion of invisible elements
					 * @property {boolean} [options.mini=false] Size of Controlgroup
					 * @member ns.widget.mobile.Controlgroup
					 */
					this.options = {
						type: "vertical",
						shadow: false,
						excludeInvisible: false,
						mini: false
					};
				},
				/**
				 * @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
				 * @member ns.widget.mobile.Controlgroup
				 * @private
				 * @static
				 */
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * @property {Object} engine Alias for class ns.engine
				 * @member ns.widget.mobile.Controlgroup
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} dom Alias for class ns.util.DOM
				 * @member ns.widget.mobile.Controlgroup
				 * @private
				 * @static
				 */
				dom = ns.util.DOM,
				/**
				 * @property {Object} selectors Alias for class ns.util.selectors
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors,
				/**
				 * @property {Function} slice Alias for function Array.slice
				 * @private
				 * @static
				 */
				slice = [].slice;

			Controlgroup.prototype = new BaseWidget();

			/**
			 * Dictionary for Controlgroup related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.Controlgroup
			 * @static
			 */
			Controlgroup.classes = {
				cornerAll: "ui-btn-corner-all",
				cornerTop: "ui-corner-top",
				cornerBottom: "ui-corner-bottom",
				cornerLeft: "ui-corner-left",
				cornerRight: "ui-corner-right",
				controlGroupLast: "ui-controlgroup-last",
				shadow: "ui-shadow",
				mini: "ui-mini",
				controlGroup: "ui-controlgroup",
				typePrefix: "ui-controlgroup-",
				controlGroupLabel: "ui-controlgroup-label",
				controlGroupControls: "ui-controlgroup-controls",
				controlGroupCornerAll: "ui-corner-all"
			};

			/**
			 * Applies css styles to Controlgroup elements
			 * @method flipClasses
			 * @param {Array} elements Array of Controlgroup elements
			 * @param {Array} cornersClasses Array of css styles for first and last element
			 * @private
			 * @static
			 * @member ns.widget.mobile.Controlgroup
			 */
			function flipClasses(elements, cornersClasses) {
				var len = elements.length,
					lastElementClassList,
					classes = Controlgroup.classes;

				if (!len) {
					return;
				}

				elements.forEach(function (element) {
					var classList = element.classList;

					classList.remove(classes.cornerAll);
					classList.remove(classes.cornerTop);
					classList.remove(classes.cornerBottom);
					classList.remove(classes.cornerLeft);
					classList.remove(classes.cornerRight);
					classList.remove(classes.controlgroupLast);
					classList.remove(classes.shadow);
				});

				elements[0].classList.add(cornersClasses[0]);
				lastElementClassList = elements[len - 1].classList;
				lastElementClassList.add(cornersClasses[1]);
				lastElementClassList.add(classes.controlGroupLast);
			}

			/**
			 * Builds structure of Controlgroup widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Controlgroup
			 * @instance
			 */
			Controlgroup.prototype._build = function (element) {
				var classes = Controlgroup.classes,
					elementClassList = element.classList,
					options = this.options,
					groupLegend = selectors.getChildrenByTag(element, "legend"),
					groupHeading = selectors.getChildrenByClass(element, classes.controlGroupLabel),
					groupControls,
					cornersClasses,
					legend,
					content;

				/*
				 * if (groupControls.length) {
				 *   //@todo unwrap content
				 * }
				 */

				//Set options
				options.type = element.getAttribute("data-type") || options.type;

				dom.wrapInHTML(element.childNodes, "<div class='" + classes.controlGroupControls + "'></div>");
				groupControls = selectors.getChildrenByClass(element, classes.controlGroupControls)[0];


				if (groupLegend.length) {
					//existing label is replaced with stylable div
					legend = document.createElement("div");
					legend.classList.add(classes.controlGroupLabel);
					legend.innerHTML = groupLegend[0].innerHTML;
					dom.insertNodesBefore(element.childNodes[0], legend);
					groupLegend.forEach(function (item) {
						item.parentNode.removeChild(item);
					});
				} else if (groupHeading.length) {
					dom.insertNodesBefore(element.childNodes[0], groupHeading);
				}

				cornersClasses = options.type === "horizontal" ?
					[classes.cornerLeft, classes.cornerRight] : [classes.cornerTop, classes.cornerBottom];

				elementClassList.add(classes.controlGroupCornerAll);
				elementClassList.add(classes.controlGroup);
				elementClassList.add(classes.typePrefix + options.type);

				//Make all the control group elements the same width
				if (groupControls) {
					this._setWidthForButtons(groupControls);
				}

				content = slice.call(element.querySelectorAll(".ui-btn")).filter(function (item) {
					//@todo filter visiblity when excludeInvisible option is set
					return !item.classList.contains("ui-slider-handle");
				});

				if (options.shadow) {
					elementClassList.add(classes.shadow);
				}

				if (options.mini) {
					elementClassList.add(classes.mini);
				}

				flipClasses(content, cornersClasses);
				flipClasses(slice.call(element.querySelectorAll(".ui-btn-inner")), cornersClasses);

				return element;
			};

			Controlgroup.prototype._setWidthForButtons = function (groupControls) {
				var controlElements,
					controlElementsLength,
					widthSize,
					i;

				controlElements = selectors.getChildrenByTag(groupControls, "a");
				controlElementsLength = controlElements.length;
				widthSize = 100 / controlElementsLength;
				for (i = 0; i < controlElementsLength; i++) {
					engine.instanceWidget(controlElements[i], "Button");
					controlElements[i].style.width = widthSize + "%";
				}
			};

			// definition
			ns.widget.mobile.Controlgroup = Controlgroup;
			engine.defineWidget(
				"Controlgroup",
				"[data-role='controlgroup'], .ui-controlgroup",
				[],
				Controlgroup,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Controlgroup;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
