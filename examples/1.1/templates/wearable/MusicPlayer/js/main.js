(function () {
	var intervalHandle = null,
		progressValue = 0,
		playButton = null,
		coverElement = null,
		trackElement = null,
		trackId = 1,
		progressBarWidget = null;

	window.addEventListener("tizenhwkey", function (ev) {
		if (ev.keyName === "back") {
			var activePopup = document.querySelector(".ui-popup-active"),
				page = document.getElementsByClassName("ui-page-active")[0],
				pageId = page ? page.id : "";

			if (pageId === "player" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});

	function stopProgress() {
		if (intervalHandle) {
			window.clearInterval(intervalHandle);
			intervalHandle = null;
		}
	}

	function startProgress() {
		// emulation of track progress
		intervalHandle = window.setInterval(function () {
			progressBarWidget.value(progressValue);

			progressValue += 0.1;
			if (progressValue > 100) {
				progressValue = 0;
			}
		}, 100)
	}

	function change(direction) {
		pause();
		progressValue = 0;
		coverElement.classList.remove("ui-cover-" + trackId);
		trackId += direction;
		if (trackId < 1) {
			trackId = 4;
		}
		if (trackId > 4) {
			trackId = 1;
		}
		coverElement.classList.add("ui-cover-" + trackId);
		trackElement.textContent = "Track name " + trackId;
		start();
	}

	function pause() {
		playButton.classList.remove("on-play");
		playButton.classList.add("on-pause");
		stopProgress();
	}

	function start() {
		playButton.classList.remove("on-pause");
		playButton.classList.add("on-play");
		startProgress();
	}

	function onNext() {
		change(1);
	}

	function onPrev() {
		change(-1);
	}

	function onPlay() {
		if (!intervalHandle) {
			start();
		} else {
			pause();
		}
	}

	function onRotary(ev) {
		if (ev.detail.direction === "CW") {
			change(1);
		} else {
			change(-1);
		}
	}

	function init() {
		var progressBar = document.querySelector(".ui-circle-progress"),
			nextButton = document.querySelector(".ui-music-player .ui-next"),
			prevButton = document.querySelector(".ui-music-player .ui-prev");

		document.addEventListener("pageshow", function () {
			progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: "full"});
			if (tau.support.shape.circle) {
				document.addEventListener("rotarydetent", onRotary);
			}
			playButton.addEventListener("click", onPlay);
			nextButton.addEventListener("click", onNext);
			prevButton.addEventListener("click", onPrev);
		});

		document.addEventListener("pagebeforehide", function () {
			progressBarWidget.destroy();
			if (tau.support.shape.circle) {
				document.removeEventListener("rotarydetent", onRotary);
			}
			playButton.removeEventListener("click", onPlay);
			nextButton.removeEventListener("click", onNext);
			prevButton.removeEventListener("click", onPrev);
		});

		playButton = document.querySelector(".ui-music-player .ui-play");
		coverElement = document.querySelector(".ui-music-player .ui-cover");
		trackElement = document.querySelector(".ui-music-player .ui-track");
		coverElement.classList.add("ui-cover-" + trackId);
		trackElement.textContent = "Track name " + trackId;
	}

	document.addEventListener("DOMContentLoaded", init, false);

}());