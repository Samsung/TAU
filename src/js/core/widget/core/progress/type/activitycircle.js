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
 * #activityCircle Type
 * activityCircle type support for Progress widget.
 * @internal
 * @class ns.widget.core.progress.type.activitycircle
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
			"../../../../../core/util/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.util.object,
				type = ns.widget.core.progress.type,
				typeInterface = type.interface,
				classes = {
					uiActivityCircle: "ui-activity-circle",
					uiActivityCircleSmall: "ui-activity-circle-small",
					uiActivityCircleMedium: "ui-activity-circle-medium",
					uiActivityCircleLarge: "ui-activity-circle-large",
					uiActivityCircle1: "ui-activity-circle1",
					uiActivityCircle2: "ui-activity-circle2",
					uiActivityCircle3: "ui-activity-circle3",
					uiCircle1Svg: "ui-circle1-svg",
					uiCircle2Svg: "ui-circle2-svg",
					uiCircle3Svg: "ui-circle3-svg",
					uiCircle1In: "ui-circle1-in",
					uiCircle2In: "ui-circle2-in",
					uiCircle3In: "ui-circle3-in"
				};

			function setSVGInnerAttribute(ui) {
				ui.animationCircle1SVGElement.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
				ui.animationCircle2SVGElement.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
				ui.animationCircle3SVGElement.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
				ui.animationCircle1SVGElement.setAttribute("viewBox", "0 0 360 360");
				ui.animationCircle2SVGElement.setAttribute("viewBox", "0 0 360 360");
				ui.animationCircle3SVGElement.setAttribute("viewBox", "0 0 360 360");
				ui.animationCircle1SVGInnerElement.setAttribute("cx", "334");
				ui.animationCircle1SVGInnerElement.setAttribute("cy", "180");
				ui.animationCircle1SVGInnerElement.setAttribute("r", "15");
				ui.animationCircle2SVGInnerElement.setAttribute("cx", "180");
				ui.animationCircle2SVGInnerElement.setAttribute("cy", "180");
				ui.animationCircle2SVGInnerElement.setAttribute("r", "154.333");
				ui.animationCircle3SVGInnerElement.setAttribute("cx", "180");
				ui.animationCircle3SVGInnerElement.setAttribute("cy", "180");
				ui.animationCircle3SVGInnerElement.setAttribute("r", "154.333");

			}

			function resetActivityCircleClasses(element, optionSize) {
				if (!element.classList.contains(classes.uiActivityCircle)) {
					element.classList.add(classes.uiActivityCircle);
				}

				element.classList.remove(classes.uiActivityCircleSmall);
				element.classList.remove(classes.uiActivityCircleMedium);
				element.classList.remove(classes.uiActivityCircleLarge);

				switch (optionSize) {
					case "small":
						element.classList.add(classes.uiActivityCircleSmall);
						break;
					case "medium":
						element.classList.add(classes.uiActivityCircleMedium);
						break;
					case "large":
						element.classList.add(classes.uiActivityCircleLarge);
						break;
					default:
						element.classList.add(classes.uiActivityCircleMedium);
				}
			}

			type.activitycircle = utilsObject.merge({}, typeInterface, {
				build: function (progress, element) {
					var ui = {},
						activityElement = element,
						animationCircle1Element,
						animationCircle2Element,
						animationCircle3Element,
						animationCircle1SVGElement,
						animationCircle2SVGElement,
						animationCircle3SVGElement,
						animationCircle1SVGInnerElement,
						animationCircle2SVGInnerElement,
						animationCircle3SVGInnerElement,
						svgNS = "http://www.w3.org/2000/svg",
						svgName = "svg",
						svgInnerName = "circle";

					animationCircle1Element = document.createElement("div");
					animationCircle2Element = document.createElement("div");
					animationCircle3Element = document.createElement("div");
					animationCircle1Element.classList.add(classes.uiActivityCircle1);
					animationCircle2Element.classList.add(classes.uiActivityCircle2);
					animationCircle3Element.classList.add(classes.uiActivityCircle3);

					/* CreateSVG Element for animationCircle1 */
					animationCircle1SVGElement = document.createElementNS(svgNS, svgName);
					animationCircle1SVGElement.setAttribute("class", classes.uiCircle1Svg);
					animationCircle1SVGInnerElement = document.createElementNS(svgNS, svgInnerName);
					animationCircle1SVGInnerElement.setAttribute("class", classes.uiCircle1In);
					animationCircle1SVGElement.appendChild(animationCircle1SVGInnerElement);

					/* CreateSVG Element for animationCircle2 */
					animationCircle2SVGElement = document.createElementNS(svgNS, svgName);
					animationCircle2SVGElement.setAttribute("class", classes.uiCircle2Svg);
					animationCircle2SVGInnerElement = document.createElementNS(svgNS, svgInnerName);
					animationCircle2SVGInnerElement.setAttribute("class", classes.uiCircle2In);
					animationCircle2SVGElement.appendChild(animationCircle2SVGInnerElement);

					/* CreateSVG Element for animationCircle3 */
					animationCircle3SVGElement = document.createElementNS(svgNS, svgName);
					animationCircle3SVGElement.setAttribute("class", classes.uiCircle3Svg);
					animationCircle3SVGInnerElement = document.createElementNS(svgNS, svgInnerName);
					animationCircle3SVGInnerElement.setAttribute("class", classes.uiCircle3In);
					animationCircle3SVGElement.appendChild(animationCircle3SVGInnerElement);

					animationCircle1Element.appendChild(animationCircle1SVGElement);
					animationCircle2Element.appendChild(animationCircle2SVGElement);
					animationCircle3Element.appendChild(animationCircle3SVGElement);

					activityElement.appendChild(animationCircle1Element);
					activityElement.appendChild(animationCircle2Element);
					activityElement.appendChild(animationCircle3Element);

					ui.animationCircle1Element = animationCircle1Element;
					ui.animationCircle2Element = animationCircle2Element;
					ui.animationCircle3Element = animationCircle3Element;
					ui.animationCircle1SVGElement = animationCircle1SVGElement;
					ui.animationCircle2SVGElement = animationCircle2SVGElement;
					ui.animationCircle3SVGElement = animationCircle3SVGElement;
					ui.animationCircle1SVGInnerElement = animationCircle1SVGInnerElement;
					ui.animationCircle2SVGInnerElement = animationCircle2SVGInnerElement;
					ui.animationCircle3SVGInnerElement = animationCircle3SVGInnerElement;

					progress._ui = ui;
					return element;
				},

				init: function (progress, element) {
					var options = progress.options,
						activityCircleSize = options.size;

					setSVGInnerAttribute(progress._ui);
					resetActivityCircleClasses(element, activityCircleSize);
				},
				refresh: function (progress) {
					var element = progress.element,
						activityCircleSize = progress.options.size;

					resetActivityCircleClasses(element, activityCircleSize);

				}
			});

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
