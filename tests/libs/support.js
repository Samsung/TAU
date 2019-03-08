/*
 * Support checks for phantomjs
 */
/* eslint no-inner-declarations: off, no-extend-native: off */
var orgPushstate = window.history.pushState,
	orgReplace = window.history.replaceState,
	orgTokenListAdd = window.DOMTokenList.prototype.add,
	orgTokenListRemove = window.DOMTokenList.prototype.remove;

if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		var aArgs = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP = function () {},
			fBound = function () {
				if (fNOP.prototype) {
					return fToBind.apply(this instanceof fNOP && oThis ?
							this :
							oThis,
						aArgs.concat(Array.prototype.slice.call(arguments)));
				} else {
					return fToBind.apply(oThis,
						aArgs.concat(Array.prototype.slice.call(arguments)));
				}
			};

		if (typeof this !== "function") {
	// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}

if (!CustomEvent) {
	function CustomEvent(type, data) {
		var evt = document.createEvent("Event");

		evt.initEvent(type, data.bubbles, data.cancelable);
		evt.detail = data.detail;
		return evt;
	}
}

window.history.pushState = function (state) {
	try {
		orgPushstate.apply(window.history, arguments);
	}	catch (e) {
	}
	window.history.state = state;
};

window.history.replaceState = function (state) {
	try {
		orgReplace.apply(window.history, arguments);
	}	catch (e) {
	}
	window.history.state = state;
};

Element.prototype.click = function () {
	var ev = document.createEvent("MouseEvent");

	ev.initMouseEvent(
		"click",
		true /* bubble */, true /* cancelable */,
		window, null,
		0, 0, 0, 0, /* coordinates */
		false, false, false, false, /* modifier keys */
		0 /*left*/, null
);
	this.dispatchEvent(ev);
}

// Support for many arguments for .add method of classList

window.DOMTokenList.prototype.add = function () {
	var args = [].slice.call(arguments),
		argsLength = args.length,
		i;

	for (i = 0; i < argsLength; i++) {
		orgTokenListAdd.call(this, args[i]);
	}
};

// Function to correct support toggle method in classList, in Phantom toggle hasn't second parameter
window.DOMTokenList.prototype.toggle = function (className, state) {
	var args = [].slice.call(arguments),
		argsLength = args.length,
		i,
		newState;

	if (state !== undefined) {
		newState = !!state;
	} else {
		newState = !this.contains(className);
	}
	if (newState) {
		this.add(className);
	} else {
		this.remove(className);
	}
};

// Support for many arguments for .remove method of classList
window.DOMTokenList.prototype.remove = function () {
	var args = [].slice.call(arguments),
		argsLength = args.length,
		i;

	for (i = 0; i < argsLength; i++) {
		orgTokenListRemove.call(this, args[i]);
	}
};


/**
 * Copyright 2012 Eric Wendelin - MIT License
 *
 * es6-map-shim.js is a DESTRUCTIVE shim that follows the latest Map specification
 * as closely as possible. It is destructive in the sense that it overrides native implementations.
 *
 * IMPORTANT: Currently, get(), set(), has() and delete() are all O(n) operations.
 * Normally, they would be O(1). Therefore it is NOT recommended to use this with
 * a large dataset or in any production environment.
 *
 * This library assumes ES5 functionality: Object.create, Object.defineProperty,
 * Array.indexOf, Function.bind and others.
 */
(function (module) {
	var notInNode = module == "undefined",
		window = notInNode ? this : global,
		nodeModule = notInNode ? {} : exports,
		MapPrototype = Map.prototype;

	function Map(iterable) {
		var _items = [],
			_keys = [],
			_values = [],
		// Object.is polyfill, courtesy of @WebReflection
			is = Object.is || function (a, b) {
				return a === b ?
				a !== 0 || 1 / a == 1 / b :
				a != a && b != b;
			},
		// More reliable indexOf, courtesy of @WebReflection
			betterIndexOf = function (value) {
				var i;

				if (value != value || value === 0) {
					for (i = this.length; i-- && !is(this[i], value);) {
						return i;
					}
				} else {
					return [].indexOf.call(this, value);
				}
			},
		/**
		 * MapIterator used for iterating over all entries in given map.
		 *
		 * @param map {Map} to iterate
		 * @param kind {String} identifying what to yield. Possible values
		 *      are 'keys', 'values' and 'keys+values'
		 * @constructor
		 */
			MapIterator = function MapIterator(map, kind) {
				var _index = 0;

				return Object.create({}, {
					next: {
						value: function () {
						// check if index is within bounds
							if (_index < map.items().length) {
								switch (kind) {
									case "keys": return map.keys()[_index++];
									case "values": return map.values()[_index++];
									case "keys+values": return [].slice.call(map.items()[_index++]);
									default: throw new TypeError("Invalid iterator type");
								}
							}
						// TODO: make sure I'm interpreting the spec correctly here
							throw new Error("Stop Iteration");
						}
					},
					iterator: {
						value: function () {
							return this;
						}
					},
					toString: {
						value: function () {
							return "[object Map Iterator]";
						}
					}
				});
			},
			_set = function (key, value) {
			// check if key exists and overwrite
				var index = betterIndexOf.call(_keys, key);

				if (index > -1) {
					_items[index][1] = value;
					_values[index] = value;
				} else {
					_items.push([key, value]);
					_keys.push(key);
					_values.push(value);
				}
			},
			setItem = function (item) {
				if (item.length !== 2) {
					throw new TypeError("Invalid iterable passed to Map constructor");
				}

				_set(item[0], item[1]);
			};

		// FIXME: accommodate any class that defines an @@iterator method that returns
		//      an iterator object that produces two element array-like objects
		if (Array.isArray(iterable)) {
			iterable.forEach(setItem);
		} else if (iterable !== undefined) {
			throw new TypeError("Invalid Map");
		}

		return Object.create(MapPrototype, {
			/**
			 * @return {Array} all entries in the Map, in order
			 */
			items: {
				value: function () {
					return [].slice.call(_items);
				}
			},
			/**
			 * @return {Array} all keys in the Map, in order
			 */
			keys: {
				value: function () {
					return [].slice.call(_keys);
				}
			},
			/**
			 * @return {Array} all values in the Map, in order
			 */
			values: {
				value: function () {
					return [].slice.call(_values);
				}
			},
			/**
			 * Given a key, indicate whether that key exists in this Map.
			 *
			 * @param key {Object} expected key
			 * @return {Boolean} true if key in Map
			 */
			has: {
				value: function (key) {
					// TODO: double-check how spec reads about null values
					var index = betterIndexOf.call(_keys, key);

					return index > -1;
				}
			},
			/**
			 * Given a key, retrieve the value associated with that key (or undefined).
			 *
			 * @param key {Object}
			 * @return {Object} value associated with key or undefined
			 */
			get: {
				value: function (key) {
					var index = betterIndexOf.call(_keys, key);

					return index > -1 ? _values[index] : undefined;
				}
			},
			/**
			 * Add or overwrite entry associating key with value. Always returns undefined.
			 *
			 * @param key {Object} anything
			 * @param value {Object} also anything
			 */
			set: {
				value: _set
			},
			/**
			 * Return the number of entries in this Map.
			 *
			 * @return {Number} number of entries
			 */
			size: {
				get: function () {
					return _items.length;
				}
			},
			/**
			 * Remove all entries in this Map. Returns undefined.
			 */
			clear: {
				value: function () {
					_keys.length = _values.length = _items.length = 0;
				}
			},
			/**
			 * Delete entry with given key, if it exists.
			 *
			 * @param key {Object} any possible key
			 * @return {Boolean} true if an entry was deleted
			 */
			"delete": {
				value: function (key) {
					var index = betterIndexOf.call(_keys, key);

					if (index > -1) {
						_keys.splice(index, 1);
						_values.splice(index, 1);
						_items.splice(index, 1);
						return true;
					}
					return false;
				}
			},
			/**
			 * Given a callback function and optional context, invoke the callback on all
			 * entries in this Map.
			 *
			 * @param callbackFn {Function}
			 */
			forEach: {
				value: function (callbackfn /*, thisArg*/) {
					var iter = this.iterator(),
						current = tryNext(),
						next = tryNext();

					if (typeof callbackfn != "function") {
						throw new TypeError("Invalid callback function given to forEach");
					}

					function tryNext() {
						try {
							return iter.next();
						} catch (e) {
							return undefined;
						}
					}

					while (current !== undefined) {
						callbackfn.apply(arguments[1], [current[1], current[0], this]);
						current = next;
						next = tryNext();
					}
				}
			},
			/**
			 * Return a MapIterator object for this map.
			 */
			iterator: {
				value: function () {
					return new MapIterator(this, "keys+values");
				}
			},
			toString: {
				value: function () {
					return "[Object Map]";
				}
			}
		});
	}

	Map.prototype = MapPrototype = Map();

	window.Map = nodeModule.Map = window.Map || Map;
}.call(this, typeof exports));

(function (root) {

	// Store setTimeout reference so promise-polyfill will be unaffected by
	// other code modifying setTimeout (like sinon.useFakeTimers())
	var setTimeoutFunc = setTimeout;

	function noop() {}

	// Polyfill for Function.prototype.bind
	function bind(fn, thisArg) {
		return function () {
			fn.apply(thisArg, arguments);
		};
	}

	function Promise(fn) {
		if (typeof this !== "object") {
			throw new TypeError("Promises must be constructed via new");
		}
		if (typeof fn !== "function") {
			throw new TypeError("not a function");
		}
		this._state = 0;
		this._handled = false;
		this._value = undefined;
		this._deferreds = [];

		doResolve(fn, this);
	}

	function handle(self, deferred) {
		while (self._state === 3) {
			self = self._value;
		}
		if (self._state === 0) {
			self._deferreds.push(deferred);
			return;
		}
		self._handled = true;
		Promise._immediateFn(function () {
			var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;

			if (cb === null) {
				(self._state === 1 ? resolve : reject)(deferred.promise, self._value);
				return;
			}
			var ret;

			try {
				ret = cb(self._value);
			} catch (e) {
				reject(deferred.promise, e);
				return;
			}
			resolve(deferred.promise, ret);
		});
	}

	function resolve(self, newValue) {
		try {
			// Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
			if (newValue === self) {
				throw new TypeError("A promise cannot be resolved with itself.");
			}
			if (newValue && (typeof newValue === "object" || typeof newValue === "function")) {
				var then = newValue.then;

				if (newValue instanceof Promise) {
					self._state = 3;
					self._value = newValue;
					finale(self);
					return;
				} else if (typeof then === "function") {
					doResolve(bind(then, newValue), self);
					return;
				}
			}
			self._state = 1;
			self._value = newValue;
			finale(self);
		} catch (e) {
			reject(self, e);
		}
	}

	function reject(self, newValue) {
		self._state = 2;
		self._value = newValue;
		finale(self);
	}

	function finale(self) {
		if (self._state === 2 && self._deferreds.length === 0) {
			Promise._immediateFn(function () {
				if (!self._handled) {
					Promise._unhandledRejectionFn(self._value);
				}
			});
		}

		for (var i = 0, len = self._deferreds.length; i < len; i++) {
			handle(self, self._deferreds[i]);
		}
		self._deferreds = null;
	}

	function Handler(onFulfilled, onRejected, promise) {
		this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
		this.onRejected = typeof onRejected === "function" ? onRejected : null;
		this.promise = promise;
	}

	/**
	 * Take a potentially misbehaving resolver function and make sure
	 * onFulfilled and onRejected are only called once.
	 *
	 * Makes no guarantees about asynchrony.
	 */
	function doResolve(fn, self) {
		var done = false;

		try {
			fn(function (value) {
				if (done) {
					return;
				}
				done = true;
				resolve(self, value);
			}, function (reason) {
				if (done) {
					return;
				}
				done = true;
				reject(self, reason);
			});
		} catch (ex) {
			if (done) {
				return;
			}
			done = true;
			reject(self, ex);
		}
	}

	Promise.prototype["catch"] = function (onRejected) {
		return this.then(null, onRejected);
	};

	Promise.prototype.then = function (onFulfilled, onRejected) {
		var prom = new (this.constructor)(noop);

		handle(this, new Handler(onFulfilled, onRejected, prom));
		return prom;
	};

	Promise.all = function (arr) {
		var args = Array.prototype.slice.call(arr);

		return new Promise(function (resolve, reject) {
			if (args.length === 0) {
				return resolve([]);
			}
			var remaining = args.length;

			function res(i, val) {
				try {
					if (val && (typeof val === "object" || typeof val === "function")) {
						var then = val.then;

						if (typeof then === "function") {
							then.call(val, function (val) {
								res(i, val);
							}, reject);
							return;
						}
					}
					args[i] = val;
					if (--remaining === 0) {
						resolve(args);
					}
				} catch (ex) {
					reject(ex);
				}
			}

			for (var i = 0; i < args.length; i++) {
				res(i, args[i]);
			}
		});
	};

	Promise.resolve = function (value) {
		if (value && typeof value === "object" && value.constructor === Promise) {
			return value;
		}

		return new Promise(function (resolve) {
			resolve(value);
		});
	};

	Promise.reject = function (value) {
		return new Promise(function (resolve, reject) {
			reject(value);
		});
	};

	Promise.race = function (values) {
		return new Promise(function (resolve, reject) {
			for (var i = 0, len = values.length; i < len; i++) {
				values[i].then(resolve, reject);
			}
		});
	};

	// Use polyfill for setImmediate for performance gains
	Promise._immediateFn = (typeof setImmediate === "function" && function (fn) {
		setImmediate(fn);
	}) ||
		function (fn) {
			setTimeoutFunc(fn, 0);
		};

	Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
		if (typeof console !== "undefined" && console) {
			console.warn("Possible Unhandled Promise Rejection:", err); // eslint-disable-line no-console
		}
	};

	/**
	 * Set the immediate function to execute callbacks
	 * @param fn {function} Function to execute
	 * @deprecated
	 */
	Promise._setImmediateFn = function _setImmediateFn(fn) {
		Promise._immediateFn = fn;
	};

	/**
	 * Change the function to execute on unhandled rejection
	 * @param {function} fn Function to execute on unhandled rejection
	 * @deprecated
	 */
	Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
		Promise._unhandledRejectionFn = fn;
	};

	if (typeof module !== "undefined" && module.exports) {
		module.exports = Promise;
	} else if (!root.Promise) {
		root.Promise = Promise;
	}

	window.performance = window.performance || Date;

})(this);