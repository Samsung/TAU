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
/*global window, define, ns*/
/**
 * # Section Changer
 * Section changer component provides an application architecture, which has multiple sections on one page.
 *
 * The section changer widget provides an application architecture, which has
 * multiple sections on a page and enables scrolling through the *section* elements.
 *
 * ## Manual constructor
 *
 *      @example template tau-section-changer
 *         <div class="ui-section-changer">
 *             <div>
 *                 <section style="text-align:center"><span>${1:Section 1}</span></section>
 *                 <section style="text-align:center"><span>${2:Section 2}</span></section>
 *             </div>
 *         </div>
 *
 *
 *      @example
 *         <div id="hasSectionchangerPage" class="ui-page">
 *             <header class="ui-header">
 *                 <h2 class="ui-title">SectionChanger</h2>
 *             </header>
 *             <div id="sectionchanger" class="ui-content">
 *                 <!--Section changer has only one child-->
 *                 <div>
 *                     <section>
 *                         <h3>LEFT1 PAGE</h3>
 *                     </section>
 *                     <section class="ui-section-active">
 *                         <h3>MAIN PAGE</h3>
 *                     </section>
 *                     <section>
 *                         <h3>RIGHT1 PAGE</h3>
 *                     </section>
 *                 </div>
 *             </div>
 *         </div>
 *         <script>
 *             (function () {
 *                 var page = document.getElementById("hasSectionchangerPage"),
 *                     element = document.getElementById("sectionchanger"),
 *                     sectionChanger;
 *
 *                 page.addEventListener("pageshow", function () {
 *                     // Create the SectionChanger object
 *                     sectionChanger = new tau.SectionChanger(element, {
 *                         circular: true,
 *                         orientation: "horizontal",
 *                         useBouncingEffect: true
 *                     });
 *                 });
 *
 *                 page.addEventListener("pagehide", function () {
 *                     // Release the object
 *                     sectionChanger.destroy();
 *                 });
 *             })();
 *         </script>
 *
 * ## Handling Events
 *
 * To handle section changer events, use the following code:
 *
 *      @example
 *         <script>
 *             (function () {
 *                 var changer = document.getElementById("sectionchanger");
 *                 changer.addEventListener("sectionchange", function (event) {
 *                     console.debug(event.detail.active + " section is active.");
 *                 });
 *             })();
 *         </script>
 *
 * @class ns.widget.core.SectionChanger
 * @since 2.4
 * @component-selector [data-role="section-changer"], .ui-section-changer
 * @component-type container-component
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../../core/event/gesture",
			"../../../core/widget/BaseWidget",
			"./scroller/Scroller",
			"./tab/TabIndicator",
			"./Page",
			"../core",
			"../../../core/util/selectors",
			"../BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Scroller = ns.widget.core.scroller.Scroller,
				gesture = ns.event.gesture,
				Orientation = gesture.Orientation,
				engine = ns.engine,
				utilsObject = ns.util.object,
				utilsEvents = ns.event,
				objectMerge = ns.util.object.merge,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				Page = ns.widget.core.Page,
				selectors = ns.util.selectors,
				eventType = objectMerge({
					/**
					 * Triggered when the section is changed.
					 * @event sectionchange
					 * @member ns.widget.core.SectionChanger
					 */
					CHANGE: "sectionchange"
				}, Scroller.EventType),
				classes = {
					uiSectionChanger: "ui-section-changer"
				},
				/**
				 * Options for widget
				 * @property {Object} defaultOptions
				 * @property {"horizontal"|"vertical"} [defaultOptions.orientation="horizontal"] Sets the section changer orientation:
				 * @property {boolean} [defaultOptions.circular=false] Presents the sections in a circular scroll fashion.
				 * @property {boolean} [defaultOptions.useBouncingEffect=false] Shows a scroll end effect on the scroll edge.
				 * @property {string} [defaultOptions.items="section"] Defines the section element selector.
				 * @property {string} [defaultOptions.activeClass="ui-section-active"] Specifies the CSS classes which define the active section element. Add the specified class (ui-section-active) to a *section* element to indicate which section must be shown first. By default, the first section is shown first.
				 * @property {boolean} [defaultOptions.fillContent=true] declare to section tag width to fill content or not.
				 * @member ns.widget.core.SectionChanger
				 */
				defaultOptions = {
					items: "section",
					activeClass: "ui-section-active",
					circular: false,
					animate: true,
					animateDuration: 100,
					orientation: "horizontal",
					changeThreshold: -1,
					useTab: false,
					fillContent: true,
					model: null,
					directives: null
				};

			function SectionChanger() {
				this.options = objectMerge({}, defaultOptions);
				BaseKeyboardSupport.call(this);
				this._ui = {
					page: null
				};
			}

			function calculateCustomLayout(direction, elements, lastIndex) {
				var elementsLength = elements.length,
					length = lastIndex !== undefined ? lastIndex : elementsLength,
					result = 0,
					i = 0;

				if (length > elementsLength) {
					length = elementsLength;
				}

				for (i; i < length; i++) {
					result += direction === Orientation.HORIZONTAL ? elements[i].offsetWidth : elements[i].offsetHeight;
				}
				return result;
			}

			function calculateCenter(direction, elements, index) {
				var result = calculateCustomLayout(direction, elements, index + 1),
					element = elements[index];

				if (element) {
					result -= direction === Orientation.HORIZONTAL ? element.offsetWidth / 2 : element.offsetHeight / 2;
				}

				return result;
			}

			utilsObject.inherit(SectionChanger, Scroller, {
				_build: function (element) {
					var self = this,
						options = self.options;

					self.tabIndicatorElement = null;
					self.tabIndicator = null;

					self.sections = null;
					self.sectionPositions = [];

					self.activeIndex = 0;
					self.beforeIndex = 0;

					self._super(element);

					element.classList.add(classes.uiSectionChanger);

					self.scroller.style.position = "absolute";
					self.scroller.classList.add("ui-section-changer-container");
					self.orientation = options.orientation === "horizontal" ? Orientation.HORIZONTAL : Orientation.VERTICAL;

					return element;
				},

				_configure: function () {
					this._super();
					this.options = utilsObject.merge(this.options, defaultOptions);
				},

				/**
				 * Generic method for data-bind for HTML element
				 * @method _fillElementFromModel
				 * @param {HTMLElement} element
				 * @param {Object} dataItem
				 * @param {Function[]} directive
				 * @member ns.widget.core.SectionChanger
				 * @protected
				 */
				_fillElementFromModel: function (element, dataItem, directive) {
					var itemName,
						dataBoundElement;

					for (itemName in dataItem) {
						if (dataItem.hasOwnProperty(itemName)) {
							dataBoundElement = element.querySelector("[data-bind='" + itemName + "']");
							if (dataBoundElement) {
								if (directive && typeof directive[itemName] === "function") {
									directive[itemName].call(dataBoundElement, dataItem[itemName]);
								} else {
									dataBoundElement.innerText = dataItem[itemName];
								}
							}
						}
					}
				},

				_setModel: function (element, value) {
					this.options.model = value;
					this._findDataBinding();
				},

				/**
				 * Specific method for widget filling from model
				 * @method _fillElementFromModel
				 * @param {string} key
				 * @param {Array} data
				 * @param {Function} directive
				 * @member ns.widget.core.SectionChanger
				 * @protected
				 */
				_fillWidgetFromModel: function (key, data, directive) {
					var self = this,
						element = self.element,
						dataBoundElements,
						dataBoundElement,
						content,
						parentElement;

					// clone section for all items
					dataBoundElements = element.querySelectorAll("[data-bind='" + key + "'] > section");

					if (dataBoundElements.length === 1) { // clone element for each item
						dataBoundElement = dataBoundElements[0];
						content = dataBoundElement.innerHTML;
						parentElement = dataBoundElement.parentElement;

						parentElement.removeChild(dataBoundElement);
						data.forEach(function (dataItem) {
							var newElement = dataBoundElement.cloneNode();

							newElement.innerHTML = content;
							self._fillElementFromModel(newElement, dataItem, directive);

							parentElement.appendChild(newElement);
						});
					} else {
						// @todo
						// fill existent elements by data
					}
				},

				_findDataBinding: function () {
					var model = this.options.model,
						modelItem,
						directives = this.options.directives,
						directive,
						key;

					// create items for data
					if (model) {
						for (key in model) {
							if (model.hasOwnProperty(key)) {
								modelItem = model[key];
								if (typeof modelItem === "string") {
									// @todo
									// innerText for item
								} else if (Array.isArray(modelItem)) {
									if (directives) {
										directive = directives[key];
									}
									this._fillWidgetFromModel(key, modelItem, directive);
								}
							}
						}
					}
				},

				_init: function (element) {
					var self = this,
						options = self.options,
						scroller = self.scroller,
						sectionLength,
						i,
						className,
						ui = self._ui;

					if (options.scrollbar === "tab") {
						options.scrollbar = false;
						options.useTab = true;
					}

					if (options.model) {
						self._findDataBinding();
					}

					// find parent page
					ui.page = selectors.getClosestBySelector(self.element, "." + Page.classes.uiPage);

					if (scroller) {
						self.sections = typeof options.items === "string" ?
							scroller.querySelectorAll(options.items) :
							options.items;

						sectionLength = self.sections.length;

						if (options.circular && sectionLength < 3) {
							ns.error("[SectionChanger] if you use circular option, you must have at least three sections.");
						} else {
							for (i = 0; i < sectionLength; i++) {
								className = self.sections[i].className;
								if (className && className.indexOf(options.activeClass) > -1) {
									self.activeIndex = i;
								} else {
									if (self.isKeyboardSupport === true) {
										self.disableFocusableElements(self.sections[i]);
									}
								}

								self.sectionPositions[i] = i;
							}

							self._prepareLayout();
							self._initLayout();
							self._super(element);
							self._repositionSections(true);
							self.setActiveSection(self.activeIndex);

							// set correct options values.
							if (!options.animate) {
								options.animateDuration = 0;
							}
							if (options.changeThreshold < 0) {
								options.changeThreshold = self._sectionChangerHalfWidth;
							}
						}
					}

					return element;
				},

				_prepareLayout: function () {
					var o = this.options,
						sectionLength = this.sections.length,
						orientation = this.orientation,
						scrollerStyle = this.scroller.style,
						offsetHeight = this.element.offsetHeight,
						tabHeight;

					if (offsetHeight === 0) {
						offsetHeight = this.element.parentNode.offsetHeight;
						this.element.style.height = offsetHeight + "px";
					}

					this._sectionChangerWidth = this.element.offsetWidth;
					this._sectionChangerHeight = offsetHeight;
					this._sectionChangerHalfWidth = this._sectionChangerWidth / 2;
					this._sectionChangerHalfHeight = this._sectionChangerHeight / 2;

					if (o.useTab) {
						this._initTabIndicator();
						tabHeight = this.tabIndicatorElement.offsetHeight;
						this._sectionChangerHeight -= tabHeight;
						this._sectionChangerHalfHeight = this._sectionChangerHeight / 2;
						this.element.style.height = this._sectionChangerHeight + "px";
					}

					if (orientation === Orientation.HORIZONTAL) {
						scrollerStyle.width = (o.fillContent ? this._sectionChangerWidth * sectionLength : calculateCustomLayout(orientation, this.sections)) + "px";
						scrollerStyle.height = this._sectionChangerHeight + "px";
					} else {
						scrollerStyle.width = this._sectionChangerWidth + "px";
						scrollerStyle.height = (o.fillContent ? this._sectionChangerHeight * sectionLength : calculateCustomLayout(orientation, this.sections)) + "px";
					}

				},

				_initLayout: function () {
					var sectionStyle,
						left = 0,
						top = 0,
						i,
						sectionLength;

					//section element has absolute position
					for (i = 0, sectionLength = this.sections.length; i < sectionLength; i++) {
						//Each section set initialize left position
						sectionStyle = this.sections[i].style;
						sectionStyle.position = "absolute";
						if (this.options.fillContent) {
							sectionStyle.width = this._sectionChangerWidth + "px";
							sectionStyle.height = this._sectionChangerHeight + "px";
						}

						if (this.orientation === Orientation.HORIZONTAL) {
							top = 0;
							left = calculateCustomLayout(this.orientation, this.sections, i);
						} else {
							top = calculateCustomLayout(this.orientation, this.sections, i);
							left = 0;
						}

						sectionStyle.top = top + "px";
						sectionStyle.left = left + "px";
					}

				},

				_initBouncingEffect: function () {
					var o = this.options;

					if (!o.circular) {
						this._super();
					}
				},

				_translateScrollbar: function (x, y, duration, autoHidden) {
					var self = this,
						offset,
						scrollbar = self.scrollbar;

					if (scrollbar) {
						if (self.orientation === Orientation.HORIZONTAL) {
							offset = -x + self.minScrollX;
						} else {
							offset = -y + self.minScrollY;
						}

						scrollbar.translate(offset, duration, autoHidden);
					}
				},

				_translateScrollbarWithPageIndex: function (pageIndex, duration) {
					var offset;

					if (!this.scrollbar) {
						return;
					}

					offset = calculateCustomLayout(this.orientation, this.sections, this.activeIndex);

					this.scrollbar.translate(offset, duration);
				},

				_initTabIndicator: function () {
					var self = this,
						tabElement = document.createElement("div"),
						element = self.element,
						tabIndicator = null;

					self.tabIndicatorElement = tabElement;

					element.parentNode.insertBefore(tabElement, element);

					tabIndicator = new engine.instanceWidget(tabElement, "TabIndicator");
					self.tabIndicator = tabIndicator;
					tabIndicator.setSize(self.sections.length);
					tabIndicator.setActive(self.activeIndex);
					self.tabIndicatorHandler = function (event) {
						this.tabIndicator.setActive(event.detail.active);
					}.bind(self);
					element.addEventListener(eventType.CHANGE, self.tabIndicatorHandler, false);
				},

				_clearTabIndicator: function () {
					if (this.tabIndicator) {
						this.element.parentNode.removeChild(this.tabIndicatorElement);
						this.element.removeEventListener(eventType.CHANGE, this.tabIndicatorHandler, false);
						this.tabIndicator.destroy();
						this.tabIndicator = null;
						this.tabIndicatorElement = null;
						this.tabIndicatorHandler = null;
					}
				},

				_resetLayout: function () {
					var //scrollerStyle = this.scroller.style,
						sectionStyle,
						i,
						sectionLength;

					//scrollerStyle.width = "";
					//scrollerStyle.height = "";
					//this.scroller || this.scroller._resetLayout();

					for (i = 0, sectionLength = this.sections.length; i < sectionLength; i++) {
						sectionStyle = this.sections[i].style;

						sectionStyle.position = "";
						sectionStyle.width = "";
						sectionStyle.height = "";
						sectionStyle.top = "";
						sectionStyle.left = "";
					}

					this._super();
				},

				_bindEvents: function () {
					var self = this;

					self._super();

					if (self.scroller) {
						ns.event.enableGesture(
							self.scroller,

							new ns.event.gesture.Swipe({
								orientation: self.orientation === Orientation.HORIZONTAL ?
									gesture.Orientation.HORIZONTAL :
									gesture.Orientation.VERTICAL
							})
						);

						utilsEvents.on(self.scroller,
							"swipe transitionEnd webkitTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd", self);
						if (self._ui.page) {
							utilsEvents.on(self._ui.page, "taufocusborder", self);
						}
					}

					// disable tau rotaryScroller, this widget has own support for rotary event
					ns.util.rotaryScrolling && ns.util.rotaryScrolling.lock();

					document.addEventListener("rotarydetent", self, true);
				},

				_unbindEvents: function () {
					var self = this;

					self._super();

					if (self.scroller) {
						ns.event.disableGesture(self.scroller);
						utilsEvents.off(self.scroller,
							"swipe transitionEnd webkitTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd", self);
						if (self._ui.page) {
							utilsEvents.off(self._ui.page, "taufocusborder", self);
						}
					}

					document.removeEventListener("rotarydetent", self, true);

					// disable tau rotaryScroller, this widget has own support for rotary event
					ns.util.rotaryScrolling && ns.util.rotaryScrolling.unlock();
				},

				/**
				 * This method manages events.
				 * @method handleEvent
				 * @param {Event} event
				 * @member ns.widget.core.SectionChanger
				 */
				handleEvent: function (event) {
					this._super(event);

					switch (event.type) {
						case "swipe":
						case "taufocusborder":
							this._change(event);
							break;
						case "rotarydetent" :
							this._change(event, true);
							break;
						case "webkitTransitionEnd":
						case "mozTransitionEnd":
						case "msTransitionEnd":
						case "oTransitionEnd":
						case "transitionEnd":
							if (event.target === this.scroller) {
								this._endScroll();
							}
							break;
					}
				},

				_notifyChangedSection: function (index) {
					var activeClass = this.options.activeClass,
						sectionLength = this.sections.length,
						i = 0,
						section;

					for (i = 0; i < sectionLength; i++) {
						section = this.sections[i];
						section.classList.remove(activeClass);
						if (i === this.activeIndex) {
							section.classList.add(activeClass);
						}
					}

					this.trigger(eventType.CHANGE, {
						active: index
					});
				},

				/**
				 * Changes the currently active section element.
				 * @method setActiveSection
				 * @param {number} index
				 * @param {number} [duration=0] For smooth scrolling,
				 * the duration parameter must be in milliseconds.
				 * @param {boolean} [direct=false] Whether section is set once directly (e.g. with bezel)
				 *  or with touch events
				 * @param {boolean} [reposition=true] Whether sections should be repositioned
				 * @member ns.widget.core.SectionChanger
				 */
				setActiveSection: function (index, duration, direct, reposition) {
					var position = this.sectionPositions[index],
						scrollbarDuration,
						oldActiveIndex = this.activeIndex,
						newX = 0,
						newY = 0;

					//default parameters
					duration = duration || 0;
					direct = !!direct;
					if (reposition == undefined) {
						reposition = true;
					}

					scrollbarDuration = duration;

					if (this.orientation === Orientation.HORIZONTAL) {
						newX = this._sectionChangerHalfWidth - calculateCenter(this.orientation, this.sections, position);

					} else {
						newY = this._sectionChangerHalfHeight - calculateCenter(this.orientation, this.sections, position);
					}

					if (this.beforeIndex - index > 1 || this.beforeIndex - index < -1) {
						scrollbarDuration = 0;
					}

					// disable keyboard on latest section
					if (this.activeIndex !== index && this.isKeyboardSupport === true) {
						this.disableFocusableElements(this.sections[this.activeIndex]);
					}

					this.activeIndex = index;
					this.beforeIndex = this.activeIndex;

					if (newX !== this.scrollerOffsetX || newY !== this.scrollerOffsetY) {
						if (direct !== false) {
							this.trigger(eventType.START);
							this.scrolled = true;
						}

						this._translate(newX, newY, duration);
						this._translateScrollbarWithPageIndex(index, scrollbarDuration);
					} else {
						this._endScroll();
					}

					// notify changed section.
					if (this.activeIndex !== oldActiveIndex) {
						this._notifyChangedSection(this.activeIndex);
					}

					if (reposition) {
						this._repositionSections(true);
					}

				},

				/**
				 * Gets the currently active section element's index.
				 * @method getActiveSectionIndex
				 * @return {number}
				 * @member ns.widget.core.SectionChanger
				 */
				getActiveSectionIndex: function () {
					return this.activeIndex;
				},

				_start: function (e) {
					this._super(e);

					this.beforeIndex = this.activeIndex;
				},

				_move: function (event) {
					var self = this,
						changeThreshold = self.options.changeThreshold,
						delta = self.orientation === Orientation.HORIZONTAL ? event.detail.deltaX : event.detail.deltaY,
						oldActiveIndex = self.activeIndex,
						beforeIndex = self.beforeIndex;

					self._super(event);

					if (self.scrolled) {
						if (delta > changeThreshold) {
							self.activeIndex = self._calculateIndex(beforeIndex - 1);
						} else if (delta < -changeThreshold) {
							self.activeIndex = self._calculateIndex(beforeIndex + 1);
						} else {
							self.activeIndex = beforeIndex;
						}

						// notify changed section.
						if (self.activeIndex !== oldActiveIndex) {
							self._notifyChangedSection(self.activeIndex);
						}
					}
				},

				_end: function () {
					var self = this;

					if (self.scrollbar) {
						self.scrollbar.end();
					}

					if (self.enabled && !self.scrollCanceled && self.dragging) {
						// bouncing effect
						if (self.bouncingEffect) {
							self.bouncingEffect.dragEnd();
						}

						self.setActiveSection(self.activeIndex, self.options.animateDuration, false, false);
						self.dragging = false;
					}
				},

				/**
				 * Changes the currently active section element.
				 * @method _change
				 * @param {event} event
				 * @param {boolean} [direct=false]
				 * @private
				 */
				_change: function (event, direct) {
					var self = this,
						direction = event.detail.direction,
						offset = direction === gesture.Direction.UP ||
							direction === gesture.Direction.LEFT ||
							direction === "CW" ? 1 : -1,
						newIndex;

					if (event.type === "taufocusborder") {
						offset *= -1; // invert direction;
					}

					newIndex = self._calculateIndex(self.beforeIndex + offset);

					direct = !!direct;

					if (self.enabled && !self.scrollCanceled) {
						// bouncing effect
						if (self.bouncingEffect) {
							self.bouncingEffect.dragEnd();
						}

						if (self.activeIndex !== newIndex) {
							// disable keyboard on latest section
							if (self.isKeyboardSupport === true && self.sections) {
								self.disableFocusableElements(self.sections[self.activeIndex]);
								self.blurOnActiveElement();
							}
							self.activeIndex = newIndex;
							self._notifyChangedSection(newIndex);
						}

						self.setActiveSection(newIndex, self.options.animateDuration, direct, false);
						self.dragging = false;
					}
				},

				_endScroll: function () {
					var self = this;

					// enable keyboard focus on section at current index
					if (this.isKeyboardSupport === true) {
						self.enableDisabledFocusableElements(self.sections[self.activeIndex]);
					}

					if (!self.enabled || !self.scrolled || self.scrollCanceled) {
						return;
					}

					self._repositionSections();
					self._super();
				},

				_repositionSections: function (init) {
					// if developer set circular option is true, this method used when webkitTransitionEnd event fired
					var self = this,
						sections = self.sections,
						activeIndex = self.activeIndex,
						orientation = self.orientation,
						isHorizontal = orientation === Orientation.HORIZONTAL,
						sectionLength = sections.length,
						curPosition = self.sectionPositions[activeIndex],
						centerPosition = Math.floor(sectionLength / 2),
						circular = self.options.circular,
						centerX = 0,
						centerY = 0,
						i,
						sectionStyle,
						sIdx,
						top,
						left,
						newX,
						newY;

					if (isHorizontal) {
						newX = -(calculateCenter(orientation, sections, (circular ? centerPosition : activeIndex)));
						newY = 0;
					} else {
						newX = 0;
						newY = -(calculateCenter(orientation, sections, (circular ? centerPosition : activeIndex)));
					}

					self._translateScrollbarWithPageIndex(activeIndex);

					if (init || (curPosition === 0 || curPosition === sectionLength - 1)) {
						if (isHorizontal) {
							centerX = self._sectionChangerHalfWidth + newX;
						} else {
							centerY = self._sectionChangerHalfHeight + newY;
						}
						self._translate(centerX, centerY);

						if (circular) {
							for (i = 0; i < sectionLength; i++) {
								sIdx = (sectionLength + activeIndex - centerPosition + i) % sectionLength;
								sectionStyle = sections[sIdx].style;

								self.sectionPositions[sIdx] = i;

								if (isHorizontal) {
									top = 0;
									left = calculateCustomLayout(orientation, sections, i);
								} else {
									top = calculateCustomLayout(orientation, sections, i);
									left = 0;
								}

								sectionStyle.top = top + "px";
								sectionStyle.left = left + "px";
							}
						}
					}
				},

				_calculateIndex: function (newIndex) {
					var sectionLength = this.sections.length;

					if (this.options.circular) {
						newIndex = (sectionLength + newIndex) % sectionLength;
					} else {
						newIndex = newIndex < 0 ? 0 : (newIndex > sectionLength - 1 ? sectionLength - 1 : newIndex);
					}

					return newIndex;
				},

				_clear: function () {
					this._clearTabIndicator();
					this._super();
					this.sectionPositions.length = 0;
				},

				_destroy: function () {
					var element = this.element;

					// clear dimensions set in _build
					element.style.height = null;
					element.style.width = null;
					this._super();
				}
			});

			ns.widget.core.SectionChanger = SectionChanger;

			engine.defineWidget(
				"SectionChanger",
				"[data-role='section-changer'], .ui-section-changer",
				["getActiveSectionIndex", "setActiveSection"],
				SectionChanger
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);

			return SectionChanger;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
