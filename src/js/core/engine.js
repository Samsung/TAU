/*global window, define, ns, Node */
/*jslint nomen: true, plusplus: true, bitwise: false */
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
 *
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Engine
 * Main class with engine of library which control communication
 * between parts of framework.
 * @class ns.engine
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Michal Szepielak <m.szepielak@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Przemyslaw Ciezkowski <p.ciezkowski@samsung.com>
 * @author Hyunkook, Cho <hk0713.cho@samsung.com>
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 * @author Piotr Ostalski <p.ostalski@samsung.com>
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"require",
			"./core",
			"./event",
			"./util/selectors",
			"./util/object",
			"./util/array"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var slice = [].slice,
				/**
				 * @property {Object} eventUtils {@link ns.event}
				 * @private
				 * @static
				 * @member ns.engine
				 */
				eventUtils = ns.event,
				util = ns.util,
				objectUtils = util.object,
				selectors = util.selectors,
				arrayUtils = ns.util.array,
				/**
				 * @property {Object} widgetDefinitions Object with widgets definitions
				 * @private
				 * @static
				 * @member ns.engine
				 */
				widgetDefinitions = {},
				/**
				 * @property {Object} widgetBindingMap Object with widgets bindings
				 * @private
				 * @static
				 * @member ns.engine
				 */
				widgetBindingMap = {},
				location = window.location,
				/**
				 * engine mode, if true then engine only builds widgets
				 * @property {boolean} justBuild
				 * @private
				 * @static
				 * @member ns.engine
				 */
				justBuild = location.hash === "#build",
				/**
				 * @property {string} [TYPE_STRING="string"] local cache of string type name
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				TYPE_STRING = "string",
				/**
				 * @property {string} [TYPE_FUNCTION="function"] local cache of function type name
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				TYPE_FUNCTION = "function",
				/**
				 * @property {string} [DATA_BUILT="data-tau-built"] attribute informs that widget id build
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				DATA_BUILT = "data-tau-built",
				/**
				 * @property {string} [DATA_NAME="data-tau-name"] attribute contains widget name
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				DATA_NAME = "data-tau-name",
				/**
				 * @property {string} [DATA_BOUND="data-tau-bound"] attribute informs that widget id bound
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				DATA_BOUND = "data-tau-bound",
				/**
				 * @property {string} [DATA_WIDGET_WRAPPER="data-tau-wrapper"] attribute informs that widget has wrapper
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				DATA_WIDGET_WRAPPER = "data-tau-wrapper",
				/**
				 * @property {string} NAMES_SEPARATOR
				 * @private
				 * @static
				 * @readonly
				 */
				NAMES_SEPARATOR = ",",
				/**
				 * @property {string} [querySelectorWidgets="*[data-tau-built][data-tau-name]:not([data-tau-bound])"] query selector for all widgets which are built but not bound
				 * @private
				 * @static
				 * @member ns.engine
				 */
				querySelectorWidgets = "*[" + DATA_BUILT + "][" + DATA_NAME + "]:not([" + DATA_BOUND + "])",
				/**
				 * @method excludeBuildAndBound
				 * @private
				 * @static
				 * @param {string} widgetType
				 * @member ns.engine
				 * @return {string} :not([data-tau-built*='widgetName']):not([data-tau-bound*='widgetName'])
				 */
				excludeBuiltAndBound = function (widgetType) {
					return ":not([" + DATA_BUILT + "*='" + widgetType + "']):not([" + DATA_BOUND + "*='" + widgetType + "'])";
				},

				/**
				 * Engine event types
				 * @property {Object} eventType
				 * @property {string} eventType.INIT="tauinit" INIT of framework init event
				 * @property {string} eventType.WIDGET_BOUND="widgetbound" WIDGET_BOUND of widget bound event
				 * @property {string} eventType.WIDGET_DEFINED="widgetdefined" WIDGET_DEFINED of widget built event
				 * @property {string} eventType.WIDGET_BUILT="widgetbuilt" WIDGET_BUILT of widget built event
				 * @property {string} eventType.BOUND="bound" BOUND of bound event
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				eventType = {
					INIT: "tauinit",
					READY: "tauready",
					WIDGET_BOUND: "widgetbound",
					WIDGET_DEFINED: "widgetdefined",
					WIDGET_BUILT: "widgetbuilt",
					DESTROY: "taudestroy",
					BOUND: "bound",
					WIDGET_INIT: "init",
					STOP_ROUTING: "tauroutingstop"
				},
				engine;

			/**
			 * This function prepares selector for widget' definition
			 * @method selectorChange
			 * @param {string} selectorName
			 * @return {string} new selector
			 * @member ns.engine
			 * @static
			 */
			function selectorChange(selectorName) {
				if (selectorName.match(/\[data-role=/) && !selectorName.match(/:not\(\[data-role=/)) {
					return selectorName.trim();
				}
				return selectorName.trim() + ":not([data-role='none'])";
			}

			/**
			 * Function to define widget
			 * @method defineWidget
			 * @param {string} name
			 * @param {string} selector
			 * @param {Array} methods
			 * @param {Object} widgetClass
			 * @param {string} [namespace]
			 * @param {boolean} [redefine]
			 * @param {boolean} [widgetNameToLowercase=true]
			 * @return {boolean}
			 * @member ns.engine
			 * @static
			 */
			function defineWidget(name, selector, methods, widgetClass, namespace, redefine, widgetNameToLowercase, BaseElement, buildOptions) {
				var definition;
				// Widget name is absolutely required

				buildOptions = buildOptions || {};
				if (name) {
					if (!widgetDefinitions[name] || redefine) {
						//>>excludeStart("tauDebug", pragmas.tauDebug);
						ns.log("defining widget:", name);
						//>>excludeEnd("tauDebug");
						methods = methods || [];
						methods.push("destroy", "disable", "enable", "option", "refresh", "value");
						definition = {
							name: name,
							methods: methods,
							selector: selector || "",
							selectors: selector ? selector.split(",").map(selectorChange) : [],
							widgetClass: widgetClass || null,
							namespace: namespace || "",
							widgetNameToLowercase: widgetNameToLowercase === undefined ? true : !!widgetNameToLowercase,
							BaseElement: BaseElement,
							buildOptions: buildOptions
						};

						widgetDefinitions[name] = definition;
						if (namespace) {
							widgetDefinitions[namespace + "." + name] = definition;
						}
						eventUtils.trigger(document, "widgetdefined", definition, false);
						return true;
					}
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.warn("Widget already defined:", name);
					//>>excludeEnd("tauDebug");
				} else {
					ns.error("Widget with selector [" + selector + "] defined without a name, aborting!");
				}
				return false;
			}


			/**
			 * Get widget instance from binding for given element and type
			 * @method getInstanceByElement
			 * @static
			 * @param {Object} binding
			 * @param {HTMLElement} element
			 * @param {string} [type] widget name, if is empty then return first built widget
			 * @return {?Object}
			 * @member ns.engine
			 */
			function getInstanceByElement(binding, element, type) {
				var widgetInstance,
					bindingElement,
					storedWidgetNames,
					names = type ? type.split(".") : [],
					name = names.pop(),
					namespace = names.pop();

				// If name is defined it's possible to fetch it instantly
				if (name) {
					widgetInstance = binding.instances[name];
				} else {
					storedWidgetNames = Object.keys(binding.instances);
					widgetInstance = binding.instances[storedWidgetNames[0]];
				}

				if (namespace && widgetInstance && widgetInstance.namespace !== namespace) {
					widgetInstance = null;
				}

				// Return only it instance of the proper widget exists
				if (widgetInstance) {
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					// NOTE: element can exists outside document
					bindingElement = widgetInstance.element;
					if (bindingElement && !bindingElement.ownerDocument.getElementById(bindingElement.id)) {
						ns.warn("Element ", bindingElement.tagName.toLowerCase() + "#" + bindingElement.id, " is outside DOM!");
					}
					//>>excludeEnd("tauDebug");

					// Check if widget instance has that same object referenced
					if (widgetInstance.element === element) {
						return widgetInstance;
					}
				}

				return null;
			}

			/**
			 * Filter children with DATA_BUILT attribute
			 * @param {HTMLElement} child
			 * @private
			 */
			function filterBuiltWidget(child) {
				return child.hasAttribute(DATA_BUILT);
			}

			/**
			 * Get binding for element
			 * @method getBinding
			 * @static
			 * @param {HTMLElement|string} element
			 * @param {string} [type] widget name
			 * @return {?Object}
			 * @member ns.engine
			 */
			function getBinding(element, type) {
				var id = !element || typeof element === TYPE_STRING ? element : element.id,
					binding,
					baseElement;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(id);
				}

				if (element) {
					// Fetch group of widget defined for this element
					binding = widgetBindingMap[id];

					if (binding && typeof binding === "object") {
						return getInstanceByElement(binding, element, type);
					} else {
						// Check if widget has wrapper and find base element
						if (typeof element.hasAttribute === TYPE_FUNCTION &&
								element.hasAttribute(DATA_WIDGET_WRAPPER)) {
							baseElement = slice.call(element.children).filter(filterBuiltWidget)[0];
							if (baseElement) {
								return getBinding(baseElement, type);
							}
						}
					}
				}

				return null;
			}

			/**
			 * Set binding of widget
			 * @method setBinding
			 * @param {ns.widget.BaseWidget} widgetInstance
			 * @static
			 * @member ns.engine
			 */
			function setBinding(widgetInstance) {
				var id = widgetInstance.element.id,
					type = widgetInstance.name,
					widgetBinding = widgetBindingMap[id];

				//>>excludeStart("tauDebug", pragmas.tauDebug);
				if (getBinding(id, type)) {
					ns.error("Duplicated, binding. Binding on id " + id + " was overwritten.");
				}
				//>>excludeEnd("tauDebug");

				// If the HTMLElement never had a widget declared create an empty object
				if (!widgetBinding) {
					widgetBinding = {
						elementId: id,
						element: widgetInstance.element,
						instances: {}
					};
				}

				widgetBinding.instances[type] = widgetInstance;
				widgetBindingMap[id] = widgetBinding;
			}

			/**
			 * Returns all bindings for element or id gives as parameter
			 * @method getAllBindings
			 * @param {HTMLElement|string} element
			 * @return {?Object}
			 * @static
			 * @member ns.engine
			 */
			function getAllBindings(element) {
				var id = !element || typeof element === TYPE_STRING ? element : element.id;

				return (widgetBindingMap[id] && widgetBindingMap[id].instances) || null;
			}

			/**
			 * Removes given name from attributeValue string.
			 * Names should be separated with a NAMES_SEPARATOR
			 * @param {string} name
			 * @param {string} attributeValue
			 * @private
			 * @static
			 * @return {string}
			 */
			function _removeWidgetNameFromAttribute(name, attributeValue) {
				var widgetNames,
					searchResultIndex;

				// Split attribute value by separator
				widgetNames = attributeValue.split(NAMES_SEPARATOR);
				searchResultIndex = widgetNames.indexOf(name);

				if (searchResultIndex > -1) {
					widgetNames.splice(searchResultIndex, 1);
					attributeValue = widgetNames.join(NAMES_SEPARATOR);
				}

				return attributeValue;
			}

			function _removeAllBindingAttributes(element) {
				element.removeAttribute(DATA_BUILT);
				element.removeAttribute(DATA_BOUND);
				element.removeAttribute(DATA_NAME);
			}

			/**
			 * Remove binding data attributes for element.
			 * @method _removeBindingAttributes
			 * @param {HTMLElement} element
			 * @param {string} type widget type (name)
			 * @private
			 * @static
			 * @member ns.engine
			 */
			function _removeWidgetFromAttributes(element, type) {
				var dataBuilt,
					dataBound,
					dataName;

				// Most often case is that name is not defined
				if (!type) {
					_removeAllBindingAttributes(element);
				} else {
					dataBuilt = _removeWidgetNameFromAttribute(type, element.getAttribute(DATA_BUILT) || "");
					dataBound = _removeWidgetNameFromAttribute(type, element.getAttribute(DATA_BOUND) || "");
					dataName = _removeWidgetNameFromAttribute(type, element.getAttribute(DATA_NAME) || "");

					// Check if all attributes have at least one widget
					if (dataBuilt && dataBound && dataName) {
						element.setAttribute(DATA_BUILT, dataBuilt);
						element.setAttribute(DATA_BOUND, dataBound);
						element.setAttribute(DATA_NAME, dataName);
					} else {
						// If something is missing remove everything
						_removeAllBindingAttributes(element);
					}
				}
			}

			/**
			 * Method removes binding for single widget.
			 * @method _removeSingleBinding
			 * @param {Object} bindingGroup
			 * @param {string} type
			 * @return {boolean}
			 * @private
			 * @static
			 */
			function _removeSingleBinding(bindingGroup, type) {
				var widgetInstance = bindingGroup[type];

				if (widgetInstance) {
					if (widgetInstance.element && typeof widgetInstance.element.setAttribute === TYPE_FUNCTION) {
						_removeWidgetFromAttributes(widgetInstance.element, type);
					}

					delete bindingGroup[type];

					return true;
				}

				return false;
			}

			/**
			 * Remove group of bindings for all types of widgets based on the same element
			 * @method removeGroupBindingAllTypes
			 * @param {Object} bindingGroup
			 * @param {string} id widget element id
			 * @return {boolean}
			 * @static
			 * @member ns.engine
			 */
			function removeGroupBindingAllTypes(bindingGroup, id) {
				var singleSuccess,
					widgetName,
					fullSuccess = true;

				// Iterate over group of created widgets
				for (widgetName in bindingGroup) {
					if (bindingGroup.hasOwnProperty(widgetName)) {
						singleSuccess = _removeSingleBinding(bindingGroup, widgetName);
						//>>excludeStart("tauDebug", pragmas.tauDebug);
						if (!singleSuccess) {
							ns.error("Not every widget binding has been removed. Failed for: " + widgetName);
						}
						//>>excludeEnd("tauDebug");

						// As we iterate over keys we are sure we want to remove this element
						// NOTE: Removing property by delete is slower than assigning null value
						bindingGroup[widgetName] = null;

						fullSuccess = (fullSuccess && singleSuccess);
					}
				}

				// If the object bindingGroup is empty or every key has a null value
				if (objectUtils.hasPropertiesOfValue(bindingGroup, null)) {
					// NOTE: Removing property by delete is slower than assigning null value
					widgetBindingMap[id] = null;
				}

				return fullSuccess;
			}

			/**
			 * Remove group of bindings for widgets based on the same element
			 * @method removeGroupBinding
			 * @param {Object} bindingGroup
			 * @param {string} type object name
			 * @param {string} id widget element id
			 * @return {boolean}
			 * @static
			 * @member ns.engine
			 */
			function removeGroupBinding(bindingGroup, type, id) {
				var success;

				if (!type) {
					success = removeGroupBindingAllTypes(bindingGroup, id);
				} else {
					success = _removeSingleBinding(bindingGroup, type);
					if (objectUtils.hasPropertiesOfValue(bindingGroup, null)) {
						widgetBindingMap[id] = null;
					}
				}
				return success;
			}

			/**
			 * Remove binding for widget based on element.
			 * @method removeBinding
			 * @param {HTMLElement|string} element
			 * @param {?string} [type=null] widget name
			 * @return {boolean}
			 * @static
			 * @member ns.engine
			 */
			function removeBinding(element, type) {
				var id = (typeof element === TYPE_STRING) ? element : element.id,
					binding = widgetBindingMap[id],
					bindingGroup;

				// [NOTICE] Due to backward compatibility calling removeBinding
				// with one parameter should remove all bindings

				if (binding) {
					if (typeof element === TYPE_STRING) {
						// Search based on current document may return bad results,
						// use previously defined element if it exists
						element = binding.element;
					}

					if (element) {
						_removeWidgetFromAttributes(element, type);
					}

					bindingGroup = widgetBindingMap[id] && widgetBindingMap[id].instances;
					if (bindingGroup) {
						return removeGroupBinding(bindingGroup, type, id);
					}

					if (widgetBindingMap[id].instances && (Object.keys(widgetBindingMap[id].instances).length === 0)) {
						widgetBindingMap[id] = null;
					}
				}

				return false;
			}

			/**
			 * Removes all bindings of widgets.
			 * @method removeAllBindings
			 * @param {HTMLElement|string} element
			 * @return {boolean}
			 * @static
			 * @member ns.engine
			 */
			function removeAllBindings(element) {
				// @TODO this should be coded in the other way around, removeAll should loop through all bindings and inside call removeBinding
				// but due to backward compatibility that code should be more readable
				return removeBinding(element);
			}

			/**
			 * If element not exist create base element for widget.
			 * @method ensureElement
			 * @param {HTMLElement} element
			 * @param {ns.widget.BaseWidget} Widget
			 * @return {HTMLElement}
			 * @static
			 * @private
			 * @member ns.engine
			 */
			function ensureElement(element, Widget) {
				if (!element || !(element instanceof HTMLElement)) {
					if (typeof Widget.createEmptyElement === TYPE_FUNCTION) {
						element = Widget.createEmptyElement();
					} else {
						element = document.createElement("div");
					}
				}
				return element;
			}

			/**
			 * Process core widget method
			 * - configure
			 * - build
			 * - init
			 * - bindEvents
			 * @method processWidget
			 * @param {HTMLElement} element base element of widget
			 * @param {Object} widgetInstance instance of widget
			 * @param {Object} definition definition of widget
			 * @param {ns.widget.BaseWidget} definition.widgetClass
			 * @param {string} definition.name
			 * @param {Object} [options] options for widget
			 * @private
			 * @static
			 * @member ns.engine
			 */
			function coreProcessWidget(element, widgetInstance, definition, options) {
				var widgetOptions = options || {},
					createFunction = widgetOptions.create,
					buildAttribute;

				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("Processing widget:", definition.name, "on element:", element.tagName + "#" + (element.id || "--no--id--"));
				//>>excludeEnd("tauDebug");

				element = widgetInstance.configure(definition, element, options);

				// Run .create method from widget options when a [widgetName]create event is triggered
				if (typeof createFunction === TYPE_FUNCTION) {
					eventUtils.one(element, definition.name.toLowerCase() + "create", createFunction);
				}

				if (element.id) {
					widgetInstance.id = element.id;
				}

				// Check if this type of widget was build for this element before
				buildAttribute = element.getAttribute(DATA_BUILT);
				if (!buildAttribute ||
					buildAttribute.split(NAMES_SEPARATOR).indexOf(widgetInstance.name) === -1) {
					element = widgetInstance.build(element);
				}

				if (element) {
					widgetInstance.element = element;

					setBinding(widgetInstance);

					widgetInstance.trigger(eventType.WIDGET_BUILT, widgetInstance, false);

					if (!justBuild) {
						widgetInstance.init(element);
					}

					widgetInstance.bindEvents(element, justBuild);

					widgetInstance.trigger(widgetInstance.widgetEventPrefix + eventType.WIDGET_INIT);
					widgetInstance.trigger(eventType.WIDGET_BOUND, widgetInstance, false);
					eventUtils.trigger(document, eventType.WIDGET_BOUND, widgetInstance);
				} else {
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.error("There was problem with building widget " + widgetInstance.widgetName + " on element with id " +
						widgetInstance.id + ".");
					//>>excludeEnd("tauDebug");
				}
			}

			/**
			 * Load widget
			 * @method processWidget
			 * @param {HTMLElement} element base element of widget
			 * @param {Object} definition definition of widget
			 * @param {ns.widget.BaseWidget} definition.widgetClass
			 * @param {string} definition.name
			 * @param {Object} [options] options for widget
			 * @return {?HTMLElement}
			 * @private
			 * @static
			 * @member ns.engine
			 */
			function processWidget(element, definition, options) {
				var Widget = definition.widgetClass,
					/**
					 * @type {ns.widget.BaseWidget} widgetInstance
					 */
					widgetInstance,
					parentEnhance,
					existingBinding;

				element = ensureElement(element, Widget);
				widgetInstance = Widget ? new Widget(element, options) : false;

				// if any parent has attribute data-enhance=false then stop building widgets
				parentEnhance = selectors.getParentsBySelectorNS(element, "enhance=false");

				// While processing widgets queue other widget may built this one before
				// it reaches it's turn
				existingBinding = getBinding(element, definition.name);
				if (existingBinding && existingBinding.element === element) {
					return element;
				}

				if (widgetInstance) {
					if (!parentEnhance.length) {
						coreProcessWidget(element, widgetInstance, definition, options);
					}
					return widgetInstance.element;
				}

				return null;
			}

			/**
			 * Destroys widget of given 'type' for given HTMLElement.
			 * [NOTICE] This method won't destroy any children widgets.
			 * @method destroyWidget
			 * @param {HTMLElement|string} element
			 * @param {string} type
			 * @static
			 * @member ns.engine
			 */
			function destroyWidget(element, type) {
				var widgetInstance;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(element);
				}

				// If type is not defined all widgets should be removed
				// this is for backward compatibility
				widgetInstance = getBinding(element, type);

				if (widgetInstance) {
					//Destroy widget
					widgetInstance.destroy();
					widgetInstance.trigger("widgetdestroyed");

					removeBinding(element, type);
				}
			}

			/**
			 * Calls destroy on group of widgets connected with given HTMLElement
			 * @method destroyGroupWidgets
			 * @param {HTMLElement|string} element
			 * @static
			 * @private
			 * @member ns.engine
			 */
			function destroyGroupWidgets(element) {
				var widgetName,
					widgetInstance,
					widgetGroup;

				widgetGroup = getAllBindings(element);
				for (widgetName in widgetGroup) {
					if (widgetGroup.hasOwnProperty(widgetName)) {
						widgetInstance = widgetGroup[widgetName];

						//Destroy widget
						if (widgetInstance) {
							widgetInstance.destroy();
							widgetInstance.trigger("widgetdestroyed");
						}
					}
				}
			}

			/**
			 * Calls destroy on widget (or widgets) connected with given HTMLElement
			 * Removes child widgets as well.
			 * @method destroyAllWidgets
			 * @param {HTMLElement|string} element
			 * @param {boolean} [childOnly=false] destroy only widgets on children elements
			 * @static
			 * @member ns.engine
			 */
			function destroyAllWidgets(element, childOnly) {
				var childWidgets,
					i;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(element);
				}

				if (!childOnly) {
					// If type is not defined all widgets should be removed
					// this is for backward compatibility
					destroyGroupWidgets(element);
				}

				//Destroy child widgets, if something left.
				childWidgets = slice.call(element.querySelectorAll("[" + DATA_BOUND + "]"));
				for (i = childWidgets.length - 1; i >= 0; i -= 1) {
					if (childWidgets[i]) {
						destroyAllWidgets(childWidgets[i], false);
					}
				}

				removeAllBindings(element);
			}

			/**
			 * Load widgets from data-* definition
			 * @method processHollowWidget
			 * @param {HTMLElement} element base element of widget
			 * @param {Object} definition widget definition
			 * @param {Object} [options] options for create widget
			 * @return {HTMLElement} base element of widget
			 * @private
			 * @static
			 * @member ns.engine
			 */
			function processHollowWidget(element, definition, options) {
				var name = (element && element.getAttribute(DATA_NAME)) ||
					(definition && definition.name);
				//>>excludeStart("tauDebug", pragmas.tauDebug);

				if (!name) {
					ns.error("Processing hollow widget without name on element:", element);
				}
				//>>excludeEnd("tauDebug");
				definition = definition || (name && widgetDefinitions[name]) || {
					"name": name
				};
				return processWidget(element, definition, options);
			}

			/**
			 * Compare function for nodes on build queue
			 * @param {Object} nodeA
			 * @param {Object} nodeB
			 * @return {number}
			 * @private
			 * @static
			 */
			function compareByDepth(nodeA, nodeB) {
				/*jshint -W016 */
				var mask = Node.DOCUMENT_POSITION_CONTAINS | Node.DOCUMENT_POSITION_PRECEDING;

				if (nodeA.element === nodeB.element) {
					return 0;
				}

				if (nodeA.element.compareDocumentPosition(nodeB.element) & mask) {
					return 1;
				}
				/*jshint +W016 */
				return -1;
			}

			/**
			 * Processes one build queue item. Runs processHollowWidget
			 * underneath
			 * @method processBuildQueueItem
			 * @param {Object|HTMLElement} queueItem
			 * @private
			 * @static
			 */
			function processBuildQueueItem(queueItem) {
				// HTMLElement doesn't have .element property
				// widgetDefinitions will return undefined when called widgetDefinitions[undefined]
				processHollowWidget(queueItem.element || queueItem, widgetDefinitions[queueItem.widgetName]);
			}

			function boundPerfListener() {
				document.removeEventListener(eventType.BOUND, boundPerfListener);
				window.tauPerf.get("engine/createWidgets", "event: " + eventType.BOUND);
			}

			function builtPerfListener() {
				document.removeEventListener("built", builtPerfListener);
				window.tauPerf.get("engine/createWidgets", "event: built");
			}

			/**
			 * Build widgets on all children of context element
			 * @method createWidgets
			 * @static
			 * @param {HTMLElement} context base html for create children
			 * @member ns.engine
			 */
			function createWidgets(context) {
				// find widget which are built
				var builtWidgetElements = slice.call(context.querySelectorAll(querySelectorWidgets)),
					normal,
					buildQueue = [],
					selectorKeys = Object.keys(widgetDefinitions),
					excludeSelector,
					i,
					j,
					len = selectorKeys.length,
					definition,
					widgetName,
					definitionSelectors;

				//>>excludeStart("tauPerformance", pragmas.tauPerformance);
				window.tauPerf.start("engine/createWidgets");
				//>>excludeEnd("tauPerformance");

				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("Start creating widgets on:", (context.tagName || (context.documentElement && "document")) +
					"#" + (context.id || "--no-id--"));
				//>>excludeEnd("tauDebug");

				// process built widgets
				builtWidgetElements.forEach(processBuildQueueItem);

				// process widgets didn't build
				for (i = 0; i < len; ++i) {
					widgetName = selectorKeys[i];
					if (widgetName.indexOf(".") === -1) {
						definition = widgetDefinitions[widgetName];
						definitionSelectors = definition.selectors;
						if (definitionSelectors.length) {
							excludeSelector = excludeBuiltAndBound(widgetName);

							normal = slice.call(context.querySelectorAll(definitionSelectors.join(excludeSelector + ",") +
							excludeSelector));
							j = normal.length;

							while (--j >= 0) {
								buildQueue.push({
									element: normal[j],
									widgetName: widgetName
								});
							}
						}
					}
				}

				// Sort queue by depth, on every DOM branch outer most element go first
				buildQueue.sort(compareByDepth);

				// Build all widgets from queue
				buildQueue.forEach(processBuildQueueItem);

				//>>excludeStart("tauPerformance", pragmas.tauPerformance);
				document.addEventListener(eventType.BOUND, boundPerfListener);
				document.addEventListener("built", builtPerfListener);
				//>>excludeEnd("tauPerformance");

				eventUtils.trigger(document, "built");
				eventUtils.trigger(document, eventType.BOUND);
				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("Finish creating widgets on:", context.tagName || (context.documentElement && "document") + "#" +
					(context.id || "--no-id--"));
				//>>excludeEnd("tauDebug");
			}

			/**
			 * Handler for event create
			 * @method createEventHandler
			 * @param {Event} event
			 * @static
			 * @member ns.engine
			 */
			function createEventHandler(event) {
				createWidgets(event.target);
			}

			function setViewport() {
				/**
				 * Sets viewport tag if not exists
				 */
				var documentHead = document.head,
					metaTagListLength,
					metaTagList,
					metaTag,
					i;

				metaTagList = documentHead.querySelectorAll("[name=\"viewport\"]");
				metaTagListLength = metaTagList.length;

				if (metaTagListLength > 0) {
					// Leave the last viewport tag
					--metaTagListLength;

					// Remove duplicated tags
					for (i = 0; i < metaTagListLength; ++i) {
						// Remove meta tag from DOM
						documentHead.removeChild(metaTagList[i]);
					}
				} else {
					// Create new HTML Element
					metaTag = document.createElement("meta");

					// Set required attributes
					metaTag.setAttribute("name", "viewport");
					metaTag.setAttribute("content", "width=device-width, user-scalable=no");

					// Force that viewport tag will be first child of head
					if (documentHead.firstChild) {
						documentHead.insertBefore(metaTag, documentHead.firstChild);
					} else {
						documentHead.appendChild(metaTag);
					}
				}
			}

			/**
			 * Build first page
			 * @method build
			 * @static
			 * @member ns.engine
			 */
			function build() {
				eventUtils.trigger(document, eventType.READY);
				setViewport();
			}

			/**
			 * Method to remove all listeners bound in run
			 * @method stop
			 * @static
			 * @member ns.engine
			 */
			function stop() {
				eventUtils.trigger(document, eventType.STOP_ROUTING);
			}

			/**
			 * Method to remove all listeners bound in run
			 * @method destroy
			 * @static
			 * @member ns.engine
			 */
			function destroy() {
				stop();
				eventUtils.fastOff(document, "create", createEventHandler);
				destroyAllWidgets(document, true);
				eventUtils.trigger(document, eventType.DESTROY);
			}

			/**
			 * Add to object value at index equal to type of arg.
			 * @method getType
			 * @param {Object} result
			 * @param {*} arg
			 * @return {Object}
			 * @static
			 * @private
			 * @member ns.engine
			 */
			function getType(result, arg) {
				var type = arg instanceof HTMLElement ? "HTMLElement" : typeof arg;

				result[type] = arg;
				return result;
			}

			/**
			 * Convert args array to object with keys being types and arguments mapped by values
			 * @method getArgumentsTypes
			 * @param {Arguments[]} args
			 * @return {Object}
			 * @static
			 * @private
			 * @member ns.engine
			 */
			function getArgumentsTypes(args) {
				return arrayUtils.reduce(args, getType, {});
			}

			ns.widgetDefinitions = {};
			engine = {
				justBuild: location.hash === "#build",
				/**
				 * object with names of engine attributes
				 * @property {Object} dataTau
				 * @property {string} [dataTau.built="data-tau-built"] attribute inform that widget id build
				 * @property {string} [dataTau.name="data-tau-name"] attribute contains widget name
				 * @property {string} [dataTau.bound="data-tau-bound"] attribute inform that widget id bound
				 * @property {string} [dataTau.separator=","] separation string for widget names
				 * @static
				 * @member ns.engine
				 */
				dataTau: {
					built: DATA_BUILT,
					name: DATA_NAME,
					bound: DATA_BOUND,
					separator: NAMES_SEPARATOR,
					widgetWrapper: DATA_WIDGET_WRAPPER
				},
				destroyWidget: destroyWidget,
				destroyAllWidgets: destroyAllWidgets,
				createWidgets: createWidgets,

				/**
				 * Method to get all definitions of widgets
				 * @method getDefinitions
				 * @return {Object}
				 * @static
				 * @member ns.engine
				 */
				getDefinitions: function () {
					return widgetDefinitions;
				},
				/**
				 * Returns definition of widget
				 * @method getWidgetDefinition
				 * @param {string} name
				 * @static
				 * @member ns.engine
				 * @return {Object}
				 */
				getWidgetDefinition: function (name) {
					return widgetDefinitions[name];
				},
				defineWidget: defineWidget,
				getBinding: getBinding,
				getAllBindings: getAllBindings,
				setBinding: setBinding,
				removeBinding: removeBinding,
				removeAllBindings: removeAllBindings,

				/**
				 * Clear bindings of widgets
				 * @method _clearBindings
				 * @static
				 * @member ns.engine
				 */
				_clearBindings: function () {
					//clear and set references to the same object
					widgetBindingMap = {};
				},

				build: build,

				/**
				 * Run engine
				 * @method run
				 * @static
				 * @member ns.engine
				 */
				run: function () {
					//>>excludeStart("tauPerformance", pragmas.tauPerformance);
					if (window.tauPerf) {
						window.tauPerf.start("framework");
						window.tauPerf.get("framework", "run()");
					}
					//>>excludeEnd("tauPerformance");
					// stop the TAU process if exists before
					stop();

					eventUtils.fastOn(document, "create", createEventHandler);

					eventUtils.trigger(document, eventType.INIT, {tau: ns});

					switch (document.readyState) {
						case "interactive":
						case "complete":
							// build widgets and initiate router
							build();
							break;
						default:
							// build widgets and initiate router
							eventUtils.one(document, "DOMContentLoaded", build.bind(engine));
							break;
					}
				},

				/**
				 * Build instance of widget and binding events
				 * Returns error when empty element is passed
				 * @method instanceWidget
				 * @param {HTMLElement|string} [element]
				 * @param {string} name
				 * @param {Object} [options]
				 * @return {?Object}
				 * @static
				 * @member ns.engine
				 */
				instanceWidget: function (element, name, options) {
					var binding,
						definition,
						argumentsTypes = getArgumentsTypes(arguments);

					// Map arguments with specific types to correct variables
					// Only name is required argument
					element = argumentsTypes.HTMLElement;
					name = argumentsTypes.string;
					options = argumentsTypes.object;
					// If element exists try to find existing binding
					if (element) {
						binding = getBinding(element, name);
					}
					// If didn't found binding build new widget
					if (!binding && widgetDefinitions[name]) {
						definition = widgetDefinitions[name];
						if (definition.buildOptions.requireMatchSelector &&
							!ns.util.selectors.matchesSelector(element, definition.selector)) {
							return null;
						}
						element = processHollowWidget(element, definition, options);
						binding = getBinding(element, name);
					} else if (binding) {
						// if widget was built early we should set options delivered to constructor
						binding.option(options);
					}
					return binding;
				},

				stop: stop,

				destroy: destroy,

				/**
				 * Method to change build mode
				 * @method setJustBuild
				 * @param {boolean} newJustBuild
				 * @static
				 * @member ns.engine
				 */
				setJustBuild: function (newJustBuild) {
					// Set location hash to have a consistent behavior
					if (newJustBuild) {
						location.hash = "build";
					} else {
						location.hash = "";
					}

					justBuild = newJustBuild;
				},

				/**
				 * Method to get build mode
				 * @method getJustBuild
				 * @return {boolean}
				 * @static
				 * @member ns.engine
				 */
				getJustBuild: function () {
					return justBuild;
				},
				_createEventHandler: createEventHandler
			};

			engine.eventType = eventType;
			ns.engine = engine;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.engine;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
