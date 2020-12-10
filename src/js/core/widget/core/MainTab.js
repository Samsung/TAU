/*global ns, define */
/*
 * Copyright (c) 2020 Samsung Electronics Co., Ltd
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
 * #Main Tab
 * Main Tab component is dedicated to control page change in app.
 * The component is positioned always on bottom of the screen.
 *
 * @class ns.widget.core.MainTab
 * @extends ns.widget.BaseWidget
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../event",
			"../../util/selectors",
			"../BaseWidget",
			"../core",
			"./Marquee"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				utilSelectors = ns.util.selectors,
				FILE_REGEXP = /[^\/]+$/,
				classes = {
					/**
					 * Standard widget
					 * @style ui-main-tab
					 * @member ns.widget.core.MainTab
					 */
					MAIN_TAB: "ui-main-tab",
					/**
					 * Set Main Tab widget as visible
					 * @style ui-main-tab-visible
					 * @member ns.widget.core.MainTab
					 */
					VISIBLE: "ui-main-tab-visible",
					/**
					 * Set Tab as active
					 * @style ui-tab-active
					 * @member ns.widget.core.MainTab
					 */
					ACTIVE_TAB: "ui-tab-active"
				},
				MainTab = function () {
					this._ui = {};
				},
				prototype = new BaseWidget();

			MainTab.classes = classes;
			MainTab.prototype = prototype;

			/**
			 * Build MainTab component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.MainTab
			 * @protected
			 */
			prototype._build = function (element) {
				element.classList.add(classes.MAIN_TAB);

				return element;
			};

			/**
			 * Init MainTab component
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.MainTab
			 * @protected
			 */
			prototype._init = function (element) {
				var self = this,
					pageContainer = null;

				self._ui.parentPage = utilSelectors.getClosestBySelector(element, ".ui-page");

				self._ui.links = [].slice.call(element.querySelectorAll("li > a"));
				self._ui.links.forEach(function (link) {
					var wrap = document.createElement("span"),
						linkElements = [],
						linkChild,
						content = link.textContent.trim();

					// detach and cache previous elements from link
					while (link.children.length > 0) {
						linkChild = link.children[0];
						linkElements.push(linkChild);
						link.removeChild(linkChild);
					}

					// wrap text content for marquee widget
					wrap.textContent = content;
					link.textContent = "";
					link.appendChild(wrap);

					// recovering previous cached elements of link
					linkElements.forEach(function (linkChild) {
						link.appendChild(linkChild);
					});

					ns.widget.Marquee(wrap, {
						iteration: 1,
						delay: 0,
						marqueeStyle: "endToEnd",
						autoRun: false
					});
					link.setAttribute("data-rel", "maintab");
				});

				element.classList.add(classes.VISIBLE);

				// change parent to pageContainer instead of page
				pageContainer = utilSelectors.getClosestBySelector(element, ".ui-page-container");
				pageContainer.appendChild(element);

				return element;
			};

			/**
			 * Handle events
			 * @param {Event} event
			 * @method handleEvent
			 * @protected
			 * @member ns.widget.core.MainTab
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "pagebeforeshow":
						self._onPageBeforeShow(event);
						break;
				}
			};

			/**
			 * Bind events for MainTab
			 * @method _bindEvents
			 * @member ns.widget.core.MainTab
			 * @protected
			 */
			prototype._bindEvents = function () {
				document.addEventListener("pagebeforeshow", this, true);
			};

			/**
			 * Unbind events for MainTab
			 * @method _bindEvents
			 * @member ns.widget.core.MainTab
			 * @protected
			 */
			prototype._unbindEvents = function () {
				document.removeEventListener("pagebeforeshow", this, true);
			};

			/**
			 * Handler for "pagebeforeshow" event on page
			 * which is parent to MainTab widget
			 * @param {Event} event
			 * @method _onPageBeforeShow
			 * @member ns.widget.core.MainTab
			 * @protected
			 */
			prototype._onPageBeforeShow = function (event) {
				var self = this,
					target = event.target,
					element = self.element,
					links = self._ui.links,
					router,
					activeLink,
					url,
					file;

				if (self._ui.parentPage === target) {
					// try to find active tab
					activeLink = links.filter(function (link) {
						return link.classList.contains(classes.ACTIVE_TAB);
					})[0] || element.querySelector("a");

					if (activeLink) {
						// show widget main tab
						element.classList.add(classes.VISIBLE);

						// open active tab
						router = ns.router.Router.getInstance();
						router.open(activeLink.getAttribute("href"), {rel: "maintab"});
					} else {
						ns.warn("MainTab: The widget requires at least one tab with link");
					}
				} else if (element.classList.contains(classes.VISIBLE)) {
					// select active tab
					url = target.getAttribute("data-url");
					file = url.match(FILE_REGEXP)[0];
					if (file) { // current page matches to links
						activeLink = links.filter(function (link) {
							return link.getAttribute("href").indexOf(file) > -1;
						})[0];
						if (activeLink) { // current active page is still in scope of MainTab
							if (!activeLink.classList.contains(classes.ACTIVE_TAB)) {
								links.forEach(function (link) {
									link.classList.toggle(classes.ACTIVE_TAB, (link.getAttribute("href").indexOf(file) > -1));
								});
							}
							// Content area without appbar has disabled top rounds on MainTab
							self._disableTopRounds(target);
						} else {
							// active page is out of Main Tab (hide MainTab)
							element.classList.remove(classes.VISIBLE);
						}
					}
				}
			};

			/**
			 * Disable top round in content area
			 * @param {HTMLElement} page
			 * @method _disableTopRounds
			 * @member ns.widget.core.MainTab
			 * @protected
			 */
			prototype._disableTopRounds = function (page) {
				var appbar = page.querySelector(".ui-appbar"),
					contentArea;

				if (!appbar) {
					contentArea = page.querySelector(".ui-content-area");
					contentArea.classList.add("ui-content-area-disabled-top-rounding");
				}
			};

			/**
			 * Destroy MainTab component
			 * @method _destroy
			 * @member ns.widget.core.MainTab
			 * @protected
			 */
			prototype._destroy = function () {
				this._unbindEvents();
			};

			// definition
			ns.widget.core.MainTab = MainTab;

			engine.defineWidget(
				"MainTab",
				"[data-role='main-tab'], .ui-main-tab",
				[],
				MainTab,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
