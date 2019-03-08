/*global window, ns, define */
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
 * #jQuery Mobile mapping events
 * Object maps events from TAU namespace to jQuery Mobile namespace.
 * @class ns.jqm.event
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./namespace",
			"../core/engine",
			"../core/event",
			"../core/event/vmouse",
			"../core/event/orientationchange"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var eventUtils = ns.event,
				$ = ns.jqm.jQuery,
				originalTrigger,
				originalDispatch,
				eventType = {
					CLICK: "click",
					SUBMIT: "submit",
					KEYUP: "keyup",
					TOUCHSTART: "touchstart",
					TOUCHEND: "touchend",
					VCLICK: "vclick",
					MOUSEDOWN: "mousedown",
					MOUSEUP: "mouseup",
					BEFOREROUTERINIT: "beforerouterinit",
					DESTROY: "taudestroy"
				},
				registerEventNames = ["touchstart", "touchmove", "touchend", "tap", "taphold", "swipeleft", "swiperight", "scrollstart", "scrollstop"],

				event = {
					/**
					 * Create method on jQuery object with name represent event.
					 * @method proxyEventTriggerMethod
					 * @param {string} name Name of event and new method
					 * @param {Function} trigger Function called after invoke method
					 * @member ns.jqm.event
					 * @static
					 */
					proxyEventTriggerMethod: function (name, trigger) {
						$.fn[name] = function () {
							var $elements = this,
								elementsLength = $elements.length,
								i;

							for (i = 0; i < elementsLength; i++) {
								trigger($elements.get(i));
							}
						};
					},

					/**
					 * Adds proxy to jquery.trigger method
					 * @method proxyTrigger
					 * @param {string} type event type
					 * @param {Mixed} data event data
					 * @return {jQuery}
					 * @member ns.jqm.event
					 */
					proxyTrigger: function (type, data) {
						var $elements = this,
							elementsLength = $elements.length,
							i;

						if (!eventType[type.toUpperCase()]) {
							originalTrigger.call($elements, type, data);
						}

						for (i = 0; i < elementsLength; i++) {
							eventUtils.trigger($elements.get(i), type);
						}

						return this;
					},

					/**
					 * Method read additional data from event.detail and move these data as additional argument to jQuery.event.dispatch
					 * @method proxyDispatch
					 * @param {jQuery.Event} event event type
					 * @return {jQuery}
					 * @member ns.jqm.event
					 */
					proxyDispatch: function (event) {
						var data = (event.originalEvent && event.originalEvent.detail) || event.detail,
							args;

						args = [].slice.call(arguments);
						if (data) {
							args.push(data);
						}
						return originalDispatch.apply(this, args);
					},

					/**
					 * Copy properties from originalEvent.detail.* to event Object.
					 * @method copyEventProperties
					 * @param {HTMLElement} root root element to catch all events window/document
					 * @param {string} name Name of event
					 * @param {Array.<string>} properties Array of properties to copy from originalEvent to jQuery Event
					 * @member ns.jqm.event
					 * @static
					 */
					copyEventProperties: function (root, name, properties) {
						$(root).on(name, function (event) {
							var i,
								property;

							for (i = 0; i < properties.length; i++) {
								property = properties[i];
								if (!event[property]) {
									if (root instanceof window.screen.constructor) {
										// In case of orientation change event the properties are set to window.screen object
										// that's why we check if root is Screen in the first place
										event[property] = event.originalEvent.detail &&
											event.originalEvent.detail[property] ||
											event.target[property];
									} else {
										event[property] = event.originalEvent.detail && event.originalEvent.detail[property];
									}
								}
							}
						});
					},

					/**
					 * Proxy events from ns namespace to jQM namespace
					 * @method init
					 * @member ns.jqm.event
					 * @static
					 */
					init: function () {
						var removeEvents = function (event) {
								event.stopPropagation();
								event.preventDefault();
								return false;
							},
							blockedEvents = [eventType.TOUCHSTART, eventType.TOUCHEND, eventType.VCLICK, eventType.MOUSEDOWN, eventType.MOUSEUP, eventType.CLICK],
							blockedEventsLength = blockedEvents.length,
							html = document.body.parentNode;

						if ($) {
							// setup new event shortcuts
							registerEventNames.forEach(function (name) {
								$.fn[name] = function (fn) {
									return fn ? this.bind(name, fn) : this.trigger(name);
								};
								// jQuery < 1.8
								if ($.attrFn) {
									$.attrFn[name] = true;
								}
							});

							event.copyEventProperties(window.screen, "orientationchange", eventUtils.orientationchange.properties);
							event.proxyEventTriggerMethod("orientationchange", eventUtils.orientationchange.trigger);

							// Proxies jQuery's trigger method to fire swipe event
							if (originalTrigger === undefined) {
								originalTrigger = $.fn.trigger;
								$.fn.trigger = event.proxyTrigger;
							}

							if (!originalDispatch) {
								originalDispatch = $.event.dispatch;
								$.event.dispatch = event.proxyDispatch;
							}

							$.mobile = $.mobile || {};
							$.mobile.tizen = $.mobile.tizen || {};
							$.mobile.tizen.documentRelativeCoordsFromEvent = null;
							$.mobile.tizen.targetRelativeCoordsFromEvent = null;
							$.mobile.addEventBlocker = function () {
								var i;

								html.classList.add("ui-blocker");
								for (i = 0; i < blockedEventsLength; i++) {
									html.addEventListener(blockedEvents[i], removeEvents, true);
								}
							};
							$.mobile.removeEventBlocker = function () {
								var i;

								html.classList.remove("ui-blocker");
								for (i = 0; i < blockedEventsLength; i++) {
									html.removeEventListener(blockedEvents[i], removeEvents, true);
								}
							};
							$.mobile.tizen.documentRelativeCoordsFromEvent = eventUtils.documentRelativeCoordsFromEvent.bind(eventUtils);
							$.mobile.tizen.targetRelativeCoordsFromEvent = eventUtils.targetRelativeCoordsFromEvent.bind(eventUtils);
						}
					},
					/**
					 * Removes events listeners on destroy of framework.
					 */
					destroy: function () {
						document.removeEventListener(eventType.BEFOREROUTERINIT, event.init, false);
						document.removeEventListener(eventType.DESTROY, event.destroy, false);
					}
				};

			// Listen when framework is ready
			document.addEventListener(eventType.BEFOREROUTERINIT, event.init, false);
			document.addEventListener(eventType.DESTROY, event.destroy, false);

			ns.jqm.event = event;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm.event;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
