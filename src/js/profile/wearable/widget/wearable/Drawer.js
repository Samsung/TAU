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
/**
 * #Drawer
 * Shows a panel that in the sub-layout on the left or right edge of screen.
 *
 * ##Introduction
 *
 * The drawer component is a panel that the application's sub layout on the left or right edge of the screen.
 * This component is hidden most of the time, but user can be opened as swipe gesture from the edge of the screen or click the element that is added event handler,
 * handler has drawer.open() method.
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
 *        <div id="drawerPage" class="ui-page">
 *          <header id="contentHeader" class="ui-header">
 *              <h2 class="ui-title">Drawer</h2>
 *          </header>
 *          <div id = "content" class="ui-content">
 *            Drawer
 *          </div>
 *
 *          <!-- Drawer Handler -->
 *          <a id="drawerHandler" href="#Drawer" class="drawer-handler">Drawer Button</a>
 *          <!-- Drawer Widget -->
 *          <div id="drawer" class="ui-drawer" data-drawer-target="#drawerPage" data-position="left" data-enable="true" data-drag-edge="1">
 *              <header class="ui-header">
 *                  <h2 class="ui-title">Left Drawer</h2>
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
 *                 var handler = document.getElementById("drawerHandler"),
 *                     page = document.getElementById("drawerPage"),
 *                     drawerElement = document.querySelector(handler.getAttribute("href")),
 *                     drawer = tau.widget.Drawer(drawerElement);
 *
 *                 page.addEventListener( "pagebeforeshow", function() {
 *                         drawer.setDragHandler(handler);
 *                         tau.event.on(handler, "mousedown touchstart", function(e) {
 *                             switch (e.type) {
 *                             case "touchstart":
 *                             case "mousedown":
 *                             // open drawer
 *                             drawer.transition(60);
 *                         }
 *                 }, false);
 *             })();
 *
 * ##Drawer state
 * Drawer has four state type.
 * - "closed" - Drawer closed state.
 * - "opened" - Drawer opened state.
 * - "sliding" - Drawer is sliding state. This state does not mean that will operate open or close.
 * - "settling" - drawer is settling state. 'Settle' means open or close status. So, this state means that drawer is animating for opened or closed state.
 *
 * ##Drawer positioning
 * You can declare to drawer position manually. (Default is left)
 *
 * If you implement data-position attributes value is 'left', drawer appear from left side.
 *
 *        @example
 *        <div class="ui-drawer" data-position="left" id="leftDrawer">
 *
 * - "left" - drawer appear from left side
 * - "right" - drawer appear from right side
 *
 * ##Drawer targeting
 * You can declare to drawer target manually. (Default is Page)
 *
 * If you implement data-drawer-target attribute value at CSS selector type, drawer widget will be appended to target.
 *
 *        @example
 *        <div class="ui-drawer" data-drawer-target="#drawerPage">
 *
 * ##Drawer enable
 * You can declare for whether drawer gesture used or not. (Default is true)
 *
 * If you implement data-enable attribute value is 'true', you can use the drawer widget.
 * This option can be changed by 'enable' or 'disable' method.
 *
 *        @example
 *        <div class="ui-drawer" data-enable="true">
 *
 * ##Drawer drag gesture start point
 * You can declare to drag gesture start point. (Default is 1)
 *
 * If you implement data-drag-edge attribute value is '0.5', you can drag gesture start in target width * 0.5 width area.
 *
 *        @example
 *        <div class="ui-drawer" data-drag-edge="1">
 *
 * @since 2.3
 * @class ns.widget.wearable.Drawer
 * @component-selector .ui-drawer
 * @component-type standalone-component
 * @extends ns.widget.core.Drawer
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/widget/core/Drawer",
			"../../../../core/engine",
			"../../../../core/util/object"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreDrawer = ns.widget.core.Drawer,
				engine = ns.engine,
				Drawer = function () {
					var self = this;

					CoreDrawer.call(self);
				},
				prototype = new CoreDrawer();

			Drawer.prototype = prototype;

			/**
			 * Configure Drawer widget
			 * @method _configure
			 * @protected
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._configure = function () {
				var self = this;
				/**
				 * Widget options
				 * @property {number} [options.width=0] If you set width is 0, drawer width will set as the css style.
				 */

				self.options.width = 0;
			};
			/**
			 * Set Drawer drag handler.
			 * If developer use handler, drag event is bound at handler only.
			 *
			 * #####Running example in pure JavaScript:
			 *
			 * @example
			 * <!-- Drawer Handlers -->
			 * <a id="leftDrawerHandler" href="#leftDrawer" class="drawer-handler">Left Handler</a>
			 *
			 * <div id="leftDrawer" class="ui-drawer" data-drawer-target="#drawerSinglePage" data-position="left" data-enable="true" data-drag-edge="1">
			 *    <header class="ui-header">
			 *        <h2 class="ui-title">Left Drawer</h2>
			 *    </header>
			 *    <div id="leftClose" class="ui-content">
			 *        <p>Click Close</p>
			 *    </div>
			 * </div>
			 *
			 * <script>
			 *     var handler = document.getElementById("leftDrawerHandler"),
			 *         drawer = tau.widget.Drawer(document.querySelector(handler.getAttribute("href"));
			 *
			 *     drawer.setDragHandler(handler);
			 * </script>
			 *
			 * @method setDragHandler
			 * @public
			 * @param {Element} element
			 * @member ns.widget.wearable.Drawer
			 */

			/**
			 * Transition Drawer widget.
			 * This method use only positive integer number.
			 *
			 * #####Running example in pure JavaScript:
			 *
			 * @example
			 * <!-- Drawer Handlers -->
			 * <a id="leftDrawerHandler" href="#leftDrawer" class="drawer-handler">Left Handler</a>
			 *
			 * <div id="leftDrawer" class="ui-drawer" data-drawer-target="#drawerSinglePage" data-position="left" data-enable="true" data-drag-edge="1">
			 *    <header class="ui-header">
			 *        <h2 class="ui-title">Left Drawer</h2>
			 *    </header>
			 *    <div id="leftClose" class="ui-content">
			 *        <p>Click Close</p>
			 *    </div>
			 * </div>
			 *
			 * <script>
			 *     var handler = document.getElementById("leftDrawerHandler"),
			 *         drawer = tau.widget.Drawer(document.querySelector(handler.getAttribute("href"));
			 *
			 *     drawer.Transition(60);
			 * </script>
			 *
			 * @method transition
			 * @public
			 * @param {Integer} position
			 * @member ns.widget.wearable.Drawer
			 */
			/**
			 * Open Drawer widget.
			 *
			 * #####Running example in pure JavaScript:
			 *
			 * @example
			 * <!-- Drawer Handlers -->
			 * <a id="leftDrawerHandler" href="#leftDrawer" class="drawer-handler">Left Handler</a>
			 *
			 * <div id="leftDrawer" class="ui-drawer" data-drawer-target="#drawerSinglePage" data-position="left" data-enable="true" data-drag-edge="1">
			 *    <header class="ui-header">
			 *        <h2 class="ui-title">Left Drawer</h2>
			 *    </header>
			 *    <div id="leftClose" class="ui-content">
			 *        <p>Click Close</p>
			 *    </div>
			 * </div>
			 *
			 * <script>
			 *     var handler = document.getElementById("leftDrawerHandler"),
			 *         drawer = tau.widget.Drawer(document.querySelector(handler.getAttribute("href"));
			 *
			 *     drawer.open();
			 * </script>
			 *
			 * @method open
			 * @public
			 * @member ns.widget.wearable.Drawer
			 */
			/**
			 * Close Drawer widget.
			 *
			 * @example
			 * <!-- Drawer Handlers -->
			 * <a id="leftDrawerHandler" href="#leftDrawer" class="drawer-handler">Left Handler</a>
			 *
			 * <div id="leftDrawer" class="ui-drawer" data-drawer-target="#drawerSinglePage" data-position="left" data-enable="true" data-drag-edge="1">
			 *    <header class="ui-header">
			 *        <h2 class="ui-title">Left Drawer</h2>
			 *    </header>
			 *    <div id="leftClose" class="ui-content">
			 *        <p>Click Close</p>
			 *    </div>
			 * </div>
			 *
			 * <script>
			 *     var handler = document.getElementById("leftDrawerHandler"),
			 *         drawer = tau.widget.Drawer(document.querySelector(handler.getAttribute("href"));
			 *
			 *     drawer.close();
			 * </script>
			 *
			 * @method close
			 * @public
			 * @member ns.widget.wearable.Drawer
			 */
			/**
			 * Refresh Drawer widget.
			 * @method refresh
			 * @protected
			 * @member ns.widget.wearable.Drawer
			 */
			/**
			 * Get state of Drawer widget.
			 *
			 * @example
			 * <!-- Drawer Handlers -->
			 * <a id="leftDrawerHandler" href="#leftDrawer" class="drawer-handler">Left Handler</a>
			 *
			 * <div id="leftDrawer" class="ui-drawer" data-drawer-target="#drawerSinglePage" data-position="left" data-enable="true" data-drag-edge="1">
			 *    <header class="ui-header">
			 *        <h2 class="ui-title">Left Drawer</h2>
			 *    </header>
			 *    <div id="leftClose" class="ui-content">
			 *        <p>Click Close</p>
			 *    </div>
			 * </div>
			 *
			 * <script>
			 *     var handler = document.getElementById("leftDrawerHandler"),
			 *         drawer = tau.widget.Drawer(document.querySelector(handler.getAttribute("href")),
			 *         state;
			 *
			 *     state = drawer.getState();
			 * </script>
			 * @method getState
			 * @return {string} Drawer state {"closed"|"opened"|"sliding"|"settling"}
			 * @public
			 * @member ns.widget.wearable.Drawer
			 */
			ns.widget.wearable.Drawer = Drawer;
			engine.defineWidget(
				"Drawer",
				".ui-drawer",
				[
					"transition",
					"setDragHandler",
					"open",
					"close",
					"isOpen",
					"getState"
				],
				Drawer,
				"wearable"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.wearable.Drawer;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
