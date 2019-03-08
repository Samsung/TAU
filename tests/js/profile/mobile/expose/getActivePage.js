module("profile/mobile/expose", {});

test("getActivePage", function () {
	equal(typeof tau.getActivePage, "function", 'tau.getActivePage is function');
	equal(tau.getActivePage(), document.getElementById("first"), 'tau.getActivePage return correct HTMLElement');
});
