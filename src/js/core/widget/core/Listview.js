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
 * # Listview Widget
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
 *      @example template
 *         <ul class="ui-listview">
 *             <li><span>List Item</span></li>
 *         </ul>
 *
 * ### List with link items
 *
 * You can add a list widget with a link and press effect that allows the user to click each list item as follows:
 *
 *      @example tau-listview-with-link
 *         <ul class="ui-listview">
 *             <li>
 *                 <a href="#">List Item</a>
 *             </li>
 *         </ul>
 *
 * ## JavaScript API
 *
 * Listview widget hasn't JavaScript API.
 *
 * @class ns.widget.core.Listview
 * @component-selector .ui-listview
 * @components-constraint 'listitem'
 * @component-type container-component
 * @extends ns.widget.BaseWidget
 */
/**
 * Listview with gradient background
 * @style ui-colored-list
 * @member ns.widget.core.Listview
 * @mobile
 */
/**
 * Enable snap list style
 * @style ui-snap-listview
 * @member ns.widget.core.Listview
 * @wearable
 */
/**
 *
 * @style ui-snap-listview
 * @member ns.widget.core.Listview
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				Listview = function () {
				},
				classes = {
					LISTVIEW: "ui-listview",
					DETAILS: "ui-details"
				},
				prototype = new BaseWidget();

			Listview.classes = classes;

			/**
			 * build Listview
			 * @method _build
			 * @private
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.core.Listview
			 */
			prototype._build = function (element) {
				element.classList.add(classes.LISTVIEW);
				return element;
			};

			Listview.prototype = prototype;
			ns.widget.core.Listview = Listview;

			engine.defineWidget(
				"Listview",
				"[data-role='listview'], .ui-listview",
				[],
				Listview,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Listview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));

/**
 * # List Item
 *
 * You can add a basic list item as follows:
 *
 *      @example template
 *         <li><span>List Item</span></li>
 *
 *
 * @class ns.widget.core.ListItem
 * @component-selector .ui-listview li
 * @components-constraint 'text', 'image', 'checkbox', 'button', 'radio', 'toggleswitch', 'processing'
 * @component-type container-component
 * @extends ns.widget.BaseWidget
 */
/**
 *
 * @style ui-li-anchor
 * @member ns.widget.core.ListItem
 */
/**
 * Subtext for item
 * @style li-text-sub
 * @selector  > *
 * @member ns.widget.core.ListItem
 * @mobile
 */
/**
 * Subtext for item
 * @style ui-li-sub-text
 * @selector  > *
 * @member ns.widget.core.ListItem
 * @wearable
 */
/**
 * Item with button on the right
 * @style li-has-right-btn
 * @mobile
 * @member ns.widget.core.ListItem
 */
/**
 * Item with circular button on the right
 * @style li-has-right-circle-btn
 * @selector
 * @member ns.widget.core.ListItem
 * @mobile
 */
/**
 * Item with thumbnail on the left
 * @style li-has-thumb
 * @selector
 * @member ns.widget.core.ListItem
 * @mobile
 */
/**
 * Thumbnail inside item
 * @style li-thumb
 * @selector .li-has-thumb > *
 * @member ns.widget.core.ListItem
 * @mobile
 */
/**
 * Item with checkbox
 * @style li-has-checkbox
 * @member ns.widget.core.ListItem
 * @mobile
 */
/**
 * Item with radio button
 * @style li-has-radio
 * @selector
 * @member ns.widget.core.ListItem
 * @mobile
 */
/**
 * Item with progressbar
 * @style li-has-progress
 * @mobile
 * @member ns.widget.core.ListItem
 */
/**
 * Item with multiline
 * @style li-has-multiline
 * @mobile
 * @member ns.widget.core.ListItem
 */
/**
 * Second subtext for multiline item positioned under the first one
 * @style ui-text-sub2
 * @selector .li-has-multiline > *
 * @mobile
 * @member ns.widget.core.ListItem
 */
/**
 * Subtext for multiline item positioned on the right
 * @style ui-text-sub3
 * @selector .li-has-multiline > *
 * @member ns.widget.core.ListItem
 * @mobile
 */
/**
 * Item with 2 lines
 * @style li-has-2line
 * @wearable
 * @member ns.widget.core.ListItem
 */
/**
 * Item with 3 lines
 * @style li-has-3-lines
 * @mobile
 * @member ns.widget.core.ListItem
 */
/**
 *
 * @style li-icon-sub
 * @selector  .li-text-sub > *
 * @member ns.widget.core.ListItem
 * @mobile
 */
/**
 *
 * @style li-icon-sub
 * @selector .li-text-sub3 > *
 * @member ns.widget.core.ListItem
 * @mobile
 */
/**
 *
 * @style ui-li-static
 * @mobile
 * @member ns.widget.core.ListItem
 */
/**
 * Expandable item
 * @style ui-expandable
 * @mobile
 * @member ns.widget.core.ListItem
 */
/**
 * Divider item
 * @style ui-group-index
 * @mobile
 * @member ns.widget.core.ListItem
 */
/**
 * List divider
 * @style ui-listview-divider
 * @wearable
 * @member ns.widget.core.ListItem
 */
/**
 * Marquee item
 * @style ui-marquee
 * @wearable
 * @member ns.widget.core.ListItem
 */
/**
 * Marquee item with blurry effect
 * @style ui-marquee-gradient
 * @wearable
 * @member ns.widget.core.ListItem
 */
/**
 * Item with action icon
 * @style ui-li-has-action-icon
 * @wearable
 * @member ns.widget.core.ListItem
 */
/**
 * Text for action item
 * @style ui-action-text
 * @selector .ui-li-has-action-icon > *
 * @wearable
 * @member ns.widget.core.ListItem
 */
/**
 * Setting icon for action item
 * @style ui-action-setting
 * @selector .ui-li-has-action-icon > *
 * @wearable
 * @member ns.widget.core.ListItem
 */
/**
 * Delete icon for action item
 * @style ui-action-delete
 * @selector .ui-li-has-action-icon > *
 * @wearable
 * @member ns.widget.core.ListItem
 */
/**
 * Adding icon for action item
 * @style ui-action-add
 * @selector .ui-li-has-action-icon > *
 * @wearable
 * @member ns.widget.core.ListItem
 */
