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
/**
 * #RotaryEventBinder
 * Utility for scroll by rotary detent
 * @class ns.helper.RotaryEventBinder
 * @author Hagun Kim <hagun.kim@samsung.com>
 */
(function (document, window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../helper",
			"../../../core/engine",
			"../../../core/util/object",
			"../../../core/util/selectors"
		],
		function () { //>>excludeEnd("tauBuildExclude");
			var objectUtils = ns.util.object,
				selectors = ns.util.selectors,
				animationTimer = null,

				RotaryEventBinder = function (scroller, options) {
					var self = this;

					self._elScroller = null;
					self._scrollTop = 0;
					self._dest = 0;
					self._scrollMax = 0;
					self._callbacks = {};
					self.options = {
						scrollDistance: 119,
						scrollDuration: 450
					};
					self.init(scroller, options);
				},

				prototype = RotaryEventBinder.prototype;

			function cubicBezier(x1, y1, x2, y2) {
				return function (t) {
					var rp = 1 - t,
						rp3 = 3 * rp,
						p2 = t * t,
						p3 = p2 * t,
						a1 = rp3 * t * rp,
						a2 = rp3 * p2;

					if (t > 1) {
						return 1;
					}
					return a1 * y1 + a2 * y2 + p3;
				};
			}

			function scrollAnimation(element, from, to, duration) {
				var easeOut = cubicBezier(0.25, 0.46, 0.45, 1),
					currentTime = 0,
					progress = 0,
					easeProgress = 0,
					distance = to - from,
					scrollTop = from,
					startTime = window.performance.now(),
					animation = function () {
						var gap;

						currentTime = window.performance.now();
						progress = (currentTime - startTime) / duration;
						easeProgress = easeOut(progress);
						gap = distance * easeProgress;
						element.scrollTop = scrollTop + gap;
						if (progress < 1 && progress >= 0) {
							animationTimer = window.requestAnimationFrame(animation);
						} else {
							animationTimer = null;
						}
					};

				animationTimer = window.requestAnimationFrame(animation);
			}

			function showEdgeEffect(direction) {
				if (window.addEdgeEffectONSCROLLTizenUIF) {
					if (direction === "CW") {
						window.addEdgeEffectONSCROLLTizenUIF(false, true, false, false);
					} else {
						window.addEdgeEffectONSCROLLTizenUIF(true, false, false, false);
					}
				}
			}

			function clearScrollAnimation() {
				if (animationTimer !== null) {
					window.cancelAnimationFrame(animationTimer);
					animationTimer = null;
				}
			}

			prototype._rotaryDetentHandler = function (e) {
				var self = this,
					elScroller = self._elScroller,
					options = self.options,
					direction = e.detail.direction;

				if (direction === "CW") {
					if (elScroller.scrollTop === self._scrollMax) {
						showEdgeEffect(direction);
						return;
					}
					self._dest = self._scrollTop + options.scrollDistance > self._scrollMax ? self._scrollMax : self._scrollTop + options.scrollDistance;
					if (self._scrollTop === self._scrollMax && self._dest === self._scrollMax) {
						return;
					}
					clearScrollAnimation();
				} else if (direction === "CCW") {
					if (elScroller.scrollTop === 0) {
						showEdgeEffect(direction);
						return;
					}
					self._dest = self._scrollTop - options.scrollDistance < 0 ? 0 : self._scrollTop - options.scrollDistance;
					if (self._scrollTop === 0 && self._dest === 0) {
						return;
					}
					clearScrollAnimation();
				}
				scrollAnimation(elScroller, elScroller.scrollTop, self._dest, options.scrollDuration);
				self._scrollTop = self._dest;
			};

			prototype._scrollEndEventHandler = function (e) {
				this._scrollTop = e.currentTarget.scrollTop;
			};

			prototype.init = function (scroller, options) {
				var self = this,
					elScroller;

				elScroller = scroller instanceof HTMLElement ? scroller : document.getElementById(scroller);
				if (elScroller === null) {
					ns.warn("Scrollable element parameter should be HTML element or id of the element.");
					return undefined;
				}
				elScroller = selectors.getScrollableParent(elScroller);
				if (elScroller === null) {
					ns.warn("There is no scrollable element.");
					return undefined;
				}

				self._elScroller = elScroller;

				self._scrollTop = elScroller.scrollTop;
				self._scrollMax = elScroller.scrollHeight - elScroller.offsetHeight;

				objectUtils.merge(self.options, options);

				self.bindEvents();
				return undefined;
			};

			prototype.bindEvents = function () {
				var self = this,
					rotaryDetentCallback,
					scrollEventCallback;

				rotaryDetentCallback = self._rotaryDetentHandler.bind(self);
				scrollEventCallback = self._scrollEndEventHandler.bind(self);

				self._callbacks.rotarydetent = rotaryDetentCallback;
				self._callbacks.scrollend = scrollEventCallback;

				window.addEventListener("rotarydetent", rotaryDetentCallback, false);
				self._elScroller.addEventListener("scrollend", scrollEventCallback, false);
			};

			prototype.unbindEvents = function () {
				var self = this;

				window.removeEventListener("rotarydetent", self._callbacks.rotarydetent);
				self._elScroller.removeEventListener("scrollend", self._callbacks.scrollend);

				self._callbacks.rotarydetent = null;
			};

			prototype.destroy = function () {
				var self = this;

				self.unbindEvents();

				self._elScroller = null;
				self.options = null;
				self._callbacks = null;
			};

			prototype.getScroller = function () {
				return this._elScroller;
			};

			RotaryEventBinder.create = function (scroller, options) {
				return new RotaryEventBinder(scroller, options);
			};

			ns.helper.RotaryEventBinder = RotaryEventBinder;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return RotaryEventBinder;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
