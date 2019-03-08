/*global window, module, test, ok, equal, deepEqual, expect, isNaN*/
/*
 * Unit Test: ns.event.gesture.utils
 */

(function (ns) {
	"use strict";

	var gesture = ns.event.gesture,
		utils = ns.event.gesture.utils;


	function xy(x, y) {
		return {clientX: x, clientY: y};
	}

	module("core/event/gesture");

	test("api", 2, function test() {
		equal(typeof gesture, "function", "Object ns.event.gesture exists");
		equal(typeof utils, "object", "Object ns.event.gesture.utils exists");
	});

	test("getCenter", 4, function test() {
		var center = utils.getCenter([xy(0, 0), xy(10, 0)]);
		equal(typeof center, "object", "Result is object");
		ok(!isNaN(center.clientX), "Center x is number");
		ok(!isNaN(center.clientY), "Center y is number");
		deepEqual(center, {clientX: 5, clientY: 0}, "Distance is 20");
	});

	test("getVelocity", 3, function test() {
		var vel = utils.getVelocity(Date.now(), 10, 10);
		equal(typeof vel, "object", "Velocity is object");
		ok(!isNaN(vel.x), "Velocity x is number");
		ok(!isNaN(vel.y), "Velocity y is number");
	});

	test("getAngle", 3, function test() {
		ok(!isNaN(utils.getAngle(xy(0, 0), xy(0, 0))), "Result is a number");
		ok(utils.getAngle(xy(10, 10), xy(15, 15)) > 0, "Angel is positive");
		ok(utils.getAngle(xy(10, 10), xy(5, 5)) < 0, "Angel is negative");
	});

	test("getDirection", 4, function test() {
		equal(utils.getDirection(xy(0, 0), xy(-10, 0)), "left", "Direction left");
		equal(utils.getDirection(xy(0, 0), xy(10, 0)), "right", "Direction right");
		equal(utils.getDirection(xy(0, 0), xy(0, -10)), "up", "Direction up");
		equal(utils.getDirection(xy(0, 0), xy(0, 10)), "down", "Direction down");
	});

	test("getDistance", 2, function test() {
		equal(utils.getDistance(xy(0, 0), xy(20, 0)), 20, "Distance is 20");
		equal(utils.getDistance(xy(0, 0), xy(10, 0)), 10, "Direction is 10");
	});

	test("getScale", 2, function test() {
		equal(utils.getScale([xy(0, 0), xy(10, 0)], [xy(10, 0), xy(15, 0)]), 0.5, "Scale is 0.5");
		equal(utils.getScale([xy(0, 0), xy(10, 0)], [xy(10, 0), xy(20, 0)]), 1, "Scale is 1");
	});

	test("getRotation", 3, function test() {
		ok(!isNaN(utils.getRotation([xy(0, 0), xy(0, 0)], [xy(0, 0), xy(0, 0)])), "Result is a number");
		ok(utils.getRotation([xy(10, 10), xy(15, 15)], [xy(20, 20), xy(20, 20)]) > 0, "Angel is positive");
		ok(utils.getRotation([xy(10, 10), xy(5, 5)], [xy(20, 20), xy(20, 20)]) < 0, "Angel is negative");
	});

	test("isVertical", function test() {
		var suites = {left: false, right: false, up: true, down: true, 1: false, undefined: false, test: false},
			keys = Object.keys(suites),
			i = keys.length,
			key;

		expect(i);

		while (i--) {
			key = keys[i];
			equal(utils.isVertical(key), suites[key], "isVertical of '" + key + "' is " + suites[key]);
		}
	});

	test("isHorizontal", function test() {
		var suites = {left: true, right: true, up: false, down: false, 1: false, undefined: false, test: false},
			keys = Object.keys(suites),
			i = keys.length,
			key;

		expect(i);

		while (i--) {
			key = keys[i];
			equal(utils.isHorizontal(key), suites[key], "isHorizontal of '" + key + "' is " + suites[key]);
		}
	});

	test("getOrientation", function test() {
		var h = gesture.Orientation.HORIZONTAL,
			v = gesture.Orientation.VERTICAL,
			suites = {left: h, right: h, up: v, down: v, 1: h, undefined: h, test: h},
			keys = Object.keys(suites),
			i = keys.length,
			key;

		expect(i);

		while (i--) {
			key = keys[i];
			equal(utils.getOrientation(key), suites[key], "getOrientation of '" + key + "' is " + suites[key]);
		}
	});

}(window.tau));
