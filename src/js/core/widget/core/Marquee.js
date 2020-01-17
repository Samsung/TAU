/*global window, define, console, ns */
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
 * # Marquee
 * Shows a component which moves left and right.
 *
 * It makes <div> element with text move horizontally like legacy <marquee> tag
 *
 * ## Make Marquee Element
 * If you want to use Marquee widget, you have to declare below attributes in <div> element and make
 * Marquee widget in JS code.
 * To use a Marquee widget in your application, use the following code:
 *
 *    @example
 *    <div class="ui-content">
 *        <ul class="ui-listview">
 *            <li><div class="ui-marquee" id="marquee">Marquee widget code sample</div></li>
 *        </ul>
 *    </div>
 *    <script>
 *        var marqueeEl = document.getElementById("marquee"),
 *            marqueeWidget = new tau.widget.Marquee(marqueeEl,
 *              {marqueeStyle: "scroll", delay: "3000"});
 *    </script>
 *
 * @author Heeju Joo <heeju.joo@samsung.com>
 * @class ns.widget.core.Marquee
 * @component-selector .ui-marquee
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../event",
			"../../util/object",
			"../../util/animation/animation",
			"../BaseWidget",
			"../core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for class ns.engine
				 * @property {ns.engine} engine
				 * @member ns.widget.core.Marquee
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Alias for class ns.util.object
				 * @property {Object} objectUtils
				 * @member ns.widget.core.Marquee
				 * @private
				 */
				objectUtils = ns.util.object,

				Animation = ns.util.Animate,

				states = {
					RUNNING: "running",
					STOPPED: "stopped",
					IDLE: "idle"
				},

				Marquee = function () {
					this.options = objectUtils.copy(Marquee.defaults);
					// event callbacks
					this._callbacks = {};
					this._ui = {
						content: null
					};
				},

				prototype = new BaseWidget(),

				/**
				* Standard marquee widget
				* @style ui-marquee
				* @member ns.widget.core.Marquee
				*/
				CLASSES_PREFIX = "ui-marquee",

				eventType = {
					/**
					 * Triggered when the marquee animation end.
					 * @event marqueeend
					 * @member ns.widget.core.Marquee
					 */
					MARQUEE_START: "marqueestart",
					MARQUEE_END: "marqueeend",
					MARQUEE_STOPPED: "marqueestopped"
				},
				/**
				 * Dictionary for CSS class of marquee play state
				 * @property {Object} classes
				 * @member ns.widget.core.Marquee
				 * @static
				 */
				classes = {
					/**
					* Content for marquee widget
					* @style ui-marquee-content
					* @member ns.widget.core.Marquee
					*/
					MARQUEE_CONTENT: CLASSES_PREFIX + "-content",
					/**
					* Add gradient for marquee widget
					* @style ui-marquee-gradient
					* @member ns.widget.core.Marquee
					*/
					MARQUEE_GRADIENT: CLASSES_PREFIX + "-gradient",
					/**
					* Set ellipsis effect for marquee widget
					* @style ui-marquee-ellipsis
					* @member ns.widget.core.Marquee
					*/
					MARQUEE_ELLIPSIS: CLASSES_PREFIX + "-ellipsis",
					/**
					* Start animation for marquee widget
					* @style ui-marquee-anim-running
					* @member ns.widget.core.Marquee
					*/
					ANIMATION_RUNNING: CLASSES_PREFIX + "-anim-running",
					/**
					* Stop animation for marquee widget
					* @style ui-marquee-anim-stopped
					* @member ns.widget.core.Marquee
					*/
					ANIMATION_STOPPED: CLASSES_PREFIX + "-anim-stopped",
					/**
					* Idle animation for marquee widget
					* @style ui-marquee-anim-idle
					* @member ns.widget.core.Marquee
					*/
					ANIMATION_IDLE: CLASSES_PREFIX + "-anim-idle"
				},

				/**
				 * Dictionary for marquee style
				 */
				style = {
					SCROLL: "scroll",
					SLIDE: "slide",
					ALTERNATE: "alternate",
					ENDTOEND: "endToEnd"
				},

				ellipsisEffect = {
					GRADIENT: "gradient",
					ELLIPSIS: "ellipsis",
					NONE: "none"
				},

				round100 = function (value) {
					return Math.round(value * 100) / 100;
				},

				/**
				 * Options for widget
				 * @property {Object} options
				 * @property {string|"slide"|"scroll"|"alternate|"endToEnd""} [options.marqueeStyle="slide"] Sets the
				 * default style for the marquee
				 * @property {number} [options.speed=60] Sets the speed(px/sec) for the marquee
				 * @property {number|"infinite"} [options.iteration=1] Sets the iteration count number for
				 * marquee
				 * @property {number} [options.delay=2000] Sets the delay(ms) for marquee
				 * @property {"linear"|"ease"|"ease-in"|"ease-out"|"cubic-bezier(n,n,n,n)"}
				 * [options.timingFunction="linear"] Sets the timing function for marquee
				 * @property {"gradient"|"ellipsis"|"none"} [options.ellipsisEffect="gradient"] Sets the
				 * end-effect(gradient) of marquee
				 * @property {boolean} [options.autoRun=true] Sets the status of autoRun
				 * @member ns.widget.core.Marquee
				 * @static
				 */
				defaults = {
					marqueeStyle: style.SLIDE,
					speed: 60,
					iteration: "1",
					currentIteration: 1,
					delay: 0,
					timingFunction: "linear",
					ellipsisEffect: ellipsisEffect.GRADIENT,
					runOnlyOnEllipsisText: true,
					animation: states.STOPPED,
					autoRun: true
				},
				GRADIENTS = {
					LEFT: "-webkit-linear-gradient(left, transparent 0, rgb(255, 255, 255) 15%," +
					" rgb(255, 255, 255) 100%)",
					BOTH: "-webkit-linear-gradient(left, transparent 0, rgb(255, 255, 255)" +
					" 15%, rgb(255, 255, 255) 85%, transparent 100%",
					RIGHT: "-webkit-linear-gradient(left, rgb(255, 255, 255) 0, rgb(255," +
					" 255, 255) 85%, transparent 100%)"
				};

			Marquee.classes = classes;
			Marquee.defaults = defaults;

			prototype._calculateTranslateFunctions = {
				scroll: function (self, state, diff, from, current) {
					var value = from + state * diff,
						returnValue;

					returnValue = "translateX(" + (-1 * round100(value) || 0) + "px)";
					if (current === returnValue) {
						return null;
					}
					return returnValue;
				},
				slide: function (self, state, diff, from, current) {
					var stateDOM = self._stateDOM,
						containerWidth = stateDOM.offsetWidth,
						textWidth = stateDOM.children[0].offsetWidth,
						value,
						excludeValue,
						returnValue;

					// RIGHT gradient is 85% spec.
					excludeValue = (containerWidth * 15 / 100) / 2;
					value = state * (textWidth - containerWidth + excludeValue);
					returnValue = "translateX(" + (-1 * round100(value) || 0) + "px)";
					if (current === returnValue) {
						return null;
					}
					return returnValue;
				},
				alternate: function (self, state, diff, from, current) {
					var stateDOM = self._stateDOM,
						containerWidth = stateDOM.offsetWidth,
						textWidth = stateDOM.children[0].offsetWidth,
						value = from + state * diff,
						returnValue;

					if (value > textWidth / 2) {
						value = textWidth - (value - textWidth / 2) * 2;
					} else {
						value *= 2;
					}
					value = value / textWidth * (textWidth - containerWidth);
					returnValue = "translateX(" + (-1 * round100(value) || 0) + "px)";
					if (current === returnValue) {
						return null;
					}
					return returnValue;
				},
				endToEnd: function (self, state, diff, from, current) {
					var value = from + state * diff,
						returnValue;

					returnValue = "translateX(" + (-1 * round100(value) || 0) + "px)";
					if (current === returnValue) {
						return null;
					}
					return returnValue;
				}
			};

			prototype._calculateEndToEndGradient = function (state) {
				var self = this,
					stateDOM = self._stateDOM,
					textWidth = stateDOM.children[0].offsetWidth,
					returnTimeFrame = ((textWidth - 50) / textWidth),
					returnValue;

				if (self.options.ellipsisEffect === "none") {
					return null;
				}
				if (state > 0 && self.options.currentIteration < self.options.iteration) {
					// don't change gradient between iterations only for lastpass
					returnValue = GRADIENTS.BOTH;
				} else if (state > returnTimeFrame) {
					returnValue = GRADIENTS.RIGHT;
				} else if (state > 0) {
					returnValue = GRADIENTS.BOTH;
				} else {
					returnValue = GRADIENTS.LEFT;
				}
				return returnValue;
			};

			prototype._calculateStandardGradient = function (state, diff, from, current) {
				var returnValue;

				if (isNaN(state)) {
					return null;
				}
				if (this.options.ellipsisEffect === "none") {
					return null;
				}
				if (state === 1) {
					returnValue = GRADIENTS.LEFT;
				} else if (state > 0) {
					returnValue = GRADIENTS.BOTH;
				} else {
					returnValue = GRADIENTS.RIGHT;
				}
				return returnValue;
			};

			/**
			 * Build Marquee DOM
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Marquee
			 */
			prototype._build = function (element) {
				var marqueeInnerElement = element.querySelector("." + classes.MARQUEE_CONTENT);

				element.classList.add(CLASSES_PREFIX);

				if (!marqueeInnerElement) {
					marqueeInnerElement = document.createElement("div");

					while (element.hasChildNodes()) {
						marqueeInnerElement.appendChild(element.removeChild(element.firstChild));
					}
					marqueeInnerElement.classList.add(classes.MARQUEE_CONTENT);
					element.appendChild(marqueeInnerElement);
				}

				this._ui.content = marqueeInnerElement;

				return element;
			};

			prototype._initStateDOMstructure = function () {
				this._stateDOM = {
					classList: [],
					offsetWidth: null,
					style: {
						webkitMaskImage: null
					},
					children: [
						{
							offsetWidth: null,
							style: {
								webkitTransform: null
							}
						}
					]
				};
			};

			prototype._initAnimation = function () {
				var self = this,
					stateDOM = self._stateDOM,
					stateDOMfirstChild = stateDOM.children[0],
					width = stateDOMfirstChild.offsetWidth +
						((self.options.marqueeStyle === style.ENDTOEND) ? 100 : 0),
					animation = new Animation({}),
					state = {
						hasEllipsisText: (width > 0),
						animation: [{
							object: stateDOMfirstChild.style,
							property: "webkitTransform",
							calculate: self._calculateTranslateFunctions.scroll.bind(null, self),
							from: 0,
							to: width
						}, {
							object: stateDOM.style,
							calculate: self._calculateStandardGradient.bind(self),
							property: "webkitMaskImage",
							from: 0,
							to: 1
						}],
						animationConfig: {
							duration: width / self.options.speed * 1000,
							timing: Animation.timing.linear
						}
					};

				self.state = state;

				animation.tick(self._render.bind(self, true));

				self._animation = animation;
			};

			/**
			 * Init Marquee Style
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Marquee
			 */
			prototype._init = function (element) {
				var self = this;

				self._initStateDOMstructure();
				self._initDOMstate();
				self._initAnimation();
				self.option(self.options);

				return element;
			};

			prototype._setEllipsisEffect = function (element, value) {
				return this._togglePrefixedClass(this._stateDOM, CLASSES_PREFIX + "-", value);
			};

			prototype._updateDuration = function () {
				var self = this,
					stateDOM = self._stateDOM,
					state = self.state,
					firstChild = stateDOM.children[0],
					width = firstChild.offsetWidth,
					dWidth = width - stateDOM.offsetWidth,
					animationConfig = state.animationConfig;

				animationConfig.duration = (dWidth > 0) ?
					width / self.options.speed * 1000 :
					0;
				self._animation.set(state.animation, animationConfig);
			};

			prototype._setSpeed = function (element, value) {
				var self = this;

				self.options.speed = parseInt(value, 10);
				self._updateDuration();
				return false;
			};

			function animationIterationCallback(self) {
				var animation = self._animation,
					state = self.state;

				if (self.options.currentIteration++ < self.options.iteration || self.options.iteration === "infinite") {
					animation.set(state.animation, state.animationConfig);
					animation.stop();
					animation.start();
				} else {
					if (self.options.marqueeStyle === style.ENDTOEND) {
						self._ui.content.classList.remove("ui-visible");
					}
					self.reset();
					self.options.animation = states.STOPPED;
					self.trigger(eventType.MARQUEE_END);
				}
			}

			prototype._setIteration = function (element, value) {
				var self = this,
					state = self.state,
					animationConfig = state.animationConfig;

				if (value === "infinite") {
					animationConfig.loop = true;
					animationConfig.callback = function () {
						self.options.animation = states.STOPPED;
						self.trigger.bind(self, eventType.MARQUEE_END);
					};
				} else {
					value = parseInt(value, 10);
					self.options.currentIteration = 1;
					animationConfig.loop = false;
					animationConfig.callback = animationIterationCallback.bind(null, self);
				}
				self._animation.set(state.animation, animationConfig);
				self.options.iteration = value;
				return false;
			};

			prototype._setDelay = function (element, value) {
				var self = this,
					state = self.state,
					animationConfig = state.animationConfig;

				value = parseInt(value, 10);
				animationConfig.delay = value;
				self._animation.set(state.animation, animationConfig);
				self.options.delay = value;
				return false;
			};

			prototype._setTimingFunction = function (element, value) {
				var self = this,
					state = self.state,
					animationConfig = state.animationConfig;

				animationConfig.timing = Animation.timing[value];
				self._animation.set(state.animation, animationConfig);
				self.options.timing = value;
				return false;
			};

			prototype._setAutoRun = function (element, value) {
				if (value) {
					this.start();
				}
				return false;
			};

			prototype._setAnimation = function (element, value) {
				var self = this,
					animation = self._animation,
					stateDOM = self._stateDOM,
					options = self.options,
					width = stateDOM.children[0].offsetWidth - stateDOM.offsetWidth,
					runOnlyOnEllipsisText = options.runOnlyOnEllipsisText;

				if (value !== options.animation) {
					if (value === states.RUNNING) {
						if ((runOnlyOnEllipsisText && width > 0) || (!runOnlyOnEllipsisText)) {
							// copy of text content to title and after pseudo element
							self._ui.content.setAttribute("title", self._ui.content.textContent.trim());
							if (self.options.marqueeStyle === style.ENDTOEND) {
								self._ui.content.classList.add("ui-visible");
							}
							animation.start();
							options.animation = value;
							self.trigger(eventType.MARQUEE_START);
						}
					} else {
						if (self.options.marqueeStyle === style.ENDTOEND) {
							self._ui.content.classList.remove("ui-visible");
						}
						animation.pause();
						options.animation = value;
						self.trigger(eventType.MARQUEE_STOPPED);
					}
				}
				return false;
			};

			prototype._setMarqueeStyle = function (element, value) {
				var self = this,
					animation = self.state.animation;

				animation[0].calculate = self._calculateTranslateFunctions[value].bind(null, self);
				if (value === "endToEnd") {
					animation[1].calculate = self._calculateEndToEndGradient.bind(self);
				} else {
					animation[1].calculate = self._calculateStandardGradient.bind(self);
				}
				self.options.marqueeStyle = value;
				return false;
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.Marquee
			 */
			prototype._destroy = function () {
				var self = this,
					marqueeInnerElement;

				self.state = null;
				if (self._animation) {
					self._animation.stop();
					self._animation.destroy();
					self._animation = null;
				}
				self.element.style.webkitMaskImage = "";

				marqueeInnerElement = self.element.querySelector("." + classes.MARQUEE_CONTENT);
				if (marqueeInnerElement) {
					while (marqueeInnerElement.hasChildNodes()) {
						self.element.appendChild(marqueeInnerElement.removeChild(marqueeInnerElement.firstChild));
					}
					self._stateDOM.children = [];
					if (marqueeInnerElement.parentElement === self.element) {
						self.element.removeChild(marqueeInnerElement);
					}
				}
				self._stateDOM = null;
			};

			/**
			 * Start Marquee animation
			 *
			 * #####Running example in pure JavaScript:
			 *
			 *    @example
			 *    <div class="ui-marquee" id="marquee">
			 *        <p>MarqueeTEST TEST message TEST for marquee</p>
			 *    </div>
			 *    <script>
			 *        var marqueeWidget = tau.widget.Marquee(document.getElementById("marquee"));
			 *        marqueeWidget.start();
			 *    </script>
			 *
			 * @method start
			 * @member ns.widget.core.Marquee
			 */
			prototype.start = function () {
				this.option("animation", "running");
			};

			/**
			 * Pause Marquee animation
			 *
			 * #####Running example in pure JavaScript:
			 *    @example
			 *    <div class="ui-marquee" id="marquee">
			 *        <p>MarqueeTEST TEST message TEST for marquee</p>
			 *    </div>
			 *    <script>
			 *        var marqueeWidget = tau.widget.Marquee(document.getElementById("marquee"));
			 *        marqueeWidget.stop();
			 *    </script>
			 *
			 * @method stop
			 * @member ns.widget.core.Marquee
			 */
			prototype.stop = function () {
				this.option("animation", "stopped");
			};

			/**
			 * Reset Marquee animation
			 *
			 * #####Running example in pure JavaScript:
			 *    @example
			 *    <div class="ui-marquee" id="marquee">
			 *        <p>MarqueeTEST TEST message TEST for marquee</p>
			 *    </div>
			 *    <script>
			 *        var marqueeWidget = tau.widget.Marquee(document.getElementById("marquee"));
			 *        marqueeWidget.reset();
			 *    </script>
			 *
			 * @method reset
			 * @member ns.widget.core.Marquee
			 */
			prototype.reset = function () {
				var self = this,
					animation = self._animation;

				animation.reset();

				self.element.style.webkitMaskImage = (self.options.ellipsisEffect === "none") ?
					"" : GRADIENTS.RIGHT;
			};

			Marquee.prototype = prototype;
			ns.widget.core.Marquee = Marquee;

			engine.defineWidget(
				"Marquee",
				".ui-marquee",
				["start", "stop", "reset"],
				Marquee,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);

			return ns.widget.core.Marquee;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
