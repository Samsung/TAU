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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * #Popup
 * Widget handles creating and managing popup windows.
 *
 * ##Default selectors
 * In default all elements with _data-role=popup_ or CSS class _.ui-popup_ are changed to Tizen WebUI popups.
 *
 * ##HTML Examples
 *
 * ###Create simple popup from div
 *
 *		@example
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *		<!-- link related with popup-->
 *		<a href="#popup">Click to open popup</a>
 *
 * ###Create simple popup positioned to window
 *
 * Popup inherits value of option _positionTo_ from property _data-position-to_ set in link.
 *
 *		@example
 *		<!--definition of link, which opens popup and sets its position-->
 *		<a href="#center_info" data-position-to="window">Click to open popup</a>
 *		<!--definition of popup, which inherits property position from link-->
 *		<div id="center_info" data-role="popup" class="center_info">
 *			<div class="ui-popup-text">
 *				<p>Pop-up dialog box, a child window that blocks user interaction to the parent windows</p>
 *			</div>
 *		</div>
 *
 * ###Create popup with title and button
 *
 *		@example
 *		<a href="#center_title_1btn">Click to open popup</a>
 *		<!--definition of popup with a title and button-->
 *		<div id="center_title_1btn" data-role="popup" class="center_title_1btn">
 *			<div class="ui-popup-title">
 *				<h1>Popup title</h1>
 *			</div>
 *			<div class="ui-popup-text">
 *				Pop-up dialog box, a child window that blocks user interaction to the parent windows
 *			</div>
 *			<div class="ui-popup-button-bg">
 *				<a data-role="button" data-rel="back" data-inline="true">Button</a>
 *			</div>
 *		</div>
 *
 * ###Create popup with menu
 *
 * A menu can be created by placing listview inside a popup.
 *
 *		@example
 *		<a href="#center_liststyle_1btn">Click to open popup</a>
 *		<div id="center_liststyle_1btn" data-role="popup" class="center_liststyle_1btn">
 *			<div class="ui-popup-title">
 *				<h1>Popup title</h1>
 *			</div>
 *			<div class="ui-popup-scroller-bg" data-scroll="y">
 *				<ul data-role="listview" data-icon="1line-textonly">
 *					<li><a href="#">List item 1</a></li>
 *					<li><a href="#">List item 2</a></li>
 *				</ul>
 *			</div>
 *			<div class="ui-popup-button-bg">
 *				<a data-role="button" data-rel="back" data-inline="true">Cancel</a>
 *			</div>
 *		</div>
 *
 * ###Create popup with nested menu
 *
 * A nested menu can be created by placing collapsible-set widget with listview elements.
 *
 *		@example
 *		<a href="#popupNested">Click to open popup</a>
 *		<div id="popupNested" data-role="popup">
 *			<div data-role="collapsible-set" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d">
 *				<div data-role="collapsible">
 *					<h2>First menu</h2>
 *					<ul data-role="listview">
 *						<li><a href="#" >Item 1</a></li>
 *						<li><a href="#" >Item 2</a></li>
 *					</ul>
 *				</div>
 *				<div data-role="collapsible">
 *					<h2>Second menu</h2>
 *					<ul data-role="listview">
 *						<li><a href="#" >Item 1</a></li>
 *						<li><a href="#" >Item 2</a></li>
 *					</ul>
 *				</div>
 *			</div>
 *		</div>
 *
 * ###Create popup with form
 *
 * A form can be created by placing inputs elements inside popup.
 *
 *		@example
 *		<a href="#textbox_popup">Click to open popup</a>
 *		<div id="textbox_popup" data-role="popup" class="center_title_2btn">
 *			<div class="ui-popup-title">
 *				<h1>PopupTest<h1>
 *			</div>
 *			<div class="ui-popup-text">
 *				<input type="text" size="20" />
 *				<input type="text" size="20" />
 *			</div>
 *			<div class="ui-popup-button-bg">
 *				<a data-role="button" id="btn_textbox_popup_cancel" data-inline="true">Cancel</a>
 *				<a data-role="button" data-rel="back" data-inline="true">OK</a>
 *			</div>
 *		</div>
 *
 * ##Manual constructor
 * For manual creation of popup widget you can use constructor of widget:
 *
 *		@example
 *		<div id="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popupElement = document.getElementById("popup"),
 *				popup = tau.widget.Popup(popupElement);
 *			popup.open();
 *		</script>
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<div id="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popup = $("#popup").popup();
 *			popup.popup("open");
 *		</script>
 *
 * ##Context popup with arrow
 *
 * If property _id_ is set in link and option _positionTo="origin"_ in popup, the context popup will be opened after clicking.
 *
 *		@example
 *		<!-- definition of link, which opens popup with id popup in context style with arrow -->
 *		<a href="#popup" id="linkId" data-position-to="origin" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic context popup, no options set.</p>
 *		</div>
 *
 * Be award that option _positionTo_ has value "origin" in popup by default. However, the property _positionTo_ is inherited from related link and this inherited value has higher priority during opening process and overwrites the previous value. So, if we do not change it in popup and do not set value of _data-position-to_ other than "origin" in link, popup connected with link will be always opened in context style.
 *
 * To be sure that popup will be opened in context style with arrow, we can set properties _data-position-to="origin"_ as well as _id_ in the related with popup link as in the example above.
 *
 * Moreover, the same result can be achieve by setting only _id_ and not setting _positionTo_ in link because popup has value "origin" for option _positionTo_ by default.
 *
 *		@example
 *		<!-- in link id is set -->
 *		<a href="#popup" id="linkId" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *
 * After building, the value of option _positionTo_ can be changed by using method _option_.
 *
 *		@example
 *		<a href="#popup" id="linkId" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// changing value of option positionTo by method option
 *			var popupWidget = tau.widget.Popup(document.getElementById("popup"));
 *			popupWidget.option("positionTo", "origin");
 *		</script>
 *
 * If jQuery is loaded:
 *
 *		@example
 *		<a href="#popup" id="linkId" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// changing value of option positionTo by method option
 *			$("#popup").popup("option", "positionTo", "origin");
 *		</script>
 *
 *
 * Context popup can be created also manually for elements different than link by pushing options such as _positionTo_ and _link to method _open_.
 *
 *		@example
 *		<!-- element with no properties - popup will be opened next to it in context style manually -->
 *		<div id="linkId">Click to open context popup</div>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// set opening popup on click event
 *			document.getElementById("linkId").addEventListener("click", function () {
 *				// open context popup
 *				var popupWidget = tau.widget.Popup(document.getElementById("popup"));
 *				// opening with options
 *				popupWidget.open({link: "linkId", positionTo: "origin"});
 *			});
 *		</script>
 *
 * If jQuery is loaded:
 *
 *		@example
 *		<!-- element with no properties - popup will be opened next to it in context style manually -->
 *		<div id="linkId">Click to open context popup</div>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// set opening popup on click event
 *			$("#linkId").on("click", function () {
 *				// opening with options
 *				$("#popup").popup("open", {link: "linkId", positionTo: "origin"});
 *			});
 *		</script>
 *
 * These options can be also set globally and then method _open_ can be called without options. However, this solution can be used only for TAU API.
 *
 *		@example
 *		<!-- element with no properties - popup will be opened next to it in context style manually -->
 *		<div id="linkId">Link for popup</div>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// set options
 *			var popupWidget = tau.widget.Popup(document.getElementById("popup"));
 *			popupWidget.option({positionTo: "origin", link: "linkId"}); // here we set positionTo and id of link, which sets placement of popup
 *
 *			// set opening popup on click event
 *			document.getElementById("linkId").addEventListener("click", function () {
 *				//if options are set, we can call method open without options
 *				popupWidget.open();
 *			});
 *		</script>
 *
 * For jQuery API, id of link has to be always added as a option:
 *
 *		@example
 *		<!-- element with no properties - popup will be opened next to it in context style manually -->
 *		<div id="linkId">Link for popup</div>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// set option positionTo
 *			$("#popup").popup("option", "positionTo", "origin");
 *
 *			// set opening popup on click event
 *			$("#linkId").on("click", function () {
 *				// for jQuery API, link has to be added as a option
 *				$("#popup").popup("open", {link: "linkId"});
 *			});
 *		</script>
 *
 *
 * ##Special classes
 *
 * There are some special CSS classes, which changes the style of popup:
 *
 *  - _center_info_ - basic pop-up message<br>
 *  - _center_title_ - pop-up message with a title<br>
 *  - _center_basic_1btn_ - pop-up message with 1 button<br>
 *  - _center_basic_2btn_ - pop-up message with 2 horizontal buttons<br>
 *  - _center_title_1btn_ - pop-up message with a title and 1 button<br>
 *  - _center_title_2btn_ - pop-up message with a title and 2 horizontal buttons<br>
 *  - _center_title_3btn_ - pop-up message with a title and 3 horizontal buttons<br>
 *  - _center_button_vertical_ - pop-up message with vertical buttons<br>
 *  - _center_checkbox_ - pop-up message with a check box<br>
 *  - _center_liststyle_1btn_ - pop-up message with a list and 1 button<br>
 *  - _center_liststyle_2btn_ - pop-up message with a list and 2 horizontal buttons<br>
 *  - _center_liststyle_3btn_ - pop-up message with a list and 3 horizontal buttons<br>
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		var popupElement = document.getElementById("popup"),
 *			popup = tau.widget.Popup(popupElement);
 *
 *		popup.methodName(methodArgument1, methodArgument2, ...);
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		$(".selector").popup("methodName", methodArgument1, methodArgument2, ...);
 *
 * ##Opening popup
 * There are two ways to open popup.
 *
 * ###Opening by clicking on link
 *
 * If link has _id_ of popup set as value of property _href_, then this popup will be opened after clicking on it.
 *
 *		@example
 *		<!--definition of link, which opens popup with id popup-->
 *		<a href="#popup">Click to open popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 * Be award that context popup with arrow will be opened if link has _id_ property set and _data-position-to="origin"_  as in this example:
 *
 *		@example
 *		<!--definition of link, which opens context popup with id popup-->
 *		<a href="#popup" id="linkId" data-position-to="origin" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 * To open window popup, property _data-position-to="window"_ must be set in link or popup.
 *
 *		@example
 *		<!--definition of link, which opens window popup with id popup-->
 *		<a href="#popup" id="linkId" data-position-to="window">Click to open popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 * ###Opening manually
 *
 * To open popup with _id_ "popup", tau namespace can be used:
 *
 *		@example
 *		<div id="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popupElement = document.getElementById("popup"),
 *				popup = tau.widget.Popup(popupElement);
 *			popup.open();
 *		</script>
 *
 * If jQuery library is loaded, this method can be used:
 *
 *		@example
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popup = $("#popup").popup();
 *			popup.popup("open");
 *		</script>
 *
 *
 * ## Closing popup
 *
 * ###Closing by clicking on button inside
 *
 * If link inside popup has property _data-rel="back"_, then popup will be closed after clicking on it as in this example:
 *
 *		@example
 *		<a href="#center_title_1btn" data-position-to="window">Click to open popup</a>
 *		<!--definition of popup with a title and button-->
 *		<div id="center_title_1btn" data-role="popup" class="center_title_1btn">
 *			<div class="ui-popup-title">
 *				<h1>Popup title</h1>
 *			</div>
 *			<div class="ui-popup-text">
 *				Pop-up dialog box, a child window that blocks user interaction to the parent windows
 *			</div>
 *			<div class="ui-popup-button-bg">
 *				<a data-role="button" data-rel="back" data-inline="true">Button</a>
 *			</div>
 *		</div>
 *
 *
 * The selector, which causes closing on click, can be changed by setting option _closeLinkSelector_ in popup.
 *
 * ###Closing manually
 *
 * To close popup with _id_ "popup", tau namespace can be used:
 *
 *		@example
 *		<a href="#popup" data-position-to="window">Click to open popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popupElement = document.getElementById("popup"),
 *				popup = tau.widget.Popup(popupElement);
 *			// close popup after opening
 *			popupElement.addEventListener("popupafteropen", function () {
 *				popup.close();
 *			});
 *		</script>
 *
 * If jQuery library is loaded, this method can be used:
 *
 *		@example
 *		<a href="#popup" data-position-to="window">Click to open popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			$("#popup").on("popupafteropen", function () {
 *				$("#popup").popup("close");
 *			});
 *		</script>
 *
 * ## Handling Popup Events
 *
 * To use popup events, use the following code:
 *
 *		@example
 *		<!-- Popup html code -->
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// Use popup events
 *			var popup = document.getElementById("popup");
 *			popup.addEventListener("popupafteropen", function() {
 *				// Implement code for popupafteropen event
 *			});
 *		</script>
 *
 * Full list of available events is in [events list section](#events-list).

 * @since 2.0
 * @class ns.widget.mobile.Popup
 * @component-selector .ui-popup, [data-role]="popup"
 * @extends ns.widget.core.Popup
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 */

/**
 * Triggered when process of opening popup is completed.
 * The "popupafteropen" event is triggered when the popup has completely appeared on the screen and all associated animations have completed.
 * @event popupafteropen
 * @member ns.widget.mobile.Popup
 */
/**
 * Triggered when process of opening popup is completed.
 * The "popupshow" event is triggered when the popup has completely appeared on
 * the screen and all associated animations have completed. This event is
 * triggered in the same time as event "popupafteropen".
 * @event popupshow
 * @member ns.widget.mobile.Popup
 */
/**
 * Triggered before a popup computes the coordinates where it will appear.
 * The "beforeposition" event is triggered before the popup starts the opening animations and calculates the coordinates where it will appear on the screen. Handling this event gives an opportunity to modify the content of the popup before it appears on the screen.
 * @event beforeposition
 * @member ns.widget.mobile.Popup
 */

/**
 * Triggered when the process of closing popup is completed.
 * The "popupafterclose" event is triggered when the popup has completely disappeared from the screen and all associated animations have completed.
 * @event popupafterclose
 * @member ns.widget.mobile.Popup
 */
/**
 * Triggered when the process of closing popup is completed.
 * The "popuphide" event is triggered when the popup has completely disappeared
 * from the screen and all associated animations have completed. This event is
 * triggered at the same time as event "popupafterclose".
 * @event popuphide
 * @member ns.widget.mobile.Popup
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/object",
			"../../../core/util/selectors",
			"../../../core/util/DOM",
			"../../../core/widget/core/ContextPopup",
			"../../../core/widget/core/Listview",
			"../../../core/widget/core/Button",
			"../widget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var CorePopup = ns.widget.core.ContextPopup,
				CorePopupPrototype = CorePopup.prototype,

				Listview = ns.widget.core.Listview,

				engine = ns.engine,

				doms = ns.util.DOM,

				POPUP_SELECTOR = "[data-role='popup'], .ui-popup",

				objectUtils = ns.util.object,

				utilSelector = ns.util.selectors,

				Popup = function () {
					var self = this;

					CorePopup.call(this);
					// set options
					self.options = objectUtils.merge(self.options, Popup.defaults);
					self._positionCallback = null;
				};

			Popup.classes = CorePopup.classes;

			/**
			* @property {Object} options Object with default options
			* @property {string} [options.transition="none"] Sets the default transition for the popup.
			* @property {string} [options.positionTo="origin"] Sets the element relative to which the popup will be centered.
			* @property {Array} [options.directionPriority=["bottom", "top", "right", "left"]] Sets directions of popup's placement by priority.
			* First one has the highest priority, last the lowest. It is *deprecated* option.
			* @property {string} [options.closeLinkSelector="a[data-rel="back"]"] Sets selector for buttons in popup
			* @property {boolean} [options.history=false] Sets whether to alter the url when a popup is open to support the back button.
			* @member ns.widget.mobile.Popup
			*/
			Popup.defaults = objectUtils.merge({}, CorePopup.defaults, {
				closeLinkSelector: "a[data-rel='back']",
				transition: "pop",
				directionPriority: ["bottom", "top", "right", "left"], /* deprecated */
				arrow: "b,t,r,l",
				positionTo: "origin"
			});

			Popup.events = objectUtils.merge({}, CorePopup.events, {
				AFTER_OPEN: "popupafteropen",
				AFTER_CLOSE: "popupafterclose"
			});

			Popup.selector = POPUP_SELECTOR;

			Popup.prototype = new CorePopup();

			/**
			* Build structure of popup widget
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._build = function (element) {
				var page = utilSelector.getClosestByClass(element, "ui-page") || document.body,
					elementClassList = element.classList,
					self = this,
					i,
					popupContentClassList,
					DOMTokenListPrototype = DOMTokenList.prototype,
					classListToSwap;

				if (element.parentNode !== page) {
					page.appendChild(element);
				}
				element = CorePopupPrototype._build.call(self, element);
				popupContentClassList = self._ui.content.classList;

				//This is for backwards compatibility when
				//.ui-popup-activity class was in div with class
				//.ui-popup-content, now .ui-popup-activity class
				// should be placed in most outer Popup div that has class .ui-popup
				if (popupContentClassList.contains("ui-popup-activity")) {

					classListToSwap = [];

					for (i = 0; i < popupContentClassList.length; i++) {
						if (popupContentClassList[i].indexOf("ui-popup-activity") !== -1) {
							classListToSwap.push(popupContentClassList[i]);
						}
					}

					DOMTokenListPrototype.remove.apply(popupContentClassList, classListToSwap);
					for (i = 0; i < classListToSwap.length; i++) {
						elementClassList.add(classListToSwap[i]);
					}
				}
				return element;
			};

			Popup.prototype._setDirectionPriority = function (element, value) {
				if (value) {
					this.options.arrow = value.map(function (arrow) {
						return arrow.charAt(0).toLowerCase();
					}).join(",");
				}
			};

			/**
			 * Refresh structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.Popup
			 */
			Popup.prototype._refresh = function () {
				var self = this;

				if (this._isActive()) {
					if (typeof self._positionCallback === "function") {
						self._positionCallback();
					}
					CorePopupPrototype._refresh.call(this);
				}
			};

			/**
			 * set height of content
			 * @method _setContentHeight
			 * @protected
			 * @member ns.widget.mobile.Popup
			 * */
			Popup.prototype._setContentHeight = function () {
				var computedMaxHeight = window.innerHeight - doms.getCSSProperty(this.element, "margin-top", 0, "float");

				CorePopupPrototype._setContentHeight.call(this, computedMaxHeight);
			};

			/**
			 * Find clicked element.
			 * @method _findClickedElement
			 * @param {number} x
			 * @param {number} y
			 * @protected
			 * @member ns.widget.mobile.Popup
			 */
			Popup.prototype._findClickedElement = function (x, y) {
				var element = CorePopupPrototype._findClickedElement.call(this, x, y),
					button = utilSelector.getClosestBySelector(element, engine.getWidgetDefinition("Button").selector);

				return button || element;
			};

			/**
			 * Show popup
			 * @method _show
			 * @protected
			 * @member ns.widget.mobile.Popup
			 */
			Popup.prototype._show = function () {
				var self = this,
					listviewElement,
					listview;

				// Disabled colored list for contextual popups
				if (self.options.positionTo !== "window") {
					listviewElement = self.element.querySelector("." + Listview.classes.LISTVIEW);
					if (listviewElement) {
						listview = engine.getBinding(listviewElement);
						if (listview) {
							listview.option("coloredBackground", false);
						}
					}
				}

				CorePopupPrototype._show.call(self);
			};

			/**
			 * Show popup
			 * @method _onShow
			 * @protected
			 * @member ns.widget.mobile.Popup
			 */
			Popup.prototype._onShow = function () {
				CorePopupPrototype._onShow.call(this);
				this.trigger(Popup.events.AFTER_OPEN);
			};

			/**
			 * Hide popup
			 * @method _onHide
			 * @protected
			 * @member ns.widget.mobile.Popup
			 */
			Popup.prototype._onHide = function () {
				CorePopupPrototype._onHide.call(this);
				this.trigger(Popup.events.AFTER_CLOSE);
			};

			/**
			 * Set callback, which is called on "resize" event. This callback should return desired position of popup after resizing.
			 *
			 * This function should be used instead of "setPositionCB".
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *
			 *          popupWidget.setPositionCallback(function() {
			 *                return {x: 10, y: 20};
			 *         });
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("setPositionCallback", function() {
			 *                return {x: 10, y: 20};
			 *          });
			 *      </script>
			 *
			 * @method setPositionCallback
			 * @param {Function} callback Function called on resizing. It should return desired position of popup as object with "x" and "y" properties.
			 * @member ns.widget.mobile.Popup
			 * @since 2.3
			 */
			Popup.prototype.setPositionCallback = function (callback) {
				this._positionCallback = callback;
			};

			ns.widget.mobile.Popup = Popup;
			engine.defineWidget(
				"Popup",
				POPUP_SELECTOR,
				[
					"open",
					"close",
					"reposition",
					"setPositionCallback",
					"setPositionCB"
				],
				Popup,
				"mobile",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Popup;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
