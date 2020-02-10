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
/*global window, define, ns */
/**
 * #Button
 * Button component changes the default browser buttons to special buttons with additional features, such as icons, corners, and shadows.
 *
 * @example
 *    <button>Button element</button>
 *
 * @since 2.0
 * @class ns.widget.mobile.Button
 * @extends ns.widget.core.Button
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/widget/core/Button",
			"../widget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Button = ns.widget.core.Button;

			ns.widget.mobile.Button = Button;

			ns.engine.defineWidget(
				"Button",
				"button, [data-role='button'], .ui-btn, input[type='button']",
				[],
				Button,
				"mobile",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Button;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
