/*global window, ns, define, localStorage, ns */
/*jslint nomen: true */
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
 * #Route panel
 * Support class for router to control panel widget in profile Wearable.
 * @class ns.router.route.panel
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/DOM/attributes",
			"../../util/path",
			"../../util/selectors",
			"../../util/object",
			"../route",
			"../../history",
			"../../widget/core/Panel",
			"../../widget/core/PanelChanger"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var panelChanger = ns.widget.core.PanelChanger,
				selectors = ns.util.selectors,
				history = ns.history,
				engine = ns.engine,
				classes = {
					PANEL_CHANGER: panelChanger.classes.PANEL_CHANGER
				},
				CONST = {
					REVERSE: "slide-reverse"
				},
				routePanel = {};

			routePanel.orderNumber = 10;

			/**
			 * Returns default route options used inside Router.
			 * But, panel router has not options.
			 * @method option
			 * @static
			 * @member ns.router.route.panel
			 * @return {null}
			 */
			routePanel.option = function () {
				return null;
			};

			/**
			 * This method sets active panel and manages history.
			 * @method setActive
			 * @param {HTMLElement} element
			 * @member ns.router.route.panel
			 * @static
			 */
			routePanel.setActive = function (element) {
				var self = this,
					panelChangerElement = selectors.getClosestByClass(element, classes.PANEL_CHANGER),
					panelChangerComponent = engine.instanceWidget(panelChangerElement, "PanelChanger");

				self.active = true;
				self._panelChangerElement = panelChangerElement;
				self._panelChangerComponent = panelChangerComponent;
			};

			/**
			 * This method handles hash change.
			 * @method onHashChange
			 * @param {string} url
			 * @param {Object} options
			 * @param {string} prev
			 * @static
			 * @member ns.router.route.panel
			 * @return {boolean}
			 */
			routePanel.onHashChange = function (url, options, prev) {
				var self = this,
					storageName = panelChanger.default.STORAGE_NAME,
					panelHistory = JSON.parse(localStorage[storageName] || "[]"),
					panelChangerComponent = self._panelChangerComponent,
					activePanel = panelHistory[panelHistory.length - 1];

				if (!self.active || !panelChangerComponent) {
					return false;
				} if (self._panelChangerElement.querySelector("#" + activePanel).classList.contains(panelChanger.classes.PRE_IN) ||
						panelHistory.length === 0) {
					history.replace(prev, prev.stateTitle, prev.stateUrl);
					return true;
				}
				panelHistory.pop();
				if (panelChangerComponent.options.manageHistory && panelHistory.length > 0) {
					history.replace(prev, prev.stateTitle, prev.stateUrl);
					localStorage[storageName] = JSON.stringify(panelHistory);
					panelChangerComponent.changePanel("#" + panelHistory.pop(), CONST.REVERSE, "back");
					return true;
				}
				self.active = false;
				return false;
			};

			ns.router.route.panel = routePanel;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routePanel;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
