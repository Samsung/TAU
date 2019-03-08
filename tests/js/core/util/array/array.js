function runTests(array, helpers) {

	function initHTML() {
		var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/util/array/test-data/sample.html"),
			parent = document.getElementById("qunit-fixture") || initFixture();

		parent.innerHTML = HTML;
	}

	module('core/util/array', {
		setup: initHTML
	});

	test('Simple array creation', function () {
		var i,
			simple = array.range(3, 10);

		ok(Array.isArray(simple), 'Result is array');
		equal(simple.length, 8, 'Result array has length 8');

		for (i = 0; i < 8; i++) {
			ok(simple[i] === 3 + i, '[' + i + '] value is ' + simple[i] + ', ok');
		}
	});

	test('Simple reverse array creation', function () {
		var i,
			simple = array.range(3, -4);

		ok(Array.isArray(simple), 'Result is array');
		equal(simple.length, 8, 'Result array has length 8');

		for (i = 0; i < 8; i++) {
			ok(simple[i] === 3 - i, '[' + i + '] value is ' + simple[i] + ', ok');
		}
	});

	test('Simple array creation with step', function () {
		var i,
			simple = array.range(3, 15, 3);

		ok(Array.isArray(simple), 'Result is array');
		equal(simple.length, 5, 'Result array has length 5');

		for (i = 0; i < 5; i++) {
			ok(simple[i] === 3 + (i * 3), '[' + i + '] value is ' + simple[i] + ', ok');
		}
	});

	function equalChar(result, i, properChar) {
		equal(result[i], properChar, '[' + i + '] value is \'' + result[i] + '\', ok');
	}

	test('Simple array creation - chars', function () {
		var i,
			simple = array.range('c', 'i');

		ok(Array.isArray(simple), 'Result is array');
		equal(simple.length, 7, 'Result array has length 7');

		equalChar(simple, 0, 'c');
		equalChar(simple, 1, 'd');
		equalChar(simple, 2, 'e');
		equalChar(simple, 3, 'f');
		equalChar(simple, 4, 'g');
		equalChar(simple, 5, 'h');
		equalChar(simple, 6, 'i');
	});

	test("tau.util.array - check function range", function () {
		equal(typeof array.range(1, 2, 1), "object", "function range returns array value");
		equal(array.range(1, 2, 1)[1], 2, "function range returns value");
		equal(array.range(1, 8, 2)[1], 3, "function range returns value");
		equal(array.range(2, 2, 1)[0], 2, "function range returns value");
		equal(array.range(1, 2, 2)[1], undefined, "function range returns value");
		equal(array.range("a", 2, 1)[0], 0, "function range returns value");
	});


	test("tau.util.array - isLikeArray", function () {
		var element = document.getElementById("test1"),
			elements = document.querySelectorAll(".test1 input");

		equal(array.isArrayLike(null), false, "function isLikeArray returns false for null");
		equal(array.isArrayLike(element), false, "function isLikeArray returns false for HTMLElement");
		equal(array.isArrayLike(elements), true, "function isLikeArray returns true for NodeList");
		equal(array.isArrayLike([2, 2, 1]), true, "function isLikeArray returns true for Array");
	});


	test("tau.util.array - forEach", function () {
		var count = 0,
			elements = document.querySelectorAll(".test1 input");

		array.forEach([0, 1, 2, 3, 4], function () {
			count++;
		});

		equal(count, 5, "function forEach is called 5 times");
		array.forEach(elements, function () {
			count++;
		});
		equal(count, 7, "function forEach is called 2 times");
	});

	test("tau.util.array - filter", function () {
		var count = 0,
			elements = document.querySelectorAll(".test1 input");

		deepEqual(array.filter([0, 1, 2, 3, 4], function (i) {
			return i < 2
		}), [0, 1], "function filter return array with length 2");

		deepEqual(array.filter(elements, function (i, index) {
			return index === 0;
		}), [
			elements[0]
		], "function filter return array with length 1 on HTMLCollection");
	});

	test("tau.util.array - map", function () {
		var count = 0,
			elements = document.querySelectorAll(".test1 input");

		deepEqual(array.map([0, 1, 2, 3, 4], function (i) {
			return i + 1;
		}), [1, 2, 3, 4, 5], "function map return array with length 2");

		deepEqual(array.map(elements, function (i, index) {
			return index;
		}), [
			0,
			1
		], "function map return array with length 1 on HTMLCollection");
	});

	test("tau.util.array - reduce", function () {
		var count = 0,
			elements = document.querySelectorAll(".test1 input");

		deepEqual(array.reduce([0, 1, 2, 3, 4], function (previous, i) {
			return previous + i;
		}, 0), 10, "function reduce return sum");

		deepEqual(array.reduce([0, 1, 2, 3, 4], function (previous, i) {
			return previous + i;
		}), 10, "function reduce return sum (without init value)");

		deepEqual(array.reduce(elements, function (previous, i, index) {
			return previous + 1;
		}, 0), 2, "function reduce return count");
	});
}

if (typeof define === "function") {
	define(function () {
		return runTests;
	});
} else {
	runTests(tau.util.array,
		window.helpers);
}