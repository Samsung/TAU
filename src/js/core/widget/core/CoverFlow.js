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
/*
 * #CoverFlow
 * Cover flow widget is using the jQuery.Flipster library for cover flow
 * effect.
 * It is included at the libs folder. If you want to use the CoverFlow,
 * you have to add the jQuery.Flipster library in your project after jQuery.
 *
 * <script src="tau/mobile/js/jquery.min.js"></script>
 * <script src="tau/libs/jquery.flipster.min.js></script>"
 *
 * @example
 * <div class="ui-coverflow"></div>
 *
 * @since 5.5
 * @class ns.widget.core.CoverFlow
 * @extends ns.widget.BaseWidget
 * @author Dohyung Lim <delight.lim@samsung.com>
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
			var utilsObject = ns.util.object,

				CoverFlow = function () {
					this.options = utilsObject.merge({}, CoverFlow.defaults);
					this.observer = null;
				},

				defaults = { value: "coverflow" },

				BaseWidget = ns.widget.BaseWidget,
				prototype = new BaseWidget();

			CoverFlow.prototype = prototype;
			CoverFlow.defaults = defaults;

			prototype._init = function (element) {
				var self = this;

				if (!element.getAttribute("value")) {
					element.setAttribute("value", self.options.value);
				}

				self.observer = new MutationObserver(self._checkEffectChange.bind(this));
				self.observer.observe(element, {attributes: true});

				return element;
			};

			prototype._checkEffectChange = function (mutationsList) {
				mutationsList.forEach(function (mutation) {
					if (mutation.attributeName === "data-effect" && this.element.getAttribute("data-effect")) {
						this.options.value = this.element.getAttribute("data-effect");
						this._refresh();
					}
				}.bind(this));
			};

			prototype._refresh = function () {
				var self = this;

				self._setValue(self.options.value);
			}

			prototype._setValue = function (value) {
				this.ui = {};
				this.ui.$element = window.jQuery(this.element).flipster({
					style: value,
					spacing: -0.5
				});
			}

			prototype._build = function (element) {
				if (element.getAttribute("data-effect")) {
					this.options.value = element.getAttribute("data-effect");
				}

				this.ui = {};
				if (window.jQuery && typeof window.jQuery.fn.flipster === "function") {
					this.ui.$element = window.jQuery(element).flipster({
						style: this.options.value,
						spacing: -0.5
					});
				} else {
					ns.warn("JQuery or flipster.js not exists");
				}
				return element;
			};

			prototype._destroy = function () {
				this.observer.disconnect();
			}

			ns.engine.defineWidget(
				"CoverFlow",
				".ui-coverflow",
				[],
				CoverFlow,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.CoverFlow;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
