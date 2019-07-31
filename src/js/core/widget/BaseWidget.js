/*global window, ns, define */
/*jslint nomen: true */
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
 * #BaseWidget
 * Prototype class of widget
 *
 * ## How to invoke creation of widget from JavaScript
 *
 * To build and initialize widget in JavaScript you have to use method
 * {@link ns.engine#instanceWidget}. First argument for method is HTMLElement, which specifies the
 * element of widget. Second parameter is name of widget to create.
 *
 * If you load jQuery before initializing tau library, you can use standard jQuery UI Widget
 * notation.
 *
 * ### Examples
 * #### Build widget from JavaScript
 *
 *        @example
 *        var element = document.getElementById("id"),
 *            ns.engine.instanceWidget(element, "Button");
 *
 * #### Build widget from jQuery
 *
 *        @example
 *        var element = $("#id").button();
 *
 * ## How to create new widget
 *
 *        @example
 *        (function (ns) {
 *			"use strict";
 *			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
 *			define(
 *				[
 *					"../ns.core", always necessary
 *					"../widget", // fetch namespace, always necessary
 *					"../util/selectors" // all other necessary modules
 *					],
 *				function () {
 *					//>>excludeEnd("tauBuildExclude");
 *					var BaseWidget = ns.widget.BaseWidget, // create alias to main objects
 *						...
 *						arrayOfElements, // example of private property, common for all instances of widget
 *						Button = function () { // create local object with widget
 *							...
 *						},
 *						prototype = new BaseWidget(); // add ns.widget.BaseWidget as prototype to widget's
 *						object, for better minification this should be assign to local variable and next
 *						variable should be assign to prototype of object.
 *
 *					function closestEnabledButton(element) { // example of private method
 *						...
 *					}
 *					...
 *
 *					prototype.options = { //add default options to be read from data- attributes
 *						theme: "s",
 *						...
 *					};
 *
 *					prototype._build = function (template, element) {
 *						// method called when the widget is being built, should contain all HTML
 *						// manipulation actions
 *						...
 *						return element;
 *					};
 *
 *					prototype._init = function (element) {
 *						// method called during initialization of widget, should contain all actions
 *						// necessary fastOn application start
 *						...
 *						return element;
 *					};
 *
 *					prototype._bindEvents = function (element) {
 *						// method to bind all events, should contain all event bindings
 *						...
 *					};
 *
 *					prototype._enable = function (element) {
 *						// method called during invocation of enable() method
 *						...
 *					};
 *
 *					prototype._disable = function (element) {
 *						// method called during invocation of disable() method
 *						...
 *					};
 *
 *					prototype.refresh = function (element) {
 *						// example of public method
 *						...
 *					};
 *
 *					prototype._refresh = function () {
 *						// example of protected method
 *						...
 *					};
 *
 *					Button.prototype = prototype;
 *
 *					engine.defineWidget( // define widget
 *						"Button", //name of widget
 *						"[data-role='button'],button,[type='button'],[type='submit'],[type='reset']",
 *						//widget's selector
 *						[ // public methods, here should be list all public method
 *							"enable",
 *							"disable",
 *							"refresh"
 *						],
 *						Button, // widget's object
 *						"mobile" // widget's namespace
 *					);
 *					ns.widget.Button = Button;
 *					//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
 *					return ns.widget.Button;
 *				}
 *			);
 *			//>>excludeEnd("tauBuildExclude");
 *		}(ns));
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Przemyslaw Ciezkowski <p.ciezkowski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 * @class ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../engine",
			"../event",
			"../util",
			"../util/object",
			"../util/string",
			"../util/selectors",
			"../util/DOM/attributes",
			"../util/DOM/css",
			"../util/Set",
			"../widget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var slice = [].slice,
				/**
				 * Alias to ns.engine
				 * @property {ns.engine} engine
				 * @member ns.widget.BaseWidget
				 * @private
				 * @static
				 */
				engine = ns.engine,
				engineDataTau = engine.dataTau,
				util = ns.util,
				/**
				 * Alias to {@link ns.event}
				 * @property {Object} eventUtils
				 * @member ns.widget.BaseWidget
				 * @private
				 * @static
				 */
				eventUtils = ns.event,
				/**
				 * Alias to {@link ns.util.DOM}
				 * @property {Object} domUtils
				 * @private
				 * @static
				 */
				domUtils = util.DOM,
				utilString = util.string,
				/**
				 * Alias to {@link ns.util.object}
				 * @property {Object} objectUtils
				 * @private
				 * @static
				 */
				objectUtils = util.object,
				selectorUtils = util.selectors,
				Set = util.Set,
				BaseWidget = function () {
					this.flowState = "created";
					return this;
				},
				getNSData = domUtils.getNSData,
				prototype = {},
				/**
				 * Property with string represent function type
				 * (for better minification)
				 * @property {string} [TYPE_FUNCTION="function"]
				 * @private
				 * @static
				 * @readonly
				 */
				TYPE_FUNCTION = "function",
				disableClass = "ui-state-disabled",
				ariaDisabled = "aria-disabled",
				__callbacks;

			BaseWidget.classes = {
				disable: disableClass
			};

			prototype._configureDefinition = function (definition) {
				var self = this,
					definitionName,
					definitionNamespace;

				if (definition) {
					definitionName = definition.name;
					definitionNamespace = definition.namespace;
					/**
					 * Name of the widget
					 * @property {string} name
					 * @member ns.widget.BaseWidget
					 */
					self.name = definitionName;

					/**
					 * Name of the widget (in lower case)
					 * @property {string} widgetName
					 * @member ns.widget.BaseWidget
					 */
					self.widgetName = definitionName;

					/**
					 * Namespace of widget events
					 * @property {string} widgetEventPrefix
					 * @member ns.widget.BaseWidget
					 */
					self.widgetEventPrefix = definitionName.toLowerCase();

					/**
					 * Namespace of the widget
					 * @property {string} namespace
					 * @member ns.widget.BaseWidget
					 */
					self.namespace = definitionNamespace;

					/**
					 * Full name of the widget
					 * @property {string} widgetFullName
					 * @member ns.widget.BaseWidget
					 */
					self.widgetFullName = ((definitionNamespace ? definitionNamespace + "-" : "") +
						definitionName).toLowerCase();
					/**
					 * Id of widget instance
					 * @property {string} id
					 * @member ns.widget.BaseWidget
					 */
					self.id = ns.getUniqueId();

					/**
					 * Widget's selector
					 * @property {string} selector
					 * @member ns.widget.BaseWidget
					 */
					self.selector = definition.selector;
				}
			};

			/**
			 * Protected method configuring the widget
			 * @method _configure
			 * @member ns.widget.BaseWidget
			 * @protected
			 * @template
			 * @ignore
			 */
			/**
			 * Configures widget object from definition.
			 *
			 * It calls such methods as #\_getCreateOptions and #\_configure.
			 * @method configure
			 * @param {Object} definition
			 * @param {string} definition.name Name of the widget
			 * @param {string} definition.selector Selector of the widget
			 * @param {HTMLElement} element Element of widget
			 * @param {Object} options Configure options
			 * @member ns.widget.BaseWidget
			 * @return {ns.widget.BaseWidget}
			 * @ignore
			 */
			prototype.configure = function (definition, element, options) {
				var self = this;

				/**
				 * Object with options for widget
				 * @property {Object} [options={}]
				 * @member ns.widget.BaseWidget
				 */

				self.flowState = "configuring";

				self.options = self.options || {};
				/**
				 * Base element of widget
				 * @property {?HTMLElement} [element=null]
				 * @member ns.widget.BaseWidget
				 */
				self.element = self.element || null;

				self._configureDefinition(definition);

				if (typeof self._configure === TYPE_FUNCTION) {
					element = self._configure(element) || element;
				}

				self.isCustomElement = !!element.createdCallback;

				self._getCreateOptions(element);

				objectUtils.fastMerge(self.options, options);

				// move style attribute to another attribute for recovery in init method
				// this feature is required in widgets with container
				if (element.style.cssText) {
					element.dataset.originalStyle = element.style.cssText;
				}

				self.flowState = "configured";

				return element;
			};

			/**
			 * Reads data-* attributes and save to options object.
			 * @method _getCreateOptions
			 * @param {HTMLElement} element Base element of the widget
			 * @return {Object}
			 * @member ns.widget.BaseWidget
			 * @protected
			 */
			prototype._getCreateOptions = function (element) {
				var self = this,
					options = self.options,
					tag = element.localName.toLowerCase();

				if (options) {
					Object.keys(options).forEach(function (option) {
						var attributeName = utilString.camelCaseToDashes(option),
							baseValue = getNSData(element, attributeName, true),
							prefixedValue = getNSData(element, attributeName);

						if (prefixedValue !== null) {
							options[option] = prefixedValue;
						} else {
							if (typeof options[option] === "boolean" &&
								!self._readBooleanOptionFromElement(element, option)) {
								if (typeof self._getDefaultOption === TYPE_FUNCTION) {
									options[option] = self._getDefaultOption(option);
								}
							}
						}

						if (option === "type" && tag === "input") { // don't set conflicting props
							return;
						}

						if (baseValue !== null) {
							options[option] = baseValue;
						}
					});
				}

				return options;
			};

			/**
			 * Protected method building the widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} widget's element
			 * @member ns.widget.BaseWidget
			 * @protected
			 * @template
			 */
			/**
			 * Builds widget.
			 *
			 * It calls method #\_build.
			 *
			 * Before starting building process, the event beforecreate with
			 * proper prefix defined in variable widgetEventPrefix is triggered.
			 * @method build
			 * @param {HTMLElement} element Element of widget before building process
			 * @return {HTMLElement} Element of widget after building process
			 * @member ns.widget.BaseWidget
			 * @ignore
			 */
			prototype.build = function (element) {
				var self = this,
					id,
					node,
					dataBuilt = element.getAttribute(engineDataTau.built),
					dataName = element.getAttribute(engineDataTau.name);

				eventUtils.trigger(element, self.widgetEventPrefix + "beforecreate");

				self.flowState = "building";

				id = element.id;
				if (id) {
					self.id = id;
				} else {
					element.id = self.id;
				}

				if (typeof self._build === TYPE_FUNCTION) {
					node = self._build(element);
				} else {
					node = element;
				}

				self._setBooleanOptions(element);

				// Append current widget name to data-tau-built and data-tau-name attributes
				dataBuilt = !dataBuilt ? self.name : dataBuilt + engineDataTau.separator + self.name;
				dataName = !dataName ? self.name : dataName + engineDataTau.separator + self.name;

				element.setAttribute(engineDataTau.built, dataBuilt);
				element.setAttribute(engineDataTau.name, dataName);

				self.flowState = "built";
				return node;
			};

			/**
			 * Protected method initializing the widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.BaseWidget
			 * @template
			 * @protected
			 */
			/**
			 * Initializes widget.
			 *
			 * It calls method #\_init.
			 * @method init
			 * @param {HTMLElement} element Element of widget before initialization
			 * @member ns.widget.BaseWidget
			 * @return {ns.widget.BaseWidget}
			 * @ignore
			 */
			prototype.init = function (element) {
				var self = this,
					container,
					originalStyleText;

				self.id = element.id;

				self.flowState = "initiating";

				// Move style properties that was defined before building to container element
				if (element.dataset.originalStyle) {
					container = self.getContainer();
					if (container != element) {
						originalStyleText = element.dataset.originalStyle;

						originalStyleText.split(";").forEach(function (keyValue) {
							var key,
								value,
								keyValuePair;

							keyValuePair = keyValue.split(":");
							if (keyValuePair.length === 2) {
								key = keyValuePair[0].trim();
								value = keyValuePair[1].trim();

								container.style[key] = element.style[key];

								if (element.style[key] === value) {
									element.style[key] = "";
								}
							}
						});
					}
				}

				if (typeof self._init === TYPE_FUNCTION) {
					self._init(element);
				}

				if (element.getAttribute("disabled") || self.options.disabled === true) {
					self.disable();
				} else {
					self.enable();
				}

				self.flowState = "initiated";
				return self;
			};

			/**
			 * Returns base element widget
			 * @member ns.widget.BaseWidget
			 * @return {HTMLElement|null}
			 * @instance
			 */
			prototype.getContainer = function () {
				var self = this;

				if (typeof self._getContainer === TYPE_FUNCTION) {
					return self._getContainer();
				}
				return self.element;
			};

			/**
			 * Bind widget events attached in init mode
			 * @method _bindEvents
			 * @param {HTMLElement} element Base element of widget
			 * @member ns.widget.BaseWidget
			 * @template
			 * @protected
			 */
			/**
			 * Binds widget events.
			 *
			 * It calls such methods as #\_buildBindEvents and #\_bindEvents.
			 * At the end of binding process, the event "create" with proper
			 * prefix defined in variable widgetEventPrefix is triggered.
			 * @method bindEvents
			 * @param {HTMLElement} element Base element of the widget
			 * @param {boolean} onlyBuild Inform about the type of bindings: build/init
			 * @member ns.widget.BaseWidget
			 * @return {ns.widget.BaseWidget}
			 * @ignore
			 */
			prototype.bindEvents = function (element, onlyBuild) {
				var self = this,
					dataBound = element.getAttribute(engineDataTau.bound);

				if (!onlyBuild) {
					dataBound = !dataBound ? self.name : dataBound + engineDataTau.separator + self.name;
					element.setAttribute(engineDataTau.bound, dataBound);
				}
				if (typeof self._buildBindEvents === TYPE_FUNCTION) {
					self._buildBindEvents(element);
				}
				if (!onlyBuild && typeof self._bindEvents === TYPE_FUNCTION) {
					self._bindEvents(element);
				}

				self.trigger(self.widgetEventPrefix + "create", self);

				return self;
			};

			/**
			 * Event triggered when method focus is called
			 * @event taufocus
			 * @member ns.widget.BaseWidget
			 */

			/**
			 * Focus widget's element.
			 *
			 * This function calls function focus on element and if it is known
			 * the direction of event, the proper css classes are added/removed.
			 * @method focus
			 * @param {Object} options The options of event.
			 * @param {HTMLElement} options.previousElement Element to blur
			 * @param {HTMLElement} options.element Element to focus
			 * @member ns.widget.BaseWidget
			 */
			prototype.focus = function (options) {
				var self = this,
					element = self.element,
					blurElement,
					scrollview,
					scrollviewElement,
					blurWidget;

				options = options || {};

				blurElement = options.previousElement;
				// we try to blur element, which has focus previously
				if (blurElement) {
					blurWidget = engine.getBinding(blurElement);
					// call blur function on widget
					if (blurWidget) {
						options = objectUtils.merge({}, options, {element: blurElement});
						blurWidget.blur(options);
					} else {
						// or on element, if widget does not exist
						blurElement.blur();
					}
				}

				options = objectUtils.merge({}, options, {element: element});
				scrollviewElement = selectorUtils.getClosestBySelector(element, "[data-tau-name='Scrollview']");
				if (scrollviewElement) {
					scrollview = engine.getBinding(scrollviewElement);
				}

				// set focus on element
				eventUtils.trigger(document, "taufocus", options);
				if (typeof self._focus === TYPE_FUNCTION) {
					if (options.event) {
						scrollview && scrollview.ensureElementIsVisible(element);
					}
					self._focus(element);
				} else {
					element.focus();
				}

				return true;
			};

			/**
			 * Event triggered then method blur is called.
			 * @event taublur
			 * @member ns.widget.BaseWidget
			 */

			/**
			 * Blur widget's element.
			 *
			 * This function calls function blur on element and if it is known
			 * the direction of event, the proper css classes are added/removed.
			 * @method blur
			 * @param {Object} options The options of event.
			 * @param {HTMLElement} options.element Element to blur
			 * @member ns.widget.BaseWidget
			 */
			prototype.blur = function (options) {
				var self = this,
					element = self.element;

				options = objectUtils.merge({}, options, {element: element});

				// blur element
				eventUtils.trigger(document, "taublur", options);
				if (typeof self._blur === TYPE_FUNCTION) {
					self._blur(element);
				} else {
					element.blur();
				}
				return true;
			};

			/**
			 * Protected method destroying the widget
			 * @method _destroy
			 * @template
			 * @protected
			 * @member ns.widget.BaseWidget
			 */
			/**
			 * Destroys widget.
			 *
			 * It calls method #\_destroy.
			 *
			 * At the end of destroying process, the event "destroy" with proper
			 * prefix defined in variable widgetEventPrefix is triggered and
			 * the binding set in engine is removed.
			 * @method destroy
			 * @param {HTMLElement} element Base element of the widget
			 * @member ns.widget.BaseWidget
			 */
			prototype.destroy = function (element) {
				var self = this;

				element = element || self.element;

				// the widget is in during destroy process
				self.flowState = "destroying";

				if (typeof self._destroy === TYPE_FUNCTION) {
					self._destroy(element);
				}
				if (self.element) {
					self.trigger(self.widgetEventPrefix + "destroy");
					if (self.element.dataset.originalStyle) {
						self.element.style.cssText = self.element.dataset.originalStyle;
						delete self.element.dataset.originalStyle;
					}
				}
				if (element) {
					engine.removeBinding(element, self.name);
				}
				// the widget was destroyed
				self.flowState = "destroyed";
			};

			/**
			 * Protected method disabling the widget
			 * @method _disable
			 * @protected
			 * @member ns.widget.BaseWidget
			 * @template
			 */
			/**
			 * Disables widget.
			 *
			 * It calls method #\_disable.
			 * @method disable
			 * @member ns.widget.BaseWidget
			 * @return {ns.widget.BaseWidget}
			 */
			prototype.disable = function () {
				var self = this,
					args = slice.call(arguments),
					element = self.element;

				element.classList.add(disableClass);
				element.setAttribute(ariaDisabled, true);

				if (typeof self._disable === TYPE_FUNCTION) {
					args.unshift(element);
					self._disable.apply(self, args);
				}
				return this;
			};

			/**
			 * Check if widget is disabled.
			 * @method isDisabled
			 * @member ns.widget.BaseWidget
			 * @return {boolean} Returns true if widget is disabled
			 */
			prototype.isDisabled = function () {
				var self = this;

				return self.element.getAttribute("disabled") || self.options.disabled === true;
			};

			/**
			 * Protected method enabling the widget
			 * @method _enable
			 * @protected
			 * @member ns.widget.BaseWidget
			 * @template
			 */
			/**
			 * Enables widget.
			 *
			 * It calls method #\_enable.
			 * @method enable
			 * @member ns.widget.BaseWidget
			 * @return {ns.widget.BaseWidget}
			 */
			prototype.enable = function () {
				var self = this,
					args = slice.call(arguments),
					element = self.element;

				element.classList.remove(disableClass);
				element.setAttribute(ariaDisabled, false);

				if (typeof self._enable === TYPE_FUNCTION) {
					args.unshift(element);
					self._enable.apply(self, args);
				}
				return this;
			};

			/**
			 * Protected method causing the widget to refresh
			 * @method _refresh
			 * @protected
			 * @member ns.widget.BaseWidget
			 * @template
			 */
			/**
			 * Refreshes widget.
			 *
			 * It calls method #\_refresh.
			 * @method refresh
			 * @member ns.widget.BaseWidget
			 * @return {ns.widget.BaseWidget}
			 */
			prototype.refresh = function () {
				var self = this;

				if (typeof self._refresh === TYPE_FUNCTION) {
					self._refresh.apply(self, arguments);
				}
				return self;
			};

			/**
			 * Reads class based on name conversion option value, for all options which have boolean value
			 * we can read option value by check that exists classname connected with option name. To
			 * correct use this method is required define in widget property _classesPrefix. If this
			 * condition is not met method returns false, otherwise returns true.
			 *
			 * For example for option middle in Button widget we will check existing of class
			 * ui-btn-middle.
			 *
			 * @method _readBooleanOptionFromElement
			 * @param {HTMLElement} element Main element of widget
			 * @param {string} name Name of option which should be used
			 * @return {boolean} If option value was successfully read
			 * @member ns.widget.BaseWidget
			 * @protected
			 */
			prototype._readBooleanOptionFromElement = function (element, name) {
				var classesPrefix = this._classesPrefix,
					className;

				if (classesPrefix) {
					className = classesPrefix + utilString.camelCaseToDashes(name);
					this.options[name] = element.classList.contains(className);

					return true;
				}

				return false;
			};

			/**
			 * Sets or removes class based on name conversion option, for all options which have boolean
			 * value we can just set classname which is converted from camel case to dash style.
			 * To correct use this method is required define in widget property _classesPrefix.
			 *
			 * For example for option middle in Button widget we will set or remove class ui-btn-middle.
			 *
			 * @method _setBooleanOption
			 * @param {HTMLElement} element Main element of widget
			 * @param {string} name Name of option which should be used
			 * @param {boolean} value New value of option to set
			 * @member ns.widget.BaseWidget
			 * @protected
			 * @return {false} always return false to block refreshing
			 */
			prototype._setBooleanOption = function (element, name, value) {
				var classesPrefix = this._classesPrefix,
					className;

				if (classesPrefix) {
					className = classesPrefix + utilString.camelCaseToDashes(name);
					element.classList.toggle(className, value);
				}

				// we don't need refresh, always can return false
				return false;
			};

			/**
			 * For each options which has boolean value set or remove connected class.
			 *
			 * @method _setBooleanOptions
			 * @param {HTMLElement} element Base element of the widget
			 * @return {Object}
			 * @member ns.widget.BaseWidget
			 * @protected
			 */
			prototype._setBooleanOptions = function (element) {
				var self = this,
					classesPrefix = self._classesPrefix,
					options = self.options;

				if (classesPrefix && options !== undefined) {
					Object.keys(options).forEach(function (option) {
						if (typeof options[option] === "boolean") {
							options[option] = self._setBooleanOption(element, option, options[option]);
						}
					});
				}
				return options;
			};

			prototype._processOptionObject = function (firstArgument) {
				var self = this,
					key,
					partResult,
					refresh = false;

				for (key in firstArgument) {
					if (firstArgument.hasOwnProperty(key)) {
						partResult = self._oneOption(key, firstArgument[key]);
						if (key !== undefined && firstArgument[key] !== undefined) {
							refresh = refresh || partResult;
						}
					}
				}
				return refresh;
			};

			/**
			 * Gets or sets options of the widget.
			 *
			 * This method can work in many context.
			 *
			 * If first argument is type of object them, method set values for options given in object.
			 * Keys of object are names of options and values from object are values to set.
			 *
			 * If you give only one string argument then method return value for given option.
			 *
			 * If you give two arguments and first argument will be a string then second argument will be
			 * intemperate as value to set.
			 *
			 * @method option
			 * @param {string|Object} [name] name of option
			 * @param {*} [value] value to set
			 * @member ns.widget.BaseWidget
			 * @return {*} return value of option or null if method is called in setter context
			 */
			prototype.option = function (name, value) {
				var self = this,
					firstArgument = name,
					secondArgument = value,
					result = null,
					refresh = false;

				if (typeof firstArgument === "string") {
					result = self._oneOption(firstArgument, secondArgument);
					if (secondArgument !== undefined) {
						refresh = result;
						result = null;
					}
				} else if (typeof firstArgument === "object") {
					refresh = self._processOptionObject(firstArgument);
				}
				if (refresh) {
					self.refresh();
				}
				return result;
			};

			/**
			 * Gets or sets one option of the widget.
			 *
			 * @method _oneOption
			 * @param {string} field
			 * @param {*} value
			 * @member ns.widget.BaseWidget
			 * @return {*}
			 * @protected
			 */
			prototype._oneOption = function (field, value) {
				var self = this,
					methodName,
					refresh = false;

				if (value === undefined) {
					methodName = "_get" + (field[0].toUpperCase() + field.slice(1));

					if (typeof self[methodName] === TYPE_FUNCTION) {
						return self[methodName]();
					}

					return self.options[field];
				}

				methodName = "_set" + (field[0].toUpperCase() + field.slice(1));
				if (typeof self[methodName] === TYPE_FUNCTION) {
					refresh = self[methodName](self.element, value);
					if (self.element) {
						self.element.setAttribute("data-" + (field.replace(/[A-Z]/g, function (c) {
							return "-" + c.toLowerCase();
						})), value);
					}
				} else if (typeof value === "boolean") {
					refresh = self._setBooleanOption(self.element, field, value);
				} else {
					self.options[field] = value;

					if (self.element) {
						self.element.setAttribute("data-" + (field.replace(/[A-Z]/g, function (c) {
							return "-" + c.toLowerCase();
						})), value);
						refresh = true;
					}
				}

				if (value === "" && self.element) {
					self.element.removeAttribute("data-" + (field.replace(/[A-Z]/g, function (c) {
						return "-" + c.toLowerCase();
					})));
				}

				return refresh;
			};

			/**
			 * Returns true if widget has bounded events.
			 *
			 * This methods enables to check if the widget has bounded
			 * events through the {@link ns.widget.BaseWidget#bindEvents} method.
			 * @method isBound
			 * @param {string} [type] Type of widget
			 * @member ns.widget.BaseWidget
			 * @ignore
			 * @return {boolean} true if events are bounded
			 */
			prototype.isBound = function (type) {
				var element = this.element;

				type = type || this.name;
				return element && element.hasAttribute(engineDataTau.bound) &&
					element.getAttribute(engineDataTau.bound).indexOf(type) > -1;
			};

			/**
			 * Returns true if widget is built.
			 *
			 * This methods enables to check if the widget was built
			 * through the {@link ns.widget.BaseWidget#build} method.
			 * @method isBuilt
			 * @param {string} [type] Type of widget
			 * @member ns.widget.BaseWidget
			 * @ignore
			 * @return {boolean} true if the widget was built
			 */
			prototype.isBuilt = function (type) {
				var element = this.element;

				type = type || this.name;
				return element && element.hasAttribute(engineDataTau.built) &&
					element.getAttribute(engineDataTau.built).indexOf(type) > -1;
			};

			/**
			 * Protected method getting the value of widget
			 * @method _getValue
			 * @return {*}
			 * @member ns.widget.BaseWidget
			 * @template
			 * @protected
			 */
			/**
			 * Protected method setting the value of widget
			 * @method _setValue
			 * @param {*} value
			 * @return {*}
			 * @member ns.widget.BaseWidget
			 * @template
			 * @protected
			 */
			/**
			 * Gets or sets value of the widget.
			 *
			 * @method value
			 * @param {*} [value] New value of widget
			 * @member ns.widget.BaseWidget
			 * @return {*}
			 */
			prototype.value = function (value) {
				var self = this;

				if (value !== undefined) {
					if (typeof self._setValue === TYPE_FUNCTION) {
						return self._setValue(value);
					}
					return self;
				}
				if (typeof self._getValue === TYPE_FUNCTION) {
					return self._getValue();
				}
				return self;
			};

			/**
			 * Triggers an event on widget's element.
			 *
			 * @method trigger
			 * @param {string} eventName The name of event to trigger
			 * @param {?*} [data] additional Object to be carried with the event
			 * @param {boolean} [bubbles=true] Indicating whether the event
			 * bubbles up through the DOM or not
			 * @param {boolean} [cancelable=true] Indicating whether
			 * the event is cancelable
			 * @member ns.widget.BaseWidget
			 * @return {boolean} False, if any callback invoked preventDefault on event object
			 */
			prototype.trigger = function (eventName, data, bubbles, cancelable) {
				if (this.element) {
					return eventUtils.trigger(this.element, eventName, data, bubbles, cancelable);
				}
			};

			/**
			 * Adds event listener to widget's element.
			 * @method on
			 * @param {string} eventName The name of event
			 * @param {Function} listener Function called after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture Parameter of addEventListener
			 * @member ns.widget.BaseWidget
			 */
			prototype.on = function (eventName, listener, useCapture) {
				eventUtils.on(this.element, eventName, listener, useCapture);
			};

			/**
			 * Removes event listener from  widget's element.
			 * @method off
			 * @param {string} eventName The name of event
			 * @param {Function} listener Function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture Parameter of addEventListener
			 * @member ns.widget.BaseWidget
			 */
			prototype.off = function (eventName, listener, useCapture) {
				eventUtils.off(this.element, eventName, listener, useCapture);
			};

			prototype._framesFlow = function () {
				var self = this,
					args = slice.call(arguments),
					func = args.shift();

				if (typeof func === "function") {
					func();
				}
				if (func !== undefined) {
					util.requestAnimationFrame(function frameFlowCallback() {
						self._framesFlow.apply(self, args);
					});
				}
			};

			function callbacksFilter(item) {
				return !item.toRemove;
			}

			function callbacksForEach(item) {
				if (item.object[item.property] === item.value) {
					util.requestAnimationFrame(item.callback.bind(item.object));
					item.toRemove = true;
				}
			}

			function _controlWaitFor() {
				__callbacks.forEach(callbacksForEach);
				__callbacks = __callbacks.filter(callbacksFilter);
				if (__callbacks.length) {
					util.requestAnimationFrame(_controlWaitFor);
				}
			}

			prototype._waitFor = function (property, value, callback) {
				var self = this;

				if (self[property] === value) {
					callback.call(self);
				} else {
					__callbacks = __callbacks || [];
					__callbacks.push({
						object: self,
						property: property,
						value: value,
						callback: callback
					});
				}
				_controlWaitFor();
			};

			function readDOMElementStateClassList(element, stateObject) {
				var classList = stateObject.classList;

				if (classList !== undefined) {
					if (classList instanceof Set) {
						classList.clear();
					} else {
						classList = new Set();
						stateObject.classList = classList;
					}
					if (element.classList.length) {
						classList.add.apply(classList, slice.call(element.classList));
					}
				}
			}

			function readDOMElementState(element, stateObject) {
				readDOMElementStateClassList(element, stateObject);
				if (stateObject.offsetWidth !== undefined) {
					stateObject.offsetWidth = element.offsetWidth;
				}
				if (stateObject.style !== undefined) {
					domUtils.extractCSSProperties(element, stateObject.style, null, true);
				}
				if (stateObject.children !== undefined) {
					stateObject.children.forEach(function (child, index) {
						readDOMElementState(element.children[index], child);
					});
				}
			}

			function render(stateObject, element, isChild, options) {
				var recalculate = false,
					animation = (options) ? options.animation : null;

				if (animation && !animation.active) {
					// Animation has stopped before render
					return false;
				}

				if (stateObject.classList !== undefined) {
					slice.call(element.classList).forEach(function renderRemoveClassList(className) {
						if (!stateObject.classList.has(className)) {
							element.classList.remove(className);
							recalculate = true;
						}
					});
					stateObject.classList.forEach(function renderAddClassList(className) {
						if (!element.classList.contains(className)) {
							element.classList.add(className);
							recalculate = true;
						}
					});
				}
				if (stateObject.style !== undefined) {
					Object.keys(stateObject.style).forEach(function renderUpdateStyle(styleName) {
						element.style[styleName] = stateObject.style[styleName];
					});
				}
				if (stateObject.children !== undefined) {
					stateObject.children.forEach(function renderChildren(child, index) {
						render(child, element.children[index], true);
					});
				}
				if (recalculate && !isChild) {
					util.requestAnimationFrame(readDOMElementState.bind(null, element, stateObject));
				}
			}

			prototype._render = function (now) {
				var self = this,
					stateDOM = self._stateDOM,
					element = self.element,
					animation = self._animation;

				if (now) {
					render(stateDOM, element, false, {animation: animation});
				} else {
					util.requestAnimationFrame(render.bind(null, stateDOM, element, false, {animation: animation}));
				}
			};

			prototype._initDOMstate = function () {
				readDOMElementState(this.element, this._stateDOM);
			};

			prototype._togglePrefixedClass = function (stateDOM, prefix, name) {
				var requireRefresh = false,
					prefixedClassName = prefix + name;

				stateDOM.classList.forEach(function (className) {
					if (className.indexOf(prefix) === 0 && prefixedClassName !== className) {
						stateDOM.classList.delete(className);
						requireRefresh = true;
					}
				});
				if (!stateDOM.classList.has(prefixedClassName)) {
					stateDOM.classList.add(prefixedClassName);
					requireRefresh = true;
				}
				return requireRefresh;
			};

			BaseWidget.prototype = prototype;

			// definition
			ns.widget.BaseWidget = BaseWidget;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.BaseWidget;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
