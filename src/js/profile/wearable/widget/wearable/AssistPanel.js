/*global ns, define, ns */
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
 * #AssistPanel
 * Shows a panel that in the sub-layout on the bottom edge of screen.
 *
 * ##Introduction
 *
 * The assist panel component is a panel that the application's sub layout on the bottom edge of the screen.
 * This component is hidden most of the time, but user can be opened as swipe gesture from the edge of the screen or
 * click the element that is added event handler, handler has assistPanel.open() method.
 *
 * Note!
 * We recommend to make handler element.
 * Because if you didn't set the handler, handler was set page element automatically.
 * If you really want to make handler as the page element, you should notice data-drag-edge or dragEdge option value
 * because default value, '1', is whole area of handler element.
 *
 * ## HTML Examples
 *
 *        @example
 *        <div id="assistPanelPage" class="ui-page">
 *          <header id="contentHeader" class="ui-header">
 *              <h2 class="ui-title">AssistPanel</h2>
 *          </header>
 *          <div id = "content" class="ui-content">
 *            AssistPanel
 *          </div>
 *
 *          <!-- AssistPanel Handler -->
 *          <a id="assistPanelHandler" href="#AssistPanel" class="assist-panel-handler">AssistPanel Button</a>
 *          <!-- AssistPanel Widget -->
 *          <div id="assist-panel" class="ui-assist-panel" data-assist-panel-target="#assistPanelPage" data-enable="true" data-drag-edge="1">
 *              <header class="ui-header">
 *                  <h2 class="ui-title">AssistPanel</h2>
 *              </header>
 *              <div class="ui-content">
 *                  <p>CONTENT</p>
 *              </div>
 *          </div>
 *        </div>
 *
 * ## Manual constructor
 *
 *         @example
 *             (function() {
 *                 var handler = document.getElementById("assistPanelHandler"),
 *                     page = document.getElementById("assistPanelPage"),
 *                     assistPanelElement = document.querySelector(handler.getAttribute("href")),
 *                     assistPanel = tau.widget.AssistPanel(assistPanelElement);
 *
 *                 page.addEventListener( "pagebeforeshow", function() {
 *                         assistPanel.setDragHandler(handler);
 *                         tau.event.on(handler, "mousedown touchstart", function(e) {
 *                             switch (e.type) {
 *                             case "touchstart":
 *                             case "mousedown":
 *                             // open assist panel
 *                             assistPanel.transition(60);
 *                         }
 *                 }, false);
 *             })();
 *
 * ##AssistPanel state
 * AssistPanel has four state type.
 * - "closed" - AssistPanel closed state.
 * - "opened" - AssistPanel opened state.
 * - "sliding" - AssistPanel is sliding state. This state does not mean that will operate open or close.
 * - "settling" - assist panel is settling state. 'Settle' means open or close status. So, this state means that assist panel is animating for opened or closed state.
 *
 * ##AssistPanel targeting
 * You can declare to assist panel target manually. (Default is Page)
 *
 * If you implement data-assist-panel-target attribute value at CSS selector type, assist panel widget will be appended to target.
 *
 *        @example
 *        <div class="ui-assist-panel" data-assist-panel-target="#assistPanelPage">
 *
 * ##AssistPanel enable
 * You can declare for whether assist panel gesture used or not. (Default is true)
 *
 * If you implement data-enable attribute value is 'true', you can use the assist panel widget.
 * This option can be changed by 'enable' or 'disable' method.
 *
 *        @example
 *        <div class="ui-assist-panel" data-enable="true">
 *
 * ##AssistPanel drag gesture start point
 * You can declare to drag gesture start point. (Default is 1)
 *
 * If you implement data-drag-edge attribute value is '0.5', you can drag gesture start in target width * 0.5 width area.
 *
 *        @example
 *        <div class="ui-assist-panel" data-drag-edge="1">
 *
 * @since 2.3
 * @class ns.widget.wearable.AssistPanel
 * @component-selector .ui-assist-panel
 * @component-type standalone-component
 * @extends ns.widget.core.AssistPanel
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../wearable",
			"../../../../core/widget/core/Drawer",
			"../../../../core/engine",
			"../../../../core/util/DOM/css",
			"../../../../core/util/object"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreAssistPanel = ns.widget.core.Drawer,
				engine = ns.engine,
				WIDGET_CLASS = "ui-assist-panel",
				selectors = {
					WIDGET: "." + WIDGET_CLASS
				},
				classes = {
					WIDGET: WIDGET_CLASS,
					INDICATOR: WIDGET_CLASS + "-indicator",
					OVERLAY: WIDGET_CLASS + "-overlay"
				},
				/**
				 * Events
				 * @event assistpanelopen Event triggered then the assist panel is opened.
				 * @event assistpanelclose Event triggered then the assist panel is closed.
				 * @member ns.widget.wearable.AssistPanel
				 */
				CUSTOM_EVENTS = {
					OPEN: "assistpanelopen",
					CLOSE: "assistpanelclose"
				},
				AssistPanel = function () {
					var self = this;

					CoreAssistPanel.call(self);

					self._callbacks = {
						onClick: null
					};
				},
				prototype = new CoreAssistPanel();

			AssistPanel.prototype = prototype;

			/**
			 * Configure AssistPanel widget
			 * @method _configure
			 * @protected
			 * @member ns.widget.wearable.AssistPanel
			 */
			prototype._configure = function () {
				var self = this;

				/**
				 * Widget options
				 * @property {number} [options.width=0] If you set width is 0, assist panel width will set as the css style.
				 */
				self.options.width = 0;
				self.options.position = "down";
				self.options.overlay = false;
			};

			prototype._addIndicator = function (parentElement) {
				var indicator = document.createElement("div");

				indicator.classList.add(classes.INDICATOR);
				parentElement.appendChild(indicator);

				this._ui.indicator = indicator;
			};

			prototype._build = function (element) {
				var self = this;

				CoreAssistPanel.prototype._build.call(self, element);

				if (self.options.overlay) {
					self._ui.drawerOverlay.classList.add(classes.OVERLAY);
				}

				// add assist panel indicator
				self._addIndicator(self._ui.targetElement);

				return element;
			};

			/**
			 * Swipe event handler
			 * @method _onSwipe
			 * @protected
			 * @param {Event} event
			 * @override
			 * @member ns.widget.wearable.AssistPanel
			 */
			prototype._onSwipe = function (event) {
				var self = this;

				CoreAssistPanel.prototype._onSwipe.call(self, event);

				if (event.detail && event.detail.direction === "down") {
					self.close();
				}
			}

			/**
			 * Set overlay visibility
			 * @method _setOverlay
			 * @override
			 * @member ns.widget.wearable.AssistPanel
			 * @protected
			 */
			prototype._setOverlay = function () {
				// disable overlay change
			};

			function onClick(self) {
				self.open();
			}

			function onDrawerOpen(ev) {
				this.trigger(CUSTOM_EVENTS.OPEN, {
					position: ev.detail.position
				});
			}

			function onDrawerClose(ev) {
				this.trigger(CUSTOM_EVENTS.CLOSE, {
					position: ev.detail.position
				});
			}

			prototype._bindEvents = function () {
				var self = this,
					callbacks = self._callbacks,
					element = self.element;

				callbacks.onClick = onClick.bind(null, self);
				callbacks.onDrawerOpen = onDrawerOpen.bind(self);
				callbacks.onDrawerClose = onDrawerClose.bind(self);

				CoreAssistPanel.prototype._bindEvents.call(self);

				self._ui.indicator.addEventListener("vclick", callbacks.onClick);
				element.addEventListener("draweropen", callbacks.onDrawerOpen);
				element.addEventListener("drawerclose", callbacks.onDrawerClose);
			};

			prototype._unbindEvents = function () {
				var self = this,
					callbacks = self._callbacks,
					element = self.element;

				self._ui.indicator.removeEventListener("vclick", callbacks.onClick);
				element.removeEventListener("draweropen", callbacks.onDrawerOpen);
				element.removeEventListener("drawerclose", callbacks.onDrawerClose);
			};

			prototype._destroy = function () {
				this._unbindEvents();
				CoreAssistPanel.prototype._destroy.call(this);
			};

			/**
			 * Open AssistPanel widget.
			 *
			 * ##### Running example in pure JavaScript:
			 *
			 * @example
			 *
			 * <div id="assistPanel" class="ui-assist-panel" data-drag-edge="1">
			 *    <header class="ui-header">
			 *        <h2 class="ui-title">AssistPanel</h2>
			 *    </header>
			 *    <div class="ui-content">
			 *        <p>Assist panel content</p>
			 *    </div>
			 * </div>
			 *
			 * <script>
			 *     var assistPanel = tau.widget.AssistPanel(document.getElementById("assistPanel"));
			 *
			 *     assistPanel.open();
			 * </script>
			 *
			 * @method open
			 * @public
			 * @member ns.widget.wearable.AssistPanel
			 */
			ns.widget.wearable.AssistPanel = AssistPanel;
			engine.defineWidget(
				"AssistPanel",
				selectors.WIDGET,
				[
					"open",
					"close",
					"isOpen",
					"getState"
				],
				AssistPanel,
				"wearable"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.wearable.AssistPanel;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
