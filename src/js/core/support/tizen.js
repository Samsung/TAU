/*global window, ns, define*/
/*jslint bitwise: true */
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
 * @class ns.support
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var isTizen = !(typeof window.tizen === "undefined");

			function isCircleShape() {
				var testDivElement = document.createElement("div"),
					fakeBodyElement = document.createElement("body"),
					htmlElement = document.getElementsByTagName("html")[0],
					style = getComputedStyle(testDivElement),
					isCircle;

				testDivElement.classList.add("is-circle-test");
				fakeBodyElement.appendChild(testDivElement);
				htmlElement.insertBefore(fakeBodyElement, htmlElement.firstChild);
				isCircle = style.width === "1px";
				htmlElement.removeChild(fakeBodyElement);

				// to support circle in  browser by additional parameter in url
				/* istanbul ignore if */
				if (window.location.search === "?circle") {
					/* istanbul ignore next: we can't test this part because set location is not supported in
					 test environment */
					isCircle = true;
				}

				return isCircle;
			}

			ns.support = {
				cssTransitions: true,
				mediaquery: true,
				cssPseudoElement: true,
				touchOverflow: true,
				cssTransform3d: true,
				boxShadow: true,
				scrollTop: 0,
				dynamicBaseTag: true,
				cssPointerEvents: false,
				boundingRect: true,
				browser: {
					ie: false,
					tizen: isTizen
				},
				shape: {
					circle: isTizen ? window.matchMedia("(-tizen-geometric-shape: circle)").matches :
						isCircleShape()
				},
				gradeA: function () {
					return true;
				},
				isCircleShape: isCircleShape
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.support;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
