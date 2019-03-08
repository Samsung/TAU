/*global window, ns, define */
/*jslint nomen: true */
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
/**
 * #Legacy slider is provided this extra js file.
 *
 * @class ns.widget.mobile.Slider
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/widget/core/Slider",
			"../../../core/util/object",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile",
			"../../../profile/mobile/widget/mobile" // fetch namespace
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreSlider = ns.widget.core.Slider,
				engine = ns.engine,
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				object = ns.util.object,
				SliderExtra = function () {
					var self = this;

					CoreSlider.call(self);
					self.options = object.copy(CoreSlider.prototype.options);
				},
				classes = object.merge({}, CoreSlider.classes, {
					SLIDER: CoreSlider.classes.SLIDER,
					SLIDER_ICON: "ui-slider-icon",
					SLIDER_WITH_ICON: "ui-slider-with-icon",
					SLIDER_TEXT_LEFT: "ui-slider-text-left",
					SLIDER_TEXT_RIGHT: "ui-slider-text-right",
					SLIDER_WITH_TEXT_LEFT: "ui-slider-with-text-left",
					SLIDER_WITH_TEXT_RIGHT: "ui-slider-with-text-right"
				}),
				prototype = new BaseWidget();

			SliderExtra.prototype = prototype;

			prototype._configure = function (element) {
				var self = this,
					options = self.options;

				options.icon = null;
				options.innerLabel = false;
				options.popup = false;
				options.textLeft = null;
				options.textRight = null;
				return element;
			};

			prototype._build = function (element) {
				var self = this,
					slider;

				self._buildIcon(element);
				self._buildText(element);

				slider = ns.widget.Slider(element);
				self.options.popup ? slider.options.expand = true : slider.options.expand = false;

				slider.refresh();
				return element;
			};

			prototype._buildIcon = function (element) {
				var self = this,
					options = self.options,
					parentNode = element.parentNode,
					icon;

				if (options.icon && options.icon !== "text") {
					icon = document.createElement("div");
					icon.classList.add(classes.SLIDER_ICON);
					icon.classList.add("ui-icon-" + options.icon);
					parentNode.classList.add(classes.SLIDER_WITH_ICON);
					parentNode.appendChild(icon);
				}
			};
			prototype._buildText = function (element) {
				var self = this,
					options = self.options,
					parentNode = element.parentNode,
					textLeft,
					textRight;

				if (options.textLeft || options.textRight) {
					if (options.textLeft) {
						textLeft = document.createElement("div");
						textLeft.innerText = element.getAttribute("data-text-left");
						textLeft.classList.add(classes.SLIDER_TEXT_LEFT);
						parentNode.classList.add(classes.SLIDER_WITH_TEXT_LEFT);
						parentNode.appendChild(textLeft);
					}
					if (options.textRight) {
						textRight = document.createElement("div");
						textRight.innerText = element.getAttribute("data-text-right");
						textRight.classList.add(classes.SLIDER_TEXT_RIGHT);
						parentNode.classList.add(classes.SLIDER_WITH_TEXT_RIGHT);
						parentNode.appendChild(textRight);
					}
				}
			};

			ns.widget.mobile.SliderExtra = SliderExtra;
			engine.defineWidget(
				"SliderExtra",
				"input[data-role='slider'], input[type='range'], input[data-type='range']",
				[],
				SliderExtra,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.SliderExtra;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
