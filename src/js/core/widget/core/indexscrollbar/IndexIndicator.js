/*global define, ns, document, window */
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
 * #IndexIndicator widget
 * Class creates index indicator.
 *
 * @internal
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @class ns.widget.wearable.indexscrollbar.IndexIndicator
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../indexscrollbar",
			"../../../util/object",
			"../../../event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.util.object,
				events = ns.event;

			/**
			 * block 'unexpected bouncing effect' on indexscroller indicator.
			 * @param {Event} event
			 */
			function blockEvent(event) {
				event.preventDefault();
				event.stopPropagation();
			}

			function IndexIndicator(element, options) {
				this.element = element;
				this.options = utilsObject.merge(options, this._options, false);
				this.value = null;

				this._init();

				return this;
			}

			IndexIndicator.prototype = {
				_options: {
					className: "ui-indexscrollbar-indicator",
					selectedClass: "ui-selected",
					alignTo: "container",
					container: null
				},
				_init: function () {
					var self = this,
						options = self.options,
						element = self.element;

					element.className = options.className;
					element.innerHTML = "<span></span>";
					events.on(element, ["touchstart", "touchmove"], blockEvent, false);


					// Add to DOM tree
					options.referenceElement.parentNode.insertBefore(element, options.referenceElement);
					self.fitToContainer();
				},

				/**
				 * Fits size to container.
				 * @method fitToContainer
				 * @param {HTMLElement} alignTo align indicator position relative to particular element
				 * @member ns.widget.wearable.indexscrollbar.IndexIndicator
				 */
				fitToContainer: function (alignTo) {
					var self = this,
						element = self.element,
						style = element.style,
						options = self.options,
						container = options.container,
						containerRect = container.getBoundingClientRect();

					alignTo = alignTo || options.alignTo;

					style.width = containerRect.width + "px";
					if (alignTo === "container") {
						style.height = containerRect.height + "px";
					} else {
						style.height = (containerRect.height + containerRect.top) + "px";
					}


					style.top = ((alignTo === "container") ? containerRect.top : 0) + "px";
					style.left = containerRect.left + "px";
				},

				/**
				 * Sets value of widget.
				 * @method setValue
				 * @param {string} value
				 * @member ns.widget.wearable.indexscrollbar.IndexIndicator
				 */
				setValue: function (value) {
					var selected = "",
						remained = "";

					this.value = value;	// remember value
					value = value.toUpperCase();

					selected = value.substr(value.length - 1);
					remained = value.substr(0, value.length - 1);

					this.element.firstChild.innerHTML = "<span>" + remained + "</span><span class=\"ui-selected\">" +
						selected + "</span>";	// Set indicator text
				},

				/**
				 * Shows widget.
				 * @method show
				 * @member ns.widget.wearable.indexscrollbar.IndexIndicator
				 */
				show: function () {
					//this.element.style.visibility="visible";
					this.element.style.display = "block";
				},

				/**
				 * Hides widget.
				 * @method hide
				 * @member ns.widget.wearable.indexscrollbar.IndexIndicator
				 */
				hide: function () {
					this.element.style.display = "none";
				},

				/**
				 * Destroys widget.
				 * @method destroy
				 * @member ns.widget.wearable.indexscrollbar.IndexIndicator
				 */
				destroy: function () {
					var element = this.element;

					while (element.firstChild) {
						element.removeChild(element.firstChild);
					}
					events.off(element, ["touchstart", "touchmove"], blockEvent, false);
					this.element = null;	// unreference element

				}
			};
			ns.widget.core.indexscrollbar.IndexIndicator = IndexIndicator;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return IndexIndicator;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
