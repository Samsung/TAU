( function () {
	var SCROLL_STEP = 50,
		page = document.getElementById("main");

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

	/* Rotary event handler */
	function rotaryEventHandler(e) {
		var scroller = document.querySelector(".ui-scroller"),
			direction = e.detail.direction;

		if (direction === "CW") {
			/* Right direction */
			scroller.scrollTop += SCROLL_STEP;
		} else {
			/* Left direction */
			scroller.scrollTop -= SCROLL_STEP;
		}
	};

	/**
	 * Init function called on pagebeforeshow
	 */
	function init() {
		var scroller = document.querySelector(".ui-scroller");

		if (scroller) {
			scroller.setAttribute("tizen-circular-scrollbar", "");
		}

		/* Register the rotary event */
		document.addEventListener("rotarydetent", rotaryEventHandler, false);
	}

	/**
	 * Function called on pagehide
	 */
	function exit() {
		/* Unregister the rotary event */
		document.removeEventListener("rotarydetent", rotaryEventHandler, false);
	}

	page.addEventListener("pagebeforeshow", init, false);
	page.addEventListener("pagehide", exit, false);

} () );