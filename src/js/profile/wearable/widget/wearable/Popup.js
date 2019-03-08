/*global window, ns, define, ns */
/*
 * Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
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
 * # Popup Widget
 * Shows a pop-up window.
 *
 * The popup widget shows in the middle of the screen a list of items in a pop-up window. It automatically optimizes the pop-up window size within the screen. The following table describes the supported popup classes.
 *
 * ## Default selectors
 * All elements with class *ui-popup* will be become popup widgets.
 *
 * The pop-up window can contain a header, content, and footer area like the page element.
 *
 * To open a pop-up window from a link, use the data-rel attribute in HTML markup as in the following code:
 *
 *      @example
 *      <a href="#popup" class="ui-btn" data-rel="popup">Open popup when clicking this element.</a>
 *
 * The following table shows examples of various types of popups.
 *
 * The popup contains header, content and footer area
 *
 * ###HTML Examples
 *
 * #### Basic popup with header, content, footer
 *
 *        @example
 *        <div class="ui-page">
 *            <div class="ui-popup">
 *                <div class="ui-popup-header">Power saving mode</div>
 *                <div class="ui-popup-content">
 *                    Turning on Power
 *                    saving mode will
 *                    limit the maximum
 *                    per
 *                </div>
 *                <div class="ui-popup-footer">
 *                    <button id="cancel" class="ui-btn">Cancel</button>
 *                </div>
 *            </div>
 *        </div>
 *
 * #### Popup with 2 buttons in the footer
 *
 *      @example
 *         <div id="2btnPopup" class="ui-popup">
 *             <div class="ui-popup-header">Delete</div>
 *             <div class="ui-popup-content">
 *                 Delete the image?
 *             </div>
 *             <div class="ui-popup-footer ui-grid-col-2">
 *                 <button id="2btnPopup-cancel" class="ui-btn">Cancel</button>
 *                 <button id="2btnPopup-ok" class="ui-btn">OK</button>
 *             </div>
 *         </div>
 *
 * #### Popup with checkbox/radio
 *
 * If you want make popup with list checkbox(or radio) just include checkbox (radio) to popup and add class *ui-popup-checkbox-label* to popup element.
 *
 *        @example
 *         <div id="listBoxPopup" class="ui-popup">
 *             <div class="ui-popup-header">When?</div>
 *             <div class="ui-popup-content" style="height:243px; overflow-y:scroll">
 *                 <ul class="ui-listview">
 *                     <li>
 *                         <label for="check-1" class="ui-popup-checkbox-label">Yesterday</label>
 *                         <input type="checkbox" name="checkSet" id="check-1" />
 *                     </li>
 *                     <li>
 *                         <label for="check-2" class="ui-popup-checkbox-label">Today</label>
 *                         <input type="checkbox" name="checkSet" id="check-2" />
 *                     </li>
 *                     <li>
 *                         <label for="check-3" class="ui-popup-checkbox-label">Tomorrow</label>
 *                         <input type="checkbox" name="checkSet" id="check-3" />
 *                     </li>
 *                 </ul>
 *                 <ul class="ui-listview">
 *                     <li>
 *                         <label for="radio-1" class="ui-popup-radio-label">Mandatory</label>
 *                         <input type="radio" name="radioSet" id="radio-1" />
 *                     </li>
 *                     <li>
 *                         <label for="radio-2" class="ui-popup-radio-label">Optional</label>
 *                         <input type="radio" name="radioSet" id="radio-2" />
 *                     </li>
 *                 </ul>
 *             </div>
 *             <div class="ui-popup-footer">
 *                 <button id="listBoxPopup-close" class="ui-btn">Close</button>
 *             </div>
 *         </div>
 *     </div>
 *
 * #### Popup with no header and footer
 *
 *      @example
 *         <div id="listNoTitleNoBtnPopup" class="ui-popup">
 *             <div class="ui-popup-content" style="height:294px; overflow-y:scroll">
 *                 <ul class="ui-listview">
 *                     <li><a href="">Ringtones 1</a></li>
 *                     <li><a href="">Ringtones 2</a></li>
 *                     <li><a href="">Ringtones 3</a></li>
 *                 </ul>
 *             </div>
 *         </div>
 *
 * #### Toast popup
 *
 *      @example
 *         <div id="PopupToast" class="ui-popup ui-popup-toast">
 *             <div class="ui-popup-content">Saving contacts to sim on Samsung</div>
 *         </div>
 *
 * ### Create Option popup
 *
 * Popup inherits value of option positionTo from property data-position-to set in link.
 *
 *        @example
 *        <!--definition of link, which opens popup and sets its position-->
 *        <a href="#popupOptionText" data-rel="popup"  data-position-to="origin">Text</a>
 *        <!--definition of popup, which inherits property position from link-->
 *        <div id="popupOptionText" class="ui-popup">
 *            <div class="ui-popup-content">
 *                <ul class="ui-listview">
 *                <li><a href="#">Option 1</a></li>
 *                <li><a href="#">Option 2</a></li>
 *                <li><a href="#">Option 3</a></li>
 *                <li><a href="#">Option 4</a></li>
 *                </ul>
 *            </div>
 *        </div>
 *
 * ### Opening and closing popup
 *
 * To open popup from "a" link using html markup, use the following code:
 *
 *        @example
 *      <div class="ui-page">
 *          <header class="ui-header">
 *              <h2 class="ui-title">Call menu</h2>
 *          </header>
 *          <div class="ui-content">
 *              <a href="#popup" class="ui-btn" data-rel="popup" >Open Popup</a>
 *          </div>
 *
 *          <div id="popup" class="ui-popup">
 *               <div class="ui-popup-header">Power saving mode</div>
 *                   <div class="ui-popup-content">
 *                       Turning on Power
 *                       saving mode will
 *                       limit the maximum
 *                       per
 *                   </div>
 *               <div class="ui-popup-footer">
 *               <button id="cancel" class="ui-btn">Cancel</button>
 *           </div>
 *       </div>
 *
 *  To open the popup widget from JavaScript use method *tau.openPopup(to)*
 *
 *          @example
 *          tau.openPopup("popup")
 *
 *  To close the popup widget from JavaScript use method *tau.openPopup(to)*
 *
 *          @example
 *          tau.closePopup("popup")
 *
 * To find the currently active popup, use the ui-popup-active class.
 *
 * To bind the popup to a button, use the following code:
 *
 *      @example
 *         <!--HTML code-->
 *         <div id="1btnPopup" class="ui-popup">
 *             <div class="ui-popup-header">Power saving mode</div>
 *             <div class="ui-popup-content">
 *             </div>
 *             <div class="ui-popup-footer">
 *                 <button id="1btnPopup-cancel" class="ui-btn">Cancel</button>
 *             </div>
 *         </div>
 *         <script>
 *             // Popup opens with button click
 *             var button = document.getElementById("button");
 *             button.addEventListener("click", function() {
 *                 tau.openPopup("#1btnPopup");
 *             });
 *
 *             // Popup closes with Cancel button click
 *             document.getElementById("1btnPopup-cancel").addEventListener("click", function() {
 *                 tau.closePopup();
 *             });
 *         </script>
 *
 * ## Manual constructor
 * For manual creation of popup widget you can use constructor of widget from **tau** namespace:
 *
 *        @example
 *        var popupElement = document.getElementById("popup"),
 *            popup = tau.widget.popup(buttonElement);
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget. We recommend get this element by method *document.getElementById*.
 *
 * ## Options for Popup Widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *        @example
 *        var popupElement = document.getElementById("popup"),
 *            popup = tau.widget.popup(buttonElement);
 *
 *        popup.methodName(methodArgument1, methodArgument2, ...);
 *
 * ## Transitions
 *
 * By default, the framework doesn't apply transition. To set a custom transition effect, add the data-transition attribute to the link.
 *
 *        @example
 *        <a href="index.html" data-rel="popup" data-transition="slideup">I\'ll slide up</a>
 *
 * Global configuration:
 *
 *        @example
 *        gear.ui.defaults.popupTransition = "slideup";
 *
 * ### Transitions list
 *
 * - **none** Default value, no transition.
 * - **slideup** Makes the content of the pop-up slide up.
 *
 * ## Handling Popup Events
 *
 * To use popup events, use the following code:
 *
 *      @example
 *         <!--Popup html code-->
 *         <div id="popup" class="ui-popup">
 *             <div class="ui-popup-header"></div>
 *             <div class="ui-popup-content"></div>
 *         </div>
 *         </div>
 *         <script>
 *             // Use popup events
 *             var popup = document.getElementById("popup");
 *             popup.addEventListener("popupbeforecreate", function() {
 *                 // Implement code for popupbeforecreate event
 *             });
 *         </script>
 *
 * Full list of available events is in [events list section](#events-list).
 *
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @class ns.widget.wearable.Popup
 * @component-selector [data-role="popup"], .ui-popup
 * @component-type hiding-container-component
 * @extends ns.widget.core.ContextPopup
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/object",
			"../../../../core/util/DOM/css",
			"../../../../core/widget/core/ContextPopup"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var CorePopup = ns.widget.core.ContextPopup,

				CorePopupPrototype = CorePopup.prototype,

				engine = ns.engine,

				objectUtils = ns.util.object,

				defaults = {
					fullSize: false,
					enablePopupScroll: false
				},

				classes = objectUtils.merge({}, CorePopup.classes, {
					popupScroll: "ui-scroll-on",
					fixed: "ui-fixed",
					sideButton: "ui-side-button",
					hasSideButtons: "ui-has-side-buttons",
					toast: "ui-popup-toast",
					ctx: "ui-ctxpopup"
				}),

				Popup = function () {
					var self = this;

					CorePopup.call(self);
					self.options = objectUtils.merge(self.options, {
						fullSize: ns.getConfig("popupFullSize", defaults.fullSize),
						enablePopupScroll: ns.getConfig("enablePopupScroll", defaults.enablePopupScroll)
					});
				},

				prototype = new CorePopup();

			/**
			 * Layouting popup structure
			 * @method layout
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.Popup
			 */
			prototype._layout = function (element) {
				var self = this,
					elementClassList = element.classList,
					ui = self._ui,
					wrapper = ui.wrapper,
					header = ui.header,
					footer = ui.footer,
					content = ui.content,
					headerHeight = 0,
					footerHeight = 0;

				self._blockPageScroll();

				CorePopupPrototype._layout.call(self, element);

				if (self.options.enablePopupScroll === true) {
					element.classList.add(classes.popupScroll);
				} else {
					element.classList.remove(classes.popupScroll);
				}

				if (elementClassList.contains(classes.popupScroll)) {
					elementClassList.add(classes.build);

					if (header) {
						headerHeight = header.offsetHeight;
						if (header.classList.contains(classes.fixed)) {
							content.style.marginTop = headerHeight + "px";
						}
					}
					if (footer) {
						footerHeight = footer.offsetHeight;
						if (footer.classList.contains(classes.fixed)) {
							content.style.marginBottom = footerHeight + "px";
						}
						if (footer.classList.contains(classes.sideButton)) {
							elementClassList.add(classes.hasSideButtons);
						}
					}

					wrapper.style.height = Math.min(content.offsetHeight + headerHeight + footerHeight, element.offsetHeight) + "px";

					elementClassList.remove(classes.build);
				}

				if (self.options.fullSize && !elementClassList.contains(classes.toast) && !elementClassList.contains(classes.ctx)) {
					wrapper.style.height = window.innerHeight + "px";
				}
			};

			/**
			 * Hide popup.
			 * @method _onHide
			 * @protected
			 * @member ns.widget.wearable.Popup
			 */
			prototype._onHide = function () {
				var self = this,
					ui = self._ui,
					wrapper = ui.wrapper;

				if (wrapper) {
					wrapper.removeAttribute("style");
				}
				self._unblockPageScroll();
				CorePopupPrototype._onHide.call(self);
			};

			prototype._blockPageScroll = function () {
				var page = ns.widget.Page(this._ui.page);

				if (page.getScroller) {
					page.getScroller().style.overflow = "hidden";
				}
			};

			prototype._unblockPageScroll = function () {
				var page = ns.widget.Page(this._ui.page);

				if (page.getScroller) {
					page.getScroller().style.overflow = "";
				}
			};

			Popup.prototype = prototype;
			ns.widget.wearable.Popup = Popup;

			engine.defineWidget(
				"Popup",
				"[data-role='popup'], .ui-popup",
				[
					"open",
					"close",
					"reposition"
				],
				Popup,
				"wearable",
				true
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Popup;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
