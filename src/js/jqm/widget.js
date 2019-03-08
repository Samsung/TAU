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
 * #jQuery Mobile mapping widget
 * Object maps widgets from TAU namespace to jQuery Mobile namespace.
 * @class ns.jqm.widget
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./namespace",
			"../core/engine",
			"../core/widget/BaseWidget",
			"../core/util/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Alias to Array.slice function
			 * @method slice
			 * @member ns.jqm.widget
			 * @private
			 * @static
			 */
			var slice = [].slice,
				$ = ns.jqm.jQuery,
				/**
				 * Wrap function in closure and wrap first argument in jquery object
				 * @param {Function} fn
				 */
				wrapFn = function (fn) {
					return function (el) {
						return fn($(el));
					};
				},
				/**
				 * Alias to ns.engine
				 * @member ns.jqm
				 * @private
				 * @static
				 */
				engine = ns.engine,
				object = ns.util.object,
				jqmWidget = {
					/**
					 * bind widget to jqm
					 * @method init
					 * @param {Object} engine ns.engine class
					 * @param {Object} definition widget definition
					 * @member ns.jqm.widget
					 * @static
					 */
					init: function (engine, definition) {
						var name = (definition.widgetNameToLowercase) ?
							definition.name.toLowerCase() :
							definition.name;

						if ($) {
							document.addEventListener(name + "create", function (event) {
								var element = event.target,
									instance = event.detail,
									data = $(element).data(name);

								if (instance) {
									instance.bindings = {};
									instance.hoverable = {};
									instance.focusable = {};
									instance.document = $(element.style ? element.ownerDocument : element.document || element);
									instance.window = $(instance.document[0].defaultView || instance.document[0].parentWindow);
									object.merge(instance, data);
									$(element).data(name, instance);
								}
							}, true);
							this.processDefinition(definition, engine);
						}
					},

					/**
					 * bind widget to jqm
					 * @method processDefinition
					 * @param {Object} definition widget definition
					 * @param {Object} engine ns.engine class
					 * @member ns.jqm.widget
					 * @static
					 */
					processDefinition: function (definition, engine) {
						/*
						 * name of widget
						 * type string
						 */
						var name = (definition.widgetNameToLowercase) ?
								definition.name.toLowerCase() :
								definition.name,
							/*
							 * list of public methods
							 * type Array
							 */
							methods = definition.methods;

						$.fn[name] = widgetConstructor(engine, name, methods, definition.name);
						if (definition.namespace) {
							$[definition.namespace] = $[definition.namespace] || {};
							$[definition.namespace][definition.name.toLowerCase()] = definition.widgetClass;
						}
						definition = null;
					}
				},
				eventType = engine.eventType;

			function widgetConstructor(engine, name, methods, instanceWidgetName) {
				/*
				 * widget instance
				 * type Object
				 */
				var instance = null;

				return function () {
					/*
					 * function arguments
					 * type Array
					 */
					var args = slice.call(arguments),
						/*
						 * element of jQuery collection
						 * type HTMLElement
						 */
						element,
						/*
						 * is built?
						 * type Boolean
						 */
						built,
						/*
						 * name of method
						 * type string
						 */
						method,
						/*
						 * result value
						 * type mixed
						 */
						resultValue,
						/*
						 * first argument of function
						 * type mixed
						 */
						firstArg,
						i,
						options = {};

					/*
					 * NOTE:
					 * The loop below contains some fixes/hacks for TizenSlider, Listview with FastScroll and AutoDividers
					 * and also Popup, please be aware while refactoring.
					 */
					for (i = 0; i < this.length; i++) {
						element = this.get(i);
						switch (name) {
							case "slider":
								instance = engine.getBinding(element, "Slider") || engine.getBinding(element, "TizenSlider");
								break;
							default:
								instance = engine.getBinding(element, instanceWidgetName);
						}

						built = instance && instance.isBuilt();
						firstArg = args.shift();
						if (firstArg === undefined || typeof firstArg === "object") {
							if (typeof firstArg === "object") {
								options = firstArg;
							}
							if (!instance || !built) {
								engine.instanceWidget(element, instanceWidgetName, options);
							} else {
								instance.option(options);
							}
						} else {
							if (instance === null) {
								return this;
							}
							method = firstArg;
							if (method === "destroy") {
								instance.destroy();
								return this;
							}
							if (methods.indexOf(method) < 0) {
								throw "Method " + method + " does not exist!";
							}
							if (name === "listview" &&
								method === "option" &&
								args[0] === "autodividersSelector" &&
								typeof args[1] === "function") {
								// wrap first argument of callback method in JQuery object
								args[1] = wrapFn(args[1]);
							}
							if (name === "popup" && method === "open") {
								// window.event is used because in Winset we open context popup by
								// $("#pop_text_only").popup("open") after clicking on input
								args[1] = window.event;
							}

							resultValue = instance[method].apply(instance, args);
							if (resultValue !== undefined) {
								if (resultValue !== instance) {
									return resultValue;
								}
							}
						}
					}
					return this;
				};
			}

			/**
			 * Callback for event widgetdefined, register widget in jqm namespace
			 * @param {Event} event
			 */
			function defineWidget(event) {
				jqmWidget.init(engine, event.detail);
			}

			/**
			 * Removes event listeners on framework destroy.
			 */
			function destroy() {
				document.removeEventListener(eventType.WIDGET_DEFINED, defineWidget, false);
				document.removeEventListener(eventType.INIT, defineOldWidgets, false);
				document.removeEventListener(eventType.DESTROY, destroy, false);
			}

			/**
			 * Define widgets which names was changed for backward capability.
			 */
			function defineOldWidgets() {
				engine.defineWidget(
					"FixedToolbar",
					"",
					[],
					ns.widget.Page,
					"mobile"
				);
				engine.defineWidget(
					"pagelayout",
					"",
					[],
					ns.widget.Page,
					"mobile"
				);
				engine.defineWidget(
					"popupwindow",
					"",
					[],
					ns.widget.Popup,
					"tizen"
				);
				engine.defineWidget(
					"ctxpopup",
					"",
					[],
					ns.widget.Popup,
					"tizen"
				);
			}

			document.addEventListener(eventType.WIDGET_DEFINED, defineWidget, false);
			document.addEventListener(eventType.INIT, defineOldWidgets, false);
			document.addEventListener(eventType.DESTROY, destroy, false);

			ns.jqm.widget = jqmWidget;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm.widget;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
