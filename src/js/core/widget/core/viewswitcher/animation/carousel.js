/*global window, define, Event, console, ns */
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
 * #Animation carousel
 *
 * carousel is animation type of ViewSwitcher
 *
 * @class ns.widget.core.ViewSwitcher.animation.carousel
 * @extends ns.widget.core.ViewSwitcher.animation.interface
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 * @internal
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../animation",
			"./interface",
			"../../viewswitcher",
			"../../../../util/object",
			"../../../../util/DOM/css"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var object = ns.util.object,
				utilDOM = ns.util.DOM,
				animation = ns.widget.core.viewswitcher.animation,
				animationInterface = animation.interface,
				DEFAULT = {
					PERSPECTIVE: 280,
					ZINDEX_TOP: 3,
					ZINDEX_MIDDLE: 2,
					ZINDEX_BOTTOM: 1,
					DIM_LEVEL: 6
				},
				options = {
					useDim: true,
					dimLevel: DEFAULT.DIM_LEVEL
				},
				classes = {
					CAROUSEL: "ui-view-carousel",
					CAROUSEL_ACTIVE: "ui-view-carousel-active",
					CAROUSEL_LEFT: "ui-view-carousel-left",
					CAROUSEL_RIGHT: "ui-view-carousel-right",
					CAROUSEL_DIM: "ui-view-carousel-dim"
				};

			function translate(element, x, y, z, duration) {
				if (duration) {
					utilDOM.setPrefixedStyle(element, "transition", utilDOM.getPrefixedValue("transform " + duration / 1000 + "s ease-out"));
				}

				utilDOM.setPrefixedStyle(element, "transform", "translate3d(" + x + "px, " + y + "px, " + z + "px)");
			}

			function resetStyle(element) {
				element.style.left = "";
				element.style.right = "";
				element.style.zIndex = DEFAULT.ZINDEX_MIDDLE;
				element.style.transform = "translateZ(" + -element.parentNode.offsetWidth / 2 + "px)";
				element.style.webkitTransform = "translateZ(" + -element.parentNode.offsetWidth / 2 + "px)";
			}

			animation.carousel = object.merge({}, animationInterface, {
				/**
				 * Init views position
				 * @method initPosition
				 * @param {Array} views array
				 * @param {number} index
				 * @static
				 * @member ns.widget.core.ViewSwitcher.animation.interface
				 */
				initPosition: function (views, index) {
					var viewSwitcher = views[0].parentNode,
						vsOffsetWidth = viewSwitcher.offsetWidth,
						dimElement,
						i,
						len;

					viewSwitcher.classList.add(classes.CAROUSEL);
					viewSwitcher.style.webkitPerspective = DEFAULT.PERSPECTIVE;
					if (options.useDim) {
						len = views.length;
						for (i = 0; i < len; i++) {
							dimElement = document.createElement("DIV");
							dimElement.classList.add(classes.CAROUSEL_DIM);
							views[i].appendChild(dimElement);
						}
					}
					views[index].classList.add(classes.CAROUSEL_ACTIVE);
					if (index > 0) {
						views[index - 1].classList.add(classes.CAROUSEL_LEFT);
						views[index - 1].style.transform = "translateZ(" + -vsOffsetWidth / 2 + "px)";
					}
					if (index < views.length - 1) {
						views[index + 1].classList.add(classes.CAROUSEL_RIGHT);
						views[index + 1].style.transform = "translateZ(" + -vsOffsetWidth / 2 + "px)";
					}
				},
				/**
				 * Animate views
				 * @method animate
				 * @param {Array} views array
				 * @param {number} index
				 * @param {number} position [0 - 100 or -100 - 0]
				 * @static
				 * @member ns.widget.core.ViewSwitcher.animation.interface
				 */
				animate: function (views, index, position) {
					var viewSwitcher = views[0].parentNode,
						vsWidth = viewSwitcher.offsetWidth,
						vsHalfWidth = vsWidth / 2,
						left = index > 0 ? views[index - 1] : undefined,
						right = index < views.length - 1 ? views[index + 1] : undefined,
						active = views[index],
						ex = position / 100 * vsWidth,
						halfEx = ex / 2,
						centerPosition = (vsHalfWidth - active.offsetWidth / 2),
						adjPosition = (centerPosition / (vsHalfWidth * 0.6)),
						absEx = Math.abs(ex),
						absPosition = Math.abs(position),
						mark = position < 0 ? 1 : -1,
						edge = vsHalfWidth * 0.2 * mark,
						// edgeDeltaX -> -mark * (2 * (0.8 * vsHalfWidth)) - halfEx
						edgeDeltaX = -mark * 1.6 * vsHalfWidth - halfEx,
						minusDeltaX = -vsHalfWidth - halfEx,
						plusDeltaX = -vsHalfWidth + halfEx,
						hidingDeltaX = -halfEx * 0.2,
						prev,
						next,
						beforePrev,
						afterNext;

					active.style.left = (vsWidth - active.offsetWidth) / 2 + "px";
					active.style.zIndex = DEFAULT.ZINDEX_TOP;

					next = ex < 0 ? right : left;
					afterNext = ex < 0 ? (next && next.nextElementSibling) : (next && next.previousElementSibling);
					prev = ex < 0 ? left : right;
					beforePrev = ex < 0 ? (prev && prev.previousElementSibling) : (prev && prev.nextElementSibling);

					if (next) {
						if (absEx < vsWidth * 0.2) {
							next.style.zIndex = DEFAULT.ZINDEX_MIDDLE;
							translate(next, -halfEx * adjPosition, 0, ex < 0 ? minusDeltaX : plusDeltaX);
						} else {
							active.style.zIndex = DEFAULT.ZINDEX_MIDDLE;
							next.style.zIndex = DEFAULT.ZINDEX_TOP;
							translate(next, (2 * edge + halfEx) * adjPosition, 0, ex < 0 ? minusDeltaX : plusDeltaX);
						}
						if (afterNext) {
							afterNext.classList.add(ex < 0 ? classes.CAROUSEL_RIGHT : classes.CAROUSEL_LEFT);
							translate(afterNext, (ex < 0 ? minusDeltaX : -plusDeltaX) * 0.6, 0, -vsWidth - halfEx * mark);
						}
					}
					if (prev) {
						if (beforePrev) {
							beforePrev.classList.remove(ex < 0 ? classes.CAROUSEL_LEFT : classes.CAROUSEL_RIGHT);
						}
						prev.style.zIndex = DEFAULT.ZINDEX_BOTTOM;
						translate(prev, hidingDeltaX, 0, ex < 0 ? plusDeltaX : minusDeltaX);
					}
					if (absEx < vsWidth * 0.8) {
						translate(active, halfEx * adjPosition, 0, halfEx * mark);
					} else {
						translate(active, edgeDeltaX * adjPosition, 0, halfEx * mark);
					}
					if (options.useDim) {
						active.querySelector("." + classes.CAROUSEL_DIM).style.opacity = absPosition * options.dimLevel / 1000;
						if (next) {
							next.querySelector("." + classes.CAROUSEL_DIM).style.opacity = options.dimLevel / 10 * (1 - absPosition / 100);
						}
					}
				},
				/**
				 * Reset views position
				 * @method resetPosition
				 * @param {Array} views array
				 * @param {number} index active index
				 * @static
				 * @member ns.widget.core.ViewSwitcher.animation.interface
				 */
				resetPosition: function (views, index) {
					var viewSwitcher = views[0].parentNode,
						active = views[index],
						rightElements = viewSwitcher.querySelectorAll("." + classes.CAROUSEL_RIGHT),
						leftElements = viewSwitcher.querySelectorAll("." + classes.CAROUSEL_LEFT),
						i,
						len;

					viewSwitcher.querySelector("." + classes.CAROUSEL_ACTIVE).classList.remove(classes.CAROUSEL_ACTIVE);
					active.classList.add(classes.CAROUSEL_ACTIVE);
					active.style.transform = "";
					active.style.webkitTransform = "";
					len = rightElements.length;
					for (i = 0; i < len; i++) {
						rightElements[i].classList.remove(classes.CAROUSEL_RIGHT);
					}
					if (index < views.length - 1) {
						views[index + 1].classList.add(classes.CAROUSEL_RIGHT);
						resetStyle(views[index + 1]);
					}
					len = leftElements.length;
					for (i = 0; i < len; i++) {
						leftElements[i].classList.remove(classes.CAROUSEL_LEFT);
					}
					if (index > 0) {
						views[index - 1].classList.add(classes.CAROUSEL_LEFT);
						resetStyle(views[index - 1]);
					}
				}
			});

			animation.carousel.options = options;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
