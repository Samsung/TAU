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
/*jslint nomen: true, white: true, plusplus: true*/
/**
 *#Virtual ListView Widget
 * Shows a list view for large amounts of data.
 *
 * In the Web environment, it is challenging to display a large amount of data in a list, such as
 * displaying a contact list of over 1000 list items. It takes time to display the entire list in
 * HTML and the DOM manipulation is complex.
 *
 * The virtual list widget is used to display a list of unlimited data elements on the screen
 * for better performance. This widget provides easy access to databases to retrieve and display data.
 * It based on **result set** which is fixed size defined by developer by data-row attribute. Result
 * set should be **at least 3 times bigger** then size of clip (number of visible elements).
 *
 * To add a virtual list widget to the application follow these steps:
 *
 * ##Create widget container - list element
 *
 *   &lt;ul id=&quot;vList&quot; class=&quot;ui-listview ui-virtuallistview&quot;&gt;&lt;/ul&gt;
 *
 *
 * ##Initialize widget
 *
 *    // Get HTML Element reference
 *    var elList = document.getElementById("vList"),
 *    // Set up config. All config options can be found in virtual list reference
 *    vListConfig = {
 *      dataLength: 2000,
 *      bufferSize: 40,
 *      listItemUpdater: function(elListItem, newIndex){
 *      // NOTE: JSON_DATA is global object with all data rows.
 *         var data = JSON_DATA["newIndex"];
 *             elListItem.innerHTML = '<span class="ui-li-text-main">' +
 *                       data.NAME + '</span>';
 *      }
 *    };
 *    vList = tau.widget.VirtualListview(elList, vListConfig);
 *
 * More config options can be found in {@link ns.widget.wearable.VirtualListview#options}
 *
 * ##Set list item update function
 *
 * List item update function is responsible to update list element depending on data row index. If you didn’t
 * pass list item update function by config option, you have to do it using following method.
 * Otherwise you will see an empty list.
 *
 *    vList.setListItemUpdater(function(elListItem, newIndex){
 *       // NOTE: JSON_DATA is global object with all data rows.
 *       var data = JSON_DATA["newIndex"];
 *           elListItem.innerHTML = '<span class="ui-li-text-main">' +
 *                  data.NAME + '</span>';
 *    });
 *
 * **Attention:** Virtual List manipulates DOM elements to be more efficient. It doesn’t remove or create list
 * elements before calling list item update function. It means that, you have to take care about list element
 * and keep it clean from custom classes an attributes, because order of li elements is volatile.
 *
 * ##Draw child elements
 * If all configuration options are set, call draw method to draw child elements and make virtual list work.
 *
 *    vList.draw();
 *
 * ##Destroy Virtual List
 * It’s highly recommended to destroy widgets, when they aren’t necessary. To destroy Virtual List call destroy
 * method.
 *
 *    vList.destroy();
 *
 * ##Full working code
 *
 *     var page = document.getElementById("pageTestVirtualList"),
 *         vList,
 *         // Assign data.
 *         JSON_DATA = [
 *           {NAME:"Abdelnaby, Alaa", ACTIVE:"1990 - 1994", FROM:"College - Duke", TEAM_LOGO:"../test/1_raw.jpg"},
 *           {NAME:"Abdul-Aziz, Zaid", ACTIVE:"1968 - 1977", FROM:"College - Iowa State", TEAM_LOGO:"../test/2_raw.jpg"}
 *           // A lot of records.
 *           // These database can be found in Gear Sample Application Winset included to Tizen SDK
 *         ];
 *
 *     page.addEventListener("pageshow", function() {
 *        var elList = document.getElementById("vList");
 *
 *        vList = tau.widget.VirtualListview(elList, {
 *           dataLength: JSON_DATA.length,
 *           bufferSize: 40
 *        });
 *
 *        // Set list item updater
 *        vList.setListItemUpdater(function(elListItem, newIndex) {
 *           //TODO: Update listItem here
 *           var data =  JSON_DATA[newIndex];
 *               elListItem.innerHTML = '<span class="ui-li-text-main">' +
 *                  data.NAME + '</span>';
 *        });
 *        // Draw child elements
 *        vList.draw();
 *     });
 *     page.addEventListener("pagehide", function() {
 *          // Remove all children in the vList
 *          vList.destroy();
 *        });
 *
 * @class ns.widget.wearable.VirtualListview
 * @since 2.2
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/widget/core/VirtualListview",
			"../wearable" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var VirtualListview = ns.widget.core.VirtualListview;

			VirtualListview.prototype = new VirtualListview();
			ns.widget.wearable.VirtualListview = VirtualListview;

			ns.engine.defineWidget(
				"VirtualListview",
				"",
				["draw", "setListItemUpdater", "scrollTo", "scrollToIndex"],
				VirtualListview,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return VirtualListview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
