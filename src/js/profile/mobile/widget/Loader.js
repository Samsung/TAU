/*global window, ns, define, ns */
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
/*jslint nomen: true, plusplus: true */
/**
 * #Loader Widget
 * Widget displaying loader popup on page changes.
 *
 * ##HTML Examples
 * ###Create simple loader pending from div using data-role:
 *
 *		@example
 *			<div data-role="loader" id="ns-loader"></div>
 *
 * ###Create simple loader pending from div using class:
 *
 *		@example
 *			<div class="ui-loader" id="ns-loader"></div>
 *
 * ##Manual constructor
 * For manual creation of loader widget you can use constructor of widget:
 *
 *		@example
 *			<div id="ns-loader"></div>
 *			<script>
 *				var elementLoader = document.getElementById("ns-loader"),
 *				loader = tau.widget.Loader(elementLoader);
 *			</script>
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *			<div id="ns-loader"></div>
 *			<script>
 *				$("#ns-loader").loader();
 *			</script>
 *
 * ##Options for Loader Widget
 *
 * Options for widget can be defined as _data-..._ attributes or given as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ###Custom html
 * Adds custom html for the inner content of the loading messages
 *
 *		@example
 *			<div data-role="loader" id="ns-loader"
 *			data-html="<span>loading...</span>"></div>
 *
 * ###Custom text
 * Text to be displayed when the loader is shown
 *
 *		@example
 *			<div data-role="loader" id="ns-loader" data-text="loading...">
 *			</div>

 * ###Visibility of text
 * When the loader is shown and text is added, checks whether the text in the
 * loading message is shown;
 *
 *		@example
 *			<div data-role="loader" id="ns-loader" data-text="loading..."
 *			data-text-visible="true"></div>

 * ###Set theme
 * Sets the theme for the loading messages
 *
 *		@example
 *			<div data-role="loader" id="ns-loader" data-theme="a"></div>
 *
 *
 * ##Options for Loader Widget
 *
 * Options for widget can be get/set .
 *
 * ###You can change option for widget using method **option**.
 * Initialize the loader
 *
 *		@example
 *			<script>
 *				var elementLoader = document.getElementById("ns-loader"),
 *				loader = tau.widget.Loader(elementLoader);
 *			</script>
 *
 * ###Custom html
 * Get or set the html option, after initialization
 *
 *		@example
 *			<script>
 *				//getter
 *				loader.option( "html" );
 *
 *				//setter
 *				loader.option( "html", "<span>Loader</span>", );
 *			</script>
 *
 * ###Custom text
 * Get or set the text option, after initialization
 *
 *		@example
 *			<script>
 *				//getter
 *				loader.option( "text" );
 *
 *				//setter
 *				loader.option( "text", "Loader" );
 *			</script>
 *
 * ###Visibility of text
 * Get or set the textVisible option, after initialization
 *
 *		@example
 *			<script>
 *				//getter
 *				loader.option( "textVisible" );
 *
 *				//setter
 *				loader.option( "textVisible", "true" );
 *			</script>
 *
 * ###Set theme
 * Get or set the theme option, after initialization
 *
 *		@example
 *			<script>
 *				//getter
 *				loader.option( "theme" );
 *
 *				//setter
 *				loader.option( "theme", "b" );
 *			</script>
 *
 *
 * @deprecated
 * @extends ns.widget.mobile.BaseWidgetMobile
 * @class ns.widget.mobile.Loader
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Piotr Kusztal <p.kusztal@samsung.com>
 */
(function (window, ns, $) {
	"use strict";

	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);


	define(
		[
			"../../../core/engine",
			"../widget",
			"../../../core/util/object",
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			/**
			 * {Object} Widget Alias for {@link ns.widget.mobile.BaseWidgetMobile}
			 * @member ns.widget.mobile.Loader
			 * @private
			 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * @property {Object} engine Alias for class ns.engine
				 * @member ns.widget.mobile.Loader
				 * @private
				 */
				engine = ns.engine,
				object = ns.util.object,

				Loader = function () {
					var self = this;

					self.action = "";
					self.label = null;
					self.defaultHtml = "";
					self.options = object.copy(Loader.prototype.options);
				},
				classes = {
					uiLoader: "ui-loader",
					uiLoaderPrefix: "ui-loader-",
					uiCorner: "ui-corner-all",
					uiIcon: "ui-icon",
					uiLoaderIcon: "ui-icon-loading",
					uiLoading: "ui-loading",
					uiTextOnly: "ui-loader-textonly"
				},
				properties = {
					pageLoadErrorMessageTheme: "e",
					pageLoadErrorMessage: "Error Loading Page"
				},
				prototype = new BaseWidget();

			/**
			 * Dictionary for loader related css
			 * @property {Object} classes
			 * @member ns.widget.mobile.Loader
			 * @static
			 */
			Loader.classes = classes;

			/**
			 * Dictionary for loader related properties such as messages and
			 * themes
			 * @property {Object} properties
			 * @member ns.widget.mobile.Loader
			 * @static
			 */
			Loader.properties = properties;

			/**
			 * Object with default options
			 * @property {Object} options
			 * @property {boolean} [options.textVisible=false] whether the text
			 * in the loading message is shown
			 * @property {?string} [options.html=""] custom html for the inner
			 * content of the loading messages
			 * @property {string} [options.text="loading"] the text to be
			 * displayed when the loading is shown
			 * @member ns.widget.mobile.Loader
			 */
			prototype.options = {
				textVisible: false,
				html: "",
				text: "loading"
			};

			/**
			 * Build structure of loader widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Loader
			 */
			prototype._build = function (element) {
				var options = this.options,
					loaderElementSpan = document.createElement("span"),
					loaderElementTile = document.createElement("h1"),
					elementClassList = element.classList,
					spanClassList = loaderElementSpan.classList;

				loaderElementTile.textContent = options.text;
				spanClassList.add(classes.uiIcon);
				spanClassList.add(classes.uiLoaderIcon);

				element.appendChild(loaderElementSpan);
				element.appendChild(loaderElementTile);
				elementClassList.add(classes.uiLoader);
				elementClassList.add(classes.uiCorner);
				elementClassList.add(classes.uiLoaderPrefix + "default");

				this.defaultHtml = element.innerHTML;

				return element;
			};

			/**
			 * Init structure of loader widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Loader
			 */
			prototype._init = function (element) {
				this.defaultHtml = element.innerHTML;
				return element;
			};

			/**
			 * Reset HTML
			 *
			 * Method resets contained html of loader
			 *
			 *		@example
			 *			<script>
			 *				var loaderWidget = tau.widget.Loader(
			 *						document.getElementById("ns-loader")
			 *				);
			 *				loaderWidget.resetHtml();
			 *
			 *				//or
			 *
			 *				$( "#ns-loader" ).loader( "resetHtml" );
			 *			</script>
			 *
			 * @method resetHtml
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.Loader
			 */
			prototype.resetHtml = function (element) {
				element = element || this.element;
				element.innerHTML = this.defaultHtml;
			};

			/**
			 * Show loader
			 *
			 * Method shows loader on the page
			 *
			 *		@example
			 *			<script>
			 *				var loaderWidget = tau.widget.Loader(
			 *						document.getElementById("ns-loader")
			 *					);
			 *				loaderWidget.show();
			 *
			 *				// or
			 *
			 *				$( "#ns-loader" ).loader( "show" );
			 *
			 *				//or with parameters
			 *
			 *				$( "#ns-loader" ).loader( "show", {
			 *					text: "foo",
			 *					textVisible: true,
			 *					theme: "z",
			 *					html: ""
			 *				});
			 *			</script>
			 *
			 * @method show
			 * @param {string} theme
			 * @param {string} msgText
			 * @param {boolean} textonly
			 * @member ns.widget.mobile.Loader
			 */
			prototype.show = function (theme, msgText, textonly) {
				var classes = Loader.classes,
					self = this,
					element = self.element,
					elementClassList = element.classList,
					copySettings = {},
					loadSettings = {},
					textVisible,
					message;

				self.resetHtml(element);

				if (theme !== undefined && theme.constructor === Object) {
					copySettings = object.copy(self.options);
					loadSettings = object.merge(copySettings, theme);
					// @todo remove $.mobile.loadingMessageTheme
					theme = loadSettings.theme || $.mobile.loadingMessageTheme;
				} else {
					loadSettings = self.options;
					// @todo remove $.mobile.loadingMessageTheme
					theme = theme || $.mobile.loadingMessageTheme ||
						loadSettings.theme;
				}

				// @todo remove $.mobile.loadingMessage
				message = msgText || $.mobile.loadingMessage ||
					loadSettings.text;
				document.documentElement.classList.add(classes.uiLoading);

				// @todo remove $.mobile.loadingMessage
				if ($.mobile.loadingMessage === false && !loadSettings.html) {
					element.getElementsByTagName("h1")[0].innerHTML = "";
				} else {
					// @todo remove $.mobile.loadingMessageTextVisible
					if ($.mobile.loadingMessageTextVisible !== undefined) {
						textVisible = $.mobile.loadingMessageTextVisible;
					} else {
						textVisible = loadSettings.textVisible;
					}

					element.className = "";
					elementClassList.add(classes.uiLoader);
					elementClassList.add(classes.uiCorner);
					elementClassList.add(classes.uiBodyPrefix + theme);
					elementClassList.add(classes.uiLoaderPrefix +
						(textVisible || msgText ||
							theme.text ? "verbose" : "default"));

					if ((loadSettings.textonly !== undefined &&
						loadSettings.textonly) || textonly) {
						elementClassList.add(classes.uiTextOnly);
					}

					if (loadSettings.html) {
						element.innerHTML = loadSettings.html;
					} else {
						element.getElementsByTagName("h1")[0].textContent =
							message;
					}
				}

			};

			/**
			 * Hide loader
			 *
			 * Method hides loader on the page
			 *
			 *		@example
			 *			<script>
			 *				var loaderWidget = tau.widget.Loader(
			 *						document.getElementById("ns-loader")
			 *					);
			 *				loaderWidget.hide();
			 *
			 *				// or
			 *
			 *				$( "#ns-loader" ).loader( "hide" );
			 *			</script>
			 *
			 * @method hide
			 * @member ns.widget.mobile.Loader
			 */
			prototype.hide = function () {
				var classes = Loader.classes;

				document.documentElement.classList.remove(classes.uiLoading);
			};

			/**
			 * The function "value" is not supported in this widget.
			 *
			 * @method value
			 * @chainable
			 * @member ns.widget.mobile.Loader
			 */

			/**
			 * Disable the Loader
			 *
			 * Method adds disabled attribute on loader and changes look of
			 * loader to disabled state.
			 *
			 *		@example
			 *		<div data-role="loader" id="ns-loader"></div>
			 *
			 *		<script>
			 *			var elementLoader = tau.widget.Loader(
			 *					document.getElementById("ns-loader")
			 *				);
			 *			elementLoader.disable();
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div data-role="loader" id="ns-loader"></div>
			 *
			 *		<script>
			 *			$("#ns-loader").loader("disable");
			 *		</script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.Loader
			 */

			/**
			 * Enable the loader
			 *
			 * Method removes disabled attribute on loader and changes look of
			 * loader to enabled state.
			 *
			 *		@example
			 *		<div data-role="loader" id="ns-loader"></div>
			 *
			 *		<script>
			 *			var elementLoader = tau.widget.Loader(
			 *					document.getElementById("ns-loader")
			 *				);
			 *			elementLoader.enable();
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div data-role="loader" id="ns-loader"></div>
			 *
			 *		<script>
			 *			$("#ns-loader").loader("enable");
			 *		</script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.Loader
			 */

			/**
			 * Trigger an event on widget's element.
			 *
			 *		@example
			 *		<div data-role="loader" id="ns-loader"></div>
			 *
			 *		<script>
			 *			var elementLoader = tau.widget.Loader(
			 *					document.getElementById("ns-loader")
			 *				);
			 *			elementLoader.trigger("eventName");
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div data-role="loader" id="ns-loader"></div>
			 *
			 *		<script>
			 *			$("#ns-loader").loader("trigger", "eventName");
			 *		</script>
			 *
			 * @method trigger
			 * @param {string} eventName the name of event to trigger
			 * @param {?*} [data] additional object to be carried with the event
			 * @param {boolean} [bubbles=true] indicating whether the event
			 * bubbles up through the DOM or not
			 * @param {boolean} [cancelable=true] indicating whether the event
			 * is cancelable
			 * @return {boolean} false, if any callback invoked preventDefault
			 * on event object
			 * @member ns.widget.mobile.Loader
			 */

			/**
			 * Add event listener to widget's element.
			 *
			 *		@example
			 *		<div data-role="loader" id="ns-loader"></div>
			 *
			 *		<script>
			 *			var elementLoader = tau.widget.Loader(
			 *					document.getElementById("ns-loader")
			 *				);
			 *			elementLoader.on("eventName", function () {
			 *				console.log("Event fires");
			 *			});
			 *		</script>
			 *
			 * If jQuery is loaded:S
			 *
			 *		@example
			 *		<div data-role="loader" id="ns-loader"></div>
			 *
			 *		<script>
			 *			$("#ns-loader").loader("on", "eventName", function () {
			 *				console.log("Event fires");
			 *			});
			 *		</script>
			 *
			 * @method on
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be
			 * trigger
			 * @param {boolean} [useCapture=false] useCapture param tu
			 * addEventListener
			 * @member ns.widget.mobile.Loader
			 */

			/**
			 * Remove event listener to widget's element.
			 *
			 *		@example
			 *		<div data-role="loader" id="ns-loader"></div>
			 *
			 *		<script>
			 *			var elementLoader = tau.widget.Loader(
			 *					document.getElementById("ns-loader")
			 *				),
			 *				callback = function () {
			 *					console.log("Event fires");
			 *				};
			 *			// add callback on event "eventName"
			 *			elementLoader.on("eventName", callback);
			 *			// ...
			 *			// remove callback on event "eventName"
			 *			elementLoader.off("eventName", callback);
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div data-role="loader" id="ns-loader"></div>
			 *
			 *		<script>
			 *			var callback = function () {
			 *					console.log("Event fires");
			 *				};
			 *			// add callback on event "eventName"
			 *			$("#ns-loader").loader("on", "eventName", callback);
			 *			// ...
			 *			// remove callback on event "eventName"
			 *			$("#ns-loader").loader("off", "eventName", callback);
			 *		</script>
			 * @method off
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be
			 * trigger
			 * @param {boolean} [useCapture=false] useCapture param to
			 * addEventListener
			 * @member ns.widget.mobile.Loader
			 */

			/**
			 * Get/Set options of the widget.
			 *
			 * This method can work in many context.
			 *
			 * If first argument is type of object them, method set values for
			 * options given in object. Keys of object are names of options and
			 * values from object are values to set.
			 *
			 * If you give only one string argument then method return value
			 * for given option.
			 *
			 * If you give two arguments and first argument will be a string
			 * then second argument will be intemperate as value to set.
			 *
			 *		@example
			 *		<div data-role="loader" id="ns-loader"></div>
			 *
			 *			<script>
			 *				//getter
			 *				loader.option("text");
			 *
			 *				//setter
			 *				loader.option("text","Loader");
			 *			</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div data-role="loader" id="ns-loader"></div>
			 *
			 *		<script>
			 *			var value;
			 *
			 * 			// get value
			 *			value = $("#ns-loader").loader("option", "text");
			 *
			 *			// set value
			 *			$("#ns-loader").loader(
			 *				"option", "text", "Loader fires"
			 *			);
			 *		</script>
			 *
			 * @method option
			 * @param {string|Object} [name] name of option
			 * @param {*} value value to set
			 * @member ns.widget.mobile.Loader
			 * @return {*} return value of option or undefined if method is
			 * called in setter context
			 */
			// definition
			Loader.prototype = prototype;
			ns.widget.mobile.Loader = Loader;
			engine.defineWidget(
				"Loader",
				"[data-role='loader'], .ui-loader",
				[
					"show",
					"hide",
					"resetHtml"
				],
				Loader,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Loader;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns, window.$));
