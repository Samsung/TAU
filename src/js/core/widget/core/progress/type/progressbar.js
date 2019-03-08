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
 * #progressBar Type
 * progressBar type support for Progress widget.
 * @internal
 * @class ns.widget.core.progress.type.progressbar
 * @extends ns.widget.core.progress.type.interface
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../type",
			"./interface",
			"../Progress",
			"../../../../../core/util/object",
			"../../../../../core/event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.util.object,
				type = ns.widget.core.progress.type,
				typeInterface = type.interface,

				classes = {
					uiProgressbar: "ui-progress-bar",
					uiProgressbarValue: "ui-progress-bar-value",
					uiProgressbarDecorator: "ui-progress-bar-decorator"
				},

				createAnimationFrame = function (duration, call1, call2, call3) {
					return [
						{
							start: 0,
							end: 800,
							callback: function (t, end) {
								call1.call(this, t, end);
							}
						},
						{
							start: 800,
							end: 1350,
							callback: function (t, end) {
								call2.call(this, t, end);
							}
						},
						{
							start: 1550,
							end: 1850,
							callback: function (t, end) {
								call3.call(this, t, end);
							}
						}
					];
				};

			function setAriaValues(element, options) {
				//set Aria value
				element.setAttribute("aria-valuenow", options.value);
				element.setAttribute("aria-valuemin", options.min);
				element.setAttribute("aria-valuemax", options.max);
			}

			function paintProgressStyle(progress) {
				var ui = progress._ui,
					options = progress.options,
					element = progress.element,
					elementHeightPercentValue = (element.offsetHeight * 100) / element.offsetWidth,
					percentValue = (options.value * 100) / (options.max - options.min);

				ui.progressBarValueElement.style.width = percentValue + "%";
				ui.progressBarDecoratorElement.style.width = elementHeightPercentValue + "%";
				ui.progressBarDecoratorElement.style.left = (percentValue - elementHeightPercentValue) + "%";
			}

			type.bar = utilsObject.merge({}, typeInterface, {
				build: function (progress, element) {
					var ui = {},
						progressBarValueElement,
						progressBarDecoratorElement;

					element.classList.add(classes.uiProgressbar);

					progressBarValueElement = document.createElement("div");
					progressBarValueElement.classList.add(classes.uiProgressbarValue);
					progressBarDecoratorElement = document.createElement("div");
					progressBarDecoratorElement.classList.add(classes.uiProgressbarDecorator);

					element.appendChild(progressBarValueElement);
					element.appendChild(progressBarDecoratorElement);

					ui.progressBarValueElement = progressBarValueElement;
					ui.progressBarDecoratorElement = progressBarDecoratorElement;

					progress._ui = ui;
					return element;
				},

				init: function (progress, element) {
					var ui = progress._ui,
						options = progress.options;

					ui.progressBarValueElement = ui.progressBarValueElement || element.querySelector("." + classes.uiProgressbarValue);
					ui.progressBarDecoratorElement = ui.progressBarDecoratorElement || element.querySelector("." + classes.progressBarDecoratorElement);

					ui.progressBarDecoratorElement.style.left = 0;

					setAriaValues(element, options);
					paintProgressStyle(progress);
				},

				refresh: function (progress) {
					setAriaValues(progress.element, progress.options);
					paintProgressStyle(progress);
				},

				changeValue: function (progress, oldValue, newValue) {
					var duration = 1850,
						element = progress.element,
						valueElement = progress._ui.progressBarValueElement,
						decoElement = progress._ui.progressBarDecoratorElement,
						decoElementOldLeft = parseFloat(decoElement.style.left),
						decoElementOldWidth = (decoElement.offsetWidth * 100) / element.offsetWidth,
						elementHeightPercentValue = (element.offsetHeight * 100) / element.offsetWidth,
						oldPercentValue = (oldValue * 100) / (progress.options.max - progress.options.min),
						newPercentValue = (newValue * 100) / (progress.options.max - progress.options.min),
						animationFrames;

					if (!progress._isAnimating) {
						decoElement.style.opacity = 1;
						animationFrames = createAnimationFrame(duration, function (t, end) {
							valueElement.style.width = oldPercentValue + ((newPercentValue - oldPercentValue) * t / end) + "%";
							if (newValue > oldValue) {
								decoElement.style.width = decoElementOldWidth + ((newPercentValue - oldPercentValue) * t / end) + "%";
							} else {
								decoElement.style.width = decoElementOldWidth + ((oldPercentValue - newPercentValue) * t / end) + "%";
								decoElement.style.left = oldPercentValue - parseFloat(decoElement.style.width) + "%";
								decoElementOldLeft = parseFloat(decoElement.style.left);
							}
						}, function (t, end) {
							if (newValue > oldValue) {
								decoElement.style.left = decoElementOldLeft + ((newPercentValue - decoElementOldLeft - elementHeightPercentValue) * t / end) + "%";
								decoElement.style.width = (decoElementOldWidth + newPercentValue - oldPercentValue) - ((decoElementOldWidth + newPercentValue - oldPercentValue - elementHeightPercentValue) * t / end) + "%";
							} else {
								decoElement.style.width = (decoElementOldWidth + (oldPercentValue - newPercentValue)) - ((oldPercentValue - newPercentValue) * t / end) + "%";
							}
						}, function (t, end) {
							if (newValue >= progress.options.max) {
								decoElement.style.opacity = 1 - t / end;
							}
						});
						progress._animate(duration, function (t) {
							animationFrames.forEach(function (animation) {
								if (t >= animation.start && t <= animation.end) {
									animation.callback(t - animation.start, animation.end - animation.start);
								} else if (t > animation.end) {
									animation.callback(1, 1);
								}
							});
						}, function () {
							if (progress.options.value !== newValue) {
								type.bar.changeValue(progress, newValue, progress.options.value);
							}
						});
					}
				}
			});
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
