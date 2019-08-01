( function () {
	window.addEventListener( "tizenhwkey", function( ev ) {
		if( ev.keyName === "back" ) {
			var activePopup = document.querySelector( ".ui-popup-active" ),
				page = document.getElementsByClassName( "ui-page-active" )[0],
				pageid = page ? page.id : "";

			if( pageid === "recorder" && !activePopup ) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	} );
} () );


( function () {
	var floor = Math.floor,
		page = document.getElementById("recorder"),
		timeElement = document.getElementById("time"),
		progressValue = 1,
		interval;

	/**
	 * Setting label with time
	 *
	 * @param [number] time Time in seconds
	 */
	function setTime(time) {
		var min = floor(time / 60),
			sec = time - min * 60;

		if (sec < 10) {
			timeElement.innerText = min + ":0" + sec;
		} else {
			timeElement.innerText = min + ":" + sec;
		}
	}

	/**
	 * Setting interval for progress bar, which
	 * emulates recording and its progress.
	 * @param clear
	 */
	function setupInterval(button, clear) {
		var buttonClasses = button.classList;

		if (interval) {
			window.clearInterval(interval);
			if (clear) {
				progressValue = 1;
			}
		}

		if (buttonClasses.contains("active")) {
			// emualtion of recording progress
			interval = window.setInterval(function () {
				progressBarWidget.value(progressValue);
				setTime(progressValue);

				progressValue += 1;
				if (progressValue > 300) {
					progressValue = 1;
				}
			}, 1000);
		}
	}

	/**
	 * Handler for click event
	 * The appearance of button and progress will be changed.
	 * @param event
	 */
	function recordButtonClick(event) {
		var buttonClasses = event.target.classList;

		buttonClasses.toggle("active");
		setupInterval(event.target, true);
	}

	/**
	 * Init function called on pagebeforeshow
	 */
	function init() {
		var progressBar = page.querySelector(".ui-circle-progress"),
			recordButton = document.getElementById("record"),
			pauseButton = document.getElementById("pause");

		progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: "full"});

		recordButton.addEventListener("click", recordButtonClick, false);
	}

	/**
	 * Function called on pagehide
	 */
	function exit() {
		var recordButton = document.getElementById("record"),
			pauseButton = document.getElementById("pause");

		if (interval) {
			window.clearInterval(interval);
		}

		recordButton.addEventListener("click", recordButtonClick, false);
	}

	page.addEventListener("pagebeforeshow", init, false);
	page.addEventListener("pagehide", exit, false);

} () );