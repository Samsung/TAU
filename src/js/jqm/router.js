/*global window, ns, define, HTMLElement */
/*jslint plusplus: true, nomen: true */
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
 * #jQuery Mobile mapping router
 * Object maps router from TAU namespace to jQuery Mobile namespace.
 * @class ns.jqm.router
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core/engine",
			"../core/router/Router",
			"../core/util/path",
			"./namespace"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var engine = ns.engine,
				$ = ns.jqm.jQuery,
				eventType = ns.router.Router.eventType,
				jqmRouter = {
					/**
					 * Enables support jQM before router init.
					 * @method beforeinit
					 * @member ns.jqm.router
					 */
					beforeinit: function () {
						var container,
							router = ns.router.Router.getInstance();

						if ($) {
							if ($.mobile) {
								if ($.mobile.pageContainer) {
									container = $.mobile.pageContainer;
									if (container instanceof $) {
										container = container[0];
									}
									if (!(container instanceof HTMLElement)) {
										container = document.body;
									}
									ns.setConfig("pageContainer", container);
									$.mobile.pageContainer = $(container);
								}
								if ($.mobile.autoInitializePage !== undefined) {
									ns.setConfig("autoInitializePage", $.mobile.autoInitializePage);
								}
								if ($.mobile._bindPageRemove !== undefined) {
									ns.setConfig("_bindPageRemove", $.mobile._bindPageRemove);
								}
								$.mobile.changePage = function (toPage, options) {
									var htmlElementToPage;

									if (toPage instanceof $) {
										htmlElementToPage = $(toPage).get(0);
										return router.open(htmlElementToPage, options);
									}
									return router.open(toPage, options);
								};
								document.addEventListener("pagechange", function () {
									var route = router.getRoute("page"),
										activePage = route && route.getActive(),
										target = activePage && activePage.element;

									$.mobile.activePage = $(target);
								}, true);
								$.mobile.activePage = $();
								$.mobile.firstPage = $(router.getRoute("page").getFirstElement());
								$.mobile.pageContainer = $();
								$.mobile.subPageUrlKey = ns.widget.core.Page.classes.uiPage;
								$.mobile.ajaxEnabled = true;
								$.mobile.hashListeningEnabled = true;
								$.mobile.linkBindingEnabled = true;
								$.mobile.maxTransitionWidth = false;
								$.mobile.minScrollBack = 250;
								$.mobile.touchOverflowEnabled = false;
								$.mobile.defaultDialogTransition = "pop";
								$.mobile.pageLoadErrorMessage = "Error Loading Page";
								$.mobile.pageLoadErrorMessageTheme = "e";
								$.mobile.phonegapNavigationEnabled = false;
								$.mobile.autoInitializePage = false;
								$.mobile.pushStateEnabled = true;
								$.mobile.ignoreContentEnabled = false;
								$.mobile.orientationChangeEnabled = true;
								$.mobile.ajaxBlacklist = false;
								$.mobile.defaultTransitionHandler = null;
								$.mobile.transitionHandlers = {};
								$.mobile.transitionFallbacks = {};
								$.mobile._maybeDegradeTransition = null;
								$.mobile.focusPage = null;
								//$.mobile.urlHistory = ns.router.urlHistory;
								$.mobile.dialogHashKey = "&ui-state=dialog";
								$.mobile.allowCrossDomainPages = false;
								$.mobile.getDocumentUrl = ns.util.path.getDocumentUrl;
								$.mobile.getDocumentBase = ns.util.path.getDocumentBase;
								$.mobile._bindPageRemove = null;
								$.mobile.loadPage = router.loadPage === undefined ? ns.error.bind(null, "router PageExternal is not loaded") : router.loadPage.bind(router);
								$.mobile.navreadyDeferred = router.navreadyDeferred;
								$.mobile.initializePage = null;
								$.mobile._handleHashChange = router._hashChangeHandler;
							} else {
								$.mobile = {};
							}
						}
					},
					/**
					 * Enables support jQM after router init.
					 * @method init
					 * @member ns.jqm.router
					 */
					init: function () {
						var transitions,
							name,
							router = ns.router.Router.getInstance(),
							containerWidget;

						if ($) {
							$.mobile.defaultPageTransition = "none";

							if (router.getTransitions) {
								transitions = router.getTransitions();
								for (name in transitions) {
									if (transitions.hasOwnProperty(name)) {
										if (transitions[name].fallback !== undefined) {
											$.mobile.transitionFallbacks[name] = transitions[name].fallback;
										}
										if (transitions[name].handler !== undefined) {
											$.mobile.transitionHandlers[name] = transitions[name].handler;
										}
									}
								}
								$.mobile.defaultTransitionHandler = transitions.sequential.handler;
								$.mobile._maybeDegradeTransition = router._maybeDegradeTransition.bind(router);
								$.mobile.getMaxScrollForTransition = router.getMaxScrollForTransition.bind(router);
							}

							$.mobile.focusPage = function (toPage) {
								var page = $(toPage)[0],
									pageWidget = engine.getBinding(page);

								pageWidget.focus();
							};

							$.mobile.initializePage = router.init.bind(router);
							containerWidget = router.getContainer();
							if (containerWidget) {
								$.mobile.pageContainer = $(containerWidget.element);
							}
						}
					},
					destroy: function () {
						document.removeEventListener(eventType.ROUTER_INIT, jqmRouter.init, false);
						document.removeEventListener(eventType.BEFORE_ROUTER_INIT, jqmRouter.beforeinit, false);
						document.removeEventListener(eventType.DESTROY, jqmRouter.destroy, false);
					}
				};

			document.addEventListener(eventType.ROUTER_INIT, jqmRouter.init, false);
			document.addEventListener(eventType.BEFORE_ROUTER_INIT, jqmRouter.beforeinit, false);
			document.addEventListener(eventType.DESTROY, jqmRouter.destroy, false);

			ns.jqm.router = jqmRouter;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
