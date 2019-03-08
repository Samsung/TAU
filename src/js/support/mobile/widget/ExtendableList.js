/*global window, define, ns, $ */
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
/*jslint nomen: true, white: true, plusplus: true*/
/**
 * #Extendable List Widget
 * The Extendable List is used to display a list of data elements that can be extended.
 *
 * ## Default selectors
 * **UL** tags with _data-role=extendablelist_ attribute. However most of required options has to be passed as Java Script object.
 * Widget has to be created manually.
 *
 * ###HTML Examples
 *
 * ####Create basic Extendable List
 *
 *        @example
 *        <ul id="widgetIdSelector" data-role="extendablelist"></ul>
 *
 *        <script>
 *            var config = {
 *				// NOTE: JSON_DATA is an object which holds all records that you want to load
 *				// Declare total number of items
 *				dataLength: JSON_DATA.length,
 *
 *				// Set list item updater
 *				listItemUpdater: function (processedIndex, listItem) {
 *					var data = JSON_DATA[processedIndex];
 *					listItem.textContent = data.NAME;
 *				},
 *
 *				// Set list item loader
 *				listItemLoader: function (loaderContainer, numMoreItems) {
 *					// Get loader element
 *					loaderContainer.textContent= 'Load ' + numMoreItems + ' more items';
 *				}
 *			};
 *
 *            // Create widget using TAU notation ...
 *            tau.widget.ExtendableList(document.getElementById("widgetIdSelector"), config).create();
 *
 *            // ... or using jQM notation
 *            $( "#widgetIdSelector" ).extendablelist( config );
 *        </script>
 *
 * ####Create basic Extendable List with custom loader item
 * To set custom loader element add one **li** element to list markup. If no element will be provided, widget will create it automatically.
 * Loader element is always passed as first (**loaderContainer**) argument while calling **listItemLoader** function.
 *
 *        @example
 *        <ul id="widgetIdSelector" data-role="extendablelist">
 *            <!-- Declaration of custom loader item -->
 *            <li class="custom-class"></li>
 *        </ul>
 *
 *        <script>
 *            var config = {
 *				// NOTE: JSON_DATA is an object which holds all records that you want to load
 *				// Declare total number of items
 *				dataLength: JSON_DATA.length,
 *
 *				// Set list item updater
 *				listItemUpdater: function (processedIndex, listItem) {
 *					var data = JSON_DATA[processedIndex];
 *					listItem.textContent = data.NAME;
 *				},
 *
 *				// Set list item loader
 *				listItemLoader: function (loaderContainer, numMoreItems) {
 *					// Get loader element
 *					loaderContainer.textContent= 'Load ' + numMoreItems + ' more items';
 *				}
 *			};
 *
 *            // Create widget using TAU notation ...
 *            tau.widget.ExtendableList(document.getElementById("widgetIdSelector"), config)
 *                .create();
 *
 *            // ... or using jQM notation
 *            $( "#widgetIdSelector" ).extendablelist( "create", config );
 *        </script>
 *
 * ####Create Extendable List using jQuery Template
 * Extendable List supports jQuery Template, for further information about **jQuery.template plugin** you can find in jQuery documentation for jQuery.template plugin.
 * To switch widget in template mode _data-template_ attribute must be set or template option must be passed.
 * **NOTE:** This feature is available but not recommended due performance issue and abandoned library jQuery Template support. It will be probably replaced by more efficient template system.
 *
 *        @example
 *        <!-- Template for list item -->
 *        <script id="tmp-1line" type="text/x-jquery-tmpl">
 *            <li class="my-custom-class">${NAME}</li>
 *        </script>
 *
 *        <!-- Template for loader -->
 *        <script id="tmp_load_more" type="text/x-jquery-tmpl">
 *            <li class="my-custom-loader-class">
 *                Load ${NUM_MORE_ITEMS} more items
 *            </li>
 *        </script>
 *
 *        <ul id="widgetIdSelector" data-role="extendablelist" data-template="tmp-1line"></ul>
 *        <script>
 *            var config = {
 *				// You can use itemData property, which is equivalent to listItemUpdater,
 *				// but it's deprecated and kept only for compatibility with old Web UI Framework.
 *				// Set list item updater for jQ template
 *				listItemUpdater: function (idx) {
 *					return JSON_DATA[idx];
 *				},
 *				// JSON_DATA is an object which holds all records that you want to load
 *				// You can use numitemdata property, which is equivalent to dataLength,
 *				// but it's deprecated and kept only for compatibility with old Web UI Framework.
 *				// Declare total number of items
 *				dataLength: JSON_DATA.length
 *			};
 *
 *            // Create widget using TAU notation
 *            tau.widget.ExtendableList(document.getElementById("widgetIdSelector"), config)
 *                .create();
 *
 *            // ... or using jQM notation
 *            $( "#widgetIdSelector" ).extendablelist( "create", config );
 *        </script>
 *
 *
 * #### Setting listItemUpdater option
 * List item updater function is called for every processed list element. There are two types of updater function. If there is **not** used jQuery Template mode updater should takes two arguments (processed index, list item element). otherwise function should return object and takes only one argument(processed index). Please check example for details.
 *
 * ##### Setting listItemUpdater in normal mode
 * List item updater function should takes **two parameters** when using non jQuery Template mode:
 * - **processedIndex** {number} Index of processed data set (zero based),
 * - **element** {HTMLElement} Current processed list item.
 *
 *        @example
 *        <script>
 *            var myNewListItemUpdater = function (processedIndex, listItem) {
 *				// JSON_DATA is an object which holds all records that you want to load
 *				var data = JSON_DATA[processedIndex];
 *				// Do some crazy things with listItem
 *				listItem.textContent = data.NAME;
 *				if (Math.round(Math.random()) === 1) {
 *					listItem.classList.add('crazy-class');
 *				}
 *			}
 *            // Create widget using TAU notation ...
 *            tau.widget.ExtendableList(document.getElementById("widgetIdSelector"))
 *                .option("listItemUpdater", myNewListItemUpdater);
 *
 *            // ... or using jQM notation
 *            $( "#widgetIdSelector" ).extendablelist( "option", "listItemUpdater", myNewListItemUpdater );
 *        </script>
 *
 *
 * ##### Setting listItemUpdater in jQuery Template mode
 * Using **jQuery Template** mode list item updater function should takes **one parameter** and returns an Object:
 * - **processedIndex** {number} Index of processed data set (zero based).
 *
 *        @example
 *        <script>
 *            var myTemplateListItemUpdater = function (processedIndex) {
 *				// JSON_DATA is an object which holds all records that you want to load
 *				return JSON_DATA[processedIndex];
 *			}
 *            // Create widget using TAU notation ...
 *            tau.widget.ExtendableList(document.getElementById("templateWidgetIdSelector"))
 *                .option("listItemUpdater", myTemplateListItemUpdater);
 *
 *            // ... or using jQM notation
 *            $( "#templateWidgetIdSelector" ).extendablelist( "option", "listItemUpdater", myTemplateListItemUpdater );
 *        </script>
 *
 *
 * @class ns.widget.mobile.ExtendableList
 * @extends ns.widget.mobile.Listview
 * @author Michał Szepielak <m.szepielak@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util",
			"../../../core/util/DOM",
			"../../../profile/mobile/widget/mobile", // fetch namespace
			"../../../profile/mobile/widget/mobile/Listview",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {ns.widget.mobile.Listview} Listview alias variable
			 * @private
			 * @static
			 */
			var Listview = ns.widget.mobile.Listview,

				/**
				 * @property {Object} parentBuild Shortcut for parent's {@link ns.widget.mobile.Listview#_build}
				 * method from prototype of {@link ns.widget.mobile.Listview}
				 * @private
				 * @static
				 * @member ns.widget.mobile.ExtendableList
				 */
				parentBuild = Listview.prototype._build,

				/**
				 * @property {Object} engine Alias for class {@link ns.engine}
				 * @private
				 * @static
				 * @member ns.widget.mobile.ExtendableList
				 */
				engine = ns.engine,

				/**
				 * @property {Object} util Alias for class {@link ns.util}
				 * @private
				 * @static
				 * @member ns.widget.mobile.ExtendableList
				 */
				util = ns.util,

				ExtendableList = function () {
					var self = this;

					/**
					 * @property {number} _currentIndex Current zero-based index of data set.
					 * @member ns.widget.mobile.ExtendableList
					 * @protected
					 */
					self._currentIndex = 0;

					/**
					 * @property {Object} options ExtendableList widget options.
					 * @property {?number} [options.bufferSize=null] Maximum number of items which will be loaded on widget startup and after each extension.
					 * @property {?number} [options.extenditems=null] Alias for bufferSize to preserve compatibility with Web UI Framework (deprecated)
					 * @property {number} options.dataLength Total number of list items.
					 * @property {number} options.numitemdata Alias for dataLength to preserve compatibility with Web UI Framework (deprecated)
					 * @property {Function} options.listItemUpdater Holds reference to method which modifies list items depended at specified index from database. <br>Method <b>should be overridden</b> by developer using <a href="#_setListItemUpdater">_setListItemUpdater</a> method or defined as a config object. <br>Method takes two parameters:<br>  -  index {number} Index of processed data set (zero based)<br> -  element {HTMLElement} List item to be modified (only non jQuery Template mode)
					 * @property {?Function} [options.itemData=null] Alias for listItemUpdater to preserve compatibility with Web UI Framework (deprecated)
					 * @property {Function} options.listItemLoader Holds reference to method which modifies loader item. <br>Method <b>should be overridden</b> by developer using <a href="#setListItemLoader">setListItemLoader</a> method or defined as a config object. <br>Method takes two parameters:<br>  -  loaderContainer {HTMLElement} Loader container, list element that holds e.g. extend button. If all elements will be loaded, this element will be removed from list.<br>  -  numMoreItems {number} Number of items, that left to load.
					 * @property {string} [options.loadmore="tmp_load_more"] Load more container jQuery Template's ID
					 * @property {string} options.template List item jQuery Template's ID. If this option is not **null** widget will work in jQuery Template mode.
					 * @member ns.widget.mobile.ExtendableList
					 */
					self.options = {
						bufferSize: 50,
						extenditems: null,
						dataLength: 0,
						numitemdata: 0,
						listItemUpdater: null,
						itemData: null,
						listItemLoader: null,
						loadmore: "tmp_load_more",
						template: null
					};

					//@TODO jQuery template, change to better template system
					self._jQueryTmpl = false;
					self.$tmpl = {};

					/**
					 * @property {Object} _listItemLoaderBound Binding for loader item to fire method {ns.widget.mobile.ExtendableList._buildList}.
					 * @member ns.widget.mobile.ExtendableList
					 * @protected
					 */
					self._listItemLoaderBound = null;
				},

				/**
				 * @property {Object} classes Dictionary object containing commonly used widget CSS classes
				 * @static
				 * @member ns.widget.mobile.ExtendableList
				 */
				classes = {
					CONTAINER: "ui-extendable-list-container",
					ACTIVE: "ui-listview-active"
				},
				// Cached prototype for better minification
				prototype = new Listview();

			/**
			 * Copy alias options from old Web UI notation
			 * @param {ns.widget.mobile.ExtendableList} self Widget instance
			 * @param {Object} newOptions
			 * @private
			 * @static
			 * @member ns.widget.mobile.ExtendableList
			 */
			function copyAliases(self, newOptions) {
				var options = self.options;

				if (newOptions === undefined) {
					newOptions = options;
				}

				if (newOptions.extenditems || options.extenditems) {
					options.bufferSize = parseInt(newOptions.extenditems, 10) || parseInt(options.extenditems, 10);
				}

				if (newOptions.numitemdata || options.numitemdata) {
					options.dataLength = parseInt(newOptions.numitemdata, 10) || parseInt(options.numitemdata, 10);
				}

				if (newOptions.itemData || options.itemData) {
					options.listItemUpdater = newOptions.itemData || options.itemData;
				}
			}

			/**
			 * Unbinds vclick event from loader element.
			 * @param {ns.widget.mobile.ExtendableList} self Widget instance
			 * @param {HTMLElement} loaderItem Loader element
			 * @private
			 * @static
			 * @member ns.widget.mobile.ExtendableList
			 */
			function _unbindLoader(self, loaderItem) {
				if (self._listItemLoaderBound !== null) {
					loaderItem.removeEventListener("vclick", self._listItemLoaderBound, false);
				}
				self._listItemLoaderBound = null;
			}

			/**
			 * Binds vclick event to loader element.
			 * @param {ns.widget.mobile.ExtendableList} self Widget instance
			 * @param {HTMLElement} loaderItem Loader element
			 * @private
			 * @static
			 * @member ns.widget.mobile.ExtendableList
			 */
			function _bindLoader(self, loaderItem) {
				if (loaderItem) {
					_unbindLoader(self, loaderItem);
					self._listItemLoaderBound = self._buildList.bind(self);
					loaderItem.addEventListener("vclick", self._listItemLoaderBound, false);
				}
			}

			/**
			 * Updates list item using user defined listItemUpdater function.
			 * @method _updateListItem
			 * @param {HTMLElement} element List element to update
			 * @param {number} index Data row index
			 * @member ns.widget.mobile.ExtendableList
			 * @protected
			 */
			prototype._updateListItem = function (element, index) {
				var self = this,
					listItemUpdater = self.options.listItemUpdater;

				//@TODO jQuery template, change for better template system
				if (self._jQueryTmpl === true) {
					// Call list item updater and set list item content
					element.outerHTML = self.$tmpl.item.tmpl(listItemUpdater(index))[0].outerHTML;
				} else {
					// Call list item updater
					listItemUpdater(index, element);
				}
			};

			/**
			 * Build widget structure
			 * @method _build
			 * @param {HTMLElement} element Widget's element
			 * @return {HTMLElement} Element on which built is widget
			 * @member ns.widget.mobile.ExtendableList
			 * @protected
			 */
			prototype._build = function (element) {
				var self = this;

				//Call parent's method
				parentBuild.call(self, element);

				// Add necessary CSS Classes
				element.classList.add(classes.CONTAINER);

				return element;
			};

			/**
			 * Builds widget list structure. Creates all list items and updates it using updater method.
			 * @method _buildList
			 * @member ns.widget.mobile.ExtendableList
			 * @protected
			 */
			prototype._buildList = function () {
				var listItem,
					self = this,
					list = self.element,
					options = self.options,
					bufferSize = options.bufferSize,
					dataLength = options.dataLength - 1, // Indexes are 0 based
					numberOfItems,
					currentIndex = self._currentIndex,
					loaderItem = null,
					i;

				// Get loader item if exists or create new one
				loaderItem = list.lastElementChild || document.createElement("li");

				// Get number of items to load
				numberOfItems = currentIndex + bufferSize > dataLength ? dataLength - currentIndex : bufferSize;

				// Load additional items
				for (i = 0; i < numberOfItems; ++i) {
					listItem = document.createElement("li");
					// To copy all element's attributes we use outerHTML property,
					// that's why we should not be appended to document fragment,
					// due document fragment is not an element node
					list.appendChild(listItem);
					self._updateListItem(listItem, i + currentIndex);

				}

				// Update current Index
				currentIndex += numberOfItems;

				// Get number of items to load for next time
				numberOfItems = currentIndex + bufferSize > dataLength ? dataLength - currentIndex : bufferSize;

				if (numberOfItems > 0) {
					// Update loader
					//@TODO jQuery template, change for better template system
					if (self._jQueryTmpl === true) {
						// Remove current loader to swap with new one
						if (loaderItem.parentNode) {
							loaderItem.parentNode.removeChild(loaderItem);
						}

						loaderItem = self.$tmpl.more.tmpl({"NUM_MORE_ITEMS": numberOfItems})[0];
					} else {
						options.listItemLoader(loaderItem, numberOfItems);
					}
					_bindLoader(self, loaderItem);

					// Add loader item or move it on end of the list if it's already appended.
					list.appendChild(loaderItem);
				} else {
					// Remove loader item node
					if (loaderItem.parentElement) {
						loaderItem.parentElement.removeChild(loaderItem);
						_unbindLoader(self, loaderItem);
					}
					loaderItem = null;
				}

				self._currentIndex = currentIndex;

				// Refresh widget
				self._refresh();
			};

			/**
			 * Configure widget in normal mode - using user defined method for item update.
			 * @method _configureNormal
			 * @param {Object} config Configuration options {@link ns.widget.mobile.ExtendableList#options}
			 * @protected
			 * @member ns.widget.mobile.ExtendableList
			 */
			prototype._configureNormal = function (config) {
				var options = this.options;

				if (util.isNumber(config.dataLength)) {
					options.dataLength = config.dataLength;
				}

				if (util.isNumber(config.bufferSize)) {
					options.bufferSize = config.bufferSize;
				}

				if (typeof config.listItemLoader === "function") {
					options.listItemLoader = config.listItemLoader;
				}

				if (typeof config.listItemUpdater === "function") {
					options.listItemUpdater = config.listItemUpdater;
				}
			};

			//@TODO jQuery template, change for better template system
			/**
			 * Configure widget in jQuery Template mode and grab template.
			 * Probably this method will be deprecated in future
			 * due to change for better template system.
			 * @method _configureTemplate
			 * @param {Object} config Configuration options {@link ns.widget.mobile.ExtendableList#options}
			 * @protected
			 * @member ns.widget.mobile.ExtendableList
			 */
			prototype._configureTemplate = function (config) {
				var self = this,
					$tmpl = self.$tmpl,
					options = self.options;

				// Set jQueryTmpl mode
				//@TODO jQuery template, change to better template system
				self._jQueryTmpl = true;

				copyAliases(self, config);

				// Assign templates
				// NOTE: jQuery is used here!
				$tmpl.item = $("#" + options.template);
				$tmpl.more = $("#" + options.loadmore);

				self._configureNormal(config);
			};


			/**
			 * Creates Extendable List with provided options. For more information of usage please check HTML Examples section.
			 *
			 *    @example
			 *    <script>
			 *        var widget = tau.widget.ExtendableList(document.getElementById("widgetIdSelector")),
			 *            config = {
			 *				// Create with custom list item updater
			 *				listItemUpdater: function (processedIndex, listItem) {
			 *					var data = JSON_DATA[processedIndex];
			 *					listItem.textContent = data.NAME;
			 *				},
			 *				bufferSize: 20,
			 *				dataLength: 500
			 *			};
			 *
			 *        widget.create();
			 *
			 *        // or using jQuery Mobile
			 *
			 *        $( "#widgetIdSelector" ).extendablelist( "create", config );
			 *    </script>
			 *
			 * @method create
			 * @param {Object} config Configuration options {@link ns.widget.mobile.ExtendableList#options}
			 * @member ns.widget.mobile.ExtendableList
			 */
			prototype.create = function (config) {
				var self = this,
					options = self.options;

				if (!config) {
					config = options;
				}

				self._destroy();

				//@TODO jQuery template, change for better template system
				if (config.template || options.template) {
					self._configureTemplate(config);
				} else {
					copyAliases(self);
					self._configureNormal(config);
				}

				// Make sure, that buffer size is not bigger than number of provided records
				if (options.dataLength < options.bufferSize) {
					options.bufferSize = options.dataLength - 1;
				}

				// Make sure that buffer size has at least one element
				if (options.bufferSize < 1) {
					options.bufferSize = 1;
				}

				// Build first part of list
				self._buildList();
			};

			/**
			 * Initialize widget on an element.
			 * @method _init
			 * @param {HTMLElement} element Widget's element
			 * @member ns.widget.mobile.ExtendableList
			 * @protected
			 */
			prototype._init = function (element) {
				var self = this;

				// Set current index to first element
				self._currentIndex = 0;

				// Assign variables to members
				self.element = element;
			};

			/**
			 * Refresh a ExtendableList list elements.
			 *
			 * This method should be called after are manually change in HTML attributes of widget DOM structure.
			 *
			 * This method is called automatically after extending list with new list positions.
			 *
			 *    @example
			 *    <script>
			 *        var widget = tau.widget.ExtendableList(document.getElementById("widgetIdSelector"));
			 *        widget.refresh();
			 *
			 *        // or
			 *
			 *        $( "#widgetIdSelector" ).extendablelist( "refresh" );
			 *    </script>
			 *
			 * @method refresh
			 * @param {boolean} [create=false] Sets create flag to refresh Listview in create mode. For more
			 * details check {@link ns.widget.mobile.Listview#refresh}.
			 * @chainable
			 * @member ns.widget.mobile.ExtendableList
			 */

			/**
			 * Refresh list
			 * @method _refresh
			 * @param {boolean} [create=false] Sets create flag to refresh Listview in create mode. For more
			 * details check {@link ns.widget.mobile.Listview#refresh}.
			 * @member ns.widget.mobile.ExtendableList
			 * @protected
			 */
			prototype._refresh = function (create) {
				// Create not built widgets
				engine.createWidgets(this.element);
				// Calling NOT overridden parent's method
				this._refreshItems(this.element, !!create);
			};

			/**
			 * Binds ExtendableList events
			 * @method _bindEvents
			 * @member ns.widget.mobile.ExtendableList
			 * @protected
			 */
			prototype._bindEvents = function () {
				var self = this;

				_bindLoader(self, self.element.lastElementChild);
			};

			/**
			 * Cleans widget's resources and removes all child elements.
			 *
			 *    @example
			 *    var widget = tau.widget.ExtendableList(document.getElementById("widgetIdSelector"));
			 *    widget.destroy();
			 *
			 *    // or using jQuery Mobile
			 *
			 *    $( "#widgetIdSelector" ).extendablelist( "destroy" );
			 * @method destroy
			 * @member ns.widget.mobile.ExtendableList
			 */

			/**
			 * @method _destroy
			 * @member ns.widget.mobile.ExtendableList
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this,
					element = self.element,
					listItem,
					loaderItem = element.lastElementChild;

				_unbindLoader(self, loaderItem);

				//Remove li elements.
				while (element.firstElementChild) {
					listItem = element.firstElementChild;
					listItem = element.firstElementChild;
					element.removeChild(listItem);
				}
				self._currentIndex = 0;

			};

			/**
			 * Recreates widget with new data set and resets list item updater. This function is used only in jQuery Template mode.
			 * This function is still available to keep Web UI Framework compatibility and will be removed with new version of TAU
			 *
			 *    @example
			 *    <script>
			 *        var widget = tau.widget.ExtendableList(document.getElementById("widgetIdSelector")),
			 *        // loadData should return an array.
			 *        newDataSource = loadData() || [];
			 *
			 *        widget.recreate(newDataSource);
			 *
			 *        // or using jQuery Mobile
			 *
			 *        $( "#widgetIdSelector" ).extendablelist( "recreate", newDataSource );
			 *    </script>
			 *
			 * @method recreate
			 * @param {Array} newDataSource An array with new records for displayed list.
			 * @deprecated 2.3
			 * @member ns.widget.mobile.ExtendableList
			 */
			prototype.recreate = function (newDataSource) {
				return this.create({
					itemData: function (idx) {
						return newDataSource[idx];
					},
					numitemdata: newDataSource.length
				});
			};


			/**
			 * Sets list item updater function. List item updater function is called for every processed list element.
			 * There are two types of updater function. If there is **not** used jQuery Template mode updater should takes
			 * two arguments (processed index, list item element). otherwise function should return object and takes
			 * only one argument(processed index). Please check examples for details.
			 *
			 * @method _setListItemUpdater
			 * @param {HTMLElement} element Widget's HTML element
			 * @param {Function} updateFunction Function reference.
			 * @protected
			 * @member ns.widget.mobile.ExtendableList
			 */
			prototype._setListItemUpdater = function (element, updateFunction) {
				this.options.listItemUpdater = updateFunction;
			};

			/**
			 * Sets list item loader function. List item loader is always called after adding items process is finished. Please check examples for details.
			 * @method _setListItemLoader
			 * @param {HTMLElement} element Widget's HTML element
			 * @param {Function} loadFunction Function reference.
			 * @protected
			 * @member ns.widget.mobile.ExtendableList
			 */
			prototype._setListItemLoader = function (element, loadFunction) {
				this.options.listItemLoader = loadFunction;
			};

			ExtendableList.classes = classes;

			// Assign prototype
			ExtendableList.prototype = prototype;

			// definition
			ns.widget.mobile.ExtendableList = ExtendableList;

			engine.defineWidget(
				"ExtendableList",
				"[data-role='extendablelist'], .ui-extendablelist",
				["recreate", "create"],
				ExtendableList,
				"tizen"
			);


			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ExtendableList;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
