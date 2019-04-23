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
/*global window, ns, define, ns */
/**
 * # Listview
 * Shows a list view.
 *
 * The list widget is used to display, for example, navigation data, results, and data entries. The following table describes the supported list classes.
 *
 * ## Default selectors
 *
 * Default selector for listview widget is class *ui-listview*.
 *
 * To add a list widget to the application, use the following code:
 *
 * ### List with basic items
 *
 * You can add a basic list widget as follows:
 *
 *      @example
 *         <ul class="ui-listview">
 *             <li>1line</li>
 *             <li>2line</li>
 *             <li>3line</li>
 *             <li>4line</li>
 *             <li>5line</li>
 *         </ul>
 *
 * ### List with link items
 *
 * You can add a list widget with a link and press effect that allows the user to click each list item as follows:
 *
 *      @example
 *         <ul class="ui-listview">
 *             <li>
 *                 <a href="#">1line</a>
 *             </li>
 *             <li>
 *                 <a href="#">2line</a>
 *             </li>
 *             <li>
 *                 <a href="#">3line</a>
 *             </li>
 *             <li>
 *                 <a href="#">4line</a>
 *             </li>
 *             <li>
 *                 <a href="#">5line</a>
 *             </li>
 *         </ul>
 *
 * ## JavaScript API
 *
 * Listview widget hasn't JavaScript API.
 *
 * @class ns.widget.wearable.Listview
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../wearable",
			"../../../../core/widget/core/Listview",
			"./ArcListview",
			"../../../../core/support/tizen"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreListview = ns.widget.core.Listview,
				ArcListview = ns.widget.wearable.ArcListview,
				engine = ns.engine,
				_isCircle = ns.support.shape.circle,
				ParentClass = _isCircle ? ArcListview : CoreListview,
				Listview = function () {
					ParentClass.call(this);
				},
				prototype = new ParentClass();

			/**
			 * Dictionary for listview related events.
			 * For listview, it is an empty object.
			 * @property {Object} events
			 * @member ns.widget.wearable.Listview
			 * @static
			 */
			Listview.events = ParentClass.events;

			Listview.prototype = prototype;

			ns.widget.wearable.Listview = Listview;

			engine.defineWidget(
				"Listview",
				".ui-listview:not(.ui-arc-listview-carousel-item)",
				[],
				Listview,
				"wearable",
				true,
				false,
				null,
				{
					requireMatchSelector: true
				}
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Listview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
