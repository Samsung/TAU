/* global tau */
(function () {
	var page = document.getElementById("open-control-app-1"),
		onpagebeforeshow = function () {
			var touchpadElement = page.querySelector(".app-4way-touchpad"),
				ontouch = function (ev) {
					/*
					 In this place developer should implement own touch event handler
					 */
					// lock the section change event listener
					ev.stopPropagation();
					// lock the default web engine behaviour eg. scrolling
					ev.preventDefault();
				};

			tau.event.on(touchpadElement, ["touchstart", "touchmove", "touchend"], ontouch);
		};

	page.addEventListener("pagebeforeshow", onpagebeforeshow);
})();

