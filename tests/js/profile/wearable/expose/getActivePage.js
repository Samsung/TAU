module("profile/wearable/expose", {});

asyncTest("ns.expose", function () {
	document.addEventListener("pageshow", function () {
		equal(typeof tau.getActivePage, "function", 'tau.getActivePage is function');
		equal(tau.getActivePage(), document.getElementById("first"), 'tau.getActivePage return correct HTMLElement');
		start();
	}, true);

	tau.engine.run();
});

