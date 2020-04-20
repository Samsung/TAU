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
 * #TextInput Widget
 *
 * @class ns.widget.wearable.TextInput
 * @since 4.0
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../wearable",
			"../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				utilEvent = ns.event,
				selectors = ns.util.selectors,

				TextInput = function () {
					var self = this;

					self._initialWindowHeight = null;
					self._hasFocus = false;
					self._isInputPaneVisible = false;
					self._ui = {};
				},

				prototype = new BaseWidget();

			TextInput.events = {};

			/**
			 * Build TextInput
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.TextInput
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					pane,
					page;

				page = selectors.getClosestByClass(element, "ui-page");
				if (page) {
					pane = selectors.getChildrenByClass(page, "ui-textinput-pane")[0];
					if (!pane) {
						pane = document.createElement("div");
						pane.classList.add("ui-textinput-pane")
						page.appendChild(pane);
					}
				}
				ui.page = page;
				ui.pane = pane;
				this._initialWindowHeight = window.innerHeight;

				return element;
			};

			prototype._init = function (element) {
				var self = this;

				self._hideInputPaneBound = self._hideInputPane.bind(self);
				self._windowResizeBound = self._onWindowResize.bind(self);
				self._onHWKeyBound = self._onHWKey.bind(self);
				return element;
			};

			prototype._bindEvents = function (element) {
				var self = this;

				utilEvent.on(element, "focus", self, true);
				utilEvent.on(element, "blur", self, true);
			};

			prototype._showInputPane = function () {
				var self = this,
					ui = self._ui,
					pane = ui.pane,
					element = self.element,
					inputElement = element.cloneNode(true);

				pane.appendChild(inputElement);

				pane.style.display = "block";
				self._isInputPaneVisible = true;

				inputElement.focus();

				if (inputElement.hasOwnProperty('selectionStart')) {
					inputElement.selectionStart = inputElement.value.length;
				}

				utilEvent.on(inputElement, "blur", self._hideInputPaneBound, true);
				utilEvent.on(window, "resize", self._windowResizeBound, true);
				utilEvent.on(window, "tizenhwkey", self._onHWKeyBound, true);
			};

			prototype._hideInputPane = function () {
				var self = this,
					ui = self._ui,
					pane = ui.pane,
					element = self.element,
					inputElement;

				if (self._isInputPaneVisible) {
					inputElement = pane.lastChild;
					element.value = inputElement.value;
					utilEvent.off(inputElement, "blur", self._hideInputPaneBound, true);
					pane.removeChild(inputElement);

					pane.style.display = "none";
					utilEvent.off(window, "resize", self._windowResizeBound, true);
					utilEvent.off(window, "tizenhwkey", self._onHWKeyBound, true);
					self._isInputPaneVisible = false;
				}
			};

			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "focus":
						self._onFocus(event);
						break;
					case "blur":
						self._onBlur(event);
						break;
				}
			};

			prototype._onFocus = function (event) {
				var self = this,
					element = self.element,
					currentValueLength = element.value.length;

				event.preventDefault();
				self.element.blur();
				if (!self._isInputPaneVisible) {
					self._showInputPane();
				}

				// setting caret position at the end
				if (element.hasOwnProperty('selectionStart')) {
					element.selectionStart = currentValueLength;
					element.selectionEnd = currentValueLength;	
				}
			};

			prototype._onWindowResize = function () {
				var self = this,
					currentWindowHeight = window.innerHeight;

				if (currentWindowHeight === self._initialWindowHeight) {
					if (self._isInputPaneVisible) {
						self._hideInputPane();
					}
				}
			};

			prototype._onBlur = function (event) {
				var self = this;

				event.preventDefault();
				if (self._isInputPaneVisible) {
					self._hideInputPane();
				}
			};

			prototype._onHWKey = function (event) {
				if (event.keyName === "back") {
					event.preventDefault();
					event.stopPropagation();
					this._hideInputPane();
				}
			}

			prototype.focus = function () {
				this.element.focus();
			};

			prototype.blur = function () {
				this.element.blur();
			}

			TextInput.prototype = prototype;
			ns.widget.wearable.TextInput = TextInput;

			engine.defineWidget(
				"TextInput",
				"input[type='text']" +
					", input[type='number']" +
					", input[type='password']" +
					", input[type='email']" +
					", input[type='url']" +
					", input[type='tel']" +
					", input[type='search']",
				[],
				TextInput,
				"wearable"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.wearable.TextInput;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
