/*global define, ns */
/*
 * Copyright (c) 2020 Samsung Electronics Co., Ltd
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
 * #indeterminateCircle Type
 * indeterminateCircle type support for Progress widget.
 * @internal
 * @class ns.widget.core.progress.type.indeterminatecircle
 * @extends ns.widget.core.progress.type.interface
 * @author Kornelia Kobiela	<k.kobiela@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../type",
			"./interface",
			"../Progress",
			"../../../../../core/util/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.util.object,
				type = ns.widget.core.progress.type,
				typeInterface = type.interface,
				classes = {
					uiIndeterminateCircle: "ui-indeterminate-circle",
					uiIndeterminateCircleSmallTitle: "ui-indeterminate-circle-small-title",
					uiIndeterminateCircleSmall: "ui-indeterminate-circle-small",
					uiIndeterminateCircleMedium: "ui-indeterminate-circle-medium",
					uiIndeterminateCircleLarge: "ui-indeterminate-circle-large"
				};

			function resetIndeterminateCircleClasses(element, optionSize) {
				if (!element.classList.contains(classes.uiIndeterminateCircle)) {
					element.classList.add(classes.uiIndeterminateCircle);
				}

				element.classList.remove(classes.uiIndeterminateCircleSmallTitle);
				element.classList.remove(classes.uiIndeterminateCircleSmall);
				element.classList.remove(classes.uiIndeterminateCircleMedium);
				element.classList.remove(classes.uiIndeterminateCircleLarge);

				switch (optionSize) {
					case "small-title":
						element.classList.add(classes.uiIndeterminateCircleSmallTitle);
						break;
					case "small":
						element.classList.add(classes.uiIndeterminateCircleSmall);
						break;
					case "medium":
						element.classList.add(classes.uiIndeterminateCircleMedium);
						break;
					case "large":
						element.classList.add(classes.uiIndeterminateCircleLarge);
						break;
					default:
						element.classList.add(classes.uiIndeterminateCircleMedium);
				}
			}

			type.indeterminatecircle = utilsObject.merge({}, typeInterface, {
				build: function () {
				},
				init: function (progress, element) {
					var options = progress.options,
						indeterminateCircleSize = options.size;


					resetIndeterminateCircleClasses(element, indeterminateCircleSize);
				},
				refresh: function (progress) {
					var element = progress.element,
						indeterminateCircleSize = progress.options.size;

					resetIndeterminateCircleClasses(element, indeterminateCircleSize);

				}
			});

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
