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
 * #Autodividers extension for ListView Widget
 * The Autodividers widget extension automatically creates dividers for a ListView Widget.
 *
 * ## Default selectors
 * A list can be configured to automatically generate dividers for its items. This is done by adding the **data-autodividers="true"** attribute to the ListView element. This is similar to jQueryMobile version 1.2.0.
 *
 * ###HTML Examples
 *
 * To add an autodividers widget to the application, use the following code:
 *
 *      @example
 *      <ul data-role="listview" data-autodividers="true" id="listview-with-autodividers">
 *          <li><a href="#">Amy</a></li>
 *          <li><a href="#">Arabella</a></li>
 *          <li><a href="#">Barry</a></li>
 *      </ul>
 *
 * Autodividers is not independent widget, this is extension for [ListView widget](ns_widget_mobile_Listview.htm).
 *
 * ##Methods
 *
 * Listview with autodividers has interface to call methods the same as ListView widget. To call method use:
 *
 *      @example
 *      $("#listview-with-autodividers").listview("methodName", methodArgument1, methodArgument2, ...);
 *
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @class ns.widget.mobile.Listview.Autodividers
 * @since Tizen 2.0
 * @override ns.widget.mobile.Listview
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/selectors",
			"../../../core/util/DOM/attributes",
			"../../../profile/mobile/widget/mobile",
			"../../../profile/mobile/widget/mobile/Listview",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd('tauBuildExclude');
			/**
			 * Local alias for ns.util.selectors
			 * @property {Object} selectors Alias for {@link ns.util.selectors}
			 * @member ns.widget.mobile.Listview.Autodividers
			 * @static
			 * @private
			 */
			var selectors = ns.util.selectors,

				/**
				 * Local alias for ns.engine
				 * @property {Object} engine Alias for {@link ns.engine}
				 * @member ns.widget.mobile.Listview.Autodividers
				 * @static
				 * @private
				 */
				engine = ns.engine,

				/**
				 * Local alias for ns.util.DOM
				 * @property {Object} doms Alias for {@link ns.util.DOM}
				 * @member ns.widget.mobile.Listview.Autodividers
				 * @static
				 * @private
				 */
				doms = ns.util.DOM,

				/**
				 * Object contains handlers for listeners of "beforeRefreshListItems" event,
				 * Keys are [instance].id
				 * @property {Object} onBeforeRefreshListItems description
				 * @member ns.widget.mobile.Listview.Autodividers
				 * @static
				 * @private
				 */
				beforeRefreshListItemsHandlers = {},

				/**
				 * Handler method for event "beforerefreshitems"
				 * @method beforeRefreshListItems
				 * @member ns.widget.mobile.Listview.Autodividers
				 * @param {ns.widget.mobile.Listview} listview instance of Listview.
				 * @param {HTMLUListElement|HTMLOListElement} element bound UList or OList HTMLElement
				 * @static
				 * @private
				 */
				beforeRefreshListItems = function (listview, element) {
					if (listview.options.autodividers) {
						listview._addAutodividers(element);
					}
				},

				/**
				 * Method finding text in list element and return first letter
				 * @method findFirstLetter
				 * @member ns.widget.mobile.Listview.Autodividers
				 * @param {HTMLUListElement|HTMLOListElement} listElement bound UList or OList HTMLElement
				 * @return {null|string} return "null" if doesn't text found
				 * @static
				 * @private
				 */
				findFirstLetter = function (listElement) {
					// look for the text in the given element
					var text = listElement.textContent || null;

					if (!text) {
						return null;
					}
					// create the text for the divider (first uppercase letter)
					text = text.trim().slice(0, 1).toUpperCase();
					return text;
				},

				/**
				 * Method removes list dividers from list.
				 * @method removeDividers
				 * @param {HTMLUListElement|HTMLOListElement} list bound UList or OList HTMLElement
				 * @member ns.widget.mobile.Listview.Autodividers
				 * @static
				 * @private
				 */
				removeDividers = function (list) {
					var liCollection = selectors.getChildrenBySelector(list, "li[data-role='list-divider']"),
						i,
						len = liCollection.length;

					for (i = 0; i < len; i++) {
						list.removeChild(liCollection[i]);
					}
				},

				/**
				 * Insert list dividers into list.
				 * @method insertAutodividers
				 * @param {ns.widget.mobile.Listview} self
				 * @param {HTMLUListElement|HTMLOListElement} list bound UList or OList HTMLElement
				 * @member ns.widget.mobile.Listview.Autodividers
				 * @static
				 * @private
				 */
				insertAutodividers = function (self, list) {
					/*
					 * @property {NodeList} liCollection collection of HTMLLIElements
					 */
					var liCollection = selectors.getChildrenByTag(list, "li"),
						/*
						 * @property {HTMLLIElement} li HTMLLIElement
						 */
						li,
						/*
						 * @property {string|null} lastDividerText Text in last divider for comparison
						 */
						lastDividerText = null,
						/*
						 * @property {string|null} dividerText Text found in LI element
						 */
						dividerText,
						/*
						 * @property {ns.widget.listdivider} divider Instance of divider widget
						 */
						divider,
						/*
						 * @property {Number} i Counter of loop
						 */
						i,
						/*
						 * @property {Number} len Length of collection of HTMLLIElements
						 */
						len,
						optionFolded = doms.getNSData(list, "folded");

					for (i = 0, len = liCollection.length; i < len; i++) {
						li = liCollection[i];
						dividerText = self.options.autodividersSelector(li);
						if (dividerText && lastDividerText !== dividerText) {
							divider = document.createElement("li");
							divider.appendChild(document.createTextNode(dividerText));
							divider.setAttribute("data-role", "list-divider");
							li.parentNode.insertBefore(divider, li);
							engine.instanceWidget(divider, "ListDivider", {"folded": optionFolded});
						}
						lastDividerText = dividerText;
					}
				},

				/**
				 * Major method of autodividers extension.
				 * It removes old and inserts new dividers.
				 * @method replaceDividers
				 * @member ns.widget.mobile.Listview.Autodividers
				 * @param {ns.widget.mobile.Listview} self
				 * @param {HTMLUListElement|HTMLOListElement} list bound UList or OList HTMLElement.
				 * @static
				 * @private
				 */
				replaceDividers = function (self, list) {
					// remove dividers if exists;
					removeDividers(list);
					// insert new dividers;
					insertAutodividers(self, list);
				},

				/**
				 * @property {Function} Listview Alias for class ns.widget.mobile.Listview
				 * @member ns.widget.mobile.Listview.Autodividers
				 * @static
				 * @private
				 */
				Listview = ns.widget.mobile.Listview,

				/**
				 * Backup of _build methods for replacing it
				 * @method parentBuild
				 * @member ns.widget.mobile.Listview.Autodividers
				 * @private
				 */
				parentBuild = Listview.prototype._build,

				/**
				 * Backup of _configure methods for replacing it
				 * @method parentConfigure
				 * @member ns.widget.mobile.Listview.Autodividers
				 * @private
				 */
				parentConfigure = Listview.prototype._configure,

				/**
				 * Backup of _init methods for replacing it
				 * @method parentInit
				 * @member ns.widget.mobile.Listview.Autodividers
				 * @private
				 */
				parentInit = Listview.prototype._init,

				/**
				 * Backup of _destroy methods for replacing it
				 * @method parentDestroy
				 * @member ns.widget.mobile.Listview.Autodividers
				 * @private
				 */
				parentDestroy = Listview.prototype._destroy,

				/**
				 * Initializing autodividers on Listview instance
				 * @method initializeAutodividers
				 * @member ns.widget.mobile.Listview.Autodividers
				 * @param {ns.widget.mobile.Listview} self listview instance.
				 * @param {HTMLUListElement|HTMLOListElement} element bound UList or OList HTMLElement.
				 * @static
				 * @private
				 */
				initializeAutodividers = function (self, element) {
					var onBeforeRefreshListItems = beforeRefreshListItems.bind(null, self, element);

					beforeRefreshListItemsHandlers[self.id] = onBeforeRefreshListItems;
					/**
					 * Options object
					 * @property {Object} options
					 * @property {boolean} [options.autodividers=false] This option enables creating autodividers on ListView
					 * @member ns.widget.mobile.Listview.Autodividers
					 */
					self.options.autodividers = false;
					self._getCreateOptions(element);
					element.addEventListener("beforerefreshitems",
						onBeforeRefreshListItems);
				};

			/**
			 * Rebuilding html list element
			 * @method _addAutodividers
			 * @member ns.widget.mobile.Listview.Autodividers
			 * @param {HTMLUListElement|HTMLOListElement} list bound UList or OList HTMLElement.
			 * @protected
			 * @instance
			 */
			Listview.prototype._addAutodividers = function (list) {
				replaceDividers.call(null, this, list);
			};

			/**
			 * @method _setAutodividers
			 * @member ns.widget.mobile.Listview.Autodividers
			 * @param {HTMLUListElement|HTMLOListElement} element bound UList or OList HTMLElement.
			 * @param {boolean} enabled
			 * @return {boolean}
			 * @instance
			 * @protected
			 */
			Listview.prototype._setAutodividers = function (element, enabled) {
				var options = this.options;

				if (options.autodividers === enabled) {
					return false;
				}
				// If autodividers option is changing from "true" to "false"
				// we need remove older dividers;
				if (options.autodividers && !enabled) {
					removeDividers(element);
				}
				options.autodividers = enabled;
				element.setAttribute("data-autodividers", enabled);
				if (enabled) {
					this.refresh();
				}
				return true;
			};

			/**
			 * @method _configure
			 * @member ns.widget.mobile.Listview.Autodividers
			 * @instance
			 * @protected
			 */
			Listview.prototype._configure = function () {
				var options;

				if (typeof parentConfigure === "function") {
					parentConfigure.call(this);
				}

				this.options = this.options || {};
				options = this.options;
				/** @expose */
				options.autodividers = false;
				/** @expose */
				options.autodividersSelector = findFirstLetter;
			};

			/**
			 * Initialize autodividers features on Listview
			 * Override method "_build" from Listview & call the protected "_build"
			 * @method _build
			 * @member ns.widget.mobile.Listview.Autodividers
			 * @param {HTMLUListElement|HTMLOListElement} element bound UList or OList HTMLElement.
			 * @return {HTMLUListElement|HTMLOListElement}
			 * @instance
			 * @protected
			 */
			Listview.prototype._build = function (element) {
				initializeAutodividers(this, element);
				return parentBuild.call(this, element);
			};

			/**
			 * Initialize autodividers features on Listview
			 * Override method "_init" from Listview & call the protected "_init" or "init"
			 * @method _init
			 * @member ns.widget.mobile.Listview.Autodividers
			 * @param {HTMLUListElement|HTMLOListElement} element bound UList or OList HTMLElement.
			 * @return {HTMLUListElement|HTMLOListElement}
			 * @instance
			 * @protected
			 */

			Listview.prototype._init = function (element) {
				var autodividers = this.options.autodividers;

				if (autodividers === undefined || autodividers === null) {
					initializeAutodividers(this, element);
				}
				return (typeof parentInit === "function") ?
					parentInit.call(this, element) :
					element;
			};

			/**
			 * Removing and cleaning autodividers extension
			 * Override method "_destroy" from Listview & call the protected "_destroy"
			 * @method _destroy
			 * @member ns.widget.mobile.Listview.Autodividers
			 * @instance
			 * @protected
			 */
			Listview.prototype._destroy = function () {
				var element = this.element;

				element.removeEventListener("beforerefreshitems",
					beforeRefreshListItemsHandlers[this.id]);
				this.options.autodividers = null;
				// delete attribute
				element.removeAttribute("data-autodividers");
				// recovery previous version of protected methods;
				this._build = parentBuild;
				this._init = parentInit;
				this._destroy = parentDestroy;
				// call protected method from Listview;
				if (typeof parentDestroy === "function") {
					parentDestroy.call(this);
				}
			};
			//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
			return false;
		}
	);
	//>>excludeEnd('tauBuildExclude');
}(window.document, ns));
