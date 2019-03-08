/* global document, tau, define, module, test, equal*/
function runTests(tau) {
	module("profile/wearable/config");

	if (tau.support.shape.circle) {
		test("config (wearable)", function () {
			equal(tau.getConfig("popupTransition"), "pop", "popupTransition is set correct");
			equal(tau.getConfig("pageTransition"), "pop", "pageTransition is set correct");
			equal(tau.getConfig("popupFullSize"), true, "popupFullSize is set correct");
			equal(tau.getConfig("scrollEndEffectArea"), "screen", "scrollEndEffectArea is set correct");
			equal(tau.getConfig("enablePageScroll"), true, "enablePageScroll is set correct");
			equal(tau.getConfig("enablePopupScroll"), true, "enablePageScroll is set correct");
		});
	} else {
		test("config (wearable)", function () {
			equal(tau.getConfig("enablePopupScroll"), false, "enablePopupScroll is set correct");
			equal(tau.getConfig("popupTransition"), "slideup", "popupTransition is set correct");
			equal(tau.getConfig("enablePageScroll"), false, "enablePageScroll is set correct");
		});
	}
}

if (typeof define === "function") {
	define(function () {
		return runTests;
	});
} else {
	runTests(tau);
}
