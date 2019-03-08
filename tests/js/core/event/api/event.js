/* global test, equal, tau */
var events = tau.event;

module("core/event");

test("tau.event - check the existence of objects/functions", function () {
	equal(typeof tau, "object", "tau exists");
	equal(typeof tau.event, "object", "tau.event exists");
	equal(typeof events.trigger, "function", "function set");
	equal(typeof events.stopPropagation, "function", "function get");
	equal(typeof events.stopImmediatePropagation, "function", "function remove");
});
