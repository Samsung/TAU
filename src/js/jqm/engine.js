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
 * #jQuery Mobile mapping engine
 * Object maps engine object from TAU namespace to jQuery Mobile namespace.
 * @class ns.jqm.engine
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./namespace",
			"../core/engine",
			"../core/util/selectors",
			"../core/util/globalize",
			"../core/util/object",
			"../core/event",
			"../core/util/zoom",
			"../core/util/load",
			"../core/frameworkData"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Alias to Array.slice function
			 * @method slice
			 * @member ns.jqm.engine
			 * @private
			 * @static
			 */
			var slice = [].slice,
				/**
				 * @property {Object} nsNormalizeDict directory of data-* attributes normalized name
				 * @member ns.jqm.engine
				 * @private
				 * @static
				 */
				nsNormalizeDict = {},
				$ = ns.jqm.jQuery,
				util = ns.util,
				zoom = util.zoom,
				events = ns.event,
				load = util.load,
				utilsObject = util.object,
				/*
				 * Convert jQuery object to HTMLElement or Array of HTMLElements
				 * @param {jQuery|HTMLElement|Array} item
			   * @return {HTMLElement|Array}
				 */
				mapItem = function (item) {
					if (typeof item === "object" && item.selector && item.get) {
						return item.length === 1 ? item.get(0) : item.toArray();
					}

					return item;
				},
				engine = ns.engine,
				eventType = engine.eventType,

			/**
			 * append ns functions to jQuery Mobile namespace
			 * @method init
			 * @member ns.jqm.engine
			 * @static
			 */
				init = function () {
					var keys = Object.keys(engine),
						i,
						len,
						name,
						/*
						 * original jQuery find function
						 * type function
						 */
						oldFind,
						/*
						 * regular expression to find data-{namespace}-attribute
						 */
						jqmDataRE = /:jqmData\(([^)]*)\)/g, // @TODO fix, insecure (jslint)
						/*
						 * string to detect exists jqmData selector
						 */
						jqmDataStr = ":jqmData",


						tizen;

					if ($) {

						for (i = 0, len = keys.length; i < len; ++i) {
							name = keys[i];
							$[name] = widgetFunction.bind(null, arguments, mapItem, engine, name);
						}

						utilsObject.merge($.mobile, {
							/*
							 * jQuery Mobile namespace
							 */
							ns: "",
							/**
							 *
							 * @param {string} prop
							 * @return {?string}
							 */
							nsNormalize: function (prop) {
								if (!prop) {
									return null;
								}
								nsNormalizeDict[prop] = nsNormalizeDict[prop] || $.camelCase($.mobile.ns + prop);
								return nsNormalizeDict[prop];
							},
							activeBtnClass: ns.widget.core.Button.classes.uiBtnActive,
							activePageClass: ns.widget.core.Page.classes.uiPageActive,
							focusClass: ns.widget.core.Button.classes.uiFocus,
							version: "1.2.0",
							getAttrFixed: function (element, key) {
								var value = element.getAttribute(key);

								return value === "true" ? true :
									value === "false" ? false :
										value === null ? undefined :
											value;
							},
							path: ns.util.path,
							back: window.history.back.bind(window.history),
							silentScroll: function (yPos) {
								if (yPos === undefined) {
									yPos = $.mobile.defaultHomeScroll;
								}

								// prevent scrollstart and scrollstop events
								// @TODO enable event control
								//ns.event.special.scrollstart.enabled = false;

								setTimeout(function () {
									window.scrollTo(0, yPos);
									events.trigger(document, "silentscroll", {x: 0, y: yPos});
								}, 20);

								setTimeout(function () {
									// @TODO enable event control
									//$.event.special.scrollstart.enabled = true;
								}, 150);
							},
							nsNormalizeDict: nsNormalizeDict,
							closestPageData: function (target) {
								var page = ns.util.selectors.getClosestBySelector($(target)[0],
									"[data-" + ($.mobile.ns || "") + "role='page'], [data-" + ($.mobile.ns || "") + "role='dialog']");

								return ns.engine.instanceWidget(page, "Page");
							},
							enhanceable: function ($set) {
								return this.haveParents($set, "enhance");
							},
							hijackable: function ($set) {
								return this.haveParents($set, "ajax");
							},
							haveParents: function ($set, attr) {
								var count = 0,
									$newSet = null,
									e,
									$element,
									excluded,
									i,
									c;

								if (!$.mobile.ignoreContentEnabled) {
									return $set;
								}

								count = $set.length;
								$newSet = $();

								for (i = 0; i < count; i++) {
									$element = $set.eq(i);
									excluded = false;
									e = $set[i];

									while (e) {
										c = e.getAttribute ? e.getAttribute("data-" + $.mobile.ns + attr) : "";

										if (c === "false") {
											excluded = true;
											break;
										}

										e = e.parentNode;
									}

									if (!excluded) {
										$newSet = $newSet.add($element);
									}
								}

								return $newSet;
							},
							getScreenHeight: function () {
								// Native innerHeight returns more accurate value for this across platforms,
								// jQuery version is here as a normalized fallback for platforms like Symbian
								return window.innerHeight;
							},
							widget: function () {
								// @todo fill data
								return null;
							},
							media: ns.support.media,
							browser: {},
							gradeA: function () {
								// @todo fill data
								return null;
							},
							zoom: zoom,
							popupwindow: {}
						});
						$.mobile.buttonMarkup = $.mobile.buttonMarkup || ns.widget.mobile.Button;
						$.mobile.$window = $(window);
						$.mobile.$document = $(document);
						$.mobile.keyCode = {
							ALT: 18,
							BACKSPACE: 8,
							CAPS_LOCK: 20,
							COMMA: 188,
							COMMAND: 91,
							COMMAND_LEFT: 91, // COMMAND
							COMMAND_RIGHT: 93,
							CONTROL: 17,
							DELETE: 46,
							DOWN: 40,
							END: 35,
							ENTER: 13,
							ESCAPE: 27,
							HOME: 36,
							INSERT: 45,
							LEFT: 37,
							MENU: 93, // COMMAND_RIGHT
							NUMPAD_ADD: 107,
							NUMPAD_DECIMAL: 110,
							NUMPAD_DIVIDE: 111,
							NUMPAD_ENTER: 108,
							NUMPAD_MULTIPLY: 106,
							NUMPAD_SUBTRACT: 109,
							PAGE_DOWN: 34,
							PAGE_UP: 33,
							PERIOD: 190,
							RIGHT: 39,
							SHIFT: 16,
							SPACE: 32,
							TAB: 9,
							UP: 38,
							WINDOWS: 91 // COMMAND
						};
						$.tizen = $.tizen || {};
						tizen = $.tizen;
						tizen.globalize = ns.util.globalize;
						$.mobile.tizen = utilsObject.merge($.mobile.tizen, {
							_widgetPrototypes: {},
							disableSelection: function () {
								ns.warn("Function $.mobile.tizen.disableSelection is deprecated");
							},
							enableSelection: function () {
								ns.warn("Function $.mobile.tizen.enableSelection is deprecated");
							},
							enableContextMenu: function () {
								ns.warn("Function $.mobile.tizen.enableContextMenu is deprecated");
							},
							disableContextMenu: function () {
								ns.warn("Function $.mobile.tizen.disableContextMenu is deprecated");
							}
						});
						$.mobile.tizen.loadPrototype = null;

						/*
						 * jqmData function from jQuery Mobile
						 */
						$.fn.jqmData = function (prop, value) {
							var result;

							if (prop !== undefined) {
								if (prop) {
									prop = $.mobile.nsNormalize(prop);
								}
								if (arguments.length < 2 || value === undefined) {
									result = this.data(prop);
								} else {
									result = this.data(prop, value);
								}
							}
							return result;
						};

						$.fn.jqmRemoveData = function (prop) {
							if (prop !== undefined) {
								if (prop) {
									prop = $.mobile.nsNormalize(prop);
								}
								this.removeData(prop);
							}
							return this;
						};

						$.jqmData = function (context, prop, value) {
							var result = $(context).jqmData(prop, value);

							return value || result;
						};

						$.jqmRemoveData = function (context, prop) {
							$(context).jqmRemoveData(prop);
						};

						$.fn.removeWithDependents = function () {
							$.removeWithDependents(this);
						};

						$.removeWithDependents = function (elem) {
							var $elem = $(elem);

							($elem.jqmData("dependents") || $()).remove();
							$elem.remove();
						};

						$.fn.addDependents = function (newDependents) {
							$.addDependents($(this), newDependents);
						};

						$.addDependents = function (elem, newDependents) {
							var dependents = $(elem).jqmData("dependents") || $();

							$(elem).jqmData("dependents", $.merge(dependents, newDependents));
						};

						$.fn.getEncodedText = function () {
							return $("<div/>").text($(this).text()).html();
						};

						// fluent helper function for the mobile namespaced equivalent
						$.fn.jqmEnhanceable = function () {
							return $.mobile.enhanceable(this);
						};

						$.fn.jqmHijackable = function () {
							return $.mobile.hijackable(this);
						};

						/*
						 * Add support of jqmData() in jQuery find
						 */
						oldFind = $.find;

						$.find = function (selector, context, ret, extra) {
							if (selector.indexOf(jqmDataStr) > -1) {
								selector = selector.replace(jqmDataRE, "[data-" + ($.mobile.ns || "") + "$1]");
							}
							return oldFind.call(this, selector, context, ret, extra);
						};

						$.extend($.find, oldFind);

						$.find.matches = function (expr, set) {
							return $.find(expr, null, null, set);
						};

						$.find.matchesSelector = function (node, expr) {
							return $.find(expr, null, null, [node]).length > 0;
						};

						/* support for global object $.mobile
						 * @TODO this is temporary fix, we have to think about this function
						 */
						$(document).bind("create", ns.engine._createEventHandler);
						// support creating widgets by triggering pagecreate
						$(document).bind("pagecreate", function (event) {
							var originalEvent = event.originalEvent || event,
								isPage = originalEvent.detail instanceof ns.widget.core.Page,
								pageWidget;

							if (!isPage) { // trigger create when the pagecreate trigger is from outside
								pageWidget = engine.instanceWidget(originalEvent.target, "Page");
								pageWidget.refresh();
								ns.engine._createEventHandler(originalEvent);
							}
						});
						$(document).bind("activePopup", function (event) {
							$.mobile.popup.active = $.mobile.popupwindow.active = event.originalEvent.detail;
						});

						// @TODO fill this object proper data
						$.tizen.frameworkData = ns.frameworkData;

						$.tizen.__tizen__ = tizen;
						tizen.libFileName = "tizen-web-ui-fw(.custom|.full)?(.min)?.js";
						tizen.log = {
							debug: function (msg) {
								if ($.tizen.frameworkData.debug) {
									ns.log(msg);
								}
							},
							warn: ns.warn.bind(ns),
							error: ns.error.bind(ns),
							alert: window.alert.bind(window)
						};
						tizen.util = {
							loadScriptSync: load.scriptSync,
							isMobileBrowser: function () {
								ns.warn("Function $.tizen.__tizen__.util.isMobileBrowser is deprecated");
							}
						};
						tizen.css = {
							cacheBust: load.cacheBust,
							addElementToHead: load.addElementToHead.bind(load),
							makeLink: load.makeLink.bind(load),
							load: load.themeCSS
						};
						tizen.loadTheme = function () {
							ns.warn("Function $.tizen.__tizen__.loadTheme is deprecated");
						};
						//tizen.loadGlobalizeCulture = ns.util.globalize.loadGlobalizeCulture.bind(ns.util.globalize);
						tizen.setLocale = util.globalize.setLocale;
						tizen.setViewport = function () {
							ns.warn("Function $.tizen.__tizen__.setViewport is deprecated");
						};
						tizen.scaleBaseFontSize = function () {
							ns.warn("Function $.tizen.__tizen__.scaleBaseFontSize is deprecated");
						};
						tizen.setScaling = function () {
							ns.warn("Function $.tizen.__tizen__.setScaling is deprecated");
						};
						tizen.getParams = ns.frameworkData.getParams.bind(ns.frameworkData);

						ns.setConfig("enableHWKeyHandler", $.mobile.tizen.enableHWKeyHandler);
					}
				},
				/**
				 * Removes events listeners on destroy of framework.
				 */
				destroy = function () {
					document.removeEventListener(eventType.INIT, init, false);
					document.removeEventListener(eventType.DESTROY, destroy, false);
				};

			/**
			 * Function which is used as jQuery mapping engine method
			 * @param {Arguments} parentArguments
			 * @param {Function} mapItem
			 * @param {Object} engine
			 * @param {string} name
			 */
			function widgetFunction(parentArguments, mapItem, engine, name) {
				var args = slice.call(parentArguments).map(mapItem);

				engine[name].apply(engine, args);
			}

			// Listen when framework is ready
			document.addEventListener(eventType.INIT, init, false);
			document.addEventListener(eventType.DESTROY, destroy, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm.engine;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
