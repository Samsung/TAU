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
 * #Virtual List Widget
 * Widget creates special list which can contain big number of items.
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
 * For now Virtual Lists are based on the **jQuery.template plugin** as described in the jQuery documentation
 * for jQuery.template plugin - but it will change some day...
 *
 * ##Default selectors
 * In _ul_ elements with _data-role=virtuallistview_ or _data-role=virtuallist_.
 *
 * ##Make it work
 * To active and configure virtual list widget with application follow these steps:
 *
 * ####1. Create template and place widget element
 *
 *    @example
 *    <script id="tmp-3-2-7" type="text/x-jquery-tmpl">
 *            <li class="ui-li-3-2-7">
 *            <span class="ui-li-text-main">${NAME}</span>
 *                <img src="00_winset_icon_favorite_on.png" class="ui-li-icon-sub"/>
 *                <span class="ui-li-text-sub">${ACTIVE}</span>
 *                <span class="ui-li-text-sub2">${FROM}</span>
 *            </li>
 *        </script>
 *        <ul id="vList" data-role="virtuallistview" data-template="tmp-3-2-7" data-row="100"></ul>
 *
 * **NOTE:** Tizen Web UI's data-dbtable attribute and functionality is not supported.
 *
 * ####2. Create template and place widget element
 * Run {@link ns.widget.mobile.VirtualListview#create .create} method to configure iteration function and
 * declare total number of items.
 *
 *    @example
 *    virtuallistview.create({
 *		//Configure iteration function
 *		itemData: function ( idx ) {
 *			return myDATA[idx];
 *		},
 *		//Declare total number of items
 *		numItemData: myDATA.length
 *	});
 *
 * ##Manual constructor
 * To construct VirtualListview widget manually you can use constructor of the widget:
 *
 *    @example
 *    var virtuallistview = ns.engine.instanceWidget(document.getElementById('virtuallistview'), 'VirtualListview');
 *
 * If jQuery library is loaded, its method can be used:
 *
 *    @example
 *    var virtuallistview = $('#virtuallistview').virtuallistview();
 *
 * **NOTE:** after construct of widget should be create method called with proper parameters.
 *
 *
 * @author Michał Szepielak <m.szepielak@samsung.com>
 * @author Mateusz Ciepliński <m.cieplinski@samsung.com> [add jQuery template functionality]
 * @author Piotr Karny <p.karny@samsung.com>
 * @class ns.widget.mobile.VirtualListview
 * @extends ns.widget.mobile.Listview
 */

(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/selectors",
			"../../../core/util/DOM",
			"../../../core/event",
			"../widget", // fetch namespace
			"./Scrollview",
			"./Listview",
			"../../../core/widget/core/VirtualListview"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var VirtualListview = ns.widget.core.VirtualListview,
				engine = ns.engine,
				utils = ns.util,
				utilsSelectors = utils.selectors,
				nsData = utils.DOM.nsData,
				prototype = new VirtualListview(),
				//
				// CORE METHODS
				//
				parentInit = prototype._init,
				parentRefresh = prototype._refresh,
				parentUpdateListItem = prototype._updateListItem;

			/**
			 * Initialize widget on an element.
			 * @method _init
			 * @param {HTMLElement} element Widget's element
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._init = function (element) {
				var self = this;

				engine.instanceWidget(element, "Listview");

				if (nsData(element, "row") !== null) {
					ns.warn("Row option in VirtualListview is deprecated and not supported. Use bufferSize option instead.");
				}

				if (nsData(element, "template") !== null) {
					ns.warn("Template option in VirtualListview is deprecated and not supported.");
				}

				if (nsData(element, "numItemData") !== null) {
					ns.warn("NumItemData option in VirtualListview is deprecated and not supported. Use dataLength option instead.");
				}

				if (typeof self.options.listItemUpdater !== "function") {
					ns.warn(["ListItemUpdater in VirtualListview is not set.",
						"Probably you use selector for automatic creation of this widget.",
						"Selectors for this widget are deprecated and will be removed in future.",
						"Use setListItemUpdater to set list item updater."].join(" "));
				}

				self._ui.listview = engine.instanceWidget(element, "Listview");
				parentInit.call(self, element);
			};

			prototype._refresh = function () {
				this._ui.listview.refresh();
				parentRefresh.call(this);
			};

			prototype._setupScrollview = function (element) {
				var scrollview;

				// @TODO: get class value from static access to class
				scrollview = engine.getBinding(utilsSelectors.getClosestByClass(element, "ui-scrollview-clip"));
				return scrollview.element;
			};

			/**
			 * @method _updateListItem
			 * Updates list item using user defined listItemUpdater function.
			 * @param {HTMLElement} element List element to update
			 * @param {number} index Data row index
			 * @protected
			 */
			prototype._updateListItem = function (element, index) {
				var self = this;

				if (typeof self.options.listItemUpdater === "function") {
					parentUpdateListItem.call(self, element, index);
				} else {
					ns.warn("List item updater must be a function. Using jQuery Template in VirtualListview is deprecated and is not supported");
				}
			};

			/**
			 * Sets iterator function and total number of data based on users arguments.
			 * @method create
			 * @protected
			 * @member ns.widget.mobile.VirtualListview
			 */
			prototype.create = function () {
				ns.warn("VirtualListview.create() method is deprecated and no more supported. Use draw() method instead.");
			};

			VirtualListview.prototype = prototype;

			ns.widget.mobile.VirtualListview = VirtualListview;
			ns.engine.defineWidget(
				"VirtualListview",
				"[data-role='virtuallistview'],[data-role='virtuallist'], .ui-virtuallistview",
				["draw", "setListItemUpdater", "scrollTo", "scrollToIndex", "create"],
				VirtualListview,
				"tizen"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.VirtualListview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));

