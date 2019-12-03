/*global window, ns, define, XMLHttpRequest, console, Blob */
/*jslint nomen: true, browser: true, plusplus: true */
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
 * #Utilities
 *
 * The Tizen Advanced UI (TAU) framework provides utilities for easy-developing
 * and fully replaceable with jQuery method. When user using these DOM and
 * selector methods, it provide more light logic and it proves performance
 * of web app. The following table displays the utilities provided by the
 * TAU framework.
 *
 * @class ns.util
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var currentFrame = null,
				util = ns.util || {},
				// frames callbacks which should be run in next request animation frame
				waitingFrames = [],
				slice = [].slice,
				// inform that loop was added to request animation frame callback
				loopWork = false;

			/**
			 * Function which is use as workaround when any type of request animation frame not exists
			 * @param {Function} callback
			 * @method _requestAnimationFrameOnSetTimeout
			 * @static
			 * @member ns.util
			 * @protected
			 */
			util._requestAnimationFrameOnSetTimeout = function (callback) {
				currentFrame = window.setTimeout(callback.bind(callback, +new Date()), 1000 / 60);
			};

			/**
			 * Function which support every request animation frame.
			 * @method _loop
			 * @protected
			 * @static
			 * @member ns.util
			 */
			util._loop = function () {
				var loopWaitingFrames = slice.call(waitingFrames),
					currentFrameFunction = loopWaitingFrames.shift(),
					loopTime = performance.now();

				waitingFrames = [];

				while (currentFrameFunction) {
					currentFrameFunction(loopTime);
					if (performance.now() - loopTime < 15) {
						currentFrameFunction = loopWaitingFrames.shift();
					} else {
						currentFrameFunction = null;
					}
				}
				if (loopWaitingFrames.length || waitingFrames.length) {
					waitingFrames.unshift.apply(waitingFrames, loopWaitingFrames);
					util.windowRequestAnimationFrame(util._loop);
				} else {
					loopWork = false;
				}
			};

			/**
			 * Find browser prefixed request animation frame function.
			 * @method _getRequestAnimationFrame
			 * @protected
			 * @static
			 * @member ns.util
			 */
			util._getRequestAnimationFrame = function () {
				return (window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					util._requestAnimationFrameOnSetTimeout).bind(window);
			};

			/**
			 * Original requestAnimationFrame from object window.
			 * @method windowRequestAnimationFrame
			 * @static
			 * @member ns.util
			 */
			util.windowRequestAnimationFrame = util._getRequestAnimationFrame();

			/**
			 * Special requestAnimationFrame function which add functions to queue of callbacks
			 * @method requestAnimationFrame
			 * @static
			 * @member ns.util
			 */
			util.requestAnimationFrame = function (callback) {
				waitingFrames.push(callback);
				if (!loopWork) {
					util.windowRequestAnimationFrame(util._loop);
					loopWork = true;
				}
			};

			util._cancelAnimationFrameOnSetTimeout = function () {
				// probably wont work if there is any more than 1
				// active animationFrame but we are trying anyway
				window.clearTimeout(currentFrame);
			};

			/**
			 * Remove animation callbacks added by requestAnimationFrame
			 * @method cancelAnimationFrames
			 * @static
			 * @member ns.util
			 * @param {*} animationId value for identify animation in queue
			 */
			util.cancelAnimationFrames = function (animationId) {
				var found = 0,
					len = waitingFrames.length,
					i = 0;

				if (animationId) {
					// remove selected requests
					while (len > 0 && found > -1) {
						found = -1;
						for (; i < len; i++) {
							if (waitingFrames[i].animationId === animationId) {
								found = i;
								break;
							}
						}

						if (found > -1) {
							waitingFrames.splice(found, 1);
							len--;
						}
					}
				} else {
					ns.warn("cancelAnimationFrames() require one parameter for request identify");
				}
			};

			util._getCancelAnimationFrame = function () {
				return (window.cancelAnimationFrame ||
					window.webkitCancelAnimationFrame ||
					window.mozCancelAnimationFrame ||
					window.oCancelAnimationFrame ||
					window.msCancelAnimationFrame ||
					util._cancelAnimationFrameOnSetTimeout).bind(window);
			};

			util.cancelAnimationFrame = util._getCancelAnimationFrame();

			/**
			 * fetchSync retrieves a text document synchronously, returns null on error
			 * @param {string} url
			 * @param {=string} [mime=""] Mime type of the resource
			 * @return {string|null}
			 * @static
			 * @member ns.util
			 */
			function fetchSync(url, mime) {
				var xhr = new XMLHttpRequest(),
					status;

				xhr.open("get", url, false);
				if (mime) {
					xhr.overrideMimeType(mime);
				}
				xhr.send();
				if (xhr.readyState === 4) {
					status = xhr.status;
					if (status === 200 || (status === 0 && xhr.responseText)) {
						return xhr.responseText;
					}
				}

				return null;
			}

			util.fetchSync = fetchSync;

			/**
			 * Removes all script tags with src attribute from document and returns them
			 * @param {HTMLElement} container
			 * @return {Array.<HTMLElement>}
			 * @protected
			 * @static
			 * @member ns.util
			 */
			function removeExternalScripts(container) {
				var scripts = slice.call(container.querySelectorAll("script[src]")),
					i = scripts.length,
					script;

				while (--i >= 0) {
					script = scripts[i];
					script.parentNode.removeChild(script);
				}

				return scripts;
			}

			util._removeExternalScripts = removeExternalScripts;

			/**
			 * Evaluates code, reason for a function is for an atomic call to evaluate code
			 * since most browsers fail to optimize functions with try-catch blocks, so this
			 * minimizes the effect, returns the function to run
			 * @param {string} code
			 * @return {Function}
			 * @static
			 * @member ns.util
			 */
			function safeEvalWrap(code) {
				return function () {
					try {
						window.eval(code);
					} catch (e) {
						if (e.stack) {
							ns.error(e.stack);
						} else if (e.name && e.message) {
							ns.error(e.name, e.message);
						} else {
							ns.error(e);
						}
					}
				};
			}

			util.safeEvalWrap = safeEvalWrap;

			/**
			 * Calls functions in supplied queue (array)
			 * @param {Array.<Function>} functionQueue
			 * @static
			 * @member ns.util
			 */
			function batchCall(functionQueue) {
				var i,
					length = functionQueue.length;

				for (i = 0; i < length; ++i) {
					functionQueue[i]();
				}
			}

			util.batchCall = batchCall;

			/**
			 * Creates new script elements for scripts gathered from a different document
			 * instance, blocks asynchronous evaluation (by renaming src attribute) and
			 * returns an array of functions to run to evaluate those scripts
			 * @param {Array.<HTMLElement>} scripts
			 * @param {HTMLElement} container
			 * @return {Array.<Function>}
			 * @protected
			 * @static
			 * @member ns.util
			 */
			function createScriptsSync(scripts, container) {
				var scriptElement,
					scriptBody,
					i,
					length,
					queue = [];

				// proper order of execution
				for (i = 0, length = scripts.length; i < length; ++i) {
					scriptBody = util.fetchSync(scripts[i].src, "text/plain");
					if (scriptBody) {
						scriptElement = document.adoptNode(scripts[i]);
						scriptElement.setAttribute("data-src", scripts[i].src);
						scriptElement.removeAttribute("src"); // block evaluation
						queue.push(util.safeEvalWrap(scriptBody));
						if (container) {
							container.appendChild(scriptElement);
						}
					}
				}

				return queue;
			}

			util._createScriptsSync = createScriptsSync;

			function removeInlineScripts(element) {
				var result = [],
					script;

				slice.call(element.querySelectorAll(
					"script:not([data-src]):not([type]):not([id]):not([src])"
					)).forEach(function (item) {
						script = document.createElement("script");
						script.innerText = item.textContent;
						// move attributes from original script element
						slice.call(item.attributes).forEach(function (attribute) {
							script.setAttribute(attribute.name, item.getAttribute(attribute.name));
						});
						item.parentNode.removeChild(item);
						result.push(script);
					});

				return result;
			}

			util._removeInlineScripts = removeInlineScripts;

			/**
			 * Method make asynchronous call of function
			 * @method async
			 * @inheritdoc #requestAnimationFrame
			 * @member ns.util
			 * @static
			 */
			util.async = util.requestAnimationFrame;

			/**
			 * Appends element from different document instance to current document in the
			 * container element and evaluates scripts (synchronously)
			 * @param {HTMLElement} element
			 * @param {HTMLElement} container
			 * @return {HTMLElement}
			 * @method importEvaluateAndAppendElement
			 * @member ns.util
			 * @static
			 */
			util.importEvaluateAndAppendElement = function (element, container) {
				var externalScriptsQueue =
						util._createScriptsSync(util._removeExternalScripts(element), element),
					inlineScripts = util._removeInlineScripts(element),
					newNode = document.importNode(element, true);

				container.appendChild(newNode); // append and eval inline
				inlineScripts.forEach(function (script) {
					container.appendChild(script);
				});
				util.batchCall(externalScriptsQueue);

				return newNode;
			};

			/**
			 * Checks if specified string is a number or not
			 * @method isNumber
			 * @param {string} query
			 * @return {boolean}
			 * @member ns.util
			 * @static
			 */
			util.isNumber = function (query) {
				var parsed = parseFloat(query);

				return !isNaN(parsed) && isFinite(parsed);
			};

			/**
			 * Reappear script tags to DOM structure to correct run script
			 * @method runScript
			 * @param {string} baseUrl
			 * @param {HTMLScriptElement} script
			 * @member ns.util
			 * @deprecated 2.3
			 */
			util.runScript = function (baseUrl, script) {
				var newScript = document.createElement("script"),
					scriptData,
					i,
					scriptAttributes = slice.call(script.attributes),
					src = script.getAttribute("src"),
					attribute,
					status;

				// 'src' may become null when none src attribute is set
				if (src !== null) {
					src = util.path.makeUrlAbsolute(src, baseUrl);
				}

				//Copy script tag attributes
				i = scriptAttributes.length;
				while (--i >= 0) {
					attribute = scriptAttributes[i];
					if (attribute.name !== "src") {
						newScript.setAttribute(attribute.name, attribute.value);
					} else {
						newScript.setAttribute("data-src", attribute.value);
					}
				}

				if (src) {
					scriptData = util.fetchSync(src, "text/plain");
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					if (!scriptData) {
						ns.warn("Failed to fetch and append external script. URL: " + src +
							"; response status: " + status);
					}
					//>>excludeEnd("tauDebug");
				} else {
					scriptData = script.textContent;
				}

				if (scriptData) {
					// add the returned content to a newly created script tag
					newScript.src = window.URL.createObjectURL(new Blob([scriptData], {type: "text/javascript"}));
					newScript.textContent = scriptData; // for compatibility with some libs ex. template systems
				}
				script.parentNode.replaceChild(newScript, script);
			};

			ns.util = util;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
