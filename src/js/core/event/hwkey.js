/*global window, ns, define, ns */
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
 * #Event hwkey
 * Namespace to support tizenhwkey event
 * @class ns.event.hwkey
 */
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../engine",
			"../event" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var popupClose = function (event) {
					var keyName = event.keyName,
						activePopup = ns.activePopup,
						container,
						containerClass,
						focused;

					// Check enableHWKeyHandler property
					if (ns.getConfig("enableHWKeyHandler", true) && activePopup) {
						container = activePopup._ui.container;
						containerClass = container && container.classList;
						if (keyName === "menu") {
							focused = activePopup.element.querySelector(".ui-focus");
							if (focused) {
								// NOTE: If a popup is opened and focused element exists in it,
								//       do not close that popup.
								//       'false' is returned here, hence popup close routine is not run.
								event.preventDefault();
								event.stopPropagation();
								return;
							}
						}
						if (keyName === "menu" || keyName === "back") {
							if (containerClass && (!containerClass.contains("ui-datetimepicker") || containerClass.contains("in"))) {
								activePopup.close();
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				},
				selectMenuClose = function (event) {
					var keyName = event.keyName,
						elActiveSelectMenu,
						activeSelectMenu;

					if (ns.getConfig("enableHWKeyHandler", true) && (keyName === "menu" || keyName === "back")) {
						elActiveSelectMenu = document.querySelector("div.ui-selectmenu-active select");
						if (elActiveSelectMenu) {
							activeSelectMenu = ns.widget.SelectMenu(elActiveSelectMenu);
							activeSelectMenu.close();
							event.preventDefault();
							event.stopPropagation();
						}
					}
				},
				eventType = ns.engine.eventType,
				hwkey = {
					/**
					 * Bind event tizenhwkey to support hardware keys.
					 * @method bind
					 * @static
					 * @member ns.event.hwkey
					 */
					bind: function () {
						document.addEventListener("tizenhwkey", popupClose, true);
						document.addEventListener("tizenhwkey", selectMenuClose, true);
					},

					/**
					 * Unbind event tizenhwkey to support hardware keys.
					 * @method unbind
					 * @static
					 * @member ns.event.hwkey
					 */
					unbind: function () {
						document.removeEventListener("tizenhwkey", popupClose, true);
						document.removeEventListener("tizenhwkey", selectMenuClose, true);
					}
				};

			ns.event.hwkey = hwkey;

			function init() {
				hwkey.unbind();
				hwkey.bind();
			}

			function destroy() {
				document.removeEventListener(eventType.INIT, init, false);
				document.removeEventListener(eventType.DESTROY, destroy, false);
			}

			document.addEventListener(eventType.INIT, init, false);
			document.addEventListener(eventType.DESTROY, destroy, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return hwkey;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
