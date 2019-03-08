/* global asyncTest, tau, ok, start, equal */

/** @TODO delete tau namespace from this file */

module("core/router/route/popup");

document.addEventListener("tauinit", function () {
	if (!window.navigator.userAgent.match("PhantomJS")) {

		asyncTest("test loading scripts in external files", 7, function () {
			var testExternalPopup = function () {
				document.removeEventListener("popupshow", testExternalPopup, false);
				equal(window.testVariableFromExternalFile, true, "varable from inline script is set");
				equal(window.testVariableFromExternalFileSrc, true, "varable from js file is set");
				ok(document.querySelector("[data-script]"), "proper move attribute for script");
				equal(tau.engine.getRouter().getRoute("popup").getActiveElement(), document.getElementById("externalPopup"), "getActiveElement return correct value");
				equal(tau.engine.getRouter().getRoute("popup").getActive(), tau.engine.getBinding(document.getElementById("externalPopup"), "Popup"), "getActive return correct value");
				equal(tau.engine.getRouter().getActive("popup"), tau.engine.getBinding(document.getElementById("externalPopup"), "Popup"), "getActive return correct value");
				equal(tau.engine.getRouter().hasActive("popup"), true, "hasActive('popup') return correct value");
				start();
			};

			document.addEventListener("popupshow", testExternalPopup, false);
			tau.openPopup("test-data/external.html");
		});

	}

	asyncTest("test not open poup without correct class", 1, function () {
		var popupElement = document.getElementById("popup");

		tau.openPopup("#popup");
		setTimeout(function () {
			ok(!popupElement.classList.contains("ui-popup-active"), "popup not open");
			start();
		}, 100);
	});
});
