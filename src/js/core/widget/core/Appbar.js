/*
 * Copyright (c) 2019 Samsung Electronics Co., Ltd
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
/*global window, define, ns */
/**
 *
 * @since 1.2
 * @class ns.widget.core.Appbar
 * @extends ns.widget.core.BaseWidget
 * @author Pawel Kaczmarczyk <p.kaczmarczy@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core",
			"../BaseWidget",
			"../../../core/event/gesture",
			"../../../core/engine",
			"../../../core/util/selectors",
			"./Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.util.object,
				utilsEvents = ns.event,
				utilSelectors = ns.util.selectors,
				Page = ns.widget.core.Page,
				min = Math.min,
				max = Math.max,
				Appbar = function () {
					var self = this;

					self.options = utilsObject.merge({}, Appbar.defaults);
					self._ui = {
						titleContainer: null,
						leftIconsContainer: null,
						actionButtonsContainer: null,
						page: null,
						selectAll: null,
						bottomBar: null
					},
					self._appbarState = states.COLLAPSED;
					self._dragStartingHeight = 0;
					self._currentHeight = 0;
					self._scrolledToTop = true;
				},
				BaseWidget = ns.widget.BaseWidget,
				prototype = new BaseWidget(),
				classPrefix = "ui-appbar",
				classes = {
					title: classPrefix + "-title",
					leftIconsContainer: classPrefix + "-left-icons-container",
					actionButtonsContainer: classPrefix + "-action-buttons-container",
					titleContainer: classPrefix + "-title-container",
					hasMultilineTitle: classPrefix + "-has-multiline",
					hasSubtitle: classPrefix + "-has-subtitle",
					expanded: classPrefix + "-expanded",
					dragging: classPrefix + "-dragging",
					controlsContainer: classPrefix + "-controls-container",
					expandedTitleContainer: classPrefix + "-expanded-title-container",
					selectAll: "ui-label-select-all",
					bottomBar: "ui-bottom-bar",
					hidden: "ui-hidden"
				},
				states = {
					EXPANDED: "EXPANDED",
					COLLAPSED: "COLLAPSED",
					DRAGGING: "DRAGGING"
				},
				nominalHeights = {
					COLLAPSED: 56,
					EXPANDED: 280
				},
				containersProperties = {
					leftIconsContainer: {
						selector: "." + classes.leftIconsContainer,
						class: classes.leftIconsContainer,
						position: 0
					},
					titleContainer: {
						selector: "." + classes.titleContainer,
						class: classes.titleContainer,
						position: 1
					},
					actionButtonsContainer: {
						selector: "." + classes.actionButtonsContainer,
						class: classes.actionButtonsContainer,
						position: 2
					}
				},
				selectors = {
					IS_CHECKED: ".ui-listview li > input[type='checkbox']:checked",
					IS_NOT_CHECKED: ".ui-listview li > input[type='checkbox']:not(:checked)"
				},
				defaults = {
					titleType: "singleLine" // "multiline", "subtitle"
				};

			Appbar.prototype = prototype;
			Appbar.defaults = defaults;
			Appbar.classes = classes;

			prototype._init = function (element) {
				var self = this;

				self._appbarState = states.COLLAPSED;
				self._ui.page = utilSelectors.getClosestBySelector(element, Page.selector);
				self._ui.selectAll = element.querySelector("." + classes.selectAll + " input[type='checkbox']");
				self._ui.bottomBar = self._ui.page.querySelector("." + classes.bottomBar);
			};

			/**
			 * Build the widget
			 * @method _build
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._build = function (element) {
				var self = this;

				self._createContainers(element);
				self._readTitleType(element);
				self._setTitleType(element, self.options.titleType);
				return element;
			};

			/**
			 * Refresh the widget
			 * @method _refresh
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._refresh = function (element) {
				var self = this;

				self._setLineType(element);
			};

			/**
			 * Method that creates containers (or finds ones if already exists)
			 * for different sections of appbar widgets
			 * @method _createContainers
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._createContainers = function (element) {
				var self = this,
					ui = self._ui;

				ui.expandedTitleContainer = document.createElement("div")
				ui.expandedTitleContainer.classList.add(classes.expandedTitleContainer);
				element.appendChild(ui.expandedTitleContainer);

				ui.controlsContainer = document.createElement("div")
				ui.controlsContainer.classList.add(classes.controlsContainer);
				element.appendChild(ui.controlsContainer);

				Object.keys(containersProperties).forEach(function (containerName) {
					var config = containersProperties[containerName],
						container = element.querySelector(config.selector);

					if (!container) {
						container = document.createElement("div");
						container.classList.add(config.class);
						element.appendChild(container);
					}
					ui[containerName] = container;
				});

				// All of the containers should be placed inside controls container and in specific order
				Object.keys(containersProperties).sort(function (a, b) {
					return containersProperties[a].position - containersProperties[b].position;
				}).forEach(function (key) {
					ui.controlsContainer.appendChild(ui[key]);
				});

				[].slice.call(ui.titleContainer.children).forEach(function (node) {
					ui.expandedTitleContainer.appendChild(node.cloneNode(true));
				});
			};

			/**
			 * Binds event listeners
			 * @method _bindEvents
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._bindEvents = function () {
				var self = this;

				ns.event.enableGesture(self._ui.page,
					new ns.event.gesture.Drag());

				utilsEvents.on(self._ui.page, "scrollboundary drag dragstart dragend scrollstart change pagebeforeshow", self);
			};

			/**
			 * Handle event
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "scrollboundary":
						self._onScrollBoundary(event);
						break;
					case "drag":
						self._onDrag(event);
						break;
					case "dragstart":
						self._onDragStart(event);
						break;
					case "dragend":
						self._onDragEnd(event);
						break;
					case "scrollstart":
						self._onScrollStart(event);
						break;
					case "change":
						self._onChange(event);
						break;
					case "pagebeforeshow":
						self._onPageBeforeShow();
						break;
				}
			};

			/**
			 * PageBeforeShow event handler
			 * @method _onPageBeforeShow
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._onPageBeforeShow = function () {
				var self = this,
					ui = self._ui;

				if (ui.selectAll) {
					self._triggerSelectAll();
					if (ui.bottomBar) {
						self._toggleBottomBar(!!ui.page.querySelector(selectors.IS_CHECKED));
					}
					self._updateTitle();
				}
			};

			/**
			 * Scrollstart event handler
			 * @method _onScrollStart
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._onScrollStart = function () {
				this._scrolledToTop = false;
			}

			/**
			 * Scrollstart event handler
			 * @method _onScrollStart
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._onScrollBoundary = function (event) {
				var self = this,
					direction = event && event.detail && event.detail.direction;

				self._scrolledToTop = (direction === "top");
				utilsEvents.one(self._ui.page, "scrollstart", self._onScrollStart.bind(self));
			};

			/**
			 * Dragstart event handler
			 * @method _onDragStart
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._onDragStart = function (event) {
				var self = this;

				if ((event.detail.direction === "down" && self._appbarState == states.COLLAPSED && self._scrolledToTop) ||
					(event.detail.direction === "up" && self._appbarState == states.EXPANDED)) {
					self._appbarState = states.DRAGGING;
					self.element.classList.add(classes.dragging);
					self._dragStartingHeight = self.element.getBoundingClientRect().height;

					// trigger appbarDragStart Event - page should disable scrolling module
					self._expandedTitleHeight = 0;
					[].slice.call(self._ui.expandedTitleContainer.children).forEach(function (item) {
						self._expandedTitleHeight += item.offsetHeight;
					});
				}
			};

			prototype._setTitlesOpacity = function (expandLevel) {
				var self = this,
					ui = self._ui,
					mainTitle = ui.titleContainer,
					expandedTitle = ui.expandedTitleContainer;

				mainTitle.style.opacity = 1 - expandLevel;
				expandedTitle.style.opacity = expandLevel;
			};

			/**
			 * Dragend event handler
			 * @method _onDragEnd
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._onDragEnd = function () {
				var self = this,
					threshold = (nominalHeights.COLLAPSED + nominalHeights.EXPANDED) / 2;

				self.element.classList.remove(classes.dragging);

				self.element.style.height = "";

				if (self._currentHeight > threshold) {
					self.element.classList.add(classes.expanded);
					self._appbarState = states.EXPANDED;
					self._setTitlesOpacity(1);
					utilsEvents.trigger(self.element, "appbarexpanded");
				} else {
					self.element.classList.remove(classes.expanded);
					self._appbarState = states.COLLAPSED;
					self._setTitlesOpacity(0);
					utilsEvents.trigger(self.element, "appbarcollapsed");
				}

				// trigger appbarDragStart Event - page should enable scrolling back again
				// appbar resized event should be triggered (in order to inform Page about content height change)
			};

			/**
			 * Drag event handler
			 * @method _onDrag
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._onDrag = function (event) {
				var self = this,
					deltaY = event && event.detail && event.detail.deltaY,
					totalHeight = self._dragStartingHeight + ((deltaY !== undefined) ? deltaY : 0),
					totalMovement = 0;

				if (self._appbarState === states.DRAGGING) {
					totalHeight = min(totalHeight, nominalHeights.EXPANDED);
					totalHeight = max(totalHeight, nominalHeights.COLLAPSED);

					self._currentHeight = totalHeight;
					self.element.style.height = totalHeight + "px";

					totalMovement = totalHeight - nominalHeights.COLLAPSED;

					if (totalMovement > self._expandedTitleHeight) {
						self._setTitlesOpacity(totalMovement / (nominalHeights.EXPANDED - nominalHeights.COLLAPSED));
					} else {
						self._setTitlesOpacity(0);
					}
				}
			};

			/**
			 * Method triggers "select-all" event
			 * @method _triggerSelectAll
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._triggerSelectAll = function () {
				var self = this;

				utilsEvents.trigger(self.element, "select-all", {checked: self._ui.selectAll.checked});
			};

			/**
			 * Toggle state of checkbox "All"
			 * @method _toggleSelectAll
			 * @param {boolean} checked
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._toggleSelectAll = function (checked) {
				var selectAll = this._ui.selectAll;

				if (selectAll) {
					selectAll.checked = checked;
					if (checked) {
						selectAll.setAttribute("checked", "checked");
					} else {
						selectAll.removeAttribute("checked");
					}
				}
			};

			/**
			 * Toggle visibility of BottomBar
			 * @method _toggleBottomBar
			 * @param {boolean} visible
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._toggleBottomBar = function (visible) {
				this._ui.bottomBar.classList.toggle(classes.hidden, !visible);
			};

			/**
			 * Method returns number of checkboxes in state checked
			 * @method _getNumberOfChecked
			 * @member ns.widget.core.Appbar
			 * @return {number}
			 * @protected
			 */
			prototype._getNumberOfChecked = function () {
				return this._ui.page.querySelectorAll(selectors.IS_CHECKED).length;
			};

			/**
			 * Handler for "change" event
			 * @method _onChange
			 * @param {Event} event
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._onChange = function (event) {
				var target = event.target,
					self = this,
					page = self._ui.page;

				if (target.tagName === "INPUT") {
					if (target === self._ui.selectAll) {
						self._triggerSelectAll();
					} else {
						self._toggleSelectAll(!page.querySelector(selectors.IS_NOT_CHECKED));
					}

					if (self._ui.bottomBar) {
						self._toggleBottomBar(!!page.querySelector(selectors.IS_CHECKED));
					}
					if (self._ui.selectAll) {
						self._updateTitle();
					}
				}
			};

			/**
			 * Update AppBar title according to number of selected items
			 * @method _updateTitle
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._updateTitle = function () {
				var titles = [].slice.call(this.element.querySelectorAll("." + classes.title)),
					numberOfSelectedItems = this._getNumberOfChecked();

				titles.forEach(function (title) {
					title.textContent = numberOfSelectedItems === 0 ?
						"Select items" :
						numberOfSelectedItems + " selected";
				});
			};

			/**
			 * Unbinds event listeners
			 * @method _unbindEvents
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._unbindEvents = function () {
				var self = this;

				utilsEvents.off(self._ui.page, "scrollboundary drag dragstart dragend scrollstart change", self);
			};

			/**
			 * Destroys the widget
			 * @method _destroy
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this;

				self._unbindEvents();
				// restore title elements if they're moved during build
			};

			/**
			 * Method that detects title style
			 * @method _readTitleType
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._readTitleType = function () {
				var self = this,
					titleContainer = self._ui.titleContainer;

				if (titleContainer.classList.contains(classes.hasMultilineTitle)) {
					self.options.titleType = "multiline";
				}
				if (titleContainer.classList.contains(classes.hasSubtitle)) {
					self.options.titleType = "subtitle";
				}
			};

			/**
			 * Method that sets styling for title
			 * @method _setTitleType
			 * @param {HTMLElement} element
			 * @param {string} titleType
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._setTitleType = function (element, titleType) {
				var self = this,
					titleContainer = self._ui.titleContainer;

				titleContainer.classList.remove(classes.hasMultilineTitle, classes.hasSubtitle);

				switch (titleType) {
					case "multiline":
						titleContainer.classList.add(classes.hasMultilineTitle);
						break;
					case "subtitle":
						titleContainer.classList.add(classes.hasSubtitle);
						break;
					case "singleLine":
						break;
				}
			};

			ns.widget.core.Appbar = Appbar;
			ns.engine.defineWidget(
				"Appbar",
				".ui-appbar,.ui-header,header,[data-role='header']",
				[],
				Appbar,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Appbar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
