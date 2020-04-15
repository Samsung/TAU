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
 * #Indeterminate Bar Type
 * indeterminateBar type support for Progress widget.
 * @internal
 * @class ns.widget.core.progress.type.indeterminate
 * @extends ns.widget.core.progress.type.interface
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
					uiIndeterminatebar: "ui-indeterminate-bar",
					uiIndeterminatebarIndeterminate: "ui-indeterminate-bar-indeterminate"
				};

			function paintProgressStyle(progress) {
				var ui = progress._ui,
					options = progress.options,
					percentValue = (options.value * 100) / (options.max - options.min);

				ui.indeterminateBarElement.style.width = percentValue + "%";
			}

			type.indeterminatebar = utilsObject.merge({}, typeInterface, {
				build: function (progress, element) {
					var ui = {},
						indeterminateElement = element,
						indeterminateBarElement;

					indeterminateBarElement = document.createElement("div");

					indeterminateElement.classList.add(classes.uiIndeterminatebar);
					indeterminateBarElement.classList.add(classes.uiIndeterminatebarIndeterminate);

					indeterminateElement.appendChild(indeterminateBarElement);

					ui.indeterminateBarElement = indeterminateBarElement;

					progress._ui = ui;

					return indeterminateElement;
				},

				init: function (progress, element) {
					var ui = progress._ui,
						indeterminateElement = element;

					ui.indeterminateBarElement = ui.indeterminateBarElement || indeterminateElement.querySelector("." + classes.uiIndeterminatebarActivity);

					paintProgressStyle(progress);
				},

				refresh: function (progress) {
					paintProgressStyle(progress);
				},

				changeValue: function (progress) {
					paintProgressStyle(progress);
				}
			});

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
