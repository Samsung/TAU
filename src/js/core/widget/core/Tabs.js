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
/**
 *
 * #Tabs
 * Tabs component shows an unordered list of buttons on the screen wrapped together in a single group.
 *
 * The Tabs component is a controller component for operate closely with mainTab and sectionChanger.
 * So this component should be used with mainTab and sectionChanger.
 *
 * ##Default selectors
 * By default, all elements with the class="ui-tabs" or data-role="tabs" attribute are displayed as a tabs components.
 *
 * ##HTML Examples
 *
 *      @example
 *      <div id="tabs" class="ui-tabs">
 *          <div class="ui-main-tab">
 *              <ul>
 *                  <li><a href="#" class="ui-btn-active">Tab1</a></li>
 *                  <li><a href="#">Tab2</a></li>
 *                  <li><a href="#">Tab3</a></li>
 *              </ul>
 *          </div>
 *          <div class="ui-section-changer">
 *              <div>
 *                  <section class="ui-section-active">
 *                      <ul class="ui-listview">
 *                          <li class="ui-li-static">
 *                              Section 1
 *                          </li>
 *                      </ul>
 *                  </section>
 *                  <section class="ui-section-active">
 *                      <ul class="ui-listview">
 *                          <li class="ui-li-static">
 *                              Section 2
 *                          </li>
 *                      </ul>
 *                  </section>
 *                  <section class="ui-section-active">
 *                      <ul class="ui-listview">
 *                          <li class="ui-li-static">
 *                              Section 3
 *                          </li>
 *                      </ul>
 *                  </section>
 *              </div>
 *          </div>
 *      </div>
 *
 * ##Manual constructor
 * For manual creation of tabs widget you can use constructor of widget
 *
 *      @example
 *      <script>
 *          var tabsElement = document.getElementById("tabs"),
 *                tabs;
 *          tabs = tau.widget.Tabs(tabsElement);
 *      </script>
 *
 * @since 2.4
 * @class ns.widget.core.Tabs
 * @component-selector .ui-tabs, [data-role]="tabs"
 * @extends ns.widget.core.BaseWidget
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../util/selectors",
			"../../event",
			"../../engine",
			"../BaseWidget",
			"./Page"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				selectors = ns.util.selectors,
				Page = ns.widget.core.Page,
				events = ns.event,
				Tabs = function () {
					var self = this;

					self._ui = {};
					self._component = {};
					self.options = {
						changeDuration: 200
					};
				},
				classes = {
					/**
					 * Standard tabs widget
					 * @style ui-tabs-with-title
					 * @member ns.widget.core.Tabs
					 */
					TABS: "ui-tabs",
					/**
					* Set tabs component with title
					* @style ui-tabs-with-title
					* @member ns.widget.core.Tabs
					*/
					WITH_TITLE: "ui-tabs-with-title",
					TITLE: "ui-title",
					PAGE: Page.classes.uiPage
				},
				prototype = new BaseWidget();

			Tabs.prototype = prototype;
			Tabs.classes = classes;

			/**
			 * bind Tabs component necessary events
			 * @method bindTabsEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Tabs
			 * @private
			 * @static
			 */
			function bindTabsEvents(element) {
				var self = this;

				events.on(element, "sectionchange", self, false);
				events.on(self._ui.page, "tabchange", self, true);
				window.addEventListener("resize", self, false);
			}

			/**
			 * unbind Tabs component necessary events
			 * @method unBindTabsEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Tabs
			 * @private
			 * @static
			 */
			function unBindTabsEvents(element) {
				var self = this;

				events.off(element, "sectionchange", self, false);
				events.off(self._ui.page, "tabchange", self, true);
				window.removeEventListener("resize", self, false);
			}

			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.Tabs
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "tabchange":
						self._onTabChange(event);
						break;
					case "sectionchange":
						self._onSectionChange(event);
						break;
					case "resize":
						self._refresh();
						break;
				}
			};

			/**
			 * Build the Tabs component
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Tabs
			 */
			prototype._build = function (element) {

				element.classList.add(classes.TABS);
				if (element.getElementsByClassName(classes.TITLE).length) {
					element.classList.add(classes.WITH_TITLE);
				}
				return element;
			};

			/**
			 * Init the Tabs component
			 * @method _init
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Tabs
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self._ui;

				ui.page = selectors.getClosestByClass(element, classes.PAGE);
				ui.mainTab = ui.page.querySelector("[data-role='main-tab'], .ui-main-tab");
				ui.title = element.getElementsByClassName(classes.TITLE)[0];
				ui.sectionChanger = element.querySelector("[data-role='section-changer'], .ui-section-changer");
				self._component.mainTab = ns.widget.MainTab(ui.mainTab);
				self._changed = false;
				self._lastIndex = 0;
				self._initSectionChanger();
				return element;
			};

			/**
			 * Pageshow event handler
			 * @method _onPageBeforeShow
			 * @protected
			 * @member ns.widget.core.Tabs
			 */
			prototype._initSectionChanger = function () {
				var self = this,
					ui = self._ui,
					sectionChanger = ui.sectionChanger,
					sectionChangerStyle,
					title = ui.title;

				if (sectionChanger) {
					sectionChangerStyle = sectionChanger.style;
					sectionChangerStyle.width = window.innerWidth + "px";
					sectionChangerStyle.height = (self.element.offsetHeight -
						(title ? title.offsetHeight : 0)) + "px";
					self._component.sectionChanger = engine.instanceWidget(sectionChanger, "SectionChanger");
				}

			};

			/**
			 * Tabchange event handler
			 * @method _onTabChange
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Tabs
			 */
			prototype._onTabChange = function (event) {
				var self = this,
					index = event.detail.active,
					sectionChanger = self._component.sectionChanger;

				if (self._changed) {
					self._changed = false;
				} else if (self._lastIndex !== index) {
					self._changed = true;
					sectionChanger.setActiveSection(index, self.options.changeDuration);
				}
				self._lastIndex = index;
			};

			/**
			 * Sectionchange event handler
			 * @method _onSectionChange
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Tabs
			 */
			prototype._onSectionChange = function (event) {
				var self = this,
					index = event.detail.active,
					mainTab = self._component.mainTab;

				if (self._changed) {
					self._changed = false;
				} else if (self._lastIndex !== index) {
					self._changed = true;
					mainTab.setActive(index);
				}
				self._lastIndex = index;
			};

			/**
			 * bind event to the Tabs component
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.Tabs
			 */
			prototype._bindEvents = function () {
				var self = this;

				bindTabsEvents.call(self, self.element);
			};

			/**
			 * destroy the Tabs component
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.Tabs
			 */
			prototype._destroy = function () {
				var self = this;

				unBindTabsEvents.call(self, self.element);
				self._ui = null;
				self._component = null;
			};

			/**
			 * Refresh Tabs component
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Tabs
			 */
			prototype._refresh = function () {
				this._initSectionChanger();
			};
			/**
			 * Set the active tab
			 * @method _setIndex
			 * @protected
			 * @param {number} index
			 * @member ns.widget.core.Tabs
			 */
			prototype._setIndex = function (index) {
				var self = this,
					length = self._ui.sectionChanger.getElementsByTagName("section").length;

				if (index < length && !(index < 0)) {
					self._component.mainTab.setActive(index);
				} else {
					ns.warn("You inserted the wrong index value");
				}

			};

			/**
			 * Set the active tab
			 * @method setIndex
			 * @public
			 * @param {number} index
			 * @member ns.widget.core.Tabs
			 */
			prototype.setIndex = function (index) {
				this._setIndex(index);
			};

			/**
			 * Get the active tab
			 * @method _getIndex
			 * @protected
			 * @return {number} index
			 * @member ns.widget.core.Tabs
			 */
			prototype._getIndex = function () {
				return this._lastIndex;
			};

			/**
			 * Get the active tab
			 * @method getIndex
			 * @public
			 * @return {number} index
			 * @member ns.widget.core.Tabs
			 */
			prototype.getIndex = function () {
				return this._getIndex();
			};
			ns.widget.core.Tabs = Tabs;
			engine.defineWidget(
				"Tabs",
				"[data-role='tabs'], .ui-tabs",
				[
					"setIndex", "getIndex"
				],
				Tabs,
				"core"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Tabs;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
