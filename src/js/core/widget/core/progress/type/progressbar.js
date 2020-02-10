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
					uiProgressbarValueBg: "ui-progress-bar-value-bg",
					uiProgressbarLabelsTop: "ui-progress-bar-labels-top",
					uiProgressbarLabelsBottom: "ui-progress-bar-labels-bottom",
					labelCurrentValue: "ui-progress-current-value",
					labelMinValue: "ui-progress-min-value",
					labelMaxValue: "ui-progress-max-value"
				},

				createAnimationFrame = function (duration, call1) {
					return [
						{
							start: 0,
							end: 800,
							callback: function (t, end) {
								call1.call(this, t, end);
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
					percentValue = (options.value * 100) / (options.max - options.min);

				ui.progressBarValueElement.style.width = percentValue + "%";
			}

			function updateLabels(progress) {
				var ui = progress._ui,
					options = progress.options;

				// update labels
				if (ui.labelCurrentValue) {
					ui.labelCurrentValue.textContent = options.value;
				}
				if (ui.labelMinValue) {
					ui.labelMinValue.textContent = options.min;
				}
				if (ui.labelMaxValue) {
					ui.labelMaxValue.textContent = options.max;
				}
			}

			type.bar = utilsObject.merge({}, typeInterface, {
				build: function (progress, element) {
					var ui = {},
						progressBarValueElement,
						progressBarValueBg,
						labelsTop,
						labelsBottom;

					element.classList.add(classes.uiProgressbar);

					progressBarValueElement = document.createElement("div");
					progressBarValueElement.classList.add(classes.uiProgressbarValue);
					progressBarValueBg = document.createElement("div");
					progressBarValueBg.classList.add(classes.uiProgressbarValueBg);
					labelsTop = document.createElement("div");
					labelsTop.classList.add(classes.uiProgressbarLabelsTop);
					labelsBottom = document.createElement("div");
					labelsBottom.classList.add(classes.uiProgressbarLabelsBottom);

					progressBarValueBg.appendChild(progressBarValueElement);
					element.appendChild(labelsTop);
					element.appendChild(progressBarValueBg);
					element.appendChild(labelsBottom);

					ui.progressBarValueElement = progressBarValueElement;
					ui.progressBarValueBg = progressBarValueBg;
					ui.labelsTop = labelsTop;
					ui.labelsBottom = labelsBottom;

					progress._ui = ui;
					return element;
				},

				init: function (progress, element) {
					var ui = progress._ui,
						options = progress.options,
						labelsTop = [],
						labelsBottom = [];

					// find labels and append to widget
					labelsTop = [].slice.call(
						element.querySelectorAll(".ui-progress-bar-label-right-top"));
					labelsBottom = [].slice.call(
						element.querySelectorAll(".ui-progress-bar-label-left-bottom, .ui-progress-bar-label-right-bottom")
						);
					// try to find labels from outside widget (old api)
					labelsTop = labelsTop.concat([].slice.call(
						element.parentElement.querySelectorAll(".ui-progress ~ .ui-progress-bar-label-right-top")));
					labelsBottom = labelsBottom.concat([].slice.call(
						element.parentElement.querySelectorAll(".ui-progress ~ .ui-progress-bar-label-left-bottom, .ui-progress ~ .ui-progress-bar-label-right-bottom")));

					labelsTop.forEach(function (label) {
						ui.labelsTop.appendChild(label);
					});
					labelsBottom.forEach(function (label) {
						ui.labelsBottom.appendChild(label);
					});

					ui.progressBarValueElement = ui.progressBarValueElement || element.querySelector("." + classes.uiProgressbarValue);

					// labels
					ui.labelCurrentValue = element.querySelector("." + classes.labelCurrentValue);
					ui.labelMinValue = element.querySelector("." + classes.labelMinValue);
					ui.labelMaxValue = element.querySelector("." + classes.labelMaxValue);

					setAriaValues(element, options);
					paintProgressStyle(progress);
					updateLabels(progress);
				},

				refresh: function (progress) {
					setAriaValues(progress.element, progress.options);
					paintProgressStyle(progress);
					updateLabels(progress);
				},

				changeValue: function (progress, oldValue, newValue) {
					var duration = 1850,
						valueElement = progress._ui.progressBarValueElement,
						oldPercentValue = (oldValue * 100) / (progress.options.max - progress.options.min),
						newPercentValue = (newValue * 100) / (progress.options.max - progress.options.min),
						animationFrames;

					if (!progress._isAnimating) {
						animationFrames = createAnimationFrame(duration, function (t, end) {
							valueElement.style.width = oldPercentValue + ((newPercentValue - oldPercentValue) * t / end) + "%";
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
					updateLabels(progress);
				},

				destroy: function (self, element) {
					var ui = self._ui;

					[].slice.call(ui.labelsTop.children).forEach(function (child) {
						element.appendChild(child);
					});
					[].slice.call(ui.labelsBottom.children).forEach(function (child) {
						element.appendChild(child);
					});

					ui.progressBarValueBg.parentElement.removeChild(ui.progressBarValueBg);
					ui.labelsTop.parentElement.removeChild(ui.labelsTop);
					ui.labelsBottom.parentElement.removeChild(ui.labelsBottom);
					return true;
				}
			});
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
