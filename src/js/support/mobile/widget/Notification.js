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
/*jslint nomen: true, plusplus: true */
/**
 * #Notification widget
 * The Notification widget shows a popup on the screen to provide notifications.
 *
 * ##Default selectors
 * In all elements with _data-role=notification_ or with _ui-notification_ CSS class. Use _p_ tag for messages and _img_ tag for icon.
 *
 * ##Manual constructor
 * For manual creation of notification widget you can use constructor of widget:
 *
 *        @example
 *        <!-- Widget structure -->
 *        <div data-role="notification" id="notification" data-type="smallpopup">
 *            <p>Line of message</p>
 *        </div>
 *        <script>
 *            var notification = tau.widget.Notification(document.getElementById("notification"));
 *        </script>
 *
 * If jQuery library is loaded, this method can be used:
 *
 *        @example
 *        <!-- Widget structure -->
 *        <div data-role="notification" id="notification" data-type="smallpopup">
 *            <p>Line of message</p>
 *        </div>
 *        <script>
 *            var notification = $("#notification").notification();
 *        </script>
 *
 * ##HTML Examples
 *
 * ###Create notification smallpopup
 * Smallpopup has only one line of message and is positioned to the bottom of the active page. It's default type of notification widget.
 *
 * Running example in pure JavaScript:
 *
 *        @example
 *        <!-- Widget structure -->
 *        <div data-role="notification" id="notification" data-type="smallpopup">
 *            <p>Line of message</p>
 *        </div>
 *        <script>
 *            // Get widget instance or create new instance if widget not exists.
 *            var notification = tau.widget.Notification(document.getElementById("notification"));
 *            // Open notification
 *            notification.open();
 *        </script>
 *
 * If jQuery library is loaded, this method can be used:
 *
 *        @example
 *        <!-- Widget structure -->
 *        <div data-role="notification" id="notification" data-type="smallpopup">
 *            <p>Line of message</p>
 *        </div>
 *        <script>
 *            // Open widget using jQuery notation
 *            $( "#notification" ).notification( "open" )
 *        </script>
 *
 * ###Create notification ticker
 * Notification ticker has maximum two lines of message, other messages will be hidden. Additionally you can set an icon. Notification ticker is default positioned to the top of the page.
 *
 * Running example in pure JavaScript:
 *
 *        @example
 *        <div data-role="notification" id="notification" data-type="ticker">
 *            <p>First line of message</p>
 *            <p>Second line of message</p>
 *        </div>
 *        <script>
 *            // Get widget instance or create new instance if widget not exists.
 *            var notification = tau.widget.Notification(document.getElementById("notification"));
 *            // Open notification
 *            notification.open();
 *        </script>
 *
 * If jQuery library is loaded, this method can be used:
 *
 *        @example
 *        <div data-role="notification" id="notification" data-type="ticker">
 *            <p>First line of message</p>
 *            <p>Second line of message</p>
 *        </div>
 *        <script>
 *            // Open widget using jQuery notation
 *            $( "#notification" ).notification( "open" )
 *        </script>
 *
 * ###Create notification wih interval
 * Interval defines time to showing notification widget, after this it will close automatically. Values of _data-interval_ is a positive **number of miliseconds**, e.g. _data-interval="2000"_ (sets to close widget after 2 seconds). Otherwise widget will show infinitely
 *
 * Running example in pure JavaScript:
 *
 *        @example
 *        <div data-role="notification" id="notification" data-type="ticker" data-interval="4000">
 *            <img src="icon.png">
 *            <p>I will close in 4* seconds!</p>
 *            <p>* starts counting from widget opening</p>
 *        </div>
 *        <script>
 *            // Get widget instance or create new instance if widget not exists.
 *            var notification = tau.widget.Notification(document.getElementById("notification"));
 *            // Open notification
 *            notification.open();
 *        </script>
 *
 * If jQuery library is loaded, this method can be used:
 *
 *        @example
 *        <div data-role="notification" id="notification" data-type="ticker" data-interval="4000">
 *            <img src="icon.png">
 *            <p>I will close in 4* seconds!</p>
 *            <p>* starts counting from widget opening</p>
 *        </div>
 *        <script>
 *            // Open widget using jQuery notation
 *            $( "#notification" ).notification( "open" )
 *        </script>
 *
 * ###Create notification ticker with icon
 * !!!Icon is only supported with notification ticker.!!!
 *
 * Running example in pure JavaScript:
 *
 *        @example
 *        <div data-role="notification" id="notification" data-type="ticker">
 *            <img src="icon.png">
 *            <p>First line of message</p>
 *            <p>Second line of message</p>
 *        </div>
 *        <script>
 *            // Open notification
 *            notification.open();
 *        </script>
 *
 * If jQuery library is loaded, this method can be used:
 *
 *        @example
 *        <div data-role="notification" id="notification" data-type="ticker">
 *            <img src="icon.png">
 *            <p>First line of message</p>
 *            <p>Second line of message</p>
 *        </div>
 *        <script>
 *            // Open widget using jQuery notation
 *            $( "#notification" ).notification( "open" )
 *        </script>
 *
 * @class ns.widget.mobile.Notification
 * @extends ns.widget.mobile.BaseWidgetMobile
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/selectors",
			"../../../core/util/DOM",
			"../../../core/widget/core/Page",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * {Object} Widget Alias for {@link ns.widget.mobile.BaseWidgetMobile}
			 * @member ns.widget.mobile.Notification
			 * @private
			 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * {Object} Widget Alias for {@link ns.widget.core.Page}
				 * @member ns.widget.Notification
				 * @private
				 */
				Page = ns.widget.core.Page,
				/**
				 * @property {Object} engine Alias for class ns.engine
				 * @member ns.widget.mobile.Notification
				 * @private
				 */
				engine = ns.engine,
				/**
				 * @property {Object} selectors Alias for class ns.selectors
				 * @member ns.widget.mobile.Notification
				 * @private
				 */
				selectors = ns.util.selectors,
				doms = ns.util.DOM,

				/**
				 * Alias for class ns.widget.mobile.Notification
				 * @method Notification
				 * @member ns.widget.mobile.Notification
				 * @private
				 */
				Notification = function () {

					/**
					 * @property {boolean} _eventsAdded Flag that the widget bound with events
					 * @member ns.widget.mobile.Notification
					 * @private
					 */
					this._eventsAdded = false;

					/**
					 * @property {Object} _ui Holds all needed UI HTMLElements
					 * @member ns.widget.mobile.Notification
					 * @protected
					 */
					this._ui = {
						/**
						 * @property {HTMLElement} _ui.wrapper Widgets content wrapper
						 * @member ns.widget.mobile.Notification
						 * @protected
						 */
						wrapper: null,

						/**
						 * @property {NodeList} _ui.iconImg Widgets icons
						 * @member ns.widget.mobile.Notification
						 * @protected
						 */
						iconImg: null,

						/**
						 * @property {NodeList} _ui.texts Widgets texts
						 * @member ns.widget.mobile.Notification
						 * @protected
						 */
						texts: []
					};

					/**
					 * @property {number} interval Widgets interval
					 * @member ns.widget.mobile.Notification
					 * @protected
					 */
					this.interval = null;

					/**
					 * @property {boolean} running Widget running status
					 * @member ns.widget.mobile.Notification
					 * @protected
					 */
					this.running = false;

					/**
					 * Widget options
					 * @property {Object} options
					 * @property {"smallpopup"|"ticker"} [options.type="smallpopup"] type of widget. Allowed types: <b>smallpopup</b> or <b>ticker</b>.
					 * @property {number} [interval=0] interval value in milliseconds of widget. 0 - show widget infinitely
					 * @member ns.widget.mobile.Notification
					 * @protected
					 */
					this.options = {
						type: "smallpopup",
						interval: 0
					};
				};

			Notification.prototype = new BaseWidget();

			/**
			 * Dictionary for notification related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.Notification
			 * @static
			 */
			Notification.classes = {
				uiTicker: "ui-ticker",
				uiTickerText1Bg: "ui-ticker-text1-bg",
				uiTickerText2Bg: "ui-ticker-text2-bg",
				uiTickerIcon: "ui-ticker-icon",
				uiSmallpopup: "ui-smallpopup",
				uiSmallpopupTextBg: "ui-smallpopup-text-bg",
				uiTickerBtn: "ui-ticker-btn",
				uiNotificationFix: "fix",
				uiNotificationShow: "show",
				uiNotificationHide: "hide"
			};

			/**
			 * Build structure of notification widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Notification
			 */
			Notification.prototype._build = function (element) {
				var wrapperTag = "div",
					textTag = "p",
					options = this.options,
					classes = Notification.classes,
					uiElements = this._ui,
					notifyBtnWrapper,
					notifyWrapper,
					closeButton,
					nodeList,
					texts,
					i,
					l;

				//Set options
				options.type = element.getAttribute("data-type") || options.type;

				//Wrap it!
				notifyWrapper = document.createElement(wrapperTag);
				uiElements.wrapper = notifyWrapper;

				nodeList = element.childNodes;
				while (nodeList.length > 0) {
					notifyWrapper.appendChild(nodeList[0]);
				}

				//Get texts
				texts = notifyWrapper.getElementsByTagName(textTag);

				//Add elements if is lower than 2
				l = texts.length;
				for (i = l; i < 2; i++) {
					notifyWrapper.appendChild(document.createElement(textTag));
				}

				//Hide not visible elements
				l = texts.length; //Update length
				for (i = 2; i < l; i++) {
					texts[i].style.display = "none";
				}

				if (options.type === "ticker") {
					//Create elements
					notifyBtnWrapper = document.createElement(wrapperTag);
					closeButton = document.createElement(wrapperTag);

					//Create skeleton
					notifyBtnWrapper.appendChild(closeButton);
					notifyWrapper.appendChild(notifyBtnWrapper);

					//Add classes
					notifyWrapper.className = classes.uiTicker;
					notifyBtnWrapper.className = classes.uiTickerBtn;

					//Instance Button widget
					closeButton.textContent = "Close";
					engine.instanceWidget(closeButton, "Button", {
						inline: true
					});

					//Add classes to elements
					texts[0].classList.add(classes.uiTickerText1Bg);
					texts[1].classList.add(classes.uiTickerText2Bg);

				} else {
					//Add classes
					notifyWrapper.className = classes.uiSmallpopup;

					//Add classes to element and hide second element
					texts[0].classList.add(classes.uiSmallpopupTextBg);
					texts[1].style.display = "none";
				}
				element.appendChild(notifyWrapper);
				uiElements.texts = texts;
				return element;
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Notification
			 */
			Notification.prototype._init = function (element) {
				var options = this.options,
					classes = Notification.classes,
					uiElements = this._ui,
					iconImg,
					iconImgLength,
					wrapper,
					i;

				//Set widget wrapper
				uiElements.wrapper = element.firstElementChild;
				wrapper = uiElements.wrapper;

				//Set texts
				uiElements.texts[0] = wrapper.getElementsByClassName(classes.uiTickerText1Bg)[0];
				uiElements.texts[1] = wrapper.getElementsByClassName(classes.uiTickerText2Bg)[0];

				//Get icons
				iconImg = element.getElementsByTagName("img");
				iconImgLength = iconImg.length;
				for (i = 0; i < iconImgLength; i++) {
					iconImg[i].classList.add(classes.uiTickerIcon);
					//Hide unused icons
					if (i > 1) {
						iconImg[i].style.display = "none";
					}
				}
				uiElements.iconImg = iconImg;

				//fix for compare tests
				this.type = options.type;
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Notification
			 */
			Notification.prototype._bindEvents = function (element) {
				if (!this._eventsAdded) {
					// Is it needed, that closeButton should has click event bound with self.close() too?
					element.addEventListener("vmouseup", this.close.bind(this), true);
					this._eventsAdded = true;
				}
			};

			/**
			 * Enable to show notification on screen. This method removes __display: none__ style from notification element.
			 *
			 * #####Running example in pure JavaScript:
			 *
			 *    @example
			 *    <!-- Widget structure -->
			 *    <div data-role="notification" id="notification" data-type="smallpopup">
			 *        <p>Line of message</p>
			 *    </div>
			 *
			 *    <script>
			 *        // Get widget instance or create new instance if widget not exists.
			 *        var notification = tau.widget.Notification(document.getElementById("notification"));
			 *
			 *        // Make it enabled
			 *        notification.enable();
			 *    </script>
			 *
			 * #####If jQuery library is loaded, this method can be used:
			 *
			 *    @example
			 *    <!-- Widget structure -->
			 *    <div data-role="notification" id="notification" data-type="smallpopup">
			 *        <p>Line of message</p>
			 *    </div>
			 *
			 *    <script>
			 *        // Make it enabled
			 *        $( "#notification" ).notification( "enable" );
			 *    </script>
			 *
			 * @method enable
			 * @member ns.widget.mobile.Notification
			 */

			/**
			 * @method _enable
			 * @protected
			 * @member ns.widget.mobile.Notification
			 */
			Notification.prototype._enable = function () {
				this._ui.wrapper.style.display = "";
			};

			/**
			 * Disable notification. This method adds display:none style to notification element.
			 *
			 * #####Running example in pure JavaScript:
			 *
			 *    @example
			 *    <!-- Widget structure -->
			 *    <div data-role="notification" id="notification" data-type="smallpopup">
			 *        <p>Line of message</p>
			 *    </div>
			 *
			 *    <script>
			 *        // Get widget instance or create new instance if widget not exists.
			 *        var notification = tau.widget.Notification(document.getElementById("notification"));
			 *
			 *        // Make it disabled
			 *        notification.disable();
			 *    </script>
			 *
			 *
			 * #####If jQuery library is loaded, this method can be used:
			 *
			 *    @example
			 *    <!-- Widget structure -->
			 *    <div data-role="notification" id="notification" data-type="smallpopup">
			 *        <p>Line of message</p>
			 *    </div>
			 *
			 *    <script>
			 *        // Make it disabled
			 *        $( "#notification" ).notification( "disable" );
			 *    </script>
			 *
			 * @method disable
			 * @member ns.widget.mobile.Notification
			 *
			 */

			/**
			 * @method _disable
			 * @protected
			 * @member ns.widget.mobile.Notification
			 */
			Notification.prototype._disable = function () {
				this._ui.wrapper.style.display = "none";
			};

			/**
			 * Refresh a notification widget and resets interval if it was set before.
			 *
			 * #####Running example in pure JavaScript:
			 *
			 *    @example
			 *    <div data-role="notification" id="notificationSelector" data-type="smallpopup">
			 *        <p>Line of message</p>
			 *    </div>
			 *    <script>
			 *        var notification = tau.widget.Notification(document.getElementById("notificationSelector"));
			 *        notification.refresh();
			 *    </script>
			 *
			 * #####If jQuery library is loaded, this method can be used:
			 *
			 *    @example
			 *    <div data-role="notification" id="notificationSelector" data-type="smallpopup">
			 *        <p>Line of message</p>
			 *    </div>
			 *    <script>
			 *        $("#notificationSelector").notification("refresh");
			 *    </script>
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.Notification
			 */

			/**
			 * Refresh notification
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.Notification
			 */
			Notification.prototype._refresh = function () {
				var wrapperClassList = this._ui.wrapper.classList,
					classes = Notification.classes;

				wrapperClassList.add(classes.uiNotificationFix);
				wrapperClassList.remove(classes.uiNotificationHide);
				wrapperClassList.remove(classes.uiNotificationShow);
				this._setCloseInterval();
			};

			/**
			 * Set widget position.
			 * @method _positionWidget
			 * @protected
			 * @member ns.widget.mobile.Notification
			 */
			Notification.prototype._positionWidget = function () {
				var pages = document.body.getElementsByClassName(Page.classes.uiPageActive),
					footers,
					footerHeight = 0,
					pageWidth = 0,
					wrapper = this._ui.wrapper,
					wrapperStyle = wrapper.style,
					wrapperWidth = 0;

				if (typeof pages[0] === "object") {
					footers = selectors.getChildrenByClass(pages[0], "ui-footer");
					pageWidth = pages[0].offsetWidth;
					if (typeof footers[0] === "object") {
						footerHeight = footers[0].offsetHeight;
					}
				}
				wrapperWidth = doms.getCSSProperty(wrapper, "width", 0, "float") + doms.getCSSProperty(wrapper, "padding-left", 0, "float") + doms.getCSSProperty(wrapper, "padding-right", 0, "float");
				wrapperStyle.left = (pageWidth - wrapperWidth) / 2 + "px";
				wrapperStyle.bottom = footerHeight + (footerHeight > 0 ? "px" : "");
			};

			/**
			 * Open widget to show notification.
			 *
			 * #####Running example in pure JavaScript:
			 *
			 *    @example
			 *    <div data-role="notification" id="notificationSelector" data-type="smallpopup">
			 *        <p>Line of message</p>
			 *    </div>
			 *    <script>
			 *        var notification = tau.widget.Notification(document.getElementById("notificationSelector"));
			 *        notification.open();
			 *    </script>
			 *
			 * #####If jQuery library is loaded, this method can be used:
			 *
			 *    @example
			 *    <div data-role="notification" id="notificationSelector" data-type="smallpopup">
			 *        <p>Line of message</p>
			 *    </div>
			 *    <script>
			 *        $("#notificationSelector").notification("open");
			 *    </script>
			 *
			 * @method open
			 * @member ns.widget.mobile.Notification
			 */
			Notification.prototype.open = function () {
				var wrapperClassList = this._ui.wrapper.classList,
					classes = Notification.classes;

				if (this.running === true) {
					this.refresh();
					return;
				}
				wrapperClassList.add(classes.uiNotificationShow);
				wrapperClassList.remove(classes.uiNotificationHide);
				wrapperClassList.remove(classes.uiNotificationFix);

				if (this.options.type !== "ticker") {
					this._positionWidget();
				}

				this._setCloseInterval();
				this.running = true;
			};

			/**
			 * Close opened widget to hide notification.
			 *
			 * #####Running example in pure JavaScript:
			 *
			 *    @example
			 *    <div data-role="notification" id="notificationSelector" data-type="ticker">
			 *        <p>Line of message</p>
			 *    </div>
			 *    <script>
			 *        var notification = tau.widget.Notification(document.getElementById("notificationSelector"));
			 *        notification.close();
			 *    </script>
			 *
			 * #####If jQuery library is loaded, this method can be used:
			 *
			 *    @example
			 *    <div data-role="notification" id="notificationSelector" data-type="ticker">
			 *        <p>Line of message</p>
			 *    </div>
			 *    <script>
			 *        // or using jQuery
			 *        $("#notificationSelector").notification("close");
			 *    </script>
			 *
			 * @method close
			 * @member ns.widget.mobile.Notification
			 */
			Notification.prototype.close = function () {
				var wrapperClassList = this._ui.wrapper.classList,
					classes = Notification.classes;

				if (this.running !== true) {
					return;
				}

				wrapperClassList.add(classes.uiNotificationHide);
				wrapperClassList.remove(classes.uiNotificationShow);
				wrapperClassList.remove(classes.uiNotificationFix);
				clearInterval(this.interval);
				this.running = false;
			};

			/**
			 * Creates icon or changes existing icon to new one. This method resets CSS classes on image element.
			 *
			 * #####Running example in pure JavaScript:
			 *
			 *    @example
			 *    <div data-role="notification" id="notificationSelector" data-type="smallpopup">
			 *        <p>Line of message</p>
			 *    </div>
			 *    <script>
			 *        var notification = tau.widget.Notification(document.getElementById("notificationSelector"));
			 *        notification.icon("some-image.png");
			 *
			 *        // or using jQuery
			 *        $( "#notificationSelector" ).notification( "icon", "some-image.png" );
			 *    </script>
			 *
			 * #####If jQuery library is loaded, this method can be used:
			 *
			 *    @example
			 *    <div data-role="notification" id="notificationSelector" data-type="smallpopup">
			 *        <p>Line of message</p>
			 *    </div>
			 *    <script>
			 *        $( "#notificationSelector" ).notification( "icon", "some-image.png" );
			 *    </script>
			 *
			 * @method icon
			 * @param {string} src icon source URL
			 * @member ns.widget.mobile.Notification
			 */
			Notification.prototype.icon = function (src) {
				var uiElements = this._ui,
					iconImg = uiElements.iconImg,
					classes = Notification.classes;

				if (src) {
					//Remove all elements from NodeList
					while (iconImg.length > 0 && iconImg[0].remove) {
						iconImg[0].remove();
					}

					iconImg[0] = document.createElement("img");
					iconImg[0].className = classes.uiTickerIcon;
					iconImg[0].setAttribute("src", src);

					//Append icon
					uiElements.wrapper.appendChild(iconImg[0]);
					uiElements.iconImg = iconImg;
				}
			};

			/**
			 * Set widget texts. If no text is given, method returns notification text as an array.
			 *
			 * Getting current text of notification
			 *
			 * #####Running example in pure JavaScript:
			 *
			 *    @example
			 *    <div data-role="notification" id="notificationSelector" data-type="ticker">
			 *        <p>Line of message</p>
			 *        <p>Second line of message</p>
			 *    </div>
			 *    <script>
			 *        var notification = tau.widget.Notification(document.getElementById("notificationSelector")),
			 *            widgetText;
			 *        widgetText = notification.text();
			 *
			 *        alert(widgetText);
			 *        // will alert "Line of message,Second line of message"
			 *    </script>
			 *
			 * #####If jQuery library is loaded, this method can be used:
			 *
			 *    @example
			 *    <div data-role="notification" id="notificationSelector" data-type="ticker">
			 *        <p>Line of message</p>
			 *        <p>Second line of message</p>
			 *    </div>
			 *    <script>
			 *        var widgetText;
			 *
			 *        // or using jQuery
			 *        widgetText = $("#notificationSelector").notification("text");
			 *
			 *        alert(widgetText);
			 *        // will alert "Line of message,Second line of message"
			 *    </script>
			 *
			 * Setting text of notification.
			 *
			 * #####Running example in pure JavaScript:
			 *
			 *    @example
			 *    <div data-role="notification" id="notificationSelector" data-type="ticker">
			 *        <p>Line of message</p>
			 *        <p>Second line of message</p>
			 *    </div>
			 *    <script>
			 *        var notification = tau.widget.Notification(document.getElementById("notificationSelector"));
			 *
			 *        notification.text("This is a new Notification!", "This is an example");
			 *    </script>
			 *
			 * #####If jQuery library is loaded, this method can be used:
			 *
			 *    @example
			 *    <div data-role="notification" id="notificationSelector" data-type="ticker">
			 *        <p>Line of message</p>
			 *    </div>
			 *    <script>
			 *        $( "#notificationSelector" ).notification( "text", "This is new Notification!", "This is an example" );
			 *    </script>
			 *
			 * @method text
			 * @param {string} text0 first line of text
			 * @param {string} text1 second line of text
			 * @member ns.widget.mobile.Notification
			 * @return {?Array} widget text if no param given
			 */
			Notification.prototype.text = function (text0, text1) {

				if (text0 === undefined && text1 === undefined) {
					return this._getText();
				}

				this._setText(text0, text1);
				return null;
			};

			/**
			 * Set widgets texts
			 * @method _setText
			 * @param {string} text0 first line of text
			 * @param {string} text1 second line of text
			 * @private
			 * @member ns.widget.mobile.Notification
			 */
			Notification.prototype._setText = function (text0, text1) {
				if (text0 !== undefined) {
					this._ui.texts[0].textContent = text0;
				}
				if (text1 !== undefined) {
					this._ui.texts[1].textContent = text1;
				}
			};

			/**
			 * Get widget texts
			 * @method _getText
			 * @protected
			 * @member ns.widget.mobile.Notification
			 * @return {Array} widget texts
			 */
			Notification.prototype._getText = function () {
				var ui = this._ui,
					texts = [null, null];

				if (this.options.type === "ticker") {
					texts[0] = ui.texts[0] && ui.texts[0].textContent;
					texts[1] = ui.texts[1] && ui.texts[1].textContent;
				} else {
					texts[0] = ui.texts[0] && ui.texts[0].textContent;
				}

				return texts;
			};

			/**
			 * Sets interval
			 * @method _setCloseInterval
			 * @protected
			 * @member ns.widget.mobile.Notification
			 */
			Notification.prototype._setCloseInterval = function () {
				//Clear current interval
				clearInterval(this.interval);

				if (this.options.interval > 0) {
					//Create new interval
					this.interval = setInterval(this.close.bind(this), this.options.interval);
				}
			};

			/**
			 * Removes notification.
			 * This will return the element back to its pre-init state.
			 *
			 * #####Running example in pure JavaScript:
			 *
			 *    @example
			 *    <script>
			 *        var notification = tau.widget.Notification(document.getElementById("notificationSelector")),
			 *        notification.destroy();
			 *    </script>
			 *
			 * #####If jQuery library is loaded, this method can be used:
			 *
			 *    @example
			 *    <script>
			 *        $( "#notificationSelector" ).notification( "destroy" );
			 *    </script>
			 *
			 * @method destroy
			 * @member ns.widget.mobile.Notification
			 */

			/**
			 * Destroy widget
			 * @method _destroy
			 * @param {?HTMLElement} element Base element for destroy widget
			 * @protected
			 * @member ns.widget.mobile.Notification
			 */
			Notification.prototype._destroy = function (element) {
				var wrapper = this._ui.wrapper,
					nodeList;

				if (element) {
					wrapper = element.firstChild;
				} else {
					element = this.element;
				}
				nodeList = wrapper.childNodes;
				while (nodeList.length > 0) {
					element.appendChild(nodeList[0]);
				}
				element.removeChild(wrapper);
			};

			// definition
			ns.widget.mobile.Notification = Notification;
			engine.defineWidget(
				"Notification",
				"[data-role='notification'], .ui-notification",
				["open", "close", "icon", "text"],
				Notification,
				"tizen"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Notification;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
