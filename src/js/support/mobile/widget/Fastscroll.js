/*global window, define, Object, ns */
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
 * # Fast Scroll Widget
 * The fast scroll widget shows a shortcut list that is bound to its parent scroll bar and respective list view.
 *
 * The fast scroll is a scroll view controller, which binds a scroll view to a list of shortcuts. It jumps the scroll view to the selected list divider. If you move the mouse on the shortcut column, the scroll view is moved to the list divider matching the text currently under the mouse cursor. A pop-up with the text currently under the cursor is also displayed. To use the fast scroll widget, add the data-fastscroll="true" attribute to a list view. You can also call the shortcutscroll() method on an element. The closest element of the ui-scrollview-clip class is used as the scroll view to be controlled.
 *
 * !!! For the fast scroll widget to be visible, the parent list view must have multiple list dividers.!!!
 *
 * ## Default selectors
 * In default all ListView elements with _data-fastscroll=true_ are changed to Tizen Web UI Fast Scroll.
 *
 * In default all ListView elements with class _.ui-fastscroll_ are changed to Tizen Web UI Fast Scroll
 *
 *        @example
 *        <div data-role="page" id="main">
 *            <div data-role="content">
 *                <ul data-role="listview" data-fastscroll="true">
 *                    <li data-role="list-divider">A</li>
 *                    <li>Anton</li>
 *                    <li>Arabella</li>
 *                    <li data-role="list-divider">B</li>
 *                    <li>Barry</li>
 *                    <li>Billy</li>
 *                </ul>
 *            </div>
 *        </div>
 *
 * #### Create FastScroll widget using tau method:
 *
 *        @example
 *        <div data-role="page" id="main">
 *            <div data-role="content">
 *                <ul id="list" data-fastscroll="true">
 *                    <li data-role="list-divider">A</li>
 *                    <li>Anton</li>
 *                    <li>Arabella</li>
 *                    <li data-role="list-divider">B</li>
 *                    <li>Barry</li>
 *                    <li>Billy</li>
 *                </ul>
 *            </div>
 *        </div>
 *        <script>
 *            var fastscroll = tau.widget.FastScroll(document.getElementById("list"));
 *        </script>
 *
 * #### Create FastScroll widget using jQueryMobile notation:
 *
 *        @example
 *        <div data-role="page" id="main">
 *            <div data-role="content">
 *                <ul id="list" data-fastscroll="true">
 *                    <li data-role="list-divider">A</li>
 *                    <li>Anton</li>
 *                    <li>Arabella</li>
 *                    <li data-role="list-divider">B</li>
 *                    <li>Barry</li>
 *                    <li>Billy</li>
 *                </ul>
 *            </div>
 *        </div>
 *        <script>
 *            var fastscroll = $("#list").fastscroll();
 *        </script>
 *
 * ## Options
 *
 * ### Fastscroll
 * _data-fastscroll_ option set to true, creates a fast scroll using the HTML unordered list (&lt;ul&gt;) element.
 *
 *        @example
 *        <div data-role="page" id="main">
 *            <div data-role="content">
 *                <ul id="contacts" data-role="listview" data-fastscroll="true">
 *                    <li data-role="list-divider">A</li>
 *                    <li>Anton</li>
 *                    <li>Arabella</li>
 *                    <li data-role="list-divider">B</li>
 *                    <li>Barry</li>
 *                    <li>Billy</li>
 *                </ul>
 *            </div>
 *        </div>
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *        @example
 *        <div data-role="page" id="main">
 *            <div data-role="content">
 *                <ul id="contacts">
 *                    <li data-role="list-divider">A</li>F
 *                    <li>Anton</li>
 *                    <li>Arabella</li>
 *                    <li data-role="list-divider">B</li>
 *                    <li>Barry</li>
 *                    <li>Billy</li>
 *                </ul>
 *            </div>
 *        </div>
 *        <script>
 *            var element = document.getElementById("contacts"),
 *                contacts = tau.widget.FastScroll(element, {fastscroll: true});
 *
 *            contacts.methodName(methodArgument1, methodArgument2, ...);
 *
 *            // or JQueryMobile notation:
 *            $(element).contacts("methodName", methodArgument1, methodArgument2, ...);
 *        </script>
 *
 * @class ns.widget.mobile.FastScroll
 * @since 2.0
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/event",
			"../../../core/util/selectors",
			"../../../core/widget/core/indexscrollbar/IndexScrollbar",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile",
			"../../../profile/mobile/widget/mobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var engine = ns.engine,
				events = ns.event,
				selectors = ns.util.selectors,
				NUMBER_REGEXP = /^[0-9]/,
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				classes = {},
				prototype = new BaseWidget(),
				/*
				 * Event is triggering after _destroy method call
				 * @event destroyed
				 * @member ns.widget.mobile.FastScroll
				 */
				eventType = {
					DESTROYED: "destroyed"
				},
				FastScroll = function () {
					this.eventHandlers = {};
					this._ui = {
						scrollView: null
					};
				};

			// the extension of Listview classes
			classes.uiFastscroll = "ui-fastscroll";
			classes.uiFastscrollTarget = "ui-fastscroll-target";
			classes.uiFastscrollPopup = "ui-fastscroll-popup";
			classes.uiScrollbar = "ui-scrollbar";
			classes.uiFastscrollHover = "ui-fastscroll-hover";
			classes.uiFastscrollHoverFirstItem = "ui-fastscroll-hover-first-item";
			classes.uiFastscrollHoverDown = "ui-fastscroll-hover-down";
			FastScroll.classes = classes;

			/**
			 * @param {string[]} index
			 * @deprecated
			 */
			prototype.indexString = function (index) {
				var self = this;

				ns.warn("Deprecated method: indexString use instead option('index', string)");
				self.indexScrollbar.option({
					"index": index,
					"indexHeight": Math.floor(self._ui.scrollView.clientHeight / index.length)
				});
			};

			/**
			 * Match char to divider
			 * @method matchToDivider
			 * @param {HTMLElement} divider
			 * @param {string} indexChar
			 * @param {Object} map
			 * @private
			 * @static
			 * @member ns.widget.mobile.FastScroll
			 */
			function matchToDivider(divider, indexChar, map) {
				if (indexChar === divider.textContent) {
					map[indexChar] = divider;
				}
			}

			/**
			 * Creates character set for divider
			 * @method makeCharacterSet
			 * @param {HTMLElement} divider
			 * @param {string} primaryCharacterSet
			 * @return {string}
			 * @private
			 * @static
			 * @member ns.widget.mobile.FastScroll
			 */
			function makeCharacterSet(divider, primaryCharacterSet) {
				var content = divider.textContent;

				return primaryCharacterSet + ((NUMBER_REGEXP.test(content)) ? "" : content);
			}

			/**
			 * Creates map of dividers
			 * @method _createDividerMap
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.FastScroll
			 */
			prototype._createDividerMap = function (element) {
				var self = this,
					primaryCharacterSet = "",
					numberSet = "0123456789",
					dividers,
					map = {},
					indexChar,
					i,
					j,
					length,
					dividersLength;

				element = element || self.element;
				dividers = element.querySelectorAll(
					ns.engine.getWidgetDefinition("ListDivider").selector
				);
				dividersLength = dividers.length;

				for (i = 0; i < dividersLength; i++) {
					if (numberSet.search(dividers[i].textContent) !== -1) {
						map["#"] = dividers[i];
						break;
					}
				}

				for (i = 0; i < dividersLength; i++) {
					primaryCharacterSet = makeCharacterSet(dividers[i], primaryCharacterSet);
				}

				for (i = 0, length = primaryCharacterSet.length; i < length; i++) {
					indexChar = primaryCharacterSet.charAt(i);
					for (j = 0; j < dividersLength; j++) {
						matchToDivider(dividers[j], indexChar, map);
					}
				}

				self._dividerMap = map;
				self._charSet = primaryCharacterSet;
			};

			prototype._build = function (element) {
				var self = this,
					indexElement = document.createElement("div"),
					page = selectors.getClosestByClass(element, "ui-page"),
					scrollView = selectors.getClosestByClass(element, "ui-scrollview-clip"),
					index;

				ns.warn("Deprecated widget 'FastScroll'. Please use instead 'IndexScrollbar'");

				indexElement.classList.add("ui-indexscrollbar");
				indexElement.style["height"] = scrollView.offsetHeight + "px";
				indexElement.style["top"] = scrollView.offsetTop + "px";
				// @deprecated
				indexElement.classList.add(classes.uiFastscroll);

				self._createDividerMap(element);

				page.appendChild(indexElement);
				index = Object.keys(self._dividerMap).join(",");
				self.indexScrollbar = engine.instanceWidget(
					indexElement,
					"IndexScrollbar", {
						"indexHeight": indexElement.clientHeight / index.length,
						"index": index,
						"delimiter": /[,:]/
					});
				return element;
			};

			prototype._init = function () {
				var self = this;

				self._ui.scrollView = selectors.getClosestByClass(self.element, "ui-scrollview-clip");
				self.scrollView = ns.engine.getBinding(self._ui.scrollView, "Scrollview");
			};

			function findFirstDividerByIndex(self, index) {
				return self._dividerMap[index];
			}

			function onSelectIndexScrollbar(self, ev) {
				var divider,
					element = self.element;

				divider = findFirstDividerByIndex(self, ev.detail.index);
				if (divider) {
					self.scrollView.scrollTo(0, divider.offsetTop - element.offsetTop);
				}
			}

			prototype._bindEvents = function () {
				var self = this;

				self.eventHandlers.onSelectIndexScrollbar =
					onSelectIndexScrollbar.bind(null, self);
				self.indexScrollbar.addEventListener(
					"select", self.eventHandlers.onSelectIndexScrollbar, false
				);
			};

			prototype._unbindEvents = function () {
				var self = this;

				self.indexScrollbar.removeEventListener(
					"select", self.eventHandlers.onSelectIndexScrollbar, false
				);
			};

			prototype._destroy = function () {
				var self = this,
					element = self.element;

				self.indexScrollbar.destroy();
				self.indexScrollbar.element.classList.remove(classes.uiFastscroll);

				self._unbindEvents();

				events.trigger(element, eventType.DESTROYED, {
					widget: "FastScroll",
					parent: element.parentNode
				});
			};

			// definition
			FastScroll.prototype = prototype;
			ns.widget.mobile.FastScroll = FastScroll;

			/**
			 * @deprecated;
			 */
			engine.defineWidget(
				"FastScroll",
				"ul[data-fastscroll='true']",
				["indexString"],
				FastScroll,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.FastScroll;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
