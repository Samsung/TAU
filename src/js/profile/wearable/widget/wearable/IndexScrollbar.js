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
/*jslint nomen: true, plusplus: true */
/*
 * #Index scroll bar
 * Shows an index scroll bar with indices, usually for the list.
 *
 * @class ns.widget.wearable.IndexScrollbar
 * @component-selector .ui-indexscrollbar
 * @extends ns.widget.core.IndexScrollbar
 * @since 2.0
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/widget/core/indexscrollbar/IndexScrollbar",
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var engine = ns.engine,
				CoreIndexScrollbar = ns.widget.core.IndexScrollbar,
				prototype = new CoreIndexScrollbar(),
				IndexScrollbar = function () {
					CoreIndexScrollbar.call(this);
				};

			// definition
			IndexScrollbar.prototype = prototype;
			ns.widget.wearable.IndexScrollbar = IndexScrollbar;

			engine.defineWidget(
				"IndexScrollbar",
				".ui-indexscrollbar",
				[],
				IndexScrollbar,
				"wearable"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.wearable.IndexScrollbar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
