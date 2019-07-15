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
/* global define, HTMLElement, ns */
/**
 * #Router
 *
 * Main class to navigate between pages, popups and other widgets which has own rules in all profiles.
 *
 * Class communicates with PageContainer which deactivate and activate changed pages.
 *
 * Router listening on events triggered by history manager.
 *
 * ## Getting instance
 *
 * To receive instance of router you should use method _getInstance_
 *
 * 	@example
 * 		var router = ns.router.Router.getInstance();
 *
 * By default TAU create instance of router and getInstance method return this instance.
 *
 * ##Connected widgets
 *
 * Router cooperate with widgets:
 *
 *  - Page
 *  - Popup
 *  - Drawer
 *  - Dialog (mobile)
 *  - CircularIndexScrollBar (wearable - circle)
 *
 * Opening or closing these widgets are possible by create link with correct rel.
 *
 * ##Global options used in router
 *
 *  - *pageContainer* = document.body - default container element
 *  - *pageContainerBody* = false - use body instead pageContainer option
 *  - *autoInitializePage* = true - automatically initialize first page
 *  - *addPageIfNotExist* = true - automatically add page if doesn't exist
 *  - *loader* = false - enable loader on change page
 *  - *disableRouter* = false - disable auto initialize of router
 *
 * @class ns.router.Router
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Hyunkook, Cho <hk0713.cho@samsung.com>
 * @author Piotr Czajka <p.czajka@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Heeju Joo <heeju.joo@samsung.com>
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../engine",
			"../event",
			"../util/DOM/attributes",
			"../util/selectors",
			"../util/path",
			"../util/object",
			"../util/pathToRegexp",
			"../router",
			"./route", // fetch namespace
			"../history",
			"../history/manager",
			"../widget/core/Page",
			"../widget/core/PageContainer",
			"../template"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Local alias for ns.util
			 * @property {Object} util Alias for {@link ns.util}
			 * @member ns.router.Router
			 * @static
			 * @private
			 */
			var util = ns.util,
				/**
				 * Local alias for ns.event
				 * @property {Object} eventUtils Alias for {@link ns.event}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				eventUtils = ns.event,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} DOM
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				DOM = util.DOM,
				/**
				 * Local alias for ns.util.path
				 * @property {Object} path Alias for {@link ns.util.path}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				path = util.path,
				/**
				 * Local alias for ns.util.selectors
				 * @property {Object} selectors Alias for {@link ns.util.selectors}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				selectors = util.selectors,
				/**
				 * Local alias for ns.util.object
				 * @property {Object} object Alias for {@link ns.util.object}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				object = util.object,
				/**
				 * Local alias for ns.engine
				 * @property {Object} engine Alias for {@link ns.engine}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Local alias for ns.router
				 * @property {Object} router Alias for namespace ns.router
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				router = ns.router,
				/**
				 * Local alias for ns.history
				 * @property {Object} history Alias for {@link ns.history}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				history = ns.history,
				historyManager = history.manager,
				/**
				 * Local alias for ns.history.manager.events
				 * @property {Object} historyManagerEvents Alias for (@link ns.history.manager.events}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				historyManagerEvents = historyManager.events,
				/**
				 * Local alias for ns.router.route
				 * @property {Object} route Alias for namespace ns.router.route
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				route = router.route,
				/**
				 * Local alias for document body element
				 * @property {HTMLElement} body
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				body = document.body,
				/**
				 * Alias to Array.slice method
				 * @method slice
				 * @member ns.router.Router
				 * @private
				 * @static
				 */
				slice = [].slice,
				/**
				 * Local instance of the Router
				 * @property {Object} routerInstance
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				_isLock = false,

				ORDER_NUMBER = {
					1: "page",
					10: "panel",
					100: "popup",
					101: "dialog",
					1000: "drawer",
					2000: "circularindexscrollbar"
				},

				eventType = {
					BEFORE_ROUTER_INIT: "beforerouterinit",
					ROUTER_INIT: "routerinit"
				},

				HASH_REGEXP = /[#|\s]/g,

				Page = ns.widget.core.Page,

				routerInstance,

				template = ns.template,

				Router = function () {
					var self = this;

					/**
					 * Instance of widget PageContainer which controls page changing.
					 * @property {?ns.widget.core.PageContainer} [container=null]
					 * @member ns.router.Router
					 */
					self.container = null;
					/**
					 * Settings for last call of method open
					 * @property {Object} [settings={}]
					 * @member ns.router.Router
					 */
					self.settings = {};

					/**
					 * Handler for event "statechange"
					 * @property {Function} [_onStateChangeHandler=null]
					 * @member ns.router.Router
					 * @protected
					 * @since 2.4
					 */
					self._onStateChangeHandler = null;
					/**
					 * Handler for event "hashchange"
					 * @property {Function} [_onHashChangeHandler=null]
					 * @member ns.router.Router
					 * @protected
					 * @since 2.4
					 */
					self._onHashChangeHandler = null;
					/**
					 * Handler for event "controllercontent"
					 * @property {Function} [_onControllerContent=null]
					 * @member ns.router.Router
					 * @protected
					 * @since 2.4
					 */
					self._onControllerContent = null;

					/**
					 * Router locking flag
					 * @property {boolean} locked=false
					 * @member ns.router.Router
					 * @since 2.4
					 */
					self.locked = false;
				};

			/**
			 * Default values for router
			 * @property {Object} defaults
			 * @property {boolean} [defaults.fromHashChange=false] Sets if will be changed after hashchange.
			 * @property {boolean} [defaults.reverse=false] Sets the direction of change.
			 * @property {boolean} [defaults.volatileRecord=false] Sets if the current history entry will be modified or a new one will be created.
			 * @member ns.router.Router
			 */
			Router.prototype.defaults = {
				fromHashChange: false,
				reverse: false,
				volatileRecord: false
			};

			/**
			 * Find the closest link for element
			 * @method findClosestLink
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @private
			 * @static
			 * @member ns.router.Router
			 */
			function findClosestLink(element) {
				while (element) {
					if (element.nodeType === Node.ELEMENT_NODE && element.nodeName && element.nodeName === "A") {
						break;
					}
					element = element.parentNode;
				}
				return element;
			}

			/**
			 * Handle event link click
			 * @method linkClickHandler
			 * @param {ns.router.Router} router
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.router.Router
			 */
			function linkClickHandler(router, event) {
				var link = findClosestLink(event.target),
					href,
					useDefaultUrlHandling,
					options;

				if (link && event.which === 1) {
					href = link.getAttribute("href");
					useDefaultUrlHandling = (link.getAttribute("rel") === "external") || link.hasAttribute("target");
					if (!useDefaultUrlHandling) {
						options = DOM.getData(link);
						router.open(href, options, event);
						eventUtils.preventDefault(event);
					}
				}
			}

			Router.prototype.linkClick = function (event) {
				linkClickHandler(this, event);
			};

			function openUrlFromState(instanceRouter, state) {
				var rules = router.route,
					prevState = history.activeState,
					reverse = state && history.getDirection(state) === "back",
					maxOrderNumber,
					orderNumberArray = [],
					ruleKey,
					options,
					url = path.getLocation(),
					isContinue = true,
					transition,
					rule;

				transition = reverse ? ((prevState && prevState.transition) || "none") : state.transition;
				options = object.merge({}, state, {
					reverse: reverse,
					transition: transition,
					fromHashChange: true
				});

				// find rule with max order number
				for (ruleKey in rules) {
					if (rules.hasOwnProperty(ruleKey) && rules[ruleKey].active) {
						orderNumberArray.push(rules[ruleKey].orderNumber);
					}
				}
				maxOrderNumber = Math.max.apply(null, orderNumberArray);
				rule = rules[ORDER_NUMBER[maxOrderNumber]];

				if (rule && rule.onHashChange(url, options, prevState)) {
					if (maxOrderNumber === 10) {
						// rule is panel
						return;
					}
					isContinue = false;
				}

				history.setActive(state);
				if (isContinue) {
					instanceRouter.open(state.url, options);
				}
			}

			/**
			 * Detect rel attribute from HTMLElement.
			 *
			 * This method tries to match element to each rule filter and return first rule name which match.
			 *
			 * If don't match any rule then return null.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.detectRel(document.getElementById("pageId"));
			 *		// if HTML element will be match to selector of page then return rule for page
			 *
			 * @param {HTMLElement} to element to check
			 * @member ns.router.Router
			 * @return {?string}
			 */
			Router.prototype.detectRel = function (to) {
				var rule,
					i;

				for (i in route) {
					if (route.hasOwnProperty(i)) {
						rule = route[i];
						if (selectors.matchesSelector(to, rule.filter)) {
							return i;
						}
					}
				}

				return null;
			};


			/**
			 * Open given page with deferred
			 * @method _openDeferred
			 * @param {HTMLElement} to HTMLElement of page
			 * @param {Object} [options]
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page"
			 * or "popup"
			 * or "external" for linking to another domain.
			 * @param {string} [options.transition = "none"] Sets the animation used during change of
			 * page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will
			 * be modified or
			 * a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for
			 * container.
			 * @param {Event} event
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._openDeferred = function (to, options, event) {
				var self = this,
					rule = route[options.rel],
					deferred = {
						resolve: function (_options, content) {
							rule.open(content, _options, event);
						},
						reject: function (_options) {
							eventUtils.trigger(self.container.element, "changefailed", _options);
						}
					};

				if (typeof to === "string") {
					if (to.replace(HASH_REGEXP, "")) {
						self._loadUrl(to, options, rule, deferred);
					}
				} else {
					// execute deferred object immediately
					if (to && selectors.matchesSelector(to, rule.filter)) {
						deferred.resolve(options, to);
					} else {
						deferred.reject(options);
					}
				}
			};

			/**
			 * Change page to page given in parameter "to".
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.open("pageId");
			 *		// open page with given id
			 *		router.open("page.html");
			 *		// open page from html file
			 *		router.open("popupId");
			 *		// open popup with given id
			 *
			 * @method open
			 * @param {string|HTMLElement} to Id of page or file url or HTMLElement of page
			 * @param {Object} [options]
			 * @param {"page"|"popup"|"external"} [options.rel="page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition="none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse=false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange=false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.volatileRecord=false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container=null] It is used in RoutePopup as selector for container.
			 * @param {Event} [event] Event object
			 * @member ns.router.Router
			 */
			Router.prototype.open = function (to, options, event) {
				var self = this,
					rel,
					rule;

				if (!_isLock) {
					to = getHTMLElement(to);
					rel = (options && options.rel) ||
						(to instanceof HTMLElement && self.detectRel(to));
					rel = rel || "page";
					rule = route[rel];

					if (rel === "back") {
						history.back();
					} else if (rule) {
						options = object.merge(
							{
								rel: rel
							},
							self.defaults,
							rule.option(),
							options
						);
						self._openDeferred(to, options, event);
					} else {
						throw new Error("Not defined router rule [" + rel + "]");
					}
				}
			};


			/**
			 * Init routes defined in router
			 * @method _initRoutes
			 * @member ns.router.Router
			 */
			Router.prototype._initRoutes = function () {
				var ruleKey,
					rules = router.route;

				for (ruleKey in rules) {
					if (rules.hasOwnProperty(ruleKey) && rules[ruleKey].init) {
						rules[ruleKey].init();
					}
				}
			};

			function removeActivePageClass(containerElement) {
				var PageClasses = Page.classes,
					uiPageActiveSelector = "." + PageClasses.uiPageActive,
					activePages = slice.call(containerElement.querySelectorAll(uiPageActiveSelector));

				activePages.forEach(function (page) {
					page.classList.remove(uiPageActiveSelector);
				});
			}

			Router.prototype._autoInitializePage = function (containerElement, pages, pageSelector) {
				var self = this,
					page,
					location = window.location,
					uiPageActiveClass = Page.classes.uiPageActive,
					firstPage = containerElement.querySelector("." + uiPageActiveClass);

				if (!firstPage) {
					firstPage = pages[0];
				}

				if (firstPage) {
					removeActivePageClass(containerElement);
				}

				if (location.hash) {
					//simple check to determine if we should show firstPage or other
					page = document.getElementById(location.hash.replace("#", ""));
					if (page && selectors.matchesSelector(page, pageSelector)) {
						firstPage = page;
					}
				}

				if (!firstPage && ns.getConfig("addPageIfNotExist", true)) {
					firstPage = Page.createEmptyElement();
					while (containerElement.firstChild) {
						firstPage.appendChild(containerElement.firstChild);
					}
					containerElement.appendChild(firstPage);
				}

				if (self.justBuild) {
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.log("router.Router just build");
					//>>excludeEnd("tauDebug");
					if (firstPage) {
						self.register(
							engine.instanceWidget(containerElement, "pagecontainer"),
							firstPage
						);
					}
				}

				return firstPage;
			};

			/**
			 * Method initializes page container and builds the first page if flag autoInitializePage is
			 * set.
			 * @method init
			 * @param {boolean} justBuild
			 * @member ns.router.Router
			 */
			Router.prototype.init = function (justBuild) {
				var containerElement,
					firstPage,
					pages,
					pageDefinition = ns.engine.getWidgetDefinition("Page"),
					pageSelector = pageDefinition.selector,
					self = this;

				eventUtils.trigger(document, eventType.BEFORE_ROUTER_INIT, self, false);

				body = document.body;
				self.justBuild = justBuild;

				containerElement = ns.getConfig("pageContainer") || body;
				pages = slice.call(containerElement.querySelectorAll(pageSelector));

				if (!ns.getConfig("pageContainerBody", false)) {
					containerElement = pages.length ? pages[0].parentNode : containerElement;
				}

				if (ns.getConfig("autoInitializePage", true)) {
					firstPage = self._autoInitializePage(containerElement, pages, pageSelector);
					if (justBuild) {
						return;
					}
				}

				historyManager.enable();

				// init router's routes
				self._initRoutes();

				self.register(
					engine.instanceWidget(containerElement, "pagecontainer"),
					firstPage
				);

				eventUtils.trigger(document, eventType.ROUTER_INIT, self, false);
			};

			/**
			 * Method removes all events listeners set by router.
			 *
			 * Also remove singleton instance of router;
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.destroy();
			 *		var router2 = tau.router.Router.getInstance();
			 *		// router !== router2
			 *
			 * @method destroy
			 * @member ns.router.Router
			 */
			Router.prototype.destroy = function () {
				var self = this;

				historyManager.disable();

				window.removeEventListener("popstate", self.popStateHandler, false);
				if (body) {
					body.removeEventListener("pagebeforechange", self.pagebeforechangeHandler, false);
					body.removeEventListener("vclick", self.linkClickHandler, false);
				}
				ns.setConfig("pageContainer", null);
			};

			/**
			 * Method sets instance of PageContainer widget
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.setContainer(new ns.widget.PageContainer());
			 *
			 * @method setContainer
			 * @param {ns.widget.core.PageContainer} container
			 * @member ns.router.Router
			 */
			Router.prototype.setContainer = function (container) {
				this.container = container;
			};

			/**
			 * Method returns instance of PageContainer widget
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		containerWidget = router.getContainer();
			 *
			 * @method getContainer
			 * @return {ns.widget.core.PageContainer}
			 * @member ns.router.Router
			 */
			Router.prototype.getContainer = function () {
				return this.container;
			};

			/**
			 * Method returns ths first page HTMLElement
			 * @method getFirstPage
			 * @return {HTMLElement}
			 * @member ns.router.Router
			 */
			Router.prototype.getFirstPage = function () {
				return this.getRoute("page").getFirstElement();
			};


			/**
			 * Callback for event "historyhashchange" which is triggered by history manager after hash is changed
			 * @param {ns.router.Router} router
			 * @param {Event} event
			 */
			function onHistoryHashChange(router, event) {
				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("Router.onHistoryHashChange", router, event);
				//>>excludeEnd("tauDebug");
				openUrlFromState(router, event.detail);
			}

			/**
			 * Callback for event "historystatechange" which is triggered by history manager after hash is changed
			 * @param {ns.router.Router} router
			 * @param {Event} event
			 */
			function onHistoryStateChange(router, event) {
				var options = event.detail,
					//
					url = options.reverse ? options.url : (options.href || options.url);

				delete options.event;
				router.open(url, options);
				// prevent current event
				eventUtils.preventDefault(event);
				eventUtils.stopImmediatePropagation(event);
			}

			/**
			 * Convert HTML string to HTMLElement
			 * @param {string|HTMLElement} content
			 * @param {string} title
			 * @return {?HTMLElement}
			 */
			function convertToNode(content, title) {
				var contentNode = null,
					externalDocument = document.implementation.createHTMLDocument(title),
					externalBody = externalDocument.body;

				if (content instanceof HTMLElement) {
					// if content is HTMLElement just set to contentNode
					contentNode = content;
				} else {
					// otherwise convert string to HTMLElement
					try {
						externalBody.insertAdjacentHTML("beforeend", content);
						contentNode = externalBody.firstChild;
					} catch (e) {
						ns.error("Failed to inject element", e);
					}
				}
				return contentNode;
			}

			/**
			 * Set data-url on HTMLElement if not exists
			 * @param {HTMLElement} contentNode
			 * @param {string} url
			 */
			function setURLonElement(contentNode, url) {
				if (url) {
					if (contentNode instanceof HTMLElement && !DOM.hasNSData(contentNode, "url")) {
						// if url is missing we need set data-url attribute for good finding by method open in router
						url = url.replace(/^#/, "");
						DOM.setNSData(contentNode, "url", url);
					}
				}
			}

			/**
			 * Callback for event "controller-content-available" which is triggered by controller after application handle hash change
			 * @param {ns.router.Router} router
			 * @param {Event} event
			 */
			function onControllerContent(router, event) {
				var data = event.detail,
					content = data.content,
					options = data.options,
					contentNode,
					url = (options.href || options.url);

				// if controller give content
				if (content) {
					// convert to node if content is string
					contentNode = convertToNode(content, options.title);

					// set data-url on node
					setURLonElement(contentNode, url);

					// calling open method
					router.open(contentNode, options);

					//prevent event
					eventUtils.preventDefault(event);
				}
			}


			/**
			 * Method registers page container and the first page.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.register(new ns.widget.PageContainer(), document.getElementById("firstPage"));
			 *
			 * @method register
			 * @param {ns.widget.core.PageContainer} container
			 * @param {HTMLElement} firstPage
			 * @member ns.router.Router
			 */
			Router.prototype.register = function (container, firstPage) {
				var self = this,
					routePopup = this.getRoute("popup");

				// sets instance of PageContainer widget
				self.container = container;

				// sets first page HTMLElement
				self.getRoute("page").setFirstElement(firstPage);

				eventUtils.trigger(document, "themeinit", self);

				// sets events handlers
				if (!self._onHashChangeHandler) {
					self._onHashChangeHandler = onHistoryHashChange.bind(null, self);
					window.addEventListener(historyManagerEvents.HASHCHANGE, self._onHashChangeHandler, false);
				}
				if (!self._onStateChangeHandler) {
					self._onStateChangeHandler = onHistoryStateChange.bind(null, self);
					window.addEventListener(historyManagerEvents.STATECHANGE, self._onStateChangeHandler, false);
				}
				if (!self._onControllerContent) {
					self._onControllerContent = onControllerContent.bind(null, self);
					window.addEventListener("controller-content-available", self._onControllerContent, false);
				}

				// if loader config is set then create loader widget
				if (ns.getConfig("loader", false)) {
					container.element.appendChild(self.getLoader().element);
				}

				// set history support
				history.enableVolatileMode();

				// if first page exist open this page without transition
				if (firstPage) {
					self.open(firstPage, {transition: "none"});
				}

				if (routePopup) {
					routePopup.setActive(null);
				}
			};

			/**
			 * Convert string id to HTMLElement or return HTMLElement if is given
			 * @param {string|HTMLElement} idOrElement
			 * @return {HTMLElement|string}
			 */
			function getHTMLElement(idOrElement) {
				var stringId,
					toElement;

				// if given argument is string then
				if (typeof idOrElement === "string") {
					if (idOrElement[0] === "#") {
						// trim first char if it is #
						stringId = idOrElement.substr(1);
					} else {
						stringId = idOrElement;
					}
					// find element by id
					toElement = document.getElementById(stringId);

					if (toElement) {
						// is exists element by id then return it
						idOrElement = toElement;
					}
					// otherwise return string
				}
				return idOrElement;
			}

			/**
			 * Method close route element, eg page or popup.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.close("popupId", {transition: "none"});
			 *
			 * @method close
			 * @param {string|HTMLElement} to Id of page or file url or HTMLElement of page
			 * @param {Object} [options]
			 * @param {"page"|"popup"|"external"} [options.rel="page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain
			 * @member ns.router.Router
			 */
			Router.prototype.close = function (to, options) {
				var rel = "back",
					closingWidget = getHTMLElement(to),
					rule;

				if (options && options.rel) {
					rel = options.rel;
				} else if (closingWidget) {
					rel = this.detectRel(closingWidget);
				}

				rule = route[rel];

				// if router is not locked
				if (!this.locked) {
					// if rel is back then call back method
					if (rel === "back") {
						history.back();
					} else {
						// otherwise if rule exists
						if (rule) {
							// call close on rule
							rule.close(closingWidget, options);
						} else {
							throw new Error("Not defined router rule [" + rel + "]");
						}
					}
				}
			};

			/**
			 * Method back to previous state.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.back();
			 *
			 * @method close
			 * @member ns.router.Router
			 */
			Router.prototype.back = function () {

				// if router is not locked
				if (!this.locked) {
					history.back();
				}
			};

			/**
			 * Method opens popup.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.openPopup("popupId", {transition: "none"});
			 *
			 * @method openPopup
			 * @param {HTMLElement|string} to Id or HTMLElement of popup.
			 * @param {Object} [options]
			 * @param {string} [options.transition="none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse=false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange=false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.volatileRecord=false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container=null] It is used in RoutePopup as selector for container.
			 * @member ns.router.Router
			 */
			Router.prototype.openPopup = function (to, options) {
				// call method open with overwrite rel option
				this.open(to, object.fastMerge({rel: "popup"}, options));
			};

			/**
			 * Method closes popup.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.closePopup();
			 *
			 * @method closePopup
			 * @param {Object} options
			 * @param {string=} [options.transition]
			 * @param {string=} [options.ext="in ui-pre-in"] options.ext
			 * @member ns.router.Router
			 */
			Router.prototype.closePopup = function (options) {
				var popupRoute = this.getRoute("popup");

				if (popupRoute) {
					popupRoute.close(null, options);
				}
			};

			/**
			 * Lock router
			 * @method lock
			 * @member ns.router.Router
			 */
			Router.prototype.lock = function () {
				this.locked = true;
			};

			/**
			 * Unlock router and history manager
			 * @method unlock
			 * @member ns.router.Router
			 */
			Router.prototype.unlock = function () {
				this.locked = false;
			};

			/**
			 * Load content from url.
			 *
			 * Method prepare url and call template function to load external file.
			 *
			 * If option showLoadMsg is ste to tru open loader widget before start loading.
			 *
			 * @method _loadUrl
			 * @param {string} url full URL to load
			 * @param {Object} options options for this and next methods in chain
			 * @param {boolean} [options.data] Sets if page has url attribute.
			 * @param {Object} rule rule which support given call
			 * @param {Object} deferred object with callbacks
			 * @param {Function} deferred.reject callback on error
			 * @param {Function} deferred.resolve callback on success
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadUrl = function (url, options, rule, deferred) {
				var absUrl = path.makeUrlAbsolute(url, path.getLocation()),
					content,
					self = this,
					data = options.data || {};

				// check if content is loaded in current document
				content = rule.find(absUrl);

				// if content doesn't find and url is embedded url
				if (!content && path.isEmbedded(absUrl)) {
					// reject
					deferred.reject({});
				} else {
					// If the content we are interested in is already in the DOM,
					// and the caller did not indicate that we should force a
					// reload of the file, we are done. Resolve the deferred so that
					// users can bind to .done on the promise
					if (content) {
						// content was found and we resolve
						deferred.resolve(object.fastMerge({absUrl: absUrl}, options), content);
					} else {

						// Load the new content.
						eventUtils.trigger(self.getContainer().element, options.rel + "beforeload");

						// force return full document from template system
						data.fullDocument = true;
						// we put url, not the whole path to function render,
						// because this path can be modified by template's module
						template.render(url, data, function (status, element) {
							// if template loaded successful
							if (status.success) {
								self._loadSuccess(status.absUrl, options, rule, deferred, element);
								eventUtils.trigger(self.getContainer().element, options.rel + "load");
							} else {
								self._loadError(status.absUrl, options, deferred);
							}
						});
					}
				}
			};

			/**
			 * Error handler for loading content by AJAX
			 * @method _loadError
			 * @param {string} absUrl full URL to load
			 * @param {Object} options options for this and next methods in chain
			 * @param {boolean} [options.showLoadMsg=true] Sets if message will be shown during loading.
			 * @param {Object} deferred object with callbacks
			 * @param {Function} deferred.reject callback on error
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadError = function (absUrl, options, deferred) {
				var detail = object.fastMerge({url: absUrl}, options),
					self = this;

				ns.error("load error, file: ", absUrl);

				self.container.trigger("loadfailed", detail);
				deferred.reject(detail);
			};

			// TODO it would be nice to split this up more but everything appears to be "one off"
			//	or require ordering such that other bits are sprinkled in between parts that
			//	could be abstracted out as a group
			/**
			 * Success handler for loading content by AJAX
			 * @method _loadSuccess
			 * @param {string} absUrl full URL to load
			 * @param {Object} options options for this and next methods in chain
			 * @param {boolean} [options.showLoadMsg=true] Sets if message will be shown during loading.
			 * @param {Object} rule rule which support given call
			 * @param {Object} deferred object with callbacks
			 * @param {Function} deferred.reject callback on error
			 * @param {Function} deferred.resolve callback on success
			 * @param {string} html
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadSuccess = function (absUrl, options, rule, deferred, html) {
				var detail = object.fastMerge({url: absUrl}, options),
					// find element with given id in returned html
					content = rule.parse(html, absUrl);

				if (content) {
					deferred.resolve(detail, content);
				} else {
					deferred.reject(detail);
				}
			};

			// TODO the first page should be a property set during _create using the logic
			//	that currently resides in init
			/**
			 * Get initial content
			 * @method _getInitialContent
			 * @member ns.router.Router
			 * @return {HTMLElement} the first page
			 * @protected
			 */
			Router.prototype._getInitialContent = function () {
				return this.getRoute("page").getFirstElement();
			};

			/**
			 * Report an error loading
			 * @method _showError
			 * @param {string} absUrl
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._showError = function (absUrl) {
				ns.error("load error, file: ", absUrl);
			};

			/**
			 * Returns Page or Popup widget
			 * @param {string} [routeName="page"] in default page or popup
			 * @method getActive
			 * @return {ns.widget.BaseWidget}
			 * @member ns.router.Router
			 */
			Router.prototype.getActive = function (routeName) {
				var route = this.getRoute(routeName || "page");

				return route && route.getActive();
			};

			/**
			 * Returns true if element in given route is active.
			 * @param {string} [routeName="page"] in default page or popup
			 * @method hasActive
			 * @return {boolean}
			 * @member ns.router.Router
			 */
			Router.prototype.hasActive = function (routeName) {
				var route = this.getRoute(routeName || "page");

				return !!(route && route.hasActive());
			};

			/**
			 * Returns true if any popup is active.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance(),
			 *			hasActivePopup = router.hasActivePopup();
			 *			// -> true | false
			 *
			 * @method hasActivePopup
			 * @return {boolean}
			 * @member ns.router.Router
			 */
			Router.prototype.hasActivePopup = function () {
				return this.hasActive("popup");
			};

			/**
			 * This function returns proper route.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance(),
			 *			route = router.getRoute("page"),
			 *			// -> Object with pages support
			 *			activePage = route.getActive();
			 *			// instance of Page widget
			 *
			 * @method getRoute
			 * @param {string} type Type of route
			 * @return {?ns.router.route.interface}
			 * @member ns.router.Router
			 */
			Router.prototype.getRoute = function (type) {
				return route[type];
			};

			/**
			 * Returns instance of loader widget.
			 *
			 * If loader not exist then is created on first element matched to selector
			 * or is created new element.
			 *
			 *	@example
			 *		var loader = router.getLoader();
			 *		// get or create loader
			 *		loader.show();
			 *		// show loader
			 *
			 * @return {?ns.widget.mobile.Loader}
			 * @member ns.router.Page
			 * @method getLoader
			 */
			Router.prototype.getLoader = function () {
				var loaderDefinition = engine.getWidgetDefinition("Loader"),
					loaderSelector = loaderDefinition.selector,
					loaderElement;

				if (loaderDefinition) {
					loaderElement = document.querySelector(loaderSelector);
					return engine.instanceWidget(loaderElement, "Loader");
				}
				return null;
			};

			/**
			 * Creates a new instance of the router and returns it
			 *
			 *	@example
			 *		var router = Router.newInstance();
			 *
			 * @method newInstance
			 * @member ns.router.Router
			 * @static
			 * @return {ns.router.Router}
			 * @since 2.4
			 */
			Router.newInstance = function () {
				return (routerInstance = new Router());
			};

			/**
			 * Returns a instance of the router, creates a new if does not exist
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance(),
			 *			// if router not exists create new instance and return
			 *			router2 = tau.router.Router.getInstance();
			 *			// only return router from first step
			 *			// router === router2
			 *
			 * @method getInstance
			 * @member ns.router.Router
			 * @return {ns.router.Router}
			 * @since 2.4
			 * @static
			 */
			Router.getInstance = function () {
				if (!routerInstance) {
					return this.newInstance();
				}
				return routerInstance;
			};

			router.Router = Router;

			Router.eventType = eventType;

			/**
			 * Returns router instance
			 * @deprecated 2,4
			 * @return {ns.router.Router}
			 */
			engine.getRouter = function () { //@TODO FIX HACK old API
				//@TODO this is suppressed since the tests are unreadable
				// tests need fixes
				ns.warn("getRouter() method is deprecated! Use tau.router.Router.getInstance() instead");
				return Router.getInstance();
			};

			if (!ns.getConfig("disableRouter", false)) {
				document.addEventListener(engine.eventType.READY, function () {
					Router.getInstance().init();
				}, false);
				document.addEventListener(engine.eventType.DESTROY, function () {
					Router.getInstance().destroy();
				}, false);
				document.addEventListener(engine.eventType.STOP_ROUTING, function () {
					Router.getInstance().destroy();
				}, false);
			}

			//engine.initRouter(Router);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return router.Router;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
