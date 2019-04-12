/*global window, define, ns */
/*
* Copyright (c) 2019 Samsung Electronics Co., Ltd
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
/* #Interactive 3D
* Interactive 3D widget is using the r-type library to show 3D model.
* It is included at the libs folder. If you want to use the Interactive 3D,
* you have to add the r-type library in your project.
*
* <script src="tau/libs/r-type.min.js></script>"
*
* @example
* <div class="ui-i3d"></div>
*
* @since 5.5
* @class ns.widget.core.Interactive3D
* @extends ns.widget.BaseWidget
* @authore Hunseop Jeong <hs85.jeong@samsung.com>
*/
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				Interactive3D = function () {
					this._ui = {};
				},
				allowAttributes = [
					"width", "height", "position", "scale", "rotation", "controls",
					"autoplay", "light", "src", "show", "hide", "mtl"
				],
				prototype = new BaseWidget();

			Interactive3D.prototype = prototype;

			/**
			* Init widget
			* @method _init
			* @param {HTMLElement} element
			* @return {HTMLElement} Returns built element
			* @member ns.widget.core.Interactive3D
			* @protected
			*/
			prototype._init = function (element) {
				var self = this;

				self.observer = new MutationObserver(self._attributeChange.bind(this));
				self.observer.observe(element, {attributes: true});

				return element;
			}

			/**
			* Observe whether the attribute changes
			* @method _attributeChange
			* @param {Object[]} mutationList
			* @member ns.widget.core.Interactive3D
			* @protected
			*/
			prototype._attributeChange = function (mutationList) {
				var self = this;

				mutationList.forEach(function (mutation) {
					var attributeName = mutation.attributeName,
						target;

					if (allowAttributes.indexOf(attributeName) !== -1) {
						target = mutation.target;

						if (target.hasAttribute(attributeName)) {
							self._ui.rType.setAttribute(attributeName, target.attributes[attributeName].value);
						} else {
							self._ui.rType.removeAttribute(attributeName);
						}
					}
				});
			};

			/**
			* Build widget structure
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement} Returns built element
			* @member ns.widget.core.Interactive3D
			* @protected
			*/
			prototype._build = function (element) {
				var rType = document.createElement("r-type"),
					attributes = element.attributes,
					i;

				for (i = 0; i < attributes.length; i++) {
					if (allowAttributes.indexOf(attributes[i].name) !== -1) {
						rType.setAttribute(attributes[i].name, attributes[i].value);
					}
				}

				this._ui.rType = rType;
				element.appendChild(rType);

				return element;
			};

			/**
			* Destroys Interactive 3D widget
			* @method _destroy
			* @member ns.widget.core.Interactive3D
			* @protected
			*/
			prototype._destroy = function () {
				var self = this,
					ui = self._ui,
					rType = ui.rType;

				if (rType && rType.parentNode) {
					rType.parentNode.removeChild(rType);
				}

				this.observer.disconnect();
			};

			ns.widget.core.Interactive3D = Interactive3D;

			engine.defineWidget(
				"Interactive3D",
				".ui-i3d",
				[],
				Interactive3D,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Interactive3D;
		}
	);
	//>>excludeEnd("tauBuildExclude")
}(window, window.document, ns));
