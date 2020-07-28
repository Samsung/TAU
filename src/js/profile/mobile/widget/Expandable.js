/*global window, define, ns */
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
/*jslint nomen: true */
/**
 * #Expandable
 * Expandable component allows you to expand or collapse content when tapped.
 *
 * ## Default selectors
 * All elements with _data-role="expandable"_ or class _.ui-expandable_ are
 * changed to expandable component.
 *
 * ###HTML Examples
 *
 * ####Create expandable div using data-role
 *
 *		@example
 *		<div id="expandable" data-role="expandable">
 *			<h1>Expandable head</h1>
 *			<div>Content</div>
 *		</div>
 *
 * ####Create Expandable list using data-role
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="expandable">
 *				<h2>Expandable head</h2>
 *				<-- sub list -->
 *				<ul data-role="listview">
 *					<li>sub list item1</li>
 *					<li>sub list item2</li>
 *				</ul>
 *			</li>
 *		</ul>
 *
 * ####Create part of list as expandable
 *
 *		@example
 *		<ul data-role="listview">
 *			<li>list item1</li>
 *			<li>list item2</li>
 *			<li>list item3</li>
 *			<li>list item4</li>
			<li class="ui-expandable-from"></li>
 *			<li>list item5</li>
 *			<li>list item6</li>
 *			<li>list item7</li>
 *			<li>list item8</li>
 *		</ul>
 *
 * ####Create using class selector
 *
 *		@example
 *		<div id="expandable" class="ui-expandable">
 *			<h1>Expandable head</h1>
 *			<div>Content</div>
 *		</div>
 *
 * ## Manual constructor
 * For manual creation of Expandable component you can use constructor of component
 * from **tau** namespace:
 *
 *		@example
 *		<script>
 *			var expandableElement = document.getElementById("expandable"),
 *				expandable = tau.widget.Expandable(expandableElement,
 *					{collapsed: false});
 *		</script>
 *
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*. Second parameter is **options** and it is
 * a object with options for widget.
 *
 * ##Options for Collapsible Widget
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 *		@example
 *		var expandableElement = document.getElementById("expandable"),
 *			expandable = tau.widget.Expandable(expandableElement);
 *
 *		expandable.methodName(methodArgument1, methodArgument2, ...);
 *
 * @since 2.4
 * @class ns.widget.mobile.Expandable
 * @component-selector .ui-expandable [data-role]="expandable"
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Marcin Jakuszko <m.jakuszko@samsung.com>
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 * @author Heeju Joo <heeju.joo@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/event",
			"../../../core/util/selectors",
			"../../../core/util/DOM",
			"../widget",
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
				 * @property {Object} BaseWidget alias variable
				 * @private
				 * @static
				 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * @property {Object} engine alias variable
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} selectors alias variable
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors,
				/**
				 * @property {Object} eventUtil alias variable
				 * @private
				 * @static
				 */
				eventUtil = ns.event,
				/**
				 * @property {Object} domUtils alias variable
				 * @private
				 * @static
				 */
				domUtils = ns.util.DOM,

				/**
				 * @property {Object} expandableSelectors selectors used in this widget
				 * @private
				 * @static
				 */
				expandableSelectors = {
					HEADING: "h1,h2,h3,h4,h5,h6,legend,li"
				},

				Expandable = function () {
					/**
					 * Expandable widget options.
					 * @property {boolean} [options.collapsed=true] Determines if content should be collapsed on load
					 * @property {string} [options.heading="h1,h2,h3,h4,h5,h6,legend,li"] Within the Expandable container, the first immediate child element
					 * that matches this selector will be used as the header for the Expandable.
					 * @property {string} [options.expander="heading"] Determines which part of widget expands content: "heading", "button"
					 */
					this.options = {
						collapsed: true,
						heading: expandableSelectors.HEADING,
						expander: "heading"
					};

					this._eventHandlers = {};
					this._ui = {
						heading: null,
						expandableHeadingContent: null,
						expandButton: null,
						expandFrom: null,
						expandTo: null
					};

				},
				/**
				 * Dictionary object containing commonly used widget classes
				 * @property {Object} classes
				 * @readonly
				 * @static
				 * @member ns.widget.mobile.Expandable
				 */
				classes = {
					/**
					 * Standard expandable widget
					 * @style ui-expandable
					 * @member ns.widget.mobile.Expandable
					 */
					uiExpandable: "ui-expandable",
					/**
					 * Set content to expandable widget
					 * @style ui-expandable-content
					 * @member ns.widget.mobile.Expandable
					 */
					uiExpandableContent: "ui-expandable-content",
					/**
					 * Set collapsed content to expandable widget
					 * @style ui-expandable-content-collapsed
					 * @member ns.widget.mobile.Expandable
					 */
					uiExpandableContentCollapsed: "ui-expandable-content-collapsed",
					/**
					 * Set expandable widget as collapsed
					 * @style ui-expandable-collapsed
					 * @member ns.widget.mobile.Expandable
					 */
					uiExpandableCollapsed: "ui-expandable-collapsed",
					/**
					 * Set expandable widget as expanded
					 * @style ui-expandable-collapsed
					 * @member ns.widget.mobile.Expandable
					 */
					uiExpandableExpanded: "ui-expandable-expanded",
					/**
					 * Set heading to expandable widget
					 * @style ui-expandable-heading
					 * @member ns.widget.mobile.Expandable
					 */
					uiExpandableHeading: "ui-expandable-heading",
					/**
					 * Set collapsed heading to expandable widget
					 * @style ui-expandable-heading-collapsed
					 * @member ns.widget.mobile.Expandable
					 */
					uiExpandableHeadingCollapsed: "ui-expandable-heading-collapsed",
					/**
					 * Set toggle to expandable widget heading
					 * @style ui-expandable-heading-toggle
					 * @member ns.widget.mobile.Expandable
					 */
					uiExpandableHeadingToggle: "ui-expandable-heading-toggle",
					/**
					 * Set active to expandable widget heading
					 * @style ui-expandable-heading-active
					 * @member ns.widget.mobile.Expandable,
					 */
					uiExpandableHeadingActive: "ui-expandable-heading-active",
					/**
					 * Set active to expandable widget heading
					 * @style ui-expandable-heading-active
					 * @member ns.widget.mobile.Expandable
					 */
					expandButton: "ui-expand-button",
					/**
					 * All sibling elements after this element will be toggled
					 * @style ui-expandable-from
					 * @member ns.widget.mobile.Expandable
					 */
					expandFrom: "ui-expandable-from",
					/**
					 * All sibling elements before this element will be toggled.
					 * On this class will be build widget too
					 * @style ui-expandable-to
					 * @member ns.widget.mobile.Expandable
					 */
					expandTo: "ui-expandable-to"
				};


			Expandable.prototype = new BaseWidget();
			Expandable.classes = classes;
			Expandable.selectors = expandableSelectors;

			/**
			 * Handler function for expanding/collapsing widget
			 * @method toggleExpandableHandler
			 * @param {ns.widget.mobile.Expandable} self
			 * @param {HTMLElement} element
			 * @param {Event} event
			 * @private
			 */
			function toggleExpandableHandler(self, element, event) {
				var	ui = self._ui,
					elementClassList = element.classList,
					heading = ui.heading,
					headingClassList,
					content = ui.expandableContent,
					contentClassList,
					isCollapse = event.type === "collapse";

				if (event.defaultPrevented) {
					return;
				}

				event.preventDefault();

				if (ui.expandFrom) {
					if (isCollapse) {
						ui.expandFrom.classList.remove(classes.uiExpandableExpanded);
					} else {
						ui.expandFrom.classList.add(classes.uiExpandableExpanded);
					}
				} else {
					headingClassList = heading.classList;
					contentClassList = content.classList;
					//Toggle functions switched to if/else statement due to toggle bug on Tizen
					if (isCollapse) {
						elementClassList.add(classes.uiExpandableCollapsed);
						headingClassList.add(classes.uiExpandableHeadingCollapsed);
						contentClassList.add(classes.uiExpandableContentCollapsed);
					} else {
						elementClassList.remove(classes.uiExpandableCollapsed);
						headingClassList.remove(classes.uiExpandableHeadingCollapsed);
						contentClassList.remove(classes.uiExpandableContentCollapsed);
					}
					content.setAttribute("aria-hidden", isCollapse);
				}
				eventUtil.trigger(element, isCollapse ? "collapsed" : "expanded");
			}

			function setHeadingActiveClassHandler(self, setClass) {
				var heading = self._ui.heading,
					headingClassList;

				if (heading) {
					headingClassList = self._ui.heading.classList;
					if (setClass) {
						headingClassList.add(classes.uiExpandableHeadingActive);
					} else {
						headingClassList.remove(classes.uiExpandableHeadingActive);
					}
				}
			}

			function toggleEventTypeHandler(self, event) {
				var element = self.element,
					ui = self._ui,
					heading = ui.heading,
					expandFrom = ui.expandFrom,
					eventType;

				if (heading) {
					eventType = heading.classList.contains(classes.uiExpandableHeadingCollapsed) ? "expand" : "collapse";
				} else if (expandFrom) {
					eventType = expandFrom.classList.contains(classes.uiExpandableExpanded) ? "collapse" : "expand";
				}

				eventUtil.trigger(element, eventType);

				event.preventDefault();
				eventUtil.stopPropagation(event);
			}

			/**
			 * Method tries to find expandable heading or create new if not exists
			 * @method _getExpandableHeading
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.Expandable
			 */
			Expandable.prototype._getExpandableHeading = function (element) {
				var options = this.options,
					// First child matching selector is Expandable header
					expandableHeading = selectors.getChildrenBySelector(element, options.heading)[0],
					alternativeHeading;

				if (!expandableHeading) {
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.log("[Expandable widget] no elements matching heading selector found");
					//>>excludeEnd("tauDebug");
					expandableHeading = document.createElement("h1");
					element.appendChild(expandableHeading);
				}

				if (expandableHeading.tagName.toLowerCase() === "legend") {
					alternativeHeading = document.createElement("div");
					alternativeHeading.setAttribute("role", "heading");
					alternativeHeading.innerHTML = expandableHeading.innerHTML;
					element.replaceChild(alternativeHeading, expandableHeading);
					expandableHeading = alternativeHeading;
				}

				return expandableHeading;
			};

			/**
			 * Method tries to find expandable content or create new if not exists
			 * @method _getExpandableContent
			 * @protected
			 * @param {HTMLElement} element
 			 * @param {HTMLElement} expandableHeading
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.Expandable
			 */
			Expandable.prototype._getExpandableContent = function (element, expandableHeading) {
				var expandableContent = element.querySelector("." + classes.uiExpandableContent);

				if (!expandableContent) {
					// Wrap all widget content
					domUtils.wrapInHTML(element.childNodes, "<div class='" + classes.uiExpandableContent + "'></div>");

					// Move header out
					element.insertBefore(expandableHeading, element.firstChild);
					domUtils.wrapInHTML(expandableHeading.childNodes, "<a class='" + classes.uiExpandableHeadingToggle + "' tabindex='0'></a>");
					expandableContent = expandableHeading.nextElementSibling;
				}
				return expandableContent;
			};

			/**
			 * Build list item for expand button on the end of listview
			 * @method _createExpandButton
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.Expandable
			 */
			Expandable.prototype._createExpandTo = function (element) {
				var expandTo = element.parentElement.querySelector("." + classes.expandTo);

				if (!expandTo) {
					expandTo = document.createElement("li");
					expandTo.classList.add(classes.expandTo);
					expandTo.setAttribute("data-expander", "button");
					// append to listview
					element.parentElement.appendChild(expandTo);
				}

				return expandTo;
			}

			/**
			 * Build expand button on listview item
			 * @method _createExpandButton
			 * @protected
			 * @param {HTMLElement} expandTo
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.Expandable
			 */
			Expandable.prototype._createExpandButton = function (expandTo) {
				var button = expandTo.querySelector(".ui-btn");

				if (!button) {
					button = document.createElement("a");
					button.classList.add("ui-btn");
					expandTo.appendChild(button);
					button.setAttribute("href", "#");
				}
				button.setAttribute("data-icon", "down");
				button.setAttribute("data-style", "flat");
				button.classList.add(classes.expandButton);

				return button;
			}

			/**
			 * Build widget structure
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.Expandable
			 */
			Expandable.prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					elementClassList = element.classList,
					expandableHeading,
					expandableContent;

				if (element.classList.contains(classes.expandFrom)) {
					ui.expandFrom = element;
					ui.expandTo = self._createExpandTo(element);
					ui.expandButton = self._createExpandButton(ui.expandTo);
				} else {
					if ((element.parentNode && element.parentNode.tagName.toLowerCase() === "ul") && (element.tagName.toLowerCase() === "div")) {
						ns.warn("Don't make the Expandable list using <div>. It violates standard of HTML rule. Instead of, please use <li>.");
					}
					elementClassList.add(classes.uiExpandable);

					expandableHeading = self._getExpandableHeading(element);
					expandableHeading.classList.add(classes.uiExpandableHeading);

					expandableContent = self._getExpandableContent(element, expandableHeading);

					ui.heading = expandableHeading;
					ui.expandableContent = expandableContent;
				}
				return element;
			};

			/**
			 * Init widget structure
			 * @method _init
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.Expandable
			 */
			Expandable.prototype._init = function (element) {
				var self = this,
					ui = self._ui;

				ui.heading = ui.heading || selectors.getChildrenByClass(element, classes.uiExpandableHeading)[0];
				ui.expandableContent = ui.expandableContent || element.querySelector("." + classes.uiExpandableContent);

				if (ui.expandTo) {
					ui.expandButton = ui.expandButton || ui.expandTo.querySelector("." + classes.expandButton);
					ns.widget.Button(ui.expandButton);
					if (self.options.collapsed) {
						element.classList.remove(classes.uiExpandableExpanded);
					}
				} else {
					ui.expandButton = ui.expandButton || element.querySelector("." + classes.expandButton);
					if (self.options.collapsed) {
						element.classList.add(classes.uiExpandableCollapsed);
						if (ui.heading) {
							ui.heading.classList.add(classes.uiExpandableHeadingCollapsed);
						}
						if (ui.expandableContent) {
							ui.expandableContent.classList.add(classes.uiExpandableContentCollapsed);
						}
					}
				}

				return element;
			};

			/**
			 * Bind widget events
			 * @method _bindEvents
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.Expandable
			 */
			Expandable.prototype._bindEvents = function (element) {
				var self = this,
					eventHandlers = self._eventHandlers,
					ui = self._ui,
					heading = ui.heading;

				// Declare handlers with and assign them to local variables
				eventHandlers.toggleExpandable = toggleExpandableHandler.bind(null, self, element);
				eventHandlers.removeActiveClass = setHeadingActiveClassHandler.bind(null, self, false);
				eventHandlers.addActiveClass = setHeadingActiveClassHandler.bind(null, self, true);
				eventHandlers.toggleEventType = toggleEventTypeHandler.bind(null, self);

				eventUtil.on(element, "expand collapse", eventHandlers.toggleExpandable, false);

				if (heading) {
					eventUtil.on(heading, "vmousedown", eventHandlers.addActiveClass, false);
					eventUtil.on(heading, "vmousemove vmousecancel vmouseup", eventHandlers.removeActiveClass, false);
					eventUtil.on(heading, "vclick", eventHandlers.toggleEventType, false);
				} else if (ui.expandTo) {
					eventUtil.on(ui.expandButton, "vclick", eventHandlers.toggleEventType, false);
				}
			};

			/**
			 * This method refreshes Expandable.
			 *
			 *		@example
			 *		<div id="Expandable" data-role="expandable">
			 *			<h6>Expandable head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			var ExpandableWidget = tau.widget.Expandable(document.getElementById("Expandable"));
			 *			ExpandableWidget.refresh();
			 *		</script>
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.Expandable
			 */

			/**
			* Refresh structure
			* @method _refresh
			* @protected
			* @member ns.widget.mobile.Expandable
			*/
			Expandable.prototype._refresh = function () {
				return;
			};

			/**
			 * Removes the Expandable functionality completely.
			 *
			 *		@example
			 *		<div id="Expandable" data-role="expandable">
			 *			<h6>Expandable head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			var ExpandableWidget = tau.widget.Expandable(document.getElementById("Expandable"));
			 *			ExpandableWidget.destroy();
			 *		</script>
			 *
			 * @method destroy
			 * @member ns.widget.mobile.Expandable
			 */

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.Expandable
			 */
			Expandable.prototype._destroy = function () {
				var self = this,
					element = self.element,
					ui = self._ui,
					heading = ui.heading,
					eventHandlers = self._eventHandlers,
					parentNode = element.parentNode;

				eventUtil.off(element, "expand collapse", eventHandlers.toggleExpandable, false);

				if (heading) {
					eventUtil.off(heading, "vmousedown", eventHandlers.addActiveClass, false);
					eventUtil.off(heading, "vmousemove vmousecancel vmouseup", eventHandlers.removeActiveClass, false);
					eventUtil.off(heading, "vclick", eventHandlers.toggleEventType, false);
				} else if (ui.expandTo) {
					eventUtil.off(ui.expandButton, "vclick", eventHandlers.toggleEventType, false);
				}

				self._ui = null;
				self._eventHandlers = null;

				eventUtil.trigger(document, "destroyed", {
					widget: "Expandable",
					parent: parentNode
				});
			};

			// definition
			ns.widget.mobile.Expandable = Expandable;
			engine.defineWidget(
				"Expandable",
				"[data-role='expandable'], .ui-expandable, .ui-expandable-from",
				[],
				Expandable,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Expandable;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
