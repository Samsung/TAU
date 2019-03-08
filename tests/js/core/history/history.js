/* global test, module, asyncTest, equal, ok, start */
function testFunction(tau) {
	var history = tau.history;
	module("core/history");

	test("main", function () {
		ok(history, "object history exists");
		equal(history.activeState, null, "activeState is null on start");
	});

	asyncTest("replace", 17, function () {
		var state = {
			newState: true
		}, uid;

		equal(history.activeState, null, "activeState is null on start");

		history.replace(state, "title", "url");

		equal(history.activeState.newState, state.newState, "activeState was changed after replace method");
		ok(history.activeState.uid !== undefined, "uid was set after replace method");
		equal(window.location.href.substr(-3, 3), "url", "window.location was changed after replace method");
		equal(window.history.state.newState, state.newState, "uid was not changed after replace method with volatileRecord mode");

		uid = history.activeState.uid;
		state.volatileRecord = true;
		history.replace(state, "title2", "url2");

		equal(history.activeState.newState, state.newState, "activeState was changed after replace method");
		ok(history.activeState.uid, "uid was set after replace method");
		equal(window.location.href.substr(-4, 4), "url2", "window.location was changed after replace method");
		equal(history.activeState.uid, uid + 1, "uid was not changed after replace method with volatileRecord mode");

		uid = history.activeState.uid;
		state.volatileRecord = true;
		history.replace(state, "title3", "history.html");

		equal(history.activeState.newState, state.newState, "activeState was changed after replace method");
		ok(history.activeState.uid, "uid was set after replace method");
		equal(window.location.href.substr(-4, 4), "html", "window.location was changed after replace method");
		equal(history.activeState.uid, uid, "uid was not changed after replace method without volatileRecord mode");

		window.addEventListener("popstate", function popstate () {
			window.removeEventListener("popstate", popstate);
			ok(1, "popstate was triggerd");
			start();
		});
		history.back();

		equal(history.getDirection(), "back", "check getDirection method in default mode");
		equal(history.getDirection({uid: 0}), "back", "check getDirection method in back mode");
		equal(history.getDirection({uid: 1000}), "forward", "check getDirection method in forward mode");
	});
}

if (window.define !== undefined) {
	define(function () {
		return testFunction;
	});
} else {
	document.addEventListener("DOMContentLoaded", function () {
		testFunction(window.tau);
	});
}
