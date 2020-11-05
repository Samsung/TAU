/* global tau */
(function () {
	var page = document.getElementById("open-control-app-1"),
		onpagebeforeshow = function () {
			var touchpadElement = page.querySelector(".app-4way-touchpad"),
				mediaProgress = page.querySelector(".app-media-progress input"),
				progressHandler = page.querySelector(".app-media-progress .ui-slider-handler"),
				labelMin = page.querySelector(".app-media-progress .ui-slider-label-min"),
				labelMax = page.querySelector(".app-media-progress .ui-slider-label-max"),
				ontouch = function (ev) {
					/*
					 In this place developer should implement own touch event handler
					 */
					// lock the section change event listener
					ev.stopPropagation();
					// lock the default web engine behaviour eg. scrolling
					ev.preventDefault();
				},
				onProgressTouchmove = function (ev) {
					// lock the section change event listener
					ev.stopPropagation();
				},
				onProgressInput = function () {
					progressHandler.setAttribute("data-value", toTimeString(this.value));
				},
				toTimeString = function (value) {
					return Math.floor(value / 60) + ":" +
						((value % 60 < 10) ? ("0" + value % 60) : value % 60);
				};

			tau.event.on(touchpadElement, ["touchstart", "touchmove", "touchend"], ontouch);
			tau.event.on(mediaProgress, ["touchmove"], onProgressTouchmove);
			tau.event.on(mediaProgress, ["input"], onProgressInput);

			// update slider labels
			labelMin.innerText = toTimeString(mediaProgress.min);
			labelMax.innerText = toTimeString(mediaProgress.max);
			progressHandler.setAttribute("data-value", toTimeString(mediaProgress.value));
		};

	page.addEventListener("pagebeforeshow", onpagebeforeshow);
})();

