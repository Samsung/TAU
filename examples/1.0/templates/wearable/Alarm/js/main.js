( function () {
	var SwipeButton = tau.widget.SwipeButton,
		Popup = tau.widget.Popup,
		page = document.getElementById("main"),
		rejectButton = document.getElementById("reject"),
		snoozeButton = document.getElementById("snooze");

	window.addEventListener( "tizenhwkey", function( ev ) {
		if( ev.keyName === "back" ) {
			var activePopup = document.querySelector( ".ui-popup-active" ),
				page = document.getElementsByClassName( "ui-page-active" )[0],
				pageid = page ? page.id : "";

			if( pageid === "main" && !activePopup ) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	} );

	function rejectButtonSwiped() {
		var popupElement = document.getElementById("info"),
			popupContainer = popupElement.querySelector(".ui-popup-content");

		popupContainer.innerText = "Alarm is rejected!";
		Popup(popupElement).open();
	}

	function snoozeButtonSwiped() {
		var popupElement = document.getElementById("info"),
			popupContainer = popupElement.querySelector(".ui-popup-content");

		popupContainer.innerText = "Alarm is snooze!";
		Popup(popupElement).open();
	}

	/**
	 * Init function called on pagebeforeshow
	 */
	function init() {
		SwipeButton(rejectButton);
		SwipeButton(snoozeButton);

		rejectButton.addEventListener("swiped", rejectButtonSwiped, false);
		snoozeButton.addEventListener("swiped", snoozeButtonSwiped, false);
	}

	/**
	 * Function called on pagehide
	 */
	function exit() {
		rejectButton.removeEventListener("swiped", rejectButtonSwiped, false);
		snoozeButton.removeEventListener("swiped", snoozeButtonSwiped, false);

		SwipeButton(rejectButton).destroy();
		SwipeButton(snoozeButton).destroy();
	}

	page.addEventListener("pagebeforeshow", init, false);
	page.addEventListener("pagehide", exit, false);

} () );