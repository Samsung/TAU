/* global test, equal, tau */
module("API");

test("tau", function () {
	equal(typeof tau, "object", "Class tau exists");
	equal(typeof tau.firstPage, "object", "Class tau.navigator.firstPage exists");
	equal(typeof tau.changePage, "function", "Class tau.navigator.changePage exists");
	equal(typeof tau.back, "function", "Class tau.navigator.back exists");
	equal(typeof tau.initializePage, "function", "Class tau.navigator.initializePage exists");
	equal(typeof tau.pageContainer, "object", "Class tau.navigator.pageContainer exists");
	equal(typeof tau.openPopup, "function", "Class tau.navigator.openPopup exists");
	equal(typeof tau.closePopup, "function", "Class tau.navigator.closePopup exists");
});