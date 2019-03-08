(function(window, document, undefined) {
'use strict';
var ns = window.tau = window.tau || {},
nsConfig = window.tauConfig = window.tauConfig || {};
nsConfig.rootNamespace = 'tau';
nsConfig.fileName = 'tau';
ns.version = '0.10.29-7';
/*global window, console, define */
/*jslint plusplus:true */
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
 *
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Core namespace
 * Object contains main framework methods.
 * @class ns
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (document) {
	"use strict";
			var idNumberCounter = 0,
			currentDate = +new Date(),
			slice = [].slice,
			rootNamespace = nsConfig.rootNamespace,
			fileName = nsConfig.fileName,
			infoForLog = function (args) {
				var dateNow = new Date();
				args.unshift("[" + rootNamespace + "][" + dateNow.toLocaleString() + "]");
			};

		/**
		* Return unique id
		* @method getUniqueId
		* @static
		* @return {string}
		* @member ns
		*/
		ns.getUniqueId = function () {
			return rootNamespace + "-" + ns.getNumberUniqueId() + "-" + currentDate;
		};

		/**
		* Return unique id
		* @method getNumberUniqueId
		* @static
		* @return {number}
		* @member ns
		*/
		ns.getNumberUniqueId = function () {
			return idNumberCounter++;
		};

		/**
		* logs supplied messages/arguments
		* @method log
		* @static
		* @param {...*} argument
		* @member ns
		*/
		ns.log = function () {
			var args = slice.call(arguments);
			infoForLog(args);
			if (console) {
				console.log.apply(console, args);
			}
		};

		/**
		* logs supplied messages/arguments ad marks it as warning
		* @method warn
		* @static
		* @param {...*} argument
		* @member ns
		*/
		ns.warn = function () {
			var args = slice.call(arguments);
			infoForLog(args);
			if (console) {
				console.warn.apply(console, args);
			}
		};

		/**
		* logs supplied messages/arguments and marks it as error
		* @method error
		* @static
		* @param {...*} argument
		* @member ns
		*/
		ns.error = function () {
			var args = slice.call(arguments);
			infoForLog(args);
			if (console) {
				console.error.apply(console, args);
			}
		};

		/**
		* get from nsConfig
		* @method getConfig
		* @param {string} key
		* @param {*} [defaultValue] value returned when config is not set
		* @return {*}
		* @static
		* @member ns
		*/
		ns.getConfig = function (key, defaultValue) {
			return nsConfig[key] === undefined ? defaultValue : nsConfig[key];
		};

		/**
		 * set in nsConfig
		 * @method setConfig
		 * @param {string} key
		 * @param {*} value
		 * @param {boolean} [asDefault=false] value should be treated as default (doesn't overwrites the config[key] if it already exists)
		 * @static
		 * @member ns
		*/
		ns.setConfig = function (key, value, asDefault) {
			if ((!asDefault || (asDefault && nsConfig[key] === undefined)) &&
					value !== undefined) {
				nsConfig[key] = value;
			}
		};

		/**
		 * Return path for framework script file.
		 * @method getFrameworkPath
		 * @returns {?string}
		 * @member ns
		 */
		ns.getFrameworkPath = function () {
			var scripts = document.getElementsByTagName("script"),
				countScripts = scripts.length,
				i,
				url,
				arrayUrl,
				count;
			for (i = 0; i < countScripts; i++) {
				url = scripts[i].src;
				arrayUrl = url.split("/");
				count = arrayUrl.length;
				if (arrayUrl[count - 1] === fileName + ".js" || arrayUrl[count - 1] === fileName + ".min.js") {
					return arrayUrl.slice(0, count - 1).join("/");
				}
			}
			return null;
		};

		}(window.document));

/*global window, define, XMLHttpRequest, console, Blob, ns, URL */
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
 *
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
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
(function (window, document) {
	"use strict";
				var currentFrame = null,
				/**
				 * requestAnimationFrame function
				 * @method requestAnimationFrame
				 * @static
				 * @member ns.util
				*/
				requestAnimationFrame = (window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function (callback) {
						currentFrame = window.setTimeout(callback.bind(callback, +new Date()), 1000 / 60);
					}).bind(window),
				util = ns.util || {},
				slice = [].slice;

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
			 * @private
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
						/*jshint -W061 */
						window.eval(code);
						/*jshint +W061 */
					} catch (e) {
						if (typeof console !== "undefined") {
							if (e.stack) {
								console.error(e.stack);
							} else if (e.name && e.message) {
								console.error(e.name, e.message);
							} else {
								console.error(e);
							}
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
					functionQueue[i].call(window);
				}
			}
			util.batchCall = batchCall;

			/**
			 * Creates new script elements for scripts gathered from a differnt document
			 * instance, blocks asynchronous evaluation (by renaming src attribute) and
			 * returns an array of functions to run to evalate those scripts
			 * @param {Array.<HTMLElement>} scripts
			 * @param {HTMLElement} container
			 * @return {Array.<Function>}
			 * @private
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
					scriptBody = fetchSync(scripts[i].src, "text/plain");
					if (scriptBody) {
						scriptElement = document.adoptNode(scripts[i]);
						scriptElement.setAttribute("data-src", scripts[i].src);
						scriptElement.removeAttribute("src"); // block evaluation
						queue.push(safeEvalWrap(scriptBody));
						if (container) {
							container.appendChild(scriptElement);
						}
					}
				}

				return queue;
			}

			util.requestAnimationFrame = requestAnimationFrame;

			/**
			* cancelAnimationFrame function
			* @method cancelAnimationFrame
			* @return {Function}
			* @member ns.util
			* @static
			*/
			util.cancelAnimationFrame = (window.cancelAnimationFrame ||
					window.webkitCancelAnimationFrame ||
					window.mozCancelAnimationFrame ||
					window.oCancelAnimationFrame ||
					window.msCancelAnimationFrame ||
					function () {
						// propably wont work if there is any more than 1
						// active animationFrame but we are trying anyway
					window.clearTimeout(currentFrame);
				}).bind(window);

			/**
			 * Method make asynchronous call of function
			 * @method async
			 * @inheritdoc #requestAnimationFrame
			 * @member ns.util
			 * @static
			 */
			util.async = requestAnimationFrame;

			/**
			 * Appends element from different document instance to current document in the
			 * container element and evaluates scripts (synchronously)
			 * @param {HTMLElement} element
			 * @param {HTMLElement} container
			 * @method importEvaluateAndAppendElement
			 * @member ns.util
			 * @static
			 */
			util.importEvaluateAndAppendElement = function (element, container) {
				var externalScriptsQueue = createScriptsSync(removeExternalScripts(element), element),
					newNode = document.importNode(element, true);

				container.appendChild(newNode); // append and eval inline
				batchCall(externalScriptsQueue);

				return newNode;
			};

			/**
			* Checks if specified string is a number or not
			* @method isNumber
			* @return {boolean}
			* @member ns.util
			* @static
			*/
			util.isNumber = function (query) {
				var parsed = parseFloat(query);
				return !isNaN(parsed) && isFinite(parsed);
			};

			/**
			 * Reappend script tags to DOM structure to correct run script
			 * @method runScript
			 * @param {string} baseUrl
			 * @param {HTMLScriptElement} script
			 * @member ns.util
			 * @deprecated 2.3
			 */
			util.runScript = function (baseUrl, script) {
				var newScript = document.createElement("script"),
					scriptData = null,
					i,
					scriptAttributes = slice.call(script.attributes),
					src = script.getAttribute("src"),
					path = util.path,
					attribute,
					status;

				// 'src' may become null when none src attribute is set
				if (src !== null) {
					src = path.makeUrlAbsolute(src, baseUrl);
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
					scriptData = fetchSync(src, "text/plain");
									} else {
					scriptData = script.textContent;
				}

				if (scriptData) {
					// add the returned content to a newly created script tag
					newScript.src = URL.createObjectURL(new Blob([scriptData], {type: "text/javascript"}));
					newScript.textContent = scriptData; // for compatibility with some libs ex. templating systems
				}
				script.parentNode.replaceChild(newScript, script);
			};

			ns.util = util;
			}(window, window.document));

/**
 *
 */
(function (window) {
	"use strict";
				var isarray = Array.isArray;

			pathToRegexp.parse = parse
			pathToRegexp.compile = compile
			pathToRegexp.tokensToFunction = tokensToFunction
			pathToRegexp.tokensToRegExp = tokensToRegExp

/**
 * Start original file
 * Licence MIT
 * https://github.com/pillarjs/path-to-regexp
 */
/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
	// Match escaped characters that would otherwise appear in future matches.
	// This allows the user to escape special characters that won't transform.
	'(\\\\.)',
	// Match Express-style parameters and un-named parameters with a prefix
	// and optional suffixes. Matches appear as:
	//
	// "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
	// "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
	'([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {String} str
 * @return {Array}
 */
function parse (str) {
	var tokens = []
	var key = 0
	var index = 0
	var path = ''
	var res

	while ((res = PATH_REGEXP.exec(str)) != null) {
		var m = res[0]
		var escaped = res[1]
		var offset = res.index
		path += str.slice(index, offset)
		index = offset + m.length

		// Ignore already escaped sequences.
		if (escaped) {
			path += escaped[1]
			continue
		}

		// Push the current path onto the tokens.
		if (path) {
			tokens.push(path)
			path = ''
		}

		var prefix = res[2]
		var name = res[3]
		var capture = res[4]
		var group = res[5]
		var suffix = res[6]

		var repeat = suffix === '+' || suffix === '*'
		var optional = suffix === '?' || suffix === '*'
		var delimiter = prefix || '/'

		tokens.push({
			name: name || key++,
			prefix: prefix || '',
			delimiter: delimiter,
			optional: optional,
			repeat: repeat,
			pattern: escapeGroup(capture || group || '[^' + delimiter + ']+?')
		})
	}

	// Match any characters still remaining.
	if (index < str.length) {
		path += str.substr(index)
	}

	// If the path exists, push it onto the end.
	if (path) {
		tokens.push(path)
	}

	return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {String}   str
 * @return {Function}
 */
function compile (str) {
	return tokensToFunction(parse(str))
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
	// Compile all the tokens into regexps.
	var matches = new Array(tokens.length)

	// Compile all the patterns before compilation.
	for (var i = 0; i < tokens.length; i++) {
		if (typeof tokens[i] === 'object') {
			matches[i] = new RegExp('^' + tokens[i].pattern + '$')
		}
	}

	return function (obj) {
		var path = ''

		obj = obj || {}

		for (var i = 0; i < tokens.length; i++) {
			var key = tokens[i]

			if (typeof key === 'string') {
				path += key

				continue
			}

			var value = obj[key.name]

			if (value == null) {
				if (key.optional) {
					continue
				} else {
					throw new TypeError('Expected "' + key.name + '" to be defined')
				}
			}

			if (isarray(value)) {
				if (!key.repeat) {
					throw new TypeError('Expected "' + key.name + '" to not repeat')
				}

				if (value.length === 0) {
					if (key.optional) {
						continue
					} else {
						throw new TypeError('Expected "' + key.name + '" to not be empty')
					}
				}

				for (var j = 0; j < value.length; j++) {
					if (!matches[i].test(value[j])) {
						throw new TypeError('Expected all "' + key.name + '" to match "' + key.pattern + '"')
					}

					path += (j === 0 ? key.prefix : key.delimiter) + encodeURIComponent(value[j])
				}

				continue
			}

			if (!matches[i].test(value)) {
				throw new TypeError('Expected "' + key.name + '" to match "' + key.pattern + '"')
			}

			path += key.prefix + encodeURIComponent(value)
		}

		return path
	}
}

/**
 * Escape a regular expression string.
 *
 * @param  {String} str
 * @return {String}
 */
function escapeString (str) {
	return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
	return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
function attachKeys (re, keys) {
	re.keys = keys
	return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */
function flags (options) {
	return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */
function regexpToRegexp (path, keys) {
	// Use a negative lookahead to match only capturing groups.
	var groups = path.source.match(/\((?!\?)/g)

	if (groups) {
		for (var i = 0; i < groups.length; i++) {
			keys.push({
				name: i,
				prefix: null,
				delimiter: null,
				optional: false,
				repeat: false,
				pattern: null
			})
		}
	}

	return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function arrayToRegexp (path, keys, options) {
	var parts = []

	for (var i = 0; i < path.length; i++) {
		parts.push(pathToRegexp(path[i], keys, options).source)
	}

	var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

	return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function stringToRegexp (path, keys, options) {
	var tokens = parse(path)
	var re = tokensToRegExp(tokens, options)

	// Attach keys back to the regexp.
	for (var i = 0; i < tokens.length; i++) {
		if (typeof tokens[i] !== 'string') {
			keys.push(tokens[i])
		}
	}

	return attachKeys(re, keys)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {Array}  tokens
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function tokensToRegExp (tokens, options) {
	options = options || {}

	var strict = options.strict
	var end = options.end !== false
	var route = ''
	var lastToken = tokens[tokens.length - 1]
	var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

	// Iterate over the tokens and create our regexp string.
	for (var i = 0; i < tokens.length; i++) {
		var token = tokens[i]

		if (typeof token === 'string') {
			route += escapeString(token)
		} else {
			var prefix = escapeString(token.prefix)
			var capture = token.pattern

			if (token.repeat) {
				capture += '(?:' + prefix + capture + ')*'
			}

			if (token.optional) {
				if (prefix) {
					capture = '(?:' + prefix + '(' + capture + '))?'
				} else {
					capture = '(' + capture + ')?'
				}
			} else {
				capture = prefix + '(' + capture + ')'
			}

			route += capture
		}
	}

	// In non-strict mode we allow a slash at the end of match. If the path to
	// match already ends with a slash, we remove it for consistency. The slash
	// is valid at the end of a path match, not in the middle. This is important
	// in non-ending mode, where "/test/" shouldn't match "/test//route".
	if (!strict) {
		route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
	}

	if (end) {
		route += '$'
	} else {
		// In non-ending mode, we need the capturing groups to match as much as
		// possible by using a positive lookahead to the end or next path segment.
		route += strict && endsWithSlash ? '' : '(?=\\/|$)'
	}

	return new RegExp('^' + route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [
 *
 * options]
 * @return {RegExp}
 */
function pathToRegexp (path, keys, options) {
	keys = keys || []

	if (!isarray(keys)) {
		options = keys
		keys = []
	} else if (!options) {
		options = {}
	}

	if (path instanceof RegExp) {
		return regexpToRegexp(path, keys, options)
	}

	if (isarray(path)) {
		return arrayToRegexp(path, keys, options)
	}

	return stringToRegexp(path, keys, options)
}

/**
 * End original file
 */
			window.pathToRegexp = pathToRegexp;
			}(window));
/*global define, ns */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Path to Regexp Utility
 * Convert string to regext and can match path string to one defined regex path
 *
 * Syntax of paths is the same as in Express for nodejs
 *
 * Library based on https://github.com/pillarjs/path-to-regexp
 * @class ns.util.pathToRegexp
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 *
 */
(function (window) {
	"use strict";
	
			ns.util.pathToRegexp = window.pathToRegexp;

			}(window));

/*global define, NodeList, ns */
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
 *
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Array Utility
 * Utility helps work with arrays.
 * @class ns.util.array
 */
(function (ns) {
	"use strict";
				/**
			 * Create an array containing the range of integers or characters
			 * from low to high (inclusive)
			 * @method range
			 * @param {number|string} low
			 * @param {number|string} high
			 * @param {number} step
			 * @static
			 * @return {Array} array containing continous elements
			 * @member ns.util.array
			 */
			function range(low, high, step) {
				// Create an array containing the range of integers or characters
				// from low to high (inclusive)
				//
				// version: 1107.2516
				// discuss at: http://phpjs.org/functions/range
				// +   original by: Waldo Malqui Silva
				// *	example 1: range ( 0, 12 );
				// *	returns 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
				// *	example 2: range( 0, 100, 10 );
				// *	returns 2: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
				// *	example 3: range( 'a', 'i' );
				// *	returns 3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
				// *	example 4: range( 'c', 'a' );
				// *	returns 4: ['c', 'b', 'a']
				var matrix = [],
					inival,
					endval,
					plus,
					walker = step || 1,
					chars = false;

				if (!isNaN(low) && !isNaN(high)) {
					inival = low;
					endval = high;
				} else if (isNaN(low) && isNaN(high)) {
					chars = true;
					inival = low.charCodeAt(0);
					endval = high.charCodeAt(0);
				} else {
					inival = (isNaN(low) ? 0 : low);
					endval = (isNaN(high) ? 0 : high);
				}

				plus = inival <= endval;
				if (plus) {
					while (inival <= endval) {
						matrix.push((chars ? String.fromCharCode(inival) : inival));
						inival += walker;
					}
				} else {
					while (inival >= endval) {
						matrix.push((chars ? String.fromCharCode(inival) : inival));
						inival -= walker;
					}
				}

				return matrix;
			}

			/**
			 * Check object is arraylike (arraylike include array and
			 * collection)
			 * @method isArrayLike
			 * @param {Object} object
			 * @return {boolean} Whether arraylike object or not
			 * @member ns.util.array
			 * @static
			 */
			function isArrayLike(object) {
				var type = typeof object,
					length = object && object.length;

				// if object exists and is different from window
				// window object has length property
				if (object && object !== object.window) {
					// If length value is not number, object is not array and collection.
					// Collection type is not array but has length value.
					// e.g) Array.isArray(document.childNodes) ==> false
					return Array.isArray(object) || object instanceof NodeList || type === "function" &&
						(length === 0 || typeof length === "number" && length > 0 && (length - 1) in object);
				}
				return false;
			}

			/**
			 * Faster version of standard forEach method in array
			 * Confirmed that this method is 20 times faster then native
			 * @method forEach
			 * @param {Array} array
			 * @param {Function} callback
			 * @member ns.util.array
			 * @static
			 */
			function forEach(array, callback) {
				var i,
					length;
				if (!(array instanceof Array)) {
					array = [].slice.call(array);
				}
				length = array.length;
				for (i = 0; i < length; i++) {
					callback(array[i], i, array);
				}
			}


			/**
			 * Faster version of standard filter method in array
			 * @method filter
			 * @param {Array} array
			 * @param {Function} callback
			 * @member ns.util.array
			 * @static
			 */
			function filter(array, callback) {
				var result = [],
					i,
					length,
					value;
				if (!(array instanceof Array)) {
					array = [].slice.call(array);
				}
				length = array.length;
				for (i = 0; i < length; i++) {
					value = array[i];
					if (callback(value, i, array)) {
						result.push(value);
					}
				}
				return result;
			}

			/**
			 * Faster version of standard map method in array
			 * Confirmed that this method is 60% faster then native
			 * @method map
			 * @param {Array} array
			 * @param {Function} callback
			 * @member ns.util.array
			 * @static
			 */
			function map(array, callback) {
				var result = [],
					i,
					length;
				if (!(array instanceof Array)) {
					array = [].slice.call(array);
				}
				length = array.length;
				for (i = 0; i < length; i++) {
					result.push(callback(array[i], i, array));
				}
				return result;
			}

			/**
			 * Faster version of standard reduce method in array
			 * Confirmed that this method is 60% faster then native
			 * @method reduce
			 * @param {Array} array
			 * @param {Function} callback
			 * @param {*} [initialValue]
			 * @member ns.util.array
			 * @return {*}
			 * @static
			 */
			function reduce(array, callback, initialValue) {
				var i,
					length,
					value,
					result = initialValue;
				if (!(array instanceof Array)) {
					array = [].slice.call(array);
				}
				length = array.length;
				for (i = 0; i < length; i++) {
					value = array[i];
					if (result === undefined && i === 0) {
						result = value;
					} else {
						result = callback(result, value, i, array);
					}
				}
				return result;
			}

			ns.util.array = {
				range: range,
				isArrayLike: isArrayLike,
				forEach: forEach,
				filter: filter,
				map: map,
				reduce: reduce
			};

			}(ns));

/*global ns, define, CustomEvent */
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
 *
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Events
 *
 * The Tizen Advanced UI (TAU) framework provides events optimized for the Tizen
 * Web application. The following table displays the events provided by the TAU
 * framework.
 * @class ns.event
 */
(function (window) {
	"use strict";
	
			/**
			* Checks if specified variable is a array or not
			* @method isArray
			* @return {boolean}
			* @member ns.event
			* @private
			* @static
			*/
		var isArray = Array.isArray,
			isArrayLike = ns.util.array.isArrayLike,
			/**
			 * @property {RegExp} SPLIT_BY_SPACES_REGEXP
			 */
			SPLIT_BY_SPACES_REGEXP = /\s+/g,

			/**
			 * Returns trimmed value
			 * @method trim
			 * @param {string} value
			 * @return {string} trimmed string
			 * @static
			 * @private
			 * @member ns.event
			 */
			trim = function (value) {
				return value.trim();
			},

			/**
			 * Split string to array
			 * @method getEventsListeners
			 * @param {string|Array|Object} names string with one name of event, many names of events divided by spaces, array with names of widgets or object in which keys are names of events and values are callbacks
			 * @param {Function} globalListener
			 * @return {Array}
			 * @static
			 * @private
			 * @member ns.event
			 */
			getEventsListeners = function (names, globalListener) {
				var name,
					result = [],
					i;

				if (typeof names === "string") {
					names = names.split(SPLIT_BY_SPACES_REGEXP).map(trim);
				}

				if (isArray(names)) {
					for (i=0; i<names.length; i++) {
						result.push({type: names[i], callback: globalListener});
					}
				} else {
					for (name in names) {
						if (names.hasOwnProperty(name)) {
							result.push({type: name, callback: names[name]});
						}
					}
				}
				return result;
			},
			// cached slice method
			arraySlice = [].slice;

			/**
			 * Temporary Callback to support one call of event
			 * @param elements
			 * @param callbacks
			 * @param listeners
			 * @param useCapture
			 * @param i
			 * @param j
			 */
			function oneEventCallback(elements, callbacks, listeners, useCapture, i, j) {
				// take only event object
				var args = arraySlice.call(arguments, 6);
				ns.event.fastOff(elements[i], listeners[j].type, callbacks[i][j], useCapture);
				/*jshint -W040 */
				// using here this is correct because we want to have this the same as in original
				// event listner
				listeners[j].callback.apply(this, args);
				/*jshint +W040 */
			}

			ns.event = {

				/**
				* Triggers custom event fastOn element
				* The return value is false, if at least one of the event
				* handlers which handled this event, called preventDefault.
				* Otherwise it returns true.
				* @method trigger
				* @param {HTMLElement|HTMLDocument} element
				* @param {string} type
				* @param {?*} [data=null]
				* @param {boolean=} [bubbles=true]
				* @param {boolean=} [cancelable=true]
				* @return {boolean}
				* @member ns.event
				* @static
				*/
				trigger: function (element, type, data, bubbles, cancelable) {
					var evt = new CustomEvent(type, {
							"detail": data,
							//allow event to bubble up, required if we want to allow to listen fastOn document etc
							bubbles: typeof bubbles === "boolean" ? bubbles : true,
							cancelable: typeof cancelable === "boolean" ? cancelable : true
						});
										return element.dispatchEvent(evt);
				},

				/**
				 * Prevent default on original event
				 * @method preventDefault
				 * @param {Event} event
				 * @member ns.event
				 * @static
				 */
				preventDefault: function (event) {
					var originalEvent = event._originalEvent;
					// @todo this.isPropagationStopped = returnTrue;
					if (originalEvent && originalEvent.preventDefault) {
						originalEvent.preventDefault();
					}
					event.preventDefault();
				},

				/**
				* Stop event propagation
				* @method stopPropagation
				* @param {Event} event
				* @member ns.event
				* @static
				*/
				stopPropagation: function (event) {
					var originalEvent = event._originalEvent;
					// @todo this.isPropagationStopped = returnTrue;
					if (originalEvent && originalEvent.stopPropagation) {
						originalEvent.stopPropagation();
					}
					event.stopPropagation();
				},

				/**
				* Stop event propagation immediately
				* @method stopImmediatePropagation
				* @param {Event} event
				* @member ns.event
				* @static
				*/
				stopImmediatePropagation: function (event) {
					var originalEvent = event._originalEvent;
					// @todo this.isPropagationStopped = returnTrue;
					if (originalEvent && originalEvent.stopImmediatePropagation) {
						originalEvent.stopImmediatePropagation();
					}
					event.stopImmediatePropagation();
				},

				/**
				 * Return document relative cords for event
				 * @method documentRelativeCoordsFromEvent
				 * @param {Event} event
				 * @return {Object}
				 * @return {number} return.x
				 * @return {number} return.y
				 * @member ns.event
				 * @static
				 */
				documentRelativeCoordsFromEvent: function(event) {
					var _event = event ? event : window.event,
							client = {
								x: _event.clientX,
								y: _event.clientY
							},
							page = {
								x: _event.pageX,
								y: _event.pageY
							},
							posX = 0,
							posY = 0,
							touch0,
							body = document.body,
							documentElement = document.documentElement;

						if (event.type.match(/^touch/)) {
							touch0 = _event.targetTouches[0] || _event.originalEvent.targetTouches[0];
							page = {
								x: touch0.pageX,
								y: touch0.pageY
							};
							client = {
								x: touch0.clientX,
								y: touch0.clientY
							};
						}

						if (page.x || page.y) {
							posX = page.x;
							posY = page.y;
						}
						else if (client.x || client.y) {
							posX = client.x + body.scrollLeft + documentElement.scrollLeft;
							posY = client.y + body.scrollTop  + documentElement.scrollTop;
						}

						return { x: posX, y: posY };
				},

				/**
				 * Return target relative cords for event
				 * @method targetRelativeCoordsFromEvent
				 * @param {Event} event
				 * @return {Object}
				 * @return {number} return.x
				 * @return {number} return.y
				 * @member ns.event
				 * @static
				 */
				targetRelativeCoordsFromEvent: function(event) {
					var target = event.target,
						cords = {
							x: event.offsetX,
							y: event.offsetY
						};

					if (cords.x === undefined || isNaN(cords.x) ||
						cords.y === undefined || isNaN(cords.y)) {
						cords = ns.event.documentRelativeCoordsFromEvent(event);
						cords.x -= target.offsetLeft;
						cords.y -= target.offsetTop;
					}

					return cords;
				},

				/**
				 * Add event listener to element
				 * @method fastOn
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				fastOn: function(element, type, listener, useCapture) {
					element.addEventListener(type, listener, useCapture || false);
				},

				/**
				 * Remove event listener to element
				 * @method fastOff
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				fastOff: function(element, type, listener, useCapture) {
					element.removeEventListener(type, listener, useCapture || false);
				},

				/**
				 * Add event listener to element with prefixes for all browsers
				 *
				 *	@example
				 * 		tau.event.prefixedFastOn(document, "animationEnd", function() {
				 *			console.log("animation ended");
				 *		});
				 *		// write "animation ended" on console on event "animationEnd", "webkitAnimationEnd", "mozAnimationEnd", "msAnimationEnd", "oAnimationEnd"
				 *
				 * @method fastPrefixedOn
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				prefixedFastOn: function(element, type, listener, useCapture) {
					var nameForPrefix = type.charAt(0).toLocaleUpperCase() + type.substring(1);

					element.addEventListener(type.toLowerCase(), listener, useCapture || false);
					element.addEventListener("webkit" + nameForPrefix, listener, useCapture || false);
					element.addEventListener("moz" + nameForPrefix, listener, useCapture || false);
					element.addEventListener("ms" + nameForPrefix, listener, useCapture || false);
					element.addEventListener("o" + nameForPrefix.toLowerCase(), listener, useCapture || false);
				},

				/**
				 * Remove event listener to element with prefixes for all browsers
				 *
				 *	@example
				 *		tau.event.prefixedFastOff(document, "animationEnd", functionName);
				 *		// remove listeners functionName on events "animationEnd", "webkitAnimationEnd", "mozAnimationEnd", "msAnimationEnd", "oAnimationEnd"
				 *
				 * @method fastPrefixedOff
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				prefixedFastOff: function(element, type, listener, useCapture) {
					var nameForPrefix = type.charAt(0).toLocaleUpperCase() + type.substring(1);

					element.removeEventListener(type.toLowerCase(), listener, useCapture || false);
					element.removeEventListener("webkit" + nameForPrefix, listener, useCapture || false);
					element.removeEventListener("moz" + nameForPrefix, listener, useCapture || false);
					element.removeEventListener("ms" + nameForPrefix, listener, useCapture || false);
					element.removeEventListener("o" + nameForPrefix.toLowerCase(), listener, useCapture || false);
				},

				/**
				 * Add event listener to element that can be added addEventListner
				 * @method on
				 * @param {HTMLElement|HTMLDocument|Window} element
				 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				on: function(element, type, listener, useCapture) {
					var i,
						j,
						elementsLength,
						typesLength,
						elements,
						listeners;

					if (isArrayLike(element)) {
						elements = element;
					} else {
						elements = [element];
					}
					elementsLength = elements.length;
					listeners = getEventsListeners(type, listener);
					typesLength = listeners.length;
					for (i = 0; i < elementsLength; i++) {
						if (typeof elements[i].addEventListener === "function") {
							for (j = 0; j < typesLength; j++) {
								ns.event.fastOn(elements[i], listeners[j].type, listeners[j].callback, useCapture);
							}
						}
					}
				},

				/**
				 * Remove event listener to element
				 * @method off
				 * @param {HTMLElement|HTMLDocument|Window} element
				 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				off: function(element, type, listener, useCapture) {
					var i,
						j,
						elementsLength,
						typesLength,
						elements,
						listeners;
					if (isArrayLike(element)) {
						elements = element;
					} else {
						elements = [element];
					}
					elementsLength = elements.length;
					listeners = getEventsListeners(type, listener);
					typesLength = listeners.length;
					for (i = 0; i < elementsLength; i++) {
						if (typeof elements[i].addEventListener === "function") {
							for (j = 0; j < typesLength; j++) {
								ns.event.fastOff(elements[i], listeners[j].type, listeners[j].callback, useCapture);
							}
						}
					}
				},

				/**
				 * Add event listener to element only for one trigger
				 * @method one
				 * @param {HTMLElement|HTMLDocument|window} element
				 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				one: function(element, type, listener, useCapture) {
					var i,
						j,
						elementsLength,
						typesLength,
						elements,
						listeners,
						callbacks = [];
					// convert single element to array
					if (isArrayLike(element)) {
						elements = arraySlice.call(element);
					} else {
						elements = [element];
					}
					elementsLength = elements.length;
					// pair type with listener
					listeners = getEventsListeners(type, listener);
					typesLength = listeners.length;
					// on each element
					for (i = 0; i < elementsLength; i++) {
						// if element has possibility of add listener
						if (typeof elements[i].addEventListener === "function") {
							callbacks[i] = [];
							// for each event type
							for (j = 0; j < typesLength; j++) {
								// prepare temporary callback which will be removed after call
								callbacks[i][j] = oneEventCallback.bind(null, elements, callbacks, listeners, useCapture, i, j);
								// bind temporary callback
								ns.event.fastOn(elements[i], listeners[j].type, callbacks[i][j], useCapture);
							}
						}
					}
				}

			};

			}(window));

/*global define, ns */
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
 *
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Object Utility
 * Object contains functions help work with objects.
 * @class ns.util.object
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function () {
	"use strict";
	
			var object = {
				/**
				* Copy object to new object
				* @method copy
				* @param {Object} orgObject
				* @return {Object}
				* @static
				* @member ns.util.object
				*/
				copy: function (orgObject) {
					return object.merge({}, orgObject);
				},

				/**
				* Attach fields from second object to first object.
				* @method fastMerge
				* @param {Object} newObject
				* @param {Object} orgObject
				* @return {Object}
				* @static
				* @member ns.util.object
				*/
				fastMerge: function (newObject, orgObject) {
					var key;
					for (key in orgObject) {
						if (orgObject.hasOwnProperty(key)) {
							newObject[key] = orgObject[key];
						}
					}
					return newObject;
				},

				/**
				* Attach fields from second and next object to first object.
				* @method merge
				* @param {Object} newObject
				* @param {...Object} orgObject
				* @param {?boolean} [override=true]
				* @return {Object}
				* @static
				* @member ns.util.object
				*/
				merge: function ( /* newObject, orgObject, override */ ) {
					var newObject, orgObject, override,
						key,
						args = [].slice.call(arguments),
						argsLength = args.length,
						i;
					newObject = args.shift();
					override = true;
					if (typeof arguments[argsLength-1] === "boolean") {
						override = arguments[argsLength-1];
						argsLength--;
					}
					for (i = 0; i < argsLength; i++) {
						orgObject = args.shift();
						if (orgObject !== null) {
							for (key in orgObject) {
								if (orgObject.hasOwnProperty(key) && ( override || newObject[key] === undefined )) {
									newObject[key] = orgObject[key];
								}
							}
						}
					}
					return newObject;
				},

				/**
				 * Function add to Constructor prototype Base object and add to prototype properties and methods from
				 * prototype object.
				 * @method inherit
				 * @param {Function} Constructor
				 * @param {Function} Base
				 * @param {Object} prototype
				 * @static
				 * @member ns.util.object
				 */
				/* jshint -W083 */
				inherit: function( Constructor, Base, prototype ) {
					var basePrototype = new Base(),
						property,
						value;
					for (property in prototype) {
						if (prototype.hasOwnProperty(property)) {
							value = prototype[property];
							if ( typeof value === "function" ) {
								basePrototype[property] = (function createFunctionWithSuper(Base, property, value) {
									var _super = function() {
										var superFunction = Base.prototype[property];
										if (superFunction) {
											return superFunction.apply(this, arguments);
										}
										return null;
									};
									return function() {
										var __super = this._super,
											returnValue;

										this._super = _super;
										returnValue = value.apply(this, arguments);
										this._super = __super;
										return returnValue;
									};
								}(Base, property, value));
							} else {
								basePrototype[property] = value;
							}
						}
					}

					Constructor.prototype = basePrototype;
					Constructor.prototype.constructor = Constructor;
				},

				/**
				 * Returns true if every property value corresponds value from 'value' argument
				 * @method hasPropertiesOfValue
				 * @param {Object} obj
				 * @param {*} [value=undefined]
				 * @return {boolean}
				 */
				hasPropertiesOfValue: function (obj, value) {
					var keys = Object.keys(obj),
						i = keys.length;

					// Empty array should return false
					if (i === 0) {
						return false;
					}

					while (--i >= 0) {
						if (obj[keys[i]] !== value) {
							return false;
						}
					}

					return true;
				},

				/**
				 * Remove properties from object.
				 * @method removeProperties
				 * @param {Object} object
				 * @param {Array} propertiesToRemove
				 * @return {Object}
				 */
				removeProperties: function (object, propertiesToRemove) {
					var length = propertiesToRemove.length,
						property,
						i;

					for (i = 0; i < length; i++) {
						property = propertiesToRemove[i];
						if (object.hasOwnProperty(property)) {
							delete object[property];
						}
					}
					return object;
				}
			};
			ns.util.object = object;
			}());

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
 *
 * Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #History
 * Object controls history changes.
 *
 * @class ns.history
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window) {
	"use strict";
				var historyVolatileMode,
				object = ns.util.object,
				historyUid = 0,
				historyActiveIndex = 0,
				windowHistory = window.history,
				history = {
					/**
					 * Property contains active state in history.
					 * @property {Object} activeState
					 * @static
					 * @member ns.history
					 */
					activeState : null,

					/**
					 * This method replaces or pushes state to history.
					 * @method replace
					 * @param {Object} state The state object
					 * @param {string} stateTitle The title of state
					 * @param {string} url The new history entry's URL
					 * @static
					 * @member ns.history
					 */
					replace: function (state, stateTitle, url) {
						var newState = object.merge({}, state, {
								uid: historyVolatileMode ? historyActiveIndex : ++historyUid,
								stateUrl: url,
								stateTitle: stateTitle
							});
						windowHistory[historyVolatileMode ? "replaceState" : "pushState"](newState, stateTitle, url);
						history.setActive(newState);
					},

					/**
					 * This method moves backward through history.
					 * @method back
					 * @static
					 * @member ns.history
					 */
					back: function () {
						windowHistory.back();
					},

					/**
					 * This method sets active state.
					 * @method setActive
					 * @param {Object} state Activated state
					 * @static
					 * @member ns.history
					 */
					setActive: function (state) {
						if (state) {
							history.activeState = state;
							historyActiveIndex = state.uid;

							if (state.volatileRecord) {
								history.enableVolatileMode();
								return;
							}
						}

						history.disableVolatileMode();
					},

					/**
					 * This method returns "back" if state is in history or "forward" if it is new state.
					 * @method getDirection
					 * @param {Object} state Checked state
					 * @return {"back"|"forward"}
					 * @static
					 * @member ns.history
					 */
					getDirection: function (state) {
						if (state) {
							return state.uid < historyActiveIndex ? "back" : "forward";
						}
						return "back";
					},

					/**
					 * This method sets volatile mode to true.
					 * @method enableVolatileMode
					 * @static
					 * @member ns.history
					 */
					enableVolatileMode: function () {
						historyVolatileMode = true;
					},

					/**
					 * This method sets volatile mode to false.
					 * @method disableVolatileMode
					 * @static
					 * @member ns.history
					 */
					disableVolatileMode: function () {
						historyVolatileMode = false;
					}
				};
			ns.history = history;
			}(window));

/*global CustomEvent, define, window, ns */
/*jslint plusplus: true, nomen: true, bitwise: true */
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
 * #Virtual Mouse Events
 * Reimplementation of jQuery Mobile virtual mouse events.
 *
 * ##Purpose
 * It will let for users to register callbacks to the standard events like bellow,
 * without knowing if device support touch or mouse events
 * @class ns.event.vmouse
 */
/**
 * Triggered after mouse-down or touch-started.
 * @event vmousedown
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-click or touch-end when touch-move didn't occur
 * @event vclick
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-up or touch-end
 * @event vmouseup
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-move or touch-move
 * @event vmousemove
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-over or touch-start if went over coordinates
 * @event vmouseover
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-out or touch-end
 * @event vmouseout
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-cancel or touch-cancel and when scroll occur during touchmove
 * @event vmousecancel
 * @member ns.event.vmouse
 */
(function (window, document) {
	"use strict";
				/**
			 * Object with default options
			 * @property {Object} vmouse
			 * @member ns.event.vmouse
			 * @static
			 * @private
			 **/
			var vmouse,
				/**
				 * @property {Object} eventProps Contains the properties which are copied from the original event to custom v-events
				 * @member ns.event.vmouse
				 * @static
				 * @private
				 **/
				eventProps,
				/**
				 * Indicates if the browser support touch events
				 * @property {boolean} touchSupport
				 * @member ns.event.vmouse
				 * @static
				 **/
				touchSupport = window.hasOwnProperty("ontouchstart"),
				/**
				 * @property {boolean} didScroll The flag tell us if the scroll event was triggered
				 * @member ns.event.vmouse
				 * @static
				 * @private
				 **/
				didScroll,
				/** @property {HTMLElement} lastOver holds reference to last element that touch was over
				 * @member ns.event.vmouse
				 * @private
				 */
				lastOver = null,
				/**
				 * @property {Number} [startX=0] Initial data for touchstart event
				 * @member ns.event.vmouse
				 * @static
				 * @private
				 **/
				startX = 0,
				/**
				 * @property {Number} [startY=0] Initial data for touchstart event
				 * @member ns.event.vmouse
				 * @private
				 * @static
				 **/
				startY = 0,
				touchEventProps = ["clientX", "clientY", "pageX", "pageY", "screenX", "screenY"],
				KEY_CODES = {
					enter: 13
				};

			/**
			 * Extends objects with other objects
			 * @method copyProps
			 * @param {Object} from Sets the original event
			 * @param {Object} to Sets the new event
			 * @param {Object} properties Sets the special properties for position
			 * @param {Object} propertiesNames Describe parameters which will be copied from Original to To event
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function copyProps(from, to, properties, propertiesNames) {
				var i,
					length,
					descriptor,
					property;

				for (i = 0, length = propertiesNames.length; i < length; ++i) {
					property = propertiesNames[i];
					if (isNaN(properties[property]) === false || isNaN(from[property]) === false) {
						descriptor = Object.getOwnPropertyDescriptor(to, property);
						if (!descriptor || descriptor.writable) {
							to[property] = properties[property] || from[property];
						}
					}
				}
			}

			/**
			 * Create custom event
			 * @method createEvent
			 * @param {string} newType gives a name for the new Type of event
			 * @param {Event} original Event which trigger the new event
			 * @param {Object} properties Sets the special properties for position
			 * @return {Event}
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function createEvent(newType, original, properties) {
				var evt = new CustomEvent(newType, {
						"bubbles": original.bubbles,
						"cancelable": original.cancelable,
						"detail": properties.detail || original.detail
					}),
					orginalType = original.type,
					changeTouches,
					touch,
					j = 0,
					len,
					prop;

				copyProps(original, evt, properties, eventProps);
				evt._originalEvent = original;

				if (orginalType.indexOf("touch") !== -1) {
					orginalType = original.touches;
					changeTouches = original.changedTouches;

					if (orginalType && orginalType.length) {
						touch = orginalType[0];
					} else {
						touch = (changeTouches && changeTouches.length) ? changeTouches[0] : null;
					}

					if (touch) {
						for (len = touchEventProps.length; j < len; j++) {
							prop = touchEventProps[j];
							evt[prop] = touch[prop];
						}
					}
				}

				return evt;
			}

			/**
			 * Dispatch Events
			 * @method fireEvent
			 * @param {string} eventName event name
			 * @param {Event} evt original event
			 * @param {Object} [properties] Sets the special properties for position
			 * @return {boolean}
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function fireEvent(eventName, evt, properties) {
				return evt.target.dispatchEvent(createEvent(eventName, evt, properties || {}));
			}

			eventProps = [
				"currentTarget",
				"button",
				"buttons",
				"clientX",
				"clientY",
				"offsetX",
				"offsetY",
				"pageX",
				"pageY",
				"screenX",
				"screenY",
				"toElement",
				"which"
			];

			vmouse = {
				/**
				 * Sets the distance of pixels after which the scroll event will be successful
				 * @property {number} [eventDistanceThreshold=10]
				 * @member ns.event.vmouse
				 * @static
				 */
				eventDistanceThreshold: 10,

				touchSupport: touchSupport
			};

			/**
			 * Handle click down
			 * @method handleDown
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleDown(evt) {
				fireEvent("vmousedown", evt);
			}

			/**
			 * Prepare position of event for keyboard events.
			 * @method preparePositionForClick
			 * @param {Event} event
			 * @return {?Object} options
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function preparePositionForClick(event) {
				var x = event.clientX,
					y = event.clientY;
				// event comes from keyboard
				if (!x && !y) {
					return preparePositionForEvent(event);
				}
			}

			/**
			 * Handle click
			 * @method handleClick
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleClick(evt) {
				fireEvent("vclick", evt, preparePositionForClick(evt));
			}

			/**
			 * Handle click up
			 * @method handleUp
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleUp(evt) {
				fireEvent("vmouseup", evt);
			}

			/**
			 * Handle click move
			 * @method handleMove
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleMove(evt) {
				fireEvent("vmousemove", evt);
			}

			/**
			 * Handle click over
			 * @method handleOver
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleOver(evt) {
				fireEvent("vmouseover", evt);
			}

			/**
			 * Handle click out
			 * @method handleOut
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleOut(evt) {
				fireEvent("vmouseout", evt);
			}

			/**
			 * Handle touch start
			 * @method handleTouchStart
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchStart(evt) {
				var touches = evt.touches,
					firstTouch,
					over;
				//if touches are registered and we have only one touch
				if (touches && touches.length === 1) {
					didScroll = false;
					firstTouch = touches[0];
					startX = firstTouch.pageX;
					startY = firstTouch.pageY;

					// Check if we have touched something on our page
					// @TODO refactor for multi touch
					over = document.elementFromPoint(startX, startY);
					if (over) {
						lastOver = over;
						fireEvent("vmouseover", evt);
					}
					fireEvent("vmousedown", evt);
				}

			}

			/**
			 * Handle touch end
			 * @method handleTouchEnd
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchEnd(evt) {
				var touches = evt.touches;
				if (touches && touches.length === 0) {
					fireEvent("vmouseup", evt);
					fireEvent("vmouseout", evt);
					// Reset flag for last over element
					lastOver = null;
				}
			}

			/**
			 * Handle touch move
			 * @method handleTouchMove
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchMove(evt) {
				var over,
					firstTouch = evt.touches && evt.touches[0],
					didCancel = didScroll,
				//sets the threshold, based on which we consider if it was the touch-move event
					moveThreshold = vmouse.eventDistanceThreshold;

				/**
				 * Ignore the touch which has identifier other than 0.
				 * Only first touch has control others are ignored.
				 * Patch for webkit behaviour where touchmove event
				 * is triggered between touchend events
				 * if there is multi touch.
				 */
				if (firstTouch.identifier > 0) {
					evt.preventDefault();
					evt.stopPropagation();
					return;
				}

				didScroll = didScroll ||
					//check in both axes X,Y if the touch-move event occur
					(Math.abs(firstTouch.pageX - startX) > moveThreshold ||
						Math.abs(firstTouch.pageY - startY) > moveThreshold);

				// detect over event
				// for compatibility with mouseover because "touchenter" fires only once
				// @TODO Handle many touches
				over = document.elementFromPoint(firstTouch.pageX, firstTouch.pageY);
				if (over && lastOver !== over) {
					lastOver = over;
					fireEvent("vmouseover", evt);
				}

				//if didscroll occur and wasn't canceled then trigger touchend otherwise just touchmove
				if (didScroll && !didCancel) {
					fireEvent("vmousecancel", evt);
					lastOver = null;
				}
				fireEvent("vmousemove", evt);
			}

			/**
			 * Handle Scroll
			 * @method handleScroll
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleScroll(evt) {
				if (!didScroll) {
					fireEvent("vmousecancel", evt);
				}
				didScroll = true;
			}

			/**
			 * Handle touch cancel
			 * @method handleTouchCancel
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchCancel(evt) {
				fireEvent("vmousecancel", evt);
				lastOver = null;
			}

			/**
			 * Prepare position of event for keyboard events.
			 * @method preparePositionForEvent
			 * @param {Event} event
			 * @return {Object} properties
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function preparePositionForEvent(event) {
				var targetRect = event.target && event.target.getBoundingClientRect(),
					properties = {};
				if (targetRect) {
					properties = {
						"clientX": targetRect.left + targetRect.width / 2,
						"clientY": targetRect.top + targetRect.height / 2,
						"which": 1
					};
				}
				return properties;
			}

			/**
			 * Handle key up
			 * @method handleKeyUp
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleKeyUp(event) {
				var properties;
				if (event.keyCode === KEY_CODES.enter) {
					properties = preparePositionForEvent(event);
					fireEvent("vmouseup", event, properties);
					fireEvent("vclick", event, properties);
				}
			}

			/**
			 * Handle key down
			 * @method handleKeyDown
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleKeyDown(event) {
				if (event.keyCode === KEY_CODES.enter) {
					fireEvent("vmousedown", event, preparePositionForEvent(event));
				}
			}

			/**
			 * Binds events common to mouse and touch to support virtual mouse.
			 * @method bindCommonEvents
			 * @static
			 * @member ns.event.vmouse
			 */
			vmouse.bindCommonEvents = function () {
				document.addEventListener("keyup", handleKeyUp, true);
				document.addEventListener("keydown", handleKeyDown, true);
				document.addEventListener("scroll", handleScroll, true);
				document.addEventListener("click", handleClick, true);
			};

			// @TODO delete touchSupport flag and attach touch and mouse listeners,
			// @TODO check if v-events are not duplicated if so then called only once

			/**
			 * Binds touch events to support virtual mouse.
			 * @method bindTouch
			 * @static
			 * @member ns.event.vmouse
			 */
			vmouse.bindTouch = function () {
				document.addEventListener("touchstart", handleTouchStart, true);
				document.addEventListener("touchend", handleTouchEnd, true);
				document.addEventListener("touchmove", handleTouchMove, true);
				document.addEventListener("touchcancel", handleTouchCancel, true);

				// touchenter and touchleave are removed from W3C spec
				// No need to listen to touchover as it has never exited
				// document.addEventListener("touchenter", handleTouchOver, true);
				// document.addEventListener("touchleave", callbacks.out, true);
				document.addEventListener("touchcancel", handleTouchCancel, true);
			};

			/**
			 * Binds mouse events to support virtual mouse.
			 * @method bindMouse
			 * @static
			 * @member ns.event.vmouse
			 */
			vmouse.bindMouse = function () {
				document.addEventListener("mousedown", handleDown, true);

				document.addEventListener("mouseup", handleUp, true);
				document.addEventListener("mousemove", handleMove, true);
				document.addEventListener("mouseover", handleOver, true);
				document.addEventListener("mouseout", handleOut, true);
			};

			ns.event.vmouse = vmouse;

			if (touchSupport) {
				vmouse.bindTouch();
			} else {
				vmouse.bindMouse();
			}
			vmouse.bindCommonEvents();

			}(window, window.document));

/*global define: true, window: true, ns */
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
 *
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Selectors Utility
 * Object contains functions to get HTML elements by different selectors.
 * @class ns.util.selectors
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (document) {
	"use strict";
				/**
			 * @method slice Alias for array slice method
			 * @member ns.util.selectors
			 * @private
			 * @static
			 */
			var slice = [].slice,
				/**
				 * @method matchesSelectorType
				 * @return {string|boolean}
				 * @member ns.util.selectors
				 * @private
				 * @static
				 */
				matchesSelectorType = (function () {
					var el = document.createElement("div");

					if (typeof el.webkitMatchesSelector === "function") {
						return "webkitMatchesSelector";
					}

					if (typeof el.mozMatchesSelector === "function") {
						return "mozMatchesSelector";
					}

					if (typeof el.msMatchesSelector === "function") {
						return "msMatchesSelector";
					}

					if (typeof el.matchesSelector === "function") {
						return "matchesSelector";
					}

					if (typeof el.matches === "function") {
						return "matches";
					}

					return false;
				}());

			/**
			 * Prefix selector with 'data-' and namespace if present
			 * @method getDataSelector
			 * @param {string} selector
			 * @return {string}
			 * @member ns.util.selectors
			 * @private
			 * @static
			 */
			function getDataSelector(selector) {
				var namespace = ns.getConfig("namespace");
				return "[data-" + (namespace ? namespace + "-" : "") + selector + "]";
			}

			/**
			 * Runs matches implementation of matchesSelector
			 * method on specified element
			 * @method matchesSelector
			 * @param {HTMLElement} element
			 * @param {string} selector
			 * @return {boolean}
			 * @static
			 * @member ns.util.selectors
			 */
			function matchesSelector(element, selector) {
				if (matchesSelectorType && element[matchesSelectorType]) {
					return element[matchesSelectorType](selector);
				}
				return false;
			}

			/**
			 * Return array with all parents of element.
			 * @method parents
			 * @param {HTMLElement} element
			 * @return {Array}
			 * @member ns.util.selectors
			 * @private
			 * @static
			 */
			function parents(element) {
				var items = [],
					current = element.parentNode;
				while (current && current !== document) {
					items.push(current);
					current = current.parentNode;
				}
				return items;
			}

			/**
			 * Checks if given element and its ancestors matches given function
			 * @method closest
			 * @param {HTMLElement} element
			 * @param {Function} testFunction
			 * @return {?HTMLElement}
			 * @member ns.util.selectors
			 * @static
			 * @private
			 */
			function closest(element, testFunction) {
				var current = element;
				while (current && current !== document) {
					if (testFunction(current)) {
						return current;
					}
					current = current.parentNode;
				}
				return null;
			}

			/**
			 * @method testSelector
			 * @param {string} selector
			 * @param {HTMLElement} node
			 * @return {boolean}
			 * @member ns.util.selectors
			 * @static
			 * @private
			 */
			function testSelector(selector, node) {
				return matchesSelector(node, selector);
			}

			/**
			 * @method testClass
			 * @param {string} className
			 * @param {HTMLElement} node
			 * @return {boolean}
			 * @member ns.util.selectors
			 * @static
			 * @private
			 */
			function testClass(className, node) {
				return node && node.classList && node.classList.contains(className);
			}

			/**
			 * @method testTag
			 * @param {string} tagName
			 * @param {HTMLElement} node
			 * @return {boolean}
			 * @member ns.util.selectors
			 * @static
			 * @private
			 */
			function testTag(tagName, node) {
				return ("" + node.tagName).toLowerCase() === tagName;
			}

			/**
			 * @class ns.util.selectors
			 */
			ns.util.selectors = {
				matchesSelector: matchesSelector,

				/**
				* Return array with children pass by given selector.
				* @method getChildrenBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getChildrenBySelector: function (context, selector) {
					return slice.call(context.children).filter(testSelector.bind(null, selector));
				},

				/**
				* Return array with children pass by given data-namespace-selector.
				* @method getChildrenByDataNS
				* @param {HTMLElement} context
				* @param {string} dataSelector
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getChildrenByDataNS: function (context, dataSelector) {
					return slice.call(context.children).filter(testSelector.bind(null, getDataSelector(dataSelector)));
				},

				/**
				* Return array with children with given class name.
				* @method getChildrenByClass
				* @param {HTMLElement} context
				* @param {string} className
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getChildrenByClass: function (context, className) {
					return slice.call(context.children).filter(testClass.bind(null, className));
				},

				/**
				* Return array with children with given tag name.
				* @method getChildrenByTag
				* @param {HTMLElement} context
				* @param {string} tagName
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getChildrenByTag: function (context, tagName) {
					return slice.call(context.children).filter(testTag.bind(null, tagName));
				},

				/**
				* Return array with all parents of element.
				* @method getParents
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getParents: parents,

				/**
				* Return array with all parents of element pass by given selector.
				* @method getParentsBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getParentsBySelector: function (context, selector) {
					return parents(context).filter(testSelector.bind(null, selector));
				},

				/**
				* Return array with all parents of element pass by given selector with namespace.
				* @method getParentsBySelectorNS
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getParentsBySelectorNS: function (context, selector) {
					return parents(context).filter(testSelector.bind(null, getDataSelector(selector)));
				},

				/**
				* Return array with all parents of element with given class name.
				* @method getParentsByClass
				* @param {HTMLElement} context
				* @param {string} className
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getParentsByClass: function (context, className) {
					return parents(context).filter(testClass.bind(null, className));
				},

				/**
				* Return array with all parents of element with given tag name.
				* @method getParentsByTag
				* @param {HTMLElement} context
				* @param {string} tagName
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getParentsByTag: function (context, tagName) {
					return parents(context).filter(testTag.bind(null, tagName));
				},

				/**
				* Return first element from parents of element pass by selector.
				* @method getClosestBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @member ns.util.selectors
				*/
				getClosestBySelector: function (context, selector) {
					return closest(context, testSelector.bind(null, selector));
				},

				/**
				* Return first element from parents of element pass by selector with namespace.
				* @method getClosestBySelectorNS
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @member ns.util.selectors
				*/
				getClosestBySelectorNS: function (context, selector) {
					return closest(context, testSelector.bind(null, getDataSelector(selector)));
				},

				/**
				* Return first element from parents of element with given class name.
				* @method getClosestByClass
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @member ns.util.selectors
				*/
				getClosestByClass: function (context, selector) {
					return closest(context, testClass.bind(null, selector));
				},

				/**
				* Return first element from parents of element with given tag name.
				* @method getClosestByTag
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @member ns.util.selectors
				*/
				getClosestByTag: function (context, selector) {
					return closest(context, testTag.bind(null, selector));
				},

				/**
				* Return array of elements from context with given data-selector
				* @method getAllByDataNS
				* @param {HTMLElement} context
				* @param {string} dataSelector
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getAllByDataNS: function (context, dataSelector) {
					return slice.call(context.querySelectorAll(getDataSelector(dataSelector)));
				},

				/**
				 * Get scrollable parent elmenent
				 * @method getScrollableParent
				 * @param {HTMLElement} element
				 * @return {HTMLElement}
				 * @static
				 * @member ns.util.selectors
				 */
				getScrollableParent:  function (element) {
					var overflow,
						style;

					while (element && element !== document.body) {
						style = window.getComputedStyle(element);

						if (style) {
							overflow = style.getPropertyValue("overflow-y");
							if (overflow === "scroll" || (overflow === "auto" && element.scrollHeight > element.clientHeight)) {
								return element;
							}
						}
						element = element.parentNode;
					}
					return null;
				}
			};
			}(window.document));

/*global define, ns */
/*jslint plusplus: true */
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
 *
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Utility DOM
 * Utility object with function to DOM manipulation, CSS properties support
 * and DOM attributes support.
 *
 * # How to replace jQuery methods  by ns methods
 * ## append vs appendNodes
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $( "#second" ).append( "<span>Test</span>" );

 * #### ns manipulation
 *
 *     @example
 *     var context = document.getElementById("second"),
 *         element = document.createElement("span");
 *     element.innerHTML = "Test";
 *     ns.util.DOM.appendNodes(context, element);
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And
 *             <span>Test</span>
 *         </div>
 *        <div id="third">Goodbye</div>
 *     </div>
 *
 * ## replaceWith vs replaceWithNodes
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $('#second').replaceWith("<span>Test</span>");
 *
 * #### ns manipulation
 *
 *     @example
 *     var context = document.getElementById("second"),
 *         element = document.createElement("span");
 *     element.innerHTML = "Test";
 *     ns.util.DOM.replaceWithNodes(context, element);
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <span>Test</span>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * ## before vs insertNodesBefore
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $( "#second" ).before( "<span>Test</span>" );
 *
 * #### ns manipulation
 *
 *     @example
 *     var context = document.getElementById("second"),
 *         element = document.createElement("span");
 *     element.innerHTML = "Test";
 *     ns.util.DOM.insertNodesBefore(context, element);
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <span>Test</span>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * ## wrapInner vs wrapInHTML
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $( "#second" ).wrapInner( "<span class="new"></span>" );
 *
 * #### ns manipulation
 *
 *     @example
 *     var element = document.getElementById("second");
 *     ns.util.DOM.wrapInHTML(element, "<span class="new"></span>");
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">
 *             <span class="new">And</span>
 *         </div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * @class ns.util.DOM
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function () {
	"use strict";
				ns.util.DOM = ns.util.DOM || {};
			}());

/*global define, ns */
/*jslint plusplus: true */
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
/*
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function () {
	"use strict";
	

			var selectors = ns.util.selectors,
				DOM = ns.util.DOM,
				namespace = "namespace";

			/**
			 * Returns given attribute from element or the closest parent,
			 * which matches the selector.
			 * @method inheritAttr
			 * @member ns.util.DOM
			 * @param {HTMLElement} element
			 * @param {string} attr
			 * @param {string} selector
			 * @return {?string}
			 * @static
			 */
			DOM.inheritAttr = function (element, attr, selector) {
				var value = element.getAttribute(attr),
					parent;
				if (!value) {
					parent = selectors.getClosestBySelector(element, selector);
					if (parent) {
						return parent.getAttribute(attr);
					}
				}
				return value;
			};

			/**
			 * Returns Number from properties described in html tag
			 * @method getNumberFromAttribute
			 * @member ns.util.DOM
			 * @param {HTMLElement} element
			 * @param {string} attribute
			 * @param {string=} [type] auto type casting
			 * @param {number} [defaultValue] default returned value
			 * @static
			 * @return {number}
			 */
			DOM.getNumberFromAttribute = function (element, attribute, type, defaultValue) {
				var value = element.getAttribute(attribute),
					result = defaultValue;

				if (!isNaN(value)) {
					if (type === "float") {
						value = parseFloat(value);
						if (!isNaN(value)) {
							result = value;
						}
					} else {
						value = parseInt(value, 10);
						if (!isNaN(value)) {
							result = value;
						}
					}
				}
				return result;
			};

			function getDataName(name, skipData) {
				var _namespace = ns.getConfig(namespace),
					prefix = "";
				if (!skipData) {
					prefix = "data-";
				}
				return prefix + (_namespace ? _namespace + "-" : "") + name;
			}

			/**
			 * Special function to set attribute and property in the same time
			 * @method setAttribute
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @param {Mixed} value
			 * @member ns.util.DOM
			 * @static
			 */
			function setAttribute(element, name, value) {
				element[name] = value;
				element.setAttribute(name, value);
			}

			/**
			 * This function sets value of attribute data-{namespace}-{name} for element.
			 * If the namespace is empty, the attribute data-{name} is used.
			 * @method setNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @param {string|number|boolean} value New value
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.setNSData = function (element, name, value) {
				element.setAttribute(getDataName(name), value);
			};

			/**
			 * This function returns value of attribute data-{namespace}-{name} for element.
			 * If the namespace is empty, the attribute data-{name} is used.
			 * Method may return boolean in case of 'true' or 'false' strings as attribute value.
			 * @method getNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @param {boolean} skipData
			 * @member ns.util.DOM
			 * @return {?string|boolean}
			 * @static
			 */
			DOM.getNSData = function (element, name, skipData) {
				var value = element.getAttribute(getDataName(name, skipData));

				if (value === "true") {
					return true;
				}

				if (value === "false") {
					return false;
				}

				return value;
			};

			/**
			 * This function returns true if attribute data-{namespace}-{name} for element is set
			 * or false in another case. If the namespace is empty, attribute data-{name} is used.
			 * @method hasNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @member ns.util.DOM
			 * @return {boolean}
			 * @static
			 */
			DOM.hasNSData = function (element, name) {
				return element.hasAttribute(getDataName(name));
			};

			/**
			 * Get or set value on data attribute.
			 * @method nsData
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @param {?Mixed} [value]
			 * @static
			 * @member ns.util.DOM
			 */
			DOM.nsData = function (element, name, value) {
				// @TODO add support for object in value
				if (value === undefined) {
					return DOM.getNSData(element, name);
				} else {
					return DOM.setNSData(element, name, value);
				}
			};

			/**
			 * This function removes attribute data-{namespace}-{name} from element.
			 * If the namespace is empty, attribute data-{name} is used.
			 * @method removeNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.removeNSData = function (element, name) {
				element.removeAttribute(getDataName(name));
			};

			/**
			 * Returns object with all data-* attributes of element
			 * @method getData
			 * @param {HTMLElement} element Base element
			 * @member ns.util.DOM
			 * @return {Object}
			 * @static
			 */
			DOM.getData = function (element) {
				var dataPrefix = "data-",
					data = {},
					attrs = element.attributes,
					attr,
					nodeName,
					value,
					i,
					length = attrs.length;

				for (i = 0; i < length; i++) {
					attr = attrs.item(i);
					nodeName = attr.nodeName;
					if (nodeName.indexOf(dataPrefix) > -1) {
						value = attr.value;
						data[nodeName.replace(dataPrefix, "")] = value.toLowerCase() === "true" ? true : value.toLowerCase() === "false" ? false : value;
					}
				}

				return data;
			};

			/**
			 * Special function to remove attribute and property in the same time
			 * @method removeAttribute
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.removeAttribute = function (element, name) {
				element.removeAttribute(name);
				element[name] = false;
			};

			DOM.setAttribute = setAttribute;
			/**
			 * Special function to set attributes and propertie in the same time
			 * @method setAttribute
			 * @param {HTMLElement} element
			 * @param {Object} name
			 * @param {Mixed} value
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.setAttributes = function (element, values) {
				var i,
					names = Object.keys(values),
					name,
					len;

				for (i = 0, len = names.length; i < len; i++) {
					name = names[i];
					setAttribute(element, name, values[name]);
				}
			};
			}());

/*global window, define, RegExp, ns */
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
 * #Path Utility
 * Object helps work with paths.
 * @class ns.util.path
 * @static
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document) {
	"use strict";
					/**
				 * Local alias for ns.util.object
				 * @property {Object} utilsObject Alias for {@link ns.util.object}
				 * @member ns.util.path
				 * @static
				 * @private
				 */
			var utilsObject = ns.util.object,
				/**
				* Local alias for ns.util.selectors
				* @property {Object} utilsSelectors Alias for {@link ns.util.selectors}
				* @member ns.util.path
				* @static
				* @private
				*/
				utilsSelectors = ns.util.selectors,
				/**
				* Local alias for ns.util.DOM
				* @property {Object} utilsDOM Alias for {@link ns.util.DOM}
				* @member ns.util.path
				* @static
				* @private
				*/
				utilsDOM = ns.util.DOM,
				/**
				* Cache for document base element
				* @member ns.util.path
				* @property {HTMLBaseElement} base
				* @static
				* @private
				*/
				base,
				/**
				 * location object
				 * @property {Object} location
				 * @static
				 * @private
				 * @member ns.util.path
				 */
				location = {},
				path = {
					/**
					 * href part for mark state
					 * @property {string} [uiStateKey="&ui-state"]
					 * @static
					 * @member ns.util.path
					 */
					uiStateKey: "&ui-state",

					// This scary looking regular expression parses an absolute URL or its relative
					// variants (protocol, site, document, query, and hash), into the various
					// components (protocol, host, path, query, fragment, etc that make up the
					// URL as well as some other commonly used sub-parts. When used with RegExp.exec()
					// or String.match, it parses the URL into a results array that looks like this:
					//
					//	[0]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread#msg-content?param1=true&param2=123
					//	[1]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread
					//	[2]: http://jblas:password@mycompany.com:8080/mail/inbox
					//	[3]: http://jblas:password@mycompany.com:8080
					//	[4]: http:
					//	[5]: //
					//	[6]: jblas:password@mycompany.com:8080
					//	[7]: jblas:password
					//	[8]: jblas
					//	[9]: password
					//	[10]: mycompany.com:8080
					//	[11]: mycompany.com
					//	[12]: 8080
					//	[13]: /mail/inbox
					//	[14]: /mail/
					//	[15]: inbox
					//	[16]: ?msg=1234&type=unread
					//	[17]: #msg-content?param1=true&param2=123
					//	[18]: #msg-content
					//	[19]: ?param1=true&param2=123
					//
					/**
					* @property {RegExp} urlParseRE Regular expression for parse URL
					* @member ns.util.path
					* @static
					*/
					urlParseRE: /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)((#[^\?]*)(\?.*)?)?/,

					/**
					* Abstraction to address xss (Issue #4787) by removing the authority in
					* browsers that auto decode it. All references to location.href should be
					* replaced with a call to this method so that it can be dealt with properly here
					* @method getLocation
					* @param {string|Object} [url=window.location.href]
					* @return {string}
					* @member ns.util.path
					*/
					getLocation: function (url) {
						var uri = this.parseUrl(url || window.location.href),
							hash = uri.hash,
							search = uri.hashSearch;
						// mimic the browser with an empty string when the hash and hashSearch are empty
						hash = hash === "#" && !search ? "" : hash;
						location = uri;
						// Make sure to parse the url or the location object for the hash because using location.hash
						// is autodecoded in firefox, the rest of the url should be from the object (location unless
						// we're testing) to avoid the inclusion of the authority
						return uri.protocol + "//" + uri.host + uri.pathname + uri.search + hash + search;
					},

					/**
					* Return the original document url
					* @method getDocumentUrl
					* @member ns.util.path
					* @param {boolean} [asParsedObject=false]
					* @return {string|Object}
					* @static
					*/
					getDocumentUrl: function (asParsedObject) {
						return asParsedObject ? utilsObject.copy(path.documentUrl) : path.documentUrl.href;
					},

					/**
					* Parse a location into a structure
					* @method parseLocation
					* @return {Object}
					* @member ns.util.path
					*/
					parseLocation: function () {
						return this.parseUrl(this.getLocation());
					},

					/**
					* Parse a URL into a structure that allows easy access to
					* all of the URL components by name.
					* If we're passed an object, we'll assume that it is
					* a parsed url object and just return it back to the caller.
					* @method parseUrl
					* @member ns.util.path
					* @param {string|Object} url
					* @return {Object} uri record
					* @return {string} return.href
					* @return {string} return.hrefNoHash
					* @return {string} return.hrefNoSearch
					* @return {string} return.domain
					* @return {string} return.protocol
					* @return {string} return.doubleSlash
					* @return {string} return.authority
					* @return {string} return.username
					* @return {string} return.password
					* @return {string} return.host
					* @return {string} return.hostname
					* @return {string} return.port
					* @return {string} return.pathname
					* @return {string} return.directory
					* @return {string} return.filename
					* @return {string} return.search
					* @return {string} return.hash
					* @return {string} return.hashSearch
					* @static
					*/
					parseUrl: function (url) {
						var matches;
						if (typeof url === "object") {
							return url;
						}
						matches = path.urlParseRE.exec(url || "") || [];

							// Create an object that allows the caller to access the sub-matches
							// by name. Note that IE returns an empty string instead of undefined,
							// like all other browsers do, so we normalize everything so its consistent
							// no matter what browser we're running on.
						return {
							href: matches[0] || "",
							hrefNoHash: matches[1] || "",
							hrefNoSearch: matches[2] || "",
							domain: matches[3] || "",
							protocol: matches[4] || "",
							doubleSlash: matches[5] || "",
							authority: matches[6] || "",
							username: matches[8] || "",
							password: matches[9] || "",
							host: matches[10] || "",
							hostname: matches[11] || "",
							port: matches[12] || "",
							pathname: matches[13] || "",
							directory: matches[14] || "",
							filename: matches[15] || "",
							search: matches[16] || "",
							hash: matches[18] || "",
							hashSearch: matches[19] || ""
						};
					},

					/**
					* Turn relPath into an absolute path. absPath is
					* an optional absolute path which describes what
					* relPath is relative to.
					* @method makePathAbsolute
					* @member ns.util.path
					* @param {string} relPath
					* @param {string} [absPath=""]
					* @return {string}
					* @static
					*/
					makePathAbsolute: function (relPath, absPath) {
						var absStack,
							relStack,
							directory,
							i;
						if (relPath && relPath.charAt(0) === "/") {
							return relPath;
						}

						relPath = relPath || "";
						absPath = absPath ? absPath.replace(/^\/|(\/[^\/]*|[^\/]+)$/g, "") : "";

						absStack = absPath ? absPath.split("/") : [];
						relStack = relPath.split("/");
						for (i = 0; i < relStack.length; i++) {
							directory = relStack[i];
							switch (directory) {
							case ".":
								break;
							case "..":
								if (absStack.length) {
									absStack.pop();
								}
								break;
							default:
								absStack.push(directory);
								break;
							}
						}
						return "/" + absStack.join("/");
					},

					/**
					* Returns true if both urls have the same domain.
					* @method isSameDomain
					* @member ns.util.path
					* @param {string|Object} absUrl1
					* @param {string|Object} absUrl2
					* @return {boolean}
					* @static
					*/
					isSameDomain: function (absUrl1, absUrl2) {
						return path.parseUrl(absUrl1).domain === path.parseUrl(absUrl2).domain;
					},

					/**
					* Returns true for any relative variant.
					* @method isRelativeUrl
					* @member ns.util.path
					* @param {string|Object} url
					* @return {boolean}
					* @static
					*/
					isRelativeUrl: function (url) {
						// All relative Url variants have one thing in common, no protocol.
						return path.parseUrl(url).protocol === "";
					},

					/**
					 * Returns true for an absolute url.
					 * @method isAbsoluteUrl
					 * @member ns.util.path
					 * @param {string} url
					 * @return {boolean}
					 * @static
					 */
					isAbsoluteUrl: function (url) {
						return path.parseUrl(url).protocol !== "";
					},

					/**
					* Turn the specified realtive URL into an absolute one. This function
					* can handle all relative variants (protocol, site, document, query, fragment).
					* @method makeUrlAbsolute
					* @member ns.util.path
					* @param {string} relUrl
					* @param {string} absUrl
					* @return {string}
					* @static
					*/
					makeUrlAbsolute: function (relUrl, absUrl) {
						if (!path.isRelativeUrl(relUrl)) {
							return relUrl;
						}

						var relObj = path.parseUrl(relUrl),
							absObj = path.parseUrl(absUrl),
							protocol = relObj.protocol || absObj.protocol,
							doubleSlash = relObj.protocol ? relObj.doubleSlash : (relObj.doubleSlash || absObj.doubleSlash),
							authority = relObj.authority || absObj.authority,
							hasPath = relObj.pathname !== "",
							pathname = path.makePathAbsolute(relObj.pathname || absObj.filename, absObj.pathname),
							search = relObj.search || (!hasPath && absObj.search) || "",
							hash = relObj.hash;

						return protocol + doubleSlash + authority + pathname + search + hash;
					},

					/**
					* Add search (aka query) params to the specified url.
					* If page is embedded page, search query will be added after
					* hash tag. It's allowed to add query content for both external
					* pages and embedded pages.
					* Examples:
					* http://domain/path/index.html#embedded?search=test
					* http://domain/path/external.html?s=query#embedded?s=test
					* @method addSearchParams
					* @member ns.util.path
					* @param {string|Object} url
					* @param {Object|string} params
					* @return {string}
					*/
					addSearchParams: function (url, params) {
						var urlObject = path.parseUrl(url),
							paramsString = (typeof params === "object") ? this.getAsURIParameters(params) : params,
							searchChar = "",
							urlObjectHash = urlObject.hash;

						if (path.isEmbedded(url) && paramsString.length > 0) {
							searchChar = urlObject.hashSearch || "?";
							return urlObject.hrefNoHash + (urlObjectHash || "") + searchChar + (searchChar.charAt(searchChar.length - 1) === "?" ? "" : "&") + paramsString ;
						}

						searchChar = urlObject.search || "?";
						return urlObject.hrefNoSearch + searchChar + (searchChar.charAt(searchChar.length - 1) === "?" ? "" : "&") + paramsString + (urlObjectHash || "");
					},

					/**
					 * Add search params to the specified url with hash
					 * @method addHashSearchParams
					 * @member ns.util.path
					 * @param {string|Object} url
					 * @param {Object|string} params
					 * @returns {string}
					 */
					addHashSearchParams: function (url, params) {
						var urlObject = path.parseUrl(url),
							paramsString = (typeof params === "object") ? path.getAsURIParameters(params) : params,
							hash = urlObject.hash,
							searchChar = hash ? (hash.indexOf("?") < 0 ? hash + "?" : hash + "&") : "#?";
						return urlObject.hrefNoHash + searchChar + (searchChar.charAt(searchChar.length - 1) === "?" ? "" : "&") + paramsString;
					},

					/**
					* Convert absolute Url to data Url
					* - for embedded pages strips parameters
					* - for the same domain as document base remove domain
					* otherwise returns decoded absolute Url
					* @method convertUrlToDataUrl
					* @member ns.util.path
					* @param {string} absUrl
					* @param {boolean} dialogHashKey
					* @param {Object} documentBase uri structure
					* @return {string}
					* @static
					*/
					convertUrlToDataUrl: function (absUrl, dialogHashKey, documentBase) {
						var urlObject = path.parseUrl(absUrl);

						if (path.isEmbeddedPage(urlObject, !!dialogHashKey)) {
							// Keep hash and search data for embedded page
							return path.getFilePath(urlObject.hash + urlObject.hashSearch, dialogHashKey);
						}
						documentBase = documentBase || path.documentBase;
						if (path.isSameDomain(urlObject, documentBase)) {
							return urlObject.hrefNoHash.replace(documentBase.domain, "");
						}

						return window.decodeURIComponent(absUrl);
					},

					/**
					* Get path from current hash, or from a file path
					* @method get
					* @member ns.util.path
					* @param {string} newPath
					* @return {string}
					*/
					get: function (newPath) {
						if (newPath === undefined) {
							newPath = this.parseLocation().hash;
						}
						return this.stripHash(newPath).replace(/[^\/]*\.[^\/*]+$/, "");
					},

					/**
					* Test if a given url (string) is a path
					* NOTE might be exceptionally naive
					* @method isPath
					* @member ns.util.path
					* @param {string} url
					* @return {boolean}
					* @static
					*/
					isPath: function (url) {
						return (/\//).test(url);
					},

					/**
					* Return a url path with the window's location protocol/hostname/pathname removed
					* @method clean
					* @member ns.util.path
					* @param {string} url
					* @param {Object} documentBase  uri structure
					* @return {string}
					* @static
					*/
					clean: function (url, documentBase) {
						return url.replace(documentBase.domain, "");
					},

					/**
					* Just return the url without an initial #
					* @method stripHash
					* @member ns.util.path
					* @param {string} url
					* @return {string}
					* @static
					*/
					stripHash: function (url) {
						return url.replace(/^#/, "");
					},

					/**
					* Return the url without an query params
					* @method stripQueryParams
					* @member ns.util.path
					* @param {string} url
					* @return {string}
					* @static
					*/
					stripQueryParams: function (url) {
						return url.replace(/\?.*$/, "");
					},

					/**
					* Validation proper hash
					* @method isHashValid
					* @member ns.util.path
					* @param {string} hash
					* @static
					*/
					isHashValid: function (hash) {
						return (/^#[^#]+$/).test(hash);
					},

					/**
					* Check whether a url is referencing the same domain, or an external domain or different protocol
					* could be mailto, etc
					* @method isExternal
					* @member ns.util.path
					* @param {string|Object} url
					* @param {Object} documentUrl uri object
					* @return {boolean}
					* @static
					*/
					isExternal: function (url, documentUrl) {
						var urlObject = path.parseUrl(url);
						return urlObject.protocol && urlObject.domain !== documentUrl.domain ? true : false;
					},

					/**
					* Check if the url has protocol
					* @method hasProtocol
					* @member ns.util.path
					* @param {string} url
					* @return {boolean}
					* @static
					*/
					hasProtocol: function (url) {
						return (/^(:?\w+:)/).test(url);
					},

					/**
					 * Check if the url refers to embedded content
					 * @method isEmbedded
					 * @member ns.util.path
					 * @param {string} url
					 * @returns {boolean}
					 * @static
					 */
					isEmbedded: function (url) {
						var urlObject = path.parseUrl(url);

						if (urlObject.protocol !== "") {
							return (!path.isPath(urlObject.hash) && !!urlObject.hash && (urlObject.hrefNoHash === path.parseLocation().hrefNoHash));
						}
						return (/\?.*#|^#/).test(urlObject.href);
					},

					/**
					* Get the url as it would look squashed on to the current resolution url
					* @method squash
					* @member ns.util.path
					* @param {string} url
					* @param {string} [resolutionUrl=undefined]
					* @return {string}
					*/
					squash: function (url, resolutionUrl) {
						var href,
							cleanedUrl,
							search,
							stateIndex,
							isPath = this.isPath(url),
							uri = this.parseUrl(url),
							preservedHash = uri.hash,
							uiState = "";

						// produce a url against which we can resole the provided path
						resolutionUrl = resolutionUrl || (path.isPath(url) ? path.getLocation() : path.getDocumentUrl());

						// If the url is anything but a simple string, remove any preceding hash
						// eg #foo/bar -> foo/bar
						//	#foo -> #foo
						cleanedUrl = isPath ? path.stripHash(url) : url;

						// If the url is a full url with a hash check if the parsed hash is a path
						// if it is, strip the #, and use it otherwise continue without change
						cleanedUrl = path.isPath(uri.hash) ? path.stripHash(uri.hash) : cleanedUrl;

						// Split the UI State keys off the href
						stateIndex = cleanedUrl.indexOf(this.uiStateKey);

						// store the ui state keys for use
						if (stateIndex > -1) {
							uiState = cleanedUrl.slice(stateIndex);
							cleanedUrl = cleanedUrl.slice(0, stateIndex);
						}

						// make the cleanedUrl absolute relative to the resolution url
						href = path.makeUrlAbsolute(cleanedUrl, resolutionUrl);

						// grab the search from the resolved url since parsing from
						// the passed url may not yield the correct result
						search = this.parseUrl(href).search;

						// @TODO all this crap is terrible, clean it up
						if (isPath) {
							// reject the hash if it's a path or it's just a dialog key
							if (path.isPath(preservedHash) || preservedHash.replace("#", "").indexOf(this.uiStateKey) === 0) {
								preservedHash = "";
							}

							// Append the UI State keys where it exists and it's been removed
							// from the url
							if (uiState && preservedHash.indexOf(this.uiStateKey) === -1) {
								preservedHash += uiState;
							}

							// make sure that pound is on the front of the hash
							if (preservedHash.indexOf("#") === -1 && preservedHash !== "") {
								preservedHash = "#" + preservedHash;
							}

							// reconstruct each of the pieces with the new search string and hash
							href = path.parseUrl(href);
							href = href.protocol + "//" + href.host + href.pathname + search + preservedHash;
						} else {
							href += href.indexOf("#") > -1 ? uiState : "#" + uiState;
						}

						return href;
					},

					/**
					* Check if the hash is preservable
					* @method isPreservableHash
					* @member ns.util.path
					* @param {string} hash
					* @return {boolean}
					*/
					isPreservableHash: function (hash) {
						return hash.replace("#", "").indexOf(this.uiStateKey) === 0;
					},

					/**
					* Escape weird characters in the hash if it is to be used as a selector
					* @method hashToSelector
					* @member ns.util.path
					* @param {string} hash
					* @return {string}
					* @static
					*/
					hashToSelector: function (hash) {
						var hasHash = (hash.substring(0, 1) === "#");
						if (hasHash) {
							hash = hash.substring(1);
						}
						return (hasHash ? "#" : "") + hash.replace(new RegExp("([!\"#$%&\'()*+,./:;<=>?@[\\]^`{|}~])", "g"), "\\$1");
					},

					/**
					* Check if the specified url refers to the first page in the main application document.
					* @method isFirstPageUrl
					* @member ns.util.path
					* @param {string} url
					* @param {HTMLElement} firstPageElement first page element
					* @param {string} documentBase uri structure
					* @param {boolean} documentBaseDiffers
					* @param {Object} documentUrl uri structure
					* @return {boolean}
					* @static
					*/
					isFirstPageUrl: function (url, firstPageElement, documentBase, documentBaseDiffers, documentUrl) {
						var urlStructure,
							samePath,
							firstPageId,
							hash;

						documentBase = documentBase === undefined ? path.documentBase : documentBase;
						documentBaseDiffers = documentBaseDiffers === undefined ? path.documentBaseDiffers : documentBaseDiffers;
						documentUrl = documentUrl === undefined ? path.documentUrl : documentUrl;

						// We only deal with absolute paths.
						urlStructure = path.parseUrl(path.makeUrlAbsolute(url, documentBase));

						// Does the url have the same path as the document?
						samePath = urlStructure.hrefNoHash === documentUrl.hrefNoHash || (documentBaseDiffers && urlStructure.hrefNoHash === documentBase.hrefNoHash);

						// Get the id of the first page element if it has one.
						firstPageId = firstPageElement && firstPageElement.id || false;
						hash = urlStructure.hash;

						// The url refers to the first page if the path matches the document and
						// it either has no hash value, or the hash is exactly equal to the id of the
						// first page element.
						return samePath && (!hash || hash === "#" || (firstPageId && hash.replace(/^#/, "") === firstPageId));
					},

					/**
					* Some embedded browsers, like the web view in Phone Gap, allow cross-domain XHR
					* requests if the document doing the request was loaded via the file:// protocol.
					* This is usually to allow the application to "phone home" and fetch app specific
					* data. We normally let the browser handle external/cross-domain urls, but if the
					* allowCrossDomainPages option is true, we will allow cross-domain http/https
					* requests to go through our page loading logic.
					* @method isPermittedCrossDomainRequest
					* @member ns.util.path
					* @param {Object} docUrl
					* @param {string} reqUrl
					* @return {boolean}
					* @static
					*/
					isPermittedCrossDomainRequest: function (docUrl, reqUrl) {
						return ns.getConfig("allowCrossDomainPages", false) &&
							docUrl.protocol === "file:" &&
							reqUrl.search(/^https?:/) !== -1;
					},

					/**
					* Convert a object data to URI parameters
					* @method getAsURIParameters
					* @member ns.util.path
					* @param {Object} data
					* @return {string}
					* @static
					*/
					getAsURIParameters: function (data) {
						var url = "",
							key;
						for (key in data) {
							if (data.hasOwnProperty(key)) {
								url += encodeURIComponent(key) + "=" + encodeURIComponent(data[key]) + "&";
							}
						}
						return url.substring(0, url.length - 1);
					},

					/**
					* Document Url
					* @member ns.util.path
					* @property {string|null} documentUrl
					*/
					documentUrl: null,

					/**
					* The document base differs
					* @member ns.util.path
					* @property {boolean} documentBaseDiffers
					*/
					documentBaseDiffers: false,

					/**
					* Set location hash to path
					* @method set
					* @member ns.util.path
					* @param {string} path
					* @static
					*/
					set: function (path) {
						location.hash = path;
					},

					/**
					* Return the substring of a file path before the sub-page key,
					* for making a server request
					* @method getFilePath
					* @member ns.util.path
					* @param {string} path
					* @param {string} dialogHashKey
					* @return {string}
					* @static
					*/
					getFilePath: function (path, dialogHashKey) {
						var splitkey = "&" + ns.getConfig("subPageUrlKey", "");
						return path && path.split(splitkey)[0].split(dialogHashKey)[0];
					},

					/**
					* Remove the preceding hash, any query params, and dialog notations
					* @method cleanHash
					* @member ns.util.path
					* @param {string} hash
					* @param {string} dialogHashKey
					* @return {string}
					* @static
					*/
					cleanHash: function (hash, dialogHashKey) {
						return path.stripHash(hash.replace(/\?.*$/, "").replace(dialogHashKey, ""));
					},

					/**
					* Check if url refers to the embedded page
					* @method isEmbeddedPage
					* @member ns.util.path
					* @param {string} url
					* @param {boolean} allowEmbeddedOnlyBaseDoc
					* @return {boolean}
					* @static
					*/
					isEmbeddedPage: function (url, allowEmbeddedOnlyBaseDoc) {
						var urlObject = path.parseUrl(url);

						//if the path is absolute, then we need to compare the url against
						//both the documentUrl and the documentBase. The main reason for this
						//is that links embedded within external documents will refer to the
						//application document, whereas links embedded within the application
						//document will be resolved against the document base.
						if (urlObject.protocol !== "") {
							return (urlObject.hash &&
									( allowEmbeddedOnlyBaseDoc ?
											urlObject.hrefNoHash === path.documentUrl.hrefNoHash :
											urlObject.hrefNoHash === path.parseLocation().hrefNoHash ));
						}
						return (/^#/).test(urlObject.href);
					}
				};

			path.documentUrl = path.parseLocation();

			base = document.querySelector("base");

			/**
			* The document base URL for the purposes of resolving relative URLs,
			* and the name of the default browsing context for the purposes of
			* following hyperlinks
			* @member ns.util.path
			* @property {Object} documentBase uri structure
			* @static
			*/
			path.documentBase = base ? path.parseUrl(path.makeUrlAbsolute(base.getAttribute("href"), path.documentUrl.href)) : path.documentUrl;

			path.documentBaseDiffers = (path.documentUrl.hrefNoHash !== path.documentBase.hrefNoHash);

			/**
			* Get document base
			* @method getDocumentBase
			* @member ns.util.path
			* @param {boolean} [asParsedObject=false]
			* @return {string|Object}
			* @static
			*/
			path.getDocumentBase = function (asParsedObject) {
				return asParsedObject ? utilsObject.copy(path.documentBase) : path.documentBase.href;
			};

			/**
			* Find the closest page and extract out its url
			* @method getClosestBaseUrl
			* @member ns.util.path
			* @param {HTMLElement} element
			* @param {string} selector
			* @return {string}
			* @static
			*/
			path.getClosestBaseUrl = function (element, selector) {
				// Find the closest page and extract out its url.
				var url = utilsDOM.getNSData(utilsSelectors.getClosestBySelector(element, selector), "url"),
					baseUrl = path.documentBase.hrefNoHash;

				if (!ns.getConfig("dynamicBaseEnabled", true) || !url || !path.isPath(url)) {
					url = baseUrl;
				}

				return path.makeUrlAbsolute(url, baseUrl);
			};

			ns.util.path = path;
			}(window, window.document));

/*global window, define, ns */
/*jslint browser: true, nomen: true */
/**
 * # History manager
 *
 * Control events connected with history change and trigger events to controller
 * or router.
 *
 * @class ns.history.manager
 * @since 2.4
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
/**
 * Event historystatechange
 * @event historystatechange
 * @class ns.history.manager
 */
/**
 * Event historyhashchange
 * @event historyhashchange
 * @class ns.history.manager
 */
/**
 * Event historyenabled
 * @event historyenabled
 * @class ns.history.manager
 */
/**
 * Event historydisabled
 * @event historydisabled
 * @class ns.history.manager
 */
(function (window, document) {
	"use strict";
				var manager = Object.create(null), // we don't need the Object proto
				WINDOW_EVENT_POPSTATE = "popstate",
				WINDOW_EVENT_HASHCHANGE = "hashchange",
				DOC_EVENT_VCLICK = "vclick",
				LINK_SELECTOR = "a,tau-button",
				util = ns.util,
				history = ns.history,
				eventUtils = ns.event,
				selectorUtils = util.selectors,
				objectUtils = util.object,
				pathUtils = util.path,
				DOM = util.DOM,
				EVENT_STATECHANGE = "historystatechange",
				EVENT_HASHCHANGE = "historyhashchange",
				EVENT_ENABLED = "historyenabled",
				EVENT_DISABLED = "historydisabled",
				/**
				 * Engine event types
				 * @property {Object} events
				 * @property {string} events.STATECHANGE="historystatechange" event name on history manager change state
				 * @property {string} events.HASHCHANGE="historyhashchange" event name on history manager change hash
				 * @property {string} events.ENABLED="historyenabled" event name on enable history manager
				 * @property {string} events.DISABLED="historydisabled" event name on disable history manager
				 * @static
				 * @readonly
				 * @member ns.history.manager
				 */
				events = {
					STATECHANGE: EVENT_STATECHANGE,
					HASHCHANGE: EVENT_HASHCHANGE,
					ENABLED: EVENT_ENABLED,
					DISABLED: EVENT_DISABLED
				};

			manager.events = events;

			/**
			 * Trigger event "historystatechange" on document
			 * @param {Object} options
			 * @returns {boolean}
			 */
			function triggerStateChange(options) {
				return eventUtils.trigger(document, EVENT_STATECHANGE, options, true, true);
			}

			/**
			 * Callback for link click
			 * @param {Event} event
			 * @returns {boolean}
			 */
			function onLinkAction(event) {
				var target = event.target,
					link = selectorUtils.getClosestBySelector(target, LINK_SELECTOR),
					href = null,
					useDefaultUrlHandling = false,
					options = {}, // this should be empty object but some utils that work on it
					rel = null;   // require hasOwnProperty :(

								if (link && event.which === 1) {
					href = link.getAttribute("href");
					rel = link.getAttribute("rel");
					useDefaultUrlHandling = rel === "external" || link.hasAttribute("target");
					if (!useDefaultUrlHandling) {
						options = DOM.getData(link);
						options.event = event;
						if (rel && !options.rel) {
							options.rel = rel;
						}
						if (href && !options.href) {
							options.href = href;
						}
						history.disableVolatileMode();
						if (!triggerStateChange(options)) {
							// mark as handled
							// but not on back
							if (!rel || (rel && rel !== "back")) {
								eventUtils.preventDefault(event);
								return false;
							}
						}
					}
				}
				return true;
			}


			/**
			 * Callback on popstate event.
			 * @param {Event} event
			 */
			function onPopState(event) {
				var state = event.state,
					lastState = history.activeState,
					options = {},
					reverse = false,
					continuation = true;
								if (manager.locked) {
					history.disableVolatileMode();
					if (lastState) {
						history.replace(lastState, lastState.stateTitle, lastState.stateUrl);
					}
				} else if (state) {
					reverse = history.getDirection(state) === "back";
					options = objectUtils.merge(options, state, {
						reverse: reverse,
						transition: reverse ? ((lastState && lastState.transition) || "none") : state.transition,
						fromHashChange: true
					});

					if (lastState && !eventUtils.trigger(document, EVENT_HASHCHANGE, objectUtils.merge(options,
							{url: pathUtils.getLocation(), stateUrl: lastState.stateUrl}), true, true)) {
						continuation = false;
					}

					history.setActive(state);
					if (continuation) {
						options.event = event;
						triggerStateChange(options);
					}
				}
			}

			/**
			 * Callback on "hashchange" event
			 * @param {Event} event
			 */
			function onHashChange(event) {
				var newURL = event.newURL;
								if (newURL) {
					triggerStateChange({href: newURL, fromHashChange: true, event: event});
				}
			}

			/**
			 * Inform that manager is enabled or not.
			 * @property {boolean} [enabled=true]
			 * @static
			 * @since 2.4
			 * @member ns.history.manager
			 */
			manager.enabled = true;
			/**
			 * Informs that manager is enabled or not.
			 *
			 * If manager is locked then not trigger events historystatechange.
			 * @property {boolean} [locked=false]
			 * @static
			 * @since 2.4
			 * @member ns.history.manager
			 */
			manager.locked = false;

			/**
			 * Locks history manager.
			 *
			 * Sets locked property to true.
			 *
			 *	@example
			 *		tau.history.manager.lock();
			 *
			 * @method lock
			 * @static
			 * @since 2.4
			 * @member ns.history.manager
			 */
			manager.lock = function () {
				this.locked = true;
			};

			/**
			 * Unlocks history manager.
			 *
			 * Sets locked property to false.
			 *
			 *	@example
			 *		tau.history.manager.unlock();
			 *
			 * @method unlock
			 * @static
			 * @since 2.4
			 * @member ns.history.manager
			 */
			manager.unlock = function () {
				this.locked = false;
			};

			/**
			 * Enables history manager.
			 *
			 * This method adds all event listeners connected with history manager.
			 *
			 * Event listeners:
			 *
			 *  - popstate on window
			 *  - hashchange on window
			 *  - vclick on document
			 *
			 * After set event listeners method sets property enabled to true.
			 *
			 *	@example
			 *		tau.history.manager.enable();
			 *		// add event's listeners
			 *		// after click on link or hash change history manager will handle events
			 *
			 * @method enable
			 * @static
			 * @since 2.4
			 * @member ns.history.manager
			 */
			manager.enable = function () {
				document.addEventListener(DOC_EVENT_VCLICK, onLinkAction, false);
				window.addEventListener(WINDOW_EVENT_POPSTATE, onPopState, false);
				window.addEventListener(WINDOW_EVENT_HASHCHANGE, onHashChange, false);
				history.enableVolatileMode();
				this.enabled = true;
				eventUtils.trigger(document, EVENT_ENABLED, this);
			};

			/**
			 * Disables history manager.
			 *
			 * This method removes all event listeners connected with history manager.
			 *
			 * After set event listeners method sets property enabled to true.
			 *
			 *	@example
			 *		tau.history.manager.disable();
			 *		// remove event's listeners
			 *		// after click on link or hash change history manager will not handle events
			 *
			 * @method disable
			 * @static
			 * @since 2.4
			 * @member ns.history.manager
			 */
			manager.disable = function () {
				document.removeEventListener(DOC_EVENT_VCLICK, onLinkAction, false);
				window.removeEventListener(WINDOW_EVENT_POPSTATE, onPopState, false);
				window.removeEventListener(WINDOW_EVENT_HASHCHANGE, onHashChange, false);
				history.disableVolatileMode();
				this.enabled = false;
				eventUtils.trigger(document, EVENT_DISABLED, this);
			};

			ns.history.manager = manager;
			}(window, window.document));

/*global window, define, NodeList, HTMLCollection, Element, ns */
/*jslint plusplus: true */
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
/*
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	
			/**
			 * @property {DocumentFragment} fragment
			 * @member ns.util.DOM
			 * @private
			 * @static
			 */
			/*
			 * @todo maybe can be moved to function scope?
			 */
			var fragment = document.createDocumentFragment(),
				/**
				 * @property {DocumentFragment} fragment2
				 * @member ns.util.DOM
				 * @private
				 * @static
				 */
				/*
				 * @todo maybe can be moved to function scope?
				 */
				fragment2 = document.createDocumentFragment(),
				/**
				 * @property {number} [containerCounter=0]
				 * @member ns.util.DOM
				 * @private
				 * @static
				 */
				/*
				 * @todo maybe can be moved to function scope?
				 */
				containerCounter = 0,
				/**
				 * Alias to Array.slice method
				 * @method slice
				 * @member ns.util.DOM
				 * @private
				 * @static
				 */
				slice = [].slice,
				DOM = ns.util.DOM;

			/**
			 * Checks if elemenent was converted via WebComponentsJS,
			 * this will return false if WC support is native
			 * @param {HTMLElement} node
			 * @return {boolean}
			 * @static
			 * @member ns.util.DOM
			 */
			function isNodeWebComponentPolyfilled(node) {
				var keys = [];
				if (!node) {
					return false;
				}
				// hacks
				keys = Object.keys(node).join(":");
				return (keys.indexOf("__impl") > -1 || keys.indexOf("__upgraded__") > -1 ||
						keys.indexOf("__attached__") > -1);
			}

			/**
			 * Returns wrapped element which was normal HTML element
			 * by WebComponent polyfill
			 * @param {Object} element
			 * @return ?HTMLelement
			 * @member ns.util.DOM
			 * @static
			 */
			function wrapWebComponentPolyfill(element) {
				var wrap = window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrap;
				if (element && wrap) {
					return wrap(element);
				}
				
				return element;
			}

			/**
			 * Returns normal element which was wrapped
			 * by WebComponent polyfill
			 * @param {Object} element
			 * @return ?HTMLelement
			 * @member ns.util.DOM
			 * @static
			 */
			function unwrapWebComponentPolyfill(element) {
				var unwrap = window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.unwrap;
				if (element && unwrap) {
					return unwrap(element);
				}

				ns.error("Unwrap method not available");
				return element;
			}
			/**
			 * Creates a selector for given node
			 * @param {HTMLElement} node
			 * @return {string}
			 * @member ns.util.DOM
			 * @method getNodeSelector
			 */
			function getNodeSelector(node) {
				var attributes = node.attributes,
					attributeLength = attributes.length,
					attr = null,
					i = 0,
					selector = node.tagName.toLowerCase();
				for (; i < attributeLength; ++i) {
					attr = attributes.item(i);
					selector += "[" + attr.name + '="' + attr.value + '"]';
				}
				return selector;
			}

			/**
			 * Creates selector path (node and its parents) for given node
			 * @param {HTMLElement} node
			 * @return {string}
			 * @member ns.util.DOM
			 * @method getNodeSelectorPath
			 */
			function getNodeSelectorPath(node) {
				var path = getNodeSelector(node),
					parent = node.parentNode;
				while (parent) {

					path = getNodeSelector(parent) + ">" + path;

					parent = parent.parentNode;
					if (parent === document) {
						parent = null;
					}
				}
				return path;
			}

			DOM.getNodeSelector = getNodeSelector;
			DOM.getNodeSelectorPath = getNodeSelectorPath;

			/**
			 * Compares a node to another node
			 * note: this is needed because of broken WebComponents node wrapping
			 * @param {HTMLElement} nodeA
			 * @param {HTMLElement} nodeB
			 * @return {boolean}
			 * @member ns.util.DOM
			 * @method isNodeEqual
			 */
			DOM.isNodeEqual = function (nodeA, nodeB) {
				var nodeAPolyfilled = null,
					nodeBPolyfilled = null,
					foundNodeA = nodeA,
					foundNodeB = nodeB,
					unwrap = (window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.unwrap); // hack

				if (nodeA === null || nodeB === null) {
					return false;
				} else {
					nodeAPolyfilled = isNodeWebComponentPolyfilled(nodeA);
					nodeBPolyfilled = isNodeWebComponentPolyfilled(nodeB);
				}

				if (nodeAPolyfilled) {
					if (unwrap) {
						foundNodeA = unwrap(nodeA);
					} else {
						foundNodeA = document.querySelector(getNodeSelectorPath(nodeA));
					}
				}
				if (nodeBPolyfilled) {
					if (unwrap) {
						foundNodeB = unwrap(nodeB);
					} else {
						foundNodeB = document.querySelector(getNodeSelectorPath(nodeB));
					}
				}

				return foundNodeA === foundNodeB;
			};

			/**
			 * Checks if elemenent was converted via WebComponentsJS,
			 * this will return false if WC support is native
			 * @method isNodeWebComponentPolyfilled
			 * @param {HTMLElement} node
			 * @return {boolean}
			 * @static
			 * @member ns.util.DOM
			 */
			DOM.isNodeWebComponentPolyfilled = isNodeWebComponentPolyfilled;

			DOM.unwrapWebComponentPolyfill = unwrapWebComponentPolyfill;
			DOM.wrapWebComponentPolyfill = wrapWebComponentPolyfill;

			DOM.isElement = function (element) {
				var raw = element;
				if (!raw) {
					return false;
				}

				// Dirty hack for bogus WebComponent polyfill
				if (typeof raw.localName === "string" && raw.localName.length > 0) {
					return true;
				}

				if (!(element instanceof Element)) {
					if (isNodeWebComponentPolyfilled(element)) {
						raw = unwrapWebComponentPolyfill(element);
					}
				}

				return raw instanceof Element;
			};

			/**
			 * Appends node or array-like node list array to context
			 * @method appendNodes
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			 * @return {HTMLElement|Array|null}
			 * @static
			 * @throws {string}
			 */
			DOM.appendNodes = function (context, elements) {
				var i,
					len;
				if (context) {
					if (elements instanceof Array || elements instanceof NodeList || elements instanceof HTMLCollection) {
						elements = slice.call(elements);
						for (i = 0, len = elements.length; i < len; ++i) {
							context.appendChild(elements[i]);
						}
					} else {
						context.appendChild(elements);
					}
					return elements;
				}

				throw "Context empty!";
			};

			/**
			 * Replaces context with node or array-like node list
			 * @method replaceWithNodes
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			 * @return {HTMLElement|Array|null}
			 * @static
			 */
			DOM.replaceWithNodes = function (context, elements) {
				if (elements instanceof Array || elements instanceof NodeList || elements instanceof HTMLCollection) {
					elements = this.insertNodesBefore(context, elements);
					context.parentNode.removeChild(context);
				} else {
					context.parentNode.replaceChild(elements, context);
				}
				return elements;
			};

			/**
			 * Remove all children
			 * @method removeAllChildren
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @static
			 */
			DOM.removeAllChildren = function (context) {
				context.innerHTML = "";
			};

			/**
			 * Inserts node or array-like node list before context
			 * @method insertNodesBefore
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			 * @return {HTMLElement|Array|null}
			 * @static
			 * @throws {string}
			 */
			DOM.insertNodesBefore = function (context, elements) {
				var i,
					len,
					parent;
				if (context) {
					parent = context.parentNode;
					if (elements instanceof Array || elements instanceof NodeList || elements instanceof HTMLCollection) {
						elements = slice.call(elements);
						for (i = 0, len = elements.length; i < len; ++i) {
							parent.insertBefore(elements[i], context);
						}
					} else {
						parent.insertBefore(elements, context);
					}
					return elements;
				}

				throw "Context empty!";

			};

			/**
			 * Inserts node after context
			 * @method insertNodeAfter
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @static
			 * @throws {string}
			 */
			DOM.insertNodeAfter = function (context, element) {
				if (context) {
					context.parentNode.insertBefore(element, context.nextSibling);
					return element;
				}
				throw "Context empty!";
			};

			/**
			 * Wraps element or array-like node list in html markup
			 * @method wrapInHTML
			 * @param {HTMLElement|NodeList|HTMLCollection|Array} elements
			 * @param {string} html
			 * @return {HTMLElement|NodeList|Array} wrapped element
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.wrapInHTML = function (elements, html) {
				var container = document.createElement("div"),
					contentFlag = false,
					elementsLen = elements.length,
					//if elements is nodeList, retrieve parentNode of first node
					originalParentNode = elementsLen ? elements[0].parentNode : elements.parentNode,
					next = elementsLen ? elements[elementsLen - 1].nextSibling : elements.nextSibling,
					innerContainer;

				fragment.appendChild(container);
				html = html.replace(/(\$\{content\})/gi, function () {
					contentFlag = true;
					return "<span id='temp-container-" + (++containerCounter) + "'></span>";
				});
				container.innerHTML = html;

				if (contentFlag === true) {
					innerContainer = container.querySelector("span#temp-container-" + containerCounter);
					elements = this.replaceWithNodes(innerContainer, elements);
				} else {
					innerContainer = container.children[0];
					elements = this.appendNodes(innerContainer || container, elements);
				}

				// move the nodes
				while (fragment.firstChild.firstChild) {
					fragment2.appendChild(fragment.firstChild.firstChild);
				}

				// clean up
				while (fragment.firstChild) {
					fragment.removeChild(fragment.firstChild);
				}

				if (originalParentNode) {
					if (next) {
						originalParentNode.insertBefore(fragment2, next);
					} else {
						originalParentNode.appendChild(fragment2);
					}
				} else {
					// clean up
					while (fragment2.firstChild) {
						fragment2.removeChild(fragment2.firstChild);
					}
				}
				return elements;
			};
			}(window, window.document, ns));

/*global window, define, ns, Node */
/*jslint nomen: true, plusplus: true, bitwise: false */
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
 *
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Engine
 * Main class with engine of library which control communication
 * between parts of framework.
 * @class ns.engine
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Michal Szepielak <m.szepielak@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Przemyslaw Ciezkowski <p.ciezkowski@samsung.com>
 * @author Hyunkook, Cho <hk0713.cho@samsung.com>
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 * @author Piotr Ostalski <p.ostalski@samsung.com>
 */
(function (window, document) {
	"use strict";
				/**
			 * @method slice Array.slice
			 * @private
			 * @static
			 * @member ns.engine
			 */
			var slice = [].slice,
				/**
				 * @property {Object} eventUtils {@link ns.event}
				 * @private
				 * @static
				 * @member ns.engine
				 */
				eventUtils = ns.event,
				util = ns.util,
				objectUtils = util.object,
				DOMUtils = util.DOM,
				historyManager = ns.history.manager,
				selectors = util.selectors,
				/**
				 * @property {Object} widgetDefinitions Object with widgets definitions
				 * @private
				 * @static
				 * @member ns.engine
				 */
				widgetDefinitions = {},
				/**
				 * @property {Object} widgetBindingMap Object with widgets bindings
				 * @private
				 * @static
				 * @member ns.engine
				 */
				widgetBindingMap = {},
				location = window.location,
				/**
				 * engine mode, if true then engine only builds widgets
				 * @property {boolean} justBuild
				 * @private
				 * @static
				 * @member ns.engine
				 */
				justBuild = location.hash === "#build",
				/**
				 * @property {string} [TYPE_STRING="string"] local cache of string type name
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				TYPE_STRING = "string",
				/**
				 * @property {string} [TYPE_FUNCTION="function"] local cache of function type name
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				TYPE_FUNCTION = "function",
				/**
				 * @property {string} [DATA_BUILT="data-tau-built"] attribute informs that widget id build
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				DATA_BUILT = "data-tau-built",
				/**
				 * @property {string} [DATA_NAME="data-tau-name"] attribute contains widget name
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				DATA_NAME = "data-tau-name",
				/**
				 * @property {string} [DATA_BOUND="data-tau-bound"] attribute informs that widget id bound
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				DATA_BOUND = "data-tau-bound",
				/**
				 * @property {string} NAMES_SEPARATOR
				 * @private
				 * @static
				 * @readonly
				 */
				NAMES_SEPARATOR = ",",
				/**
				 * @property {string} [querySelectorWidgets="*[data-tau-built][data-tau-name]:not([data-tau-bound])"] query selector for all widgets which are built but not bound
				 * @private
				 * @static
				 * @member ns.engine
				 */
					// @TODO this selector is not valid ...
				querySelectorWidgets = "*[" + DATA_BUILT + "][" + DATA_NAME + "]:not([" + DATA_BOUND + "])",
				/**
				 * @method excludeBuildAndBound
				 * @private
				 * @static
				 * @member ns.engine
				 * @return {string} :not([data-tau-built*='widgetName']):not([data-tau-bound*='widgetName'])
				 */
				excludeBuiltAndBound = function (widgetType) {
					return ":not([" + DATA_BUILT + "*='" + widgetType +"']):not([" + DATA_BOUND + "*='" + widgetType +"'])";
				},

				/**
				 * Engine event types
				 * @property {Object} eventType
				 * @property {string} eventType.INIT="tauinit" INIT of framework init event
				 * @property {string} eventType.WIDGET_BOUND="widgetbound" WIDGET_BOUND of widget bound event
				 * @property {string} eventType.WIDGET_DEFINED="widgetdefined" WIDGET_DEFINED of widget built event
				 * @property {string} eventType.WIDGET_BUILT="widgetbuilt" WIDGET_BUILT of widget built event
				 * @property {string} eventType.BOUND="bound" BOUND of bound event
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				eventType = {
					INIT: "tauinit",
					WIDGET_BOUND: "widgetbound",
					WIDGET_DEFINED: "widgetdefined",
					WIDGET_BUILT: "widgetbuilt",
					BOUND: "bound"
				},
				engine;
			/**
			 * This function prepares selector for widget' definition
			 * @method selectorChange
			 * @param {string} selectorName
			 * @return {string} new selector
			 * @member ns.engine
			 * @static
			 */
			function selectorChange (selectorName) {
				if (selectorName.match(/\[data-role=/) && !selectorName.match(/:not\(\[data-role=/)) {
					return selectorName.trim();
				}
				return selectorName.trim() + ":not([data-role='none'])";
			}

			/**
			 * Function to define widget
			 * @method defineWidget
			 * @param {string} name
			 * @param {string} selector
			 * @param {Array} methods
			 * @param {Object} widgetClass
			 * @param {string} [namespace]
			 * @param {boolean} [redefine]
			 * @param {boolean} [widgetNameToLowercase = true]
			 * @return {boolean}
			 * @member ns.engine
			 * @static
			 */
			function defineWidget(name, selector, methods, widgetClass, namespace, redefine, widgetNameToLowercase, BaseElement) {
				var definition;
				// Widget name is absolutely required
				if (name) {
					if (!widgetDefinitions[name] || redefine) {
												methods = methods || [];
						methods.push("destroy", "disable", "enable", "option", "refresh", "value");
						definition = {
							name: name,
							methods: methods,
							selector: selector || "",
							selectors: selector ? selector.split(",").map(selectorChange) : [],
							widgetClass: widgetClass || null,
							namespace: namespace || "",
							widgetNameToLowercase: widgetNameToLowercase === undefined ? true : !!widgetNameToLowercase,
							BaseElement: BaseElement
						};

						widgetDefinitions[name] = definition;
						eventUtils.trigger(document, "widgetdefined", definition, false);
						return true;
					}
									} else {
					ns.error("Widget with selector [" + selector + "] defined without a name, aborting!");
				}
				return false;
			}

			/**
			 * Get binding for element
			 * @method getBinding
			 * @static
			 * @param {HTMLElement|string} element
			 * @param {string} [type] widget name, if is empty then return first built widget
			 * @return {?Object}
			 * @member ns.engine
			 */
			function getBinding(element, type) {
				var id = !element || typeof element === TYPE_STRING ? element : element.id,
					binding,
					widgetInstance,
					bindingElement,
					storedWidgetNames;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(id);
				}

				// Fetch group of widget defined for this element
				binding = widgetBindingMap[id];

				if (binding && typeof binding === "object") {
					// If name is defined it's possible to fetch it instantly
					if (type) {
						widgetInstance = binding.instances[type];
					} else {
						storedWidgetNames = Object.keys(binding.instances);
						widgetInstance = binding.instances[storedWidgetNames[0]];
					}

					// Return only it instance of the proper widget exists
					if (widgetInstance) {
						
						// Check if widget instance has that same object referenced
						if (widgetInstance.element === element) {
							return widgetInstance;
						}
					}
				}

				return null;
			}

			/**
			 * Set binding of widget
			 * @method setBinding
			 * @param {ns.widget.BaseWidget} widgetInstance
			 * @static
			 * @member ns.engine
			 */
			function setBinding(widgetInstance) {
				var id = widgetInstance.element.id,
					type = widgetInstance.name,
					widgetBinding = widgetBindingMap[id];

				
				// If the HTMLElement never had a widget declared create an empty object
				if(!widgetBinding) {
					widgetBinding = {
						elementId: id,
						element: widgetInstance.element,
						instances: {}
					};
				}

				widgetBinding.instances[type] = widgetInstance;
				widgetBindingMap[id] = widgetBinding;
			}

			/**
			 * Returns all bindings for element or id gives as parameter
			 * @method getAllBindings
			 * @param {HTMLElement|string} element
			 * @return {?Object}
			 * @static
			 * @member ns.engine
			 */
			function getAllBindings(element) {
				var id = !element || typeof element === TYPE_STRING ? element : element.id;

				return (widgetBindingMap[id] && widgetBindingMap[id].instances) || null;
			}

			/**
			 * Removes given name from attributeValue string.
			 * Names should be separated with a NAMES_SEPARATOR
			 * @param {string} name
			 * @param {string} attributeValue
			 * @private
			 * @static
			 * @return {string}
			 */
			function _removeWidgetNameFromAttribute(name, attributeValue) {
				var widgetNames,
					searchResultIndex;

				// Split attribute value by separator
				widgetNames = attributeValue.split(NAMES_SEPARATOR);
				searchResultIndex = widgetNames.indexOf(name);

				if (searchResultIndex > -1) {
					widgetNames.splice(searchResultIndex, 1);
					attributeValue = widgetNames.join(NAMES_SEPARATOR);
				}

				return attributeValue;
			}

			function _removeAllBindingAttributes(element) {
				element.removeAttribute(DATA_BUILT);
				element.removeAttribute(DATA_BOUND);
				element.removeAttribute(DATA_NAME);
			}

			/**
			 * Remove binding data attributes for element.
			 * @method _removeBindingAttributes
			 * @param {HTMLElement} element
			 * @param {string} type widget type (name)
			 * @private
			 * @static
			 * @member ns.engine
			 */
			function _removeWidgetFromAttributes(element, type) {
				var dataBuilt,
					dataBound,
					dataName;

				// Most often case is that name is not defined
				if (!type) {
					_removeAllBindingAttributes(element);
				} else {
					dataBuilt = _removeWidgetNameFromAttribute(type, element.getAttribute(DATA_BUILT) || "");
					dataBound = _removeWidgetNameFromAttribute(type, element.getAttribute(DATA_BOUND) || "");
					dataName = _removeWidgetNameFromAttribute(type, element.getAttribute(DATA_NAME) || "");

					// Check if all attributes have at least one widget
					if (dataBuilt && dataBound && dataName) {
						element.setAttribute(DATA_BUILT, dataBuilt);
						element.setAttribute(DATA_BOUND, dataBound);
						element.setAttribute(DATA_NAME, dataName);
					} else {
						// If something is missing remove everything
						_removeAllBindingAttributes(element);
					}
				}
			}

			/**
			 * Method removes binding for single widget.
			 * @method _removeSingleBinding
			 * @param {Object} bindingGroup
			 * @param {string} type
			 * @return {boolean}
			 * @private
			 * @static
			 */
			function _removeSingleBinding(bindingGroup, type) {
				var widgetInstance = bindingGroup[type];

				if (widgetInstance){
					if (widgetInstance.element && typeof widgetInstance.element.setAttribute === TYPE_FUNCTION) {
						_removeWidgetFromAttributes(widgetInstance.element, type);
					}

					bindingGroup[type] = null;

					return true;
				}

				return false;
			}

			/**
			 * Remove binding for widget based on element.
			 * @method removeBinding
			 * @param {HTMLElement|string} element
			 * @param {?string} [type=null] widget name
			 * @return {boolean}
			 * @static
			 * @member ns.engine
			 */
			function removeBinding(element, type) {
				var id = (typeof element === TYPE_STRING) ? element : element.id,
					binding = widgetBindingMap[id],
					bindingGroup,
					widgetName,
					partialSuccess,
					fullSuccess = false;

				// [NOTICE] Due to backward compatibility calling removeBinding
				// with one parameter should remove all bindings

				if (binding) {
					if (typeof element === TYPE_STRING) {
						// Search based on current document may return bad results,
						// use previously defined element if it exists
						element = binding.element;
					}

					if (element) {
						_removeWidgetFromAttributes(element, type);
					}

					bindingGroup = widgetBindingMap[id] && widgetBindingMap[id].instances;

					if (bindingGroup) {
						if (!type) {
							fullSuccess = true;

							// Iterate over group of created widgets
							for (widgetName in bindingGroup) {
								if (bindingGroup.hasOwnProperty(widgetName)) {
									partialSuccess = _removeSingleBinding(bindingGroup, widgetName);
									
									// As we iterate over keys we are sure we want to remove this element
									// NOTE: Removing property by delete is slower than assigning null value
									bindingGroup[widgetName] = null;

									fullSuccess = (fullSuccess && partialSuccess);
								}
							}

							// If the object bindingGroup is empty or every key has a null value
							if (objectUtils.hasPropertiesOfValue(bindingGroup, null)) {
								// NOTE: Removing property by delete is slower than assigning null value
								widgetBindingMap[id] = null;
							}

							return fullSuccess;
						}

						partialSuccess = _removeSingleBinding(bindingGroup, type);

						if (objectUtils.hasPropertiesOfValue(bindingGroup, null)) {
							widgetBindingMap[id] = null;
						}

						return partialSuccess;
					}
				}

				return false;
			}

			/**
			 * Removes all bindings of widgets.
			 * @method removeAllBindings
			 * @param {HTMLElement|string} element
			 * @return {boolean}
			 * @static
			 * @member ns.engine
			 */
			function removeAllBindings(element) {
				// @TODO this should be coded in the other way around, removeAll should loop through all bindings and inside call removeBinding
				// but due to backward compatibility that code should be more readable
				return removeBinding(element);
			}

			/**
			 * If element not exist create base element for widget.
			 * @method ensureElement
			 * @param {HTMLElement} element
			 * @param {ns.widget.BaseWidget} Widget
			 * @return {HTMLElement}
			 * @static
			 * @private
			 * @member ns.engine
			 */
			function ensureElement(element, Widget) {
			 	if (!element || !DOMUtils.isElement(element)) {
					if (typeof Widget.createEmptyElement === TYPE_FUNCTION) {
						element = Widget.createEmptyElement();
					} else {
						element = document.createElement("div");
					}
				}
				return element;
			}

			/**
			 * Load widget
			 * @method processWidget
			 * @param {HTMLElement} element base element of widget
			 * @param {Object} definition definition of widget
			 * @param {ns.widget.BaseWidget} definition.widgetClass
			 * @param {string} definition.name
			 * @param {Object} [options] options for widget
			 * @private
			 * @static
			 * @member ns.engine
			 */
			function processWidget(element, definition, options) {
				var widgetOptions = options || {},
					createFunction = widgetOptions.create,
					Widget = definition.widgetClass,
					/**
					 * @type {ns.widget.BaseWidget} widgetInstance
					 */
					widgetInstance,
					buildAttribute,
					parentEnhance,
					existingBinding;

				// ensure that element exists, if not exists then create new
				// this give possibility of creating widgets outside DOM
				element = ensureElement(element, Widget);
				widgetInstance = Widget ? new Widget(element) : false;
				// if any parent has attribute data-enhance=false then stop building widgets
				parentEnhance = selectors.getParentsBySelectorNS(element, "enhance=false");

				// While processing widgets queue other widget may built this one before
				// it reaches it's turn
				existingBinding = getBinding(element, definition.name);
				if (existingBinding && existingBinding.element === element) {
					return existingBinding.element;
				}

				if (widgetInstance && !parentEnhance.length) {
										widgetInstance.configure(definition, element, options);

					// Run .create method from widget options when a [widgetName]create event is triggered
					if (typeof createFunction === TYPE_FUNCTION) {
						eventUtils.one(element, definition.name.toLowerCase() + "create", createFunction);
					}

					if (element.id) {
						widgetInstance.id = element.id;
					}

					// Check if this type of widget was build for this element before
					buildAttribute = element.getAttribute(DATA_BUILT);
					if (!buildAttribute || (buildAttribute && buildAttribute.split(NAMES_SEPARATOR).indexOf(widgetInstance.name) === -1)) {
						element = widgetInstance.build(element);
					}

					if (element) {
						widgetInstance.element = element;

						setBinding(widgetInstance);

						widgetInstance.trigger(eventType.WIDGET_BUILT, widgetInstance, false);

						if (!justBuild) {
							widgetInstance.init(element);
						}

						widgetInstance.bindEvents(element, justBuild);

						eventUtils.trigger(element, eventType.WIDGET_BOUND, widgetInstance, false);
						eventUtils.trigger(document, eventType.WIDGET_BOUND, widgetInstance);
					} else {
											}
				}
				return widgetInstance.element;
			}

			/**
			 * Destroys widget of given 'type' for given HTMLElement.
			 * [NOTICE] This method won't destroy any children widgets.
			 * @method destroyWidget
			 * @param {HTMLElement|string} element
			 * @param {string} type
			 * @static
			 * @member ns.engine
			 */
			function destroyWidget(element, type) {
				var widgetInstance;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(element);
				}

				
				// If type is not defined all widgets should be removed
				// this is for backward compatibility
				widgetInstance = getBinding(element, type);

				if (widgetInstance) {
					//Destroy widget
					widgetInstance.destroy();
					widgetInstance.trigger("widgetdestroyed");

					removeBinding(element, type);
				}
			}

			/**
			 * Calls destroy on widget (or widgets) connected with given HTMLElement
			 * Removes child widgets as well.
			 * @method destroyAllWidgets
			 * @param {HTMLElement|string} element
			 * @param {boolean} [childOnly=false] destroy only widgets on children elements
			 * @static
			 * @member ns.engine
			 */
			function destroyAllWidgets(element, childOnly) {
				var widgetName,
					widgetInstance,
					widgetGroup,
					childWidgets,
					i;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(element);
				}

				
				if (!childOnly) {
					// If type is not defined all widgets should be removed
					// this is for backward compatibility
					widgetGroup = getAllBindings(element);
					for (widgetName in widgetGroup) {
						if (widgetGroup.hasOwnProperty(widgetName)) {
							widgetInstance = widgetGroup[widgetName];

							//Destroy widget
							if (widgetInstance) {
								widgetInstance.destroy();
								widgetInstance.trigger("widgetdestroyed");
							}
						}
					}
				}

				//Destroy child widgets, if something left.
				childWidgets = slice.call(element.querySelectorAll("[" + DATA_BOUND + "]"));
				for (i = childWidgets.length - 1; i >= 0; i -= 1) {
					if (childWidgets[i]) {
						destroyAllWidgets(childWidgets[i], false);
					}
				}

				removeAllBindings(element);
			}

			/**
			 * Load widgets from data-* definition
			 * @method processHollowWidget
			 * @param {HTMLElement} element base element of widget
			 * @param {Object} definition widget definition
			 * @param {Object} [options] options for create widget
			 * @return {HTMLElement} base element of widget
			 * @private
			 * @static
			 * @member ns.engine
			 */
			function processHollowWidget(element, definition, options) {
				var name = (element && element.getAttribute(DATA_NAME)) ||
						(definition && definition.name);
								definition = definition || (name && widgetDefinitions[name]) || {
					"name": name
				};
				return processWidget(element, definition, options);
			}

			/**
			 * Compare function for nodes on build queue
			 * @param {Object} nodeA
			 * @param {Object} nodeB
			 * @return {number}
			 * @private
			 * @static
			 */
			function compareByDepth(nodeA, nodeB) {
				/*jshint -W016 */
				var mask = Node.DOCUMENT_POSITION_CONTAINS | Node.DOCUMENT_POSITION_PRECEDING;

				if (nodeA.element === nodeB.element) {
					return 0;
				}

				if (nodeA.element.compareDocumentPosition(nodeB.element) & mask) {
					return 1;
				}
				/*jshint +W016 */
				return -1;
			}

			/**
			 * Processes one build queue item. Runs processHollowWidget
			 * underneath
			 * @method processBuildQueueItem
			 * @param {Object|HTMLElement} queueItem
			 * @private
			 * @static
			 */
			function processBuildQueueItem(queueItem) {
				// HTMLElement doesn't have .element property
				// widgetDefinitions will return undefined when called widgetDefinitions[undefined]
				processHollowWidget(queueItem.element || queueItem, widgetDefinitions[queueItem.widgetName]);
			}

			/**
			 * Build widgets on all children of context element
			 * @method createWidgets
			 * @static
			 * @param {HTMLElement} context base html for create children
			 * @member ns.engine
			 */
			function createWidgets(context) {
				// find widget which are built
				var builtWidgetElements = slice.call(context.querySelectorAll(querySelectorWidgets)),
					normal = [],
					buildQueue = [],
					selectorKeys = Object.keys(widgetDefinitions),
					excludeSelector,
					i,
					j,
					len = selectorKeys.length,
					definition,
					widgetName,
					definitionSelectors;

				
				
				// process built widgets
				builtWidgetElements.forEach(processBuildQueueItem);

				// process widgets didn't build
				for (i = 0; i < len; ++i) {
					widgetName = selectorKeys[i];
					definition = widgetDefinitions[widgetName];
					definitionSelectors = definition.selectors;
					if (definitionSelectors.length) {
						excludeSelector = excludeBuiltAndBound(widgetName);

						normal = slice.call(context.querySelectorAll(definitionSelectors.join(excludeSelector + ",") + excludeSelector));
						j = normal.length;

						while (--j >= 0) {
							buildQueue.push({
								element: normal[j],
								widgetName: widgetName
							});
						}
					}
				}

				// Sort queue by depth, on every DOM branch outer most element go first
				buildQueue.sort(compareByDepth);

				// Build all widgets from queue
				buildQueue.forEach(processBuildQueueItem);

				
				eventUtils.trigger(document, "built");
				eventUtils.trigger(document, eventType.BOUND);
							}

			/**
			 * Handler for event create
			 * @method createEventHandler
			 * @param {Event} event
			 * @static
			 * @member ns.engine
			 */
			function createEventHandler(event) {
				createWidgets(event.target);
			}

			function setViewport() {
				/**
				 * Sets viewport tag if not exists
				 */
				var documentHead = document.head,
					metaTagListLength,
					metaTagList,
					metaTag,
					i;

				metaTagList = documentHead.querySelectorAll("[name='viewport']");
				metaTagListLength = metaTagList.length;

				if (metaTagListLength > 0) {
					// Leave the last viewport tag
					--metaTagListLength;

					// Remove duplicated tags
					for (i = 0; i < metaTagListLength; ++i) {
						// Remove meta tag from DOM
						documentHead.removeChild(metaTagList[i]);
					}
				} else {
					// Create new HTML Element
					metaTag = document.createElement("meta");

					// Set required attributes
					metaTag.setAttribute("name", "viewport");
					metaTag.setAttribute("content", "width=device-width, user-scalable=no");

					// Force that viewport tag will be first child of head
					if (documentHead.firstChild) {
						documentHead.insertBefore(metaTag, documentHead.firstChild);
					} else {
						documentHead.appendChild(metaTag);
					}
				}
			}

			/**
			 * Build first page
			 * @method build
			 * @static
			 * @member ns.engine
			 */
			function build() {
				historyManager.enable();
				setViewport();
				eventUtils.trigger(document, "build");
			}

			/**
			 * Method to remove all listeners bound in run
			 * @method stop
			 * @static
			 * @member ns.engine
			 */
			function stop() {
				historyManager.disable();
			}

			/*
			 document.addEventListener(eventType.BOUND, function () {
			 //@TODO dump it to file for faster binding by ids
			 nsWidgetBindingMap = widgetBindingMap;
			 }, false);
			 */
			ns.widgetDefinitions = {};
			engine = {
				justBuild: location.hash === "#build",
				/**
				 * object with names of engine attributes
				 * @property {Object} dataTau
				 * @property {string} [dataTau.built="data-tau-built"] attribute inform that widget id build
				 * @property {string} [dataTau.name="data-tau-name"] attribute contains widget name
				 * @property {string} [dataTau.bound="data-tau-bound"] attribute inform that widget id bound
				 * @property {string} [dataTau.separator=","] separation string for widget names
				 * @static
				 * @member ns.engine
				 */
				dataTau: {
					built: DATA_BUILT,
					name: DATA_NAME,
					bound: DATA_BOUND,
					separator: NAMES_SEPARATOR
				},
				destroyWidget: destroyWidget,
				destroyAllWidgets: destroyAllWidgets,
				createWidgets: createWidgets,

				/**
				 * Method to get all definitions of widgets
				 * @method getDefinitions
				 * @return {Object}
				 * @static
				 * @member ns.engine
				 */
				getDefinitions: function () {
					return widgetDefinitions;
				},
				/**
				 * Returns definition of widget
				 * @method getWidgetDefinition
				 * @param {string} name
				 * @static
				 * @member ns.engine
				 * @returns {Object}
				 */
				getWidgetDefinition: function (name) {
					return widgetDefinitions[name];
				},
				defineWidget: defineWidget,
				getBinding: getBinding,
				getAllBindings: getAllBindings,
				setBinding: setBinding,
				// @TODO either rename or fix functionally because
				// this method does not only remove binding but
				// actually destroys widget
				removeBinding: removeBinding,
				removeAllBindings: removeAllBindings,

				/**
				 * Clear bindings of widgets
				 * @method _clearBindings
				 * @static
				 * @member ns.engine
				 */
				_clearBindings: function () {
					//clear and set references to the same object
					widgetBindingMap = {};
				},

				build: build,

				/**
				 * Run engine
				 * @method run
				 * @static
				 * @member ns.engine
				 */
				run: function () {
										stop();

					eventUtils.fastOn(document, "create", createEventHandler);

					eventUtils.trigger(document, eventType.INIT, {tau: ns});

					switch (document.readyState) {
					case "interactive":
					case "complete":
						build();
						break;
					default:
						eventUtils.fastOn(document, "DOMContentLoaded", build.bind(engine));
						break;
					}
				},

				/**
				 * Build instance of widget and binding events
				 * Returns error when empty element is passed
				 * @method instanceWidget
				 * @param {HTMLElement|string} [element]
				 * @param {string} name
				 * @param {Object} [options]
				 * @return {?Object}
				 * @static
				 * @member ns.engine
				 */
				instanceWidget: function (element, name, options) {
					var binding,
						definition;

					if (!!name && typeof name !== "string") {
						ns.error("'name' argument for instanceWidget should be a string");
					}

					// Backward compatibility for method getTypes
					// In case only one first element is passed it's changed to
					// widget name
					if (!name && typeof element === "string") {
						name = element;
						element = null;
					}

					// If element exists try to find existing binding
					// document.body may not be instance of HTMLElement in case of webcomponents polyfill
					if (DOMUtils.isElement(element)) {
						binding = getBinding(element, name);
					}
					// If didn't found binding build new widget
					if (!binding && widgetDefinitions[name]) {
						definition = widgetDefinitions[name];
						element = processHollowWidget(element, definition, options);
						binding = getBinding(element, name);
					} else if (binding !== null) {
						// if widget was built early we should set options delivered to constructor
						binding.option(options);
					}
					return binding;
				},

				stop: stop,

				/**
				 * Method to change build mode
				 * @method setJustBuild
				 * @param {boolean} newJustBuild
				 * @static
				 * @member ns.engine
				 */
				setJustBuild: function (newJustBuild) {
					// Set location hash to have a consistent behavior
					if(newJustBuild){
						location.hash = "build";
					} else {
						location.hash = "";
					}

					justBuild = newJustBuild;
				},

				/**
				 * Method to get build mode
				 * @method getJustBuild
				 * @return {boolean}
				 * @static
				 * @member ns.engine
				 */
				getJustBuild: function () {
					return justBuild;
				},
				_createEventHandler : createEventHandler
			};

			engine.eventType = eventType;
			ns.engine = engine;
			}(window, window.document));

/*global window, define, ns */
/*jslint browser: true */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Controller
 *
 * Controller is module gives developers possibility of creating MVC structure in applications.
 *
 * Developer can define own callback to custom paths.
 *
 * Module listen on all events connected to path changes and call function defined by developer after new hash in url match to defined path.
 *
 * ## Defining paths
 *
 * To define custom path use method *addRoute*:
 *
 *	@example
 *	<script>
 *		var controller = tau.Controller.getInstance();
 *		controller.addRoute("page-params/:param1/:param2", function (deferred, param1, param2) {
 *			deferred.resolve(
 *				'<div data-role="page">' +
 *				'<div>param1: <strong>' + param1 + '</strong></div>' +
 *				'<div>param2: <strong>' + param2 + '</strong></div>' +
 *				'</a>'
 *			);
 *		});
 *	</script>
 *
 * When hash will change to #page-params/parameter1/parameter+2 callback will be called and param1, param2 will be filled.
 *
 * In callback developer should call one method from deferred object (resolve, reject) to inform controller about success or error.
 *
 * ## Working with router
 *
 * If TAU Router is loaded then controller handle path change as first and after call resolve method processing in moved to router.
 * If first argument of resolve method is set then router open page given in first argument.
 *
 * @class ns.Controller
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 */
(function (document) {
	"use strict";
				var eventUtils = ns.event,
				util = ns.util,
				pathToRegexp = util.pathToRegexp,
				history = ns.history,
				object = util.object,
				historyManager = history.manager,
				historyManagerEvents = historyManager.events,
				EVENT_PATH_RESOLVED = "controller-path-resolved",
				EVENT_PATH_REJECTED = "controller-path-rejected",
				EVENT_CONTENT_AVAILABLE = "controller-content-available",
				Controller = function () {
					var self = this;

					/**
					 * All registered routes in controller
					 * @property {Array} _routes
					 * @protected
					 * @member ns.Controller
					 */
					self._routes = [];

					/**
					 * Callback for event statechange
					 * @property {?Function} [_onStateChange=null]
					 * @protected
					 * @member ns.Controller
					 */
					self._onStateChange = null;

					/**
					 * Last matched route
					 * @property {Array} currentRoute
					 * @protected
					 * @member ns.Controller
					 */
					self._currentRoute = null;
				},
				controllerInstance = null,
				prototype = Controller.prototype;

			/**
			 * Object contains all events names triggered by controller
			 * @property {Object} events
			 * @property {string} [events.PATH_RESOLVED="controller-path-resolved"]
			 * @property {string} [events.PATH_REJECTED="controller-path-rejected"]
			 * @property {string} [events.CONTENT_AVAILABLE="controller-content-available"]
			 * @static
			 * @member ns.Controller
			 */
			Controller.events = {
				PATH_RESOLVED: EVENT_PATH_RESOLVED,
				PATH_REJECTED: EVENT_PATH_REJECTED,
				CONTENT_AVAILABLE: EVENT_CONTENT_AVAILABLE
			};

			/**
			 * Iterates through routes, tries to find matching and executes it
			 * @param {ns.Controller} controller
			 * @param {Array} routes
			 * @param {string} path
			 * @param {object} options
			 * @return {boolean}
			 */
			function loadRouteFromList(controller, routes, path, options) {
				// find first matched route
				return routes.some(function (route) {
					// current path match or not cut route
					var matches = route.regexp.exec(path),
						// init deferred object
						deferredTemplate = {},
						// init params array
						params = [];
					// if matches
					if (matches && matches.length > 0) {
						// add to deferred object method resolve
						deferredTemplate.resolve = function (content) {
							var state,
								url = options.url || options.href || "";
							// if content is available
							if (content) {
								// trigger event to router or other components which can handle content
								if (!eventUtils.trigger(document, EVENT_CONTENT_AVAILABLE, {content: content, options: options})) {
									// Routes save path to history and we need block saving to history by controller
									options.notSaveToHistory = true;
								}
							}
							// change URL
														if (!options.fromHashChange && !options.notSaveToHistory) {
								// insert to history only if not from hashchange event
								// hash change event has own history item
								state = object.merge(
									{},
									options,
									{
										url: url
									}
								);
								history.replace(state, options.title || "", url);
								history.enableVolatileMode();
							}
							eventUtils.trigger(document, EVENT_PATH_RESOLVED, options);
							// save route to current route
							controller._currentRoute = route;
							// return true to inform same method about end
							return true;
						};
						// add to deferred object method resolve
						deferredTemplate.reject = function () {
							eventUtils.trigger(document, EVENT_PATH_REJECTED, options);
						};

						// take a params
						params = matches.splice(1);
						// add to arguments deferred object on begin
						params.unshift(deferredTemplate);
						// call callback defined by developer
						route.callback.apply(null, params);

						return true;
					}

					// inform parent method that not found any route
					return false;
				});
			}

			/**
			 * Stop event propagation and prevent default
			 * @param {Event} event
			 */
			function handleEvent(event) {
				eventUtils.preventDefault(event);
				eventUtils.stopImmediatePropagation(event);
			}

			/**
			 * Callback on history state change which is trigger by history manager.
			 * @param {ns.Controller} controller
			 * @param {Event} event
			 */
			function onHistoryStateChange(controller, event) {
				var options = event.detail,
					url = options.url || options.href || "";

				
				if (options.rel === "back") {
					// call history back
					history.back();
					// stop event
					handleEvent(event);
				} else {
					// find matched route
					if (loadRouteFromList(controller, controller._routes, url.replace(/^[^#]*#/i, ""), options)) {
						// stop event
						handleEvent(event);
					}
				}
			}

			/**
			 * Change page to page given in parameter "to".
			 *
			 *	@example
			 *	<script>
			 *		var controller = tau.Controller.getInstance();
			 *		controller.open("new-hash");
			 *	</script>
			 * @param {string} to new hash
			 * @member ns.Controller
			 * @method open
			 * @since 2.4
			 */
			prototype.open = function (to) {
				location.hash = "#" + to;
			};

			/**
			 * Back to previous controller state
			 *
			 *	@example
			 *	<script>
			 *		var controller = tau.Controller.getInstance();
			 *		controller.back();
			 *	</script>
			 * @member ns.Controller
			 * @method back
			 * @since 2.4
			 */
			prototype.back = function () {
				history.back();
			};

			/**
			 * Adds route to routing table
			 *
			 * Developer can add custom routes to Router by *addRouter* method.
			 * The method takes two arguments, the first one is a route name and the second one is a callback method.
			 *
			 * The callback is invoked with a particularly important parameter _deferred_.
			 * Developer should handle success by calling _deferred.resolve()_
			 * and failed exception by _deferred.reject()_ method.
			 *
			 * #### Custom route with loading page from template
			 *
			 *		@example
			 *		<script>
			 *		var controller = tau.Controller.getInstance();
			 *		controller.addRoute("page-template", function (deferred) {
			 *			tau.template.render("templates/page-template.html", {}, function (status, data) {
			 *				if (status.success) {
			 *					deferred.resolve(data);
			 *				} else {
			 *					deferred.reject();
			 *				}
			 *			});
			 *		});
			 *		</script>
			 *
			 * #### Custom route with loading page from string
			 *
			 *		@example
			 *		<script>
			 *			var controller = tau.Controller.getInstance();
			 *			controller.addRoute("page-string", function (deferred) {
			 *				deferred.resolve('<div data-role="page">Hello world!</a>');
			 *			});
			 *		</script>
			 *
			 * #### Custom route with loading popup from template
			 *
			 *		@example
			 *		<script>
			 *			var controller = tau.Controller.getInstance();
			 *			controller.addRoute("popup-template", function (deferred) {
			 *				tau.template.render("templates/popup-template.html", {}, function (status, data) {
			 *					if (status.success) {
			 *						deferred.resolve(data);
			 *				} else {
			 *						deferred.reject();
			 *					}
			 *				});
			 *			});
			 *		</script>
			 *
			 * #### Custom route with creating pages on the fly
			 *
			 *		@example
			 *		<script>
			 *			var controller = tau.Controller.getInstance();
			 *			controller.addRoute("page-dynamic", function (deferred) {
			 *				var page = document.createElement("div");
			 *				page.className = "ui-page";
			 *				page.textContent = "Hello world!";
			 *				deferred.resolve(page);
			 *			});
			 *		</script>
			 *
			 * #### Method addRoute allows to define parameters provided in route
			 *
			 *		@example
			 *		<script>
			 *			var controller = tau.Controller.getInstance();
			 *			controller.addRoute("page-params/:param1/:param2", function (deferred, param1, param2) {
			 *				deferred.resolve(
			 *					'<div data-role="page">' +
			 *					'<div>param1: <strong>' + param1 + '</strong></div>' +
			 *					'<div>param2: <strong>' + param2 + '</strong></div>' +
			 *					'</a>'
			 *				);
			 *			});
			 *		</script>
			 *
			 * @param {string} path
			 * @param {Function} callback
			 * @member ns.Controller
			 * @method addRoute
			 * @since 2.4
			 */
			prototype.addRoute = function (path, callback) {
				var self = this,
					// take all routes
					routes = self._routes,
					// check existing route
					pathExists = routes.some(function (value) {
						return value.path === path;
					}),
					route = null;
				// if path not exists in routes
				if (!pathExists) {
					// create route object
					route = {
						path: path,
						callback: callback,
						regexp: null,
						keys: []
					};
					// convert path to Regexp
					route.regexp = pathToRegexp(path, route.keys);
					// add route ro routes array
					routes.push(route);
				}
			};

			/**
			 * Removes route from routing table
			 *
			 *	@example
			 *	<script>
			 *		var controller = tau.Controller.getInstance();
			 *		controller.removeRoute("page-params/:param1/:param2");
			 *		// -> path "page-params/:param1/:param2" is removed from routes
			 *	</script>
			 * @param {string} path
			 * @member ns.Controller
			 * @method removeRoute
			 * @since 2.4
			 */
			prototype.removeRoute = function (path) {
				this._routes = this._routes.filter(function (value) {
					return value.path !== path;
				});
			};

			/**
			 * Removes routes routes from routing table
			 *
			 *	@example
			 *	<script>
			 *		var controller = tau.Controller.getInstance();
			 *		controller.removeAllRoutes();
			 *		// -> routes array will be empty
			 *	</script>
			 * @member ns.Controller
			 * @method removeRoute
			 * @since 2.4
			 */
			prototype.removeAllRoutes = function () {
				this._routes = [];
			};

			/**
			 * Initialize controller to work with history manager.
			 *
			 *	@example
			 *	<script>
			 *		var controller = tau.Controller.getInstance();
			 *		controller.init();
			 *		// -> now controller will be listen on events.
			 *	</script>
			 * @member ns.Controller
			 * @method init
			 * @since 2.4
			 */
			prototype.init = function () {
				var self = this;

				// check existing of event listener
				if (!self._onStateChange) {
					self._onStateChange = onHistoryStateChange.bind(null, self);
					window.addEventListener(historyManagerEvents.STATECHANGE, self._onStateChange, true);
				}
			};

			/**
			 * Destroy controller
			 *
			 *	@example
			 *	<script>
			 *		var controller = tau.Controller.getInstance();
			 *		controller.destroy();
			 *		// -> now controller will be not listen on events.
			 *	</script>
			 * @member ns.Controller
			 * @method destroy
			 * @since 2.4
			 */
			prototype.destroy = function () {
				var self = this;
				window.removeEventListener(historyManagerEvents.STATECHANGE, self._onStateChange, true);
				// destroy callback to give possibility to another init
				self._onStateChange = null;
			};

			/**
			 * Create new instance of controller
			 *
			 *	@example
			 *	<script>
			 *		var controller1 = tau.Controller.newInstance(),
			 *			controller2 = tau.Controller.newInstance();
			 *		// -> now you will have 2 instances of controller
			 *		// controller1 === controller2
			 *
			 *	</script>
			 * @member ns.Controller
			 * @method newInstance
			 * @since 2.4
			 */
			Controller.newInstance = function () {
				if (controllerInstance) {
					controllerInstance.destroy();
				}
				return (controllerInstance = new Controller());
			};

			/**
			 * Get existing instance of controller or create new.
			 *
			 *	@example
			 *	<script>
			 *		var controller1 = tau.Controller.newInstance(),
			 *			controller2 = tau.Controller.newInstance()	;
			 *		// -> now you will have 2 instances of controller
			 *		// controller1 !== controller2
			 *
			 * @member ns.Controller
			 * @method getInstance
			 * @since 2.4
			 */
			Controller.getInstance = function () {
				return controllerInstance || this.newInstance();
			};

			// automate init controller if isn't disabled by config
			if (!ns.getConfig("disableController", false)) {
				document.addEventListener(historyManagerEvents.ENABLED, function () {
					Controller.getInstance().init();
				});

				document.addEventListener(historyManagerEvents.DISABLED, function () {
					Controller.getInstance().destroy();
				});
			}

			ns.Controller = Controller;

			}(window.document));

/*global define, ns */
/*jslint nomen: true, plusplus: true, bitwise: false */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Template Manager
 *
 * Object menage template's engines and renderer HTMLElement by template engine.
 *
 * @class ns.template
 * @since 2.4
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function () {
	"use strict";
				var utilPath = ns.util.path,
				template,
				templateFunctions = {},
				globalOptions = {
					"pathPrefix": "",
					"default" : ""
				};

			/**
			 * Function to get global option
			 *
			 *	@example
			 *		tau.template.get("pathPrefix");
			 *		// -> "/prefix/to/all/paths"
			 *
			 * @method get
			 * @param {string} name param name which will be return
			 * @return {*} return value of option
			 * @since 2.4
			 * @member ns.template
			 */
			function get(name) {
				return globalOptions[name];
			}

			/**
			 * Function to set global option
			 *
			 *	@example
			 *		tau.template.set("pathPrefix", "/views");
			 *
			 * @method set
			 * @param {string} name param name which will be set
			 * @param {*} value value to set
			 * @since 2.4
			 * @member ns.template
			 */
			function set(name, value) {
				globalOptions[name] = value;
			}

			/**
			 * Register new template function
			 *
			 * Template function should have 4 arguments:
			 *
			 *  - globalOptions - global options of template engine
			 *  - path - path or id of template content
			 *  - data - data for template render
			 *  - callback - callback call on finish
			 *
			 * and should call callback on finish with arguments:
			 *
			 *  - status - object describing status of render
			 *  - element - base HTMLElement of template results (on error can be null)
			 *
			 * after registration you can use engine in render function.
			 *
			 *	@example
			 *		tau.template.register("inline", function(globalOptions, path, data, callback) {
			 *			callback({
			 *						success: true
			 *					},
			 *					document.createElement("div")
			 *				);
			 *		});
			 *
			 * @method register
			 * @param {string} name Engine name
			 * @param {function} templateFunction function to renderer template
			 * @since 2.4
			 * @member ns.template
			 */
			function register(name, templateFunction) {
				templateFunctions[name] = templateFunction;
			}

			/**
			 * Unregister template function
			 *
			 * @method unregister
			 * @param {string} name Engine name
			 * @since 2.4
			 * @member ns.template
			 */
			function unregister(name) {
				templateFunctions[name] = null;
			}

			/**
			 * Return engine with given name
			 *
			 * @method engine
			 * @param {string} name Engine name
			 * @since 2.4
			 * @member ns.template
			 */
			function engine(name) {
				return templateFunctions[name];
			}

			/**
			 * Create absolute path for given path.
			 * If parameter withProfile is true, the returned path will have name of profile
			 * separated by dots before the last dot.
			 * @method getAbsUrl
			 * @param {string} path
			 * @param {boolean} withProfile Create path with profile's name
			 * @return {string} changed path
			 * @since 2.4
			 */
			function getAbsUrl(path, withProfile) {
				var profile = ns.info.profile,
					lastDot = path.lastIndexOf(".");

				if (utilPath.isAbsoluteUrl(path)) {
					return path;
				}

				if (withProfile) {
					path = path.substring(0, lastDot) + "." + profile + path.substring(lastDot);
				}

				return utilPath.makeUrlAbsolute((globalOptions.pathPrefix || "" ) + path, utilPath.getLocation());
			}

			/**
			 * Return HTMLElement for given path
			 *
			 * When engine name is not given then get default name from global options. If this is not set then get first registered engine.
			 *
			 * Result of this method is handed to callback. First parameter of callback is object with status. Second is HTMLElement generated by engine.
			 *
			 * Status object contains properties:
			 *
			 *  - _boolean_ success - inform about success or error
			 *  - _string_ description contains details on error
			 *
			 *	@example
			 *		tau.template.render("external/path/to/file.html", {additionalParameter: true}, function(status, element) {
			 *			if (status.success) {
			 *				document.body.appendChild(element);
			 *			} else {
			 *				console.error(status.description);
			 *			}, "html");
			 *
			 * @method render
			 * @param {string} path Path to file ot other id for template system
			 * @param {Object} data additional data for template system
			 * @param {function} callback function which will be called on finish
			 * @param {string} [engineName] engine name
			 * @since 2.4
			 * @member ns.template
			 */
			function render(path, data, callback, engineName) {
				var templateFunction = templateFunctions[engineName || get("default") || ""],
					targetCallback = function (status, element) {
						// add current patch
						status.absUrl = targetPath;
						callback(status, element);
					},
					templateCallback = function (status, element) {
						if (status.success) {
							// path was found and callback can be called
							targetCallback(status, element);
						} else {
							// try one more time with path without profile
							targetPath = getAbsUrl(path, false);
							templateFunction(globalOptions, targetPath, data || {}, targetCallback);
						}
					},
					targetPath;

				// if template engine name and default name is not given then we
				// take first registered engine
				if (!templateFunction) {
					templateFunction = templateFunctions[Object.keys(templateFunctions).pop()];
				}

				// if template system exists then we go to him
				if (templateFunction) {
					targetPath = getAbsUrl(path, true);
					templateFunction(globalOptions,targetPath, data || {}, templateCallback);
				} else {
					// else we return error
					callback({
						success: false,
						description: "Can't get engine system"
					}, null);
				}
			}

			template = {
				get: get,
				set: set,
				register: register,
				unregister: unregister,
				engine: engine,
				render: render
			};

			ns.template = template;
			}());

/*global define, XMLHttpRequest, ns*/
/*jslint bitwise: true */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #HTML template engine
 *
 * Parser for HTML files.
 *
 * This class hasn't public interface. This class is registered as template engine
 * in template manager.
 *
 * This engine give support of load HTML files for give URL.
 *
 * @class ns.template.html
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function () {
	"use strict";
			var template = ns.template,
				util = ns.util,
				utilPath = util.path;

			/**
			 * Callback for event load and error on  XMLHttpRequest
			 * @param {Function} callback Function called after parse response
			 * @param {Object} data Data passed to render function
			 * @param {Event} event event object
			 */
			function callbackFunction(callback, data, event) {
				var request = event.target,
					status = {},
					element = null;
				if (request.readyState === 4) {
					status.success = (request.status === 200 || (request.status === 0 && request.responseXML));
					element = request.responseXML;
					// if option fullDocument is set then return document element
					// Router require full document
					if (!data.fullDocument) {
						// otherwise return first child of body
						// controller require only element
						element = element.body.firstChild;
					}
					callback(status, element);
				}
			}

			/**
			 * Function process given path, get file by XMLHttpRequest and return
			 * HTML element.
			 * @param {Object} globalOptions
			 * @param {string} path
			 * @param {Object} data
			 * @param {Function} callback
			 */
			function htmlTemplate(globalOptions, path, data, callback) {
				var absUrl = path,
					request,
					eventCallback = callbackFunction.bind(null, callback, data);

				// If the caller provided data append the data to the URL.
				if (data) {
					absUrl = utilPath.addSearchParams(path, data);
				}

				// Load the new content.
				request = new XMLHttpRequest();
				request.responseType = "document";
				request.overrideMimeType("text/html");
				request.open("GET", absUrl);
				request.addEventListener("error", eventCallback);
				request.addEventListener("load", eventCallback);
				request.send();
			}

			template.register("html", htmlTemplate);
			}());

/*global window, ns, define */
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
 * #Info
 *
 * Various TAU information
 * @class ns.info
 */
(function (window, document, ns) {
	"use strict";
				/**
			 * @property {Object} info
			 * @property {string} [info.profile="default"] Current runtime profile
			 * @property {string} [info.theme="default"] Current runtime theme
			 * @property {string} info.version Current runtime version
			 * @member ns.info
			 * @static
			 */
			var eventUtils = ns.event,
				info = {
					profile: "default",
					theme: "default",
					version: ns.version,

					/**
					 * Refreshes information about runtime
					 * @method refreshTheme
					 * @param {Function} done Callback run when the theme is discovered
					 * @member ns.info
					 * @return {null|String}
					 * @static
					 */
					refreshTheme: function (done) {
						var el = document.createElement("span"),
							parent = document.body,
							themeName = null;

						if (document.readyState !== "interactive" && document.readyState !== "complete") {
							eventUtils.fastOn(document, "DOMContentLoaded", this.refreshTheme.bind(this, done));
							return null;
						}
						el.classList.add("tau-info-theme");

						parent.appendChild(el);
						themeName = window.getComputedStyle(el, ":after").content;
						parent.removeChild(el);

						if (themeName && themeName.length > 0) {
							this.theme = themeName;
						}

						themeName = themeName || null;

						if (done) {
							done(themeName);
						}

						return themeName;
					}
				};

			info.refreshTheme();

			ns.info = info;
			}(window, window.document, ns));

/*global define, ns */
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
 *
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function () {
	"use strict";
				if (ns.getConfig("autorun", true) === true) {
				ns.engine.run();
			}
			}());

/*global define, ns */
/**
 * #Tizen Advanced UI Framework
 *
 * Tizen Advanced UI Framework(TAU) is new name of Tizen Web UI framework. It provides tools, such as widgets, events, effects, and animations, for Web application development. You can leverage these tools by just selecting the required screen elements and creating applications.
 *
 * TAU service is based on a template and works on a Web browser, which runs on the WebKit engine. You can code Web applications using the TAU, standard HTML5, and Tizen device APIs. You can also use different widgets with CSS animations and rendering optimized for Tizen Web browsers.
 *
 * For more information about the basic structure of a page in the Web application using the TAU, see [Application Page Structure](page/app_page_layout.htm).
 *
 * ##Framework Services
 *
 * The Web UI framework consists of the following services:
 *
 *  - Page navigation
 *
 *    Navigation JavaScript library is provided to allow smooth navigation between TAU based application [pages](page/layout.htm).
 *  - Web widgets and themes
 *
 *    We support APIs and CSS themes for Tizen web [widgets](widget/widget_reference.htm)
 *  - Element Events
 *
 *    Some special [events](event/event_reference.htm) are available with TAU that optimized for the Web applications.
 *  - Useful utility
 *
 *    Some special [utility](util/util_reference.htm) are available with TAU that supporting easy DOM methods for the Web applications.
 *
 * !!!The framework runs only on browsers supporting the HTML5/CSS standards. The draft version of the W3C specification is not fully supported.!!!
 * @class ns
 * @title Tizen Advanced UI Framework
 */
			ns.info.profile = "mobile";
			
}(window, window.document));
