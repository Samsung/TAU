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
 * # Dialog Widget
 * Display div as a model dialog page with inset appearance.
 *
 * Any page can be presented as a modal dialog by adding the data-rel="dialog"
 * attribute to the page anchor link. When the "dialog" attribute is applied,
 * the framework adds styles to add rounded corners, margins around the page
 * and a dark background to make the "dialog" appear to be suspended above
 * the page.
 *
 * ## Default selectors
 * By default all elements with _data-role=dialog_ are changed to Tizen Web UI
 * Dialog.
 *
 * In additional all elements with class _ui-dialog_ are changed to Tizen Web UI
 * Dialog.
 *
 * #### Create simple dialog from div using data-role
 *
 *        @example
 *        <div data-role="page" id="page1">
 *            <div data-role="header">
 *                <h1>Page</h1>
 *            </div>
 *            <div data-role="content" class="ui-content">
 *                <a data-role="button" href="#dialogPage"
 *                    data-rel="dialog">Open dialog</a>
 *            </div>
 *        </div>
 *
 *        <div data-role="dialog" id="dialogPage">
 *            <div data-role="header">
 *                <h2>Dialog</h2>
 *            </div>
 *            <div data-role="content" class="ui-content">
 *                <p>I am a dialog</p>
 *            </div>
 *        </div>
 *
 * #### Create simple dialog from div using class selector
 *
 *        @example
 *        <div data-role="page" id="page1">
 *            <div data-role="header">
 *                <h1>Page</h1>
 *            </div>
 *            <div data-role="content" class="ui-content">
 *                <a data-role="button" href="#dialogPage"
 *                    data-rel="dialog">Open dialog</a>
 *            </div>
 *        </div>
 *
 *        <div data-role="dialog" id="dialogPage">
 *            <div data-role="header">
 *                <h2>Dialog</h2>
 *            </div>
 *            <div data-role="content" class="ui-content">
 *                <p>I am a dialog</p>
 *            </div>
 *        </div>
 *
 * ## Manual constructor
 *
 *        @example
 *        <div data-role="page" id="page1">
 *            <div data-role="header">
 *                <h1>Page</h1>
 *            </div>
 *            <div data-role="content" class="ui-content">
 *                <a data-role="button" id="btn-open" href="#">Open dialog</a>
 *            </div>
 *        </div>
 *
 *        <div id="dialogPage">
 *            <div data-role="header">
 *                <h2>Dialog</h2>
 *            </div>
 *            <div data-role="content" class="ui-content">
 *                <p>I am a dialog</p>
 *            </div>
 *        </div>
 *        <script>
 *            var element = document.getElementById("dialogPage"),
 *                dialogOpen = function () {
 *					var dialog = tau.widget.Dialog(element);
 *				};
 *            document.getElementById("btn-open")
 *                .addEventListener("vclick", dialogOpen);
 *        </script>
 *
 * ## Options for Dialog
 * Options for widget can be defined as _data-..._ attributes or given
 * as parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ### closeBtn
 * _data-close-btn_ Position of the dialog close button
 * in the header
 *
 *        @example
 *        <div data-role="page" id="page1">
 *            <div data-role="header">
 *                <h1>Page</h1>
 *            </div>
 *            <div data-role="content" class="ui-content">
 *                <a data-role="button" href="#dialogPage"
 *                    data-rel="dialog">Open dialog</a>
 *            </div>
 *        </div>
 *
 *        <div data-role="dialog" data-close-btn="left" id="dialogPage">
 *            <div data-role="header">
 *                <h2>Dialog</h2>
 *            </div>
 *            <div data-role="content" class="ui-content">
 *                <p>I am a dialog</p>
 *            </div>
 *        </div>
 *
 * ### closeBtnText
 * _data-close-btn-text_ Customize text of the close button,
 * by default close button is displayed as an icon-only so the text
 * isn't visible, but is read by screen readers
 *
 *        @example
 *        <div data-role="page" id="page1">
 *            <div data-role="header">
 *                <h1>Page</h1>
 *            </div>
 *            <div data-role="content" class="ui-content">
 *                <a data-role="button" href="#dialogPage"
 *                    data-rel="dialog">Open dialog</a>
 *            </div>
 *        </div>
 *
 *        <div data-role="dialog" data-close-btn="left"
 *            data-close-btn-text="Click to close" id="dialogPage">
 *            <div data-role="header">
 *                <h2>Dialog</h2>
 *            </div>
 *            <div data-role="content" class="ui-content">
 *                <p>I am a dialog</p>
 *            </div>
 *        </div>
 *
 * ### overlayTheme
 * _data-overlay-theme_ Background under dialog content color
 *
 *        @example
 *        <div data-role="page" id="page1">
 *            <div data-role="header">
 *                <h1>Page</h1>
 *            </div>
 *            <div data-role="content" class="ui-content">
 *                <a data-role="button" href="#dialogPage"
 *                    data-rel="dialog">Open dialog</a>
 *            </div>
 *        </div>
 *
 *        <div data-role="dialog" data-overlay-theme="s" id="dialogPage">
 *            <div data-role="header">
 *                <h2>Dialog</h2>
 *            </div>
 *            <div data-role="content" class="ui-content">
 *                <p>I am a dialog</p>
 *            </div>
 *        </div>
 *
 * ### corners
 * _data-corners_ Sets if dialog should be drawn with rounded corners
 *
 *        @example
 *        <div data-role="page" id="page1">
 *            <div data-role="header">
 *                <h1>Page</h1>
 *            </div>
 *            <div data-role="content" class="ui-content">
 *                <a data-role="button" href="#dialogPage"
 *                    data-rel="dialog">Open dialog</a>
 *            </div>
 *        </div>
 *
 *        <div data-role="dialog" data-corners="false" id="dialogPage">
 *            <div data-role="header">
 *                <h2>Dialog</h2>
 *            </div>
 *            <div data-role="content" class="ui-content">
 *                <p>I am a dialog</p>
 *            </div>
 *        </div>
 *
 * @class ns.widget.mobile.Dialog
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/event",
			"../../../core/util/selectors",
			"../../../core/util/DOM/attributes",
			"../../../core/widget/core/Button",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile",
			"../../../core/widget/core/Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Widget Alias for {@link ns.widget.BaseWidget}
			 * @property {Object}
			 * @member ns.widget.mobile.Dialog
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.mobile.Dialog
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias to {@link ns.util.selectors}
				 * @property {Object} selectors
				 * @member ns.widget.mobile.Dialog
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors,
				/**
				 * Alias to {@link ns.util.DOM}
				 * @property {Object} dom
				 * @member ns.widget.mobile.Dialog
				 * @private
				 * @static
				 */
				doms = ns.util.DOM,
				/**
				 * Alias to {@link ns.event}
				 * @property {Object} events
				 * @private
				 * @static
				 */
				events = ns.event,
				/**
				 * Alias to {@link ns.widget.core.Button#classes}
				 * @property {Object} buttonClasses
				 * @member ns.widget.mobile.Dialog
				 * @private
				 * @static
				 */
				buttonClasses = ns.widget.core.Button.classes,

				/**
				 * Dictionary for dialog related css class names
				 * @property {Object} classes
				 * @member ns.widget.mobile.Dialog
				 * @static
				 * @readonly
				 * @property {string} classes.uiDialog Main Dialog class name
				 * @property {string} classes.uiDialogContain
				 * Dialog container class name
				 * @property {string} classes.uiCornerAll
				 * Class for all Dialog corners
				 * @property {string} classes.uiHeader
				 * @property {string} classes.uiContent
				 * @property {string} classes.uiFooter
				 * @property {string} classes.uiBarPrefix
				 * @property {string} classes.uiBodyPrefix
				 * @property {string} classes.uiDialogHidden
				 */
				classes = {
					uiDialog: "ui-dialog",
					uiDialogContain: "ui-dialog-contain",
					uiCornerAll: "ui-corner-all",
					uiHeader: "ui-header",
					uiContent: "ui-content",
					uiFooter: "ui-footer",
					uiBarPrefix: "ui-bar-",
					uiBodyPrefix: "ui-body-",
					uiDialogHidden: "ui-dialog-hidden"
				},

				Dialog = function () {
					var self = this;
					/**

					 * Object with default options
					 * @property {Object} options
					 * @property {"left"|"right"|"none"} [options.closeBtn="left"] Position of the dialog close button in the header, accepts: left, right and none
					 * @property {string} [options.closeBtnText="Close"] Customize text of the close button, by default close button is displayed as an icon-only so the text isn't visible, but is read by screen readers
					 * @property {string} [options.closeLinkSelector="a[data-rel='back']"] Selector for buttons used to closing dialog
					 * @property {string} [options.overlayTheme="c"] Background under dialog content color
					 * @property {boolean} [options.corners=true] Sets if dialog should be drawn with rounded corners
					 * @property {string} [options.page=""] Sets if of related page
					 * @member ns.widget.mobile.Dialog
					 */

					self.options = {
						closeBtn: "left",
						closeBtnText: "Close",
						closeLinkSelector: "a[data-rel='back']",
						overlayTheme: "c",
						corners: true,
						page: ""
					};

					self._eventHandlers = {};
					self._ui = {
						page: null // page related with this dialog
					};

				},
				prototype = new BaseWidget();

			/**
			 * Dictionary for dialog related css class names
			 * @property {Object} classes
			 * @protected
			 */
			Dialog.classes = classes;

			Dialog.prototype = prototype;


			/**
			 * Create close button.
			 * @method createCloseButton
			 * @param {HTMLElement} element
			 * @param {"none"|"left"|"right"} [location="none"]
			 * @param {string} text
			 * @private
			 * @static
			 * @member ns.widget.mobile.Dialog
			 */
			function createCloseButton(element, location, text) {
				var button,
					header;

				if (location !== "left" && location !== "right") {
					location = "none";
				}

				// if location of closing button is set, button is created
				if (location !== "none") {
					button = document.createElement("a");
					button.setAttribute("data-rel", "back");
					button.className = buttonClasses.uiBtn + "-" + location;
					button.textContent = text || "";

					header = element.getElementsByClassName(classes.uiHeader)[0];
					if (header) {
						header.insertBefore(button, header.firstChild);
					}

					engine.instanceWidget(button, "Button", {
						iconpos: "notext",
						icon: "delete",
						inline: true,
						corners: true
					});
				}
			}

			/**
			 * Set page active / inactive
			 * @method setActive
			 * @param {boolean} value
			 * @member ns.widget.mobile.Dialog
			 * @protected
			 */
			Dialog.prototype.setActive = function (value) {
				var self = this,
					elementClassList = self.element.classList,
					dialogClasses = classes,
					pageClasses = ns.widget.core.Page.classes;

				if (value) {
					elementClassList.remove(dialogClasses.uiDialogHidden);
					elementClassList.add(pageClasses.uiPage);
					elementClassList.add(pageClasses.uiPageActive);
				} else {
					elementClassList.remove(pageClasses.uiPage);
					elementClassList.remove(pageClasses.uiPageActive);
					elementClassList.add(dialogClasses.uiDialogHidden);
				}
			};

			/**
			 * Builds Dialog widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Dialog
			 */
			Dialog.prototype._build = function (element) {
				var self = this,
					container = document.createElement("div"),
					childrenLength = element.children.length,
					getChildrenBySelector = selectors.getChildrenBySelector,
					headers = getChildrenBySelector(element, "[data-role='header']"),
					content = getChildrenBySelector(element, "[data-role='content']"),
					footers = getChildrenBySelector(element, "[data-role='footer']"),
					options = self.options,
					containerClassList = container.classList,
					headersClassList,
					dataTheme,
					elementTheme,
					contentTheme,
					page,
					pageId,
					i,
					l;


				page = selectors.getClosestBySelector(element, "[data-role='page']");
				pageId = page ? page.id : "";
				doms.setNSData(element, "page", pageId);
				options.page = pageId;


				dataTheme = element.getAttribute("data-theme");
				elementTheme = dataTheme ? dataTheme : options.overlayTheme;

				element.classList.add(classes.uiDialog);
				element.classList.add(classes.uiBodyPrefix +
					elementTheme);

				for (i = 0; i < childrenLength; i++) {
					container.appendChild(element.children[0]);
				}

				containerClassList.add(classes.uiDialogContain);

				if (options.corners) {
					containerClassList.add(classes.uiCornerAll);
				}

				for (i = 0, l = headers.length; i < l; i++) {
					headersClassList = headers[i].classList;
					headersClassList.add(classes.uiHeader);
				}

				for (i = 0, l = content.length; i < l; i++) {
					content[i].classList.add(classes.uiContent);
					content[i].classList.add(classes.uiBodyPrefix +
						contentTheme);
				}

				for (i = 0, l = footers.length; i < l; i++) {
					footers[i].classList.add(classes.uiFooter);
				}

				element.appendChild(container);
				element.parentNode.removeChild(element);
				document.body.appendChild(element);

				createCloseButton(element, options.closeBtn, options.closeBtnText);

				return element;
			};

			/**
			 * This method inits Dialog widget.
			 * @method _init
			 * @protected
			 * @member ns.widget.mobile.Dialog
			 */
			Dialog.prototype._init = function () {
				var pageId = this.options.page;

				if (pageId) {
					this._ui.page = document.getElementById(pageId);
				}
			};

			/**
			 * Close dialog.
			 * @method _close
			 * @param {Event} event
			 * @returns {boolean} false
			 * @protected
			 * @member ns.widget.mobile.Dialog
			 */

			Dialog.prototype._close = function (event) {
				event.preventDefault();
				this.close();
				return false;
			};


			/**
			 * Close dialog
			 *
			 *        @example
			 *        <div data-role="page" id="page1">
			 *            <div data-role="header">
			 *                <h1>Page</h1>
			 *            </div>
			 *            <div data-role="content" class="ui-content">
			 *                <a href="#dialogPage" data-role="button"
			 *                    data-rel="dialog">Open dialog</a>
			 *            </div>
			 *        </div>
			 *
			 *        <div data-role="dialog" id="dialogPage">
			 *            <div data-role="header">
			 *                <h2>Dialog</h2>
			 *            </div>
			 *            <div data-role="content" class="ui-content">
			 *                <div data-role="button" id="button-close">
			 *                    Close dialog
			 *                </div>
			 *            </div>
			 *        </div>
			 *        <script>
			 *            var element = document.getElementById("dialogPage"),
			 *                onClose = function () {
			 *					// gets the dialog instance and closes Dialog
			 *					tau.widget.Dialog(element).close();
			 *				};
			 *            document.getElementById("button-close")
			 *                .addEventListener("vclick", onClose, true);
			 *        </script>
			 *
			 *
			 * @method close
			 * @member ns.widget.mobile.Dialog
			 */
			Dialog.prototype.close = function () {
				window.history.back();
			};

			/**
			 * Layouting page structure
			 * @method layout
			 * @member ns.widget.core.Page
			 */
			prototype.layout = function () {
			};

			/**
			 * This method triggers BEFORE_SHOW event.
			 * @method onBeforeShow
			 * @member ns.widget.core.Page
			 */
			prototype.onBeforeShow = function () {
			};

			/**
			 * This method triggers SHOW event.
			 * @method onShow
			 * @member ns.widget.core.Page
			 */
			prototype.onShow = function () {
			};

			/**
			 * This method triggers BEFORE_HIDE event.
			 * @method onBeforeHide
			 * @member ns.widget.core.Page
			 */
			prototype.onBeforeHide = function () {
			};

			/**
			 * This method triggers HIDE event.
			 * @method onHide
			 * @member ns.widget.core.Page
			 */
			prototype.onHide = function () {
			};

			/**
			 * Handler function to close the dialog on click.
			 * @method closeOnClick
			 * @param {ns.widget.mobile.Dialog} self
			 * @param {Event} event
			 * @static
			 * @private
			 */
			function closeOnClick(self, event) {
				var element = event.target;

				if (selectors.getClosestBySelector(element, self.options.closeLinkSelector)) {
					self.close();
				}
			}

			/**
			 * Bind widget events
			 * @method _bindEvents
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.Dialog
			 */
			Dialog.prototype._bindEvents = function (element) {
				var self = this,
					eventHandlers = self._eventHandlers;

				eventHandlers.destroyOnEvent = self.destroy.bind(self, element);
				eventHandlers.closeOnClick = closeOnClick.bind(null, self);

				element.addEventListener("vclick", eventHandlers.closeOnClick, true);

				if (self._ui.page) {
					self._ui.page.addEventListener("pagedestroy", eventHandlers.destroyOnEvent, true);
				}
			};

			/**
			 * Destroy Dialog widget
			 *
			 * The method removes event listeners.
			 *
			 *        @example
			 *        <div data-role="page" id="page1">
			 *            <div data-role="header">
			 *                <h1>Page</h1>
			 *            </div>
			 *            <div data-role="content" class="ui-content">
			 *                <a href="#dialogPage" data-role="button"
			 *                    data-rel="dialog">Open dialog</a>
			 *            </div>
			 *        </div>
			 *
			 *        <div data-role="dialog" id="dialogPage">
			 *            <div data-role="header">
			 *                <h2>Dialog</h2>
			 *            </div>
			 *            <div data-role="content" class="ui-content">
			 *                <div data-role="button" id="button-close">
			 *                    Close dialog
			 *                </div>
			 *            </div>
			 *        </div>
			 *        <script>
			 *            var element = document.getElementById("dialogPage"),
			 *                onClose = function () {
			 *					// gets the dialog instance, closes and destroy
			 *					// Dialog widget
			 *					tau.widget.Dialog(element)
			 *						.close()
			 *						.destroy();
			 *				};
			 *            document.getElementById("button-close")
			 *                .addEventListener("vclick", onClose, true);
			 *        </script>
			 *
			 * @method _destroy
			 * @member ns.widget.mobile.Dialog
			 * @protected
			 */
			Dialog.prototype._destroy = function () {
				var self = this,
					element = self.element,
					parentNode = element.parentNode,
					eventHandlers = self._eventHandlers;

				element.removeEventListener("vclick", eventHandlers.closeOnClick, true);

				if (self._ui.page) {
					self._ui.page.removeEventListener("pagedestroy", eventHandlers.destroyOnEvent, true);
				}

				events.trigger(document, "destroyed", {
					widget: "Dialog",
					parent: parentNode
				});
				parentNode.removeChild(element);
			};

			// definition
			ns.widget.mobile.Dialog = Dialog;
			engine.defineWidget(
				"Dialog",
				"[data-role='dialog'], .ui-dialog",
				["close"],
				Dialog,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Dialog;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
