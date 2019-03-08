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
 * #SelectMenu Alias for DropdownMenu Widget
 *
 * @class ns.widget.mobile.SelectMenu
 * @author Hagun Kim <hagun.kim@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../profile/mobile/widget/mobile/DropdownMenu"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var SelectMenu = ns.widget.mobile.DropdownMenu,
				engine = ns.engine;

			ns.widget.mobile.SelectMenu = SelectMenu;
			engine.defineWidget(
				"SelectMenu",
				"",
				["open", "close"],
				SelectMenu,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.SelectMenu;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
