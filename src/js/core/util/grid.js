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
/**
 * #Grid Utility
 * Object helps creating grids.
 * @class ns.util.grid
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util", // fetch namespace
			"./selectors"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Local alias for ns.util.selectors
			 * @property {Object} selectors Alias for {@link ns.util.selectors}
			 * @member ns.util.grid
			 * @static
			 * @private
			 */
			var selectors = ns.util.selectors,
				/**
				 * Alias to Array.slice method
				 * @method slice
				 * @member ns.util.grid
				 * @private
				 * @static
				 */
				slice = [].slice,
				/**
				 * grid types
				 * @property {Array} gridTypes
				 * @member ns.util.grid
				 * @static
				 * @private
				 */
				gridTypes = [
					null,
					"solo", //1
					"a",	//2
					"b",	//3
					"c",	//4
					"d"	//5
				];

			/**
			 * Add classes on the matched elements
			 * @method setClassOnMatches
			 * @param {HTMLElementCollection} elements
			 * @param {string} selector
			 * @param {string} className
			 * @private
			 * @member ns.util.grid
			 * @static
			 */
			function setClassOnMatches(elements, selector, className) {
				elements.forEach(function (item) {
					if (selectors.matchesSelector(item, selector)) {
						item.classList.add(className);
					}
				});
			}

			ns.util.grid = {
				/**
				 * make css grid
				 * @method makeGrid
				 * @param {HTMLElement} element
				 * @param {?string} [gridType="a"]
				 * @static
				 * @member ns.util.grid
				 */
				makeGrid: function (element, gridType) {
					var gridClassList = element.classList,
						kids = slice.call(element.children),
						iterator;

					if (!gridType) {
						gridType = gridTypes[kids.length];
						if (!gridType) {
							//if gridType is not defined in gritTypes
							//make it grid type "a""
							gridType = "a";
							iterator = 2;
							gridClassList.add("ui-grid-duo");
						}
					}
					if (!iterator) {
						//jquery grid doesn't care if someone gives non-existing gridType
						iterator = gridTypes.indexOf(gridType);
					}

					gridClassList.add("ui-grid-" + gridType);

					setClassOnMatches(kids, ":nth-child(" + iterator + "n+1)", "ui-block-a");

					if (iterator > 1) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+2)", "ui-block-b");
					}
					if (iterator > 2) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+3)", "ui-block-c");
					}
					if (iterator > 3) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+4)", "ui-block-d");
					}
					if (iterator > 4) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+5)", "ui-block-e");
					}
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.grid;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
