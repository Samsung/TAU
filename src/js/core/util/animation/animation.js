/* global requestAnimationFrame, define, ns */
/**
 * Main file of applications, which connect other parts
 */
// then we can load plugins for libraries and application
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../../../../../libs/BezierCurve"
	],
		function (bezierCurve) {
		//>>excludeEnd("tauBuildExclude");
			var utils = ns.util,
				requestAnimationFrame = utils.requestAnimationFrame,
			/**
				 * Util to change value of object property in given time
				 * @class Animation
				 */
				Animate = function (object) {
					var self = this;

					self._object = object;
					self._animate = {
						chain: [],
						chainIndex: 0
					};
					// This is used to keep track of elapsed time of paused animation
					self._pausedTimeDiff = null;
					self._animateConfig = null;
				},
				linear = function (x, a, b) {
					a = (a === undefined) ? 1 : a;
					b = (b === undefined) ? 0 : b;
					return x * (a || 0) + (b || 0);
				},
				inverseTiming = function (x) {
					return 1 - x;
				},
				prototype = {};

			utils.bezierCurve = utils.bezierCurve || bezierCurve;

			Animate.prototype = prototype;

			Animate.timing = {
				linear: linear,
				ease: utils.bezierCurve.ease.get,
				easeInOut: utils.bezierCurve.easeInOut.get
			};

			function firstDefined() {
				var args = [].slice.call(arguments),
					i = 0,
					length = args.length,
					arg;

				for (; i < length; i++) {
					arg = args[i];
					if (arg !== undefined) {
						return arg;
					}
				}
				return null;
			}

			prototype.destroy = function () {
				var self = this;

				self._object = null;
				self._animate = null;
				self._animateConfig = null;
			};

			function calculateSteps(option, currentPoint) {
				var percent,
					step,
					steps = option.steps,
					from = option.from,
					to = null,
					percentStart = 0,
					percentStop = 100,
					floatPoint;

				for (percent in steps) {
					if (steps.hasOwnProperty(percent)) {
						step = steps[percent];
						floatPoint = percent / 100;
						if (currentPoint >= floatPoint) {
							from = step;
							percentStart = floatPoint;
						} else if (to === null) {
							to = step;
							percentStop = floatPoint;
						}
					}
				}
				return from + (currentPoint - percentStart) / (percentStop - percentStart) *
					(to - from);
			}

			function eachOption(config, animateConfig, option) {
				var propertyObject,
					from,
					steps = option.steps || config.steps;

				option.duration = firstDefined(option.duration, config.duration);
				option.delay = firstDefined(option.delay, config.delay, 0);
				propertyObject = firstDefined(option.object, this._object);
				option.simpleProperty = option.property;
				option.property.split(".").forEach(function (property) {
					if (typeof propertyObject[property] === "object" && propertyObject[property] !== null) {
						propertyObject = propertyObject[property];
						option.propertyObject = propertyObject;
					} else {
						option.simpleProperty = property;
					}
				});
				option.propertyObject = propertyObject;
				if (steps) {
					option.calculate = calculateSteps.bind(null, option);
					steps[0] = firstDefined(steps[0], option.from, propertyObject[option.simpleProperty]);
					option.from = steps["0"];
					option.to = firstDefined(steps["100"], option.to);
					option.diff = 0;
					option.current = steps[0];
					option.direction = option.from < option.to ? 1 : -1;
				} else {
					option.calculate = option.calculate || linear;
					from = firstDefined(option.from, propertyObject[option.simpleProperty]);
					option.from = from;
					option.diff = (option.to - from);
					option.current = from;
					option.direction = from < option.to ? 1 : -1;
				}

				// calculate value change in full time
				option.startTime = Date.now() + option.delay;

				if (this._pausedTimeDiff) {
					option.startTime = Date.now() - this._pausedTimeDiff;
					this._pausedTimeDiff = 0;
				}
				// save last time of recalculate options
				option.lastCalculationTime = option.startTime;
				// set timing function
				option.timing = firstDefined(option.timing, config.timing, linear);

				animateConfig.push(option);
			}

			prototype._initAnimate = function () {
				var self = this,
					animateConfig = [],
					options = self._animate.chain[self._animate.chainIndex++];

				if (options) {
					options.forEach(eachOption.bind(self, self._config, animateConfig));
					self._animateConfig = animateConfig;
				} else {
					self._animateConfig = null;
				}
			};

			function animateLoopCallback(self, copiedArgs) {
				if (self._animate) {
					self._animate.chain = [].slice.call(copiedArgs);
					self.start();
				}
			}

			function animateRevertCallback(self, copiedArgs) {
				var chain = [].slice.call(copiedArgs),
					newChain = [];

				chain.forEach(function (options) {
					newChain.unshift(options);
					options.forEach(function (option) {
						option.timing = inverseTiming;
					});
				});
				self._animate.chain = newChain;
				self._animate.callback = null;
				self.start();
			}

			/**
			 * Set animate
			 * @param {Object...} options list of animations configs
			 * @return {Animate}
			 */
			prototype.set = function (options) {
				var self = this,
					config,
				// converts arguments to array
					args = [].slice.call(arguments),
					copiedArgs;

				// we get last argument
				config = args.pop();

				if (!Array.isArray(config)) {
				// if last arguments is object then we use it as global animation config
					self._animate.config = config;
				} else {
				// otherwise this is description of one animation loop and back to args array
					args.push(config);
					config = null;
				}

				self._config = config;

				// copy array to be sure that we have new reference objects
				copiedArgs = [].slice.call(args);

				if (config) {
					if (config.loop) {
					// when animation is in loop then we create callback on animation and to restart animation
						self._animate.callback = animateLoopCallback.bind(null, self, copiedArgs);
					} else if (config.withRevert) {
						self._animate.callback = animateRevertCallback.bind(null, self, copiedArgs);
					} else {
					// otherwise we use callback from options
						self._animate.callback = options.callback || config.callback;
					}
				}

				// cache options in object
				self._animate.chain = args;

				return self;
			};

			/**
			 * Start animation
			 * @param {Function} [callback] function called after finish animation
			 */
			prototype.start = function (callback) {
				var self = this;

			// init animate options
				self._initAnimate();

			// setting callback function
				callback = self._animate.callback || callback;

				if (self._animate.chainIndex < self._animate.chain.length) {
				// if we have many animations in chain that we set callback
				// to start next animation from chain after finish current
				// animation
					self._animationTimeout = self._calculateAnimate.bind(self, self.start.bind(self, callback));
				} else {
					self._animationTimeout = self._calculateAnimate.bind(self, callback);
				}
				self._calculateAnimate(callback);
				return self;
			};

			/**
			 * Stop animations
			 */
			prototype.stop = function () {
				var self = this;

				// reset index of animations chain
				self._animate.chainIndex = 0;
				// reset current animation config
				self._animateConfig = null;
			// clear timeout
				self._animationTimeout = null;
				return self;
			};

			prototype.pause = function () {
				var self = this;

				if (self._animateConfig) {
					self._pausedTimeDiff = Date.now() - self._animateConfig[0].startTime;
					self.stop();
				}
			};

			function calculateOption(option, time) {
				var timeDiff,
					current;

				if (option && option.startTime < time) {
				// if option is not delayed
					timeDiff = time - option.startTime;

					if (timeDiff >= option.duration) {
						// if current is bigger then end we finish loop and we take next animate from chain
						timeDiff = option.duration;
						if (option.callback) {
							option.callback();
						}
					}
					current = option.calculate(option.timing(timeDiff / option.duration),
						option.diff, option.from, option.current);
					if (current !== null) {
						option.current = current;
						// we set next calculation time
						option.propertyObject[option.simpleProperty] = option.current;
						if (timeDiff >= option.duration) {
							// inform about remove animation config
							return 2;
						}
						// inform widget about redraw
						return 1;
					}
					if (timeDiff >= option.duration) {
						// inform about remove animation config
						return 2;
					}
				}
				return 0;
			}

			/**
			 * Method called in loop to calculate current state of animation
			 * @param {Function} callback
			 * @private
			 */
			prototype._calculateAnimate = function (callback) {
				var self = this,
					// current animation config
					animateConfig = self._animateConfig,
					// number of animations which is not finished
					notFinishedAnimationsCount,
					// flag inform that redraw is necessary
					redraw = false,
					i = 0,
					length,
					time = Date.now(),
					calculatedOption;

				if (animateConfig) {
					notFinishedAnimationsCount = animateConfig.length;
					length = animateConfig.length;

					// calculating options changed in animation
					while (i < length) {
						calculatedOption = calculateOption(animateConfig[i], time);
						if (calculatedOption === 2) {
							notFinishedAnimationsCount--;
							// remove current config and recalculate loop arguments
							animateConfig.splice(i, 1);
							length--;
							i--;
							redraw = true;
						} else if (calculatedOption === 1) {
							redraw = true;
						}
						i++;
					}
					// redraw is necessary
					if (redraw && self._tickFunction) {
						self._tickFunction(self._object);
					}
					if (notFinishedAnimationsCount) {
					// setting next loop state
						if (self._animationTimeout) {
							requestAnimationFrame(self._animationTimeout);
						}
					} else {
						// Animation state can be change to "stopped"
						self.stop();
						// animation is finished
						if (callback) {
							callback();
						}
					}
				}
			};

		/**
			 * Set function which will be called after animation change property of object
			 * @param {Function} tickFunction
			 * @return {Animation}
			 */
			prototype.tick = function (tickFunction) {
				var oldTickFunction = this._tickFunction;

				if (oldTickFunction) {
					this._tickFunction = function (object) {
						oldTickFunction(object);
						tickFunction(object);
					};
				} else {
					this._tickFunction = tickFunction;
				}
				return this;
			};

			utils.Animate = Animate;
		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Animate;
		});
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));

