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
 * #Mobile UI Components
 *
 * The Web UI Framework (called as **TAU**; Tizen Advanced UI framework) provides rich Tizen components that are optimized for the Tizen Web browser.
 *
 * ##UI components list
 *
 * The following table displays the components provided by the Tizen mobile Web UI Framework.
 *
 * @class ns.widget.mobile
 * @seeMore https://developer.tizen.org/dev-guide/2.2.1/org.tizen.web.uiwidget.apireference/html/web_ui_framework.htm "Web UI Framework Reference"
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../core/widget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.widget.mobile = ns.widget.mobile || {};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
