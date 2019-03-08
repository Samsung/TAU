/*global module, test, expect, stop, start, ej, ok, strictEqual, equal, notStrictEqual */
/*jslint plusplus: true, nomen: true */
module("core/util/deferred");
jQuery.each(["", " - new operator"], function (_, withNew) {
	'use strict';

	function createDeferred(fn) {
		return withNew ? new ej.util.deferred(fn) : ej.util.deferred(fn);
	}

	test("ej.util.deferred" + withNew, function () {

		expect(23);

		var defer = createDeferred();

		strictEqual(defer.pipe, defer.then, "pipe is an alias of then");

		createDeferred().resolve().done(function () {
			ok(true, "Success on resolve");
			strictEqual(this.state(), "resolved", "Deferred is resolved (state)");
		}).fail(function () {
			ok(false, "Error on resolve");
		}).always(function () {
			ok(true, "Always callback on resolve");
		});

		createDeferred().reject().done(function () {
			ok(false, "Success on reject");
		}).fail(function () {
			ok(true, "Error on reject");
			strictEqual(this.state(), "rejected", "Deferred is rejected (state)");
		}).always(function () {
			ok(true, "Always callback on reject");
		});

		createDeferred(function (defer) {
			ok(this === defer, "Defer passed as this & first argument");
			this.resolve("done");
		}).done(function (value) {
			strictEqual(value, "done", "Passed function executed");
		});

		createDeferred(function (defer) {
			var promise = defer.promise(),
				func = function () {
					return;
				},
				funcPromise = defer.promise(func);
			strictEqual(defer.promise(), promise, "promise is always the same");
			strictEqual(funcPromise, func, "non objects get extended");
			jQuery.each(promise, function (key) {
				if (!jQuery.isFunction(promise[key])) {
					ok(false, key + " is a function (" + jQuery.type(promise[key]) + ")");
				}
				if (promise[key] !== func[key]) {
					strictEqual(func[key], promise[key], key + " is the same");
				}
			});
		});

		jQuery.expandedEach = jQuery.each;
		jQuery.expandedEach(["resolve", "reject"], function (_, change) {
			createDeferred(function (defer) {
				strictEqual(defer.state(), "pending", "pending after creation");
				var checked = 0;
				defer.progress(function (value) {
					strictEqual(value, checked, "Progress: right value (" + value + ") received");
				});
				for (checked = 0; checked < 3; checked++) {
					defer.notify(checked);
				}
				strictEqual(defer.state(), "pending", "pending after notification");
				defer[change]();
				notStrictEqual(defer.state(), "pending", "not pending after " + change);
				defer.notify();
			});
		});
	});
});


test("ej.util.deferred - chainability", function () {
	'use strict';

	var defer = ej.util.deferred();

	expect(10);

	jQuery.expandedEach = jQuery.each;
	jQuery.expandedEach(["resolve", "reject", "notify", "resolveWith", "rejectWith", "notifyWith", "done", "fail", "progress", "always"], function (_, method) {
		var object = {
			m: defer[method]
		};
		strictEqual(object.m(), object, method + " is chainable");
	});
});

test("ej.util.deferred.then - filtering (done)", function () {
	'use strict';

	expect(4);

	var value1, value2, value3,
		defer = ej.util.deferred(),
		piped = defer.then(function (a, b) {
			return a * b;
		});

	piped.done(function (result) {
		value3 = result;
	});

	defer.done(function (a, b) {
		value1 = a;
		value2 = b;
	});

	defer.resolve(2, 3);

	strictEqual(value1, 2, "first resolve value ok");
	strictEqual(value2, 3, "second resolve value ok");
	strictEqual(value3, 6, "result of filter ok");

	ej.util.deferred().reject().then(function () {
		ok(false, "then should not be called on reject");
	});

	ej.util.deferred().resolve().then(jQuery.noop).done(function (value) {
		strictEqual(value, undefined, "then done callback can return undefined/null");
	});
});

test("ej.util.deferred.then - filtering (fail)", function () {
	'use strict';

	expect(4);

	var value1, value2, value3,
		defer = ej.util.deferred(),
		piped = defer.then(null, function (a, b) {
			return a * b;
		});

	piped.fail(function (result) {
		value3 = result;
	});

	defer.fail(function (a, b) {
		value1 = a;
		value2 = b;
	});

	defer.reject(2, 3);

	strictEqual(value1, 2, "first reject value ok");
	strictEqual(value2, 3, "second reject value ok");
	strictEqual(value3, 6, "result of filter ok");

	ej.util.deferred().resolve().then(null, function () {
		ok(false, "then should not be called on resolve");
	});

	ej.util.deferred().reject().then(null, jQuery.noop).fail(function (value) {
		strictEqual(value, undefined, "then fail callback can return undefined/null");
	});
});

test("ej.util.deferred.then - filtering (progress)", function () {
	'use strict';

	expect(3);

	var value1, value2, value3,
		defer = ej.util.deferred(),
		piped = defer.then(null, null, function (a, b) {
			return a * b;
		});

	piped.progress(function (result) {
		value3 = result;
	});

	defer.progress(function (a, b) {
		value1 = a;
		value2 = b;
	});

	defer.notify(2, 3);

	strictEqual(value1, 2, "first progress value ok");
	strictEqual(value2, 3, "second progress value ok");
	strictEqual(value3, 6, "result of filter ok");
});

test("ej.util.deferred.then - deferred (done)", function () {
	'use strict';

	expect(3);

	var value1, value2, value3,
		defer = ej.util.deferred(),
		piped = defer.then(function (a, b) {
			return ej.util.deferred(function (defer) {
				defer.reject(a * b);
			});
		});

	piped.fail(function (result) {
		value3 = result;
	});

	defer.done(function (a, b) {
		value1 = a;
		value2 = b;
	});

	defer.resolve(2, 3);

	strictEqual(value1, 2, "first resolve value ok");
	strictEqual(value2, 3, "second resolve value ok");
	strictEqual(value3, 6, "result of filter ok");
});

test("ej.util.deferred.then - deferred (fail)", function () {
	'use strict';

	expect(3);

	var value1, value2, value3,
		defer = ej.util.deferred(),
		piped = defer.then(null, function (a, b) {
			return ej.util.deferred(function (defer) {
				defer.resolve(a * b);
			});
		});

	piped.done(function (result) {
		value3 = result;
	});

	defer.fail(function (a, b) {
		value1 = a;
		value2 = b;
	});

	defer.reject(2, 3);

	strictEqual(value1, 2, "first reject value ok");
	strictEqual(value2, 3, "second reject value ok");
	strictEqual(value3, 6, "result of filter ok");
});

test("ej.util.deferred.then - deferred (progress)", function () {
	'use strict';

	expect(3);

	var value1, value2, value3,
		defer = ej.util.deferred(),
		piped = defer.then(null, null, function (a, b) {
			return ej.util.deferred(function (defer) {
				defer.resolve(a * b);
			});
		});

	piped.done(function (result) {
		value3 = result;
	});

	defer.progress(function (a, b) {
		value1 = a;
		value2 = b;
	});

	defer.notify(2, 3);

	strictEqual(value1, 2, "first progress value ok");
	strictEqual(value2, 3, "second progress value ok");
	strictEqual(value3, 6, "result of filter ok");
});

test("ej.util.deferred.then - context", function () {
	'use strict';

	expect(7);

	var defer, piped, defer2, piped2,
		context = {};

	ej.util.deferred().resolveWith(context, [2]).then(function (value) {
		return value * 3;
	}).done(function (value) {
		strictEqual(this, context, "custom context correctly propagated");
		strictEqual(value, 6, "proper value received");
	});

	ej.util.deferred().resolve().then(function () {
		return ej.util.deferred().resolveWith(context);
	}).done(function () {
		strictEqual(this, context, "custom context of returned deferred correctly propagated");
	});

	defer = ej.util.deferred();
	piped = defer.then(function (value) {
		return value * 3;
	});

	defer.resolve(2);

	piped.done(function (value) {
		strictEqual(this, piped, "default context gets updated to latest promise in the chain");
		strictEqual(value, 6, "proper value received");
	});

	defer2 = ej.util.deferred();
	piped2 = defer2.then();

	defer2.resolve(2);

	piped2.done(function (value) {
		strictEqual(this, piped2, "default context gets updated to latest promise in the chain (without passing function)");
		strictEqual(value, 2, "proper value received (without passing function)");
	});
});
