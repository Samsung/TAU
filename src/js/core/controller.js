/*global window, define, ns */
/*jslint browser: true */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Controller
 *
 * Controller is module gives developers possibility of creating MVC structure in applications.
 *
 * Developer can define own callback to custom paths.
 *
 * Module listen on all events connected to path changes and call function defined by developer
 * after new hash in url match to defined path.
 *
 * ## Defining paths
 *
 * To define custom path use method *addRoute*:
 *
 *	@example
 *	<script>
 *		var controller = tau.Controller.getInstance();
 *		controller.addRoute("page-params/:param1/:param2", function (deferred, param1, param2) {
 *			deferred.resolve(
 *				'<div data-role="page">' +
 *				'<div>param1: <strong>' + param1 + '</strong></div>' +
 *				'<div>param2: <strong>' + param2 + '</strong></div>' +
 *				'</a>'
 *			);
 *		});
 *	</script>
 *
 * When hash will change to #page-params/parameter1/parameter+2 callback will be called and param1,
 * param2 will be filled.
 *
 * In callback developer should call one method from deferred object (resolve, reject) to inform
 * controller about success or error.
 *
 * ## Working with router
 *
 * If TAU Router is loaded then controller handle path change as first and after call resolve method
 * processing in moved to router.
 * If first argument of resolve method is set then router open page given in first argument.
 *
 * @class ns.Controller
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 */
(function (document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./engine",
			"./event",
			"./util/path",
			"./util/pathToRegexp",
			"./util/object",
			"./history",
			"./history/manager"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var eventUtils = ns.event,
				util = ns.util,
				pathToRegexp = util.pathToRegexp,
				history = ns.history,
				object = util.object,
				historyManager = history.manager,
				historyManagerEvents = historyManager.events,
				EVENT_PATH_RESOLVED = "controller-path-resolved",
				EVENT_PATH_REJECTED = "controller-path-rejected",
				EVENT_CONTENT_AVAILABLE = "controller-content-available",
				Controller = function () {
					var self = this;

					/**
					 * All registered routes in controller
					 * @property {Array} _routes
					 * @protected
					 * @member ns.Controller
					 */
					self._routes = [];

					/**
					 * Callback for event statechange
					 * @property {?Function} [_onStateChange=null]
					 * @protected
					 * @member ns.Controller
					 */
					self._onStateChange = null;

					/**
					 * Last matched route
					 * @property {Array} currentRoute
					 * @protected
					 * @member ns.Controller
					 */
					self._currentRoute = null;
				},
				controllerInstance = null,
				prototype = Controller.prototype;

			/**
			 * Object contains all events names triggered by controller
			 * @property {Object} events
			 * @property {string} [events.PATH_RESOLVED="controller-path-resolved"]
			 * @property {string} [events.PATH_REJECTED="controller-path-rejected"]
			 * @property {string} [events.CONTENT_AVAILABLE="controller-content-available"]
			 * @static
			 * @member ns.Controller
			 */
			Controller.events = {
				PATH_RESOLVED: EVENT_PATH_RESOLVED,
				PATH_REJECTED: EVENT_PATH_REJECTED,
				CONTENT_AVAILABLE: EVENT_CONTENT_AVAILABLE
			};

			/**
			 * Iterates through routes, tries to find matching and executes it
			 * @param {ns.Controller} controller
			 * @param {Array} routes
			 * @param {string} path
			 * @param {Object} options
			 * @return {boolean}
			 */
			function loadRouteFromList(controller, routes, path, options) {
				// find first matched route
				return routes.some(function (route) {
					// current path match or not cut route
					var matches = route.regexp.exec(path),
						// init deferred object
						deferredTemplate = {},
						// init params array
						params;
					// if matches

					if (matches && matches.length > 0) {
						// add to deferred object method resolve
						deferredTemplate.resolve = function (content) {
							var state,
								url = options.url || options.href || "";
							// if content is available

							if (content) {
								// trigger event to router or other components which can handle content
								if (!eventUtils.trigger(document, EVENT_CONTENT_AVAILABLE, {
									content: content,
									options: options
								})) {
									// Routes save path to history and we need block saving to history by controller
									options.notSaveToHistory = true;
								}
							}
							// change URL
							//>>excludeStart("tauDebug", pragmas.tauDebug);
							ns.log("resolve with options:", options);
							//>>excludeEnd("tauDebug");
							if (!options.fromHashChange && !options.notSaveToHistory) {
								// insert to history only if not from hashchange event
								// hash change event has own history item
								state = object.merge(
									{},
									options,
									{
										url: url
									}
								);
								history.replace(state, options.title || "", url);
								history.enableVolatileMode();
							}
							eventUtils.trigger(document, EVENT_PATH_RESOLVED, options);
							// save route to current route
							controller._currentRoute = route;
							// return true to inform same method about end
							return true;
						};
						// add to deferred object method resolve
						deferredTemplate.reject = function () {
							eventUtils.trigger(document, EVENT_PATH_REJECTED, options);
						};

						// take a params
						params = matches.splice(1);
						// add to arguments deferred object on begin
						params.unshift(deferredTemplate);
						// call callback defined by developer
						route.callback.apply(null, params);

						return true;
					}

					// inform parent method that not found any route
					return false;
				});
			}

			/**
			 * Stop event propagation and prevent default
			 * @param {Event} event
			 */
			function handleEvent(event) {
				eventUtils.preventDefault(event);
				eventUtils.stopImmediatePropagation(event);
			}

			/**
			 * Callback on history state change which is trigger by history manager.
			 * @param {ns.Controller} controller
			 * @param {Event} event
			 */
			function onHistoryStateChange(controller, event) {
				var options = event.detail,
					url = options.url || options.href || "";

				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("historystatechange event:", url, options);
				//>>excludeEnd("tauDebug");

				if (options.rel === "back") {
					// call history back
					history.back();
					// stop event
					handleEvent(event);
				} else {
					// find matched route
					if (loadRouteFromList(controller, controller._routes, url.replace(/^[^#]*#/i, ""),
						options)) {
						// stop event
						handleEvent(event);
					}
				}
			}

			/**
			 * Change page to page given in parameter "to".
			 *
			 *	@example
			 *	<script>
			 *		var controller = tau.Controller.getInstance();
			 *		controller.open("new-hash");
			 *	</script>
			 * @param {string} to new hash
			 * @member ns.Controller
			 * @method open
			 * @since 2.4
			 */
			prototype.open = function (to) {
				location.hash = "#" + to;
			};

			/**
			 * Back to previous controller state
			 *
			 *	@example
			 *	<script>
			 *		var controller = tau.Controller.getInstance();
			 *		controller.back();
			 *	</script>
			 * @member ns.Controller
			 * @method back
			 * @since 2.4
			 */
			prototype.back = function () {
				history.back();
			};

			/**
			 * Adds route to routing table
			 *
			 * Developer can add custom routes to Router by *addRouter* method.
			 * The method takes two arguments, the first one is a route name and the second one is a
			 * callback method.
			 *
			 * The callback is invoked with a particularly important parameter _deferred_.
			 * Developer should handle success by calling _deferred.resolve()_
			 * and failed exception by _deferred.reject()_ method.
			 *
			 * #### Custom route with loading page from template
			 *
			 *		@example
			 *		<script>
			 *		var controller = tau.Controller.getInstance();
			 *		controller.addRoute("page-template", function (deferred) {
			 *			tau.template.render("templates/page-template.html", {}, function (status, data) {
			 *				if (status.success) {
			 *					deferred.resolve(data);
			 *				} else {
			 *					deferred.reject();
			 *				}
			 *			});
			 *		});
			 *		</script>
			 *
			 * #### Custom route with loading page from string
			 *
			 *		@example
			 *		<script>
			 *			var controller = tau.Controller.getInstance();
			 *			controller.addRoute("page-string", function (deferred) {
			 *				deferred.resolve('<div data-role="page">Hello world!</a>');
			 *			});
			 *		</script>
			 *
			 * #### Custom route with loading popup from template
			 *
			 *		@example
			 *		<script>
			 *			var controller = tau.Controller.getInstance();
			 *			controller.addRoute("popup-template", function (deferred) {
			 *				tau.template.render("templates/popup-template.html", {}, function (status, data) {
			 *					if (status.success) {
			 *						deferred.resolve(data);
			 *				} else {
			 *						deferred.reject();
			 *					}
			 *				});
			 *			});
			 *		</script>
			 *
			 * #### Custom route with creating pages on the fly
			 *
			 *		@example
			 *		<script>
			 *			var controller = tau.Controller.getInstance();
			 *			controller.addRoute("page-dynamic", function (deferred) {
			 *				var page = document.createElement("div");
			 *				page.className = "ui-page";
			 *				page.textContent = "Hello world!";
			 *				deferred.resolve(page);
			 *			});
			 *		</script>
			 *
			 * #### Method addRoute allows to define parameters provided in route
			 *
			 *		@example
			 *		<script>
			 *			var controller = tau.Controller.getInstance();
			 *			controller.addRoute("page-params/:param1/:param2",
			 *		  	function (deferred, param1, param2) {
			 *			  	deferred.resolve(
			 *				  	'<div data-role="page">' +
			 *				  	'<div>param1: <strong>' + param1 + '</strong></div>' +
			 *	  				'<div>param2: <strong>' + param2 + '</strong></div>' +
			 *		  			'</a>'
			 *			  	);
			 *			});
			 *		</script>
			 *
			 * @param {string} path
			 * @param {Function} callback
			 * @member ns.Controller
			 * @method addRoute
			 * @since 2.4
			 */
			prototype.addRoute = function (path, callback) {
				var self = this,
					// take all routes
					routes = self._routes,
					// check existing route
					pathExists = routes.some(function (value) {
						return value.path === path;
					}),
					route;
				// if path not exists in routes

				if (!pathExists) {
					// create route object
					route = {
						path: path,
						callback: callback,
						regexp: null,
						keys: []
					};
					// convert path to Regexp
					route.regexp = pathToRegexp(path, route.keys);
					// add route ro routes array
					routes.push(route);
				}
			};

			/**
			 * Removes route from routing table
			 *
			 *	@example
			 *	<script>
			 *		var controller = tau.Controller.getInstance();
			 *		controller.removeRoute("page-params/:param1/:param2");
			 *		// -> path "page-params/:param1/:param2" is removed from routes
			 *	</script>
			 * @param {string} path
			 * @member ns.Controller
			 * @method removeRoute
			 * @since 2.4
			 */
			prototype.removeRoute = function (path) {
				this._routes = this._routes.filter(function (value) {
					return value.path !== path;
				});
			};

			/**
			 * Removes routes routes from routing table
			 *
			 *	@example
			 *	<script>
			 *		var controller = tau.Controller.getInstance();
			 *		controller.removeAllRoutes();
			 *		// -> routes array will be empty
			 *	</script>
			 * @member ns.Controller
			 * @method removeRoute
			 * @since 2.4
			 */
			prototype.removeAllRoutes = function () {
				this._routes = [];
			};

			/**
			 * Initialize controller to work with history manager.
			 *
			 *	@example
			 *	<script>
			 *		var controller = tau.Controller.getInstance();
			 *		controller.init();
			 *		// -> now controller will be listen on events.
			 *	</script>
			 * @member ns.Controller
			 * @method init
			 * @since 2.4
			 */
			prototype.init = function () {
				var self = this;

				// check existing of event listener
				if (!self._onStateChange) {
					self._onStateChange = onHistoryStateChange.bind(null, self);
					window.addEventListener(historyManagerEvents.STATECHANGE, self._onStateChange, true);
				}
			};

			/**
			 * Destroy controller
			 *
			 *	@example
			 *	<script>
			 *		var controller = tau.Controller.getInstance();
			 *		controller.destroy();
			 *		// -> now controller will be not listen on events.
			 *	</script>
			 * @member ns.Controller
			 * @method destroy
			 * @since 2.4
			 */
			prototype.destroy = function () {
				var self = this;

				window.removeEventListener(historyManagerEvents.STATECHANGE, self._onStateChange, true);
				// destroy callback to give possibility to another init
				self._onStateChange = null;
			};

			/**
			 * Create new instance of controller
			 *
			 *	@example
			 *	<script>
			 *		var controller1 = tau.Controller.newInstance(),
			 *			controller2 = tau.Controller.newInstance();
			 *		// -> now you will have 2 instances of controller
			 *		// controller1 === controller2
			 *
			 *	</script>
			 * @member ns.Controller
			 * @method newInstance
			 * @since 2.4
			 */
			Controller.newInstance = function () {
				if (controllerInstance) {
					controllerInstance.destroy();
				}
				return (controllerInstance = new Controller());
			};

			/**
			 * Get existing instance of controller or create new.
			 *
			 *	@example
			 *	<script>
			 *		var controller1 = tau.Controller.newInstance(),
			 *			controller2 = tau.Controller.newInstance()	;
			 *		// -> now you will have 2 instances of controller
			 *		// controller1 !== controller2
			 *
			 * @member ns.Controller
			 * @method getInstance
			 * @since 2.4
			 */
			Controller.getInstance = function () {
				return controllerInstance || this.newInstance();
			};

			// automate init controller if isn't disabled by config
			if (!ns.getConfig("disableController", false)) {
				document.addEventListener(historyManagerEvents.ENABLED, function () {
					Controller.getInstance().init();
				});

				document.addEventListener(historyManagerEvents.DISABLED, function () {
					Controller.getInstance().destroy();
				});
			}

			ns.Controller = Controller;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Controller;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document));
