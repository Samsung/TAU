/*global tau */
(function () {

	var page = document.getElementById("nestedsectionchangerPage"),
		vchanger = document.getElementById("vsectionchanger"),
		hchanger = document.getElementById("hsectionchanger"),
		hsectionChanger,
		vsectionChanger;

	page.addEventListener("pagebeforeshow", function () {
		// make SectionChanger object
		hsectionChanger = tau.widget.SectionChanger(hchanger, {
			circular: false,
			orientation: "horizontal",
			useBouncingEffect: true,
			items: "section.h"
		});
		// make SectionChanger object
		vsectionChanger = tau.widget.SectionChanger(vchanger, {
			circular: false,
			orientation: "vertical",
			useBouncingEffect: true
		});
	});

	page.addEventListener("pagehide", function () {
		// release object
		hsectionChanger.destroy();
		vsectionChanger.destroy();
	});

}());
