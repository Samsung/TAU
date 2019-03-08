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
/*global window, ns, define */
/**
 * #jQuery Mobile mapping defaults
 * Object maps default values from TAU namespace to jQuery Mobile namespace.
 * @class ns.jqm.defaults
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./namespace",
			"../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engineEventsType = ns.engine.eventType,
				$ = ns.jqm.jQuery,
				eventType = {
					INIT: engineEventsType.INIT,
					DESTROY: engineEventsType.DESTROY
				},
				defaults = {
					/**
					 * Proxy colors library from ns namespace to jQM namespace
					 * @method init
					 * @member ns.jqm.defaults
					 * @static
					 */
					init: function () {
						if ($) {

							$.mobile = $.mobile || {};
							// Version of the jQuery Mobile Framework
							//$.mobile.version: __version__;

							// Namespace used framework-wide for data-attrs. Default is no namespace
							$.mobile.ns = "";

							// Define the url parameter used for referencing widget-generated sub-pages.
							// Translates to to example.html&ui-page=subpageIdentifier
							// hash segment before &ui-page= is used to make Ajax request
							$.mobile.subPageUrlKey = "ui-page";

							// Class assigned to page currently in view; and during transitions
							$.mobile.activePageClass = "ui-page-active";

							// Class used for "active" button state; from CSS framework
							$.mobile.activeBtnClass = "ui-btn-active";

							// Class used for "focus" form element state; from CSS framework
							$.mobile.focusClass = "ui-focus";

							// Automatically handle clicks and form submissions through Ajax; when same-domain
							$.mobile.ajaxEnabled = true;

							// Automatically load and show pages based on location.hash
							$.mobile.hashListeningEnabled = true;

							// disable to prevent jquery from bothering with links
							$.mobile.linkBindingEnabled = true;

							// Set default page transition - 'none' for no transitions
							$.mobile.defaultPageTransition = "fade";

							// Set maximum window width for transitions to apply - 'false' for no limit
							$.mobile.maxTransitionWidth = false;

							// Minimum scroll distance that will be remembered when returning to a page
							$.mobile.minScrollBack = 250;

							// DEPRECATED = the following property is no longer in use; but defined until 2.0 to prevent conflicts
							$.mobile.touchOverflowEnabled = false;

							// Set default dialog transition - 'none' for no transitions
							$.mobile.defaultDialogTransition = "pop";

							// Error response message - appears when an Ajax page request fails
							$.mobile.pageLoadErrorMessage = "Error Loading Page";

							// replace calls to window.history.back with phonegaps navigation helper
							// where it is provided on the window object
							$.mobile.phonegapNavigationEnabled = false;

							//automatically initialize the DOM when it's ready
							$.mobile.autoInitializePage = true;

							$.mobile.pushStateEnabled = true;

							// allows users to opt in to ignoring content by marking a parent element as
							// data-ignored
							$.mobile.ignoreContentEnabled = false;

							// turn of binding to the native orientationchange due to android orientation behavior
							$.mobile.orientationChangeEnabled = true;

							$.mobile.tizen = $.mobile.tizen || {};
							$.mobile.tizen.enableHWKeyHandler = true;
						}
					},
					destroy: function () {
						document.removeEventListener(eventType.INIT, defaults.init, false);
						document.removeEventListener(eventType.DESTROY, defaults.destroy, false);
						$ = null;
					}
				};

			// Listen when framework is ready
			document.addEventListener(eventType.INIT, defaults.init, false);
			document.addEventListener(eventType.DESTROY, defaults.destroy, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
