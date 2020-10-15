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
/*global define, ns */
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
			"../../../core/event/gesture/Drag",
			"../../../core/event/gesture/Instance",
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
				nominalHeights = {
					COLLAPSED: 56,
					EXPANDED: 56
				},
				states = {
					EXPANDED: "EXPANDED",
					COLLAPSED: "COLLAPSED",
					DRAGGING: "DRAGGING"
				},
				SCREEN_HEIGHT_LIMIT_FOR_EXPANDING = 579,
				Appbar = function () {
					var self = this;

					self.options = utilsObject.merge({}, Appbar.defaults);
					self._ui = {
						titleContainer: null,
						leftIconsContainer: null,
						actionButtonsContainer: null,
						page: null,
						selectAll: null,
						bottomBar: null,
						instantContainers: []
					};
					self._expandedHeight = nominalHeights.EXPANDED;
					self._appbarState = states.COLLAPSED;
					self._dragStartingHeight = 0;
					self._currentHeight = 0;
					self._instantContainersHeight = 0;
					self._scrolledToTop = true;
					self._lockExpanding = false;
					self._calculateExtendedHight();
				},
				BaseWidget = ns.widget.BaseWidget,
				prototype = new BaseWidget(),
				classPrefix = "ui-appbar",
				classes = {
					title: classPrefix + "-title",
					leftIconsContainer: classPrefix + "-left-icons-container",
					actionButtonsContainer: classPrefix + "-action-buttons-container",
					instantContainer: classPrefix + "-container",
					titleContainer: classPrefix + "-title-container",
					hasMultilineTitle: classPrefix + "-has-multiline",
					hasSubtitle: classPrefix + "-has-subtitle",
					expanded: classPrefix + "-expanded",
					dragging: classPrefix + "-dragging",
					controlsContainer: classPrefix + "-controls-container",
					expandedTitleContainer: classPrefix + "-expanded-title-container",
					animationFast: classPrefix + "-animation-fast",
					selectAll: "ui-label-select-all",
					bottomBar: "ui-bottom-bar",
					hidden: "ui-hidden"
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
					titleType: "singleLine", // "multiline", "subtitle"
					expandingEnabled: true,
					animation: true
				};

			Appbar.prototype = prototype;
			Appbar.defaults = defaults;
			Appbar.classes = classes;
			Appbar.selector = ".ui-appbar,.ui-header,header,[data-role='header']";

			prototype._init = function (element) {
				var self = this;

				self._initExpandedContainer(element);

				self._setAnimation(element, self.options.animation);
				self._appbarState = states.COLLAPSED;
				self._validateExpanding();

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
				self._findInstantContainers(element);
				self._readTitleType(element);
				self._setTitleType(element, self.options.titleType);
				return element;
			};

			prototype._calculateInstantContainers = function (element) {
				var self = this,
					instantContainersHeight = 0;

				// calculate instant containers height
				element.style.height = "auto";
				self._ui.instantContainers.forEach(function (container) {
					instantContainersHeight += container.offsetHeight;
				});

				return instantContainersHeight;
			};

			prototype._updateAppbarDimensions = function (element) {
				var self = this,
					instantContainersHeight = self._instantContainersHeight,
					controlsContainer = self._ui.controlsContainer;

				// increase height of appbar and change bottom possition of control container
				if (instantContainersHeight > 0) {
					self._calculateExtendedHight();
					self._expandedHeight += instantContainersHeight;
					self._currentHeight += instantContainersHeight;
					if (controlsContainer) {
						controlsContainer.style.bottom = instantContainersHeight + "px";
					}
					self._instantContainersHeight = instantContainersHeight
				}

				// set initial height of collapsed appbar
				element.style.height = nominalHeights.COLLAPSED + self._instantContainersHeight + "px";
			};

			/**
			 * Method set new height of appbar if instant container exists
			 * @param {HTMLElement} element
			 * @method _findInstantContainers
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._findInstantContainers = function (element) {
				var self = this;

				self._ui.instantContainers = [].slice.call(element.querySelectorAll("." + classes.instantContainer));

				self._instantContainersHeight = self._calculateInstantContainers(element);
				self._updateAppbarDimensions(element);
			};

			/**
			 * Add Html element as instant container
			 * @param {HTMLElement} container
			 * @method addInstantContainer
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype.addInstantContainer = function (container) {
				var self = this;

				if (container && container instanceof HTMLElement) {
					container.classList.add(classes.instantContainer);
					self.element.appendChild(container);
					self.refresh();
				} else {
					ns.warn("AppBar: method addInstantContainer needs argument");
				}
			}

			/**
			 * Remove instant container
			 * @param {HTMLElement} container
			 * @method removeInstantContainer
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype.removeInstantContainer = function (container) {
				var self = this;

				if (container && container instanceof HTMLElement) {
					if (container.parentElement) {
						container.parentElement.removeChild(container);
						self.refresh();
					}
				} else {
					ns.warn("AppBar: method removeInstantContainer needs argument");
				}
			}

			/**
			 * Refresh the widget
			 * @method _refresh
			 * @member ns.widget.core.Appbar
			 * @param {HTMLElement} element
			 * @protected
			 */
			prototype._refresh = function (element) {
				var self = this;

				element = element || self.element;
				self._findInstantContainers(element);
				self._ui.instantContainers.forEach(function (container) {
					ns.engine.createWidgets(container);
				});
			};

			/**
			 * Method calculates and set nominal height of extended AppBar
			 * depend of screen height.
			 * Height of expanded AppBar is needed by handler of drag event
			 * @method _calculateExtendedHight
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._calculateExtendedHight = function () {
				var self = this,
					screenHeight = window.screen.height,
					screenWidth = window.screen.width,
					bottomMarginHeight = 12;

				if (screenHeight >= 580 && screenHeight < 960 && screenWidth > screenHeight) { // lanscape
					self._expandedHeight = screenHeight * 0.3 - bottomMarginHeight;
				} else if (screenHeight >= 580 && screenHeight < 960 && screenWidth <= screenHeight) { // portrait
					self._expandedHeight = screenHeight * 0.3967 - bottomMarginHeight;
				} else if (screenHeight >= 960) {
					self._expandedHeight = screenHeight * 0.25 - bottomMarginHeight;
				} else {
					self._expandedHeight = nominalHeights.EXPANDED;
				}
			};

			/**
			 * Init expanded container
			 * Find expanded container or create if not exists yet
			 * @method _initExpandedContainer
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._initExpandedContainer = function (element) {
				var ui = this._ui,
					expandedTitleContainer = element.querySelector("." + classes.expandedTitleContainer);

				if (!expandedTitleContainer) {
					expandedTitleContainer = document.createElement("div")
					expandedTitleContainer.classList.add(classes.expandedTitleContainer);

					// clone titles to expanded container if not existed before
					[].slice.call(ui.titleContainer.children).forEach(function (node) {
						expandedTitleContainer.appendChild(node.cloneNode(true));
					});
				}

				ui.expandedTitleContainer = expandedTitleContainer;
				element.insertBefore(expandedTitleContainer, ui.controlsContainer);
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
				var ui = this._ui;

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

				utilsEvents.on(
					self._ui.page,
					"scrollboundary drag dragstart dragend scrollstart change pagebeforeshow popupshow popuphide",
					self);
				window.addEventListener("resize", self, false);
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
					case "popupshow":
						self._onPopupShow();
						break;
					case "popuphide":
						self._onPopupHide();
						break;
					case "resize":
						self._onResize();
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
			 * PopupShow event handler
			 * @method _onPopupShow
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._onPopupShow = function () {
				this.options.expandingEnabled = false;
			};

			/**
			 * PopupHide event handler
			 * @method _onPopupHide
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._onPopupHide = function () {
				this.options.expandingEnabled = true;
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

				if (!self._lockExpanding && self.options.expandingEnabled && (
					(event.detail.direction === "down" && self._appbarState == states.COLLAPSED && self._scrolledToTop) ||
					(event.detail.direction === "up" && self._appbarState == states.EXPANDED))) {

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

			/**
			 * Set opacity level of title during the drag of content
			 * @method _setTitlesOpacity
			 * @param {boolean} expandLevel
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._setTitlesOpacity = function (expandLevel) {
				var self = this,
					ui = self._ui,
					mainTitle = ui.titleContainer,
					expandedTitle = ui.expandedTitleContainer;

				mainTitle.style.opacity = 1 - expandLevel;
				expandedTitle.style.opacity = expandLevel;
			};

			/**
			 * Expand AppBar
			 * @method expand
			 * @member ns.widget.core.Appbar
			 * @public
			 */
			prototype.expand = function () {
				var self = this,
					element = self.element;

				element.style.height = self._expandedHeight + "px";
				element.classList.add(classes.expanded);
				self._appbarState = states.EXPANDED;
				self._setTitlesOpacity(1);
				utilsEvents.trigger(element, "appbarexpanded");
			};

			/**
			 * Animation transition end event handler
			 * @method _onTransitionEnd
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._onTransitionEnd = function () {
				/**
				 * After the AppBar expanding or collapsing
				 * the size of Page content will be changed
				 * so Page should be refreshed to better fit
				 * to new available space.
				 */
				utilsEvents.trigger(this.element, "appbartransitionend");
			};

			/**
			 * Collapse AppBar
			 * @method collapse
			 * @member ns.widget.core.Appbar
			 * @public
			 */
			prototype.collapse = function () {
				var self = this,
					element = self.element;

				self._currentHeight = self._instantContainersHeight;
				element.style.height = nominalHeights.COLLAPSED + self._instantContainersHeight + "px";

				element.classList.remove(classes.expanded);
				self._appbarState = states.COLLAPSED;
				self._setTitlesOpacity(0);
				utilsEvents.trigger(element, "appbarcollapsed");

				utilsEvents.one(element,
					"transitionend transitionEnd webkitTransitionEnd",
					self._onTransitionEnd.bind(self), false);
			};

			/**
			 * Lock/Unlock AppBar expanding
			 * Developer can temporarily locks AppBar expanding,
			 * eg. when a widget in page content requires it
			 * @method lockExpanding
			 * @param {boolean} lock
			 * @member ns.widget.core.Appbar
			 * @public
			 */
			prototype.lockExpanding = function (lock) {
				this._lockExpanding = !!lock;
			};

			/**
			 * Dragend event handler
			 * @method _onDragEnd
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._onDragEnd = function () {
				var self = this,
					threshold

				if (!self._lockExpanding && self.options.expandingEnabled) {
					threshold = (nominalHeights.COLLAPSED + self._expandedHeight) / 2;
					self.element.classList.remove(classes.dragging);

					if (self._currentHeight > threshold) {
						self.expand();
					} else {
						self.collapse();
					}

					// trigger appbarDragStart Event - page should enable scrolling back again
					// appbar resized event should be triggered (in order to inform Page about content height change)
				}
			};

			/**
			 * Drag event handler
			 * @method _onDrag
			 * @param {Event} event
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._onDrag = function (event) {
				var self = this,
					deltaY = event && event.detail && event.detail.deltaY,
					totalHeight = self._dragStartingHeight + ((deltaY !== undefined) ? deltaY : 0),
					totalMovement = 0;

				if (!self._lockExpanding && self._appbarState === states.DRAGGING) {
					totalHeight = min(totalHeight, self._expandedHeight);
					totalHeight = max(totalHeight, nominalHeights.COLLAPSED);

					if (self._currentHeight !== totalHeight) {
						self._currentHeight = totalHeight;
						self.element.style.height = totalHeight + "px";

						totalMovement = totalHeight - nominalHeights.COLLAPSED;

						if (totalMovement > self._expandedTitleHeight) {
							self._setTitlesOpacity(totalMovement / (self._expandedHeight - nominalHeights.COLLAPSED));
						} else {
							self._setTitlesOpacity(0);
						}
					}
				}
			};

			/**
			 * Verification and enable/disable AppBar expanding
			 * depending on the screen height
			 * @method _validateExpanding
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._validateExpanding = function () {
				var self = this;

				if (window.screen.height <= SCREEN_HEIGHT_LIMIT_FOR_EXPANDING) {
					self._lockExpanding = true;
				} else {
					self._lockExpanding = false;
				}
			}

			/**
			 * Resize event handler
			 * Widget has to check if new screen height allows to widget expanding
			 * @method _onResize
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._onResize = function () {
				this._validateExpanding();
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
					ui = self._ui,
					page = self._ui.page;

				// update bottom bar visibility if options selectAll in AppBar exists
				if (ui.selectAll && target.tagName === "INPUT") {
					if (target === ui.selectAll) {
						self._triggerSelectAll();
					} else {
						self._toggleSelectAll(!page.querySelector(selectors.IS_NOT_CHECKED));
					}

					if (ui.bottomBar) {
						self._toggleBottomBar(!!page.querySelector(selectors.IS_CHECKED));
					}
					if (ui.selectAll) {
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

				utilsEvents.off(
					self._ui.page,
					"scrollboundary drag dragstart dragend scrollstart change pagebeforeshow popupshow popuphide",
					self);
				window.removeEventListener("resize", self, false);
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

			/**
			 * Set expanding option
			 * @method _setExpandingEnabled
			 * @param {HTMLElement} element
			 * @param {boolean} enabled
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._setExpandingEnabled = function (element, enabled) {
				var self = this;

				if (self.options.expandingEnabled !== enabled) {
					self.options.expandingEnabled = enabled;
					if (!enabled && self._appbarState !== states.COLLAPSED) {
						self.collapse();
					}
				}
			};

			/**
			 * Set animation option
			 * @method _setAnimation
			 * @param {HTMLElement} element
			 * @param {boolean} enabled
			 * @member ns.widget.core.Appbar
			 * @protected
			 */
			prototype._setAnimation = function (element, enabled) {
				this.options.animation = enabled;
				element.classList.toggle(classes.animationFast, !enabled);
			};

			ns.widget.core.Appbar = Appbar;
			ns.engine.defineWidget(
				"Appbar",
				Appbar.selector,
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
