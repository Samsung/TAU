/*global window, ns, define */
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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * # PageContainer Widget
 * PageContainer is a widget, which is supposed to have multiple child pages but display only one at a time.
 *
 * @class ns.widget.core.PageContainer
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Krzysztof Głodowski <k.glodowski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/DOM/attributes",
			"../BaseWidget",
			"../core",
			"./Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				util = ns.util,
				DOM = util.DOM,
				engine = ns.engine,
				classes = {
					pageContainer: "ui-page-container",
					uiViewportTransitioning: "ui-viewport-transitioning",
					out: "out",
					in: "in",
					reverse: "reverse",
					uiPreIn: "ui-pre-in",
					uiBuild: "ui-page-build"
				},
				PageContainer = function () {
					/**
					 * Active page.
					 * @property {ns.widget.core.Page} [activePage]
					 * @member ns.widget.core.PageContainer
					 */
					this.activePage = null;
					this.inTransition = false;
				},
				EventType = {
					/**
					 * Triggered before the changePage() request
					 * has started loading the page into the DOM.
					 * @event pagebeforechange
					 * @member ns.widget.core.PageContainer
					 */
					PAGE_BEFORE_CHANGE: "pagebeforechange",
					/**
					 * Triggered after the changePage() request
					 * has finished loading the page into the DOM and
					 * all page transition animations have completed.
					 * @event pagechange
					 * @member ns.widget.core.PageContainer
					 */
					PAGE_CHANGE: "pagechange",
					PAGE_REMOVE: "pageremove"
				},
				animationend = "animationend",
				webkitAnimationEnd = "webkitAnimationEnd",
				mozAnimationEnd = "mozAnimationEnd",
				msAnimationEnd = "msAnimationEnd",
				oAnimationEnd = "oAnimationEnd",
				animationEndNames = [
					animationend,
					webkitAnimationEnd,
					mozAnimationEnd,
					msAnimationEnd,
					oAnimationEnd
				],
				prototype = new BaseWidget();
			//When resolved deferred function is responsible for triggering events related to page change as well as
			//destroying unused widgets from last page and/or removing last page

			function deferredFunction(fromPageWidget, toPageWidget, self, options) {
				if (fromPageWidget) {
					fromPageWidget.onHide();
					self._removeExternalPage(fromPageWidget, options);
				}
				toPageWidget.onShow();
				//>>excludeStart("tauPerformance", pragmas.tauPerformance);
				window.tauPerf.get("framework", "Trigger: pagechange");
				//>>excludeEnd("tauPerformance");
				self.trigger(EventType.PAGE_CHANGE);
				//>>excludeStart("tauPerformance", pragmas.tauPerformance);
				window.tauPerf.get("framework", "After trigger: pagechange");
				window.tauPerf.finish();
				//>>excludeEnd("tauPerformance");
			}

			/**
			 * Dictionary for PageContainer related event types.
			 * @property {Object} events
			 * @property {string} [events.PAGE_CHANGE="pagechange"]
			 * @member ns.router.route.popup
			 * @static
			 */
			PageContainer.events = EventType;

			/**
			 * Dictionary for PageContainer related css class names
			 * @property {Object} classes
			 * @member ns.widget.core.Page
			 * @static
			 * @readonly
			 */
			PageContainer.classes = classes;

			/**
			 * Build widget structure
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.core.PageContainer
			 * @protected
			 */
			prototype._build = function (element) {
				element.classList.add(classes.pageContainer);
				return element;
			};

			/**
			 * This method changes active page to specified element.
			 * @method change
			 * @param {HTMLElement} toPageElement The element to set
			 * @param {Object} [options] Additional options for the transition
			 * @param {string} [options.transition=none] Specifies the type of transition
			 * @param {boolean} [options.reverse=false] Specifies the direction of transition
			 * @member ns.widget.core.PageContainer
			 */
			prototype.change = function (toPageElement, options) {
				var self = this,
					fromPageWidget = self.getActivePage(),
					toPageWidget,
					calculatedOptions = options || {};

				// store options to detect that option was changed before process finish
				self._options = calculatedOptions;

				calculatedOptions.widget = calculatedOptions.widget || "Page";

				// The change should be made only if no active page exists
				// or active page is changed to another one.
				if (!fromPageWidget || (fromPageWidget.element !== toPageElement)) {
					if (toPageElement.parentNode !== self.element) {
						toPageElement = self._include(toPageElement);
					}

					self.trigger(EventType.PAGE_BEFORE_CHANGE);

					toPageElement.classList.add(classes.uiBuild);

					delete options.url;
					toPageWidget = engine.instanceWidget(toPageElement, calculatedOptions.widget, options);

					// set sizes of page for correct display
					toPageWidget.layout();

					if (toPageWidget.option("autoBuildWidgets") || toPageElement.querySelector(".ui-i3d") || toPageElement.querySelector(".ui-coverflow")) {
						engine.createWidgets(toPageElement, options);
					}

					if (fromPageWidget) {
						fromPageWidget.onBeforeHide();
					}
					toPageWidget.onBeforeShow();

					toPageElement.classList.remove(classes.uiBuild);

					// if options is different that this mean that another change page was called and we need stop
					// previous change page
					if (calculatedOptions === self._options) {
						calculatedOptions.deferred = {
							resolve: deferredFunction
						};
						self._transition(toPageWidget, fromPageWidget, calculatedOptions);
					}
				}
			};

			/**
			 * This method performs transition between the old and a new page.
			 * @method _transition
			 * @param {ns.widget.core.Page} toPageWidget The new page
			 * @param {ns.widget.core.Page} fromPageWidget The page to be replaced
			 * @param {Object} [options] Additional options for the transition
			 * @param {string} [options.transition=none] The type of transition
			 * @param {boolean} [options.reverse=false] Specifies transition direction
			 * @param {Object} [options.deferred] Deferred object
			 * @member ns.widget.core.PageContainer
			 * @protected
			 */
			prototype._transition = function (toPageWidget, fromPageWidget, options) {
				var self = this,
					element = self.element,
					elementClassList = element.classList,
					transition = !fromPageWidget || !options.transition ? "none" : options.transition,
					deferred = options.deferred,
					clearClasses = [classes.in, classes.out, classes.uiPreIn, transition],
					oldDeferredResolve,
					oneEvent;

				if (options.reverse) {
					clearClasses.push(classes.reverse);
				}
				self.inTransition = true;
				elementClassList.add(classes.uiViewportTransitioning);
				oldDeferredResolve = deferred.resolve;
				deferred.resolve = function () {
					var fromPageWidgetClassList = fromPageWidget && fromPageWidget.element.classList,
						toPageWidgetClassList = toPageWidget.element.classList;

					self._setActivePage(toPageWidget);
					self._clearTransitionClasses(clearClasses, fromPageWidgetClassList, toPageWidgetClassList);
					oldDeferredResolve(fromPageWidget, toPageWidget, self, options);
				};

				if (transition !== "none") {
					oneEvent = function () {
						toPageWidget.off(
							animationEndNames,
							oneEvent,
							false
						);
						deferred.resolve();
					};
					toPageWidget.on(
						animationEndNames,
						oneEvent,
						false
					);
					self._appendTransitionClasses(fromPageWidget, toPageWidget, transition, options.reverse);
				} else {
					window.setTimeout(deferred.resolve, 0);
				}
			};

			/**
			 * This method adds proper transition classes to specified page widgets.
			 * @param {ns.widget.core.Page} fromPageWidget Page widget from which transition will occur
			 * @param {ns.widget.core.Page} toPageWidget Destination page widget for transition
			 * @param {string} transition Specifies the type of transition
			 * @param {boolean} reverse Specifies the direction of transition
			 * @member ns.widget.core.PageContainer
			 * @protected
			 */
			prototype._appendTransitionClasses = function (fromPageWidget, toPageWidget, transition, reverse) {
				var classList;

				if (fromPageWidget) {
					classList = fromPageWidget.element.classList;
					classList.add(transition, classes.out);
					if (reverse) {
						classList.add(classes.reverse);
					}
				}

				classList = toPageWidget.element.classList;
				classList.add(transition, classes.in, classes.uiPreIn);
				if (reverse) {
					classList.add(classes.reverse);
				}
			};

			/**
			 * This method removes transition classes from classLists of page widget elements.
			 * @param {Object} clearClasses An array containing classes to be removed
			 * @param {Object} fromPageWidgetClassList classList object from source page element
			 * @param {Object} toPageWidgetClassList classList object from destination page element
			 * @member ns.widget.core.PageContainer
			 * @protected
			 */
			prototype._clearTransitionClasses = function (clearClasses, fromPageWidgetClassList, toPageWidgetClassList) {
				var self = this,
					element = self.element,
					elementClassList = element.classList;

				elementClassList.remove(classes.uiViewportTransitioning);
				self.inTransition = false;
				clearClasses.forEach(function (className) {
					toPageWidgetClassList.remove(className);
				});
				if (fromPageWidgetClassList) {
					clearClasses.forEach(function (className) {
						fromPageWidgetClassList.remove(className);
					});
				}
			};

			/**
			 * This method adds an element as a page.
			 * @method _include
			 * @param {HTMLElement} page an element to add
			 * @return {HTMLElement}
			 * @member ns.widget.core.PageContainer
			 * @protected
			 */
			prototype._include = function (page) {
				var element = this.element;

				if (!page.parentNode || page.ownerDocument !== document) {
					page = util.importEvaluateAndAppendElement(page, element);
				}
				return page;
			};

			/**
			 * This method sets currently active page.
			 * @method _setActivePage
			 * @param {ns.widget.core.Page} page a widget to set as the active page
			 * @member ns.widget.core.PageContainer
			 * @protected
			 */
			prototype._setActivePage = function (page) {
				var self = this;

				if (self.activePage) {
					self.activePage.setActive(false);
				}

				self.activePage = page;

				page.setActive(true);
			};

			/**
			 * This method returns active page widget.
			 * @method getActivePage
			 * @member ns.widget.core.PageContainer
			 * @return {ns.widget.core.Page} Currently active page
			 */
			prototype.getActivePage = function () {
				return this.activePage;
			};

			/**
			 * This method removes page element from the given widget and destroys it.
			 * @method _removeExternalPage
			 * @param {ns.widget.core.Page} fromPageWidget the widget to destroy
			 * @param {Object} [options] transition options
			 * @param {boolean} [options.reverse=false] specifies transition direction
			 * @member ns.widget.core.PageContainer
			 * @protected
			 */
			prototype._removeExternalPage = function (fromPageWidget, options) {
				var fromPageElement = fromPageWidget.element;

				if (options && options.reverse && DOM.hasNSData(fromPageElement, "external") &&
					fromPageElement.parentNode) {
					fromPageWidget.destroy();
					fromPageElement.parentNode.removeChild(fromPageElement);
					this.trigger(EventType.PAGE_REMOVE);
				}
			};

			PageContainer.prototype = prototype;

			// definition
			ns.widget.core.PageContainer = PageContainer;

			engine.defineWidget(
				"pagecontainer",
				"",
				["change", "getActivePage"],
				PageContainer,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return PageContainer;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
