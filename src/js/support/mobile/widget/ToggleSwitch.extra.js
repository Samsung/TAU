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
/*jslint nomen: true */

(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/DOM/attributes",
			"../../../core/util/DOM/manipulation",
			"../../../core/event",
			"../../../core/widget/core/Button",
			"../../../profile/mobile/widget/mobile", // fetch namespace
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var ToggleSwitchExtra = function () {
					var self = this;
					/**
					 * All possible widget options
					 * @property {Object} options
					 * @property {boolean} [options.disabled=false] start
					 * widget as enabled / disabled
					 * @property {?boolean} [options.mini=false] size
					 * of toggle switch
					 * @property {boolean} [options.highlight=true] if set
					 * then toggle switch can be highlighted
					 * @property {?boolean} [options.inline=false] if value is
					 * "true" then toggle switch has css property
					 * display = "inline"
					 * @member ns.widget.mobile.ToggleSwitchExtra                 *
					 */

					self.options = {
						disabled: false,
						mini: null,
						highlight: true,
						inline: null
					};
					self._ui = {};
				},
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				events = ns.event,
				Button = ns.widget.core.Button,
				/**
				 * @property {Object} selectors Alias for class ns.util.selectors
				 * @member ns.widget.mobile.ToggleSwitchExtra
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors,
				DOMUtils = ns.util.DOM,

				classes = {
					//slider
					sliderSwitch: "ui-slider-switch",
					toggleInneroffset: "ui-slider-inneroffset",
					sliderInline: "ui-slider-inline",
					sliderMini: "ui-slider-mini",
					sliderHandle: "ui-slider-handle",
					flipHandle: "ui-flip-handle",
					slider: "ui-slider",
					sliderLabel: "ui-slider-label",
					sliderLabelTheme: "ui-slider-label-",
					sliderInneroffset: "ui-slider-inneroffset",
					sliderLabelA: "ui-slider-label-a",
					sliderSnapping: "ui-slider-handle-snapping",
					//sliderBg: "ui-slider-bg",
					sliderContainer: "ui-slider-container",
					sliderStateActive: "ui-state-active"
				},
				keyCode = {
					HOME: 36,
					END: 35,
					PAGE_UP: 33,
					PAGE_DOWN: 34,
					UP: 38,
					RIGHT: 39,
					DOWN: 40,
					LEFT: 37
				};

			ToggleSwitchExtra.prototype = new BaseWidget();

			/**
			 * Dictionary for ToggleSwitchExtra related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 * @static
			 * @readonly
			 */
			ToggleSwitchExtra.classes = classes;

			/**
			 * Dictionary for keyboard codes
			 * @property {Object} keyCode
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 * @static
			 * @readonly
			 */
			ToggleSwitchExtra.keyCode = keyCode;


			//for select
			/**
			 * Returns default position of the slider, if the element is input
			 * @method getInitialValue
			 * @param {string} tag
			 * @param {HTMLElement} element
			 * @return {number}
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function getInitialValue(tag, element) {
				return element.selectedIndex;
			}

			/**
			 * Sets the width for labels which represents a value of widget
			 * @method refreshLabels
			 * @param {ns.widget.mobile.ToggleSwitchExtra} self
			 * @param {number} percent
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function refreshLabels(self, percent) {
				var getElementWidth = DOMUtils.getElementWidth,
					handlePercent = getElementWidth(self._ui.handle, "outer") /
						getElementWidth(self._ui.slider, "outer") * 100,
					aPercent = percent && handlePercent + (100 - handlePercent) *
						percent / 100,
					bPercent = percent === 100 ? 0 : Math.min(handlePercent +
						100 - aPercent, 100),
					i = self._labels.length,
					label;

				while (i--) {
					label = self._labels[i];
					label.style.width =
						(label.classList.contains(classes.sliderLabelA) ?
							aPercent : bPercent) + "%";
				}
			}


			/**
			 * Simplify creating dom elements
			 * (method strictly for ToggleSwitchExtra based oninput tag)
			 * @method createElement
			 * @param {string} name
			 * @return {HTMLElement}
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function createElement(name) {
				return document.createElement(name);
			}

			/**
			 * Function fires on mouse move event
			 * @method onVmouseMove
			 * @param {ns.widget.mobile.ToggleSwitchExtra} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function onVmouseMove(self, event) {
				var element = self.element,
					tagName = element.nodeName.toLowerCase(),
					handle = self._ui.handle;
				// NOTE: we don't do this in refresh because we still want to
				//	support programmatic alteration of disabled inputs

				if (self._dragging && !self.options.disabled) {

					// self.mouseMoved must be updated before refresh()
					// because it will be used in the control "change" event
					self._mouseMoved = true;

					if (tagName === "select") {
						// make the handle move in sync with the mouse
						handle.classList.remove(classes.sliderSnapping);
					}

					refresh(self, event);
					// only after refresh() you can calculate self.userModified
					self._userModified = self._beforeStart !==
						element.selectedIndex;
					events.preventDefault(event);
				}
			}

			/**
			 * Function fires on mouse move event
			 * @method sliderMouseUp
			 * @param {ns.widget.mobile.ToggleSwitchExtra} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function sliderMouseUp(self) {
				var _beforeStart;

				if (self._dragging) {
					self._dragging = false;
					_beforeStart = self._beforeStart;

					if (self.element.nodeName.toLowerCase() === "select") {
						// make the handle move with a smooth transition
						self._ui.handle.classList.add(classes.sliderSnapping);

						if (self._mouseMoved) {
							// this is a drag, change the value only
							// if user dragged enough
							if (self._userModified) {
								refresh(self, _beforeStart === 0 ? 1 : 0);
							} else {
								refresh(self, _beforeStart);
							}
						} else {
							refresh(self, _beforeStart === 0 ? 1 : 0);
						}
					}
					self._mouseMoved = false;
				}
			}

			/**
			 * Call refresh when state change
			 * @method onFocus
			 * @param {ns.widget.mobile.ToggleSwitchExtra} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function onChange(self) {
				if (!self._mouseMoved) {
					refresh(self, self._getValue(), true);
				}
			}

			/**
			 * Call refresh when blur event occur
			 * @method onBlur
			 * @param {ns.widget.mobile.ToggleSwitchExtra} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function onBlur(self) {
				refresh(self, self._getValue(), true);
			}

			/**
			 * Triggers focus event on the target element
			 * @method onVmousedown
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function onVmousedown(event) {
				events.trigger(event.target, "focus");
			}

			/**
			 * Stopping event
			 * @method onVclick
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function onVclick(event) {
				event.stopPropagation();
				event.preventDefault();
			}

			/**
			 * Manage interaction of widget with key down events
			 * @method onKeydown
			 * @param {ns.widget.mobile.ToggleSwitchExtra} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function onKeydown(self, event) {
				var element = self.element,
					tagName = element.nodeName.toLowerCase(),
					index = getInitialValue(tagName, element),
					eventKeyCode = event.keyCode,
					classList = event.target.classList,
					step = parseFloat(self.element.getAttribute("step") ||
						1);

				if (self.options.disabled) {
					return;
				}

				// In all cases prevent the default and mark the handle
				// as active
				switch (eventKeyCode) {
					case keyCode.HOME:
					case keyCode.END:
					case keyCode.PAGE_UP:
					case keyCode.PAGE_DOWN:
					case keyCode.UP:
					case keyCode.RIGHT:
					case keyCode.DOWN:
					case keyCode.LEFT:
						event.preventDefault();
						if (!self._keySliding) {
							self._keySliding = true;
							classList.add(classes.sliderStateActive);
						}
						break;
				}
				// move the slider according to the keypress
				switch (eventKeyCode) {
					case keyCode.HOME:
					case keyCode.PAGE_UP:
					case keyCode.UP:
					case keyCode.RIGHT:
						refresh(self, index + step);
						break;
					case keyCode.END:
					case keyCode.PAGE_DOWN:
					case keyCode.DOWN:
					case keyCode.LEFT:
						refresh(self, index - step);
						break;
				}

			}

			/**
			 * Remove slider state active
			 * @method onKeyup
			 * @param {ns.widget.mobile.ToggleSwitchExtra} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function onKeyupHandle(self) {
				if (self._keySliding) {
					self._keySliding = false;
					self._ui.handle.classList.remove(classes.sliderStateActive);
				}
			}

			/**
			 * Call refresh when keyUp event occur
			 * @method onKeyup
			 * @param {ns.widget.mobile.ToggleSwitchExtra} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function onKeyupElement(self) {
				refresh(self, self._getValue(), true, true);
			}

			/**
			 * Refresh widget and add css class
			 * @method onTouchend
			 * @param {ns.widget.mobile.ToggleSwitchExtra} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function onTouchend(self) {
				var element = self.element,
					tagName = element.nodeName.toLowerCase();

				self._dragging = false;
				self._ui.handle.classList.add(classes.sliderSnapping);
				refresh(self, getInitialValue(tagName, element),
					true, true);
			}

			/**
			 * Callback responsible for refreshing the widget
			 * @method onVmousedown
			 * @param {ns.widget.mobile.ToggleSwitchExtra} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function onVmousedownRefresh(self, event) {
				var element = self.element;

				if (self.options.disabled) {
					return false;
				}

				self._dragging = true;
				self._userModified = false;
				self._mouseMoved = false;
				//element.nodeName.toLowerCase()
				if (element.nodeName.toLowerCase() === "select") {
					self._beforeStart = element.selectedIndex;
				}
				refresh(self, event);
				return false;
			}

			/**
			 * Adding widget object to the callbacks
			 * @method bindCallbacksForSelectTag
			 * @param {ns.widget.mobile.ToggleSwitchExtra} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function bindCallbacksForSelectTag(self) {
				self._onKeyupElement = onKeyupElement.bind(null, self);
				self._sliderMouseUp = sliderMouseUp.bind(null, self);
				self._onKeyupHandle = onKeyupHandle.bind(null, self);
				self._onVmouseMove = onVmouseMove.bind(null, self);
				self._onTouchend = onTouchend.bind(null, self);
				self._onKeydown = onKeydown.bind(null, self);
				self._onChange = onChange.bind(null, self);
				self._onBlur = onBlur.bind(null, self);
				self._onVmousedownRefresh =
					onVmousedownRefresh.bind(null, self);
			}

			/**
			 * Sets the width for labels which represents a value of widget
			 * @method addRemoveClassesBasedOnProcentage
			 * @param {number} percent
			 * @param {classList} localClasses
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function addRemoveClassesBasedOnProcentage(percent, localClasses) {
				if (percent === 100 &&
					localClasses.contains(classes.sliderSnapping)) {
					localClasses.remove(classes.toggleOff);
					localClasses.add(classes.toggleOn);
				} else if (percent === 0 &&
					localClasses.contains(classes.sliderSnapping)) {
					localClasses.remove(classes.toggleOn);
					localClasses.add(classes.toggleOff);
				}
			}

			/**
			 * Refresh all the elements of Slider widget
			 * @method refresh
			 * @param {ns.widget.mobile.ToggleSwitchExtra} self
			 * @param {Object|number|null} value
			 * @param {boolean} [isFromControl] tells if the refresh was called from callbacks
			 * @param {boolean} [preventInputUpdate] prevents change value for input
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function refresh(self, value, isFromControl, preventInputUpdate) {
				var data,
					percent,
					newValue,
					valModStep,
					alignValue,
					valueChanged,
					touchThreshold,
					newValueOption,
					sliderOffsetLeft,
					min = 0,
					control = self.element,
					handle = self._ui.handle,
					slider = self._ui.slider,
					localClasses = handle.classList,
					tagName = control.nodeName.toLowerCase(),
					max = control.querySelectorAll("option").length - 1,
					stepValue = DOMUtils.getNumberFromAttribute(control,
						"step", "float", 0),
					step = (stepValue > 0) ?
						stepValue : 1;

				if (isNaN(step)) {
					step = 0;
				}

				if (self.options.disabled) {
					self._disable();
				}

				// If changes came from event
				if (typeof value === "object") {
					data = value;
					// @TODO take parameter out to config
					touchThreshold = 8;
					sliderOffsetLeft =
						DOMUtils.getElementOffset(slider).left;

					// If refreshing while not dragging
					// or movement was within threshold
					if (!self._dragging ||
						data.pageX < sliderOffsetLeft - touchThreshold ||
						data.pageX > sliderOffsetLeft +
						slider.offsetWidth + touchThreshold) {
						return;
					}

					// Calculate new left side percent
					percent = ((data.pageX - sliderOffsetLeft) /
						slider.offsetWidth) * 100;

					// If changes came from input value change
				} else {
					if (value === null) {
						value = getInitialValue(tagName, control);
					}
					if (isNaN(value)) {
						return;
					}
					// While dragging prevent jumping by assigning
					// last percentage value
					if (self._dragging && self._lastPercent) {
						percent = self._lastPercent;
					} else {
						percent = (parseFloat(value) - min) / (max - min) * 100;
					}
				}

				// Make sure percent is a value between 0 - 100;
				percent = Math.max(0, Math.min(percent, 100));
				self._lastPercent = percent;

				newValue = (percent / 100) * (max - min) + min;

				//from jQuery UI slider, the following source will round
				// to the nearest step
				valModStep = (newValue - min) % step;
				alignValue = newValue - valModStep;

				if (Math.abs(valModStep) * 2 >= step) {
					alignValue += (valModStep > 0) ? step : (-step);
				}
				// Since JavaScript has problems with large floats, round
				// the final value to 5 digits after the decimal point
				// (see jQueryUI: #4124)
				newValue = parseFloat(alignValue.toFixed(5));

				newValue = Math.max(min, Math.min(newValue, max));

				handle.style.left = percent + "%";
				newValueOption = control.querySelectorAll("option")[newValue];
				handle.setAttribute("aria-valuenow",
					newValueOption && newValueOption.value);
				handle.setAttribute("aria-valuetext",
					newValueOption.innerText);
				handle.setAttribute("title", newValueOption.innerText);

				addRemoveClassesBasedOnProcentage(percent, localClasses);

				// drag the label widths
				if (self._labels) {
					refreshLabels(self, percent);
				}

				if (!preventInputUpdate) {
					valueChanged = false;
					// update control"s value

					valueChanged = control.selectedIndex !== newValue;
					control.selectedIndex = newValue;

					if (!isFromControl && valueChanged) {
						// Trigger change event on the control element
						events.trigger(control, "change");
					}
				}
			}

			/**
			 * Refresh a slider markup.
			 *
			 * This method will rebuild while DOM structure of widget.
			 *
			 * This method should be called after are manually change in HTML
			 * attributes of widget DOM structure.
			 *
			 * This method is called automatically after change any option
			 * of widget.
			 *
			 *        @example
			 *        <select id="slider" name="flip-11" data-role="slider">
			 *            <option value="off"></option>
			 *            <option value="on"></option>
			 *        </select>
			 *        <script>
			 *            var slider = document.getElementById("slider"),
			 *                  sliderWidget = tau.widget.Slider(slider),
			 *            sliderWidget.refresh();
			 *        </script>
			 *
			 * ####If jQuery library is loaded, its method can be used:
			 *
			 *        @example
			 *        <select id="slider" name="flip-11" data-role="slider">
			 *            <option value="off"></option>
			 *            <option value="on"></option>
			 *        </select>
			 *        <script>
			 *            $( "#slider" ).slider( "refresh" );
			 *        </script>
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */

			/**
			 * Refresh slider
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			ToggleSwitchExtra.prototype._refresh = function () {
				var self = this;

				if (self._ui.slider && self.value !== self._getValue()) {
					refresh(self, self._getValue());
				}
			};


			/**
			 * Adding classes for slider
			 * @method addClassesForSlider
			 * @param {HTMLElement} domSlider
			 * @param {Object} btnClasses
			 * @param {Object} options
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function addClassesForSlider(domSlider, btnClasses, options) {
				var domSliderClassList = domSlider.classList;

				domSliderClassList.add(classes.slider);
				domSliderClassList.add(classes.sliderSwitch);
				domSliderClassList.add(btnClasses.uiBtnCornerAll);

				if (options.inline) {
					domSliderClassList.add(classes.sliderInline);
				}
				if (options.mini) {
					domSliderClassList.add(classes.sliderMini);
				}
			}

			/**
			 * Simplify creating dom elements
			 * @method buildOptions
			 * @param {HTMLElement} element
			 * @param {Object} btnClasses
			 * @param {HTMLElement} domSlider
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function buildOptions(element, btnClasses, domSlider) {
				var i,
					side,
					sliderImg,
					sliderImgClassList = null;

				for (i = 0; i < element.length; i++) {
					side = i ? "a" : "b";

					/* TODO - check slider label */
					sliderImg = createElement("span");
					sliderImgClassList = sliderImg.classList;
					sliderImgClassList.add(classes.sliderLabel);
					sliderImgClassList.add(classes.sliderLabelTheme + side);
					if (i) {
						sliderImgClassList.add(btnClasses.uiBtnActive);
					}
					sliderImgClassList.add(btnClasses.uiBtnCornerAll);

					sliderImg.setAttribute("role", "img");
					sliderImg.appendChild(document.createTextNode(element[i].innerHTML));
					domSlider.insertBefore(sliderImg, domSlider.firstChild);
				}
			}

			/**
			 * Creates wrapper for slider
			 * @method createWrapper
			 * @param {HTMLElement} domSlider
			 * @return {HTMLElement}
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function createWrapper(domSlider) {
				var wrapper,
					domSliderChildNode = domSlider.childNodes,
					i,
					length;

				wrapper = createElement("div");
				wrapper.className = classes.sliderInneroffset;

				for (i = 0, length = domSliderChildNode.length; i < length; i++) {
					wrapper.appendChild(domSliderChildNode[i]);
				}
				return wrapper;
			}

			/**
			 * Build Slider based on Select Tag
			 * @method buildSliderBasedOnSelectTag
			 * @param {ns.widget.mobile.ToggleSwitchExtra} self
			 * @param {HTMLElement} element
			 * @param {HTMLElement} sliderContainer
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function buildSliderBasedOnSelectTag(self, element, sliderContainer) {
				var domSlider = createElement("div"),
					options = self.options,
					elementId = element.getAttribute("id"),
					btnClasses = Button.classes,
					domHandle = createElement("a");

				ns.warn("Please use input[data-role='toggleswitch'] " +
					"selector in order to define button like " +
					"toggle, or select[data-role='toggleswitch']. " +
					"select[data-role='slider'] is deprecated");

				domSlider.setAttribute("id", elementId + "-slider");

				addClassesForSlider(domSlider, btnClasses, options);

				domHandle.className = classes.sliderHandle;
				domSlider.appendChild(domHandle);
				domHandle.setAttribute("id", elementId + "-handle");

				domSlider.appendChild(createWrapper(domSlider));
				// make the handle move with a smooth transition
				domHandle.classList.add(classes.sliderSnapping);
				buildOptions(element, btnClasses, domSlider);
				// to make a difference between slider and flip type toggle
				domHandle.classList.add(classes.flipHandle);

				sliderContainer = domSlider;
				element.classList.add(classes.sliderSwitch);
				domHandle.style.right = "auto";
				domHandle.style.top = 0;
				element.parentNode.insertBefore(sliderContainer,
					element.nextSibling);
			}

			/**
			 * Build ToggleSwitchExtra
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			ToggleSwitchExtra.prototype._build = function (element) {
				var sliderContainer = createElement("div");

				//hide select
				element.className = classes.sliderSwitch;

				buildSliderBasedOnSelectTag(this, element, sliderContainer);

				return element;
			};

			/**
			 * Inits widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 * @instance
			 */
			ToggleSwitchExtra.prototype._init = function (element) {
				var elementId,
					self = this;

				elementId = element.id;
				self._ui.slider = document.getElementById(elementId +
					"-slider");
				self._ui.handle = document.getElementById(elementId +
					"-handle");
				self._ui.container = document.getElementById(elementId +
						"-container") || element;
				self._type = element.tagName.toLowerCase();
				self._labels = selectors.getChildrenByClass(self._ui.slider,
					ToggleSwitchExtra.classes.sliderLabel);
				refresh(self, self._getValue());

			};

			/**
			 * Enable the slider
			 *
			 * Method removes disabled attribute on slider and changes look
			 * of slider to enabled state.
			 *
			 *        @example
			 *        <select id="slider" name="flip-11" data-role="slider">
			 *            <option value="off"></option>
			 *            <option value="on"></option>
			 *        </select>
			 *        <script>
			 *            var slider = document.getElementById("slider"),
			 *                  sliderWidget = tau.widget.Slider(slider),
			 *            sliderWidget.enable();
			 *        </script>
			 *
			 * ####If jQuery library is loaded, its method can be used:
			 *
			 *        @example
			 *        <select id="slider" name="flip-11" data-role="slider">
			 *            <option value="off"></option>
			 *            <option value="on"></option>
			 *        </select>
			 *        <script>
			 *            $( "#slider" ).slider( "enable" );
			 *        </script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */

			/**
			 * Enable slider
			 * @method _enable
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			ToggleSwitchExtra.prototype._enable = function (element) {
				var btnClasses = Button.classes,
					self = this,
					slider = self._ui.slider;

				if (slider) {
					element.removeAttribute("disabled");
					slider.classList.remove(btnClasses.uiDisabled);
					slider.setAttribute("aria-disabled", false);
					self.options.disabled = false;
				}
			};

			/**
			 * Disable the slider
			 *
			 * Method sets disabled attribute on slider and changes look
			 * of slider to disabled state.
			 *
			 *        @example
			 *        <select id="slider" name="flip-11" data-role="slider">
			 *            <option value="off"></option>
			 *            <option value="on"></option>
			 *        </select>
			 *        <script>
			 *            var slider = document.getElementById("slider"),
			 *                sliderWidget = tau.widget.Slider(slider),
			 *            sliderWidget.disable();
			 *        </script>
			 *
			 * ####If jQuery library is loaded, its method can be used:
			 *
			 *        @example
			 *        <select id="slider" name="flip-11" data-role="slider">
			 *            <option value="off"></option>
			 *            <option value="on"></option>
			 *        </select>
			 *        <script>
			 *            $( "#slider" ).slider( "disable" );
			 *        </script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */

			/**
			 * Disable slider
			 * @method _disable
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			ToggleSwitchExtra.prototype._disable = function (element) {
				var self = this,
					btnClasses = Button.classes,
					slider = self._ui.slider;

				if (slider) {
					element.setAttribute("disabled", "disabled");
					slider.classList.add(btnClasses.uiDisabled);
					slider.setAttribute("aria-disabled", true);
					self.options.disabled = true;
				}
			};


			/**
			 * Binds events to widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 * @instance
			 */
			ToggleSwitchExtra.prototype._bindEvents = function () {
				var self = this,
					element = self.element,
					handle = self._ui.handle,
					slider = self._ui.slider;

				bindCallbacksForSelectTag(self);

				element.addEventListener("keyup", self._onKeyupElement,
					false);
				element.addEventListener("change", self._onChange, false);
				element.addEventListener("blur", self._onBlur, false);

				handle.addEventListener("keyup", self._onKeyupHandle,
					false);
				handle.addEventListener("keydown", self._onKeydown, false);
				handle.addEventListener("vclick", onVclick, false);
				handle.addEventListener("vmousedown", onVmousedown,
					false);

				slider.addEventListener("vmousedown",
					self._onVmousedownRefresh, false);
				slider.addEventListener("vmousemove", self._onVmouseMove,
					false);
				slider.addEventListener("vmouseup", self._sliderMouseUp,
					false);

			};


			/**
			 * Get or Set value of the widget
			 *
			 * Return element value or set the value
			 *
			 *        @example
			 *        <select id="slider" name="flip-11" data-role="slider">
			 *            <option value="off"></option>
			 *            <option value="on"></option>
			 *        </select>
			 *        <script>
			 *            var slider = document.getElementById("slider"),
			 *                sliderWidget = tau.widget.Slider(slider),
			 *            // value contains index of select tag
			 *            value = sliderWidget.value();
			 *            //sets the index for the toggle
			 *            sliderWidget.value("1");
			 *        </script>
			 *
			 * ####If jQuery library is loaded, its method can be used:
			 *
			 *        @example
			 *        <select id="slider" name="flip-11" data-role="slider">
			 *            <option value="off"></option>
			 *            <option value="on"></option>
			 *        </select>
			 *        <script>
			 *            // value contains index of select tag
			 *            $( "#slider" ).slider( "value" );
			 *            // sets the index for the toggle
			 *            $( "#slider" ).slider( "value", "1" );
			 *        </script>
			 *
			 * @method value
			 * @return {string} In get mode return element value or element
			 * selected index based on tag name.
			 * @since 2.3
			 * @member ns.widget.mobile.ToggleSwitch
			 */


			/**
			 * Get value of toggle switch. If widget is based on input type
			 * tag otherwise it return index of the element
			 * @method _getValue
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			ToggleSwitchExtra.prototype._getValue = function () {
				var self = this,
					element = self.element;

				return element.selectedIndex;
			};

			/**
			 * Set value of toggle switch
			 * @method _setValue
			 * @param {string} value
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			ToggleSwitchExtra.prototype._setValue = function (value) {
				var self = this,
					element = self.element;

				element.selectedIndex = value;
			};

			/**
			 * remove attributes when destroyed
			 * @method removeAttributesWhenDestroy
			 * @param {HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function removeAttributesWhenDestroy(element) {
				element.removeAttribute("data-tau-name");
				element.removeAttribute("aria-disabled");
				element.removeAttribute("data-tau-bound");
				element.removeAttribute("data-tau-built");
			}

			/**
			 * Remove events from Slider which is based on Select Tag
			 * @method removeEventsFromToggleBasedOnSelect
			 * @param {ns.widget.mobile.ToggleSwitchExtra} self
			 * @param {HTMLElement} element
			 * @param {HTMLElement} handle
			 * @param {HTMLElement} slider
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			function removeEventsFromToggleBasedOnSelect(self, element, handle, slider) {
				element.removeEventListener("change", self._onChange,
					false);
				element.removeEventListener("keyup", self._onKeyupElement, false);
				element.removeEventListener("blur", self._onBlur, false);

				handle.removeEventListener("vmousedown", self._onVmousedown,
					false);
				handle.removeEventListener("vclick", self.onVclick, false);
				handle.removeEventListener("keydown", self._onKeydown, false);
				handle.removeEventListener("keyup", self._onKeyupHandle, false);

				slider.removeEventListener("vmousedown",
					self._onVmousedownRefresh, false);
				slider.removeEventListener("vmousemove", self._onVmouseMove,
					false);
				slider.removeEventListener("vmouseup", self._sliderMouseUp,
					false);
			}

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitchExtra
			 */
			ToggleSwitchExtra.prototype._destroy = function () {
				var self = this,
					element = self.element,
					handle = self._ui.handle,
					slider = self._ui.slider;

				removeEventsFromToggleBasedOnSelect(self, element, handle, slider);

				removeAttributesWhenDestroy(element);
				element.classList.remove(classes.sliderSwitch);
				element.parentElement.removeChild(element.nextElementSibling);

				events.trigger(document, "destroyed", {
					widget: "ToggleSwitchExtra",
					parent: element.parentNode
				});
			};


			ns.widget.mobile.ToggleSwitchExtra = ToggleSwitchExtra;
			engine.defineWidget(
				"ToggleSwitchExtra",
				"select[data-role='slider']",
				[],
				ToggleSwitchExtra,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.ToggleSwitchExtra;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
