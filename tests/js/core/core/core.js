/* global test, equal, ok, notEqual, define, tau, expect */
function runTests(tau, helpers) {

	module("core.core");

	test("tau", function () {
		var id1,
			id2,
			id3;

		id1 = tau.getUniqueId();
		id2 = tau.getUniqueId();
		id3 = tau.getUniqueId();
		equal(typeof id1, "string", "Result of tau.getUniqueId() #1");
		equal(typeof id2, "string", "Result of tau.getUniqueId() #2");
		equal(typeof id3, "string", "Result of tau.getUniqueId() #3");
		notEqual(id1, id2, "id1 != id2");
		notEqual(id1, id3, "id1 != id3");
		notEqual(id3, id2, "id3 != id2");

		equal(tau.setConfig("test1", true), undefined, "Method tau.setConfig(\"test1\", true)");
		equal(tau.setConfig("test2", "val"), undefined, "Method tau.setConfig(\"test2\", \"val\")");
		equal(tau.setConfig("test3", {val: 0}), undefined, "Method tau.setConfig(\"test3\", {val: 0})");
		equal(tau.getConfig("test1"), true, "Method tau.getConfig(\"test1\")");
		equal(tau.getConfig("test2"), "val", "Method tau.getConfig(\"test2\")");
		equal(tau.getConfig("test3").val, 0, "Method tau.getConfig(\"test3\")");
		equal(tau.getConfig("test4"), undefined, "Method tau.getConfig(\"test4\")");
		equal(tau.getConfig("test4", "default"), "default",
			"Method tau.getConfig(\"test4\", \"default\")");
	});

	test("Console log tests", function () {
		expect(5);
		helpers.stub(window.console, "log", function (arg1, arg2, arg3) {
			ok(arg1, "arg1 is correct");
			ok(arg2, "arg2 is correct");
			ok(arg3, "arg3 is correct");
			ok(true, "Console log called");
		});
		equal(tau.log("test1", "test2", "test3"), undefined, "Result of tau.log");
		helpers.restoreStub(window.console, "log");
	});

	test("Console warn tests", function () {
		expect(5);
		helpers.stub(window.console, "warn", function (arg1, arg2, arg3) {
			ok(arg1, "arg1 is correct");
			ok(arg2, "arg2 is correct");
			ok(arg3, "arg3 is correct");
			ok(true, "Console warn called");
		});
		equal(tau.warn("test1", "test2", "test3"), undefined, "Result of tau.warn");
		helpers.restoreStub(window.console, "warn");
	});

	test("Console error tests", function () {
		expect(5);
		helpers.stub(window.console, "error", function (arg1, arg2, arg3) {
			ok(arg1, "arg1 is correct");
			ok(arg2, "arg2 is correct");
			ok(arg3, "arg3 is correct");
			ok(true, "Console error called");
		});
		equal(tau.error("test1", "test2", "test3"), undefined, "Result of tau.error");
		helpers.restoreStub(window.console, "error");
	});
}

if (typeof define === "function") {
	define(function () {
		return runTests;
	});
} else {
	runTests(tau, window.helpers);
}
