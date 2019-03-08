/*global window, define, ns */
/*jslint nomen: true, plusplus: true */
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
 * # Animation
 *
 * Animation class for easy animations of elements. There can be
 * multiple animations on one element but in such case the usage
 * of tau.util.anim.Chain is preferred.
 *
 * ## Usage example
 *
 * @example
 *
 *        <div id="test"
 *                style="width: 10px; height: 10px; background: red;"></div>
 *
 *        <script>
 *            var a = new tau.util.anim.Animation({
 *				element: document.getElementById("test"),
 *				fillMode: "both",
 *				delay: "2s",
 *				duration: "5s",
 *				from: {
 *					"background-color": "red"
 *				},
 *				to: {
 *					"background-color": "blue"
 *				},
 *				onEnd: function () {
 *					console.log("Yay, finished!");
 *				}
 *			});
 *        </script>
 *
 * @class ns.util.anim.Animation
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../support",
			"../DOM/css",
			"../anim",
			"../object",
			"./Keyframes"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var objectUtils = ns.util.object,
				Keyframes = ns.util.anim.Keyframes,
				CSSUtils = ns.util.DOM,
				dateUtils = ns.util.date,
				cssPropertyPrefix = ns.support.cssAnimationPrefix,

				/**
				 * Simple helper for using trim in Array.map() function
				 * @param {string} string
				 * @return {string}
				 * @private
				 * @static
				 * @method trim
				 * @member ns.util.anim.Animation
				 */
				trim = function (string) {
					return string.trim();
				},

				/**
				 * Helper for fetching animation index in animation list
				 * @param {string|string[]} props
				 * @param {string} name
				 * @return {string}
				 * @private
				 * @static
				 * @member ns.util.anim.Animation
				 */
				getAnimationIndex = function (props, name) {
					if (typeof props === "string") {
						props = props.split(",").map(trim);
					}
					return props.indexOf(name);
				},

				eventPrefix = (cssPropertyPrefix || "").replace(/\-/gi, ""),
				endEventName = eventPrefix.length > 0 ? eventPrefix +
				"AnimationEnd" : "animationEnd",
				// paused state flag
				PAUSED = 0,
				// playing state flag
				PLAYING = 1,
				// finished state flag
				FINISHED = 2,
				// alias for function string for typeof conditionals
				TYPE_FUNCTION = "function",
				/**
				 * Animation end handler
				 * @param {ns.util.anim.Animation} self
				 * @param {Event} event
				 * @private
				 * @static
				 * @member ns.util.anim.Animation
				 */
				handleEnd = function (self, event) {
					var options = self.options,
						element = options.element,
						onEnd = options.onEnd,
						onPause = options.onPause;

					if (event.animationName === self.keyframes.id) {
						switch (self.state) {
							case PLAYING:
								self.state = FINISHED;
								if (typeof onEnd === TYPE_FUNCTION) {
									onEnd(self, element, event);
								}
								break;
							case PAUSED:
								if (typeof onPause === TYPE_FUNCTION) {
									onPause(self, element, event);
								}
								break;
						}
					}
				},
				/**
				 * Helper for playing/pausing
				 * @param {ns.util.anim.Animation} self
				 * @param {string} state
				 * @return {ns.util.anim.Animation}
				 * @private
				 * @static
				 * @member ns.util.anim.Animation
				 */
				changeState = function (self, state) {
					var options,
						element = null,
						onPlay = null,
						style,
						keyframes,
						propString,
						propsArray,
						index;

					if (!self._applied) { // !set before keyframe fetch
						self._apply();
					}

					options = self.options;
					element = options.element;
					onPlay = options.onPlay;
					style = element.style;
					keyframes = self.keyframes;
					propString = style.getPropertyValue(cssPropertyPrefix +
						"animation-play-state");
					propsArray = (propString && propString.split(",").map(trim)) || [];
					index = keyframes ? getAnimationIndex(
						style.getPropertyValue(cssPropertyPrefix +
							"animation-name"),
						keyframes.id
					) : -1;

					if (index > -1) {
						propsArray[index] = state || "running";
						style.setProperty(cssPropertyPrefix +
							"animation-play-state", propsArray.join(","));
						self.state = PLAYING;
						if (typeof onPlay === TYPE_FUNCTION) {
							window.clearTimeout(self.playTimer);
							self.playTimer = window.setTimeout(function () {
								onPlay(self, element);
							}, dateUtils.convertToMiliseconds(options.delay));
						}
					}
					return self;
				},
				/**
				 * Constructor for Animation object
				 * @param {Object} options
				 * @param {HTMLElement} options.element The animated element
				 * @param {Object|null} [options.from=null] The starting step, this can be defined later
				 * @param {Object|null} [options.to=null]  The finishing step, this can also be defined later
				 * @param {Object[]} [options.steps=Array(0)] Animation steps, when advanced keying is required, the array must have 100 elements, which are percentages of the timeline (animation duration)
				 * @param {string} [options.duration="0"] The duration of the animation
				 * @param {string} [options.direction="normal"] The direction of the animation (for possible values, refer to CSS Animation spec)
				 * @param {string} [options.delay="0"] The delay of the animation. Please remember when using ns.util.anim.Chain with concurrent option to false, the of subsequent animations will be modified
				 * @param {string} [options.fillMode="none"] The fill mode of the animations (for possible values, refer to CSS Animation spec)
				 * @param {string} [options.timingFunction="ease"] Chooses the timing function for the css animation
				 * @param {boolean} [options.autoPlay=false] Defines if the animation will start after definition
				 * @constructor
				 * @member ns.util.anim.Animation
				 */
				Animation = function (options) {
					var self = this,
						/**
						 * @property {Object} options
						 * @property {HTMLElement} options.element The animated element
						 * @property {Object|null} [options.from=null] The starting step, this
						 *        can be defined later
						 * @property {Object|null} [options.to=null]  The finishing step, this
						 *        can also be defined later
						 * @property {Object[]} [options.steps=Array(0)] Animation steps,
						 *        when advanced keying is required, the array must have 100 elements,
						 *        which are percentages of the timeline (animation duration)
						 * @property {string} [options.duration="0"] The duration of the animation
						 * @property {string} [options.direction="normal"] The direction of the
						 *        animation (for possible values, refer to CSS Animation spec)
						 * @property {string} [options.delay="0"] The delay of the animation.
						 *        Please remember when using ns.util.anim.Chain with concurrent
						 *        option to false, the of subsequent animations will be modified
						 * @property {string} [options.fillMode="none"] The fill mode of the
						 *        animations (for possible values, refer to CSS Animation spec)
						 * @property {boolean} [options.preserve=false] Indicates if the last
						 *        key frame props should be kept after animation is destroyed
						 *        (not implemented!)
						 * @property {string} [options.timingFunction="ease"] Chooses the timing
						 *        function for the css animation (for possible values, refer to CSS
						 *        Animation spec)
						 * @property {boolean} [options.autoPlay=false] Defines if the animation
						 *        will start after definition
						 * @member ns.util.anim.Animation
						 */
						opts = objectUtils.merge({
							element: null,
							from: null,
							to: null,
							steps: [],
							duration: "0",
							direction: "normal",
							delay: "0",
							iterationCount: 1,
							infinite: false,
							fillMode: "none",
							preserve: false, //@TODO preserve props after animation destroy!
							onEnd: null,
							onPause: null,
							onPlay: null,
							timingFunction: "ease",
							autoPlay: false
						}, options || {}),
						steps,
						props,
						endCallback = handleEnd.bind(null, this),
						element = opts.element;

					if (opts.steps.length === 0) {
						steps = [];
						steps.length = 101;
						if (opts.to) {
							steps[100] = opts.to;
						}
						if (!opts.from) {
							if (opts.to && opts.element) {
								props = Object.keys(opts.to);
								CSSUtils.extractCSSProperties(opts.element, props);
								steps[0] = props;
							}
						} else {
							steps[0] = opts.from;
						}
					} else {
						steps = opts.steps;
					}

					self.options = opts;
					/**
					 * @property {Array.<Object>} steps Array of animation steps
					 * @readonly
					 */
					self.steps = steps;
					// indicates if the css props were applied
					self._applied = false;
					/**
					 * @property {ns.util.anim.Keyframes|null} keyframes Keyframes reference
					 * @readonly
					 */
					self.keyframes = null;
					/**
					 * @property {number} [state=0] Animation state
					 *        (ns.util.anim.Animation.states.*)
					 * @readonly
					 */
					self.state = PAUSED;
					// timer for onPlay callback (we need to simulate actual event firing
					self.playTimer = null;
					this._endCallback = endCallback;

					if (element) {
						element.addEventListener(endEventName, endCallback, false);
						if (opts.autoPlay) {
							self.play();
						}
					}

				},
				proto = {};

			/**
			 * Applies css properties for the element
			 * @method _apply
			 * @protected
			 * @member ns.util.anim.Animation
			 */
			proto._apply = function () {
				var self = this,
					opts = self.options,
					element = opts.element,
					style = element.style,
					propString = style.getPropertyValue(cssPropertyPrefix + "animation"),
					propsArray = (propString && propString.split(",").map(trim)) || [],
					id;

				self.keyframes = new Keyframes(self.steps);
				id = self.keyframes.id;
				if (element) {
					propsArray.push(id + " " + opts.duration + " " + opts.timingFunction +
						" " + opts.delay + " " + opts.iterationCount + " " + opts.direction +
						" " + opts.fillMode);
					element.style.setProperty(cssPropertyPrefix + "animation",
						propsArray.join(","));
					self._applied = true;
				}
			};

			/**
			 * Adds step to animation
			 * Note: this will reset the whole animation, so do it only in paused state
			 * @param {number} timePoint A keyframe number between from 0 to 100
			 * @param {Object} stepOptions Css props to change in the keyframe
			 * @return {ns.util.anim.Animation}
			 * @method step
			 * @member ns.util.anim.Animation
			 */
			proto.step = function (timePoint, stepOptions) {
				var self = this;

				self.steps[timePoint] = stepOptions;
				return self.reset();
			};

			/**
			 * Resets the animation
			 * @return {ns.util.anim.Animation}
			 * @method reset
			 * @member ns.util.anim.Animation
			 */
			proto.reset = function () {
				var self = this,
					keyframes = self.keyframes,
					style = self.options.element.style,
					propString = style.getPropertyValue(cssPropertyPrefix + "animation-name"),
					propsArray = (propString && propString.split(",").map(trim)) || [],
					index = keyframes ? propsArray.indexOf(keyframes.id) : -1;

				if (self.keyframes) {
					self.keyframes.destroy();
				}

				keyframes = new Keyframes(self.steps);
				if (index > -1) {
					propsArray[index] = keyframes.id;
					self.keyframes = keyframes;
					style.setProperty(cssPropertyPrefix + "animation-name",
						propsArray.join(","));
				}

				return self;
			};

			/**
			 * Starts playback
			 * @return {ns.util.anim.Animation}
			 * @method play
			 * @member ns.util.anim.Animation
			 */
			proto.play = function () {
				return changeState(this, "running");
			};

			/**
			 * Pauses playback
			 * @return {ns.util.anim.Animation}
			 * @method pause
			 * @member ns.util.anim.Animation
			 */
			proto.pause = function () {
				return changeState(this, "paused");
			};

			/**
			 * Destroys the animation
			 * Note: Please use "preserve" options to keep applied last animation props
			 * @return {ns.util.anim.Animation}
			 * @method destroy
			 * @member ns.util.anim.Animation
			 */
			proto.destroy = function () {
				var self = this,
					element = self.options.element,
					prop,
					style,
					keyframes = self.keyframes,
					endCallback = self._endCallback,
					propRegexp;

				if (element) {
					if (self._applied && keyframes) {
						style = element.style;
						prop = style.getPropertyValue(cssPropertyPrefix + "animation");
						if (prop) {
							propRegexp = new RegExp(",? ?" + keyframes.id + "[^,%]*,? ?", "i");
							style.removeProperty(cssPropertyPrefix + "animation",
								prop.replace(propRegexp, ""));
						}
						keyframes.destroy();
						self._applied = false;
					}
					if (endCallback) {
						element.removeEventListener(endEventName, endCallback, false);
					}
				}
				window.clearTimeout(self.playTimer);
			};

			/**
			 * @property {Object} states animation state definitions
			 * @property {number} [states.PAUSED=0] paused state
			 * @property {number} [states.PLAYING=1] playing state
			 * @property {number} [states.FINISHED=2] finished state
			 * @static
			 * @readonly
			 * @member ns.util.anim.Animation
			 */
			Animation.states = {
				"PAUSED": PAUSED,
				"PLAYING": PLAYING,
				"FINISHED": FINISHED
			};
			Animation.prototype = proto;
			ns.util.anim.Animation = Animation;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
