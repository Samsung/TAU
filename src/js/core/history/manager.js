/*global window, define, ns */
/*jslint browser: true, nomen: true */
/**
 * # History manager
 *
 * Control events connected with history change and trigger events to controller
 * or router.
 *
 * @class ns.history.manager
 * @since 2.4
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
/**
 * Event historystatechange
 * @event historystatechange
 * @class ns.history.manager
 */
/**
 * Event historyhashchange
 * @event historyhashchange
 * @class ns.history.manager
 */
/**
 * Event historyenabled
 * @event historyenabled
 * @class ns.history.manager
 */
/**
 * Event historydisabled
 * @event historydisabled
 * @class ns.history.manager
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../engine",
			"../event",
			"../history",
			"../event/vmouse",
			"../util",
			"../util/selectors",
			"../util/DOM",
			"../util/DOM/attributes",
			"../util/object",
			"../util/path"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var manager = Object.create(null), // we don't need the Object proto
				WINDOW_EVENT_POPSTATE = "popstate",
				WINDOW_EVENT_HASHCHANGE = "hashchange",
				DOC_EVENT_VCLICK = "vclick",
				LINK_SELECTOR = "a,tau-button",
				util = ns.util,
				history = ns.history,
				eventUtils = ns.event,
				selectorUtils = util.selectors,
				objectUtils = util.object,
				pathUtils = util.path,
				DOM = util.DOM,
				EVENT_STATECHANGE = "historystatechange",
				EVENT_HASHCHANGE = "historyhashchange",
				EVENT_ENABLED = "historyenabled",
				EVENT_DISABLED = "historydisabled",
				/**
				 * Engine event types
				 * @property {Object} events
				 * @property {string} events.STATECHANGE="historystatechange" event name on history manager change state
				 * @property {string} events.HASHCHANGE="historyhashchange" event name on history manager change hash
				 * @property {string} events.ENABLED="historyenabled" event name on enable history manager
				 * @property {string} events.DISABLED="historydisabled" event name on disable history manager
				 * @static
				 * @readonly
				 * @member ns.history.manager
				 */
				events = {
					STATECHANGE: EVENT_STATECHANGE,
					HASHCHANGE: EVENT_HASHCHANGE,
					ENABLED: EVENT_ENABLED,
					DISABLED: EVENT_DISABLED
				};

			manager.events = events;

			/**
			 * Trigger event "historystatechange" on document
			 * @param {Object} options
			 * @return {boolean}
			 */
			function triggerStateChange(options) {
				return eventUtils.trigger(document, EVENT_STATECHANGE, options, true, true);
			}

			/**
			 * Callback for link click
			 * @param {Event} event
			 * @return {boolean}
			 */
			function onLinkAction(event) {
				var target = event.target,
					link = selectorUtils.getClosestBySelector(target, LINK_SELECTOR),
					href,
					useDefaultUrlHandling,
					result = true,
					options, // this should be empty object but some utils that work on it
					rel; // require hasOwnProperty :(

				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("Link was clicked:", target.tagName || (target.documentElement && "document") + "#" + (target.id || "--no-id--"));
				//>>excludeEnd("tauDebug");
				if (link && event.which === 1) {
					href = link.getAttribute("href");
					rel = link.getAttribute("rel");
					useDefaultUrlHandling = rel === "external" || link.hasAttribute("target");
					if (!useDefaultUrlHandling) {
						options = DOM.getData(link);
						options.event = event;
						if (rel && !options.rel) {
							options.rel = rel;
						} else {
							rel = options.rel;
						}
						if (href && !options.href) {
							options.href = href;
						}
						if (rel === "popup" && !options.link) {
							options.link = link;
						}
						history.disableVolatileMode();
						// mark as handled for back button
						if (rel === "back") {
							eventUtils.preventDefault(event);
							result = false;
						}
						if (!triggerStateChange(options)) {
							// mark as handled
							eventUtils.preventDefault(event);
							result = false;
						}
					}
				}
				return result;
			}


			/**
			 * Callback on popstate event.
			 * @param {Event} event
			 */
			function onPopState(event) {
				var state = event.state,
					lastState = history.activeState,
					options = {},
					reverse,
					resultOfTrigger = true,
					skipTriggerStateChange = false;

				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("popstate event:", state && state.url, state, lastState);
				//>>excludeEnd("tauDebug");
				if (manager.locked) {
					history.disableVolatileMode();
					if (lastState) {
						history.replace(lastState, lastState.stateTitle, lastState.stateUrl);
					}
				} else if (state) {
					reverse = history.getDirection(state) === "back";
					options = objectUtils.merge(options, state, {
						reverse: reverse,
						transition: reverse ? ((lastState && lastState.transition) || "none") : state.transition,
						fromHashChange: true
					});

					if (lastState) {
						resultOfTrigger = eventUtils.trigger(document, EVENT_HASHCHANGE, objectUtils.merge(options,
							{url: pathUtils.getLocation(), stateUrl: lastState.stateUrl}), true, true);

						//>>excludeStart("tauDebug", pragmas.tauDebug);
						ns.log("after trigger EVENT_HASHCHANGE:", resultOfTrigger);
						//>>excludeEnd("tauDebug");

						// if EVENT HASHCHANGE has been triggered successfully then skip trigger HistoryStateChange
						skipTriggerStateChange = resultOfTrigger;
					}

					state.url = pathUtils.getLocation();
					history.setActive(state);

					if (!skipTriggerStateChange) {
						options.event = event;
						triggerStateChange(options);
					}
				}
			}

			/**
			 * Callback on "hashchange" event
			 * @param {Event} event
			 */
			function onHashChange(event) {
				var newURL = event.newURL;

				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("hashchange event:", newURL);
				//>>excludeEnd("tauDebug");
				if (newURL && history.activeState.url !== newURL) {
					triggerStateChange({href: newURL, fromHashChange: true, event: event});
				}
			}

			/**
			 * Inform that manager is enabled or not.
			 * @property {boolean} [enabled=true]
			 * @static
			 * @since 2.4
			 * @member ns.history.manager
			 */
			manager.enabled = true;
			/**
			 * Informs that manager is enabled or not.
			 *
			 * If manager is locked then not trigger events historystatechange.
			 * @property {boolean} [locked=false]
			 * @static
			 * @since 2.4
			 * @member ns.history.manager
			 */
			manager.locked = false;

			/**
			 * Locks history manager.
			 *
			 * Sets locked property to true.
			 *
			 *	@example
			 *		tau.history.manager.lock();
			 *
			 * @method lock
			 * @static
			 * @since 2.4
			 * @member ns.history.manager
			 */
			manager.lock = function () {
				this.locked = true;
			};

			/**
			 * Unlocks history manager.
			 *
			 * Sets locked property to false.
			 *
			 *	@example
			 *		tau.history.manager.unlock();
			 *
			 * @method unlock
			 * @static
			 * @since 2.4
			 * @member ns.history.manager
			 */
			manager.unlock = function () {
				this.locked = false;
			};

			/**
			 * Enables history manager.
			 *
			 * This method adds all event listeners connected with history manager.
			 *
			 * Event listeners:
			 *
			 *  - popstate on window
			 *  - hashchange on window
			 *  - vclick on document
			 *
			 * After set event listeners method sets property enabled to true.
			 *
			 *	@example
			 *		tau.history.manager.enable();
			 *		// add event's listeners
			 *		// after click on link or hash change history manager will handle events
			 *
			 * @method enable
			 * @static
			 * @since 2.4
			 * @member ns.history.manager
			 */
			manager.enable = function () {
				document.addEventListener(DOC_EVENT_VCLICK, onLinkAction, false);
				window.addEventListener(WINDOW_EVENT_POPSTATE, onPopState, false);
				window.addEventListener(WINDOW_EVENT_HASHCHANGE, onHashChange, false);
				history.enableVolatileMode();
				this.enabled = true;
				eventUtils.trigger(document, EVENT_ENABLED, this);
			};

			/**
			 * Disables history manager.
			 *
			 * This method removes all event listeners connected with history manager.
			 *
			 * After set event listeners method sets property enabled to true.
			 *
			 *	@example
			 *		tau.history.manager.disable();
			 *		// remove event's listeners
			 *		// after click on link or hash change history manager will not handle events
			 *
			 * @method disable
			 * @static
			 * @since 2.4
			 * @member ns.history.manager
			 */
			manager.disable = function () {
				document.removeEventListener(DOC_EVENT_VCLICK, onLinkAction, false);
				window.removeEventListener(WINDOW_EVENT_POPSTATE, onPopState, false);
				window.removeEventListener(WINDOW_EVENT_HASHCHANGE, onHashChange, false);
				history.disableVolatileMode();
				this.enabled = false;
				eventUtils.trigger(document, EVENT_DISABLED, this);
			};

			ns.history.manager = manager;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return manager;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
