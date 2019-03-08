/* global tau, test, define */
function runTests(_Set) {

	module("core/util/Set");

	test("add", 2, function (assert) {
		var set = new _Set(),
			i = 1;

		set.add(1);
		set.add(2);
		set.add(1);
		set.add(1);

		set.forEach(function (item) {
			assert.equal(item, i, "Item " + i + " is correct");
			i++;
		});
	});

	test("clear", 2, function (assert) {
		var set = new _Set(),
			i = 1;

		set.add(1);
		set.add(2);

		set.forEach(function (item) {
			assert.equal(item, i, "Item " + i + " is correct");
			i++;
		});

		set.clear();

		set.forEach(function () {
			assert.ok(false, "This assertion shouldn't be called");
		});
	});

	test("delete", 4, function (assert) {
		var set = new _Set(),
			i = 1;

		set.add(1);
		set.add(2);

		set.forEach(function (item) {
			assert.equal(item, i, "Item is correct");
			i++;
		});

		set.delete(1);

		set.forEach(function (item) {
			assert.equal(item, 2, "Item is correct");
		});

		set.delete(1);

		set.forEach(function (item) {
			assert.equal(item, 2, "Item is correct");
		});

		set.delete(2);

		set.forEach(function () {
			assert.ok(false, "This assertion shouldn't be called");
		});
	});


	test("has", 4, function (assert) {
		var set = new _Set(),
			i = 1;

		set.add(1);
		set.add(2);

		set.forEach(function (item) {
			assert.equal(item, i, "Item is correct");
			i++;
		});

		assert.equal(set.has(1), true, "Set has 1");
		assert.equal(set.has(3), false, "Set doesn't have 3");
	});

}

if (typeof define === "function") {
	define(function () {
		return runTests;
	});
} else {
	runTests(tau.util._Set, window.helpers);
}