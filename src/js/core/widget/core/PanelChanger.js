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
/*jslint nomen: true, plusplus: true */
/**
 * # Panel Changer
 * Panel changer and panel component provide multi page layout in a page component.
 *
 * PanelChanger managed panel life-cycle and routing. So, If you want to use panel likes page,
 * you should wrap the pages as PanelChanger component.
 *
 * @since 2.4
 * @class ns.widget.core.PanelChanger
 * @component-selector .ui-panel-changer, [data-role]="panel-changer"
 * @extends ns.widget.BaseWidget
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../event",
			"../../util/selectors",
			"../../util/object",
			"../../history/manager",
			"../BaseWidget",
			"../core",
			"./Page",
			"./Panel"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				selectors = ns.util.selectors,
				object = ns.util.object,
				engine = ns.engine,
				page = ns.widget.core.Page,
				panel = ns.widget.core.Panel,
				events = ns.event,
				classes = {
					PANEL_CHANGER: "ui-panel-changer",
					PAGE: page.classes.uiPage,
					PANEL: panel.classes.PANEL,
					ACTIVE_PANEL: panel.classes.ACTIVE_PANEL,
					HEADER: "ui-header",
					FOOTER: "ui-footer",
					PRE_IN: "pre-in",
					IN: "-in",
					OUT: "-out"
				},
				PanelChanger = function () {
					var self = this;

					self._ui = {};
					self.options = {};
					self.eventType = {};
					self._animating = false;
					self._animationClasses = {};
					self.history = [];
				},
				DEFAULT = {
					ANIMATE: "slide",
					STORAGE_NAME: "panelhistory"
				},
				prototype = new BaseWidget();

			PanelChanger.default = DEFAULT;
			PanelChanger.classes = classes;
			PanelChanger.prototype = prototype;

			/**
			 * Configure PanelChanger component
			 * @method _configure
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._configure = function () {
				var self = this;

				object.merge(self.options, {
					animationType: DEFAULT.ANIMATE,
					manageHistory: true
				});
				object.merge(self.eventType, panel.eventType);
			};

			/**
			 * Build PanelChanger component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} element
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._build = function (element) {
				element.classList.add(classes.PANEL_CHANGER);

				return element;
			};

			/**
			 * Init PanelChanger component
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement} element
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self._ui;

				ui.page = selectors.getClosestByClass(element, classes.PAGE);
				ui.header = ui.page.querySelector("." + classes.HEADER);
				ui.footer = ui.page.querySelector("." + classes.FOOTER);
				ui.activePanel = ui.page.querySelector("." + classes.ACTIVE_PANEL);
				if (!ui.activePanel) {
					ui.activePanel = ui.page.querySelector("[data-role='panel'], .ui-panel");
					ui.activePanel.classList.add(classes.ACTIVE_PANEL);
				}
				ui.activePanel.style.display = "block";
				self._direction = "forward";
				localStorage[DEFAULT.STORAGE_NAME] = [];
				self.history.push(ui.activePanel.id);
				localStorage[DEFAULT.STORAGE_NAME] = JSON.stringify(self.history);
				self._animationType = self.options.animationType;
				this._initLayout();
				return element;
			};

			/**
			 * InitLayout PanelChanger component
			 * @method _initLayout
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._initLayout = function () {
				var self = this,
					element = self.element,
					ui = self._ui,
					pageOffsetHeight = ui.page ? ui.page.offsetHeight : 0,
					headerOffsetHeight = ui.header ? ui.header.offsetHeight : 0,
					footerOffsetHeight = ui.footer ? ui.footer.offsetHeight : 0;

				element.style.height = pageOffsetHeight - headerOffsetHeight - footerOffsetHeight + "px";
			};
			/**
			 * Bind events on PanelChanger component
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._bindEvents = function (element) {
				bindEvents.call(this, element);
			};

			/**
			 * Change panel
			 * @method _changePanel
			 * @param {string} address
			 * @param {string} animationType
			 * @param {string} direction
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._changePanel = function (address, animationType, direction) {
				var self = this,
					request = new XMLHttpRequest(),
					url = address ? address.split(/[#|?]+/)[0] : null;

				if (animationType) {
					self._animationType = animationType;
				}
				self._direction = direction;
				request.responseType = "document";
				request.open("GET", url);
				request.addEventListener("error", self._loadError);
				request.addEventListener("load", function (event) {
					var request = event.target;

					if (request.readyState === 4) {
						if (request.status === 200 || (request.status === 0 && request.responseXML)) {
							self._loadSuccess(address, request.responseXML, direction);
						} else {
							self._loadError();
						}
					}
				});
				request.send();
			};

			/**
			 * AJAX loadsuccess event handler
			 * @method _loadSuccess
			 * @param {string} href address string
			 * @param {XML} xml element
			 * @param {string} direction
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._loadSuccess = function (href, xml, direction) {
				var self = this,
					element = self.element,
					id = href.substring(href.lastIndexOf("#")),
					eventType = self.eventType,
					ui = self._ui,
					panel = id.length > 1 ? element.querySelector(id) : null,
					panelStyle,
					i,
					len,
					transformCacheValue;

				if (!panel && id.length > 1) {
					panel = xml.querySelector(id) || xml.querySelector("[data-role='panel'], .ui-panel");
				}


				if (!panel) {
					ns.warn("Panel is not existed");
					return;
				}

				panelStyle = panel.style;
				panelStyle.display = "block";
				transformCacheValue = panelStyle.transform;
				panelStyle.transform = "translate(-9999px, -9999px)";

				element.appendChild(panel);
				ui.toPanel = panel;
				events.trigger(panel, eventType.BEFORE_CREATE);
				engine.createWidgets(element);
				events.trigger(panel, eventType.CREATE);
				events.trigger(panel, eventType.BEFORE_SHOW);
				events.trigger(ui.activePanel, eventType.BEFORE_HIDE);
				panel.classList.add(classes.PRE_IN);
				panelStyle.display = "none";
				panelStyle.transform = transformCacheValue;

				self.history = JSON.parse(localStorage[DEFAULT.STORAGE_NAME] || "[]");
				if (direction === "forward") {
					self.history.push(panel.getAttribute("id"));
					localStorage[DEFAULT.STORAGE_NAME] = JSON.stringify(self.history);
				} else {
					len = self.history.length - 1;
					for (i = self.history.indexOf(panel.id); i < len; i++) {
						self.history.pop();
					}
					localStorage[DEFAULT.STORAGE_NAME] = JSON.stringify(self.history);
				}

				self._show();
			};

			/**
			 * Show next panel component
			 * @method _show
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._show = function () {
				var self = this,
					toPanel = self._ui.toPanel,
					fromPanel = self._ui.activePanel,
					type = self._animationType,
					animationClasses = self._animationClasses;

				self._animating = true;
				fromPanel.classList.remove(classes.ACTIVE_PANEL);
				toPanel.style.display = "block";
				animationClasses.IN = type + classes.IN;
				animationClasses.OUT = type + classes.OUT;

				fromPanel.classList.add(animationClasses.OUT);
				toPanel.classList.add(animationClasses.IN);

				if (type === "none") {
					self._onAnimationEnd();
				}
			};

			/**
			 * Loaderror event handler
			 * @method _loadError
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._loadError = function () {
				ns.warn("We can't load AJAX")
			};

			/**
			 * Bind events on this component
			 * @method bindEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.PanelChanger
			 * @private
			 */
			function bindEvents(element) {
				var self = this;

				events.on(element, "vclick", self, false);
				events.prefixedFastOn(element, "animationEnd", self, false);
			}

			/**
			 * Bind events on PanelChanger component
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._bindEvents = function (element) {
				bindEvents.call(this, element);
			};

			/**
			 * Click event handler
			 * @method _onClick
			 * @param {Event} event
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._onClick = function (event) {
				var self = this,
					link = event.target.tagName.toLowerCase() === "a" ? event.target : selectors.getClosestByTag(event.target, "A"),
					href;

				if (link && !self._animating && !link.getAttribute("data-rel")) {
					href = link.getAttribute("href");
					self._changePanel(href, self.options.animationType, "forward");
					event.preventDefault();
				}
			};

			/**
			 * animationEnd event handler
			 * @method _onAnimationEnd
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._onAnimationEnd = function () {
				var self = this,
					element = self.element,
					toPanel = self._ui.toPanel,
					activePanel = self._ui.activePanel,
					animationClasses = self._animationClasses;

				if (!self._animating) {
					return;
				}
				activePanel.style.display = "none";
				activePanel.classList.remove(animationClasses.OUT);
				toPanel.classList.add(classes.ACTIVE_PANEL);
				toPanel.classList.remove(classes.PRE_IN);
				toPanel.classList.remove(animationClasses.IN);

				events.trigger(activePanel, self.eventType.HIDE);
				events.trigger(toPanel, self.eventType.SHOW);
				events.trigger(element, self.eventType.CHANGE, {
					fromPanel: activePanel,
					toPanel: toPanel,
					direction: self._direction
				});
				self._ui.activePanel = toPanel;
				self._animating = false;
			};

			/**
			 * Bind pageBeforeShow event
			 * @method _onPagebeforeshow
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._onPagebeforeshow = function () {
				var routePanel = ns.router.Router.getInstance().getRoute("panel");

				routePanel.setActive(this._ui._activePanel);
			};

			/**
			 * Unbind events on this component
			 * @method unBindEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.PanelChanger
			 * @private
			 */
			function unBindEvents(element) {
				var self = this;

				events.off(element, "vclick", self, false);
				events.prefixedFastOff(element, "animationEnd", self, false);
			}

			/**
			 * handleEvent
			 * @method bindEvents
			 * @param {Event} event
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "vclick":
						self._onClick(event);
						break;
					case "webkitAnimationEnd":
					case "mozAnimationEnd":
					case "msAnimationEnd":
					case "oAnimationEnd":
					case "animationend":
						self._onAnimationEnd(event);
						break;
					case "pagebeforeshow":
						self._onPagebeforeshow(event);
						break;
				}
			};

			/**
			 * Change panel method
			 * @method changePanel
			 * @param {string} address
			 * @param {string} animationType
			 * @param {string} direction
			 * @member ns.widget.core.PanelChanger
			 * @public
			 */
			prototype.changePanel = function (address, animationType, direction) {
				this._changePanel(address, animationType, direction);
			};

			/**
			 * Destroy panel component
			 * @method _destroy
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this;

				self._ui = null;
				self.options = null;
				self._eventType = null;
				unBindEvents(self.element);
			};
			// definition
			ns.widget.core.PanelChanger = PanelChanger;

			engine.defineWidget(
				"PanelChanger",
				"[data-role='panel-changer'], .ui-panel-changer",
				["changePanel"],
				PanelChanger,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
